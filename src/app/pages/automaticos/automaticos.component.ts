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
import { cotizaciones } from "./ayuda";


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
    {ruta_observacion: 'moRefacciones', nombre:'claves_moRefacciones'},
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


vigila_nodos(){
  this.campos.forEach(async (g)=>{
    this.vigila_nodo_principal(g)
  })
}
  async vigila_nodo_principal(data){

    
    const {nombre, ruta_observacion} = data

    // this.simular_observacion_informacion_firebase_nombre(this.busqueda)
    console.log({nombre, ruta_observacion});


    const en_cloud:any[] = await this._automaticos.consulta_ruta(nombre)
    // const claves_supervisa = await this._automaticos.consulta_ruta(nombre)
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

    // console.log(faltantes);
    
    // setTimeout(async ()=>{
      if (faltantes.length) {
        // console.log('realiza la consulta de la informacion', faltantes);
        // console.log('ruta_observacion', ruta_observacion);
        this.obtenerInformacion(faltantes, ruta_observacion)
        .then((resultados_promesa) => {

          const claves_obtenidas = Object.keys(resultados_promesa)

          let actuales  = this._publicos.nueva_revision_cache(ruta_observacion)
          claves_obtenidas.forEach(clave_obtenida=>{
            actuales[clave_obtenida] = resultados_promesa[clave_obtenida]
          })
          this._security.guarda_informacion({nombre: ruta_observacion, data: actuales})
        })
        .catch(error=>{
          console.log(error);
        })
      }
    // },1000)

    // console.log(faltantes);
    
    
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
      const data_obtenida = await this._automaticos.consulta_ruta(`${ruta_observacion}/${clave}`);
      resultados_new[clave] = data_obtenida;
    }));
  
    console.log(resultados_new);
    
    return resultados_new;
  }

  obtener_claves(){
    // console.log(Object.keys(BD.historial_pagos_orden));
  }
  
  async obtener_informacion_cache(){

    // {ruta_observacion: 'clientes', nombre:'claves_clientes'},
    // {ruta_observacion: 'vehiculos', nombre:'claves_vehiculos'},
    // {ruta_observacion: 'recepciones', nombre:'claves_recepciones'},
    // {ruta_observacion: 'cotizaciones', nombre:'claves_cotizaciones'},
    // {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'},
    // {ruta_observacion: 'historial_gastos_operacion', nombre:'claves_historial_gastos_operacion'},
    // {ruta_observacion: 'historial_gastos_orden', nombre:'claves_historial_gastos_orden'},
    // {ruta_observacion: 'historial_pagos_orden', nombre:'claves_historial_pagos_orden'},
    // {ruta_observacion: 'sucursales', nombre:'claves_sucursales'},
    // {ruta_observacion: 'metas_sucursales', nombre:'claves_metas_sucursales'},
    // {ruta_observacion: 'paquetes', nombre:'claves_paquetes'},
    
    const {ruta_observacion, nombre} = {ruta_observacion: 'cotizaciones', nombre:'claves_cotizaciones'}
    console.log({ruta_observacion, nombre});
    const data_claves = await this._publicos.revisar_cache2(ruta_observacion)
    this._publicos.saber_pesos(data_claves)
    console.log(data_claves);
      
    const claves_keys = await this._publicos.revisar_cache2(nombre)
    console.log(claves_keys);
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

  crear_cache_claves(){
    const dadsdgk = {}
    // this._security.guarda_informacion({nombre: 'cotizaciones', data: dadsdgk })
    // this._security.guarda_informacion({nombre: 'claves_cotizaciones', data:  Object.keys(dadsdgk)})
  }
  
  genera_claves(){
    
  }

  comprueba_Reporte_paquet(){
    
    const moRefacciones = this._publicos.nueva_revision_cache('moRefacciones')

    const paquete = {
        "cilindros": "",
        "elementos": [
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "cambio de aceite y filtro",
                "precio": 120,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "reemplazar filtro de aire",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "rev. y corregir niveles",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "lavar inyectores",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "C",
                "nombre": "lavar cpo de aceleracion",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "scaneo por computadora",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "N",
                "nombre": "rev. 25 puntos de seguridad",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "N",
                "nombre": "cambio de focos fundidos convencionales",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "N",
                "nombre": "rotacion de llantas",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "N",
                "nombre": "regimen de carga de bateria",
                "precio": 300,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "N",
                "nombre": "lavar motor",
                "precio": 150,
                "tipo": "mo"
            },
            {
                "aprobado": true,
                "cantidad": 1,
                "costo": 0,
                "descripcion": "N",
                "nombre": "lavar carroceria",
                "precio": 150,
                "tipo": "mo"
            }
        ],
        "enCatalogo": true,
        "marca": "Mazda",
        "modelo": "3",
        "nombre": "servicio mayor",
        "status": true,
        "tipo": "paquete"
    }


    const {elementos} = paquete
    //TODO
    const nuevos = elementos.map((elemento: any)=>{
        const {id: id_elemento} = elemento
        if (id_elemento) {
          return { ...elemento,...moRefacciones[id_elemento], aprobado: true}
        }else{
          return {...elemento, aprobado: true, status:true}
        }
      })

  }
  sumatoria_reporte_paquete(elementos:any[], margen){
    // Inicializamos el objeto de reporte con valores iniciales
    const reporte = {mo:0,refaccion:0, refaccionVenta:0, subtotal:0, total:0,ub:0}
    // Iteramos a través de los elementos del arreglo
      elementos.forEach(elemento=>{
        const costoElemento = obtenerCostoValido(elemento);
        const tipoNormalizado = normalizarTipo(elemento.tipo);
        reporte[tipoNormalizado] += costoElemento;
      })
      // Calculamos el valor de refaccionVenta y subtotal
      reporte.refaccionVenta = reporte.refaccion * (1 + margen / 100);
      reporte.subtotal = reporte.mo + reporte.refaccionVenta;
    
      // El total es igual al subtotal
      reporte.total = reporte.subtotal;
    
      return reporte;
      // Función auxiliar para obtener el costo válido de un elemento
      function obtenerCostoValido(elemento) {
        return elemento.costo > 0 ? elemento.costo : elemento.precio;
      }
      // Función auxiliar para normalizar el tipo
      function normalizarTipo(tipo) {
        return tipo.toString().toLowerCase().trim();
      }
  }

  sanitizar_paquetes(paquetes){
      const nuevosPaquetes = {};
      const moRefacciones = this._publicos.nueva_revision_cache('moRefacciones')
      for (const [key, entry] of Object.entries(paquetes)) {
        const nuevoPaquete = this.crearNuevoObjeto(entry,moRefacciones);
        nuevosPaquetes[key] = nuevoPaquete;
      }
    //   this._encript.guarda_informacion({nombre: 'paquetes',data: nuevosPaquetes})
      return nuevosPaquetes
  }
  crearNuevoObjeto(entry, moRefacciones) {
    const { elementos, cilindros, costo, marca, modelo, nombre, status, tipo } = entry;
    const elementosLimpios = this.limpiarElementos(elementos, moRefacciones);
    const costoValidado = parseFloat(costo) || 0;
    return {
      cilindros, marca, modelo, nombre, status, tipo,
      elementos: elementosLimpios,
      costo: costoValidado
    };
  }
  limpiarElementos(elementos, moRefacciones){
    
    const afhgj = elementos.map(elemento=>{
        const {id:id_elemento, costo:costo_elemento, cantidad: cantidad_elemento} = elemento
        let data_elemento_return
        if (moRefacciones[id_elemento]) {
          const data_elemento = JSON.parse(JSON.stringify(moRefacciones[id_elemento]));
          data_elemento.costo =  (data_elemento.costo > 0) ? parseInt( data_elemento.costo ) : 0
          const nuevo_costo = (costo_elemento > 0) ? parseInt( costo_elemento ) : parseInt( data_elemento.costo )
          const nueva_cantidad = (cantidad_elemento > 0) ? cantidad_elemento : 1
          data_elemento_return =  {
            id:id_elemento,
            aprobado: true,
            costo: nuevo_costo,
            cantidad: nueva_cantidad
          }
        }else{
          data_elemento_return = elemento
        }
        return data_elemento_return
      })
      return afhgj
  }

  //TODO sanitizar data_cotizaciones

  sanitizar_cotizaciones(){
   

    const nuevas_Cotizaciones = {}
    Object.entries(cotizaciones).forEach(([key, entrie])=>{
      nuevas_Cotizaciones[key] = this.sanitiza_informacionCotizacion(entrie)
    })
    console.log(nuevas_Cotizaciones);
    
  }

  sanitiza_informacionCotizacion(info_cotizacion){
    const nueva_data_cotizacion = this._publicos.crear_new_object(info_cotizacion)
    const elementos = nueva_data_cotizacion.elementos.map(elemento => this.sanitizar_elementos(elemento));

    const campos = [
      'cliente', 'fecha_recibido', 'formaPago', 'iva', 'margen', 'no_cotizacion', 'nota', 'servicio', 'sucursal', 'vehiculo', 'vencimiento', 'pdf', 'por_cliente'
    ];

    const nuevaInformacionCotizacion = campos.reduce((result, campo) => {
      if (nueva_data_cotizacion[campo] !== undefined && nueva_data_cotizacion[campo] !== null && nueva_data_cotizacion[campo] !== "") {
        result[campo] = nueva_data_cotizacion[campo];
      }
      return result;
    }, { elementos });

    return nuevaInformacionCotizacion;
  }

  sanitizar_elementos(elemento) {
    // console.log(elemento);
    
    const nuevo_elemento = this._publicos.crear_new_object(elemento);
    const { id, cantidad, costo, tipo } = nuevo_elemento

    console.log(id);
    
    const nuevo_costo = this.retorna_costo_correcto(costo,'costo') // Aseguramos que el costo sea mayor o igual a cero
    // const nuevo_costo = Math.max(parseFloat(costo), 0); // Aseguramos que el costo sea mayor o igual a cero
    const nueva_cantidad = this.retorna_costo_correcto(cantidad,'cantidad') // Aseguramos que la cantidad sea mayor o igual a cero
    // const nueva_cantidad = Math.max(parseFloat(cantidad), 0); // Aseguramos que la cantidad sea mayor o igual a cero
    const temp = {
      id,
      cantidad: nueva_cantidad,
      tipo,
      aprobado: true
    }
    if (costo > 0) temp['costo'] = nuevo_costo
    return temp
  }
  retorna_costo_correcto(valor, cual:string):number{
    let nuevo_costo = 0
    switch (cual) {
      case 'cantidad':
        nuevo_costo = (parseFloat(valor) >=1) ? parseFloat(valor) : 1
        break;
      case 'costo':
        nuevo_costo = (parseFloat(valor) >=0) ? parseFloat(valor) : 0
        break;
    
      default:
        nuevo_costo = (parseFloat(valor) >=0) ? parseFloat(valor) : 0
        break;
    }
    return nuevo_costo
  }

  

}

