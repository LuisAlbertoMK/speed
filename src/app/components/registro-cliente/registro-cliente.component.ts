import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { CustomValidators } from 'src/app/validators/password.validator';
import Swal from 'sweetalert2';
import { ClientesService } from '../../services/clientes.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { AuthService } from 'src/app/services/auth.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { Route, Router } from '@angular/router';

import { UsuariosService } from 'src/app/services/usuarios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, private _sucursales: SucursalesService, private _clientes: ClientesService, 
    private _publicos: ServiciosPublicosService,private _auth: AuthService, public _router: Router, private _usuarios: UsuariosService) { }
  registroForm: FormGroup
  sucursales_arr = []
  infoGenera = {sucursal:null, nombre:null, apellidos:null}
  correos_full = []
  correosClientes = []
  correosUsuarios = []
  correoValido:boolean = true
  ngOnInit(): void {
    this.sucursales_arr = this._sucursales.lista_en_duro_sucursales
    this.consultaCorreos()
    this.crea_formulario_cliente()
    this.generaNO_cliente()
  }
  consultaCorreos(){
              
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, async (snapshot) => {
      const correos_cliente = await this._clientes.consulta_clientes_new()
      this.correosClientes = correos_cliente.map(c=> {return String(c.correo).toLowerCase()})
      this.unir()
    })
    const starCountRef_u = ref(db, `usuarios`)
    onValue(starCountRef_u, async (snapshot) => {
      const correos_usuarios = await this._usuarios.consulta_usuarios_correos()
      this.correosUsuarios = correos_usuarios.map(c=> {return String(c.correo).toLowerCase()})
      this.unir()
    })
   
  }
  unir(){
    // this.correos_full = [...this.correosClientes,...this.correosUsuarios]
    // console.log(this.correos_full);
    const correos_sucursales = this.sucursales_arr.map(c=>{return String(c.correo).toLowerCase() })
    const array = [...correos_sucursales,...this.correosClientes,...this.correosUsuarios]
    const uniqueArray = array.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    this.correos_full = uniqueArray
    // console.log(uniqueArray);

    
  }
  crea_formulario_cliente(){
    this.registroForm = this.formBuilder.group({
      sucursal: ['-N2glF34lV3Gj0bQyEWK', Validators.required],
      no_cliente: ['', Validators.required],
      nombre: ['Juan', [Validators.required, Validators.maxLength(50),Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      apellidos: ['roro', [Validators.required, Validators.maxLength(50),Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      correo: ['mkkaos28@gmail.com', [Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      confirmCorreo:['mkkaos28@gmail.com', Validators.compose([Validators.required])],
      telefono: ['7244869547', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      tipoCliente: ['particular', Validators.required],
      password: ['MKkaos28/(1', [Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator( /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{hasSpecialCharacters: true})]],
      confirmPassword: ['MKkaos28/(1', Validators.compose([Validators.required])],
    },
    {
      validator: [CustomValidators.passwordMatchValidator,CustomValidators.correoMatchValidator]
    }
    );
     this.registroForm.get('no_cliente').disable()
    
  }
  generaNO_cliente(){
    const addFieldValueChangeListener = (fieldName: string, infoGeneraKey: string) => {
      this.registroForm.get(fieldName).valueChanges.subscribe((fieldValue: string) => {
        this.infoGenera[infoGeneraKey] = fieldValue ? String(fieldValue).trim().toLowerCase() : null;
        this.nuevo();
      });
    };
    this.registroForm.get('sucursal').valueChanges.subscribe((sucursal: string) => {
        this.infoGenera.sucursal  = ( sucursal ) ? this.sucursales_arr.find(s=>s.id === sucursal).sucursal : null
        this.nuevo()
    })
    this.registroForm.get('correo').valueChanges.subscribe((correo: string) => {
        if (correo) {
          const existe_correo = this.correos_full.find(c=>c === String(correo).toLowerCase())
          if(existe_correo) {
            this.correoValido = false
            this.registroForm.get('correo').hasError('emailInUse')
          }
        }
    })
    addFieldValueChangeListener('nombre', 'nombre');
    addFieldValueChangeListener('apellidos', 'apellidos');
  }
  async nuevo() {
    const { sucursal, nombre, apellidos } = this.infoGenera;
    
    if (sucursal && nombre  && nombre.length >= 3 && apellidos &&apellidos.length >= 3) {
      const contador = await this._clientes.consulta_clientes_new();
        const no_cliente = await this._clientes.genera_no_cliente(sucursal, nombre, apellidos, contador.length + 1);
        this.registroForm.controls['no_cliente'].setValue(no_cliente);
    } else {
      this.registroForm.controls['no_cliente'].setValue(null);
    }
  }
  
  validarCampo(campo){
    return this.registroForm.get(campo).invalid && this.registroForm.get(campo).touched
  }
  registrarUsuario() {
    if (this.registroForm.invalid) {
      return;
    }

    // Obtener los valores del formulario
    const registroData = this.registroForm.value;
    
    const recupera_usuario= ['correo','password','sucursal']
    const recupera_cliente = ['nombre','apellidos','correo','password','sucursal','telefono','tipoCliente','no_cliente']
    this._publicos.mensaje_pregunta('Seguro de registrar usuario').then(({respuesta})=>{
      if (respuesta) {
        const recuperada_cliente = this._publicos.nuevaRecuperacionData(registroData,recupera_cliente)
        const recuperada_usuarios = this._publicos.nuevaRecuperacionData(registroData,recupera_usuario)

        recuperada_cliente['no_cliente'] = this.registroForm.get('no_cliente').value

        recuperada_usuarios['rol'] = 'cliente'
        recuperada_usuarios['status'] = true
        recuperada_usuarios['usuario'] = `${recuperada_cliente.nombre}`
        
        
        const otra = { email:    recuperada_cliente.correo,password: recuperada_cliente.password,nombre:   recuperada_cliente.usuario }
        const updates = { 
          [`clientes/${this._publicos.generaClave()}`]: recuperada_cliente,
          [`usuarios/${this._publicos.generaClave()}`]: recuperada_usuarios
         };
        //  console.log(updates);
         
        // this._auth.nuevoUsuario(otra).subscribe((token)=>{
        //   if (token) {
        //     update(ref(db), updates)
        //       .then(a=>{
        //         this._publicos.swalToast('Se registro usuario')
        //         this._auth.login(otra)
        //         setTimeout(()=>{
        //           window.location.href = '/inicio'
        //         },200)
        //         this.registroForm.reset()
        //       })
        //       .catch(err=>{
        //         this._publicos.swalToastError('Error al registrar usuario')
        //       })
        //   }else{
        //     this._publicos.swalToastError('Error al generar token')
        //   }
        // })
      }
    })
    // Realizar la lógica de registro de usuario
    // ...

    // Mostrar una alerta de registro exitoso
    // Swal.fire('Registro Exitoso', 'El usuario ha sido registrado correctamente.', 'success');
  }
}
