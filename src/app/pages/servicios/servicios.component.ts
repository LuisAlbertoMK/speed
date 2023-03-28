
import { Component, OnInit, ViewChild, OnDestroy, AfterContentChecked, AfterViewInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';

import {FormBuilder} from '@angular/forms';

import { Route, Router } from '@angular/router';
import { EmailsService } from 'src/app/services/emails.service';
import { child, get, getDatabase, onValue, ref, set, push , update} from 'firebase/database';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { ServiciosService } from '../../services/servicios.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { months } from 'moment';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';
const db = getDatabase()
const dbRef = ref(getDatabase());



@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ServiciosComponent implements OnInit, OnDestroy {
  //ancho minimo de columnas
  miniColumnas:number = 80; ROL: string = '';SUCURSAL: string = '';
  dataSource = new MatTableDataSource();
  clickedRows = new Set<any>();
  @ViewChild('CR1') paginator: MatPaginator;
  @ViewChild('tab1') sort: MatSort;
  columnasRecepciones:string[]=['no_os','status','placas','fecha_recibido','fecha_entregado','diasSucursal'];
  columnasRecepcionesExtended:string[]=[...this.columnasRecepciones,'expand'];
  expandedElement: any | null;
  fecha:string; hora:string
  elementospaquete:any=[];infoPaquete:any=[]; 

  camposReporte_Arr=[
    {muestra:'servicios', valor:'servicios'},
    // {muestra:'autorizado y proceso', valor:'autizado_proceso'},
    // {muestra:'IVA', valor:'iva'},
    {muestra:'ticket promedio', valor:'ticket'},
    {muestra:'Estancia promedio', valor:'tiempoEstancia'},
    {muestra:'Horas totales', valor:'horas_totales'},
    {muestra:'Horas estancia', valor:'horas_servicios'},
    // {muestra:'cobrado', valor:'cobrado'},
    // {muestra:'descontado', valor:'descontado'},
    // {muestra:'ganancia', valor:'ganancia'},
  ]
  camposReporte={servicios:0,ticket:0,tiempoEstancia:0,horas_totales:0,horas_servicios:0}
  
  bus_seleccionado:string = 'este_mes'
  fechaBusqueda_completa = {inicio:null,final:null}
  camposBusquedaFecha= [
    {muestra:'Este mes',valor:'este_mes'},
    {muestra:'hoy',valor:'hoy'},
    {muestra:'ayer',valor:'ayer'},
    {muestra:'Últimos 7 dias',valor:'ult_7Dias'},
    {muestra:'Últimos 30 dias',valor:'ult_30Dias'},
    {muestra:'Último mes',valor:'ult_mes'},
    {muestra:'Este año',valor:'este_anio'},
    {muestra:'Último año',valor:'ult_anio'},
    {muestra:'personalizado',valor:'personalizado'}
  ]
  //primero
 
  miFiltro:any=[]
  filtros:string[]=['espera','autorizado','recibido','terminado','entregado','cancelado']
  filtros2:string[]=['espera','recibido','autorizado','terminado','entregado','cancelado','conFechas']
  tipos:any[]=[{numero:1,contador:0},{numero:2,contador:0},{numero:3,contador:0},{numero:4,contador:0},{numero:5,contador:0},{numero:6,contador:0}]
  muestra:any[]=[]
  servicios:any=[]
  filtrosStatus = this._formBuilder.group({
    todos:false,
    espera: true,
    recibido: true,
    autorizado: true,
    terminado: true,
    entregado: true,
    cancelado:true,
    conFechas:false
  });

  
  Date = new Date()
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  conFecha:boolean = false; fechaBusqueda: string ='recibido';
  muestraCaledar:boolean = false
  seasons: string[] = ['recibido', 'entregado','cancelado'];
  seasons2 = [
    {muestra:'Recibidos',valor:'recibido'},
    {muestra:'entregados',valor:'fecha_entregado'},
    {muestra:'cancelados',valor:'cancelado'},
  ];
  ordena:boolean = true; info:any=[]; indexxx:number = null; element:any =[]

  camposDesgloce = [
    {nombre:'subtotal',valor:'subtotal'}, {nombre:'IVA',valor:'iva'},{nombre:'total',valor:'total'},
    {nombre:'costo de refacción',valor:'refacciones_1'},{nombre:'precio de venta refacción',valor:'refacciones_2'},
    {nombre:'MO',valor:'mo'},
    // {nombre:'sobrescrito mo',valor:'sobrescrito_mo'},{nombre:'sobrescrito R',valor:'sobrescrito_refaccion'},
    {nombre:'Sobrescrito',valor:'sobrescrito'},
    {nombre: 'U.B',valor:'UB'},
  ]
  // UB:'0',mo:0,refacciones_1:0,refacciones_2:0,subtotal:0,iva:0,sobrescrito_mo:0,sobrescrito_refaccion:0,total:0 
  informacionReporteEspecifico:any=[]

  listaTecnicos=[]
  
  tecnicoSelect:string = ''

  formPago: FormGroup;
  formaGasto: FormGroup
  MetodosPago = [
    {metodo:1, muestra:'Efectivo'},
    {metodo:2, muestra:'Cheque'},
    {metodo:3, muestra:'Tarjeta'},
    {metodo:4, muestra:'Transferencia'},
  ]
  info_recepcion:any = []
  
  listaPagos = [
    {valor: 'total', muestra: 'Total servicio: '},
    {valor: 'subtotal', muestra: 'Subtotal servicio: '},
    {valor: 'pagado', muestra: 'Pagados: '},
    {valor: 'gastos', muestra: 'Gastos: '},
    {valor: 'utilidad', muestra: 'Utilidad sin IVA: '},
    {valor: 'utilidad_iva', muestra: 'Utilidad con IVA: '},
    {valor: 'debe', muestra: 'Restante por pagar: '},
  ]
  pagoTotal:boolean= false


  sucursales = []
  clientes= []
  
  recepciones:any[]=[];
  existeGasto:boolean = false
  constructor( private _formBuilder: FormBuilder,private _publicos: ServiciosPublicosService, 
    private router: Router, private _email:EmailsService, private _exporter: ExporterService,
    private _servicios:ServiciosService, private _usuarios:UsuariosService, private _security:EncriptadoService,
    private fb: FormBuilder, private _sucursales: SucursalesService,private _clientes:ClientesService,
    private _cotizaciones: CotizacionService
    ) {
      // this.columnasRecepcionesExtended[6] = 'expand';
     }
     comprobar(){
        // console.log(this.recepciones);
        const recepciones = this.recepciones
        let notificados = [], no_notificados =[]
        recepciones.forEach((r)=>{
          if (r['notifico']) {
            notificados.push(r)
          }else{
            no_notificados.push(r)
          }
        })



        // console.log('notificados',notificados);
        // console.log('no_notificados',no_notificados);
        // updates[`recepciones/${padre['id']}/notifico`]= false

        

        if (no_notificados.length) {
            Swal.fire({
            title: '¡ADVERTENCIA!',
            html:`Hay recepciones las cuales no se notificó al cliente de cambios <br> ¿Enviar Notificación  (email) a clientes?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Enviar',
            denyButtonText: `No enviar`,
            allowOutsideClick: false
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // Swal.fire('Saved!', '', 'success')
              // console.log('se enviara notificacion');
              const updates = {};
              no_notificados.forEach(n=>{
                updates[`recepciones/${n['id']}/notifico`] = true;
              })
              // console.log(updates);
      
              update(ref(db), updates).then(()=>{
                no_notificados.forEach(n=>{
                  let correos = [], desgloce = '';
                  const infoEmail = {
                    correos, cliente: n['infoCliente'], vehiculo: n['infoVehiculo'],
                    subject:`Cambio de informacion en O.S`,
                    resumen: n['no_os'], no_os:n['no_os'], desgloce, status:n['status']
                  }
                  let nuevoDes = []
                  let elementosRecepcion = [...n['servicios']]
                  if (n['infoSucursal']['correo']) correos.push(n['infoSucursal']['correo'])
                  if (n['infoCliente']['correo']) correos.push(n['infoCliente']['correo'])
                  if (n['infoCliente']['correo_sec']) correos.push(n['infoCliente']['correo_sec'])
                  // if(n['servicios']) n['servicios'] = n['servicios']
                  updates[`recepciones/${n['id']}/servicios`] = elementosRecepcion;
                  elementosRecepcion.forEach((a)=>{
                    nuevoDes.push(`${a['nombre']} [${a['showStatus']}]`)
                  })
                
                  infoEmail['desgloce'] = nuevoDes.join(', ')
                  // console.log(infoEmail);
                  
                  // infoEmail['status'] = statusEnviarCorreo
                  this._email.EmailCambioStatus(infoEmail).then((ans:any)=>{})
                })
              })
              
            } else if (result.isDenied) {
              // Swal.fire('Changes are not saved', '', 'info')
              // console.log('no hacer nada');
              
            }
          })
          
        }
        
     }
     ngOnDestroy(){
      
      this.comprobar()
     }
  ngOnInit(): void {
    this.crearFormPago()
    this.crearFormGastos()
    this.listadoTecnicos()
    this.listaSucursales()
    // console.log(this.route);
    
  }
  listaSucursales(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    this._sucursales.consultaSucursales().then(({contenido,data})=>{
      if (contenido) {
        this.sucursales = data
        this.Listaclientes()
      }
    })
  }
  async Listaclientes(){
    const starCountRefClientes = ref(db, `clientes`)
    await onValue(starCountRefClientes, (snapshot) => {
      this._clientes.ListaClientes().then(async ({existe,clientes})=>{
        if (existe) {
          let clientes_nuevos = [];
          (this.SUCURSAL !== 'Todas')? clientes_nuevos = clientes.filter(o=>o.sucursal === this.SUCURSAL): clientes_nuevos  = clientes;
          clientes_nuevos.map(async(cli)=>{
            if (!cli['vehiculos']){ 
              cli['vehiculos'] = []; 
            }else{
              const arreglo_vehiculos = await  this._publicos.crearArreglo2(cli['vehiculos'])
              cli['vehiculos'] = arreglo_vehiculos
            }
            
            // cli['infoSucursal'] = this.sucursales.find(s=>s['id'] === cli['sucursal'])
          })
          this.clientes = clientes_nuevos
          if(this.clientes.length){
            setTimeout(() => {
              this.listaRecepciones()
            }, 100);
          } 
        }else{
          this.clientes = []
        }
      })
    })
  }
  async listaRecepciones(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, async (snapshot) => {
      this._servicios.getRecepcionesnew().
      then(({valido,data})=>{
        if (valido) {
          let nuevos = []
          const serv = [...data]
          serv.forEach(ser => {
            // console.log(ser);
            const claves = Object.keys(ser)
            let nuevoInterno = {}
            // c hace rereferencia al campo
            claves.forEach((c)=>{
              //la siguiente condicion evalua si el campo es "aprobado y enCatalogo"  pasa su valor directo de 
              //de lo contrario lo elimina ya que son valores boolean
              if(c==='iva' || c==='enCatalogo') 
              { nuevoInterno[c] = ser[c] 
              }else{ 
                if(ser[c]) nuevoInterno[c] = ser[c]
              }
            })
            nuevos.push(nuevoInterno)
          });
          let elementosX = []
              nuevos.forEach((ser)=>{
                // && ser['id'] === '-NE430_ohL7xCijFnR3i'
                if (ser['aprobado']) {
                  ser['status'] = 'terminar'
                  ser['showStatus'] = 'Terminado'
                }
                if (ser['tipo'] === 'paquete') {
                  // console.log(ser['id']);
                  // console.log(ser['elementos']);
                  let elementos = []
                  if(ser['elementos']) elementos =[...ser['elementos']]
                  let internosArr = []
                  elementos.forEach((e)=>{
                    const claves = Object.keys(e)
                    let nuevoInterno = {}
                    claves.forEach((c)=>{
                      if (c==='aprobado' || c==='enCatalogo') {
                        nuevoInterno[c] = e[c]
                      }else{
                        if (e[c]) nuevoInterno[c] = e[c]
                      }
                    })
                    internosArr.push(nuevoInterno)
                  })
                  elementosX.push({...ser, elementos:internosArr})
                }else{
                  elementosX.push({...ser})
                }
              })
          elementosX.map(async (cot,index)=>{   
            // console.log(cot['id']);
            this.clientes.map(async (cli)=>{
              if(cot['cliente'] === cli['id']) {
              // console.log(cli);
                cot['infoCliente'] = cli
                const vehiculos:any[] = cli['vehiculos']
                if (vehiculos) {
                  vehiculos.map(v=>{
                    if( cot['vehiculo'] === v['id']) cot['infoVehiculo'] = v
                  })
                }
              }
            })
            const ser = cot['servicios']
            ser.map((element,index) => {
              if (element['tipo'] === 'paquete') {
                if (element['costo']>0) {
                  // ser[index].flotilla = element['costo']
                }else{
                  const costo = this._publicos.costodePaquete( element['elementos'],cot['margen'])
                  // ser[index].flotilla = costo.totalPaquete
                  ser[index].precio = costo.flotilla
                }
              }
            });
            if (!cot['HistorialPagos']) {
              cot['HistorialPagos'] = []
            } else{
              const arreglo1 = this.crearArreglo2(cot['HistorialPagos'])
              cot['HistorialPagos'] = arreglo1
            }
            if (!cot['HistorialGastos']) {
              cot['HistorialGastos'] = []
            }else{
              const arreglo1 = this.crearArreglo2(cot['HistorialGastos'])
              cot['HistorialGastos'] = arreglo1
            }
            
            cot['desgloce'] = this._publicos.realizarOperacion(cot,'servicios')

            cot['infoSucursal'] = this.sucursales.find(o=>o['id'] === cot['sucursal'])
            cot['index'] = index
            if (cot['status'] !=='entregado' && cot['fecha_recibido']) {
              const aqui = cot['fecha_recibido'].split('/')
              const fec = new Date(aqui[2],aqui[1] - 1,aqui[0],0,0,0,0)
              const fec2 = new Date()
              fec2.setHours(0,0,0,0);
              var difference= Math.abs(fec2.getTime()-fec.getTime());
              const updates = {};
              updates[`recepciones/${cot['id']}/diasSucursal`] = difference/(1000 * 3600 * 24);
              update(ref(db), updates);
            }
            cot['_pagos']  = this._servicios.realizarPagos(cot)
          })
          
          let filtrados =  [];
          (this.SUCURSAL === 'Todas') ? filtrados = elementosX: filtrados = elementosX.filter(c=>c['sucursal'] === this.SUCURSAL)
          if (!this.recepciones.length) {
            this.recepciones = filtrados
            this.aplicaFiltros()
          }else{
            const contador1 = this.recepciones.length
            const contador2 = filtrados.length
            const campos=[
              'HistorialGastos','notifico','checkList','diasSucursal','fechaPromesa','desgloce','fecha_entregado','fecha_recibido','formaPago','hora_entregado','hora_recibido','iva','margen','status','tecnico','index','HistorialPagos','_pagos','servicios'
            ]
              if (this.recepciones.length === filtrados.length) {
                this.recepciones.map((a,indexx)=>{
                  campos.forEach(c=>{  a[c] = filtrados[indexx][c] })
                  const servicios = a['servicios']
                  const camposS = [
                    'UB','aprobado','cantidad','cilindros','costo','desgloce','enCatalogo','id','marca','modelo','nombre',
                    'showStatus','status','subtotal','tipo','precio','index','flotilla'
                  ]
                  const dfh = filtrados[indexx]['servicios']
                  servicios.map((s,index)=>{
                    camposS.forEach((c)=>{ 
                      if(dfh[index][c]){
                        s[c] = dfh[index][c]
                      }else{
                        s[c] = ''
                      }
                     })
                    if (s['tipo'] === 'paquete') { 
                      let elementos = []
                      if(s['elementos']) elementos = s['elementos']
                      const camposEle = ['cantidad','descripcion','costo','nombre','precio','subtotal','tipo']
                      elementos.map((e,ind) => {
                        
                        camposEle.forEach( ce => { e[ce] = dfh[index].elementos[ind][ce] })
                        let precio = e['precio']
                        if(!dfh[index].elementos[ind]['costo'] || !e['costo']) e['costo'] = 0
                        
                        if(e['costo']>0) precio = e['costo'];
                        // if ( a['id'] === '-NJLWImtmWlFAvUZDPof' && s['nombre'] === 'paquete z' ) {
                        //   console.log(a['id'], 'PAQUETE ->',s['nombre'],`costo: -> ${e['costo']}`);
                        // }
                        (e['refaccion']) ? e['subtotal'] = e['cantidad'] * (precio * 1.25) :  e['subtotal'] = e['cantidad'] * precio 
                      });
                      s['elementos'] = elementos
                    }
                  })
                  a['servicios'] = servicios
                })
                this.aplicaFiltros()
              }else if(this.recepciones.length < filtrados.length){
                // console.log('los existentes son menores a los resultados');
                this.recepciones.push(filtrados[contador1])
                this.aplicaFiltros()
              }else if(this.recepciones.length > filtrados.length){
                // console.log('los existentes son mayores a los resultados');
                let nuevios = []
                filtrados.forEach(f=>{ nuevios.push(f) })
                this.recepciones = nuevios
                this.aplicaFiltros()
              }
              if(this.info_recepcion['id'] ){
                const data = this.recepciones.find(r=>r['id'] === this.info_recepcion['id'])
                this.AsiganacionIndexPadre(data)
              }
          }
        }
      })
    })
  }

  aplicaFiltros(){
    // console.log(this.recepciones);
    const campos_filtros = Object.keys(this.filtrosStatus.value)
    const todos:boolean = this.filtrosStatus.controls['todos'].value
    if(todos){
      campos_filtros.map(filtro=>{
        if (filtro !=='conFechas') this.filtrosStatus.controls[filtro].setValue(true)
      })
    }
    let asignados = []
    this.recepciones.map(recep=>{
      campos_filtros.map(filtro=>{
        const fil:boolean = this.filtrosStatus.controls[filtro].value
        if (recep['status'] === filtro && fil) asignados.push(recep) 
      })
    })
    let por_campos =[]
    if (this.fechaBusqueda === 'entregado') {
      por_campos = asignados.filter(o=>o['status'] ==='entregado')
    }else if (this.fechaBusqueda === 'cancelado') {
      por_campos = asignados.filter(o=>o['status'] === 'cancelado')
    }else if (this.fechaBusqueda === 'recibido') {
      const fil = asignados.filter(o=>o['status'] !=='entregado')
      por_campos = fil.filter(o=>o['status'] !=='cancelado')
    }
    por_campos.map(c=>{
      // console.log(c['fecha_recib']);
      const aqui = c['fecha_recibido'].split('/')
      const fec = new Date(aqui[2],aqui[1] - 1,aqui[0])
      const aqui_time = c['hora_recibido'].split(':')
      const fec_C = new Date(aqui[2],aqui[1] - 1,aqui[0], aqui_time[0], aqui_time[1],aqui_time[2])
      fec.setHours(0,0,0,0);
      c['fecha_compara'] = fec
      c['fecha_compara_time'] = fec_C

    })
    const fechaHoy = new Date()
    let diasDeMes = 0
    let fechaInicio = new Date()
    let fechaLimite = new Date()
    let yesterday = new Date()
    let nuevos = []
    this.conFecha = false
    if (this.filtrosStatus.controls['conFechas'].value) {
      this.conFecha = true
      this.muestraCaledar = false
      switch (this.bus_seleccionado) {
        case 'este_mes':
          diasDeMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth()+ 1, 0).getDate()
          fechaInicio = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1)
          fechaLimite = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), diasDeMes)
          fechaInicio.setHours(0,0,0,0);
          fechaLimite.setHours(0,0,0,0);
          por_campos.map(c=>{
            const fec = new Date(c['fecha_compara'])
            if (fec >= fechaInicio && fec <= fechaLimite) {
              nuevos.push(c)
            }
          })
            break;
        case 'hoy':
          fechaInicio = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate())
          fechaInicio.setHours(0,0,0,0);
          por_campos.map(c=>{
            const fec = new Date(c['fecha_compara'])
            fec.setHours(0,0,0,0);
            if (fec >= fechaInicio && fec <= fechaInicio) {
              nuevos.push(c)
            }
          })
          console.log(`nuevos son: [${nuevos.length}]`, nuevos);
            break;
        case 'ayer':
          fechaInicio = new Date()
          yesterday = new Date(fechaInicio)
          yesterday.setDate(yesterday.getDate() - 1)
          por_campos.map(c=>{
            const fec = new Date(c['fecha_compara'])
            yesterday.setHours(0,0,0,0);
            if (fec.getTime() == yesterday.getTime()) {
              nuevos.push(c)
            }
          })
          console.log(`nuevos son: [${nuevos.length}]`, nuevos);
            break;
        case 'ult_7Dias':
          fechaInicio = new Date()
          yesterday = new Date(fechaInicio)
          yesterday.setDate(yesterday.getDate() - 7)
          fechaInicio.setHours(0,0,0,0);
          yesterday.setHours(0,0,0,0);
          por_campos.map(c=>{
            const fec = new Date(c['fecha_compara'])
            if (fec >= yesterday && fec <= fechaLimite) {
              nuevos.push(c)
            }
          })
            break;
        case 'ult_30Dias':
          fechaInicio = new Date()
          yesterday = new Date(fechaInicio)
          yesterday.setDate(yesterday.getDate() - 30)
          fechaInicio.setHours(0,0,0,0);
          yesterday.setHours(0,0,0,0);
          por_campos.map(c=>{
            const fec = new Date(c['fecha_compara'])
            fec.setHours(0,0,0,0);
            if (fec >= yesterday && fec <= fechaLimite) {
              nuevos.push(c)
            }
          })
            break;
        case 'ult_mes':
          const mes_pasado = new Date(fechaInicio)
          mes_pasado.setMonth((mes_pasado.getMonth()) - 1)
          diasDeMes = new Date(mes_pasado.getFullYear(), mes_pasado.getMonth()+ 1, 0).getDate()
          fechaInicio = new Date(mes_pasado.getFullYear(), mes_pasado.getMonth(), 1)
          fechaLimite = new Date(mes_pasado.getFullYear(), mes_pasado.getMonth(), diasDeMes)
          fechaInicio.setHours(0,0,0,0);
          fechaLimite.setHours(0,0,0,0);
          por_campos.map(c=>{
            const fec = new Date(c['fecha_compara'])
            if (fec >= fechaInicio && fec <= fechaLimite) {
              nuevos.push(c)
            }
          })
            break;
        case 'este_anio':
          const an =fechaInicio.getFullYear()
          const fecha_anio1 = new Date(an,0,1)
          const fecha_anio2 = new Date(an,11,31)
          por_campos.map(c=>{
            const fec = new Date(c['fecha_compara'])
            if (fec >= fecha_anio1 && fec <= fecha_anio2) {
              nuevos.push(c)
            }
          })
            break;
        case 'ult_anio':
          const anio = fechaInicio.getFullYear() -1
          const fecha_anio_1 = new Date(anio,0,1)
          const fecha_anio_2 = new Date(anio,11,31)
          por_campos.map(c=>{
            const fec = new Date(c['fecha_compara'])
            if (fec >= fecha_anio_1 && fec <= fecha_anio_2) {
              nuevos.push(c)
            }
          })
            break;
        case 'personalizado':
          this.muestraCaledar = true
          if (this.range.controls['start'].value && this.range.controls['end'].value) {
            const initial = new Date(this.range.value.start._d)
            const fin = new Date(this.range.value.end._d)
            por_campos.map(c=>{
              const fec = new Date(c['fecha_compara'])
              if (fec >= initial && fec <= fin) {
                nuevos.push(c)
              }
            })          
          }
            break;
      }
    }else{
      nuevos = por_campos
    }
    // console.log(nuevos);
    
    this.generaCamposReporte(nuevos)
  }
  generaCamposReporte(data:any){
    this.dataSource.data = data
    this.newPagination('servicios')
    const reporte = this._publicos.generaCamposReporte(data,this.fechaBusqueda)
    this.camposReporte.tiempoEstancia = reporte.tiempoEstancia
    this.camposReporte.ticket = reporte.ticket
    this.camposReporte.horas_totales = reporte.horas_totales
    this.camposReporte.horas_servicios = reporte.horas_estancia
    this.camposReporte.servicios = data.length
  }

  rol(){
  }
  crearFormPago(){
    this.formPago = this.fb.group({
      padre:['',[Validators.required]],
      metodo:['1',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      concepto:['',[Validators.required,Validators.minLength(3), Validators.maxLength(100)]],
      referencia:['',[Validators.minLength(3), Validators.maxLength(100)]],
      monto:['0',[Validators.required,Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})"),Validators.min(1)]],
    })
  }
  validarCampoPago(campo: string){
    return this.formPago.get(campo).invalid && this.formPago.get(campo).touched
  }
  async AsiganacionIndexPadre(data){
    this.recepciones.map(async (recep)=>{
      if (recep['id'] === data['id']) {
        this.formPago.controls['padre'].setValue(recep['id'])
        this.formaGasto.controls['padre'].setValue(recep['id'])
        this.info_recepcion = recep
      }
    })
    
  }
  llenar(){
    // console.log(this.pagoTotal);
    if (this.pagoTotal) {
      // console.log(this.info_recepcion);
      const data = this._servicios.realizarPagos(this.info_recepcion)
      let HistorialPagos =  []
      // console.log(data);
      this.formPago.controls['padre'].setValue(this.info_recepcion['id'])
      // this.formaGasto.controls['padre'].setValue(this.info_recepcion['id'])
      this.info_recepcion['HistorialPagos'] ? HistorialPagos =  this.info_recepcion['HistorialPagos'] : HistorialPagos = []
      if (HistorialPagos.length>0) {
        const restante = data.debe
        this.formPago.controls['monto'].setValue( restante)
        this.formPago.controls['concepto'].setValue( 'liquidacion de pago')
      }else{
        this.formPago.controls['monto'].setValue( this.info_recepcion['desgloce'].total)
        this.formPago.controls['concepto'].setValue( 'Pago completo')
      }
    }else{
      this.formPago.controls['monto'].setValue( 0 )
      this.formPago.controls['concepto'].setValue(null)
    }
  }
 
  eliminarPago(id:string){
    // console.log(index);
    if(!id && !this.info_recepcion['id']) return
    const idpadre = this.info_recepcion['id']
    const updates = {};
    updates[`/recepciones/${idpadre}/HistorialPagos/${id}/status`] = false;
    update(ref(db), updates).then(()=>{
      this.recepciones.map(async (recep)=>{
        if (recep['id'] === idpadre) {
          this.formPago.controls['padre'].setValue(idpadre)
          this.formaGasto.controls['padre'].setValue(idpadre)
          this.AsiganacionIndexPadre(recep)
        }
      })
    })
  }
  limpiaFormualrio(padre){
    this.formPago.reset({padre,metodo:1,concepto: null, referecnia:null, monto:0 })
  }
  crearFormGastos(){
    this.formaGasto = this.fb.group({
      padre:['',[Validators.required]],
      metodo:['1',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      concepto:['',[Validators.required,Validators.minLength(3), Validators.maxLength(100)]],
      referencia:['',[Validators.required,Validators.minLength(3), Validators.maxLength(100)]],
      monto:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
    })
  }
  validarCampoGasto(campo: string){
    return this.formaGasto.get(campo).invalid && this.formaGasto.get(campo).touched
  }
 
  limpiaFormualrioGasto(padre){
    this.formaGasto.reset({padre,metodo:1,concepto: null, referecnia:null, monto:0 })
  }
  eliminarGasto(id:string){
    if (!id && !this.info_recepcion['id']) return
    this._publicos.mensaje_pregunta('eliminar pago').then(({respuesta})=>{
      if (respuesta) {
        const updates = {};
        const idpadre = this.info_recepcion['id']
        updates[`recepciones/${idpadre}/HistorialGastos/${id}/status`] = false;
        update(ref(db), updates).then(()=>{
          this.recepciones.map(async (recep)=>{
            if (recep['id'] === idpadre) {
              this.formPago.controls['padre'].setValue(idpadre)
              this.formaGasto.controls['padre'].setValue(idpadre)
              this.AsiganacionIndexPadre(recep)
            }
          })
        })
      }
    })
  }
  Recepciones(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, async (snapshot)  => {
      if (snapshot.exists()) {
        this._servicios.getRecepcionesnew().then(({valido,data})=>{
          if (valido) {
            console.log('aqui');
            
          }          
        })
      }
    })
  }
  listadoTecnicos(){
    this._usuarios.listatecnicos().then(({contenido,data})=>{
      if(contenido){
        const tecnicos = data
        if (this.SUCURSAL!=='Todas') {
          const filtro = tecnicos.filter(o=>o.sucursal=== this.SUCURSAL)
          this.listaTecnicos = filtro
        }else{
          this.listaTecnicos = tecnicos
        }
      }
      
    })
  }
  registraTecnico(idRecepcion:string,dataTecnico:any){
    // console.log(dataTecnico);
    if (dataTecnico['id']) {
      const updates = {};
      updates[`/recepciones/${idRecepcion}/tecnico`] = dataTecnico.id;
      update(ref(db), updates)
      .then(()=>{
        this._publicos.mensajeCorrecto('Se registro tecnico de la recepcion')
      })
      .catch((error) => {
        this._publicos.mensajeIncorrecto('Ocurrio un error' + error)
      });  
    }else{
      const updates = {};
      updates[`/recepciones/${idRecepcion}/tecnico`] = '';
      update(ref(db), updates)
      .then(()=>{
        this._publicos.mensajeCorrecto('Se elimino tecnico de recepcion')
      })
      .catch((error) => {
        this._publicos.mensajeIncorrecto('Ocurrio un error' + error)
      });
    }
    
  }
  restarurar(padre:number){
    const inf = this.recepciones.find(i=>i['id']  === padre['id'])
    const updates = {};
    updates[`recepciones/${inf['id']}/servicios`] = inf['servicios_original'];
    Swal.fire({
      title: 'Desea restaurar los elementos a su estado original?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      // denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        update(ref(db), updates);
      }
    })
  }
  generaReporte(){
    if(this.dataSource.data.length){
      this._exporter.exportExcelServicios(this.dataSource.data)
    }else{
      this._publicos.mensajeIncorrecto('No hayn informaciín disponible')
    }
  }
  isSticky(columna:string) {
    return (columna).indexOf(columna) !== -1;
  }
  async ordenamiento(campo:string,ordena:boolean){
    let nuevos = []
    this.servicios.map((o)=>{
        const cual = this.fechaBusqueda
        switch (cual) {
          case 'cancelado':
            nuevos = this.servicios.filter(o=>o['status'] === 'cancelado')
            break;
          case 'entregado':
            nuevos = this.servicios.filter(o=>o['status'] === 'entregado')
            break;
          case 'recibido':
            //  = this.servicios.filter(o=>o['status'] === 'entregado')
            const filtro = this.servicios.filter(o=>o['status'] !== 'cancelado' )
            nuevos = this.servicios.filter(o=>o['status'] !== 'entregado')
            break;
        
          default:
            break;
        }
    })
    this.dataSource.data =  await this._publicos.ordenamiento(nuevos,campo,ordena)
    this.newPagination('recepciones')
    this.ordena = ordena
  }
  ivaChange(data:any,iva:boolean){
    // console.log('change: '+ iva);
    set(ref(db, `recepciones/${data.id}/iva`), iva )
          .then(() => {
            // Data saved successfully!
          })
          .catch((error) => {
            // The write failed...
          });
  }
  elementospaqueteShow(data:any){
    // const datanew = data.elementos
    let precioF=0,refacciones=0,mo=0
            // if (ele.tipo === 'paquete') {
              // console.log(ele.nombre);
              const elementos = data.elementos
    for (let indEle = 0; indEle < elementos.length; indEle++) {
      const ele1 = elementos[indEle];
      const cantidadE = ele1.cantidad
      let costo =0
      if(ele1.tipo === 'MO'){
        for (let indcantidad = 1; indcantidad <= cantidadE; indcantidad++) {
          const opera = indcantidad * ele1.precio
          elementos[indEle].flotilla = opera
          elementos[indEle].normal = elementos[indEle].flotilla * 1.30
          costo =  elementos[indEle].flotilla
        }
        precioF=precioF+ costo
        mo = mo + costo
      }else if(ele1.tipo === 'refaccion'){
        for (let indcantidad = 1; indcantidad <= cantidadE; indcantidad++) {
          const opera = indcantidad * ele1.precio
          elementos[indEle].flotilla = opera
          elementos[indEle].normal = elementos[indEle].flotilla * 1.30
          costo =  elementos[indEle].flotilla
        }
        // console.log(costo + '- ' + ele1);
        precioF=precioF+ costo
        refacciones = refacciones + costo
        }                                                                         }
    const totalPaquete = refacciones + mo          
    this.elementospaquete = elementos
    const infoPaquete = {
      nombre: data.nombre,
      flotilla: totalPaquete,
      UB: data.UB,
      refacciones,
      mo
    }
    this.infoPaquete = infoPaquete
  }
  saveNotificacion(data:any){
    // console.log(data);

     
    Swal.fire({
      title: 'Notificar al cliente de los cambios en la O.S?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (data['id']) {
          let correos = [], desgloce = ''; const updates = {};
          const infoEmail = {
            correos, cliente: data['infoCliente'], vehiculo: data['infoVehiculo'],
            subject:`Cambio de informacion en O.S`,
            resumen: data['no_os'], no_os:data['no_os'], desgloce, status:data['status']
          }
          let nuevoDes = []
          let elementosRecepcion = [...data['servicios']]
          if (data['infoSucursal']['correo']) correos.push(data['infoSucursal']['correo'])
          if (data['infoCliente']['correo']) correos.push(data['infoCliente']['correo'])
          if (data['infoCliente']['correo_sec']) correos.push(data['infoCliente']['correo_sec'])
          // if(n['servicios']) n['servicios'] = n['servicios']
          elementosRecepcion.forEach((a)=>{
            nuevoDes.push(`${a['nombre']} [${a['showStatus']}]`)
          })
          
          infoEmail['desgloce'] = nuevoDes.join(', ')
          updates[`recepciones/${data['id']}/notifico`] = true;
          // console.log(infoEmail);
          // console.log(updates);
          update(ref(db), updates).then(()=>{
            this._publicos.mensajeCorrecto('Se envio notificación')
            if (correos.length) {
              this._email.EmailCambioStatus(infoEmail).then((ans:any)=>{})
            }
          })          
        }
      } else if (result.isDenied) {
        Swal.fire('No se notifico al cliente', '', 'info')
      }
    })

    
  }
  cambiarStatusOS(status:string, data:any){
    const stat = status.toLowerCase()
    // console.log(stat);
    // console.log(data);
    
      if ((status === 'entregado' || status === 'terminado') && !data.tecnico) {
          this._publicos.mensajeIncorrecto('Paara continuar favor de seleccionar tecnico')
      }else{
        Swal.fire({
          title: 'Cambiar status de vehículo?',
          html:`<b class='text-uppercase'>${status}</b>`,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Confirmar',
          allowOutsideClick: false ,
          denyButtonText: `Cancelar`,
        }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            //primero obtener los correos a los que se enviara
            // console.log(data);
            let correos = [];
            (data['infoSucursal'].correo) ? correos.push(data['infoSucursal'].correo) : '';
            (data['infoCliente']['correo']) ? correos.push(data['infoCliente']['correo']) : '';
            (data['infoCliente']['correo_sec']) ? correos.push(data['infoCliente']['correo_sec']) : '';
    
            const infoEmail = {
              correos,
              cliente: data['infoCliente'],
              vehiculo: data['infoVehiculo'],
              status:stat
            }
            if (stat==='terminado') {
              let serv = []
              serv =  [...data['servicios']]
              serv.map((ser)=>{
                if (ser['aprobado']) {
                  ser['status'] = 'terminar'
                  ser['showStatus'] = 'Terminado'
                }
              })
              const updates = {};
              updates[`recepciones/${data.id}/servicios`] = serv;
              // console.log(updates);
              update(ref(db), updates).then(async ()=>{
                this._publicos.mensajeCorrecto('Todos los servicios termiandos ')
                await this._email.EmailCambioStatus(infoEmail).then((ans:any)=>{})
              });
            }
            if (stat === 'cancelado') {
              let fecha2 = new Date()
              const fecha_cancelado = this._publicos.convierteFecha(`${fecha2.getDate()}/${fecha2.getMonth()+1}/${fecha2.getFullYear()}`)
              // console.log(fecha_cancelado);
              const updates = {};
              updates[`recepciones/${data.id}/status`] = 'cancelado';
              updates[`recepciones/${data.id}/fecha_entregado`] = fecha_cancelado;
              update(ref(db), updates).then(async ()=>{
                await this._email.EmailCambioStatus(infoEmail).then((ans:any)=>{})
              });
            }else{
              set(ref(db, `recepciones/${data.id}/status`), stat )
              .then(async () => {
                const updates = {};
                const fechaHora = this._publicos.getFechaHora()
                if (stat === 'entregado') {
                  updates[`recepciones/${data.id}/fecha_entregado`] = fechaHora.fecha;
                  updates[`recepciones/${data.id}/hora_entregado`] = fechaHora.hora;
                }else if(stat === 'recibido'){
                  updates[`recepciones/${data.id}/fecha_recibido`] = fechaHora.fecha;
                  updates[`recepciones/${data.id}/hora_recibido`] = fechaHora.hora;
                  updates[`recepciones/${data.id}/fecha_entregado`] = fechaHora.fecha;
                  updates[`recepciones/${data.id}/hora_entregado`] = fechaHora.hora;
                }else{
                  updates[`recepciones/${data.id}/hora_entregado`] = '';
                  updates[`recepciones/${data.id}/hora_entregado`] = '';
                }
                update(ref(db), updates);
              })
              .catch((error) => {
                // The write failed...
              });
            }
          } else if (result.isDenied) {
            // this.mensajeIncorrecto('Se cancelo el cambio de status')
          }
      })
      }

    
  }
  async accionElemento(padre:any, index:number, status:string, showStatus:string, aprobado:boolean){
    // console.log(`accion-> ${status} showStatus-> ${showStatus} aprobado-> ${aprobado}` );
    // console.log(padre);
    // console.log('accion');
    
    if (padre['id']) {
      const servicios = padre['servicios'], id = padre['id']
      let correos = [], desgloce = '';
      (padre['infoSucursal']['correo']) ? correos.push(padre['infoSucursal']['correo']) : '';
      (padre['infoCliente']['correo']) ? correos.push(padre['infoCliente']['correo']) : '';
      (padre['infoCliente']['correo_sec']) ? correos.push(padre['infoCliente']['correo_sec']) : '';
      const infoEmail = {
        correos, cliente: padre['infoCliente'], vehiculo: padre['infoVehiculo'],
        subject:`El elemento ${servicios[index].nombre} cambio su estatus a ${showStatus}`,
        resumen: padre['no_os'], no_os:padre['no_os'], desgloce
      }
      const updates = {};
      let elementosRecepcion = []
      elementosRecepcion = [...padre['servicios']]
      let okisi = []
      if(status==='eliminar'){
        await this._publicos.mensaje_pregunta('Eliminar elemento de O.S').then(({respuesta})=>{
          console.log(respuesta);
          if (respuesta) {
            elementosRecepcion.forEach((a,index1)=>{
              if (index1 !== index) okisi.push(a) 
            })
            elementosRecepcion = okisi
          }
        })
      }else{
        elementosRecepcion[index].status = status
        elementosRecepcion[index].showStatus = showStatus;
        (status === 'noAprobado') ? elementosRecepcion[index].aprobado = false :elementosRecepcion[index].aprobado = true 
      }

      console.log(elementosRecepcion);
      
      let totales=0, Aprobados=0, Terminados=0, NoAprobados=0
      totales = elementosRecepcion.length
      elementosRecepcion.forEach((ele)=>{
        (ele['aprobado']) ? Aprobados++ : NoAprobados++
        if (ele['aprobado'] && ele['status']==='terminar') Terminados++
      })
      // console.log({totales,Aprobados,NoAprobados,Terminados});
      let statusEnviarCorreo = ''
      if (Terminados === Aprobados) {
        updates[`recepciones/${padre['id']}/status`] = 'terminado';
        statusEnviarCorreo = 'terminado'
      }else{
        updates[`recepciones/${padre['id']}/status`] = 'recibido';
        statusEnviarCorreo = 'recibido'
      }
      updates[`recepciones/${padre['id']}/servicios`] = elementosRecepcion;
      let nuevoDes = []
      elementosRecepcion.forEach((a)=>{
        nuevoDes.push(`${a['nombre']} [${a['showStatus']}]`)
      })
      infoEmail['desgloce'] = nuevoDes.join(', ')
      infoEmail['status'] = statusEnviarCorreo
      updates[`recepciones/${padre['id']}/notifico`]= false
      
      update(ref(db), updates)
      .then(async ()=>{
        this._publicos.mensajeSwal('accion terminada')
        // await this._email.EmailCambioStatus(infoEmail).then((ans:any)=>{})
      })
      .catch((error)=>{
        console.log(error);
      })
    }
  }
  
  newPagination(tabla:string) {
    setTimeout(() => {
      if (tabla === 'servicios') {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      
    }, 600);
  }
  splitNombreDetalles(cadena:string){
    const caden = cadena.split('_')
    const nueva = caden.join(' ')
    return nueva
  }
  applyFilter(event: Event,tabla:string) {
    if (tabla=='tab1') {
      const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    }
    if (tabla=='cotizaciones') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    }
    
  }
  private crearArreglo2(arrayObj: object) {
    const arrayGet: any[] = [];
    if (arrayObj === null) {
      return [];
    }
    Object.keys(arrayObj).forEach((key) => {
      const arraypush: any = arrayObj[key];
      arraypush.id = key;
      arrayGet.push(arraypush);
    });
    return arrayGet;
  }
  restaFechasTaller = function(f1){
    // const dateHoy: Date = new Date()
    // const fecha1 = `${dateHoy.getDate()}/${dateHoy.getMonth()+1}/${dateHoy.getFullYear()}`
    // var aFecha1 = f1.split('/');
    // // var aFecha2 = f2.split('/');
    // var fFecha1 = new Date(aFecha1[2],aFecha1[1],aFecha1[0]).getTime();
    // var fFecha2 = new Date(dateHoy.getFullYear(),dateHoy.getMonth()+1,dateHoy.getDate()).getTime();
    // var dif = fFecha2 - fFecha1;
    // var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    // // console.log(dias);
    // return dias;
   }
  
  
  getFechaHora(){
    const date: Date = new Date()
    const months = ["enero", "febrero", "marzo","abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    this.fecha=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    this.hora=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
  }
  actualizaEle(event: Event,abuelo:any,padre:number, donde:number){
    let nuevaValor = Number((event.target as HTMLInputElement).value);
    
    const claveAbuelo = abuelo.id

    // console.log(this.recepciones[abuelo].servicios[padre].elementos[hijo]);
    // console.log(nuevaValor, claveAbuelo, donde);
    const updates = {};
    switch (donde) {
      case 1:
        if(nuevaValor<1) nuevaValor = 1
        // console.log('cantidad');
        updates[`recepciones/${claveAbuelo}/servicios/${padre}/cantidad`] = nuevaValor;
        break;
      case 2:
        if(nuevaValor<0) nuevaValor = 0
        // console.log('costo');
        updates[`recepciones/${claveAbuelo}/servicios/${padre}/costo`] = nuevaValor;
        break;
      default:
        break;
    }
    update(ref(db), updates);
    
  }
  actualizaElemento(event: Event,abuelo:number,padre:number, hijo:number, donde:number){
    // console.log(this.recepciones[abuelo].servicios[padre].elementos[hijo]);
    const claveAbuelo = this.recepciones[abuelo].id
    const clavePadre = padre
    const claveHijo = hijo
    // const elementos = 
    const updates = {};
    
    const nuevaValor = Number((event.target as HTMLInputElement).value);
    switch (donde) {
      case 1:
        // console.log('cantidad');
        updates[`recepciones/${claveAbuelo}/servicios/${clavePadre}/elementos/${claveHijo}/cantidad`] = nuevaValor;
        break;
      case 2:
        // console.log('costo');
        updates[`recepciones/${claveAbuelo}/servicios/${clavePadre}/elementos/${claveHijo}/costo`] = nuevaValor;
        break;
      default:
        break;
    }
    update(ref(db), updates);
  }

  
}
