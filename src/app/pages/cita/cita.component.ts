import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { getDatabase, ref, update } from 'firebase/database';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

const db = getDatabase()

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css']
})
export class CitaComponent implements OnInit, OnChanges {
  @Input() id_cita:string
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _publicos: ServiciosPublicosService ) { }
  
  data_cita:any={}
  status_cita = [
    {valor: 'confirmada', show:'confirmada'},
    {valor: 'cancelada', show:'cancelada'},
    {valor: 'noConfirmada', show:'no Confirmada'},
    {valor: 'sinConfirmarDomicilio', show:'sin Confirmar Domicilio'},
    {valor: 'concretada', show:'concretada'},
  ]
  ngOnInit(): void {
    if (this.data) {
      this.consulta_data_cita()
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['id_cita']) {
      const nuevoValor = changes['id_cita'].currentValue;
      const valorAnterior = changes['id_cita'].previousValue;
      console.log({nuevoValor,valorAnterior});
      
    }
  }
  consulta_data_cita(){
    const citas = this._publicos.nueva_revision_cache('citas')
    const citas_all_data = this._publicos.contruye_citas(citas)
    if (citas_all_data[this.data]) {
      const data_cita = this._publicos.crear_new_object(citas_all_data[this.data])
      data_cita.id = this.data
      data_cita.show = this.status_cita.find(st=>st.valor === data_cita.status).show
      this.data_cita = data_cita
    }
  }
  change_statusCita(status){
    const {valor, show}= status
    this.data_cita.status = valor
    this.data_cita.show = show
    const updates = {[`citas/${this.data}/status`]: valor}
    update(ref(db), updates).then(()=>{
      // this._publicos.mensajeSwal('cambio el status de la cita',1)
      this._publicos.swalToast('cambio el status de la cita',1)
    })
    .catch(err=>{
      console.log(err);
    })
  }
  

}
