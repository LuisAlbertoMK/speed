import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

import { child, getDatabase, onValue, push, ref, update } from "firebase/database";
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css']
})
export class VehiculoComponent implements OnInit {

  @Input() cliente:string
  @Input() vehiculo:string
  @Input() vehiculoDat:string
  

  @Output() dataVehiculo : EventEmitter<any>

  form_vehiculo: FormGroup;
  myControl = new FormControl('');
  filteredOptions: Observable<any[]>
  existenPlacas:boolean = false
  modeloAuto:string ='';
  marcas:any=[];
  arrayModelos=[]
  categorias=[];
  anio:number=0;
  listaArrayAnios=[];
  colores:any=[];
  engomadoColors:any=[];
  clientes = []
  listaPlacas =[]

  constructor(private fb: FormBuilder, private _vehiculos: VehiculosService, private _clientes : ClientesService,
    private _publicos: ServiciosPublicosService) {
      this.dataVehiculo = new EventEmitter()
    }

  ngOnInit(): void {
    this.crearFormularioLlenadoManual()
    this.consultaMarcas()
    this.listaColores()
    this.listaClientes()
    this.automaticos()
    this.cargaDataVehiculo()
    
  }
  cargaDataVehiculo(){
    if (this.vehiculo) {
      // console.log(this.vehiculo);
      // console.log(this.vehiculoDat['placas']);
      
      this.form_vehiculo.reset({
        id: this.vehiculoDat['id'],
        cliente: this.vehiculoDat['cliente'],
        placas: this.vehiculoDat['placas'],
        vinChasis: this.vehiculoDat['vinChasis'],
        cilindros: this.vehiculoDat['cilindros'],
        no_motor: this.vehiculoDat['no_motor'],
        color: this.vehiculoDat['color'],
        engomado: this.vehiculoDat['engomado'],
        marcaMotor: this.vehiculoDat['marcaMotor'],
        transmision: this.vehiculoDat['transmision'],
      })
      setTimeout(() => {
        this.form_vehiculo.controls['placas'].disable()
        
        this.form_vehiculo.controls['marca'].setValue(this.vehiculoDat['marca'])
        setTimeout(() => {
          this.form_vehiculo.controls['modelo'].setValue(this.vehiculoDat['modelo'])
          setTimeout(() => {
            this.form_vehiculo.controls['anio'].setValue(this.vehiculoDat['anio'])
          }, 200);
        }, 200);
      }, 500);
      
      
    }
  }
  consultaMarcas(){
    this._vehiculos.get_marcas().then(({contenido,data})=>{
      if (contenido) {
        this.marcas = data
      }
    })
  }
  listaColores(){
    this._vehiculos.getColores().then(({contenido,data})=>{
      if (contenido) {
        this.colores = data
      }
    })
  }
  listaClientes(){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._clientes.ListaClientes().then(({existe,clientes})=>{
          if (existe) {
            this.listaPlacas = []
            clientes.map(async(cli)=>{
              if (!cli['vehiculos']) cli['vehiculos'] = []
              cli['vehiculos'] = await  this._publicos.crearArreglo2(cli['vehiculos'])
              cli['vehiculos'].map(v=>{
                this.listaPlacas.push(v['placas'])
              })
            })
            this.clientes = clientes
          }
        })
      } else {
        console.log("No data available");
      }
    })
    
  }
  

  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(100),
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }
  crearFormularioLlenadoManual(){
    let cliente = this.cliente 
    if (!cliente) cliente = ''
    let vehiculo = ''
    if(this.vehiculo) vehiculo = this.vehiculo
    
    this.form_vehiculo = this.fb.group({
      id:[vehiculo,[]],
      cliente:[cliente,[Validators.required]],
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
    // this.form_vehiculo.controls['engomado'].disable()
  }
  guardarLlenadoManual(){
    const getVehiculo = this.form_vehiculo.value
    let saveInfo = {
      cliente: getVehiculo['cliente'],
      placas: getVehiculo['placas'],
      marca: getVehiculo['marca'],
      modelo: getVehiculo['modelo'],
      categoria: getVehiculo['categoria'],
      anio: getVehiculo['anio'],
      cilindros: getVehiculo['cilindros'],
      color: getVehiculo['color'],
      engomado: getVehiculo['engomado'],
      transmision: getVehiculo['transmision'],
    }
    if(getVehiculo['marcaMotor']) saveInfo['marcaMotor'] = getVehiculo['marcaMotor']
    if(getVehiculo['vinChasis']) saveInfo['vinChasis'] = getVehiculo['vinChasis']
    if(getVehiculo['no_motor']) saveInfo['no_motor'] = getVehiculo['no_motor']
    if(getVehiculo['id']) saveInfo['id'] = getVehiculo['id']
    // console.log(saveInfo);
    
    if (!saveInfo['id']) {
       saveInfo['id']  = push(child(ref(db), 'posts')).key
       this._vehiculos.registra_Vehiculo(saveInfo['cliente'],saveInfo).then(({registro,contador})=>{
          if (registro) {
            this._vehiculos.registraPlacas(contador,saveInfo['placas']).then(({registro})=>{
              if (registro) {
                this.resetFormVehiculo()
                this.myControl.setValue('')
                this._publicos.mensajeCorrecto('Se registro vehiculo correctamente')
                this.dataVehiculo.emit( {registro: true, vehiculo: saveInfo})
              }
            })
          }else{
            this._publicos.mensajeIncorrecto('Se registro vehiculo correctamente')
          }
       })
    }else{
      saveInfo['placas'] = this.vehiculoDat['placas']
      // console.log('actualiza informacion: ', `clientes/${saveInfo['cliente']}/${saveInfo['id']}`);
      const updates = {};
      updates[`clientes/${saveInfo['cliente']}/vehiculos/${saveInfo['id']}`] = saveInfo;
      update(ref(db), updates).then(()=>{
        this.dataVehiculo.emit( {registro: true, vehiculo: saveInfo})
        }).catch(ans=>{
          this.dataVehiculo.emit( {registro: false})
        })
    }
    
  }
  vericainfo(){
    const cliente = this.myControl.value
    if (!cliente) this.form_vehiculo.controls['cliente'].setValue('')    
  }
  placasVerifica(){
    const placas = this.form_vehiculo.controls['placas'].value
    this.existenPlacas = false
    this.listaPlacas.map(p=>{
      if(String(p).toLowerCase() === String(placas).toLowerCase()) {
        this.existenPlacas = true
        return
      }
    })
  }
  
  verificarEngomado(){
    const placas = String(this.form_vehiculo.controls['placas'].value).trim()
    if (placas.length>=6) {
      this._vehiculos.engomado(placas).then((engomado)=>{
          this.form_vehiculo.controls['engomado'].setValue(engomado)
      })
    }
  }
  validaCampo(campo: string){
    return this.form_vehiculo.get(campo).invalid && this.form_vehiculo.get(campo).touched
  }
  displayFn(val: any): string {
    return val && (val.fullname ) ? (val.fullname) : ''
  }
  infoAdiciona(val:any){
    if (val===null) {
      return
    }
    this.form_vehiculo.controls['cliente'].setValue(val.id)
  }
  submarcas(){
    let marca =this.form_vehiculo.controls['marca'].value
    
    if (marca!=='' && marca!==null) { 
      const modelos = this.marcas.find(option=>option.id === marca)
      this.arrayModelos = modelos
    }
  }
  aniosModelo(){
    this.listaArrayAnios=[]
    const marca =this.form_vehiculo.controls['marca'].value
    const modelo =this.form_vehiculo.controls['modelo'].value
    if (marca && modelo) {
      const filtro = this.arrayModelos.find(m=>m['modelo'] === modelo)
      const anios:any[]= filtro['anios']
      this.listaArrayAnios = anios
      this.form_vehiculo.controls['categoria'].setValue(filtro['categoria'])
      // this.listaArrayAnios = filtro['anios']
    }
  }
  resetFormVehiculo(){
    let cliente = ''
    if(this.cliente) cliente = this.cliente
    this.form_vehiculo.reset({
      id: '',
      cliente: cliente,
      placas: '',
      vinChasis: '',
      marca: '',
      modelo: '',
      categoria: '',
      anio: '',
      cilindros: '',
      no_motor: '',
      color: '',
      engomado: '',
      marcaMotor: '',
      transmision: '',
    })
  }











  
  private _filter(value: any[]): string[] {
    if (value===null) {
      return null
    }
    const filterValue = String(value).toLocaleLowerCase()
    let data = []
    data = this.clientes.filter(option => option.fullname.toLowerCase().includes(filterValue))
    return data
  }
}
