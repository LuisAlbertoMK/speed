import {AfterViewInit, Component, ViewChild,OnInit} from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {map, startWith} from 'rxjs/operators';


import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


import Swal from 'sweetalert2';


import { getDatabase, onValue, ref, set, get, child, push,update  } from 'firebase/database';
import { Observable } from 'rxjs';
import { EmailsService } from 'src/app/services/emails.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { UsuariosService } from '../../services/usuarios.service';
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

  miniColumnas:number = 100
  ROL:string = '';SUCURSAL:string=''; 
  
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','nombre','cantidad','costo','precio','total']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos
  ///aaqui los nuevos campos para mostrar
  id_recepcion = null
  listaTecnicos = []
  paquetes = []
  paquetesListos:boolean = false
  camposCliente=[
    {valor:'nombre',show:'Nombre'},
    {valor:'apellidos',show:'Apellidos'},
    {valor:'correo',show:'Correo'},
    {valor:'correo_sec',show:'Correo 2'},
    {valor:'no_cliente',show:'# Cliente'},
    {valor:'telefono_movil',show:'Tel. movil'},
    {valor:'telefono_fijo',show:'Tel. Fijo'},
    {valor:'tipo',show:'Tipo'}
  ]
  camposVehiculo=[
    {valor:'placas',show:'placas'},
    {valor:'marca',show:'marca'},
    {valor:'modelo',show:'modelo'},
    {valor:'anio',show:'anio'},
    {valor:'categoria',show:'categoria'},
    {valor:'cilindros',show:'cilindros'},
    {valor:'color',show:'color'},
    {valor:'engomado',show:'engomado'},
    {valor:'marcaMotor',show:'marcaMotor'},
    {valor:'no_motor',show:'no_motor'},
    {valor:'transmision',show:'transmision'},
    {valor:'vinChasis',show:'vinChasis'},
  ]
  camposTecnico=[
    {valor:'usuario',show:'Nombre'},
    {valor:'correo',show:'correo'},
  ]
  camposDesgloce = [
    {show:'MO',valor:'mo'},
    {show:'costo de refacción',valor:'refacciones_a'},
    {show:'precio de venta refacción',valor:'refacciones_v'},
    {show:'Sobrescrito',valor:'sobrescrito'},
    {show:'subtotal',valor:'subtotal'},
    {show:'IVA',valor:'iva'},
    {show:'total',valor:'total'},
    {show: 'U.B estimada',valor:'ub',symbolo:'%'},
  ]
  dataRecepcion={}
  reporte = {
    iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
    subtotal:0, total:0, ub:0, meses:0, descuento:0,sobrescrito:0
  }

  constructor(private router: Router, private rutaActiva: ActivatedRoute,private fb: FormBuilder,private _email:EmailsService,
    private _sucursales: SucursalesService, private _servicios:ServiciosService, private _publicos:ServiciosPublicosService,
    private _security:EncriptadoService,private _catalogos:CatalogosService,private _usuarios: UsuariosService) { }

  ngOnInit(): void {
    this.listadoTecnicos()
    
    this.rol()
    // this.autocompletar()
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


  
  rol(){
    
    
    
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this.obtenerInformacionRecepcion()
    }

    
    
  }
  obtenerInformacionRecepcion(){
    // modificaRecepcion/:rutaAnterior/:idRecepcion
    this.id_recepcion = this.rutaActiva.snapshot.params['idRecepcion']
    if (this.id_recepcion) {
      const starCountRef = ref(db, `recepciones/${this.id_recepcion}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          //asigancion de la informacion para obtener informacion de cliente, vehiculo y sucursal
          const dataRecepcion = snapshot.val()
          const integra = {...dataRecepcion}
          integra['infoSucursal'] = this.infoSucursal(dataRecepcion['sucursal']).dataSucursal
                this.infoTecnico(dataRecepcion['tecnico']).then(({okTecnico,dataTecnico})=>{
                  integra['infoTecnico'] = dataTecnico
                })
          const startCliente = ref(db, `clientes/${dataRecepcion['cliente']}`)
            onValue(startCliente, (snapshotc) => {
              const dataCliente = snapshotc.val()
              integra['infoCliente'] = dataCliente
              if (dataCliente['vehiculos']) {
                const vehiculos = this._publicos.crearArreglo2(dataCliente['vehiculos'])
                integra['infoVehiculo'] =  vehiculos.find(v=>v['id'] === dataRecepcion['vehiculo'])
              }
              let servicios = []
              if(dataRecepcion['servicios']) servicios = dataRecepcion['servicios']
              const margen = (1 + (this.dataRecepcion['margen']/100))
              servicios.map(s=>{
                let mul =0;
                (s['costo']> 0 ) ? mul = s['costo'] : mul = s['precio']
                
                // s['tipo'] = s['tipo'].toLowerCase()
                if (s['tipo'] === 'refaccion') {
                  s['total'] = (mul * s['cantidad']) * margen
                }else{
                  s['total'] = mul * s['cantidad']
                }
              })
              // console.log(servicios);
              
              integra['elementos'] = servicios
              integra['reporte'] = this._publicos.realizarOperaciones_2(integra).reporte
              integra['servicios'] = this._publicos.realizarOperaciones_2(integra).elementos
              this.dataRecepcion = integra              
              this.realizarInfo(integra['servicios'])
               this.realizaOperaciones()
              //  console.log(integra);
              })
        }
      })
    } 
  }
  realizarInfo(servicios:any[]){
    // console.log(servicios);
    servicios.map(s=>{
      const info = this._publicos.reportePaquete(s.elementos,this.dataRecepcion['margen'])
      s['reporte_interno'] = info;
      s['precio'] = info.total;
      s['total'] = info.total;
    })
    this.dataSource.data = servicios
    this.newPagination('servicios')
    this.realizaOperaciones()
  }
  infoSucursal(idSucursal:string){
    const answer = {okSucursal:true, dataSucursal:{}}
    const starCountRef = ref(db, `sucursales/${idSucursal}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        answer.dataSucursal = snapshot.val()
      } else {
        answer.okSucursal = false
      }
    },
    {
      onlyOnce: true
    })
    return answer
  }
  async infoTecnico(idTecnico:string){
    const answer = { okTecnico:true, dataTecnico:{} }

    await get(child(dbRef, `usuarios/${idTecnico}`)).then((snapshot) => {
      if (snapshot.exists()) {
        answer.dataTecnico = snapshot.val()
      } else {
       answer.okTecnico = false
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  eliminaElemento(index:number){
    const elementos:any[] = this.dataRecepcion['servicios']
    elementos[index] = null
    this.dataRecepcion['servicios'] = elementos.filter(e=>e)
    this.realizarInfo(elementos.filter(e=>e))    
  }
  realizaOperaciones(){
    // setTimeout(()=>{

    let servicios = []
    if(this.dataRecepcion['servicios']) servicios = this.dataRecepcion['servicios']
    const aprobados = servicios.filter(o=>o['aprobado'])
    
    // const valoresForm = this.FormComplementos.value
    if(!this.dataRecepcion['descuento']) this.dataRecepcion['descuento'] = 0
    // if(!this.dataRecepcion['servicios']) this.dataRecepcion['servicios'] = []
    const factura= this.dataRecepcion['iva']
    const envia_temp = {
      elementos: aprobados,
      margen_get: this.dataRecepcion['margen'],
      iva: factura,
      formaPago: this.dataRecepcion['formaPago'],
      descuento: this.dataRecepcion['descuento'],
    }
    // console.log(aprobados);
    
    const reporte = this._publicos.realizarOperaciones_2(envia_temp).reporte
    this.reporte= reporte
    // },100)
  }
  newPagination(table:string){
    setTimeout(() => {
      if (table ==='servicios') {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      }
    },500)
  }
  getInfoElemento(data){
    // dataElemento
    // console.log(data);
    
    if (data['id']) {
      this.dataRecepcion['servicios'].push(data)
      this.realizarInfo(this.dataRecepcion['servicios'])
    }
  }
  infopaquete(data){
    console.log(data);
    this.dataRecepcion['servicios'].push(data)
    this.realizarInfo(this.dataRecepcion['servicios'])
  }
  eliminaSubElemento(subelement, element){

    let arregloOriginal = this.dataRecepcion['servicios'][element].elementos
   
    let arregloCopia = [...arregloOriginal];
    arregloCopia[subelement]= null
    const nuevoArreglo = arregloCopia.filter(o=>o!==null)
    this.dataRecepcion['servicios'][element].elementos = nuevoArreglo
    this.realizarInfo(this.dataRecepcion['servicios'])
     console.log(nuevoArreglo);
    
  }
}
