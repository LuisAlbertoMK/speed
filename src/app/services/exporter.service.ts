import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ServiciosPublicosService } from './servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosService } from './servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());


const EXCEL_TYPE = `application/vnd.opencmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8;`
const EXCEL_EXT ='.xlsx'
@Injectable({
  providedIn: 'root'
})
export class ExporterService {
  formasPAgo=[
    {id:1,pago:'contado',interes:0,numero:0},
    {id:2,pago:'3 meses',interes:4.49,numero:3},
    {id:3,pago:'6 meses',interes:6.99,numero:6},
    {id:4,pago:'9 meses',interes:9.90,numero:9},
    {id:5,pago:'12 meses',interes:11.95,numero:12},
    {id:6,pago:'18 meses',interes:17.70,numero:18},
    {id:7,pago:'24 meses',interes:24.,numero:24}
  ]
  servicios=[
    {valor:'1',nombre:'servicio'},
    {valor:'2',nombre:'garantia'},
    {valor:'3',nombre:'retorno'},
    {valor:'4',nombre:'venta'},
    {valor:'5',nombre:'preventivo'},
    {valor:'6',nombre:'correctivo'},
    {valor:'7',nombre:'rescate vial'}
  ]
  MetodosPago = [
    {metodo:1, muestra:'Efectivo'},
    {metodo:2, muestra:'Cheque'},
    {metodo:3, muestra:'Tarjeta'},
    {metodo:4, muestra:'Transferencia'},
  ]
  

  constructor(private _publicos:ServiciosPublicosService, private _servicios: ServiciosService) { }

  
  async exportToExcelCotizaciones(data:any[], excelFileName: string){
    console.log(data);
    
    let cotizacionPush = []
    const cotizacionPushIndivuduales =[]
    Object.entries(data).forEach(([key, entrie])=>{
      // console.log(entrie);
      const {data_cliente, data_vehiculo, data_sucursal} = entrie
      const _data_cliente = { ...data_cliente };
      const _reporte = { ...entrie.reporte };
      
      const _data_vehiculo = this.verificaInfo_vehiculo({...data_vehiculo})
      const empresa = (_data_cliente.empresa) ? _data_cliente.empresa : ''
      
      const tempData = {
        no_cotizacion: entrie.no_cotizacion,
        fecha_recibido: this.transform_fecha(entrie.fecha_recibido, true),
        tipo_cliente: _data_cliente.tipo,
        empresa: empresa,
        no_cliente: String(_data_cliente.no_cliente).toUpperCase(),
        cliente: entrie.fullname,
        numero: _data_cliente.telefono_movil,
        correo: _data_cliente.correo,
        sucursal: data_sucursal.sucursal,
        categoria: _data_vehiculo.categoria,
        servicio: this.servicios.find(s=>String(s.valor) === String(entrie.servicio)).nombre,
        marca: _data_vehiculo.marca,
        modelo: _data_vehiculo.modelo,
        placas: String(_data_vehiculo.placas).toUpperCase() ,
        cilindros: _data_vehiculo.cilindros,
        transmision: _data_vehiculo.transmision,
        anio: _data_vehiculo.anio,
        color: _data_vehiculo.color,
        engomado: _data_vehiculo.engomado,
        no_motor: _data_vehiculo.no_motor,
        subtotal: _reporte.subtotal,
        iva: _reporte.iva,
        total: _reporte.total,
      }
      cotizacionPush.push(tempData)
      const elementos:any = [...entrie.elementos]
      elementos.forEach(element => {
        const {tipo, nombre, precio, costo, cantidad, total, elementos} = element
        if (tipo === 'paquete') {
          const elementos_paquete:any[] = (elementos) ? elementos : []
          elementos_paquete.forEach(ele=>{
            const {nombre:nombre_, cantidad:cantidad_, precio:precio_, costo:costo_, total:total_} = ele
            const temp = { 
              ...tempData, tipo, nombre: String(nombre_).toLowerCase(), cantidad: cantidad_, 
              precio: precio_, costo: costo_, precio_flotilla: total_, paquete: String(nombre).toLowerCase()
            }
            cotizacionPushIndivuduales.push(temp)
          })
        }else{
          const temp = { 
            ...tempData, tipo, nombre: String(nombre).toLowerCase(), cantidad, precio, costo, precio_flotilla: total, paquete:''
          }
          cotizacionPushIndivuduales.push(temp)
        }
      });
    })
    console.log(cotizacionPush);
    
    // setTimeout(()=>{
      
      const worksheetCotizaciones : XLSX.WorkSheet = XLSX.utils.json_to_sheet(cotizacionPush)
      const worksheetindividuales : XLSX.WorkSheet = XLSX.utils.json_to_sheet(cotizacionPushIndivuduales)
  
      const columnWidthsCotizaciones = [
        { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 15 },
        { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
      ];
      worksheetCotizaciones['!cols'] = columnWidthsCotizaciones;

      const columnWidthsCIndividuales = [
        { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 15 },
        { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
      ];
        worksheetindividuales['!cols'] = columnWidthsCIndividuales;

      const workbook: XLSX.WorkBook = {
        Sheets: {'cotizaciones':worksheetCotizaciones,'individuales':worksheetindividuales},
        SheetNames:['cotizaciones','individuales']
      }
      const excelBuffer:any= XLSX.write(workbook,{bookType:'xlsx',type:'array'})
      //llamar al metodo y su nombre
      this.saveAsExcel(excelBuffer,excelFileName)
    // }, 250)
    


    
  }
  async realizarOperaciones(data:any[]){
    // console.log(data);
    
    const desgloce = { UB:0,mo:0,refacciones_1:0,refacciones_2:0,subtotal:0,iva:0,sobrescrito_mo:0,sobrescrito_refaccion:0,total:0 }
    const elementos:any[] = data['elementos']
    if(!elementos.length) return desgloce
    //necesito el margen / descuento / iva / formaPago
    // console.log( 'margen',this.margen,'formaPago',this.formaPago,'descuento',this.descuento,'iva',this.iva);
    ///construir desgloce 
    // console.log(elementos);
    let mo=0, refacciones_1=0, sobrescrito_mo=0,sobrescrito_refaccion=0
    elementos.map((ele,index)=>{
      ele['index'] = index
      if (ele['costo']>0) {
        ele['flotilla'] = ele['cantidad'] * ele['costo']
      }else{
        ele['flotilla'] = ele['cantidad'] * ele['precio']
      }

      if (ele['tipo'] === 'paquete') {
        if(!ele['elementos']) ele['elementos'] = []
        if (ele['costo']>0) {
          ele['flotilla'] = ele['costo']
        }else{
          const data_paquete = this._publicos.costodePaquete(ele['elementos'],data['margen'])
          ele['precio'] = data_paquete.flotilla * ele['cantidad']
          ele['flotilla'] = data_paquete.flotilla * ele['cantidad']
        }
      }
      if(ele['tipo'] === 'mo' ) {
        if(ele['costo']>0){
          sobrescrito_mo=sobrescrito_mo+ (ele['costo'] * ele['cantidad'])
        }else{
          if(ele['precio']>0) mo=mo+ (ele['precio'] * ele['cantidad'])
        }
      }
      if(ele['tipo'] === 'refaccion' ) {
        if(ele['costo']>0) {
          sobrescrito_refaccion=sobrescrito_refaccion+ (ele['costo'] * ele['cantidad'])
        }else{
          refacciones_1=refacciones_1+ (ele['precio'] * ele['cantidad']) 
        }
      }
      if (ele['tipo'] === 'paquete') {
        const elementos_paquete:any[] = ele['elementos']
        for (let index = 1; index <=ele['cantidad'].length; index++) {
          if(!elementos_paquete.length) return
        // aqui elementos paquete
        elementos_paquete.map(sub_ele=>{
          if(sub_ele['tipo'] === 'mo' ) {
            if(sub_ele['costo']>0){
              sobrescrito_mo=sobrescrito_mo+ (sub_ele['costo'] * sub_ele['cantidad'])
            }else{
              if(sub_ele['precio']>0) mo=mo+ (sub_ele['precio'] * sub_ele['cantidad'])
            }
          }
          if(sub_ele['tipo'] === 'refaccion' ) {
            if(sub_ele['costo']>0) {
              sobrescrito_refaccion=sobrescrito_refaccion+ (sub_ele['costo'] * sub_ele['cantidad'])
            }else{
              refacciones_1=refacciones_1+ (sub_ele['precio'] * sub_ele['cantidad']) 
            }
          }
          if (sub_ele['tipo'] === 'paquete') {
            const elementos_paquete:any[] = sub_ele['elementos']
            if(!elementos_paquete.length) return
          }
        })
          
        }
        // aqui elementos paquete
      }
    })
    
    desgloce.mo = mo
    desgloce.sobrescrito_mo = sobrescrito_mo
    desgloce.sobrescrito_refaccion = sobrescrito_refaccion
    desgloce.refacciones_1 = refacciones_1
    desgloce.refacciones_2 = refacciones_1 * (1 + (data['margen']/100))
    let descuento = 0
    if(data['descuento']) descuento = data['descuento']
    desgloce.subtotal = 
    (desgloce.mo + desgloce.refacciones_2 + desgloce.sobrescrito_mo + desgloce.sobrescrito_refaccion) - descuento
    desgloce.total = desgloce.subtotal
    if(data['iva']){
      desgloce.iva = desgloce.subtotal * .16
      desgloce.total = desgloce.subtotal + desgloce.iva
    }
    desgloce.UB = ((desgloce.total - desgloce.refacciones_1)*100)/desgloce.total
    // console.log(desgloce);
    // console.log(this.formaPago);
    this.formasPAgo.map(f=>{
      if (f.id != data['formaPago']) return
        const operacion = desgloce.total * (1 + (f['interes'] / 100))
        desgloce['meses'] = operacion;
        // console.log(f);
        // (f['numero']>0) ? this.meses = f['numero'] : this.meses = 0
    })
    // console.log(desgloce);
    

    
    // this.infoCotizacion['desgloce'] = desgloce
    // this.realizarInfo(elementos)
    return desgloce
  }
  async exportExcelServicios(data_get:any){
    const starCountRef = ref(db, `empresas`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const empre = Object.keys(data).flatMap(sucursal => {
          const empresas = this._publicos.crearArreglo2(data[sucursal]);
          return empresas.map(emp => ({
            empresa: emp['empresa'],
            id: emp['id'],
            sucursal: sucursal
          }));
        });
        this.genrex(data_get,empre)
      }else{
        this.genrex(data_get,[])
      }
    }, {
        onlyOnce: true
      })
     
  }
  genrex(data, empresas){    

    const servicios_arr = [...this._servicios.servicios];
    let otros = []
    let suma_total = 0, subtotal =0, iva = 0, mo=0, refacciones=0,descuento=0,sobrescrito=0
      const nueva = data.map(os => {
        const { cliente,servicios, reporte, sucursal, vehiculo, servicio, no_os, fecha_recibido, hora_recibido, fecha_entregado, hora_entregado, status } = os;
        const { nombre } = servicios_arr.find(s => s.valor === Number(servicio));
        const empreShow = (cliente.tipo === 'flotilla') ? empresas.find(e=>e.id === cliente.empresa) : ''
        servicios.forEach(element => {
          if (element.aprobado) {
            const tempData = {
              no_os,
              nombre: element.nombre,
              tipo: element.tipo,
              cantidad: element.cantidad,
              costo: element.costo || 0,
              precio: element.precio,
              // subtotal: element.subtotal || 0,
              total: element.total
            };
            otros.push(tempData);
          }
        });
        suma_total += reporte.total
        subtotal += reporte.subtotal
        iva += reporte.iva
        mo +=  reporte.mo
        refacciones +=  reporte.refacciones_v
        descuento +=  reporte.descuento
        const sss= reporte.sobrescrito || 0
        sobrescrito +=  sss
        return {
          no_cotizacion: no_os,
          no_cliente: cliente.no_cliente,
          cliente: `${cliente.nombre} ${cliente.apellidos}`,
          tipo_cliente: cliente.tipo,
          sucursal: sucursal.sucursal,
          correo: cliente.correo,
          numero: cliente.telefono_movil,
          empresa: empreShow.empresa,
          'servicio realizado': nombre,
          'fecha recibido': fecha_recibido,
          'hora recibido': hora_recibido,
          'fecha entregado': fecha_entregado || '',
          'hora entregado': hora_entregado || '',
          status: status,
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          placas: vehiculo.placas,
          cilindros: vehiculo.cilindros,
          transmision: vehiculo.transmision,
          anio: vehiculo.anio,
          categoria: vehiculo.categoria,
          color: vehiculo.color,
          engomado: vehiculo.engomado,
          no_motor: vehiculo.no_motor || '',
          mo: reporte.mo,
          refacciones: reporte.refacciones_v,
          descuento: reporte.descuento,
          sobrescrito: reporte.sobrescrito,
          subtotal: reporte.subtotal,
          iva: reporte.iva || 0,
          total: reporte.total
        };
      });
      // iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
      //     subtotal:0, total:0, ub:0, meses:0, descuento:0,sobrescrito:0
    // const suma_total = sum([registro['total'] for registro in data])

    const fila_subtotal  = {'no_cotizacion': '', 'no_cliente': '', 'cliente': '', 'tipo_cliente': '',
                 'sucursal': '', 'correo': '', 'numero': '', 'servicio realizado': '',
                 'fecha recibido': '', 'hora recibido': '', 'fecha entregado': '', 'hora entregado': '',
                 'status': '', 'marca': '', 'modelo': '', 'placas': '', 'cilindros': '', 'transmision': '',
                 'anio': '', 'categoria': '', 'color': '', 'engomado': '', 'no_motor': 'Totales',
                 'mo': mo, 'refacciones': refacciones, 'descuento': descuento, 'sobrescrito': sobrescrito, 'subtotal': subtotal,
                 'iva': iva, 'total': suma_total}
  nueva.push({})
  nueva.push(fila_subtotal)
  const worksheetCotizaciones : XLSX.WorkSheet = XLSX.utils.json_to_sheet(nueva)

  let total_ind = 0
  otros.forEach(e=>{
    total_ind += e.total
  })
  const fila_indi = { no_os:'', nombre: '', tipo: '', cantidad: '', costo: '', precio: 'Total', total: total_ind }
  otros.push({})
  otros.push(fila_indi)

  const worksheetindividuales : XLSX.WorkSheet = XLSX.utils.json_to_sheet(otros)
    const columnWidthsCotizaciones = [{ wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 15 }];
    worksheetCotizaciones['!cols'] = columnWidthsCotizaciones;

    const columnWidthsCIndividuales = [{ wch: 20 }, { wch: 60 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
    worksheetindividuales['!cols'] = columnWidthsCIndividuales;

    const workbook: XLSX.WorkBook = {
      Sheets: {'Servicios':worksheetCotizaciones,'individuales':worksheetindividuales},
      SheetNames:['Servicios','individuales']
    }
    
    const excelBuffer:any= XLSX.write(workbook,{bookType:'xlsx',type:'array'})
    //llamar al metodo y su nombre
    // console.log(data);
    
    this.saveAsExcel(excelBuffer,'ReporteServicios')
  }
  generaReporteGastosExcel(data:any[], reporte_get, enviar_totales_orden){
    const registros = [...data]
    console.log(registros);
    console.log(enviar_totales_orden);
    
    const camposReporte = [
      {valor:'depositos', show:'Depositos'},
      // {valor:'pagos', show:'Pagos'},
      {valor:'operacion', show:'Gastos de operación'},
      {valor:'gastos', show:'Gastos de ordenes'},
      {valor:'sobrante', show:'Sobrante'},
    ]
    let facturas = [], notas = []
    const reporteFacturas = {subtotal: 0, iva: 0, total: 0}
    const reporteNotas = {subtotal: 0, iva: 0, total: 0}
    function obtenerPorcentajes(cantidad, porcentaje){
      const iva = cantidad * (porcentaje / 100);
      let subtotal = cantidad - iva 
      let total = subtotal + iva
      return {subtotal, iva, total}
    }
    const nueva = registros.map(r=>{
      const estado = (r.status) ? 'Aprobado' : 'No aprobado';
      if(r.tipo === 'orden'){
        r.facturaRemision = (r.facturaRemision) ? r.facturaRemision : r.facturaRemision = 'nota';
        if(r.facturaRemision === 'factura') {
         const {subtotal,iva,total} = obtenerPorcentajes(r.monto,16)
          reporteFacturas.subtotal += subtotal
          reporteFacturas.iva += iva
          reporteFacturas.total += total
        } else {
          const {subtotal,iva,total} = obtenerPorcentajes(r.monto,16)
          reporteNotas.subtotal += subtotal
          reporteNotas.iva += iva
          reporteNotas.total += total
        }
        (r.facturaRemision === 'factura') ? facturas.push(r) : notas.push(r)
      }
      const descripcion = (r.reporte)? `Total de orden de servicio ${r.reporte.total}` : ''
      const marca = (r.vehiculo)? `${r.vehiculo.marca}` : ''
      const modelo = (r.vehiculo)? `${r.vehiculo.modelo}` : ''
      const placas = (r.vehiculo)? `${r.vehiculo.placas}` : ''

      const nuevaD = (r.statusOrden === 'entregado') ? descripcion : ''
      
      let facturaRemision = ''
      if(r.tipo === 'orden'){
        facturaRemision = (r.facturaRemision) ?  r.facturaRemision : r.facturaRemision = 'nota';
      }
      // ${r.vehiculo.marca} ${r.vehiculo.modelo} ${r.vehiculo.placas} 

      return {
        'Fecha registro': this._publicos.retorna_fechas_hora({fechaString: new Date(r.fecha_registro)}).formateada,
        'Tipo': r.tipo,
        'Sucursal': r.sucursalShow,
        'no O.S': r.no_os || '',
        'descripcion servicio': r.string_servicios,
        'Concepto': r.concepto,
        'Referencia': r.referencia || '',
        'nota / factura': facturaRemision,
        'metodo pago': r.metodoShow,
        'Monto': r.monto || 0,
        'Status': estado,
        'Status orden': r.statusOrden,
        'Marca': marca,
        'Modelo': modelo,
        'Placas': placas,
      }
    })
    // console.log(registros);
    const lieneaBlanca = {
      'Fecha registro': '', 
      'Tipo': '',
      'Sucursal': '', 
      'no O.S': '', 
      'descripcion servicio':'',
      'Concepto': '', 
      'Referencia': '',
      'nota / factura':'',
      'metodo pago': '', 
      'Monto': '',
      'Status': '',
      'Status orden':'',
      'Marca': '',
      'Modelo': '',
      'Placas':'',
    };
    
    const lieneaBlancaFactura = {
      'fecha registro':  '',
      'tipo':            '',
      'sucursal':        '',
      'no O.S':           '',
      'descripcion servicio':      '',
      'concepto':        '',
      'referencia':      '',
      'metodo':          '',
      'monto':           '',
      'subtotal':        '',
      'iva':             '',
      'total':           '',
      'total orden':     '',
      'gastos':          '',
      'status':          '',
      'Status orden': '',
      'tipo Gasto':      '',
      'Marca':           '',
      'Modelo':          '',
      'Placas':          '',
      'advertencia': ''
    };
    const lieneaBlancaNotas = {
      'fecha registro':  '',
      'tipo':            '',
      'sucursal':        '',
      'no O.S':           '',
      'descripcion servicio':      '',
      'concepto':        '',
      'referencia':      '',
      'status':          '',
      'Status orden': '',
      'tipo Gasto':      '',
      'metodo':          '',
      'monto':           '',
      'descripcion':     '',
      'subtotal':        '',
      'iva':             '',
      'total':           '',
      'total orden':     '',
      'gastos':          '',
      'Marca':           '',
      'Modelo':          '',
      'Placas':          '',
      'advertencia':     ''
    };

    const lieneaBlanca_ordenes = {
      'no_os':        '',
      'descripcion':      '',
      'total_gastado':        '',
    }
    
    //seprara facturas de remision
    

    const ordenadas = this._publicos.ordenarData(nueva,'Tipo',true)
    const {subtotal,iva,total} = obtenerPorcentajes(reporteFacturas.total,16)
    const aqui = obtenerPorcentajes(reporteNotas.total,16)
    ordenadas.push({ ...lieneaBlanca });
    ordenadas.push({ ...lieneaBlanca });
    ordenadas.push({ ...lieneaBlanca, 'Referencia': 'Total depositos', 'Concepto': reporte_get.depositos, 'Modelo': 'Subtotal facturas', 'Placas': `${subtotal}`, 'metodo pago': 'Subtotal notas', 'Monto': `${aqui.subtotal}` });
    ordenadas.push({ ...lieneaBlanca, 'Referencia': 'Total operacion', 'Concepto': reporte_get.operacion, 'Modelo': 'I.V.A facturas', 'Placas': `${iva}`, 'metodo pago': 'I.V.A notas', 'Monto': `${aqui.iva}`});
    ordenadas.push({ ...lieneaBlanca, 'Referencia': 'Total gastos', 'Concepto': reporte_get.gastos, 'Modelo': 'Total facturas', 'Placas': `${total}`,'metodo pago': 'Total notas', 'Monto': `${aqui.total}` });
    ordenadas.push({ ...lieneaBlanca, 'Referencia': 'Total sobrante', 'Concepto': reporte_get.sobrante });


    


    const nueva_facturas = facturas.map(r=>{
      const estado = (r.status) ? 'Aprobado' : 'No aprobado';
      const {subtotal, iva, total} = obtenerPorcentajes(r.monto,16)
      const descripcion = (r.reporte)? `Total de orden de servicio ${r.reporte.total}` : ''
      const marca = (r.vehiculo)? `${r.vehiculo.marca}` : ''
      const modelo = (r.vehiculo)? `${r.vehiculo.modelo}` : ''
      const placas = (r.vehiculo)? `${r.vehiculo.placas}` : ''
      return {
        'concepto':         r.concepto || '',
        'referencia':       r.referencia || '',
        'sucursal':         r.sucursalShowm,
        'no O.S':           r.no_os || '',
        'tipo':             r.facturaRemision,
        'Status orden': r.statusOrden,
        'fecha registro':  this._publicos.retorna_fechas_hora({fechaString: new Date(r.fecha_registro)}).formateada,
        'tipo Gasto':       r.tipoNuevo,
        'metodo':           r.metodoShow,
        'monto':            r.monto,
        'descripcion servicio': descripcion,
        'Marca': marca,
        'Modelo': modelo,
        'Placas': placas,
        'status':           estado,
        'subtotal':         `${subtotal}`,
        'iva':              `${iva}`,
        'total':            `${total}`,
        'total orden':       r.totalOrden,
        'gastos':           r.totalGastosOrden || '',
        'advertencia':      r.advertencia || ''
      }
    })
    nueva_facturas.push({ ...lieneaBlancaFactura });
    nueva_facturas.push({ ...lieneaBlancaFactura });
    nueva_facturas.push({ ...lieneaBlancaFactura, 'tipo Gasto':'Subtotal','metodo': `${subtotal}` });
    nueva_facturas.push({ ...lieneaBlancaFactura, 'tipo Gasto':'I.V.A','metodo': `${iva}` });
    nueva_facturas.push({ ...lieneaBlancaFactura, 'tipo Gasto':'Total','metodo': `${total}` });

    const worksheetFacturas : XLSX.WorkSheet = XLSX.utils.json_to_sheet(nueva_facturas)
    const columnWidthsFActuras = [
      { wch: 30 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, 
      { wch: 10 }, { wch: 10 },{ wch: 10 },{ wch: 10 }, { wch: 10 },
      { wch: 30 }, { wch: 10 },{ wch: 10 },{ wch: 10 }, { wch: 10 },
    ];
    worksheetFacturas['!cols'] = columnWidthsFActuras;

    const nueva_Notas = notas.map(r=>{
      const estado = (r.status) ? 'Aprobado' : 'No aprobado';
      const {subtotal, iva, total} = obtenerPorcentajes(r.monto,0)
      const descripcion = (r.reporte)? `Total de orden de servicio ${r.reporte.total}` : ''
      const marca = (r.vehiculo)? `${r.vehiculo.marca}` : ''
      const modelo = (r.vehiculo)? `${r.vehiculo.modelo}` : ''
      const placas = (r.vehiculo)? `${r.vehiculo.placas}` : ''
      return {
        'concepto':         r.concepto || '',
        'referencia':       r.referencia || '',
        'sucursal':         r.sucursalShow,
        'no O.S':           r.no_os || '',
        'tipo':             r.facturaRemision,
        'Status orden': r.statusOrden,
        'fecha registro':  this._publicos.retorna_fechas_hora({fechaString: new Date(r.fecha_registro)}).formateada,
        'tipo Gasto':       r.tipoNuevo,
        'metodo':           r.metodoShow,
        'monto':            r.monto,
        'descripcion servicio': descripcion,
        'Marca': marca,
        'Modelo': modelo,
        'Placas': placas,
        'status':           estado,
        'descripcion':      '',
        'subtotal':         `${subtotal}`,
        'iva':              `${iva}`,
        'total':            `${total}`,
        'total orden':       r.totalOrden,
        'gastos':           r.totalGastosOrden || 0,
        'advertencia':      r.advertencia || ''
      }
    })
    nueva_Notas.push({ ...lieneaBlancaNotas });
    nueva_Notas.push({ ...lieneaBlancaNotas });

    
    nueva_Notas.push({ ...lieneaBlancaNotas, 'tipo Gasto':'Subtotal','metodo': `${aqui.subtotal}` });
    nueva_Notas.push({ ...lieneaBlancaNotas, 'tipo Gasto':'I.V.A','metodo': `${aqui.iva}` });
    nueva_Notas.push({ ...lieneaBlancaNotas, 'tipo Gasto':'Total','metodo': `${aqui.total}` });


    const worksheetCotizaciones : XLSX.WorkSheet = XLSX.utils.json_to_sheet(ordenadas)
    const worksheetNotas : XLSX.WorkSheet = XLSX.utils.json_to_sheet(nueva_Notas)
    const columnWidthsNotas = [
      { wch: 30 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, 
      { wch: 10 }, { wch: 10 },{ wch: 10 },{ wch: 10 }, { wch: 10 },
      { wch: 30 }, { wch: 15 },{ wch: 10 },{ wch: 15 }, { wch: 15 },  
      { wch: 10 }, { wch: 15 },{ wch: 15 },{ wch: 15 }, { wch: 15 },  
    ];
    worksheetNotas['!cols'] = columnWidthsNotas;

    const columnWidthsCotizaciones = [
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, 
      { wch: 30 }, { wch: 15 }, { wch: 15 },{ wch: 15 },
      { wch: 20 }, { wch: 15 }, { wch: 15 },{ wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 },{ wch: 15 },
      { wch: 20 }
    ];
    worksheetCotizaciones['!cols'] = columnWidthsCotizaciones;
    const envi= [
      // {...lieneaBlanca_ordenes}
    ]

    enviar_totales_orden.forEach(element => {
      envi.push(Object(element))
    });

    // lieneaBlanca_ordenes
    const worksheetenviar_totales_orden : XLSX.WorkSheet = XLSX.utils.json_to_sheet(envi)

    const columnWidthsenviar_totales_orden = [
      { wch: 20 }, { wch: 40 }, { wch: 15 }
    ];
    worksheetenviar_totales_orden['!cols'] = columnWidthsenviar_totales_orden;
    // console.log(worksheetCotizaciones);
    // console.log(worksheetenviar_totales_orden);
    
    const workbook: XLSX.WorkBook = {
      Sheets: {'Servicios':worksheetCotizaciones, 'Facturas':worksheetFacturas,'Notas':worksheetNotas,'Ordenes':worksheetenviar_totales_orden},
      SheetNames:['Servicios','Facturas','Notas','Ordenes']
    }
    
    const excelBuffer:any= XLSX.write(workbook,{bookType:'xlsx',type:'array'})
    //llamar al metodo y su nombre
    // console.log(data);
    
    this.saveAsExcel(excelBuffer,'Reporte de gastos')
    
  }
  private saveAsExcel(buffer:any,fileName:string): void{
    const data: Blob = new Blob([buffer],{type: EXCEL_TYPE})
    // FileSaver.saveAs(data, fileName+'_export_'+new Date().getTime()+ EXCEL_EXT)
    FileSaver.saveAs(data, fileName+'_export_'+ EXCEL_EXT)
  }
  generaReportenew(data:any,fechaR:string, TotalGO:number){
    const ca = ['checkList','cliente','fechaPromesa','fecha_recibido','firmaCliente','formaPago','hora_recibido','iva','margen',
    'no_os','servicio','servicios','servicios_original','status','sucursal','vehiculo','id','fecha_compara_recibido','infoVehiculo',
    'desgloce'] 
    const camposR = ['checkList','cliente','desgloce','fechaPromesa','fecha_compara_recibido','fecha_recibido','firmaCliente',
                      'formaPago','hora_recibido','id','infoVehiculo','iva','margen','no_os','servicio','servicios','status',
                      'sucursal','vehiculo']
    
    
    let arregloExcel = []
    data.map(element => {
      // console.log(Object.keys(element).join(`','`));
      if (element['formaPago']) {
        const pago = this.formasPAgo.find(f=>f['id'] == element['formaPago'])
        // element['formaPago'] = pago['pago']
      }
      // if (!element['servicios']) element['servicios'] = []
      if (element['servicio']) {
        const servicio = this.servicios.find(f=>f['valor'] == element['servicio'])
        // element['servicio'] = servicio['nombre']
      }
      (element['iva']) ? element['ComprobantePago'] = 'Factura' : element['ComprobantePago'] = 'Remisión'
      // console.log(info);
      const construye = {}
      // const camposPrincipal = ['fecha_recibido','formaPago','hora_recibido','margen','margen','no_os','ComprobantePago','servicio','status']
      const camposPrincipal = ['no_os','HistorialGastos','HistorialPagos','servicios']
      const campoCliente = ['fullname','no_cliente','tipo','empresa']
      const campoSucursal = ['sucursal']
      // const campoVehiculo = ['anio','categoria','cilindros','color','engomado','marca','modelo','placas','transmision']
      const campoVehiculo = ['marca','modelo','anio']
      // const camposDesgloce = ['UB','iva','subtotal','total']
      const camposDesgloce = ['iva','subtotal','total']
      // const client = this._publicos.recuperaData([],element['infoCliente'])
      const cliente = element['infoCliente']
      const sucursal =  element['infoSucursal']
      const vehiculo =  element['infoVehiculo']
      const desgloce =  element['desgloce']

      
      campoCliente.forEach(campo=>{
        construye[campo] = cliente[campo]
      })
      campoSucursal.forEach(campo=>{
        construye[campo] = sucursal[campo]
      })
      campoVehiculo.forEach(campo=>{
        construye[campo] = vehiculo[campo]
      })
      camposPrincipal.forEach(campo=>{
        construye[campo] = element[campo]
      })
      camposDesgloce.forEach(campo=>{
        construye[campo] = desgloce[campo]
      })
      arregloExcel.push(construye)
    })
    let ticketPromedio = 0
    arregloExcel.map((c, index)=>{
      c['index'] = index + 1
      if(!c['empresa']) c['empresa'] = 'Particular'
      ticketPromedio+= c['total']
    })
    // console.log(arregloExcel);
    // console.log('ticket promedio: ',ticketPromedio/ arregloExcel.length);
    const tick = ticketPromedio/ arregloExcel.length
    let nuevos =  []
    let desgloceunico = {Efectivo:0,Cheque:0,Tarjeta:0,Transferencia:0}
    const desdd = {pagos:0, gastos:0}
    arregloExcel.forEach((a,index)=>{
      if(!a['HistorialPagos']) a['HistorialPagos']=[];
      if(!a['HistorialGastos']) a['HistorialGastos']=[];
      const pagos = a['HistorialPagos']
      const gastos = a['HistorialGastos']
      
      pagos.forEach(p => {
        this.MetodosPago.forEach((f)=> { 
           if(f.metodo == p['metodo']) desgloceunico[f.muestra] = desgloceunico[f.muestra] + p['monto'] 
          })
          desdd.pagos+=p['monto']
      });
      gastos.forEach(g => {
        this.MetodosPago.forEach((f)=> { 
           if(f.metodo == g['metodo']) desgloceunico[f.muestra] = desgloceunico[f.muestra] - g['monto'] 
          })
          desdd.gastos+=g['monto']

      });
      a['totalPG']  = 0
      let descripcion = []
      a['servicios'].forEach((s)=>{
        descripcion.push(s['nombre'])
      })
      a['descripcion'] = descripcion.join(', ')
      Object.keys(desgloceunico).forEach((d)=>{
          a[d] = desgloceunico[d]
          a['totalPG'] += desgloceunico[d]
      })

      nuevos.push(
                  [a['index'], a['no_os'], a['marca'], a['modelo'],a['anio'], a['descripcion'], this._publicos.redondeado(a['total']),
                  this._publicos.redondeado(a['Efectivo']),this._publicos.redondeado(a['Cheque']),this._publicos.redondeado(a['Transferencia']),this._publicos.redondeado(a['Tarjeta']),this._publicos.redondeado((a['total'] - a['totalPG'])),a['empresa'] ]
                  )
    })    
    const camposheader = []

    const header = ['no','no_os','marca','modelo','anio','Descripcion','total','Efectivo','Cheque','Transferencia','Tarjeta','Deuda','Empresa']
    const wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet([ camposheader ]);
    // ws = XLSX.utils.json_to_sheet(nuevoss)
    // console.log(nuevos);
    let numero = 1
    const mes = this._publicos.getFechaHora().Mes
    // XLSX.utils.sheet_add_aoa(ws, [['pagos', 'gastos','ub']], {origin: "F1"});
    XLSX.utils.sheet_add_aoa(ws, [['Ventas',this._publicos.redondeado(desdd.pagos)]], {origin: "F"+(numero)});
    numero++
    const GM = desdd['pagos']- (desdd['gastos'] + TotalGO)
    XLSX.utils.sheet_add_aoa(ws, [['Gastos',this._publicos.redondeado(desdd.gastos)]], {origin: "F"+(numero++)});
    XLSX.utils.sheet_add_aoa(ws, [['Operacion',this._publicos.redondeado(TotalGO)]], {origin: "F"+(numero++)});
    XLSX.utils.sheet_add_aoa(ws, [['GM',this._publicos.redondeado(GM)]], {origin: "F"+(numero++)});
    XLSX.utils.sheet_add_aoa(ws, [['Objetivo',fechaR,12345678]], {origin: "F"+(numero++)});
    XLSX.utils.sheet_add_aoa(ws, [['% Cumplido',this._publicos.redondeado(53.5,'%')]], {origin: "G"+(numero++)});
    XLSX.utils.sheet_add_aoa(ws, [['ticket promedio',this._publicos.redondeado(tick)]], {origin: "G"+(numero++)});
    
    //para fecha de realizacion
    // console.log(this._publicos.getFechaHora().fecha);
    const fecha = this._publicos.getFechaHora().fecha
    
    const nF = fecha.split('/')
    const nuevaFecha = []
    if (Number(nF[0])<10) { nuevaFecha[0] = `0${nF[0]}` }else { nuevaFecha[0] = nF[0]}
    if (Number(nF[1])<10) { nuevaFecha[1] = `0${nF[1]}` }else { nuevaFecha[1] = nF[1]}
    nuevaFecha[2] = nF[2]
    const fechaString = nuevaFecha.join('/')
    numero++
    XLSX.utils.sheet_add_aoa(ws, [['Arqueo correspondiente a',fechaString]], {origin: "C"+(numero)});
    XLSX.utils.sheet_add_aoa(ws, [['Fecha de realizacion',fechaString]], {origin: "H"+(numero)});
    numero+=2
    XLSX.utils.sheet_add_aoa(ws, [header], {origin: "A"+(numero++)});
      nuevos.forEach(n=>{
        XLSX.utils.sheet_add_aoa(ws, [n], {origin: "A"+numero++});
      })
      XLSX.utils.book_append_sheet(wb, ws, 'reporte')
      
      const worksheetCotizaciones : XLSX.WorkSheet = XLSX.utils.json_to_sheet(nuevos)
      
      let workbook: XLSX.WorkBook = {
        // 'individuales':worksheetindividuales
        Sheets: {'Servicios':worksheetCotizaciones},
        SheetNames:['Servicios']
      }
      // XLSX.utils.book_append_sheet(workbook, worksheet,"Sheet1");
      
      // XLSX.writeFile(wb, 'myexzcel.xlsx')
    const excelBuffer:any= XLSX.write(wb,{bookType:'xlsx',type:'array'})
    //llamar al metodo y su nombre
    // console.log(data);
    
    this.saveAsExcel(excelBuffer,'ReporteServicios')
  }
  verificaInfo_vehiculo(data_vehiculo){
    let nueva_data = data_vehiculo
    if (nueva_data.id) {
      const campos= ['cilindros','anio','color','no_motor','marcaMotor','marca','categoria','engomado']
      campos.forEach(campo=>{
        nueva_data[campo] = (nueva_data[campo]) ? nueva_data[campo] : ''
      })
    }
    return nueva_data
  }
  transform_fecha(fecha: string, incluirHora: boolean = false, ...args: unknown[]): string {
    if(!fecha) return ''
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // Los meses en JavaScript son base 0, por eso se suma 1
    const anio = fechaObj.getFullYear();
    const hora = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();
      let fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;
    
      if (incluirHora) {
        fechaFormateada += ` ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      }
    
      return fechaFormateada;
  }
  
}


