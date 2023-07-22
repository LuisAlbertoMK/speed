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
  
  constructor(private _publicos: ServiciosPublicosService,private formBuilder: FormBuilder, private _cotizaciones: CotizacionesService,
    private _campos: CamposSystemService, private _catalogos: CatalogosService, private _bottomSheet: MatBottomSheet,
    private _vehiculos: VehiculosService) {     }

  camposDesgloce        =  [  ...this._cotizaciones.camposDesgloce    ]
  lista_cilindros_arr   =  [  ...this._vehiculos.lista_cilindros_arr  ]

  reporteGeneral        =  {  ...this._cotizaciones.reporteGeneral  }

  miniColumnas:number   =  this._campos.miniColumnas
  
  listaPaquetes = []
  // tabla
  dataSourcePaquetes = new MatTableDataSource(); //paquetes
  paquetes = ['index','nombre','modelo','marca','precio']; //paquetes
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
  
  ///nuevas
  @Output() datosSeleccionados: EventEmitter<any> = new EventEmitter<any>();
  elemento_get
  ngOnInit() {
    this.consultaMarcas()
    // this.consultaMO()
    this.construyeFirmularioPaquete()
    this.nuevas_consultas()
  }
  ngOnDestroy(): void {
    
  }
  enviarDatos(item: any) {
    this.datosSeleccionados.emit(item);
  }
  async nuevas_consultas(){
    //consultamos las manos de obra y asiganamos para la paginacion de los resultados
    const starCountRef = ref(db, `manos_obra`)
    onValue(starCountRef, async (snapshot) => {

      const mo = await this._catalogos.consulta_mo_new()

      const nuevos  = (!this.listaMO.length) ?  mo :  this._publicos. actualizarArregloExistente(this.listaMO, mo,[...this._campos.campos_elemento_mo]);
      this.listaMO = nuevos

      this.dataSourceMO.data = nuevos
      this.newPagination('mo')
    })
    

    //consultamos las refacciones y asiganamos para la paginacion de los resultados
    const starCountRef_refacciones = ref(db, `refacciones`)
    onValue(starCountRef_refacciones, async (snapshot) => {

      const refacciones = await this._catalogos.consulta_refacciones_new()

      const nuevos  = (!this.listaRefacciones.length) ?  refacciones :  this._publicos. actualizarArregloExistente(this.listaRefacciones, refacciones,[...this._campos.campos_elemento_refacciones]);

      this.listaRefacciones = nuevos

      this.dataSourceRefacciones.data = nuevos
      this.newPagination('refacciones')
    })
    

    //consultamos los paquetes y asiganamos para la paginacion de los resultados
    const starCountRef_paquetes = ref(db, `paquetes`)
    onValue(starCountRef_paquetes, async (snapshot) => {

      const paquetes = await this._catalogos.consulta_paquetes_new([...this.listaRefacciones, ...this.listaMO])

      //filtramos los paquetes solo aquellos que tengan elementos 
      const filtro_paquetes =  paquetes.filter((p) => p.elementos.length);

      const nuevos  = (!this.listaPaquetes_arr.length) ?  filtro_paquetes :  this._publicos. actualizarArregloExistente(this.listaPaquetes_arr, filtro_paquetes,[...this._campos.campos_elemento_paquetes])
  
      
      this.listaPaquetes_arr =  nuevos
      this.dataSourcePaquetes.data = nuevos
      this.newPagination('paquetes')
    })
    
  }
  consultaMarcas(){
    // marcas_autos
    const dbRef = ref(db, `marcas_autos`)
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const marcas =  snapshot.val()
        const nuevasMarcas = Object.keys(marcas).map((m: any) => {
          const arreglo = marcas[m] || [];
          return arreglo.map((a: any) => {
            const { modelo, categoria, anios } = a;
            return { marca: m, modelo, categoria, anios };
          });
        });
        this.lista_marcas_arr = Object.keys(marcas)
        
        let aquiAlls: any[] = [];
        nuevasMarcas.forEach((aqui: any[]) => {
          aquiAlls = [...aquiAlls, ...aqui];
        });
        this.lista_todos_arr = aquiAlls
      }
    }, {
        onlyOnce: true
      })
	
  }
 

  construyeFirmularioPaquete(){
    this.paqueteForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      cilindros: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      elementos: [[], Validators.required],
    });
    this.paqueteForm.get('marca').valueChanges.subscribe((marca: string) => {
      this.lista_modelos_arr = this.lista_todos_arr.filter(m=>m.marca === marca)
    })
  }
  elementoInfo(event){
    if (event.id) {
      this.elementosDePaqueteNuevo.push(event)
      this.infoAdicional.elementos = this.elementosDePaqueteNuevo
      this.reporteGeneral = this._publicos.realizarOperaciones_2(this.infoAdicional).reporte
      this.elementosDePaqueteNuevo = this._publicos.realizarOperaciones_2(this.infoAdicional).ocupados
    }
  }
  eliminaElemento(index){
    let antiguos = []
      antiguos = [...this.elementosDePaqueteNuevo]
      antiguos[index] = null
      const filtrados = antiguos.filter(e=>e !==null)
      this.elementosDePaqueteNuevo = filtrados
      this.infoAdicional.elementos = this.elementosDePaqueteNuevo
      this.reporteGeneral = this._publicos.realizarOperaciones_2(this.infoAdicional).reporte
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
            nombre: this.paqueteForm.get('nombre').value,
            marca: this.paqueteForm.get('marca').value,
            modelo: this.paqueteForm.get('modelo').value,
            cilindros: this.paqueteForm.get('cilindros').value,
            elementos: this.elementosDePaqueteNuevo,
            status: true,
          }
          const updates = { [`paquetes/${this._publicos.generaClave()}`]:tempData };
          update(ref(db), updates).then(()=>{
            this._publicos.swalToast('Se registro paquete!!', 1)
            this.reseteaInfo_paqueteForm()
          })
        }
      })
    }else{
      this._publicos.swalToast('Llenar todos los datos necesario', 0)
    }
    this.infoFaltente_paquete = faltantes_string
  }
  reseteaInfo_paqueteForm(){
    this.elementosDePaqueteNuevo = []
    this.infoFaltente_paquete = null
    this.infoAdicional.elementos = this.elementosDePaqueteNuevo
    this.paqueteForm.reset()
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
}
