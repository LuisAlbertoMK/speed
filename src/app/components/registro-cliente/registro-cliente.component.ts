import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { CustomValidators } from 'src/app/validators/password.validator';

import { ClientesService } from '../../services/clientes.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { AuthService } from 'src/app/services/auth.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { Route, Router } from '@angular/router';

import { UsuariosService } from 'src/app/services/usuarios.service';

import { getAuth, signInWithEmailAndPassword,  createUserWithEmailAndPassword ,onAuthStateChanged,signOut, deleteUser  } from "firebase/auth";
import { EncriptadoService } from 'src/app/services/encriptado.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
const auth = getAuth();

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, private _sucursales: SucursalesService, private _clientes: ClientesService, 
    private _publicos: ServiciosPublicosService,private _auth: AuthService, public _router: Router, private _usuarios: UsuariosService,
    private _security:EncriptadoService) { }
  registroForm: FormGroup
  sucursales_array =  [  ...this._sucursales.lista_en_duro_sucursales  ]

  infoGenera = {sucursal:null, nombre:null, apellidos:null}
  correos_full = []
  correosClientes = []
  correosUsuarios = []
  correoValido:boolean = true
  ngOnInit(): void {
    
    this.consultaCorreos()
    this.crea_formulario_cliente()
    this.generaNO_cliente()
    this.verifica()
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
    const correos_sucursales = this.sucursales_array.map(c=>{return String(c.correo).toLowerCase() })
    const array = [...correos_sucursales,...this.correosClientes,...this.correosUsuarios]
    const uniqueArray = array.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    this.correos_full = uniqueArray
    // console.log(uniqueArray);

    
  }
  crea_formulario_cliente(){
    this.registroForm = this.formBuilder.group({
      sucursal: ['', Validators.required],
      no_cliente: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(50),Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      apellidos: ['', [Validators.required, Validators.maxLength(50),Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      correo: ['', [Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      confirmCorreo:['', Validators.compose([Validators.required])],
      telefono_movil: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      tipo: ['particular', Validators.required],
      password: ['', [Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator( /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{hasSpecialCharacters: true})]],
      confirmPassword: ['', Validators.compose([Validators.required])],
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
        this.infoGenera.sucursal  = ( sucursal ) ? this.sucursales_array.find(s=>s.id === sucursal).sucursal : null
        this.nuevo()
    })
    this.registroForm.get('correo').valueChanges.subscribe((correo: string) => {
        if (correo) {
          const existe_correo = this.correos_full.find(c=>c === String(correo).toLowerCase())
          console.log(existe_correo);
          
          if(existe_correo) {
            this.correoValido = false
            this.registroForm.get('correo').hasError('emailInUse')
          }else{
            this.correoValido = true
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
    const recupera_cliente = ['nombre','apellidos','correo','password','sucursal','telefono_movil','tipo','no_cliente']


    this._publicos.mensaje_pregunta('Seguro de registrar usuario').then(({respuesta})=>{
      if (respuesta) {
        createUserWithEmailAndPassword(auth,registroData['correo'],registroData['password'])
        .then(({user})=>{
          // console.log(user);

          const {uid, email } = Object(user)

          const recuperada_cliente = this._publicos.nuevaRecuperacionData(registroData,recupera_cliente)
          const recuperada_usuarios = this._publicos.nuevaRecuperacionData(registroData,recupera_usuario)

          let dataSecurity = { sesion: true, status: true }

          const inf_usuario = {...recuperada_usuarios, rol: 'cliente', usuario: recuperada_cliente.nombre}
          const inf_cliente = {...recuperada_cliente}

          const asiganaData_cliente = ['correo', 'password', 'rol', 'sucursal', 'usuario']
          let recuperanueva = {...inf_usuario, ...inf_cliente}

          asiganaData_cliente.forEach((c)=>{ dataSecurity[c] = this._security.servicioEncriptado(recuperanueva[c]) })
          // asiganaData_cliente.forEach((c)=>{ console.log(c, recuperanueva[c]);
          //  })

          const camposFirebase = ['uid','accessToken','refreshToken']
          camposFirebase.forEach((c)=>{ dataSecurity[c] = this._security.servicioEncriptado(user[c]) })
          

          inf_usuario['status'] = true
          inf_cliente['status'] = true

          const updates = { [`clientes/${uid}`]: inf_cliente, [`usuarios/${uid}`]: inf_usuario };
          
            update(ref(db), updates)
              .then(()=>{
                this.registroForm.reset()
                localStorage.setItem('email',this._security.servicioEncriptado(email))
                localStorage.setItem('password',this._security.servicioEncriptado(recuperada_cliente['password']))
                localStorage.setItem('dataSecurity',JSON.stringify(dataSecurity))
                this.verifica()
              })
              .catch(err=>{
                deleteUser(uid).then(()=>{
                  this._publicos.swalToast('Error al registrar usuario',0)
                })
                this.verifica()
              })
        })
        .catch(err=>{
          // console.log({err});
          const mensaje = this.codigosErrores(err)
          this._publicos.swalToast(mensaje,0)
        })
      }
    })
  }
  verifica(){
    onAuthStateChanged(auth, async (user) => {
      if(user){
        console.log('esta logeado');
        if (localStorage.getItem('dataSecurity')) {
          const { sesion, accessToken, status } = this._security.usuarioRol()
          if(sesion && accessToken) window.location.href = '/inicio'
        }
      }else{
        console.log('sin logeo');
      }
    })
  }
  codigosErrores(err){
      const { code } = err
      let mensaje = ''
      switch (code) {
        case 'auth/email-already-in-use':
          mensaje = 'El correo ingresado esta en uso'
          break;
      
        default:
          mensaje = 'uknow'
          break;
      }
      return mensaje
  }
}
