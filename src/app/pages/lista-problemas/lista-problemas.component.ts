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
import { SucursalesService } from 'src/app/services/sucursales.service';
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

 
// git add .
// git commit -m "problemas_15052023"
// git push -u origin main

  ordenarproblema: boolean = true
  id_registro_fix:string = null
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService,private _sucursales:  SucursalesService) { }

  ngOnInit(): void {
    this.rol()
    this.crearFormulario()
  }
  rol(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      this.ROL = this._security.servicioDecrypt(variableX['rol'])
      this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

      this._sucursales.consultaSucursales_new().then((sucursales) => {
        this.sucursales_arr = sucursales
        this.consultaErrores()
      }).catch((error) => {
        // Manejar el error si ocurre
      });
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
          if(p.modulo){
            const { show, ruta } = this.listaModulos.find(m=>m.valor === p.modulo)
            p.moduloShow = show
            p.ruta = ruta
          }else{
            
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
