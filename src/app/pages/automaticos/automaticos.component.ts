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
    // {ruta_observacion: 'clientes', nombre:'claves_clientes'},
    // {ruta_observacion: 'vehiculos', nombre:'claves_vehiculos'},
    // {ruta_observacion: 'recepciones', nombre:'claves_recepciones'},
    // {ruta_observacion: 'cotizaciones', nombre:'claves_cotizaciones'},
    // {ruta_observacion: 'sucursales', nombre:'claves_sucursales'},
    // {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'},
    // {ruta_observacion: 'historial_gastos_operacion', nombre:'claves_historial_gastos_operacion'},
    {ruta_observacion: 'historial_gastos_orden', nombre:'claves_historial_gastos_orden'},
    // {ruta_observacion: 'historial_pagos_orden', nombre:'claves_historial_pagos_orden'},
  ]

  busqueda:any = {ruta_observacion: 'vehiculos', nombre:'claves_vehiculos'}
  ngOnInit(): void {
    this.rol()

   
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
      console.log(saber_pesos(real));
      
    })
    
  }

  async obtener_informacion_cache(){
    const {ruta_observacion, nombre} = this.busqueda
    console.log({ruta_observacion, nombre});
    const data_claves = await this._publicos.revisar_cache2(ruta_observacion)
    console.log(saber_pesos(data_claves));
    console.log(data_claves);
      
    const claves_keys = await this._publicos.revisar_cache2(nombre)
    // console.log(claves_keys);
    console.log(saber_pesos(claves_keys));

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


    // const claves_supervisa = this._publicos.revisar_cache2(nombre)
    const claves_supervisa = await this._automaticos.consulta_ruta(nombre)

    let resultados = [...claves_supervisa]
    console.log(resultados);

    const vigila_claves = ref(db, `${nombre}`);
    let temporales_claves = []
    onChildAdded(vigila_claves, async (data) => {
      const valor = data.val();
      console.log(valor);
      
      temporales_claves.push(valor)
      const valorNoDuplicado = await [...new Set([...claves_supervisa, ...temporales_claves])]
      console.log(valorNoDuplicado);
    });

    
    // console.log(claves_supervisa);

    // const localhost_nombre = await this._publicos.revisar_cache2(ruta_observacion)

    let temporales = []
    resultados.forEach(async (clave_vigilar) => {
      const commentsRef = ref(db, `${ruta_observacion}/${clave_vigilar}`);
      // console.log(`${ruta_observacion}/${clave_vigilar}`);
      // const valor = data.val();
      // if (!localhost_nombre[valor] ) {
      //   temporales.push(valor)
      //   const claves_encontradas = await this._publicos.revisar_cache2(nombre)
      //   const valorNoDuplicado = await [...new Set([...claves_encontradas, ...temporales])];
      //   this._security.guarda_informacion({nombre, data: valorNoDuplicado})
      //   if (temporales.length) {
      //     console.log('no encontrada en clientes '+ valor);
          
      //   }
      //   this._security.guarda_informacion({nombre:`faltantes_${nombre}`, data: [...temporales]})
      // }

      onChildChanged(commentsRef, async (data) => {
        const valor =  data.val()
        const key = data.key
        console.log(`actualizacion ${key}: ${valor}`);
        console.log(`Se descargo`, this._publicos.saber_pesos(data));
        const localhost_nombre = await this._publicos.revisar_cache2(ruta_observacion)

        if (localhost_nombre[clave_vigilar]) {
          // console.log(localhost_nombre[clave_vigilar]);
          const nueva_data_clave = this._publicos.crear_new_object(localhost_nombre[clave_vigilar])
          nueva_data_clave[key] = valor
          localhost_nombre[clave_vigilar] = nueva_data_clave
          this._security.guarda_informacion({nombre: ruta_observacion, data: localhost_nombre})
        }else{
          console.log(`la informacion del cliente no se encuentra`);
        }
      })
      
    });
    // console.log(temporales);
    
    
    
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
  async obtenerInformacionDeClientes(claves_faltantes, ruta_observacion) {
    const resultados_new = {};
  
    await Promise.all(claves_faltantes.map(async (clave) => {
      const data_cliente = await this._automaticos.consulta_ruta(`${ruta_observacion}/${clave}`);
      console.log('pesos data_cliente');
      
      console.log(saber_pesos(data_cliente));
      
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
function saber_pesos(data){
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(jsonString);
  const tamanioEnBytes = encodedData.length;
  const tamanioEnKilobytes = tamanioEnBytes / 1024;
  const tamanioEnMegabytes = tamanioEnKilobytes / 1024;
  return {tamanioEnBytes, tamanioEnKilobytes, tamanioEnMegabytes}
}
function eliminarElementosRepetidos(arregloOriginal, elementosAEliminar) {
  // Filtrar los elementos del segundo arreglo que no están en el primer arreglo
  const resultado = elementosAEliminar.filter((elemento) => !arregloOriginal.includes(elemento));
  return resultado;
}