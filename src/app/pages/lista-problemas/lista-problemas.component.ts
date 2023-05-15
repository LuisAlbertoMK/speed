import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-lista-problemas',
  templateUrl: './lista-problemas.component.html',
  styleUrls: ['./lista-problemas.component.css'],
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
export class ListaProblemasComponent implements OnInit {
  miniColumnas:number = 100
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
  ROL:string; SUCURSAL:string

  tiempoReal:boolean = false
  sucursales_arr=[]

  formProblema:FormGroup
  faltantes = null


  // tabla
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['id','sucursalShow','fecha_registro','hora_registro','revisado','resuelto','status']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos

  problemas = {
    problemas_11042023: 
    [
        {problema:'Que se puedan agregar flotillas solo desde super usuario', status:'OK'},
        {problema:'Revisar filtro en cotizaciones (búsqueda)', status:'OK'},
        {problema:'Revisar ordenamiento en servicios', status:'OK'},
        {problema:'Colores en check listo de servicios confirmar colores rojo y verde ', status:'OK'},
        {problema:'Mostrar más información en cotizaciones como en servicios', status:'OK'},
        {problema:'Cambiar iconos de layerplus en servicios por una flecha down', status:'OK'},
        {problema:'Recuperar el cambio en expectativa y realidad en servicios', status:'OK'},
        {problema:'En kilometraje meter solo números aceptados', status:'PENDIENTE EN PLATAFORMA'},
        {problema:'previsualizar pdf en remision / factura', status:'PENDIENTE'},
        {problema:'Revisar las ub en servicios', status:'PENDIENTE'},
        {problema:'Mostrar las imágenes de detalles locales en servicios ', status:'PENDIENTE'},
        {problema:'Regresar exactamente a cómo estabas en la página anterior en servicios', status:'PENDIENTE'}
    ],
     problemas_18042023:
    [
        {problema:'en pdf de cotizacio no muestra los nombres de los elementos', status:'PENDIENTE'},
        {problema:'revisar la informacion de las sumas en entrega de recepcion', status:'PENDIENTE'},
    ],
    problemas_24042023: 
    [
        {problema:'los clientes no s muestran en la tabla clientes', status:'PENDIENTE'},
        {problema:'Imagen personalizado no aparece', status:'OK'},
        {problema:'orden no carga o no se genera pdf', status:'OK'},
        {problema:'que se vena reflejado todos los reporte de gastos', status:'OK'},
        {problema:'tache para cerrar ventana de gastos', status:'OK'},
        {problema:'ser mas claro que es un gasto eliminado', status:'OK'},
        {problema:'indicar si es gasto o deposito', status:'OK'},
        {problema:'numero de orden en reporte de gasto', status:'OK'},
        {problema:'referencia en gasto de operacion', status:'OK'},
        {problema:'quitar referencia en pago', status:'OK'},
    ],
    problemas_02052023: 
    [
        {problema:'REVISAR PORQUE NO APARECEN LOS GASTOS DE O.S ', status:'OK'},
        {problema:'monto total de ventas, aparaezacan los totales de ordenes', status:'PENDIENTE'},
        {problema:'gastos totales de operacion', status:'PENDIENTE'},
        {problema:'monto total de iva', status:'PENDIENTE'},
        {problema:'(desgloce subtotal, iva, total)', status:'PENDIENTE'},
        {problema:'CUANTO QUEDa LIBRE DEdespues de refacciones sobre el subtotal de ventas', status:'PENDIENTE'},
        {problema:'cuanto queda libre despues de monto de operaciones y refacciones sobre el subtotal de ventas solo entregadas', status:'PENDIENTE'},
    ],
    problemas_03052023: 
    [
        {problema:'Determinar el rango de fechas por el cual se buscara', status:'PENDIENTE'},   
    ],
    problemas_08052023: 
    [
        {problema:'Filtrar recepciones por sucursal y status', status:'PENDIENTE'},   
    ],
    problemas_09052023: 
    [
        {problema:'Revisar administracion y reporte de gastos', status:'PENDIENTE'},   
    ],
    problemas_10052023: 
    [
        {problema:'Realizar micro modulo administracion', status:'PENDIENTE'},   
        {problema:'Mostrar formularios de gasto y pago', status:'PENDIENTE'},   
        {problema:'Realizar micro reporte de gastos', status:'PENDIENTE'},   
        {problema:'Arreglar el formulario de gastos', status:'PENDIENTE'},   
    ],
    problemas_11052023: 
    [
        {problema:'Registrar el sobrante del dia de hoy para mañana', status:'PENDIENTE'},   
        {problema:'verificar los datos ', status:'PENDIENTE'},   
        {problema:'terminar modulo de reporte de problemas en plataforma ', status:'PENDIENTE'},   
    ],
    problemas_12052023: 
    [
        {problema:'Agregar ticket promedio, tiempo de estancia, y otros ocupados en servicios', status:'PENDIENTE'},
    ],
    problemas_15052023: 
    [
        {problema:'Verificar si es dia cero o domingo en reporte diario', status:'PENDIENTE'},
    ]
  }


// git add .
// git commit -m "problemas_15052023"
// git push -u origin main

  ordenarproblema: boolean = true
  id_registro_fix:string = null
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService,) { }

  ngOnInit(): void {
    this.rol()
    this.crearFormulario()
    this.consultaErrores()
    // this.realizarCOn()
  }
  rol(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      this.ROL = this._security.servicioDecrypt(variableX['rol'])
      this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
      // this.acciones()
      const starCountRef = ref(db, `sucursales`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            this.sucursales_arr = this._publicos.crearArreglo2(snapshot.val())
          }
        }, {
          onlyOnce: !this.tiempoReal
        })
      // this.acciones()
    }
    // console.log(this.problemas);
    
  }

  realizarCOn(){
    // console.log(this.problemas);
    // console.log(Object.keys(this.problemas));
    let vacios = []
    const updates = {}
    Object.keys(this.problemas).forEach(p=>{
      const nuevaClave = p.split('problemas_')[1]
      // console.log(nuevaClave);
      const arr = this.problemas[p]
      arr.forEach(element => {
        const tempData = {
          modulo: '',
          detalles: element.problema,
          fecha_registro: this._publicos.formatearFecha(convertirFecha(nuevaClave),true),
          hora_registro: this._publicos.getFechaHora().hora,
          resuelto: false,
          revisado: false,
          status: 'pendiente',
        }
        updates[`problemasPlataforma/desarrollador/${this._publicos.generaClave()}`] = tempData;
        vacios.push(tempData)
      });
      
    })
    function convertirFecha(fechaString) {
      const dia = parseInt(fechaString.slice(0, 2));
      const mes = parseInt(fechaString.slice(2, 4)) - 1; // Restamos 1 ya que los meses en JavaScript son indexados desde 0 (enero es 0)
      const anio = parseInt(fechaString.slice(4, 8));
      
      return new Date(anio, mes, dia);
    }
    
    update(ref(db), updates);
  }
  crearFormulario(){
    const sucursal = (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL
    this.formProblema = this.fb.group({
      modulo:['',[Validators.required]],
      detalles:['',[Validators.required,Validators.minLength(5)]],
      sucursal:[sucursal,[Validators.required]],
    })
  }
  validaCampo(campo: string){
    return this.formProblema.get(campo).invalid && this.formProblema.get(campo).touched
  }
  registroProblema(){
    const {valida, faltantes} = this.validaciones()
    this.faltantes = (valida) ? null : faltantes
    if(valida){
      const {modulo, detalles, sucursal} = this.formProblema.value
      const {show} = this.listaModulos.find(f=>f.valor === modulo)
      const tempData = {
        modulo,
        detalles,
        sucursal,
        fecha_registro: this._publicos.formatearFecha(new Date(),true),
        hora_registro: this._publicos.getFechaHora().hora,
        resuelto: false,
        revisado: false,
        status: 'pendiente'
      }
      // console.log(tempData);
      const updates = { [`problemasPlataforma/${sucursal}/${this._publicos.generaClave()}`] : tempData }
      // console.log(updates);
      
        update(ref(db), updates).then(()=>{
          const sucursal = (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL
          this.formProblema.reset({sucursal})
          this._publicos.swalToast('Registro de problema correcto')
        })
        .catch(err=>{
          this._publicos.swalToastError('Error al registrar problema')
        })
    }
  }
  validaciones(){
    const valoresForm = this.formProblema.value
    const necesarios = ['modulo','detalles','sucursal']
    let answer = {valida: true, faltantes:''}
    let faltantes = []
    necesarios.forEach(f=>{
      if(!valoresForm[f]) {
        faltantes.push(f)
        answer.valida = false
      }
    })
    answer.faltantes = faltantes.join(', ')
    return answer
  }
  consultaErrores(){
    const starCountRef = ref(db, `problemasPlataforma`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const problemas = snapshot.val();
        let nuevosD = [];
        Object.keys(problemas).forEach(c => {
          const clavesP = this._publicos.crearArreglo2(problemas[c]);
          nuevosD = nuevosD.concat(clavesP);
        });
        
        nuevosD.forEach((p, index) => {
          p.index = index;
          if(p.sucursal && p.sucursal !=='desarrollador'){
            const {sucursal} = this.sucursales_arr.find(s=>s.id === p.sucursal)
            p.sucursalShow = sucursal
          }else{
            p.sucursalShow  = 'desarrollador'
            p.sucursal = 'desarrollador'
          }
          p.fecha_compara = this._publicos.construyeFechaString(p.fecha_registro, p.hora_registro)
        });
        
        this.dataSource.data = nuevosD
        // this.newPagination()
        this.ordenarproblema = false
        this.ordenamiento('fecha_compara')
      }
    })
  }
  infoProblema(data,donde:string){
    const valor = !data[donde]
    data[donde] = valor
    setTimeout(() => {
      const updates = {}
      updates[`problemasPlataforma/${data.sucursal}/${this.id_registro_fix}/${donde}`] = valor;
      if (!valor) {
        updates[`problemasPlataforma/${data.sucursal}/${this.id_registro_fix}/status`] = 'pendiente';
      } else if (data.revisado && data.resuelto) {
        updates[`problemasPlataforma/${data.sucursal}/${this.id_registro_fix}/status`] = 'terminado';
      } 
      update(ref(db), updates);
    }, 200);

  }
  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }, 300)
  }
  ordenamiento(campo:string){
    const nueva = [...this.dataSource.data];
    this.dataSource.data = this._publicos.ordenarData(nueva, campo, this.ordenarproblema);
    this.newPagination()
  }
}
