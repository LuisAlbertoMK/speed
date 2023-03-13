import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, onValue, ref, set, push, get, child } from 'firebase/database';

import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import { UploadFirmaService } from 'src/app/services/upload-firma.service';
import { EmailsService } from '../../services/emails.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-firma-consentimiento',
  templateUrl: './firma-consentimiento.component.html',
  styleUrls: ['./firma-consentimiento.component.css']
})
export class FirmaConsentimientoComponent implements OnInit,AfterViewInit {
  @ViewChild('firmaDigital',{static:true}) signatureElement:any; SignaturePad:any; 
  idRecepcion:string= ''; idCliente:string=''; sucursalCliente:string = ''; idVehiculo:string = ''; listaSucursales=[]; 
  fullname:string = ''; fecha:string = ''; hora:string = ''; dataRecepcion:any=[]; dataCliente:any = []; metodoPagoSeleccionado:string = ''
  dataConse:any=[]
  constructor(private rutaActiva: ActivatedRoute, private _uploadfirma: UploadFirmaService, private router : Router, private _email: EmailsService) { }

  ngOnInit(): void {
    this.asignacionParametros()
    this.esperar()
    this.mensajeAwait()
  }
  ngAfterViewInit(): void {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  asignacionParametros(){
    this.idRecepcion = this.rutaActiva.snapshot.params['idRecepcion']
  }
  esperar(){
    const starCountRef = ref(db, `recepcion/${this.idRecepcion}`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            this.dataRecepcion = snapshot.val()
            if (this.dataRecepcion.rayarDetalles ) {
              // console.log('obtener info');
              get(child(dbRef, `clientes/${this.dataRecepcion.cliente}`)).then((snpCliente) => {
                if (snpCliente.exists()) {
                  let cliente =snpCliente.val()
                  const tempData={
                    ...cliente,
                    fullname: cliente.nombre + ' ' +cliente.apellidos
                  }
                  this.dataCliente = tempData                    
                } else {
                  this.redireccionar('/cotizacion','No hay datos registrados!!')
                }
              }).catch((error) => {
                console.error(error);
              });
             
            }else{
              this.redireccionar(`/detalles/${this.idRecepcion}`,'No hay registro de detalles!!')
              
            }
          } else {
           this.redireccionar('/cotizacion','No hay datos registrados!!')
          }
          
        })
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
  limpiarFirma(){
    this.SignaturePad.clear()
  }
  guardarDocumento(){
    if (this.SignaturePad.isEmpty()) {
      this.mensajeIncorrecto('Firmar documento')
    }else{
      Swal.fire({
        title: 'Esta seguro?',
        html: '<strong>Esta acción no podra revertirse! </strong>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Firmar y guardar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          
          set(ref(db, `recepcion/${this.idRecepcion}/firmaConsentimiento`), true )
          .then(() => {
            // Data saved successfully!
            this.getFechaHora()
            const temp ={
              fecha_entregado: 'pendiente',
              fecha_recibido: this.fecha,
              hora_entregado: 'pendiente',
              hora_recibido: this.hora,
              status: 'recibido'
            }
            set(ref(db, `recepcionStatus/${this.dataRecepcion.cliente}/${this.dataRecepcion.vehiculo}/${this.idRecepcion}`), temp )
            .then(() => {
              // Data saved successfully!
              let mensajeCotizacion = ''
            
            const tempEmail ={
              from:'desarrollospeed03@gmail.com',
              email: this.dataCliente.correo,
              subject: 'Firma de recepción SpeedPro',
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
                    Registro de recepción <strong>SpeedPro</strong></h2>
                  </div>
                  <div style=" text-align: justify">
                      <p style="font-size: 2em; background-color: #962F91; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
                      Notificación de recepción
                      </p>
                    <!-- <p>SpeedPro tiene una comunidad que se alegra de tenerte con nosotros!!</p> -->
              
                    <p style="font-size: 1.5em; background-color: lavender; color:black;margin: 0;padding: 1em 1em;">
                      Estimado ${this.dataCliente.nombre} ${this.dataCliente.apellidos} tu vehículo ha sido recibido en las instalaciones SpeedPro el día ${this.fecha} ${this.hora}, ${mensajeCotizacion}.
                    </p>
                    <p>Para más información consulta la información adicional siguiendo en enlace en el botón de abajo</p>
                  </div>
              
                  <div style="text-align: center">
                      <a href="https://speedpro-3a4e1.web.app" target="_blank" style="text-decoration:none;background-color: #0d6efd; color:white; font-size:2em; border:2px; border-color:black; border-radius: 8px;margin: 0;padding: .5em 0.5em;" class="btn btn-primary">SpeedPro</a>
                  </div>
                </div>
              </div>`
            }
            // this._email.EmailRecepcion(tempEmail).subscribe(
            //   (ansEmail:any)=>{
            //     //  console.log(ansEmail)
            //   },
            //   (err)=>{ },
            //   ()=>{ },
            // )
            const u = this.SignaturePad.toDataURL()
            this.descargar(u)
            this.mensajeCorrecto('Documento firmado')

              // setTimeout(() => {
              //   Swal.fire({
              //     title: '?',
              //     text: "Regresar!",
              //     icon: 'warning',
              //     showCancelButton: true,
              //     confirmButtonColor: '#3085d6',
              //     cancelButtonColor: '#d33',
              //     confirmButtonText: 'Regresar!',
              //     cancelButtonText: 'Permanecer'
              //   }).then((result) => {
              //     if (result.isConfirmed) {
              //       this.router.navigateByUrl('/cotizacion')
              //     }
              //   })
              // }, 1050)
            })
            .catch((error) => {
              this.mensajeIncorrecto(error)
            });
          })
          .catch((error) => {
            this.mensajeIncorrecto(error)
          })
        }
      })
    }
  }
  metodoPago(metodoPago:string){
    let incluye = $('#incluyeIVA').is(':checked')
    this.pregunta(incluye,metodoPago)
  }
  descargar(dataURL:any){
    if (navigator.userAgent.indexOf('safari')>-1 && navigator.userAgent.indexOf('Chrome')===-1) {
      window.open(dataURL)
    }else{
      const blob = this.UrltoBlob(dataURL)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      this._uploadfirma.upload(blob,this.dataRecepcion,'aprobacion',this.idRecepcion)
      // a.href = url
      // a.download,' = nombre
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
  getFechaHora() {
    let date: Date = new Date();
    this.fecha =
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    this.hora =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
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
  redireccionar(ruta:string, mensaje:string){
    let timerInterval
    Swal.fire({
      title: 'Alerta!',
      html: `${mensaje} <br> redirigiendo ...`,
      timer: 2500,
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
        this.router.navigateByUrl(ruta)
      }
    })
  }
  pregunta(iva:boolean,metodoPago:string){
    this.metodoPagoSeleccionado = metodoPago
    console.log( this.metodoPagoSeleccionado = metodoPago);
    
    let SetTitle = ''
    let SetMessage=''
    if (iva) {
      SetTitle =   'Registrar metodo de pago <strong>con</strong> IVA incluido?'
      SetMessage = 'se registro metodo de pago con IVA'
    }else{
      SetTitle =   'Registrar metodo de pago <strong>sin</strong> IVA incluido?'
      SetMessage = 'se registro metodo de pago sin IVA'
    }

    get(child(dbRef, `recepcion/${this.idRecepcion}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const tempData ={
          ...snapshot.val(),
          IVA: iva
        }
        this.dataConse = tempData
        console.log(tempData);
        
          if (tempData.metodoPago) {
          
            Swal.fire({
              title: 'Cambiar metodo de pago?' ,
              html: SetTitle,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Confirmar',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                tempData.metodoPago = metodoPago
                this.updatedata(`recepcion/${this.idRecepcion}`,SetMessage,tempData,false)
              }
            })
          }else{
            Swal.fire({
              title: 'Esta seguro?' ,
              html: SetTitle,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Confirmar',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                tempData.metodoPago = metodoPago
                this.updatedata(`recepcion/${this.idRecepcion}`,SetMessage,tempData,false)
              }
            })
            
          }
        
        
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })

    
  }
  updatedata(ruta:string, mensaje:string, data:any,nuevo:boolean){
    let newRuta = ''
    if (nuevo) {
      const newPostKey = push(child(ref(db), 'posts')).key
      newRuta = `${ruta}/${newPostKey}`
    }else{
      newRuta = ruta
    }
    return set(ref(db, `${newRuta}`), data )
    .then(() => {
      this.mensajeCorrecto(mensaje)
    })
    .catch((error) => {
      this.mensajeIncorrecto('algo salio mal'+ error)
    });
  }
  
}
