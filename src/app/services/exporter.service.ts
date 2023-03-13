import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { ServiciosPublicosService } from './servicios-publicos.service';
import { map } from 'rxjs/operators';
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
    {valor:1,nombre:'servicio'},
    {valor:2,nombre:'garantia'},
    {valor:3,nombre:'retorno'},
    {valor:4,nombre:'venta'},
    {valor:5,nombre:'preventivo'},
    {valor:6,nombre:'correctivo'},
    {valor:7,nombre:'rescate vial'}
  ]
  MetodosPago = [
    {metodo:1, muestra:'Efectivo'},
    {metodo:2, muestra:'Cheque'},
    {metodo:3, muestra:'Tarjeta'},
    {metodo:4, muestra:'Transferencia'},
  ]

  constructor(private _publicos:ServiciosPublicosService) { }

  
  async exportToExcelCotizaciones(data:any, excelFileName: string){
    const cotizaciones = data
    
    const cotizacionPush =[]
    const cotizacionPushIndivuduales =[]
    // console.log(data);
    // retur

    cotizaciones.map(async(cot)=>{
      // console.log(cot);
      this.servicios.map(ser=>{
        if(cot['servicio'] != ser.valor ) return
        // if (cot['servicio'] == ser.valor) {
          cot['servicio'] = ser.nombre
        // }
      })
      // console.log(cot['servicio']);
      
      const cliente = cot.infoCliente
      const sucursal = cot.infoSucursal
      const vehiculo = cot.infoVehiculo
      if(!cliente['empresa']) cliente['empresa'] = ''
      if(!vehiculo['no_motor']) vehiculo['no_motor'] = ''
      const tempData = {
        no_cotizacion: `${cot.no_cotizacion}`,
        no_cliente: `${cliente.no_cliente}`,
        cliente: `${cliente.nombre} ${cliente.apellidos}`,
        tipo_cliente: `${cliente.tipo}`,
        sucursal: `${sucursal.sucursal}`,
        correo: `${cliente.correo}`,
        numero: `${cliente.telefono_movil}`,
        empresa: `${cliente.empresa}`,
        servicio: `${cot.servicio}`,
        // aprobada: `${cot.aprobada}`,
        fecha: `${cot.fecha}`,
        hora: `${cot.hora}`,
        marca: `${vehiculo.marca}`,
        modelo: `${vehiculo.modelo}`,
        placas: `${vehiculo.placas}`,
        cilindros: `${vehiculo.cilindros}`,
        transmision: `${vehiculo.transmision}`,
        anio: `${vehiculo.anio}`,
        categoria: `${vehiculo.categoria}`,
        color: `${vehiculo.color}`,
        engomado: `${vehiculo.engomado}`,
        no_motor: `${vehiculo.no_motor}`,
        subtotal: 0,
        total: 0,
      }
      await this.realizarOperaciones(cot).then(des=>{
        // console.log(des);
        tempData.subtotal = des['subtotal']
        tempData.total = des['total']
        // if(!tempData['aprobada']) tempData['aprobada'] = ''
        
      })

      const elementos = cot['elementos']
      elementos.map(ele=>{
        const registro = {...tempData,...ele}
        if (ele.tipo !== 'paquete') {
          registro.paquete = ' -- -- --'
          delete registro.IDreferencia
          delete registro.catalogo
          delete registro.id
          delete registro.aprobada
          delete registro.flotilla2
          delete registro.normal
          // console.log(registro);
          
          cotizacionPushIndivuduales.push(registro)

        }else{
          const ele2 = ele['elementos']
          ele2.map(ele2=>{
            const registroEle = {...tempData,paquete:ele2.nombre,...ele2}
            registroEle.paquete = ele2.nombre
              delete registroEle.IDreferencia
              delete registroEle.catalogo
              delete registroEle.id
              delete registroEle.aprobada
              delete registroEle.flotilla2
              delete registroEle.normal
              cotizacionPushIndivuduales.push(registroEle)
          })
        }
      })
      

      cotizacionPush.push(tempData)
      
    })
    setTimeout(()=>{

      // console.log(cotizacionPush);
      // console.log(cotizacionPushIndivuduales);
      
      const worksheetCotizaciones : XLSX.WorkSheet = XLSX.utils.json_to_sheet(cotizacionPush)
      const worksheetindividuales : XLSX.WorkSheet = XLSX.utils.json_to_sheet(cotizacionPushIndivuduales)
  
      const workbook: XLSX.WorkBook = {
        Sheets: {'cotizaciones':worksheetCotizaciones,'individuales':worksheetindividuales},
        SheetNames:['cotizaciones','individuales']
      }
      const excelBuffer:any= XLSX.write(workbook,{bookType:'xlsx',type:'array'})
      //llamar al metodo y su nombre
      this.saveAsExcel(excelBuffer,excelFileName)
    }, 250)
    


    
  }
  async realizarOperaciones(data:any[]){
    // console.log(data);
    
    const desgloce = { UB:'0',mo:0,refacciones_1:0,refacciones_2:0,subtotal:0,iva:0,sobrescrito_mo:0,sobrescrito_refaccion:0,total:0 }
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
      if(ele['tipo'] === 'MO' ) {
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
          if(sub_ele['tipo'] === 'MO' ) {
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
    desgloce.UB = this._publicos.redondeado(((desgloce.total - desgloce.refacciones_1)*100)/desgloce.total)
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
  async exportExcelServicios(data:any){
    const servicios = data
    const cotizacionPush =[]
    const cotizacionPushIndivuduales =[]
    const formasPAgo=[
      {id:1,pago:'contado'},
      {id:2,pago:'3 meses',interes:4.49,numero:'3'},
      {id:3,pago:'6 meses',interes:6.99,numero:'6'},
      {id:4,pago:'9 meses',interes:9.90,numero:'9'},
      {id:5,pago:'12 meses',interes:11.95,numero:'12'},
      {id:6,pago:'18 meses',interes:17.70,numero:'18'},
      {id:7,pago:'24 meses',interes:24.,numero:'24'}
    ]
    const servicioss=[
      {valor:"1",nombre:'servicio'},
      {valor:"2",nombre:'garantia'},
      {valor:"3",nombre:'retorno'},
      {valor:"4",nombre:'venta'},
      {valor:"5",nombre:'preventivo'},
      {valor:"6",nombre:'correctivo'},
      {valor:"7",nombre:'rescate vial'}
    ]
    let ordenados = ['no_os','marca','modelo','anio','subtotal','formaPago','empresa','fecha_recibido','servicio',
    'refacciones1','total','UB','diasSucursal','refacciones2','totalMO','horas','IVA','placas','status','sucursal' ]
    
    const camposPrimarios =  ['diasSucursal','fecha_entregado','hora_entregado','fecha_recibido','hora_recibido','formaPago','no_os','servicio','status']
    const camposDesgloce =  ['IVA','UB','refacciones1','refacciones2','sobrescrito','subtotal','total','totalMO']
    const camposCliente =  ['correo','correo_sec','fullname','no_cliente','telefono_fijo','telefono_movil','tipo','empresa']
    const camposVehiculo =  ['anio','categoria','cilindros','color','engomado','marca','modelo','placas','transmision']
    const camposSucursal =  ['direccion','serie','sucursal','telefono']
    const camposServicios =  ['nombre','tipo']

    const todosCampos = camposPrimarios.concat(camposDesgloce).concat(camposCliente).concat(camposVehiculo).concat(camposSucursal)
    .concat(camposServicios)
    // console.log(servicios);
    
    let recepciones = []
    for (let index = 0; index < servicios.length; index++) {
      const element = servicios[index];
      let toda = {}
      let nuevaPrimarios = {}
      let nuevaDesgloce:any = {}
      let nuevaCliente:any = {}
      let nuevaVehiculo:any = {}
      let nuevaSucursal:any = {}
      let nuevaServicios:any = {}
      await this._publicos.recuperaDataArreglo(camposPrimarios,element).then((Necesaria)=>{
        nuevaPrimarios = {...Necesaria}
      })
      await this._publicos.recuperaDataArreglo(camposDesgloce,element.desgloce).then((Necesaria)=>{
        nuevaDesgloce = {...Necesaria}
        const campos = Object.keys(nuevaDesgloce)
        for (let index = 0; index < campos.length; index++) {
          const element = campos[index];
          if (element !== 'UB') {
            nuevaDesgloce[element] = this._publicos.redondeado(nuevaDesgloce[element])
          }
        }
      })
      await this._publicos.recuperaDataArreglo(camposCliente,element.infoCliente).then((Necesaria)=>{
        nuevaCliente = {...Necesaria}
      })
      await  this._publicos.recuperaDataArreglo(camposVehiculo,element.infoVehiculo).then((Necesaria)=>{
        nuevaVehiculo = {...Necesaria}
      })
      await  this._publicos.recuperaDataArreglo(camposSucursal,element.infoSucursal).then((Necesaria)=>{
        nuevaSucursal = {...Necesaria}
      })
      await  this._publicos.recuperaDataArreglo(camposServicios,element.servicios).then((Necesaria)=>{
        nuevaServicios = {...Necesaria}
      })
      toda = {...nuevaPrimarios,...nuevaDesgloce,...nuevaCliente,...nuevaVehiculo,...nuevaSucursal,...nuevaServicios}
      const temp = Object.keys(toda)
      // recepciones.push(toda)
      let arr = []
      ordenados.forEach(function(item, i) {
        if (toda[item]) {
          if (item === 'formaPago') {
            for (let fp = 0; fp < formasPAgo.length; fp++) {
              const fmps = formasPAgo[fp];
              // console.log(toda[item]);
              if (Number(toda[item])  === Number(fmps.id)) {
                // console.log(item, fmps.pago); 
                toda[item] = fmps.pago            
              }
            }
          }
          if (item === 'empresa') {
            if (!toda[item]) {
              toda[item] = 'particular'
            }
          }
          if (item === 'servicio') {
            // console.log();
            // console.log(toda[item]);
            for (let fp = 0; fp < servicioss.length; fp++) {
              const fmps = servicioss[fp];
              
              if (toda[item]  === fmps.valor) {
                // console.log(item, fmps.pago); 
                toda[item] = fmps.nombre            
              }
            }
          }
         
        }else{
          toda[item] = ''
        }
        

      }); 
      
      // console.log(toda);
      recepciones.push(toda)
    }
    // console.log(recepciones);
    // const filtros = recepciones.filter(o=>o)
    const worksheetCotizaciones : XLSX.WorkSheet = XLSX.utils.json_to_sheet(recepciones)
    const worksheetindividuales : XLSX.WorkSheet = XLSX.utils.json_to_sheet(cotizacionPushIndivuduales)
    const workbook: XLSX.WorkBook = {
      // 'individuales':worksheetindividuales
      Sheets: {'Servicios':worksheetCotizaciones},
      SheetNames:['Servicios']
    }
    
    const excelBuffer:any= XLSX.write(workbook,{bookType:'xlsx',type:'array'})
    //llamar al metodo y su nombre
    // console.log(data);
    
    this.saveAsExcel(excelBuffer,'ReporteServicios')
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
  
}
