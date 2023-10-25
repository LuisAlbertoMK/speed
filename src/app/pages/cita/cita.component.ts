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
  contruye(citas){
    const camposServicios = [
      {valor:'1',nombre:'servicio'},
      {valor:'2',nombre:'garantia'},
      // {valor:'3',nombre:'retorno'},
      // {valor:'4',nombre:'venta'},
      {valor:'5',nombre:'preventivo'},
      // {valor:'6',nombre:'correctivo'},
      {valor:'7',nombre:'rescate vial'},
      {valor:'8',nombre:'frenos'},
      {valor:'9',nombre:'afinación'},
      {valor:'10',nombre:'cambio de aceite'},
      {valor:'11',nombre:'revisión general'},
      {valor:'12',nombre:'revisión de falla'},
      {valor:'13',nombre:'escaneo vehículo'},
    ]
    const nuevas_citas = {}
    const clientes = this._publicos.nueva_revision_cache('clientes')
    const vehiculos = this._publicos.nueva_revision_cache('vehiculos')
    const sucursales = this._publicos.nueva_revision_cache('sucursales')
    Object.keys(citas).forEach(cita=>{
      const {id, cliente, vehiculo, sucursal, servicio} = citas[cita]
      const data_cliente = clientes[cliente]
      const fullname = `${data_cliente.nombre} ${data_cliente.apellidos}`
      data_cliente.fullname = fullname
      data_cliente.id = cliente
      const data_vehiculo = vehiculos[vehiculo]
      data_vehiculo.id = vehiculo
      const data_sucursal = sucursales[sucursal]
      data_sucursal.id = sucursal
      
      const servicio_show = camposServicios.find(ser=>ser.valor === servicio).nombre
      nuevas_citas[cita] = {...citas[cita], data_cliente, data_vehiculo, data_sucursal, servicio_show}
    })
    return nuevas_citas
  }
  consulta_data_cita(){
    const citas = this._publicos.nueva_revision_cache('citas')
    const citas_all_data = this.contruye(citas)
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
