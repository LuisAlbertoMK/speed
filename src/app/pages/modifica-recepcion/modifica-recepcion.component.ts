import {AfterViewInit, Component, ViewChild,OnInit} from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {map, startWith} from 'rxjs/operators';


import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


import { getDatabase, onValue, ref, set, get, child, push,update  } from 'firebase/database';

import { EmailsService } from 'src/app/services/emails.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CamposSystemService } from '../../services/campos-system.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-modifica-recepcion',
  templateUrl: './modifica-recepcion.component.html',
  styleUrls: ['./modifica-recepcion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ModificaRecepcionComponent implements OnInit {

  

  constructor(private router: Router, private rutaActiva: ActivatedRoute,private fb: FormBuilder,private _email:EmailsService,
    private _sucursales: SucursalesService, private _servicios:ServiciosService, private _publicos:ServiciosPublicosService,
    private _clientes: ClientesService, private _vehiculos: VehiculosService, private _campos: CamposSystemService,
    private _security:EncriptadoService,private _catalogos:CatalogosService,private _usuarios: UsuariosService, private _cotizaciones: CotizacionesService) { }
    
    numeroDias: number = null
    ROL:string =''; SUCURSAL:string ='';
  
    infoConfirmar=
    {
      cliente:{}, vehiculo:{},sucursal:{}, reporte:{}, no_os:null, dataFacturacion: null,observaciones:null,
      checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:1, margen: 25, personalizados: [],
      detalles:[],diasEntrega: this.numeroDias, fecha_promesa: null, firma_cliente:null, pathPDF:'', status:null, diasSucursal:0,
      fecha_recibido:null, hora_recibido:null, notifico:true,servicio:null, tecnico:null, showNameTecnico: null
    }
    
    camposCliente  =    [ ...this._clientes.camposCliente_show ]
    camposVehiculo =    [ ...this._vehiculos.camposVehiculo_ ]
    // camposDesgloce =    [ ...this._cotizaciones.camposDesgloce ]

    paquete: string     =   this._campos.paquete
    refaccion: string   =   this._campos.refaccion
    mo: string          =   this._campos.mo
    miniColumnas:number =   this._campos.miniColumnas
  
    // tabla
    dataSource = new MatTableDataSource(); //elementos
    elementos = ['nombre','cantidad','sobrescrito','precio']; //elementos
    columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
    expandedElement: any | null; //elementos
    @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
    @ViewChild('elements') sort: MatSort //elementos
  
    idPaqueteEditar: number = -1
    idPaqueteEditarBoolean: boolean = false
  
    camposGuardar = [
      'checkList','observaciones','cliente','detalles','diasEntrega','fecha_promesa','formaPago','iva','margen','reporte','servicios','sucursal','vehiculo','pathPDF', 'status', 'diasSucursal','fecha_recibido','hora_recibido','notifico','servicio', 'tecnico','showNameTecnico','no_os'
    ]
  
    datCliente:any
    cliente:string = null
  
    extra:string
    modeloVehiculo:string = null
    vehiculoData:string = null
  
    clienteId:string = null
    observaciones:string = null
  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    
    this.acciones()
    
  }
  acciones(){
    const ID = this.rutaActiva.snapshot.params['idRecepcion']
    const tipo = this.rutaActiva.snapshot.params['rutaAnterior']
    // console.log(ID);
    // console.log(tipo);
    const starCountRef = ref(db, `recepciones/${ID}`)
    
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        const {cliente, vehiculo, servicio,servicios ,elementos, sucursal, iva, formaPago, margen} = snapshot.val()
        this.infoConfirmar.cliente = cliente
          this.infoConfirmar.vehiculo = vehiculo
          // this.infoConfirmar.vehiculos = vehiculos

          this.infoConfirmar.formaPago = formaPago
          this.infoConfirmar.margen = margen
          this.infoConfirmar.sucursal = sucursal
          
          if(cliente.dataFacturacion){
            this.infoConfirmar.dataFacturacion = cliente.dataFacturacion.unica
          }else{
            this.infoConfirmar.dataFacturacion = null
          }
          
          this.infoConfirmar.servicio = servicio
          this.infoConfirmar.iva = iva
          this.extra = vehiculo.id
          this.infoConfirmar.servicios = (servicios)? servicios : []
          // this.infoConfirmar.reporte = this._publicos.realizarOperaciones_2(this.infoConfirmar).reporte
          // this.infoConfirmar.servicios = 
          // console.log(this._publicos.realizarOperaciones_2(this.infoConfirmar).ocupados);
          // console.log(this._publicos.realizarOperaciones_2(this.infoConfirmar).reporte);
          this.infoConfirmar.cliente = cliente
          // this.infoConfirmar.vehiculos = cliente.vehiculos
          this.realizaOperaciones()
      } else {
        // console.log("No data available");
        this._publicos.mensaje_pregunta('No se encontro informacion algunoa').then(()=>{
          this.router.navigateByUrl('/servicios')
        })
      }
    })
  }

  infoCliente(event){

  }
  infopaquete( event ){
    const originalArray = event.elementos;
    const copiedArray = originalArray.slice();
    const tempDate =  {...event, elementos: copiedArray }
    
    // console.log(copiedArray);
    copiedArray.forEach(element => {
      element.aprobado = true
    });
     
    this.infoConfirmar.servicios.push(tempDate)
    this.realizaOperaciones()
  }
  elementoInfo( event){
    event.aprobado = true
    if(this.idPaqueteEditar >= 0){
      this.infoConfirmar.servicios[this.idPaqueteEditar].elementos.push(event)
    }else{
      this.infoConfirmar.servicios.push(event)
    }
    this.realizaOperaciones()
  }
  editar(donde:string ,data,cantidad){
    if (donde === 'cantidad' && cantidad <= 0) cantidad = 1
    if (donde === 'costo' && cantidad <= 0) cantidad = 0

    this.infoConfirmar.servicios[data.index][donde] = Number(cantidad)
   
    this.realizaOperaciones()
  }
  eliminaElemento(data){
    this._publicos.mensaje_pregunta('Eliminar elemento ' + String(data.nombre).toLowerCase()).then(({respuesta})=>{
      if(respuesta){
        this.infoConfirmar.servicios = this.infoConfirmar.servicios.filter((_, index) => index !== data.index);
        this.realizaOperaciones()
      }
    })
    
  }
  editarSubelemento(donde:string ,data,item,cantidad){

    const elementos = [...data.elementos]

    if (donde === 'cantidad' && cantidad <= 0) cantidad = 1
    if (donde === 'costo' && cantidad <= 0) cantidad = 0
    elementos[item.index][donde] = Number(cantidad)

    this.infoConfirmar.servicios[data.index].elementos = elementos

    this.realizaOperaciones()
  }
  eliminaSubElemento(data,item){
    this._publicos.mensaje_pregunta('Eliminar Subelemento ' + String(item.nombre).toLowerCase() ).then(({respuesta})=>{
      if(respuesta){
        const elementos = data.elementos.slice();
        elementos.splice(item.index, 1);
        this.infoConfirmar.servicios[data.index].elementos = elementos;
        this.realizaOperaciones()
      }
    })
  }
  realizaOperaciones(){
    setTimeout(() => {
      const {reporte,ocupados} = this._publicos.realizarOperaciones_2(this.infoConfirmar)
      
      this.dataSource.data = ocupados
      this.infoConfirmar.servicios = ocupados
      this.infoConfirmar.reporte = reporte
      const ID = this.rutaActiva.snapshot.params['idRecepcion']
      const updates = {
        [`recepciones/${ID}/servicios`]: ocupados,
        [`recepciones/${ID}/reporte`]: reporte
      };
      update(ref(db), updates);
      this.newPagination()
    }, 100);

  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }
  cargaDataCliente(cliente:any){
    this.datCliente = null
    // this.vehiculo = null
    if (cliente) {
      setTimeout(() => {
        this.datCliente = cliente
      } , 200);
    }
  }
}
