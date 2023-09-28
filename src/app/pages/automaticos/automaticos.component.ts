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
import { MO, refacciones, recepciones } from './ayuda';
import { BD } from './BD_completa';
pdfMake.vfs = pdfFonts.pdfMake.vfs



import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';


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
    private formBuilder: FormBuilder, private _servicios: ServiciosService,

    ) {   }
  
    sucursales_array = [...this._sucursales.lista_en_duro_sucursales]

    claves_sucursales = [
      '-N2gkVg1RtSLxK3rTMYc',
      '-N2gkzuYrS4XDFgYciId',
      '-N2glF34lV3Gj0bQyEWK',
      '-N2glQ18dLQuzwOv3Qe3',
      '-N2glf8hot49dUJYj5WP',
      '-NN8uAwBU_9ZWQTP3FP_',
    ]
  _sucursal:string

  mensaje_actualizacion:boolean = true


  formulario_etiqueta: FormGroup

  anios = this._vehiculos.anios
  marcas_vehiculos = this._vehiculos.marcas_vehiculos
  marcas_vehiculos_id = []
  array_modelos = []
  faltante_s:string
  vehiculos_compatibles = [
    {
      "marca": "Chevrolet",
      "modelo": "Camaro ZL1",
      "anio_inicial": "1999",
      "anio_final": "1999"
    },
    {
      "marca": "Pontiac",
      "modelo": "Matiz",
      "anio_inicial": "1996",
      "anio_final": "2001"
    },
    {
      "marca": "Aston Martín",
      "modelo": "DBX",
      "anio_inicial": "1996",
      "anio_final": "1996"
    }
  ]

  recepciones_arr:any=[]
  cotizaciones_arr:any=[]
  clientes_arr:any=[]
  vehiculos_arr:any=[]

  // TODO esto pertenece a administracion
  
  hora_start = '00:00:01';
  hora_end = '23:59:59';

  fechas_getAdministracion ={start:new Date(), end:new Date() }
  fechas_get_formateado_admin = {start:new Date(), end:new Date() }

  reporteAdministracion = {
    iva:0, refacciones:0, total:0, subtotal:0, operacion:0, cantidad:0,
    margen:0, por_margen:0
  }
  camposReporteAdministracion = [
    {valor:'cantidad', show:'Ordenes cerradas'},
    {valor:'subtotal', show:'Monto de ventas (Antes de IVA)'},
    {valor:'refacciones', show:'Costos Refacciones (de los autos cerrados)'},
    {valor:'operacion', show:'Costo Operacion'},
    {valor:'margen', show:'Margen'},
    {valor:'por_margen', show:'% Margen'},
  ]
  // TODO esto pertenece a administracion


  ngOnInit(): void {
    this.rol()
    const n = this._publicos.crearArreglo2(this._vehiculos.marcas_vehiculos)
    this.marcas_vehiculos_id = n.map(c=>{
      return c.id
    })
  }
    rol(){
        const { rol, sucursal, usuario } = this._security.usuarioRol()
        this._sucursal = sucursal
    }


    manejar_cache(){
      const nombre:string = `historial_pagos_orden`.toString()
      const starCountRef = ref(db, `${nombre}`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            this._encript.guarda_informacion({nombre, data: snapshot.val()})
          }
        })
    }

    revisar_cache(nombre:string){
      const objeto_desencriptado = localStorage.getItem(`${nombre}`)
      const desc = this._encript.servicioDecrypt_object(objeto_desencriptado)
      const nueva = JSON.parse(JSON.stringify(desc));
      return nueva
    }
    armar_informacion(){
      console.time('Execution Time');
    
      const recepciones_object = this.revisar_cache('recepciones')
      const cotizacionesRealizadas_object = this.revisar_cache('cotizacionesRealizadas')

      const historial_gastos_orden = this.crearArreglo2(this.revisar_cache('historial_gastos_orden'))
      const historial_pagos_orden = this.crearArreglo2(this.revisar_cache('historial_pagos_orden'))
      
      const clientes = this.revisar_cache('clientes')
      const vehiculos = this.revisar_cache('vehiculos')

      const clientes_arr = this.transformaDataCliente(this.crearArreglo2(clientes))
      
      const vehiculos_arr = this.transformaDataVehiculo({ vehiculos: this.crearArreglo2(vehiculos), clientes})

      const enviar_recepciones = {
        bruto: this.crearArreglo2(recepciones_object), 
        clientes, 
        vehiculos, 
        historial_gastos_orden, 
        historial_pagos_orden
      }
      const enviar_cotizaciones = {
        bruto: this.crearArreglo2(cotizacionesRealizadas_object), 
        clientes, 
        vehiculos, 
        historial_gastos_orden, 
        historial_pagos_orden
      }
      const recepciones_arr = this.asigna_datos_recepcion(enviar_recepciones)
      const cotizaciones_arr = this.asigna_datos_cotizaciones(enviar_cotizaciones)
      
      this.clientes_arr = clientes_arr
      this.vehiculos_arr = vehiculos_arr
      this.recepciones_arr = recepciones_arr
      this.cotizaciones_arr = cotizaciones_arr

      //empezar con administracion

      
      

      const servicios_terminados = recepciones_arr.filter(s=>s.status === 'entregado')
      console.log(servicios_terminados);


      const solo_gastos_orden = this.obtener_historial_orden(servicios_terminados,'historial_gastos_orden')
      const solo_pagos_orden = this.obtener_historial_orden(servicios_terminados,'historial_pagos_orden')
      
      console.log(solo_gastos_orden);

      const total_gastos_ordenes = this.sumaroria_historial_orden(solo_gastos_orden)
      console.log(total_gastos_ordenes);
      const total_pagos_ordenes = this.sumaroria_historial_orden(solo_pagos_orden)
      console.log(total_pagos_ordenes);
      

      
      

      // Ordenes cerradas
      // 0
      // Monto de ventas (Antes de IVA)
      // $ 0.00
      // Costos Refacciones (de los autos cerrados)
      // $ 0.00
      // Costo Operacion
      // $ 0.00
      // Margen
      // $ 0.00
      // % Margen


      // this.resetea_horas_admin(this.fechas_getAdministracion)
      // console.log(this.fechas_get_formateado_admin);
      // const {start, end } = this.fechas_get_formateado_admin

      // const nuevas = recepciones_arr.filter(r=>new Date(r.fecha_entregado) >= start && new Date(r.fecha_entregado) <= end && r.status === 'entregado')

      // console.log(nuevas);
      
      console.timeEnd('Execution Time');
    }
    
    asigna_datos_recepcion(data){
      const {bruto, clientes, vehiculos, historial_gastos_orden, historial_pagos_orden} = data

      const nuevos_ordenamiento =this._publicos.ordenamiento_fechas(bruto,'fecha_recibido',false)
      return nuevos_ordenamiento.map(recepcion=>{
        const {id, cliente, vehiculo,elementos, margen, iva, descuento, formaPago} = recepcion;
        recepcion.historial_gastos_orden = this.filtra_orden(historial_gastos_orden, id)
        recepcion.historial_pagos_orden = this.filtra_orden(historial_pagos_orden, id)
        recepcion.data_cliente = clientes[cliente]
        recepcion.data_vehiculo = vehiculos[vehiculo]
        recepcion.reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
        return recepcion
      })
    }
    asigna_datos_cotizaciones(data){
      const {bruto, clientes, vehiculos} = data
      const nuevos_ordenamiento =this._publicos.ordenamiento_fechas(bruto,'fecha_recibido',false)
      return nuevos_ordenamiento.map(cotizacion=>{
        const { cliente, vehiculo,elementos, margen, iva, descuento, formaPago, id} = cotizacion;
        cotizacion.data_cliente = clientes[cliente]
        cotizacion.data_vehiculo = vehiculos[vehiculo]
        cotizacion.reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
        return cotizacion
      })
    }
    filtra_orden(arreglo, id_orden){
      return [...arreglo].filter(f=>f.id_os === id_orden)
    }
    crearArreglo2(arrayObj: Record<string, any> | null): any[] {
      if (!arrayObj) return []; 
      return Object.entries(arrayObj).map(([key, value]) => ({ ...value, id: key }));
    }

    transformaDataCliente(data){
      const nuevos = [...data]
      const retornados = nuevos.map(cli=>{
        const {sucursal, nombre, apellidos } = cli
        cli.sucursalShow = this.sucursales_array.find(s=>s.id === sucursal).sucursal
        cli.fullname = `${String(nombre).toLowerCase()} ${String(apellidos).toLowerCase()}`
        return cli
      })
      return retornados
    }

    transformaDataVehiculo(data){
      const { clientes, vehiculos} = data
      const nuevos_ordenamiento =this._publicos.ordenamiento_fechas_x_campo(vehiculos,'placas',true)
      return nuevos_ordenamiento.map(vehiculo=>{
        const { cliente } = vehiculo
        vehiculo.data_cliente = clientes[cliente]
        return vehiculo
      })
    }
    resetea_horas_admin(data){
      const {start, end} = data
      this.fechas_get_formateado_admin.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
      this.fechas_get_formateado_admin.end = this._publicos.resetearHoras_horas(new Date(end), this.hora_end)
    }
    obtener_historial_orden(arreglo:any[], campo:string){
      let nuevos =[ ...arreglo]
      
      const arreglado = nuevos.map(recepcion=>{
        const historial_campo = recepcion[campo]
        return historial_campo
      })
      return arreglado.flat()
    }
    sumaroria_historial_orden(arreglo:any[]):number{
      let nuevos = [...arreglo]

      let sumatoria_montos_historial = 0
      nuevos.forEach(gs=>{
        const {status, monto} = gs
        if (status) {
          sumatoria_montos_historial+= monto
        }
      })
      return sumatoria_montos_historial
    }


    










    realizaOperacionesClientes2(){
      const new_mo:any[] = Object.keys(MO).map((mo)=>{
        MO[mo].tipo = 'mo'
        return MO[mo]
      })
      console.log(new_mo);
      const new_refacciones:any[] = Object.keys(refacciones).map((refaccion)=>{
        refacciones[refaccion].tipo = 'refaccion'
        return refacciones[refaccion]
      })
      console.log(new_refacciones);
      const new_alls:any[] = [...new_mo, ...new_refacciones]

      console.log(new_alls);
    }
    operaciones_mo_refacciones() {
      const {refacciones, manos_obra} = BD
    
        const processItems = (items, tipo) => {
          return Object.keys(items).map((item) => {
            items[item].tipo = tipo;
            return items[item];
          });
        };
      
        const new_mo = processItems(manos_obra, 'mo');
        const new_refacciones =  processItems(refacciones, 'refaccion');
      
        const new_alls = [...new_mo, ...new_refacciones];
        
        new_alls.map((e, index)=>{
          e.id_publico = obtenerID_elemento(e, index + 1)
          return e
        })

        function obtenerID_elemento(data, index){
          const {nombre, tipo} = data
          const nuevo_nombre = nombre.slice(0,3).toUpperCase()
          const nuevo_tipo = tipo.slice(0,2).toUpperCase()
          const secuencia = (index).toString().padStart(4, '0')
          const cadena = `${nuevo_tipo}${nuevo_nombre}-${secuencia}`
          return cadena;
        }

       
        const objeto = {};
        new_alls.forEach((element) => {
          const {id} = element
          const new_data  = JSON.parse(JSON.stringify(element));
          delete new_data.id
          delete new_data.cantidad
          delete new_data.aprobado
          let descripcion_nueva = new_data.descripcion || 'ninguna descripción'
          new_data.compatibles = [
            {
              "marca": "Chevrolet",
              "modelo": "Aveo",
              "anio_inicial": "2008",
              "anio_final": "2030"
            }
          ]
          new_data.descripcion = descripcion_nueva
          objeto[id] = new_data
        });

        console.log(objeto);
    }
      

    operacionesBD(){

      const  {clientes, vehiculos, correos, cotizacionesRealizadas, recepciones } = BD
      // console.log(correos);
      

      const sucursales =  this.claves_sucursales

      const nuevos_clientes_ = nuevos_clientes({clientes,sucursales})
      // console.log('nuevos_clientes_')
      // console.log(nuevos_clientes_);

      const vehiculos_arra = nuevos_vehiculos({vehiculos,sucursales})
      // console.log('vehiculos_arra')
      // console.log(vehiculos_arra);
      
      const cotizaciones_new = nuevas_cotizaciones({cotizacionesRealizadas, sucursales })
      // console.log('cotizaciones_new')
      // console.log(cotizaciones_new);

      const recepciones_new = nuevas_recepciones({recepciones, sucursales })
      // console.log('recepciones_new')
      // console.log(recepciones_new);


      // const plac = placas('-NJLLN484p3b-aPyspIr')
      // console.log(plac);
      
      
      function placas(vehiculo){
        const data_vehiculo = vehiculos_arra[vehiculo]
        let placas = ''
        if (data_vehiculo) {
          const {placas:placas_found} = data_vehiculo
          placas = placas_found
        }
        return `${placas}`.toUpperCase()
      }
      function fullname(cliente){
        const data_cliente = nuevos_clientes_[cliente]
        let fullname = ''
        if (data_cliente) {
          const {nombre, apellidos} = data_cliente
          fullname = `${nombre} ${apellidos}`
        }
        return `${fullname}`.toUpperCase()
      }
      function nuevaRecuperacionData(data: any, camposRecuperar: any[]) {
        const necessary: any = {};
        camposRecuperar.forEach((recupera) => {
            if(typeof data[recupera] === 'string'){
                const evalua = String(data[recupera]).trim()
                if (evalua !== undefined && evalua !== null && evalua !== "") {
                    necessary[recupera] = evalua;
                }
            }else{
                if (data[recupera] !== undefined && data[recupera] !== null && data[recupera] !== "") {
                    necessary[recupera] = data[recupera];
                }
            }
        });
        return necessary;
    }

      function nuevas_recepciones(data){
        const {sucursales, recepciones} = data

        const clientes_new = [];

        sucursales.forEach((sucursal) => {
          if (recepciones[sucursal]) {
            const recepciones_ = recepciones[sucursal];
            const claves_clientes = Object.keys(recepciones_)
            claves_clientes.forEach(cli=>{
              const arreglo_ = crearArreglo2(recepciones_[cli]);
              const nuevo = arreglo_.map((c) => {
                c.cliente = cli;
                c.checkList = purifica_checklist(c.checkList)
                c.detalles = purifica_detalles(c.detalles)
                const {vehiculo, cliente} = c
                c.fullname = fullname(cliente)
                c.placas = placas(vehiculo)
                const campos = Object.keys(c)
                return nuevaRecuperacionData(c, campos)
              });
              clientes_new.push(...nuevo);
            })
          }
        })
        // const aplanado = aplanar_array(clientes_new)
        const nuevo =  aplanar_array(clientes_new)
        return nuevo_objeto(nuevo)
        // return 
      }
      function nuevas_cotizaciones(data){
        const {sucursales, cotizacionesRealizadas} = data

        const clientes_new = [];

        sucursales.forEach((sucursal) => {
          if (cotizacionesRealizadas[sucursal]) {
            const cotizaciones_ = cotizacionesRealizadas[sucursal];
            const claves_clientes = Object.keys(cotizaciones_)
            claves_clientes.forEach(cli=>{
              const arreglo_ = crearArreglo2(cotizaciones_[cli]);
              const nuevo = arreglo_.map((c) => {
                const {vehiculo, cliente} = c
                c.cliente = cli;
                c.fullname = fullname(cliente)
                c.placas = placas(vehiculo)
                const campos = Object.keys(c)
                return nuevaRecuperacionData(c, campos)
              });
              clientes_new.push(...nuevo);
            })
          }
        })
        const nuevo =  aplanar_array(clientes_new)
        return nuevo_objeto(nuevo)
        // return aplanar_array(clientes_new)
      }
      function nuevos_vehiculos(data){
        const {vehiculos, sucursales} = data
        // let vehiculos_new =[]

        const vehiculos_new = [];

        sucursales.forEach((sucursal) => {
          const vehiculos_ = vehiculos[sucursal];
          const nuevas = Object.keys(vehiculos_);
          
          nuevas.forEach((cli) => {
            const arreglo_ = crearArreglo2(vehiculos_[cli]);
            const nuevo = arreglo_.map((c) => {
              c.cliente = cli;
              return c;
            });
            
            vehiculos_new.push(...nuevo); // Usamos spread para agregar los elementos individualmente
          });
        });
        const nuevo =  aplanar_array(vehiculos_new)
        return nuevo_objeto(nuevo)
      }
      function nuevos_clientes(data){
        const { sucursales, clientes } = data

        const clientes_new = [];

        sucursales.forEach((sucursal) => {
          const arreglo_ = crearArreglo2(clientes[sucursal]);
          clientes_new.push(arreglo_)
        })
        const nuevo =  aplanar_array(clientes_new)
        return nuevo_objeto(nuevo)
      }
      function nuevo_objeto(arreglo:any[]){
        let nuevo_objeto = {}
        arreglo.forEach(c=>{
          const {id} = c
          nuevo_objeto[id] = c
        })
        return nuevo_objeto
      }
      function crearArreglo2(arrayObj: Record<string, any> | null): any[] {
        if (!arrayObj) return []; 
        return Object.entries(arrayObj).map(([key, value]) => ({ ...value, id: key }));
      }
      function aplanar_array(arreglo){
        const allas = arreglo.flat()
        return allas
      }
      function purifica_checklist(checkList){
        const nuevo_check = [...checkList]
        const XD = nuevo_check.map(c=>{
          const {status, valor, show} = c
          let a = {status, valor}
          return a
        })
        return XD
      }
      function purifica_detalles(detalles){
        const nuevos_detalles = [...detalles]
        const XD = nuevos_detalles.map(c=>{
          const {status, valor, show} = c
          let a = {status, valor}
          return a
        })
        return XD
      }
    }

    operaciones_gastos(){
      const {refacciones, manos_obra} = BD
    }
    
}