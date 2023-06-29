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
    // this.listadoClientes()
    // this.listadoVehiculos()
    this.nombreSucursal()
    // this.brow()
    this.AsiganacionVariablesSesion()
    // this.MonitoreUsuario()
    // // this.MonitoreoUnico()
    // this.listaSucursales()
    // this.obtCitas()
    // this.recordatoriosVerificacion()
    // this.verificacionPorvehiculos()
    // this.recordatoriosCotizaciones()
    // this.cambiosSys()
    // this.logeado()
    this.comprobarTimeExpira()
  }
  ngAfterViewInit() {
    
  }

  //TODO aqui las nuevas funciones

  cambiaColorNavbar(){    

    // mat-dark-theme
    // mat-app-background
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
    // (this.changeColor) ? body.classList.add('mat-app-background') : body.classList.remove('mat-dark-theme')

    this.tema_selecciondo = info

    this.color = info.color
    // this.toggleTheme()
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
  listadoClientes(){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.clientes= this.crearArreglo2(snapshot.val())
      }
    })
  }
  listadoVehiculos(){
    const starCountRef = ref(db, `vehiculos`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.vehiculos= this.crearArreglo2(snapshot.val())
      }
    })
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
  verificar(){
    let correo = CryptoJS.AES.decrypt(this.CORREOUnico, this.decPassword.trim()).toString(CryptoJS.enc.Utf8)
    let password = CryptoJS.AES.decrypt(this.PASSWORDUnico, this.decPassword.trim()).toString(CryptoJS.enc.Utf8)
    if (this.SUCURSAL !== this.SUCURSALUnico) {
      this.mensajeIncorrecto('hubo cambio en informacion')
      setTimeout(() => {
        this._auth.logout('actualiza')
      }, 2200)
    }
    if ((this.STATUS !== this.STATUSUnico) ) {
      this.mensajeIncorrecto('hubo cambio en informacion')
      setTimeout(() => {
        this._auth.logout('actualiza')
      }, 2200)
    }
    if (this.CORREO !== correo) {
      this.mensajeIncorrecto('hubo cambio en informacion')
      setTimeout(() => {
        this._auth.logout('email')
      }, 2200)
    }
    if (this.PASSWORD !== password) {
      this.mensajeIncorrecto('hubo cambio en informacion')
      setTimeout(() => {
        this._auth.logout('password')
      }, 2200)
    }
  }
  MonitoreoUnico(){
    get(child(dbRef, `usuarios/${this.USUARIO}`)).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        let inf = snapshot.val()
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  nombreSucursal(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    
    if (this.SUCURSAL!=='Todas' ) {
      this.nombreSucursalMuestra = this.sucursales_array.find(s=>s.id === this.SUCURSAL).sucursal
    }
  }
  ///CONTADOR DE CITAS PENDIENTES
  contarRecordatorios(){
    const starCountRef = ref(db, `clientes`)
        onValue(starCountRef, (snapshot) => {
	        let arreglo= this.crearArreglo2(snapshot.val())
        })
  }
  obtCitas(){
    // console.log(this.listSucursales);
    
    let fecha= new Date()
    let dia= String(fecha.getDate())
    let mes = String(fecha.getMonth() + 1)
    let anio = String(fecha.getFullYear())
    let hoy:string = dia+mes+anio
    // console.log(hoy);
    
    let diaM= String(fecha.getDate()+1)
    let maniana:string = diaM+mes+anio
    this.maniana = maniana
     
      const starCountRef = ref(db, `citas`)
      onValue(starCountRef, (snapshot) => {
        // this.citasHoy =[]
        this.citasManiana=[]
        this.recordatoriosEnvia(maniana)
      })
  }
  listaSucursales(){
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
      this.listSucursales= this.crearArreglo2(snapshot.val())
      // this.obtCitas()
    })
  }
  recordatoriosEnvia(maniana:string){
    this.citasManiana =[]
    this.listRecorEnviado =[]
    this.listSucursales.forEach(sucursal => {
      get(child(dbRef, `citas/${sucursal.id}/${maniana}`)).then((snapshot) => {
        if (snapshot.exists()) {
          let misfechas = this.crearArreglo2(snapshot.val())
          // console.log(misfechas);
          
          if (misfechas.length!==0) {
            misfechas.forEach(cita => {
              const datCita = {
                ...cita,
                sucursal: sucursal.id
              }
                this.citasManiana.push(datCita)
            })
          }
          this.filtroEnviar()
        } else {
          // console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    })
    
  }
  filtroEnviar(){
    // this.listRecorEnviado = this.citasManiana.filter(filter=>filter.recordatorio===true)
    this.listRecorEnviar = this.citasManiana.filter(filter=>filter.recordatorio===false)
    // console.log(this.listRecorEnviar);
    this.numero = this.listRecorEnviar.length
    
    // this.obtenerInformacion()
  }
  //ENVIAR recordatorios de verificacion
  verificacionPorvehiculos(){
    const starCountRef = ref(db, `vehiculos`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            setTimeout(() => {
              this.registraAutosVerificacion()
            }, 1000)
          } else {
            // console.log("No data available");
          }
        })
  }
  recordatoriosVerificacion(){
      
    const stratvehiculos = ref(db, `clientes`)
    onValue(stratvehiculos, (snpClientes) => {
      this.listPlacas =[]
      this.dataPlacas =[]
      
      if (snpClientes.exists()) {
        let arreglo = this.crearArreglo2(snpClientes.val())
        arreglo.forEach(cliente => {
           get(child(dbRef, `vehiculos/${cliente.id}`)).then((snapshot) => {
             if (snapshot.exists()) {
               let arregloVehiculos = this.crearArreglo2(snapshot.val())
               arregloVehiculos.forEach(vehiculo => {
                get(child(dbRef, `sucursales/${cliente.sucursal}`)).then((snpSucursal) => {
                  if (snpSucursal.exists()) {
                    let sucursal = snpSucursal.val()
                    const tempData ={
                      ...vehiculo,
                      ...cliente,
                      idSucursal: cliente.sucursal,
                      sucursal: sucursal.sucursal,
                      cliente: cliente.id,
                      vehiculo: vehiculo.id,
                      shownombre: cliente.nombre,
                      nombre: cliente.nombre + ' ' + cliente.apellidos
                    }
                    this.dataPlacas.push(tempData)
                    this.listPlacas.push(tempData.placas)
                    
                    // this.paginarDatos(this.arregloPlacas,'vehiculos')
                  } else {
                    // console.log("No data available");
                  }
                }).catch((error) => {
                  console.error(error);
                });
               
               });
             } else {
              //  console.log("No data available")
             }
           }).catch((error) => {
             console.error(error);
           })
        })
        setTimeout(() => {
          this.registraAutosVerificacion()
        }, 1000)
      } else {
        // console.log("No data available");
      }
    })
  }
  registraAutosVerificacion(){
    this.getFechaHora()
    let fechaRegistro:any = (this.fecha).split('/')
    let registro = fechaRegistro[0]+''+fechaRegistro[1]+''+fechaRegistro[2]
    
    get(child(dbRef, `recordatoriosVerificacion/${this.anio}`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.descomponerPlacas(this.anio)
      } else {
        this.descomponerPlacas(this.anio)
      }
    }).catch((error) => {
      console.error(error);
    })
  }
  descomponerPlacas(anio:string){
    this.listPlacas.forEach(placas => {
      let terminacion = placas.split('')
      // console.log(terminacion[6]);
      // console.log((Number(terminacion[6]) === 6 || Number(terminacion[6]) === 5))
      // console.log((this.mes === 7 || this.mes === 8));
      
        if ((Number(terminacion[6]) === 6 || Number(terminacion[6]) === 5) && (this.mes === 7 || this.mes === 8) ) {
          // console.log('terminacion: '+terminacion[6] + ' del mes ' + this.mes)
          this.registroRecordatorioVerificacion(anio,placas,Number(terminacion[6]))
        }
        if ((Number(terminacion[6]) === 7 || Number(terminacion[6]) === 8) && (this.mes === 8 || this.mes === 9) ) {
          // console.log('terminacion: '+terminacion[6] + ' del mes ' + this.mes)
          this.registroRecordatorioVerificacion(anio,placas,Number(terminacion[6]))
        }
        if ((Number(terminacion[6]) === 3 || Number(terminacion[6]) === 4) && (this.mes === 9 || this.mes === 10) ) {
          // console.log('terminacion: '+terminacion[6] + ' del mes ' + this.mes)
          this.registroRecordatorioVerificacion(anio,placas,Number(terminacion[6]))
        }
        if ((Number(terminacion[6]) === 1 || Number(terminacion[6]) === 2) && (this.mes === 10 || this.mes === 11) ) {
          // console.log('terminacion: '+terminacion[6] + ' del mes ' + this.mes)
          this.registroRecordatorioVerificacion(anio,placas,Number(terminacion[6]))
        }
        if ((Number(terminacion[6]) === 0 || Number(terminacion[6]) === 9) && (this.mes === 11 || this.mes === 12) ) {
          // console.log('terminacion: '+terminacion[6] + ' del mes ' + this.mes)
          this.registroRecordatorioVerificacion(anio,placas,Number(terminacion[6]))
        }
    })
  }
  registroRecordatorioVerificacion(anio:string, placas:string, terminacion:number){
      // console.log(`Recordatorio ${anio} placas ${placas} con termiancion ${terminacion}`)
      
      get(child(dbRef, `recordatoriosVerificacion/${anio}/${placas}/recordatorio`)).then((snapshot) => {
        if (snapshot.exists()) {
          let sendMem = Boolean(snapshot.val())
          if (sendMem) {
            // console.log(`ya se envio recordatorio ${anio} placas ${placas} con termiancion ${terminacion}`);
          }
        } else {
          this.dataPlacas.forEach(misPlacas => {
    
            if (misPlacas.placas === placas) {
              this.getFechaHora()
              const tempData ={
                cliente: misPlacas.cliente,
                fecha: this.fecha,
                anio,
                placas,
                recordatorio: true
              }
              this.registraEnvioRecordatorio(tempData)
            }
          })  
        }
      }).catch((error) => {
        console.error(error);
      });
  }
  registraEnvioRecordatorio(data:any){
      // const newPostKey = push(child(ref(db), 'posts')).key
        const datatemp = {
          recordatorio: data.recordatorio,
          cliente: data.cliente,
          fecha: data.fecha
    
        }
      set(ref(db, `recordatoriosVerificacion/${data.anio}/${data.placas}`), datatemp )
              .then(() => {
                // Data saved successfully!
                console.log(`Se registro recordatorio`);
              })
              .catch((error) => {
                // The write failed...
              });
  }
  recordatoriosCotizaciones(){
    
    const starCountRef = ref(db, `cotizacionesRealizadas`)

    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {       
        const arreglo = this.crearArreglo2(snapshot.val())
        setTimeout(() => {
          // console.log(arreglo);
          for (let index = 0; index < arreglo.length; index++) {
            const cotizacion = arreglo[index];
            this.getFechaHora()
            const dias =this.restaFechas(cotizacion.fecha,this.fecha)
            

            // 
            if (dias === 3) {
           

              get(child(dbRef, `cotizacionesRealizadas/${cotizacion.id}/recordatorio3dias`)).then((snp) => {
                // console.log(snp.val());
                const valor:boolean = snp.val()
                // console.log(`${cotizacion.id} - ${cotizacion.no_cotizacion}: ${valor}`);
                
                if (valor === true) {
                  
                }else{
                  // console.log('dias :'+dias + ' -> ' + cotizacion.id);
                  set(ref(db, `cotizacionesRealizadas/${cotizacion.id}/recordatorio3dias`), true )
                  .then(async () => {
                    // Data saved successfully!
                    // let  cliente = this.clientes.find(option=>option.id === cotizacion.cliente)
                    let cliente = [], vehiculo =[]

                    
                    await get(child(dbRef, `clientes/${cotizacion.cliente}`)).then((snapshot) => {
                      if (snapshot.exists()) {
                        const cli = snapshot.val()
                        const tempData = {
                          ...cli,
                          fullname: `${cli.nombre} ${cli.apellidos}`
                        }
                        cliente = tempData
                      } else {
                        console.log("No data available");
                      }
                    }).catch((error) => {
                      console.error(error);
                    });
                    await get(child(dbRef, `vehiculos/${cotizacion.vehiculo}`)).then((snapshot) => {
                      if (snapshot.exists()) {
                        vehiculo = snapshot.val()
                      } else {
                        console.log("No data available");
                      }
                    }).catch((error) => {
                      console.error(error);
                    });

                    // const vehiculo = this.vehiculos.find(option=>option.id === cotizacion.vehiculo)

                    let filtro_conceptos = []
                    for (let index = 0; index < cotizacion.elementos.length; index++) {
                      const element = cotizacion.elementos[index];
                      // console.log(element);
                      const tempDataname = {concepto:element.nombre}
                      filtro_conceptos.push(element.nombre)
                    }
                    // console.log(filtro_conceptos);
                    // console.log(cliente);
                    setTimeout(() => {
                      // this._email.recordatorioCotizacion(cliente,vehiculo,cotizacion,filtro_conceptos)
                    }, 1000);
                    // console.log('envio email');
                  })
                  .catch((error) => {
                    // The write failed...
                  });
                }
                
                
            })
            }
           
          }
          
        }, 5000);
      } else {
        // console.log("No data available");
      }
    })
  
    //   get(child(dbRef, `/cotizacionesRealizadas`)).then((snapshot) => {
    //     if (snapshot.exists()) {
    //       const CR = this.crearArreglo2(snapshot.val())
    //       for (let index = 0; index < CR.length; index++) {
    //         const cotizacion = CR[index];
    //         this.getFechaHora()
    //         get(child(dbRef, `cotizacionesRealizadas/${cotizacion.id}/recordatorio3dias`)).then((snapshot) => {
    //           if (snapshot.exists()) {
    //             console.log(snapshot.val());
    //           } else {
    //             const dias =this.restaFechas(cotizacion.fecha,this.fecha)
    //             if (dias===3) {
    //               

    //               set(ref(db, `cotizacionesRealizadas/${cotizacion.id}/recordatorio3dias`), true )
    //                 .then(() => {
    //                   
    //                   console.log('recordatorio enviado: ' + cotizacion.id)
    //                 })
    //                 .catch((error) => {
    //                   // The write failed...
    //                 });
    //             }
    //           }
    //         }).catch((error) => {
    //           console.error(error);
    //         });
            
           
    //       }
    //     } else {
    //       console.log("No data available");
    //     }
    //   }).catch((error) => {
    //     console.error(error);
    //   });
    // }, 100000);
	
  }

  ///funciones de mensajes
  mensajeCorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: mensaje
    })
  }
  mensajeIncorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: mensaje
    })
  }
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
  ///crear arregoo con ID
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
  //obtener la fecha y hora actual
  getFechaHora(){
    const date: Date = new Date()
    const months = ["enero", "febrero", "marzo","abril", "mayo", "junio", "julio", "agosto", "septiembre", "aoctibre", "noviembre", "diciembre"];
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    this.fecha=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    this.hora=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
    const n = new Date(date)
    
    n.setDate(date.getDate()+3);
    // this.vencimiento = n.toLocaleDateString()
    const numeroDia = new Date(date).getDay();
    // console.log(dias[numeroDia]+ ' '+ date.getDate()+" "+(months[date.getMonth()])+" "+date.getFullYear());
    // this.fechaPDF = `${dias[numeroDia]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

  }
  restaFechas = function(f1,f2)
   {
     var aFecha1 = f1.split('/');
     var aFecha2 = f2.split('/');
     var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
     var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
     var dif = fFecha2 - fFecha1;
     var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
     return dias;
   }
}
