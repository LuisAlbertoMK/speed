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
    // {ruta_observacion: 'recepciones', nombre:'claves_recepciones'},
    // {ruta_observacion: 'cotizaciones', nombre:'claves_cotizaciones'},
    // {ruta_observacion: 'vehiculos', nombre:'claves_vehiculos'},
    // {ruta_observacion: 'sucursales', nombre:'claves_sucursales'},
    // {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'},
    // {ruta_observacion: 'historial_gastos_operacion', nombre:'claves_historial_gastos_operacion'},
    // {ruta_observacion: 'historial_gastos_orden', nombre:'claves_historial_gastos_orden'},
    // {ruta_observacion: 'historial_pagos_orden', nombre:'claves_historial_pagos_orden'},
  ]

  busqueda:any = {ruta_observacion: 'clientes', nombre:'claves_clientes'}
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


    const claves_supervisa = this._publicos.revisar_cache2(nombre)

    // console.log(claves_supervisa);

    claves_supervisa.forEach(element => {
      // const commentsRef = ref(db, `${ruta_observacion}/${nombre}`);
      console.log(`${ruta_observacion}/${element}`);
      
    });
    
    return

    const commentsRef = ref(db, `${nombre}`);
      const localhost_nombre = await this._publicos.revisar_cache2(ruta_observacion)
      let temporales = []
      const onChildAddedCallback = async (data) => {
        const valor = data.val();
        if (!localhost_nombre[valor]) {
          // console.log(`valor no encontrado: ${valor}`);
          temporales.push(valor)

          const claves_encontradas = await this._publicos.revisar_cache2(nombre)
          const valorNoDuplicado = await [...new Set([...claves_encontradas, ...temporales])];
          // console.log(valorNoDuplicado);
          
          this._security.guarda_informacion({nombre, data: valorNoDuplicado})
          // localStorage.setItem('faltantes',JSON.stringify([...temporales]))
          // console.log(temporales);
          this._security.guarda_informacion({nombre:`faltantes_${nombre}`, data: [...temporales]})
          // this.simular_2({nombre, ruta_observacion})
          // this.simular_observacion_informacion_firebase_nombre({nombre, ruta_observacion})
        }
      };
      // console.log(temporales);
      

      
      onChildChanged(commentsRef, async (data) => {
        console.log('actualizacion');
        const valor =  data.val()
        const key = data.key
        console.log(key);
        console.log(valor);
        
        const claves_encontradas = await this._publicos.revisar_cache2(nombre)
        const valorNoDuplicado = await [...new Set([...claves_encontradas, valor])];
        // let nuevas_claves = obtenerElementosUnicos([...claves_encontradas, valor])
        console.log(valorNoDuplicado);
        this._security.guarda_informacion({nombre, data: valorNoDuplicado})
      })
      onChildRemoved(commentsRef, async (data) => {
        console.log('eliminacion');
        const valor =  data.val()
        console.log(`Valor a eliminar: ${valor}`);

        function eliminarValorDelArray(arr, valor) {
          return arr.filter((elemento) => elemento !== valor);
        }

        const localhost_claves_nombre_1 = await this._publicos.revisar_cache_real_time(nombre)
        const nuevas_claves = eliminarValorDelArray(localhost_claves_nombre_1, valor);
        await this._security.guarda_informacion({nombre, data: nuevas_claves})
        // this.simular_observacion_informacion_firebase_nombre({ruta_observacion, nombre})
      });

      // await Promise.all([
      onChildAdded(commentsRef, onChildAddedCallback)

        
      // ]); 
    
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