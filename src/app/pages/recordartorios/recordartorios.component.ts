import { Component, OnInit, ViewChild } from '@angular/core';
import { getDatabase, onValue, ref, set, push, get, child } from 'firebase/database';
import { EmailsService } from 'src/app/services/emails.service';

//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

const db = getDatabase()
const dbRef = ref(db);
@Component({
  selector: 'app-recordartorios',
  templateUrl: './recordartorios.component.html',
  styleUrls: ['./recordartorios.component.css']
})
export class RecordartoriosComponent implements OnInit {
  listSucursales:any=[]
  listCitas:any=[]
  citasHoy=[]
  citasManiana=[]
  //data cliente 
  dataClien:any = []
  //data de viculo
  dataVehiculo:any = []
  //citas con recordatorio 
  listRecorEnviado:any =[]
  listRecorEnviar:any =[]
  fecha:string=''
  hora:string=''
  maniana:string =''
  anio:string = ''
  mes:number= 0
  displayedColumnsSuperSU: string[] = ['nombre','placas', 'sucursal', 'fecha','hora']
  displayedColumnsSuperSUExtended: string[] = [...this.displayedColumnsSuperSU]
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  clickedRows = new Set<any>()

  //altura minima de columnas
  miniColumnas:number = 100

  cargaData:boolean = true
  listPlacas:any=[]
  dataPlacas:any =[]
  terminaciones:any=['0','1','2','3','4','5','6','7','8','9']
  constructor(private _email: EmailsService) { }

  ngOnInit(): void {
    this.listaSucursales()
    this.obtCitas()
    this.recordatoriosVerificacion()
    this.verificacionPorvehiculos()
    // this.enviarRecordatorios()
  }
  listaSucursales(){
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
      this.listSucursales= this.crearArreglo2(snapshot.val())
      // this.obtCitas()
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
        this.citasHoy =[]
        this.citasManiana=[]
        this.recordatoriosEnvia(maniana)
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
          console.log("No data available");
        }
      })
  }
  verificacionPorvehiculos(){
    const starCountRef = ref(db, `vehiculos`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            setTimeout(() => {
              this.registraAutosVerificacion()
            }, 1000)
          } else {
            console.log("No data available");
          }
        })
  }
 
  filtroEnviar(){
  this.listRecorEnviado = this.citasManiana.filter(filter=>filter.recordatorio===true)
  this.listRecorEnviar = this.citasManiana.filter(filter=>filter.recordatorio===false)
  this.obtenerInformacion()
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
  
 obtenerInformacion(){
  let dataTable:any = []
  this.listRecorEnviar.forEach(enviar => {
    get(child(dbRef, `clientes/${enviar.cliente}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let datCliente:any = snapshot.val()
        get(child(dbRef, `vehiculos/${enviar.cliente}/${enviar.vehiculo}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let dataVehiculo = snapshot.val()
            const tempDataEnviar = {
              ...enviar,
              ...datCliente,
              ...dataVehiculo,
              nombre: datCliente.nombre + ' ' + datCliente.apellidos,
              idSucursal: enviar.sucursal,
              sucursal: 'polanco'
            }
            // console.log(this.maniana);
            dataTable.push(tempDataEnviar)
            // console.log(tempDataEnviar);
            
              this.dataSource = new MatTableDataSource(dataTable)
              this.newPagination()
            // console.log(tempDataEnviar)
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  })
  
  
 }
 enviarRecordatorios(){
  console.log(this.listRecorEnviar);

  this.listRecorEnviar.forEach(enviar => {
    get(child(dbRef, `clientes/${enviar.cliente}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let datCliente:any = snapshot.val()
        get(child(dbRef, `vehiculos/${enviar.cliente}/${enviar.vehiculo}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let dataVehiculo = snapshot.val()
            const tempDataEnviar = {
              ...enviar,
              ...datCliente,
              ...dataVehiculo,
              fullname: datCliente.nombre + ' ' + datCliente.apellidos,
            }
            
            console.log(this.maniana);
            
            const tempEmail ={
              from:'desarrollospeed03@gmail.com',
              email: tempDataEnviar.correo,
              subject: 'Recordatorio de cita SpeedPro',
              mensaje: `
              <div style="margin-top: 20px; box-shadow: 0px 10px 10px black;">
                <div style="width: 100%; height:50%; margin: auto 0;padding:1.5em 1.5em; ">
                    <div style=" background-color: #F0F5F8;display:flex; justify-content: center;align-items: center;text-align: center;">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/speedpro-3a4e1.appspot.com/o/logos%2FlogoSpeedBig.png?alt=media&token=bebffe87-3000-4317-b322-67adef4a971b"
                        alt="" class=" img-thumbnail" style="width: 100%; height:300px;">
                    </div>
                  <br><br>
                  <div style="text-align:start">
                    <h2 style="text-transform: uppercase; font-size: 2.3em; background-color: #0B70AE; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
                    Recordatorio de cita <strong>SpeedPro</strong></h2>
                  </div>
                  <div style=" text-align: justify">
                      <p style="font-size: 2em; background-color: #962F91; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
                      Notificación de cita SpeedPro te informa que tu cita es <strong> MAÑANA </strong>
                      </p>
                    <!-- <p>SpeedPro te informa... que tu cita es <strong> Mañana </strong>!!</p> -->
              
                    <p style="font-size: 1.5em; background-color: lavender; color:black;margin: 0;padding: 1em 1em;">
                      Estimado ${tempDataEnviar.fullname} la cita que registraste en SpeedPro del
                       vehiculo ${tempDataEnviar.marca} ${tempDataEnviar.categoria} con placas ${tempDataEnviar.placas}
                       modelo ${tempDataEnviar.modelo}, color ${tempDataEnviar.color}, es el día ${tempDataEnviar.fecha} ${tempDataEnviar.hora}.
                    </p>
                    <p>Para más información consulta la información adicional siguiendo en enlace en el botón de abajo</p>
                  </div>
              
                  <div style="text-align: center">
                      <a href="https://speedpro-3a4e1.web.app" target="_blank" style="text-decoration:none;background-color: #0d6efd; color:white; font-size:2em; border:2px; border-color:black; border-radius: 8px;margin: 0;padding: .5em 0.5em;" class="btn btn-primary">SpeedPro</a>
                  </div>
                </div>
              </div>`
            }
            console.log(tempDataEnviar);
            
            
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  })
 }
 getFechaHora() {
  let date: Date = new Date();
  this.fecha = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  this.hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  this.anio = String(date.getFullYear())
  this.mes =date.getMonth() + 1
}
newPagination(){
  setTimeout(() => {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
    this.cargaData = false
   }, 400)
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage()
  }
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
