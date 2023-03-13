import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,} from '@angular/core';
import {FormBuilder,  FormControl,  FormGroup,  NgForm,  Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { getDatabase, onValue, ref, set, push, get, child, limitToFirst } from 'firebase/database';
import { CotizacionService } from 'src/app/services/cotizacion.service';

import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { query, orderBy, limit } from 'firebase/firestore';
const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {
  nombre: string;
}

export interface Item { id: string; name: string; }
import { animate, state, style, transition, trigger } from '@angular/animations';

import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { EmailsService } from '../../services/emails.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

registerLocaleData(localeES, 'es');
@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CotizacionComponent implements AfterViewInit, OnDestroy, OnInit {
  contadorPendientes:number = 0
  //autocompletado
  myControl = new FormControl('');
  filteredOptions: Observable<any[]>;
  // paginacion material
  //displayedColumns: string[] = ['position', 'name', 'weight', 'opciones'];
  displayedColumns2: string[] = ['cargo', 'correo', 'telefono', 'opciones'];

  //rol de usuario
  ROL: string = '';
  SUCURSAL: string = '';
  //resultados mostrar conjuntos de refacciones
  //ancho minimo de columnas
  miniColumnas: number = 100;
  
  //tabla cotizaciones
  displayedColumnsCotizaciones: string[] = ['index','no_cotizacion' ,'cliente', 'vehiculo'];
  displayedColumnsCotizacionesExtended: string[] = [...this.displayedColumnsCotizaciones,'expand'];
  dataSourceCotizaciones = new MatTableDataSource();
  expandedElement: any | null;


  @ViewChild('pag_cotiza') paginatorCotizaciones: MatPaginator;
  @ViewChild('tab_coti') sortCotizaciones: MatSort;
  //tabla cotizaciones


  Listacotizaciones:any[]=[]

  camposCliente=['nombre','correo','correo_sec','telefono_fijo','telefono_movil','tipo','empresa']
  camposVehiculo=['placas','marca','modelo','anio','categoria','cilindros','engomado','color','transmision','no_motor','vinChasis','marcaMotor']
  camposElementos =['nombre','cantidad','precio']
  camposElementosPrincipal =['nombre']
  camposElementosPaquete =[...this.camposElementos,'cantidad']
  camposDesgloce =['totalMO','refacciones1','refacciones2','precio','flotilla']


  infoPawuete={dataGeneral:'',elementos:[],data:{totalMO:0,refacciones1:0,refacciones2:0,precio:0,flotilla:0}}
  infoElemento:any =[]



  sucursales:any[]=[];
  clientes:any=[];
  cotizaciones:any[]=[];
  constructor(
    private fb: FormBuilder, private _publicos: ServiciosPublicosService,
    private _formBuilder: FormBuilder, private _security:EncriptadoService,
    private router: Router, private _cotizaciones: CotizacionService,
    private _email:EmailsService, private rutaActiva: ActivatedRoute,  private _exportExcel: ExporterService,
    private _sucursales: SucursalesService,private _clientes:ClientesService,
  ) {
    // this.itemsCollection = this.afs.collection<Item>('partesAuto');
    // this.items = this.itemsCollection.valueChanges()
   
  }

  async ngOnInit() {
    this.listaSucursales()
    this.rol();
    
  }
  ngAfterViewInit(): void { 
  }
  ngOnDestroy(): void {}
  rol() {
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    if (this.ROL === null) {
      this.router.navigateByUrl('/loginv1')
    }
    // (this.SUCURSAL !== 'Todas') ? this.infoCotizacion.sucursal = await this.infoRuta(`sucursales/${this.SUCURSAL}`):''
  }
  listaSucursales(){
    this._sucursales.consultaSucursales().then(({contenido,data})=>{
      if (contenido) {
        this.sucursales = data
        this.Listaclientes()
      }
    })
  }
  async Listaclientes(){
    const starCountRefClientes = ref(db, `clientes`)
    await onValue(starCountRefClientes, (snapshot) => {
      this._clientes.ListaClientes().then(async ({existe,clientes})=>{
        if (existe) {
          
          let clientes_nuevos = [];
          (this.SUCURSAL !== 'Todas')? clientes_nuevos = clientes.filter(o=>o.sucursal === this.SUCURSAL): clientes_nuevos  = clientes;
          clientes_nuevos.map(async(c)=>{
            if (!c['vehiculos']){ c['vehiculos'] = []; return }
            const arreglo_vehiculos = await  this._publicos.crearArreglo2(c['vehiculos'])
            c['vehiculos'] = arreglo_vehiculos
          })
         
          this.clientes = clientes_nuevos
          await this.ListaCotizaciones()
          if(this.clientes.length){
            setTimeout(() => {
              this.rol()
            }, 100);
          } 
        }else{
          this.clientes = []
        }
      })
    })
  }
  async ListaCotizaciones(){
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, async (snapshot) => {
      await this._cotizaciones.cotizacionesFull().
      then(({contenido,cotizaciones})=>{
        // console.log(cotizaciones);
        if (contenido) {
          // console.log(this.clientes);
          console.time('Execution Time');
        
          
          cotizaciones.map((cot,index)=>{
            cot['index'] = index
              this.clientes.forEach(cli=>{
                if(cot['cliente'] !== cli['id']) return
                cot['infoCliente'] = cli
                const vehiculos = cli['vehiculos']
                // console.log(vehiculos);
                vehiculos.forEach(v=>{
                  if(v['id']!==cot['vehiculo']) return
                  cot['infoVehiculo'] = v
                })
                // if (this.SUCURSAL === 'Todas') {
                  this.sucursales.forEach(s=>{
                    if(cli['sucursal'] !== s['id']) return
                    cot['infoSucursal'] = s
                  })
                // }
              })
          })
          console.timeEnd('Execution Time');
          if (!this.cotizaciones.length) {
            // console.log('llenar de cero');
            let cotiza = [];
            (this.SUCURSAL === 'Todas') ? cotiza = cotizaciones : cotiza =cotizaciones.filter(c=>c['sucursal'] === this.SUCURSAL)
            this.cotizaciones = cotiza            
            this.newPagination('cotizaciones')
          }else{
            // console.log(`compara data --> cotizaciones: ${cotizaciones.length} - existentes: ${this.cotizaciones.length}`);
            //primero sin es mayor los nuevos registros a los antiguos
            if (cotizaciones.length > this.cotizaciones.length) {
              const inicio = this.cotizaciones.length
              for (let index = inicio; index < cotizaciones.length; index++) {
                const cotizacion = cotizaciones[index]
                this.cotizaciones.push(cotizacion)
              }
            }else if(cotizaciones.length < this.cotizaciones.length){
              this.cotizaciones  = cotizaciones
            }else if(cotizaciones.length == this.cotizaciones.length){
              const camposRecupera = ['infoCliente']
              this.cotizaciones.map((cot,index)=>{
                if (JSON.stringify(this.cotizaciones[index]) == JSON.stringify(cotizaciones[index])) return
                cot['infoCliente'] = cotizaciones[index].infoCliente
              })
            }
                      
            this.newPagination('cotizaciones')
          }
          
          // console.log(this.cotizaciones);
          
        }
      })
    })
    
  }
  








  
  // colocarCotizaciones(){
  //   this.dataSourceCotizaciones.data = this.Listacotizaciones
  //   this.newPagination('cotizaciones')
  // }
  nueva(dataGeneral:any,margen:number){
      this._publicos.ObtenerTotalesPaquete(dataGeneral.cantidad,dataGeneral.elementos,margen).then((ans:any)=>{
        this.infoPawuete.dataGeneral = dataGeneral
        this.infoPawuete.elementos = dataGeneral.elementos
        this.infoPawuete.data.totalMO = ans.totalMO
        this.infoPawuete.data.refacciones1 = ans.refacciones1
        this.infoPawuete.data.refacciones2 = ans.refacciones2
        this.infoPawuete.data.precio = ans.precio
        this.infoPawuete.data.flotilla = ans.flotilla
      })
  }
  nuevaElemento(dataGeneral:any,margen:number){
    let operacion = 0
    if (dataGeneral.costo>0) {
      operacion =  dataGeneral.costo * dataGeneral.cantidad
    }else{
      operacion =  dataGeneral.precio * dataGeneral.cantidad
    }
    if (dataGeneral.tipo === 'MO') {
      dataGeneral.flotilla = operacion
    }else{
      const nueva = operacion * ((margen / 100 ) + 1)
      dataGeneral.flotilla = nueva
    }
    this.infoElemento =  dataGeneral
    this._publicos.mensajeElemento(dataGeneral)
  }
  newPagination(data:string){
    setTimeout(() => {
    if (data==='cotizaciones') {
      this.dataSourceCotizaciones.data = this.cotizaciones
      this.dataSourceCotizaciones.paginator = this.paginatorCotizaciones;
      this.dataSourceCotizaciones.sort = this.sortCotizaciones
    }
    // }else if (data==='paquetes') {
    //   this.dataSourcePaquetes.paginator = this.paginatorPaquetes;
    //   this.dataSourcePaquetes.sort = this.sortPaquetes
    // }
    }, 500)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCotizaciones.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCotizaciones.paginator) {
      this.dataSourceCotizaciones.paginator.firstPage();
    }
  }
  generaReporteExcel(){
    const info = this.dataSourceCotizaciones.data
    this._exportExcel.exportToExcelCotizaciones(info,'Cotizaciones')
  }
}
