import { Component, OnInit } from '@angular/core';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from '../../services/encriptado.service';

import { Location } from '@angular/common';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';

import { ordenes_abril } from "./ayuda2";
import { VehiculosService } from 'src/app/services/vehiculos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-automaticos',
  templateUrl: './automaticos.component.html',
  styleUrls: ['./automaticos.component.css']
})
export class AutomaticosComponent implements OnInit {
  
  constructor( private _publicos: ServiciosPublicosService, private _vehiculos: VehiculosService,
    private _security:EncriptadoService, public _router: Router, public _location: Location
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
      };

      reader.readAsArrayBuffer(file);
    }
  }
  obtener_informacion_cache(cual){
    console.log(cual);
    const data_claves = this._publicos.nueva_revision_cache(cual)
    this._publicos.saber_pesos(data_claves)
    console.log(data_claves);
    const claves = this._publicos.nueva_revision_cache(`claves_${cual}`)
    console.log(claves);
    
  }
  asigancion_clientes_ordenes(){
    const clientes = this._publicos.nueva_revision_cache('clientes')
    const vehiculos = this._publicos.nueva_revision_cache('vehiculos')
    const servicios=[
      {valor:'1',nombre:'servicio'},
      {valor:'2',nombre:'garantia'},
      {valor:'3',nombre:'retorno'},
      {valor:'4',nombre:'venta'},
      {valor:'5',nombre:'preventivo'},
      {valor:'6',nombre:'correctivo'},
      {valor:'7',nombre:'rescate vial'}
    ]
    // console.log(clientes);
    const data_nueva_clientes = 
    Object.keys(clientes).map((cliente, index)=>{
      const newDta = this._publicos.crear_new_object(clientes[cliente])
        const fullname = this.return_fullname(newDta)
        const fullname_only_name = this.return_fullname2(newDta.nombre)
        return {...clientes[cliente], id: cliente, fullname, fullname_only_name}
    })
    // console.log(data_nueva_clientes);
    const nuevo_v = this._publicos.crearArreglo2(vehiculos)
    // console.log('vehiculos');
    // console.log(nuevo_v);
    
    let nuevas_ordenes = {}
    let faltantes_vehiculos = {}
    let faltantes_cliente = {}
    ordenes_abril.forEach((orden, index)=>{
      // if (index <20) {
        // console.log(orden);
        const {Cliente, Placas, Status, Kilometraje, Pagado, Precio, Subtotal, Utilidad} = orden
        const newDta = this._publicos.crear_new_object(orden)
        newDta.nombre = Cliente
        const fullname = this.return_fullname2(Cliente)
 
        
        const no_os = orden['Orden de Servicio']
        const anio = parseInt(orden['Fecha.Año'])
        const mes = orden['Fecha.Mes']
        const dia = parseInt(orden['Fecha.Día'])
        const serv = parseInt(orden['TIPO DE SERVICIO'])
        let numero_mes = 0
        switch (mes) {
          case 'Abr':
            numero_mes = 3
            break;
        
          default:
            break;
        }

        let data_cliente = data_nueva_clientes.find(cl=>cl.fullname === fullname)
        const data_vehiculo = nuevo_v.find(v=>this.sanitiza_placas(v.placas) === this.sanitiza_placas(Placas))
        const fecha_recibido = new Date(anio, numero_mes, dia,13,1,0).toString
        // console.log(data_nueva_clientes.find(cl=>cl.fullname === fullname));
        
        const servicio_ = servicios.find(s=>s.valor === '1')
        const clave_orden = `Clave_orden_${index +1}`
        if (!data_vehiculo) {
          // console.log('sin data vehiculo');
          
          // console.log(orden);
          // console.log( nuevas_ordenes[clave_orden]);
          faltantes_vehiculos[clave_orden] = {newDta, placas: this.sanitiza_placas(Placas)}
          
        }
        if (!data_cliente) {
          data_cliente = data_nueva_clientes.find(cl=>cl.fullname_only_name === fullname)
        }
        if (!data_cliente) {
          console.log(fullname);
          // console.log('sin data aun cliente');
          // console.log(orden);
          // console.log( nuevas_ordenes[clave_orden]);
          faltantes_cliente[clave_orden] = {newDta, Cliente}
        }
        const id_cliente = this._publicos.crear_new_object(data_cliente)
        const id_c = id_cliente.id = id_cliente.id
        const id_vehiculo = this._publicos.crear_new_object(data_vehiculo)
        const id_v = id_cliente.id = id_vehiculo.id
        nuevas_ordenes[clave_orden] = 
        {
          data_cliente, data_vehiculo,no_os, cliente: id_c, vehiculo: id_v ,
          fecha_recibido, kilometraje: Kilometraje, pagado: Pagado, utilidad: Utilidad,
          precio: Precio, status: Status.toLowerCase(), subotatal: Subtotal, servicio: 1, placas: this.sanitiza_placas(Placas) 
        }

      // }
    })
    console.log(nuevas_ordenes);
    console.log(faltantes_vehiculos);
    console.log(faltantes_cliente);
    let contador = 955
    let nuevos_registro = {}
    const updates = {}
    let claves_v_new = []
    
    Object.keys(faltantes_vehiculos).forEach(clav=>{
      const {newDta,   placas    } = faltantes_vehiculos[clav]

      const id_vehiculo = `id_vehiculo_${contador }`
      claves_v_new.push(id_vehiculo)
      contador++
      const temp = {
        marca: newDta['Marca'],
        modelo: newDta['Modelo'],
        anio: newDta['Año'],
        placas,
        color:'gris'
      }
      temp['engomado'] = this._vehiculos.engomado(placas) 
      if (nuevas_ordenes[clav]) {
        const obj= this._publicos.crear_new_object(nuevas_ordenes[clav])
        if (obj['data_cliente']) {
          // console.log(obj['data_cliente'].id);
          temp['cliente'] = obj['data_cliente'].id
        }
      }
      nuevos_registro[id_vehiculo] = temp
      updates[`vehiculos/${id_vehiculo}`] = temp
    })
    // console.log(nuevos_registro);
    console.log(claves_v_new);
   
    
    // update(ref(db), updates).then(()=>{
    //   console.log('finalizo');
    // })
    // .catch(err=>{
    //   console.log(err);
    // })
   
    
     
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
  return_fullname(data){
    const {nombre, apellidos} = data
    const nuevos_apellidos = (!apellidos) ? nombre : apellidos
      return `${nombre}${nuevos_apellidos}`
        .toLowerCase() //convierte todo a minusculas
        .trim() //elimina los espacion exteriores
        .normalize("NFD") // Normalizamos el texto en Unicode
        .replace(/[\u0300-\u036f]/g, "") // Eliminamos los caracteres diacríticos (acentos)
        .replace(/\s/g, "") // Eliminamos los espacios en blanco
        .replace(/_/g, "") // Elimina todos los guiones
        .replace(/-/g, ""); // Elimina todos los guiones
  }
  return_fullname2(data){
      return `${data}`
        .toLowerCase() //convierte todo a minusculas
        .trim() //elimina los espacion exteriores
        .normalize("NFD") // Normalizamos el texto en Unicode
        .replace(/[\u0300-\u036f]/g, "") // Eliminamos los caracteres diacríticos (acentos)
        .replace(/\s/g, "") // Eliminamos los espacios en blanco
        .replace(/_/g, "") // Elimina todos los guiones
        .replace(/-/g, ""); // Elimina todos los guiones
  }


}
