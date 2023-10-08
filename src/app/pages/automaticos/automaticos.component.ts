import { Component, OnInit } from '@angular/core';

import { AutomaticosService } from '../../services/automaticos.service';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from '../../services/encriptado.service';

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';


pdfMake.vfs = pdfFonts.pdfMake.vfs

import { claves } from './ayuda';

import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, onValue, update, push } from 'firebase/database';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ExporterService } from 'src/app/services/exporter.service';

import { app } from "../../../environments/environment";
import Swal from 'sweetalert2';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-automaticos',
  templateUrl: './automaticos.component.html',
  styleUrls: ['./automaticos.component.css']
})
export class AutomaticosComponent implements OnInit {
  
  constructor(private _automaticos: AutomaticosService, private _encript: EncriptadoService, private _publicos: ServiciosPublicosService,
    private _security:EncriptadoService, public _router: Router, public _location: Location,private _pdfRecepcion: PdfRecepcionService,
    private _sucursales: SucursalesService, private _clientes: ClientesService, private _vehiculos: VehiculosService, 
    private formBuilder: FormBuilder, private _servicios: ServiciosService, private _exporter:ExporterService,

    ) {   }
  
  _sucursal:string
  _rol:string
  paquetes_arr:any[] = []

   
  
   campos = [
    {ruta_observacion: 'clientes', nombre:'claves_clientes'},
    {ruta_observacion: 'vehiculos', nombre:'claves_vehiculos'},
    {ruta_observacion: 'recepciones', nombre:'claves_recepciones'},
    {ruta_observacion: 'cotizaciones', nombre:'claves_cotizaciones'},
    {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'},
    {ruta_observacion: 'historial_gastos_operacion', nombre:'claves_historial_gastos_operacion'},
    {ruta_observacion: 'historial_gastos_orden', nombre:'claves_historial_gastos_orden'},
    {ruta_observacion: 'historial_pagos_orden', nombre:'claves_historial_pagos_orden'},
    // {ruta_observacion: 'sucursales', nombre:'claves_sucursales'},
  ]

  busqueda:any = {ruta_observacion: 'clientes', nombre:'claves_clientes'}
  contador_observados: number = 8
  contador_recorridos:number = 0
  informar_cliente_termino: boolean = false
  ngOnInit(): void {
    this.rol()
    this.carga_data_espere()
  }
  carga_data_espere(){
    let timerInterval
      Swal.fire({
        title: 'Cargando data',
        html: 'Espere ...',
        timer: 3000,
        // timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      }).then((result) => {
        /* Read more about handling dismissals below */
        // if (result.dismiss === Swal.DismissReason.timer) {
        //   console.log('I was closed by the timer')
        // }
      })
  }
  
  
  rol(){
    const { rol, sucursal, usuario } = this._security.usuarioRol()
    this._sucursal = sucursal
    // this.cache_tiempo_real()
    this.vigila_nodos()
  }
  async cache_tiempo_real(){
    
    this.campos.forEach(async (g)=>{
      const {ruta_observacion, nombre} = g
      const real = await this._automaticos.consulta_ruta(ruta_observacion)
      this._security.guarda_informacion({nombre: ruta_observacion, data: real})
      this._security.guarda_informacion({nombre, data: Object.keys(real)})
      console.log(this._publicos.saber_pesos(real));
      
    })
    
  }

  async obtener_informacion_cache(){
    
    const {ruta_observacion, nombre} = this.busqueda
    console.log({ruta_observacion, nombre});
    const data_claves = await this._publicos.revisar_cache2(ruta_observacion)
    console.log(this._publicos.saber_pesos(data_claves));
    console.log(data_claves);
      
    const claves_keys = await this._publicos.revisar_cache2(nombre)
    // console.log(claves_keys);
    console.log(this._publicos.saber_pesos(claves_keys));

    let nuesdg = [...claves_keys]
    const inicio = nuesdg.length -5
    const final = nuesdg.length

    let ultimos_5 = []

    for (let index = inicio; index < final; index++) {
      ultimos_5.push(nuesdg[index])
    }
    console.log(`Totales ${nuesdg.length}`);
    
    console.log(`Ultimos 5 registros encontrados en ${nombre} `,ultimos_5);
    

    
    

}
 async faltantes(){

  const {ruta_observacion, nombre} = this.busqueda
  const data_claves_faltantes = this._publicos.revisar_cache2(`faltantes_${nombre}`)

  const data_actuales = this._publicos.revisar_cache2(ruta_observacion)
  
  let nuevo_arreglo_faltantes = this._publicos.crear_new_object(data_claves_faltantes)

  let entradas = [...nuevo_arreglo_faltantes]

  
  // console.log(nuevo_arreglo_faltantes);

  if (entradas.length) {
    //TODO: agregar informacion
  this.obtenerInformacionDeClientes(data_claves_faltantes, ruta_observacion)
  .then(async (resultados_promesa) => {
        let aclarados =[...nuevo_arreglo_faltantes]
        const resultados_arr = Object.keys(resultados_promesa)
        const resultado = eliminarElementosRepetidos(nuevo_arreglo_faltantes, resultados_arr);
        // console.log(resultado);
        
        // console.log({...data_actuales, ...resultados_promesa });
        this._security.guarda_informacion({nombre: ruta_observacion, data: {...data_actuales, ...resultados_promesa } })
        this._security.guarda_informacion({nombre:`faltantes_${nombre}`, data: resultado})
  })

  }else{
    console.log('ninguna accion realizadas');
    
  }


  
}
vigila_nodos(){
  this.campos.forEach(async (g)=>{
    this.vigila_nodo_principal(g)
  })
}
  async vigila_nodo_principal(data){

    
    const {nombre, ruta_observacion} = data

    // this.simular_observacion_informacion_firebase_nombre(this.busqueda)
    console.log({nombre, ruta_observacion});


    // const en_cloud = this._publicos.revisar_cache2(nombre)
    // const claves_supervisa = await this._automaticos.consulta_ruta(nombre)
    const en_cloud =[
    "-NE31rH-xDj6Jv5hM7Jp",
    "-NEvKXhoNvvx0TcHnDkZ",
    "-NEvOREdSxX4vBkd9asE",
    "-NFVB-LASl4wBCkOcmmu",
    "-NFp1szdczrEHN9dLSrn",
    "-NG2LstV0NhaJkHH6ro-",
    "-NG2OFF3PawaJ32u9cXt",
    "-NG3I1mPDTSJ35T5ZlJ7",
    "-NGTTTw5ZDgkt3aJcB6n",
    "-NI3JfKMPyqUkZ6GBi9D",
    "-NI8J3w_wd0HDj3-gYoA",
    "-NIEnZDqROJh4YzpfeX2",
    "-NIrGdXj5MSZQFwL08XF",
    "-NJD-27P-Ip0uccz77h1",
    "-NJGOM0kuATAqPGHQhTp",
    "-NJLECSlFg3htMWnVJCk",
    "-NJQOaVswPrU7ny27I5u",
    "-NJW7znp2728xa0fSp1_",
    "-NK-DDkbEZy70IfwWWDu",
    "-NKGdwfggl-iKF3VAJO4",
    "-NKJj9aGGxoDVpZhbBmN",
    "-NKUKToT-odu35eKCucG",
    "-NKUp1xLKMOKSSJJXTn2",
    "-NL2-dAoam5XZLitUaaA",
    "-NL2P7b6rR04wT_ziPKs",
    "-NLNVqIM3HlWwdYY4Vkj",
    "-NLRhhoHEmZzs36LQyO-",
    "-NLS512d_ACSLeFE5r02",
    "-NLSGFfH8ide4cUHFj5t",
    "-NLSJqiLdov_8LgUbzmJ",
    "-NLSMGiF8lHzmTWX3sh3",
    "-NLcE0c8GTpe9BHqzCl9",
    "-NM-9BhwSNia8VZfrU8Q",
    "-NM4jIL5OQTi-SIzHEPu",
    "-NMA7CZDha0eLCv5FxtS",
    "-NMEe2rTeyELxxFkfHAN",
    "-NMFEF5vUnTEVJJCu18x",
    "-NMU3XwwkrRxJ59Tuf_8",
    "-NMVhbvvR8NX-Ph4aaxv",
    "-NMVmWPPwsDkW64EvmLQ",
    "-NMZ_KvjfiOlv62X5X93",
    "-NMZu-FV2AueR54KJb6e",
    "-NMZuV0sctpxLtuqMTFT",
    "-NM_Kkgp7-FdPVAY1PW0",
    "-NM_QGVqsdeIN7Heen0m",
    "-NM_thj7nNakz10a8nnM",
    "-NMdug34tnQhu-bOJiKj",
    "-NMeExYcAnDjvlpCDWuQ",
    "-NMidpyPu8Cb9fVvE9GM",
    "-NMjffgq9k83cuQmvTKu",
    "-NMo-knIjeoPxVaRNXH7",
    "-NMt1kbR4iK-Gkg4b0qF",
    "-NMtLwj60Wtky18SClna",
    "-NN2B7t8ainyEAPA_yta",
    "-NN2b8V1RrfMfscvdeZA",
    "-NN2bJusAlZ4o44_m6d8",
    "-NN8LHsaFg-EFQ-inzEy",
    "-NN8UHDOo-rcxHoak7zo",
    "-NN8Xp5eh6s0dXZg4o7L",
    "-NN8_QarszCpF7XdwKsp",
    "-NN8z7sNVXsZUwed6nVZ",
    "-NN8zq1K2QnBp7RIwtq2",
    "-NNHb780Eae4Sd1LSSQY",
    "-NNHvZZjgy4J-eXO977O",
    "-NNI_E-2mO3LJLWe0zT6",
    "-NNIeMuKNt93bflb9_1c",
    "-NNJ44KxXwX5ybn8Smlm",
    "-NNJDCuLY56cJhP8XI2F",
    "-NNO9jLDS6a0yX44kaDN",
    "-NNhpZ0V-gw-ycrQoEqn",
    "-NNhrsTiYRg_Xk_D96LR",
    "-NNhtqCgOuCU3tOL3Cok",
    "-NNlk5lfbG120tHa6mpr",
    "-NNlpaGDuy0e1L90IgIs",
    "-NNmDaHVuNvtBCxZyU3l",
    "-NNmE4BLF-iyON17oNCq",
    "-NNmkK1O9ztLeyajc51j",
    "-NNspFTia9L_UvkASLFL",
    "-NNw7-7lu1dfKE3ZgISF",
    "-NO0-sS-pDMa5bQvR_Y0",
    "-NOAG88cjUArkd-KBRxb",
    "-NOGpV-4C-GQNXvDfYud",
    "-NOKT1A_o3p8fZ9TGzct",
    "-NOK_-lIuYdZjnfwObya",
    "-NOL-NjyXeEGSwm6ir0s",
    "-NOLscckxnpg2PrC_pkW",
    "-NOM7Io03_oOmmDTgATJ",
    "-NOMKH4jWHhUoiCubtVf",
    "-NON-uKUoBL3mmXMfyLr",
    "-NOPP8lc-cXkkugI9vhc",
    "-NOPZRF78IxgehLl5ub5",
    "-NOQiDcsTX-EPGQjuWMk",
    "-NOR2o6yqHF--LGUUX4c",
    "-NOR4nXPhzXfnr0GT0WD",
    "-NOUxdqS-78L5GWb018g",
    "-NOVAzO6qH61PDqK-FZD",
    "-NO_UVrGfsXo7G-fT_aw",
    "-NOpkYGEJczvxN2pTntX",
    "-NOv8xtRUKI0nNFNn8bv",
    "-NOypGMBcfQoUp9TDDON",
    "-NOz-Hhs6ycWNl_YENR3",
    "-NOzmJNsnW1c_vbi21Fk",
    "-NP-R4ryaUMsFnOlleF2",
    "-NP2rxjy3eIxWgRqmcOe",
    "-NP2uql6hw1p_VygT0jt",
    "-NP34QxkpelPMhSmhMZc",
    "-NP35DJByn-5NvyP3efM",
    "-NP8gdMatE2bnCAprfWe",
    "-NP8hUfyDg2e0tKoVs8s",
    "-NP8ig4qmwOCiYrnq4Pm",
    "-NPNm-FzOi8o4_kNK6Xp",
    "-NPO-E8aEFK2DbYrmtnd",
    "-NPU1Ll-xpVK6bLwpJIw",
    "-NPZCwpGia-hgQ5MfNp_",
    "-NPdhgVa3J4YhtY7XswX",
    "-NPxbrDp-KvAfzLHn4lo",
    "-NQ2FuiTdWW4VDaaoMxg",
    "-NQ6_clm9jgINu_gkmj2",
    "-NQAruiYE64gyTyktnSI",
    "-NQBAodVkA5Z9_JIFoNh",
    "-NQBDRcauOL2tj2n7QpF",
    "-NQBU6TfyYPeNmP87q2O",
    "-NQCbqyYySvnPBdwjH_e",
    "-NQQknx6ZGpBgzOU_5B-",
    "-NQRZO74-1z2FRZhRNBi",
    "-NQaGBYAYu_NRJj9efAU",
    "-NQaTvcrnUCpkYE3RU7n",
    "-NQbCWtfliTctI_eJqXC",
    "-NQekjBJN2KYHoYf0-j-",
    "-NQenFQcNhNUJgjnigXP",
    "-NQeyObJtVBBNTTRWuS4",
    "-NQfRL5fiA8tQlI1mxbi",
    "-NQflfvxKswYdwilIwLR",
    "-NQgAgmAXe7P7GVPeHtw",
    "-NQkFCPhYVbsc2C6KqTt",
    "-NQkoIsr-k5XvYK9Obbv",
    "-NQl5QLyDnhoCziDnGfC",
    "-NR3vGUDnOgaNnSEa4xE",
    "-NR4lPXzCD6FBYP9r4TR",
    "-NR5gCipmzeLlQQok48C",
    "-NR9EaYv9qv6vR6Gys8Z",
    "-NR9es11RSd7_SXx0RmA",
    "-NR9vBTtZpwlXX_b00Oo",
    "-NRG3Z_KHvEF0DvWQi4u",
    "-NRG6o7VZlWg9-CFipIU",
    "-NRJlQ9F9kHO92frHG_3",
    "-NRL0m0-GIS6KQdkPI7p",
    "-NRL2HqpVWvN5Ydmr_vn",
    "-NROK0Uz6ln7SRZWkbo6",
    "-NROeqbb9u6Pus5216Ou",
    "-NROgFxR38_1hTZyMK40",
    "-NRYZTij41PWHI-yvb3h",
    "-NRYbcOQqLPbyzyR4S2U",
    "-NRZHcUIcb_VrdDmvDcg",
    "-NRZqlMqo0fxVbxXWQPK",
    "-NRZztPUCC9UnUYD_9bM",
    "-NR_qsDNYkz4j3EgWRN0",
    "-NR_sym13O8LuemK6TPq",
    "-NRc_Wlp5S-Vh-sbtYxa",
    "-NRd7Dvn0Pr71k6C7JaN",
    "-NRhjsa3pbgLvkW23pcw",
    "-NRiPs494DzeNa0QixXJ",
    "-NRiZ1osDLC2MqOVO71q",
    "-NRix5SUjxUmGURH0dCF",
    "-NRj1lOqtqx4adskINOa",
    "-NRnvbd-CbgKCzQqwySt",
    "-NRsW9qNLbTK12oHcGbl",
    "-NRt92FdPwqNfVfQ8lPe",
    "-NRxe-NCF6K6GA5LRYsu",
    "-NS76zrhzYRzl0s3MAXK",
    "-NS7TijMzgN53Vx6zfDz",
    "-NSRXAOmoKOnnR7dZq7i",
    "-NSRbGF1HJn1VsSUuvm8",
    "-NSgw6NlC8Jfh-PWLA3-",
    "-NShVTpPtVrDaH5us2L2",
    "-NSlAuGVWHdIBPocMfqT",
    "-NSlSnoANSYqrFUIgIvO",
    "-NTEsDw1hRv5w80K5Zq1",
    "-NTFgVnBiQ1JkEDvWq8R",
    "-NTKH6ctycScGF_ubpXZ",
    "-NTKUIzo32losSc4XGb7",
    "-NTKgEQGBv5bxA_a2ell",
    "-NTLUBbg3DrbeL3SQfOU",
    "-NTLWIM3aVY00yY8Z0eq",
    "-NTV1Sm3HbKGa-SOINrw",
    "-NTV597Vh0HP96dklfN0",
    "-NTZsjY1VZc4Lae7mC65",
    "-NTaM8CeLWSELqH9Crmg",
    "-NTnduYoMt1iRo-cZpMg",
    "-NToKyrru9_Nufbig2M1",
    "-NTt51VeGtR_vjDhVjk8",
    "-NTuazyC-MxpdUOgyAyd",
    "-NU31lPeKrcflFbh56wZ",
    "-NU37DBpEi21okjloguV",
    "-NU49Y07LNOVCrwPoWWV",
    "-NU9cMt_IOSrKaurv7a2",
    "-NUD3cbV79M6OCbX2uOz",
    "-NUS5EfvytDQOuTxdIwS",
    "-NUTFSMOqnOHu4otpobx",
    "-NUTPJ1_We4Bt2EFprND",
    "-NUTjyKlbnTU1OUCCHCh",
    "-NUTohoTPQCCVhkjC8mY",
    "-NUXHl0ewTKtoAYnPwxh",
    "-NUcguMk5fFLefRJJU08",
    "-NUclWTcYIxnLvp6sYzp",
    "-NUgSvqVpgV4v7Op3Z-Q",
    "-NUmS-yJ2kJ4Y59u1i9i",
    "-NUxHC6mEWpyWXf15XfE",
    "-NUxKEarVMIne0IJnWf1",
    "-NUxtOuMpcn6duocm2yr",
    "-NV10NztLjbRU3AovTI3",
    "-NV12VfruMK3TP3PpHQL",
    "-NV1R7SG2TB0t9V0smS7",
    "-NV1XiblK9Nq9EVmztJW",
    "-NV5iRkAiNieP1h5KYPs",
    "-NV6L4IyVYPCvv7oNSFW",
    "-NVA_3SwzexmHji_K9wt",
    "-NVCT59W4blwt9IQI2_d",
    "-NVKtZ78jvxGYGAjz6N7",
    "-NVVawxSqOICTS6x5ZxZ",
    "-NVVcDTNrkjt932k5W0p",
    "-NVWv4V24jhuLVUhlrDF",
    "-NVbX9jucosE7c28VAGL",
    "-NVea1mExeMIwxy0qW13",
    "-NVevKJncR_EPEes427L",
    "-NVexmmzf0Je709YHG0u",
    "-NVfQdXZWDJ2H1NuvheN",
    "-NVfVahtFqazzVH_blnM",
    "-NVjzNgpofVJlCZCdttb",
    "-NVkSV57EShiAutn20Qm",
    "-NVq0ETH2ESXQBpcsyuP",
    "-NWIf4gQB_96MkvJwxvo",
    "-NWIk0ElbAcAyWZmhn1m",
    "-NWK-F6BtFjONI2B0sw6",
    "-NWOQXCjgDaY_XLC_4W2",
    "-NWTH_FDvjOcrQtq7jjJ",
    "-NWTHsAgTtYZuSA8o2qG",
    "-NWdF7EPq9tf6duayk98",
    "-NWdFDUGAtupxBQpZqAR",
    "-NWdGvnHt2G-jZ6K34i2",
    "-NWdH5V1jzD5TbbIeoee",
    "-NWdbMaqkQyGRc3qk6FS",
    "-NWe-oduarfrKfsPL47v",
    "-NWi_q0BV_mnEwB1eACX",
    "-NWnY0F0CK3n2XSii8gl",
    "-NWnf6MH-0P-q3jXEKfv",
    "-NWoNIflh_7eTufI3G5d",
    "-NWoOcNhX7--rnIBI_Z7",
    "-NWregf2Qy77W8HOHMdv",
    "-NWt1I23hRWXUqQadulq",
    "-NX12LrWU8oYNC6ZWh7A",
    "-NXHMjcmPsmH5C6FB-8Y",
    "-NXMBqR1j0BQQadteyYe",
    "-NXMS4hSJR-1zdvs0RYy",
    "-NXR2-6PjSzC8ntLbKYD",
    "-NXRBpSUypFfutMr0aYl",
    "-NXRKGQLEsq_25hBiwkd",
    "-NXRcr9mZtsaB-tFkOmG",
    "-NXWL1EL1Jw9gtC_ou_p",
    "-NXk-hhuUgbH3wYAEbEj",
    "-NXkNEIE1_TW2HlLtaLh",
    "-NXkNI1j7gyhOdcnqxJA",
    "-NXkSM6U1AztDpF2xzoy",
    "-NXps78TGDxkDQaohKSB",
    "-NXqEUJ5jfyhx4vZ0bYi",
    "-NXued58_sKbqCiCqdXI",
    "-NXuoU-rqNOojxsukL-p",
    "-NXuyphWehJ1tUw2r3vy",
    "-NXvD5ehEPibA2IUp3id",
    "-NXvH9rAzu19FUQpRTdS",
    "-NXvKuDguE0jOQQh8ZLA",
    "-NXvX6Ccma6nQ1nTrYNl",
    "-NXzjFtLT1v9i-JSYKyG",
    "-NY--0ewNFfB8B6lCtff",
    "-NY-5BeAFPuyROdAzvTQ",
    "-NY-PjT_wWrtiWkSuoXt",
    "-NY-g45aEY2625_Aili7",
    "-NY3qBu9gy9h3lXIZMI-",
    "-NY42bYIeVHd1AT-38yF",
    "-NY4GCxcDlZRoAvKpkk6",
    "-NY4RXCXMffU7J8gOiHc",
    "-NY4kWOaddGcbdsKw3MI",
    "-NY4lThFX4PlcfDyaRoZ",
    "-NY9GhlJPah2TVJkyvrP",
    "-NY9lMggDA3ff0eLsAgP",
    "-NY9tr-SXy0gSMGwIBiN",
    "-NYJjAyDnQfNhEJzP9Yn",
    "-NYJljpJNcTz69AmXwZA",
    "-NYKL1AWtetkg6OuQ1mn",
    "-NYPnc4xMgE-tKa5ZPzD",
    "-NYPqXlfz-pE3NQkq3gY",
    "-NYTcfIANkIhfFodUWes",
    "-NYZ06Ch1-2v0ahBmjpq",
    "-NYZ8g2Q25nB_iHurPjf",
    "-NY_UJjMb45203H-SyOf",
    "-NY_hcgG8ZW8B0PwqVsO",
    "-NYd5eqiK4xHrjJzez6q",
    "-NYde7XLPGnL4fFfYyHB",
    "-NYdnECjp2t74YQheVmS",
    "-NYe5ieMTIukfzZTCpXS",
    "-NYeDPIufFh5xEDYYQnW",
    "-NYhlpyjnGudOP2FhAyR",
    "-NYsu4Dmh4VozshgiQ-q",
    "-NYsvscGgbKel37ryuXD",
    "-NYt08Nav1zH-DUHqTlR",
    "-NYxbYyCvrWKtDlLrLsR",
    "-NYz2A_K3IEmVxdzoi5l",
    "-NZ36veTMDPH8M3zbl4w",
    "-NZ6YyXeAjxLotvCb_j7",
    "-NZCWDdJqDM37CceIiiK",
    "-NZGxNaimX5QDXt1G5Tb",
    "-NZGzq3PwYeaR_HuxRIE",
    "-NZRYSKlJOYzdrQGlinK",
    "-NZSe1IM1qphMVDwk-cu",
    "-NZWWfQypBUvPfn2i3E2",
    "-NZXPKIk-dBgxf6rE5I5",
    "-NZbrs8SUU0UVZCor6Ie",
    "-NZfdW_WKCSpw9HnfTgQ",
    "-NZmDxRavrax6Y5ZIRrj",
    "-N_-xvbmKvm6vz9ReSYc",
    "-N_4ZsHYym3Rcic8HHtG",
    "-N_649_Gv_OzcxGNFS95",
    "-N_6ACxYp4ELPvN7P0J4",
    "-N_6AsqXrw_0xoiNFjsy",
    "-N_6DTO0p9WAtZ8HzH7C",
    "-N_6MUrs8um6okwPj7Ph",
    "-N_9Q0UJ2oUNS_Ia9Axw",
    "-N_9s_2vFAJfOoPbuh-1",
    "-N_ACY8AF0TmvvHnGOb3",
    "-N_EytcmG6_2k9xgCxWl",
    "-N_FQPZbcEwMa3lZWM2O",
    "-N_G4JFTKuHMwzXOW0X2",
    "-N_K8B_P4CWPq9uxI2pR",
    "-N_KTzf2KPgOOK2MM4lY",
    "-N_PFDzRTZAsn7flpqqD",
    "-N_Z_4Q9n8p2gPmSha8e",
    "-N_ZuzU9W4sOZQkZBF40",
    "-N__QbkJzHka0KOgMDGp",
    "-N__Wqu5_sQTZMSCuvfX",
    "-N_do2YZ_tnJKITxtiYa",
    "-N_eijcehqTkXYscm01S",
    "-N_fiIPQMwU70qPvzgDX",
    "-N_jqTVXrXfbNmBAPK_O",
    "-N_kJ3t9C0sS46ZHadet",
    "-N_kUrNTjlFlMiS2Motr",
    "-N_o6DMGLbNyVz6FaiUJ",
    "-N_pLOBzMxdOhc98fixt",
    "-N_pW_Vv0mMM-mhnxDk8",
    "-N_uVw5lvqybECMro2Xo",
    "-Na916vU1przLG2Yi_Zt",
    "-NaDEObucm2uHXHbN_pr",
    "-NaEYa1me0c2AfTXJChD",
    "-NaIG4HLSgfNJgHj_mbw",
    "-NaNJxfbSdzaF_djoffo",
    "-NaNxUqgXHFjp9XQvIHL",
    "-NaOEx4nllp-kxQAmXK3",
    "-NaRvYwoQaPDzJiKkZDC",
    "-NaXTKF5gJGIVxMIg-td",
    "-Nah81czgpA6F7jQNRwM",
    "-Nai5G7NGoSjhWgS-of9",
    "-NaiaLqfq_3h3SqeHVKd",
    "-NamCopHUZBzif-300fC",
    "-NamJ2vx8GCmo-f4QGAW",
    "-NarLzZzwKQsdQKnmGCS",
    "-NasbJIkOtmGIOwwdiU9",
    "-NawxjuZLb50IG4fX5Qu",
    "-Nb0-Ralq2-qNR9BqoLG",
    "-Nb0e6VeHbADNz9STKwN",
    "-Nb0jaH9il5dcwmJ1rc_",
    "-NbUqc8m-eD3q1UYUh4S",
    "-NbVhLVXzmDtWzS8W2fI",
    "-NbVkMac6hZvSZqPM2dF",
    "-NbVrKPxqkOPFL3QZAJW",
    "-NbW5xG6w6J_T0iIouZT",
    "-Nb_6aUDeL0SsGdO22kC",
    "-Nb_UMl1bW3qtZyKdMP-",
    "-Nb_ne6hEXKCYVcKb752",
    "-Nb_yIYHmkLMNyD1NatW",
    "-NbaWw93aswng67aU92_",
    "-NbofBHoB3tdmLRLTVcf",
    "-Nbpt-reM4CHJLg1dMix",
    "-NbzmmKFij9X6M0g7VPF",
    "-Nc-B8ybIEA_7WR9UnmL",
    "-Nc-QNMIDt289q0vt3VM",
    "-Nc3BBef77bWlRds_Ojz",
    "-Nc3LHn1sVVu7c3d1Xp8",
    "-Nc3OOgH4a5lKc9evPjI",
    "-Nc8INZugZLUtkM2YRfs",
    "-Nc9bktWZAX7SUu_S-oM",
    "-NcDLkyruXEL0MapCUuw",
    "-NcO-oIsGuB17C3Y1GPg",
    "-NcO4ZB-qM_P89AjKhye",
    "-NcOtjCORQvHxBV-QRru",
    "-NcTQECGCOYQTFJBNfx9",
    "-NcUANwAUm12HuuOj3a6",
    "-NcUHB06k7uicGWDnmn-",
    "-NcUKZ_Z9Gj0KvLojdy2",
    "-NcUYbIjnRB1J9DqL0QM",
    "-NcUd0VTivVE69jUMa_h",
    "-NcUphE3iTlMwvB7SdjH",
    "-NcYk49PQ-iocdK0lp2x",
    "-NcYzhWsa5B5liyme0-Z",
    "-NcZONjCxHIJFMVwdD13",
    "-Ncbu7I3xj4f0TnGnqTC",
    "-Ncbvu4PSsEQYjPwwSZD",
    "-NcbxzXnTByABmhh-NVc",
    "-Ncc-HD789GIzZchhBlC",
    "-Nchs2iTynKLnucndHCh",
    "-Nci2BTFzadQjcxJf6gx",
    "-Ncmg9SiGPG6UtXoAQEO",
    "-NcwnhijXE06X_Qz_5KH",
    "-NcyPw1W3on9ze34lQSd",
    "-Ncy_Bez31-iKSBWb9Rl",
    "-Nd0emjUCO2mNthTv5b0",
    "-Nd10cZ-UgjxcCjzY6bd",
    "-Nd75QA9VVOB2BaPCEXY",
    "-NdGuaGVygU9LbG1l0aw",
    "-NdLv95jObZMONZLW59S",
    "-NdLvyG4aw4QJHnS0XGe",
    "-NdM2tPjAFH4OCBg29XI",
    "-NdVmQbQDkvdN_EWCRbn",
    "-Nda704uwklpcoSeEedD",
    "-NdkVvW5EAYrAb0UwL2K",
    "-Ndkb33zd94saoSXyxJd",
    "-NdlI2rcEamh8Lq9TvH2",
    "-NdqX_6rm5MPMrE8ToW0",
    "-NduK3vX8ZLtwAJpOss6",
    "-NdueHaofyIn9X2Ocnpi",
    "-Ne4YK0DUmsW9y8AWvVP",
    "-Ne57q4ci2p3XQNA50ul",
    "-Ne5iWwA_HUq3wGqB-ux",
    "-NeEedkEePcs-739rkMG",
    "-NeFANMrNMUGQ0Eh4H9s",
    "-NeKtMU7Z6ZK8p6Kug3a",
    "-NeLPhUzDF3ImDBGc58q",
    "-NeLT0iYgJ33bqnES926",
    "-NedPCWIiEANZP44f8eD",
    "-NedxfVR5JIyoNWuf8S7",
    "-NeeGQqn8dzxyDFf7f6X",
    "-NeekzgvHBHAnRgY7M-A",
    "-Ng19B6FJo_vbmj7OxAs",
    "-Ng20gqoyZxtWzfjehPZ",
    "-Ng2DvxLeBpVocgpZ266",
    "-Ng2HmobEhJbbsk9vXU4",
    "-NgAqlb84g6_ahgzmIsp",
    "-NgAwOvL4jblwgzwMm3N"
]
    // console.log(this._publicos.saber_pesos(en_cloud));
    
    const en_local = this._publicos.nueva_revision_cache(nombre)
    // console.log(this._publicos.saber_pesos(en_local));

    let resultados_real_time = [...en_cloud]
    let resultados_en_local = [...en_local]

    // console.log(resultados_real_time);
    
    // console.log(resultados_en_local);

    const valorNoDuplicado = await [...new Set([...resultados_real_time, ...resultados_en_local])];

    // console.log(this._publicos.saber_pesos(valorNoDuplicado));

    function arrayAObjeto(arr, valorInicial) {
      const objeto = {};
      for (const elemento of arr) {
        objeto[elemento] = valorInicial !== undefined ? valorInicial : null;
      }
      return objeto;
    }

    const miObjeto = arrayAObjeto(valorNoDuplicado,{});

    // console.log(miObjeto);
    

    const vigila_claves_cloud = ref(db, `${nombre}`);
    
    onChildAdded(vigila_claves_cloud, async (data) => {
      const valor = data.val();
      // console.log('clave que verifica su agregacion: ',valor);
      
      if (!miObjeto[valor]) {
        // console.log(valor);
        console.log('NO_LOCAL_HOST ==>', valor);

        let locales_nuevas = this._publicos.nueva_revision_cache(nombre)
        let resultados_en_local_nuevas = [...locales_nuevas]
        const valorNoDuplicado = [...new Set([...resultados_en_local_nuevas, valor])];
        this._security.guarda_informacion({nombre, data: valorNoDuplicado})
        this.nueva_verificacion_informacion_claves_nombre({ruta_observacion,bruto_arr: valorNoDuplicado})
      }
        
    })

    this.nueva_verificacion_informacion_claves_nombre({ruta_observacion,bruto_arr: valorNoDuplicado})


  }
  nueva_verificacion_informacion_claves_nombre(data){
    const {ruta_observacion, bruto_arr }= data
    let resultados = [...new Set([...bruto_arr])];

    let faltantes = []
    const actuales_nombres = this._publicos.nueva_revision_cache(ruta_observacion)
    // console.log(actuales_nombres);
    
    resultados.forEach((clave_vigilar) => {
      const commentsRef = ref(db, `${ruta_observacion}/${clave_vigilar}`);
      onChildChanged(commentsRef, async (data) => {
        const valor =  data.val()
        const key = data.key
        console.log(`actualizacion ${key}: ${valor}`);
        console.log(`Se descargo`, this._publicos.saber_pesos(data));

        const localhost_nombre = await this._publicos.revisar_cache2(ruta_observacion)

        if (localhost_nombre[clave_vigilar]) {
          const nueva_data_clave = this._publicos.crear_new_object(localhost_nombre[clave_vigilar])
          nueva_data_clave[key] = valor
          localhost_nombre[clave_vigilar] = nueva_data_clave
          this._security.guarda_informacion({nombre: ruta_observacion, data: localhost_nombre})
        }else{
          // console.log(`la informacion del cliente no se encuentra`);
          this.obtenerInformacionDeCliente_unico(clave_vigilar, ruta_observacion)
          .then((resultados_promesa) => {
            let actuales  = this._publicos.nueva_revision_cache(ruta_observacion)
            actuales[clave_vigilar] = resultados_promesa
            this._security.guarda_informacion({nombre: ruta_observacion, data: actuales})
          })
          .catch(error=>{
            console.log(error);
          })
        }
      })
      if (!actuales_nombres[clave_vigilar]) {
        faltantes.push(clave_vigilar)
      }
    })

    this.contador_recorridos++
    if (this.contador_observados === this.contador_recorridos) {
      // console.log('informar al cliente que ya puede hacer uso del sistema');
      this.informar_cliente_termino = true
    }
    // console.log(faltantes);
    if (faltantes.length) {
      // console.log('realiza la consulta de la informacion', faltantes);
      this.obtenerInformacionDeClientes(faltantes, ruta_observacion)
      .then((resultados_promesa) => {
        // console.log(resultados_promesa);

        const claves_obtenidas = Object.keys(resultados_promesa)

        let actuales  = this._publicos.nueva_revision_cache(ruta_observacion)
        claves_obtenidas.forEach(clave_obtenida=>{
          actuales[clave_obtenida] = resultados_promesa[clave_obtenida]
        })
        // console.log(actuales);
        this._security.guarda_informacion({nombre: ruta_observacion, data: actuales})


      })
      .catch(error=>{
        console.log(error);
      })
    }
    
  }

  guarda_nueva_cache(){
    const data = {
      "-NE31rH-xDj6Jv5hM7Jp": {
          "apellidos": "reyes reyes",
          "correo": "desarrollospeed03@gmail.com",
          "correo_sec": "nuevo1@gmail.com",
          "no_cliente": "TORETO10220006",
          "nombre": "Reymunda",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "8888888888",
          "tipo": "particular"
      },
      "-NEvKXhoNvvx0TcHnDkZ": {
          "apellidos": "moctezuma",
          "correo": "ventas_admin@gmintegraciones.com",
          "no_cliente": "LAMOTO10220010",
          "nombre": "Ana1",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "4564564645",
          "tipo": "particular"
      },
      "-NEvOREdSxX4vBkd9asE": {
          "apellidos": "Vargas",
          "correo": "isa.vargas@speed-service.com.mx",
          "empresa": "Speed",
          "no_cliente": "ISVATO10220011",
          "nombre": "Isabel",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "8745674567",
          "tipo": "flotilla"
      },
      "-NFVB-LASl4wBCkOcmmu": {
          "apellidos": "Prueba28 Oct",
          "correo": "gabriel_guadarrama@hotmail.com",
          "no_cliente": "GAPRPO10220017",
          "nombre": "Gabriel",
          "sucursal": "-N2gkVg1RtSLxK3rTMYc",
          "telefono_movil": "5555555555",
          "tipo": "particular"
      },
      "-NFp1szdczrEHN9dLSrn": {
          "apellidos": "chavez rios",
          "correo": "inmobiliarias@arrendify.com",
          "no_cliente": "MICHCU11220017",
          "nombre": "miriam",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "7555555555",
          "tipo": "particular"
      },
      "-NG2LstV0NhaJkHH6ro-": {
          "apellidos": "GUADA",
          "correo": "genaro_guadarrama@outlook.com",
          "empresa": "GUIAR",
          "no_cliente": "GEGUCU11220013",
          "nombre": "GENARO GUADAAAAA",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "flotilla"
      },
      "-NG2OFF3PawaJ32u9cXt": {
          "apellidos": "Duagarrama",
          "correo": "tecnogerzon@hotmail.com",
          "no_cliente": "EGDUCU11220005",
          "nombre": "Egnaro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "particular"
      },
      "-NG3I1mPDTSJ35T5ZlJ7": {
          "apellidos": "GUDADADA",
          "correo": "genaro.guadarrama93@gmail.com",
          "no_cliente": "DEGUCU11220015",
          "nombre": "DEGNARO",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "particular"
      },
      "-NGTTTw5ZDgkt3aJcB6n": {
          "apellidos": "guadarrama",
          "correo": "ventas@gmintegraciones.com",
          "no_cliente": "GAGUCU11220016",
          "nombre": "gabriel",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "4853753874",
          "tipo": "particular"
      },
      "-NI3JfKMPyqUkZ6GBi9D": {
          "apellidos": "PAREJA GONZALEZ",
          "correo": "jlparejag@gmail.com",
          "no_cliente": "JOPATO11220017",
          "nombre": "JOSE LUIS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534240382",
          "tipo": "particular"
      },
      "-NI8J3w_wd0HDj3-gYoA": {
          "apellidos": "RAMIREZ ZUÑIGA",
          "correo": "jrz30@gmail.com",
          "no_cliente": "JO RTO11220006",
          "nombre": "JORGE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5535149521",
          "tipo": "particular"
      },
      "-NIEnZDqROJh4YzpfeX2": {
          "apellidos": "HERNANDEZ",
          "correo": "pendiente@correo.com",
          "no_cliente": "KIHETO12220019",
          "nombre": "KIKIN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5532055933",
          "tipo": "particular"
      },
      "-NIrGdXj5MSZQFwL08XF": {
          "apellidos": "geronimo gil",
          "correo": "lulu@gmail.com",
          "no_cliente": "GegeCu09220021",
          "nombre": "Genaro m",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "7867864756",
          "tipo": "particular"
      },
      "-NJD-27P-Ip0uccz77h1": {
          "apellidos": "TOACHE",
          "correo": "sin@correo.com",
          "no_cliente": "FETOTo09220022",
          "nombre": "FERNANDA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5564018184",
          "tipo": "particular"
      },
      "-NJGOM0kuATAqPGHQhTp": {
          "apellidos": "CRUZ",
          "correo": "andromeda_3d@hotmail.com",
          "no_cliente": "MACRTo09220023",
          "nombre": "MARIA ELENA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513181724",
          "tipo": "particular"
      },
      "-NJLECSlFg3htMWnVJCk": {
          "apellidos": "SIN",
          "correo": "SIN@CORREO.COM",
          "no_cliente": "OCSITo09220024",
          "nombre": "OCTAVIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5530433921",
          "tipo": "particular"
      },
      "-NJQOaVswPrU7ny27I5u": {
          "apellidos": "ACUÑA",
          "correo": "edgar.gaitan@infinitunmail.com",
          "no_cliente": "EDACTo09220025",
          "nombre": "EDGAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5522714769",
          "tipo": "particular"
      },
      "-NJW7znp2728xa0fSp1_": {
          "apellidos": "ORTIZ",
          "correo": "ricardomorz20@gmail.com",
          "no_cliente": "RIORTo09220026",
          "nombre": "RICARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539346106",
          "tipo": "particular"
      },
      "-NK-DDkbEZy70IfwWWDu": {
          "apellidos": "SA",
          "correo": "lupita.loquita@gmail.com",
          "no_cliente": "TESACu09220027",
          "nombre": "TEC",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "1234077897",
          "tipo": "particular"
      },
      "-NKGdwfggl-iKF3VAJO4": {
          "apellidos": "Han",
          "correo": "s.speedsales@gmail.com",
          "no_cliente": "CIHACU12220028",
          "nombre": "Cirline",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "particular"
      },
      "-NKJj9aGGxoDVpZhbBmN": {
          "apellidos": "SULAIMAN",
          "correo": "JPS12@GMAIL.COM",
          "no_cliente": "JESUTo09220029",
          "nombre": "JEAN PAUL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529550023",
          "tipo": "particular"
      },
      "-NKUKToT-odu35eKCucG": {
          "apellidos": "ROMERO",
          "correo": "peendiente@correo.com",
          "no_cliente": "ARROTo09220031",
          "nombre": "ARIADNE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5535102059",
          "tipo": "particular"
      },
      "-NKUp1xLKMOKSSJJXTn2": {
          "apellidos": "señor",
          "correo": "Atencion_clientes@speed-service.com.mx",
          "empresa": "Iphone",
          "no_cliente": "deseCu09220032",
          "nombre": "de prueba",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "flotilla"
      },
      "-NL2-dAoam5XZLitUaaA": {
          "apellidos": "SALGADO",
          "correo": "brenda@florense.com.mx",
          "no_cliente": "BRSATo05230033",
          "nombre": "BRENDA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5519157671",
          "tipo": "particular"
      },
      "-NL2P7b6rR04wT_ziPKs": {
          "apellidos": "ALATRISTE LUNA",
          "correo": "abrahamalatrizte_66@gmail.com",
          "no_cliente": "ABALTo05230034",
          "nombre": "ABRAHAM",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5555016305",
          "tipo": "particular"
      },
      "-NLNVqIM3HlWwdYY4Vkj": {
          "apellidos": "AGUILAR",
          "correo": "gestor.tesoreria@fhmex.com.mx",
          "empresa": "FARMACEUTICA HISPANOAMERICANA",
          "no_cliente": "GUAGTo09230035",
          "nombre": "GUILLERMO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5523428053",
          "tipo": "flotilla"
      },
      "-NLRhhoHEmZzs36LQyO-": {
          "apellidos": "salvador",
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "no_cliente": "lusaCu10230036",
          "nombre": "lupis trupis",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5522859478",
          "tipo": "particular"
      },
      "-NLS512d_ACSLeFE5r02": {
          "apellidos": "López Perez",
          "correo": "abcde@gmail.com",
          "no_cliente": "PeLóCu10230037",
          "nombre": "Pedro Pablo",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512345678",
          "tipo": "particular"
      },
      "-NLSGFfH8ide4cUHFj5t": {
          "apellidos": "Monroy",
          "correo": "guadalupesalvadorhdz@gmail.com",
          "no_cliente": "JhMoCu10230038",
          "nombre": "Jhovanny",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5626570912",
          "tipo": "particular"
      },
      "-NLSJqiLdov_8LgUbzmJ": {
          "apellidos": "Cacomixtle",
          "correo": "fabianzku@outlook.com",
          "no_cliente": "FaCaCu10230039",
          "nombre": "Fabian",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5548795600",
          "tipo": "particular"
      },
      "-NLSMGiF8lHzmTWX3sh3": {
          "apellidos": "JONES",
          "correo": "LJONES@OUTLOOK.COM",
          "no_cliente": "LUJOCu10230040",
          "nombre": "LUPITA",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512645201",
          "tipo": "particular"
      },
      "-NLcE0c8GTpe9BHqzCl9": {
          "apellidos": "Ramirez Ramirez",
          "correo": "Ramirez@gmail.com",
          "no_cliente": "JuRaCu12230041",
          "nombre": "Juan",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "7737272828",
          "tipo": "particular"
      },
      "-NM-9BhwSNia8VZfrU8Q": {
          "apellidos": "HERNANDEZ",
          "correo": "carlos191996h@gmail.com",
          "no_cliente": "CAHEToNaNaN0042",
          "nombre": "CARLOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5587408211",
          "tipo": "particular"
      },
      "-NM4jIL5OQTi-SIzHEPu": {
          "apellidos": "MONJARAZ",
          "correo": "josevictor1976monjaraz@yahoo.com.mx",
          "no_cliente": "JOMOToNaNaN0043",
          "nombre": "JOSE VICTOR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5528539657",
          "tipo": "particular"
      },
      "-NMA7CZDha0eLCv5FxtS": {
          "apellidos": "AGUILAR",
          "correo": "gestor.tesoreria@fhmex.com",
          "empresa": "FARMACEUTICA HISPANOAMERICANA SA DE CV",
          "no_cliente": "GUAGToNaNaN0044",
          "nombre": "GUILLERMO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5523642805",
          "tipo": "flotilla"
      },
      "-NMEe2rTeyELxxFkfHAN": {
          "apellidos": "ZALETA ANAYA",
          "correo": "zaleta21@yahoo.com.mx",
          "no_cliente": "EDZAToNaNaN0045",
          "nombre": "EDWIN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5540854275",
          "tipo": "particular"
      },
      "-NMFEF5vUnTEVJJCu18x": {
          "apellidos": "LOZANO",
          "correo": "luis.lozano@sodexo.com",
          "empresa": "SODEXO MEXICO SA DE CV",
          "no_cliente": "LU LToNaNaN0046",
          "nombre": "LUIS ADRIAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5587827401",
          "tipo": "flotilla"
      },
      "-NMU3XwwkrRxJ59Tuf_8": {
          "apellidos": "NIEVES",
          "correo": "Jose.Nieves@medartis.com",
          "empresa": "MEDARTIS S A DE CV",
          "no_cliente": "JENIToNaNaN0047",
          "nombre": "JESUS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5533568824",
          "tipo": "flotilla"
      },
      "-NMVhbvvR8NX-Ph4aaxv": {
          "apellidos": "BOTELLO",
          "correo": "rocio.botello@risoul.com",
          "empresa": "RISOUL Y CIA SA DE CV",
          "no_cliente": "ROBOToNaNaN0048",
          "nombre": "ROCIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "8180205005",
          "tipo": "flotilla"
      },
      "-NMVmWPPwsDkW64EvmLQ": {
          "apellidos": "Financiación",
          "correo": "genaro.guadarrama@speed-service.com.mx",
          "no_cliente": "FIFICU01230049",
          "nombre": "Finanzas",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "particular"
      },
      "-NMZ_KvjfiOlv62X5X93": {
          "apellidos": "DOMINGUEZ",
          "correo": "atencion@abastecedor.com.mx",
          "empresa": "ABASTECEDOR CORPORATIVO SA DE CV",
          "no_cliente": "CEDOToNaNaN0050",
          "nombre": "CECILIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5585315035",
          "tipo": "flotilla"
      },
      "-NMZu-FV2AueR54KJb6e": {
          "apellidos": "Paz",
          "correo": "pazruiz65@hotmail.com",
          "no_cliente": "MAPACU01230022",
          "nombre": "Manue",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5528138238",
          "tipo": "particular"
      },
      "-NMZuV0sctpxLtuqMTFT": {
          "apellidos": "Delgado",
          "correo": "berenice.delgado@suez.com",
          "empresa": "-NN2jwMbzzh7vi173YNM",
          "no_cliente": "RABACU01230023",
          "nombre": "Berenice",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5541879801",
          "tipo": "flotilla"
      },
      "-NM_Kkgp7-FdPVAY1PW0": {
          "apellidos": "Hernández",
          "correo": "arturohernandez@sggroup.com.mx",
          "empresa": "-NN2jwMbzzh7vi173YNH",
          "no_cliente": "ALZACU01230024",
          "nombre": "Arturo",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5563161692",
          "tipo": "flotilla"
      },
      "-NM_QGVqsdeIN7Heen0m": {
          "apellidos": "MONZE",
          "correo": "monze@gmail.com",
          "no_cliente": "MOMOToNaNaN0054",
          "nombre": "MONZE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5545811409",
          "tipo": "particular"
      },
      "-NM_thj7nNakz10a8nnM": {
          "apellidos": "Cacique",
          "correo": "com.yo9999@gmail.com",
          "correo_sec": "carlos.alejandro.cacique@gmail.com",
          "empresa": "-NN8yJB6lU7AoCpA5v51",
          "no_cliente": "GTCACO01230055",
          "nombre": "Carlos",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_fijo": "5548695847",
          "telefono_movil": "5568989685",
          "tipo": "flotilla"
      },
      "-NMdug34tnQhu-bOJiKj": {
          "apellidos": "LEON LUNA",
          "correo": "betox-son@hotmail.com",
          "no_cliente": "LULEToNaNaN0056",
          "nombre": "LUIS ALBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513895202",
          "tipo": "particular"
      },
      "-NMeExYcAnDjvlpCDWuQ": {
          "apellidos": "ALAN",
          "correo": "alanalan@mail.com",
          "no_cliente": "ALALToNaNaN0057",
          "nombre": "ALAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5528808343",
          "tipo": "particular"
      },
      "-NMidpyPu8Cb9fVvE9GM": {
          "apellidos": "CALZADILLA",
          "correo": "ricardo.calzadilla@gmintegraciones.com",
          "empresa": "G.M. INTEGRACIONES Y SOLUCIONES SA DE CV",
          "no_cliente": "RICAToNaNaN0058",
          "nombre": "RICARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5570461728",
          "tipo": "flotilla"
      },
      "-NMjffgq9k83cuQmvTKu": {
          "apellidos": "LUGO",
          "correo": "mantenimiento06@hitmexico.com",
          "empresa": "HIT MÉXICO",
          "no_cliente": "JULUCuNaNaN0059",
          "nombre": "JUAN CARLOS",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "8119161871",
          "tipo": "flotilla"
      },
      "-NMo-knIjeoPxVaRNXH7": {
          "apellidos": "Rental",
          "correo": "mantenimiento02@hitmexico.com",
          "empresa": "HIT MEXICO",
          "no_cliente": "SpReCuNaNaN0060",
          "nombre": "Special",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "8111161037",
          "tipo": "flotilla"
      },
      "-NMt1kbR4iK-Gkg4b0qF": {
          "apellidos": "ROMERO",
          "correo": "luis.romero@ascendum.mx",
          "empresa": "ASCEDUM MAQUINARIA MEXICO S DE CV",
          "no_cliente": "LUROToNaNaN0061",
          "nombre": "LUIS ALBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5519989223",
          "tipo": "flotilla"
      },
      "-NMtLwj60Wtky18SClna": {
          "apellidos": "MALDONADO",
          "correo": "ecmsa100@msm.com",
          "empresa": "EQUIPOS Y CLIMAS DE MEXICO SA DE CV",
          "no_cliente": "MAMAToNaNaN0062",
          "nombre": "MARITZA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5543296529",
          "tipo": "flotilla"
      },
      "-NN2B7t8ainyEAPA_yta": {
          "apellidos": "BRENDING",
          "correo": "brending2624@gmail.com",
          "no_cliente": "BRBRToNaNaN0063",
          "nombre": "BRENDING",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534082624",
          "tipo": "particular"
      },
      "-NN2b8V1RrfMfscvdeZA": {
          "apellidos": "oro",
          "correo": "polikaosmk28s@gmail.com",
          "correo_sec": "santos@gmail.com",
          "no_cliente": "luorCuNaNaN0064",
          "nombre": "luis oro",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "8745674567",
          "tipo": "particular"
      },
      "-NN2bJusAlZ4o44_m6d8": {
          "apellidos": "fdgdfgdfg",
          "correo": "polikaosmkff28@gmail.com",
          "no_cliente": "dffdCuNaNaN0066",
          "nombre": "dfdfgdfg",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "8745674567",
          "tipo": "particular"
      },
      "-NN8LHsaFg-EFQ-inzEy": {
          "apellidos": "ALVAREZ",
          "correo": "leonardo.alvarez@inah.gob.mx",
          "empresa": "-NN7xfVE1zKojEYliQuQ",
          "no_cliente": "LEALTO01230034",
          "nombre": "LEONARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5555536266",
          "tipo": "flotilla"
      },
      "-NN8UHDOo-rcxHoak7zo": {
          "apellidos": "MENDOZA",
          "correo": "morado_pista@hotmail.com",
          "no_cliente": "JOMETO01230035",
          "nombre": "JOHANA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5526816584",
          "tipo": "particular"
      },
      "-NN8Xp5eh6s0dXZg4o7L": {
          "apellidos": "INDUSTRIALES",
          "correo": "ercha_15@hotmail.com",
          "empresa": "-NN8XPnus6-wuKyt5_JW",
          "no_cliente": "CAINTO01230036",
          "nombre": "CARBONES",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5532302530",
          "tipo": "flotilla"
      },
      "-NN8_QarszCpF7XdwKsp": {
          "apellidos": "JUAN",
          "correo": "jose_juan123@gmail.com",
          "no_cliente": "JOJUTO01230037",
          "nombre": "JOSE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5545782599",
          "tipo": "particular"
      },
      "-NN8z7sNVXsZUwed6nVZ": {
          "apellidos": "Cacique",
          "correo": "com.yo9999@gmail.com",
          "correo_sec": "carlos.alejandro.cacique@gmail.com",
          "no_cliente": "GTCACO01230004",
          "nombre": "gtntthnhnrr",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_fijo": "5548695847",
          "telefono_movil": "5568989685",
          "tipo": "particular"
      },
      "-NN8zq1K2QnBp7RIwtq2": {
          "apellidos": "montez lara",
          "correo": "daniellaraz@gmail.com",
          "no_cliente": "DAMOCO01230005",
          "nombre": "daniel",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_movil": "5569658965",
          "tipo": "particular"
      },
      "-NNHb780Eae4Sd1LSSQY": {
          "apellidos": "GALLEGOS",
          "correo": "sergio.gallegos.g@hotmail.com",
          "no_cliente": "SEGATO02230038",
          "nombre": "SERGIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534970236",
          "tipo": "particular"
      },
      "-NNHvZZjgy4J-eXO977O": {
          "apellidos": "MITRE",
          "correo": "mitre_leopoldo68@yahoo.com.mx",
          "no_cliente": "LEMITO02230039",
          "nombre": "LEOPOLDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5540122930",
          "tipo": "particular"
      },
      "-NNI_E-2mO3LJLWe0zT6": {
          "apellidos": "HERNANDEZ",
          "correo": "uro.theology@gmail.com",
          "no_cliente": "MAHETO02230040",
          "nombre": "MANUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5578101140",
          "tipo": "particular"
      },
      "-NNIeMuKNt93bflb9_1c": {
          "apellidos": "ALFARO",
          "correo": "danielalfaro@hotmail.com",
          "no_cliente": "DAALTO02230041",
          "nombre": "DANIEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5567023853",
          "tipo": "particular"
      },
      "-NNJ44KxXwX5ybn8Smlm": {
          "apellidos": "GALEANA",
          "correo": "miriam.galeana@medartis.com",
          "empresa": "-NNJ3aboGRSBT-cfXCuR",
          "no_cliente": "MIGATO02230042",
          "nombre": "MIRIAM",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5515266245",
          "tipo": "flotilla"
      },
      "-NNJDCuLY56cJhP8XI2F": {
          "apellidos": "juan xd",
          "correo": "juan3235@gmail.com",
          "no_cliente": "JUJUCU02230029",
          "nombre": "juan prueba 97",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5523232222",
          "tipo": "particular"
      },
      "-NNO9jLDS6a0yX44kaDN": {
          "apellidos": "Silva",
          "correo": "csilvac95@yahoo.com",
          "no_cliente": "CASICU02230030",
          "nombre": "Carlos",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "5568213888",
          "telefono_movil": "5521151722",
          "tipo": "particular"
      },
      "-NNhpZ0V-gw-ycrQoEqn": {
          "apellidos": "JASSO",
          "correo": "JASSO5595@GMAIL.COM",
          "no_cliente": "JAJATO02230043",
          "nombre": "JASSO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5521455951",
          "tipo": "particular"
      },
      "-NNhrsTiYRg_Xk_D96LR": {
          "apellidos": "ISA",
          "correo": "isa98@hotmail.com",
          "no_cliente": "ISISTO02230044",
          "nombre": "ISA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5530106798",
          "tipo": "particular"
      },
      "-NNhtqCgOuCU3tOL3Cok": {
          "apellidos": "805461",
          "correo": "805461@hotmail.com",
          "no_cliente": "8080TO02230045",
          "nombre": "805461",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5511520859",
          "tipo": "particular"
      },
      "-NNlk5lfbG120tHa6mpr": {
          "apellidos": "ZABALA",
          "correo": "direccion@deliciasmx.com",
          "empresa": "-NNlhm0LbvcCinGEVijh",
          "no_cliente": "GAZATO02230046",
          "nombre": "GASBI",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5569147151",
          "tipo": "flotilla"
      },
      "-NNlpaGDuy0e1L90IgIs": {
          "apellidos": "ROMERO",
          "correo": "marcoromeromora26@gmail.com",
          "no_cliente": "MAROCU02230031",
          "nombre": "MARCO ANTONIO",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5620337087",
          "tipo": "particular"
      },
      "-NNmDaHVuNvtBCxZyU3l": {
          "apellidos": "Cruz Santana",
          "correo": "jalbertohut@gmail.com",
          "no_cliente": "JOCRCU02230032",
          "nombre": "Jose Alberto",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5588041699",
          "tipo": "particular"
      },
      "-NNmE4BLF-iyON17oNCq": {
          "apellidos": "Cisneros",
          "correo": "wendy.cisneros@ti-america.com",
          "no_cliente": "WECICO02230086",
          "nombre": "Wendy",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_fijo": "2222732100",
          "telefono_movil": "2225638159",
          "tipo": "flotilla"
      },
      "-NNmkK1O9ztLeyajc51j": {
          "apellidos": "AVILA",
          "correo": "contacto@speed-service.com.mx",
          "no_cliente": "SIAVTO02230047",
          "nombre": "SIMON",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5543602177",
          "tipo": "particular"
      },
      "-NNspFTia9L_UvkASLFL": {
          "apellidos": "UGARTE",
          "correo": "omar_ugartes60@gmail.com",
          "no_cliente": "OMUGTO02230088",
          "nombre": "OMAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5545681703",
          "tipo": "particular"
      },
      "-NNw7-7lu1dfKE3ZgISF": {
          "apellidos": "Orozco",
          "correo": "oskard2@hotmail.com",
          "no_cliente": "OSORCU02230089",
          "nombre": "Oscar",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5532479387",
          "tipo": "particular"
      },
      "-NO0-sS-pDMa5bQvR_Y0": {
          "apellidos": "UGARTE",
          "correo": "omar.ugarte@gmail.com",
          "no_cliente": "OMUGTO02230090",
          "nombre": "OMAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5614447595",
          "tipo": "particular"
      },
      "-NOAG88cjUArkd-KBRxb": {
          "apellidos": "SALINAS HERNANDEZ",
          "correo": "cas@systemi.com.mx",
          "empresa": "-NOAFrY1tk6WAOgt3BE9",
          "no_cliente": "ROSATO02230091",
          "nombre": "RODRIGO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5554086619",
          "tipo": "flotilla"
      },
      "-NOGpV-4C-GQNXvDfYud": {
          "apellidos": "Electrix",
          "correo": "capitalhumano@electricx.com.mx",
          "empresa": "-NN2jwMclx-WqXdNjF_w",
          "no_cliente": "MAELCU02230092",
          "nombre": "Margarita",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5588480887",
          "tipo": "flotilla"
      },
      "-NOKT1A_o3p8fZ9TGzct": {
          "apellidos": "ANGIE",
          "correo": "angie64@gmail.com",
          "no_cliente": "ANANTO02230093",
          "nombre": "ANGIE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5550683964",
          "tipo": "particular"
      },
      "-NOK_-lIuYdZjnfwObya": {
          "apellidos": "VALLEJO REYES",
          "correo": "ana.vallejo@formex.com",
          "empresa": "-Nd79hj5xn9FpxpSTTIv",
          "no_cliente": "ANVATO02230094",
          "nombre": "ANA SILVIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5574189408",
          "tipo": "flotilla"
      },
      "-NOL-NjyXeEGSwm6ir0s": {
          "apellidos": "COSSIO",
          "correo": "cotizacionestt@speed-service.com.mx",
          "no_cliente": "GACOTO02230095",
          "nombre": "GABRIELA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5215545857",
          "tipo": "particular"
      },
      "-NOLscckxnpg2PrC_pkW": {
          "apellidos": "Pablo",
          "correo": "tesoreria@sanpablo.com.mx",
          "empresa": "-NN2jwMbzzh7vi173YNL",
          "no_cliente": "SAPACU02230096",
          "nombre": "San",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5529370500",
          "tipo": "flotilla"
      },
      "-NOM7Io03_oOmmDTgATJ": {
          "apellidos": "ZARATE",
          "correo": "taniazarate96@gmail.com",
          "no_cliente": "TAZATO02230097",
          "nombre": "TANIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531361206",
          "tipo": "particular"
      },
      "-NOMKH4jWHhUoiCubtVf": {
          "apellidos": "MARTINEZ",
          "correo": "DAVIT32@GMAIL.COM",
          "no_cliente": "DAMACU02230098",
          "nombre": "DAVID",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "555555555",
          "tipo": "particular"
      },
      "-NON-uKUoBL3mmXMfyLr": {
          "apellidos": "MARTINEZ",
          "correo": "almacencuatitlan@fruco.com.mx",
          "empresa": "-NOMyTEKWL5yyZPDYVIN",
          "no_cliente": "JOMATO02230099",
          "nombre": "JOSE MANUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5556980670",
          "tipo": "flotilla"
      },
      "-NOPP8lc-cXkkugI9vhc": {
          "apellidos": "RODRIGUEZ  VLADIVIESO",
          "correo": "toribioriva@gmail.com",
          "no_cliente": "MIROTO02230100",
          "nombre": "MIRIAM",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5951061108",
          "tipo": "particular"
      },
      "-NOPZRF78IxgehLl5ub5": {
          "apellidos": "CLAUDIA",
          "correo": "clubdeportivo@israelita.com",
          "empresa": "-NOPZBQU3kM6RSrQU--y",
          "no_cliente": "CLCLTO02230101",
          "nombre": "CLAUDIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5540691283",
          "tipo": "flotilla"
      },
      "-NOQiDcsTX-EPGQjuWMk": {
          "apellidos": "VALLE BOJALIL",
          "correo": "carlosvalle1@hotmail.com",
          "no_cliente": "CAVACU02230102",
          "nombre": "CARLOS",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5511305208",
          "tipo": "particular"
      },
      "-NOR2o6yqHF--LGUUX4c": {
          "apellidos": "MARTINEZ",
          "correo": "compras7@cannon.com.mx",
          "empresa": "-NOR2aZsOfgypsTmt8TY",
          "no_cliente": "ISMATO02230103",
          "nombre": "ISEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5583452392",
          "tipo": "flotilla"
      },
      "-NOR4nXPhzXfnr0GT0WD": {
          "apellidos": "MARIA",
          "correo": "mariaimparable@hotmail.com",
          "no_cliente": "MAMATO02230104",
          "nombre": "MARIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5541309726",
          "tipo": "particular"
      },
      "-NOUxdqS-78L5GWb018g": {
          "apellidos": "CASTRO",
          "correo": "COUCHMAU@GMAIL.COM",
          "no_cliente": "MACATO02230105",
          "nombre": "MAU",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5574615324",
          "tipo": "particular"
      },
      "-NOVAzO6qH61PDqK-FZD": {
          "apellidos": "FRANCO",
          "correo": "enriquefrancouvm@gmail.com",
          "no_cliente": "ENFRCU02230106",
          "nombre": "ENRIQUE",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5611541571",
          "tipo": "particular"
      },
      "-NO_UVrGfsXo7G-fT_aw": {
          "apellidos": "Valdez Ortiz",
          "correo": "atencion.personal7@gmail.com",
          "no_cliente": "ERVACU02230107",
          "nombre": "Ernesto",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5567070396",
          "tipo": "particular"
      },
      "-NOpkYGEJczvxN2pTntX": {
          "apellidos": "BALTAZAR",
          "correo": "alejandrobaltazar@platinum.com.mx",
          "empresa": "-NOpkMqNv-sjhCeOTn0D",
          "no_cliente": "ALBATO02230108",
          "nombre": "ALEJANDRO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5537220086",
          "tipo": "flotilla"
      },
      "-NOv8xtRUKI0nNFNn8bv": {
          "apellidos": "Difumex",
          "correo": "difumexind@gmail.com",
          "empresa": "-NN2jwMclx-WqXdNjF_n",
          "no_cliente": "ÁNDICU02230109",
          "nombre": "Ángeles",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5591944840",
          "tipo": "flotilla"
      },
      "-NOypGMBcfQoUp9TDDON": {
          "apellidos": "CHAVEZ",
          "correo": "r.chavez@proven.com",
          "empresa": "-NOyoWjr2it3Iihy1NGx",
          "no_cliente": "RACHTO02230110",
          "nombre": "RAFAEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5587933744",
          "tipo": "flotilla"
      },
      "-NOz-Hhs6ycWNl_YENR3": {
          "apellidos": "BARAJAS",
          "correo": "circus@confecciones.com",
          "empresa": "-NOyzwfu1Q72p87CA-Q_",
          "no_cliente": "GUBATO02230111",
          "nombre": "GUSTAVO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539901130",
          "tipo": "flotilla"
      },
      "-NOzmJNsnW1c_vbi21Fk": {
          "apellidos": "DOMINGUEZ",
          "correo": "cecilia.dominguez@abastecedor.com",
          "empresa": "-NOzlxBGOFJ0A28PZhDu",
          "no_cliente": "CEDOTO02230112",
          "nombre": "CECILIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534400905",
          "tipo": "flotilla"
      },
      "-NP-R4ryaUMsFnOlleF2": {
          "apellidos": "Barbosa de Melo",
          "correo": "pr.wagner21@hotmail.com",
          "no_cliente": "WABACO02230113",
          "nombre": "Wagner",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_movil": "5548480349",
          "tipo": "particular"
      },
      "-NP2rxjy3eIxWgRqmcOe": {
          "apellidos": "BOONE",
          "correo": "charlyboone@outlook.com",
          "no_cliente": "CABOTO02230114",
          "nombre": "CARLOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5518279329",
          "tipo": "particular"
      },
      "-NP2uql6hw1p_VygT0jt": {
          "apellidos": "BACA LOPEZ",
          "correo": "alenu@autlook.com",
          "no_cliente": "ALBATO02230115",
          "nombre": "ALELI",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "55575626",
          "tipo": "particular"
      },
      "-NP34QxkpelPMhSmhMZc": {
          "apellidos": "PEREZ",
          "correo": "faviolaperez.18@gmail.com",
          "no_cliente": "SOPETO02230116",
          "nombre": "SONIA FABIOLA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5517567244",
          "tipo": "particular"
      },
      "-NP35DJByn-5NvyP3efM": {
          "apellidos": "Hernández",
          "correo": "arhernandez@sggroup.com.mx",
          "no_cliente": "ARHECU02230116",
          "nombre": "Arturo",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5563161692",
          "tipo": "particular"
      },
      "-NP8gdMatE2bnCAprfWe": {
          "apellidos": "Perea",
          "correo": "lperea6879@gmail.com",
          "no_cliente": "ALPECU02230118",
          "nombre": "Alberto",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5522459349",
          "tipo": "particular"
      },
      "-NP8hUfyDg2e0tKoVs8s": {
          "apellidos": "CHARLY",
          "correo": "CHARLY62@HOTMAIL.COM",
          "no_cliente": "CHCHTO02230119",
          "nombre": "CHARLY",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534112162",
          "tipo": "particular"
      },
      "-NP8ig4qmwOCiYrnq4Pm": {
          "apellidos": "RAMIREZ M.",
          "correo": "jjramirezm@gmail.com",
          "no_cliente": "J.RATO02230120",
          "nombre": "J. JAIME",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5512590580",
          "tipo": "particular"
      },
      "-NPNm-FzOi8o4_kNK6Xp": {
          "apellidos": "EDGAR",
          "correo": "edgar_edgar@gmail.com",
          "no_cliente": "EDEDTO02230121",
          "nombre": "EDGAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5563552757",
          "tipo": "particular"
      },
      "-NPO-E8aEFK2DbYrmtnd": {
          "apellidos": "SALGADO",
          "correo": "sacbe99@gmail.com",
          "no_cliente": "ARSACU02230122",
          "nombre": "ARTURO",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5534510065",
          "tipo": "particular"
      },
      "-NPU1Ll-xpVK6bLwpJIw": {
          "apellidos": "SANCHEZ",
          "correo": "mibuen_zor@gmail.com",
          "no_cliente": "FRSATO03230123",
          "nombre": "FRANCISCO JAVIER",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5516450557",
          "tipo": "particular"
      },
      "-NPZCwpGia-hgQ5MfNp_": {
          "apellidos": "SAAVEDRA",
          "correo": "HECTORSAAVEDRA@GMAIL.COM",
          "no_cliente": "HESATO03230124",
          "nombre": "HECTOR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5621293323",
          "tipo": "particular"
      },
      "-NPdhgVa3J4YhtY7XswX": {
          "apellidos": "OCAMPO MX",
          "correo": "gestion.compras@ocampo.mx",
          "empresa": "-NPdhPjsoun8NuO_ZJf1",
          "no_cliente": "JOROCU03230125",
          "nombre": "AGENCIA ADUANAL",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5530196218",
          "tipo": "flotilla"
      },
      "-NPxbrDp-KvAfzLHn4lo": {
          "apellidos": "7209",
          "correo": "IPA7209@HOTMAIL.COM",
          "no_cliente": "IP72TO03230126",
          "nombre": "IPA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5520206834",
          "tipo": "particular"
      },
      "-NQ2FuiTdWW4VDaaoMxg": {
          "apellidos": "ROMERO",
          "correo": "urielromerojeep@gmail.com",
          "no_cliente": "URROTO03230127",
          "nombre": "URIEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531755012",
          "tipo": "particular"
      },
      "-NQ6_clm9jgINu_gkmj2": {
          "apellidos": "ANGELES",
          "correo": "richard1212angeles@yahoo.com",
          "no_cliente": "RIANTO03230128",
          "nombre": "RICARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5621923336",
          "tipo": "particular"
      },
      "-NQAruiYE64gyTyktnSI": {
          "apellidos": "HERNANDEZ",
          "correo": "maximino.hernandez@gmail.com",
          "no_cliente": "MAHETO03230129",
          "nombre": "MAXIMINO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5515921196",
          "tipo": "particular"
      },
      "-NQBAodVkA5Z9_JIFoNh": {
          "apellidos": "BELL",
          "correo": "erick.belle@gmail.com",
          "no_cliente": "ERBETO03230130",
          "nombre": "ERICK",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539892687",
          "tipo": "particular"
      },
      "-NQBDRcauOL2tj2n7QpF": {
          "apellidos": "LÓPEZ",
          "correo": "logan26axel@gmail.com",
          "no_cliente": "FALÓCU03230131",
          "nombre": "FANCISCO HIPOLITO",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5527026080",
          "tipo": "particular"
      },
      "-NQBU6TfyYPeNmP87q2O": {
          "apellidos": "BARRERA",
          "correo": "gabm77@hotmail.com",
          "no_cliente": "ROBACO03230132",
          "nombre": "RODRIGO",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_movil": "5538810898",
          "tipo": "particular"
      },
      "-NQCbqyYySvnPBdwjH_e": {
          "apellidos": "GARCIA TAPIA",
          "correo": "oscar.garcia@tvazteca.com",
          "empresa": "-NQCayeafrPC6tn4i28E",
          "no_cliente": "OSGATO03230133",
          "nombre": "OSCAR  ALBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5530294542",
          "tipo": "flotilla"
      },
      "-NQQknx6ZGpBgzOU_5B-": {
          "apellidos": "MONROY",
          "correo": "imael.mosroy@bancodemexico.com",
          "empresa": "-NQQkUW8L8XLsYZ5IuID",
          "no_cliente": "ISMOTO03230134",
          "nombre": "ISMAEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5564495744",
          "tipo": "flotilla"
      },
      "-NQRZO74-1z2FRZhRNBi": {
          "apellidos": "Moctezuma",
          "correo": "jonathan.moctezuma81@gmail.com",
          "no_cliente": "JOMOCU03230135",
          "nombre": "Jonathan",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5516505522",
          "tipo": "particular"
      },
      "-NQaGBYAYu_NRJj9efAU": {
          "apellidos": "DIEX",
          "correo": "DIEX.DIEX@GMAIL.COM",
          "no_cliente": "DIDITO03230136",
          "nombre": "DIEX",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5527096403",
          "tipo": "particular"
      },
      "-NQaTvcrnUCpkYE3RU7n": {
          "apellidos": "LAFORCADE",
          "correo": "julise.lafrocade@hormail.com",
          "no_cliente": "JULATO03230137",
          "nombre": "JULISE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5551015363",
          "tipo": "particular"
      },
      "-NQbCWtfliTctI_eJqXC": {
          "apellidos": "Fernandez Irineo",
          "correo": "gonzalo_fdz@yahoo.com",
          "no_cliente": "GOFECU03230138",
          "nombre": "Gonzalo",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5580556147",
          "tipo": "particular"
      },
      "-NQekjBJN2KYHoYf0-j-": {
          "apellidos": "ROJANO",
          "correo": "arturo.rojano@hotmail.com",
          "no_cliente": "ARROTO03230139",
          "nombre": "ARTURO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5522719580",
          "tipo": "particular"
      },
      "-NQenFQcNhNUJgjnigXP": {
          "apellidos": "JUAN",
          "correo": "juan.juan@gmail.com",
          "no_cliente": "JUJUTO03230140",
          "nombre": "JUAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539981782",
          "tipo": "particular"
      },
      "-NQeyObJtVBBNTTRWuS4": {
          "apellidos": "KAMBLI",
          "correo": "kabogados@hotmail.com",
          "no_cliente": "CAKATO03230141",
          "nombre": "CARLOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534240328",
          "tipo": "particular"
      },
      "-NQfRL5fiA8tQlI1mxbi": {
          "apellidos": "GAMA",
          "correo": "pgama@proyectatex.com",
          "empresa": "-NQfR5QDgWeQVB3lJiGg",
          "no_cliente": "PAGATO03230142",
          "nombre": "PATRICIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5561648546",
          "tipo": "flotilla"
      },
      "-NQflfvxKswYdwilIwLR": {
          "apellidos": "ZAMUDIO",
          "correo": "gabriel.zamudio@aoutlook.com",
          "no_cliente": "GAZATO03230143",
          "nombre": "GABRIEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5526759779",
          "tipo": "particular"
      },
      "-NQgAgmAXe7P7GVPeHtw": {
          "apellidos": "VARGAS",
          "correo": "isa_vargas05@hotmail.com",
          "no_cliente": "ISVACU03230144",
          "nombre": "ISABEL",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5570467464",
          "tipo": "particular"
      },
      "-NQkFCPhYVbsc2C6KqTt": {
          "apellidos": "Segura",
          "correo": "atención_clientes@speed-service.com.mx",
          "no_cliente": "KASECU03230145",
          "nombre": "Karla",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5519335566",
          "tipo": "particular"
      },
      "-NQkoIsr-k5XvYK9Obbv": {
          "apellidos": "velazquez",
          "no_cliente": "RAVECU03230146",
          "nombre": "ramiro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5523232222",
          "tipo": "particular"
      },
      "-NQl5QLyDnhoCziDnGfC": {
          "apellidos": "PAREDES",
          "correo": "almacen@cinecolor.com.mx",
          "empresa": "-NQl5EVPHVq1GZnBYEqs",
          "no_cliente": "ISPATO03230147",
          "nombre": "ISRAEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5561948781",
          "tipo": "flotilla"
      },
      "-NR3vGUDnOgaNnSEa4xE": {
          "apellidos": "CRUZ DELGADO",
          "correo": "sercrudel@hotmail.com",
          "no_cliente": "SECRTO03230148",
          "nombre": "SERGIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5532729604",
          "tipo": "particular"
      },
      "-NR4lPXzCD6FBYP9r4TR": {
          "apellidos": "GODINEZ",
          "correo": "luisfergo@gmail.com",
          "no_cliente": "LUGOTO03230149",
          "nombre": "LUIS FERNANDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5512440598",
          "tipo": "particular"
      },
      "-NR5gCipmzeLlQQok48C": {
          "apellidos": "PAKETTE",
          "correo": "pakette@gmail.com",
          "no_cliente": "PAPATO03230150",
          "nombre": "PAKETTE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539485271",
          "tipo": "particular"
      },
      "-NR9EaYv9qv6vR6Gys8Z": {
          "apellidos": "VIAU GOMEZ",
          "correo": "viaugomoscar@hotmail.com",
          "no_cliente": "OSVITO03230151",
          "nombre": "OSCAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5576413725",
          "tipo": "particular"
      },
      "-NR9es11RSd7_SXx0RmA": {
          "apellidos": "ORTIZ",
          "correo": "mario.ortiz94@gmail.com",
          "no_cliente": "MAORTO03230152",
          "nombre": "MARIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5571124653",
          "tipo": "particular"
      },
      "-NR9vBTtZpwlXX_b00Oo": {
          "apellidos": "SANTIAGO MATA",
          "correo": "polosanti@gmail.com",
          "no_cliente": "LESATO03230153",
          "nombre": "LEOPOLDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529514632",
          "tipo": "particular"
      },
      "-NRG3Z_KHvEF0DvWQi4u": {
          "apellidos": "PEÑA",
          "correo": "elena.peña@gmail.com",
          "no_cliente": "ELPETO03230154",
          "nombre": "ELENA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529407055",
          "tipo": "particular"
      },
      "-NRG6o7VZlWg9-CFipIU": {
          "apellidos": "JESUS",
          "correo": "jesus.jesus@gmail.com",
          "no_cliente": "JEJETO03230155",
          "nombre": "JESUS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5535668709",
          "tipo": "particular"
      },
      "-NRJlQ9F9kHO92frHG_3": {
          "apellidos": "Ortinez Rojas",
          "correo": "benortinez@hotmail.com",
          "no_cliente": "BEORCU03230156",
          "nombre": "Benjamín",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5627149977",
          "tipo": "particular"
      },
      "-NRL0m0-GIS6KQdkPI7p": {
          "apellidos": "SANCHEZ",
          "correo": "gaby.sanchez@gmail.com",
          "no_cliente": "GASATO03230157",
          "nombre": "GABRIELA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5551045355",
          "tipo": "particular"
      },
      "-NRL2HqpVWvN5Ydmr_vn": {
          "apellidos": "CRUZ",
          "correo": "luis.cruz@hotmail.com",
          "no_cliente": "LUCRTO03230158",
          "nombre": "LUIS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5567020100",
          "tipo": "particular"
      },
      "-NROK0Uz6ln7SRZWkbo6": {
          "apellidos": "Castillo",
          "correo": "ivancastillomadic@gmail.com",
          "no_cliente": "IVCACU03230159",
          "nombre": "Ivan",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5520853535",
          "tipo": "particular"
      },
      "-NROeqbb9u6Pus5216Ou": {
          "apellidos": "CARBAJAL",
          "correo": "cp-cc@yahoo.com",
          "no_cliente": "CACATO03230160",
          "nombre": "CARLOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5559914652",
          "tipo": "particular"
      },
      "-NROgFxR38_1hTZyMK40": {
          "apellidos": "SANTIAGO",
          "correo": "santiago.santiago@gmail.com",
          "no_cliente": "SASATO03230161",
          "nombre": "SANTIAGO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5541417506",
          "tipo": "particular"
      },
      "-NRYZTij41PWHI-yvb3h": {
          "apellidos": "LOGISTICA",
          "correo": "logistica@nauclapan.com",
          "no_cliente": "ROLOTO03230162",
          "nombre": "RODRIGO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "3315996681",
          "tipo": "particular"
      },
      "-NRYbcOQqLPbyzyR4S2U": {
          "apellidos": "FER",
          "correo": "fer@fer.com",
          "no_cliente": "FEFETO03230163",
          "nombre": "FER",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5546602224",
          "tipo": "particular"
      },
      "-NRZHcUIcb_VrdDmvDcg": {
          "apellidos": "RICO RICO",
          "correo": "gera.rico.r@gmail.com",
          "no_cliente": "GERITO03230164",
          "nombre": "GERARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5514349905",
          "tipo": "particular"
      },
      "-NRZqlMqo0fxVbxXWQPK": {
          "apellidos": "Sin Apellido",
          "no_cliente": "SISICU03230165",
          "nombre": "Sin nombre",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "particular"
      },
      "-NRZztPUCC9UnUYD_9bM": {
          "apellidos": "FLORES SANCHEZ",
          "correo": "SANHCEZFKARLA@MONOPARK.COM",
          "empresa": "-NRZznm2MP9D9mmcq3He",
          "no_cliente": "KAFLTO03230166",
          "nombre": "KARLA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "56211433",
          "tipo": "flotilla"
      },
      "-NR_qsDNYkz4j3EgWRN0": {
          "apellidos": "GUZMAN",
          "correo": "luis.guzman@gmail.com",
          "no_cliente": "LUGUTO03230167",
          "nombre": "LUIS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513780085",
          "tipo": "particular"
      },
      "-NR_sym13O8LuemK6TPq": {
          "apellidos": "VARGAS MARIN",
          "correo": "pab.var.marya@hoo.com",
          "no_cliente": "PAVATO03230168",
          "nombre": "PABLO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5527488920",
          "tipo": "particular"
      },
      "-NRc_Wlp5S-Vh-sbtYxa": {
          "apellidos": "AYALA CORTES",
          "correo": "netoayacor62@yahoo.com",
          "no_cliente": "ERAYTO03230169",
          "nombre": "ERNESTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5511421843",
          "tipo": "particular"
      },
      "-NRd7Dvn0Pr71k6C7JaN": {
          "apellidos": "JUÁREZ",
          "correo": "bjuarez@reynera.com.mx",
          "no_cliente": "ANJUCU03230170",
          "nombre": "ANA BERTA",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5545257585",
          "tipo": "particular"
      },
      "-NRhjsa3pbgLvkW23pcw": {
          "apellidos": "MEXICO",
          "correo": "IRON@GLASS.COM",
          "no_cliente": "IRMETO03230171",
          "nombre": "IRON GLASS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5516989055",
          "tipo": "particular"
      },
      "-NRiPs494DzeNa0QixXJ": {
          "apellidos": "Martiñón",
          "correo": "leomartignon@hotmail.com",
          "no_cliente": "LEMACU03230172",
          "nombre": "Leonardo",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5559817380",
          "tipo": "particular"
      },
      "-NRiZ1osDLC2MqOVO71q": {
          "apellidos": "ROCHA",
          "correo": "mensajeria@cdq.com.mx",
          "empresa": "-NRiYEoYHYEgfM71W7ad",
          "no_cliente": "JOROTO03230173",
          "nombre": "JOSE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5536484947",
          "tipo": "flotilla"
      },
      "-NRix5SUjxUmGURH0dCF": {
          "apellidos": "GARCIA",
          "correo": "alvaro_ambrocio@seda.org",
          "no_cliente": "ALGATO03230174",
          "nombre": "ALVARO AMBROCIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5566152406",
          "tipo": "particular"
      },
      "-NRj1lOqtqx4adskINOa": {
          "apellidos": "ROMERO",
          "correo": "alfredo.romero2002@autlook.com",
          "no_cliente": "ALROTO03230175",
          "nombre": "ALFREDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5633565280",
          "tipo": "particular"
      },
      "-NRnvbd-CbgKCzQqwySt": {
          "apellidos": "APARICIO GRACIANO",
          "correo": "aparicio.graciano@mail.com",
          "no_cliente": "RAAPTO03230176",
          "nombre": "RAUL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531856931",
          "tipo": "particular"
      },
      "-NRsW9qNLbTK12oHcGbl": {
          "apellidos": "MARTINEZ",
          "correo": "santos.martinez@gmail.com",
          "no_cliente": "SAMATO03230177",
          "nombre": "SANTOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "8993185446",
          "tipo": "particular"
      },
      "-NRt92FdPwqNfVfQ8lPe": {
          "apellidos": "TERRAZAS DUQUE",
          "correo": "danyterrazas@outlook.com",
          "no_cliente": "DATETO03230178",
          "nombre": "DANEILA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5573623424",
          "tipo": "particular"
      },
      "-NRxe-NCF6K6GA5LRYsu": {
          "apellidos": "ANA S",
          "correo": "ana.s@hotmail.com",
          "no_cliente": "ANANTO04230179",
          "nombre": "ANA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5591675648",
          "tipo": "particular"
      },
      "-NS76zrhzYRzl0s3MAXK": {
          "apellidos": "GUADARRAMA",
          "correo": "victor.guadarrama@hotmail.com",
          "no_cliente": "VIGUTO04230180",
          "nombre": "VICTOR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5621311433",
          "tipo": "particular"
      },
      "-NS7TijMzgN53Vx6zfDz": {
          "apellidos": "MITI",
          "correo": "miti@miti.com",
          "no_cliente": "MIMITO04230181",
          "nombre": "MITI",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5610238366",
          "tipo": "particular"
      },
      "-NSRXAOmoKOnnR7dZq7i": {
          "apellidos": "Canales Rivera",
          "correo": "alekanales@hotmail.com",
          "no_cliente": "ALCACU04230182",
          "nombre": "Alejandra",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5535668898",
          "tipo": "particular"
      },
      "-NSRbGF1HJn1VsSUuvm8": {
          "apellidos": "Gurrola Matinez",
          "correo": "san-gurrola@hotmail.com",
          "no_cliente": "SAGUCU04230183",
          "nombre": "Santos",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5538838708",
          "tipo": "particular"
      },
      "-NSgw6NlC8Jfh-PWLA3-": {
          "apellidos": "ORTIZ",
          "correo": "ricardo.ortiz@delicas.com",
          "empresa": "-NNlhm0LbvcCinGEVijh",
          "no_cliente": "RIORTO04230184",
          "nombre": "RICARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539346106",
          "tipo": "flotilla"
      },
      "-NShVTpPtVrDaH5us2L2": {
          "apellidos": "GABY",
          "correo": "glopez@aaacosmetica.com.mx",
          "empresa": "-NShUdzr0bCNMa2XveCJ",
          "no_cliente": "GAGATO04230185",
          "nombre": "GABY",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5520891513",
          "tipo": "flotilla"
      },
      "-NSlAuGVWHdIBPocMfqT": {
          "apellidos": "Martínez",
          "correo": "alondra.yannis@gmail.com",
          "no_cliente": "MIMACU04230186",
          "nombre": "Miriam",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5551565552",
          "tipo": "particular"
      },
      "-NSlSnoANSYqrFUIgIvO": {
          "apellidos": "Con limon",
          "no_cliente": "JUCOLO04230187",
          "nombre": "Juguito de agua",
          "sucursal": "-NN8uAwBU_9ZWQTP3FP_",
          "telefono_movil": "5512254265",
          "tipo": "particular"
      },
      "-NTEsDw1hRv5w80K5Zq1": {
          "apellidos": "URBINA GARCIA",
          "correo": "urbinagar@hotmail.com",
          "no_cliente": "ARURTO04230188",
          "nombre": "ARMANDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5522526582",
          "tipo": "particular"
      },
      "-NTFgVnBiQ1JkEDvWq8R": {
          "apellidos": "LUNA MERCADO",
          "correo": "lalumer@gmail.com",
          "no_cliente": "EDLUTO04230189",
          "nombre": "EDUARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5576654275",
          "tipo": "particular"
      },
      "-NTKH6ctycScGF_ubpXZ": {
          "apellidos": "KING",
          "correo": "artur.king@gmail.com",
          "no_cliente": "ARKITO04230190",
          "nombre": "ARTUR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "6623402378",
          "tipo": "particular"
      },
      "-NTKUIzo32losSc4XGb7": {
          "apellidos": "DIAZ",
          "correo": "gabriel.diaz@gmail.com",
          "no_cliente": "GADITO04230191",
          "nombre": "GABRIEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534947709",
          "tipo": "particular"
      },
      "-NTKgEQGBv5bxA_a2ell": {
          "apellidos": "ORTIZ",
          "correo": "mario.ortiz@lagenerosa.com",
          "empresa": "-NTKg1dR_iM12VzENWHV",
          "no_cliente": "MAORTO04230192",
          "nombre": "MARIO ALBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5581041968",
          "tipo": "flotilla"
      },
      "-NTLUBbg3DrbeL3SQfOU": {
          "apellidos": "GERNERAL",
          "correo": "cliente1@general.com",
          "no_cliente": "CLGETO04230193",
          "nombre": "CLIENTE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5546510403",
          "tipo": "particular"
      },
      "-NTLWIM3aVY00yY8Z0eq": {
          "apellidos": "GABRIEL",
          "correo": "gabriel.gab@gmail.com",
          "no_cliente": "GAGATO04230194",
          "nombre": "GABRIEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5633950310",
          "tipo": "particular"
      },
      "-NTV1Sm3HbKGa-SOINrw": {
          "apellidos": "RAMIREZ",
          "correo": "luirr11@gmail.com",
          "no_cliente": "LURATO04230195",
          "nombre": "LUIS ROBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5554189492",
          "tipo": "particular"
      },
      "-NTV597Vh0HP96dklfN0": {
          "apellidos": "RUBENS",
          "correo": "rubens.1@hotmail.com",
          "no_cliente": "RURUTO04230196",
          "nombre": "RUBENS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5571008021",
          "tipo": "particular"
      },
      "-NTZsjY1VZc4Lae7mC65": {
          "apellidos": "URZUA",
          "correo": "urzua.robert85@mail.com",
          "no_cliente": "ROURTO04230197",
          "nombre": "ROBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "4494054736",
          "tipo": "particular"
      },
      "-NTaM8CeLWSELqH9Crmg": {
          "apellidos": "VANSS",
          "correo": "vanns.va@gmail.com",
          "no_cliente": "VAVATO04230198",
          "nombre": "VANNS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5541824767",
          "tipo": "particular"
      },
      "-NTnduYoMt1iRo-cZpMg": {
          "apellidos": "VILORIA",
          "correo": "fcojavil@gmail.com",
          "no_cliente": "FRVITO04230199",
          "nombre": "FRANCISCO JAVIER",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5512184672",
          "tipo": "particular"
      },
      "-NToKyrru9_Nufbig2M1": {
          "apellidos": "OSCAR RS",
          "correo": "oscar_rs@gmail.com",
          "no_cliente": "OSOSTO04230200",
          "nombre": "OSCAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5548017261",
          "tipo": "particular"
      },
      "-NTt51VeGtR_vjDhVjk8": {
          "apellidos": "RUIZ SANTIADO",
          "correo": "a.ruizsantiago@hotmail.com",
          "no_cliente": "ARRUTO04230201",
          "nombre": "ARSENIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5560613645",
          "tipo": "particular"
      },
      "-NTuazyC-MxpdUOgyAyd": {
          "apellidos": "YANEZ",
          "correo": "aistente.compras@alfo.com.mx",
          "empresa": "-NTuafWpin13GuakUtbn",
          "no_cliente": "EDYATO04230202",
          "nombre": "EDUARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529959099",
          "tipo": "flotilla"
      },
      "-NU31lPeKrcflFbh56wZ": {
          "apellidos": "MARTINEZ",
          "correo": "alejandrontz28@hotmail.com",
          "no_cliente": "ALMATO04230203",
          "nombre": "ALEJANDRO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5515102000",
          "tipo": "particular"
      },
      "-NU37DBpEi21okjloguV": {
          "apellidos": "RIVAS",
          "correo": "proftrivas@corima.com",
          "empresa": "-NU36rvcKQ05FT8h88Rd",
          "no_cliente": "TORITO04230204",
          "nombre": "TORIBIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5951081108",
          "tipo": "flotilla"
      },
      "-NU49Y07LNOVCrwPoWWV": {
          "apellidos": "FLORES",
          "correo": "sergio.flores@tacticaint.com",
          "empresa": "-NU49LrQ7PilrAkQ4Smd",
          "no_cliente": "SEFLTO04230205",
          "nombre": "SERGIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5566090753",
          "tipo": "flotilla"
      },
      "-NU9cMt_IOSrKaurv7a2": {
          "apellidos": "Oliver Duarte",
          "correo": "dodz-duarte91@gmail.com",
          "no_cliente": "DYOLCU04230206",
          "nombre": "Dylan",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "55290449",
          "tipo": "particular"
      },
      "-NUD3cbV79M6OCbX2uOz": {
          "apellidos": "CHAVEZ",
          "correo": "lore17mocgo@gmail.com",
          "no_cliente": "ALCHCU04230207",
          "nombre": "ALFREDO",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5540851407",
          "tipo": "particular"
      },
      "-NUS5EfvytDQOuTxdIwS": {
          "apellidos": "AVILES",
          "correo": "gustavo.aviles@hotmail.com",
          "no_cliente": "GUAVTO05230208",
          "nombre": "GUSTAVO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513256538",
          "tipo": "particular"
      },
      "-NUTFSMOqnOHu4otpobx": {
          "apellidos": "HANONO",
          "correo": "tufic.hanono@hotmail.com",
          "no_cliente": "TUHATO05230209",
          "nombre": "TUFIC",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513537290",
          "tipo": "particular"
      },
      "-NUTPJ1_We4Bt2EFprND": {
          "apellidos": "RAMIREZ",
          "correo": "leonardo.ramirez@yahoo.com",
          "no_cliente": "LERATO05230210",
          "nombre": "LEONARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5535409095",
          "tipo": "particular"
      },
      "-NUTjyKlbnTU1OUCCHCh": {
          "apellidos": "E. LEON",
          "correo": "arturo.eleon@outloo.com",
          "no_cliente": "ARE.TO05230211",
          "nombre": "ARTURO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531175738",
          "tipo": "particular"
      },
      "-NUTohoTPQCCVhkjC8mY": {
          "apellidos": "MARTINEZ",
          "correo": "almacencuautitlan@fruco.com.mx",
          "empresa": "-NOMyTEKWL5yyZPDYVIN",
          "no_cliente": "JOMATO05230212",
          "nombre": "JOSE MANUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "56980670",
          "tipo": "flotilla"
      },
      "-NUXHl0ewTKtoAYnPwxh": {
          "apellidos": "CERRILLO",
          "correo": "nandocarrilo_02@hotmail.com",
          "no_cliente": "FECETO05230213",
          "nombre": "FERNADO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5548005112",
          "tipo": "particular"
      },
      "-NUcguMk5fFLefRJJU08": {
          "apellidos": "ALVAREZ",
          "correo": "adolfo.alvarez@gmail.com",
          "no_cliente": "ADALTO05230214",
          "nombre": "ADOLFO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5579569511",
          "tipo": "particular"
      },
      "-NUclWTcYIxnLvp6sYzp": {
          "apellidos": "MICAVELLI",
          "correo": "alenadromicavelli@me.com",
          "no_cliente": "ALMITO05230215",
          "nombre": "ALEJANDRO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5639566792",
          "tipo": "particular"
      },
      "-NUgSvqVpgV4v7Op3Z-Q": {
          "apellidos": "VENEGAS",
          "correo": "berthavenegas1702@gmail.com",
          "no_cliente": "BEVETO05230216",
          "nombre": "BERTHA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5585603219",
          "tipo": "particular"
      },
      "-NUmS-yJ2kJ4Y59u1i9i": {
          "apellidos": "TG AVEO",
          "correo": "TGAVEO@HOTMAIL.COM",
          "no_cliente": "TGTGTO05230217",
          "nombre": "TG AVEO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5512573273",
          "tipo": "particular"
      },
      "-NUxHC6mEWpyWXf15XfE": {
          "apellidos": "ACEVES",
          "correo": "mickey.aceves@hotmail.com",
          "no_cliente": "MIACTO05230218",
          "nombre": "MICKEY",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513752950",
          "tipo": "particular"
      },
      "-NUxKEarVMIne0IJnWf1": {
          "apellidos": "SUU",
          "correo": "suu.suu@mail.com",
          "no_cliente": "SUSUTO05230219",
          "nombre": "SUU",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5540211485",
          "tipo": "particular"
      },
      "-NUxtOuMpcn6duocm2yr": {
          "apellidos": "CASTRO SOTO",
          "correo": "jesusargeniscastrosoto@gmail.com",
          "no_cliente": "JECATO05230220",
          "nombre": "JESUS ARGENIS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5548436637",
          "tipo": "particular"
      },
      "-NV10NztLjbRU3AovTI3": {
          "apellidos": "DEM",
          "correo": "d-e-m-m@hotmail.com",
          "no_cliente": "DEDETO05230221",
          "nombre": "DEM",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7331415615",
          "tipo": "particular"
      },
      "-NV12VfruMK3TP3PpHQL": {
          "apellidos": "NAVARRO",
          "correo": "memonavarro@gmail.com",
          "no_cliente": "GUNATO05230222",
          "nombre": "GUILLERMO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7223602400",
          "tipo": "particular"
      },
      "-NV1R7SG2TB0t9V0smS7": {
          "apellidos": "MELENDEZ",
          "correo": "jose.melendez@yahoo.com",
          "no_cliente": "JOMETO05230223",
          "nombre": "JOSE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5561360793",
          "tipo": "particular"
      },
      "-NV1XiblK9Nq9EVmztJW": {
          "apellidos": "MENDOZA",
          "correo": "bety.mendoza@yahoo.com",
          "no_cliente": "BEMETO05230224",
          "nombre": "BEATRIZ",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5563169707",
          "tipo": "particular"
      },
      "-NV5iRkAiNieP1h5KYPs": {
          "apellidos": "GOMEZ",
          "correo": "iganacio.gomez@hotmail.com",
          "no_cliente": "IGGOTO05230225",
          "nombre": "IGNACIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5563990548",
          "tipo": "particular"
      },
      "-NV6L4IyVYPCvv7oNSFW": {
          "apellidos": "LORE",
          "correo": "lore.lore@gmail.com",
          "no_cliente": "LOLOTO05230226",
          "nombre": "LORE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513909754",
          "tipo": "particular"
      },
      "-NVA_3SwzexmHji_K9wt": {
          "apellidos": "M.B",
          "correo": "mb@gmail.com",
          "no_cliente": "M.M.TO05230227",
          "nombre": "M.B",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5544492116",
          "tipo": "particular"
      },
      "-NVCT59W4blwt9IQI2_d": {
          "apellidos": "LIIL",
          "correo": "llil@liil.com",
          "no_cliente": "LILITO05230228",
          "nombre": "LIIL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5574018145",
          "tipo": "particular"
      },
      "-NVKtZ78jvxGYGAjz6N7": {
          "apellidos": "BRINGAS ROMERO",
          "correo": "bringasromeroi@gmail.com",
          "no_cliente": "IVBRTO05230229",
          "nombre": "IVAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5560860316",
          "tipo": "particular"
      },
      "-NVVawxSqOICTS6x5ZxZ": {
          "apellidos": "ANDRE",
          "correo": "elandre@andre.com",
          "no_cliente": "ELANTO05230230",
          "nombre": "EL ANDRE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5519055792",
          "tipo": "particular"
      },
      "-NVVcDTNrkjt932k5W0p": {
          "apellidos": "VELAZQUEZ",
          "correo": "asistente@haberf.com.mx",
          "no_cliente": "LIVETO05230231",
          "nombre": "LILIANA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534240386",
          "tipo": "particular"
      },
      "-NVWv4V24jhuLVUhlrDF": {
          "apellidos": "Reyes",
          "correo": "dreyes@grupotatei.com",
          "empresa": "-NVBtArVdRGVhW6ISNDp",
          "no_cliente": "DARECU05230232",
          "nombre": "Daniel",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5510654652",
          "tipo": "flotilla"
      },
      "-NVbX9jucosE7c28VAGL": {
          "apellidos": "Cnales",
          "correo": "angcanales@gmail.com",
          "no_cliente": "ÀNCNCU05230233",
          "nombre": "Àngel",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "55545200",
          "tipo": "particular"
      },
      "-NVea1mExeMIwxy0qW13": {
          "apellidos": "Pérez",
          "correo": "jpalmetto@yahoo.com.mx",
          "no_cliente": "JOPÉCU05230234",
          "nombre": "José Luis",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "7293894956",
          "tipo": "particular"
      },
      "-NVevKJncR_EPEes427L": {
          "apellidos": "ESCALONA",
          "correo": "joel.escalona@gmail.com",
          "no_cliente": "JOESTO05230235",
          "nombre": "JOEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5523136477",
          "tipo": "particular"
      },
      "-NVexmmzf0Je709YHG0u": {
          "apellidos": "BENAVIDES DELGADO",
          "correo": "paty@benavides.com",
          "no_cliente": "ILBETO05230236",
          "nombre": "ILIANA PATRICIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5518264742",
          "tipo": "particular"
      },
      "-NVfQdXZWDJ2H1NuvheN": {
          "apellidos": "Martínez",
          "correo": "oscarf.mh@live.com.mx",
          "no_cliente": "OSMACU05230237",
          "nombre": "Oscar",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5527628081",
          "tipo": "particular"
      },
      "-NVfVahtFqazzVH_blnM": {
          "apellidos": "MARTINEZ",
          "correo": "martinezro33@gmail.com",
          "no_cliente": "JAMATO05230238",
          "nombre": "JAVIER",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5520388793",
          "tipo": "particular"
      },
      "-NVjzNgpofVJlCZCdttb": {
          "apellidos": "OBREGO SILVA",
          "correo": "manuel12obregon@gmail.com",
          "no_cliente": "MAOBTO05230239",
          "nombre": "MANUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5633115115",
          "tipo": "particular"
      },
      "-NVkSV57EShiAutn20Qm": {
          "apellidos": "PEREZ ESCATIN",
          "correo": "patoperez20@gmaiol.com",
          "no_cliente": "PAPETO05230240",
          "nombre": "PATRICIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5527457934",
          "tipo": "particular"
      },
      "-NVq0ETH2ESXQBpcsyuP": {
          "apellidos": "GUZMAN",
          "correo": "andre.guzman@gmail.com",
          "no_cliente": "ANGUTO05230241",
          "nombre": "ANDRE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5551388291",
          "tipo": "particular"
      },
      "-NWIf4gQB_96MkvJwxvo": {
          "apellidos": "ESPINOSA",
          "correo": "frida.espinosa@haiclen.com",
          "no_cliente": "FRESTO05230242",
          "nombre": "FRIDA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5526595744",
          "tipo": "particular"
      },
      "-NWIk0ElbAcAyWZmhn1m": {
          "apellidos": "SALDAÑA",
          "correo": "emmanuel.saldana@gmail.com",
          "no_cliente": "EMSATO05230243",
          "nombre": "EMMANUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5581759675",
          "tipo": "particular"
      },
      "-NWK-F6BtFjONI2B0sw6": {
          "apellidos": "MONTIEL",
          "correo": "fernando.montiel@hotmail.com",
          "no_cliente": "FEMOTO05230244",
          "nombre": "FERNADO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "4621413095",
          "tipo": "particular"
      },
      "-NWOQXCjgDaY_XLC_4W2": {
          "apellidos": "FLORES",
          "correo": "mflores_sip@yahoo.com.mx",
          "no_cliente": "MAFLCU05230245",
          "nombre": "Manuel",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "55451142",
          "tipo": "particular"
      },
      "-NWTH_FDvjOcrQtq7jjJ": {
          "apellidos": "VELEZ",
          "correo": "hugo.velez@gmail.com",
          "no_cliente": "HUVETO05230246",
          "nombre": "HUGO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5535120736",
          "tipo": "particular"
      },
      "-NWTHsAgTtYZuSA8o2qG": {
          "apellidos": "VELEZ",
          "correo": "hugo.velez@gmail.com",
          "no_cliente": "HUVETO05230246",
          "nombre": "HUGO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5535120736",
          "tipo": "particular"
      },
      "-NWdF7EPq9tf6duayk98": {
          "apellidos": "FALLENA",
          "correo": "david.fallena@gmail.com",
          "no_cliente": "DAFATO05230248",
          "nombre": "DAVID",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5552162142",
          "tipo": "particular"
      },
      "-NWdFDUGAtupxBQpZqAR": {
          "apellidos": "FALLENA",
          "correo": "david.fallena@gmail.com",
          "no_cliente": "DAFATO05230248",
          "nombre": "DAVID",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5552162142",
          "tipo": "particular"
      },
      "-NWdGvnHt2G-jZ6K34i2": {
          "apellidos": "FALLENA",
          "correo": "david.falena@gmail.com",
          "no_cliente": "DAFATO05230250",
          "nombre": "DAVID",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5552162142",
          "tipo": "particular"
      },
      "-NWdH5V1jzD5TbbIeoee": {
          "apellidos": "FALLENA",
          "correo": "david.falena@gmail.com",
          "no_cliente": "DAFATO05230250",
          "nombre": "DAVID",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5552162142",
          "tipo": "particular"
      },
      "-NWdbMaqkQyGRc3qk6FS": {
          "apellidos": "CRUZ CASTRO",
          "correo": "jesus.cruz.castro@gmail.com",
          "no_cliente": "JECRTO05230252",
          "nombre": "JESUS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5535668709",
          "tipo": "particular"
      },
      "-NWe-oduarfrKfsPL47v": {
          "apellidos": "GONZALEZ",
          "correo": "nestor.gonzalez@hotmail.com",
          "no_cliente": "NEGOTO05230253",
          "nombre": "NESTOR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5519192561",
          "tipo": "particular"
      },
      "-NWi_q0BV_mnEwB1eACX": {
          "apellidos": "NAVARRETE",
          "correo": "graciela.navarrete@hotmail.com",
          "no_cliente": "GRNATO05230254",
          "nombre": "GRACIELA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5554379874",
          "tipo": "particular"
      },
      "-NWnY0F0CK3n2XSii8gl": {
          "apellidos": "ERIKA BRAVO",
          "correo": "erika.bravo@aaacesa.com",
          "no_cliente": "AAERTO05230255",
          "nombre": "AAACESA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513453429",
          "tipo": "flotilla"
      },
      "-NWnf6MH-0P-q3jXEKfv": {
          "apellidos": "MONTES DE OCA",
          "correo": "guillermo.montesdeoca@hotmail.com",
          "no_cliente": "GUMOTO05230256",
          "nombre": "GUILLERMO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5562229795",
          "tipo": "particular"
      },
      "-NWoNIflh_7eTufI3G5d": {
          "apellidos": "DIAZ",
          "correo": "laura_diasz@gmail.com",
          "no_cliente": "LADITO05230257",
          "nombre": "LAURA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5562955451",
          "tipo": "particular"
      },
      "-NWoOcNhX7--rnIBI_Z7": {
          "apellidos": "VELAZQUEZ",
          "correo": "victor_velazquez01@gmail.com",
          "no_cliente": "VIVETO05230258",
          "nombre": "VICTOR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5576253520",
          "tipo": "particular"
      },
      "-NWregf2Qy77W8HOHMdv": {
          "apellidos": "TERRAZAS SEYFFERT",
          "correo": "luise.terrart@hotmail.com",
          "no_cliente": "LUTETO06230259",
          "nombre": "LUIS ENRIQUE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531417587",
          "tipo": "particular"
      },
      "-NWt1I23hRWXUqQadulq": {
          "apellidos": "AZTEC",
          "correo": "gciarechum@aztec.com",
          "no_cliente": "GEAZTO06230260",
          "nombre": "GERENCIA RECURSOS HUMANOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529476608",
          "tipo": "flotilla"
      },
      "-NX12LrWU8oYNC6ZWh7A": {
          "apellidos": "LABORAL COLSULTING",
          "correo": "barliett@colsulting.com",
          "no_cliente": "BALATO06230261",
          "nombre": "BARLIETT",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5630051890",
          "tipo": "particular"
      },
      "-NXHMjcmPsmH5C6FB-8Y": {
          "apellidos": "PEREZ",
          "correo": "idana.perez@gmail.com",
          "no_cliente": "DIPETO06230262",
          "nombre": "DIANA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5527449006",
          "tipo": "particular"
      },
      "-NXMBqR1j0BQQadteyYe": {
          "apellidos": "ROJAS",
          "correo": "rojas.rojas@march.com",
          "no_cliente": "ROROTO06230263",
          "nombre": "ROJAS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5591980087",
          "tipo": "particular"
      },
      "-NXMS4hSJR-1zdvs0RYy": {
          "apellidos": "Pérez",
          "correo": "maxru_20@hotmail.com",
          "no_cliente": "MOPÉCU06230264",
          "nombre": "Monica",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "55218827",
          "tipo": "particular"
      },
      "-NXR2-6PjSzC8ntLbKYD": {
          "apellidos": "MORA CASTAÑEDA",
          "correo": "laurafermoracas@gmail.com",
          "no_cliente": "LAMOTO06230265",
          "nombre": "LAURA FERNANDA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_fijo": "5534123373",
          "telefono_movil": "5519768020",
          "tipo": "particular"
      },
      "-NXRBpSUypFfutMr0aYl": {
          "apellidos": "GONZALEZ",
          "correo": "oscar@gonzalez.com",
          "no_cliente": "OSGOTO06230266",
          "nombre": "OSCAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5521503921",
          "tipo": "particular"
      },
      "-NXRKGQLEsq_25hBiwkd": {
          "apellidos": "MEHDI",
          "correo": "mehdi@hotmail.com",
          "no_cliente": "MEMETO06230267",
          "nombre": "MEHDI",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5559610918",
          "tipo": "particular"
      },
      "-NXRcr9mZtsaB-tFkOmG": {
          "apellidos": "BARRADO VARGAS",
          "correo": "juanbarradova@gmail.com",
          "no_cliente": "JUBATO06230268",
          "nombre": "JUAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5528857082",
          "tipo": "particular"
      },
      "-NXWL1EL1Jw9gtC_ou_p": {
          "apellidos": "VICTORIA",
          "correo": "jcvictorias@gmail.com",
          "no_cliente": "JUVITO06230269",
          "nombre": "JULIO CESAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5526621653",
          "tipo": "particular"
      },
      "-NXk-hhuUgbH3wYAEbEj": {
          "apellidos": "SA DE CV",
          "correo": "hot-fix@habilitaciones.com",
          "no_cliente": "HOSATO06230270",
          "nombre": "HOT-FIX HABILITACIONES",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5530180396",
          "tipo": "flotilla"
      },
      "-NXkNEIE1_TW2HlLtaLh": {
          "apellidos": "Floriano Garcia",
          "correo": "klflorianog@tecas.com.mx",
          "no_cliente": "KAFLCU06230271",
          "nombre": "Karla Lizbeth",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5548305122",
          "tipo": "particular"
      },
      "-NXkNI1j7gyhOdcnqxJA": {
          "apellidos": "Floriano Garcia",
          "correo": "klflorianog@tecas.com.mx",
          "no_cliente": "KAFLCU06230271",
          "nombre": "Karla Lizbeth",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5548305122",
          "tipo": "particular"
      },
      "-NXkSM6U1AztDpF2xzoy": {
          "apellidos": "VELAZQUEZ",
          "correo": "eduardovelazquez@gmail.com",
          "no_cliente": "EDVETO06230275",
          "nombre": "EDUARDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5584445713",
          "tipo": "particular"
      },
      "-NXps78TGDxkDQaohKSB": {
          "apellidos": "GRAGALES",
          "correo": "miguel.ramirez@outlook.es",
          "no_cliente": "FEGRCO06230265",
          "nombre": "FERNANDO",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_movil": "5518499751",
          "tipo": "particular"
      },
      "-NXqEUJ5jfyhx4vZ0bYi": {
          "apellidos": "SANCHEZ",
          "empresa": "-NXqEK7pYJYL5X-C2Wz9",
          "no_cliente": "JUSACO06230266",
          "nombre": "JULIA",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_movil": "5518499751",
          "tipo": "flotilla"
      },
      "-NXued58_sKbqCiCqdXI": {
          "apellidos": "ORTIZ RAMOS",
          "correo": "elyortizram@gmail.com",
          "no_cliente": "ELORTO06230267",
          "nombre": "ELISA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531867257",
          "tipo": "particular"
      },
      "-NXuoU-rqNOojxsukL-p": {
          "apellidos": "AYALA",
          "no_cliente": "RAAYCI06230268",
          "nombre": "RAUL",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5513453425",
          "tipo": "particular"
      },
      "-NXuyphWehJ1tUw2r3vy": {
          "apellidos": "RXX",
          "no_cliente": "JORXCI06230269",
          "nombre": "JONATHAN",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5538767737",
          "tipo": "particular"
      },
      "-NXvD5ehEPibA2IUp3id": {
          "apellidos": "HERNANDEZ",
          "correo": "e.hernandez@fortius.com.mx",
          "empresa": "-NXvCii3hCxnpHnM_ep-",
          "no_cliente": "ERHECI06230270",
          "nombre": "ERICK",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5519025644",
          "tipo": "flotilla"
      },
      "-NXvH9rAzu19FUQpRTdS": {
          "apellidos": "ADISSI",
          "correo": "alberto.adissi@kbi.com",
          "no_cliente": "ADADTO06230271",
          "nombre": "ADALBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5561995598",
          "tipo": "particular"
      },
      "-NXvKuDguE0jOQQh8ZLA": {
          "apellidos": "MARIN",
          "correo": "YO.MARIN@HOTMAIL.COM",
          "no_cliente": "YOMATO06230272",
          "nombre": "YO YO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7221555785",
          "tipo": "particular"
      },
      "-NXvX6Ccma6nQ1nTrYNl": {
          "apellidos": "OSORNO",
          "correo": "compras.nacionales@coriat.com.mx",
          "empresa": "-NXvWGw7iCAPBfC3EJhc",
          "no_cliente": "AMOSCI06230273",
          "nombre": "AMBROCIO",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5521580030",
          "tipo": "flotilla"
      },
      "-NXzjFtLT1v9i-JSYKyG": {
          "apellidos": "SAN JOSE",
          "correo": "miguelsanjose790120@hotmail.com",
          "no_cliente": "MISATO06230274",
          "nombre": "MIGUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531279575",
          "tipo": "particular"
      },
      "-NY--0ewNFfB8B6lCtff": {
          "apellidos": "CORTES GONZALEZ",
          "correo": "isel.cortes.g@gmail.com",
          "no_cliente": "MACOTO06230275",
          "nombre": "MARIA ISEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5514238698",
          "tipo": "particular"
      },
      "-NY-5BeAFPuyROdAzvTQ": {
          "apellidos": "IVAN",
          "correo": "ivan@ivan.com.mx",
          "no_cliente": "IVIVTO06230276",
          "nombre": "IVAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5560059149",
          "tipo": "particular"
      },
      "-NY-PjT_wWrtiWkSuoXt": {
          "apellidos": "RODRIGUEZ BUCIO",
          "correo": "axcel@lispro.com",
          "no_cliente": "AXROTO06230277",
          "nombre": "AXCEL ERIC",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5591443463",
          "tipo": "particular"
      },
      "-NY-g45aEY2625_Aili7": {
          "apellidos": "Rico",
          "correo": "rico51@live.commx",
          "no_cliente": "JORICU06230278",
          "nombre": "José Manuel",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5556321867",
          "tipo": "particular"
      },
      "-NY3qBu9gy9h3lXIZMI-": {
          "apellidos": "PAREDES ZAMORA",
          "correo": "dr.paredeszamora@gmail.com",
          "no_cliente": "JUPATO06230279",
          "nombre": "JUAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531453128",
          "tipo": "particular"
      },
      "-NY42bYIeVHd1AT-38yF": {
          "apellidos": "VARGAS",
          "correo": "jonyvargas@gmail.com",
          "no_cliente": "JOVATO06230280",
          "nombre": "JONATHAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539540461",
          "tipo": "particular"
      },
      "-NY4GCxcDlZRoAvKpkk6": {
          "apellidos": "MORALES MARTINEZ",
          "correo": "yurian2392@gmail.com",
          "no_cliente": "YUMOTO06230281",
          "nombre": "YURIAN OMAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5554361300",
          "tipo": "particular"
      },
      "-NY4RXCXMffU7J8gOiHc": {
          "apellidos": "REYES REYES",
          "correo": "belenreyesreyes@hotmail.com",
          "no_cliente": "BERETO06230282",
          "nombre": "BELEN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5530162737",
          "tipo": "particular"
      },
      "-NY4kWOaddGcbdsKw3MI": {
          "apellidos": "MATIAS",
          "correo_sec": "marisol@taifelds.com.mx",
          "empresa": "-NY4jyl4Davu1Q72yu2E",
          "no_cliente": "MAMACI06230283",
          "nombre": "MARISOL MATIAS",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5552982513",
          "tipo": "flotilla"
      },
      "-NY4lThFX4PlcfDyaRoZ": {
          "apellidos": "MATIAS",
          "correo_sec": "marisol@taifelds.com.mx",
          "empresa": "-NY4jyl4Davu1Q72yu2E",
          "no_cliente": "MAMACI06230284",
          "nombre": "MARISOL",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5552982513",
          "tipo": "flotilla"
      },
      "-NY9GhlJPah2TVJkyvrP": {
          "apellidos": "MATIAS",
          "correo": "marisol@taifelds.com.mx",
          "no_cliente": "MAMACI06230285",
          "nombre": "MARISOL",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5552982513",
          "tipo": "particular"
      },
      "-NY9lMggDA3ff0eLsAgP": {
          "apellidos": "Rojas",
          "correo": "armandors22@hotmail.com",
          "no_cliente": "ARROCU06230286",
          "nombre": "Armando",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5563587779",
          "tipo": "particular"
      },
      "-NY9tr-SXy0gSMGwIBiN": {
          "apellidos": "MEENA",
          "correo": "kamal@meena.com",
          "no_cliente": "KAMETO06230287",
          "nombre": "KAMAL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "9953076369",
          "tipo": "particular"
      },
      "-NYJjAyDnQfNhEJzP9Yn": {
          "apellidos": "JORGE MARTINEZ",
          "correo": "jorge.martinez@kcg.com",
          "no_cliente": "KCJOTO06230288",
          "nombre": "KCG",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5853016906",
          "tipo": "particular"
      },
      "-NYJljpJNcTz69AmXwZA": {
          "apellidos": "MORALES",
          "correo": "javier.morales@yahoo.com.mx",
          "no_cliente": "JAMOTO06230289",
          "nombre": "JAVIER",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5546418044",
          "tipo": "particular"
      },
      "-NYKL1AWtetkg6OuQ1mn": {
          "apellidos": "CRUZ CRUZ",
          "correo": "israelcruzcruz@gmail.com",
          "no_cliente": "ISCRTO06230290",
          "nombre": "ISRAEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5532615598",
          "tipo": "particular"
      },
      "-NYPnc4xMgE-tKa5ZPzD": {
          "apellidos": "HAM",
          "correo": "fransico_ham@yahoo.com",
          "no_cliente": "FRHATO06230291",
          "nombre": "FRANCISCO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5524267102",
          "tipo": "particular"
      },
      "-NYPqXlfz-pE3NQkq3gY": {
          "apellidos": "MEDINA",
          "correo": "sami.medina@gmail.com",
          "no_cliente": "SAMETO06230292",
          "nombre": "SAMUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7221555785",
          "tipo": "particular"
      },
      "-NYTcfIANkIhfFodUWes": {
          "apellidos": "GARDUÑO",
          "correo": "garduno_isaac@outlook.com",
          "no_cliente": "ISGATO06230293",
          "nombre": "ISAAC",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5633410496",
          "tipo": "particular"
      },
      "-NYZ06Ch1-2v0ahBmjpq": {
          "apellidos": "CORDOBA",
          "correo": "bobert.cordoba@outlook.com",
          "no_cliente": "ROCOTO06230294",
          "nombre": "ROBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5591857344",
          "tipo": "particular"
      },
      "-NYZ8g2Q25nB_iHurPjf": {
          "apellidos": "GONZALEZ",
          "correo": "jagonbarc@gmail.com",
          "empresa": "-NYZ8HJPar_yRQgP-874",
          "no_cliente": "JOGOCI06230295",
          "nombre": "JOSE ALBERTO",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5539338214",
          "tipo": "flotilla"
      },
      "-NY_UJjMb45203H-SyOf": {
          "apellidos": "MAYRA GONZALEZ",
          "correo": "mayra.gonzalez@vemo.com.mx",
          "no_cliente": "VEMATO06230296",
          "nombre": "VEMO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5621004381",
          "tipo": "particular"
      },
      "-NY_hcgG8ZW8B0PwqVsO": {
          "apellidos": "ANDREW",
          "correo": "andrew@adrew.com",
          "no_cliente": "ANANTO06230297",
          "nombre": "ANDREW",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513848362",
          "tipo": "particular"
      },
      "-NYd5eqiK4xHrjJzez6q": {
          "apellidos": "CRUZ ROMERO",
          "correo": "pgcrurom@gmail.com",
          "no_cliente": "PACRTO06230298",
          "nombre": "PABLO GIOVANNI",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5585449222",
          "tipo": "particular"
      },
      "-NYde7XLPGnL4fFfYyHB": {
          "apellidos": "EL TERRIBLE",
          "correo": "elterrible@sincorreo.com",
          "no_cliente": "TEELTO06230299",
          "nombre": "TERRIBLE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5522540713",
          "tipo": "particular"
      },
      "-NYdnECjp2t74YQheVmS": {
          "apellidos": "FLORES SA DE CV",
          "correo": "erik.hernandez@trasnflores.com",
          "no_cliente": "TRFLTO06230300",
          "nombre": "TRANSPORTES ESPECIALIZADOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529472851",
          "tipo": "particular"
      },
      "-NYe5ieMTIukfzZTCpXS": {
          "apellidos": "VAZQUEZ",
          "correo": "emilio.vazquez@gmail.com",
          "no_cliente": "EMVATO06230301",
          "nombre": "EMILIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5549565939",
          "tipo": "particular"
      },
      "-NYeDPIufFh5xEDYYQnW": {
          "apellidos": "GALVEZ",
          "correo": "alan.galvez@gmail.com",
          "no_cliente": "ALGATO06230302",
          "nombre": "ALAN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5580115296",
          "tipo": "particular"
      },
      "-NYhlpyjnGudOP2FhAyR": {
          "apellidos": "CASTILLO",
          "correo": "antonio.castillo@gmail.com",
          "no_cliente": "ANCATO06230303",
          "nombre": "ANTONIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5510482400",
          "tipo": "particular"
      },
      "-NYsu4Dmh4VozshgiQ-q": {
          "apellidos": "TAPIA",
          "correo": "jeamine.tapia@gmail.com",
          "no_cliente": "JETATO06230304",
          "nombre": "JEAMINE",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5538920512",
          "tipo": "particular"
      },
      "-NYsvscGgbKel37ryuXD": {
          "apellidos": "VALDIVIESO",
          "correo": "luis.valdivieso@hotmail.com",
          "no_cliente": "LUVATO06230305",
          "nombre": "LUIS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534446072",
          "tipo": "particular"
      },
      "-NYt08Nav1zH-DUHqTlR": {
          "apellidos": "KABLY",
          "correo": "carlos.kably@gmail.com",
          "no_cliente": "CAKATO06230306",
          "nombre": "CARLOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5527277266",
          "tipo": "particular"
      },
      "-NYxbYyCvrWKtDlLrLsR": {
          "apellidos": "MELO",
          "correo": "erika.melo@gmail.com",
          "no_cliente": "ERMETO06230307",
          "nombre": "ERIKA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513776394",
          "tipo": "particular"
      },
      "-NYz2A_K3IEmVxdzoi5l": {
          "apellidos": "CELIS",
          "correo": "ARAMONCELISR69@HOTMAIL.COM",
          "no_cliente": "JUCETO06230308",
          "nombre": "JUAN RAMON",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "6144273492",
          "tipo": "particular"
      },
      "-NZ36veTMDPH8M3zbl4w": {
          "apellidos": "MAYA GUERRERO",
          "correo": "johann.guerrerog@gmail.com",
          "no_cliente": "JOMATO06230309",
          "nombre": "JOHANN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5636256227",
          "tipo": "particular"
      },
      "-NZ6YyXeAjxLotvCb_j7": {
          "apellidos": "RAUL APARICIO",
          "correo": "raul.aparicio@tscsoluciones.com",
          "no_cliente": "TSRATO06230310",
          "nombre": "TSC SOLUCIONES EN TECNOLOGIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531856931",
          "tipo": "particular"
      },
      "-NZCWDdJqDM37CceIiiK": {
          "apellidos": "CRONOS",
          "correo": "cronos@cronos.com",
          "no_cliente": "CRCRTO06230311",
          "nombre": "CRONOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5518548880",
          "tipo": "particular"
      },
      "-NZGxNaimX5QDXt1G5Tb": {
          "apellidos": "ZAPATA",
          "correo": "filizapata@hotmail.com",
          "no_cliente": "FIZATO07230312",
          "nombre": "FILIBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5571119423",
          "tipo": "particular"
      },
      "-NZGzq3PwYeaR_HuxRIE": {
          "apellidos": "VARGAS",
          "correo": "gabriel.vargas@hotmail.com",
          "no_cliente": "GAVATO07230313",
          "nombre": "GABRIEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5510898755",
          "tipo": "particular"
      },
      "-NZRYSKlJOYzdrQGlinK": {
          "apellidos": "ARCOS",
          "correo": "joel.arcos@hotmail.com",
          "no_cliente": "JOARTO07230314",
          "nombre": "JOEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5524971004",
          "tipo": "particular"
      },
      "-NZSe1IM1qphMVDwk-cu": {
          "apellidos": "BERESTAIN",
          "correo": "robertoberstainramirez@telmex.com",
          "no_cliente": "DOBETO07230315",
          "nombre": "DOMINGO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5510147057",
          "tipo": "particular"
      },
      "-NZWWfQypBUvPfn2i3E2": {
          "apellidos": "EZP",
          "correo": "ezq@ezp.com",
          "no_cliente": "EZEZTO07230316",
          "nombre": "EZP",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5558071554",
          "tipo": "particular"
      },
      "-NZXPKIk-dBgxf6rE5I5": {
          "apellidos": "VILLALOBOS",
          "correo": "rodrigo.villalobos@hotmail.com",
          "no_cliente": "ROVITO07230317",
          "nombre": "RODRIGO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5580408480",
          "tipo": "particular"
      },
      "-NZbrs8SUU0UVZCor6Ie": {
          "apellidos": "SANTIAGO MUÑOZ",
          "correo": "albertosantiagomunoz@gmail.com",
          "no_cliente": "ALSATO07230318",
          "nombre": "ALBERTO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5518215886",
          "tipo": "particular"
      },
      "-NZfdW_WKCSpw9HnfTgQ": {
          "apellidos": "DE CONTADO",
          "correo": "sin_@correo.com",
          "no_cliente": "CLDETO07230319",
          "nombre": "CLIENTE GENERAL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5516869573",
          "tipo": "particular"
      },
      "-NZmDxRavrax6Y5ZIRrj": {
          "apellidos": "LAU",
          "correo": "lau.lau@hotmail.com",
          "no_cliente": "LALATO07230320",
          "nombre": "LAU",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534005128",
          "tipo": "particular"
      },
      "-N_-xvbmKvm6vz9ReSYc": {
          "apellidos": "RAMOS",
          "correo": "armando.ramos@gmail.com",
          "no_cliente": "ARRATO07230321",
          "nombre": "ARMANDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "6192180804",
          "tipo": "particular"
      },
      "-N_4ZsHYym3Rcic8HHtG": {
          "apellidos": "TORRES",
          "correo": "manu.torres@hotmail.com",
          "no_cliente": "MATOTO07230322",
          "nombre": "MANU",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5628327032",
          "tipo": "particular"
      },
      "-N_649_Gv_OzcxGNFS95": {
          "apellidos": "Y NEGOCIOS EN EXTERIORES",
          "correo_sec": "jlflores@emblem.mx",
          "no_cliente": "CAY CI07230323",
          "nombre": "CARTELERAS",
          "sucursal": "-N2glQ18dLQuzwOv3Qe3",
          "telefono_movil": "5540447871",
          "tipo": "particular"
      },
      "-N_6ACxYp4ELPvN7P0J4": {
          "apellidos": "EXTERIORES SA DE CV",
          "correo": "jlflores@emblem.mx",
          "no_cliente": "CAEXTO07230324",
          "nombre": "CARTELERAS Y NEGOCIOS EN",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5540447871",
          "tipo": "particular"
      },
      "-N_6AsqXrw_0xoiNFjsy": {
          "apellidos": "FRANCISCO",
          "correo": "francisco.francisco@gmail.com",
          "no_cliente": "FRFRTO07230325",
          "nombre": "FRANCISCO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5562532045",
          "tipo": "particular"
      },
      "-N_6DTO0p9WAtZ8HzH7C": {
          "apellidos": "PIMENTEL",
          "correo": "cesarpimentel562@gmail.com",
          "no_cliente": "CEPITO07230326",
          "nombre": "CESAR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534240383",
          "tipo": "particular"
      },
      "-N_6MUrs8um6okwPj7Ph": {
          "apellidos": "SANCHEZ",
          "correo": "cristina.sanchez@gmail.com",
          "no_cliente": "CRSATO07230327",
          "nombre": "CRISTINA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5518299747",
          "tipo": "particular"
      },
      "-N_9Q0UJ2oUNS_Ia9Axw": {
          "apellidos": "LOPEZ",
          "correo": "felix.lopez@sisal.com",
          "no_cliente": "FELOTO07230328",
          "nombre": "FELIX",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5566112189",
          "tipo": "particular"
      },
      "-N_9s_2vFAJfOoPbuh-1": {
          "apellidos": "CRUZ MEDINA",
          "correo": "evacruzmedina70@hotmail.com",
          "no_cliente": "EVCRTO07230329",
          "nombre": "EVA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5519129849",
          "tipo": "particular"
      },
      "-N_ACY8AF0TmvvHnGOb3": {
          "apellidos": "Guerrero Alvarez",
          "correo": "guerrero.alvarez.claudia@gmail.com",
          "no_cliente": "CLGUCU07230323",
          "nombre": "Claudia",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5531051398",
          "tipo": "particular"
      },
      "-N_EytcmG6_2k9xgCxWl": {
          "apellidos": "Cardona",
          "correo": "aratx020131@gmail.com",
          "no_cliente": "ARCACU07230331",
          "nombre": "Arantza",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "2481723780",
          "tipo": "particular"
      },
      "-N_FQPZbcEwMa3lZWM2O": {
          "apellidos": "Martínez García",
          "correo": "marcomartinez1@outlook.com",
          "no_cliente": "MAMACU07230332",
          "nombre": "Marco Antonio",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5628504764",
          "tipo": "particular"
      },
      "-N_G4JFTKuHMwzXOW0X2": {
          "apellidos": "MEXICO SA DE CV",
          "correo": "alejandro.micarelli@dibalanzas.com",
          "no_cliente": "DIMETO07230333",
          "nombre": "DI BALANZAS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5639566792",
          "tipo": "particular"
      },
      "-N_K8B_P4CWPq9uxI2pR": {
          "apellidos": "ACUÑA PIÑA",
          "correo": "davis.acuna.pina@gmail.com",
          "no_cliente": "DAACTO07230334",
          "nombre": "DAVID",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5533217170",
          "tipo": "particular"
      },
      "-N_KTzf2KPgOOK2MM4lY": {
          "apellidos": "FERNANDEZ GARRIDO",
          "correo": "dr.fernandez.garrido@gmail.com",
          "no_cliente": "ANFETO07230335",
          "nombre": "ANTONIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5541353332",
          "tipo": "particular"
      },
      "-N_PFDzRTZAsn7flpqqD": {
          "apellidos": "KAST",
          "correo": "hector.kast@hotmail.com",
          "no_cliente": "HEKATO07230336",
          "nombre": "HECTOR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531887738",
          "tipo": "particular"
      },
      "-N_Z_4Q9n8p2gPmSha8e": {
          "apellidos": "ROJAS",
          "correo": "pascual.rofasj@hotmail.com",
          "no_cliente": "PAROTO07230337",
          "nombre": "PASCUAL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7771625878",
          "tipo": "particular"
      },
      "-N_ZuzU9W4sOZQkZBF40": {
          "apellidos": "ramirez",
          "no_cliente": "MIRACO07230338",
          "nombre": "miguel",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_movil": "5527379339",
          "tipo": "particular"
      },
      "-N__QbkJzHka0KOgMDGp": {
          "apellidos": "CHAVEZ",
          "correo": "jc.chavez@hotmail.com",
          "no_cliente": "JUCHTO07230339",
          "nombre": "JUAN CARLOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5538802439",
          "tipo": "particular"
      },
      "-N__Wqu5_sQTZMSCuvfX": {
          "apellidos": "MAZDA3",
          "correo": "mazdares@mazda.com",
          "no_cliente": "MAMATO07230340",
          "nombre": "MAZDA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5611777814",
          "tipo": "particular"
      },
      "-N_do2YZ_tnJKITxtiYa": {
          "apellidos": "SA DE CV",
          "correo": "jorge@bizarro.com.mx",
          "no_cliente": "BASATO07230341",
          "nombre": "BAÑAS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5555766565",
          "tipo": "particular"
      },
      "-N_eijcehqTkXYscm01S": {
          "apellidos": "ORO MONDRAGON",
          "correo": "tonoromondra@gmail.com",
          "no_cliente": "LUORTO07230342",
          "nombre": "LUIS ANTONIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5579506186",
          "tipo": "particular"
      },
      "-N_fiIPQMwU70qPvzgDX": {
          "apellidos": "PEREZ GARCIA",
          "correo": "celiperezgarcia@gmail.com",
          "no_cliente": "CEPETO07230343",
          "nombre": "CECILIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5527296721",
          "tipo": "particular"
      },
      "-N_jqTVXrXfbNmBAPK_O": {
          "apellidos": "LEDEZMA DAVILA",
          "correo": "armandoledezmadavila@gmail.com",
          "no_cliente": "ARLETO07230344",
          "nombre": "ARMANDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "8111161637",
          "tipo": "particular"
      },
      "-N_kJ3t9C0sS46ZHadet": {
          "apellidos": "Air",
          "correo": "recepcion@q-mexibras.com.mx",
          "no_cliente": "SMAICU07230345",
          "nombre": "Smart",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5559568201",
          "tipo": "particular"
      },
      "-N_kUrNTjlFlMiS2Motr": {
          "apellidos": "González",
          "correo": "cnolasco@yahoo.com",
          "empresa": "-NPdhPjsoun8NuO_ZJf1",
          "no_cliente": "CÉGOCU07230346",
          "nombre": "César",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5532334571",
          "tipo": "flotilla"
      },
      "-N_o6DMGLbNyVz6FaiUJ": {
          "apellidos": "PROMOSANTELL",
          "correo": "promosantell@yahoo.com.mx",
          "no_cliente": "COPRCU07230347",
          "nombre": "COMERCIALIZADORA",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5544397403",
          "tipo": "particular"
      },
      "-N_pLOBzMxdOhc98fixt": {
          "apellidos": "VALLE",
          "correo": "julio.valle@gmail.com",
          "no_cliente": "JUVATO07230348",
          "nombre": "JULIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539662453",
          "tipo": "particular"
      },
      "-N_pW_Vv0mMM-mhnxDk8": {
          "apellidos": "S.A. de C.V.",
          "correo": "ventas@lamamademale.com",
          "no_cliente": "ALS.CU07230349",
          "nombre": "Alimentos la mamá de Male",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5624633252",
          "tipo": "particular"
      },
      "-N_uVw5lvqybECMro2Xo": {
          "apellidos": "RUIZ",
          "correo": "dr.ruiz@gmail.com",
          "no_cliente": "DORUTO07230350",
          "nombre": "DOCTOR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "8126651193",
          "tipo": "particular"
      },
      "-Na916vU1przLG2Yi_Zt": {
          "apellidos": "LOPEZ SANCHEZ",
          "correo": "diegoisaacls@prodigy.net",
          "no_cliente": "DILOTO07230351",
          "nombre": "DIAEGO ISAAC",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5533456068",
          "tipo": "particular"
      },
      "-NaDEObucm2uHXHbN_pr": {
          "apellidos": "SANCHEZ ZARZA",
          "correo": "miguelsanzz@prodigy.net",
          "no_cliente": "MISATO07230352",
          "nombre": "MIGUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5520907754",
          "tipo": "particular"
      },
      "-NaEYa1me0c2AfTXJChD": {
          "apellidos": "CRUZ GARCIA",
          "correo": "fcruz@foodpak.mx",
          "no_cliente": "SACRTO07230353",
          "nombre": "SAMUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "8120222998",
          "tipo": "particular"
      },
      "-NaIG4HLSgfNJgHj_mbw": {
          "apellidos": "NAVA ROJAS",
          "correo": "marianavarojas@gmail.com",
          "no_cliente": "MANATO07230354",
          "nombre": "MARIA NATIVIDAD",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5521049487",
          "tipo": "particular"
      },
      "-NaNJxfbSdzaF_djoffo": {
          "apellidos": "VELEZ",
          "correo": "adriana.velez@fantasykids.com.mx",
          "no_cliente": "ADVETO07230355",
          "nombre": "ADRIANA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5580379763",
          "tipo": "particular"
      },
      "-NaNxUqgXHFjp9XQvIHL": {
          "apellidos": "JUAREZ",
          "correo": "silvano.juarez@gmail.com",
          "no_cliente": "SIJUTO07230356",
          "nombre": "SILVANO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5512342937",
          "tipo": "particular"
      },
      "-NaOEx4nllp-kxQAmXK3": {
          "apellidos": "VELASCO RODRIGUEZ",
          "correo": "inocencio.velasquesr@terra.com",
          "no_cliente": "INVETO07230357",
          "nombre": "INOCENCIO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7299488522",
          "tipo": "particular"
      },
      "-NaRvYwoQaPDzJiKkZDC": {
          "apellidos": "MARTINEZ",
          "correo": "david.martinez@hotmail.com",
          "no_cliente": "DAMATO07230358",
          "nombre": "DAVID",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5523068959",
          "tipo": "particular"
      },
      "-NaXTKF5gJGIVxMIg-td": {
          "apellidos": "CHARLY G",
          "correo": "charly.g@gmail.com",
          "no_cliente": "CACHTO07230359",
          "nombre": "CARLOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5614723862",
          "tipo": "particular"
      },
      "-Nah81czgpA6F7jQNRwM": {
          "apellidos": "BENAVIDES DELGADO",
          "correo": "lilianapvenabides@hotmail.com",
          "no_cliente": "LIBETO07230360",
          "nombre": "LILIANA PATRICIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5518264742",
          "tipo": "particular"
      },
      "-Nai5G7NGoSjhWgS-of9": {
          "apellidos": "SANTIAGO SANTIAGO",
          "correo": "manuel.santiago.santiago@hotmail.com",
          "no_cliente": "MASATO07230361",
          "nombre": "MANUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5526846527",
          "tipo": "particular"
      },
      "-NaiaLqfq_3h3SqeHVKd": {
          "apellidos": "GUEVARA DIEZ",
          "correo": "carlos.guevaradiez@gmail.com",
          "no_cliente": "CAGUTO07230362",
          "nombre": "CARLOS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5528597594",
          "tipo": "particular"
      },
      "-NamCopHUZBzif-300fC": {
          "apellidos": "GUZMAN",
          "correo": "miguelangel.cuzman10@gmail.com",
          "no_cliente": "MIGUTO08230363",
          "nombre": "MIGUEL ANGEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5572009160",
          "tipo": "particular"
      },
      "-NamJ2vx8GCmo-f4QGAW": {
          "apellidos": "TORRES",
          "correo": "manueltorres@outlook.com",
          "no_cliente": "MATOTO08230364",
          "nombre": "MANUEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539015926",
          "tipo": "particular"
      },
      "-NarLzZzwKQsdQKnmGCS": {
          "apellidos": "CRUZ FLORES",
          "correo": "salvador.cruzf@gmail.com",
          "no_cliente": "SACRTO08230365",
          "nombre": "SALVADOR",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5578722255",
          "tipo": "particular"
      },
      "-NasbJIkOtmGIOwwdiU9": {
          "apellidos": "MARTINEZ PEREZ",
          "correo": "brendamtzp@gmail.com",
          "no_cliente": "BRMATO08230366",
          "nombre": "BRENDA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5523209430",
          "tipo": "particular"
      },
      "-NawxjuZLb50IG4fX5Qu": {
          "apellidos": "MONSIVAIS",
          "correo": "nadres.monsavais@agmcontrucciones.com",
          "no_cliente": "ANMOTO08230367",
          "nombre": "ANDRES",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5540846838",
          "tipo": "particular"
      },
      "-Nb0-Ralq2-qNR9BqoLG": {
          "apellidos": "AMAYA BARBOSA",
          "correo": "magdiel.amaya.barbosa@gmail.com",
          "no_cliente": "MAAMTO08230368",
          "nombre": "MAGDIEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5520068748",
          "tipo": "particular"
      },
      "-Nb0e6VeHbADNz9STKwN": {
          "apellidos": "VPN SAPI DE CV",
          "correo": "lalopaguirre@gmail.com",
          "no_cliente": "REVPTO08230369",
          "nombre": "RESTAURANTES",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7295453605",
          "tipo": "particular"
      },
      "-Nb0jaH9il5dcwmJ1rc_": {
          "apellidos": "MARTINEZ BAUTISTA",
          "correo": "fher_mb@hotmail.com",
          "no_cliente": "FEMATO08230370",
          "nombre": "FERNANDO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5541855035",
          "tipo": "particular"
      },
      "-NbUqc8m-eD3q1UYUh4S": {
          "apellidos": "MERA",
          "correo": "luis.mera@hotmail.com",
          "no_cliente": "LUMETO08230371",
          "nombre": "LUIS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5527125993",
          "tipo": "particular"
      },
      "-NbVhLVXzmDtWzS8W2fI": {
          "apellidos": "VERNAL",
          "correo": "johandavid.venal@hotmail.com",
          "no_cliente": "JOVETO08230372",
          "nombre": "JOHAN DAVID",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5561017058",
          "tipo": "particular"
      },
      "-NbVkMac6hZvSZqPM2dF": {
          "apellidos": "PETER",
          "correo": "peter@peter.com",
          "no_cliente": "PEPETO08230373",
          "nombre": "PETER",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5579403289",
          "tipo": "particular"
      },
      "-NbVrKPxqkOPFL3QZAJW": {
          "apellidos": "MARTINEZ ALVAREZgus",
          "correo": "gusz2309@gmail.com",
          "no_cliente": "GUMATO08230374",
          "nombre": "GUSTAVO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534559264",
          "tipo": "particular"
      },
      "-NbW5xG6w6J_T0iIouZT": {
          "apellidos": "ANDRADE",
          "correo": "paty.andrade@gmail.com",
          "no_cliente": "PAANTO08230375",
          "nombre": "PATRICIA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5552524674",
          "tipo": "particular"
      },
      "-Nb_6aUDeL0SsGdO22kC": {
          "apellidos": "ANDRADE",
          "correo": "jesus.andrade@hotmail.com",
          "no_cliente": "JEANTO08230376",
          "nombre": "JESUS",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5554008684",
          "tipo": "particular"
      },
      "-Nb_UMl1bW3qtZyKdMP-": {
          "apellidos": "CONSUELO",
          "correo": "guillermo.consuelo@gmail.com",
          "no_cliente": "GUCOTO08230377",
          "nombre": "GUILLERMO",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5570305501",
          "tipo": "particular"
      },
      "-Nb_ne6hEXKCYVcKb752": {
          "apellidos": "ESPARZA",
          "correo": "fernanda.esparza@odelnorte.com",
          "no_cliente": "FEESTO08230378",
          "nombre": "FERNANDA",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5593032214",
          "tipo": "particular"
      },
      "-Nb_yIYHmkLMNyD1NatW": {
          "apellidos": "MORALES FONSECA",
          "correo": "iraidesmoralesfonseca@yahoo.com",
          "no_cliente": "IRMOTO08230379",
          "nombre": "IRAIDES",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5510729536",
          "tipo": "particular"
      },
      "-NbaWw93aswng67aU92_": {
          "apellidos": "COUTIÑO",
          "correo": "itzelita.coutino@gmail.com",
          "no_cliente": "ITCOTO08230380",
          "nombre": "ITZEL",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5561418547",
          "tipo": "particular"
      },
      "-NbofBHoB3tdmLRLTVcf": {
          "apellidos": "AZTECA A.C.",
          "correo": "oscar.garciat@elektra.com.mx",
          "no_cliente": "FUAZTO08230381",
          "nombre": "FUNDACION",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5530294542",
          "tipo": "particular"
      },
      "-Nbpt-reM4CHJLg1dMix": {
          "apellidos": "RODRIGUEZ",
          "correo": "mario.rodriguez@gmail.com",
          "no_cliente": "MAROTO08230290",
          "nombre": "MARIO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5531678136",
          "tipo": "particular"
      },
      "-NbzmmKFij9X6M0g7VPF": {
          "apellidos": "GOMEZ SAAVEDRA",
          "correo": "fer.gomez.saavedra@gmail.com",
          "no_cliente": "FEGOTO08230291",
          "nombre": "FERNANDO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7298978151",
          "tipo": "particular"
      },
      "-Nc-B8ybIEA_7WR9UnmL": {
          "apellidos": "GUTIERREZ",
          "correo": "antonio.gutiereez@gmail.com",
          "no_cliente": "ANGUTO08230292",
          "nombre": "ANTONIO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5580682356",
          "tipo": "particular"
      },
      "-Nc-QNMIDt289q0vt3VM": {
          "apellidos": "BECERRA LEMUS",
          "correo": "carla.becerra@airlisesevice.com",
          "no_cliente": "CABETO08230293",
          "nombre": "CARLA",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5572483236",
          "tipo": "particular"
      },
      "-Nc3BBef77bWlRds_Ojz": {
          "apellidos": "GARCIA QUINERA",
          "correo": "joaquingarcia_vw@hotmail.com",
          "no_cliente": "JOGATO08230294",
          "nombre": "JOAQUIN",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5581008552",
          "tipo": "particular"
      },
      "-Nc3LHn1sVVu7c3d1Xp8": {
          "apellidos": "VIHU",
          "correo": "dara_vihu@gmail.com",
          "no_cliente": "DAVITO08230295",
          "nombre": "DARA",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5610077682",
          "tipo": "particular"
      },
      "-Nc3OOgH4a5lKc9evPjI": {
          "apellidos": "J EDGE",
          "correo": "j.10@hotmail.com",
          "no_cliente": "J J TO08230296",
          "nombre": "J J",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5570465360",
          "tipo": "particular"
      },
      "-Nc8INZugZLUtkM2YRfs": {
          "apellidos": "CIBERNA",
          "correo": "ciberna1976@hotmail.com",
          "no_cliente": "MACITO08230297",
          "nombre": "MANUEL",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5555016305",
          "tipo": "particular"
      },
      "-Nc9bktWZAX7SUu_S-oM": {
          "apellidos": "VILCHIS",
          "correo": "carlos.vilchis@gmail.com",
          "no_cliente": "CAVITO08230298",
          "nombre": "CARLOS",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5520359818",
          "tipo": "particular"
      },
      "-NcDLkyruXEL0MapCUuw": {
          "apellidos": "PAU",
          "correo": "pau.pau@hotmail.com",
          "no_cliente": "PAPATO08230299",
          "nombre": "PAU",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5539265250",
          "tipo": "particular"
      },
      "-NcO-oIsGuB17C3Y1GPg": {
          "apellidos": "MOTA",
          "correo": "alfy.mota@gmail.com",
          "no_cliente": "ALMOTO08230300",
          "nombre": "ALFY",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5549711351",
          "tipo": "particular"
      },
      "-NcO4ZB-qM_P89AjKhye": {
          "apellidos": "G.S.",
          "correo": "fabian_gs@gmail.com",
          "no_cliente": "FAG.TO08230301",
          "nombre": "FABIAN",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5542671397",
          "tipo": "particular"
      },
      "-NcOtjCORQvHxBV-QRru": {
          "apellidos": "OLGUIN",
          "correo": "anacontacto@yahoo.com",
          "no_cliente": "ANOLCU08230073",
          "nombre": "ANA LILIA",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5632561906",
          "tipo": "particular"
      },
      "-NcTQECGCOYQTFJBNfx9": {
          "apellidos": "CASTILLO",
          "correo": "victor.carillo@hotmail.com",
          "no_cliente": "VICATO08230302",
          "nombre": "VICTOR",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5510101962",
          "tipo": "particular"
      },
      "-NcUANwAUm12HuuOj3a6": {
          "apellidos": "MORALES",
          "correo": "francisco.morales@hotmail.com",
          "no_cliente": "FRMOTO08230303",
          "nombre": "FRANCISCO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5549711351",
          "tipo": "particular"
      },
      "-NcUHB06k7uicGWDnmn-": {
          "apellidos": "NARCISO",
          "correo": "victor.nacrico@uniblock.com",
          "no_cliente": "VINATO08230304",
          "nombre": "VICTOR",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5543519830",
          "tipo": "particular"
      },
      "-NcUKZ_Z9Gj0KvLojdy2": {
          "apellidos": "PEREZ",
          "correo": "santiago.perez@gmail.com",
          "no_cliente": "SAPETO08230305",
          "nombre": "SANTIAGO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5616421115",
          "tipo": "particular"
      },
      "-NcUYbIjnRB1J9DqL0QM": {
          "apellidos": "V FIESTA",
          "correo": "alex.v.fiesta@outlokk.com",
          "no_cliente": "ALV TO08230306",
          "nombre": "ALEJANDRO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5513329197",
          "tipo": "particular"
      },
      "-NcUd0VTivVE69jUMa_h": {
          "apellidos": "RAMIREZ",
          "correo": "mauriciormz@yahoo.com",
          "no_cliente": "MARATO08230307",
          "nombre": "MAURICIO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5522788525",
          "tipo": "particular"
      },
      "-NcUphE3iTlMwvB7SdjH": {
          "apellidos": "EGC",
          "correo": "egc.march@hotmail.com",
          "no_cliente": "E EGTO08230308",
          "nombre": "E G C",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "2221740230",
          "tipo": "particular"
      },
      "-NcYk49PQ-iocdK0lp2x": {
          "apellidos": "MORALES",
          "correo": "mikyangelm16@gmail.com",
          "no_cliente": "MIMOTO08230309",
          "nombre": "MIGUEL ANGEL",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5527648697",
          "tipo": "particular"
      },
      "-NcYzhWsa5B5liyme0-Z": {
          "apellidos": "MARROQUIN VALENCIA",
          "correo": "garielmarroquinvalencia@yahooo.com",
          "no_cliente": "GAMATO08230310",
          "nombre": "GABRIEL",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5517540335",
          "tipo": "particular"
      },
      "-NcZONjCxHIJFMVwdD13": {
          "apellidos": "VALENCIA",
          "correo": "jonhavalencia@hotmail.com",
          "no_cliente": "JOVATO08230311",
          "nombre": "JONATHAN",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5617233429",
          "tipo": "particular"
      },
      "-Ncbu7I3xj4f0TnGnqTC": {
          "apellidos": "SIERRA",
          "correo": "alejandrosierra@yahoo.com",
          "no_cliente": "ALSITO08230312",
          "nombre": "ALEJANDRO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "3317526635",
          "tipo": "particular"
      },
      "-Ncbvu4PSsEQYjPwwSZD": {
          "apellidos": "DAVILA GONZALEZ",
          "correo": "ivadagz@hotmail.com",
          "no_cliente": "IVDATO08230313",
          "nombre": "IVAN",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5580282451",
          "tipo": "particular"
      },
      "-NcbxzXnTByABmhh-NVc": {
          "apellidos": "GONZALEZ ANGEL",
          "correo": "isra_gonzalez_angel@prodigy.net",
          "no_cliente": "ISGOTO08230314",
          "nombre": "ISRAEL",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5551324648",
          "tipo": "particular"
      },
      "-Ncc-HD789GIzZchhBlC": {
          "apellidos": "MAG SONATA",
          "correo": "mag@hynundai.com",
          "no_cliente": "MAMATO08230315",
          "nombre": "MAG",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5579600910",
          "tipo": "particular"
      },
      "-Nchs2iTynKLnucndHCh": {
          "apellidos": "Castrejón Cruz",
          "correo": "castrejonfederico@gmail.com",
          "no_cliente": "ARCACU08230074",
          "nombre": "Arturo",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5539487934",
          "tipo": "particular"
      },
      "-Nci2BTFzadQjcxJf6gx": {
          "apellidos": "REYES",
          "correo": "victor.reyes@yahoo.com",
          "no_cliente": "VIRETO08230316",
          "nombre": "VICTOR",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5580341272",
          "tipo": "particular"
      },
      "-Ncmg9SiGPG6UtXoAQEO": {
          "apellidos": "Estrada",
          "correo": "luis.estrada@coveme.mx",
          "no_cliente": "LUESCU08230075",
          "nombre": "Luis",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5615042337",
          "tipo": "particular"
      },
      "-NcwnhijXE06X_Qz_5KH": {
          "apellidos": "ROJAS",
          "correo": "erick.rojas@gmail.com",
          "no_cliente": "ERROTO08230317",
          "nombre": "ERICK",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529472851",
          "tipo": "particular"
      },
      "-NcyPw1W3on9ze34lQSd": {
          "apellidos": "OROZCO",
          "correo": "guillermo.orozco@gmail.com",
          "no_cliente": "GUORTO08230318",
          "nombre": "GUILLERMO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5543468940",
          "tipo": "particular"
      },
      "-Ncy_Bez31-iKSBWb9Rl": {
          "apellidos": "CHAVEZ",
          "correo": "rocio.chavez@yahoo.com",
          "no_cliente": "ROCHTO08230319",
          "nombre": "ROCIO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5518194139",
          "tipo": "particular"
      },
      "-Nd0emjUCO2mNthTv5b0": {
          "apellidos": "HERNANDEZ",
          "correo": "victor1001hdz@gmail.com",
          "no_cliente": "VIHETO08230320",
          "nombre": "VICTOR",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529607742",
          "tipo": "particular"
      },
      "-Nd10cZ-UgjxcCjzY6bd": {
          "apellidos": "STRYGLER",
          "correo": "susana.srtrygler@gmail.com",
          "no_cliente": "SUSTTO08230321",
          "nombre": "SUSANA",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5554016366",
          "tipo": "particular"
      },
      "-Nd75QA9VVOB2BaPCEXY": {
          "apellidos": "GARCIA",
          "correo": "salvadorgcia@leute.com",
          "empresa": "-Nd753g7OwReb0zk5PXE",
          "no_cliente": "SAGATO08230322",
          "nombre": "SALAVADOR",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "7121544438",
          "tipo": "flotilla"
      },
      "-NdGuaGVygU9LbG1l0aw": {
          "apellidos": "VAZQUEZ IBARRA",
          "correo": "antoniovaziba@yahoo.com",
          "no_cliente": "ANVATO09230323",
          "nombre": "ANTONIO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529482441",
          "tipo": "particular"
      },
      "-NdLv95jObZMONZLW59S": {
          "apellidos": "RODOLFO",
          "correo": "rodoldo.rodolfo@rodolfo.com",
          "no_cliente": "ROROTO09230324",
          "nombre": "RODOLFO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5515212774",
          "tipo": "particular"
      },
      "-NdLvyG4aw4QJHnS0XGe": {
          "apellidos": "FEREGRINO",
          "correo": "fernado.feregrino@gmail.com",
          "no_cliente": "FEFETO09230325",
          "nombre": "FERNANDO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529625618",
          "tipo": "particular"
      },
      "-NdM2tPjAFH4OCBg29XI": {
          "apellidos": "MEDINA",
          "correo": "ixchel.medina@systemi.com",
          "empresa": "-NdM1oBL6zdKFxTlvn9X",
          "no_cliente": "IXMETO09230326",
          "nombre": "IXCHEL",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5548228875",
          "tipo": "flotilla"
      },
      "-NdVmQbQDkvdN_EWCRbn": {
          "apellidos": "VELEZ ESPINOSA",
          "correo": "velez.espinosa.ana@gmail.com",
          "no_cliente": "ANVETO09230327",
          "nombre": "ANA",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5554560729",
          "tipo": "particular"
      },
      "-Nda704uwklpcoSeEedD": {
          "apellidos": "NOROÑA",
          "correo": "j.cnorona@gmail.com",
          "no_cliente": "JUNOTO09230328",
          "nombre": "JUAN CARLOS",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5573222946",
          "tipo": "particular"
      },
      "-NdkVvW5EAYrAb0UwL2K": {
          "apellidos": "ROMERO FLORES",
          "correo": "bromero@biopappel.com",
          "empresa": "-NdkUMRJ-sBMSxTUXXOl",
          "no_cliente": "BEROTO09230329",
          "nombre": "BERTHA",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5579096871",
          "tipo": "flotilla"
      },
      "-Ndkb33zd94saoSXyxJd": {
          "apellidos": "REYES",
          "correo": "bernardo.reyes@gmail.com",
          "no_cliente": "BERETO09230330",
          "nombre": "BERNARDO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5615393875",
          "tipo": "particular"
      },
      "-NdlI2rcEamh8Lq9TvH2": {
          "apellidos": "JUAREZ TELLEZ",
          "correo": "maribel.jrz.tellez@hotmail.com",
          "no_cliente": "MAJUTO09230331",
          "nombre": "MARIBEL",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5580122669",
          "tipo": "particular"
      },
      "-NdqX_6rm5MPMrE8ToW0": {
          "apellidos": "SORIANO OSNAYA",
          "correo": "luisdanielsorianoosnaya@gmail.com",
          "no_cliente": "LUSOTO09230332",
          "nombre": "LUIS DANIEL",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5523362729",
          "tipo": "particular"
      },
      "-NduK3vX8ZLtwAJpOss6": {
          "apellidos": "HERNANDEZ AGUIRRE",
          "correo": "juan.hdz.a@gmail.com",
          "no_cliente": "JUHETO09230333",
          "nombre": "JUAN",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529389565",
          "tipo": "particular"
      },
      "-NdueHaofyIn9X2Ocnpi": {
          "apellidos": "AYALA CHAVEZ",
          "correo": "felipeayalachavez@yahoo.com",
          "no_cliente": "FAYTO09230334",
          "nombre": "felipe",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5547990550",
          "tipo": "particular"
      },
      "-Ne4YK0DUmsW9y8AWvVP": {
          "apellidos": "HERNANDEZ",
          "correo": "joseignacio.hernandez@hotmail.com",
          "no_cliente": "JOHETO09230335",
          "nombre": "JOSE IGNACIO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5515388409",
          "tipo": "particular"
      },
      "-Ne57q4ci2p3XQNA50ul": {
          "apellidos": "BURGOSW",
          "correo": "nando.burgos@gmail.com",
          "no_cliente": "FEBUTO09230336",
          "nombre": "FERNANDO",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5529659136",
          "tipo": "particular"
      },
      "-Ne5iWwA_HUq3wGqB-ux": {
          "apellidos": "DIAZ",
          "correo": "ediaz@psservice.com",
          "no_cliente": "EDDITO09230337",
          "nombre": "EDWIN",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5546631878",
          "tipo": "particular"
      },
      "-NeEedkEePcs-739rkMG": {
          "apellidos": "RODRIUEZ",
          "correo": "jose.luisrodriguez@gmail.com",
          "no_cliente": "JOROTO09230338",
          "nombre": "JOSE LUIS",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5579252595",
          "tipo": "particular"
      },
      "-NeFANMrNMUGQ0Eh4H9s": {
          "apellidos": "VAZQUEZ MEDINA",
          "correo": "adria.vazquezmedina@hotmail.com",
          "no_cliente": "ADVATO09230339",
          "nombre": "ADRIAN",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5520488790",
          "tipo": "particular"
      },
      "-NeKtMU7Z6ZK8p6Kug3a": {
          "apellidos": "GUTIERREZ",
          "correo": "salvador.gutierrez@gmail.com",
          "no_cliente": "SAGUTO09230340",
          "nombre": "SALVADOR",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5556135497",
          "tipo": "particular"
      },
      "-NeLPhUzDF3ImDBGc58q": {
          "apellidos": "PALAVERA",
          "correo": "juanmahotmail.com",
          "no_cliente": "JUPATO09230341",
          "nombre": "JUAN MA",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5534884628",
          "tipo": "particular"
      },
      "-NeLT0iYgJ33bqnES926": {
          "apellidos": "KAR",
          "correo": "kar.karhotmail.com",
          "no_cliente": "KAKATO09230342",
          "nombre": "KAR",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "3323742744",
          "tipo": "particular"
      },
      "-NedPCWIiEANZP44f8eD": {
          "apellidos": "CORDERO",
          "correo": "angel.cordero@hotmail.com",
          "no_cliente": "ANCOTO09230343",
          "nombre": "ANGEL",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5541910420",
          "tipo": "particular"
      },
      "-NedxfVR5JIyoNWuf8S7": {
          "apellidos": "EVANGELISTA",
          "correo": "lizet.evangelista.com",
          "no_cliente": "LIEVTO09230344",
          "nombre": "LIZET",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5610707589",
          "tipo": "particular"
      },
      "-NeeGQqn8dzxyDFf7f6X": {
          "apellidos": "ALDUCIN",
          "correo": "estela@cafelanegrita.com",
          "empresa": "-NeeGO4Ivwn19fcaUjuI",
          "no_cliente": "ESALTO09230345",
          "nombre": "ESTELA",
          "status": true,
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_movil": "5538565873",
          "tipo": "flotilla"
      },
      "-NeekzgvHBHAnRgY7M-A": {
          "apellidos": "Sánchez",
          "correo": "humberto.sanchez@genommalab.com",
          "no_cliente": "HUSÁCU09230076",
          "nombre": "Humberto",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5551841603",
          "tipo": "particular"
      },
      "-Ng-Yc4PpreQMLr97AYR": {
          "apellidos": "sdfsd",
          "no_cliente": "SDSDCU10230000",
          "nombre": "sdgsdg",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5453454353",
          "tipo": "particular"
      },
      "-Ng-_3aSCvoc4uECRAOB": {
          "apellidos": "sadasdasdasd",
          "no_cliente": "SASACU10230000",
          "nombre": "sadasdsadas",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "4564564564",
          "tipo": "particular"
      },
      "-Ng-_kUrkYhc_ObiQC8p": {
          "apellidos": "pruebaprueba",
          "no_cliente": "SAPRCU10230000",
          "nombre": "sadasdasd",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "4364654645",
          "tipo": "particular"
      },
      "-Ng-aognQh34K8KvaS6Q": {
          "apellidos": "asdasdas",
          "no_cliente": "SAASCU10230000",
          "nombre": "sadsadasd",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "2345654645",
          "tipo": "particular"
      },
      "-Ng-cqv0s9Uxsl0gQUqs": {
          "apellidos": "sadasdasda",
          "no_cliente": "PRSACU10230000",
          "nombre": "pruebaprueba",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "3243243534",
          "tipo": "particular"
      },
      "-Ng-eaSCU5usxaVh8ow0": {
          "apellidos": "dfgdfg",
          "no_cliente": "ASDFCU10230000",
          "nombre": "asdfgfdg",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "435646456",
          "tipo": "particular"
      },
      "-Ng-jtB6a1UqVtGg4Mli": {
          "apellidos": "fgdfgdfgdfgdfg",
          "no_cliente": "SDFGCU10230000",
          "nombre": "prueba X Z Y GTRu",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "65456456",
          "tipo": "particular"
      },
      "-Ng19B6FJo_vbmj7OxAs": {
          "apellidos": "dsdfsdf",
          "no_cliente": "JODSCU10230000",
          "nombre": "joseprueba",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "3464567546",
          "tipo": "particular"
      },
      "-Ng20gqoyZxtWzfjehPZ": {
          "apellidos": "askdjgh",
          "no_cliente": "FKASCU102300449",
          "nombre": "fkshdfkj",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "4534534534",
          "tipo": "particular"
      },
      "-Ng2DvxLeBpVocgpZ266": {
          "apellidos": "jhfksghjs",
          "no_cliente": "MIJHCU102300443",
          "nombre": "miriamG",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "7555555555",
          "tipo": "particular"
      }
    }
    this._security.guarda_informacion({nombre: 'clientes', data})
  }
  



  async remover_claves_e_informacion(data){
    // console.log('remover data no existe');
    const {nombre, ruta_observacion} = data
    // console.log({nombre, ruta_observacion});
    
    
    
    const claves_ = await this._publicos.revisar_cache2(nombre)
    const claves_data = await this._publicos.revisar_cache2(ruta_observacion)
    const claves_supervisa = [...claves_]

    let nueva_si_existe = {}

    claves_supervisa.forEach(clave=>{
      if (claves_data[clave]) {
        nueva_si_existe[clave] = claves_data[clave]
      }
    })
    // console.log(nueva_si_existe);
    this._security.guarda_informacion({nombre: ruta_observacion, data: nueva_si_existe})
    
    // let 
    // console.log(claves_);
    
  }
  async obtenerInformacionDeCliente_unico(claves_faltante, ruta_observacion) {
    let resultados_new = {};
  
    const data_cliente = await this._automaticos.consulta_ruta(`${ruta_observacion}/${claves_faltante}`);

    const { no_cliente } = this._publicos.crear_new_object(data_cliente);
    if (no_cliente) resultados_new = data_cliente;  
    return resultados_new;
  }
  async obtenerInformacionDeClientes(claves_faltantes, ruta_observacion) {
    const resultados_new = {};
  
    await Promise.all(claves_faltantes.map(async (clave) => {
      const data_cliente = await this._automaticos.consulta_ruta(`${ruta_observacion}/${clave}`);
      // console.log('pesos data_cliente');
      
      // console.log(this._publicos.saber_pesos(data_cliente));
      
      const { no_cliente } = this._publicos.crear_new_object(data_cliente);
      if (no_cliente) resultados_new[clave] = data_cliente;
    }));
  
    return resultados_new;
  }

  obtener_claves(){
    console.log(Object.keys(claves));
    
  }
}
function obtenerElementosUnicos(arr) {
  return [...new Set(arr)];
}

function eliminarElementosRepetidos(arregloOriginal, elementosAEliminar) {
  // Filtrar los elementos del segundo arreglo que no están en el primer arreglo
  const resultado = elementosAEliminar.filter((elemento) => !arregloOriginal.includes(elemento));
  return resultado;
}