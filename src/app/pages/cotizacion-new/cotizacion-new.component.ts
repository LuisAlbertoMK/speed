import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { child, get, getDatabase, onValue, push, ref, update } from "firebase/database";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { map, startWith } from 'rxjs/operators';
pdfMake.vfs = pdfFonts.pdfMake.vfs
//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';


import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { PdfService } from 'src/app/services/pdf.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import Swal from 'sweetalert2';
import { ClientesService } from '../../services/clientes.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { EmailsService } from '../../services/emails.service';
import { UploadPDFService } from '../../services/upload-pdf.service';
import { VehiculosService } from '../../services/vehiculos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {nombre: string, apellidos:string}
@Component({
  selector: 'app-cotizacion-new',
  templateUrl: './cotizacion-new.component.html',
  styleUrls: ['./cotizacion-new.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CotizacionNewComponent implements OnInit,AfterViewInit {
  miniColumnas:number = 100
  ROL:string; SUCURSAL:string

  infoCotizacion = {
    cliente:{},vehiculo:{},vehiculos:[],elementos:[],sucursal:{},reporte:{}, iva:true, formaPago: 1, descuento: 0, margen_get: 25
  }

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

   // tabla
   dataSource = new MatTableDataSource(); //elementos
   elementos = ['nombre','cantidad','sobrescrito','precio']; //elementos
   columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
   expandedElement: any | null; //elementos
   @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
   @ViewChild('elements') sort: MatSort //elementos

   paquete: string = 'paquete'
   refaccion: string = 'refaccion'
   mo: string = 'mo'

   checksBox = this._formBuilder.group({
    iva: true,
    detalles: false
  });

  formPlus: FormGroup

  servicios=[
    {valor:1,nombre:'servicio'},
    {valor:2,nombre:'garantia'},
    {valor:3,nombre:'retorno'},
    {valor:4,nombre:'venta'},
    {valor:5,nombre:'preventivo'},
    {valor:6,nombre:'correctivo'},
    {valor:7,nombre:'rescate vial'}
  ]
  formasPago=[
    {id:1,pago:'contado',interes:0,numero:0},
    {id:2,pago:'3 meses',interes:4.49,numero:3},
    {id:3,pago:'6 meses',interes:6.99,numero:6},
    {id:4,pago:'9 meses',interes:9.90,numero:9},
    {id:5,pago:'12 meses',interes:11.95,numero:12},
    {id:6,pago:'18 meses',interes:17.70,numero:18},
    {id:7,pago:'24 meses',interes:24.,numero:24}
  ]

  promociones=['ninguna','facebook','cartelera','instagram','radio']; 

  sucursales=[]
  obligatorios:string
  opcionales:string
  constructor(private _security:EncriptadoService, private rutaActiva: ActivatedRoute, private _publicos: ServiciosPublicosService,
    private _formBuilder: FormBuilder) { }
  ngOnInit() {
    this.rol()
    this.crearFormPlus()
  }
  ngAfterViewInit(): void {}
  crearFormPlus(){
    this.formPlus = this._formBuilder.group({
      servicio:[1,[Validators.required]],
      margen_get:[this.infoCotizacion.margen_get,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      formaPago:['1',[Validators.required]],
      promocion:['',[]],
      descuento:['',[Validators.pattern("^[0-9]+$"),Validators.min(0)]],
      descripcion:['',[]],
      nota:['',[]]
    })
  }
  validaCampo(campo: string){
    return this.formPlus.get(campo).invalid && this.formPlus.get(campo).touched
  }

  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal']);
    
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.sucursales = this._publicos.crearArreglo2(snapshot.val())
        this.accion()
      } 
    }, {
      onlyOnce: true
    })

  }
  accion(){
    const ID = this.rutaActiva.snapshot.params['ID']
    const tipo = this.rutaActiva.snapshot.params['tipo']
    console.log(ID);
    console.log(tipo);
    // console.log(this.sucursales);
    

    if (tipo ==='cliente') {
      const starCountRef = ref(db, `clientes/${ID}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const cliente = snapshot.val()
          if (cliente['vehiculos']) cliente['vehiculos'] = this._publicos.crearArreglo2(cliente['vehiculos'])
          // console.log(cliente);
          this.infoCotizacion.sucursal = this.sucursales.find(s=>s['id'] === cliente['sucursal'])
          this.infoCotizacion.cliente = cliente
          this.infoCotizacion.vehiculos = cliente.vehiculos
          this.realizaOperaciones()
        }
      })
    }
    
  }
  // REEMPLAZAR REFRIGERANTE Y PURGAR SISTEMA DE ENFRIAMIENTO

  realizaOperaciones(){
    // const  { elementos, margen_get, iva, formaPago, descuento } = data

    this.infoCotizacion.formaPago =  this.formPlus.controls['formaPago'].value
    this.infoCotizacion.iva = this.checksBox.controls['iva'].value
    this.infoCotizacion.reporte = this._publicos.realizarOperaciones_2(this.infoCotizacion).reporte
    this.infoCotizacion.elementos = this._publicos.realizarOperaciones_2(this.infoCotizacion).elementos
    console.log(this.infoCotizacion.elementos);
    
    this.dataSource.data = this.infoCotizacion.elementos
    this.newPagination()
  }

  elementoInfo( event){
    this.infoCotizacion.elementos.push(event)
    this.realizaOperaciones()
  }
  infopaquete( event ){
    this.infoCotizacion.elementos.push(event)
    this.realizaOperaciones()
  }
  eliminaElemento(data){
      let antiguos = []
      antiguos = [...this.infoCotizacion.elementos]
      antiguos[data.index] = null
      const filtrados = antiguos.filter(e=>e !==null)
      this.infoCotizacion.elementos = filtrados
      this.realizaOperaciones()
  }
  editaCantidad(data,cantidad){
    if (cantidad<=0) cantidad = 1 
    this.infoCotizacion.elementos[data.index].cantidad = cantidad
    this.realizaOperaciones()
  }
  vehiculo(IDVehiculo){
    if (IDVehiculo) {
      this.infoCotizacion.vehiculo = this.infoCotizacion.vehiculos.find(v=>v.id === IDVehiculo)
    }else{
      this.infoCotizacion.vehiculo = null
    }
  }
  validaciones(){
    const obligatorios = ['cliente','sucursal','vehiculo','iva','servicio', 'margen_get','formaPago','elementos']
    const opcionales = ['promocion','descuento','descripcion','nota']
    let camposObligatorios = [], camposOpcionales =[]

    const valores_Form = this.formPlus.value
    const claves = Object.keys(valores_Form)
    claves.forEach(c=>{
      (valores_Form[c]) ? this.infoCotizacion[c] = valores_Form[c] : this.infoCotizacion[c] = null
    })
    obligatorios.forEach(c=>{
      if(!this.infoCotizacion[c]) camposObligatorios.push(c)
    })
    if (!this.infoCotizacion.vehiculo['id'])  camposObligatorios.push('vehiculo')
    if (!this.infoCotizacion.elementos.length)  camposObligatorios.push('elementos')
    opcionales.forEach(c=>{
      if(!this.infoCotizacion[c]) camposOpcionales.push(c)
    })
    console.log(this.infoCotizacion);
    this.obligatorios = null
    this.opcionales = null
    this.obligatorios = camposObligatorios.join(', ')
    this.opcionales = camposOpcionales.join(', ')
    
  }


  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }


}
