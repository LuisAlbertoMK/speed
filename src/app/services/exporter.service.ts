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
  generaReporteGastosExcel(data){
    const {arreglo, data_reporte_general, data_reporte_facturas, data_reporte_notas, filtro_facturas, filtro_notas} = data
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
        placas,
        gasto_tipo,
        status_orden
      } = r
      const temp_colocar = {
        'no O.S': no_os, 
        'Sucursal': sucursal, 
        'descripcion servicio': descripcion,
        'Fecha registro': this.transform_fecha(fecha_recibido, true), 
        'Referencia': referencia,
        'Concepto': concepto,
        'Marca': marca,
        'Modelo': modelo,
        'Placas': placas,
        'nota / factura': facturaRemision,
        'metodo pago': metodo, 
        'Monto': monto,
        'Status': status,
        'Gasto tipo': gasto_tipo,
        'Tipo': tipo,
        'Status orden': status_orden,
      }
      colocada.push({ ...lieneaBlanca, ...temp_colocar });

    })

    let nuevo___ = 
    [
      {
          "no_os": "CU0123GE00007",
          "sucursal": "Culhuacán",
          "descripcion": "cambio de aceite y filtro",
          "fecha_recibido": "Thu Jul 27 2023 17:32:11 GMT-0600 (GMT-06:00)",
          "referencia": "asdsad",
          "concepto": "asdas",
          "marca": "Infiniti",
          "modelo": "QX30",
          "placas": "abc123",
          "facturaRemision": "nota",
          "metodo": "Cheque",
          "monto": 22,
          "status": "aprobado",
          "tipo": "orden",
          "gasto_tipo": "refaccion",
          "status_orden": "recibido"
      },
      {
          "no_os": "CU0123GE00008",
          "sucursal": "Culhuacán",
          "descripcion": "cambio de focos fundidos convencionales",
          "fecha_recibido": "Thu Jul 27 2023 17:29:08 GMT-0600 (GMT-06:00)",
          "referencia": "64545",
          "concepto": "1212121",
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "placas": "1540wc",
          "facturaRemision": "factura",
          "metodo": "Efectivo",
          "monto": 1212,
          "status": "aprobado",
          "tipo": "orden",
          "gasto_tipo": "refaccion",
          "status_orden": "recibido"
      },
      {
          "no_os": "",
          "sucursal": "Culhuacán",
          "descripcion": "",
          "fecha_recibido": "Thu Jul 27 2023 16:24:03 GMT-0600 (GMT-06:00)",
          "referencia": "",
          "concepto": "cubrie  los 1995",
          "marca": "",
          "modelo": "",
          "placas": "",
          "facturaRemision": "",
          "metodo": "Efectivo",
          "monto": 1000,
          "status": "aprobado",
          "tipo": "deposito",
          "gasto_tipo": "",
          "status_orden": ""
      },
      {
          "no_os": "",
          "sucursal": "Culhuacán",
          "descripcion": "",
          "fecha_recibido": "Thu Jul 27 2023 16:00:01 GMT-0600 (GMT-06:00)",
          "referencia": "dfgdfg",
          "concepto": "dfgdfgdf",
          "marca": "",
          "modelo": "",
          "placas": "",
          "facturaRemision": "factura",
          "metodo": "Efectivo",
          "monto": 388,
          "status": "aprobado",
          "tipo": "operacion",
          "gasto_tipo": "",
          "status_orden": ""
      }
  ]

    function lineas_blancas(numero){
      for (let index = 0; index < numero; index++) {
        colocada.push({ ...lieneaBlanca });
      }
    }
    lineas_blancas(3)

    
    const nuevos_ = [['deposito','subtotal'],['sobrante','iva'], ['operacion','total'], ['orden',''],['restante','']]

    // console.log(data_reporte_general['sobrante']);
    // data_reporte_general.sobrante = -2000.445675756
    nuevos_.forEach((g, index)=>{
      const [campo, valor] = g

      const campo_v = this.transform_monedas(data_reporte_general[campo])
      const valor_  = this.transform_monedas(data_reporte_facturas[valor])
      let mu = {
        ...lieneaBlanca,
        'Marca': `${valor} facturas`,
        'Modelo': `${valor_}`,
        'nota / factura': `${valor} notas`,
        'metodo pago': `${valor_}`,
        'Fecha registro': `${campo}`, 
        'Referencia': campo_v,
      }
      if (campo === 'orden' || campo === 'restante') {
        mu = {
            ...mu,
            'Marca': ``,
            'Modelo': ``,
            'nota / factura': ``,
            'metodo pago': ``,
          }
      }
      colocada.push(mu);

    })

    lineas_blancas(3)
    
    const worksheetenviar_totales_orden : XLSX.WorkSheet = XLSX.utils.json_to_sheet(colocada)

    const columnWidthsenviar_totales_orden = [
      { wch: 20 }, { wch: 10 }, { wch: 25 },{ wch: 15 },
      { wch: 25 }, { wch: 25 }, { wch: 15 },{ wch: 15 },
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


