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
  elementos = ['id','no_os','searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService,) { }

  ngOnInit(): void {
    this.rol()
    this.crearFormulario()
    this.consultaErrores()
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
        const problemas = this._publicos.crearArreglo2(snapshot.val())
        problemas.map((p,index)=>{
          p.index = index
        })
        console.log(problemas);
        
        this.dataSource.data = problemas
        this.newPagination()
      }
    })
  }
  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }, 300)
  }

}
