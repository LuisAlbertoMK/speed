import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

import * as CryptoJS from 'crypto-js'

import { InicioComponent } from 'src/app/pages/inicio/inicio.component';
import { AuthService } from 'src/app/services/auth.service';
import { child, get, getDatabase, onValue, ref, set, update } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged,  signOut  } from "firebase/auth";

import Swal from 'sweetalert2';
import { EmailsService } from '../../services/emails.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SucursalesService } from 'src/app/services/sucursales.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
const auth = getAuth();
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit ,OnInit {
  @ViewChild(InicioComponent) child;
  constructor(private _auth:AuthService, private router : Router, private _email:EmailsService, 
    private _sucursales: SucursalesService,
    private _security:EncriptadoService,  public _router: Router, public _location: Location) { }
  
    sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]

    @Input() childMessage: string

  
  maniana:string = ''
  citasManiana:any =[]
  userToken:string

  decPassword:string = 'SpeedProSecureCondifidential' 

  SUCURSAL:string =''
  STATUS:string =''
  USUARIO:string =''
  CORREO:string =''
  PASSWORD:string =''

  SUCURSALUnico:string =''
  STATUSUnico:string =''
  USUARIOUnico:string =''
  CORREOUnico:string =''
  PASSWORDUnico:string =''
  
  nombreSucursalMuestra:string =''
  recomendacion:string = ''
  navegador:string=''
  numero:number = 0
  infoUsuario:any =[]
  //citas con recordatorio 
  listRecorEnviado:any =[]
  listRecorEnviar:any =[]
  listSucursales:any=[]
  sesion:boolean = false

  ///para recordatorios
  listPlacas:any=[]
  dataPlacas:any =[]
  fecha:string=''
  hora:string=''
  anio:string = ''
  mes:number= 0
  
  clientes:any=[]
  vehiculos:any=[]
  //roles
  ROL:string = ''
  update:boolean = false
  color:string = 'navbar-white'
  changeColor:boolean = false
  themes_colors = [
    {valor:false,color:'navbar-white',mode:'dark-mode', show:'Modo oscuro',icono:'moon'},
    {valor:true,color:'navbar-dark',mode:'dark-mode', show:'Modo claro',icono:'sun'},
  ]
  tema_selecciondo = {valor:false,color:'navbar-white', show:'Modo oscuro',icono:'moon'}
  theme: string = 'dark';
  ngOnInit(): void {

    this.nombreSucursal()

    this.AsiganacionVariablesSesion()

    this.comprobarTimeExpira()
    this.comprobarTema()
  }
  ngAfterViewInit() {
    
  }

  //TODO aqui las nuevas funciones

  cambiaColorNavbar(){    

    const body = document.body;
    const info = this.themes_colors.find(t=>t.valor === this.changeColor);

    (this.changeColor) ? body.classList.add(info.mode) : body.classList.remove(info.mode) ;
    if(this.changeColor){
      body.classList.add('mat-dark-theme')
      body.classList.remove('mat-app-background');
    }else{
      body.classList.add('mat-app-background')
      body.classList.remove('mat-dark-theme');
    }
    this.tema_selecciondo = info
    localStorage.setItem("tema",JSON.stringify(info))
    localStorage.setItem("color",JSON.stringify(info.color))
    localStorage.setItem("changeColor",JSON.stringify(this.changeColor))
    localStorage.setItem("tema_selecciondo",JSON.stringify(this.tema_selecciondo))

    this.color = info.color
    
  }
  comprobarTema(){
    const changeColor = JSON.parse(localStorage.getItem('changeColor'))
    
    this.changeColor = changeColor
    

    if (localStorage.getItem('color')) {

      const body = document.body;

      const {color:c_theme, mode: m_theme} = JSON.parse(localStorage.getItem('tema'));
      const tema_selecciondo = JSON.parse(localStorage.getItem('tema'))
      this.tema_selecciondo = tema_selecciondo
      this.color = c_theme;
      const color = JSON.parse(localStorage.getItem('color'))

      if(color === 'navbar-dark'){
        body.classList.add(m_theme)
        body.classList.add('mat-dark-theme')
        body.classList.remove('mat-app-background');
      }else{
        body.classList.remove(m_theme)
        body.classList.add('mat-app-background')
        body.classList.remove('mat-dark-theme');
      }
    }
  }
  toggleTheme() {
    const linkElement = document.getElementById('material-theme') as HTMLLinkElement;
    if (this.theme === 'dark') {
      linkElement.href = 'stylesD.css';
      this.theme = 'light';
    } else {
      linkElement.href = 'styles.css';
      this.theme = 'dark';
    }
  }
  //TODO aqui las nuevas funciones


  comprobarTimeExpira(){
    let now = new Date()
    const expira = Number(localStorage.getItem('expira'))
    let expiraTimee = new Date(expira)
  }
  cambiosSys(){
    const starCountRef = ref(db, `configuraciones/cambiosPlataforma`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const update:boolean  = snapshot.val()
        if (!localStorage.getItem('actualizacion') && update || localStorage.getItem('actualizacion') && update) {
          this.update = true
          localStorage.setItem('actualizacion', 'true')
        }else{
            this.update = false
            localStorage.setItem('actualizacion','false')
        }    
      }else{
        this.update = false
      }
    })
  }
  refresh(): void {
    localStorage.setItem('actualizacion','false')
    this.update = false
    // window.location.reload()
    this._router.navigateByUrl("/refresh", { skipLocationChange: true }).then(() => {
  		// console.log(decodeURI(this._location.path()));
  		this._router.navigate([decodeURI(this._location.path())]);
		});
  }
  
  AsiganacionVariablesSesion(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    
    // console.log(variableX);
    
// console.log(this._security.servicioDecrypt(variableX['usuario']));

    this.sesion = Boolean(variableX['sesion'])
    //  CryptoJS.AES.decrypt(localStorage.getItem('email').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8)
  }
  //cerrar sesion
  // logout(){ this._auth.logout('cerrar') }
  logout(){
    signOut(auth).then(() => {
      // this.obternerInformacion()
      this.sesion = false
      this._auth.logout('cerrar')
      // this.leerToken()
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      
    });
  }
  //monitorear si hay un cambio en la informacion de cliente y si el cliente esta habilto
  MonitoreUsuario(){
    // const starCountRef = ref(db, `usuarios/${this.USUARIO}`)
    //     onValue(starCountRef, (snapshot) => {

	  //       this.infoUsuario = snapshot.val()
          
    //       localStorage.setItem('status_mon',this.infoUsuario.status)
    //       localStorage.setItem('sucursal_mon',this.infoUsuario.sucursal)
    //       localStorage.setItem('email_mon',this.infoUsuario.correo)
    //       localStorage.setItem('password_mon',this.infoUsuario.password)
    //       this.STATUS = localStorage.getItem('status_mon')
    //       this.SUCURSAL = localStorage.getItem('sucursal_mon')
    //       this.CORREO = localStorage.getItem('email_mon')
    //       this.PASSWORD = localStorage.getItem('password_mon')
    //         this.verificar()
    //     })
  }
  
  nombreSucursal(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    
    if (this.SUCURSAL!=='Todas' ) {
      this.nombreSucursalMuestra = this.sucursales_array.find(s=>s.id === this.SUCURSAL).sucursal
    }
  }


  //ENVIAR recordatorios de verificacion

 
  
 

  //funcion para conocer el navegador
  brow(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    // console.log(M[0])

    if (M[0]==='Firefox') {
      this.recomendacion = 'Se recomienda un navegador direfente a'     
      this.navegador = M[0]
    }
  }
}
