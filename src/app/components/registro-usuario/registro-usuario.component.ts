import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { CustomValidators } from 'src/app/validators/password.validator';
import { AuthService } from '../../services/auth.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})
export class RegistroUsuarioComponent implements OnInit {
  
  ROL:string; SUCURSAL:string;

  sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]
  
  @Input() usuario:any={}

  formUsuario: FormGroup
  faltantes: null

  roles :string[] =['SuperSU','Administrador','Almacén','Ventas','Contabilidad','Gerente','Auxiliar','tecnico']
  // rolesGerente:string[]=['tecnico']
  rolesMostrarnew = []

  constructor(private fb: FormBuilder, private _security:EncriptadoService, private _publicos: ServiciosPublicosService,private _auth: AuthService,private _sucursales: SucursalesService,) { }

  ngOnInit(): void {
    this.rol()
    this.CrearFormulario()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal;

    this.rolesMostrarnew = (this.ROL === 'SuperSU') ? this.roles : ['tecnico']
    
  }
  CrearFormulario(){
    const sucursal = (this.SUCURSAL === 'Todas')? '' : this.SUCURSAL
    
    
    this.formUsuario = this.fb.group({
        id:['',[Validators.required]],
        usuario:['',[Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        correo:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        confirmCorreo:['', Validators.compose([Validators.required])],
        password:['',[Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidators.patternValidator( /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{hasSpecialCharacters: true})]],
        confirmPassword: ['', Validators.compose([Validators.required])],
        sucursal:[sucursal,[Validators.required]],
        rol:['',[Validators.required]]
      },
      {
        // check whether our password and confirm password match
        validator: [CustomValidators.passwordMatchValidator,CustomValidators.correoMatchValidator]
      })

      if(this.ROL === 'Gerente') {
        this.formUsuario.controls['rol'].setValue('tecnico')
      }
      if (this.usuario.id) {
          this.formUsuario.reset({
            id: this.usuario.id,
            usuario: this.usuario.usuario,
            correo: this.usuario.correo,
            confirmCorreo: this.usuario.correo,
            password: this.usuario.password,
            confirmPassword: this.usuario.password,
            sucursal: this.usuario.sucursal,
            rol: this.usuario.rol,
          })
      }
  }
  validarCampo(campo: string){
    return this.formUsuario.get(campo).invalid && this.formUsuario.get(campo).touched
  }
  validaciones(){
    const campos = ['usuario','correo','password','sucursal','rol']
    let answer = {valida: true, faltantes:[], faltantesString:null}
    const valores =  this.formUsuario.value
    campos.forEach(element => {
      if(!valores[element]){
        answer.faltantes.push(element)
        answer.valida = false
      } 
    });
    answer.faltantesString = answer.faltantes.join(', ')
    return answer
  }
  guardarCliente(){
    const {valida,faltantesString } = this.validaciones()
    if (valida) {
      this._publicos.mensaje_pregunta('Seguro de registrar usuario').then(({respuesta})=>{
        if (respuesta) {
          const recupera = ['usuario','correo','password','sucursal','rol']
          const recuperada = this._publicos.nuevaRecuperacionData(this.formUsuario.value, recupera)
          const otra = { email:    recuperada.correo,password: recuperada.password,nombre:   recuperada.usuario }
          const updates = { [`usuarios/${this._publicos.generaClave()}`]: recuperada };
          if (this.usuario.id) {
            // update(ref(db), updates)
            //       .then(a=>{
            //         this._publicos.swalToast('Se actualizo usuario')
            //         const sucursal = (this.SUCURSAL === 'Todas')? '' : this.SUCURSAL
            //         this.formUsuario.reset({sucursal})
            //       })
            //       .catch(err=>{
            //         this._publicos.swalToastError('Error al registrar usuario')
            //       })
            //buscar la manera  de actualizar la informacion
          }else{
            this._auth.nuevoUsuario(otra).subscribe((token)=>{
              if (token) {
                update(ref(db), updates)
                  .then(a=>{
                    this._publicos.swalToast('Se registro usuario', 1)
                    const sucursal = (this.SUCURSAL === 'Todas')? '' : this.SUCURSAL
                    this.formUsuario.reset({sucursal})
                  })
                  .catch(err=>{
                    this._publicos.swalToast('Error al registrar usuario', 0)
                  })
              }else{
                this._publicos.swalToast('Error al generar token', 0)
              }
            })
          }
          
        }
      })
    }else{
      this._publicos.swalToast('LLenar datos de formulario', 0)
    }
    this.faltantes = faltantesString
  }

}
