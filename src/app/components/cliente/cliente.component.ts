import { map, startWith } from 'rxjs/operators';
import { Component, OnInit, Input, Output,EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from '../../services/sucursales.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { ClientesService } from 'src/app/services/clientes.service';

import { child, get, getDatabase, onValue, push, ref, runTransaction, set, update } from "firebase/database"

import { EmailsService } from 'src/app/services/emails.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { Observable } from 'rxjs';
import { EmpresasService } from '../../services/empresas.service';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})


export class ClienteComponent implements OnInit, OnChanges {

  

  
  constructor(private fb: FormBuilder, private _sucursales: SucursalesService, private _publicos: ServiciosPublicosService,
    private _clientes: ClientesService,private _mail: EmailsService,private _security:EncriptadoService, private _empresas: EmpresasService) {
      this.heroeSlec = new EventEmitter()
    }

    @Input() data_cliente
  
    @Output() heroeSlec : EventEmitter<any>
    
    empresaSelect = null
    form_cliente: FormGroup;
    formaEmpresa: FormGroup;
    listaEmpresas=[]
    // sucursales =[]
    // Sucursales = []
    correoExistente: boolean= false
    telefonoExistente: boolean = false
    empresa_valida: boolean = true
    sucursalForm:boolean = false
    empresasSucursal =[]
    arreglo_correos = []
    telefonosInvalidos:any[]=['5555555555','1111111111','0000000000','7777777777','1234567890','0123456789'];
    contadroClientes= 0
    infonew = {}
    muestraFormEmpresa:boolean = false
    
    correo_utilizado: string = 'personal'
    correos = [{value:'personal', show:'Personal'},{value:'sucursal', show:'Sucursal'}];
    
    ROL:string
    SUCURSAL:string
    
    clientes = []
    registraEmpresaShow: boolean = false
  
    myControl_empresa = new FormControl('');
    // options: string[] = ['One', 'Two', 'Three'];
    filteredOptions_empresa: Observable<string[]>;
  
    sucursales_array = [...this._sucursales.lista_en_duro_sucursales]
    faltante_s:string

    correos_existentes = []
  ngOnInit(): void {
    this.roles()
    this.crearFormularioClientes()
    this.crearFormEmpresa()
    this.automaticos_empresa()
    this.consulta_email_ocupados()
    
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data_cliente']) {
      const nuevoValor = changes['data_cliente'].currentValue;
      const valorAnterior = changes['data_cliente'].previousValue;
      // console.log({nuevoValor, valorAnterior});

      setTimeout(()=>{
        if (nuevoValor && nuevoValor['id']) {
         this.cargaDataForm(nuevoValor)
        } else  if (nuevoValor === valorAnterior) {
          this.cargaDataForm(valorAnterior)
        } else if(!nuevoValor && !valorAnterior){
          const sucursal = (this.SUCURSAL === 'Todas') ? '': this.SUCURSAL 
          this.form_cliente.reset(sucursal)
        }
      },500)
      

    }
  }
  cargaDataForm(cliente){
    if (cliente['id']) {
      const data_recuperada = this._publicos.nuevaRecuperacionData(cliente, this._clientes.camposCliente )

      data_recuperada.no_cliente = String(data_recuperada.no_cliente).toUpperCase()
      this.form_cliente.reset(Object({...data_recuperada, uid: data_recuperada.id}))
      // console.log(data_recuperada);
      if (data_recuperada.usuario) {
        this.form_cliente.controls['correo'].disable();
      }else{
        this.form_cliente.controls['correo'].enable();
      }
    }
  }

  automaticos_empresa(){
    this.filteredOptions_empresa = this.myControl_empresa.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  consulta_email_ocupados(){
    const starCountRef = ref(db, `correos`)
    onValue(starCountRef, (snapshot) => {
      this.correos_existentes = (snapshot.exists()) ? snapshot.val() : []
    })
  }
  roles(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
  }
 
  coloca(val:string){
    // console.log(this.data_cliente);
    
    if(val) this.form_cliente.controls['correo'].setValue('patito@gmail.com')
    else  this.form_cliente.controls['correo'].setValue(val)
  }
 
  verificarTelefono(){
    const telefono = this.form_cliente.controls['telefono_movil'].value
    const info = this.telefonosInvalidos.find(o=>o === telefono)
    this.telefonoExistente = false
    if (info) this.telefonoExistente = true
  }
  crearFormularioClientes(){
    let sucursal = (this.SUCURSAL === 'Todas') ? '' : this.SUCURSAL 
    this.form_cliente = this.fb.group({
      uid:['',[]],
      no_cliente:['',[Validators.required,Validators.minLength(14), Validators.maxLength(14)]],
      nombre:['',[Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      apellidos:['',[Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      correo:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      correo_sec:['',[Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      telefono_fijo:['',[Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^[0-9]+$")]],
      telefono_movil:['',[Validators.required,Validators.minLength(3), Validators.maxLength(10),Validators.pattern("^[0-9]+$")]],
      tipo:['',[Validators.required]],
      sucursal:[sucursal,[Validators.required]],
      empresa:['',[]]
    })    
    this.vigila()
  }
  vigila(){
    this.form_cliente.get('tipo').valueChanges.subscribe(async (tipo: string) => {
      if (tipo === 'flotilla') {
        this.form_cliente.get('empresa').enable();
        this.empresa_valida = false
        const sucursal =  this.form_cliente.get('sucursal').value
        if (sucursal) {
          this.empresasSucursal = await this._empresas.consulta_empresas(sucursal)
        }
      } else {
        this.form_cliente.get('empresa').disable();
        this.form_cliente.get('empresa').setValue('');
        this.empresa_valida = true
      }
    });
    this.form_cliente.get('sucursal').valueChanges.subscribe(async (sucursal: string) => {
      if (sucursal) {
        this.empresasSucursal = await this._empresas.consulta_empresas(sucursal)
      }
      this.actualizaNoCliente()
    })
    this.form_cliente.get('nombre').valueChanges.subscribe((nombre: string) => {
        this.actualizaNoCliente()
    })
    this.form_cliente.get('apellidos').valueChanges.subscribe((apellidos: string) => {
        this.actualizaNoCliente()
    })
    this.form_cliente.get('correo').valueChanges.subscribe((correo: string) => {
      if (correo) {
        const existe = this.correos_existentes.find(c=>c === correo)
        this.correoExistente = (existe) ? true : false
      }else{
        this.correoExistente = false
      }
    })
  }
  crearFormEmpresa(){
    this.formaEmpresa = this.fb.group({
      id:['',[]],
      empresa:['',[Validators.required, Validators.minLength(4)]]
    })
  }
  
  registraEmpresa(){
    const data = this.formaEmpresa.value
    const filterValue = String(data.empresa).trim().toLowerCase()
    const encontrado = this.empresasSucursal.filter(option => String(option.empresa).toLowerCase().includes(filterValue));
    // console.log(encontrado);

    if (filterValue.length > 0) {
      if (encontrado.length > 0) {
        this._publicos.mensajeSwal('Ya existe una empresa registrada con el nombre',0,false, filterValue)
        this.formaEmpresa.reset()
        this.myControl_empresa.setValue(filterValue)
      }else{
        const IDSucursal =  this.form_cliente.controls['sucursal'].value        
        const clave = this._publicos.generaClave()
        // `empresas/${ID}/${data['id']}`
        const updates = {[`empresas/${IDSucursal}/${clave}/empresa`]: filterValue}        
        update(ref(db), updates).then(()=>{{
          // this.listadoEmpresas()
          this.empresaSelect = clave
          this.form_cliente.controls['tipo'].setValue('flotilla')
          this.form_cliente.controls['empresa'].setValue(clave)
          this.formaEmpresa.reset()
          this.registraEmpresaShow = false
        }})
      }
    }
  }
  validarEmpresa(campo: string){
    return this.formaEmpresa.get(campo).invalid && this.formaEmpresa.get(campo).touched
  }
  empresaValida(){
    const data = this.form_cliente.value
    this.empresa_valida = true
    if (data['tipo'] === 'particular') return
    if (!data['empresa']) this.empresa_valida = false
  }
  
  async mensajeEmpresa(valor:boolean){
    this.muestraFormEmpresa = valor
    this.formaEmpresa.reset()
  }
  validarCampo(campo: string){
    return this.form_cliente.get(campo).invalid && this.form_cliente.get(campo).touched
  }
  async actualizaNoCliente() {
    
    const nombre = this.form_cliente.controls['nombre'].value?.trim();
    const apellidos = this.form_cliente.controls['apellidos'].value?.trim();
    const uid = this.form_cliente.controls['uid'].value?.trim();
    let sucursal = this.form_cliente.controls['sucursal'].value?.trim();
  
   
    if (!uid && nombre?.length >= 2 && apellidos?.length >= 2 && sucursal) {
      try {
        // const data = await this._sucursales.inforSucursalUnica(sucursal);
        await this.constverifica(sucursal)
        const nombre_sucursal = this.sucursales_array.find(s=>s.id === sucursal).sucursal
        // const nombreSucursal = data['sucursal'];
        const date = new Date();
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const anio = date.getFullYear().toString().slice(-2);
        const secuencia = this.contadroClientes.toString().padStart(4, '0');
        const nombreCotizacion = `${nombre?.slice(0, 2)}${apellidos?.slice(0, 2)}${nombre_sucursal?.slice(0, 2)}${mes}${anio}${secuencia}`;
        this.form_cliente.controls['no_cliente'].setValue(nombreCotizacion.toUpperCase());
      } catch (error) {
        this._publicos.mensajeCorrecto(`error: ${error}`, 0);
      }
    } else if(uid) {
      // this.form_cliente.controls['no_cliente'].setValue('');
    } else {
      this.form_cliente.controls['no_cliente'].setValue('');
    }
  }
  
  async guardarCliente(){
    
    const info_get = this._publicos.recuperaDatos(this.form_cliente);

    const campos_cliente                 = [ ...this._clientes.campos_cliente ]
    const campos_permitidos_Actualizar   = [ ...this._clientes.campos_permitidos_Actualizar ]
    const campos_opcionales              = [ ...this._clientes.campos_opcionales ]
    const campos_permitidos_new_register = [ ...campos_cliente,...campos_opcionales ]


    const saveInfo = {};

    campos_cliente.forEach(campo=>{
      saveInfo[campo] = info_get[campo]?.trim()
    });
    campos_opcionales.forEach(campo=>{
      saveInfo[campo] = (info_get[campo]) ? String(info_get[campo]).trim(): null;
    });

    if(info_get.tipo  === 'flotilla') {
      campos_cliente.push('empresa'); 
      campos_permitidos_Actualizar.push('empresa');
      campos_permitidos_new_register.push('empresa');
    }

    const { ok, faltante_s } = this._publicos.realizavalidaciones_new(info_get,campos_cliente)
    
    this.faltante_s = this._publicos.reemplaza_strig(faltante_s,[...this._clientes.campos_show_validaciones])
    // console.log();
    
    if (ok && !faltante_s) {
      const updates = {};
      const mensaje = (info_get.uid) ? 'Actualización de cliente correcto!!': 'Registro de cliente correcto!!'
      if (info_get.uid) {
        const informacion_recuperada = this._publicos.nuevaRecuperacionData(info_get,campos_permitidos_Actualizar);
        campos_permitidos_Actualizar.forEach(campo=>{
          if (informacion_recuperada [campo] !== campo) {
          // if (informacion_recuperada [campo] !== this.data[campo]) {
            updates[`clientes/${info_get.sucursal}/${info_get.uid}/${campo}`] = informacion_recuperada [campo]
          }
        })
      }else{
        const informacion_recuperada = this._publicos.nuevaRecuperacionData(info_get,campos_permitidos_new_register);
        const nueva_clave_generada = this._publicos.generaClave()

        campos_permitidos_new_register.forEach(campo=>{
          if (informacion_recuperada [campo]) {
            updates[`clientes/${info_get.sucursal}/${ nueva_clave_generada }/${campo}`] = informacion_recuperada [campo]
          }
        })
        updates[`clientes/${info_get.sucursal}/${ nueva_clave_generada }/status`] = true
        this.correos_existentes.push(informacion_recuperada.correo)
        updates[`correos`] = this.correos_existentes
      }
      
      const existen_campos_update = Object.keys(updates)
      if (existen_campos_update.length) {
        try {
          await update(ref(db), updates);
          this._publicos.mensajeSwal(`${mensaje}`,1, true, `...`);
          this.resetForm();
          this.heroeSlec.emit({ cliente: '', status: true });
        } catch (err) {
          this.heroeSlec.emit(Object({ cliente: null, status: false }));
          this._publicos.mensajeSwal(`Ocurrió un error`,0, true, `...`);
        }
      }else{
        this.heroeSlec.emit( {cliente:'', status: true})
      }
    }
  }
  emiteFalse(){
    this.heroeSlec.emit( Object({CerrarModal: false}) )
  }
  resetForm(){
    this.form_cliente.reset()
  }
  listadoEmpresas(sucursal){
    const starCountRef = ref(db, `empresas/${sucursal}`)
    onValue(starCountRef, async (snapshot) => {
      const empresas = await this._empresas.consulta_sucursales_new(sucursal)
      this.empresasSucursal = empresas
    })
    
  }
  limpiarFormEmpresa(){
    this.formaEmpresa.reset()
  }
  empresaSeleccionda(data){
    this.formaEmpresa.controls['empresa'].setValue( data.empresa )
    this.formaEmpresa.controls['id'].setValue( data.id )
  }
  private _filter(value: string): string[] {
    let data = []
    if (value['empresa']) {
      
    }else{
      const filterValue = value.toLowerCase();
      data = this.empresasSucursal.filter(option => String(option.empresa).toLowerCase().includes(filterValue));
    }
    return data
  }
  verificaInfoEmpresa(){
    const valor = this.myControl_empresa.value
    if (typeof valor === 'string') {
      this.formaEmpresa.controls['empresa'].setValue(valor)
    }
  }
  displayFn(user: any): any {
    return user && user.empresa ? user.empresa : '';
  }
  constverifica(sucursal){
    const postRef = ref(db, `clientes/${sucursal}`);
    runTransaction(postRef, (post) => {
      if (post) {
        this.contadroClientes = this._publicos.crearArreglo2(post).length + 1
      }
    })
  }
  
}
