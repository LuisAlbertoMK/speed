import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CamposSystemService {

  constructor() { }

  miniColumnas:number = 100

  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

  promociones=['ninguna','facebook','cartelera','instagram','radio']; 

  coloresPluma= [
    {show:'Negro', color:'#010101'},
    {show:'Azul', color:'#444BF2'},
    {show:'Amarillo', color:'#C9D612'},
    {show:'Naranja', color:'#FFA30A'},
    {show:'Rojo', color:'#F30F05'},
    {show:'Verde', color:'#3DD400'},
  ]

  listaModulos= [
    { valor:'1', show:'inicio', ruta: 'inicio'},
    { valor:'2', show:'catalogos', ruta: 'catalogos'},
    { valor:'3', show:'citas', ruta: 'citas'},
    { valor:'4', show:'clientes', ruta: 'clientes'},
    { valor:'5', show:'cotizacion', ruta: 'cotizacion'},
    { valor:'6', show:'sucursales', ruta: 'sucursales'},
    { valor:'7', show:'vehiculos', ruta: 'vehiculos'},
    { valor:'8', show:'administracion', ruta: 'administracion'},
    { valor:'9', show:'servicios', ruta: 'servicios'},
    { valor:'10', show:'usuarios', ruta: 'usuarios'},
    { valor:'11', show:'recordatorios', ruta: 'recordatorios'},
    { valor:'12', show:'historial', ruta: 'historial-vehiculo/:idvehiculo'},
    { valor:'13', show:'historial', ruta: 'historial-cliente/:rutaAnterior/:idCliente'},
    { valor:'14', show:'cotizacionNueva', ruta: 'cotizacionNueva/:ID/:tipo/:extra'},
    { valor:'15', show:'vehiculos', ruta: 'vehiculos/:rutaAnterior/:accion'},
    { valor:'16', show:'Servicios Confirmar', ruta: 'ServiciosConfirmar/:ID/:tipo/:extra'},
    { valor:'17', show:'modifica Recepcion', ruta: 'modificaRecepcion/:rutaAnterior/:idRecepcion'},
    { valor:'18', show:'login', ruta: 'loginv1'},
    { valor:'19', show:'reporte Gastos', ruta: 'reporteGastos'},
    { valor:'20', show:'registra Problemas', ruta: 'registraProblemas'},
  ]
  MetodosPago = [
    {metodo:1, show:'Efectivo'},
    {metodo:2, show:'Cheque'},
    {metodo:3, show:'Tarjeta'},
    {metodo:4, show:'Transferencia'},
  ]
  anios=  [ 1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023 ]
  
  campos_elemento_mo = ['id','descripcion','nombre','precio','status','tipo']
  campos_elemento_refacciones = [...this.campos_elemento_mo,'marca','modelo']
  campos_elemento_paquetes = ['id','aprobado','cantidad','cilindros','costo','elementos','enCatalogo','marca','modelo','nombre','status','precio','reporte','tipo','total'
  ]

  campos_reeemplza = [
    {campos:'cliente', reemplaza:'Cliente'},
    {campos:'sucursal', reemplaza:'Sucursal'},
    {campos:'servicios', reemplaza:'Servicios'},
    {campos:'vehiculo', reemplaza:'Vehiculo'},
    {campos:'firma_cliente', reemplaza:'Firma cliente'},
    {campos:'fecha_promesa', reemplaza:'Fecha promesa'},
    {campos:'no_cliente', reemplaza:'# Cliente'},
    {campos:'telefono_movil', reemplaza:'Tel. movil'},
    {campos:'telefono_fijo', reemplaza:'Tel. fijo'},
    {campos:'nombre', reemplaza:'Nombre'},
    {campos:'apellidos', reemplaza:'Apellidos'},
    {campos:'tipo', reemplaza:'Tipo'},
    {campos:'correo_sec', reemplaza:'Correo'},
    {campos:'empresa', reemplaza:'Empresa'},
    {campos:'correo', reemplaza:'Correo'},
    {campos:'elementos', reemplaza:'Elementos'},
    {campos:'servicios', reemplaza:'Servicios'},
    {campos:'descripcion', reemplaza:'Descripcion'},
    {campos:'no_os', reemplaza:'# O.S'},
    {campos:'monto', reemplaza:'Monto'},
    {campos:'metodo', reemplaza:'Metodo'},
    {campos:'concepto', reemplaza:'Concepto'},
    {campos:'referencia', reemplaza:'Referencia'},
    {campos:'fecha', reemplaza:'Fecha'},
    {campos:'gasto_tipo', reemplaza:'Tipo Gasto'},
    {campos:'facturaRemision', reemplaza:'Factura Remision'},
    {campos:'cantidad', reemplaza:'Cantidad'},
    {campos:'precio', reemplaza:'Precio'},
    {campos:'costo', reemplaza:'Costo'},
    {campos:'marca', reemplaza:'Marca'},
    {campos:'status', reemplaza:'Status'},
    {campos:'dia', reemplaza:'Dia'},
    {campos:'horario', reemplaza:'Horario'},
    {campos:'servicio', reemplaza:'Servicio'},
    {campos:'comentario', reemplaza:'Comentario'},
    {campos:'cotizacion_utiliza', reemplaza:'Cotizacion utiliza'},
    {campos:'cotizacion', reemplaza:'Cotizacion'},
    {campos:'recoleccion', reemplaza:'Recoleccion'},
    {campos:'direccion', reemplaza:'Direccion'},
    {campos:'placas', reemplaza:'Placas'},
    {campos:'vinChasis', reemplaza:'Vin Chasis'},
    {campos:'modelo', reemplaza:'Modelo'},
    {campos:'categoria', reemplaza:'Categoria'},
    {campos:'anio', reemplaza:'Año'},
    {campos:'cilindros', reemplaza:'Cilindros'},
    {campos:'no_motor', reemplaza:'No. motor'},
    {campos:'color', reemplaza:'Color'},
    {campos:'engomado', reemplaza:'Engomado'},
    {campos:'marcaMotor', reemplaza:'Marca motor'},
    {campos:'transmision', reemplaza:'Transmision'},
  ]
}
