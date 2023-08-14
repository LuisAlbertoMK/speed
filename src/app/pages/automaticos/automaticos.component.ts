import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, update } from 'firebase/database';
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
import { BD } from './ayuda';
pdfMake.vfs = pdfFonts.pdfMake.vfs

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
    ) {   }
  arr_sucursal = [...this._sucursales.lista_en_duro_sucursales]
  ngOnInit(): void {
    this.rol()
    this.realizaOperacionesClientes()
  }
    rol(){
        const { rol, sucursal, usuario } = this._security.usuarioRol()
    }
    realizaOperacionesClientes(){
      const clientes = BD.clientes
      const vehiculos_ = BD.clientes
      const sucursales = BD.sucursales
      const refacciones = BD.refacciones
      const manos_obra = BD.manos_obra
      const cotizaciones = BD.cotizacionesRealizadas
      
      
      const clientes_new = {
        '-N2gkVg1RtSLxK3rTMYc':{},
        '-N2gkzuYrS4XDFgYciId':{},
        '-N2glF34lV3Gj0bQyEWK':{},
        '-N2glQ18dLQuzwOv3Qe3':{},
        '-N2glf8hot49dUJYj5WP':{},
        '-NN8uAwBU_9ZWQTP3FP_':{}
      }
      const vehiculos_new = {
        '-N2gkVg1RtSLxK3rTMYc':{},
        '-N2gkzuYrS4XDFgYciId':{},
        '-N2glF34lV3Gj0bQyEWK':{},
        '-N2glQ18dLQuzwOv3Qe3':{},
        '-N2glf8hot49dUJYj5WP':{},
        '-NN8uAwBU_9ZWQTP3FP_':{}
      }

      const campos_cliente = [
        'no_cliente',
        'nombre',
        'apellidos',
        'correo',
        'correo_sec',
        'telefono_fijo',
        'telefono_movil',
        'tipo',
        'sucursal',
        'empresa',
      ]
      const campos_vehiculo = [
        'cliente',
        'placas',
        'vinChasis',
        'marca',
        'modelo',
        'categoria',
        'anio',
        'cilindros',
        'no_motor',
        'color',
        'engomado',
        'marcaMotor',
        'sucursal',
        'transmision',
      ]

      let array_correos = []
      let array_placas = []
      Object.keys(clientes).forEach(cli=>{
        const { vehiculos, sucursal } = clientes[cli]
        const vehdg_ = {}
        if (vehiculos) {
          
          const vehiculos_ = this._publicos.crearArreglo2(vehiculos)
          vehiculos_.forEach(v=>{
            const {id} = v
            const data_vehiculo = this._publicos.nuevaRecuperacionData(v, campos_vehiculo)
            vehdg_[id] = data_vehiculo
          })
          
        }
        const data_cliente = this._publicos.nuevaRecuperacionData(clientes[cli], campos_cliente)
        array_correos.push(data_cliente.correo)
        clientes_new[sucursal][cli] = data_cliente

        Object.keys(vehiculos_).forEach(vehi=>{
          if (vehiculos_[vehi].cliente === clientes_new) {
            const data_vehiculo = this._publicos.nuevaRecuperacionData(vehi, campos_vehiculo)
            // vehiculos_new[sucursal][cli]  = vehdg_
            vehdg_[vehi] = data_vehiculo
          }
        })

        vehiculos_new[sucursal][cli]  = vehdg_

        const placas_ = this._publicos.crearArreglo2(vehdg_)
        placas_.forEach(f=>{
          array_placas.push(f.placas)
        })
        
      })

      let nuevas_refacciones = {}
      let nuevas_manos_obra = {}
      const campos_refacciones = [
        'nombre',
        'cantidad',
        'precio',
        'costo',
        'marca',
        'status',
        'tipo',
        'descripcion',
      ]
      const campos_manos_obra = [
        'nombre',
        'cantidad',
        'precio',
        'costo',
        'status',
        'tipo',
        'descripcion',
      ]
      Object.keys(refacciones).forEach(r=>{
        const data_refaccion = this._publicos.nuevaRecuperacionData(refacciones[r], campos_refacciones)
        data_refaccion.nombre = String(data_refaccion.nombre). toLowerCase()
        nuevas_refacciones[r] = {...data_refaccion, id: r}
      })
      Object.keys(manos_obra).forEach(r=>{
        const data_mo = this._publicos.nuevaRecuperacionData(manos_obra[r], campos_manos_obra)
        data_mo.nombre = String(data_mo.nombre). toLowerCase()
        nuevas_manos_obra[r] = {...data_mo, id: r}
      })


      // console.log(nuevas_refacciones);

      
      
      let nuevas_cotizaciones = {
        '-N2gkVg1RtSLxK3rTMYc':{},
        '-N2gkzuYrS4XDFgYciId':{},
        '-N2glF34lV3Gj0bQyEWK':{},
        '-N2glQ18dLQuzwOv3Qe3':{},
        '-N2glf8hot49dUJYj5WP':{},
        '-NN8uAwBU_9ZWQTP3FP_':{}
      }
      
      const campos_cotizaciones = [
        'formaPago',
        'iva',
        'margen',
        'no_cotizacion',
        'nota',
        'pdf',
        'servicio',
        'elementos',
      ]
      let planas = []

      const nuevoObjeto = {};
      let updates = {}
      Object.entries(cotizaciones).forEach(([key, entrie])=>{
        // console.log(key);
        
        // console.log('antigua ---',entrie);
        const {cliente: data_cliente,vehiculo: data_vehiculo, fecha, hora} = entrie
        // sucursal/cliente/clave
        const fecha_n = this._publicos.convertirFecha(fecha)
        const fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: fecha_n, hora_recibida: hora }).toString
        
        const nnn= this._publicos.sumarRestarDiasFecha(new Date(fecha_recibido), 20)
        const vencimiento = this._publicos.retorna_fechas_hora({fechaString: new Date(nnn), hora_recibida: hora }).toString

        const data_nueva = this._publicos.nuevaRecuperacionData(entrie, campos_cotizaciones)
        
        data_nueva.cliente = data_cliente.id
        data_nueva.vehiculo = data_vehiculo.id
        data_nueva.sucursal = data_cliente.sucursal

        const otros = this.purifica_informacion(entrie)
        
        // const filtrados = otros.filter((element) => {
        //   if (element.tipo === "paquete") {
        //     return element.elementos.length > 0;
        //   }
        //   return true;
        // });

        const temp_data = {
          cliente: data_nueva.cliente,
          vehiculo: data_nueva.vehiculo,
          sucursal: data_nueva.sucursal,
          elementos: otros || [],
          fecha_recibido,
          fecha_vencimiento: vencimiento,
          formaPago: entrie['formaPago'] || '1',
          iva: entrie['iva'] || true,
          margen: entrie['margen'] || 25,
          no_cotizacion: entrie['no_cotizacion'],
          nota: entrie['nota'] || '' ,
          pdf: entrie['pdf'] || '',
          servicio: entrie['servicio'] || 1,
          id: key
        }
        // console.log('nueva ---',temp_data);



        updates[`cotizacionesRealizadas/${data_nueva.sucursal}/${data_nueva.cliente}/${key}`] = temp_data

        // planas.push(temp_data)
        // return temp_data
        
      })
      // console.log(nuevas_recepciones);
    
      // console.log(nuevas_cotizaciones);
      // console.log(updates);
      
      // update(ref(db), updates).then(()=>{
      //   console.log('finalizo');
      // })
      // .catch(err=>{
      //   console.log(err);
      // })


      
      

      // console.log(vehiculos_new);
      // console.log(clientes_new);
      // console.log(array_correos);
      // console.log(array_placas);

      function obtenerElementosUnicos(array) {
        return [...new Set(array)];
      }

      function obtenerElementosUnicosPorNombre(elementos) {
        const nombresUnicos = new Set();
      
        const elementosUnicos = Object.values(elementos).filter((elemento) => {
          const nombreMinusculas = elemento['nombre'].toLowerCase();
          if (!nombresUnicos.has(nombreMinusculas)) {
            nombresUnicos.add(nombreMinusculas);
            return true;
          }
          return false;
        });
      
        return elementosUnicos;
      }

      
      // console.log(nuevas_refacciones);

      // const nuedfghb = this._publicos.crearArreglo2(nuevas_refacciones)
      
      // console.log(nuedfghb);
      
      const sdgft = obtenerElementosUnicosPorNombre(nuevas_manos_obra)

      // const arrelo = this._publicos.ordernarPorCampo(nuedfghb, 'nombre')
      const arrelo2 = this._publicos.ordernarPorCampo(sdgft, 'nombre')
      
      // console.log(arrelo)
      // console.log(arrelo2)

      let nuevos = {}

      arrelo2.forEach(element => {
        nuevos[element.id] = element
      });
        

      console.log(nuevos);
      
      
      
      // console.log(obtenerElementosUnicos(array_placas));
      // console.log(obtenerElementosUnicos(array_correos));
      

    //   update(ref(db), 'updates').then(()=>{
    //       console.log('finalizo');
    //     })
    //     .catch(err=>{
    //       console.log(err);
    //     })
      
    }

    mano_refaccion({costo, precio, cantidad}){
      const mul = (costo > 0 ) ? costo : precio
      return cantidad * mul
    }
    total_paquete({elementos}){
      const reporte = {mo:0, refacciones:0}
      const nuevos_elementos = [...elementos] 
  
      if (!nuevos_elementos.length) return {reporte, nuevos_elementos}
  
      nuevos_elementos.map((ele, index)=>{
        ele.index = index
        const {tipo} = ele
        const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
        const operacion = this.mano_refaccion(ele)
        reporte[donde] += operacion
        ele.total = operacion
        return ele
      })
      return {reporte, nuevos_elementos}
    }

    purifica_informacion(data){
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
            nueva = this._publicos.nuevaRecuperacionData(element,campos_paquete)
            const info_su = this.purifica_informacion_interna(nueva.elementos)
            // console.log(info_su);
            nueva.elementos = info_su
            
            break;
          case 'mo':
            nueva = this._publicos.nuevaRecuperacionData(element,campos_mo)
            break;
          case 'refaccion':
            nueva = this._publicos.nuevaRecuperacionData(element,campos_refaccion)
            break;
        }
  
        //primera recuperacion 
        // console.log(nueva);
        return nueva
      });
      // console.log(registra);
      return registra
    }
    purifica_informacion_interna(elementos:any[]){
      const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
      const campos_refaccion = [ ...campos_mo, 'marca']
  
      const nuevos_e = elementos || []
      const nuevos_elementos = nuevos_e.map(e=>{
        const {tipo} = e
        e.nombre = String(e.nombre).toLowerCase()
        switch (tipo) {
          case 'mo':
          case 'MO':
            e.id = e.IDreferencia
            e.tipo = String(tipo).toLowerCase()
            
            return this._publicos.nuevaRecuperacionData(e,campos_mo)
          case 'refaccion':
            return this._publicos.nuevaRecuperacionData(e,campos_refaccion)
        }
      })
  
      return nuevos_elementos 
  
    }
   
  
    
}