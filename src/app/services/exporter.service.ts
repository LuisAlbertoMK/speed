import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ServiciosPublicosService } from './servicios-publicos.service';


import {getDatabase, onValue, ref } from "firebase/database"
import { ServiciosService } from './servicios.service';
import { CamposSystemService } from './campos-system.service';
const db = getDatabase()

const EXCEL_TYPE = `application/vnd.opencmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8;`
const EXCEL_EXT ='.xlsx'
@Injectable({
  providedIn: 'root'
})
export class ExporterService {
 
  

  constructor(private _publicos:ServiciosPublicosService, private _servicios: ServiciosService, private _campos: CamposSystemService) { }
  formasPago = [...this._campos.formasPago]
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
  
  async exportToExcelCotizaciones(data:any[], excelFileName: string){
    // console.log(data);
    
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
    // console.log(cotizacionPush);
    
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
 
  
 
  generaReporteGastosExcel(data){
    const {arreglo, data_reporte_general, data_reporte_facturas, data_reporte_notas, filtro_facturas, filtro_notas, 
      total_factura, total_notas, restante_dia
    } = data
    let colocada = []
    const lieneaBlanca = {
      'no O.S':'',
      'Sucursal':'',
      'descripcion servicio':'',
      'Fecha registro':'',
      'Referencia':'',
      'Concepto':'',
      'Marca':'',
      'Modelo':'',
      'Placas':'',
      'nota / factura':'',
      'metodo pago':'',
      'Monto':'',
      'Status':'',
      'Gasto tipo':'',
      'Tipo':'',
      'Status orden':'',
    };
    // console.log(arreglo);
    
    arreglo.forEach(r=>{
      const {
        no_os,
        sucursal,
        descripcion,
        fecha_recibido,
        referencia,
        concepto,
        marca,
        modelo,
        facturaRemision,
        metodo,
        monto,
        status,
        tipo,
        metodoShow,
        placas,
        gasto_tipo,
        status_orden,
        sucursalShow,
        total_gastado
      } = r
      const temp_colocar = {
        'no O.S': no_os, 
        'Sucursal': sucursalShow, 
        'descripcion servicio': descripcion,
        'Fecha registro': this.transform_fecha(fecha_recibido, true), 
        'Referencia': referencia,
        'Concepto': concepto,
        'Marca': marca,
        'Modelo': modelo,
        'Placas': placas,
        'nota / factura': facturaRemision,
        'metodo pago': metodoShow, 
        'Monto': monto,
        'Status': status,
        'Gasto tipo': gasto_tipo,
        'Tipo': tipo,
        'Status orden': status_orden,
        'total_gastado': total_gastado
      }
      colocada.push({ ...lieneaBlanca, ...temp_colocar });

    })

    function lineas_blancas(numero){
      for (let index = 0; index < numero; index++) {
        colocada.push({ ...lieneaBlanca });
      }
    }
    lineas_blancas(1)

    
    const nuevos_ = ['deposito','sobrante','operacion','orden','restante']

    nuevos_.forEach((campo, index)=>{
    
      const campo_v = this.transform_monedas(data_reporte_general[campo])
       let mu = {
        ...lieneaBlanca,
        'Fecha registro': `${campo}`, 
        'Referencia': campo_v,
       }
       colocada.push(mu);
    })
  
    lineas_blancas(1)

    colocada.push({
      ...lieneaBlanca,
      'Fecha registro': 'Total facturas',
      'Referencia': `${this.transform_monedas(total_factura)}`,
    })
    colocada.push({
      ...lieneaBlanca,
      'Fecha registro': 'Total notas',
      'Referencia': `${this.transform_monedas(total_notas)}`,
    })
    colocada.push({
      ...lieneaBlanca,
      'Fecha registro': 'Restante de dia',
      'Referencia': `${this.transform_monedas(restante_dia)}`,
    })
    
    lineas_blancas(3)
    
    const worksheetenviar_totales_orden : XLSX.WorkSheet = XLSX.utils.json_to_sheet(colocada)

    const columnWidthsenviar_totales_orden = [
      { wch: 20 }, { wch: 10 }, { wch: 25 },{ wch: 15 },
      { wch: 25 }, { wch: 25 }, { wch: 15 },{ wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 15 },{ wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 },{ wch: 15 },
    ];
    worksheetenviar_totales_orden['!cols'] = columnWidthsenviar_totales_orden;

    const workbook: XLSX.WorkBook = {
      Sheets: {'Servicios':worksheetenviar_totales_orden},
      SheetNames:['Servicios']
    }
    
    const excelBuffer:any= XLSX.write(workbook,{bookType:'xlsx',type:'array'})

    this.saveAsExcel(excelBuffer,'Reporte de gastos')
  }

  genera_excel_recorte_ingresos(data){
    const {arreglo, data_reporte_objetivos} = data
    
    const worksheetenviar_reporte : XLSX.WorkSheet = XLSX.utils.json_to_sheet(data_reporte_objetivos)
    const worksheetenviar_totales_orden : XLSX.WorkSheet = XLSX.utils.json_to_sheet(arreglo)

    const columnWidthsenviar_totales_orden = [
      { wch: 20 }, { wch: 10 }, { wch: 15 },{ wch: 15 },
      { wch: 30 }, { wch: 15 }, { wch: 15 },{ wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 },{ wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 },{ wch: 15 },
    ];
    const columnWidthsenviar_reporte = [
      { wch: 25 }, { wch: 25 },
    ];
    worksheetenviar_totales_orden['!cols'] = columnWidthsenviar_totales_orden;
    worksheetenviar_reporte['!cols'] = columnWidthsenviar_reporte;

    const workbook: XLSX.WorkBook = {
      Sheets: {'Reporte': worksheetenviar_reporte, 'Servicios':worksheetenviar_totales_orden},
      SheetNames:['Reporte','Servicios']
    }
    
    const excelBuffer:any= XLSX.write(workbook,{bookType:'xlsx',type:'array'})


    const fecha = new Date()
    const nombre_excel = `Recorte_gastos_${fecha.getTime()}`
    this.saveAsExcel(excelBuffer,`${nombre_excel}`)
    
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
        const pago = this.formasPago.find(f=>f['id'] == element['formaPago'])
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
  transform_monedas(value: number): string {
    if (!value || isNaN(value)) return '0'; 
    
    const isNegative = value < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(value).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? '' : ''}${result}`;
      }, '');
  
    const formattedValue = `${isNegative ? '-' : ''}${formattedIntegerPart}.${decimalPart}`;
    
    return formattedValue
  }
  
}


