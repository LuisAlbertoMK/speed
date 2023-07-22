import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


import { CustomValidators } from 'src/app/validators/password.validator';
import { AuthService } from '../../services/auth.service';



import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { UsuarioModel } from 'src/app/models/usuario.model';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,private fb: FormBuilder, private _publicos : ServiciosPublicosService,
    private _usuarios: UsuariosService, private _auth: AuthService
  ) { }


  formUsuario: FormGroup;
  passwordFieldType: string = 'text';
  passwordFieldType2: string = 'text';
  faltante_s = null
  ngOnInit(): void {
    this.creaFormulario_editar()
  }

  creaFormulario_editar(){
    
    this.formUsuario = this.fb.group({
      id:[this.data.id, [Validators.required]],
      usuario:[this.data.usuario, [Validators.required]],
      correo:[this.data.correo, [Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      correonew:[this.data.correo, [Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password:[this.data.password,[Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator( /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{hasSpecialCharacters: true})]],
      passwordnew:[this.data.password,[,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator( /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{hasSpecialCharacters: true})]],
    })
  }
  
  validarCampo(campo: string){
    return this.formUsuario.get(campo).invalid && this.formUsuario.get(campo).touched
  }
  toggleFieldType(cual) {
    if (cual === 'password') {
      this.passwordFieldType = (this.passwordFieldType === 'password') ? 'text' : 'password';
    }else{
      this.passwordFieldType2 = (this.passwordFieldType2 === 'password') ? 'text' : 'password';
    }
  }
  async guardaInfo(){
    localStorage.removeItem('tokenTemporal')
    const info = this._publicos.recuperaDatos(this.formUsuario)
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(info,['id','usuario','correo','password'])
    this.faltante_s = faltante_s
    if (ok) {
      const usuario:UsuarioModel = {
        email: info.correo,
        password: info.password,
        nombre: info.usuario
      }
     

      //primero obtener la informacion del usuario
      const usuario_get = await this._usuarios.consulta_usuario_data(info.id)
      
      const {correo, password, rol} = Object(usuario_get)
      // console.log({usuario_get,info});
      await this._auth.GeneraTokenUsuario(usuario).subscribe()
      // console.log(password !== info.passwordnew);
      setTimeout(()=>{
        // console.log(localStorage.getItem('tokenTemporal'));
        const data_reset = {
          email: info.correonew,
          password: info.passwordnew
        }
        
        if (info.passwordnew && password !== info.passwordnew && info.correonew && correo !== info.correonew) {
          this._usuarios.actualiza_password(data_reset.password)
          this._usuarios.actualiza_email(data_reset.email)
        }else{
          let donde = 'password'
          if(info.passwordnew && password !== info.passwordnew ){
            this._usuarios.actualiza_password(info.passwordnew)
          }else if(info.correonew && correo !== info.correonew ){
            donde = 'email'
            this._usuarios.actualiza_email(info.correonew)
          }
          // this.actualiza(info.id,donde, data_reset[donde],rol)
        }
      },1000)
      
    }
  }
  actualiza(id,donde, valor, rol?){
    // let idToken = localStorage.getItem('tokenTemporal')
    // console.log(idToken);
    
    // this._usuarios.restablece_new(donde,valor,idToken).subscribe(
    //   (ans:any)=>{
    //     console.log(ans);
    //     const updates = {};
    //     if(rol === 'cliente'){
    //       const donde_update  = (donde === 'password')  ? 'password' : 'correo'
    //       updates[`usuarios/${id}/${donde_update}`] = valor
    //       update(ref(db), updates).then(()=>{              })
    //     }
    //   },
    //   (err)=>{
    //     const envia_error = err.error.error.message
    //     console.log(err);
    //   },
    //   ()=>{ },
    // )
  }
  maneja_errores(error){
    const eerr ={ error_message: ''}
    switch (error) {
      case 'EMAIL_EXISTS':
        eerr.error_message = 'existe el email'
        break;
      case 'EMAIL_NOT_FOUND':
        eerr.error_message = 'Email no encontrado'
        break;
      case 'TOKEN_EXPIRED':
        eerr.error_message = 'Expiro el token'
        break;
    
      default:
        break;
    }
    return eerr.error_message
  }

}
