import { map, startWith } from 'rxjs/operators';
import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
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
const postRef = ref(db, '/clientes');
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})


export class ClienteComponent implements OnInit {

  

  
  constructor(private fb: FormBuilder, private _sucursales: SucursalesService, private _publicos: ServiciosPublicosService,
    private _clientes: ClientesService,private _mail: EmailsService,private _security:EncriptadoService, private _empresas: EmpresasService) {
      this.heroeSlec = new EventEmitter()
    }

    @Input() cliente:any={}
    @Input() sucursal:string
    @Input() data:any
    @Input() id:string
  
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
  ngOnInit(): void {
    this.roles()
    this.crearFormularioClientes()
    this.crearFormEmpresa()
    this.perteneceA()
    this.automaticos_empresa()    
  }
  automaticos_empresa(){
    this.filteredOptions_empresa = this.myControl_empresa.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  roles(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
      
    if(this.SUCURSAL !== 'Todas') this.listadoEmpresas(this.SUCURSAL)
    this._clientes.consulta_clientes_new().then((clientes) => {
      this.clientes = clientes
      // this.contadroClientes = clientes.length +1 
      this.arreglo_correos = clientes.map(c=>{
          return c.correo
      })
    }).catch((error) => {
      // Manejar el error si ocurre
    });
  }
  perteneceA(){
    if (this.id) {
      this.informacionGet()
    }else{
      setTimeout(() => {
        this.resetForm()
      }, 200);
    }
  }
  informacionGet(){
    this.form_cliente.reset({
      nombre: this.data['nombre'],
      apellidos: this.data['apellidos'],
      tipo: this.data['tipo'],
      no_cliente: this.data['no_cliente'],
      sucursal: this.data['sucursal'],
      empresa: this.data['empresa'],
      telefono_movil: this.data['telefono_movil'],
      uid: this.id,
      correo_sec: this.data['correo_sec'],
      correo: this.data['correo'],
      telefono_fijo: this.data['telefono_fijo'],
      // correo: this.data['correo'],
    })
  }
 
  coloca(val:string){
    if(val) this.form_cliente.controls['correo'].setValue('patito@gmail.com')
    else  this.form_cliente.controls['correo'].setValue(val)
  }
  verificarCorreoExiste(){
    if (this.correo_utilizado === 'sucursal') {
      this.correoExistente = false
    }else{
      const correo = this.form_cliente.controls['correo'].value
      const info = this.arreglo_correos.find(o=>o === correo)
      this.correoExistente = false
      if (info) this.correoExistente = true
    }
  }
  verificarTelefono(){
    const telefono = this.form_cliente.controls['telefono_movil'].value
    const info = this.telefonosInvalidos.find(o=>o === telefono)
    this.telefonoExistente = false
    if (info) this.telefonoExistente = true
  }
  crearFormularioClientes(){
    let sucursal =  null
    if (this.sucursal!=='Todas') {
      sucursal = this.sucursal
    }
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
    let isFlotilla: boolean = false;
    this.form_cliente.get('tipo').valueChanges.subscribe((tipo: string) => {
      if (tipo === 'flotilla') {
        const data = this.formaEmpresa.value
        // Habilitar el campo "empresa" si el tipo es flotilla
        this.form_cliente.get('empresa').enable();
        this.empresa_valida = false
        if (this.data) {
          if (this.data.empresa) {
            this.empresaSelect = this.data.empresa
          }
        }
      } else {
        // Deshabilitar el campo "empresa" si el tipo es particular
        this.form_cliente.get('empresa').disable();
        this.form_cliente.get('empresa').setValue('');
        this.empresa_valida = true
      }
    });
    this.form_cliente.get('sucursal').valueChanges.subscribe((sucursal: string) => {
      if (sucursal) {
        this.listadoEmpresas(sucursal)
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
        this._publicos.mensajeSwalError('Ya existe una empresa registrada con el nombre',false, filterValue)
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
    let sucursal = this.sucursal;
  
    if (this.sucursal === 'Todas') {
      sucursal = this.form_cliente.controls['sucursal'].value;
    }
  
    if (!uid && nombre?.length >= 2 && apellidos?.length >= 2 && sucursal) {
      try {
        const data = await this._sucursales.inforSucursalUnica(sucursal);
        await this.constverifica()
        
        const nombreSucursal = data['sucursal'];
        const date = new Date();
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const anio = date.getFullYear().toString().slice(-2);
        const secuencia = this.contadroClientes.toString().padStart(4, '0');
        const nombreCotizacion = `${nombre?.slice(0, 2)}${apellidos?.slice(0, 2)}${nombreSucursal?.slice(0, 2)}${mes}${anio}${secuencia}`;
        this.form_cliente.controls['no_cliente'].setValue(nombreCotizacion.toUpperCase());
      } catch (error) {
        this._publicos.mensajeIncorrecto(`error: ${error}`);
      }
    } else if(uid) {
      // this.form_cliente.controls['no_cliente'].setValue('');
    } else {
      this.form_cliente.controls['no_cliente'].setValue('');
    }
  }
  
  async guardarCliente(){
    const info_get = this._publicos.recuperaDatos(this.form_cliente);
    // console.log(info_get);
    
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
      const mensaje = (this.id) ? 'Actualización de cliente correcto!!': 'Registro de cliente correcto!!'
      if (this.id) {
        const informacion_recuperada = this._publicos.nuevaRecuperacionData(info_get,campos_permitidos_Actualizar);
        
        campos_permitidos_Actualizar.forEach(campo=>{
          if (informacion_recuperada [campo] !== this.data[campo]) {
            updates[`clientes/${this.id}/${campo}`] = informacion_recuperada [campo]
          }
        })
      }else{

        const informacion_recuperada = this._publicos.nuevaRecuperacionData(info_get,campos_permitidos_new_register);
        const nueva_clave_generada = this._publicos.generaClave()

        campos_permitidos_new_register.forEach(campo=>{
          if (informacion_recuperada [campo]) {
            updates[`clientes/${ nueva_clave_generada }/${campo}`] = informacion_recuperada [campo]
          }
        })
        updates[`clientes/${ nueva_clave_generada }/status`] = true
      }
      const existen_campos_update = Object.keys(updates)
      if (existen_campos_update.length) {
        try {
          await update(ref(db), updates);
          this._publicos.mensajeSwal(`${mensaje}`, true, `...`);
          this.resetForm();
          this.heroeSlec.emit({ cliente: '', status: true });
        } catch (err) {
          this.heroeSlec.emit(Object({ cliente: null, status: false }));
          this._publicos.mensajeSwalError(`Ocurrió un error`, true, `...`);
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
    let sucu = this.sucursal
    if (this.sucursal === 'Todas') sucu = ''
    this.form_cliente.reset({
      tipo:'particular',  sucursal: sucu,
      no_cliente:'',      uid:'',
      nombre:'',          apellidos:'',
      correo:'',          telefono_fijo:'',
      telefono_movil:'',  empresa: '',
      correo_sec:''
    })
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
  constverifica(){
    runTransaction(postRef, (post) => {
      if (post) {
        this.contadroClientes = this._publicos.crearArreglo2(post).length + 1
      }
    })
  }
  
}
