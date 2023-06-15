import { Component, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  
  listaPaquetes = []
  // @Input() modelo:string
  // @Output() infoPaquete : EventEmitter<any>
  miniColumnas:number = 100

  // tabla
  dataSourcePaquetes = new MatTableDataSource(); //paquetes
  paquetes = ['index','nombre','modelo','marca','precio']; //paquetes
  columnsToDisplayWithExpand = [...this.paquetes, 'opciones', 'expand']; //paquetes
  expandedElement: any | null; //paquetes
  @ViewChild('paquetesPaginator') paginator: MatPaginator //paquetes
  @ViewChild('paquetes') sort: MatSort //paquetes

  dataSourceMO = new MatTableDataSource(); //MO
  columnsToDisplayMO = ['index','nombre','precio']; //MO
  columnsToDisplayWithExpandMO = [...this.columnsToDisplayMO, 'expand'];//MO
  @ViewChild('MOPaginator') paginatorMO: MatPaginator //MO
  @ViewChild('MO') sortMO: MatSort //MO
  expandedElementMO: any | null;

  dataSourceRefacciones = new MatTableDataSource(); //MO
  columnsToDisplayRefacciones = ['index','nombre','precio']; //MO
  columnsToDisplayWithExpandRefacciones = [...this.columnsToDisplayRefacciones, 'expand'];//MO
  @ViewChild('RefaccionesPaginator') paginatorRefacciones: MatPaginator //MO
  @ViewChild('Refacciones') sortRefacciones: MatSort //MO
  expandedElementRefacciones: any | null;

  listaRefacciones= []
  listaMO =  []
  listaPaquetes_arr=[]
  filtrar:boolean = true

  elementosDePaqueteNuevo = []

  paqueteForm: FormGroup;


  lista_marcas_arr = []
  lista_cilindros_arr = ['4','6','8','10']
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
  reporteGeneral = {
    iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
    subtotal:0, total:0, ub:0, meses:0, descuento:0,sobrescrito:0
  }
  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
    {valor:'sobrescrito', show:'sobrescrito'},
    {valor:'descuento', show:'descuento'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'iva', show:'iva'},
    {valor:'total', show:'total'},
    {valor:'meses', show:'meses'},
  ]
  constructor(private _publicos: ServiciosPublicosService,private formBuilder: FormBuilder) {     }

  ngOnInit() {
    this.consultaMarcas()
    this.consultaMO()
    this.construyeFirmularioPaquete()
  }
  ngOnDestroy(): void {
    
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
            this._publicos.swalToast('Se registro paquete!!')
            this.reseteaInfo_paqueteForm()
          })
        }
      })
    }else{
      this._publicos.swalToastError('Llenar todos los datos necesario')
    }
    this.infoFaltente_paquete = faltantes_string
  }
  reseteaInfo_paqueteForm(){
    this.elementosDePaqueteNuevo = []
    this.infoFaltente_paquete = null
    this.infoAdicional.elementos = this.elementosDePaqueteNuevo
    this.paqueteForm.reset()
  }
  validarCampo(campo: string){
    return this.paqueteForm.get(campo).invalid && this.paqueteForm.get(campo).touched
  }
  
  consultaMO(){
    const starCountRef = ref(db, `manos_obra`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const mo= this._publicos.crearArreglo2(snapshot.val())
        mo.map((r,index)=>{ 
          r['tipo'] = 'mo',
          r.index = index 
          r.descripcion = (r.descripcion) ? r.descripcion : ''
        })
        this.listaMO = mo
        this.dataSourceMO.data = mo
        this.newPagination('mo')
        this.refacciones()
      } else {
        this.refacciones()
      }
    })
  }
  refacciones(){
    const starCountRef = ref(db, `refacciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const refacciones= this._publicos.crearArreglo2(snapshot.val())
        refacciones.map((r,index)=>{ 
          r['tipo'] = 'refaccion'
          r.index = index 
          r.descripcion = (r.descripcion) ? r.descripcion : ''
         })
        this.listaRefacciones = refacciones
        this.dataSourceRefacciones.data = refacciones
        this.newPagination('refacciones')
        this.consultaPaquetes()
      } else {
        this.consultaPaquetes()
      }
    })
  }
  consultaPaquetes(){
    const unidos = this.listaMO.concat(this.listaRefacciones)
    const starCountRef = ref(db, `paquetes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const paquetes= this._publicos.crearArreglo2(snapshot.val())
            for (const [index, p] of paquetes.entries()) {
              const {elementos, reporte} = this._publicos.reportePaquete(p.elementos, 1.25);
              const elementosActualizados = elementos.map((e) => {
                if (e.catalogo || e.enCatalogo) {
                  const info = unidos.find((u) => u.id === e.IDreferencia) ?? {};
                  const camposNuevos = ['id', 'nombre', 'tipo'];
          
                  camposNuevos.forEach((c) => {
                    e[c] = info[c] ?? '';
                  });
                }
                return e;
              });
          
              paquetes[index] = {
                ...p,
                index,
                elementos: elementosActualizados,
                reporte,
                precio: reporte.total,
                total: reporte.total,
                tipo: 'paquete',
                aprobado: true,
                cantidad: 1,
                costo: 0,
              };
            }
        this.listaPaquetes_arr = paquetes.filter((p) => p.elementos.length);
        this.dataSourcePaquetes.data = this.listaPaquetes_arr
        this.newPagination('paquetes')
      } else {
        this.newPagination('paquetes')
      }
    })
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
