import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import {debounceTime, map, startWith} from 'rxjs/operators'
import { Vehiculo } from 'src/app/models/vehiculos.model';
import Swal from 'sweetalert2';
import { EncriptadoService } from 'src/app/services/encriptado.service';
export interface User {nombre: string, apellidos:string}
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements OnInit {
  //autocompletado
  myControl = new FormControl('');filteredOptions: Observable<any[]>
  ROL:string=''; SUCURSAL:string = ''; regresar:string=''; recepcion:string=''; clientes:any [] =[]; selecciono:boolean = false;
  sucursal:string=''; listaArrayVehiculosCliente:Vehiculo[]=[]; dataRecepcion:any=[];dataCliente:any=[]; filtroAuto:string ='';
  dataVehiculo:any=[];  fecha: string;hora: string;  fechaRegistro:string =''; mesActual:string = ''; anio:string=''; dia:string = '';
  clienteData:any=[]; enSucursal:boolean = false; tipoRecepcion:string =''; existeData:boolean=true; pagina:string =''
  servicios:any=['servicio','garantia','retorno','preventivo','correctivo','rescate vial'];
  articulosFormControl: any[] = ['Tapetes','Espejos','Encendedor','Autoestéreo','CarátulaDeEstereo','BotonesInteriores','Cristales','extinguidor','herramienta','señales','CablePasacorriente','Viceras','LlantaRefacción','Gato','LlaveManeral','BirlosDeSeguridad','Molduras','Antena','TaponDeGasolina','Limpiadores','BocinadeClaxon','TarjetaDeCirculacion','ComprobanteDeVerificacion','InstrumentosdeTablero','TaponesBayonetaDeMotor','EspejoRetrovisor'];
  articulos = ['Tapetes','Espejos','Encendedor','Autoestéreo','Carátula de Estéreo','Botones Interiores','Cristales','extinguidor','herramienta','señales','Cable Pasacorriente','Viceras','Llanta Refacción','Gato','Llave Maneral','Birlos de Seguridad','Molduras','Antena','Tapón de Gasolina','Limpiadores','Bocina de Claxón','Tarjeta de Circulación','Comprobante de Verificación','Instrumentos de Tablero','Tapones y Bayoneta de Motor','Espejo Retrovisor'];
  formRecepcion: FormGroup; formularioArticulos: FormGroup; infoCotizacion:any=null; infoCliente:any=''
  constructor(private fb: FormBuilder,private router: Router,private rutaActiva: ActivatedRoute,private _security:EncriptadoService,) { }

  ngOnInit(): void {
    this.rol()
    this.asignarparametros()
    this.listadoClientes()
    this.filtradoClientes()
    this.crearFormRecepcion()
    this.crearFormularioArticulos()
  }
  rol(){
   
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    this.regresar = this.rutaActiva.snapshot.params['pagina']
    this.recepcion = this.rutaActiva.snapshot.params['recepcion']
    if (this.ROL === null) {
      this.router.navigateByUrl('/login')
    }
  }
  asignarparametros(){
     this.tipoRecepcion =  this.rutaActiva.snapshot.params['recepcion']
     this.pagina = this.rutaActiva.snapshot.params['pagina']
    if (this.tipoRecepcion!=='new') {
      this.getInfoCotizacion()
    }
  }
   getInfoCotizacion(){
    const starCountRef = ref(db, `cotizacionesRealizadas/${this.tipoRecepcion}`)
      onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
         this.infoCotizacion =   snapshot.val()
        this.listaAutosCliente(this.infoCotizacion.cliente)
        const starCliente = ref(db, `clientes/${this.infoCotizacion.cliente}`)
        onValue(starCliente, (snapshot) => {
          if (snapshot.exists()) {
              this.infoCliente= snapshot.val()
            } else {
              // console.log("No data available");
            }
        })
      } else {
        // console.log("No data available");
        this.existeData = false
      } 
        })
  }
  listaAutosCliente(cliente:string){
    const starCountRef = ref(db, `vehiculos`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
          let arreglo= this.crearArreglo2(snapshot.val())
          this.listaArrayVehiculosCliente = arreglo.filter(filtro=>filtro.cliente === cliente )
        } else {
          // console.log("No data available");
        }
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
                // this.clientes = tempData
                newClientes.push(tempData)
                // console.log(tempData);
                
                if (this.SUCURSAL === 'Todas') {
                  this.clientes = newClientes
                } else {
                  this.clientes = newClientes.filter(filtro=>filtro.sucursal === this.SUCURSAL)
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
  crearFormRecepcion(){
    this.formRecepcion = this.fb.group({
      cliente: ['', [Validators.required]],
      vehiculo: ['', [Validators.required]],
      // correo:['',[Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      servicio: ['', [Validators.required]],  
      kilometraje: [
        '',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]{1,10}\d*)?$/)],
      ],
      combustible: ['', [Validators.required]],
      tapetes: ['', [Validators.required]],
      tapones: ['', [Validators.required]],
      espejos: ['', [Validators.required]],
      descripcionCliente: ['', []],
      diagnostico: ['', []],
    });
  }
  validarFormRecepcion(campo:string){
    return this.formRecepcion.get(campo).invalid && this.formRecepcion.get(campo).touched
  }
  guardarRecepcion(){
    this.getFechaHora()
    if (this.formRecepcion.invalid) {
      return Object.values(this.formRecepcion.controls).forEach(
        (control) => {
          control.markAsTouched();
          // Swal.fire('Error', 'LLenar todos los campos necesarios', 'error');
          this.mensajeIncorrecto('Llenar todos los campos')
        }
      );
    } else {
      Swal.fire({
        title: 'Esta seguro?',
        text: "Guardar nueva recepción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar!',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          let sucursal =''
          let cotizacion
          if (this.tipoRecepcion==='new') {
            sucursal=this.infoCliente.sucursal
            cotizacion= false
          }else{
            cotizacion= true
            sucursal=this.infoCliente.sucursal
          }
          const newPostKey = push(child(ref(db), 'posts')).key
          let V = this.formRecepcion.controls['vehiculo'].value
          const tempData={
            ...this.formRecepcion.value,
            articulos: this.formularioArticulos.value,
            cotizacion,
            firmaConsentimiento:false,
            firmaEntrega:false,
            rayarDetalles:false,
            sucursal,
            imgConsentimiento: '',
            imgEntrega:''
          }
          const temp={
            fecha_entregado: 'pendiente',
            fecha_recibido: 'pendiente',
            hora_entregado: 'pendiente',
            hora_recibido: 'pendiente',
            status: 'pendiente',
          }
          if (this.tipoRecepcion === 'new')  {
            this.guardaInfo('',V,newPostKey,temp,tempData)
          }else{
            this.guardaInfo('',V,this.tipoRecepcion,temp,tempData)
          }
          }
      })
    }
  }
  guardaInfo(ruta:string,V:string,newPostKey:string,temp:any, tempData:any){
    set(ref(db, `recepcionStatus/${this.infoCotizacion.cliente}/${V}/${newPostKey}`), temp )
                  .then(() => {
                  	set(ref(db, `recepcion/${newPostKey}`), tempData )
                            .then(() => {
                              set(ref(db, `cotizacionesRealizadas/${this.tipoRecepcion}/aprobada`), true )
                              .then(() => {
                                // Data saved successfully!
                              })
                              .catch((error) => {
                                // The write failed...
                              });

                              this.mensajeCorrecto('Registro correcto')

                              setTimeout(() => {
                                this.router.navigateByUrl(`/detalles/${newPostKey}`)
                              }, 1200);
                            })
                            .catch((error) => {
                              // this.mensajeIncorrecto('surgio un problema'+ error)
                              console.log(error);
                              
                            });
                  })
                  .catch((error) => {
                    // this.mensajeIncorrecto('surgio un problema'+ error)
                    console.log(error);
                    
                  });
  }
  verififff(){
    if (this.myControl.value==='') {
      this.formRecepcion.controls['cliente'].setValue('')
      this.selecciono = false
    }
  }
  vehiculosCliente(dataGet:any){
    if (dataGet ==='undefined') {
      this.selecciono = false
      return
    }
    // console.log(dataGet)
    this.clienteData = dataGet
    this.formRecepcion.controls['cliente'].setValue(dataGet.id)
    this.selecciono = true
    this.sucursal = dataGet.sucursal
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
        // console.log('sin informacion');
        
      }            
    })
  }
  crearFormularioArticulos() {
    this.formularioArticulos = this.fb.group({
      Tapetes: ['', []],
      Espejos: ['', []],
      Encendedor: ['', []],
      Autoestéreo: ['', []],
      CarátulaDeEstereo: ['', []],
      BotonesInteriores: ['', []],
      Cristales: ['', []],
      extinguidor: ['', []],
      herramienta: ['', []],
      señales: ['', []],
      CablePasacorriente: ['', []],
      Viceras: ['', []],
      LlantaRefacción: ['', []],
      Gato: ['', []],
      LlaveManeral: ['', []],
      BirlosDeSeguridad: ['', []],
      Molduras: ['', []],
      Antena: ['', []],
      TaponDeGasolina: ['', []],
      Limpiadores: ['', []],
      BocinadeClaxon: ['', []],
      TarjetaDeCirculacion: ['', []],
      ComprobanteDeVerificacion: ['', []],
      InstrumentosdeTablero: ['', []],
      TaponesBayonetaDeMotor: ['', []],
      EspejoRetrovisor: ['', []],
    });
  }

  modeloFiltro(){
    // console.log(this.formCotizacion.controls['vehiculo'].value)
    let V = this.formRecepcion.controls['vehiculo'].value
    this.listaArrayVehiculosCliente.forEach(vehiculo => {
      if (V === vehiculo.id && V!=='') {
        this.filtroAuto = vehiculo.marca
        // console.log(this.clienteData)

        get(child(dbRef, `recepcionStatus/${this.clienteData.id}/${vehiculo.id}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let statusRecep = this.crearArreglo2(snapshot.val())
            let contador = 0
            statusRecep.forEach(idStatusRecep => {
              if (idStatusRecep.status !=='entregado') {
                contador = contador + 1
              }
            })
            if (contador > 0) {
              this.enSucursal = true
              this.mensajeIncorrecto(`el vehiculo con placas ${vehiculo.placas} se encuentra en sucursal`)
            }else{
              this.enSucursal= false
            }            
          } else {
            // console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        })
      }else{
        this.filtroAuto = ''
      }
    })


  }
  filtradoClientes(){
    // debounceTime(100),
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
    // console.log(data);
    if (data.length ===0) {
      data = this.clientes.filter(option => option.apellidos.toLowerCase().includes(filterValue))
    }
    return data
  }
  displayFn(val: User): string {
    return val && (val.nombre +' '+ val.apellidos) ? (val.nombre +' '+ val.apellidos) : ''
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
  getFechaHora() {
    let date: Date = new Date();
    this.fecha =  date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    this.hora =   date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    this.fechaRegistro =  date.getDate() + '' + (date.getMonth() + 1) + '' + date.getFullYear()
    this.mesActual = String((date.getMonth() + 1))
    this.anio = String(date.getFullYear()) 
    this.dia = String(date.getDate()) 
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
      timer: 2000,
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

}
