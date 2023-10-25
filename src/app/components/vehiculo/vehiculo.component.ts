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
import { AutomaticosService } from 'src/app/services/automaticos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css']
})
export class VehiculoComponent implements OnInit, OnChanges  {

  

  
  constructor(private fb: FormBuilder, private _vehiculos: VehiculosService, private _clientes : ClientesService,
    private _publicos: ServiciosPublicosService, private _security:EncriptadoService,private _campos: CamposSystemService,
    private _automaticos: AutomaticosService) {
      this.dataVehiculo = new EventEmitter()
    }

    _rol:string; SUCURSAL:string

    miniColumnas:number = 100

    @Input() data_cliente
    
  
    @Output() dataVehiculo : EventEmitter<any>
  
    form_vehiculo: FormGroup;
    myControl = new FormControl('');
    filteredOptions: Observable<any[]>
    existenPlacas:boolean = false
   
    colores:any=              [...this._vehiculos.colores_autos];
    anios:any=                [...this._vehiculos.anios];
    marcas_vehiculos:any=     this._vehiculos.marcas_vehiculos
    marcas_vehiculos_id = []
    array_modelos = []
    
    clientes = []
    listaPlacas =[]

    faltante_s 
    salvando:boolean

    sonPlacasIguales: boolean = false
    cliente_actual:string
    
  ngOnInit(): void {
    this.rol()
    this.crearFormularioLlenadoManual()
    this.automaticos()
    
    this.consultaPlacas()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data_cliente']) {
      const nuevoValor = changes['data_cliente'].currentValue;
      const valorAnterior = changes['data_cliente'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      
        setTimeout(()=>{
          if (nuevoValor && nuevoValor['id']) {
           this.cargaDataVehiculo(nuevoValor)
          } else  if (nuevoValor === valorAnterior) {
            this.cargaDataVehiculo(valorAnterior)
          } else  {
            this.cargaDataVehiculo({})
          }
        },500)
      
    }
  }
  consultaPlacas(){{
    const starCountRef = ref(db, `placas`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.listaPlacas = snapshot.val()
      } 
    })
  }}

  rol(){
    const { rol, sucursal, uid} = this._security.usuarioRol()
    if (rol === 'cliente')  this.cliente_actual = uid
    
    this._rol = rol
    this.SUCURSAL = sucursal;
  }
  cargaDataVehiculo(nuevoValor){
    const {sucursal, id} = nuevoValor
    this.form_vehiculo.reset({sucursal, cliente:id})
  }
  
  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(100),
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }
  crearFormularioLlenadoManual(){
      this.form_vehiculo = this.fb.group({
        id:['',[]],
        cliente:['',[Validators.required]],
        placas:['',[Validators.required,Validators.minLength(6),Validators.maxLength(7)]],
        placas_verificar:['',[Validators.required,Validators.minLength(6),Validators.maxLength(7)]],
        vinChasis:[''],
        marca:['',[Validators.required]],
        modelo:['',[Validators.required]],
        modelo_extra:['',[]],
        categoria:['',[Validators.required]],
        categoria_extra:['',[]],
        anio:['',[Validators.required]],
        cilindros:['',[Validators.required]],
        no_motor:[''],
        color:['',[Validators.required]],
        engomado:['',[Validators.required]],
        marcaMotor:['',[]],
        sucursal:['',[]],
        transmision:['',[]]
      })
      this.vigila()
  }

  vigila(){
    const n = this._publicos.crearArreglo2(this._vehiculos.marcas_vehiculos)
    this.marcas_vehiculos_id = n.map(c=>{
      return c.id
    })
    this.form_vehiculo.get('marca').valueChanges.subscribe((marca: string) => {
      this.array_modelos = []
      if (marca) {
        this.array_modelos = this.marcas_vehiculos[marca]
      }
    })

    this.form_vehiculo.get('placas').valueChanges.subscribe((placas: string) => {
      const placas_verificar = this.form_vehiculo.get('placas_verificar').value;
      this.sonPlacasIguales = verificarPlacasIguales(placas, placas_verificar);
    });
    this.form_vehiculo.get('placas_verificar').valueChanges.subscribe((placas_verificar: string) => {
      const placas = this.form_vehiculo.get('placas').value;
      this.sonPlacasIguales = verificarPlacasIguales(placas_verificar, placas);
    });

    function verificarPlacasIguales(placas: string, placasVerificar: string): boolean {
      let valor = false
      if (placas && placasVerificar) {
        valor = placas.toLowerCase() === placasVerificar.toLowerCase();
      }
      return valor
    }

    this.form_vehiculo.get('modelo').valueChanges.subscribe((modelo: string) => {
      let modelo_ = ''
      if (modelo === 'otro') {
        console.log('muestra campo extra');
        
      } else if (modelo) {
        this.form_vehiculo.controls['modelo_extra'].setValue('')
        this.form_vehiculo.controls['categoria_extra'].setValue('')
        modelo_ = this.array_modelos.find(m=>m.modelo === modelo).categoria
        this.form_vehiculo.controls['categoria'].setValue(modelo_)
      } 
      
    })
    this.form_vehiculo.get('placas').valueChanges.subscribe(async (placas: string) => {
      if (placas) {        
        const existe = this.listaPlacas.find(c=>String(c).trim().toLowerCase() === String(placas).trim().toLowerCase())
        this.existenPlacas = (existe) ? true: false
        let engomado_ = (placas.length>=6) ? await this._vehiculos.engomado(placas) : ''         
        this.form_vehiculo.controls['engomado'].setValue(engomado_)
      }
    })

    this.myControl.valueChanges.subscribe(cliente=>{
      let id_cliente = (cliente instanceof Object) ? cliente.id : ''
      let sucursal = (cliente instanceof Object) ? cliente.sucursal : ''
      this.form_vehiculo.controls['sucursal'].setValue(sucursal)
      this.form_vehiculo.controls['cliente'].setValue(id_cliente)
    })
    setTimeout(() => {
      let cliente =(this._rol === 'cliente') ? this.cliente_actual : ''
      this.form_vehiculo.get('cliente').setValue(cliente)
    }, 1000);
  }
  async guardarLlenadoManual(){
    this.salvando = true
    const  camposRecupera = [ 'cliente','placas','marca','modelo','categoria','anio','cilindros','color','engomado','sucursal','transmision','marcaMotor','vinChasis','no_motor','id']

    const info_get = this._publicos.recuperaDatos(this.form_vehiculo);
    if (info_get.modelo === 'otro') {
      console.log('aqui nueva');
      info_get.modelo = this.form_vehiculo.get('modelo_extra').value 
      info_get.categoria = this.form_vehiculo.get('categoria_extra').value 
    }
    const saveInfo:any = this._publicos.nuevaRecuperacionData(info_get, camposRecupera)
    console.log(saveInfo);
    
    
    const {ok, faltante_s}  =this._publicos.realizavalidaciones_new(saveInfo, this._vehiculos.obligatorios)
    
    this.faltante_s = faltante_s
    
    if (!this.sonPlacasIguales)  this.faltante_s += ', Las placas ingresadas no coinciden'

    if (!ok || this.existenPlacas || !this.sonPlacasIguales) {
      setTimeout(() => {
        this.salvando = false
      }, 1000);
      return
    }

    const updates = {};
    const {sucursal, cliente, id} = info_get
    let nuevo_id  = ''

    if (info_get.id) {
      // updates[`vehiculos`] = saveInfo;
      
      updates[`vehiculos/${id}`] = saveInfo;
      nuevo_id = id
    }else{
      // const {sucursal, id } = this.data_cliente
      const clave_nueva = this._publicos.generaClave()
      const claves_encontradas = await this._automaticos.consulta_ruta('claves_vehiculos')
      const valorNoDuplicado = await [...new Set([...claves_encontradas, clave_nueva])];
      updates['claves_vehiculos'] = valorNoDuplicado

      updates[`vehiculos/${clave_nueva}`] = saveInfo;
      this.listaPlacas.push(String(saveInfo.placas).toLowerCase())
      updates[`placas`] = this.listaPlacas;
      nuevo_id = clave_nueva
    }

    update(ref(db), updates).then(()=>{
      this.dataVehiculo.emit( nuevo_id )
      this.existenPlacas = false
      // const {sucursal, id} = saveInfo
      setTimeout(() => {
        this.salvando = false
      }, 1000);
      

      this.form_vehiculo.reset({sucursal, cliente})
      this._publicos.swalToast('Se registro vehiculo!!',1,'top-start')
    })
    .catch(err=>{
      console.log(err);
      this._publicos.swalToast('Error al registrar vehiculo',0,'top-start')
    })
  }
  validaCampo(campo: string){
    return this.form_vehiculo.get(campo).invalid && this.form_vehiculo.get(campo).touched
  }
  displayFn(val: any): string {
    return val && (val.fullname ) ? (val.fullname) : ''
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
