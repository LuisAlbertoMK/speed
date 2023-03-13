import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CustomValidators } from 'src/app/validators/password.validator';
import Swal from 'sweetalert2';
import {ThemePalette} from '@angular/material/core'
import 'animate.css';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';  
import { UsuarioModel } from 'src/app/models/usuario.model';
import { SucursalesService } from 'src/app/services/sucursales.service'

import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
const db = getDatabase();
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  //clave de desencriptado
  decPassword:string = 'SpeedProSecureCondifidential' 
  conversionDecryptOutputEmail:string; 

  constructor(
    private _usuarios:UsuariosService,private _auth:AuthService,  private _security:EncriptadoService,
    private _sucursal: SucursalesService,private fb: FormBuilder,
    private _publicos: ServiciosPublicosService) { }
  color: ThemePalette = 'accent'; checked = true; carga:boolean= true; 
  displayedColumnsGerente: string[] = ['usuario','correo','rol','status','opciones']
  displayedColumnsSuperSU: string[] = ['sucursal','usuario','correo','rol']
  displayedColumnsSuperSUExtended: string[] = [...this.displayedColumnsSuperSU]
  columnasTecnico: string[] = ['sucursal','usuario','correo','rol','status','opciones']
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  clickedRows = new Set<any>()
  roles :string[] =['SuperSU','Administrador','Almacén','Ventas','Contabilidad','Gerente','Auxiliar','tecnico']
  rolesMostrar:string[]=['Gerente','tecnico']
  rolesGerente:string='tecnico'
  
  formaUsuario: FormGroup; ver:boolean = false; IDUsuario:string = '';dataTemporal:any; arrayDataUsuarioFull: any [] =[];
  ROL:string=''; SUCURSAL:string =''; CORREO:string =''; miniColumnas:number = 100; listaArraySucursales:any []= [];
  valido:boolean = true; nombreSucursal:string = ''; usuarioSucursal:string = ''; datUsuario:any=[]; 
  ngOnInit(): void {
    this.rol()
    this.listarSucursales()
    this.crearFormaUsuario()
    this.bloqueoAccionesUsuario()
    this.listarUsuarios()
  }
  rol(){
    // this.ROL = CryptoJS.AES.decrypt(localStorage.getItem('tipoUsuario').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8)
    
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
        this.ROL = this._security.servicioDecrypt(variableX['rol'])
        this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])


    //  this.CORREO  = CryptoJS.AES.decrypt(localStorage.getItem('email').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8)
     
  }
  bloqueoAccionesUsuario(){
    if (localStorage.getItem('email')) {
      this.conversionDecryptOutputEmail = CryptoJS.AES.decrypt(localStorage.getItem('email').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8); 
    }
  }
  listarSucursales(){
      const starCountRef = ref(db, 'sucursales')
        onValue(starCountRef, (snapshot) => {
      		this.listaArraySucursales = this.crearArreglo2(snapshot.val())
          if (this.SUCURSAL !=='Todas') {
            const dataSucursal = this.listaArraySucursales.find(option=>option.id === this.SUCURSAL)
            this.nombreSucursal = dataSucursal.sucursal
          }
        }) 
  }
  validarCampo(formulario:string,campo: string){
    let respuesta 
    if (formulario==='formaUsuario') {
       respuesta = this.formaUsuario.get(campo).invalid && this.formaUsuario.get(campo).touched
    }    
    return respuesta
  }
  crearFormaUsuario(){
    this.formaUsuario = this.fb.group({
      usuario:['',[Validators.required]],
      correo:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      confirmCorreo:['', Validators.compose([Validators.required])],
      password:['',[Validators.required,Validators.minLength(8),
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator( /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{hasSpecialCharacters: true}),
      ]],
      confirmPassword: ['', Validators.compose([Validators.required])],
      status:['',[Validators.required]],
      sucursal:['',[Validators.required]],
      rol:['',[Validators.required]]
    },
      {
        // check whether our password and confirm password match
        validator: [CustomValidators.passwordMatchValidator,CustomValidators.correoMatchValidator]
      }
    )
  }
  guardarUsuario(){
    // if (this.formaUsuario.invalid) {
    //   return Object.values(this.formaUsuario.controls).forEach(control => {
    //     control.markAsTouched()
    //     Swal.fire('Error!','LLenar todos los campos','error')
    //   })
    // }else{
      // console.log(this.datUsuario)
      let correo = this.formaUsuario.controls['correo'].value
      const tempData = {...this.formaUsuario.value}
      let contador:number = 0
      get(child(dbRef, `usuarios`)).then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val())
          let arreglo = this.crearArreglo2(snapshot.val())
          arreglo.forEach(usuario => {
            if (usuario.correo === correo && usuario.id !== this.datUsuario.id) {
              contador = contador + 1
            }
          })
          if (contador!==0) {
            this.mensajeIncorrecto(`<strong>${correo}</strong> se encuentra registrado verifica información`)
          } else {
            // this.mensajeCorrecto('registro de usuario correcto')
            if (this.datUsuario==='') {
              // console.log(tempData);
              const dataRecupera = ['correo','password','rol','status','sucursal','usuario']
              this._publicos.recuperaDataArreglo(dataRecupera,tempData).then((Necesaria)=>{
                this._usuarios.nuevoUsuario(Necesaria).then(({inserccion,mensaje})=>{
                  if (inserccion) {
                    this._publicos.mensajeCorrecto(mensaje)
                    // this.formaUsuario.reset()
                  }else{
                    this._publicos.mensajeCorrecto(mensaje)
                  }
                })
              })
              
              // this._usuarios.nuevoUsuario(tempData).subscribe(
              //   (registro:any)=>{
              //     //  console.log(registro)
              //      this.registraUsuario('usuarios',tempData,true,'Registro de usuario correcto')
              //      this.formaUsuario.reset({status:true})
              //   },
              //   (err)=>{ },
              //   ()=>{ },
              // )

            } else {
              //verificar si hubo cambio en las credenciales de acceso
              get(child(dbRef, `usuarios/${this.datUsuario.id}`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  console.log(snapshot.val())
                  console.log(tempData)
                  let infoAntigua = snapshot.val()
                  let infoActual = tempData
                  if (infoAntigua === infoActual) {
                    
                    console.log('es la misma informacion no cambio nada');
                    
                  }else{
                    if ((infoAntigua.correo !== infoActual.correo) || (infoAntigua.password !== infoActual.password)) {
                      console.log('actualizar credenciales de acceso')
                      const tempDataTemp={
                        email: infoAntigua.correo,
                        password:infoAntigua.password
                      }
                      if (infoAntigua.correo !== infoActual.correo) {
                        this._auth.GeneraTokenUsuario(tempDataTemp).subscribe(
                          (token:any)=>{
                            //  console.log(token)
                            //  this._usuarios.restablecerCredenciales(infoActual).subscribe(
                            //   (restabloecido:any)=>{
                            //     //  console.log(restabloecido)
                            //     this._auth.borrarTokenTemporal()
                            //      this.registraUsuario(`usuarios/${this.datUsuario.id}`,infoActual,false,'Correo actualizado')
                                 
                            //   },
                            //   (err)=>{ },
                            //   ()=>{ },
                            //  )
                          },
                          (err)=>{ },
                          ()=>{ },
                        )
                      }
                      if (infoAntigua.password !== infoActual.password) {
                          this._auth.GeneraTokenUsuario(tempDataTemp).subscribe(
                            (token:any)=>{
                              //  console.log(token)
                              //  this._usuarios.restablecerCredenciales(infoActual).subscribe(
                              //   (restablecer:any)=>{
                              //     //  console.log(restablecer)
                              //     // this._auth.borrarTokenTemporal()
                              //      this.registraUsuario(`usuarios/${this.datUsuario.id}`,infoActual,false,'contraseña actualizada')
                              //   },
                              //   (err)=>{
                              //     console.log(err);
                              //   },
                              //   ()=>{ },
                              //  )
                            },
                            (err)=>{ 
                              console.log(err);
                              
                            },
                            ()=>{ },
                          )
                        
                        
                      }
                    }else{
                       this.registraUsuario(`usuarios/${this.datUsuario.id}`,tempData,false,'Actualizacion de usuario correcto')
                    }
                  }
                }
                else {
                  console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              });
              
             
            }
          }
        } else {
          // console.log("No data available");
          
          const tempData = {
            ...this.formaUsuario.value,
            rol:      'SuperSU',
            sucursal: 'Todas',
            status:   true
          }
          this.registraUsuario('usuarios',tempData,true,'Registro de usuario correcto')
          this.formaUsuario.reset({status:true})
        }
      }).catch((error) => {
        console.error(error);
      })

    // }
  }
  registraUsuario(ruta:string, data:any,nuevo:boolean, mensaje:string){
    if (nuevo) {
      const newPostKey = push(child(ref(db), 'posts')).key
      ruta = ruta + `/${newPostKey}`
    }    
    	set(ref(db, `${ruta}`), data )
              .then(() => {
                this.mensajeCorrecto(mensaje)
              })
              .catch((error) => {
                this.mensajeIncorrecto(error)
              });
  }
  traerInformacion(ruta:string){
   const info = get(child(dbRef, ruta)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val()
        // info = snapshot.val()
      } else {
        // console.log("No data available");
        return null
      }
    }).catch((error) => {
      return error
    })
    return info
  }
  detalles(dataUsuario:any){
    // console.log(dataUsuario);
    
    let mostrar = '*****'
    let nombreSucursal = 'Todas'
    if (this.ROL === 'SuperSU' || this.ROL==='Administrador') {
      mostrar = dataUsuario.password
    }
    if (dataUsuario.correo===this.CORREO) {
      mostrar = dataUsuario.password
    }
    if (dataUsuario.nombreSucursal!=='Todas') {
      nombreSucursal= dataUsuario.nombreSucursal
    }
    let status:string = ''
    if (dataUsuario.status) {
      status= 'Habilitado'
    }else{
      status= 'Inhabilitado'
    }
    Swal.fire({
      title: '<h2 class="fw-bold text-uppercase">Información confidencial</h2>',
      html:`
      <h2 >${status}</h2>
      <table class="table">
        <tbody>
        <tr>
            <th class="text-start" scope="row">Sucursal</th>
            <td class="text-start">${dataUsuario.sucursal}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Alias</th>
            <td class="text-start">${dataUsuario.usuario}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">ROL</th>
            <td class="text-start">${dataUsuario.rol}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Correo (Usuario)</th>
            <td class="text-start">${dataUsuario.correo}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Contraseña</th>
            <td class="text-start">${mostrar}</td>
          </tr>
          
        </tbody>
      </table>
      `,
      imageUrl: dataUsuario.img,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })    
  }
  changeStatus(data:any,status:boolean){
    let statusMuestra:string =''
    let statusMuestraToats:string =''
    if (status===true) {
      statusMuestra='Habilitar'
      statusMuestraToats = 'habilito'
    }else{
      statusMuestra='Inhabilitar'
      statusMuestraToats = 'inhabilito'
    }
    // console.log(data);
    Swal.fire({
      title: 'Esta seguro?',
      html: `<strong>${statusMuestra}</strong> usuario <strong>${data.correo}</strong> <br>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar!',
      cancelButtonText:' Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(data);
        const tempData = status
        this.registraUsuario(`usuarios/${data.id}/status`,tempData,false,`Se <strong>${statusMuestraToats}</strong> usuario <strong>${data.usuario}</strong>`)
      }
    })
    
  }
  listarUsuarios(){
    this.carga = false
    
    const starCountRef = ref(db, `usuarios`)
        onValue(starCountRef, (npsbase) => {
          
          if (npsbase.exists()) {
            let newData:any =[]
            let usuarios = this.crearArreglo2(npsbase.val())
            usuarios.forEach(usuario => {
              if (usuario.sucursal !=='Todas') {
                this.listaArraySucursales.forEach(sucursal => {
                  if (usuario.sucursal === sucursal.id) {
                    const temp = {
                      ...sucursal,
                      ...usuario,
                      idSucursal: sucursal.id,
                      sucursal: sucursal.sucursal
                    }
                    newData.push(temp)
                  }
                })
              }
              
              if (usuario.sucursal === 'Todas') {
                newData.push(usuario)
              }
              this.paginaResultados(newData)
            })
            
          } else {
            // console.log("No data available");
          }
	        
        })
  }
  paginaResultados(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.newPagination()
  }
  ordenamiento(array:any[]){
  array.sort(
    function (a, b) {
      if (a.fecha_recibido < b.fecha_recibido) {
        return 1;
      }
      if (a.fecha_recibido > b.fecha_recibido) {
        return -1;
      }
      // a must be equal to b
      return 0;
    }
  )
  }
  obtenerInformacion(dataUsuario:any){ 
  
  this.datUsuario = dataUsuario
  // console.log(dataUsuario);
  
   if (this.datUsuario==='') {
    this.formaUsuario.reset({status:true})
    //  this.formaUsuario.controls['status'].setValue(true)
     this.roles = ['SuperSU','Administrador','Almacén','Ventas','Contabilidad','Gerente','Auxiliar','tecnico']
     this.roles.sort()
     return
   }

   
   if (this.datUsuario.rol ==='Gerente') {
    this.roles = ['Auxiliar','tecnico']
   }
   if (this.datUsuario.rol ==='Auxiliar' ) {
    this.roles = ['tecnico','Auxiliar']
   }
   if (this.datUsuario.rol ==='SuperSU' ) {
    this.roles = ['SuperSU','Administrador']
   }
   if (this.ROL === 'Gerente') {
    this.roles = ['tecnico','Auxiliar']
   }
   if (this.ROL === 'SuperSU') {
    this.roles = ['SuperSU','Administrador','Almacén','Ventas','Contabilidad','Gerente','Auxiliar','tecnico']
   }
   this.roles.sort()

   this.dataTemporal = dataUsuario 
   this.IDUsuario = dataUsuario.id
    this.formaUsuario.reset({
    confirmCorreo: dataUsuario.correo,
    confirmPassword: dataUsuario.password,
    correo: dataUsuario.correo,
    password: dataUsuario.password,
    rol: dataUsuario.rol,
    sucursal: dataUsuario.idSucursal,
    status: dataUsuario.status,
    usuario: dataUsuario.usuario
  })
  }
  cambiarTipo(ver:boolean){    
    let password :any = document.getElementById('password')
    let confirmPassword :any = document.getElementById('confirmPassword')
    
    if (ver) {
      password.type = "text";
      confirmPassword.type = "text";
    }else{
      password.type = "password";
      confirmPassword.type = "password";
    }
    this.ver = ver
  }
  RestablecerPssword(dataUser:any){
    
    console.log(dataUser);
    Swal.fire({
      title: 'Esta seguro?',
      html: `Se enviara correo electronico a <b>${dataUser.correo}</b> para restablecer su contraseña!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // this._usuarios.restablecerPassword(dataUser).subscribe(
        //   (resetPassword:any)=>{ },
        //   (err)=>{ console.log(err)},
        //   ()=>{ 
        //     Swal.fire(
        //       'Enviado!',
        //       'Se envio correo electronicocorrecatamente.',
        //       'success'
        //     )
        //   }
        // )
      }
    })
    
  }
  RestablecerEmail(dataUser:any){   
    let email= dataUser.correo
    let password = dataUser.password
    const usuario:UsuarioModel ={
      nombre: '',
      email,
      password
    }
    this._auth.GeneraTokenUsuario(usuario).subscribe(
      (token:any)=>{ 
        Swal.fire({
          title: 'Esta seguro?',
          html: `Actualizar email <b>${dataUser.correo}</b>!`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText:'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            // this._usuarios.restablecerCredenciales(dataUser).subscribe(
            //   (resetPassword:any)=>{ },
            //   (err)=>{
            //     console.log(err);
                
            //     if (err.error.error.message==='EMAIL_EXISTS') {
            //       Swal.fire(
            //         'Error!',
            //         'Este correo ya existe verifica información.',
            //         'error'
            //       )
            //     }
            //   },
            //   ()=>{ 
            //     Swal.fire(
            //       'Actualización!',
            //       'Se actualizo el correo electronicocorrecatamente.',
            //       'success'
            //     )
            //   }
            // )
          }
        })
      },
      (err)=>{ console.log(err)},
      ()=>{ }
    )
    
    
  }
  mensajeCorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      html: mensaje
    })
  }
  mensajeIncorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      html: mensaje
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }
  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
     }, 250)
  }
  limiparFormulario(){
    this.formaUsuario.reset()
  }
  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }
  private crearArreglo(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      //arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }
}

