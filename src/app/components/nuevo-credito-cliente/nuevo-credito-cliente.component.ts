import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getDatabase, ref, update } from 'firebase/database';
import { ClientesService } from 'src/app/services/clientes.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';


const db = getDatabase()

@Component({
  selector: 'app-nuevo-credito-cliente',
  templateUrl: './nuevo-credito-cliente.component.html',
  styleUrls: ['./nuevo-credito-cliente.component.css']
})
export class NuevoCreditoClienteComponent implements OnInit, OnChanges {

  @Input() data_cliente_credito:any   

  form_credito: FormGroup;
  

  meses =  ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ];
  
  id_cliente:string 
  faltante_s:string
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, private _clientes: ClientesService) { }

  ngOnInit(): void {
    this.crear_formulario_credito()
    // console.log('aqui');
    
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log('aqui changes');
    if (changes['data_cliente_credito']) {
      const nuevoValor = changes['data_cliente_credito'].currentValue;
      const valorAnterior = changes['data_cliente_credito'].previousValue;
      const {id} = JSON.parse(JSON.stringify(nuevoValor));
      if (id) this.id_cliente = id
      this.vigila()
    }
  }
  crear_formulario_credito(){
    // console.log('creacion formulario');
    
    this.form_credito = this.fb.group({
      id:['',[]],
      id_cliente:['',[Validators.required]],
      mes:[,[Validators.required]],
      credito:['',[Validators.required, Validators.min(1)]],
    })
    this.vigila()
  }
  vigila(){
    // console.log('asiganacion valores formulario');
    
    if (this.id_cliente) {
      // console.log('existencia id_cliente', this.id_cliente);
      
      this.form_credito.get('id_cliente').setValue(this.id_cliente)
    }
  }
  validaCampo(campo: string){
    return this.form_credito.get(campo).invalid && this.form_credito.get(campo).touched
  }
  async registra_credito(){
    const info_formulario =  this._publicos.getRawValue(this.form_credito)
    // console.log(info_formulario);

    const campos = ['id_cliente','mes','credito']

    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(info_formulario,campos)
    this.faltante_s = faltante_s

    if (!ok) return
    
    const path_save = `creditos_clientes`

    const updates = {}

    const { mes, id_cliente, credito }= info_formulario
    const clave_credito = genera_clave(this.data_cliente_credito, mes)
    console.log(clave_credito);

    let save_info={
      cliente: id_cliente,
      credito,
      mes: parseInt(mes)
    }

    const existe_credito = await this._clientes.consulta_credito_cliente(clave_credito)
    console.log(existe_credito);
    
    if (existe_credito) {
      console.log('existe el registro de credito preguntar si quiere reempkazar');
      const {respuesta}= await this._publicos.mensaje_pregunta_2({mensaje:`existe el registro`, allowOutsideClick: true, html:'Reemplzar'})
      console.log(respuesta);
      
    }else{
      updates[`${path_save}/${clave_credito}`] = save_info
      // console.log(updates);
      update(ref(db), updates).then(()=>{
        this._publicos.mensajeSwal('Se registro el credito',1)
      })
      .catch(err=>{
        console.log(err);
      })
    }

    

    
    
    
    function genera_clave(data, mes){
      const fecha = new Date()
      const anio = fecha.getFullYear()
      const {no_cliente}  = JSON.parse(JSON.stringify(data));
      const nuevomes= mes.toString() //.padStart(4, '0');
      return `${no_cliente}-${nuevomes}-${anio}`
    }
    
  }
  

}
