
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
  sucursales_arr=[]
  recepciones_arr=[]

  // tabla
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['id','no_os','searchCliente','searchPlacas']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos

  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
    {valor:'sobrescrito', show:'sobrescrito'},
    {valor:'descuento', show:'descuento'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'iva', show:'iva'},
    {valor:'total', show:'total'},
    {valor:'meses', show:'meses'},
  ]
  camposCliente=[
    {valor: 'no_cliente', show:'# Cliente'},
    {valor: 'nombre', show:'Nombre'},
    {valor: 'apellidos', show:'Apellidos'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'},
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    {valor: 'sucursal', show:'Sucursal'}
  ]
  camposVehiculo=[
    {valor: 'placas', show:'Placas'},
    {valor: 'marca', show:'marca'},
    {valor: 'modelo', show:'modelo'},
    {valor: 'anio', show:'añio'},
    {valor: 'categoria', show:'categoria'},
    {valor: 'cilindros', show:'cilindros'},
    {valor: 'engomado', show:'engomado'},
    {valor: 'color', show:'color'},
    {valor: 'transmision', show:'transmision'},
    {valor: 'no_motor', show:'No. Motor'},
    {valor: 'vinChasis', show:'vinChasis'},
    {valor: 'marcaMotor', show:'marcaMotor'}
  ]
  formasPago=[
    {id:'1',pago:'contado',interes:0,numero:0},
    {id:'2',pago:'3 meses',interes:4.49,numero:3},
    {id:'3',pago:'6 meses',interes:6.99,numero:6},
    {id:'4',pago:'9 meses',interes:9.90,numero:9},
    {id:'5',pago:'12 meses',interes:11.95,numero:12},
    {id:'6',pago:'18 meses',interes:17.70,numero:18},
    {id:'7',pago:'24 meses',interes:24.,numero:24}
  ]

  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

  estatusServicioUnico = [
    {valor: 'aprobado'   , show: 'Aprobar'},
    {valor: 'Noaprobado'  , show: 'No Aprobado'},
    {valor: 'terminar'   , show: 'Terminado'},
    {valor: 'eliminado'  , show: 'Eliminar'},
    {valor: 'cancelado'  , show: 'Cancelado'}
  ]
  statusOS = [
    {valor: 'espera'   , show: 'Espera'},
    {valor: 'recibido'   , show: 'Recibido'},
    {valor: 'autorizado'  , show: 'Autorizado'},
    {valor: 'terminado'   , show: 'Terminado'},
    {valor: 'entregado'  , show: 'Entregado'},
    {valor: 'cancelado'  , show: 'Cancelado'}
  ]
  // 'espera','autorizado','recibido','terminado','entregado','cancelado'
  indexEdicionRecepcion: number; indexEdicionRecepcionBoolean: boolean =  false
  dataOcupadaOS:any = {}
  constructor( private _formBuilder: FormBuilder,private _publicos: ServiciosPublicosService, 
    private router: Router, private _email:EmailsService, private _exporter: ExporterService,
    private _servicios:ServiciosService, private _usuarios:UsuariosService, private _security:EncriptadoService,
    private fb: FormBuilder, private _sucursales: SucursalesService,private _clientes:ClientesService,
    private _cotizaciones: CotizacionService
    ) {
      // this.columnasRecepcionesExtended[6] = 'expand';
     }
    
     ngOnDestroy(){
      
      // this.consultaSucursales()
      this.verificaServiciosPendientesEmail()
     
     }
    ngOnInit(): void {
      this.consultaSucursales()
    }

  consultaSucursales(){
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.sucursales_arr = this._publicos.crearArreglo2(snapshot.val())
        this.acciones()
      }
    }, {
        onlyOnce: true
    })
  }
  cargaIndexPadre(data){
    console.log(data);
    this.dataOcupadaOS = {...data}
  }
  acciones(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.recepciones_arr = this._publicos.crearArreglo2(snapshot.val())
        this.recepciones_arr.map((recep,index)=>{
          recep.index  = index
          // console.log(recep.id);
          recep.searchCliente = recep.cliente['nombre']
          recep.searchPlacas = recep.vehiculo['placas']
          // if (recep.id === '-NJLWImtmWlFAvUZDPof') {
            const getTime  = this._publicos.getFechaHora()
            recep.diasSucursal = this._publicos.calcularDias(recep.fecha_recibido, getTime.fecha)
          // }
          const updates = {
            [`recepciones/${recep.id}/diasSucursal`]: recep.diasSucursal
          };
          update(ref(db), updates)
          .then(() => {});
          
        })
        // console.log(this.recepciones_arr);
        
        this.dataSource.data = this.recepciones_arr
        this.newPagination()
        
      }
    }, {
        onlyOnce: true
    })
  }
  accionServicio(padre, hijo, statusGet){
    //tomamos el id de padre en este caso la recepcion
    const padreID = padre.id
    const padreIndex = padre.index
    const HijoIndex = hijo.index

    const  aprobado = (statusGet === 'aprobado' || statusGet === 'terminar') ? true:  false

    if (aprobado) {
      const showStatus1 =  (statusGet === 'terminar') ? 'Terminado' : 'En espera'

      this.recepciones_arr[padreIndex].servicios[HijoIndex].status = statusGet
      this.recepciones_arr[padreIndex].servicios[HijoIndex].aprobado = aprobado
      this.recepciones_arr[padreIndex].servicios[HijoIndex].showStatus = showStatus1

    }else if (statusGet === 'cancelado' || statusGet === 'Noaprobado') {
      this.recepciones_arr[padreIndex].servicios[HijoIndex].status = statusGet
      this.recepciones_arr[padreIndex].servicios[HijoIndex].aprobado = false
      this.recepciones_arr[padreIndex].servicios[HijoIndex].showStatus = 'En espera'
    } if (statusGet === 'eliminado') {
      this.recepciones_arr[padreIndex].servicios = this.recepciones_arr[padreIndex].servicios.filter((servicio, index) => {
        if (index !== HijoIndex) {
            servicio.index = index;
            return true;
        }
        return false;
    });
    
     
    }
    
    const {reporte, ocupados} = this._publicos.realizarOperaciones_2(this.recepciones_arr[padreIndex])
    
    this.recepciones_arr[padreIndex].reporte = reporte
    this.recepciones_arr[padreIndex].servicios = ocupados
    this.recepciones_arr[padreIndex].notificar = true

    const updates = {};
    updates[`recepciones/${padreID}`] = this.recepciones_arr[padreIndex];
    update(ref(db), updates).then(()=>{
      this._publicos.swalToast('accion  correcta!')
    });

    
    this.dataSource.data = this.recepciones_arr
    this.newPagination()
  }
  statusServicio(padre, status){
    const padreID = padre.id
    const padreIndex = padre.index
    

    // espera
    // recibido
    // autorizado
    // terminado
    // entregado
    // cancelado


    // const  aprobado = (status === 'espera' || status === 'cancelado') ? false:  true
    const servicios = this.recepciones_arr[padreIndex].servicios;
    const {fecha, hora} = this._publicos.getFechaHora()
    const updates = {};
        
    servicios.forEach(servicio => {
      if(servicio.aprobado && (status === 'terminado' || status === 'entregado')) {
        servicio.status = 'terminar';
        servicio.showStatus = 'Terminado';
        updates[`recepciones/${padreID}/fecha_entregado`] = fecha;
        updates[`recepciones/${padreID}/hora_entregado`] = hora;
      } else {
        servicio.status = 'Aprobado';
        servicio.showStatus = 'En espera';
        updates[`recepciones/${padreID}/fecha_entregado`] = null;
        updates[`recepciones/${padreID}/hora_entregado`] = null;
        updates[`recepciones/${padreID}/fecha_recibido`] = fecha;
        updates[`recepciones/${padreID}/hora_recibido`] = hora;
      }
    });

    update(ref(db), updates);
    
    this.recepciones_arr[padreIndex].servicios = servicios;
    this.recepciones_arr[padreIndex].status = status;
    this.dataSource.data = this.recepciones_arr;
    this.newPagination()


  }
  //para actualizar el tecnico de la orden de servicio
  infoTecnico(event){
    if (!event) {
      this._publicos.swalToastError('intenta de nuevo')
    }else{
      this._publicos.mensaje_pregunta('Seguro que es el tecnico de la o.s?').then(({respuesta})=>{
        if (respuesta) {
          const updates = {
            [`recepciones/${this.recepciones_arr[this.indexEdicionRecepcion].id}/tecnico`]: event.id,
            [`recepciones/${this.recepciones_arr[this.indexEdicionRecepcion].id}/showNameTecnico`]: event.usuario
          };
          update(ref(db), updates)
            .then(() => {
              this.recepciones_arr[this.indexEdicionRecepcion].showNameTecnico = event.usuario
              this.recepciones_arr[this.indexEdicionRecepcion].tecnico = event.id
              this._publicos.swalToast('Tecnico actualizado correctamente!!')
            });
        }
      })
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }


  //cuando quiera abandonar la apgina pregutar si desea enviar los email
  verificaServiciosPendientesEmail(){
    const enviarEmail = this.recepciones_arr.filter(recepcion=>recepcion.notificar)
    // console.log(enviarEmail);
    if (enviarEmail.length) {
      this._publicos.mensaje_pregunta('notificar a clientes de cambios?').then(({respuesta})=>{
        if (respuesta) {
          enviarEmail.forEach(recepcion=>{

            const { sucursal, cliente, servicios, reporte, no_os, vehiculo,id, index} = recepcion;
      
            const correos = this._publicos.dataCorreo(sucursal,cliente)
            
            const info = servicios.map(({ nombre, aprobado }) => {
              const status = aprobado ? 'aprobado' : 'no aprobado';
              return `Servicio ${nombre.toLowerCase()}: ${status}`;
            }).join(', ');
      
            const clavesReporte = Object.keys(reporte);
            const infoReporte = ['Anexo el desglose de O.S:<br>'];
            clavesReporte.forEach((c) => {
              if (reporte[c] > 0 && c !== 'refacciones_a' && c !== 'ub') {
                const nombre = c === 'refacciones_v' ? 'refacciones' : c;
                infoReporte.push(`${nombre}: ${this._publicos.redondeado2(reporte[c], true)}<br>`);
              }
            });
            
            const infoCorreo = {
              subject: 'Le informamos que se han realizado cambios en su información de la O.S #' + recepcion.no_os,
              correos,
              cliente,
              vehiculo,
              no_os,
              resumen: info,
              desgloce: infoReporte.join(' ')
            }
            // console.log(infoCorreo);
      
            this._email.cambioInformacionOS(infoCorreo)
            const updates = {};
            updates[`recepciones/${id}/notificar`] = false;
            update(ref(db), updates).then(()=>{
              this.recepciones_arr[index].notificar = false 
            });
          })
        }
      })
      
    }
    
    
  }

  
}
