import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { getDatabase, onValue, ref,update } from "firebase/database"
import { SucursalesService } from 'src/app/services/sucursales.service';
import { CamposSystemService } from 'src/app/services/campos-system.service';
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
  
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, private _campos: CamposSystemService, 
    private _security:EncriptadoService,private _sucursales:  SucursalesService) { }

    ROL:string; SUCURSAL:string

    sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]
    listaModulos      =  [ ...this._campos.listaModulos ]

    miniColumnas:number = this._campos.miniColumnas

    tiempoReal:boolean = false
    formProblema:FormGroup
    faltantes = null
    // tabla
    dataSource = new MatTableDataSource(); //elementos
    elementos = ['id','sucursalShow','fecha_registro','hora_registro','revisado','resuelto','status']; //elementos
    columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
    expandedElement: any | null; //elementos
    @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
    @ViewChild('elements') sort: MatSort //elementos
  
    ordenarproblema: boolean = true
    id_registro_fix:string = null

  ngOnInit(): void {
    this.rol()
    this.crearFormulario()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    
    this.consultaErrores()
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
          this._publicos.swalToast('Registro de problema correcto', 1)
        })
        .catch(err=>{
          this._publicos.swalToast('Error al registrar problema', 0)
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
            const {sucursal} = this.sucursales_array.find(s=>s.id === p.sucursal)
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
