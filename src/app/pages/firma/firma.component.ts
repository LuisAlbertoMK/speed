import { Component, OnInit, AfterViewInit, ViewChild, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { getDatabase, onValue, ref, set, get, child } from 'firebase/database';
const db = getDatabase()
const dbRef = ref(getDatabase());
//librerias pdf
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFirmaService } from 'src/app/services/upload-firma.service';
import { EmailsService } from '../../services/emails.service';
import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css']
})
export class FirmaComponent implements OnInit,AfterViewInit {
  @ViewChild('firmaDigital',{static:true}) signatureElement:any; SignaturePad:any;
  firma:Blob
  color:boolean=true
  nombreColor:string='negro'
  
// variables de informacion de recepcion
  idRecepcion:string= ''; tipo:string=''; idCliente:string=''; listaSucursales=[]; dataCliente:any=[]; dataRecepcion:any=[]; dataSucursal:any=[];
  dataCotizacion:any =[]; dataVehiculo:any=[]; dataRealizadas:any=[]; dataElementos:any=[]; coplementosPaquete =[]; isChecked = true;
  sucursalCliente:string= ''; fecha:string = ''; hora:string; vehiculoObtenido:string = ''; muestraInformacion:boolean = false; totalCobrar:number =0
  anio:string = ''; mes:string = ''; dia:string =''; elementosOnlyPaquetes:any =[]; factura:boolean= false; iva:number = 0
  constructor(private rutaActiva: ActivatedRoute, private _uploadfirma: UploadFirmaService, private router : Router, 
    private _email:EmailsService) {

     }
  
  ngOnInit(): void {
    // this.downloadPDF()
    this.asignacionParametros()

    this.monitorear()
    this.mensajeAwait()
  }
  ngAfterViewInit() {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  ngAfterViewChecked(){
// this.obtenerInformacion()
  }
  asignacionParametros(){
    this.idRecepcion = this.rutaActiva.snapshot.params['idRecepcion']
  }
 
 async ocupadaFactura(){
  let valor = 0
  if (this.dataRecepcion.factura) {
    valor = 1
  }else{
    valor = 0
  }
    const { value: value } = await Swal.fire({
      title: 'Factura',
      input: 'checkbox',
      inputValue: valor,
      inputPlaceholder:
        'Requerir factura',
      confirmButtonText:
        'Continue <i class="fa fa-arrow-right"></i>',
      // inputValidator: (result) => {
      //   console.log(result);
        
      //   return !result && 'No se requiere factura'
      // }
    })
  
    // if (value === 1) {
    //   this.facturaBoolean(true,'Se requirio factura')
    // }else{
    //   this.facturaBoolean(false,'No se requirio factura')
    // }
  }
  facturaBoolean(factura:boolean){
    set(ref(db, `recepcion/${this.idRecepcion}/factura`), factura )
    .then(() => {
      this.isChecked = factura
      this.verificarCotizacion()
    })
    .catch((error) => {
      // The write failed...
    });
  }

  mensajeAwait(){
    let timerInterval
      Swal.fire({
        title: 'Cargando informacion...',
        html: 'Espere porfavor',
        timer: 1000,
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
        }
      })
    }
  EsperarUnPoco(){
    let timerInterval
        Swal.fire({
          title: 'Obteniendo información!',
          html: 'espere...',
          timer: 1000,
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
           this.obtenerInformacion()
          }
        })
    
  }
  monitorear(){
    const starCountRef = ref(db, `cotizacionesRealizadas/${this.idRecepcion}`)
    onValue(starCountRef, (snapshot) => {
    if (snapshot.exists()) {
      this.verificarCotizacion()
      } else {
        console.log("No data available");
    }       
    })
    const starRecepcion = ref(db, `recepcion/${this.idRecepcion}`)
    onValue(starRecepcion, (snapshot) => {
    if (snapshot.exists()) {
      this.obtenerInformacion()
      } else {
        console.log("No data available");
    }       
    })
  }
  verificarCotizacion(){
    get(child(dbRef, `cotizacionesRealizadas/${this.idRecepcion}`)).then((snpCotizacion) => {
      if (snpCotizacion.exists()) {
        this.dataCotizacion = snpCotizacion.val()
        
        // console.log(this.dataCotizacion);
        this.dataElementos = this.dataCotizacion.elementos
        this.totalCobrar = 0
         for (let index = 0; index < this.dataElementos.length; index++) {
           const element = this.dataElementos[index]
           if (element.tipo === 'paquete') {
             
             this.getinfocompl(`paquetes/${element.idReferencia}`).then((val:any)=>{
               this.dataElementos[index].nombre = val.nombre
               this.dataElementos[index].precio = val.precio
               // console.log(val);
               this.getinfocompl(`paquetesComplementos/${element.idReferencia}`).then((nuevo:any)=>{
                 const complementos = this.crearArreglo2(nuevo)
                 this.coplementosPaquete=[]
                 let coplementosPaquete=[]
                 this.totalCobrar =0
                 for (let indc = 0; indc < complementos.length; indc++) {
                   const element = complementos[indc];
                   // console.log(element)
                   if (element.tipo === 'mano obra') {
                     this.getinfocompl(`manos_obra/${element.IDreferencia}`).then((nuevo:any)=>{
                       // console.log(nuevo);
                       const data = {nombre:nuevo.nombre,precio  : nuevo.precio, cantidad: element.cantidad,
                                     subtotal: element.cantidad* nuevo.precio
                       }
                       this.totalCobrar = this.totalCobrar + data.subtotal
                       coplementosPaquete.push(data)
                       this.dataElementos[index].data = coplementosPaquete
                       if (this.dataRecepcion.factura) {
                         this.iva = Math.round(this.totalCobrar * .16)
                       }
                     })
                   }else{
                     this.getinfocompl(`refacciones/${element.IDreferencia}`).then((nuevo:any)=>{
                       const data = {nombre:nuevo.nombre,precio  : nuevo.precio, cantidad: element.cantidad,
                         subtotal: element.cantidad* nuevo.precio
                       }
                       this.totalCobrar = this.totalCobrar + data.subtotal
                       coplementosPaquete.push(data)
                       this.dataElementos[index].data = coplementosPaquete
                       if (this.dataRecepcion.factura) {
                         this.iva = Math.round(this.totalCobrar * .16)
                       }
                     })
                   }
                 }
                
                 
               })
               // this.coplementosPaquete = val.
             })
           }else{
             if (element.tipo === 'MO') {
               this.getinfocompl(`manos_obra/${element.idReferencia}`).then((val:any)=>{
                 // console.log(val);
                 this.totalCobrar = this.totalCobrar + val.precio
                 this.dataElementos[index].nombre = val.nombre
                 this.dataElementos[index].precio = val.precio
                 if (this.dataRecepcion.factura) {
                   this.iva = Math.round(this.totalCobrar * .16)
                 }
               })
             }else{
               this.getinfocompl(`refacciones/${element.idReferencia}`).then((val:any)=>{
                 // console.log(val);
                 
                 this.totalCobrar = this.totalCobrar + val.precio

                 this.dataElementos[index].nombre = val.nombre
                 this.dataElementos[index].precio = val.precio
                 if (this.dataRecepcion.factura) {
                   this.iva = Math.round(this.totalCobrar * .16)
                 }
               })
             }
           }
          
           
         }
        
        
        this.elementosOnlyPaquetes = this.dataElementos.filter(filtro=>filtro.tipo === 'paquete')                     
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })
  }
  obtenerInformacion(){
    get(child(dbRef,  `recepcion/${this.idRecepcion}`)).then((snpRecepcion) => {
          if (snpRecepcion.exists()) {
            this.muestraInformacion = true
            let dataRecep = snpRecepcion.val()        
            if (dataRecep.firmaEntrega) {          
            }
               // this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
               this.dataRecepcion = dataRecep
               this.isChecked = this.dataRecepcion.factura
               // if (dataRecep.cliente === cliente.id) {
               //   this.dataCliente = cliente
               get(child(dbRef, `clientes/${dataRecep.cliente}`)).then((snpCliente) => {
                 if (snpCliente.exists()) {
                   let dataCli = snpCliente.val()
                   const tempCli = {
                     ...dataCli,
                     fullname: dataCli.nombre + ' ' + dataCli.apellidos
                   }
                   this.dataCliente = tempCli
                 } else {
                   console.log("No data available");
                 }
               }).catch((error) => {
                 console.error(error);
               })
                
                 get(child(dbRef, `vehiculos/${dataRecep.vehiculo}`)).then((snpCotizacion) => {
                   if (snpCotizacion.exists()) {
                     this.dataVehiculo = snpCotizacion.val()
                   } else {
                     console.log("No data available");
                   }
                 }).catch((error) => {
                   console.error(error);
                 })
                 get(child(dbRef, `sucursales/${dataRecep.sucursal}`)).then((snpCotizacion) => {
                   if (snpCotizacion.exists()) {
                     this.dataSucursal = snpCotizacion.val()
                   } else {
                     console.log("No data available");
                   }
                 }).catch((error) => {
                   console.error(error);
                 })
            // }
          } else {
            console.log("No data available");
            this.muestraInformacion = false
          }
         })
      
    
  }
  async getinfocompl(ruta:string){
    let info =[]
    await get(child(dbRef, `${ruta}`)).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val())
        info = snapshot.val()
      } else {
        console.log(ruta);
        
        console.log("No data available");
        info =[]
      }
    }).catch((error) => {
      console.error(error);
    })
    return info
  }
  cambiarColor(color:boolean){
    let colorAsiganado : string
    this.color = color
    if (this.color) {
      colorAsiganado = 'rgb(0,0,0)'
      this.nombreColor = 'negro'
    }else{
      colorAsiganado = 'rgb(255, 0, 0)'
      this.nombreColor = 'rojo'
    }
    this.SignaturePad.penColor = colorAsiganado
  }
  limpiarFirma(){
    this.SignaturePad.clear()
  }
  revertir(){
    const datos = this.SignaturePad.toData()
    if (datos) {
      datos.pop()
      this.SignaturePad.fromData(datos)
    }
  }
  descargar(dataURL:any){
    if (navigator.userAgent.indexOf('safari')>-1 && navigator.userAgent.indexOf('Chrome')===-1) {
      window.open(dataURL)
    }else{
      const blob = this.UrltoBlob(dataURL)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      // console.log(this.dataRecepcion);
      
     this._uploadfirma.upload(blob,this.dataRecepcion,'entrega',this.idRecepcion)
      
      // a.href = url
      // a.download = nombre
      // this.firma = blob
      // document.body.appendChild(a)
      // a.click()
      // window.URL.revokeObjectURL(url)
    }
    
  }
  UrltoBlob(dataURL:any){    
    const partes = dataURL.split(';base64,')
    const contentType = partes[0].split(':')[1]
    const raw = window.atob(partes[1])
    const rawL = raw.length
    const array = new Uint8Array(rawL)
    for(let i=0; i<rawL;i++){
      array[i]= raw.charCodeAt(i)
    }
    return new Blob([array],{type: contentType})
  }
  guardarJPG(){
    if (this.SignaturePad.isEmpty()) {
      this.mensajeIncorrecto('Firmar el docuemento')
    }else{
      const u = this.SignaturePad.toDataURL('image/jpeg')
      this.descargar(u)
      this.firma = u
    }
  }
  downloadPDF() {
    var doc = new jsPDF('p','pt','letter')
    var margin = 10
    const DATA = document.getElementById('htmlData')
    const options = {
      background: 'white',
      scale: 5
    };
    var scale = (doc.internal.pageSize.getWidth() - 2 * 15) / document.body.scrollWidth

    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      // console.log(canvas.height);
      // console.log(canvas.width)
      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img)

      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      // const pdfWidth = doc.internal.pageSize.width - 2;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST')
      return doc

    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    });
  }   
  guardarDocumento(){
      if (this.SignaturePad.isEmpty()) {
        this.mensajeIncorrecto('Firmar el docuemento')
      }else{
        Swal.fire({
          title: 'Esta seguro?',
          html: '<strong>Esta accion no podra revertirse! </strong>',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Firmar y guardar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            
              this.getFechaHora()
              
              set(ref(db, `recepcionStatus/${this.dataRecepcion.cliente}/${this.dataRecepcion.vehiculo}/${this.idRecepcion}/hora_entregado`), this.hora )
              .then(() => {
                const tempEmail ={
                  from:'desarrollospeed03@gmail.com',
                  email: this.dataCliente.correo,
                  subject: 'Automovil entregado por SpeedPro',
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
                        Automovil entregado por <strong>SpeedPro</strong></h2>
                      </div>
                      <div style=" text-align: justify">
                          <p style="font-size: 2em; background-color: #962F91; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
                          Notificación de entrega de vehículo, El vehículo ha sido ENTREGADO.
                          </p>
                        <!-- <p>SpeedPro tiene una comunidad que se alegra de tenerte con nosotros!!</p> -->
                  
                        <p style="font-size: 1.5em; background-color: lavender; color:black;margin: 0;padding: 1em 1em;">
                          Estimado ${this.dataCliente.fullname} hubo un cambio en status del vehiculo  ${this.dataVehiculo.marca}, ${this.dataVehiculo.categoria} con placas ${this.dataVehiculo.placas}, modelo  ${this.dataVehiculo.modelo}, color  ${this.dataVehiculo.color}  entregado por SpeedPro el día ${this.fecha} ${this.hora}.
                        </p>
                        <p style="text-align:center">Para más información, sigue el enlace con el botón de abajo</p>
                      </div>
                  
                      <div style="text-align: center">
                          <a href="https://www.google.com/" target="_blank" style="text-decoration:none;background-color: #0d6efd; color:white; font-size:2em; border:2px; border-color:black; border-radius: 8px;margin: 0;padding: .5em 0.5em;" class="btn btn-primary">SpeedPro</a>
                      </div>
                    </div>
                  </div>`
                }
                // this._email.EmailCambioStatus(tempEmail).subscribe()
                set(ref(db, `recepcion/${this.idRecepcion}/firmaEntrega`), true )
                set(ref(db, `recepcionStatus/${this.dataRecepcion.cliente}/${this.dataRecepcion.vehiculo}/${this.idRecepcion}/status`), 'entregado' )
                set(ref(db, `recepcionStatus/${this.dataRecepcion.cliente}/${this.dataRecepcion.vehiculo}/${this.idRecepcion}/fecha_entregado`), this.fecha )
                .then(() => {
                  const u = this.SignaturePad.toDataURL()
                  this.descargar(u)
                  
                  set(ref(db, `administracion/${this.anio}/${this.mes}/${this.dia}/${this.idRecepcion}/venta`), this.totalCobrar )
                      .then(() => {
                        // Data saved successfully!
                        set(ref(db, `administracion/${this.anio}/${this.mes}/${this.dia}/${this.idRecepcion}/cobrado`), this.totalCobrar )
                        set(ref(db, `administracion/${this.anio}/${this.mes}/${this.dia}/${this.idRecepcion}/status`), 'pagado' )
                        set(ref(db, `administracion/${this.anio}/${this.mes}/${this.dia}/${this.idRecepcion}/pagado`), true )
                        this.mensajeCorrecto('Firma de entregado correcta')
                      })
                      .catch((error) => {
                        // The write failed...
                      });
                  
                })
                .catch((error) => {
                  // The write failed...
                });
                
              })
              .catch((error) => {
                // The write failed...
              })
          }
        })
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
  infoPaquete(data:any){
    let perteneciente =[]
    const strincluye = ref(db, `paquetesComplementos/${data.idReferencia}`)
    onValue(strincluye, (snapshot) => {
      let arreglo= this.crearArreglo2(snapshot.val())
      // console.log(arreglo)
      arreglo.forEach(element => {
        // console.log(element);
        
        if (element.tipo === 'refacciones') {
          const strrefacciones = ref(db, `refacciones/${element.IDreferencia}`)
          onValue(strrefacciones, (snpdataRefaccion) => {
            let minewarr= snpdataRefaccion.val()
            const dataRefaccion ={
              ...minewarr,
              precio: minewarr.precioCompra,
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
              tipo: 'Mano de obra'
            }
            perteneciente.push(tempInfo)
          })
        }
      });
    })
    const tempDataReturn ={
      descripcion: data.descripcion,
      tipo: data.tipo,
      nombre: data.nombre,
      datos: perteneciente
    }
    return tempDataReturn
  }
  getFechaHora() {
    let date: Date = new Date();
    this.fecha =  date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    this.hora =   date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    // this.fechaRegistro =  date.getDate() + '' + (date.getMonth() + 1) + '' + date.getFullYear()
    this.anio = String(date.getFullYear()) 
    this.mes = String((date.getMonth() + 1))
    this.dia = String(date.getDate()) 
  }
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
}


