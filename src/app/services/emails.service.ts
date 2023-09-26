import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { getDatabase, onValue, ref, set } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());
import { environment } from 'src/environments/environment';

const url = environment.cloud
// const url = '';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  constructor(private http: HttpClient) { }
  
  
  async EmailBienvenida(cliente:any){    
    const dataEmail = {
      // from:cliente['correos'][0],
      cliente: cliente['nombre'],
      subject: 'Bienvenido a SpeedPro',
      emailAnexa: cliente['correos'],
      tipo:'bienvenida',
      no_cliente: cliente.no_cliente,
      filtro_conceptos: []
    }
    
    const dataMail = await this.template(cliente,'',dataEmail)
     console.log(dataMail);
    // return this.http.post(url,dataMail).subscribe()
  }
  async EmailCotizacion(data:any){
    const dataEmail = {
      filename: `${data.filename}.pdf`,
      pathPDF: data.pathPDF,
      subject: 'Nueva cotización SpeedPro',
      tipo:'cotizacion',
      emailAnexa:data['correos'],
      filtro_conceptos: data.filtro_conceptos
    }
    // console.log(dataEmail);
    const dataMail = await this.template(data['cliente'],data['vehiculo'],dataEmail)
    console.log(dataMail);
    // return this.http.post(url,dataMail).subscribe()
  }
  async recordatorioCotizacion(cliente:any,vehiculo:any,cotizacion:any,filtro_conceptos:any){
    const dataEmail = {
      subject: 'recordatorio de cotización',
      tipo:'recordatorioCotizacion',
      fecha: cotizacion.fecha,
      vencimiento: cotizacion.vencimiento,
      filename: `${cotizacion.no_cotizacion}.pdf`,
      pathPDF: `${cotizacion.pdf}`,
      filtro_conceptos
    }
    const dataMail = await this.template(cliente,vehiculo,dataEmail)
    console.log(dataMail);
    // return this.http.post(url,dataMail).subscribe()
  }
  async EmailCambioStatus(data:any){
    // console.log(data);
    const dataEmail = {
      subject: `Cambio status vehículo ha ${data.status}`,
      tipo:'change',
      correos: data.correos,
      cliente: data.cliente,
      vehiculo: data.vehiculo,
      status:data.status,
      no_os:data['no_os'],
      desgloce: data['desgloce']
    }
    const dataMail = await this.template(data.cliente,data.vehiculo,dataEmail)
    console.log(dataMail);
    // return this.http.post(url,dataMail).subscribe()
  }
  async cambioInformacionOS(data:any){
    const dataEmail = {  
      subject: data.subject,
      tipo:'changeElemento',
      correos: data.correos,
      cliente: data.cliente,
      vehiculo: data.vehiculo,
      resumen:data.resumen,
      no_os:data.no_os,
      desgloce: data.desgloce
    }
    const dataMail = await this.template(data.cliente,data.vehiculo,dataEmail)
    console.log(dataMail);
    // return this.http.post(url,dataMail).subscribe() 
  }
  async EmailRecepcion(data:any){
    const  vehiculo = data.vehiculo
    const  cliente = data.cliente
    const tecnico = data.tecnico
    // console.log(tecnico);
    const dataEmail = {
      subject: `Recepcion de vehiculo ${data.vehiculo.placas.toUpperCase()}`,
      tipo:'recepcionVehiculo',
      correos: data.correos,
      pathPDF: data['pathPDF'],
      filename: data['filename'],
      nombreRecepcion: data.no_os,
      arregloString: data.arregloString,
      desgloce: data.desgloce
    }
    
    const dataMail = await this.template(cliente,vehiculo,dataEmail)
    console.log(dataMail);
    // return this.http.post(url,dataMail).subscribe()
  }
  async recordatorioCita(data:any){
    const dataEmail = {
      subject: `Recordatorio de cita ${data.dia} ${data.horario}`,
      tipo:'recordatorio_cita',
      correos: data.correos,
      vehiculo: data.placas,
      cliente: data.fullname,
      dia: data.dia,
      horario: data.horario
    }
    const dataMail = await this.template(null,null,dataEmail)
    console.log(dataMail);
    // return this.http.post(url,dataMail).subscribe()
  }
  async cancelaRecoleccion(data){
    const dataEmail = {
      subject: data.subject,
      tipo:'SinRecoleccion',
      correos: data.correos,
      fullname: data.fullname,
      placas: data.placas,
      dia: data.dia,
      motivo: data.motivo
    }
    
    const dataMail = await this.template(null,null,dataEmail)
    console.log(dataMail);
     // return this.http.post(url,dataMail).subscribe()
  }
  template(cliente?:any,vehiculo?:any,dataEmail?:any){
    let filename = dataEmail.filename
    let pathPDF = dataEmail.pathPDF
    const tipo = dataEmail.tipo
    const emailAnexa = dataEmail.emailAnexa
    // const correoCliente = cliente.correo

    let tempEmail ={}
    let title = ''; let nota =''
    if (tipo === 'cotizacion') {
      title = 'Nueva cotización'
      const concept:any[] = dataEmail.filtro_conceptos
      const conceptos = dataEmail.filtro_conceptos
      const no_cotizacion = filename.split('.')
      // console.log(emailAnexa);

      tempEmail ={
        from:emailAnexa[0],
        email: emailAnexa,
        subject: `${dataEmail.subject} ${conceptos}`,
        mensaje: `Estimado <strong style='text-transform: uppercase;'>${cliente.fullname}</strong>.<br>Adjunto encontrara la cotización por <strong style='font-weight:bolder;'>${conceptos}</strong> para el auto <strong style='font-weight:bolder;'>${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} </stronng> que nos hizo favor de solicitar, para cualquier referencia su No. de Cot es el; <strong style='font-weight:bolder;'>${no_cotizacion[0]}</strong>, le recordamos que nuestro horario de servicio es de Lunes a Viernes de 8:30 a 18:30 y Sábados de 8:30 a 13:00. <br> <strong>Recibimos todas las tarjetas de crédito.</strong>`,
        attachments:[
          {   // use URL as an attachment
            filename: filename,
            path: pathPDF
          }
        ],
      }
    }
    if (tipo === 'recordatorioCotizacion') {
      const fecha = dataEmail.fecha
      const vencimiento = dataEmail.vencimiento
      title = 'Recordatorio de cotización'
      nota= `Estimado ${cliente.nombre} ${cliente.apellidos} recordatorio de cotización con fecha ${fecha} del vehículo 
      ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} con placas ${vehiculo.placas} color ${vehiculo.color}, 
      le recordamos confirmar su cotización con fecha de vencimiento ${vencimiento}`
      const concept:any[] = dataEmail.filtro_conceptos
      const conceptos = concept.join(',')
      const no_cotizacion = filename.split('.')
      tempEmail ={
        from:'desarrollospeed03@gmail.com',
        email: [],
        subject: `${dataEmail.subject} ${conceptos}` ,
        mensaje: `Estimado <strong style='text-transform: uppercase;'>${cliente.fullname}</strong>.<br>Adjunto encontrara la cotización por <strong style='font-weight:bolder;'>${conceptos}</strong> CDMX para el auto <strong style='font-weight:bolder;'>${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} </stronng> que nos hizo favor de solicitar, para cualquier referencia su No. de Cot es el; <strong style='font-weight:bolder;'>${no_cotizacion[0]}</strong>, le recordamos que nuestro horario de servicio es de Lunes a Viernes de 8:30 a 18:30 y Sábados de 8:30 a 13:00.`,
        attachments:[{
          filename: `${filename}`,
          path: `${pathPDF}`
        }],
      }
    }
    if (tipo === 'recordatorio_cita') {
      
      tempEmail ={
        from: dataEmail.correos[0],
        email: dataEmail.correos,  
        subject: dataEmail.subject,
        mensaje: `Estimado <strong style='text-transform: uppercase;'>${dataEmail.cliente}</strong>.<br> Le recordamos que tiene una cita agenda en taller el dia ${dataEmail.dia} a las ${dataEmail.horario}.`,
      }
    }
    if (tipo === 'bienvenida') {
      title = 'Bienevenido a SpeedPro'
      nota= `Estimado ${dataEmail.cliente} bienvenido a la familia SpeedPro`
      tempEmail ={
        from:emailAnexa[0],
        email: emailAnexa,  
        subject: `${dataEmail.subject}`,
        mensaje: `Estimado <strong style='text-transform: uppercase;'>${cliente.nombre}</strong>.<br>Bienvenido a la familia speedpro su numero de cliente unico es ${dataEmail['no_cliente']}`,
      }
    }
    if (tipo === 'recepcionVehiculo'){
      let nombreRecepcion = dataEmail.nombreRecepcion
      const tecnico = dataEmail.tecnico
      // title = `Recolección de vehiculo con placas ${vehiculo.placas.toUpperCase()}`
      // nota= `Estimado ${cliente.nombre} ${cliente.apellidos} SpeedPro`
      if (tecnico !== '') {
        tempEmail ={
          from: dataEmail.correos[0],
          email: dataEmail.correos,  
          subject: `${dataEmail.subject}`,
          mensaje: `Estimado <strong style='text-transform: uppercase;'>${cliente.nombre} ${cliente.apellidos}</strong>.<br>Se le informa la recepcion de su vehículo con placas ${vehiculo.placas.toUpperCase()}, numero de recepcion ${nombreRecepcion} <br> anexo desgloce:  <br>  ${dataEmail['desgloce']}`,
          attachments:[
            {   // use URL as an attachment
              filename: filename,
              path: pathPDF
            }
          ],
        }
      }      
    }
    if (tipo === 'change') {
      tempEmail ={
        from: dataEmail.correos[0],
        email: dataEmail.correos,  
        subject: dataEmail.subject,
        mensaje: `Estimado <strong style='text-transform: uppercase;'>${cliente.nombre} ${cliente.apellidos}</strong>.<br>Se le informa que el vehiculo ${vehiculo.marca} ${vehiculo.modelo} con placas ${vehiculo.placas.toUpperCase()} , color ${vehiculo.color} ha cambiado su estado a ${dataEmail.status} anexo el resumen de la O.S: ${dataEmail['no_os']}. <br> desgloce de operacion <br> ${dataEmail.desgloce}`,
      }
    }
    if (tipo === 'changeElemento') {
      tempEmail ={
        from: dataEmail.correos[0],
        email: dataEmail.correos,
        subject: dataEmail.subject,
        // mensaje: `Estimado <strong style='text-transform: uppercase;'>${cliente.fullname}</strong>.
        // <br>Se le informa que hubo cambios en su O.S #${dataEmail.os} del vehiculo ${vehiculo.marca} ${vehiculo.modelo} con placas ${vehiculo.placas.toUpperCase()} ,
        //  color ${vehiculo.color} anexo el resumen de la O.S: ${dataEmail.resumen}. <br> desgloce de operacion <br> ${dataEmail.desgloce}`,
        mensaje: `Estimado/a ${cliente.nombre} ${cliente.apellidos} <br>
        Le informamos que se han realizado cambios de la recepcion ${dataEmail.no_os} del vehiculo ${vehiculo.marca} ${vehiculo.modelo} con placas ${vehiculo.placas.toUpperCase()}, color ${vehiculo.color} anexo el resumen de la O.S: ${dataEmail.resumen}. <br> desgloce de operacion <br> ${dataEmail.desgloce}
        <br>Gracias por confiar en nosotros. <br> <small>Cualquier duda o aclaración favor de ponerse en contacto con nosotros</small>`
      }
    }
    if (tipo === 'SinRecoleccion') {
      tempEmail ={
        from: dataEmail.correos[0],
        email: dataEmail.correos,
        subject: dataEmail.subject,
        // mensaje: `Estimado <strong style='text-transform: uppercase;'>${cliente.fullname}</strong>.
        // <br>Se le informa que hubo cambios en su O.S #${dataEmail.os} del vehiculo ${vehiculo.marca} ${vehiculo.modelo} con placas ${vehiculo.placas.toUpperCase()} ,
        //  color ${vehiculo.color} anexo el resumen de la O.S: ${dataEmail.resumen}. <br> desgloce de operacion <br> ${dataEmail.desgloce}`,
        mensaje: `Estimado/a ${dataEmail.fullname} <br>
        le informamos que en su cita ${dataEmail.dia} del vehiculo con placas ${dataEmail.placas}  <br> ${dataEmail.motivo}`
      }
    }
    return tempEmail
  }

}
