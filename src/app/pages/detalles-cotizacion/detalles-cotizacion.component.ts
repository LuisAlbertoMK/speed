import { Component, OnInit } from '@angular/core';


//firebase

import { getDatabase, ref, child, get, onValue, push } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFirmaService } from 'src/app/services/upload-firma.service';
import Swal from 'sweetalert2';
import { elementClosest } from '@fullcalendar/angular';
const db = getDatabase();
const auth = getAuth();
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-detalles-cotizacion',
  templateUrl: './detalles-cotizacion.component.html',
  styleUrls: ['./detalles-cotizacion.component.css']
})
export class DetallesCotizacionComponent implements OnInit {
  // variables de informacion de recepcion
  idRecepcion:string= ''
  idCliente:string=''
  sucursalCliente:string = ''
  idVehiculo:string = ''
  pagina:string = ''
  //roles
  ROL: string = ''
  SUCURSAL:string=''

  //informacion de recepcion
  dataRecepcion:any =[]
  dataSucursal:any=[]
  dataCliente:any=[]
  dataVehiculo:any=[]
  dataStatus:any=[]
  dataCotizacion:any =[]
  dataElementos:any=[]
  dataComplementos:any=[]
  //variable de verificacion de informacion
  inforValida:boolean = false; totalCotizacion:number =0
  constructor(private rutaActiva: ActivatedRoute, private _uploadfirma: UploadFirmaService, private router : Router) { }

  ngOnInit(): void {
    this.rol()
    this.asignacionParametros()
    this.verificar()
    this.espere()
  }
  rol(){
    // this.ROL =localStorage.getItem('tipoUsuario')
    // this.SUCURSAL =localStorage.getItem('sucursal')
    // if (this.ROL ==='') {
    //   this.router.navigateByUrl('/login')
    // }
    }
  asignacionParametros(){
    this.idRecepcion = this.rutaActiva.snapshot.params['idRecepcion']
    this.pagina = this.rutaActiva.snapshot.params['pagina']
  }
  espere(){
    let timerInterval
    Swal.fire({
      title: 'Espere!',
      html: 'Obteniendo información...',
      timer: 500,
      timerProgressBar: true,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading()
        // const b = Swal.getHtmlContainer().querySelector('b')
        // timerInterval = setInterval(() => {
        //   b.textContent = String(Swal.getTimerLeft())
        // }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // console.log('I was closed by the timer')
      }
    })
  }
  verificar(){
    const starCountRef = ref(db, `cotizacionesRealizadas/${this.idRecepcion}`)
        onValue(starCountRef, (snapshot) => {
          this.nuevaConsulta()
        })
  }
  nuevaConsulta(){
    const starCountRef = ref(db, `recepcion/${this.idRecepcion}`)
        onValue(starCountRef, (snapshot) => {
	        this.dataRecepcion = snapshot.val()
          
          if (this.dataRecepcion=== null) {
            this.inforValida = false
          }else{
            this.inforValida=true
              const dbRef = ref(getDatabase());
              get(child(dbRef, `sucursales/${this.dataRecepcion.sucursal}`)).then((snpasucursal) => {
                if (snpasucursal.exists()) {
                  this.dataSucursal = snpasucursal.val()
                } else {
                  // console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              });
              get(child(dbRef, `clientes/${this.dataRecepcion.cliente}`)).then((snpCliente) => {
                if (snpCliente.exists()) {
                  this.dataCliente = snpCliente.val()
                } else {
                  // console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              })
              get(child(dbRef, `vehiculos/${this.dataRecepcion.vehiculo}`)).then((snpvehiculo) => {
                if (snpvehiculo.exists()) {
                  this.dataVehiculo = snpvehiculo.val()
                } else {
                  // console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              })
              get(child(dbRef, `recepcionStatus/${this.dataRecepcion.cliente}/${this.dataRecepcion.vehiculo}/${this.idRecepcion}`)).then((snpstatus) => {
                if (snpstatus.exists()) {
                  this.dataStatus = snpstatus.val()
                } else {
                  // console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              })
              // console.log(`cotizacionesRealizadas/${this.idRecepcion}/elementos`);
              get(child(dbRef,  `cotizacionesRealizadas/${this.idRecepcion}`)).then((snapshot) => {
                if (snapshot.exists()) {
                  this.dataCotizacion=snapshot.val()
                } else {
                  // console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              });
              get(child(dbRef, `cotizacionesRealizadas/${this.idRecepcion}/elementos`)).then((snpelementos) => {
                if (snpelementos.exists()) {
                  this.dataComplementos =[]
                  this.dataElementos=[]
                  let complementos = this.crearArreglo2(snpelementos.val())  
                  // console.log(complementos);
                  this.totalCotizacion =0    
                  complementos.forEach(elemento => {
                    // console.log(elemento.tipo);
                    
                    if (elemento.tipo ==='paquete') {
                      get(child(dbRef, `paquetes/${elemento.idReferencia}`)).then((snppaquete) => {
                        if (snppaquete.exists()) {
                          let infoC = snppaquete.val()
                          const temp ={
                            ...infoC,
                            tipo: elemento.tipo,
                            precio: infoC.precio,
                            idReferencia: elemento.idReferencia
                          }

                          this.totalCotizacion = this.totalCotizacion + infoC.precio
                          

                          // console.log(temp);
                          this.dataElementos.push(this.infoPaquete(temp))
                          this.dataComplementos.push(temp)
                        } else {
                          console.log("No data available");
                        }
                      }).catch((error) => {
                        console.error(error);
                      });
                      
                    }else{
                     if (elemento.tipo === 'MO') {
                      get(child(dbRef, `manos_obra/${elemento.idReferencia}`)).then((snapshot) => {
                        if (snapshot.exists()) {
                          // console.log(snapshot.val());
                          let infoMO = snapshot.val()
                          const temp = {
                            ...infoMO,
                            tipo: elemento.tipo
                          }
                          
                          
                          this.totalCotizacion = this.totalCotizacion + infoMO.precio
                          this.dataComplementos.push(temp)
                        } else {
                          console.log("No data available");
                        }
                      }).catch((error) => {
                        // console.error(error);
                      });
                     }
                     if (elemento.tipo === 'refaccion') {
                      get(child(dbRef, `refacciones/${elemento.idReferencia}`)).then((snapshot) => {
                        if (snapshot.exists()) {
                          // console.log(snapshot.val());
                          let infoMO = snapshot.val()
                          const temp = {
                            ...infoMO,
                            tipo: elemento.tipo
                          }
                          

                          this.totalCotizacion = this.totalCotizacion + infoMO.precio
                          this.dataComplementos.push(temp)
                        } else {
                          console.log("No data available");
                        }
                      }).catch((error) => {
                        console.error(error);
                      });
                      }                    
                    }
                  })  
                } else {
                  // console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              })
          }
          
        })
  }

  infoPaquete(data:any){
    // console.log(data);
    
    let perteneciente =[]
    const strincluye = ref(db, `paquetesComplementos/${data.idReferencia}`)
    onValue(strincluye, (snapshot) => {
      let arreglo= this.crearArreglo2(snapshot.val())
      arreglo.forEach(element => {
        if (element.tipo === 'refacciones') {
          const strrefacciones = ref(db, `refacciones/${element.IDreferencia}`)
          onValue(strrefacciones, (snpdataRefaccion) => {
            let minewarr= snpdataRefaccion.val()
            const dataRefaccion ={
              ...minewarr,
              precio: minewarr.precio,
              cantidad: element.cantidad,
              subtotal:minewarr.precio * element.cantidad,
              tipo: 'refacciones'
            }
            perteneciente.push(dataRefaccion)
          })
        }else{
          const starMO = ref(db, `manos_obra/${element.IDreferencia}`)
          onValue(starMO, (snpdataMO) => {
            let minewarr= snpdataMO.val()
            const tempInfo ={
              ...minewarr,
              precio:minewarr.precio,
              cantidad: element.cantidad,
              subtotal:minewarr.precio * element.cantidad,
              tipo: 'Mano de obra'
            }
            perteneciente.push(tempInfo)
          })
        }
      });
    })
    const tempDataReturn ={
      tipo: data.tipo,
      nombre: data.nombre,
      datos: perteneciente
    }
    // console.log(tempDataReturn);
    
    return tempDataReturn
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
}
