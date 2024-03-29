import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

import * as CryptoJS from 'crypto-js'

import { InicioComponent } from 'src/app/pages/inicio/inicio.component';
import { AuthService } from 'src/app/services/auth.service';
import { child, get, getDatabase, onChildAdded, onChildChanged, onChildRemoved, onValue, ref, set, update } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged,  signOut  } from "firebase/auth";

import Swal from 'sweetalert2'
import { EmailsService } from '../../services/emails.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { AutomaticosService } from 'src/app/services/automaticos.service';
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
  constructor(private _auth:AuthService, private _sucursales: SucursalesService, private _publicos:ServiciosPublicosService, private _security:EncriptadoService,
    public _router: Router, public _location: Location, private _automaticos: AutomaticosService) { }
  
    sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]

    @Input() childMessage: string

  
  // userToken:string

  // decPassword:string = 'SpeedProSecureCondifidential' 

  // SUCURSAL:string =''
  // STATUS:string =''
  // USUARIO:string =''
  // CORREO:string =''
  // PASSWORD:string =''

  // SUCURSALUnico:string =''
  // STATUSUnico:string =''
  // USUARIOUnico:string =''
  // CORREOUnico:string =''
  // PASSWORDUnico:string =''
  
  nombreSucursalMuestra:string =''
  recomendacion:string = ''
  navegador:string=''
  // numero:number = 0
  // infoUsuario:any =[]
  //citas con recordatorio 
  // listRecorEnviado:any =[]
  // listRecorEnviar:any =[]
  // listSucursales:any=[]
  sesion:boolean = false

  ///para recordatorios
  // listPlacas:any=[]
  // dataPlacas:any =[]
  // fecha:string=''
  // hora:string=''
  // anio:string = ''
  // mes:number= 0
  
  // clientes:any=[]
  // vehiculos:any=[]
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

  _rol:string
  _sucursal:string

  campos = [
    {ruta_observacion: 'clientes', nombre:'claves_clientes'},
    {ruta_observacion: 'vehiculos', nombre:'claves_vehiculos'},
    {ruta_observacion: 'recepciones', nombre:'claves_recepciones'},
    {ruta_observacion: 'cotizaciones', nombre:'claves_cotizaciones'},
    {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'},
    {ruta_observacion: 'historial_gastos_operacion', nombre:'claves_historial_gastos_operacion'},
    {ruta_observacion: 'historial_gastos_orden', nombre:'claves_historial_gastos_orden'},
    {ruta_observacion: 'historial_pagos_orden', nombre:'claves_historial_pagos_orden'},
    {ruta_observacion: 'sucursales', nombre:'claves_sucursales'},
    {ruta_observacion: 'metas_sucursales', nombre:'claves_metas_sucursales'},
    {ruta_observacion: 'paquetes', nombre:'claves_paquetes'},
    {ruta_observacion: 'moRefacciones', nombre:'claves_moRefacciones'},
    {ruta_observacion: 'citas', nombre:'claves_citas'},
  ]
  busqueda:any = {ruta_observacion: 'clientes', nombre:'claves_clientes'}
  ngOnInit(): void {
    // console.log('llamado');
    this.rol()
    // this.vigila_hijo()
    
    
    // this.AsiganacionVariablesSesion()
    
    this.comprobarTimeExpira()
    this.comprobarTema()
    this.nombreSucursal()
  }
  ngAfterViewInit() {
    
  }
  rol(){
    const { rol, sucursal, usuario , sesion} = this._security.usuarioRol()
    this.sesion = sesion
    this._rol = rol
    this._sucursal = sucursal
    // console.log(this._sucursal);

    if (!this._publicos.existe_variable_localhost('unica')) {
      let camposs= this.campos.length
      let contados = 0
      this.campos.forEach(campo=>{
        const {nombre, ruta_observacion}= campo
        localStorage.removeItem(nombre)
        localStorage.removeItem(ruta_observacion)
        contados++
      })
      const intervlo = setInterval(() => {
        if (camposs === contados) {
          clearInterval(intervlo)
          localStorage.setItem('unica', 'ok')
          this.procesarArregloConSweetAlert()
        }
      }, 100);
    }else{
      this.procesarArregloConSweetAlert()
    }    
  }
  procesarArregloConSweetAlert(){
    let existentes = [], faltantes = []
    let claves_Existentes = [], claves_faltantes = []
    
    let timerInterval
    const time = this.campos.length * 500
    Swal.fire({
      title: 'Espere ...',
      html: 'Revisando información <b></b>',
      timer: time,
      timerProgressBar: true,
      progressStepsDistance: 4,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading()
        for(let campo of this.campos){
          const {nombre, ruta_observacion} = campo
          // Simula una operación de procesamiento
          const b = Swal.getHtmlContainer().querySelector('b')
          b.textContent = ruta_observacion
          await new Promise(resolve => setTimeout(resolve, 200)); // Espera 1 segundo

          this._publicos.existe_variable_localhost(ruta_observacion) ? existentes.push(ruta_observacion) : faltantes.push(ruta_observacion)
          this._publicos.existe_variable_localhost(nombre) ? claves_Existentes.push(nombre) : claves_faltantes.push(nombre)
        }
        
      },
      willClose: () => {
        clearInterval(timerInterval)
        // return {claves:claves_faltantes, ruta_observacion: claves_faltantes}
        this.consulta_data(faltantes, claves_faltantes)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    })
  }
  
  consulta_data(faltantes:any[], claves:any[]){
  
    const nuevos = [...new Set([...faltantes, ...claves])]
  
    if (nuevos.length) {
      let timerInterval
      const time = nuevos.length * 500
      Swal.fire({
        title: 'Consuta espere ...',
        html: 'Obteniendo <b></b>',
        timer: time,
        timerProgressBar: true,
        progressStepsDistance: 4,
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading()
          for(let campo of nuevos){
            // Simula una operación de procesamiento
            console.log(`campos recupera BD ===> ${campo}`);
            // const simular = await this._automaticos.consulta_ruta()
            const data = await this._automaticos.consulta_ruta(campo)
  
            const b = Swal.getHtmlContainer().querySelector('b')
            b.textContent = campo
  
            this._security.guarda_informacion({nombre: campo, data})
  
            
          }
          
        },
        willClose: () => {
          clearInterval(timerInterval)
          this.vigila_nodos()
          // return {claves:claves_faltantes, ruta_observacion: claves_faltantes}
          // this.consulta_data(faltantes, claves_faltantes)
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          
        }
      })
    }else{
      this.vigila_nodos()
    }
  
  }
  
  

  vigila_nodos(){
    this.campos.forEach((g)=>{
      this.vigila_nodo_principal(g)
    })
  }
  async vigila_nodo_principal(data){

    
    
    const {nombre, ruta_observacion} = data

    const en_cloud:any[] =  await this._automaticos.consulta_ruta(nombre)

    const resultados_real_time = (!en_cloud.length) ? [] : en_cloud

    const resultados_en_local:any[] = this._publicos.revision_cache(nombre) 

    const newLocal:any[] = (!resultados_en_local.length) ?  [] : resultados_en_local

    const valorNoDuplicado = [...new Set([...resultados_real_time, ...newLocal])];

    // console.log(this._publicos.saber_pesos(valorNoDuplicado));

    function arrayAObjeto(arr, valorInicial) {
      const objeto = {};
      for (const elemento of arr) {
        objeto[elemento] = valorInicial !== undefined ? valorInicial : null;
      }
      return objeto;
    }

    const miObjeto = arrayAObjeto(valorNoDuplicado,{});

    // console.log(miObjeto);
    

    const vigila_claves_cloud = ref(db, `${nombre}`);
    
    onChildAdded(vigila_claves_cloud, async (data) => {
      const valor = data.val();
      // console.log('clave que verifica su agregacion: ',valor);
      
      if (!miObjeto[valor]) {
        // console.log(valor);
        console.log('NO_LOCAL_HOST ==>', valor);

        let locales_nuevas = this._publicos.revision_cache(nombre)
        let resultados_en_local_nuevas = [...locales_nuevas]
        const valorNoDuplicado = [...new Set([...resultados_en_local_nuevas, valor])];
        this._security.guarda_informacion({nombre, data: valorNoDuplicado})
        this.nueva_verificacion_informacion_claves_nombre({ruta_observacion,bruto_arr: valorNoDuplicado})
      }
        
    })

    this.nueva_verificacion_informacion_claves_nombre({ruta_observacion,bruto_arr: valorNoDuplicado})


  }
  nueva_verificacion_informacion_claves_nombre(data){
    const {ruta_observacion, bruto_arr }= data
    let resultados = [...new Set([...bruto_arr])];

    let faltantes = []
    const actuales_nombres = this._publicos.revision_cache(ruta_observacion)
    // console.log(actuales_nombres);
    
    resultados.forEach((clave_vigilar) => {
      const commentsRef = ref(db, `${ruta_observacion}/${clave_vigilar}`);
      onChildChanged(commentsRef, async (data) => {
        const valor =  data.val()
        const key = data.key
        console.log(`actualizacion key=> [${key}]: valor =>{${valor}}`);
        // this._publicos.saber_pesos(data)

        const localhost_nombre = await this._publicos.revision_cache(ruta_observacion)

        if (localhost_nombre[clave_vigilar]) {
          const nueva_data_clave = this._publicos.crear_new_object(localhost_nombre[clave_vigilar])
          nueva_data_clave[key] = valor
          localhost_nombre[clave_vigilar] = nueva_data_clave
          this._security.guarda_informacion({nombre: ruta_observacion, data: localhost_nombre})
        }else{
          // console.log(`la informacion del cliente no se encuentra`);
          this.obtenerInformacion_unico(clave_vigilar, ruta_observacion)
          .then((resultados_promesa) => {
            let actuales  = this._publicos.revision_cache(ruta_observacion)
            actuales[clave_vigilar] = resultados_promesa
            this._security.guarda_informacion({nombre: ruta_observacion, data: actuales})
          })
          .catch(error=>{
            console.log(error);
          })
        }
      })
      if (!actuales_nombres[clave_vigilar]) {
        faltantes.push(clave_vigilar)
      }
    })


    // console.log(faltantes);
    if (faltantes.length) {
      // console.log('realiza la consulta de la informacion', faltantes);
      this.obtenerInformacion(faltantes, ruta_observacion)
        .then((resultados_promesa) => {

          const claves_obtenidas = Object.keys(resultados_promesa)

          let actuales  = this._publicos.revision_cache(ruta_observacion)
          claves_obtenidas.forEach(clave_obtenida=>{
            actuales[clave_obtenida] = resultados_promesa[clave_obtenida]
          })
          this._security.guarda_informacion({nombre: ruta_observacion, data: actuales})
        })
        .catch(error=>{
          console.log(error);
        })
    }
    
  }
  async obtenerInformacion_unico(claves_faltante, ruta_observacion) {
    let resultados_new = {};
  
    const data_cliente = await this._automaticos.consulta_ruta(`${ruta_observacion}/${claves_faltante}`);

    const { no_cliente } = this._publicos.crear_new_object(data_cliente);
    if (no_cliente) resultados_new = data_cliente;  
    return resultados_new;
  }
  async obtenerInformacion(claves_faltantes, ruta_observacion) {
    const resultados_new = {};
  
    await Promise.all(claves_faltantes.map(async (clave) => {
      const data_obtenida = await this._automaticos.consulta_ruta(`${ruta_observacion}/${clave}`);
      resultados_new[clave] = data_obtenida;
    }));
  
    // console.log(resultados_new);
    
    return resultados_new;
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

  ///TODO accione_revisa 
  
  ///TODO accione_revisa 
  //TODO aqui las nuevas funciones


  comprobarTimeExpira(){
    let now = new Date()
    const expira = Number(localStorage.getItem('expira'))
    let expiraTimee = new Date(expira)
  }
  // cambiosSys(){
  //   const starCountRef = ref(db, `configuraciones/cambiosPlataforma`)
  //   onValue(starCountRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       const update:boolean  = snapshot.val()
  //       if (!localStorage.getItem('actualizacion') && update || localStorage.getItem('actualizacion') && update) {
  //         this.update = true
  //         localStorage.setItem('actualizacion', 'true')
  //       }else{
  //           this.update = false
  //           localStorage.setItem('actualizacion','false')
  //       }    
  //     }else{
  //       this.update = false
  //     }
  //   })
  // }
  refresh(): void {
    localStorage.setItem('actualizacion','false')
    this.update = false
    // window.location.reload()
    this._router.navigateByUrl("/refresh", { skipLocationChange: true }).then(() => {
  		// console.log(decodeURI(this._location.path()));
  		this._router.navigate([decodeURI(this._location.path())]);
		});
  }
  
  //cerrar sesion
  // logout(){ this._auth.logout('cerrar') }
  logout(){
    signOut(auth).then(() => {
      localStorage.removeItem('dataSecurity')
      // this.leerToken()
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      
    });
  }
  //monitorear si hay un cambio en la informacion de cliente y si el cliente esta habilto
  // MonitoreUsuario(){
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
  // }
  
  nombreSucursal(){
    const sucursales = this._publicos.revision_cache('sucursales')
    if (this._sucursal !=='Todas')  this.nombreSucursalMuestra = sucursales[this._sucursal].sucursal
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
