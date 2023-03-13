import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';
import { Credito } from 'src/app/models/credito.model';
import { Directorio } from 'src/app/models/directorio.model';
import { Facturacion } from 'src/app/models/facturacion.model';
import { AutomaticosService } from 'src/app/services/automaticos.service';
import { ClientesService } from 'src/app/services/clientes.service'
import { EstadosService } from 'src/app/services/estados.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { map, Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2'
import {debounceTime, startWith} from 'rxjs/operators'
import { Vehiculo } from 'src/app/models/vehiculos.model';

//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
//traducir
import {TranslateService} from '@ngx-translate/core';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { AuthService } from 'src/app/services/auth.service';
import { RowContext } from '@angular/cdk/table'

import {ThemePalette} from '@angular/material/core'
import {MatDialog} from '@angular/material/dialog';

import {animate, state, style, transition, trigger} from '@angular/animations';
//actualizar en tiempo real sin necesidad de obtener nueva lista
import { doc, onSnapshot } from "firebase/firestore"
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { EmailsService } from '../../services/emails.service';
import { options } from 'pdfkit';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {nombre: string}
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ClientesComponent implements AfterViewInit,OnDestroy, OnInit {
  myControl = new FormControl('')
  filteredOptions: Observable<any[]>
  ///paginacion
  displayedColumnsSuperSU: string[] = ['no_cliente','nombre','tipo', 'correo']
  displayedColumnsSuperSUExtended: string[] = [...this.displayedColumnsSuperSU,'expand']
  expandedElement: any | null;


  displayedColumns2:  string[] = ['cargo','correo', 'telefono','opciones']
  ColumnsVehiculos:string[]=['placas','categoria','modelo','marca','engomado',' ']
  // ColumnsVehiculosExtended:string[]=[...this.ColumnsVehiculos,'expand']
  dataSource = new MatTableDataSource();
  // dataSourceVehiculos: MatTableDataSource<any>

  @ViewChild('ClientePaginator') paginator: MatPaginator
  @ViewChild('clientes') sort: MatSort
  @ViewChild('vehiculosPaginator') paginatorVehiculos: MatPaginator
  @ViewChild('tabVehiculos') sortVehiculos: MatSort
  clickedRows = new Set<any>()

  //otras variables

  ROL: string = ''
  SUCURSAL:string=''
  nombreSucursal:string = ''

  //info general
  infoGeneral:any[]=[]

  formaDirectorio: FormGroup;formaFacturacion: FormGroup;formaCredito: FormGroup;formaVehiculoBusqueda: FormGroup;
  formaVehiculoManual: FormGroup;formaVehiculoManualEditar: FormGroup;formularioVehiculos: FormGroup;formaActulizaVehiculo: FormGroup;
  Vehiculos:any[]=[];directorios:Directorio[]=[];estados:any;facturaActualizar:Facturacion;clienteActualizar:Cliente;
  direcorioActualizar:Directorio;creditoActualizar: Credito;clienteSeleccionado:string='';clienteSeleccionadoActualizar='';
  cualCliente:string='';diasCredito=['30','60','90','120'];limites=['10,000','20,000','30,000','45000','50,000'];
  dataCreditos:Credito[]=[];marcas:any=[];modelos:any=[];categorias:any[]=[];colores:any[]=[];engomado:any=[];listaArrayAnios:any=[];
  VehiculosDuenio:Vehiculo[]=[];listaGenaralVehiculos:Vehiculo[]=[];engomadoColores:any[]=[];resultadosVehiculo:Vehiculo;
  vehiculoModificarID:string='';IDClienteActualizar:string='';IDDirecotorio:string='';detallesClientePersonal:any=[];detallesClienteDirectorio:any[]=[];
  detallesClienteFacturacion:any=[];detallesClienteVehiculos:any[]=[];detallesClienteCredito:any;clientesParticulares:Cliente[]=[];
  clientesParticularesShow:Cliente[]=[];clientesFlotilla:Cliente[]=[];clientesFlotillaShow:Cliente[]=[];
    //lista de sucursales
    listaArraySucursales:any[]=[]; telfono_valido:boolean = true
    //tab activo
    tabActivo:string='todos'
    //indicadicador cliente tab
    tabCliente:string='general'
    //lista array de vehiculos
    arrayVehiculos:any[]=[]
    arrayVehiculosNuevo:any=[]
    //mostrar cargando data
    cargandoData:boolean=true
    //id para actualizar vehiculo
    IDvehiculoActualizar:string=''
    //verificacion de informacion extraida para continuar usando la pagina correctamente
    listaInformacionIncompleta:any=[]
    //altura minima de columnas
    miniColumnas:number = 100
    //mostrar lista de clientes
    arrayClientes:any[]=[]
    //array de estados
    arrayEstados:any=[]
    arrayNewClientesSuperSU:any=[]
    nombreSUCURSAL:string = ''
    tiempooReal:any=[]
    tiemporRealSuperSU = []
    guardarRefrecencias=[]
    newData = []
    ///valor de snap
    snpatShotLength:number = 0
    //colorde
    color: ThemePalette = 'accent'
    //filtro solo activos
    clientesActivos =[]
    //arreglo de vehiculos
    arregloVehiculos=[]
    //arreglo de placas
    arregloPlacas=[]
    editar:boolean = false
    //asiganar informacion de cliente
    dataClienteSelect:any=[]
    //contador de correos
    contador:number = 0
    idCliente:string =''
    ///filtros
    filtroTipo:any=['todos','particular','flotilla']
    filtroSucursal:string = 'Todas'
    filtrotipo:string='particular'

    muestraNombreSucursal:string = 'Todas'
    listSucursal:any=[]
    miarreglo =[]
    newChecados:any=[]
    muestraFiltros:any=[]
    muestraAns:any=[]

    //informacion tabla de vehiculos
    datTableVehiculos:any =[]
    ///modelo de marca
    
    Sucursales:any[]=[]; 
    
    

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  listaEmpresas = []
  formaEmpresa: FormGroup;
  clientes = []

  campos_cliente = [
    {tipo:'uppercase',muestra:'no. cliente',valor:'no_cliente'},
    {tipo:'uppercase',muestra:'nombre',valor:'fullname'},
    {tipo:'lowercase',muestra:'correo',valor:'correo'},
    {tipo:'lowercase',muestra:'correo 2',valor:'correo_sec'},
    {tipo:'uppercase',muestra:'tel. movil',valor:'telefono_movil'},
    {tipo:'uppercase',muestra:'tel. fijo',valor:'telefono_fijo'},
    {tipo:'uppercase',muestra:'empresa',valor:'empresa'}
  ]
  campos_vehiculo = [
    {tipo:'uppercase',muestra:'placas',valor:'placas'},
    {tipo:'uppercase',muestra:'categoria',valor:'categoria'},
    {tipo:'uppercase',muestra:'modelo',valor:'modelo'},
    {tipo:'uppercase',muestra:'marca',valor:'marca'},
    {tipo:'capotalize',muestra:'engomado',valor:'engomado'},
    {tipo:'capitalize',muestra:'color',valor:'color'},
  ]

  showFormCliente:boolean = false

  datCliente: any
  indexCliente: number = null
  cliente:string = null

  vehiculo:string = null
  constructor(private fb: FormBuilder,private _mail:EmailsService, private _security:EncriptadoService,
    private _clientes: ClientesService, private paginatora: MatPaginatorIntl, private router: Router, public dialog: MatDialog,
    private _sucursales: SucursalesService, private _publicos: ServiciosPublicosService) {
      this.paginatora.itemsPerPageLabel = "Registros por página";
    }
  async ngOnInit() {


    //this.informacionEstados()

    
    //this.consultaVehiculos()
    this.list_clientes()
    this.listaSucursales()
    // this.listadoVehiculos()
    this.rol()
  }
  ngAfterViewInit(): void {  }

  clientesInfo(info:any){
      if (info['registro']) {
        this.showFormCliente = !info['oculta']
        this._publicos.mensajeCorrecto('registro de cliente correcto')
      }else if(info['actualizacion']){
        this._publicos.mensajeCorrecto('actualizacion de cliente correcto')
      }
  }
  vehiculoInfo(info:any){
    console.log(info);

    if (info['registro']) {
      this._publicos.mensajeCorrecto('Accion correcra')
    }else{
      this._publicos.mensajeIncorrecto('Accion no realizada')
    }
    // if (info['cancelo']) {
    //   this.showFormCliente = !info['oculta']
    // }else{
    //   if (info['registro']) {
    //     this.showFormCliente = !info['oculta']
    //     this._publicos.mensajeCorrecto('registro de cliente correcto')
    //   }else if(info['actualizacion']){
    //     this._publicos.mensajeCorrecto('actualizacion de cliente correcto')
    //   }else{
    //     this._publicos.mensajeIncorrecto('No se registro cliente')
    //   }
    // }
    // this.info_cliente = info

  }
  changeValor(valor:boolean){
    this.showFormCliente = valor
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    if (this.SUCURSAL !=='Todas' ) {
      
      this._clientes.getEmpresasSucursal(this.SUCURSAL).then(({contenido,data})=>{
        if (contenido) {
          this.listaEmpresas = this._publicos.ordernarPorCampo(data,'empresa')
        }
      })
    }else{
      this.displayedColumnsSuperSUExtended.splice(1,0,'sucursal')
      // this.displayedColumnsSuperSUExtended.push('sucursal')
    }
  }
  

  
  
  


 
  newPagination(data:string){
    setTimeout(() => {
     if (data==='clientes') {
      //  console.log(this.clientes);
      this.clientes.map(c=>{
        let vehiculos = []
        if (c['vehiculos']) {
          const claves_vehiculos = c['vehiculos']
        const clav = Object.keys(claves_vehiculos)
         clav.map(v=>{
          vehiculos.push(c['vehiculos'][v])
         })
        }
        c['vehiculos'] = vehiculos
        return c
        })
      this.dataSource.data = this.clientes
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
      // this.cargandoData = false
     }
    //  if (data==='vehiculos') {
    //   this.dataSourceVehiculos.paginator = this.paginatorVehiculos;
    //   this.dataSourceVehiculos.sort = this.sortVehiculos
    //   this.cargandoData = false
    //  }
     }, 400)
  }
  listaSucursales(){
    const starCountRef = ref(db, `sucursales`)
        onValue(starCountRef, (snapshot) => {

        this._sucursales.consultaSucursales().then(({contenido,data})=>{
          this.miarreglo =[]
          if (contenido) {
            // console.log(data);
            this.miarreglo = data.map(o=>{
              return {
                id:o['id'],
                nombre:o['sucursal'],
                checado: true
              }

            })
            const tempData={
            id:'Todas',
            nombre:'Todas',
            checado: true
          }
          this.miarreglo.push(tempData)
          this.Sucursales = data
        }
        this.newChecados = this.miarreglo
        })
        })
  }

  list_clientes(){
    const starCountRefClientes = ref(db, `clientes`)
    onValue(starCountRefClientes, (snapshot) => {
      if (snapshot.exists()) {
        this.listadoClientes()
      } else {
        console.log("No data available");
      }
    })
  }

  listadoClientes(){
    this._clientes.listaClientes()
    .then(({contenido, data})=>{
      if (contenido) {
        // console.log(data);
        
        let clientes = []
        if (this.SUCURSAL !== 'Todas') {
          let cli =  data.filter(o=>o['sucursal'] === this.SUCURSAL)
          clientes = this._publicos.ordernarPorCampo(cli,'no_cliente')
        }else{
          clientes = this._publicos.ordernarPorCampo(data,'no_cliente')
        }

        // console.log(clientes);
        if (!this.clientes.length) {
          // console.log('llenar la tabla por primera vez');
          this.clientes = clientes
          
          this.newPagination('clientes')
        }else{
            // console.log('la tabla ya cuenta con contenid');
            let original = clientes,  newDat = []
            const contadorAns = original.length, contadorServicios = this.clientes.length
            // console.log('original ',contadorAns, 'contadorServicios ', contadorServicios);

            if (contadorAns === contadorServicios) {
              for (let index = 0; index < clientes.length; index++) {
                if (JSON.stringify(clientes[index])===JSON.stringify(this.clientes[index])) {
                  // console.log(clientes[index].id);
                }else{
                  const campos =['apellidos','correo','correo_sec','id','infoSucursal','no_cliente','fullname','vehiculos',
                                'nombre','sucursal','telefono_fijo','telefono_movil','tipo','empresa']
                  
                  for (let indcampos = 0; indcampos < campos.length; indcampos++) {
                    const campo = campos[indcampos];
                    
                    if (campo==='vehiculos') {
                      if (clientes[index].vehiculos) {
                        if (JSON.stringify(clientes[index].vehiculos)===JSON.stringify(this.clientes[index].vehiculos)) {
                          }else{
                            this.clientes[index].vehiculos = clientes[index].vehiculos
                            // console.log(clientes[index].vehiculos);
                          }
                      }else{
                        this.clientes[index].vehiculos = []
                      }
                      
                      
                    }else{
                      this.clientes[index][campo] = original[index][campo]
                    }
                  }
                  
                  this.newPagination('clientes')
                }
              }
            }else  if (contadorAns > contadorServicios) {
              for (let cont = contadorServicios; cont < contadorAns; cont++) {
                this.clientes.push(clientes[cont])
                
                this.newPagination('clientes')
              }
            }else if(contadorAns < contadorServicios){
              this.clientes = clientes
              
              this.newPagination('clientes')
            }
        }
      }
    })
    .finally(()=>{
      
    })
  }
  updateClie(data:any){
    localStorage.setItem('clienteCotizacion',JSON.stringify(data))
    localStorage.removeItem('dataVehiculo')
  }


  nuevaCotizacion(data:any){
    const tempData = {...data.dataCliente,dataSucursal:data.dataSucursal}
    localStorage.setItem('clienteCotizacion',JSON.stringify(tempData))
    localStorage.setItem('dataVehiculo',JSON.stringify(data))
  }
  async filtro(tipo:string){
    this.filtrotipo = tipo
    this.filAp('')
  }
  filAp(sucursal:string){
    let nuevos:any[] =[]
      if (sucursal === 'Todas') {
        this.newChecados[0].checado = true
        for (let index = 1; index <= this.newChecados.length-1; index++) {
          this.newChecados[index].checado = true
          $('#'+this.newChecados[index].id).prop('checked',true)
        }
        const data:any[] = this.clientes
        if (this.filtrotipo === 'todos') {
          nuevos = data
        }else{
          nuevos = data.filter(option=>option.tipo === this.filtrotipo)
        }
      }else{
          $('#Todas').prop('checked',false)
          this.newChecados[0].checado = false
          for (let index = 0; index <= this.newChecados.length-1; index++) {
            if (this.newChecados[index].id === sucursal) {
              let checado:boolean = $('#'+sucursal).is(':checked')
              if (checado) {
                this.newChecados[index].checado = true
              }else{
                this.newChecados[index].checado = false
              }
            }
          }
          // const checados = this.newChecados.filter(option=>option.checado === true)
          // console.log(checados);

          const data:any[] = []
          for (let index = 0; index < this.newChecados.length; index++) {
            const check = this.newChecados[index];
              if(check.checado === true){
                const filtro = this.clientes.filter(option=>option['infoSucursal'].id === check.id)
                for (let indice = 0; indice < filtro.length; indice++) {
                  const element = filtro[indice];
                  data.push(element)
                }
              }
          }
          // const checados = this.newChecados.filter(option=>option.checado === true)
          // const clientes = this.clientes.filter(option=>option.dataSucursal.id === check.id)
          if (this.filtrotipo === 'todos') {
            nuevos = data
          }else{
            nuevos = data.filter(option=>option.tipo === this.filtrotipo)
          }
        }


        this.dataSource = new MatTableDataSource(nuevos)
        this.newPagination('clientes')

        // this.muestraFInal()
  }

  ngOnDestroy(): void {}
  applyFilter(event: Event, table:string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (table === 'clientes') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage()
      }
    }
    // if (table === 'vehiculos') {
    //   this.dataSourceVehiculos.filter = filterValue.trim().toLowerCase();
    //   if (this.dataSourceVehiculos.paginator) {
    //     this.dataSourceVehiculos.paginator.firstPage()
    //   }
    // }
  }
  cargaDataCliente(cliente:any){
    this.datCliente = null
    this.vehiculo = null
    if (cliente) {
      setTimeout(() => {
        this.datCliente = cliente
      } , 200);
    }
  }
  cargaDataVehiculo(data:any,quien:string){
    // console.log(data);
    this.cliente = null
    this.vehiculo = null
    if (quien === 'cliente') {
      
      // console.log('id de cliente');
      if (data['id']) {
        setTimeout(() => {
          this.cliente = data['id']
        } , 300);
      }
    }
    if (quien === 'vehiculo') {
      
      // console.log('id de vehiculo');
      if (data['id']) {
        setTimeout(() => {
          // console.log(data['id']);
          
          this.vehiculo = data
        } , 300);
      }
    }
    
  }
  

  

  
  
  

  
  
  filtroActivo(){
    let greaterTen = []
    this.clientesActivos=[]
    greaterTen = this.tiempooReal.filter(activo => activo.status === true)
    this.clientesActivos = greaterTen
  }
  
  statusChangeCliente(status:boolean,dataCliente:any){
    Swal.fire({
      title: 'Esta seguro?',
      html:` Cambiar status de cliente <strong class='text-capitalize'>${dataCliente.nombre}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        set(ref(db, `clientes/${dataCliente.id}/status`), status )
          .then(() => {
            this._publicos.mensajeCorrecto('Status actualizado')
          })
          .catch((error) => {
            // The write failed...
          });

      }
    })
  }
  
  
 
  dataAsignaCotizacion(cliente:any,vehiculo:any){
    if (cliente!==('' || null) && vehiculo !==(null || '')) {
      localStorage.setItem('clienteCotizacion',JSON.stringify(cliente))
      localStorage.setItem('dataVehiculo',JSON.stringify(vehiculo))
      this.router.navigateByUrl('/cotizacionNueva/clientes/new')
    }
  }
    // VEHICULOS
      actualizarConteoTabla(){
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort
        }, 1000);
      }
///limpieza de formularios
displayFn(val: User): string {
  return val && (val.nombre) ? (val.nombre ) : ''
}
filtradoClientes(){
  this.filteredOptions = this.myControl.valueChanges.pipe(
    debounceTime(100),
    startWith(''),
    map(value => this._filter(value || '')),
  )
}
private _filter(value: any[]): string[] {
  if (value===null) {
    return null
  }
  const filterValue = value

  let data = []
  data = this.tiempooReal.filter(option => option.showName.toLowerCase().includes(filterValue))
  if (data.length ===0) {
    data = this.tiempooReal.filter(option => option.apellidos.toLowerCase().includes(filterValue))
  }
  return data
}

}


