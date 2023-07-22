import { Component, EventEmitter, Input, OnInit, Output,SimpleChanges,OnChanges  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

import { child, getDatabase, onValue, push, ref, update } from "firebase/database";
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CamposSystemService } from 'src/app/services/campos-system.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css']
})
export class VehiculoComponent implements OnInit, OnChanges  {

  

  
  constructor(private fb: FormBuilder, private _vehiculos: VehiculosService, private _clientes : ClientesService,
    private _publicos: ServiciosPublicosService, private _security:EncriptadoService,private _campos: CamposSystemService,) {
      this.dataVehiculo = new EventEmitter()
    }

    ROL:string; SUCURSAL:string

    listaArrayAnios = [ ...this._campos.anios]

    miniColumnas:number = 100

  
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
    colores:any=[];
    engomadoColors:any=[];
    clientes = []
    listaPlacas =[]
    
  ngOnInit(): void {
    this.rol()
    this.crearFormularioLlenadoManual()
    this.consultaMarcas()
    this.listaColores()
    this.listaClientes()
    this.automaticos()
    // this.cargaDataVehiculo()
    
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['cliente']) {
      const nuevoValor = changes['cliente'].currentValue;
      const valorAnterior = changes['cliente'].previousValue;
      
    }
    if (changes['vehiculo']) {
      const nuevoValor = changes['vehiculo'].currentValue;
      const valorAnterior = changes['vehiculo'].previousValue;
      this.cargaDataVehiculo()
    }
  }
  rol(){
    const { rol, sucursal} = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal;
    
    this.listaClientes()
  }
  cargaDataVehiculo(){

      const cliente = (this.cliente)? this.cliente : null
      const vehiculo = (this.vehiculo)? this.vehiculo : null
      // console.log(vehiculo);
      // console.log(cliente);
      if (vehiculo) {
        this._vehiculos.consulta_vehiculo_new(cliente, vehiculo).then((vehiculo:any)=>{
          // console.log(vehiculo);
          const carga = [ 'id', 'cliente', 'placas', 'vinChasis',  'cilindros', 'no_motor', 'color', 'engomado', 'marcaMotor', 'transmision'
          ]
          this.form_vehiculo.controls['placas'].disable()
          // this.form_vehiculo.get('marca').valueChanges.subscribe((marca: string) => {
          //   console.log(marca);
          //   const modelos = this.marcas.find(option=>option.id === vehiculo.marca)
          //   this.arrayModelos = modelos
          // })
          carga.forEach(c=>{
            this.form_vehiculo.controls[c].setValue(vehiculo[c])
          })
          setTimeout(() => {
            this.form_vehiculo.controls['marca'].setValue(vehiculo['marca'])
            setTimeout(() => {
              this.form_vehiculo.controls['modelo'].setValue(vehiculo['modelo'])
              setTimeout(() => {
                this.form_vehiculo.controls['anio'].setValue(vehiculo['anio'])
              }, 300);
            }, 300);
          }, 500); 
        })
      }else{
        this.form_vehiculo.reset({
          cliente,
          id: vehiculo
        })
      }
      
    
    // if (this.vehiculo) {
    //   // console.log(this.vehiculo);
    //   // console.log(this.vehiculoDat['placas']);
      
    //   this.form_vehiculo.reset({
    //     id: this.vehiculoDat['id'],
    //     cliente: this.vehiculoDat['cliente'],
    //     placas: this.vehiculoDat['placas'],
    //     vinChasis: this.vehiculoDat['vinChasis'],
    //     cilindros: this.vehiculoDat['cilindros'],
    //     no_motor: this.vehiculoDat['no_motor'],
    //     color: this.vehiculoDat['color'],
    //     engomado: this.vehiculoDat['engomado'],
    //     marcaMotor: this.vehiculoDat['marcaMotor'],
    //     transmision: this.vehiculoDat['transmision'],
    //   })
    //   setTimeout(() => {
    //     this.form_vehiculo.controls['placas'].disable()
        
    //     this.form_vehiculo.controls['marca'].setValue(this.vehiculoDat['marca'])
    //     setTimeout(() => {
    //       this.form_vehiculo.controls['modelo'].setValue(this.vehiculoDat['modelo'])
    //       setTimeout(() => {
    //         this.form_vehiculo.controls['anio'].setValue(this.vehiculoDat['anio'])
    //       }, 200);
    //     }, 200);
    //   }, 500);
      
      
    // }
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
    this._clientes.consulta_clientes_new().then((clientes) => {
      // this.clientes = clientes
      this.listaPlacas = []
      clientes.map(cli=>{
        cli.vehiculos = (cli.vehiculos) ? this._publicos.crearArreglo2(cli.vehiculos) : []
        cli.vehiculos.map(v=>{
          this.listaPlacas.push(v['placas'])
        })
      })
      this.clientes = (this.SUCURSAL === 'Todas') ? clientes : clientes.filter(c=>c.sucursal === this.SUCURSAL)
    }).catch((error) => {
      // Manejar el error si ocurre
    });
  }
  

  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(100),
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }
  crearFormularioLlenadoManual(){
    const cliente = (this.cliente ) ? this.cliente  : '' 
    const vehiculo = (this.vehiculo ) ? this.vehiculo  : '' 
    
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
      transmision:['',[]]
    })
    // this.form_vehiculo.controls['engomado'].disable()
  }
  guardarLlenadoManual(){
    
    const getVehiculo = this.form_vehiculo.value
    if(this.vehiculoDat)  getVehiculo.placas = this.vehiculoDat['placas']
    const camposRecupera = [
      'cliente','placas','marca','modelo','categoria','anio','cilindros','color','engomado','transmision','marcaMotor','vinChasis','no_motor','id',
    ]
    const saveInfo:any = this._publicos.nuevaRecuperacionData(getVehiculo, camposRecupera)

    const controls_arr = ['placas','categoria']
          controls_arr.forEach(c=>{
            const control = this.form_vehiculo.get(c);
            if (control.disabled) {
              saveInfo[c] = this.form_vehiculo.get(c).value
            }
          })
    this._vehiculos.registra_vehiculo_new(saveInfo).then((id)=>{
      if(id){
        this.resetFormVehiculo()

        this.myControl.setValue('')
        this._publicos.mensajeCorrecto('Se registro vehiculo correctamente',1)
        this.dataVehiculo.emit( id )
      }else{
        this.dataVehiculo.emit( false )
        // this._publicos.mensajeIncorrecto('Ocurrio un error en el registro de vehiculo')
        this._publicos.mensajeCorrecto('Ocurrio un error en el registro de vehiculo',0)
      }
    })
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
    // this.listaArrayAnios=[]
    // const marca =this.form_vehiculo.controls['marca'].value
    // const modelo =this.form_vehiculo.controls['modelo'].value
    // if (marca && modelo) {
    //   const filtro = this.arrayModelos.find(m=>m['modelo'] === modelo)
    //   const anios:any[]= filtro['anios']
    //   this.listaArrayAnios = anios
    //   this.form_vehiculo.controls['categoria'].setValue(filtro['categoria'])
    //   // this.listaArrayAnios = filtro['anios']
    // }
  }
  resetFormVehiculo(){
    const cliente = (this.cliente)? this.cliente : null
    const id = (this.vehiculo)? this.vehiculo : null
    this.form_vehiculo.reset({
      cliente, id
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
