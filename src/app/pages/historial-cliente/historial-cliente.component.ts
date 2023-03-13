import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onValue, ref, set, push } from 'firebase/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
const db = getDatabase()
const dbRef = ref(getDatabase());


import * as XLSX from 'xlsx';
import { ExporterService } from 'src/app/services/exporter.service';
import { ServiciosService } from '../../services/servicios.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';

@Component({
  selector: 'app-historial-cliente',
  templateUrl: './historial-cliente.component.html',
  styleUrls: ['./historial-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistorialClienteComponent implements OnInit {

  miniColumnas: number = 100; 
  @ViewChild('pagCotizaciones') paginator: MatPaginator; @ViewChild('Cotizaciones') sort: MatSort;
  @ViewChild('pagVehiculos') paginatorVehiculos: MatPaginator; @ViewChild('vehiculos') sortVehiculos: MatSort;
  DS_cotizaciones= new MatTableDataSource();
  DS_vehiculos= new MatTableDataSource();
  ROL:string =''; SUCURSAL:string=''; sucursales:any[]=[]
  columnsCotizaciones:string []=['no_cotizacion' ,'cliente', 'vehiculo']; columnsCotizacionesExtended=[...this.columnsCotizaciones,'expand']; 
  columnsVehiculos:string []=['placas','marca','modelo','categoria']; columnsVehiculosExtended=[...this.columnsVehiculos,'expand']; 
  clickedRows = new Set<any>(); cargandoData: boolean = true; listaVehiculos:any=[]; expandedElement: any | null; listaPaquetes:any = [];
  PaqueteDetalles:any=[]; totalCotizado:number = 0; calculando:boolean = true; totalAutorizado:number = 0; ultimaCotizacion:string = ''
  clienteID:string =''; dataCliente:any =[];ExisteCliente:boolean = false;  infoCotizacion:any=[];contadorVehiculos:number =0
  DFacturacion:any=[]; regresar:string=''; cotizacionesFiltro:any=[]; elementosDetailCotizacion:any=[]; elementosDetailpadre:any=[];
  cotizacionesFiltroShow:any=[]; formCliente: FormGroup; correoExistente:boolean= false; formFacturacion: FormGroup;  clientes:any=[];
  myControl = new FormControl('');; filteredOptions: Observable<any[]>; cotizaciones:any=[]; vehiculos:any=[]; subtotalCotizado:number =0
  cotizacionesUtiliza:any=[]; cotizacionesExist:boolean = true
  
  dataRececpiones:any[]=[]

  dataSource = new MatTableDataSource();
  @ViewChild('recepciones') paginatorRecepciones: MatPaginator;
  @ViewChild('recepcionestab') sortRecepciones: MatSort;
  columnasRecepciones:string[]=['no_os','status','placas','fecha_recibido','fecha_entregado'];
  columnasRecepcionesExtended:string[]=[...this.columnasRecepciones,'expand'];

  ordena:boolean = true;

  listaTecnicos=[]
  camposDesgloceIVA=[
    {nombre:'refacciones adquisición',valor:'refacciones1'},{nombre:'refacciones venta',valor:'refacciones2'},
    {nombre:'total MO',valor:'totalMO'},{nombre:'sobrescrito',valor:'sobrescrito'}, 
    {nombre:'IVA',valor:'IVA'},
    {nombre:'subtotal',valor:'subtotal'},{nombre:'total',valor:'total'},
  ]
  camposDesgloceSINIVA=[
    {nombre:'refacciones a',valor:'refacciones1'},{nombre:'refacciones v',valor:'refacciones2'},
    {nombre:'total MO',valor:'totalMO'},{nombre:'sobrescrito',valor:'sobrescrito'}, {nombre:'total',valor:'total'},
  ]

  infoGeneral_Degloce = {IVA:0,UB:0,refacciones1:0,refacciones2:0,sobrescrito:0,subtotal:0,total:0,totalMO:0}

  infoGeneral_Degloce_cotizaciones = {IVA:0,UB:0,refacciones1:0,refacciones2:0,sobrescrito:0,subtotal:0,total:0,totalMO:0}

  campos_desgloce = [
    {nombre:'IVA',valor:'IVA'},
    {nombre:'U.B',valor:'UB'},
    {nombre:'Refacciones adquisicion',valor:'refacciones1'},
    {nombre:'Refacciones venta',valor:'refacciones2'},
    {nombre:'total MO',valor:'totalMO'},
    {nombre:'Costo sobrescrito',valor:'sobrescrito'},
    {nombre:'subtotal',valor:'subtotal'},
    {nombre:'total',valor:'total'}
  ]
  infoPawuete={dataGeneral:'',elementos:[],data:{totalMO:0,refacciones1:0,refacciones2:0,precio:0,flotilla:0}}
  infoElemento:any =[]
  camposElementos =['nombre','cantidad','precio']
  camposElementosPrincipal =['nombre']
  camposElementosPaquete =[...this.camposElementos,'cantidad']
  camposDesgloce =['totalMO','refacciones1','refacciones2','precio','flotilla']
  constructor(private rutaActiva: ActivatedRoute,private fb: FormBuilder, private _exportExcel: ExporterService, private router:Router,
    private _servicios: ServiciosService, private _publicos: ServiciosPublicosService, private _cotizaciones: CotizacionesService) { }


  async ngOnInit() {
    this.crearFormularioClientes()
    this.crearFormFacturacion()
    await this.listadoSucursales()
    await this.listadoClientes()
    await this.listadoCotizacionesall()
    await this.listadoVehiculos()
    await this.listadoCotizaciones()
    this.listado_recepciones()
    this.rol()
    
    this.auto()
  }
  // exportToExcel(): void {
  //   let element = document.getElementById('season-tble');

  //   const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  //   const book: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');
  //   const nombre = 'prueba'
  //   XLSX.writeFile(book, `${nombre}.xlsx`);
  // }
  exportAsXLSX():void{
    // console.log(this.sucursales);
    
    const cotizaciones:any = this.DS_cotizaciones.data
    // console.log(this.DS_cotizaciones.data)
    for (let index = 0; index < cotizaciones.length; index++) {
      const element = cotizaciones[index];
      element.dataCliente = this.dataCliente
      element.dataSucursal = this.dataCliente.dataSucursal
    }
    console.log(cotizaciones);
    
    const nombreExcel:String = `Historial_${this.dataCliente.nombre}_${this.dataCliente.apellidos}`
    this._exportExcel.exportToExcelCotizaciones(cotizaciones,nombreExcel.trim())
  }

  auto(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }
  private _filter(value: string): string[] {
    const filterValue = value
    let data = []
    const valor = String(filterValue).toLowerCase()
    data = this.clientes.filter(option => option.fullname.toLowerCase().includes(valor))
    return data
  }

  displayFn(user: any): string {    
    return user && `${user.fullname}` ? user.fullname : '';
  }
  rol(){
    this.clienteID = this.rutaActiva.snapshot.params['idCliente']
    this.regresar = this.rutaActiva.snapshot.params['rutaAnterior']
    this.ROL =localStorage.getItem('tipoUsuario')
    this.SUCURSAL =localStorage.getItem('sucursal')
    if (this.regresar==='cotizacionNueva') {
      this.regresar = 'cotizacionNueva/cotizacion/new'
    }
    // this.existeCliente(this.clienteID)
  }
  listadoVehiculos(){
    setTimeout(() => {
      const starCountRef = ref(db, `vehiculos`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const vehi= this.crearArreglo2(snapshot.val())
        this.vehiculos = vehi.filter(option=>option.cliente === this.clienteID)
        this.contadorVehiculos = this.vehiculos.length
        let totalCotizado=0; let subtotalCotizado =0
        get(child(dbRef, `cotizacionesRealizadas`)).then((snapaCot) => {
          if (snapaCot.exists()) {
            const cotizaciones = this.crearArreglo2(snapaCot.val())
            for (let index = 0; index < this.vehiculos.length; index++) {
              const vehiculo = this.vehiculos[index];
              const dataCotizaciones = cotizaciones.filter(option=>option.vehiculo === vehiculo.id)
              vehiculo.dataCotizaciones = dataCotizaciones
              
              for (let indice = 0; indice < dataCotizaciones.length; indice++) {
                const cotizacion = dataCotizaciones[indice];
                totalCotizado = totalCotizado + cotizacion.total
                subtotalCotizado = subtotalCotizado + cotizacion.subtotal
                vehiculo.subtotalCotizado = subtotalCotizado
                vehiculo.totalCotizado = totalCotizado
                const tempVehiculo = {
                  anio: vehiculo.anio,
                  categoria: vehiculo.categoria,
                  cilindros: vehiculo.cilindros,
                  cliente: vehiculo.cliente,
                  color: vehiculo.color,
                  engomado: vehiculo.engomado,
                  id: vehiculo.id,
                  marca: vehiculo.marca,
                  marcaMotor: vehiculo.marcaMotor,
                  modelo: vehiculo.modelo,
                  no_motor: vehiculo.no_motor,
                  placas: vehiculo.placas,
                  status: vehiculo.status,
                }
                vehiculo.dataVehiculo = tempVehiculo
              }
              if (cotizaciones.length ===0) {
                vehiculo.subtotalCotizado = 0
                vehiculo.totalCotizado = 0

              }
            }
                    
            this.DS_vehiculos= new MatTableDataSource(this.vehiculos)
            this.newPagination('vehiculos')
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
        
        
      } else {
        console.log("No data available");
      }
    })
    }, 600);
  }
  listadoCotizaciones(){
    // this.cotizaciones =[]

    this.infoGeneral_Degloce_cotizaciones = {IVA:0,UB:0,refacciones1:0,refacciones2:0,sobrescrito:0,subtotal:0,total:0,totalMO:0}

    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._cotizaciones.infoCotizaciones().then(({valores,arreglo})=>{
          if (valores) {
              // console.log(arreglo);
              const filtro = arreglo.filter(o=>o['cliente'] === this.clienteID)
              for (let index = 0; index < filtro.length; index++) {
                const element = filtro[index].desgloce;
                for (let index_camp = 0; index_camp < this.campos_desgloce.length; index_camp++) {
                  const camp = this.campos_desgloce[index_camp];
                      this.infoGeneral_Degloce_cotizaciones[camp.valor] = this.infoGeneral_Degloce_cotizaciones[camp.valor] + element[camp.valor]
                }
              }
              this.infoGeneral_Degloce_cotizaciones['UB'] = this.infoGeneral_Degloce_cotizaciones['UB'] / filtro.length 
              this.DS_cotizaciones = new MatTableDataSource(filtro)
              this.newPagination('cotizaciones')
            }
        })
      } else {
        console.log("No data available");
      }
    })
  }
  listado_recepciones(){
    this._servicios.getRecepcionesnew().then(({valido,data})=>{
      if (valido) {
        this.infoGeneral_Degloce = {IVA:0,UB:0,refacciones1:0,refacciones2:0,sobrescrito:0,subtotal:0,total:0,totalMO:0}

        const filtro = data.filter(o=>o['cliente'] === this.clienteID)
        for (let index = 0; index < data.length; index++) {
          const element = data[index].desgloce;
          for (let index_camp = 0; index_camp < this.campos_desgloce.length; index_camp++) {
            const camp = this.campos_desgloce[index_camp];
                this.infoGeneral_Degloce[camp.valor] = this.infoGeneral_Degloce[camp.valor] + element[camp.valor]
          }
        }
        this.infoGeneral_Degloce['UB'] = this.infoGeneral_Degloce['UB'] / data.length 
        this.dataSource= new MatTableDataSource(filtro)
            this.newPagination('recepciones')
      }
      
    })
  }
  listadoCotizacionesall(){
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.cotizacionesUtiliza = this.crearArreglo2(snapshot.val())
      } else {
        console.log("No data available");
      }
    })
  }
  nuevaCotizacion(vehiculo:any,item:any){
    localStorage.setItem('clienteCotizacion',JSON.stringify(this.dataCliente))
    localStorage.setItem('elementosCotizacion',JSON.stringify(item.elementos))
    localStorage.setItem('dataVehiculo',JSON.stringify(vehiculo))
    const temp = {iva:item.iva, promocion:item.promocion,nota:item.nota,descontado: item.descontado, 
                  aprobada:item.aprobada,servicio:item.servicio, descripcion: item.descripcion, formaPago: item.formaPago}
    localStorage.setItem('cotizacionInfo',JSON.stringify(temp))    
  }
  listadoClientes(){
    setTimeout(() => {
      const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        this.clientes= this.crearArreglo2(snapshot.val())
        for (let index = 0; index < this.clientes.length; index++) {
          const cliente = this.clientes[index];
          cliente.fullname = `${cliente.nombre} ${cliente.apellidos}`      

          // console.log(cliente);
          // console.log(this.clientes[index]);
          
          // const dataSucursal = this.sucursales.filter(option=>option.id === cliente.sucursal)

          await get(child(dbRef, `sucursales/${cliente.sucursal}`)).then((snapshot) => {
            if (snapshot.exists()) {
              cliente.dataSucursal = snapshot.val()
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
          // console.log(dataSucursal);
          
          cliente.sucursal = cliente.dataSucursal.sucursal
          if (cliente.id === this.clienteID) {
            this.dataCliente = cliente            
            this.ExisteCliente = true
          }
        }
      } else {
        // console.log("No data available");
      }
    })
    }, 1000);
  }
  async listadoSucursales(){
    const starCountRef = ref(db, `sucursales`)
    await onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.sucursales= this.crearArreglo2(snapshot.val())
      } else {
        console.log("No data available");
      }
    })
  }
  crearFormularioClientes(){
    this.formCliente = this.fb.group({
      id:['',[]],
      nombre:['',[Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      apellidos:['',[Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      correo:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      correo_sec:['',[Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      telefono_fijo:['',[Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^[0-9]+$")]],
      telefono_movil:['',[Validators.required,Validators.minLength(3), Validators.maxLength(10),Validators.pattern("^[0-9]+$")]],
      tipo:['',[Validators.required]],
      sucursal:['',[Validators.required]],
      empresa:['',[]]
    })
    const input = document.getElementById("empresa")
    input.setAttribute('disabled','true')
  }
  cargaDataCliente(){
    // console.log(this.dataCliente);
    const sucursal = this.dataCliente.dataSucursal
    this.formCliente.reset({
      id: this.dataCliente.id,
      nombre: this.dataCliente.nombre,
      apellidos: this.dataCliente.apellidos,
      correo: this.dataCliente.correo,
      correo_sec: this.dataCliente.correo_sec,
      telefono_fijo: this.dataCliente.telefono_fijo,
      telefono_movil: this.dataCliente.telefono_movil,
      tipo: this.dataCliente.tipo,
      sucursal: sucursal.id,
      empresa: this.dataCliente.empresa,
    })
  }
  dataGet(data:any){
    this.clienteID = data.id
    this.listadoVehiculos()
    this.listadoCotizaciones()
    this.dataCliente = data
    // console.log(data);
    
    this.router.navigateByUrl(`/historial-cliente/cotizacion/${data.id}`)
  }
  empresaCheck(){
    const input = document.getElementById("empresa")
    this.formCliente.controls['empresa'].setValue('')
    if (this.formCliente.controls['tipo'].value=== 'flotilla') {
      input.removeAttribute('disabled')
    }
    if (this.formCliente.controls['tipo'].value=== 'particular') {
      input.setAttribute('disabled','true')
    }
  }


  validarCampo(campo: string){
    return this.formCliente.get(campo).invalid && this.formCliente.get(campo).touched
  }
  crearFormFacturacion(){
    this.formFacturacion = this.fb.group({
      id:['',[Validators.required]],
      tipo:['',[Validators.required]],
      RFC:['',[Validators.required,Validators.minLength(13),Validators.maxLength(13)]],
      razon:['',[Validators.required]],
      calle:['',[Validators.required]],
      noInterior:['',[Validators.required]],
      noExterior:['',[Validators.required]],
      estado:['',[Validators.required]],
      CP:['',[Validators.required]],
      colonia:['',[Validators.required]],
      localidad:['',[Validators.required]],
      delegacion:['',[Validators.required]],
      telefono:['',[Validators.required]],
      telefono_adicional:['',[Validators.required]],
    })
  }
  guardarFacturacion(){

  }

  dataFacturacion(cliente:string){
    const starCountRef = ref(db, `facturacion/${cliente}`)
    onValue(starCountRef, (snapshot) => { 
      if (snapshot.exists()) {
        this.DFacturacion = snapshot.val()
      }else{
        this.DFacturacion = []
      }
    })
  }

  getElementosCotizacion(data:any){
    this.elementosDetailCotizacion = []    
    // this.elementosDetailpadre = padre
    this.elementosDetailCotizacion = data
  }
  async filtrarPaquete(data:any){
    let paquete = data.idReferencia
    this.PaqueteDetalles = data    
    const starCountRef = ref(db, `paquetesComplementos/${paquete}`)
    await onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {        
        this.listaPaquetes = this.crearArreglo2(snapshot.val())
        for (let index = 0; index < this.listaPaquetes.length; index++) {
          const element = this.listaPaquetes[index];
          if (element.tipo === 'refacciones') {
            this.getInfoElemento(`refacciones/${element.IDreferencia}`).then((val:any)=>{
              element.nombre = val.nombre
              element.precio = val.precio
              element.modelo = val.modelo
              element.marca = val.marca
              element.costo = val.precio * element.cantidad
              element.descripcion = val.descripcion
            })
          }else{
            this.getInfoElemento(`manos_obra/${element.IDreferencia}`).then((val:any)=>{
              element.nombre = val.nombre
              element.precio = val.precio
              element.costo = val.precio * element.cantidad
              element.descripcion = val.descripcion
            })
          }
        }        
      } else {
      this.PaqueteDetalles = data
      }
    })

    
  }
  guardarCliente(){

      const tempData = {...this.formCliente.value}
      set(ref(db, `clientes/${tempData.id}`), tempData )
          .then(() => {
            // this.mensajeCorrecto('Actualizacion correcta')
            this._publicos.mensajeCorrecto('Actualizacion correcta')
            // this.dataCliente = tempData
            // const dataSucursal = this.listaSucursales.filter(option=>option.id === tempData.sucursal)
            // tempData.dataSucursal = dataSucursal[0]
            // tempData.fullname = `${tempData.nombre} ${tempData.apellidos}`
            // this.myControl.setValue(tempData)
          })
          .catch((error) => {
            // The write failed...
          })
  }
  verificarExisteCorreoKeyPress(){
    setTimeout(() => {
      if (this.formCliente.controls['correo'].value!=='' || null) {
        const correoIngresado = (this.formCliente.controls['correo'].value).toLowerCase()
        const starCountRef = ref(db, `clientes`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            let arreglo= this.crearArreglo2(snapshot.val())
            this.correoExistente = arreglo.some(filtro=>(filtro.correo.toLowerCase()) === correoIngresado)
          } else {
            console.log("No data available");
          }
        })
        
      }
      
    }, 200); 
  }
  
  applyFilter(event: Event, table:string) {    
    const filterValue = (event.target as HTMLInputElement).value;
    if (table === 'cotizaciones') {
      this.DS_cotizaciones.filter = filterValue.trim().toLowerCase();
      if (this.DS_cotizaciones.paginator) {
        this.DS_cotizaciones.paginator.firstPage()
      }
    }
  }
  newPagination(table:string) {
    setTimeout(() => {
      if (table === 'cotizaciones') {
        this.DS_cotizaciones.paginator = this.paginator;
        this.DS_cotizaciones.sort = this.sort;
      }
      if (table === 'vehiculos') { 
        this.DS_vehiculos.paginator = this.paginatorVehiculos;
        this.DS_vehiculos.sort = this.sortVehiculos;
      }
      if (table === 'recepciones') { 
        this.dataSource.paginator = this.paginatorRecepciones;
        this.dataSource.sort = this.sortRecepciones;
      }

    }, 500);
  }
  async getInfoElemento(ruta:string){
    let info = []
    await get(child(dbRef, `${ruta}`)).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        info = snapshot.val()
      } else {
        info = []
      }
    }).catch((error) => {
      console.error(error);
    })
    return info
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
  

  registraTecnico(idRecepcion:string,dataTecnico:any){
    // console.log(dataTecnico);
    // if (dataTecnico['id']) {
    //   const updates = {};
    //   updates[`/recepciones/${idRecepcion}/tecnico`] = dataTecnico.id;
    //   update(ref(db), updates)
    //   .then(()=>{
    //     this._publicos.mensajeCorrecto('Se registro tecnico de la recepcion')
    //   })
    //   .catch((error) => {
    //     this._publicos.mensajeIncorrecto('Ocurrio un error' + error)
    //   });  
    // }else{
    //   const updates = {};
    //   updates[`/recepciones/${idRecepcion}/tecnico`] = '';
    //   update(ref(db), updates)
    //   .then(()=>{
    //     this._publicos.mensajeCorrecto('Se elimino tecnico de recepcion')
    //   })
    //   .catch((error) => {
    //     this._publicos.mensajeIncorrecto('Ocurrio un error' + error)
    //   });
    // }
    
  }
  cambiarStatusOS(status:string, data:any){
    const stat = status.toLowerCase()
    // console.log(stat);
    // console.log(data);
    
      // if ((status === 'entregado' || status === 'terminado') && !data.tecnico) {
      //     this._publicos.mensajeIncorrecto('Paara continuar favor de seleccionar tecnico')
      // }else{
        
        
      //   Swal.fire({
      //     title: 'Cambiar status de vehículo?',
      //     html:`<b class='text-uppercase'>${status}</b>`,
      //     showDenyButton: true,
      //     showCancelButton: false,
      //     confirmButtonText: 'Confirmar',
      //     allowOutsideClick: false ,
      //     denyButtonText: `Cancelar`,
      //   }).then(async (result) => {
      //     /* Read more about isConfirmed, isDenied below */
      //     if (result.isConfirmed) {
      //       //primero obtener los correos a los que se enviara
      //       // console.log(data);
      //       let correos = [];
      //       (data['infoSucursal']['correo']) ? correos.push(data['infoSucursal']['correo']) : '';
      //       (data['infoCliente']['correo']) ? correos.push(data['infoCliente']['correo']) : '';
      //       (data['infoCliente']['correo_sec']) ? correos.push(data['infoCliente']['correo_sec']) : '';
    
      //       const infoEmail = {
      //         correos,
      //         cliente: data['infoCliente'],
      //         vehiculo: data['infoVehiculo'],
      //         status:stat
      //       }
      //       if (stat==='terminado') {
      //         // console.log(data);
              
      //         const serv = data['servicios']
      //         for (let index = 0; index < serv.length; index++) {
      //           const element = serv[index];
      //           serv[index].terminado = true
      //         }
      //         // console.log(serv);
      //         set(ref(db, `recepciones/${data.id}/servicios`), serv )
      //           .then(() => {
      //             // Data saved successfully!
      //           })
      //           .catch((error) => {
      //             // The write failed...
      //           });

      //       }
            
      //       if (stat === 'cancelado') {
      //         let fecha2 = new Date()
      //         const fecha_cancelado = this._publicos.convierteFecha(`${fecha2.getDate()}/${fecha2.getMonth()+1}/${fecha2.getFullYear()}`)
      //         // console.log(fecha_cancelado);
      //         const updates = {};
      //         updates[`recepciones/${data.id}/status`] = 'cancelado';
      //         updates[`recepciones/${data.id}/fecha_entregado`] = fecha_cancelado;
      //         update(ref(db), updates);
      //       }else{
      //         set(ref(db, `recepciones/${data.id}/status`), stat )
      //         .then(async () => {
      //           // Data saved successfully!
      //             await this._email.EmailCambioStatus(infoEmail).then((ans:any)=>{
      //               const fechaHora = this._publicos.getFechaHora()
      //               if (stat === 'entregado') {
    
      //                 set(ref(db, `recepciones/${data.id}/fecha_entregado`), fechaHora.fecha )
      //                 set(ref(db, `recepciones/${data.id}/hora_entregado`), fechaHora.hora )
      //               }else if(stat === 'recibido'){
      //                 set(ref(db, `recepciones/${data.id}/fecha_recibido`), fechaHora.fecha )
      //                 set(ref(db, `recepciones/${data.id}/hora_recibido`), fechaHora.hora )
      //                 set(ref(db, `recepciones/${data.id}/fecha_entregado`), '' )
      //                 set(ref(db, `recepciones/${data.id}/hora_entregado`), '' )
      //               }else{
      //                 set(ref(db, `recepciones/${data.id}/fecha_entregado`), '' )
      //                 set(ref(db, `recepciones/${data.id}/hora_entregado`), '' )
      //               }
      //               this.mensajeCorrecto('Cambio de status correcto')
      //             })
      //         })
      //         .catch((error) => {
      //           // The write failed...
      //         });
      //       }
              
            
            
            
      //     } else if (result.isDenied) {
      //       this.mensajeIncorrecto('Se cancelo el cambio de status')
      //     }
      // })
      // }

    
  }
  nueva(dataGeneral:any,margen:number){
    this._publicos.ObtenerTotalesPaquete(dataGeneral.cantidad,dataGeneral.elementos,margen).then((ans:any)=>{
      this.infoPawuete.dataGeneral = dataGeneral
      this.infoPawuete.elementos = dataGeneral.elementos
      this.infoPawuete.data.totalMO = ans.totalMO
      this.infoPawuete.data.refacciones1 = ans.refacciones1
      this.infoPawuete.data.refacciones2 = ans.refacciones2
      this.infoPawuete.data.precio = ans.precio
      this.infoPawuete.data.flotilla = ans.flotilla
    })
}

  isSticky(columna:string) {
    return (columna).indexOf(columna) !== -1;
  }
  splitNombreDetalles(cadena:string){
    const caden = cadena.split('_')
    const nueva = caden.join(' ')
    return nueva
  }
  async ordenamiento(campo:string,ordena:boolean){
    // const asnOrder = await this._publicos.ordenamiento(this.servicios,campo,ordena)
    // this.dataSource =  new MatTableDataSource(asnOrder)
    // this.newPagination('recepciones')
    // this.ordena = ordena
    // return this.servicios
  }
}
