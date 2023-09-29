import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { CamposSystemService } from 'src/app/services/campos-system.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

@Component({
  selector: 'app-template-tabla-cotizaciones',
  templateUrl: './template-tabla-cotizaciones.component.html',
  styleUrls: ['./template-tabla-cotizaciones.component.css'],
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
export class TemplateTablaCotizacionesComponent implements OnInit,OnChanges {

  constructor(private router: Router, private _campos: CamposSystemService, private _security:EncriptadoService, 
    private _exporter_excel: ExporterService, private _sucursales: SucursalesService, private _publicos: ServiciosPublicosService) { }
  @Input() cotizaciones_arr:any[]
  @Input() muestra_desgloce:boolean = false
  @Input() export:boolean = false
  @Input() filtro:boolean = false 
  
  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
   cotizaciones = ['no_cotizacion','fullname','placas','fecha_recibido']; //cotizaciones
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; //cotizaciones
   expandedElement: any | null; //cotizaciones
   @ViewChild('cotizacionesPaginator') paginator: MatPaginator //cotizaciones
   @ViewChild('cotizaciones') sort: MatSort //cotizaciones
   
   formasPago = [...this._campos.formasPago]
   sucursales_array = [...this._sucursales.lista_en_duro_sucursales]

  reporte_totales = {
    mo:0,
    refacciones:0,
    refacciones_v:0,
    subtotal:0,
    iva:0,
    descuento:0,
    total:0,
    meses:0,
    ub:0,
  }
  campos_reporte_show = [
    {valor: 'mo', show:'mo'},
    {valor: 'refacciones', show:'refacciones'},
    {valor: 'refacciones_v', show:'refacciones venta'},
    {valor: 'subtotal', show:'subtotal'},
    {valor: 'iva', show:'iva'},
    {valor: 'descuento', show:'descuento'},
    {valor: 'total', show:'total'},
    {valor: 'meses', show:'meses'},
  ]
  miniColumnas:number = 100
  _rol:string
  _sucursal:string
  filtro_sucursal:string
  ngOnInit(): void {
    this.roles()
  }
  roles(){
    const { rol, sucursal } = this._security.usuarioRol()
    this._rol = rol
    this._sucursal = sucursal
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['cotizaciones_arr']) {
      const nuevoValor = changes['cotizaciones_arr'].currentValue;
      const valorAnterior = changes['cotizaciones_arr'].previousValue;
      // console.log({nuevoValor, valorAnterior});
        this.obtener_total_cotizaciones()
    }
  }
  exportar(){
    if (this.cotizaciones_arr.length) {
      console.log('exportar correcto con datos');
      console.log(this.cotizaciones_arr);
      
      this._exporter_excel.exportToExcelCotizaciones(this.dataSource.data,'exportacion')
    }else{
      console.log('sin datos para la exportacion');
      
      // this._publicos.swalToast('ningun dato ...',0, 'top-start')
    }
  }

  irPagina(pagina, data){
    const {cliente, sucursal, id: idCotizacion, tipo, vehiculo } = data
    let queryParams = {}
    
    if (this._rol === 'cliente') {
      if (pagina === 'cotizacionNueva' && !tipo) {
        pagina = 'cotizacion-new-cliente'
        queryParams = { anterior:'miPerfil',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion',vehiculo} 
      }
    }else if(this._rol !=='cliente'){
      if (pagina === 'cotizacionNueva' && !tipo) {
        queryParams = { anterior:'historial-vehiculo',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion',vehiculo} 
      }else if (pagina === 'cotizacionNueva' && tipo) {
        queryParams = { anterior:'historial-vehiculo', tipo, vehiculo} 
      }else if (pagina === 'ServiciosConfirmar' && !tipo) {
        queryParams = { anterior:'historial-vehiculo',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion',vehiculo} 
      }else if (pagina === 'ServiciosConfirmar' && tipo) {
        queryParams = { anterior:'historial-vehiculo', tipo, vehiculo}
      }
    }    
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  obtener_total_cotizaciones(){
      this.dataSource.data = this.cotizaciones_arr
      this.newPagination()
    // const reporte_totales = {
    //   mo:0,
    //   refacciones:0,
    // }
    // let margen_ = 0

    // const nuevas = [...this.cotizaciones_arr]
    // nuevas.map(g=>{
    //   margen_ += g.margen
    //   const  {reporte, servicios} = this.calcularTotales(g)
      
    //   Object.keys(reporte_totales).forEach(campo=>{
    //     reporte_totales[campo] += reporte[campo]
    //   })
    //   g.elementos = servicios
    //   g.reporte = reporte
    //   // nueva_utilidad_suma += reporte.ub
    // })
    // this.dataSource.data = nuevas
    // this.newPagination()
    // this.cotizaciones_arr = nuevas

    // const nuevo_margen = margen_ / nuevas.length

    // let subtotal = reporte_totales.mo + reporte_totales.refacciones
    // const margen = 1 + (nuevo_margen / 100)
    
    // let nueva_utilidad_operacion = (subtotal - reporte_totales.refacciones) * (100 / subtotal)

    // this.reporte_totales.mo = reporte_totales.mo
    // this.reporte_totales.refacciones = reporte_totales.refacciones
    // this.reporte_totales.refacciones_v = reporte_totales.refacciones * margen
    // this.reporte_totales.subtotal = subtotal
    // let total = reporte_totales.mo +  this.reporte_totales.refacciones_v
    // this.reporte_totales.total = total
    // this.reporte_totales.ub = nueva_utilidad_operacion

  }
  newPagination(){
   
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  calcularTotales({margen: new_margen, formaPago, elementos: servicios_, iva:_iva, descuento:descuento_}) {
    // const {margen: new_margen, formaPago, elementos: servicios_, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0}
    // let refacciones_new = 0
    const servicios = [...servicios_] 
    
    const margen = 1 + (new_margen / 100)
    servicios.map(ele=>{
      const {cantidad, costo, tipo} = ele
      if (tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          reporte.mo += mo
          reporte.refacciones += refacciones
        }
        ele.precio = mo + (refacciones * margen)
        ele.total = (mo + (refacciones * margen)) * cantidad
        if (costo > 0 ) ele.total = costo * cantidad 
        
      }else if (tipo === 'mo' || tipo === 'refaccion') {

        const operacion = this.mano_refaccion(ele)

        ele.subtotal = operacion
        ele.total = (tipo === 'refaccion') ? operacion * margen : operacion
        
        const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'

        if (ele.aprobado) reporte[donde] += operacion

      }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0

    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))

    const {mo, refacciones} = reporte

    reporte.refacciones_v = refacciones * margen

    let nuevo_total = mo + reporte.refacciones_v
    
    let total_iva = _iva ? nuevo_total * 1.16 : nuevo_total;

    let iva =  _iva ? nuevo_total * .16 : 0;

    let total_meses = (enCaso_meses.id === '1') ? 0 : total_iva * (1 + (enCaso_meses.interes / 100))
    let newTotal = (enCaso_meses.id === '1') ?  total_iva -= descuento : total_iva
    let descuentoshow = (enCaso_meses.id === '1') ? descuento : 0

    reporte.descuento = descuentoshow
    reporte.iva = iva
    reporte.subtotal = nuevo_total
    reporte.total = newTotal
    reporte.meses = total_meses

    reporte.ub = (nuevo_total - refacciones) * (100 / nuevo_total)
    return {reporte, servicios}
    
  }
  mano_refaccion({costo, precio, cantidad}){
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete({elementos}){
    const reporte = {mo:0, refacciones:0}
    const nuevos_elementos = [...elementos] 

    if (!nuevos_elementos.length) return reporte

    nuevos_elementos.forEach(ele=>{
      const {tipo} = ele
      const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
      const operacion = this.mano_refaccion(ele)
      reporte[donde] += operacion
    })
    return reporte
  }
  filtra_informacion(){
    
    const nuevas = [...this.cotizaciones_arr]
    const ordenar = (this.filtro_sucursal === 'Todas') ? nuevas : this._publicos.filtra_campo(nuevas,'sucursal',this.filtro_sucursal)
    const resultados = this._publicos.ordenamiento_fechas(ordenar,'fecha_recibido',false)

    // this.contador_resultados = resultados.length
    this.dataSource.data = resultados
    this.newPagination()
  }

}
