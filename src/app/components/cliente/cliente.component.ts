import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from '../../services/sucursales.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { ClientesService } from 'src/app/services/clientes.service';

import { child, get, getDatabase, onValue, push, ref, set, update } from "firebase/database"
import Swal from 'sweetalert2';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})


export class ClienteComponent implements OnInit {

  @Input() cliente:any={}
  @Input() sucursal:string
  @Input() data:any
  @Input() id:string

  @Output() heroeSlec : EventEmitter<any>
  
  empresaSelect = null
  form_cliente: FormGroup;
  formaEmpresa: FormGroup;
  listaEmpresas=[]
  SUCURSAL:string
  sucursales =[]
  Sucursales = []
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
  constructor(private fb: FormBuilder, private _sucursales: SucursalesService, private _publicos: ServiciosPublicosService,
    private _clientes: ClientesService) {
      this.heroeSlec = new EventEmitter()
    }

  ngOnInit(): void {
    this.crearFormularioClientes()
    this.crearFormEmpresa()
    this.listaSucursales()
    this.listadoEmpresas()
    this.listaClientes()

    this.perteneceA()
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
      telefono_movil: this.data['telefono_movil'],
      id: this.data['id'],
      correo_sec: this.data['correo_sec'],
      telefono_fijo: this.data['telefono_fijo'],
      correo: this.data['correo'],
    })
  }
  listaClientes(){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._clientes.ListaClientes().then(({existe,clientes})=>{
          if (existe) {
            this.contadroClientes = clientes.length + 1
            clientes.map(c=>{
              this.arreglo_correos.push(c['correo'])
            })
          }
      })
      }
    })
  }
  verificarCorreoExiste(){
    const correo = this.form_cliente.controls['correo'].value
    const info = this.arreglo_correos.find(o=>o === correo)
    this.correoExistente = false
    if (info) this.correoExistente = true
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
      id:['',[]],
      no_cliente:['',[Validators.required]],
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
  }
  crearFormEmpresa(){
    this.formaEmpresa = this.fb.group({
      empresa:['',[Validators.required, Validators.minLength(4)]]
    })
  }
  
  registraEmpresa(){
    let IDSucursal = '';
    (this.sucursal ==='Todas')? IDSucursal = this.form_cliente.controls['sucursal'].value: IDSucursal = this.sucursal
    if (IDSucursal) {
      const nombre = this.formaEmpresa.controls['empresa'].value
      if (nombre) {
        const newPostKey = push(child(ref(db), 'posts')).key
        const tempData = {
          id: newPostKey,
          empresa: nombre
        }
        this._clientes.registraEmpresa(IDSucursal,tempData).then(({registro})=>{
          if (registro) {
            this.listadoEmpresas()
              this.empresaSelect = newPostKey
              this.form_cliente.controls['empresa'].setValue(newPostKey)
              this.formaEmpresa.reset()
              this.muestraFormEmpresa = false
          }
        })
      }

    }else{
      this._publicos.mensajeIncorrecto('seleccionar sucursal para poder registrar empresa')
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
  empresa(){
    const tipo = this.form_cliente.controls['tipo'].value
    const empresa = this.form_cliente.controls['empresa'].value
    // let sucursal = this.form_cliente.controls['sucursal'].value
    
    if (tipo === 'flotilla') {
      this.form_cliente.controls['empresa'].enable()
      if (!empresa) this.empresa_valida =  false
    }else{
      this.form_cliente.controls['empresa'].disable()
      this.form_cliente.controls['empresa'].setValue('')
      this.empresa_valida = true
    } 
    // (sucursal) ? this.sucursalForm = true : this.sucursalForm = false
    // console.log(this.empresa_valida);
  }
  async mensajeEmpresa(valor:boolean){
    this.muestraFormEmpresa = valor
    this.formaEmpresa.reset()
  }
  validarCampo(campo: string){
    return this.form_cliente.get(campo).invalid && this.form_cliente.get(campo).touched
  }
  async actualizaNoCliente(){
    const nombre = String(this.form_cliente.controls['nombre'].value).trim()
    const apellidos = String(this.form_cliente.controls['apellidos'].value).trim()

    let sucu = this.sucursal;
    (this.sucursal === 'Todas')? sucu = this.form_cliente.controls['sucursal'].value : sucu = this.sucursal
    const id = String(this.form_cliente.controls['id'].value).trim()
    if (!id) {
      if ((nombre.length >=2) && (apellidos.length >=2 ) && (sucu)) {
        const date: Date = new Date()
        if (sucu!=='Todas' && sucu) {
          this._sucursales.inforSucursalUnica(sucu).then((data)=>{
            const numeroCliente:number = this.contadroClientes//(this.clientes.length) + 1
            const nombreS:string = data['sucursal']
            let mes = ''; let secuencia=''; let ceros = ''
            const anio = String(date.getFullYear())
            if((date.getMonth() +1)<10) { mes = `0${(date.getMonth() +1)}` }else{ mes=`${(date.getMonth() +1)}` }
            for (let index = String(numeroCliente).length; index < 4 ; index++) {
              ceros = `${ceros}0`
            }
            secuencia = `${ceros}${numeroCliente}`
            let nombreCotizacion = `${ nombre.slice(0,2)}${apellidos.slice(0,2)}${ String(nombreS).slice(0,2)}${mes}${anio.slice(anio.length-2,anio.length)}${secuencia}`
            this.form_cliente.controls['no_cliente'].setValue(nombreCotizacion.toUpperCase())
          })
          .catch((error)=>{this._publicos.mensajeIncorrecto('error: ' + error)})
        }
      }else{
        this.form_cliente.controls['no_cliente'].setValue('')
      }
    }

  }
  guardarCliente(){
    const info_get = this.form_cliente.value
    let saveInfo = {
      no_cliente: String(info_get['no_cliente']).trim(),
      nombre: String(info_get['nombre']).trim(),
      apellidos: String(info_get['apellidos']).trim(),
      fullname: String(`${info_get['nombre']} ${info_get['apellidos']}`).trim(),
      correo: String(info_get['correo']).trim(),
      telefono_movil: String(info_get['telefono_movil']).trim(),
      tipo: String(info_get['tipo']).trim(),
      sucursal: String(info_get['sucursal']).trim(),
    };

    (info_get['correo_sec']) ? saveInfo['correo_sec'] = String(info_get['correo_sec']).trim(): null;
    (info_get['telefono_fijo']) ? saveInfo['telefono_fijo'] = String(info_get['telefono_fijo']).trim(): null;
    (info_get['empresa']) ? saveInfo['empresa'] = String(info_get['empresa']).trim(): null;

    let contador = 0
    if (this.id) {
      const campos = ['no_cliente','nombre','apellidos','correo','telefono_movil','tipo',
                      'sucursal','correo_sec','telefono_fijo','empresa']
      campos.map( (campo)=>{
        // console.log(campo);
        const updates = {};
        updates[`clientes/${this.id}/${campo}`] = saveInfo[campo];
        if (this.data[campo] && saveInfo[campo]) {
          if ( this.data[campo] !== saveInfo[campo] ) {
            contador++
            // console.log(`clientes/${this.id}/${campo} = ${saveInfo[campo]} !==  ${this.data[campo]}`);
            update(ref(db), updates).catch((error)=>{
                console.log(error);
                contador--
              })
          }
        }
        if (saveInfo[campo] && !this.data[campo]) {
          // console.log(`este campo no existia ${campo}: ${saveInfo[campo]}`);
          contador++
          update(ref(db), updates).catch((error)=>{
              console.log(error);
              contador--
            })
        }
        if (!saveInfo[campo] && this.data[campo]) {
          // console.log(`este campo existia ${campo}: ${this.data[campo]} pero se elimino`);
          contador++
          updates[`clientes/${this.id}/${campo}`] = '';
          update(ref(db), updates).catch((error)=>{
              console.log(error);
              contador--
            })
        }
      })
      
    if (contador > 0) {
      this.heroeSlec.emit( {actualizacion: true, cliente: saveInfo})
    }else{
      this.heroeSlec.emit( {registro: false})
    }
      
    }else{
      // console.log('ID: ','nuevo')
      // console.log(saveInfo);
      if (!info_get['id']) {
        saveInfo['id'] = push(child(ref(db), 'posts')).key
      }
      this._clientes.registraCliente(saveInfo).then(ans=>{
        this.heroeSlec.emit( {registro: ans, cliente: saveInfo, oculta: true})
        }).catch(ans=>{
          this.heroeSlec.emit( {registro: ans, cliente: {}, oculta: false})
        })
    }
  }

  resetForm(){
    let sucu = this.sucursal
    if (this.sucursal === 'Todas') sucu = ''
    this.form_cliente.reset({
      tipo:'particular',  sucursal: sucu,
      no_cliente:'',      id:'',
      nombre:'',          apellidos:'',
      correo:'',          telefono_fijo:'',
      telefono_movil:'',  empresa: '',
      correo_sec:''
    })
    // this.heroeSlec.emit( {oculta: true, cancelo:true})
  }
  //sucursales
  listaSucursales(){
    this._sucursales.consultaSucursales().then(({contenido,data})=>{
      if (contenido) {
        this.Sucursales = data
      }
    })
  }
  //empresas
  listadoEmpresas(){

    const starCountRef = ref(db, `empresas`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        
        this._clientes.getEmpresas().then(({contenido, data})=>{
          if (contenido) {
            let empre = []
            const sucursales = Object.keys(data)
            sucursales.forEach(element => {
              const empresas = this._publicos.crearArreglo2(data[element])
              empresas.map(emp=>{
                const temp = {
                  empresa: emp['empresa'],
                  id: emp['id'],
                  sucursal: element
                }
                empre.push(temp)
              })
            });
            this.empresaSelect = this.form_cliente.controls['empresa'].value
            if (this.sucursal ==='Todas') {
              this.empresasSucursal = this._publicos.ordernarPorCampo(empre,'empresa')
            }else{
              const nuevos = empre.filter(em=>em['sucursal'] === this.sucursal)
              this.empresasSucursal = this._publicos.ordernarPorCampo(nuevos,'empresa')
            }
            setTimeout(() => {
              const existeEmpresa = empre.find(o=>o['id'] === this.empresaSelect)
              if (existeEmpresa) {
                this.form_cliente.controls['empresa'].setValue(this.empresaSelect) 
              }else{
                this.form_cliente.controls['empresa'].setValue('')
                this.empresaValida()
              }
            }, 200);
          }
        })
      } 
    })
    
  }
  limpiarFormEmpresa(){
    this.formaEmpresa.reset()
  }
}
