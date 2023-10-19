
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, onValue, ref, set, push, child, get } from 'firebase/database';
import Swal from 'sweetalert2'

import { UploadFirmaService } from 'src/app/services/upload-firma.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { EmailsService } from '../../services/emails.service';
import { CamposSystemService } from 'src/app/services/campos-system.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {nombre: string, apellidos:string}
@Component({
  selector: 'app-modificar-cotizacion',
  templateUrl: './modificar-cotizacion.component.html',
  styleUrls: ['./modificar-cotizacion.component.css']
})
export class ModificarCotizacionComponent implements OnInit {
  constructor(private rutaActiva: ActivatedRoute, private _uploadfirma: UploadFirmaService, 
    private router : Router, private _email:EmailsService, private _campos: CamposSystemService,
  private fb: FormBuilder) { }


  miniColumnas:number = this._campos.miniColumnas
// variables de informacion de recepcion
idCotizacion:string= ''
idCliente:string=''
sucursalCliente:string = ''
idVehiculo:string = ''
//array de sucursales
// listaSucursales=[]
//informacion de l¿cliente
fullname:string = ''
//informacion de cotizacion
infoCotizacion:any=[]
//de claracion de formularios
formCotizacion: FormGroup
//autocompletado
myControl = new FormControl('');
filteredOptions: Observable<any[]>
//conocer al cliente
IDClienteGetData:string=''
//manejo de tablas en ventanas modal
venatanaModalPaquetes:boolean = false
venatanaModalManoObra:boolean = false
venatanaModalRecacciones:boolean = false
  // array paquete y complementos
  tempCot:any=[]
  //para paginacion de resultados
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  
  //tables de material ui
 
 columnasModal:string[]=['nombre','marca','modelo','cilindros','total','status','opciones']
 columnasModalManoObra:string[]=['nombre','precio','descripcion','status','opciones']
 columnasModalRefacciones:string[]=['nombre','precio','descripcion','status','opciones']
  
  //para fecha y hora
  fecha:string = ''
  hora:string=''
  //tal de la cotizacion
  totalCotizacion:number = 0
   //arraytempDataCotizacion
  tempdataCotizacion:any=[]
  tempdataCotizacionmuestra:any=[]
   //informacion de cliente si existe 
   clienteExiste:any=[]
   ///informacion de vehiculos
   infoVehiculos:any=[]
  
   //informacion global
   nombre:string=''
   totalShow:string = ''
   // lista de complementos de paquete 
   complemntosPQ:any = []


   dataDetalles:any=''
   dataCliente:any=[]
   dataVehiculo:any = []
   dataRecepcion:any=[]
   //temp costo cotizacion
   costoAnt:number=0; servicios:any=['servicio','garantia','retorno','preventivo','correctivo','rescate vial']

  ngOnInit(): void {
    this.asignacionParametros()
    this.esperar()
    this.crearformCotizacion()
  }
 
  asignacionParametros(){
    this.idCotizacion = this.rutaActiva.snapshot.params['idCotizacion']
  }
  esperar(){
    let timerInterval
    Swal.fire({
      title: 'Cargando informacion...',
      html: 'Espere porfavor',
      timer: 1500,
      timerProgressBar: true,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // console.log('I was closed by the timer')
        this.informacionCotizacion()
      }
    })
  }
  crearformCotizacion(){
    this.formCotizacion = this.fb.group({
      cliente:['',[Validators.required]],
      vehiculo:['',[Validators.required]],
      servicio:['',[Validators.required]]
    })
  }

  obtenerTotalCotizacion(){
    this.totalCotizacion =0
    this.tempdataCotizacionmuestra = this.tempdataCotizacion.filter(filtro=>filtro.ingresado === true)
    this.tempdataCotizacionmuestra.forEach(tempcoti => {
      this.totalCotizacion = Number(this.totalCotizacion) + Number(tempcoti.total)
    })
  }
  getCompleta(IDPaquete:string,data:any){
    this.nombre = data.nombre
   this.totalShow = data.total
   this.complemntosPQ = data.complementos
 }
 getDetalles(data:any){
   this.dataDetalles = data
 }
  verificaDatos(){
   
    let clienteGet = this.formCotizacion.controls['cliente'].value
    let vehiculoGet = this.formCotizacion.controls['vehiculo'].value
    
    const tempInfocliente={
      cliente: clienteGet,
      vehiculo: vehiculoGet,
      
    }
    this.venatanaModalPaquetes = true
    this.venatanaModalManoObra= false
    this.venatanaModalRecacciones= false

    const starCountRef = ref(db, 'paquetes')
    onValue(starCountRef, (snppaquete) => {
      
      this.tempCot =[]
      let newDa=[]
      let datPaquetes = this.crearArreglo2(snppaquete.val())
      datPaquetes.forEach(paquete => {

        
        const starpC = ref(db, 'paquetesComplementos/'+paquete.id)
            onValue(starpC, (snpC) => {
              let informacion={
                total: paquete.total,   
                id:paquete.id,
                marca:paquete.marca,
                modelo:paquete.modelo,
                cilindros:paquete.cilindros,
                nombre:paquete.nombre,
                status:paquete.status,
                complementos:[]
              }
              let refaTemp =[]
              
              let newD= this.crearArreglo2(snpC.val())
              newD.forEach(Comple => {
                if (Comple.tipo==='refacciones') {
                  
                  const starRefacc = ref(db, 'refacciones/'+Comple.IDreferencia)
                  onValue(starRefacc, (snpRefaccion) => {
                    const dataRefaccion = snpRefaccion.val()
                    dataRefaccion.subtotal = dataRefaccion.precioCompra * Comple.cantidad
                    dataRefaccion.cantidad = Comple.cantidad
                    dataRefaccion.precio = dataRefaccion.precioCompra
                    dataRefaccion.tipo = 'refacción'
                    refaTemp.push(dataRefaccion)
                  })
                }
                if (Comple.tipo==='Mano obra') {
                  const starMO = ref(db, 'manos_obra/'+Comple.IDreferencia)
                  onValue(starMO, (snpMO) => {
                    const MO = snpMO.val()
                    MO.cantidad = 1
                    MO.marca = 'S/D'
                    MO.subtotal = MO.precio
                    MO.marca = 'S/M'
                    MO.tipo = 'Mano de obra'
                    refaTemp.push(MO)
                  })
                }
              })
             
              informacion.complementos = refaTemp
              if (informacion.total === 0) {
                // console.log(informacion);
                
              }
              // console.log(informacion);
              
              this.tempCot.push(informacion)
              newDa=[]
              newDa = this.tempCot.filter(info=>info.total !==0)              
              this.dataSource = new MatTableDataSource(newDa)
              this.newPagination()
              
            })
      })
              
    })

      
      
  }
  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort;
     }, 1000)
  }
  informacionCotizacion(){
    const starCountRef = ref(db, `cotizaciones/${this.idCotizacion}`)
        onValue(starCountRef, (snapshot) => {
	        let arreglo= snapshot.val()
          this.dataRecepcion = snapshot.val()
          if (arreglo===null) {
            let timerInterval
            Swal.fire({
              title: 'Alerta',
              html: 'No se encontro información relacionada <br> <strong>sera redirigido en breve</strong>',
              timer: 2000,
              timerProgressBar: true,
              allowOutsideClick:false,
              didOpen: () => {
                Swal.showLoading()
                
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                this.router.navigateByUrl('/cotizacion')
              }
            })
          }
          console.log(`clientes/${this.dataRecepcion.cliente}`);
          
            get(child(dbRef, `clientes/${this.dataRecepcion.cliente}`)).then((snpCliente) => {
              if (snpCliente.exists()) {
                // console.log(snpCliente.val());
                let clie = snpCliente.val()
                const clien = {
                  ...clie,
                  fullname: clie.nombre + ' ' + clie.apellidos
                }
                
                
                this.dataCliente = clien
                // console.log(this.dataCliente);
                
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
              console.error(error);
            })
            get(child(dbRef, `vehiculos/${arreglo.vehiculo}`)).then((snpVehiculo) => {
              if (snpVehiculo.exists()) {
                // console.log(snpVehiculo.val());
                this.dataVehiculo = snpVehiculo.val()
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
              console.error(error);
            });
            this.infoCotizacion =arreglo
            this.tempdataCotizacion = arreglo.elementos
            this.obtenerTotalCotizacion()
          
    })
    const srtaVehiculos = ref(db, `vehiculos/${this.idCliente}/${this.idVehiculo}`)
        onValue(srtaVehiculos, (snapshot) => {
	        this.infoVehiculos = snapshot.val()
        })
  }
  verificaTipoServicio(){
    let servicio = this.formCotizacion.controls['servicio'].value
    if (servicio ==='garantia' || servicio === 'retorno') {
      Swal.fire({
        title: 'Relacion?',
        text: "Buscar relacion de servicio!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    }else{
      
    }
  }
  guardarCotizacionNew(){
    if (this.formCotizacion.invalid) {
      return Object.values(this.formCotizacion.controls).forEach(control => {
        control.markAsTouched()
        Swal.fire('Error','LLenar todos los campos necesarios','error')
      })
    }else{
      // Swal.fire('Exito','Accion correcta','success')
      
    }
  }
  validarFormCotizacion(campo:string){
    return this.formCotizacion.get(campo).invalid && this.formCotizacion.get(campo).touched
  }
  displayFn(val: User): string {
    return val && (val.nombre +' '+ val.apellidos) ? (val.nombre +' '+ val.apellidos) : ''
  }
  vehiculosCliente(data:any){
    if (data ==='undefined') {
      return
    }
    // console.log(data.value.id)
       
      this.IDClienteGetData = data.value.id
      this.formCotizacion.controls['cliente'].setValue(this.IDClienteGetData)
      
      // this.IDClienteGetData=this.formCotizacion.controls['cliente'].value
      // console.log(this.IDClienteGetData);
      
      // if (this.IDClienteGetData!=='') {
      //   this.selecciono = true
      // }else{
      //   this.selecciono = false
      // }
      
    
    
  }
  consultaManoObra(){

    this.venatanaModalPaquetes = false
    this.venatanaModalManoObra= true
    this.venatanaModalRecacciones= false
    const starCountRef = ref(db, 'manos_obra')
        onValue(starCountRef, (snapshot) => {
	        let arreglo=[]
      	  arreglo = this.crearArreglo2(snapshot.val())
          // this.arrayManosObra = arreglo
          this.dataSource = new MatTableDataSource(arreglo)
          this.newPagination()
        })
  }
  consultaRefacciones(){
    this.venatanaModalPaquetes = false
    this.venatanaModalManoObra= false
    this.venatanaModalRecacciones= true
    const starCountRef = ref(db, 'refacciones')
        onValue(starCountRef, (snapshot) => {
	        let arreglo=[]
      	  arreglo = this.crearArreglo2(snapshot.val())
          // this.arrayManosObra = arreglo
          this.dataSource = new MatTableDataSource(arreglo)
          this.newPagination()
        })
  }
  guardaraCotizacion(){
    Swal.fire({
      title: 'Guardar cotización?',
      text: "esta cotizacion puede convertirse en recepción futura verificar su información!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.getFechaHora()
        const tempData ={
          ...this.formCotizacion.value,
          elementos: [] ,
          total: this.totalCotizacion,
          fecha: this.fecha,
          hora:this.hora,
          aprobada:false
        }
        
        tempData.elementos = this.tempdataCotizacionmuestra

        if (this.idCotizacion==='newCotizacion') {
            const newPostKey = push(child(ref(db), 'posts')).key
            tempData.aprobada = false
            set(ref(db, `cotizaciones/${tempData.cliente}/${tempData.vehiculo}/${newPostKey}`), tempData )
            .then(() => {
              // Data saved successfully!
              this.tempdataCotizacion=[]
              this.tempdataCotizacionmuestra =[]
              this.totalCotizacion =0
              this.formCotizacion.reset()
              Swal.fire(
                'Correcto!',
                'La cotización se guardo correctamente.',
                'success'
              )
            })
            .catch((error) => {
              // The write failed...
            })
        }else{
          tempData.aprobada = true
          let sucursalCliente = this.clienteExiste.sucursal
          let vehiculoCliente = this.clienteExiste.vehiculo
          set(ref(db, `recepcion/${this.idCotizacion}/cotizacion`), true )
          // set(ref(db, `recepcionStatus/${tempData.cliente}/${this.idVehiculo}/${this.idCotizacion}/status`), 'recibido' )
          set(ref(db, `cotizaciones/${this.idCotizacion}`), tempData )
          .then(() => {
            // Data saved successfully!
            this.tempdataCotizacion=[]
            this.tempdataCotizacionmuestra =[]
            
            const tempEmail ={
              from:'desarrollospeed03@gmail.com',
              email: this.dataCliente.correo,
              subject: 'Actualización de cotización SpeedPro',
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
                    cambio de Cotización <strong>SpeedPro</strong></h2>
                  </div>
                  <div style=" text-align: justify">
                      <p style="font-size: 2em; background-color: #962F91; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
                      Notificación de cambio de cotización
                      </p>
                    <!-- <p>SpeedPro tiene una comunidad que se alegra de tenerte con nosotros!!</p> -->
              
                    <p style="font-size: 1.5em; background-color: lavender; color:black;margin: 0;padding: 1em 1em;">
                      Estimado ${this.dataCliente.fullname} hubo un ajuste en cotización del vehiculo  ${this.dataVehiculo.marca}, ${this.dataVehiculo.categoria} con placas ${this.dataVehiculo.placas}, modelo  ${this.dataVehiculo.modelo}, color  ${this.dataVehiculo.color} cuenta con cotización SpeedPro el día ${this.fecha} ${this.hora}.
                    </p>
                    <p style="text-align:center">Para más información, sigue el enlace con el botón de abajo</p>
                  </div>
              
                  <div style="text-align: center">
                      <a href="https://www.google.com/" target="_blank" style="text-decoration:none;background-color: #0d6efd; color:white; font-size:2em; border:2px; border-color:black; border-radius: 8px;margin: 0;padding: .5em 0.5em;" class="btn btn-primary">SpeedPro</a>
                  </div>
                </div>
              </div>`
            }
            // console.log(this.costoAnt + ' !== '+ this.totalCotizacion);
            // if (this.costoAnt !== this.totalCotizacion) {
              
            // }
            this.totalCotizacion =0
            Swal.fire(
              'Correcto!',
              'La cotización se guardo correctamente.',
              'success'
            )
            // this.router.navigateByUrl('/cotizacion')
          })
          .catch((error) => {
            // The write failed...
          })
        }
      }
    }) 
  }
  addCotizacion(idPaquete:string,dataPaquete:any,tipo:string){
    this.formCotizacion.invalid
    const temp = {
      idPaquete,
      nombre:dataPaquete.nombre,
      total:0,
      tipo,
      ingresado: true,
      status: dataPaquete.status,
      descripcion:dataPaquete.descripcion
    }
    if (dataPaquete.descripcion) {
      
    }else{
      temp.descripcion = 'Ninguna'
    }
    
    if ( dataPaquete.total) {
      temp.total = dataPaquete.total
    }
      if ( dataPaquete.precio) {
        temp.total = dataPaquete.precio 
       }
        if (dataPaquete.precioCompra) {
          temp.total = dataPaquete.precioCompra 
        }
       
    
    
    if (this.tempdataCotizacion.length ===0) {
      this.tempdataCotizacion.push(temp)
    }
    let contador:number = 0
    for (let index = 0; index < this.tempdataCotizacion.length; index++) {
      const element = this.tempdataCotizacion[index].idPaquete;
      if (temp.idPaquete === element) {
        contador=contador+1
      }
    }
    
    if (contador===0) {
      this.tempdataCotizacion.push(temp)
    }else{
      for (let index = 0; index < this.tempdataCotizacion.length; index++) {
        const element = this.tempdataCotizacion[index].idPaquete
        if (element === temp.idPaquete) {
          this.tempdataCotizacion[index].ingresado = true
        }
      }
    }
    this.obtenerTotalCotizacion()
  }
  dropPaqueteCotizacion(idPaquete:string){
    for (let index = 0; index < this.tempdataCotizacion.length; index++) {
      const element = this.tempdataCotizacion[index].idPaquete
      
      if (element === idPaquete) {
        this.tempdataCotizacion[index].ingresado = false
       
      }
    }
    this.obtenerTotalCotizacion()
  }




  getFechaHora(){
    let date: Date = new Date()
    this.fecha=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    this.hora=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
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
