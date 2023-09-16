import { Component, OnInit,OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CamposSystemService } from 'src/app/services/campos-system.service';
import { CatalogosService } from 'src/app/services/catalogos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EditaElementoComponent } from 'src/app/components/edita-elemento/edita-elemento.component';
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
  
  constructor(private _publicos: ServiciosPublicosService,private _formBuilder: FormBuilder, private _cotizaciones: CotizacionesService,
    private _campos: CamposSystemService, private _catalogos: CatalogosService, private _bottomSheet: MatBottomSheet,
    private _vehiculos: VehiculosService) {     }

  camposDesgloce        =  [  ...this._cotizaciones.camposDesgloce    ]
  lista_cilindros_arr   =  [  ...this._vehiculos.lista_cilindros_arr  ]

  reporteGeneral        =  {  ub:0,mo: 0, refacciones: 0, subtotal:0,  total: 0 }

  miniColumnas:number   =  this._campos.miniColumnas
  
  listaPaquetes = []
  // tabla
  dataSourcePaquetes = new MatTableDataSource([]); //paquetes
  paquetes = ['index','nombre','marca','modelo','precio','costo']; //paquetes
  columnsToDisplayWithExpand = [...this.paquetes, 'opciones', 'expand']; //paquetes
  expandedElement: any | null; //paquetes
  @ViewChild('paquetesPaginator') paginator: MatPaginator //paquetes
  @ViewChild('paquetes') sort: MatSort //paquetes

  dataSourceMO = new MatTableDataSource(); //MO
  columnsToDisplayMO = ['index','nombre','precio']; //MO
  columnsToDisplayWithExpandMO = [...this.columnsToDisplayMO,'opciones', 'expand'];//MO
  @ViewChild('MOPaginator') paginatorMO: MatPaginator //MO
  @ViewChild('MO') sortMO: MatSort //MO
  expandedElementMO: any | null;

  dataSourceRefacciones = new MatTableDataSource(); //MO
  columnsToDisplayRefacciones = ['index','nombre','precio']; //MO
  columnsToDisplayWithExpandRefacciones = [...this.columnsToDisplayRefacciones,'opciones', 'expand'];//MO
  @ViewChild('RefaccionesPaginator') paginatorRefacciones: MatPaginator //MO
  @ViewChild('Refacciones') sortRefacciones: MatSort //MO
  expandedElementRefacciones: any | null;

  listaRefacciones= []
  listaMO =  []
  listaPaquetes_arr=[]
  filtrar:boolean = true

  lista_moRefacciones = []

  paqueteForm: FormGroup;
  
  
  elementosDePaqueteNuevo = []
  lista_marcas_arr = []
  
  lista_todos_arr = []
  lista_modelos_arr = []
  categoria:string = ''

  infoFaltente_paquete:string = null
  infoAdicional = {
    iva: false,
    margen: 25,
    elementos: this.elementosDePaqueteNuevo,
    descuento: 0,
    formaPago: '1'
  }

  paquetes_arr = []
  
  ///nuevas
  @Output() datosSeleccionados: EventEmitter<any> = new EventEmitter<any>();
  elemento_get

  formulario_etiqueta: FormGroup

  anios:any=                [...this._vehiculos.anios];
  marcas_vehiculos:any=     this._vehiculos.marcas_vehiculos
  marcas_vehiculos_id = []
  array_modelos = []
  

  faltante_s:string
  vehiculos_compatibles = []

  // Filtrado por vehículo, marca, modelo, nombre, categoría
  filtros_paquetes = this._formBuilder.group({
    marca:'',
    modelo:'',
    nombre:'',
    categoria:''
  });

  array_modelos_filtro = []

  ngOnInit() {
    // this.consultaMO()
    this.construye_formulario_etiqueta()
    this.construyeFirmularioPaquete()
    this.nuevas_consultas()
    const n = this._publicos.crearArreglo2(this._vehiculos.marcas_vehiculos)
    this.marcas_vehiculos_id = n.map(c=>{
      return c.id
    })
    
  }
  ngOnDestroy(): void {
    
  }
  enviarDatos(item: any) {
    this.datosSeleccionados.emit(item);
  }
  
  async nuevas_consultas(){
    function agregraindex(data){
      let nuevo_arreglo = [...data]
      nuevo_arreglo.map((e, index)=>{
        e.index = index + 1
        return e
      })
      return nuevo_arreglo
    }

    const starCountRef = ref(db, `moRefacciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let moRefacciones = this._publicos.crearArreglo2(snapshot.val())

          const nuevos  = (!this.lista_moRefacciones.length) ?  moRefacciones :  this._publicos. actualizarArregloExistente(this.lista_moRefacciones, moRefacciones,[...this._campos.nuevos_campos_moRefacciones]);

          const filtrado_mo =  nuevos.filter(e=>e.tipo === 'mo')
          const filtrado_refacciones =  nuevos.filter(e=>e.tipo === 'refaccion')

        this.dataSourceMO.data = agregraindex(filtrado_mo)
        this.newPagination('mo')

        this.dataSourceRefacciones.data = agregraindex(filtrado_refacciones)
        this.newPagination('refacciones')

      }else{

      }
    })

    //consultamos las manos de obra y asiganamos para la paginacion de los resultados
    // const starCountRef = ref(db, `manos_obra`)
    // onValue(starCountRef, async (snapshot) => {

    //   const mo = await this._catalogos.consulta_mo_new()

    //   const nuevos  = (!this.listaMO.length) ?  mo :  this._publicos. actualizarArregloExistente(this.listaMO, mo,[...this._campos.campos_elemento_mo]);
    //   this.listaMO = nuevos

    //   this.dataSourceMO.data = nuevos
    //   this.newPagination('mo')
    // })
    

    // //consultamos las refacciones y asiganamos para la paginacion de los resultados
    // const starCountRef_refacciones = ref(db, `refacciones`)
    // onValue(starCountRef_refacciones, async (snapshot) => {

    //   const refacciones = await this._catalogos.consulta_refacciones_new()

    //   const nuevos  = (!this.listaRefacciones.length) ?  refacciones :  this._publicos. actualizarArregloExistente(this.listaRefacciones, refacciones,[...this._campos.campos_elemento_refacciones]);

    //   this.listaRefacciones = nuevos

    //   this.dataSourceRefacciones.data = nuevos
    //   this.newPagination('refacciones')
    // })
    

    //consultamos los paquetes y asiganamos para la paginacion de los resultados
    const starCountRef_paquetes = ref(db, `paquetes`)
    onValue(starCountRef_paquetes, async (snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        // this.listaPaquetes_arr =  this._publicos.crearArreglo2(snapshot.val())
        const paquetes =  this._publicos.crearArreglo2(snapshot.val())
        const nuevos__ = paquetes.map((g, index)=>{
          const {reporte, nuevos_elementos} = this.total_paquete(g)

          const reporte_  =  {  ub:0,mo: reporte.mo, refacciones: reporte.refacciones, subtotal:0,  total: 0 }

          reporte_.subtotal = reporte_.refacciones + reporte_.mo
          reporte_.ub = ((reporte_.refacciones + reporte_.mo) - reporte_.refacciones ) * (100 / (reporte_.refacciones + reporte_.mo) )
          
          reporte_.total = (reporte_.refacciones + reporte_.mo) * 1.25

          g.reporte = reporte_
          g.precio = reporte_.total

          g.elementos = nuevos_elementos
          g.index = index
          g.nombre = String(g.nombre).toLowerCase()
          return g
        })
        // console.log(nuevos__);
        this.paquetes_arr = agregraindex(nuevos__)

        // const ordadf = ordenamiento_(
        //   {campo: 'nombre', asc_desc: true, arreglo: this.paquetes_arr}
        //   )

          // this.dataSourcePaquetes.sortData(this.paquetes_arr,this.sort) //= new MatTableDataSource(ordadf)
          this.dataSourcePaquetes.data = this.paquetes_arr
        this.newPagination('paquetes')
        
      } else {
        console.log("No data available");
      }
      

      
    })
    
  }
  

 

  construyeFirmularioPaquete(){
    this.paqueteForm = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      cilindros: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      elementos: [[], Validators.required],
      costo: [0,],
    });
    this.vigila()
  }
  vigila(){
    this.paqueteForm.get('marca').valueChanges.subscribe((marca: string) => {
      if (marca) {
        this.array_modelos = this.marcas_vehiculos[marca] || []
      }
    })
    this.paqueteForm.get('modelo').valueChanges.subscribe((modelo: string) => {
      let modelo_ = ''
      if (modelo) {
         modelo_ = this.array_modelos.find(m=>m.modelo === modelo).categoria
      }
      // this.paqueteForm.controls['categoria'].setValue(modelo_)
    })
    this.formulario_etiqueta.get('marca').valueChanges.subscribe((marca: string) => {
      if (marca) {
        this.array_modelos = this.marcas_vehiculos[marca] || [];
      }
    })
    this.formulario_etiqueta.get('anio_final').valueChanges.subscribe((anio_final: number) => {
      if(anio_final){
        const anio_inicial:number = this.formulario_etiqueta.get('anio_inicial').value
        if (anio_final < anio_inicial) {
          this.formulario_etiqueta.get('anio_final').setValue(anio_inicial) 
        }
      }
    })

    //obervables de formulario filtros_paquetes
    this.filtros_paquetes.get('marca').valueChanges.subscribe((marca:string)=>{
      if (marca) {
        this.array_modelos_filtro = this.marcas_vehiculos[marca] || [];
      }
      this.asiganacion_filtro()
    })
    this.filtros_paquetes.get('modelo').valueChanges.subscribe((modelo:string)=>{
        this.asiganacion_filtro()
    })
  }
  asiganacion_filtro(){
    const { marca, modelo } = this._publicos.getRawValue(this.filtros_paquetes);
    const copiaPaquetes: any[] = [...this.paquetes_arr];
  
    let resultados = copiaPaquetes;
    // let nuevos = []
    // if (marca.length) {
    //   marca.forEach(c=>{
    //     console.log(c);
    //     nuevos.push(resultados.filter((paquete) => paquete.marca === c))
    //   })
    //   const otros = nuevos.flat()
    //   resultados = otros
    // }
    if (marca) {
      resultados = resultados.filter((paquete) => paquete.marca === marca);
    }
    
    if (modelo) {
      resultados = resultados.filter((paquete) => paquete.modelo === modelo);
    }
  
    this.dataSourcePaquetes.data = resultados;
  
    this.newPagination('paquetes');

  }
  elementoInfo(event){
    if (event.id) {
      this.elementosDePaqueteNuevo.push(event)
      this.infoAdicional.elementos = this.elementosDePaqueteNuevo
     this.operaciones()
    }
  }
  eliminaElemento(index){
    // let antiguos = []
    //   antiguos = [...this.elementosDePaqueteNuevo]
    //   antiguos[index] = null
    //   const filtrados = antiguos.filter(e=>e !==null)
    //   this.elementosDePaqueteNuevo = filtrados
    //   this.infoAdicional.elementos = this.elementosDePaqueteNuevo
    // Crear una copia de los elementos antiguos
    const antiguos = [...this.elementosDePaqueteNuevo];

    antiguos[index] = null;

    const filtrados = antiguos.filter((e) => e !== null);

    this.elementosDePaqueteNuevo = filtrados;

    this.infoAdicional.elementos = this.elementosDePaqueteNuevo;
    
    this.operaciones()
      // this.reporteGeneral = this._publicos.realizarOperaciones_2(this.infoAdicional).reporte
  }
  operaciones(){
    const {reporte, nuevos_elementos} = this.total_paquete({elementos: this.elementosDePaqueteNuevo})

      this.reporteGeneral.mo = reporte.mo
      this.reporteGeneral.refacciones = reporte.refacciones
      this.reporteGeneral.subtotal = reporte.refacciones + reporte.mo
      this.reporteGeneral.ub = ((reporte.refacciones + reporte.mo) - reporte.refacciones ) * (100 / (reporte.refacciones + reporte.mo) )


      this.reporteGeneral.total = (reporte.refacciones + reporte.mo) * 1.25
      
      this.infoAdicional.elementos = nuevos_elementos
  }
  validacionesPaquete(){
    
    const camposPaquete = ['nombre', 'marca', 'modelo', 'cilindros','elementos'];

    const validaciones = camposPaquete.reduce((validaciones, campo) => {
      if (campo === 'elementos') {
        if(!this.elementosDePaqueteNuevo.length){
          validaciones.faltantes.push(campo);
          validaciones.valido = false;
        }
      }else if (!this.paqueteForm.controls[campo].value){
        validaciones.faltantes.push(campo);
        validaciones.valido = false;
      }
      
      validaciones.faltantes_string = validaciones.faltantes.join(', ');
      return validaciones;
    }, { valido: true, faltantes: [], faltantes_string: null });
    return validaciones;

  }
  registraPaquete(){
    const {valido, faltantes_string} = this.validacionesPaquete();
    if (valido) {
      this._publicos.mensaje_pregunta('Guardar paquete').then(({respuesta})=>{
        if (respuesta) {
          const tempData = {
            nombre: reemplaza_string_paquete(this.paqueteForm.get('nombre').value),
            marca: this.paqueteForm.get('marca').value,
            modelo: this.paqueteForm.get('modelo').value,
            cilindros: this.paqueteForm.get('cilindros').value,
            elementos: [],
            status: true,
            vehiculos_compatibles:[],
            tipo:'paquete',
            costo: this.paqueteForm.get('costo').value || 0,
          }
          tempData.elementos = this.purifica_informacion_interna(this.elementosDePaqueteNuevo)
          tempData.vehiculos_compatibles = this.vehiculos_compatibles
          const updates = { [`paquetes/${this._publicos.generaClave()}`]:tempData };
          // console.log(updates);
          
          update(ref(db), updates).then(()=>{
            this._publicos.swalToast('Se registro paquete!!', 1)
            this.reseteaInfo_paqueteForm()
            this.vehiculos_compatibles = []
          })
        }
      })
    }else{
      this._publicos.swalToast('Llenar todos los datos necesario', 0)
    }
    this.infoFaltente_paquete = faltantes_string

    function reemplaza_string_paquete(nombre){
      const nuevo = nombre.replace(/paquete de|paquete/gi, '').trim();
      // const otro = String(nuevo).replace('paquete', '').trim();
      const nuevo_ = nuevo.replace(/\s+/g, ' ').trim(); // Reemplaza dobles espacios por un solo espacio
      return String(nuevo_).trim();
    }
  }
  reseteaInfo_paqueteForm(){
    this.elementosDePaqueteNuevo = []
    this.infoFaltente_paquete = null
    this.infoAdicional.elementos = this.elementosDePaqueteNuevo
    this.paqueteForm.reset()
  }

  //crear guardar validar datos de formulario etiqueta
  
  construye_formulario_etiqueta(): void {
    this.formulario_etiqueta = this._formBuilder.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio_inicial: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      anio_final: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
    });
    
  }
  

  colocar_etiqueta(){
    const data_form = this._publicos.getRawValue(this.formulario_etiqueta)
    
    const { faltante_s, ok } =this._publicos.realizavalidaciones_new(data_form,['marca','modelo','anio_inicial','anio_final'])
    this.faltante_s = faltante_s
    if (!ok) return
    this.vehiculos_compatibles.push(data_form)
    this.formulario_etiqueta.reset()
  }
  elimina_etiqueta(index:number){
    if (this.vehiculos_compatibles.length ) {
      const nuevos = [...this.vehiculos_compatibles]
      nuevos.splice(index,1)
      this.vehiculos_compatibles = nuevos
    }
  }
  elimina_etiqueta_paquete(data, index){

    let data_new = JSON.parse(JSON.stringify(data));
    console.log(data, index);
    const nuevos = [...data_new.vehiculos_compatibles]
      nuevos.splice(index,1)
      data_new.vehiculos_compatibles = nuevos

      console.log(data_new);
      
  }
  //TODO realiza edicion de elemento
  inicia(){
    setTimeout(()=>{ this.openBottomSheet(this.elemento_get) },100)
  }
  openBottomSheet(valor): void {
    const bottomSheetRef = this._bottomSheet.open(EditaElementoComponent,{
      data: valor , panelClass: 'full-width-bottom-sheet'
    });
    // bottomSheetRef.afterDismissed().subscribe(() => {
    //   console.log('Bottom sheet has been dismissed.');
    // });
    
    // bottomSheetRef.dismiss();
  }
  //TODO realiza edicion de elemento
  validarCampo(campo: string){
    return this.paqueteForm.get(campo).invalid && this.paqueteForm.get(campo).touched
  }

  applyFilter(tabla: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let dataSource;
    
    switch (tabla) {
      case 'paquetes':
        dataSource = this.dataSourcePaquetes;
        break;
      case 'mo':
        dataSource = this.dataSourceMO;
        break;
      case 'refacciones':
        dataSource = this.dataSourceRefacciones;
        break;
    }
    
    if (dataSource) {
      dataSource.filter = filterValue.trim().toLowerCase();
      if (dataSource.paginator) {
        dataSource.paginator.firstPage();
      }
    }
  }
  newPagination(tabla:String){
    setTimeout(() => {
      let dataSource;
      let paginator;
      let sort;
    
      switch (tabla) {
        case 'paquetes':
          dataSource = this.dataSourcePaquetes;
          paginator = this.paginator;
          sort = this.sort;
          break;
        case 'mo':
          dataSource = this.dataSourceMO;
          paginator = this.paginatorMO;
          sort = this.sortMO;
          break;
        case 'refacciones':
          dataSource = this.dataSourceRefacciones;
          paginator = this.paginatorRefacciones;
          sort = this.sortRefacciones;
          break;
      }
    
      if (dataSource) {
        dataSource.paginator = paginator;
        dataSource.sort = sort;
      }
    }, 500);
    
  }

 
  mano_refaccion({costo, precio, cantidad}){
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete({elementos}){
    const reporte = {mo:0, refacciones:0}
    const nuevos_elementos = [...elementos] 

    if (!nuevos_elementos.length) return {reporte, nuevos_elementos}

    nuevos_elementos.map((ele, index)=>{
      ele.index = index
      const {tipo} = ele
      const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
      const operacion = this.mano_refaccion(ele)
      reporte[donde] += operacion
      ele.total = operacion
      return ele
    })
    return {reporte, nuevos_elementos}
  }

  purifica_informacion(data){
    const nueva_ = JSON.parse(JSON.stringify(data));
    const {elementos} = nueva_
    const _elementos_purifica = (elementos) ? elementos : []
    const registra = _elementos_purifica.map(element => {
      const {tipo } = element
      const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
      const campos_refaccion = [ ...campos_mo, 'marca']
      const campos_paquete = [ 'aprobado', 'cantidad', 'cilindros', 'costo', 'elementos', 'enCatalogo', 'id', 'marca', 'modelo', 'nombre', 'status', 'tipo' ]
      let nueva 
      switch (tipo) {
        case 'paquete':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_paquete)
          const info_su = this.purifica_informacion_interna(nueva.elementos)
          // console.log(info_su);
          nueva.elementos = info_su
          
          break;
        case 'mo':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_mo)
          break;
        case 'refaccion':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_refaccion)
          break;
      }

      //primera recuperacion 
      // console.log(nueva);
      return nueva
    });
    // console.log(registra);
    return registra
  }
  purifica_informacion_interna(elementos:any[]){
    const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
    const campos_refaccion = [ ...campos_mo, 'marca']

    const nuevos_elementos = elementos.map(e=>{
      const {tipo} = e
      e.nombre = String(e.nombre).toLowerCase()
      switch (tipo) {
        case 'mo':
        case 'MO':
          e.tipo = String(tipo).toLowerCase()
          return this._publicos.nuevaRecuperacionData(e,campos_mo)
        case 'refaccion':
          return this._publicos.nuevaRecuperacionData(e,campos_refaccion)
      }
    })

    return nuevos_elementos 

  }
  ordenaminetoas(campo){
    // this.expandedElement = null
    const nuevo = ordenamiento_( {campo, asc_desc: true, arreglo: this.paquetes_arr} )
    console.log(nuevo);
    this.dataSourcePaquetes = new MatTableDataSource(nuevo);
    // this.dataSourcePaquetes.sort = nuevo
    // this.dataSourcePaquetes.data = nuevo
    // this.dataSourcePaquetes = nuevo
    // this.newPagination('paquetes')
  }
  
  
}
function ordenamiento_(data){
  const {campo, asc_desc, arreglo} =   data
  
  return arreglo.sort((a:any, b:any) => {
    if (campo === 'fecha_recibido') {
      if (new Date(a[campo]) < new Date(b[campo])) {
        return asc_desc ? -1 : 1;
      }
      if (new Date(a[campo]) > new Date(b[campo])) {
        return asc_desc ? 1 : -1;
      }
      return 0;
    }else{
      if (a[campo] < b[campo]) {
        return asc_desc ? -1 : 1;
      }
      if (a[campo] > b[campo]) {
        return asc_desc ? 1 : -1;
      }
      return 0;
    }
    
  });
}
