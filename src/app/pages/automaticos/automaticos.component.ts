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
import { data, morefacciones } from './ayuda';
import { BD } from './BD_completa';
pdfMake.vfs = pdfFonts.pdfMake.vfs



import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, onValue } from "firebase/database";

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ExporterService } from 'src/app/services/exporter.service';


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
      refacciones:0, subtotal:0, operacion:0, cantidad:0,
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

  // TODO pertenece a corte de ingresos
  reporte = {objetivo:0, operacion: 0, orden:0, ventas:0, sobrante:0, porcentajeGM:0, porcentaje:0, ticketPromedio:0, refacciones:0}
  camposReporte = [
    {valor:'ticketPromedio', show:'Ticket Promedio'},
    {valor:'objetivo', show:'Objetivo'},
    {valor:'ventas', show:'Total ventas'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    {valor:'sobrante', show:'GM'},
  ]
  metodospago = [
    {metodo:'1', show:'Efectivo'},
    {metodo:'2', show:'Cheque'},
    {metodo:'3', show:'Tarjeta'},
    {metodo:'4', show:'OpenPay'},
    {metodo:'5', show:'Clip'},
    {metodo:'6', show:'BBVA'},
    {metodo:'7', show:'BANAMEX'},
    {metodo:'8', show:'credito'}
  ]
  metodos = {
    Efectivo:0,
    Cheque:0,
    Tarjeta:0,
    OpenPay:0,
    Clip:0,
    BBVA:0,
    BANAMEX:0,
    credito:0,
  }
  // TODO pertenece a corte de ingresos
  //TODO reporte de gastos
  reporte_gastos = {deposito: 0, operacion: 0, sobrante:0, orden:0, restante:0}
  camposReporte_gastos = [
    {valor:'deposito', show:'Depositos'},
    {valor:'sobrante', show:'Suma de sobrantes'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    {valor:'restante', show:'Sobrante op'},
  ]
  //TODO reporte de gastos


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
        this.acciones()
    }
    acciones(){
        
        let campo = 'nombre'
        const encontrados = eliminarElementosRepetidos(data, campo)
        // const arr= this._publicos.crearArreglo2(encontrados)
        console.log('informacion depurada');
        console.log(encontrados);
        
        const depurados= this._publicos.crearArreglo2(encontrados)
        console.log('depurados');
        console.log('depurados.length', depurados.length);
        console.log(encontrarElementosRepetidos(depurados,campo));
        

        const sindepurar= this._publicos.crearArreglo2(data)
        console.log('sindepurar')
        console.log('sindepurar.length', sindepurar.length);
        console.log(encontrarElementosRepetidos(sindepurar,campo));


        console.log(`###### informacion xxx #`);
        
        // console.log(morefacciones);
        const arreglo_morefacciones= this._publicos.crearArreglo2(morefacciones)
        console.log('arreglo_morefacciones');
        console.log(arreglo_morefacciones.length);
        console.log(arreglo_morefacciones);
        
        

        let nuevos_paquetes = {}

      
        sindepurar.forEach((paquete, index)=>{
          const {id, elementos} = paquete
            paquete.elementos = nuevo_data_elemento({morefacciones, elementos})
          nuevos_paquetes[id] = paquete
        })

        // console.log(nuevos_paquetes['-NXpvKAAGvHgD31bk8oQ']);
        // console.log(nuevos_paquetes['-NXq3BcKzlcRXzFp46DT']);
        // console.log(nuevos_paquetes['-NXqIwcwRkg1Szsrbjjz']);

        console.log(nuevos_paquetes);
        
        
        function nuevo_data_elemento(data){
          const {morefacciones, elementos} = data
          // console.log(elementos);

          let nuevos_elementos:any[] = [...elementos]

          const afhgj = nuevos_elementos.map(elemento=>{
            const {id:id_elemento, costo:costo_elemento, cantidad: cantidad_elemento} = elemento
            // console.log(id_elemento);
            let data_elemento_return
            if (morefacciones[id_elemento]) {
              // console.log(morefacciones[id_elemento]);
              const data_elemento = JSON.parse(JSON.stringify(morefacciones[id_elemento]));
              data_elemento.costo =  (data_elemento.costo < 1) ? 0 : data_elemento.costo;
              const nuevo_costo = (costo_elemento > 0) ? costo_elemento : data_elemento.costo
              const nueva_cantidad = (cantidad_elemento > 0) ? cantidad_elemento : 1
              data_elemento_return =  {
                id:id_elemento,
                aprobado: true,
                costo: nuevo_costo,
                cantidad: nueva_cantidad
              }
              // console.log('regreso');
              
            }else{
              data_elemento_return = elemento
            }
            return data_elemento_return
          })

          return afhgj
          
        }

        // console.log(data);
        
        // let nuevas_recepciones = {}

        // depurados.forEach(rececpion=>{
        //   const {id, checkList, detalles} = rececpion
        //   const otros = purifica_informacion(rececpion)
        //   const filtrados = otros.filter((element) => {
        //     if (element.tipo === "paquete") {
        //       return element.elementos.length > 0;
        //     }
        //     return true;
        //   });
        //   rececpion.elementos= filtrados
        //   rececpion.checkList = purifica_checkList(checkList)
        //   rececpion.detalles = purifica_checkList(detalles)
        //   delete rececpion.fullname
        //   delete rececpion.placas
        //   nuevas_recepciones[id] = rececpion
        // })


        // console.log(nuevas_recepciones);
        
        


        function eliminarElementosRepetidos(objeto: Record<string, any>, campo: string): Record<string, any> {
          const conteo = {};
          const nuevoObjeto: Record<string, any> = {};
        
          for (const key in objeto) {
            if (objeto.hasOwnProperty(key)) {
              const elemento = objeto[key];
              const valorCampo = elemento[campo];
        
              if (!conteo[valorCampo]) {
                nuevoObjeto[key] = elemento;
                conteo[valorCampo] = true;
              }
            }
          }
        
          return nuevoObjeto;
        }
        function encontrarElementosRepetidos(arr: any[], campo: string): any[] {
          const conteo = {};
          const elementosRepetidos = [];
        
          for (const elemento of arr) {
            const valorCampo = elemento[campo];
            
            if (conteo[valorCampo]) {
              elementosRepetidos.push(valorCampo);
            } else {
              conteo[valorCampo] = 1;
            }
          }
        
          return elementosRepetidos;
        }
        function reemplazarUltimosCaracteres(cadena: string, caracteresNuevos: string): string {
          const inciio_cadena = cadena.substring(0, 8);
          return `${inciio_cadena}${caracteresNuevos}`
        }
        function reemplazarUltimosCaracteres_morefacciones(cadena: string, caracteresNuevos: string): string {
          const inciio_cadena = cadena.substring(0, 6);
          return `${inciio_cadena}${caracteresNuevos}`
        }

        // const nueva_data = (nueva_data: any) => () => {
        //   console.log("Este es el valor de nueva_data:", nueva_data);
        // };

        function purifica_informacion(data){
          const nueva_ = JSON.parse(JSON.stringify(data));
          const {elementos} = nueva_
          const _elementos_purifica = (elementos) ? elementos : []
          const registra = _elementos_purifica.map(element => {
            const {tipo } = element
            const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
            const campos_refaccion = [ ...campos_mo, 'marca']
            const campos_paquete = [ 'aprobado', 'cantidad', 'cilindros', 'costo', 'elementos', 'enCatalogo', 'id', 'marca', 'modelo', 'nombre', 'status', 'tipo' ]
            let nueva 
            switch (tipo) {
              case 'paquete':
                nueva = nuevaRecuperacionData(element,campos_paquete)
                const info_su = purifica_informacion_interna(nueva.elementos)
                // console.log(info_su);
                nueva.elementos = info_su
                
                break;
              case 'mo':
                nueva = nuevaRecuperacionData(element,campos_mo)
                break;
              case 'refaccion':
                nueva = nuevaRecuperacionData(element,campos_refaccion)
                break;
            }
      
            //primera recuperacion 
            // console.log(nueva);
            return nueva
          });
          // console.log(registra);
          return registra
        }
        function purifica_informacion_interna(elementos:any[]){
          const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
          const campos_refaccion = [ ...campos_mo, 'marca']
      
          const nuevos_elementos = elementos.map(e=>{
            const {tipo} = e
            e.nombre = String(e.nombre).toLowerCase()
            switch (tipo) {
              case 'mo':
              case 'MO':
                e.id = e.IDreferencia
                e.tipo = String(tipo).toLowerCase()
                
                return nuevaRecuperacionData(e,campos_mo)
              case 'refaccion':
                return nuevaRecuperacionData(e,campos_refaccion)
            }
          })
      
          return nuevos_elementos 
      
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
        function purifica_checkList(arreglo:any[]){
            let nuevo = {}
            arreglo
            .forEach(ele=>{
              const {valor, status} = ele
              nuevo[valor] = status
            })
            return nuevo
        }
        function crearArreglo2(arrayObj: Record<string, any> | null): any[] {
          if (!arrayObj) return []; 
          return Object.entries(arrayObj).map(([key, value]) => ({ ...value, id: key }));
        }
        
        
        
        
    }

    

}