import { Component, OnInit,OnDestroy, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ManoObra } from 'src/app/models/ManoObra.model';
import { Paquete } from 'src/app/models/paquete.model';
import { PaqueteContiene } from 'src/app/models/paqueteContiene.model';
import { Refacciones } from 'src/app/models/refacciones.model';
import { tipoJson } from 'src/app/models/tipoJson.model';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2'
import { AutomaticosService } from 'src/app/services/automaticos.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database"
import {animate, state, style, transition, trigger} from '@angular/animations';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CatalogosComponent implements  OnDestroy, OnInit  {
  
  columnsPaquetes: string[] = ['nombre','cilindros','marca','modelo','normal','flotilla']
  columnsPaquetesExpand = [...this.columnsPaquetes, 'expand'];
  // displayedColumnsSuperSUExtended: string[] = [...this.displayedColumnsSuperSU]
  columnsMO: string[] = ['nombre','precio','marca','modelo','descripcion']
  columnsMOExtended: string[] = [...this.columnsMO]
  columnsRefaccion: string[] = ['nombre','marca','modelo','stock','precio','descripcion']
  columnsRefaccionExtended: string[] = [...this.columnsRefaccion]

  displayedColumnsConjuntaRefaccion: string[] = ['nombre','marca','modelo','status','cantidad' ,'precio','subtotal','opciones']
  
  dataSourcePaquetes: MatTableDataSource<any>;dataSourceMO: MatTableDataSource<any>;dataSourceRefacciones: MatTableDataSource<any>;
  
  @ViewChild('paginatorPaquetes') paginatorPaquetes: MatPaginator; @ViewChild('paginatorMO') paginatorMO: MatPaginator;
  @ViewChild('paginatorRefacciones') paginatorRefacciones: MatPaginator;
  @ViewChild('tabPaquetes') sortPaquetes: MatSort; @ViewChild('tabMO') sortMO: MatSort; @ViewChild('tabRefacciones') sortRefacciones: MatSort;
  clickedRows = new Set<any>()
  formaPaquete: FormGroup; formaManoObra: FormGroup; formaRefaccion: FormGroup; formaPaqueteActualiza: FormGroup; 
  formaElementoP: FormGroup; formEditElement: FormGroup
  listarManosObras: ManoObra[]=[]
  manoActualizarData:ManoObra
  IDManoObraActualizar:string = ''
  listaRefacciones:Refacciones[]=[]
  IDRefaccionActualizar:string=''
  RefaccionActualizarData:Refacciones
  listaPaquetes:Paquete[]=[]
  marcas:any=[]
  modelos:any=[]
  IDPaquete:string=''
  paqueteData:any =[]
  subtotal:number=0
  TotalPaquete:number=0
  resultadoRefaccionID:any=[]
  CostoUnitario:number=0
  listaConjunta:any[]=[]
  temporalRefacciones:PaqueteContiene
  resultadosComplementosPaquete:tipoJson
  ResultadosConjuntos:any[]=[]
  nombre:string=' nombre de paquete'
  
  nombrePaquete:string=''
 
  //rol
  ROL:string = ''
  //manipulacion de vista
  vista:string = 'paquetes'
  //agregar a paquete
  listaArrayManoObra:any=[]
  listaArrayRefacciones:any=[]
  //ID de paquete poder agregar refaccion o mano de obra
  IDpaqueteAgrega:string =''
  //resultados mostrar conjuntos de refacciones
  ResultadosConjuntosRefacciones:any=[]
  //obtener total de paquete
  totalActual:number =0
  //costo de mano de obra
  mostrarCosto:number = 0
  //carga de datos
  cargando:boolean = true

  //ancho de columnas de tablas
  miniColumnas:number = 100
  //data mano de obra a ctualizar
  dataMOUpdate:any=[]
  dataRefaccion:any=[]
  //posiciones de ejes
  ejeX:number=0
  ejeY:number=0
  //posicion de menu
  posicion:any='before'
  //data de paquete 
  datPaquete:any=[]
  misComplementos:any=[]
  idDataPaquete:string = ''; anios:any=[]; arrayModelos:any=[]; listapaquetes:any[]=[]; infoPaquete:any =[]; elementosPaqueteBuild: any[]=[]

  tipo: string = 'refaccion';tipos: string[] = ['refaccion','MO']; Refacciones:any[]=[]; MOs:any[]=[]; subtotalPaquete:number = 0;
  totalPaquete:number =0; factibilidadPaquete:number =0; guardaCatalogo:boolean=true; arrayModelosPaquete:any=[]; enCatalogo:boolean=false
  
  arrayAlls:any[]=[]; myControlAll = new FormControl(''); filteredOptions: Observable<any[]>; 
  expandedElement: any | null;
  constructor(private fb: FormBuilder, private _catalogos: CatalogosService,
  private _vehiculos: VehiculosService, private _automaticos: AutomaticosService) {     }

  async ngOnInit() {
    this.rol()
    this.GetDataMarcaModelo()
    this.crearFormularioRefaccion()
    this.crearformEditElement()
    this.crearFormularioManoObra()
    this.crearFormularioPaquete()
    this.formaElemento()
    this.listarPaquetes()
    this.listarMO()
    this.listarRefacciones()
    this.consultaMarcas()
    this.listarArrayRefacciones()
    this.autocompleteAlls()
  }
  ngOnDestroy(): void {
   
  }
  autocompleteAlls(){
    this.filteredOptions = this.myControlAll.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value
    const valor:String = String(filterValue).toLowerCase()
    let nuevo = []
    let data =[]

    for (let index = 0; index < this.MOs.length; index++) {
      const element = this.MOs[index];
      element.tipo = 'MO'
      nuevo.push(element)
    }
    for (let index = 0; index < this.Refacciones.length; index++) {
      const element = this.Refacciones[index];
      element.tipo = 'refaccion'
      nuevo.push(element)
    }
    this.arrayAlls = this.ordernarPorCampo(nuevo,'nombre')
    
    data = this.arrayAlls.filter(option => option.nombre.toLowerCase().includes(valor))
    // console.log(data);
    
    return data
  }
  displayFn(val: any): string {
    return val && (val.nombre.toLowerCase() ) ? (val.nombre.toLowerCase() ) : ''
  }
  dataOption(data:any){
    if (data === (null || '')) {
      return
    }
    this.guardaCatalogo = false
    this.tipo = data.tipo
    let total = 0; let subtotal =0;
    this.formaElementoP.reset({
      IDreferencia: data.id,
      nombre: data.nombre,
      cantidad: 1,
      precio: data.precio,
      subtotal: subtotal,
      total: total,
      marca: data.marca,
      modelo: data.modelo,
      descripcion: data.descripcion
    })
    this.enCatalogo = true
    this.obtenerSubtotal()
  }
  rol(){
    this.ROL =localStorage.getItem('tipoUsuario')
    }
  consultaMarcas(){
    const starCountRef = ref(db, `marcas_autos`)
    onValue(starCountRef, (snapshot) => {
      this.marcas= this.crearArreglo2(snapshot.val())
      
    })
  }
  submarcas(formulario:string){
    let marca = ''
    if (formulario === 'MO') {
      marca =this.formaManoObra.controls['marca'].value
    }
      if (formulario === 'refaccion') {
      marca =this.formaRefaccion.controls['marca'].value
    }
    if (formulario === 'paquete') {
      marca =this.formaElementoP.controls['marca'].value
    }
    // this.listaArrayAnios=[]
    if (marca!=='' && marca!==null) { 
      const modelos = this.marcas.find(option=>option.id === marca)
      this.arrayModelos = modelos      
    }else{
      this.arrayModelos=[]
      // this.listaArrayAnios=[]
    }
  }
  async listarPaquetes(){
      const starCountRef = ref(db, 'paquetes')
        onValue(starCountRef, async (snapshot)  => {
          this.listapaquetes = []
          const paquetes = this.crearArreglo2(snapshot.val())
          this.listapaquetes = paquetes
          this.paquets()
          
        })
  }
  async paquets(){
    for (let index = 0; index < this.listapaquetes.length; index++) {
      const element = this.listapaquetes[index];
      let subtotalPaquete =0; let totalPaquete=0;
      if (element.elementos) {
        const elementos:any[] = element.elementos
        for (let ind = 0; ind < elementos.length; ind++) {
          const item = elementos[ind];
          let ruta = ''
          
          
          if (elementos[ind].tipo === 'MO') {
            ruta = `manos_obra/${item.IDreferencia}`
          }else{
            ruta = `refacciones/${item.IDreferencia}`
          }                
          await this.getInfoComplemento(ruta).then((ans:any)=>{
            if (ans!=='') {
              // console.log(ans);
              // console.log(item.precio);
              elementos[ind].marca = ans.marca
              elementos[ind].modelo = ans.modelo
              if (item.precio) {
                elementos[ind].precio = item.precio
              }else{
                elementos[ind].precio = ans.precio
              }
              // console.log(elementos[ind].precio);
              

              elementos[ind].descripcion = ans.descripcion
              elementos[ind].nombre = ans.nombre
              let subtotal =0; let total =0;
              const multiplica = item.cantidad * elementos[ind].precio
              if (item.tipo === 'MO') {
                subtotal = multiplica
                total = subtotal * 1.30
              }else{
                subtotal  = multiplica * 1.25
                total = subtotal * 1.30
              }
              elementos[ind].subtotal = subtotal
              elementos[ind].total = total
              subtotalPaquete = subtotalPaquete + item.subtotal
              totalPaquete = totalPaquete + item.total
            }
          })
        }
        this.listapaquetes[index].flotilla = subtotalPaquete
        this.listapaquetes[index].normal = totalPaquete
      }else{
       this.listapaquetes[index].elementos = []
       this.listapaquetes[index].flotilla = 0
       this.listapaquetes[index].normal = 0
      }
    }
    this.dataSourcePaquetes = new MatTableDataSource(this.listapaquetes)
    this.newPagination('paquetes')
  }
  async getInfoComplemento(ruta:string){
    let info =[]
    await get(child(dbRef, `${ruta}`)).then((snapshot) => {
      if (snapshot.exists()) {
        info = snapshot.val()
      } else {
        info = []
      }
    }).catch((error) => {
      console.error(error);
    });
    return info
  }
  listarMO(){
    const starCountRef = ref(db, 'manos_obra')
    onValue(starCountRef, (snapshot) => {
      const newMO = this.crearArreglo2(snapshot.val())
      this.MOs = newMO
      this.dataSourceMO = new MatTableDataSource(newMO)        
      this.newPagination('MO')
    })
  }
  listarRefacciones(){
    const starCountRef = ref(db, 'refacciones')
    onValue(starCountRef, (snapshot) => {
      const dataRefacciones =this.crearArreglo2(snapshot.val())
      this.Refacciones = dataRefacciones
      this.dataSourceRefacciones = new MatTableDataSource(dataRefacciones)        
      this.newPagination('refacciones')
    })
  }
  actualizaStatus(IDpaquete:string, status:boolean){
    set(ref(db, `paquetes/${IDpaquete}/status`), status )
          .then(() => {
            // Data saved successfully!
          })
          .catch((error) => {
            // The write failed...
          });
  }
  listaMarcas(){
    this._vehiculos.consultaMarcas().subscribe(
      (resp:any)=>{

        // this.marcas=resp
        this.marcas = resp.sort()
        // console.log(this.marcas)
      },(err) => {
        if (err.error instanceof Error) {
          console.log("Client-side error")
        } else {
          console.log("Server-side error")
        }
      },()=>{
      })
  }
  obtenerAnios(){
    const modelo = this.formaPaqueteActualiza.controls['marca'].value
    this.marcas.forEach(marca => {
        if (marca.modelo === modelo) {
          this.anios = marca.anios
        }
      })    
  }
  registroModelos(){
    //this._automaticos.registroModelos()
  }
  listarArrayRefacciones(){
    const starCountRef = ref(db, `refacciones`)
        onValue(starCountRef, (snapshot) => {
	        this.listaArrayRefacciones= this.crearArreglo2(snapshot.val())
        })
  }
  listaArrayManoObraAgregar(){
    this._catalogos.listaManoObra().subscribe(
      (resp:any)=>{
        this.listaArrayManoObra = resp        
        //console.log(this.listaArrayManoObra);
      }
    )
  }
  GetDataMarcaModelo(){
    const starCountRef = ref(db, `marcas_autos`)
    onValue(starCountRef, (snapshot) => {
	    this.marcas= this.crearArreglo2(snapshot.val())
    })
  }
  modelos_autos(){
    this.arrayModelos =[]
    const marca = this.formaPaquete.controls['marca'].value
    if (marca!== (null || '')) {
      const modelos = this.marcas.find(option=>option.id === marca)
      this.arrayModelosPaquete = modelos  
    }
  }

  validarPaquete(campo: string){
    return this.formaPaquete.get(campo).invalid && this.formaPaquete.get(campo).touched
  }
  validarelemento(campo: string){
    return this.formEditElement.get(campo).invalid && this.formEditElement.get(campo).touched
  }
  validarManoObra(campo: string){
    return this.formaManoObra.get(campo).invalid && this.formaManoObra.get(campo).touched
  }
  validarRefaccion(campo: string){
    return this.formaRefaccion.get(campo).invalid && this.formaRefaccion.get(campo).touched
  }
  validarFormularioPaqueteAgregar(campo: string){
    return this.formaElementoP.get(campo).invalid && this.formaElementoP.get(campo).touched
  }

  crearFormularioPaquete(){
    this.formaPaquete = this.fb.group({
      id: ['',[]],
      nombre:['',[Validators.required]],
      cilindros:['',[Validators.required]],
      marca:['',[Validators.required]],
      modelo:['',[Validators.required]],
    })
  }

  crearFormularioManoObra(){
    this.formaManoObra = this.fb.group({
      id:['',[]],
      nombre:['',[Validators.required]],
      descripcion:['',[Validators.required]],
      marca:['',[Validators.required]],
      modelo:['',[Validators.required]],
      precio:['',[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    })
  }
  crearFormularioRefaccion(){
    this.formaRefaccion = this.fb.group({
      id:['',[]],
      nombre:['',[Validators.required, Validators.minLength(3)]],
      marca:['',[Validators.required]],
      modelo:['',[Validators.required]],
      descripcion:['',[Validators.required, , Validators.minLength(3)]],
      stock:['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      precio:['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    })
  }
  crearformEditElement(){
    this.formEditElement = this.fb.group({
      padre:['',[Validators.required]],
      hijo:['',[Validators.required]],
      index:['',[]],
      nombre:['',Validators.required],
      tipo:['',Validators.required],
      cantidad:['',[Validators.required]],
      precio:['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      marca:['',[Validators.required]],
      modelo:['',[Validators.required]],
      descripcion:['',[Validators.required, Validators.minLength(3)]],
      subtotal:['',[Validators.required]],
      total:['',[Validators.required ]],
    })
  }

  
  guardarPaquete(){
    if (this.formaPaquete.invalid) {
      return Object.values(this.formaPaquete.controls).forEach(control => {
        control.markAsTouched()
        Swal.fire('Error','LLenar todos los campos necesarios','error')
      })
    }else{
      this._catalogos.guardarPaquete(this.formaPaquete.value).subscribe()
      this.mensajeSweetAlert('Exito!','Registro de paquete correcto.','success')
      this.listaPaquetes=[]
      // setTimeout(() => {
      //   this.listarPaquetes()
      // }, 1000)
      this.limpiarFormularioPaquete()
    }
  }
  actualizaPaqauete(){
    const elementos = this.elementosPaqueteBuild
    const tempData = {...this.formaPaquete.value,status:true,elementos ,precio:0}
    if (this.formaPaquete.invalid) {
      return Object.values(this.formaPaquete.controls).forEach(control => {
        control.markAsTouched()
        this.mensajeSweetAlert('Error!','vacios','error')
      })
    }else{
      const id = String(this.formaPaquete.controls['id'].value)
      if (id.length>4) {
        this.actualizaInfo(`paquetes/${id}`,tempData,false)
      }else{
        tempData.elementos =[]
        this.actualizaInfo(`paquetes`,tempData,true)
      }
    }
  }
  actualizaInfo(ruta:string,data:any,nuevo:boolean){
    let nuevaRuta =''
    if (nuevo) {
      const newPostKey = push(child(ref(db), 'posts')).key
      nuevaRuta= `${ruta}/${newPostKey}`
      this.formaPaquete.controls['id'].setValue(newPostKey)
    }else{
      nuevaRuta= `${ruta}`
    } 
    set(ref(db, `${nuevaRuta}`), data )
      .then(() => {
        this.mensajeCorrecto('Actualizalcioón correcta')
      })
    .catch((error) => {
      
    })
  }
  guardarManoObra(){
    if (this.formaManoObra.invalid) {
      return Object.values(this.formaManoObra.controls).forEach(control => {
        control.markAsTouched()
        this.mensajeSweetAlert('Error!','vacios','error')
      })
    }else{
      this._catalogos.guardaManoObra(this.formaManoObra.value).subscribe()
      this.mensajeSweetAlert('Exito!','Registro de mano de obra correcto.','success')
      this.listarManosObras=[]
      this.limpiarGuardarManoObra()
    }
  }
  crearFormularioManoObraActualiza(){
    this.formaManoObra = this.fb.group({
      nombre:['',[Validators.required]],
      descripcion:['',[Validators.required]],
      precio:['',[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    })
  }
  DataActualizaManoObra(dataMO:any){
    console.log(dataMO);
    
    if (dataMO==='') {
      return
    }
    this.formaManoObra.reset({
      id:dataMO.id,
      marca:dataMO.marca,
      modelo:dataMO.modelo,
      nombre:dataMO.nombre,
      precio:dataMO.precio,
      descripcion:dataMO.descripcion
    })
  }
  EliminaManoObra(dataManoObra:any){
    Swal.fire({
      title: 'Esta seguro?',
      text: "Esta accion no podra ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._catalogos.eliminaManoObra(dataManoObra).subscribe(
          (resp:any)=>{ },
          (err)=>{ console.log(err)},
          ()=>{ 
            Swal.fire('Exito!','Mano de obra eliminada.','success')}
        )
      }
    })
  }
  activaManoObra(dataManoObra:any){    
    Swal.fire({
      title: 'Esta seguro?',
      text: "Se mostrara mano de obra en el sistema!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Activar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._catalogos.ActivaManoObra(dataManoObra).subscribe(
          (resp:any)=>{ },
          (err)=>{ console.log(err)},
          ()=>{ 
            Swal.fire('Exito!','Mano de obra activada.','success')}
        )
      }
    })
  }
  ActualizaManoObra(){
    if (this.formaManoObra.invalid) {
      return Object.values(this.formaManoObra.controls).forEach(control => {
        control.markAsTouched()
        this.mensajeIncorrecto('LLenar todos los campos')
      })
    }else{
      const id = this.formaManoObra.controls['id'].value
      const tempData = {...this.formaManoObra.value, status:true}
      let ID = ''
      if (id === '' || id ===null) {
        const newPostKey = push(child(ref(db), 'posts')).key
        ID = newPostKey
      }else{
        ID = id
      }
      set(ref(db, `manos_obra/${ID}`), tempData )
          .then(() => {
            this.mensajeCorrecto('accion correcta')
            this.formaManoObra.reset()
          })
          .catch((error) => {
            // The write failed...
          })
    }
  }
  crearFormularioRefaccionActualizar(){
    this.formaRefaccion = this.fb.group({
      nombre:['',[Validators.required, Validators.minLength(3)]],
      marca:['',[Validators.required,  Validators.minLength(3)]],
      modelo:['',[Validators.required, Validators.minLength(3)]],
      descripcion:['',[Validators.required, Validators.minLength(3)]],
      stock:['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      precio:['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    })
  }
  guardarRefaccion(){
    if (this.formaRefaccion.invalid) {
      return Object.values(this.formaRefaccion.controls).forEach(control => {
        control.markAsTouched()
        Swal.fire('Error','LLenar todos los campos necesarios','error')
      })
    }else{
      this._catalogos.guardarRefaccion(this.formaRefaccion.value).subscribe()
      this.mensajeSweetAlert('Exito!','Registro de Refacción correcto.','success')
      this.listaRefacciones=[]
      // setTimeout(() => {
      //   // this.listarRefacciones()
      // }, 1000)
      this.limpiarRefacciones()
    }
  }
  DataActualizarRefaccion(){
    if (this.formaRefaccion.invalid) {
      return Object.values(this.formaRefaccion.controls).forEach(control => {
        control.markAsTouched()
        this.mensajeSweetAlert('Error!','vacios','error')
      })
    }else{      
      const tempInfoRefaccion = {...this.formaRefaccion.value,status:true}
      console.log(tempInfoRefaccion);
      const id = this.formaRefaccion.controls['id'].value
      if (id === '' || id ===null) {
        const newPostKey = push(child(ref(db), 'posts')).key
        tempInfoRefaccion.id = newPostKey
        set(ref(db, `refacciones/${newPostKey}`), tempInfoRefaccion )
          .then(() => {
            this.mensajeCorrecto('Accion correcta')
          })
          .catch((error) => {
            // The write failed...
          });
      }else{
        set(ref(db, `refacciones/${id}`), tempInfoRefaccion )
          .then(() => {
            this.mensajeCorrecto('Accion correcta')
          })
          .catch((error) => {
            // The write failed...
          });
      }
      this.formaRefaccion.reset()
    }
  }
  DataActualizaRefaccion(dataRefaccion:any){
    
    if (dataRefaccion==='') {
      this.dataRefaccion = []
    }else{
      this.formaRefaccion.reset({
        id:dataRefaccion.id,
        nombre:dataRefaccion.nombre,
        marca:dataRefaccion.marca,
        modelo:dataRefaccion.modelo,
        stock:dataRefaccion.stock,
        precio:dataRefaccion.precio,
        descripcion:dataRefaccion.descripcion,
      })
    }
  }
  DataAgregaPaquete(dataPaquete:any){    
    this.IDpaqueteAgrega = dataPaquete.id
    this.nombrePaquete=dataPaquete.nombre
    this._catalogos.getPaqueteID(dataPaquete.id).subscribe(
      (resp:any)=>{
        if (resp!==null) {
          this.paqueteData=resp
          this.IDPaquete=dataPaquete.id
          this.cargaDataActualizarID()
          
        }
      }
    )
    
    //this.listarManosObra()
  }
  cargaDataActualizarID(){
    this.formaPaqueteActualiza.reset({
      nombre:this.paqueteData.nombre,
      cilindros:this.paqueteData.cilindros,
      marca:this.paqueteData.marca,
      modelo:this.paqueteData.modelo,
    })
  }
  cargarDatRefaccion(){
    this.formaRefaccion.reset({
      nombre:this.RefaccionActualizarData.nombre,
      marca:this.RefaccionActualizarData.marca,
      modelo:this.RefaccionActualizarData.modelo,
      stock:this.RefaccionActualizarData.stock,
      precio:this.RefaccionActualizarData.precio,
      descripcion:this.RefaccionActualizarData.descripcion
    })
  }
  limpiarGuardarManoObra(){
    this.IDManoObraActualizar=''
    this.formaManoObra.reset()
  }
  changeStatus(dir:string,row:any, status:boolean){
    let statusMuestra:string = ''
    if (status) {
      statusMuestra='Habilitar'
    }else{
      statusMuestra='Deshabilitar'
    }
    Swal.fire({
      title: 'Esta seguro?',
      text: `${statusMuestra} ${row.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${statusMuestra}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        set(ref(db, `${dir}/${row.id}/status`), status )
          .then(() => {
            Swal.fire('Exito!',`${statusMuestra} correcto.`,'success')
          })
          .catch((error) => {
            // The write failed...
          });

      }
    })
  }
  verificaInformacionPaquete(dataPaquete:any, index:number){
    this.formaElementoP.reset()
    this.myControlAll.setValue('')
    if (dataPaquete !== (null || '')) {
      get(child(dbRef, `paquetes/${dataPaquete.id}`)).then(async (snapshot) => {
        if (snapshot.exists()) {
          const infoPaquete = snapshot.val()
          this.formaPaquete.reset({
            id:dataPaquete.id,
            nombre:infoPaquete.nombre,
            cilindros:infoPaquete.cilindros,
            marca:infoPaquete.marca,
            modelo:infoPaquete.modelo,
            descripcion:infoPaquete.descripcion,
          })
          const newPostKey = push(child(ref(db), 'posts')).key
          this.formaElementoP.controls['IDreferencia'].setValue(newPostKey)
          // this.formaElementoP.controls['index'].setValue(index)
          if (infoPaquete.elementos) {
            // sadfghghkj
            this.elementosPaqueteBuild = infoPaquete.elementos
            for (let index = 0; index < this.elementosPaqueteBuild.length; index++) {
              const ele = this.elementosPaqueteBuild[index];
              if (ele.catalogo) {
                const basica = {
                  IDreferencia: ele.IDreferencia,
                  cantidad: ele.cantidad,
                  catalogo: ele.catalogo,
                  precio: ele.precio,
                  tipo: ele.tipo,
                };
                let ruta='';
                (ele.tipo === 'MO')?(ruta=`manos_obra/${ele.IDreferencia}`):(ruta=`refacciones/${ele.IDreferencia}`);
                await this.getInfoComplemento(ruta).then((ans:any)=>{
                  if (ans!=='') {
                    this.elementosPaqueteBuild[index].precioOriginal = ans.precio
                    this.elementosPaqueteBuild[index].nombre = ans.nombre
                    this.elementosPaqueteBuild[index].marca = ans.marca
                    this.elementosPaqueteBuild[index].modelo = ans.modelo
                    this.elementosPaqueteBuild[index].descripcion = ans.descripcion
                    const operacion = ele.precio * ele.cantidad
                    let costoNuevo = 0;
                    (ele.tipo === 'MO')?(costoNuevo= operacion):(costoNuevo= operacion * 1.25);
                    this.elementosPaqueteBuild[index].flotilla = costoNuevo
                    this.elementosPaqueteBuild[index].normal = costoNuevo * 1.30

                  }
                })
              }else{
                const full = {
                  IDreferencia: ele.IDreferencia,
                  cantidad: ele.cantidad,
                  catalogo: ele.catalogo,
                  precio: ele.precio,
                  nombre: ele.nombre,
                  descripcion: ele.descripcion,
                  marca: ele.marca,
                  modelo: ele.modelo,
                  tipo: ele.tipo,
                }
                // this.elementosPaqueteBuild[index].nombre = ele.nombre
                this.elementosPaqueteBuild[index].marca = ele.marca
                    this.elementosPaqueteBuild[index].modelo = ele.modelo
                    this.elementosPaqueteBuild[index].descripcion = ele.descripcion
                  const operacion = ele.precio * ele.cantidad
                  let costoNuevo = 0;
                  (ele.tipo === 'MO')?(costoNuevo= operacion):(costoNuevo= operacion * 1.25);
                  this.elementosPaqueteBuild[index].precioOriginal = costoNuevo
                  this.elementosPaqueteBuild[index].flotilla = costoNuevo
                  this.elementosPaqueteBuild[index].normal = costoNuevo * 1.30

              }
            }
            this.actualizaDataPaquete()
          }else{
            this.elementosPaqueteBuild = []
            set(ref(db, `paquetes/${dataPaquete.id}/subtotal`), 0 )
            set(ref(db, `paquetes/${dataPaquete.id}/total`), 0 )
            set(ref(db, `paquetes/${dataPaquete.id}/factibilidad`), 0 )
          }
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
      
      
    }else{
      this.formaPaquete.reset({
        cilindros:'', marca:'',modelo:''
      })
      this.formaElementoP.controls['index'].setValue('')
      this.elementosPaqueteBuild =[]
    }
  }
  getCompleta(dataPaquete:string){   
    // console.log(dataPaquete);
    this.TotalPaquete = 0
    this.idDataPaquete = dataPaquete
        get(child(dbRef, `paquetesComplementos/${dataPaquete}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let arreglo= this.crearArreglo2(snapshot.val())
          this.misComplementos = []
          
          if (arreglo.length===0) {
            this.actualizaTotal(dataPaquete,0)
          }
          
          
          arreglo.forEach(comple => {

            const infoTable = {...comple }
            if (comple.tipo === 'refacciones') {
              get(child(dbRef, `refacciones/${comple.id}`)).then((snpRefaccion) => {
                if (snpRefaccion.exists()) {
                 const complemento = {
                  ...snpRefaccion.val()
                 }
                //  console.log(complemento);
                 
                  infoTable.descripcion = complemento.descripcion
                  infoTable.marca = complemento.marca
                  infoTable.modelo = complemento.modelo
                  infoTable.costoU = complemento.precio 
                  infoTable.costo = complemento.precio  * infoTable.cantidad
                  
                  infoTable.status = complemento.status
                  infoTable.nombre = complemento.nombre
                  // console.log(complemento);
                  // console.log(this.TotalPaquete);
                  this.TotalPaquete = this.TotalPaquete + infoTable.costo
                  // console.log(this.TotalPaquete);
                  
                } else {
                  console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              })
              
            }else{
              get(child(dbRef, `manos_obra/${comple.id}`)).then((snpMO) => {
                if (snpMO.exists()) {
                  const complemento = snpMO.val()
                  // console.log(complemento);
                  infoTable.descripcion = complemento.descripcion
                  infoTable.marca = 'S/Marca'
                  infoTable.modelo = 'S/Modelo'
                  infoTable.cantidad = 1
                  infoTable.costoU = complemento.precio 
                  infoTable.costo = complemento.precio *  1
                 
                  infoTable.status = complemento.status
                  infoTable.nombre = complemento.nombre
                  // console.log(complemento);
                  // console.log(this.TotalPaquete);
                  this.TotalPaquete = this.TotalPaquete + infoTable.costo
                  // console.log(this.TotalPaquete);
                  
                } else {
                  console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              })
              
            }
            
            this.misComplementos.push(infoTable)
            // console.log(this.TotalPaquete);
            
            
          })
          
          // console.log(this.misComplementos);
          
          } else {
            this.misComplementos =[]
            this.TotalPaquete = 0
            this.actualizaTotal(this.datPaquete.id,0)
            
          }
        }).catch((error) => {
          console.error(error);
        })
        this.listaArrayManoObraAgregar()
        
        setTimeout(() => {
          this.actualizaTotal(dataPaquete,this.TotalPaquete)
        }, 500);
  }
  actualizaTotal(paquete:string, Total:number){
    set(ref(db, `paquetes/${paquete}/precio`), Total )
                  .then(() => {
                    // Data saved successfully!
                    if (Total<=0) {
                      this.actualizaStatus(paquete,false)
                    }else{
                      this.actualizaStatus(paquete,true)
                    }
                  })
                  .catch((error) => {
                    // The write failed...
                  });
  }
  formaElemento(){
    this.formaElementoP = this.fb.group({
      IDreferencia:['',[]],
      nombre:['',[Validators.required]],
      cantidad:['',[Validators.required,  Validators.minLength(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      precio:['',[Validators.required,  Validators.minLength(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      subtotal:['0',[]],
      total:['0',[]],
      index:['',[]],
      marca:['',[Validators.required]],
      modelo:['',[Validators.required]],
      descripcion:['',[Validators.required]],
    })
  }
  guardaEncatalogo(data:any){
    console.log(data);
    let ruta='';
    (data.tipo === 'MO')?(ruta=`manos_obra/${data.IDreferencia}`):(ruta=`refacciones/${data.IDreferencia}`);
    const temp={
      descripcion: data.descripcion,
      nombre: data.nombre,
      precio: data.precio,
      marca: data.marca,
      modelo: data.modelo,
      status: true,
    }
    set(ref(db, `${ruta}`), temp )
          .then(() => {
            // Data saved successfully!
          })
          .catch((error) => {
            // The write failed...
          });
  }
  async AgregarActualizarDataPaquete(){
    const paquete = this.formaPaquete.controls['id'].value
    const dataTemp = {...this.formaElementoP.value,tipo:this.tipo};
    // console.log(paquete);
    
    (this.guardaCatalogo)? (dataTemp.catalogo = true) : (dataTemp.catalogo=this.enCatalogo)
    if (this.guardaCatalogo && dataTemp.catalogo) {
      const newPostKey = push(child(ref(db), 'posts')).key
      dataTemp.IDreferencia = newPostKey
      dataTemp.catalogo = true
      dataTemp.index = ''
      this.guardaEncatalogo(dataTemp)
    }
    if (this.guardaCatalogo && !dataTemp.catalogo) {
      const newPostKey = push(child(ref(db), 'posts')).key
      dataTemp.IDreferencia = newPostKey
      dataTemp.catalogo = true
      dataTemp.index = ''
      this.guardaEncatalogo(dataTemp)
    }
    if ((dataTemp.index === null || dataTemp.index === '') && dataTemp.catalogo) {
      const data = {
        cantidad:dataTemp.cantidad,
        precio:dataTemp.precio,
        catalogo:dataTemp.catalogo,
        IDreferencia:dataTemp.IDreferencia,
        tipo: this.tipo
      }
      this.elementosPaqueteBuild.push(data)
    }
    if ((dataTemp.index === null || dataTemp.index === '') && !dataTemp.catalogo) {
      const data = {
        cantidad:dataTemp.cantidad,
        precio:dataTemp.precio,
        catalogo:dataTemp.catalogo,
        IDreferencia:dataTemp.IDreferencia,
        nombre:dataTemp.nombre,
        marca:dataTemp.marca,
        modelo:dataTemp.modelo,
        descripcion:dataTemp.descripcion,
        tipo: this.tipo
      }
      this.elementosPaqueteBuild.push(data)
    }
    if ((dataTemp.index !== null || dataTemp.index !== '') ) {
      dataTemp.precioOriginal = dataTemp.precio
      this.elementosPaqueteBuild[dataTemp.index] = dataTemp
    }  
    this.formaElementoP.reset()
    this.myControlAll.setValue('')
    // console.log(this.elementosPaqueteBuild);
    let nuevoFiltro = []
    for (let index = 0; index < this.elementosPaqueteBuild.length; index++) {
      const ele = this.elementosPaqueteBuild[index];
      if (ele.catalogo) {
        const basica = {
          IDreferencia: ele.IDreferencia,
          cantidad: ele.cantidad,
          catalogo: ele.catalogo,
          precio: ele.precio,
          tipo: ele.tipo,
        };
        let ruta='';
        (ele.tipo === 'MO')?(ruta=`manos_obra/${ele.IDreferencia}`):(ruta=`refacciones/${ele.IDreferencia}`);
        await this.getInfoComplemento(ruta).then((ans:any)=>{
          if (ans!=='') {
            this.elementosPaqueteBuild[index].precioOriginal = ans.precio
            this.elementosPaqueteBuild[index].nombre = ans.nombre
            this.elementosPaqueteBuild[index].marca = ans.marca
            this.elementosPaqueteBuild[index].modelo = ans.modelo
            this.elementosPaqueteBuild[index].descripcion = ans.descripcion
            const operacion = ele.precio * ele.cantidad
            let costoNuevo = 0;
            (ele.tipo === 'MO')?(costoNuevo= operacion):(costoNuevo= operacion * 1.25);
            this.elementosPaqueteBuild[index].flotilla = costoNuevo
            this.elementosPaqueteBuild[index].normal = costoNuevo * 1.30
          }
        })
        nuevoFiltro.push(basica)
      }else{
        const full = {
          IDreferencia: ele.IDreferencia,
          cantidad: ele.cantidad,
          catalogo: ele.catalogo,
          precio: ele.precio,
          nombre: ele.nombre,
          descripcion: ele.descripcion,
          marca: ele.marca,
          modelo: ele.modelo,
          tipo: ele.tipo,
        }
        // this.elementosPaqueteBuild[index].nombre = ele.nombre
          const operacion = ele.precio * ele.cantidad
          let costoNuevo = 0;
          (ele.tipo === 'MO')?(costoNuevo= operacion):(costoNuevo= operacion * 1.25);
          this.elementosPaqueteBuild[index].flotilla = costoNuevo
          this.elementosPaqueteBuild[index].descripcion = ele.descripcion
          this.elementosPaqueteBuild[index].marca = ele.marca
          this.elementosPaqueteBuild[index].modelo = ele.modelo
          this.elementosPaqueteBuild[index].normal = costoNuevo * 1.30
        nuevoFiltro.push(full)
      }
    }
    console.log(nuevoFiltro);
    set(ref(db, `paquetes/${paquete}/elementos`), nuevoFiltro )
          .then(() => {
            // Data saved successfully!
          })
          .catch((error) => {
            // The write failed...
          });

          this.actualizaDataPaquete()
  }
  async actualizaDataPaquete(){
    let subtotal=0; let totalRefacciones=0; let total =0, totalMO =0
    this.subtotalPaquete =0; this.totalPaquete =0; 
    
    for (let index = 0; index < this.elementosPaqueteBuild.length; index++) {
      const item = this.elementosPaqueteBuild[index];
      if (item.tipo === 'MO') {
        totalMO = totalMO + item.flotilla
      }else{
        totalRefacciones = totalRefacciones +  item.flotilla
      }
      subtotal = subtotal + item.flotilla
      total = total + item.normal
    }
    const resta = subtotal - totalRefacciones
    const porcentaje = Number(resta * 100) / subtotal
    this.factibilidadPaquete = Number(this.redondeado(porcentaje,false))
    this.subtotalPaquete = subtotal
    this.totalPaquete = total
  }
  cargaDataElemento(data:any,indice:number){
    
      const ele =this.elementosPaqueteBuild[indice]
      this.myControlAll.setValue(ele)
        this.formaElementoP.reset({
          cantidad: ele.cantidad,
          nombre: ele.nombre,
          precio: ele.precio,
          index:indice,
          IDreferencia: ele.IDreferencia,
          descripcion: ele.descripcion,
          marca: ele.marca,
          modelo: ele.modelo,
        })
        this.tipo = ele.tipo
        this.guardaCatalogo = false
        this.enCatalogo = ele.catalogo
    
  }
  eliminaElementoPaquete(indice:number,update:boolean){
    if (update) {
      for (let index = 0; index < this.elementosPaqueteBuild.length; index++) {
        if (indice === index) {
          this.elementosPaqueteBuild[index] = null
        }
      }
    }else{
      this.elementosPaqueteBuild
      for (let index = 0; index < this.elementosPaqueteBuild.length; index++) {
        if (indice === index) {
          this.elementosPaqueteBuild[index] = null
        }
      }
      const filtro = this.elementosPaqueteBuild.filter(option=>option !== null)
      this.elementosPaqueteBuild = filtro
      const id = this.formaPaquete.controls['id'].value
      set(ref(db, `paquetes/${id}/elementos`), this.elementosPaqueteBuild )
            .then(() => {
              this.mensajeCorrecto('Elemento agregado a paquete')
              this.actualizaDataPaquete()
            })
            .catch((error) => {
              // The write failed...
            });
    }
    
  }
  actualizaElemento(){
    const tempData = {...this.formEditElement.value}
    
    const tempSave = {
      IDreferencia:tempData.hijo,
      cantidad:Number(tempData.cantidad),
      precio:tempData.precio,
      tipo:tempData.tipo,
    }
    const ruta = `paquetes/${tempData.padre}/elementos/${tempData.index}`
    set(ref(db, `${ruta}`), tempSave )
          .then(() => {
            this.mensajeCorrecto(`${tempData.tipo} actualizada correctamente`)
          })
          .catch((error) => {
            // The write failed...
          });
    
  }
  actualizaTotalElemento(){
    const cantidad:number = this.formEditElement.controls['cantidad'].value
    const precio:number = this.formEditElement.controls['precio'].value
    const tipo = this.formEditElement.controls['tipo'].value
    if (precio>0 && cantidad >0) {
      const multiplica:number = cantidad * precio
      if (tipo === 'MO') {
        const subtotal = multiplica
        const total = subtotal * 1.30
        this.formEditElement.controls['subtotal'].setValue(subtotal)
        this.formEditElement.controls['total'].setValue(total)
      } else {
        const subtotal = multiplica * 1.25
        const total = subtotal * 1.30
        this.formEditElement.controls['subtotal'].setValue(subtotal)
        this.formEditElement.controls['total'].setValue(total)
      }
    }else{
      this.formEditElement.controls['subtotal'].setValue(0)
      this.formEditElement.controls['total'].setValue(0)
    }
    
  }
  actualizaElementosPaquete(padre:any, hijo:any, index:number,update:boolean){
    // console.log(padre);
    // console.log(hijo);
    // console.log(index);
    const elementosPadre = padre.elementos
    let subtotal=0; let total =0;
    if (hijo.tipo === 'MO') {
      subtotal = hijo.precio
      total = subtotal * 1.30
    }else{
      subtotal = hijo.precio * 1.25
      total = subtotal * 1.30
    }
    if (update) {
      this.formEditElement.reset({
        padre: padre.id,
        hijo: hijo.IDreferencia,
        index,
        nombre: hijo.nombre,
        tipo: hijo.tipo,
        cantidad: hijo.cantidad,
        precio: hijo.precio,
        marca: hijo.marca,
        modelo: hijo.modelo,
        descripcion: hijo.descripcion,
        subtotal,
        total
      })
    }else{
      
      for (let i = 0; i < elementosPadre.length; i++) {
        const element = elementosPadre[i];
        if (i === index) {
          elementosPadre[i] = null
        }
      }
      const filtro = elementosPadre.filter(option=>option !== null)
      let nuevoarray =[]
      for (let ind = 0; ind < filtro.length; ind++) {
        const element = filtro[ind];
        const tempData = {
          IDreferencia:element.IDreferencia,
          cantidad:element.cantidad,
          precio:element.precio,
          tipo:element.tipo,
        }
        nuevoarray.push(tempData)
      }
      this.actualizaHijo(padre.id,nuevoarray,'Eliminación')
    }
   
    
  }
  changeStatusPaquete(datapaquete:any,status:boolean){
    set(ref(db, `paquetes/${datapaquete.id}/status`), status )
          .then(() => {
            let men = 'Habilitado'
            if (!status) {
              men = 'Inhabilitado'
            }
            this.mensajeCorrecto(`Paquete ${men}`)
          })
          .catch((error) => {
            // The write failed...
          });
  }
  actualizaHijo(padre:string,array:any,tipo:string){
    set(ref(db, `paquetes/${padre}/elementos`), array )
    .then(() => {
      this.mensajeCorrecto(`${tipo} correcta`)
    })
    .catch((error) => {
      // The write failed...
    });
  }
  resetMycontrol(){
    console.log();
    const valor = this.myControlAll.value
    const index = this.formaElementoP.controls['index'].value
    if (valor === '' || valor=== null) {
      this.guardaCatalogo= true
      this.formaElementoP.reset({
        cantidad:0,costo:0,subtotal:0, total:0, IDreferencia:'',index: index
      })
      const newPostKey = push(child(ref(db), 'posts')).key
      this.formaElementoP.controls['IDreferencia'].setValue(newPostKey)
      this.enCatalogo = false
    }
    this.formaElementoP.controls['nombre'].setValue(this.myControlAll.value)
  }
  RefaccionDataUnica(){
    const IDreferencia= this.formaElementoP.controls['IDreferencia'].value
    this._catalogos.consultaGetRefaccionUnica(IDreferencia).subscribe(
      (resp:any)=>{
        this.resultadoRefaccionID=resp
        if (resp!==null) {
          this.CostoUnitario=this.resultadoRefaccionID.precio
        }else{
          this.CostoUnitario=0
        }
        this.obtenerSubtotal()
      }
    )
  }



  eliminaComplemento(IDreferencia:string){
    Swal.fire({
      title: 'Esta seguro?',
      text: "Eliminar refacción de paquete!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText:'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {
        
        set(ref(db, `paquetesComplementos/${this.idDataPaquete}/${IDreferencia}`), null )
          .then(() => {
            // Data saved successfully!
            
            
          })
          .catch((error) => {
            // The write failed...
          })
          this.getCompleta(this.datPaquete.id)
          this.mensajeCorrecto('Se elimino complemento')
      }
    })
    

  }
  obtenerSubtotal(){
    const cantidad: number = this.formaElementoP.controls['cantidad'].value    
    const precio: number = this.formaElementoP.controls['precio'].value 
    if (cantidad >0 && precio > 0) {
      setTimeout(() => {
        let costoNuevo = 0;
      ( this.tipo === 'MO') ? (costoNuevo =  Number(precio)) :(costoNuevo = Number(precio *  1.25));
        const total = (costoNuevo * cantidad) * 1.30
        const subtotal = costoNuevo * cantidad        
        this.formaElementoP.controls['subtotal'].setValue(subtotal)
        this.formaElementoP.controls['total'].setValue(total)
      }, 300);
    }else{
      this.formaElementoP.controls['subtotal'].setValue(0)
      this.formaElementoP.controls['total'].setValue(0)
    }
  }
  limpiarRefacciones(){
    this.formaRefaccion.reset()
  }
  limpiarFormularioPaquete(){
    this.formaPaquete.reset()
  }
  eliminaReferencia(id:string,i:number){
    Swal.fire({
      title: 'Esta seguro de eliminar?',
      text: "Una vez eliminada esta acción no podra revertirse!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listaConjunta.splice(i, 1)
        this._catalogos.eliminaReferencia(this.IDPaquete, id).subscribe()
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })

  }
  statusRefaccion(status:string, dataRefaccion:any){
    let tipo= status
    let ultimo=''
    if (tipo==='active') { ultimo =' Activar'}
    if (tipo!=='active') { ultimo =' Desabilitar'}
    Swal.fire({
      title: `Esta seguro de ${ultimo}?`,
      text: "Una vez eliminada esta acción no podra revertirse!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._catalogos.actualizaStatusRefaccion(status,dataRefaccion).subscribe(
          (resp:any)=>{ },
          (err)=>{ console.log(err)},
          ()=>{
            // this.listarRefacciones()
            this.mensajeSweetAlert('Exito!','Se realiazo acción correctamente.','success')
          }
        )
      }
    })
    
  }
  mensajeSweetAlert(titulo:string, mensaje:string,tipo:string){
    if (mensaje==='vacios') { mensaje='LLenar todos los campos necesarios','error'}
    titulo=titulo.toUpperCase()
    switch (tipo) {
      case 'error':
        Swal.fire({ icon: 'error',title:titulo,text: mensaje})
        break;
      case 'success':
          Swal.fire({ icon: 'success',title:titulo,text: mensaje})
        break;
      case 'info':
            Swal.fire({ icon: 'info',title:titulo,text: mensaje})
        break;
      default:
        break;
    }
  }
 ordenarPorBurbuja(arrayDesordenado: number[]): number[] {
    // Copia el array recibido
    let tempArray: number[] = arrayDesordenado;
    let volverAOrdenar: boolean = false
    // Recorre el array
    tempArray.forEach(function (valor, key) {
        // Comprueba si el primero es mayor que el segundo y no esta en la última posición
        if (tempArray[key] > tempArray[key + 1] && tempArray.length - 1 != key) {
            // Intercambia la primera posición por la segunda
            let primerNum: number = tempArray[key]
            let segundoNum: number = tempArray[key + 1]
            tempArray[key] = segundoNum
            tempArray[key + 1] = primerNum
            // Si debe volver a ordenarlo
            volverAOrdenar = true
        }
    })
    // Vuelve a llamar al función
    if (volverAOrdenar) {
        this.ordenarPorBurbuja(tempArray)
    }
    // Array ordenado
    console.log(tempArray);

    return tempArray
  }
  applyFilter(event: Event,tabla:string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (tabla==='paquetes') {
      this.dataSourcePaquetes.filter = filterValue.trim().toLowerCase();
      if (this.dataSourcePaquetes.paginator) {
        this.dataSourcePaquetes.paginator.firstPage()
      }
    }
    if (tabla==='MO') {
      this.dataSourceMO.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceMO.paginator) {
        this.dataSourceMO.paginator.firstPage()
      }
    }
    if (tabla==='refacciones') {
      this.dataSourceRefacciones.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceRefacciones.paginator) {
        this.dataSourceRefacciones.paginator.firstPage()
      }
    }
    
  }
  newPagination(tabla:string){
    setTimeout(() => {
      if (tabla==='paquetes') {
        this.dataSourcePaquetes.paginator = this.paginatorPaquetes;
        this.dataSourcePaquetes.sort = this.sortPaquetes
      }
      if (tabla==='MO') {
        this.dataSourceMO.paginator = this.paginatorMO;
        this.dataSourceMO.sort = this.sortMO
      }
      if (tabla==='refacciones') {
        this.dataSourceRefacciones.paginator = this.paginatorRefacciones;
        this.dataSourceRefacciones.sort = this.sortRefacciones
      }
      
     }, 500)
  }
  limpiaFormulario(formulario:string){
    if (formulario==='mano') { this.formaManoObra.reset()}
    if (formulario==='refaccion') { this.formaRefaccion.reset()}
    if (formulario==='paquete') { this.formaPaquete.reset()}
    
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

  redondeado(value: number,symbol:boolean){
    
    let simbolo =''
    if (symbol) {
      simbolo = '$ '
    }else{
      simbolo= ''
    }

    if (value>=0) {
      let cadena = String(value).split('.')
        if (cadena.length>1) {
          cadena[1] = String(cadena[1].slice(0,2))
          if (cadena[1].length===1) {
            cadena[1]= `${cadena[1]}0`
          }
          let contador:number = String(cadena[0]).length
          let str =  String(`${cadena[0]}.${cadena[1]}`)
          let arr = str.split('')
          let muestra:any
          if (contador  ===  4) { arr[0]= arr[0]+',' }
          if (contador  ===  5) { arr[1]= arr[1]+',' }
          if (contador  ===  6) { arr[1]= arr[1]+',' }
          if (contador  ===  7) { arr[0]= arr[0]+',' }
          return muestra = `${simbolo}${arr.join('')}`
        }else{
            return `${simbolo}${cadena[0]}.00`
        }   
    }else{
      return `${simbolo}0.00`
    }
  
  }
  ordernarPorCampo(arreglo:any,campo:string){
    arreglo.sort(function (a, b) {
      if (a[campo] > b[campo]) {
        return 1;
      }
      if (a[campo] < b[campo]) {
        return -1;
      }
      return 0;
    })
    return arreglo
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
