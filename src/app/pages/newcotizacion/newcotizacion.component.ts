import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators'

import {MatTableDataSource} from '@angular/material/table';

import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { Vehiculo } from 'src/app/models/vehiculos.model';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmailsService } from '../../services/emails.service';
import {MatMenuTrigger} from '@angular/material/menu';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import {NumerosLetrasPipe} from '../../pipes/numeros-letras.pipe'

import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";
import { style } from '@angular/animations';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const db = getDatabase();
const dbRef = ref(getDatabase());



export interface User {nombre: string, apellidos:string}



@Component({
  selector: 'app-newcotizacion',
  templateUrl: './newcotizacion.component.html',
  styleUrls: ['./newcotizacion.component.css']
})
export class NewcotizacionComponent implements OnInit {
  
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
   //autocompletado

   myControl = new FormControl('');
   filteredOptions: Observable<any[]>
  ROL:string = ''
  SUCURSAL:string = ''; arraySucursales:any [] =[]; clientes:any [] =[]; arrayPaquetesNew:any[]=[]; formCotizacion: FormGroup;
  formaNuevaReparacion: FormGroup; formaNuevaMO : FormGroup; listaArrayVehiculosCliente:Vehiculo[]=[]; IDClienteGetData:string=''; 
  selecciono:boolean = false; servicios:any=['servicio','garantia','retorno','preventivo','correctivo','rescate vial']; tempDatCotizacion:any[]=[];
   complemntosPQ:any = []; ACE:number = 2; colorTextoPDF: string = '#1215F4'; inflacion:number = .2
   dataSourcePaquetes: MatTableDataSource<any>; dataSourceMO: MatTableDataSource<any>; dataSourceRefacciones: MatTableDataSource<any>
   columnsPaquetes:string[]=['nombre','marca','modelo','cilindros','precio'];columnsPaquetesExtended:string[]=[...this.columnsPaquetes]; 
   columnasMO:string[]=['nombre','precio','descripcion']; columnasMOExtended:string[]=[...this.columnasMO]; 
   columnasRefacciones:string[]=['nombre','precio','descripcion']; columnasRefaccionesExtended:string[]=[...this.columnasRefacciones]
   clickedRows = new Set<any>(); 
  @ViewChild('paginatorPaquetes') paginatorPaquetes: MatPaginator ;@ViewChild('tabPaquetes') sortPaquetes: MatSort
  @ViewChild('paginatorMO') paginatorMO: MatPaginator; @ViewChild('tabMO') sortMO: MatSort
  @ViewChild('paginatorRefacciones') paginatorRefacciones: MatPaginator; @ViewChild('tabRefacciones') sortRefacciones: MatSort
  diasVigencia:number =0; vigente:boolean = true; soloHoy:string = ''; elementos:boolean = true; tresMeses:number =0; seisMeses:number=0;doceMeses:number =0
  nombre:string='';totalShow:string = ''; miniColumnas:number = 100; tempCot:any=[]; tempdataCotizacion:any=[]; tempdataCotizacionmuestra:any=[];
  IVA = true; Descuento = true; ivaAplicado:number = 0; subtotal:number = 0; totalConDescuento:number = 0; descuentoAplicado:number =0
  totalCotizacion:number = 0;arrayManosObra:any=[];venatanaModalPaquetes:boolean = false;venatanaModalManoObra:boolean = false;
  venatanaModalRecacciones:boolean = false;dataDetalles:any='';fecha:string;hora:string; dataSucursal:any=[]; tempDataPaquetes:any=[]
  unidades:string[]=['Pza','Lt','ml','Galón','metro','caja','botella','juego']; detallesmuestraPaquetes:any=[]; dataVehiculoExcel:any =[]
  repTipo:boolean = true; guardaCatalogo:boolean = false;clienteExiste:any=[];tipoCotizacion:string='';fechaPruebaPipe:Date;dataCliente:any=[];
  dataVehiculo:any=[];dataRecepcion:any=[];sucursalSelect :string = '';animal: string;name: string;  filtroAuto:string ='';sucursal:string ='';
  referenciasGuarda:any=[]; dataShowPaquete:any=[]; nombrePaquete:string =''; modeloAuto:string = '';contadorPaquetes:number = 0;pagina:string =''
  totalLetras:any=''; promociones:string []=['Cartelera','Facebook','Instagram','Radio','Bolante'] ; idhistorial:string = ''
  constructor(private fb: FormBuilder,private router: Router,  private rutaActiva: ActivatedRoute, private _email:EmailsService) { }
  ngOnInit(): void {
    this.rol()
    this.listarPaquetes('')
    this.listarMO()
    this.listarRefacciones()
    this.listaSucursales()
    this.listadoClientes()
    this.filtradoClientes()
    this.crearformCotizacion()
    this.crearformularionewRepacion()
    this.crearformularionewMO()
  }
  rol(){
    this.ROL =localStorage.getItem('tipoUsuario')
    this.SUCURSAL =localStorage.getItem('sucursal')
    this.tipoCotizacion = this.rutaActiva.snapshot.params['cotizacion']
    this.pagina = this.rutaActiva.snapshot.params['pagina']
    if (this.pagina==='newCotizacion') {
      this.pagina = 'cotizacion'
    }
    if (this.tipoCotizacion !== 'new') {
     this.obtenerInfoCotizacion()
    }else{
      this.elementos = false
    }
  }
  listarPaquetes(aplica:string){

    const starCountRef = ref(db, `paquetes`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            let all = this.crearArreglo2(snapshot.val())
            let filtro = all.filter(filtro=>filtro.precio>0)
            if (this.dataRecepcion.vehiculo) {
              this.listaArrayVehiculosCliente.forEach(V => {
                if (V.id  === this.dataRecepcion.vehiculo) {
                  this.modeloAuto = `${V.modelo}`
                }
              })
            }
            if (aplica!=='') {
                let aplicaFiltroModelo = filtro.filter(filtro=>filtro.marca === aplica)
                this.modeloAuto = aplica
                this.contadorPaquetes = aplicaFiltroModelo.length
                this.dataSourcePaquetes = new MatTableDataSource(aplicaFiltroModelo)
                this.newPagination('paquetes')
            }else{
              this.contadorPaquetes = filtro.length
              this.dataSourcePaquetes = new MatTableDataSource(filtro)
              this.newPagination('paquetes')
            }
          } else {
            console.log("No data available");
          }
        })
  }
  listarMO(){
    const starCountRef = ref(db, `manos_obra`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            let all = this.crearArreglo2(snapshot.val()) 
            this.dataSourceMO = new MatTableDataSource(all)
            this.newPagination('mo')
          } else {
            console.log("No data available");
          }
        })
  }
  listarRefacciones(){
    const starCountRef = ref(db, `refacciones`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            let all = this.crearArreglo2(snapshot.val())             
            this.dataSourceRefacciones = new MatTableDataSource(all)
            this.newPagination('refacciones')
          } else {
            console.log("No data available");
          }
        })
  }
  obtenerInfoCotizacion(){
    const starCountRef = ref(db, `cotizacionesRealizadas/${this.tipoCotizacion}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
          this.dataRecepcion= snapshot.val()     
          this.getFechaHora()
          if (this.dataRecepcion.descuento) {
            setTimeout(() => {
              this.aplicarDescuento()
            }, 1500);
          }          
          let diasExpiro = (this.restaFechas(this.dataRecepcion.fecha,this.fecha))
          if (diasExpiro<=20 && diasExpiro>=0) {
            this.vigente = true
            this.diasVigencia = 20 - diasExpiro 
            if (this.diasVigencia === 0) {
              this.soloHoy = 'Vence hoy'
            }
          }else{
            this.soloHoy =''
            this.diasVigencia = diasExpiro - 20
            this.vigente = false
          }
          this.IVA = this.dataRecepcion.IVA
          this.Descuento = this.dataRecepcion.descuento
          this.descuentoAplicado = this.dataRecepcion.CantidadDescuento
          const startCliente = ref(db, `clientes/${this.dataRecepcion.cliente}`)
          onValue(startCliente, (snapshot) => {
            if (snapshot.exists()) {
              let tempDataCliente = snapshot.val()
              const tempData = {
                ...snapshot.val()
              }
              get(child(dbRef, `sucursales/${tempDataCliente.sucursal}`)).then((snapSucursal) => {
                if (snapSucursal.exists()) {
                  this.dataSucursal = snapSucursal.val()
                  tempData.sucursal = this.dataSucursal.sucursal
                  tempData.fullname =`${ tempData.nombre } ${ tempData.apellidos}`
                  this.dataCliente= tempData
                } else {
                  console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              })
              } else {
                console.log("No data available");
              }
          })
          const starVehiculos = ref(db, `vehiculos`)
          onValue(starVehiculos, (snapVehiculos) => {
                  if (snapVehiculos.exists()) {
                    let vehiculos = this.crearArreglo2(snapVehiculos.val())
                      this.listaArrayVehiculosCliente = vehiculos.filter(filtro=>filtro.cliente === this.dataRecepcion.cliente)
                      this.getinfocompl(`vehiculos/${this.dataRecepcion.vehiculo}`).then((ans:any)=>{
                        const tempData = {
                          ...ans
                        }
                        tempData.placas = (ans.placas).toUpperCase()
                        this.dataVehiculoExcel = tempData
                      })
                      setTimeout(()=>{
                        this.modeloFiltro()
                      },500)
                    } else {
                      console.log("No data available");
                    }
          })
          this.getElementosCotizacion()
        } else {
          console.log("No data available");
        }        
    })
  }
  getElementosCotizacion(){
    get(child(dbRef,  `cotizacionesRealizadas/${this.tipoCotizacion}/elementos`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.tempdataCotizacionmuestra =[]
        this.totalCotizacion =0
        this.tempdataCotizacion =[]
        let complementoExistentes = snapshot.val()
        complementoExistentes.forEach(comple => {          
          if (comple.tipo === 'paquete') {
            this.getinfocompl(`paquetes/${comple.idReferencia}`).then((val:any)=>{
              const tempData = { ...val,precio:val.precio,idReferencia:comple.idReferencia}  
              this.addCotizacion(comple.idReferencia,tempData,'paquete')
            })
          }else{
            if (comple.tipo === 'mo') {
              this.getinfocompl(`manos_obra/${comple.idReferencia}`).then((val:any)=>{
                if (comple.personalizado) {
                  const tempData = { ...val,personalizado: comple.personalizado, Horas: comple.Horas,costo: comple.costo, precio:comple.precio , subtotal:val.precio*1,idReferencia:comple.idReferencia}  
                  this.addCotizacion(comple.idReferencia,tempData,'mo')
                }else{
                  const tempData = { ...val, Horas: 1,costo: comple.costo, precio:comple.costo, subtotal:val.precio*1,idReferencia:comple.idReferencia}
                  this.addCotizacion(comple.idReferencia,tempData,'mo')
                }
              })
            }else{
              this.getinfocompl(`refacciones/${comple.idReferencia}`).then((val:any)=>{
                const tempData = { ...val, cantidad:1,subtotal:val.precio*1,idReferencia:comple.idReferencia}
                this.addCotizacion(comple.idReferencia,tempData,'refaccion')
            })
            }
          }
        })
      } else {
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  async getinfocompl(ruta:string){
    let info =[]
    await get(child(dbRef, `${ruta}`)).then((snapshot) => {
      if (snapshot.exists()) {
        info = snapshot.val()
      } else {
        info =[]
      }
    }).catch((error) => {
      console.error(error);
    })
    return info
  }
  async infoPaquete(idPaquete:string){
    let totalPaquete= 0
    await get(child(dbRef, `paquetesComplementos/${idPaquete}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let complementos = this.crearArreglo2(snapshot.val())
        complementos.forEach(comple => {
          let ruta =''
          let variable = ''
          if (comple.tipo === 'paquete') {
            ruta = `paquetesComplementos/${comple.idReferencia}`
          }else{
            if (comple.tipo === 'mano obra') {
              ruta = `manos_obra/${comple.IDreferencia}`
            }else{
              ruta = `refacciones/${comple.IDreferencia}`
            }   
          }          
          get(child(dbRef, ruta)).then((snapshot) => {
            if (snapshot.exists()) {
              let infoTipo = snapshot.val()
            } else {
            }
            
          }).catch((error) => {
            console.error(error);
          });
        });
        
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })
      
    return totalPaquete
    
  }
  getInfoPaquete(data:any){
    this.nombrePaquete = data.nombre
    let datanew = []
    let busqueda = ''
    if (data.id) {
      busqueda = data.id
    }
    if (data.idReferencia) {
      busqueda = data.idReferencia
    }
    this.getinfocompl(`paquetesComplementos/${busqueda}`).then((val:any)=>{
      let data = this.crearArreglo2(val)
      data.forEach(comple => {        
        if (comple.tipo === 'mano obra') {
          this.getinfocompl(`manos_obra/${comple.IDreferencia}`).then((val:any)=>{
            const temp = {...val,cantidad:comple.cantidad,subtotal: (val.precio * comple.cantidad), tipo:'M.O', IDreferencia:comple.IDreferencia}
            datanew.push(temp)          
          })
        }else{
          this.getinfocompl(`refacciones/${comple.IDreferencia}`).then((val:any)=>{
            const temp = {...val,cantidad:comple.cantidad,subtotal: (val.precio * comple.cantidad),tipo:'Refacción', IDreferencia:comple.IDreferencia}
            datanew.push(temp)
          })
        }
        this.dataShowPaquete = datanew
      })
    })
  } 
  listaSucursales(){
      const starCountRef = ref(db, 'sucursales')
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val()
          this.arraySucursales = this.crearArreglo2(data)
        })
  }
  listadoClientes(){
      const starCountRef = ref(db, `clientes`);
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            let newClientes =[]
            let clientes = this.crearArreglo2(snapshot.val())
            clientes.forEach(cliente => {
              get(child(dbRef, `sucursales/${cliente.sucursal}`)).then((snpSucursal) => {
                if (snpSucursal.exists()) {
                  let infoSucursal =snpSucursal.val()
                  const tempData = {
                    ...infoSucursal,
                    ...cliente,
                    sucursal: infoSucursal.sucursal,
                    idSucursal: cliente.sucursal                    
                  }
                  newClientes.push(tempData)
                  let ClienetsActivos = newClientes.filter(filtro=>filtro.status === true)
                  
                  if (this.SUCURSAL === 'Todas') {
                    this.clientes = ClienetsActivos
                  } else {
                    this.clientes = ClienetsActivos.filter(filtro=>filtro.sucursal === this.SUCURSAL)
                  }
                } else {
                  console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              })
            })
          } else {
            console.log("No data available");
          }
          
        })
  }
  filtradoClientes(){
    this.filteredOptions =this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }
  private _filter(value: any[]): string[] {
    if (value===null) {
      return null
    }
    const filterValue = value    
    let data = []
    data = this.clientes.filter(option => option.nombre.toLowerCase().includes(filterValue))
    if (data.length ===0) {
      data = this.clientes.filter(option => option.apellidos.toLowerCase().includes(filterValue))
    }
    return this.ordernarPorCampo(data,'nombre')
  }  
  displayFn(val: User): string {
    return val && (val.nombre +' '+ val.apellidos) ? (val.nombre +' '+ val.apellidos) : ''
  }
  validarFormCotizacion(campo:string){
    return this.formCotizacion.get(campo).invalid && this.formCotizacion.get(campo).touched
  }
  clienteInfo(data:any){
  console.log(data);
  
  }
  verififff(){
    if (this.myControl.value==='') {
      this.formCotizacion.controls['cliente'].setValue('')
      this.selecciono = false
    }
  }
  modeloFiltro(){
    let V = this.formCotizacion.controls['vehiculo'].value
    if (V==='new') {
      this.router.navigateByUrl('/vehiculos/new/newCotizacion')
    }else{
      if (V==='') {
        this.listarPaquetes('')
      }
      this.listaArrayVehiculosCliente.forEach(vehiculo => {
        if (V === vehiculo.id) {        
          this.modeloAuto = vehiculo.modelo
          this.listarPaquetes(this.modeloAuto)
        }
      });
    }
  }
  verificaTipoServicio(){
    let servicio = this.formCotizacion.controls['servicio'].value
    if (servicio ==='garantia' || servicio === 'retorno') {
      Swal.fire({
        title: 'Relacion?',
        text: "Buscar relacion de servicio!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    }else{
      
    }
  }
  vehiculosCliente(dataGet:any){
    if (dataGet ==='undefined') {
      this.selecciono = false
      return
    }
    this.idhistorial = dataGet.id
    this.formCotizacion.controls['cliente'].setValue(dataGet.id)
    this.selecciono = true
    this.sucursal = dataGet.idSucursal
    const starCountRef = ref(db, `vehiculos`)
    onValue(starCountRef, (snapV) => {
      if (snapV.exists()) {
        let info = this.crearArreglo2(snapV.val())
        this.listaArrayVehiculosCliente =[]
          info.forEach(vehiculo => {
            if (vehiculo.cliente === dataGet.id) {
              this.listaArrayVehiculosCliente.push(vehiculo)
            }
          })
      } else {
        
      }            
    })
  }
  guardarCotizacionNew(){
    if (this.formCotizacion.invalid) {
      return Object.values(this.formCotizacion.controls).forEach(control => {
        control.markAsTouched()
        Swal.fire('Error','LLenar todos los campos necesarios','error')
      })
    }else{
      
    }
  }
  validarcampo(campo: string){
    return this.formaNuevaReparacion.get(campo).invalid && this.formaNuevaReparacion.get(campo).touched
  }
  validarcampoMO(campo: string){
    return this.formaNuevaMO.get(campo).invalid && this.formaNuevaMO.get(campo).touched
  }
  crearformCotizacion(){
    this.formCotizacion = this.fb.group({
      cliente:['',[Validators.required]],
      vehiculo:['',[Validators.required]],
      servicio:['',[Validators.required]],
      promocion:['',[]],
      nota: ['',[]]
    })
  }
  crearformularionewRepacion(){
    this.formaNuevaReparacion = this.fb.group({
      nombre:['',[Validators.required, Validators.minLength(5)]],
      precio:['',[Validators.required, Validators.minLength(1)]],
      cantidad:['',[Validators.required, Validators.minLength(1)]],
      subtotal:['',[Validators.required]],
      unidad:['',[Validators.required]],
      marca:['',[]]
    })
  }
  crearformularionewMO(){
    this.formaNuevaMO = this.fb.group({
      nombre:['',[Validators.required, Validators.minLength(5)]],
      precio:['',[Validators.required, Validators.minLength(1)]],
      horas:['',[Validators.required, Validators.minLength(1)]],
      subtotal:['',[Validators.required]]
    })
  }
  getCompleta(IDPaquete:string,data:any){
     this.nombre = data.nombre
    this.totalShow = data.total
    console.log(data);
    
    this.complemntosPQ = data.complementos
  }
  getDetalles(data:any){
    this.dataDetalles = data
  }
  addCotizacion(idPaquete:string,dataPaquete:any,tipo:string){    
    let temp ={...dataPaquete}
    if (this.tipoCotizacion !== 'new') {
      temp = {...dataPaquete,idReferencia: idPaquete, ingresado:false,tipo: tipo, personalizado:false }
    }else{
      temp = {...dataPaquete,idReferencia: idPaquete, ingresado:false,tipo: tipo, personalizado:false }
    }    
    if (dataPaquete.descripcion) {temp.descripcion = 'Ninguna'}
    if (tipo ==='refaccion') {temp.precio = dataPaquete.precio}
    if (tipo ==='mo') {
      temp.precio = dataPaquete.precio
      temp.Horas = 1
      temp.costo = dataPaquete.precio * 1
      if (dataPaquete.personalizado) {
        temp.personalizado = dataPaquete.personalizado
        temp.Horas = dataPaquete.Horas
        temp.costo = dataPaquete.costo
      }else{
        temp.personalizado = false
      }
    }
    if (tipo ==='paquete') {temp.precio = dataPaquete.precio}
    // console.log(temp);
    
    if (this.tempdataCotizacion.length ===0) {
      temp.ingresado = true
      this.tempdataCotizacion.push(temp)
    }else{
      let contador = 0
      for (let index = 0; index < this.tempdataCotizacion.length; index++) {
        const element = this.tempdataCotizacion[index];
        if (element.idReferencia === temp.idReferencia) {
          contador++
        }
      }
      if (contador ===0) {
        temp.ingresado = true
        this.tempdataCotizacion.push(temp)
      }
      if (contador  > 0) {
        // if (this.tipoCotizacion !== 'new') {
        //   temp.ingresado = true
        //   this.tempdataCotizacion.push(temp)
        // }
        for (let index = 0; index < this.tempdataCotizacion.length; index++) {
          const element = this.tempdataCotizacion[index]
          if (element.idReferencia === temp.idReferencia && element.ingresado === false) {
            // this.tempdataCotizacion[index] = temp
            // element.personalizado = false
            element.ingresado = true
          }
        }
      }
    }
    this.obtenerTotalCotizacion()
  }
  dropPaqueteCotizacion(idReferencia:string){
    for (let index = 0; index < this.tempdataCotizacion.length; index++) {
      const element = this.tempdataCotizacion[index].idReferencia
      if (element === idReferencia) {
        this.tempdataCotizacion[index] = []
      }
    }
    this.obtenerTotalCotizacion()
  }
 async obtenerTotalCotizacion(){
    this.totalCotizacion =0
    this.subtotal = 0
    let interno = 0
    this.referenciasGuarda =[]
    this.tempdataCotizacionmuestra = this.tempdataCotizacion.filter(filtro=>filtro.ingresado === true)    
    
    this.tempDataPaquetes = this.tempdataCotizacion.filter(filtro=>filtro.tipo === "paquete")
   let complementosAdd =[]
    if (this.tempdataCotizacionmuestra.length === 0) {
      this.totalCotizacion = 0; this.subtotal =0; this.ivaAplicado =0; this.descuentoAplicado =0; this.elementos = false;
      this.tresMeses = 0, this.seisMeses = 0; this.doceMeses =0;
      this.tempDataPaquetes = []; complementosAdd =[]
    }else{
      this.subtotal = 0
      this.tempdataCotizacionmuestra.forEach(tempcoti => {
      let guardaDataOnly ={}
      if (tempcoti.tipo === 'paquete') {
        guardaDataOnly ={
          idReferencia :tempcoti.idReferencia,
          tipo: tempcoti.tipo,
        } 
      }else{
        if (tempcoti.tipo === 'mo') {
          if (tempcoti.Horas && tempcoti.costo) {
            guardaDataOnly ={
              idReferencia :tempcoti.idReferencia,
              tipo: tempcoti.tipo,
              Horas: tempcoti.Horas,
              costo: tempcoti.Horas * tempcoti.precio,
              precio: tempcoti.precio,
              personalizado: tempcoti.personalizado
            }
          }else{
            guardaDataOnly ={
              idReferencia :tempcoti.idReferencia,
              tipo: tempcoti.tipo,
              Horas: 1,
              costo: tempcoti.precio,
              precio: 1  * tempcoti.precio,
              personalizado: false
            }
          }
        }else{
          guardaDataOnly ={
            idReferencia :tempcoti.idReferencia,
            tipo: tempcoti.tipo,
          }
        }
      }    
        this.referenciasGuarda.push(guardaDataOnly)
         interno = Number(interno) + Number(tempcoti.precio)
         this.subtotal = Math.round(interno +  (this.inflacion * interno))
      })
      
      
      for (let index = 0; index < this.tempDataPaquetes.length; index++) {
        const element = this.tempDataPaquetes[index].idReferencia;
        this.getinfocompl(`paquetesComplementos/${element}`).then((val:any)=>{
          let complementos = this.crearArreglo2(val)
          // console.log(complementos);
          
          complementos.forEach(comple => {
            if (comple.tipo === 'mano obra') {
              this.getinfocompl(`manos_obra/${comple.IDreferencia}`).then((val:any)=>{
                const tempdata = {...val}
                tempdata.Horas = comple.cantidad
                tempdata.tipo = 'mo'
                complementosAdd.push(tempdata)
                this.tempDataPaquetes[index].elementos = complementosAdd
              })
            } else {
              this.getinfocompl(`refacciones/${comple.IDreferencia}`).then((val:any)=>{
                const tempdata = {...val}
                tempdata.cantidad = comple.cantidad
                tempdata.tipo = 'refaccion'
                complementosAdd.push(tempdata)
                this.tempDataPaquetes[index].elementos = complementosAdd
              })
            }
          });
        })
      }
      this.elementos = true
      if (!this.IVA && !this.Descuento) {
        this.descuentoAplicado = 0; this.ivaAplicado = 0;
        this.totalCotizacion = this.subtotal 
      }else{
        let newCantidad:number = this.subtotal
        if (this.IVA) {
          this.ivaAplicado = (Math.round(this.subtotal * .16))
          newCantidad = Math.round((this.subtotal + this.ivaAplicado)) 
        }
          this.totalCotizacion = await newCantidad
          this.tresMeses = this.totalCotizacion ;
          this.seisMeses = this.totalCotizacion ; 
          this.doceMeses =this.totalCotizacion ;
      }
    }
  }
  aplicarDescuento(){
      let descuento = Number($('#descuento').val()) 
      this.descuentoAplicado = descuento
      if (descuento >= this.totalCotizacion) {
      this.descuentoAplicado = 0
      $('#descuento').val(0)
      }else{
        let aplica = this.totalCotizacion - descuento
        this.totalCotizacion = aplica
      }
  }
  actualizaInfoMO(index:number){
    
    let precio = Number($('#idPaquete_'+this.tempdataCotizacionmuestra[index].idReferencia).val())
    let Horas = Number($('#idReferencia_'+this.tempdataCotizacionmuestra[index].idReferencia).val())
    this.tempdataCotizacionmuestra[index].precio = precio
    this.tempdataCotizacionmuestra[index].Horas = Horas
    this.tempdataCotizacionmuestra[index].costo = precio * Horas
    this.tempdataCotizacionmuestra[index].personalizado = true
    this.tempdataCotizacionmuestra[index].idReferencia = this.tempdataCotizacionmuestra[index].idReferencia
    this.obtenerTotalCotizacion()
  }
  preguntar(dir:string){
    if (this.tempdataCotizacionmuestra.length !==0) {
      Swal.fire({
        title: 'Salir de cotización?',
        text: "Si sale de esta página la cotización se penderá!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI, Salir!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl(dir)
        }
      })
    }else{
      this.router.navigateByUrl(dir)
    }
    
  }
  guardaraCotizacion(){
    // text: "Esta cotización puede convertirse en recepción futura verificar su información!",
    Swal.fire({
      title: 'Guardar cotización?',
      html:`
        <h2>Al guardar cotización se enviara un correo electronico al cliente</h2>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.getFechaHora()
        const tempData ={
          ...this.formCotizacion.value,
          elementos: [],
          fecha: this.fecha,
          hora:this.hora,
          aprobada:false,
          sucursal: this.sucursal,
          descuento: this.Descuento,
          IVA:this.IVA,
          CantidadDescuento: this.descuentoAplicado
        }
        tempData.elementos = this.referenciasGuarda
        if (this.tipoCotizacion==='new') {
            const newPostKey = push(child(ref(db), 'posts')).key
            tempData.aprobada = false
            
            set(ref(db, `cotizacionesRealizadas/${newPostKey}`), tempData )
            .then(() => {
              this.tempdataCotizacion=[]
              this.tempdataCotizacionmuestra =[]
              this.totalCotizacion =0
              this.referenciasGuarda = []
              this.ivaAplicado = 0
              this.descuentoAplicado = 0
              this.subtotal =0
              this.formCotizacion.reset()
              this.mensajeCorrecto('Cotización correcta')
            })
            .catch((error) => {
            })
        }else{
          get(child(dbRef, `recepcion/${this.tipoCotizacion}/cotizacion`)).then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val());
              tempData.aprobada = true
              console.log(tempData.aprobada);
              this.guardar('',true,tempData)
            } else {
             tempData.aprobada = false
             console.log(tempData.aprobada);
              this.guardar('',false,tempData)
            }
          }).catch((error) => {
            console.error(error);
          });
        }
      }
    }) 
  }
  guardar(ruta:string, aprobada:boolean,tempData:any){
    console.log(tempData);
    
    if (aprobada) {
      set(ref(db, `recepcion/${this.tipoCotizacion}/cotizacion`), aprobada )
      set(ref(db, `recepcionStatus/${this.dataRecepcion.cliente}/${this.dataRecepcion.vehiculo}/${this.tipoCotizacion}/status`), 'recibido' )
    }
    
    set(ref(db, `cotizacionesRealizadas/${this.tipoCotizacion}`), tempData )
    .then(() => {
      this.tempdataCotizacion=[]
      this.tempdataCotizacionmuestra =[]
      this.totalCotizacion =0
    const tempEmail ={
      from:'desarrollospeed03@gmail.com',
      email: this.dataCliente.correo,
      subject: 'Cotización lista SpeedPro',
      mensaje: `
      <div style="margin-top: 20px; box-shadow: 0px 10px 10px black;">
        <div style="width: 100%; height:50%; margin: auto 0;padding:1.5em 1.5em; ">
            <div style=" background-color: #F0F5F8;display:flex; justify-content: center;align-items: center;text-align: center;">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/speedpro-3a4e1.appspot.com/o/logos%2FlogoSpeedBig.png?alt=media&token=bebffe87-3000-4317-b322-67adef4a971b"
                alt="" class=" img-thumbnail" style="width: 100%; height:300px;">
            </div>
          <br><br>
          <div style="text-align:start">
            <h2 style="text-transform: uppercase; font-size: 2.3em; background-color: #0B70AE; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
            Cotización <strong>SpeedPro</strong></h2>
          </div>
          <div style=" text-align: justify">
              <p style="font-size: 2em; background-color: #962F91; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
              Notificación de cotización vehículo
              </p>
            <!-- <p>SpeedPro tiene una comunidad que se alegra de tenerte con nosotros!!</p> -->
      
            <p style="font-size: 1.5em; background-color: lavender; color:black;margin: 0;padding: 1em 1em;">
              Estimado ${this.dataCliente.fullname} la nueva cotización del vehiculo  ${this.dataVehiculo.marca}, ${this.dataVehiculo.categoria} con placas ${this.dataVehiculo.placas}, modelo  ${this.dataVehiculo.modelo}, color  ${this.dataVehiculo.color}  cuenta con cotización SpeedPro el día ${this.fecha} ${this.hora}.
            </p>
            <p style="text-align:center">Para más información, sigue el enlace con el botón de abajo</p>
          </div>
      
          <div style="text-align: center">
              <a href="https://www.google.com/" target="_blank" style="text-decoration:none;background-color: #0d6efd; color:white; font-size:2em; border:2px; border-color:black; border-radius: 8px;margin: 0;padding: .5em 0.5em;" class="btn btn-primary">SpeedPro</a>
          </div>
        </div>
      </div>`
    }
      
      // this.router.navigateByUrl('/cotizacion')
    })
    .catch((error) => {
    })
  }
  guardaCatalogoCheck(guardar:boolean){
    this.guardaCatalogo = guardar
    console.log('guardar en catalogo:' + this.guardaCatalogo);
    
  }
  gurdaRepacion(){
    
    if(this.guardaCatalogo){
      if (this.repTipo) {
        if (this.formaNuevaReparacion.invalid) {
          return Object.values(this.formaNuevaReparacion.controls).forEach(control => {
            control.markAsTouched()
            Swal.fire('Error','LLenar todos los campos necesarios','error')
          })
        }else{
          const tempData ={
            ...this.formaNuevaReparacion.value,
            ingresado:true,
            status: true,
            descripcion:'Ingresado, tipo Refacción'
          }
          const tempDataSave={
            ...this.formaNuevaReparacion.value,
            tipo: 'refacciones',
            descripcion:'ninguna',
            status: true,
            precio: this.formaNuevaReparacion.controls['precio'].value
          }
          const newPostKey = push(child(ref(db), 'posts')).key
          this.addCotizacion(newPostKey,tempData,`temporal`)
          console.log(`refacciones/${newPostKey}`);
          
          set(ref(db, `refacciones/${newPostKey}`), tempDataSave )
          .then(() => {
              this.formaNuevaMO.reset()
              this.formaNuevaReparacion.reset()
            this.mensajeCorrecto('Se registro en catálogo')

          })
          .catch((error) => {
            this.mensajeIncorrecto(error)
          });
        }
      }else{
        if (this.formaNuevaMO.invalid) {
          return Object.values(this.formaNuevaMO.controls).forEach(control => {
            control.markAsTouched()
            this.mensajeIncorrecto('LLenar todos los campos necesarios')
          })
        }else{
          const tempData ={
            ...this.formaNuevaMO.value,
            ingresado:true,
            status: true,
            descripcion:'Ingresada temporalemente de tipo Mano de Obra'
          }
          const tempDataSave={
            ...this.formaNuevaMO.value,
            tipo: 'Mano de obra',
            descripcion:'ninguna',
            status: true,
            precio: this.formaNuevaMO.controls['precio'].value
          }
          const claveTemporal = push(child(ref(db), 'posts')).key
          this.addCotizacion(claveTemporal,tempData,`temporal`)
          set(ref(db, `manos_obra/${claveTemporal}`), tempDataSave )
          .then(() => {
            setTimeout(() => {
              this.formaNuevaMO.reset()
              this.formaNuevaReparacion.reset()
            }, 500)
            this.mensajeCorrecto('Se registro en catalogo')
          })
          .catch((error) => {
          });
        }
      }
    }else{
      if (this.repTipo) {
        if (this.formaNuevaReparacion.invalid) {
          return Object.values(this.formaNuevaReparacion.controls).forEach(control => {
            control.markAsTouched()
            this.mensajeIncorrecto('LLenar todos los campos necesarios')
          })
        }else{
          const tempData ={
            ...this.formaNuevaReparacion.value,
            ingresado:true,
            status: true,
            descripcion:'Ingresada temporalemente de tipo Refacción'
          }
          const claveTemporal = push(child(ref(db), 'posts')).key
          this.addCotizacion(claveTemporal,tempData,`temporal`)
        }
      }else{
        if (this.formaNuevaMO.invalid) {
          return Object.values(this.formaNuevaMO.controls).forEach(control => {
            control.markAsTouched()
            this.mensajeIncorrecto('LLenar todos los campos necesarios')
          })
        }else{
          const tempData ={
            ...this.formaNuevaMO.value,
            ingresado:true,
            status: true,
            descripcion:'Ingresada temporalemente de tipo Mano de Obra'
          }
          const claveTemporal = push(child(ref(db), 'posts')).key
          this.addCotizacion(claveTemporal,tempData,`temporal`)
        }
      }
      setTimeout(() => {
        this.formaNuevaMO.reset()
        this.formaNuevaReparacion.reset()
      }, 500);
    }  
  }
  obtenerSubtota(){
    let costo:number = this.formaNuevaReparacion.controls['precio'].value
    let cantidad:number = this.formaNuevaReparacion.controls['cantidad'].value
    let subtotal:number = costo * cantidad
    this.formaNuevaReparacion.controls['subtotal'].setValue(subtotal)
  }
  obtenerSubtotaMO(){
    let costo:number = this.formaNuevaMO.controls['precio'].value
    let horas:number = this.formaNuevaMO.controls['horas'].value
    let subtotal:number = costo * horas
    this.formaNuevaMO.controls['subtotal'].setValue(subtotal)
  }
  tipoReparacion(tipo:boolean){
    this.repTipo = tipo
  }
  exportarExel(){
   
    let name = 'cotizacion.xlsx'
    let element = document.getElementById('season-tble');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');
  
    XLSX.writeFile(book, name);

  }
  getFechaHora(){
    let date: Date = new Date()
    this.fecha=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    this.hora=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
  }
  newPagination(tabla:string){
    setTimeout(() => {
      if (tabla==='paquetes') {
        this.dataSourcePaquetes.paginator = this.paginatorPaquetes
        this.dataSourcePaquetes.sort = this.sortPaquetes;
      }
      if (tabla==='mo') {
        this.dataSourceMO.paginator = this.paginatorMO
        this.dataSourceMO.sort = this.sortMO;
      }
      if (tabla==='refacciones') {
        this.dataSourceRefacciones.paginator = this.paginatorRefacciones
        this.dataSourceRefacciones.sort = this.sortRefacciones;
      }
     }, 1000)
  }
  applyFilter(event: Event,tabla:string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (tabla==='paquetes') {
      this.dataSourcePaquetes.filter = filterValue.trim().toLowerCase();
      if (this.dataSourcePaquetes.paginator) {
        this.dataSourcePaquetes.paginator.firstPage()
      }
    }
    if (tabla==='mo') {
      this.dataSourceMO.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceMO.paginator) {
        this.dataSourceMO.paginator.firstPage()
      }
    }
    if (tabla==='refacciones') {
      this.dataSourceRefacciones.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceRefacciones.paginator) {
        this.dataSourceRefacciones.paginator.firstPage()
      }
    }
  }
  mensajeCorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: mensaje
    })
  }
  mensajeIncorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: mensaje
    })
  }
  //arreglos
  crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }
  ordernarPorCampo(arreglo:any,campo:string){
    arreglo.sort(function (a, b) {
      if (a[campo] > b[campo]) {
        return 1;
      }
      if (a[campo] < b[campo]) {
        return -1;
      }
      return 0;
    })
    return arreglo
  }
  async PDF() {
    let letras =document.querySelector("#obtenerCantidad").innerHTML
    function buildTableBody(data, columns, showHeaders, headers) {
      var body = [];
      if(showHeaders) {
        body.push(headers);
      }
      data.forEach(function(row) {
          var dataRow = [];
          var i = 0;
    
          columns.forEach(function(column) {
              dataRow.push({text: Object(row, column), alignment: headers[i].alignmentChild,style:'content' });
              i++;
          })
          body.push(dataRow);
         
      })
      return body;
    }
    function Object(o, s) {
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in o) {
              o = o[k];
          } else {
              return;
          }
      }
      return o;
    }
    function table(data, columns, witdhsDef, showHeaders, headers, layoutDef) {
      return {
          table: {
              headerRows: 1,
              widths: witdhsDef,
              body: buildTableBody(data, columns, showHeaders, headers)
          },
          layout: layoutDef
      };
    }
    let nueva = ''
    await this.getBase64ImageFromURL('../../../assets/logoSpeedPro/Logo-Speedpro.png').then((val:any)=>{
      nueva = val
    })
    let nota = this.formCotizacion.controls['nota'].value

  
    const documentDefinition = {
      footer: function(currentPage, pageCount) {
        return [
          {
            columns: [
              {
                width: '80%',
                text: ` `,
              },            
              {
                width: '20%',
                text: `página ${currentPage.toString()}  de  ${pageCount}`,
              }            
            ]
          }          
        ]
       },
      header: function(currentPage, pageCount, pageSize) {
    
        return [
          {
            columns: [
              {
                width: '100%',
                text: ` `,
              }            
            ]
          }          
        ]
      },
      content: [
        {
          layout: 'noBorders',
          table: {
            headerRows: 0,
            widths: [ '*','*' ],
            body: [
              [ { text: 'Operadora de Servicios Automotrices integrales del Centro del pais Speed Service GAFEAG SA De CV', 
              bold: true, alignment: 'center', style:'operadora' },
              {
                //image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdIAAADDCAYAAAA2nZC8AAAAAXNSR0IArs4c6QAAIABJREFUeF7tfQt4XcV17pojYdlgsGxCMFCCTZymCQZEgDZPsBtCkt6A7TYkNA+Qbx4lT+sBiJKAJdIQG1uSTW+S3raJDAWaNm1sA725EBrJGJLej1ALAtz0QmLZYENCQMcBY8vW2XO/tXXmeM4++zF7ZvY+ex+t/X3+MD7z/Gf2/metWQ8G9BAChAAhQAgQAoSANgJMuyZVJAQIAUKAECAECAEgIqVNQAgQAoQAIUAIGCBARGoAHlUlBAgBQoAQIASISGkPEAKEACFACBACBggQkRqAR1UJAUKAECAECAEiUtoDhAAhQAgQAoSAAQJEpAbgUVVCgBAgBAgBQoCIlPYAIUAIEAKEACFggAARqQF4VJUQIAQIAUKAECAipT1ACBAChAAhQAgYIEBEagAeVSUECAFzBK6++rolcVtZv37NSNw6VJ4QSAoBItKkkKV2CYFpiMA1Hde08eamVnCcNoBCK0LAOb+wAgWD2KSpCGMROIyKsoyxbW7fzBllrFBkk6Xiug3rKr8rtknFCAElBIhIlWCiQoQAISAQQAmSc6eV8UIbB342cGgFBm0A4BJnxp8pwmUwxoDtQqItlPgYkWzGVy3jwyMizfgC0fAIgXoh0NFx3YKmJqetQpgMFgB3CbNRnzEAGGXAHkOCLZUKoxs2rMF/o4cQCEWAiJQ2CCFACLgIuHeVDixxVbH2JMwqlWsFagZFJKwg6KvUwXIhJHNw/6T1uONHVfEUuR4a2bBhQzGtzqmffCBARJqPdaJREgJWEejo6GhtapqxhHN2IcN7y3iS5hhwGAOZDAtQMf6ZnDw4mhbZVO5kEZ3yvawDfA7D+RSgNea81DBmMMo5jDDGtxGxqkHW6KWISBt9hWl+hEAZgYrEyfgyBYJxJTHOYLQAbB8UYCSvBjt4aGhuntlWda9rU00tEWt//y1baMNNPwSISKffmtOMpwkCSCCFwszlDFyr2eWBxkAMRl31JbBdSJhpSpT1Xgo8XDgOLCgALLCo0t7CgW11HBihO9Z6r3A6/RORpoMz9UIIpIIAGgg1F5zlHJggT2+/ZYMavg0KhVHyx6xdFlQXlwpNbQD8bA21d3WDDEYZ57dNOoUtRKqpvAJ16YSItC6wU6eEgD0EKpIn51eC10+zrHYEYI9lTUK6uuu6Xg58FSLBgG1cP7Cm1x4qdlvyGGLp+cISqdpdlAy1RkSaocWgoRACcRDo7r52OXB2ZVltK6qiRSmqFrdljTjlubm+qA4flv+NFdjSPEjIhoZaU1N2Dzhso+Mc3JKWYVacvUVl4yFARBoPLypNCNQVgSm1Y+FKBtBeufN0JR22lTmlLXkJLFCWRldXESmwvixLpUELj+r0QgGWMODLPIca1b2yCRjfSoZKqnBlrxwRafbWhEZECNQg0NV1XTtjfJVkbVs2aMmnRNNIROpdrLKmQJBqnGhPGG3ptkkHNtF9ar4+AkSk+VovGu00QmBK0uGrJOkz1+RZpdqduh9tCIk0bEsakOoWVmAb86DqnkavZOBUiUhpFxACGUOgfH+Id5+ovm0Y8pyORCrPWSJVXFfVZ4wD66O7VFW46lOOiLQ+uFOvhEANAi6BlvhqjMjT6C4TjazajdraFSvralV9VDUMqbhx0jm4gYyToqBK/3ci0vQxpx4JgSoEpPvP0YLjbMyLwZDJMk5nIpVx81Hfq8C6qeSwPrpHVYEqnTJEpOngTL0QAjUIuAQKfBlGwRkYWLNpOkFERFq72j4GZVFbggg1CqGUficiTQlo6oYQEAgI5/48uavYXj0i0mBEPXfkKtAToaqglGAZItIEwaWmCQFCwB8BItLonaGh9iVCjYY1kRJEpInASo0SAoRAGAJEpOr7w81eU5jZUQ6nGOmXyoD1kVGSOr42ShKR2kCR2iAECIFYCBCRxoKrUrh8r47+t1HJzYsMeN/6gVs26PVEteIgQEQaBy0qSwgQAlYQICI1gzEGoY6xAltJgR3M8I6qTUQahRD9TggQAtYRICK1A+nVXdd2cGAooYarfDmMlDhbSS4zdnD3tkJEmgyu1CohQAiEIEBEam97xLlDpftTe7jLLRGRJoMrtUoIEAJEpKnugamISS2rGUBHRMek7rW8MkSklgGl5ggBQiAaAZJIozHSLYFuM00FPqiQ0m1LyZlYSSEHdZE+Uo+I1BxDaoEQIARiIkBEGhMwjeJuYAfOB6XUe36tFIHxlZQLVQNgqQoRqRl+VJsQIAQ0ECAi1QBNs4qiQRJJp5r4YrVcECnnfAkA4J/TFPynDOAwrjrKGOtUbYVzvhwAVqmWz1C5UQDYBQAjjDH8eyYfzjn62rWV/5wdadmY7iyKANCXJH6cc7TkxPcGMcjU/HfvfnbBv3x/84K9e/dWUEdDmPUDa3rlZXAlqqnxZ/0ZA4DHsvpO4P1pU6EFsQxL4UbSqeYuyySRlj8ASDIiy7zm9NKvtnXrvbB920MjBe50hmXxKM9xPP0RWu8RPyBbAGAjYwz/XtenTJ64dzCfZ6Y/wE888RRsGrp9jAHfaMtxPk/zH395HL7+9bWBRMo5R6MZ/Pjn7cFDEiYhyMQ7IYNXjuM7FCGQkHQac8dlikjLHwGU0PDU5PpFTe7aDQe3bYfDjz0Ohx573J0e/n+WnubTToNTnnnSHdL99z8A99/3AP61WHCcpUFkWpayh58/752VeWVpTt6xFFrnwIyzz3L/eeaF74Gjzj4Ljr70Q1XFXnnl1S1btty99YorPp56JpMynrh3kEQr+2Tiwe1waPRxcPbtA6e4LxNYn/Szn7hYykTiJ43F2Q/l+Ytk4G5VfF+m3p2fw+SuXZmZ/wn/+r3K3rm6+7owIt18cNv25b++6INxoEitbNbfiSAgJHcZ9D8NesiyN8ZOygSRlqUzPH3ih7AVyXP/7XfAq7fd6X4Asv7M7V8Lx335C+4wv/2tv4Vf/vJXYshb+gfWrvAbP+ccVVirdx01O+vTCxwffkiOvvQSOPbLn6+Q7IEDB2H79ofH7r///s40DBjKhy88YaMK0yWO/bffCa/dfY9LHFl78BBy4gM/dIf1s0cehe997/uVIZaciblxLSjL869YaCJ5vnLrtzI7f/nQ6Z0/B7ZSTie3f//+nZN/P7RgvLsna8sYOp7ZV3yiru+EKljXdFzT5jQVhsKMkUwPeKpjyXu5uhNp+STtqhqQQPfddDO8evsducEVyeSUp58C/C8SKBKp/PQPrPXF+IUXXhie84v/tySrp+24C4AfDzxQIA6CJO6953+N7Hvl5RVxyUG1b3EYwfKv3n6nu3eyfvBCEkUyxefmr6+Fl18+ot1nBbY0Tii38vzdwyceIPZ97ebMaWu8a3n8d/4nzL7i477zl4kUXTgGB7+xE0n0d7d+U3VLZKocamzmDtwCzae9wR0XqvL/5Z//NdF3QgcAP8OvqnbcqEgTib3HOmPOWp26EmnZkKADJQd8YfJEoGIhW2+8HubccL37v5uG/gGeeGJKxSueICJ99tnnxlt/PNL60qf+Imt7Qns8SKL4oRQq3717n8eDRXFi//5AFbdOZ2UpbDPegSKB4N4Ran+d9tKqEyaN4hhUibSswcH5L8F54/yzdt3hh6ksjfodOmUi3b177/JTTz1pMx408zC3oD2U1jthuodd6bRQwD0VFAy/yApsRZyDnumY8lS/LkRa/hAM44fwtbvvBSSTLKrhohZSlka9hhNuXQ4j/YNrl3rbwTuKwcHBcZQgijfdHNVN7n6XpY6yQQ141Xa6kyprMPCFb82btBImjSIeKqpdzjkaUOG705q3/SPvC88ViLsdSg5bKGLBPv30L3sXLTo911cf8h6X5y4OEbbeCd13ye+7FBUZiVS9/minTqQyiebtQ+iFUJZG/+l734dHHnm0qkjQi/L0008vWbRo0XDeT9thL7D84agYYDG+wuTelHOORmhDeOhC7PIghQqMwu4Gy2U29Q+sXRmGqThEOMV9rS9++PJcSWpR0qj30Plf//X05tNbZizfs+ittnii7u3I78T2Bx+GrVvvATB8J5KYVHf3tcuBM7xuCwqET1a9HuBTJVJBok5xXxtKoSiN5vWJlEYBxvoH1i70m98j/+eR3vP+8LzVz55wSi4lcdU1kyWwgf5bYe/evaGWzBEk4pIokieSaN40GGF3g15pzA8HYeWN83/pU1fl6hCB84mSRr1q7Vdf3b+j6WePtjWKDYFYU/mdKEvl2u+E6nuoU84NM8j4ELApI76ah8FooeSsDHPx0+k3r3VSI1KZRPMmTfgtrq40im0999xzQycdM7sdibSRH5RC0NWjyhCLwWh//9pz4sxbJpE8kqgsjQlVt2f+odKoUOceeuzx1jzOH9f/1Bf3uFP2uxv1uwJ57bUD/ND6gYa7+pDfCbQhGOjfiGFxRkuliaVJGeXFede8ZSMMkejetAxYmkSK9zqulWqejQfERjvlmadcazzfu9EQaRTrv/LKq8PNj/5nw1jshr2o8oFD3IvFuWcpGxbtyCuJqEhjBcc5J8TfGNVrO1Gdu+dNb82dJI7z99sD8p7xSqPf/utvL7nqi1cNv/hnl+daaxX0XvgdwuO8EybEqFO3HMTBtUvw1ZZ43JZ0+sh7nVSIVLgpoEoqj5a53kVGV4/jv/M37j/HuRsV7bz80su86Y67XGvLRn+C3INkw5IwDDjnO/AqAANXZN21xW8ece8GvW1wzoed4j730JWnO2ExD3n9KxKYPEkfg7wdOx5vb2s7cygvwUrivsOm70Tc/myUd1W9TXxziM9p5B2/jXFktY3EibSsltqBfn6N4uohpFEMPnDDV6tCg+I6B96N4o9oZn7L4C07GuVQobKxA+4HI188cQDLs2QS926wimPKIfLyvFeirkD8XH5eeuml3nnz5jWMxa7fOyIHcZH8iSPfCZX3LakyCvF6N5Wcic4sqqiTwkS0mwaR7pjctbvt+fPekUu1VJg0KoUDrBSLMmlvFP+4OBsT/UoxLJxHgi+WnImFQS9dWaW7E53x8yq5m0ijQqX92t33tuJBIo+PrkEeBiuZ+8Kvl6BE2qgPhohE+wF83PjcDz7k/l3FBaremJSzyfjHQM7wfW+SuCVKpMJdIc8ShRd8WRrFk+SBAwfkIqHkgAUbzT9OdXOedvhVt6gcFi7s0CFUmnm9F8S5xr0b9Eij6ObT3ijzj3MF0ojBSvzeEzTAwsOGbIDGgHfaSmCg+m7qlAu9N52GZJo0ke48uG37gkYxYZfvRv2kURWDgb179m4+4fDhhvKPU3kRhdm/557MNxaxsNLNs0ozKnRkULAOxFJI43kLuCDvA11ptNGDlcgYiXfCY7AYGJ9b5T1Ls0xErN5MuvUkhU9iRCqk0Uax0sUFMJVGsY3f/va3O2c9/NMFeVXX6W7EgIwfxf6BtXO9bXLON0/u2p3rw4bO3aDAgXOee2lU1yDvhz/80ZIPfOCihg5WItZZvieVs+AEhRXVffeSrOfemza1DAcYIU0bMk2SSIcPPfa4lXsOfClnLfsQFOZMBUSv1yOCjetKozhuU/84xOKYctDvNHDATCo2LK1lYpE/Gl7XDyGN2Yh6hVKRu3c86d7SwA3vwLD/uO5RZX9rvBt2QyCaPHmc/1NP/aLjLW958+CeRWdoW2mL7Dom2IXVPXD3vVYC6Qe9E6oxl5OaX9x2I4yQpgWZJkKk4mNoqprDjxG6mYg8mHEXOIny5UDsse9GcSw2/OPkyChJzM+vTRvRhFQ/GiKZs2nUJ282mrSw8vbjl8gg4m7YjeBkQiQ4BjTwQothkY0nL/M3DVYiG3glOWfb70Q58pc75CiDxSTnZdJ2V1fPIAPAdJjep+HJNCkidT8GJh9DJE8kDfEhwIgoaKgip50yWXTdulKu0UoTKnejWNiGf5xQLyOhb91yj+40lOudf/65cN7557oncBMJKZBIgfWtH1hT8SFCI6PX7r53iYnqW1Yr4kQxrqk3K48yAAYFx8fH/fZrqHsUqrUPPfb4chOLVe/88b1BgxaPYZzBzNSqBszfV50vWjQNViJn2EFr2L179qoNNkapxYvPgPdc8C43dZ+JS5/8Tsgp9VS/JzGGnFrRrq7r2hlwjNM7rcg0KSLFmKjtJh8DNA0XkqifxV9qO0OhI1WT9fHxfYOtrcd16CbzlkOt+amXFYaqVeTyyy+Dt71pEZiENAy6D/J+NDjn3EStK7sVoJ8vRlPau9f+x1QLSAVpA6dvotaVQ9Blcf5RJLFnz14++19+oH1ok8lJlvJ01yuo3rJll7hkqvsuY7uqh0vbY0+6velIpkkRKd7xaGe2j7KOTXojxGxf2YnaNJm3fNpO83DxxjeeDp/7/GeNPhpCJe0NYiF/WIW1romBmmzUlOSHNOYeEcWjpFHMBbnTxF0sKgCE5rhtVQt1D7ORzDvAqM3W+CvtiHfCJPqSvFay3UDUYcP6ZBJocLqRqXUiFS+Dyf2o/DLc8NW+1FVSMfZVpN+o3Japf9xxX/4CoGSHj18+xxjjjlX0PRe8G5Yt+5AVIvUGLZc/Gi+++FLH6143b9DklC/8VQOCw8eat/XCESmznn/++fb58+cb3Y8K30TfcHzWJxSvwai7PxvBSoQmyzc4frzhhpbGK4+PXn6ZlXfCu1aNQKQIXoivacPdmVon0jy9DAbvVREAMCefcjgsG/5xQepRg3koVUU11h/NORZMVPV+ARmwc/mjYepjK6t101R9R4LIYYQ1sb7169eMhJXNq+o/cv4MRgF4X1QuWhvBSoL2WeQYYxa4+P0XwR+/+ffBJF9q0KGvUYgUIXV9TQsFNxG9B+KGIlPrRGojTmbYy4CbbNI5uCFv8RxtJPMOcOBGM7+R/sG1S2N+C5SLP/PML/lJTz4FugZAYQQnm/qb+tjKVwI+EnvmUz7ZNLTxsRYucmCdAwNrNikvfMoFTZN5h+2zKGk47lRxrx7zxFPawWZk62LvoS8v0Y1UMQsj05LDztmwYc2YaltZLWedSFGqOP7FF7WtDsM3WLWFZ1ZB9RuXjWTeIWpL5XtaHcxMfV/lWLtegpOJ1LQf2XjDeyUQlqpMB5Mk6iRpaJMH30TTZN5hBynb88cMToVvfls7X6ps7+A99NgeaxJ7NW6bgWTaIOEErROpqVTRqBvMpn9c7Qk2uQOGDd/XIDN/fBlFFBcb/QQZNEVl5In7UUiivA1DmyDjFRnnJMZuq80kD1I2owUNDd3Z1t7+MaMMTmHvhKoXgC3c02qnkcnUOpGi+4JJjNCwQN82X4a0No/oJ0m1XZInWBu+ryoEZ6Mf4WPrY2iS+filNiyWA+IZJ676t/Eu5ekgZWOvhlgXh/rZ2sC6nm0EkmnC11NJz9kqkaKV1rp13zDKbB9imZrrDWaazDvMPy7JE6yNO+9AgpNeHlNDG3xRhOobAzBs3XokWEUejDdsGtp4LZY5wIaBgbWdSX9MTNq3QU5pHaRsvBOB1sU5JxSVPRDiGpPoFZXK2HTLWCXSv/u773R8+tP/fdDED9CbwxHvD9yILDneYDaSedfrBPvMM78aPvXVV4xiJqsQnE0fWzm/o/tiRLid6L48NuuZGtrk3XjFlJzCgpXYPkjZfCfktIK4n/Jw6LGx74PINK+GVlaJ9L77ftR78cUXrTYhUlwk2c0Dg36/PD4OLS0txd/7vVNGbSyi1AZai+0q/z+6JowxxqxbkCXqEpTwAcPmnXdNEAmJ4H7725fGW/7th626IddkTQb65cnh8ObPnz96zDFHo8uSzQfb28YY22CjUVNDG9mgK4X54ztyG2Ms1J0nDi6mybxDg5VYPkjZfCe8hz7b1sVx1iCoLLruNRdmtHNgF3JgW21ZfgeRaRYxiMLRKpHedef3Nv/5xz663JRIcdCoyjz2S1+oR9BtJGv8QGy0Rao21XZpnmDxBbr55m+MH1o/oG2dGBZEQljSCh9bk9CA8uEratPb/H14eNvov937w9GSw/pMzPhtGtrYnF9YW+vWDY785oXfbJNjJev2nWSwEtsW26ZrlaZ1se56iHp+adJsSvgBge5z52NqlUi7O3uG1w+scQOOv3b3vaZr6JJokplfMC3bjLazgM2ZA3ii9fb1yiuvbrn/h/fd9uGPfniLyWSSDDSQ5OnNhgFIWBAJYTxmw8dWpC0zWac4dUWqLsmwSfvlt4EzqnabF7whzhS0yiLONdG1GIz29689R6tBAEg6WIlNI0WRL9XkGxfmpmVzrLrrEUai7m+G6+0dV3dXDwa5x0Qn8jNWcibOyUu8gESI1MRq13TxTeojcR996SUw58brofm0Ix+lhx/+ydgPfnBPn65KA9V27N9/3KYb0EDVD9Nk7n51H3roJx3vetc7Bk3iiaoEkbDhY2t77mHtBd7HaarZbRjapDX/IA2DyYHORjLvtCyWxTthkuYu0IrdMkGZ7InQhN2a+zxsPCiEAYMlVWUS6McEk7C61om06+pVS4574MdG6YWSmmycdpG85g7cUiFUvHf627/5+5F9r7y2Mq4Kz1QVVK8TrE1LWp/YtxULPVMf2zjraqNs2H2cjkTBOcc0cqtNYgzbmJdKG4EaBoOPno1k3mkFK7HxToh4yFl10wolUVci5Suiwj2q7CW5TFCfeTG+skukXT2bL7/8suVtrz/BKAZl3EVIqjxKHnNuuB7wFI4PGj7ddtsdxWef26scas2G2k7FD9M2BpxzjI2547W7712gK0mrWlKaGtrYnntUe2GuSDpEampoEzVem78nIfkhOR0HvEM3TV+aFsum1uWq74TNNYvTVhSJmmgeosbh9l1o2emNy5tkn1FjUv3dKpFe3XVd73nnv201ZkUwUQeqDj6tcrJxAEqmGObu4IHXOtcP3BJpsWlDbafih2kbC87d5LxuTtlDjz2u1byskg4Lg2Yabk1rcAaVbEcQMjW0MZhK7KpJSH6mwUpU91nsyfpUMLUuT9O6OO5860miYqwBARu07Q/iYqBb3iqRojnz0bNmDn3tr1bD7279pnZyXt3JJFnPS6YD/RtBxefJhtpOxQ/TxtzLUuhyAFgFAG0mqfBwPDLheGPfiiASNnxsbcw9ThvCmb4mVZmGetOGoU2csZuUTSoOts0Ywzd/fS28/PJ4ZZo2g5XYWCv5jtmbL7fksIVxr41M1lOumwUSFePxdYvJeExeq0RaPk3suPzyy+Btb1oEe970VnCK+2ytdd3bkVV6It5tlNrBVG0nn2CDAg1wzpH8UIL0pirSwgzXDF1RXr39Dq36olJYbkyhArXhY2s0SI3KQdmJdO5zbFgsa0xBq0oSkp+NGMNpBSuxsVa2tRlaC+mplCUSFUND7SYHvtoz1MxGPrJKpDjp7q6e8Xnz5rZe/5WehpNKcX5CGsG/l0+/oWoHU7Wdih8m5xzvFRaYvFRInqjCxT+v3PotmNwl4lTotSpL8DWBGCTJzTSijd7o9GuFpoQDrqTul3sXhjZ4P5j1Q2cSgdZtxBhOK9yeDevyJO6Y9XfzlOtRU1PLMHBo82snSlAw6TuqbndXz2YAQCHhyJOAoVPUOFR+T4JI3bs1lErPO//chrorRUDlD2klOEKA2boNVVCUHybnHP2vhmwEwVDZMKplZAMpPHDIkYZkh24b4dZUx2SjnG1XpDxZLCch+SUZrMRm4ADcOzbWKok7Zt19nWUSxTmVjY92eISEYhZzmFonUgxczx0+PGvWLECp9Kjf/AaeP+8dmT9tx9mMsnpG3Mn4ndxsqIIC/TDL5I3S6MFt27UTDMeZt2pZWR3tjcSEbciRZkzDramOyVY5265IpoY2tual0k4SRm+mMYbDrj5sS1Oma2Vbm6GyZkFlsk6iYty+xkcatggmWKnUtU6k2Gl3V4+ranzjG0+Hz33+s666ECWmrKuuVADDMgEv71j/wNqFchs2/ONCfM42re9fsy2L0qj44B44cBAGBzZWGX94c4Oapt1TXTNb5Wy7IplmBbI1L5V2kjB6M3V9SjPcnula2dZmqKyZX5m8kKgYu5/xkW1tgy6Wol4iRCpP/PzzzwV0h0EyffHP/tz47s10wrbqC7KQLTe9J2BTVVCUz9m6/m9cmTVp1M8gS8ZcfgFsRLSxtZ6q7diUyvJksZyU5JeXYCU2jKKSuGNW3beiXN5IVIzbL4yg7RjKcbGs/q6Z1A6pK4d8EmSKEilm97ARhzehYSs362t951E5mKqC5I+X1w/zw5et2PT2t/9Re5buRmXVFQavGBi4tepuFMGVTfxthFtTXjALBaMONnGDt+fJYlnF6C0uxENDd7a1t39sh0nc2qirj7hjCipvY61C7phrtFm2xi23k1cSxTn4jj1DIRUTkUhx4l7d9uLFZ7iS6axZM+Hgtu2A8Xjxv3l9glRKst+aqSooLILOX15/zdgxTzyVmbtRJJmTfvbTSkhFDFqBIdA8T5X5uo1wa2nuH9vO9HmyWI4yetNZBxvBStIKt2fDKMqmNiMu3nkmUTFXv/vSrKh4EyNSnLxXtz1v3lyXTPHuFB9U9+6//U6XUHWj58TdULbKB31UhXrXhiooyOdM3D2bBkywhQWSKEoGIntOjb9ruSOvw7mpxG5r/Krt2JbKTLMCqY7bRrkkJD/Tg4RtDUEYTqZGUdh2EnfMqmvb3d2zI4suLqrjF+Wu7rq2gwMblOtlQcWbKJHiZP1020gEF7//ogqhClCEhOrs2weHNcPSRS3M5NhueO3ue4wNn4JeYuGUb0MVFORzhgZcpzU3Zyaesayy8rPSxTXxOzmaRrTBwwz+SetpueBIf1d3X1fVrU6MXVOLZTy4HL3sQ6lMH2NO4xOWfCDuQGwGKwlLGh93XH7lTY2ikrpjVpmb8KTwKxvLsnlBbytMFNrh+RsjQ6OqjEu3TI1/aQZUvIkTaRCZ4r+jhPqe97wb3rjodDj55JN0cY1db3LXbsB7GVMpWJwwRZQjdyDle1IbqiA/n7Nr83fJAAAgAElEQVQsSaNeSbQmZN6RlanJLWhDYq9XMu+aw4KmOb5NQ5vYL4FmhZqYycD64t4Ni65NDxJphtszXasw6+KkJaogIo1FovN7MeDLapgJnTDWW9TcPlaq+QW3r7eKNxUiRfT8RHIvqkLli8Sa1DNv7lw3UASS6Z5FbzXqxpdIy6cjU7VdkM9ZVqRRjLt6wr/+Y0Wdi/eh+JGVAy8IcP0+FLZ9bB/52aNGa6laGY2oHnmkpq/YoctsJIiWNQF4mEv6eeLnT8HevXurumEFtnT9+jUjcfu2EawkrXB7IoOTyVVKEnfMcTD3qnZjkugSgMJqmOmsqDeJijl3d1+7HDjDyEfiqWughtSI1CXTqWANGPnIKJxdnA3kV9aGVBd2P4NqPlNVkJ/PmY1xm2KH9XFs+BFDDPAJUufib0GB/YXEbhIaL8TQxMY0ldtQSV7gbUwY2pgkiA4Mjac8cvOCukHhbbg+pRVuz4ZRVBJ3zHFWDw8uzYUZ7QCF1kkHNikHxz/ppg5w+JUwiy/NComKeXd19QwygA4Jhy39A2tXxMHFVtlUiRQHPbWgMzt8AhLbmpNSO1/7q144tH4AijfdrFTeWyjszgOJ1FQV5Odz1r7yCviDY2cbS9JaEwYAlELnDqx1iVQ8QYZF5d8DJTVT442wg4zu/HTr6ajmbFgsBwXP152HRj1ttw0bwUrSCrdnahSFuKZlXayxhv5V8D70IAwCZ8thFl+YNRIVXNJUaKkKIairITHFLXUiFQOWCPXKekio6/vXuC44ukQaFqVk0cIFS6/64lXDJv5xXp8zvE/GkIsm6iXdzYIEOvvKj7tJzsWDKs6hoX+oUfVVCkTcG5pK7KGuKLoT1aundQo2TRAdFm5ObxoatQwCiJseJNIMt2caDzqp9HMaK6ZWBUn0ABt2v8vNfCns6R1Vq5h+KZ/7X+3Dncno60ak8qDRP4gXmpZzzi8E5mYhsJIOLAgYjAOMOVNNiC4sSsknPvnxlW1tZw6ZJMX2+pzVIzUdHhZmLbsEZl/x8QqUGPZv+/aH4P77Qu7kFHIHmkrsYa4oJi9EnLpooe04E30bNmyIbXxhmiA67CAXZw6aZYscWOfAwJpNmvXB1PUpzXB7pkZRYYFV6iVBBa7bKb1tMOmSKGSdRMUcvFa89TA8ygSR+i2qS67NTYkQ6tv/8Pwr/+yyPzWKChQYc5XDyPoBNwbu6l1Hzdb9ztT4nJlK0FEDwRM+qkvxpT/q7LNg5gXvqdyBYl1BoNsffNjXoEhqP9LwxkZEmzDjDfw4Rc3X9PfJyYOjOgSK/dqwWA47yCU5fzZZKq7bsM5YQjF1fUor3J4No6iwwCr1TOZd8w7Mv6kdgA8Bh2JeSHTqfepobSq0YHx3wRfFkjOxUPf91Pk2ZJZIdSajWseGa0pYlJJrejph7gu/XoISqc7jd/+Kd7oYFSrtB11atj/4kOs/6GeRK49H9SSYqPGGpitKmrjasFiud7g5E7xsHCTEQRbH4fHptaras2FdHWJdXOwfWDvXBEtrdef3DgGw9ryRqJi/T2D7yAO9Nexco8pp+IyOPj58RuucJbruL7KhC0poW7feU0ERyWRV5xdXtf54pBXjCus8fj5nGK/40mWXJEqmeO/58vg47N3zvBveD/9EkWd5fkVWYCtU3SASNt5I9QXSWV8bFstpJbPWmV9UHZNk3l7fZVs+vUFjthEPWqxVjZ91Fg594j4Ur9RyJol610yO746/pSntT0si3b9//0544McL8I5U5wkzdEH/rP7+bwyZGDKF5bzUGW/CdTaVnInOOGoUU+ONNEPDJYGdaVYgHFM9w82ZYqJ7kPD6LiOJotV4UNJ403Fifc75oFPc14FuWrpPkHW1iIKm265xPXEfyqA17ySKWJRj8aIVr3i0DAF1cJ12RMo5Xw4Am02sX8MMXd79rnd1Lv/TSwZNsrIE+pzprHBSdTiMsCbWpyqFysN49tnnxl/3y1+1IkY6T6gVpGaAAJ1x6Nb59a9/s+O4//uLNt35hxFpLEd73QkY1tNxfcI7fHwvonyXbc6fc47+7jtevf1Obe2SbF3sdRXT8T82hP5IdbwP5XwQkETxKfAVsLd3i7X269SQ17c0LWOuaUWkZRIdOrhtu/ZHHPdHyP0UfOrTKzvf8pY3D5o42mcl0EDAu7CFFdhGHQLF9tAw4Itf/NL46+76nrbrEbYjMPKma0tTnaP7rXjmmV/yU57b4ya7133EHb13/jo+rbpj0K0X1/UJrzrQuEyQaE1cXWkgttafc47eA0NOcV/bnje9VTs2d9ihO62PfM06ndg7CIxJgQzYSnjhRm0LbN19kES9GsOjlNTnVom0fIKra9SigMXBMaG/6hKMr4sfMMyNqvuIj3hNAG8OI53dXxo76ZjZ7bqqoCwFGqjgg9In41snnUOb4qhw/fBFv6+rrvrMsCmRyh8oYRD18svj8LnPfzZxi92wfcMYCw2Xh+qnv/jiVTtMiVR2/8jS/AFglDEW6g4Ux/VJthdA3FGd6xOi0V2SmS0zR1d+6opO3fe6XA8ltGUA0I7fCPxWmMTkFodutHq/4au9VUPTSXRgNDc3yEJhMwBfcqSdxiFRMSev4VEaBxZrRCoMCIwWOuHKr95+J4x3X2tEovKL7XMy3tTbd8OC5kf/c4mutBF2/4qGTBz42cCT9bNljG0DcIpQKIzqSp5BS2mLSLH9egWtj9imo9d099w26RS2+IVhE/M3JVIcg3yXnvCrE6f50Wu6/3JrUBg64fqkcrUiW7vGGYCNspiJary7x4hE5SsInzCaVq2LI+eM96ElNzatJOg0HokKHKpiC6cgldok0uHJXbuX7L/9jsg1rUeBV2+7EyZ37TLuWja7v+GrfR5DB955/VeuG2y64y73JdR5wlRBttRWOuOyVefqrut6r/r8Z1af+PBPQdeqWR5LmqnEwjCQU6wN9N+KEZ98gxbYJFIcj4g6ZWt9dNtpwuhX5cAdIqm7332lqutTPdcVSVSkdNTFw3vQ8WbNAYDUDGHg5N7lUGJDlftQd1KNS6I4O2/Eo6SlUitEKqRRlVOmycasd11ZWvQL1I6LtW7dN4aRRH936ze1hptWRgutwVmoJIjUhkRmYTjWmggIEFCTkQJf8I9+5MPDZ804CnT9jK0N2mJDQQdA7+HPhuuTxWEn1hRe0Zzy9FPuvS7eY3/962ur+rJpFBU6ifl9qE9eXV2msUm0IpV29gwDgyk1dsJSqS0idaVRXb/MxHaz5YZlafTmr68FvJOTnrFVHas6Tz31pM02LHYz6XNmAU8k0ve9/72rL/rD80H3HtnCMKw3EWSA5g1SgUT6vve9d/jiiy8Ck8hX1idg2GDQAdDr4mGazNtwmKlVlw9WfsZRiWuXXP/QwhAw10tBeqYHieKEMfBHU4FjxCP3SVIqNSZSkkbLiwSs7y8+9xlYtOh0K6EBawyZADIfaEDlK4V5BBefsXhz+8pPgolls0pfaZYJinTlR6SnL1w4jHllTQ5cac5NpS/VlGamcWtVxlLvMlHSaNLSEUz5h6IqFy2PpYdvghd6V9YbnzT77+7qwbSd7W6fCUqlNoh0aHLX7vZGlkbxxTjpZz+F5tPe4MacHRzY6JVG3Sgan/vcpwZPb5mxXBeL8CwRvHP9wC0b0tyESfSFEtnMlpnDmDTARAWexNhM2lQNkCCcxjF2Mqr/de/STcaaRF2VlGY24tYmMXbbbcraCZ+7UUhUrTu/d4mb8Fr4h1YmN/1INE2p1IhIy+4uOxvpg+j3Uslqq4D8m67hQFz/OG9fucoSofn1EeqWru5V8LoXX2yIe8Kw3LR+H83urh5e79yymsvnW031AGgjmbfNcSfRlmzV76NVwi6Ts9bFJNwYZKHmmZ4kKmDA6yQp/3Uimj1TIkWH5XYTh+UkNrPNNuUXA2PPokWi9xG69zj+cX5jTCujhU18dNrq7uoZP//8c1s/evllDaHe9IuNLHDxC5CApvmLzzijDdXbjWCgp3oAtBG3Vme/pVVHjmKEmiu0o/DGqlZN7BBrzCIJNwadJxKtQcAbpCGJ+2ltIhXSqElM2VibpQ6F5Q+kN4KMNBz3hPPtv/72EtvJvKU+spMlwsI6iPyBX/lKD8z6+RNGEX4sDMe4ibDYyH5O9yKMGc7/2FdeAd2rAOOBW2ogPE3YxFwRxMM0mbel4SbSjDeEYdkFytuXfWl0fu+CsirXcx+KXU9vSVQGX5ZKk4hxbEKkDS2NyiSKp0uURPfu3et9MSruDar+cWFvcZ4zesT5OonII5jRBqXSvF8NBMZGZjDa37/2HC82aHCFH7/Fi88AlErzfhgNCZlZdQA0TeYdZ4+lWdZLooEhDBlf0d9/i714toH3oUSi3vX3SKXW85VqESnnHMNojef9AxD0simSKMhBp234xwVliUhEHZTml8bTl7yp0Xp14fHHG4diq+N0KnF/fVT/gU73qN7G4ER4V7p48VtzreJWPQCaJvOu5xoH9a1MorYDMIgk3L4DYyPwwo11DZWZxbWSA9rbNvjSJVLXyRf9AE1i1mYRbDnsXIgkikOv+kia+sfJ9yv33/8A3H/fAxV4bC96FnAXZunz5s2Fzq5V0DIxkUsy1U3pJlRNs2bNgq6uL8OcQiGX88e9pJImzEYy7yzsW3kMMYLpj5WciXNM41RX+hZJuP0A4TAKs/hSGOsNjXecNSzTGI/Hr9Sqmj02kZal0Z0mqYXSAC1uH0hkx3/nbwD/iw8GRPjeP37fT52LP9e8GJgazHYybzGHJB2J4+Jkq7y8qU8++WTo6v6yeygzDRJua3yq7YTFRoYQVZ4sleP8UTLP42FC9QD49NNPL1m0aNFwI/jO4uEJLfkxcQA+eOBGde4TTzzpu22sZeSRk3ATiaq+olXlZL9Sm99VHSJ1pdFGcabHlwLDm8254foK4Gi2ji+G1+KuXKBYcJyl6zasGxUVbPjHxTVY0dpFGaskGwDgfemlyy5xyQSvDHRDLKY9RZPYyPL8BZnOmjUzV3fGchYaEWPX7wCom8w77fWM6s8rhUYcuO35jMpJuIlEo5Yp8HePVGot3nEsIm0kaVQE+z72S1+o5DmMOlkCQA2J4orZ8I8TBis+6ZasqiC0d2ACFctSGWa0dzNSyGSCQcORUG0ED09g6JUm5auAq7uvq+pKJU2WnKUC579y5Sdh7ry5btYRNMLK+vzDXLbk+esk805y3eK0jYftoy+9BObceL0blEU83isYb5vWrmRC70PdiD2kzo2xoLJUWnKOWJXHaKKmaFwixWSwRkmrTQZrWle8ELOWfaiilhFtbn/wYcAXI0AKxWK+JIo/PPXULzpMk3kHhZhLNUuEKcAa9UWkH1EV7wzRkhcNcPBBItl/+53w2t33ZPI+XjU0XhA05fkPo+ERlsH5L1v2ITjv/HPdKkior9z6LRcHG9mLNJYotIrqAdA0WIntcau0h9L2rGWXuN8KkVQc66FRGWqsPLG2q5q0RqI1Sbg9IycSVVnKqjLyN0c2GI3dkFQhLpFmOlVaEBBHnX2We/cpnyaxLEp/27c/5CYLDnsp8E604DgrZHWu3Ndzzz03dMopp7SjBKX7CNUyEvrWrfdUmmk0i10/fLyJeLHMG994Olz8/ovc/4oHSWVy1244/NjjujBbryfWzSQ2snCHkQeXl/kfc8Un3PeqxmLZE9f0mWd+yTHjz8SD262vgc0GMR3cjLPPrNhKyG3jd+LBBx8OspsQRX3T58Ueo28SbiLR2DgGVOgWmWECXNTi9hOLSO+774GdF1/8XikxbNzu6l8eyfPJJ54E/PAFGQd4jpYjJT6xIszi7vbb7xj+5Cc/LmWd15+n954pzGBFv5fs1fQjUxwlqjsvuOBdLqGiyjOrj9d3MO5JN2z+eH+MEnqW5+9Vc8oHQJQAPvKxj+4QUnZW19BvXPidEN+LEG2VqBp64Faet28S7hoSLQLj58ALvWPK7VLBCgLy+2bDGEyZSIU4/J4L3u1+1NAoIusPRiN6eXwq1dnePc+7J8kIyVOeUpEB71MJFI+xU9G53uRjhwSPJ14vudtY5KyvkxhfEJmI39FVBon15FNOcv9p3ty5dScXcTB75JFHq2DWsQgsS6aYrcJV83qfrM4fpdHtDz5UPVzJYhnX9ehZM4eQSIXKPmt7EtdRBFzB78ae8vdCdZwYLcdxJvqMXVzwPhTj5dYEnZdGwqEIzXwp7OmtGDyqjpPKHUGgu6sHU6wtsBHpSJlIvRnHG3pBOIyUOFu5YcMapdMeEmlSeKgYrCTVdz3aLR/YNgsDpHqMwUafukYM7vybCkPAvSmwbIwqvTbkA6AnaHh6g0inpzFWYCvXr18zYtxd1H0odkAkagyzaEDal8YGncpEWrawrMpkbW1GWWmIwwhrYn1xXwpxsrE+jQTz51kfq8UGca81F2Z2SBkbLLaeSlPGL2b5JV8VJJ2mMgv9TqpCAzboIXyMA+sbGFizSR+mcs3AJNyelolEjaGWG6jiNMPwjcpEigOQQyxZnVF9G8MIIFtYgd0Wl0DFsKNUktrTM1xc7X4zUhF9vgoFvopNJeb1VXdmZKhVw4h7Pxo0B+lAkStC9TOQk918srhmMca0BRi/zVrM3MAk3ESiMdZEu6jkCmOUXi0WkZYZHO9wlmuPPAsVGYxylD4Z32brhbB9yLBmPp8FvC2MoXx/uAwA0KgrswZvNu5b/OCqzJ9BW5bVvkHzd78dTS3DWR57wDbF650RDmyb4xzcYnwHKndycu9yKLGh0PtQLE+SqIUviH8TkrbEKMNWLCIVQ8F7nFKhqa2Q4Q+aDBtnzihjhSKbLBWDXFhsrNSUBAVLTHBxAMYcB0ZU72dtjDuPbeALgON2HFhggretuae9bnmdP347eIEtAShkUsOA61gogGsboauhUtpT8/vcCHGRZYlEIyEyLVC5mjPQAGoRqenAqT4hQAgQAtMSgdAk3H6IsJXwwo3m97DTEmy1SQujIxNtEhGpGtZUihAgBAgBMwRCk3ATiZqBq19bir+rbSRIRKqPP9UkBAgBQkANgdAk3ESiaiAmV0pEOtL12yciTW5tqGVCgBAgBABOuqnDDbKg/JA6VxkqSwWF54VuSFYiUksLQc0QAoQAIVCDQFgSbl+4iETrsYsqPqWasXeJSOuxannsE+93krLSngmjMNaL/rzqz5TRRpt6hVglxxKLYerGUY3pE6uDT6zpUmHrCEQl4SYStQ65aYPdXT0YUW25TlQyIlJT9KdLfVVzfX08xoCxjdDibFIi1agcjfrjEDXHgPMtwGCjMam68VNhGTCu73+N6bIQH7LgNF/ZpFuISsLt1z9jnfD8jRuSHhq1H4xAJbCOhhsMESntLDUE5t80DMCtZLiJ6HAMmviKyIDcyRP71DDRjw8/cjoEhg73DsO7MXsBJJBQm/nKSHzUVpVK2UZA64DHN8ELvSttD4Xai4eAFDIwdpQjItJ4WE/f0if2jUdGYLGFDofiO8+a7PzJj74W7D+XHrG7s3rTqc6Gpx/p61SeYuy7MeWWXXI/8/cPr/z59r/aEqNWXYtiAAk5eAYHfjZwfxU3Y2wbDlYER5icPDhqNaJQUkhorTmRaFLLodNuWb3b1j+wdmGc+kSkcdCarmXd+0iWasKC447h8OGlE53f/ftv+Ku75ve5KZDSXJI/vXBi0w/+6eZwyUHrbiz+LF4/14FPfHBipZWg6fG7D60hohdxYBcCuPfYNtYJ79BHGLDHoAAjiUYdiouH9poTicaFOunyQr1bctjCONHliEiTXplGaB994IANpz2Vd555GN5x1qEVNfGQ60DsOPdFv1eC5Rcc6ls/sAbDu/k/WlKJHrIfePshOHPBoXOSDHupOjIpFjLeA6cR/s9NNoExcOt6mFBJwu0LIpGo6t5Ks5xQ78aNdU5EmuYq5bWv2H5wdiaKUulnlh2ojTZSJ2LHWX3xwweguRn8T6sp43TqiQ585I8PjvQPrl1qB/F4rWQoO49LqgXH2ZjqoUIlCTeRaLxNlYHSZfUuBrFXvrcmIs3AwmV+CClKWV4sPrPsABw326mWSlMmLHlMH7loAt7w+snO9QO3VKucp9R7O1O7Ry4Pqvtjr0FcNZTpfnMzZpT4amBuJp5sPRxGOGO3JS6lqiThJhLN1t5QHM3VXdd2cMau7O9fe45iFSAiVUVqOpeLMOxBFWzc5+AhBk/ubIKJQ+FbcIq4nGp1asRHTGc8OP4nftUMv9sfPh5X3bz4cK0UqGBFjBL24tMnlaDat5/BM89F4/PJDx6EE+eWaoldqZd4hTJNoLVTsZd4W27bvVYobNayYEeL61+vVv44x1sdKm0LARF7N44/KRGpLfQbuZ35fTxoeq568b0HARiMggOxgirsfrEA3//RzLYwKQ6J9NQTStXEFUHsKKUBwBjwqXRYqs9rhxh8956ZbROHWOAdn0ukZx72UTeHGz+V600NRRErF58HZoZKfb4HDdUJK5ZzPyyMY97M7EmgUXPAvMNNrM+KcZJqEm6/MSGJzuJLlXyko+ZEvyeOAKZWYwW2UnXfEJEmviQ578CNaMTQQtb3edubJ2HpuYeAFdhS1U1X1VAEKfoSaYgrjiB23ZiZECFZ4lxxzv0Da4+8OxEYVQ4bAEVWYCti4RSBD97ZzpwB4QZQBltQpJgyaCITVTFFluNM9Gm70agm4SYSzcR6mw6iq6tnsABsX6hhodQJEakp4o1efyqoAIbO8n0EscRRg8QhUiSKlhl8S//A2hVuvQjSOuP0SUBrVm1ij1Abu8R+Ymm06v5EESOtMUW4+aD0rX1oCNm76MLiNBWGgCcWhrEeb078g4y75xSTcBOJ1mNNE+nTtUJ32CpVQz4i0kSWoYEanbKQDVTplVWLoHpyq0FmynAoUJV69ccOQJXf4BSRtgch/M6zDsM7F0/CpHNwg5b0MRWZJtDv8bPLD8Dso2GsypglSYymPuK+zxvmc7TarcbHwtZzjS3Ajchk+ymCG+oQxhiwXUGNc+CnAYcFwFz/Uxs+qFVdKSdwdg3ICkPaoR1JnWt7/6TaXndXz3j/wNq5Kp0SkaqgRGUIgWmAQNmHbggDd1uZLoNRxtlWzpzRUunQiM7BBsfU3DyzDRxYwjm/0No9LYPRUmliaeCYYifh9iBGJGplC9WzEXSDKTmsUyUwAxFpPVeK+iYEMoKAa1DUxDcbq3IZjHLONjoOjKh8gOJOH4m1UJi5nAFfZoHwiwXHWVrjexo7CTeRaNx1zEN5tA9QjaJFRJqHFaUxEgIJIuDehxYKGLlKNyKRGxCh5LC+JMgzaOpI/s0FaOfAV5mMvYpMTX2UMclBM19KSQUS3LApNY3uXqgJUbm2IiJNaVFy2Y0b/qwQeFf2jjMPwTsXH4YCdzq1Isq4939uPFbfp/2/HYB5c5zRgYG1R4LFu1as/s+pJ5bcO0P98eD9KFwZ1P5lFx2AN5zgQJUBQpIYuYZPhcCcq91/vh84g2p8Ym40QxItMmAbo+6jRexdB9hpDI2Xou8+pbtU/hgUCqNhls6u+rcws8OEUMd/V+j87r0tZ4fdv0dCSyQaCVHeCnR39QypRDgiIs3byqY53oiUUGgdi1ayVa4gccZ3Yt8OYMFWoWV/0CMWu1NxTXcEdWHuitM7FPYhdS12X1+q9iFNEqMQN59y+EQji11DEt0UJoGWg3/jIclW7F03aD0HttVxDm7xu9uUCHV1nG2IQTi2PtgCvxkvxKlWXZZIVB+7DNdE9S5JpBleoFwMLcLsH6PqvH6eU+0KojqxCALC7CbYfpVrR4SbiRGxR5A0Tssldg6e4BDhrhG+5KuCUURgfuGbGje4tujagETHghzVyxFhkMRskWcYUptYgd3mJ6nGcd1B8vznf2+JjLAVumREoio7OpdliEhzuWwZG7RaBKEjEqPK8I+4r4RKDcI/FeRs9RHErkVaUyHflgPng2ERljDzy7ILJmolwCQwQhwjAvOLSEk6vqll61yU7GO5lgQFNahr6MCQyEVRwSSe/FUz/O//mKGya4PLEIma4Zfx2ri3JydhLOrun1S7GV/Iug4vRLXoKzFGSJmqc2mZweEzlx7EQAyYgeGIH1dc0rKYJaZM0lBwnOq0ZUmpXyMODSbSd3d3z46Y1rlFDqzTGwi+LIHiHboddxnVDeJXjsOI3924S/IOx4AiVYZUSKBIpEYPkagRfHmpjPuciDQvq5W1cUaoFoWE5pEYrSTbrkhbwKpD34VE+fG9M4wgXlXIK3P1qnV1MFLtNCLjjq5aHY0nACAwoIXP8HxdRMrSnom1rCoSscr5Sc2yaw8mSUBVrtF9qBhREz+HrHNjLU/DFiaJtGGX1nBiiqrFSgovS9KokHQBoFhyJhZWGZWEBM+vIfaIUIKq6EjScW3YQUWMaqRYlc7jSt8KbZYNgJBI1R6foAW5CGDPYLRQclbKluSozn7+t7OGtzzYgkkJ1OYfWoqthBdu3GShIWqiARCwsaMaAAaaQg0CEf50eF+I5FWx2I2ICauCMEqVV3zQVelCjRFNXNKykEMVx/GR904AkrtvWLkI9WsNRiogiDIhhwZftXpE22U1LN6LqvmK+pBokJo0zrRSLFutjtZOwu03YiLRFNcxF10RkeZimeowyAgichNuH82nLFgtSKNIDkg8SKYAsKnGdysOsVuQRmUSxbRnvkl+VdSvrU5t7tKo5YwYf8XwKUbGne7OnmHl8Ho+JBpbmo2aY0q/uwegO2cBMNZhp0siUTs4NlYrRKSNtZ72ZqOmWpwiPENpFIkBjWeQvHxJFP81IitL1Z2hoTSKriUfeHuZ1MNissbBKM7KRLj5iDvkilo9ou2YJFhzJxqzfpyZJloWVbhbt7fAs7828A+tGiGRaKILluPGiUhzvHiJDl0hmTcD3rn+rqNHAVhgtKGwMSJhvePMwxjkABHiu6cAAAktSURBVIv5WoZW6quS1l2z+sLyp4aNB4l86dsOu0Em8InMEmJZ/Xpkrkq+qUqBMMquLmgEpqTS9d7n5pVE0ZgIgyxgsAUbT+ts3ll8pneDjbaojcZDwM4uazxcpveM4uT8vGMWplm78NQTS4Gp1mQwT2h1YM5sx71fLatxXSk0Mk6rqivOXUePYZi/E+eV2mYcVU0eUZIJEinmP8WgC6yJ9YUm4I4I4GCUF/XEmzaHpe6qUqtH7NQoX0q5unswGrilQhZ5JdFnnmty/UPtGBWBqy054/TJeP7S0/sLMu1mT0Q67ZZcYcKKiapFMu+KJadC05UiDIoM+LZJp7AlykdLJ5m3eyfoeX6wrWXBzr1NoUEI8KP51tNLK70+kzVTs6x+rWo/JHSiIPtIaRkAygZGKI2qPFVE4SY25sEJ3VUarEeZn/78KPjJz4+y1rVQo2ODOsEvrA2EGso0AkSkmV6eOg1OLYJQdbCEJIeqaLEbeWeoEKDBDb33xwejDYTUAibExyhC0hWhAb3Sox/8MXxGq1yNYlv4Jrn2im2j9IlSKEqjth6hVai05/UjttURtZN7BIhIc7+ECUwgQrWI6s+Wo8oWuwl0X9OkTWKPCJSPfaPq9JhZsDBUUo4YkzIhy5PFAA8HGFrXBmZ8EaETo6Sj8t3ouMryeF2NNCIfqXSTWBm8D73vP2bYCbJQHmUNiZb/PQr3xCZJDWcaASLSTC9PnQZnSbVobfRxXHGiOlVw1cEsMkvOPbShKn2bt90IIsXieAf8u/2sL2pIU7/z04Cz5WHxfgXJH3eMJ3SiTwfKd6MeKUu5ntqkEi9lJei8Z5RBJFouVuualfgsqYOsI0BEmvUVqsf4FCx2dbOOaE3HJrFPSX07wwgL7yE/femB4jf/hxTnt4ZIMXcpV48SpDXx6krSBz7yY97d1YPSaKSlrixhxbxTtTAjsyZQnft3d8+0ZlSEo4kgUXfAkVcIZtOi2jlEgIg0h4uW6JAj7hGNc37qDF6B2FXuDCtdK/iZRhodWQj6EAcKOVRh1Idc2drWI43GCtoQZ/AJlf3P/2qG4UcNs7dIY/v9N5SKl7x7Ivrw4bFuTmh61GyOECAizdFipTLUJBNV60wgiWTeCrlH3TB8H4gwOoq4S9aZblAdEW5QxVq3u6sHs51EZmSRpdFy+D8tf2Cb84zT1j//+0yLwRb4po7LD/Y1FbiKlXN1cvc4g6ayDYkAEWlDLqvBpNQMe9L7kMR0xVGeuYLREUZLOn4ODzY6UiBk5fGEFBQp0zBUYak0sbQqkL+nnrKRkSfsYd6kUZy2NSLlMAqz+FIY6y2qWjprJSKwsRmojUwiQESayWWp46DUIgil55yeFLErGB2V78vC7yMV2tFdTVTnIoli8AoVEsV+VNW68h13HqVRW0SKmoc/ecfhlZu+e7ObyUUVC+ZN8ae7yFSvIRAgIm2IZbQ4iaQSVesOUYXYdfz7YhgdHdXsSefmnQtKzSU2FGVxGwcCJE90dXGjPylIoqJtVYlKBNPAeqp14ow/jbKmd6RIopjdp6WFVyUl6O7qic6rG5TIII2JUx+ZQ4CINHNLUscBJZmoWndacZN5x+nHhtFRub8/uez6tt17C0O7X2hu043viqSJBHruHxwW4ROLDNjG9QNrelWnpWitW5GylVXBqgNIsZyJ1W6FRKcSJYCsqu3q6hlkAJHZYuTDSIrTpq4yiAARaQYXpW5DcokU2j74zkOrjj261lhlzjGO+4FP9X5ofu+S9/3R4SvnHsvbvbi0HMXLuUJZdEg/P1AX9La+6YTS8nPeXAp0Y3HnPLtaYglbn7If5pXP/iY8FKG3jXLgfvHPYwzYbZMObIoMnyg1pOq+Iqt1VVXBdduTER0/+atmN6JRnMdLolhXNuK6puOaNqdQwNyt4Q/jK/r7b9kSVYx+b3wEiEgbf41jzxA/JLy5KdANIDSYe+zeoisgQTQ3Q2CM3MnJg6NhBjhRPeC9WFSZuHOOGnNQf5OTMBaHPOV2VEnRo9ZVsvCNwqeev8chUz8SLY+9yoBORbKne9J6rnq2+iYizdZ60GgIAW0ElFSSXmvdrp4p3WbOH5Vg9ahNueKDB0Xe25oZy/65Si5EOnfzOceZhu+PABEp7QxCoEEQUHFhkVWYqhaqeYEnjExREn3/2w+5VwFBjxzU4+quazs4sMGIuafnBpaXRZim4yQinaYLT9NuPARU1JFVbi9d1/Vy4KsbCQk09Hr0F0fBi8WCOy28R0cDLpGsPWKuFSMs1UNG/8Ba+oY20gbSnAttAk3gqBohkDUEuhXUtHI0IyX1ZdYmmeR4JLW3qjVzqoZ3Sc6d2jZCgIjUCD6qTAhkAwFVi90qQ6Punh3Ag1O2ZWNm6Y5CljDjHkzSHSn1liUEiEiztBo0FkJAEwEdVaQKUWgOJ7fVqgyOOnswN2y4RTe5wOR2rW0OnIjUJprUFiFQJwQUibTYP3AkNRwRae1iVam+FYiUXGDqtOEz1i0RacYWhIZDCMRBoOID6zhtKlamADACHBZAAVpJreuDNINRcKDo/sJctXd4WjUOI4yxbVCAEW9rbLJUXLdh3Wic9aSy+USAiDSf60ajbgAE5KANnDutjBfww+0+DvA5zHt/qfJhbwBcGnwKRcBsM9LDGYwWgO2r/JNEyiYBOhocx0xNj4g0U8tBg2l0BNAatLkwox2g4Eo6HPhproQoHiLLRt8CYfOrIlmZYB2AsYGBNW6GGnqyhwARafbWhEZECFQQ8IZr9EquoiDn/EJf2KKMZQhrEwRqpEu3MQaYbOCxmoY96l9S/ZpAn626RKTZWg8aDSGQGgLK8YAdp01I0CaDq5G+dRoLIimdtnzuNb3NENnpADv96hCRTr81pxkTAoQAIUAIWESAiNQimNQUIUAIEAKEwPRDgIh0+q05zZgQIAQIAULAIgJEpBbBpKYIAUKAECAEph8CRKTTb81pxoQAIUAIEAIWESAitQgmNUUIEAKEACEw/RAgIp1+a04zJgQIAUKAELCIABGpRTCpKUKAECAECIHphwAR6fRbc5oxIUAIEAKEgEUEiEgtgklNEQKEACFACEw/BIhIp9+a04wJAUKAECAELCJARGoRTGqKECAECAFCYPoh8P8BkHDfsjtmkDYAAAAASUVORK5CYII=',
                image: `${nueva}`,
                height: 90,
                width: 250,
                aling: 'center',
                valing: 'center'
              }
            ],
            ]
          }
        },
        {
          columns: [
            {
              width: '100%',
              text: ` `,
            }
          ],
          columnGap: 10,
        },
        {
          columns: [
            {
              width: '100%',
              text: `${this.dataSucursal.sucursal}, ${this.dataSucursal.direccion}, Tel: ${this.dataSucursal.telefono}, ${this.dataSucursal.correo}`,
              style: 'sucursal'
            }
          ],
          columnGap: 10,
        },
        {
          text: '', margin: 5 
        },
        {
          columns: [
            {width: '15%', text: 'Fecha', style:'title' },
            {width: '35%', text: `lunes, 6 de junio de 2022`,  style:'info' },
            {width: '15%', text: 'Promocion', style:'title' },
            {width: '35%', text: `flotilla`,  style:'info'  },
          ]
        },
        {
          columns: [
            {width: '15%', text: 'Cliente', style:'title' },
            {width: '35%', text: `${(this.dataCliente.fullname).toUpperCase()}`,  style:'info'},
            {width: '15%', text: 'COT#', style:'title' },
            {width: '35%', text: `flotilla`,  style:'info'},
          ]
        },
        {
          columns: [
            {width: '15%', text: 'no. Cliente.', style:'title' },
            {width: '35%', text: ``,  style:'info'},
            {width: '15%', text: 'Mail', style:'title' },
            {width: '35%', text: `${(this.dataCliente.correo).toUpperCase()}`,  style:'info'},
          ]
        },
        {
          columns: [
            {width: '15%', text: 'Tel.', style:'title' },
            {width: '35%', text: `${this.dataCliente.telefono_movil}`, style:'info' },
            {width: '15%', text: 'Tipo', style:'title' },
            {width: '35%', text: `${(this.dataCliente.tipo.toUpperCase())}`,  style:'info'},
          ]
        },
        {
          columns: [
            {width: '15%', text: 'Empresa', style:'title' },
            {width: '35%', text: `lunes, 6 de junio de 2022`, style:'info' },
            {width: '15%', text: 'Cilidros', style:'title' },
            {width: '35%', text: `${this.dataVehiculoExcel.cilindros}`,  style:'info'},
          ]
        },
        {
          columns: [
            {width: '15%', text: 'Marca', style:'title' },
            {width: '35%', text: `${this.dataVehiculoExcel.marca}`,  style:'info'},
            {width: '15%', text: 'Modelo', style:'title' },
            {width: '35%', text: `${this.dataVehiculoExcel.modelo}`, style:'info' },
          ]
        },
        {
          columns: [
            {width: '15%', text: 'Placas', style:'title' },
            {width: '35%', text: `${this.dataVehiculoExcel.placas}`,  style:'info'},
            {width: '10%', text: 'Color', style:'title' },
            {width: '12.5%', text: `${this.dataVehiculoExcel.color}`,  style:'info'},
            {width: '12.5%', text: 'Año', style:'title' },
            {width: '12.5%', text: `${this.dataVehiculoExcel.anio}`, style:'info' },
          ]
        },
        {
          columns: [
            {width: '15%', text: 'KMS', style:'title' },
            {width: '35%', text: `lunes, 6 de junio de 2022`,  style:'info'},
            {width: '10%', text: 'Motor', style:'title' },
            {width: '12.5%', text: `${this.dataVehiculoExcel.no_motor}`,  style:'info'},
            {width: '12.5%', text: 'O.S', style:'title' },
            {width: '12.5%', text: `flotilla`,  style:'info'},
          ]
        },
        {
          columns: [
            {width: '100%', text: ' ',  }
          ]
        },
        {
          columns: [
            {width: '33.33%', text: ' ' },
            {width: '33.33%', text: `${this.dataVehiculoExcel.marca} ${this.dataVehiculoExcel.modelo}`, style:'medium' },
            {width: '33.33%', text: ` `, style:'medium' },
          ]
        },
        {
          columns: [
            {width: '100%', text: ' '},
          ]
        },
        table(
          this.tempdataCotizacionmuestra,
          ['tipo', 'nombre','precio','precio'],
          ['15%', '45%', '20%','20%'],
          true,
          [ {text:'Tipo', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
            {text:'Nombre', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
            {text:'precio normal', fillColor: 'FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
            {text:'precio flotilla', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'}],
          ''),
        {
            columns: [
              {width: '100%', text: ' '},
            ]
        },
        await this.table2(
            this.tempDataPaquetes,
            ['nombre'],
            ['100%'],
            true,
            [ {text:'Detalles de paquetes', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'}],
        ''),
        {
              columns: [
                {width: '100%', text: ' '},
              ]
        },
        {
              columns: [
                {width: '100%', text: `Nota: ${nota}`},
              ]
        },
        {
              columns: [
                {width: '100%', text: ' '},
              ]
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 0,
            // widths: [ '*',100,100 ],
            widths: [ '*', 100, 100 ],
            body: [
              [ { text: '', bold: true, alignment: 'center', style:'terminos' }, '', '' ],
              [ { text: '', bold: true, alignment: 'center', style:'terminos' }, 
                { text: `Subtotal: $`, bold: true, alignment: 'right', style:'sucursal' }, 
                { text: `${this.subtotal}`, bold: true, alignment: 'right', style:'sucursal' }
              ],
              [ 
                { text: '', bold: true, alignment: 'center', style:'terminos' },
                { text: `Iva: $`, bold: true, alignment: 'right', style:'sucursal' },  
                 { text: `${this.ivaAplicado}`, bold: true, alignment: 'right', style:'sucursal' }
                ],
              [ 
                { text: 'Importe con letra', bold: true, alignment: 'center', style:'sucursal' },
                { text: `Descuento: $`, bold: true, alignment: 'right', style:'sucursal' }, 
                { text: `${this.descuentoAplicado}`, bold: true, alignment: 'right', style:'sucursal' }
              ],
              [ 
                { text: `${letras}`, bold: true, alignment: 'center', style:'sucursal' },
                { text: `Total: $`, bold: true, alignment: 'right', style:'sucursal' }, 
                { text: `${this.totalCotizacion}`, bold: true, alignment: 'right', style:'sucursal'}
              ],
            ]
          }
        },
        {
              columns: [
                {width: '100%', text: ' '},
              ]
        },
        {
              layout: 'noBorders',
              table: {
                headerRows: 0,
                widths: [ '*' ],
        
                body: [
                  [ { text: 'Precios en MN mas IVA en caso de requerir factura. Este documento es una cotización y no representa ninguna orden de trabajo.', 
                  bold: true, alignment: 'center', style:'terminos' } ],
                  [ { text: 'Cotización Valida por 20 días Naturales y no aplica con otras Promociones. Costo de Recoleccion y entrega de Auto es de $150.00 Pesos MN', 
                  bold: true, alignment: 'center', style:'terminos' } ],
                  [ { text: 'Precios sujetos a cambio sin previo aviso. Precios de Promoción no aplican a 6 meses sin intereses', 
                  bold: true, alignment: 'center', style:'terminos' } ],
                ]
              }
        }
      ],
      images: {
        
        
      
      },
      styles: {
        header: { fontSize: 14,bold: true,align: 'center'},
        info: { fontSize: 10,bold: true,align: 'center',color: this.colorTextoPDF},
        title: { fontSize: 10,bold: true,align: 'center'},
        sucursal: { fontSize: 12,bold: true,align: 'center'},
        operadora: { fontSize: 16,bold: true,align: 'center'},
        medium: { fontSize: 16,bold: true,color:this.colorTextoPDF },
        content:{fontSize:10,color: 'black'},
        importeLetras:{fontSize:10,bold: true},
        detallesPaquetes:{fontSize:9,color: 'black'},
        terminos:{ fontSize:8},
        anotherStyle: { italics: true, align: 'center'}
      },
      alignment: {alignment:'right'}
    };
    let nombrePDF = `${this.dataVehiculoExcel.marca}_${this.dataVehiculoExcel.modelo}_${this.dataVehiculoExcel.placas}_${this.dataRecepcion.fecha}_${this.dataCliente.fullname}.pdf`
    pdfMake.createPdf(documentDefinition).download(nombrePDF);

  }
  async getBase64ImageFromURL(url:any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
  restaFechas = function(f1,f2)
   {
     var aFecha1 = f1.split('/');
     var aFecha2 = f2.split('/');
     var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
     var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
     var dif = fFecha2 - fFecha1;
     var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
     return dias;
   }
  async table2(data, columns, witdhsDef, showHeaders, headers, layoutDef) {
    return {
        table: {
            headerRows: 1,
            widths: witdhsDef,
            body: await this.buildTableBody2(data, columns, showHeaders, headers)
        },
        layout: layoutDef
    };
  }
  async buildTableBody2(data, columns, showHeaders, headers) {        
        var body = [];
        if(showHeaders) {
        body.push(headers);
        }
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          let dataRow=[]
          let data2 =[]  
          let elementosColumnas = element.elementos
          let i=0;
          elementosColumnas.forEach((column:any)=> {
            i++
            if (column.tipo === 'mo') {
              let costoTotal = column.Horas * column.precio
              data2.push( ` ${i}.- Nombre: ${column.nombre},Horas: ${column.Horas}, Precio: ${column.precio},Costo: ${costoTotal}, descripcion: ${column.descripcion}`)
            }else{
              let costoTotal = column.cantidad * column.precio
              data2.push( ` ${i}.- Nombre: ${column.nombre},Cantidad: ${column.cantidad} Precio: ${column.precio}, Costo: ${costoTotal} , descripcion: ${column.descripcion}`)
            }
          })
          dataRow.push({
            ul: [{
              columns: [
                {width: '20%', text: `Paquete ${data[index].nombre}`},
                {width: '80%', text: `${data2}`,style:'detallesPaquetes'},
              ]
            }]
          })          
          body.push(dataRow);
        }
        return body;
  }
}
