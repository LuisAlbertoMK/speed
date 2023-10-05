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
import { data, morefacciones, vehiculos,  recepciones, clientes, historial_gastos_orden, 
  historial_pagos_orden, cotizaciones} from './ayuda';

pdfMake.vfs = pdfFonts.pdfMake.vfs



import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, onValue, update } from "firebase/database";

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
  ngOnInit(): void {
    this.rol()
    // const n = this._publicos.crearArreglo2(this._vehiculos.marcas_vehiculos)
    // this.marcas_vehiculos_id = n.map(c=>{
    //   return c.id
    // })
    this.obtener_claves()
  }
  
    rol(){
        const { rol, sucursal, usuario } = this._security.usuarioRol()
        this._sucursal = sucursal
        // this.acciones()
        // this.nuevos_id_save()
        // this.simular_descara_informacion_firebase_nombre()
        // this.simular_observacion_informacion_firebase_nombre('claves_clientes')
        // this.simular_observacion_informacion_firebase_nombre({ruta_observacion: 'clientes', nombre:'claves_clientes'})
        // this.simular_observacion_informacion_firebase_nombre({ruta_observacion: 'vehiculos', nombre:'claves_vehiculos'})
        // this.simular_observacion_informacion_firebase_nombre({ruta_observacion: 'recepciones', nombre:'claves_recepciones'})
        // this.simular_observacion_informacion_firebase_nombre({ruta_observacion: 'cotizaciones', nombre:'claves_cotizaciones'})
        // this.simular_observacion_informacion_firebase_nombre({ruta_observacion: 'historial_gastos_orden', nombre:'claves_historial_gastos_orden'})
        // this.simular_observacion_informacion_firebase_nombre({ruta_observacion: 'historial_pagos_orden', nombre:'claves_historial_pagos_orden'})
    }
    acciones(){
        
        // let campo = 'nombre'
        // const encontrados = eliminarElementosRepetidos(data, campo)
        // // const arr= this._publicos.crearArreglo2(encontrados)
        // console.log('informacion depurada');
        // console.log(encontrados);
        
        // const depurados= this._publicos.crearArreglo2(encontrados)
        // console.log('depurados');
        // console.log('depurados.length', depurados.length);
        // console.log(encontrarElementosRepetidos(depurados,campo));
        

        // const sindepurar= this._publicos.crearArreglo2(data)
        // console.log('sindepurar')
        // console.log('sindepurar.length', sindepurar.length);
        // console.log(encontrarElementosRepetidos(sindepurar,campo));


        console.log(`###### informacion xxx #`);
        

        // console.log(morefacciones);
        // const arreglo_morefacciones= this._publicos.crearArreglo2(morefacciones)
        // console.log('arreglo_morefacciones');
        // console.log(arreglo_morefacciones.length);
        // console.log(arreglo_morefacciones);
        
        

        // let nuevos_paquetes = {}

      
        // sindepurar.forEach((paquete, index)=>{
        //   const {id, elementos} = paquete
        //     paquete.elementos = nuevo_data_elemento({morefacciones, elementos})
        //   nuevos_paquetes[id] = paquete
        // })


        // console.log(nuevos_paquetes);
        const paquetes_armados  = this._publicos.crearArreglo2(this.armar_paquetes({morefacciones, paquetes: data}))
        console.log(paquetes_armados);
        this.paquetes_arr = paquetes_armados
        
        
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

    armar_paquetes(data){
      const {morefacciones, paquetes} = data
      const nuevos_paquetes = JSON.parse(JSON.stringify(paquetes));
      Object.keys(nuevos_paquetes).forEach(paquete=>{
        const {elementos, id} = nuevos_paquetes[paquete]
        const nuevos_elementos = [...elementos]
        const nuevos = nuevos_elementos.map(elemento=>{
          const {id: id_elemento} = elemento
          if (id_elemento) {
            return {...morefacciones[id_elemento], ...elemento}
          }else{
            return elemento
          }
        })
        nuevos_paquetes[id].elementos = nuevos;
        nuevos_paquetes[id] = this._publicos.reporte_paquetes(nuevos_paquetes[id])
      })
      return nuevos_paquetes
    }

    obtener_claves(){
      // console.log(Object.keys(vehiculos));
      this._security.guarda_informacion({nombre: 'claves_vehiculos', data: Object.keys(vehiculos)})
      this._security.guarda_informacion({nombre: 'claves_recepciones', data: Object.keys(recepciones)})
      this._security.guarda_informacion({nombre: 'claves_clientes', data: Object.keys(clientes)})
      this._security.guarda_informacion({nombre: 'claves_cotizaciones', data: Object.keys(cotizaciones)})
      this._security.guarda_informacion({nombre: 'claves_historial_gastos_orden', data: Object.keys(historial_gastos_orden)})
      this._security.guarda_informacion({nombre: 'claves_historial_pagos_orden', data: Object.keys(historial_pagos_orden)})
      // this._security.guarda_informacion({nombre: 'cotizaciones', data: recepciones})
      this._security.guarda_informacion({nombre: 'historial_gastos_orden', data: historial_gastos_orden})
      this._security.guarda_informacion({nombre: 'historial_pagos_orden', data: historial_pagos_orden})
      // this._security.guarda_informacion({nombre: 'cotizaciones', data: recepciones})
      // this._security.guarda_informacion({nombre: 'cotizaciones', data: recepciones})
    }

    async simular_observacion_informacion_firebase_nombre(data){
      const {ruta_observacion, nombre} = data
      console.log({ruta_observacion, nombre});
      
      const claves_nombre:any[] = await this._publicos.revisar_cache(nombre)

      console.log(claves_nombre);
      
      const resultados = await this._publicos.revisar_cache2(ruta_observacion)
      claves_nombre.forEach(clave => {
        const commentsRef = ref(db, `${ruta_observacion}/${clave}`);
        // console.log(`${ruta_observacion}/${clave}`);
        
        onChildChanged(commentsRef, (data) => {
          const key = data.key
          const valor =  data.val()
          console.log(key);
          // console.log(resultados[clave]);
          
          // resultados[clave][key] = valor
          if (resultados[clave]) {
            // console.log(resultados[clave]);
            const nueva_data = this._publicos.crear_new_object(resultados[clave])
              nueva_data[key] = valor
              resultados[clave] = nueva_data
              // console.log(clave);
              console.log(nueva_data);
              this._security.guarda_informacion({nombre: ruta_observacion, data: resultados})
          }
          
          
          
        });
      });

      
    }
    async simular_descara_informacion_firebase_nombre(){
      // let nombre = 'claves_clientes'
      // const claves_clientes:any[] = await this.obtener_claves_cache(nombre)
      // console.log(claves_clientes);
      
      // // const clave_cliente_new = `-clavegenerada-${claves_clientes.length}`
      // // claves_clientes.push(clave_cliente_new)
      
      // // this.registra_clave_nombre(nuevas_claves)
      // this._security.guarda_informacion({nombre, data: claves_clientes})

      // const claves_clientes_cache = await this._publicos.revisar_cache(nombre)
      // console.log(claves_clientes_cache);
      // // // 439: "-NeekzgvHBHAnRgY7M-A"
    }
    async obtener_claves_cache(nombre){
      const claves_clientes = await this._publicos.revisar_cache(nombre)
      let nuevas_claves = [...claves_clientes]
      return nuevas_claves
    }
    async registra_clave_nombre(arreglo_claves:any[], nombre:string){
      const updates = {};
      updates[`${nombre}`] = arreglo_claves;
      update(ref(db), updates).then(()=>{
        console.log('finalizo');
      })
      .catch(err=>{
        console.log(err);
      })
    }

    

}