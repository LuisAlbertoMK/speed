import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

import { environment } from "../../environments/environment"
import { ServiciosPublicosService } from './servicios-publicos.service';
const urlServer = environment.firebaseConfig.databaseURL
@Injectable({
  providedIn: 'root'
})
export class CitasService {

  constructor(private http: HttpClient, private _publicos: ServiciosPublicosService) { }

  camposInfoCita = [ 
    {valor: 'sucursalShow', show:'Sucursal'},
    {valor: 'fullname', show:'Cliente'},
    {valor: 'correo', show:'Correo'},
    {valor: 'placas', show:'placas'},
    {valor: 'servicioShow', show:'Servicio'},
    {valor: 'dia', show:'dia cita'},
    {valor: 'horario', show:'Hora cita'},
    {valor: 'cotizacionShow', show:'Cotización ocupada'},
    {valor: 'cotizacionCosto', show:'Costo de cotización'},
    {valor: 'direccion', show:'direccion de recoleccion'},
  ]

  colores_citas = [
    {show:'amarillo',valor:'noConfirmada',color:'#ffc107', mensaje: 'no confirmada'},
    {show:'cyan',valor:'confirmada',color:'#17a2b8', mensaje: 'Confirmada'},
    {show:'rojo',valor:'cancelada',color:'#dc3545', mensaje: 'Cancelada'},
    {show:'verde',valor:'sinConfirmarDomicilio',color:'#28a745', mensaje: 'Sin confirmar domicilio'},
    {show:'azul',valor:'concretada',color:'#007bff', mensaje: 'Concretada'},
  ]
  camposMenuCita = [
    {valor: 'nombre', show:'Nombre'},
  ]
  horarios_citas = 
    {
      "-N2glF34lV3Gj0bQyEWK": {
        "lunesViernes": [
          "09:00",
          "09:10",
          "09:20",
          "09:30",
          "09:40",
          "09:50",
          "10:00",
          "10:10",
          "10:20",
          "10:30",
          "10:40",
          "10:50",
          "11:00",
          "11:10",
          "11:20",
          "11:30",
          "11:40",
          "11:50",
          "12:00",
          "12:10",
          "12:20",
          "12:30",
          "12:40",
          "12:50",
          "13:00",
          "13:10",
          "13:20",
          "13:30",
          "13:40",
          "13:50",
          "14:00",
          "14:10",
          "14:20",
          "14:30",
          "14:40",
          "14:50",
          "15:00",
          "15:10",
          "15:20",
          "15:30",
          "15:40",
          "15:50",
          "16:00",
          "16:10",
          "16:20",
          "16:30",
          "16:40",
          "16:50",
          "17:00",
          "17:10",
          "17:20",
          "17:30",
          "17:40",
          "17:50",
          "18:00",
          "18:10",
          "18:20"
        ],
        "sabado": [
          "09:00",
          "09:10",
          "09:20",
          "09:30",
          "09:40",
          "09:50",
          "10:00",
          "10:10",
          "10:20",
          "10:30",
          "10:40",
          "10:50",
          "11:00",
          "11:10",
          "11:20",
          "11:30",
          "11:40",
          "11:50",
          "12:00",
          "12:10",
          "12:20",
          "12:30",
          "12:40",
          "12:50",
          "13:00",
          "13:10",
          "13:20",
          "13:30",
          "13:40",
          "13:50",
          "14:00",
          "14:10",
          "14:20",
          "14:30",
          "14:40",
          "14:50"
        ]
      },
      "otras": {
        "lunesViernes": [
          "08:30",
          "08:40",
          "08:50",
          "09:00",
          "09:10",
          "09:20",
          "09:30",
          "09:40",
          "09:50",
          "10:00",
          "10:10",
          "10:20",
          "10:30",
          "10:40",
          "10:50",
          "11:00",
          "11:10",
          "11:20",
          "11:30",
          "11:40",
          "11:50",
          "12:00",
          "12:10",
          "12:20",
          "12:30",
          "12:40",
          "12:50",
          "13:00",
          "13:10",
          "13:20",
          "13:30",
          "13:40",
          "13:50",
          "14:00",
          "14:10",
          "14:20",
          "14:30",
          "14:40",
          "14:50",
          "15:00",
          "15:10",
          "15:20",
          "15:30",
          "15:40",
          "15:50",
          "16:00",
          "16:10",
          "16:20",
          "16:30",
          "16:40",
          "16:50",
          "17:00",
          "17:10",
          "17:20",
          "17:30",
          "17:40",
          "17:50",
          "18:00",
          "18:10",
          "18:20"
        ],
        "sabado": [
          "08:30",
          "08:40",
          "08:50",
          "09:00",
          "09:10",
          "09:20",
          "09:30",
          "09:40",
          "09:50",
          "10:00",
          "10:10",
          "10:20",
          "10:30",
          "10:40",
          "10:50",
          "11:00",
          "11:10",
          "11:20",
          "11:30",
          "11:40",
          "11:50",
          "12:00",
          "12:10",
          "12:20",
          "12:30",
          "12:40",
          "12:50"
        ]
      }
    }
  
  citasCampos = [ 'sucursal','cliente','vehiculo','dia','horario']

  consulta_citas_mes_new(anio, mes, sucursal): Promise<any[]> {
    function formatoDosDigitos(numero) { return numero.toString().padStart(2, '0'); }
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas/${anio}/${mes}/${sucursal}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const citas = this._publicos.crearArreglo2(snapshot.val())
          citas.forEach(c=>{
            c.asistenciaShow = c.asistencia ? 'SI' : 'NO';
            c.recordatorioShow = c.recordatorio ? 'SI' : 'NO';
            c.confirmadaShow = c.confirmada ? 'SI' : 'NO';
            c.title = `${c.placas.toUpperCase()} ${c.dia} ${c.horario}`;
            c.ruta = `Citas/${anio}/${mes}/${sucursal}/${c.id}`
            const mi_fecha_1 = this._publicos.convertirFecha(c.dia);
            c.fecha_compara = this._publicos.resetearHoras_horas(mi_fecha_1, `${c.horario}:00`);
            const mi_fecha = this._publicos.conveirtefecha_2(mi_fecha_1);
            c.start = `${mi_fecha.anio}-${formatoDosDigitos(mi_fecha.mes)}-${formatoDosDigitos(mi_fecha.dia)} ${c.horario}`;
            if (c.status) {
              const {color, mensaje} = this.colores_citas.find(col=>col.valor === c.status)
              c.backgroundColor  = color
              c.mensajeStatus = mensaje
            }
            c.comentarios = this._publicos.crearArreglo2(c.comentarios) || []
            // c.comentarios.forEach((element,index) => {
            //   element.index = index + 1
            // });
            // else{
            //   c.backgroundColor = '#ffc107'
            //   c.mensajeStatus = 'no confirmada'
            //   c.status = 'noConfirmada'
            // }
            return c;
          })
          resolve(citas);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_citas_dia(ruta): Promise<any> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `${ruta}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val())
        } else {
          resolve({});
        }
      }, {
        onlyOnce: true
      })
    });
  }
  consulta_citas_mes_todas_new(anio, mes): Promise<any[]> {
    function formatoDosDigitos(numero) { return numero.toString().padStart(2, '0'); }
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas/${anio}/${mes}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          let citasFinales = []
          const id_sucursales = [
            '-N2gkVg1RtSLxK3rTMYc', '-N2gkzuYrS4XDFgYciId', '-N2glF34lV3Gj0bQyEWK','-N2glQ18dLQuzwOv3Qe3','-N2glf8hot49dUJYj5WP','-NN8uAwBU_9ZWQTP3FP_'
          ]
          const citas = snapshot.val()
          id_sucursales.forEach(c => {
            
            if (citas[c]) {
              const citas_new = this._publicos.crearArreglo2(citas[c]);
              citas_new.forEach(cit => {
                
                const mi_fecha_1:Date = this._publicos.convertirFecha(cit.dia);
                const mi_fecha = this._publicos.conveirtefecha_2(mi_fecha_1);
                cit.asistenciaShow = cit.asistencia ? 'SI' : 'NO';
                cit.recordatorioShow = cit.recordatorio ? 'SI' : 'NO';
                cit.confirmadaShow = cit.confirmada ? 'SI' : 'NO';
                (cit.title)? null : cit.title = `${cit.placas.toUpperCase()} ${cit.dia} ${cit.horario}`;
                (cit.ruta)? null : cit.ruta = `Citas/${anio}/${mes}/${c}/${cit.id}`
                cit.start = `${mi_fecha.anio}-${formatoDosDigitos(mi_fecha.mes)}-${formatoDosDigitos(mi_fecha.dia)} ${cit.horario}`;
                
                cit.fecha_compara = this._publicos.resetearHoras_horas(mi_fecha_1, `${cit.horario}:00`);
                if (cit.status) {
                  const {color, mensaje} = this.colores_citas.find(col=>col.valor === cit.status)
                  cit.backgroundColor  = color
                  cit.mensajeStatus = mensaje
                }
                cit.comentarios = this._publicos.crearArreglo2(cit.comentarios) || []
                // cit.comentarios.forEach((element,index) => {
                //   element.index = index + 1
                // });
                // else{
                //   cit.backgroundColor = '#ffc107'
                //   cit.mensajeStatus = 'no confirmada'
                //   cit.status = 'noConfirmada'
                // }
                citasFinales.push(cit);
              });
            }
          });
          resolve(citasFinales);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_citas_new(sucursal, fecha): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas/${sucursal}/${fecha}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          // const citas = snapshot.val()
          const citas = this._publicos.crearArreglo2(snapshot.val())
          resolve(this._publicos.ordenarData(citas,'horario',true));
        } else {
          resolve([]);
        }
      });
    });
  }
  
  consulta_cita_existe_new( anio, mes, sucursal): Promise<any[]> {
    function formatoDosDigitos(numero) { return numero.toString().padStart(2, '0'); }
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas/${anio}/${mes}/${sucursal}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const citas = this._publicos.crearArreglo2(snapshot.val())
          // const citas = snapshot.val()
          citas.forEach(c => {
            c.asistenciaShow = c.asistencia ? 'SI' : 'NO';
            c.recordatorioShow = c.recordatorio ? 'SI' : 'NO';
            c.confirmadaShow = c.confirmada ? 'SI' : 'NO';
            c.title = `${c.placas.toUpperCase()} ${c.dia} ${c.horario}`;
      
            const mi_fecha_1 = this._publicos.convertirFecha(c.dia);
            c.fecha_compara = this._publicos.resetearHoras_horas(mi_fecha_1, `${c.horario}:00`);
            const mi_fecha = this._publicos.conveirtefecha_2(mi_fecha_1);
            c.start = `${mi_fecha.anio}-${formatoDosDigitos(mi_fecha.mes)}-${formatoDosDigitos(mi_fecha.dia)} ${c.horario}`;
          });
          resolve(citas);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_cita_existe_new_2(anio,mes,sucursal): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas/${anio}/${mes}/${sucursal}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const citas = this._publicos.crearArreglo2(snapshot.val())
          resolve(citas);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_cita_existestentes_new(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const citas = snapshot.val()
          resolve(citas);
        } else {
          resolve([]);
        }
      });
    });
  }
  compararHorasEntreFechas(fechaInicio: Date, fechaFin: Date): number {
    const diffMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
    const diffHoras = diffMilisegundos / (1000 * 60 * 60);
    return Math.abs(diffHoras);
  }
  
  ////aqui
  consulta_horarios_sucursal_new(sucursal): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `horarios/${sucursal}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const horarios = snapshot.val()
          resolve(horarios);
        } else {
          resolve([]);
        }
      });
    });
  }
  citasDia(sucursal:string, fecha:string){
    return this.http.get(`${urlServer}/citas/${sucursal}/${fecha}.json`)
    .pipe(  
       map(this.crearArreglo2)
    )
  }
    verificaCitasDia(fecha_registro:string,sucursal:string){
    return this.http.get(`${urlServer}/citas/${sucursal}/${fecha_registro}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  guardarCita(fecha_registro:string,dataCita:any, fecha:string){
    const temp = {
      ...dataCita
    }
    temp.fecha = fecha
    return this.http.post(`${urlServer}/citas/${dataCita.sucursal}/${fecha_registro}.json`,temp)
  }
  getHorarios(sucursal:string, diaSemana:string){
    return this.http.get(`${urlServer}/horarios/${sucursal}/${diaSemana}.json`)
  }

  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
    const arraypush: any = arrayObj[key]
    arraypush.id=key
    arrayGet.push(arraypush)
    })
    return arrayGet
  }
}
