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
// import { claves_clientes, clientes_bd, clientes_f, clientes_nuevos_bd, clientes_vehiculos, correos_bd, vehiculos_actuales } from "./ayuda";


pdfMake.vfs = pdfFonts.pdfMake.vfs


import { getDatabase, onChildAdded, onChildChanged, ref } from 'firebase/database';

import { FormBuilder } from '@angular/forms';
import { ExporterService } from 'src/app/services/exporter.service';
import { ServiciosService } from 'src/app/services/servicios.service';

import Swal from 'sweetalert2'


import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { log } from 'console';
const EXCEL_TYPE = `application/vnd.opencmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8;`
const EXCEL_EXT ='.xlsx'

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
    {ruta_observacion: 'citas', nombre:'claves_citas'},
  ]

  busqueda:any = {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'}
  contador_observados: number = 8
  contador_recorridos:number = 0
  informar_cliente_termino: boolean = false

  jsonData: any;

  vehiculos_arr = []
  clientes_arr = []
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
    // this._publicos.saber_pesos(BD)
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

        const localhost_nombre = await this._publicos.nueva_revision_cache(ruta_observacion)

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
  
  async obtener_informacion_cache(cual){

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
    
    // const {ruta_observacion, nombre} = cual
    // console.log({ruta_observacion, nombre});
    console.log(cual);
    
    const data_claves = this._publicos.nueva_revision_cache(cual)
    this._publicos.saber_pesos(data_claves)
    console.log(data_claves);
      
    // const claves_keys = this._publicos.nueva_revision_cache(nombre)
    // console.log(claves_keys);
    // this._publicos.saber_pesos(claves_keys)

    // let nuesdg = [...claves_keys]
    // const inicio = nuesdg.length -5
    // const final = nuesdg.length

    // let ultimos_5 = []

    // for (let index = inicio; index < final; index++) {
    //   ultimos_5.push(nuesdg[index])
    // }
    // console.log(`Totales ${nuesdg.length}`);
    
    // console.log(`Ultimos 5 registros encontrados en ${nombre} `,ultimos_5);

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
   

    // const nuevas_Cotizaciones = {}
    // Object.entries(cotizaciones).forEach(([key, entrie])=>{
    //   nuevas_Cotizaciones[key] = this.sanitiza_informacionCotizacion(entrie)
    // })
    // console.log(nuevas_Cotizaciones);
    
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

  nuevas_claves_firebase(cantidad:number){
    let claves = []
    // for (let index = 0; index <= cantidad; index++) {
    //   claves.push(this._publicos.generaClave())
    // }
    console.log(claves);
  
  }
  
  sanitiza_informacion(){
    const  clientes_vehiculos = {}
    // console.log(clientes_vehiculos);
    
    const arr_ = this._publicos.crearArreglo(clientes_vehiculos)
    // console.log(arr_);
    const ordenanda = this._publicos.ordenamiento_fechas_x_campo(arr_,'correo',true)
    let contador  = 1
    const nueva_sanitizada = ordenanda.map((reg)=>{
      // delete reg.id
      const clave = `clave_${contador}`
      contador++
      const cliente = this.sanitiza_info_cliente(reg)
      const vehiculo = this.sanitiza_info_vehiculo(reg)
      return {...cliente, ...vehiculo, clave}
    })
    // this.centraliza_informacion()
    console.log(nueva_sanitizada);
    
    // console.log(ordenanda);

  const unicos = this.obser( nueva_sanitizada )

  const {clientes_sin_vehiculo, clientes_con_ambos  } = unicos
  const con_correo = [...new Set([...this._publicos.crearArreglo(clientes_sin_vehiculo), ...this._publicos.crearArreglo(clientes_con_ambos)])]
  // console.log(con_correo);
  
  const {clientes_unicos_por_correo, vehiculos_unicos_por_placas } = this.unicos_por_correo(nueva_sanitizada)

  // console.log(clientes_unicos_por_correo);
  
  const {clientes, vehiculos} = this.centraliza_informacion(nueva_sanitizada, clientes_unicos_por_correo, vehiculos_unicos_por_placas)

  // console.log(vehiculos);
  let  contador_v = 1
  // console.log(Object.keys(vehiculos).length);
  
  Object.entries(vehiculos).forEach(([key, entrie])=>{
    vehiculos[key].id_vehiculo = `id_vehiculo_${contador_v}`
    contador_v++
  })
  Object.entries(clientes).forEach(([key, entrie])=>{
    clientes[key].sucursal = '-N2glF34lV3Gj0bQyEWK'
  })

  

  const vehiculo_con_cliente = {}
  const utiles_ = {}
  const nueva_informacion = nueva_sanitizada.map((reg, index)=>{
    const {correo, clave} = reg
    const new_correo = `${correo}`.toLowerCase()
    let temp = {}
    if (new_correo.length && correo) {
      temp = {...clientes[new_correo]}
    }else{
      temp = {...reg}
    }
    return temp
  })

  
  // 'anio','marca','modelo','placas','vinChasis','cliente'
  const vehiculosss = nueva_informacion.map(reg=>{
    const {clave, anio, marca, modelo,placas, vinChasis} = this._publicos.crear_new_object(reg)

     if (placas) {
      const {id_vehiculo} = vehiculos[placas]
      const recuperada = this.sanitiza_info_vehiculo({...vehiculos[placas],cliente: clave})
      return {...recuperada, id_vehiculo}
    }
    return null
  })
  .filter(obj => obj !== null);
  // console.log(vehiculosss);
  
  // console.log(nueva_informacion);

  const objeto_vehiculos = this.convierte_aobjeto(vehiculosss,'id_vehiculo')
  // console.log(objeto_vehiculos);
  
  // console.log(Object.keys(nueva_informacion).length);
  // console.log(Object.keys(nueva_informacion));
  
  
  const worksheetenviar_totales_orden : XLSX.WorkSheet = XLSX.utils.json_to_sheet(nueva_informacion)

  const objeto = this.convierte_aobjeto(nueva_informacion,'clave')
  console.log(objeto);
  // console.log(Object.keys(objeto).length);
  // console.log(Object.keys(objeto));
  let contador_no_cliente = 459
   Object.entries(objeto).forEach(([key, entrie], index)=>{
    const {correo, clave} = this._publicos.crear_new_object(entrie)
    const new_correo = `${correo}`.toLowerCase()
    let temp = {}
    
    if (new_correo.length && correo) {
      const data_cliente = this.sanitiza_info_cliente( clientes[new_correo] )
      const no_cliente = this.genera_no_cliente(contador_no_cliente, data_cliente)
      contador_no_cliente++
      objeto[key] = {...data_cliente, sucursal: '-N2glF34lV3Gj0bQyEWK', tipo: "particular",no_cliente}
    }else{
      const data_cliente = this.sanitiza_info_cliente( entrie )
      const no_cliente = this.genera_no_cliente(contador_no_cliente, data_cliente)
      contador_no_cliente++
      objeto[key] = {...data_cliente, sucursal: '-N2glF34lV3Gj0bQyEWK', tipo: "particular",no_cliente}
    }
    return temp
  })
  // console.log(guardar);
  
  

  const workbook: XLSX.WorkBook = {
    Sheets: {'Servicios':worksheetenviar_totales_orden},
    SheetNames:['Servicios']
  }
  const excelBuffer:any= XLSX.write(workbook,{bookType:'xlsx',type:'array'})

  // this.saveAsExcel(excelBuffer,'revisa')
  }
  private saveAsExcel(buffer:any,fileName:string): void{
    const data: Blob = new Blob([buffer],{type: EXCEL_TYPE})
    // FileSaver.saveAs(data, fileName+'_export_'+new Date().getTime()+ EXCEL_EXT)
    FileSaver.saveAs(data, fileName+'_export_'+ EXCEL_EXT)
  }
  tomar_nombre_placas_unicos(){

  }

  depura(){

  }


  handleFileInput(files: FileList) {
    
    const file = files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir la hoja a JSON
        this.jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log([...new Set([...this.jsonData])]);
        const aqui = [...new Set([...this.jsonData])]
        let contador  = 1
        let aplicados = []
        const nueva_sanitizada = aqui.map((reg)=>{
          // delete reg.id
          const clave = `clave_${contador}`
          contador++
          const cliente = this.sanitiza_info_cliente(reg)
          const vehiculo = this.sanitiza_info_vehiculo(reg)
          
          aplicados.push(this._publicos.crear_new_object({...cliente, ...vehiculo, clave}))
          return {...cliente, ...vehiculo, clave}
        })
        console.log(aplicados);
        

        console.log(nueva_sanitizada);
        
        
        
      };

      reader.readAsArrayBuffer(file);
    }
  }


  sanitiza_info_cliente(data){
    const necessary: any = {};
    const campos = ['nombre','apellidos','correo','telefono_movil','clave']
    campos.forEach(campo=>{ 
      if (data[campo] !== undefined && data[campo] !== null && data[campo] !== "" && data[campo] !== "undefined" && data[campo] !== "UNDEFINED") {
        if (campo === 'telefono_movil') {
          necessary[campo] = this.sanitiza_placas( data[campo] )
        }else{
          necessary[campo] = `${data[campo]}`.toLowerCase();
        }
      }
    })
    return necessary
  }
  sanitiza_info_vehiculo(data){
    const necessary: any = {};
    const campos = ['anio','marca','modelo','placas','vinChasis','cliente']
    campos.forEach(campo=>{
      if (data[campo] !== undefined  && data[campo] !== "undefined" && data[campo] !== "UNDEFINED" && data[campo] !== null && data[campo] !== "" && data[campo] && `${data[campo]}`.length) {
        if (campo === 'placas' || campo === 'vinChasis') {
          necessary[campo] = this.sanitiza_placas( data[campo] )
        }else if(campo === 'anio'){
          necessary[campo] = parseInt(data[campo])
        }else  if(campo === 'cliente'){
          necessary[campo] = data[campo]
        }else {
          necessary[campo] = `${data[campo]}`.toUpperCase()
        }
      }
    })
    return necessary
  }
  sanitiza_placas(placas){
    // if (!`${placas}`.length)  return null 
    return `${placas}`
    .toUpperCase()
    .trim() //elimina los espacion exteriores
    .replace(/\s/g, "") // Eliminamos los espacios en blanco
    .replace(/\(/g, "") // Elimina todos los paréntesis abiertos
    .replace(/\)/g, "") // Elimina todos los paréntesis cerrados
    .replace(/-/g, ""); // Elimina todos los guiones
  }
  genera_no_cliente(contador,data_cliente){
    const {nombre, apellidos} = data_cliente
    const nombre_purificado = this.quitarAcentos(this.eliminarEspacios(this.dejarUnEspacio(nombre))).trim()
    let apellidos_purificado 
    if (`${apellidos}`.length > 1 && apellidos) {
      apellidos_purificado = this.quitarAcentos(this.eliminarEspacios(this.dejarUnEspacio(apellidos))).trim()
    }else{
      apellidos_purificado = nombre_purificado
    }
    const nombre_sucursal = 'Culhuacán'
    const date = new Date();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear().toString().slice(-2);
    const secuencia = (contador).toString().padStart(5, '0');
    return  `${nombre_purificado?.slice(0, 2)}${apellidos_purificado?.slice(0, 2)}${nombre_sucursal?.slice(0, 2)}${mes}${anio}${secuencia}`
            .toUpperCase();
  }
  quitarAcentos(texto) {
    if (!`${texto}`.length) return ''
    return texto
      .normalize("NFD") // Normalizamos el texto en Unicode
      .replace(/[\u0300-\u036f]/g, "") // Eliminamos los caracteres diacríticos
      .replace(/[^\w\s]/gi, "") // Eliminamos caracteres especiales excepto letras y espacios
      .replace(/\s+/g, " ") // Reemplazamos múltiples espacios en blanco por uno solo
      .trim(); // Quitamos espacios en blanco al principio y al final
  }
  eliminarEspacios(cadena) {
    if (!`${cadena}`.length) return ''
    return cadena.replace(/\s+/g, '');
  }
  dejarUnEspacio(cadena:string) {
    if (!`${cadena}`.length) return ''
    return cadena.replace(/\s+/g, ' ');
  }
  arma_data_sincorreo(arr_){
    const filtro_sin_correo = arr_.filter(reg=>!reg.correo)
    const nueva = {}
    filtro_sin_correo.map(reg=>{
      const { nombre, apellidos, correo } = reg
      
      const clave = this.return_fullname(reg)
      nueva[clave] = {nombre, apellidos, correo}
    })
    return nueva
  }
  return_fullname(data){
    const {nombre, apellidos} = data
    const nuevos_apellidos = (!apellidos) ? nombre : apellidos
      return `${nombre} ${nuevos_apellidos}`
        .toLowerCase() //convierte todo a minusculas
        .trim() //elimina los espacion exteriores
        .normalize("NFD") // Normalizamos el texto en Unicode
        .replace(/[\u0300-\u036f]/g, "") // Eliminamos los caracteres diacríticos (acentos)
        .replace(/\s/g, "") // Eliminamos los espacios en blanco
        .replace(/_/g, "") // Elimina todos los guiones
        .replace(/-/g, ""); // Elimina todos los guiones
        
  }
  centraliza_informacion(arr_, unicos, vehiculos_unicos){
    const clientes = {}, vehiculos = {}
    arr_.forEach(reg=>{
      const {correo, placas} = reg
      const new_correo = `${correo}`.toLowerCase()
      if (new_correo.length && new_correo!=='undefined') {
        clientes[new_correo] = 
        this.sanitiza_info_cliente(
          this.toma_campo_mas_largo( 
            unicos[new_correo]
          )
        )
      }
      if(placas){
        vehiculos[placas] = this.sanitiza_info_vehiculo(
          this.toma_campo_mas_largo_vehiculo( 
            vehiculos_unicos[placas]//.filter(c=>`${c.correo}`.toLowerCase() === new_correo
          )
        )
        
      }
    })
    return {clientes, vehiculos}
  }
  unicos_por_correo(arr_){
    const clientes_unicos_por_correo = {}, vehiculos_unicos_por_placas = {}
    arr_.forEach(cor=>{
      const {correo, placas } = cor
      const new_correo = `${correo}`.toLowerCase()
      if (new_correo.length && new_correo !== 'undefined') {
        clientes_unicos_por_correo[new_correo] = arr_.filter(c=>`${c.correo}`.toLowerCase() === new_correo)
      }
      vehiculos_unicos_por_placas[placas] =  arr_.filter(c=>c.placas === placas)
    })
    return {clientes_unicos_por_correo, vehiculos_unicos_por_placas}
  }
  toma_campo_mas_largo(data_placas:any[]){
    let nueva_data = {nombre:'',apellidos:'',correo:'',telefono_movil:'', clave:''}
    const campos = ['nombre','apellidos','correo','telefono_movil','clave']
    data_placas.forEach(registro=>{
      campos.forEach(campo=>{
        if (registro[campo] && `${registro[campo]}`.length > nueva_data[campo].length && registro[campo] !== 'undefined') {
          if (campo === 'telefono_movil' ) {
            nueva_data[campo] = this.sanitiza_placas(registro[campo])
          }else{
            nueva_data[campo] = `${registro[campo]}`.toLowerCase()
          }
        }
      })
    })
    return nueva_data
  }
  toma_campo_mas_largo_vehiculo(data_placas:any[]){
    let nueva_data = {anio:'',marca:'',modelo:'',placas:'',vinChasis:''}
    const campos = ['anio','marca','modelo','placas','vinChasis']
    data_placas.forEach(registro=>{
      campos.forEach(campo=>{
        if (registro[campo] &&  `${registro[campo]}`.length > `${nueva_data[campo]}`.length) {
          if (campo === 'vinChasis' ) {
            nueva_data[campo] = this.sanitiza_placas(registro[campo])
          }else{
            nueva_data[campo] = registro[campo]
          }
        }
      })
    })      
    return nueva_data
  }
  obtenerObjetosUnicos(data:any[], campo){
    const objetosUnicos = {};
    const elementosEliminados = [];

    data.forEach((reg, index)=>{
      const identificador = reg[campo]
      if (!objetosUnicos[identificador]) {
        objetosUnicos[identificador] = reg
      }else{
        elementosEliminados.push(reg)
      }
    })
    return {objetosUnicos, elementosEliminados}
  }
  convierte_aobjeto(arr_, campo){
    let regresa = {}
    arr_.forEach(reg=>{
      const id_gen= reg[campo]
      delete reg[campo]
      regresa[id_gen] = reg
    })
    return regresa
  }
  obser( arr_:any[]  ){
    const clientes_sin_correo_sin_vehiculo = {}
    const clientes_sin_vehiculo = {}
    const vehiculos_sin_correo_con_vehiculo = {}
    const vehiculos_con_ambos = {}
    const clientes_sin_correo_con_vehiculo = {}
    const clientes_con_ambos = {}
    let contador = 0
    arr_.forEach((reg) => {
      const { placas: plas_get, correo, nombre, apellidos, telefono_movil, marca, modelo, vinChasis, anio } = reg;
      const placas_sanitizadas = this.sanitiza_placas(plas_get);
      const clave = `clave_${contador}`
      const no_cliente = this.genera_no_cliente(contador, {nombre, apellidos})
      contador++
      const id_por_nombre_apellidos = this.return_fullname({ nombre, apellidos });
      const temp_cliente = { nombre, apellidos, telefono_movil, id: id_por_nombre_apellidos, clave, no_cliente, correo}
      const sanitizada_cliente = this.sanitiza_info_cliente(temp_cliente);
      if (!correo && !plas_get) {
        clientes_sin_correo_sin_vehiculo[clave] = sanitizada_cliente
      }
      if (correo && !plas_get) {
        clientes_sin_vehiculo[clave] = sanitizada_cliente
      }
      if (!correo && plas_get) {
        clientes_sin_correo_con_vehiculo[clave] = sanitizada_cliente
        vehiculos_sin_correo_con_vehiculo[placas_sanitizadas] = this.sanitiza_info_vehiculo({ placas: placas_sanitizadas, marca, modelo, vinChasis, anio, cliente: clave });
      }
      if (correo && plas_get) {
        clientes_con_ambos[clave] = sanitizada_cliente
        vehiculos_con_ambos[placas_sanitizadas] = this.sanitiza_info_vehiculo({ placas: placas_sanitizadas, marca, modelo, vinChasis, anio, cliente: clave });
      }
    })
  return {
    clientes_sin_correo_sin_vehiculo,
    clientes_sin_vehiculo,
    clientes_sin_correo_con_vehiculo,
    clientes_con_ambos,
    vehiculos_sin_correo_con_vehiculo,
    
  }
}

}
