import { Component,HostListener, OnInit, ViewChild, Output,EventEmitter,AfterViewInit, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, onValue, ref, set, get, child, push,update } from 'firebase/database';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import SignaturePad from 'signature_pad';
import { UploadFirmaService } from 'src/app/services/upload-firma.service';

import Swal from 'sweetalert2';
import {map, startWith} from 'rxjs/operators';
import { EmailsService } from 'src/app/services/emails.service';
import { Observable } from 'rxjs';

import {animate, state, style, transition, trigger} from '@angular/animations';


import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { ClientesService } from '../../services/clientes.service';
import { SucursalesService } from '../../services/sucursales.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { ServiciosService } from '../../services/servicios.service';
import { CatalogosService } from '../../services/catalogos.service';

import { FileItem } from 'src/app/models/FileItem.model';
import html2canvas from 'html2canvas';
import { UploadFileService } from '../../services/upload-file.service';
import { UsuariosService } from '../../services/usuarios.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';

import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";

import { UploadPDFService } from '../../services/upload-pdf.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { file } from 'pdfkit';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-servicios-confirmar',
  templateUrl: './servicios-confirmar.component.html',
  styleUrls: ['./servicios-confirmar.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ServiciosConfirmarComponent implements OnInit, AfterViewInit {

  miniColumnas:number = 100

  ROL:string =''; SUCURSAL:string ='';



  //TODO: aqui la informacion que es nueva
  infoConfirmar={cliente:{}, vehiculo:{},sucursal:{}, reporte:{},checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:1, margen: 25}
  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    // {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    // {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    // {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
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
  detalles_rayar=[
    {valor:'capo', show:'capo',status:false},
    {valor:'paragolpes_frontal', show:'paragolpes frontal',status:false},
    {valor:'paragolpes_posterior', show:'paragolpes posterior',status:false},
    {valor:'techo', show:'techo',status:false},
    {valor:'espejo_derecho', show:'espejo derecho',status:false},
    {valor:'espejo_izquierdo', show:'espejo izquierdo',status:false},
    {valor:'faros_frontales', show:'faros frontales',status:false},
    {valor:'faros_posteriores', show:'faros posteriores',status:false},
    {valor:'parabrisas_posterior', show:'parabrisas posterior',status:false},
    {valor:'paragolpes_frontal', show:'paragolpes frontal',status:false},
    {valor:'paragolpes_posterior', show:'paragolpes posterior',status:false},
    {valor:'puerta_lateral_derecha_1', show:'puerta lateral derecha 1',status:false},
    {valor:'puerta_lateral_derecha_2', show:'puerta lateral derecha 2',status:false},
    {valor:'puerta_lateral_izquierda_1', show:'puerta lateral izquierda 1',status:false},
    {valor:'puerta_lateral_izquierda_2', show:'puerta lateral izquierda 2',status:false},
    {valor:'puerta_posterior', show:'puerta posterior',status:false},
    {valor:'tirador_lateral_derecha_1', show:'tirador lateral derecha 1',status:false},
    {valor:'tirador_lateral_derecha_2', show:'tirador lateral derecha 2',status:false},
    {valor:'tirador_lateral_izquierda_1', show:'tirador lateral izquierda 1',status:false},
    {valor:'tirador_lateral_izquierda_2', show:'tirador lateral izquierda 2',status:false},
    {valor:'tirador_posterior', show:'tirador posterior',status:false}
  ]
  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

  sinDetalles: boolean = true

  coloresPluma= [
    {show:'Azul', color:'#444BF2'},
    {show:'Amarillo', color:'#C9D612'},
    {show:'Naranja', color:'#FFA30A'},
    {show:'Negro', color:'#010101'},
    {show:'Rojo', color:'#F30F05'},
    {show:'Verde', color:'#3DD400'},
  ]
  colorPluma:string = '#010101'
  //TODO: aqui la informacion que es nueva


  constructor(
    private router: Router, private rutaActiva: ActivatedRoute, private _formBuilder: FormBuilder, private _clientes:ClientesService,
    private _uploadfirma: UploadFirmaService,private _mail:EmailsService, private fb: FormBuilder, private _publicos:ServiciosPublicosService,
    private _sucursales: SucursalesService, private _vehiculos: VehiculosService,
    private _servicios: ServiciosService, private _catalogos:CatalogosService, private _uploadFiles: UploadFileService,
    private _usuarios: UsuariosService,  private _security:EncriptadoService,
    private _cotizaciones: CotizacionService, private _pdfRecepcion: PdfRecepcionService,
    private _pdf: UploadPDFService, private _empresas: EmpresasService) { }
    
  ngOnInit(): void {
    this.listaSucursales()
  }
  ngAfterViewInit() {
    // this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  
  

  crearFormObservaciones(){
    // this.observaciones = this.fb.group({
    //   observaciones:['',[]]
    // })
  }

  listaSucursales(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    this.rol()
  }
  
  async rol(){
    
    const ID = this.rutaActiva.snapshot.params['ID']
    const tipo = this.rutaActiva.snapshot.params['tipo']
    console.log(ID);
    console.log(tipo);

    if(tipo === 'cotizacion'){
      const starCountRef = ref(db, `cotizacionesRealizadas/${ID}`)
      onValue(starCountRef, async (snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const {cliente, vehiculo, elementos, reporte,  iva, formaPago, margen_get} = snapshot.val()
          const infoCotizacion = snapshot.val()
          let vehiculos = []
          await get(child(dbRef, `clientes/${cliente.id}/vehiculos`)).then((snapVehiculos) => {
            if (snapVehiculos.exists()) {
              vehiculos = this._publicos.crearArreglo2(snapVehiculos.val())
            }
          })

          this.infoConfirmar.cliente = cliente
          this.infoConfirmar.vehiculo = vehiculo
          this.infoConfirmar.vehiculos = vehiculos
          this.infoConfirmar.servicios = elementos
          this.infoConfirmar.formaPago = formaPago
          this.infoConfirmar.margen = margen_get
          this.infoConfirmar.reporte = reporte

          this.infoConfirmar.checkList = this.detalles_rayar


          this.infoConfirmar.iva = iva
          
        }
      }, {
          onlyOnce: true
        })
    }
    
    
    
  }

  cambiaAprobado(index, aprobado){
    setTimeout(() => {
      this.infoConfirmar.servicios[index].aprobado = aprobado
      this.infoConfirmar.reporte = this._publicos.realizarOperaciones_2(this.infoConfirmar).reporte
    }, 100);
  }
  cambiarCheck(index, status){
    setTimeout(() => {
      this.infoConfirmar.checkList[index].status = status
    }, 100)
  }
  cambiaTodosCheckA(status){
    setTimeout(() => {
      this.infoConfirmar.checkList.map(c=>{
        c.status = status
      })
    },100)
    
  }

  
}
