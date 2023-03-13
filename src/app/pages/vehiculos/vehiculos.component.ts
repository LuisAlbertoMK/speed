import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { child, get, getDatabase, onValue, push, ref, set } from 'firebase/database';
import { Observable } from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators'
import { EncriptadoService } from 'src/app/services/encriptado.service';
import Swal from 'sweetalert2'
const db = getDatabase()
const dbRef = ref(getDatabase())
export interface User {nombre: string, sucursal:string,correo:string}
@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  ///ROLES
  ROL:string=''; SUCURSAL:string = ''; modeloAuto:string =''; existenPlacas:boolean = false; accion:string =''
  formaVehiculoManual: FormGroup; formaVehiculoManualEditar: FormGroup
  marcas:any=[]; listaArrayAnios:any=[]; categorias:any[]=[];engomadoColors:any=[]; anio:number=0; dataClienteSelect:any=[]
  colores:any=[]; clientes:any=[]; arregloPlacas:any=[]; arregloInfoVehiculos:any=[]; dataVehiculo:any=[];
  emptyData:boolean = false; regresar:string; cliente:string =''; dataCliente:any=[]; claveNueva:string ='';
  clienteLocal:any=''; arrayModelos:any=[]
  //autocompletado
  myControl = new FormControl('');
  filteredOptions: Observable<any[]>
  constructor(private fb: FormBuilder,private router: Router,private rutaActiva: ActivatedRoute,private _security:EncriptadoService) { }

  ngOnInit(): void {
    this.rol()
    this.consultaMarcas()
    this.listadePlacas()
    this.crearFormularioLlenadoManual()
    this.listadoCliente()
    this.listaEngomados()
    this.consultaColores()
    this.listaEngomados()
    this.consultaCategorias()
    
    this.verificarEmpty()
    this.ultimoPaso()
    this.filtradoClientes()
  }
  //informacion de roles
  async rol(){
    
const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this.regresar = this.rutaActiva.snapshot.params['rutaAnterior']
    if (this.regresar ==='cotizacionNueva') {
      this.regresar = 'cotizacionNueva/cotizacion/new'
    }
    
    this.accion = this.rutaActiva.snapshot.params['accion']
    
    if (this.ROL === null) {
      this.router.navigateByUrl('/login')
    }
    setTimeout(() => {
      if (this.cliente !=='') {        
        get(child(dbRef, `clientes/${this.cliente}`)).then((snapshot) => {
          if (snapshot.exists()) {
            this.dataCliente = snapshot.val()            
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    }, 1000)
  }
  ultimoPaso(){
    
    if (localStorage.getItem("clienteCotizacion")) {
      const cliente = JSON.parse(localStorage.getItem("clienteCotizacion"))
      const vehiculo = JSON.parse(localStorage.getItem("dataVehiculo"))
      const data = {...cliente, fullname:`${cliente.nombre} ${cliente.apellidos}`}
      this.myControl.setValue(data)
      this.formaVehiculoManual.controls['cliente'].setValue(cliente.id)
    }
  }
  vericainfo(form:string){
    
    if (form==='clientes') {
      // this.myControl.setValue()
      if (this.myControl.value==='') {
        this.formaVehiculoManual.controls['cliente'].setValue('')
        return
      }      
    }
  }
  verificarEmpty(){
    let inter =setInterval(()=>{
      if (this.dataVehiculo.length===0) {
       if (this.accion === 'new') {
        clearInterval(inter)
       }else{
        this.emptyData = true
       }
      }
    },1000)


  }

  validarVehiculoLlenadoManual(campo: string){
    return this.formaVehiculoManual.get(campo).invalid && this.formaVehiculoManual.get(campo).touched
  }
  verificarEngomado(form:string){
    let placas = ''
    if (form==='editar') {
      placas = String(this.formaVehiculoManualEditar.controls['placas'].value)
    }else{
      placas = String(this.formaVehiculoManual.controls['placas'].value)
    }
    const pla = placas.split('')
    let numeros = []
    for (let index = 0; index < pla.length; index++) {
      const element = pla[index];
      if (Number(element)>=0) {
        numeros.push(element)
      }
    }
    let verifica = numeros[numeros.length-1]
    let color:string=''
      if (verifica === '1' || verifica === '2') color='Verde'
      if (verifica === '3' || verifica === '4') color='Rojo' 
      if (verifica === '5' || verifica === '6') color='Amarillo'
      if (verifica === '7' || verifica === '8') color='Rosa'
      if (verifica === '9' || verifica === '0') color='Azul'

      if (form==='editar') {
        this.formaVehiculoManualEditar.controls['engomado'].setValue(color)
      }else{
        this.formaVehiculoManual.controls['engomado'].setValue(color)
      }
  }
  submarcas(){
    let marca =this.formaVehiculoManual.controls['marca'].value
    this.listaArrayAnios=[]
    if (marca!=='' && marca!==null) { 
      const modelos = this.marcas.find(option=>option.id === marca)
      this.arrayModelos = modelos      
    }else{
      this.arrayModelos=[]
      this.listaArrayAnios=[]
    }
  }
  aniosModelo(){
    const marca =this.formaVehiculoManual.controls['marca'].value
    const modelo =this.formaVehiculoManual.controls['modelo'].value
    if ((marca !== '' || null) && modelo!==null || '') {
      const filtro1:any[] = this.marcas.find(option=>option.id === marca)
      // console.log(filtro1);
      
      if (filtro1.length!==0) {
        const filtro2:any[] = filtro1.find(option=>option.modelo === modelo)
        if (filtro2.length!==0) {
          this.listaArrayAnios = filtro2['anios']
          console.log(filtro2['categoria']);
          this.formaVehiculoManual.controls['categoria'].setValue(filtro2['categoria'].trim())
          
        }else{
        this.listaArrayAnios=[]
        }
      }else{
        this.listaArrayAnios=[]
      }
    }
  }
  guardarLlenadoManual(){
    // aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
    if (this.formaVehiculoManual.invalid) {
      return Object.values(this.formaVehiculoManual.controls).forEach(control => {
        control.markAsTouched()
        this.mensajeIncorrecto('Llenar todos los campos')
      })
    }else{
      let placas = this.formaVehiculoManual.controls['placas'].value
      if (this.accion ==='new') {
        const newPostKey = push(child(ref(db), 'posts')).key
        const tempData = {
          ...this.formaVehiculoManual.value,
          status:true,
          id:newPostKey
        }
        set(ref(db, `vehiculos/${newPostKey}`), tempData )
        .then(() => {
          this.formaVehiculoManual.reset()
           this.mensajeCorrecto('registor de vehiculo correcto')
           this.router.navigateByUrl('cotizacionNueva/cotizacion/new')
        })
        .catch((error) => {
          // The write failed...
        });
        localStorage.setItem('dataVehiculo',JSON.stringify(tempData))
      }
    }
  }
  updateInfoVehiculo(rutaGET:string,data:any,nuevo:boolean,mensaje:string){
    let ruta= rutaGET

    
    if (nuevo) {
      const newPostKey = push(child(ref(db), 'posts')).key
      this.claveNueva = newPostKey
      ruta = ruta +'/'+  newPostKey
    }else{
      ruta = rutaGET
    }   
	  set(ref(db, ruta), data )
    .then(() => {
      this.mensajeCorrecto(mensaje)

      if (nuevo) {
        this.formaVehiculoManual.reset()
      }
    })
    .catch((error) => {
      this.mensajeIncorrecto(`Ocurrio un error: ${error}`)
    })
  }
  placasVerifica(){
   
    let placas:string = (this.formaVehiculoManual.controls['placas'].value).toLowerCase()
    if (placas.length<=0 && placas.length<=6) {
      return
    }
    // console.log(this.arregloPlacas);
    
    let conteo = 0
    this.arregloInfoVehiculos.forEach(placa => {
      if (placas === placa.placas.toLowerCase() && this.accion !== placa.id ) {
        conteo = conteo + 1
      }
      if (conteo!==0) {
        // this.mensajeIncorrecto('Placas registradas verificar información')
        this.existenPlacas = true
      }else{
        this.existenPlacas = false
      }
    })

  }
  ///funciones generales y no cambian
  crearFormularioLlenadoManual(){
    this.formaVehiculoManual = this.fb.group({
      cliente:['',[Validators.required]],
      placas:['',[Validators.required,Validators.minLength(6),Validators.maxLength(7)]],
      vinChasis:[''],
      marca:['',[Validators.required]],
      modelo:['',[Validators.required]],
      categoria:['',[Validators.required]],
      anio:['',[Validators.required]],
      cilindros:['',[Validators.required]],
      no_motor:[''],
      color:['',[Validators.required]],
      engomado:['',[Validators.required]],
      marcaMotor:['',[]],
      transmision:['',[Validators.required]]
    })
  }
  cargaData(infoV:any){
    this.dataVehiculo = infoV
    this.modeloAuto = infoV.modelo
    this.anio = infoV.anio
    const starCountRef = ref(db, `vehiculos/${infoV.id}`)
        onValue(starCountRef, (snapshot) => {
	        let data= snapshot.val()
          this.formaVehiculoManual.reset({
            cliente:data.cliente,
            placas:data.placas,
            vinChasis:data.vinChasis,
            marca:data.marca,
            modelo:data.modelo,
            categoria:data.categoria,
            anio:data.anio,
            cilindros:data.cilindros,
            no_motor:data.no_motor,
            color:data.color,
            engomado:data.engomado,
            marcaMotor:data.marcaMotor,
            transmision:data.transmision
          })
          this.submarcas()
        })
  }
  mensajeCorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1200,
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
      timer: 1500,
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
  private crearArreglo(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      //arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }
  private crearArregloP(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]      
      //arraypush.id=key
      // console.log(arraypush);
      
      if (key !=='id') {
        // arraypush.id=key

        arrayGet.push(arraypush)
      }
      
    })
    return arrayGet
  }
  consultaMarcas(){
    const starCountRef = ref(db, `marcas_autos`)
    onValue(starCountRef, (snapshot) => {
      this.marcas= this.crearArreglo2(snapshot.val())
    })
  }
  listadoCliente(){
    const starCountRef = ref(db, `clientes`)
        onValue(starCountRef, (snapshot) => {
	        // this.newListadoSuperSU()
          const clientes = this.crearArreglo2(snapshot.val())
          // console.log(clientes );
          for (let index = 0; index < clientes.length; index++) {
            const element = clientes[index];
            element.fullname = `${element.nombre} ${element.apellidos}`
          }
          if (this.SUCURSAL!== 'Todas') {
            this.clientes = clientes.filter(option=>option.sucursal === this.SUCURSAL)
          }else{
            this.clientes = clientes
          }
        })
  }
 
  listaEngomados(){
    const starCountRef = ref(db, `engomado`)
             onValue(starCountRef, (snapshot) => {
               this.engomadoColors= this.crearArreglo(snapshot.val())
             })
  }
  listadePlacas(){
    const stratvehiculos = ref(db, `vehiculos`)
    onValue(stratvehiculos, (cnpVehiculos) => {
      if (cnpVehiculos.exists()) {
        this.arregloInfoVehiculos=[]
        let placas= this.crearArreglo2(cnpVehiculos.val())
        let infoVehiculo =  this.crearArreglo2(cnpVehiculos.val())        
        infoVehiculo.forEach(infoV => {
          get(child(dbRef, `clientes/${infoV.cliente}`)).then((snapCliente) => {
            if (snapCliente.exists()) {
              let infocliente = snapCliente.val()
              get(child(dbRef, `sucursales/${infocliente.sucursal}`)).then((snapshot) => {
                if (snapshot.exists()) {
                  let infoSucursal = snapshot.val()
                  const temp = {
                    ...infocliente,
                    ...infoSucursal,
                    ...infoV,
                    idSucursal: infoSucursal.id,
                    statusCliente: infocliente.status,
                    statusSucursal: infoSucursal.status,
                    nombre: infocliente.nombre + ' ' + infocliente.apellidos,
                    nombreShow: infocliente.nombre
                  }
                  this.arregloInfoVehiculos.push(temp)
                  this.arregloInfoVehiculos.forEach(infoV => {
                    if (infoV.id === this.accion) {
                      this.cargaData(infoV)
                    }
                  });
                  
                } else {
                  console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              });
            } else {
              // console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
          // this.arregloInfoVehiculos
        });
        this.arregloPlacas=[]
        placas.forEach(element => {
          this.arregloPlacas.push(element.placas)
        })
        
        
      } else {
        this.arregloPlacas=[]
      }
    })
    
  }
  consultaColores(){
    const starCountRef = ref(db, `colores_autos`)
    onValue(starCountRef, (snapshot) => {
      this.colores= this.crearArreglo(snapshot.val())
    })
  }
  consultaCategorias(){
    const starCountRef = ref(db, `categorias_autos`)
    onValue(starCountRef, (snapshot) => {
      this.categorias= this.crearArreglo(snapshot.val())
      this.categorias.sort()
      // this.ordernarPorCampo(this.categorias)
    })
  }
  displayFn(val: any): string {
    return val && (val.fullname ) ? (val.fullname) : ''
  }
  infoAdiciona(val:any){
    if (val===null) {
      return
    }
    this.formaVehiculoManual.controls['cliente'].setValue(val.id)
  }
  filtradoClientes(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(100),
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }
  private _filter(value: any[]): string[] {
    if (value===null) {
      return null
    }
    const filterValue = String(value).toLocaleLowerCase()
    let data = []
    data = this.clientes.filter(option => option.fullname.toLowerCase().includes(filterValue))
    if (data.length === 1) {
      const info = {...data[0]}
      // console.log(info);
      
      // this.myControl.setValue(data[0])
    }
    return data
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

}
