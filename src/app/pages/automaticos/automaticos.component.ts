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


import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, onValue, update, push } from 'firebase/database';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ExporterService } from 'src/app/services/exporter.service';

import Swal from 'sweetalert2';

import {  BD } from "./BD_completa";

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
    {ruta_observacion: 'sucursales', nombre:'claves_sucursales'},
    {ruta_observacion: 'metas_sucursales', nombre:'claves_metas_sucursales'},
  ]

  busqueda:any = {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'}
  contador_observados: number = 8
  contador_recorridos:number = 0
  informar_cliente_termino: boolean = false
  ngOnInit(): void {
    this.rol()
  }

  
  
  rol(){
    const { rol, sucursal, usuario } = this._security.usuarioRol()
    this._sucursal = sucursal
    // this.revision_existe_cache()
    // this.revisar_peso_BD()
    // this.vigila_nodos()
  }
  revisar_peso_BD(){
    this._publicos.saber_pesos(BD)
  }
  revision_existe_cache(){
    const faltantes = {}
    const existentes = {}
    let timer:number = 100
    

    this.campos.forEach(campo=>{
        const {ruta_observacion, nombre} = campo

        console.log({ruta_observacion, nombre});

        if (localStorage[nombre] && localStorage[ruta_observacion]) {
            existentes[ruta_observacion] =nombre
        }else{
            timer+=1000
            faltantes[ruta_observacion] = nombre; 
        }
    })

    function tieneElementos(objeto) {
        const  faltantes_cout = Object.keys(objeto).length
        const faltantes_ruta_observacion = objeto
        return {faltantes_cout, faltantes_ruta_observacion}
    }

    const {faltantes_cout, faltantes_ruta_observacion} = tieneElementos(faltantes)

    
    if (faltantes_cout > 0) {
        console.log('El objeto faltantes tiene elementos.');
        Object.entries(faltantes_ruta_observacion).forEach( async ([ruta_observacion, nombre])=>{
            const data = await this._automaticos.consulta_ruta(ruta_observacion)
            this._publicos.saber_pesos(data)
            this._security.guarda_informacion({nombre: ruta_observacion, data: data})
            this._security.guarda_informacion({nombre, data: Object.keys(data)})
        })
    }else{
        timer = 100
    }

    Swal.fire({
        title: 'Cargando data ',
        html: 'Espere ...',
        timer,
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


  async obtener_informacion_cache(){
    
    const {ruta_observacion, nombre} = this.busqueda
    console.log({ruta_observacion, nombre});
    const data_claves = await this._publicos.revisar_cache2(ruta_observacion)
    this._publicos.saber_pesos(data_claves)
    console.log(data_claves);
      
    const claves_keys = await this._publicos.revisar_cache2(nombre)
    // console.log(claves_keys);
    this._publicos.saber_pesos(claves_keys)

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
        this._publicos.saber_pesos(data)

        const localhost_nombre = await this._publicos.revisar_cache2(ruta_observacion)

        if (localhost_nombre[clave_vigilar]) {
          const nueva_data_clave = this._publicos.crear_new_object(localhost_nombre[clave_vigilar])
          nueva_data_clave[key] = valor
          localhost_nombre[clave_vigilar] = nueva_data_clave
          this._security.guarda_informacion({nombre: ruta_observacion, data: localhost_nombre})
        }else{
          // console.log(`la informacion del cliente no se encuentra`);
          this.obtenerInformacion_unico(clave_vigilar, ruta_observacion)
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
      this.obtenerInformacion(faltantes, ruta_observacion)
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

  



  async obtenerInformacion_unico(claves_faltante, ruta_observacion) {
    let resultados_new = {};
  
    const data_cliente = await this._automaticos.consulta_ruta(`${ruta_observacion}/${claves_faltante}`);

    const { no_cliente } = this._publicos.crear_new_object(data_cliente);
    if (no_cliente) resultados_new = data_cliente;  
    return resultados_new;
  }
  async obtenerInformacion(claves_faltantes, ruta_observacion) {
    const resultados_new = {};
  
    await Promise.all(claves_faltantes.map(async (clave) => {
      const data_cliente = await this._automaticos.consulta_ruta(`${ruta_observacion}/${clave}`);
      const { no_cliente } = this._publicos.crear_new_object(data_cliente);
      if (no_cliente) resultados_new[clave] = data_cliente;
    }));
  
    return resultados_new;
  }

  obtener_claves(){
    console.log(Object.keys(BD.historial_pagos_orden));
  }
  crear_cache_claves(){
    // this._security.guarda_informacion({nombre: 'metas_sucursales', data: 
    //   {
    //     "-NgPvfWwbjDRVHd33L57": {
    //       "fecha_recibido": "Fri Sep 01 2023 00:00:00 GMT-0600 (hora estándar central)",
    //       "objetivo": 255,
    //       "sucursal": "-N2glF34lV3Gj0bQyEWK"
    //     },
    //     "-NgPvxXk3B8vgl-xoPBI": {
    //       "fecha_recibido": "Fri Sep 01 2023 00:00:00 GMT-0600 (hora estándar central)",
    //       "objetivo": 4554,
    //       "sucursal": "-N2gkzuYrS4XDFgYciId"
    //     },
    //     "-NgPwKKOkByuTrzXdFnW": {
    //       "fecha_recibido": "Fri Sep 01 2023 00:00:00 GMT-0600 (hora estándar central)",
    //       "objetivo": 1200,
    //       "sucursal": "-N2glQ18dLQuzwOv3Qe3"
    //     },
    //     "-NgQ4S6UichfsohfS_UX": {
    //       "sucursal": "-N2glF34lV3Gj0bQyEWK",
    //       "fecha_recibido": "Sun Oct 01 2023 00:00:00 GMT-0600 (hora estándar central)",
    //       "objetivo": 6000
    //     }
      
    // }})
  }
  
  genera_claves(){
    
  }
}
