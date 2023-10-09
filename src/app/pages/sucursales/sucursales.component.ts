import { Component, HostListener, OnInit, Output, ViewChild,EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { SucursalesService } from 'src/app/services/sucursales.service';
import Swal from 'sweetalert2';

//aqui importaciones de tables y paginacion
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { FileItem } from 'src/app/models/FileItem.model';

// import { child, getDatabase, onValue, push, ref, set } from "firebase/database"
import { getDatabase, onValue, ref, set, push, get, child, limitToFirst } from 'firebase/database';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());



@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent implements OnInit {

  displayedColumns: string[] = ['sucursal', 'serie', 'direccion', 'telefono'];
  dataSource: MatTableDataSource<any>;

  //rol
  _rol:string
  sucursal_:string
  
  //dropzone
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter()
  estaSobreElemento:boolean = false
  archivos: FileItem[]=[]
  files: File[] = []
  archTemp:any
  nombre:string
  nombreSucursal:string=''
  imagenSucursal:string=''
  //altura fija de las imagenes
  minAltura:number = 150
  onSelect(event) {
    if(this.files.length>0){
      this.files=[]
      this.archivos=[]
    }
    this.files.push(...event.addedFiles);
    for(const f of this.files) {
      this.archTemp={
        archivo:f,
        nombreArchivo:f.name,
        estaSubiendo:false,
        progreso:0
      }
      this.nombre=f.name
    }
    this.archivos.push(this.archTemp)
    }
  
  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1)
    this.files=[]
    this.archivos=[]
  }
  @HostListener('dragover',['$event'])
  public onDragEnter(event:any){
    this.mouseSobre.emit(true)
  }
  //pagination
  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //array lista de sucursales

  // listaArrarySucursales:any[]=[]
  // sucursales_array = [ ...this._sucursales.lista_en_duro_sucursales]
  sucursales_array = [ ]
  //IDSucursal
  IDsucursal:string=''

  //declaracion de formulario
  formaSucursal: FormGroup
  formaUploadFile: FormGroup
  desactivaGuardar:boolean = false

  objecto_actual:any ={}
  constructor(private fb: FormBuilder,
    private _publicos:ServiciosPublicosService,
    private _sucursal: SucursalesService, private _uploadImagen: UploadFileService,
    private _security:EncriptadoService) {}

  ngOnInit(): void {
    this.rol()
    this.crearFormularioSucursal()
    this.brow()
    
   
  }
  ngAfterViewInit() {

  }
  
  async rol(){
   
    const { rol, sucursal } = this._security.usuarioRol()
    
    this._rol = rol
    this.sucursal_ = sucursal

    // this.vigila_hijo()
    this.primer_comprobacion_resultados()
  }

  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('sucursales')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }
  primer_comprobacion_resultados(){
    this.asiganacion_resultados()
    this.segundo_llamado()
  }
  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.nueva_revision_cache('sucursales')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asiganacion_resultados()
      }
    },1500)
  }

  asiganacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('sucursales')
    const data_recuperda_arr = this._publicos.crearArreglo2(objecto_recuperdado)

    const campos = [
      'direccion',
      'imagen',
      'status',
      'fullname',
      'sucursal',
      'nombre',
      'telefono','correo'
    ]
    this.objecto_actual = objecto_recuperdado

    this.sucursales_array = (!this.sucursales_array.length) 
    ? data_recuperda_arr
    :  this._publicos.actualizarArregloExistente(this.sucursales_array, data_recuperda_arr, campos )

  }
  getInformacionSucursal(id:string){
    //priemro obtener informacion de sucursal
    this.IDsucursal=id
    const info = this.sucursales_array.find(s=>s.id === id)
    this.imagenSucursal = info.imagen
    this.formaSucursal.reset(Object(info))
  }
  resetAntes(){
    this.IDsucursal = ''
    this.formaSucursal.reset()
  }
  verImagen(sucursal:any){
    Swal.fire({
      title: sucursal.sucursal,
      imageUrl: sucursal.imagen,
      imageWidth: 720,
      imageHeight: 360,
      showConfirmButton: false
      // imageAlt: 'Custom image',
    })
  }
  changeStatus(sucursal:any, status:boolean){
    let sttu ='',sttu2 =''
    if (status) { sttu='Activar',sttu2='Activada'}
    else{ sttu='Desactivar',sttu2='Desactivada' }
        this.updateInfo(false,`sucursales/${sucursal.id}/status`,status,`Sucursal ${sttu2}!`,true,'cambio de status sucursal')
  }
  validarSucursal(campo: string){
    return this.formaSucursal.get(campo).invalid && this.formaSucursal.get(campo).touched
  }
  validarImg(campo: string){
    return this.formaUploadFile.get(campo).invalid && this.formaUploadFile.get(campo).touched
  }
  crearFormularioSucursal(){
    this.formaSucursal = this.fb.group({
      sucursal:['',[Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
      serie:['',[Validators.required]],
      direccion:['',[Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      telefono:['',[Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern(/^-?(0|[0-9]{10,10}\d*)?$/)]],
      correo:['',[Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      imagen:['',[]],
    })
  }
  guardarSucursal(){
    if (this.formaSucursal.invalid) {
      return Object.values(this.formaSucursal.controls).forEach(control => {
        control.markAsTouched()
        this.mensajeIncorrecto('LLenar todos los campos necesarios')
      })
    }
    else{
      if (this.IDsucursal!=='') {
        const data = { ...this.formaSucursal.value, status: true }
        this.updateInfo(false,'sucursales',data,`Sucursal ${data.sucursal} actualizada!`,false,'actualización')
      }else{
        const data = { ...this.formaSucursal.value, status: true, imagen:'./assets/img/default-image.jpg' }
        this.updateInfo(true,'sucursales',data,`Sucursal ${data.sucursal} registrada!`,false,'registro de nueva sucursal')
      }
    }
  }
  updateInfo(nueva:boolean,ruta:string,data:any,mensaje:string,changeStatus:boolean, accion:string){
    this.desactivaGuardar=true

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: 'btn btn-danger m-1',
        confirmButton: 'btn btn-success m-1'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      title: 'Esta seguro?',
      text:  `Realizar ${accion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        if (nueva && !changeStatus) {
          const newPostKey = push(child(ref(db), 'posts')).key
          set(ref(db, `${ruta}/${newPostKey}`), data )
              .then(() => {
                this.formaSucursal.reset()
                this.mensajeCorrecto(mensaje)
                this.desactivaGuardar=false
              })
              .catch((error) => {
                // The write failed...
              });
        }
        if (!nueva && !changeStatus) {
          set(ref(db, `sucursales/${this.IDsucursal}`), data )
              .then(() => {
                // this.formaSucursal.reset()
                this.mensajeCorrecto(mensaje)
                this.desactivaGuardar=false
              })
              .catch((error) => {
                // The write failed...
              })
        }
        if (changeStatus) {      
          set(ref(db, `${ruta}`), data )
              .then(() => {
                this.formaSucursal.reset()
                this.mensajeCorrecto(mensaje)
                this.desactivaGuardar=false
              })
              .catch((error) => {
                // The write failed...
              });
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.desactivaGuardar = false
      }
    })
    
    
    
    

    
  }
  //validaciones 
  ///firmulario para cambio de imagen
  getInforSucursalNew(id:string,sucursal:string){
    this.IDsucursal=id
    this.nombreSucursal=sucursal
  }
  vaciarArchivos(){
    console.log('aqui');
    
  }
  uploadFile(){
    if (this.IDsucursal!=='') {
      Swal.fire({
        title: 'Esta seguro?',
        text: "Cambiar la imagen de sucursal",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'cancelar',
        allowOutsideClick:false
      }).then((result) => {
        if (result.isConfirmed) {
          this._sucursal.getSucursal(this.IDsucursal).subscribe((resp:any)=>{
            if (resp!==null) {
              if (this.files.length!==0) {
                this._uploadImagen.guardarImagen(this.IDsucursal,resp,this.archivos)
                let interval = setInterval(()=>{   
                  // console.log(this.archivos[0]);
                         
                  if (this.archivos.length!==0) {
                    if (!this.archivos[0].estaSubiendo && this.archivos[0].progreso === 100) {
                      this.files=[]
                      this.archivos=[]
                      this.mensajeCorrecto('Se cargo la imagen')
                      clearInterval(interval)
                    }
                  }
                },600)
              }
            }
          })
        }
      })
      
    }
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
      setTimeout(() => {
        this.mensajeCorrecto('Espere porfavor ...')
      }, 500);
     
    }
}
}

