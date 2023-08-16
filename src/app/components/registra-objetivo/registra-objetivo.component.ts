import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';



import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { SucursalesService } from 'src/app/services/sucursales.service';
import { MetasSucursalService } from '../../services/metas-sucursal.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-registra-objetivo',
  templateUrl: './registra-objetivo.component.html',
  styleUrls: ['./registra-objetivo.component.css']
})
export class RegistraObjetivoComponent implements OnInit {

  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, private _sucursales: SucursalesService, 
    private _metas: MetasSucursalService) { }

  sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]

  form_objetivo: FormGroup

  faltante_s:string

  meses =  ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ];

  ngOnInit(): void {
    this.crearFormulario_objetivo()
  }
  crearFormulario_objetivo(){
    this.form_objetivo = this.fb.group({

      sucursal:['',[Validators.required]],
      mes:['',[Validators.required,Validators.minLength(1), Validators.maxLength(2)]],
      objetivo:['',[Validators.required,Validators.minLength(1), Validators.min(1), Validators.maxLength(10)]],

    })
  }
  async registraObjetivo(){
    const get_data = this._publicos.getRawValue(this.form_objetivo)
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(get_data, ['sucursal','mes','objetivo'])
    this.faltante_s = faltante_s
    if (!ok) return
    // console.log(get_data);
    const {mes, objetivo, sucursal}= get_data
    const fecha = new Date()
    const year = fecha.getFullYear()

    const ruta = `metas_sucursales/${sucursal}/${year}/${mes}`
    const registro =  await this._metas.consulta_registro_meta_mes({ruta})
    
    let mensaje = registro > 0 ?  `, Existe un objetivo en el mes ${this.meses[mes]} de ${registro} reemplazar ...` : ``
    const {respuesta} = await this._publicos.mensaje_pregunta_2({
      mensaje:`Registrar objetivo de ${this.meses[mes]}`,
      html: `Objetivo del mes $ ${objetivo} ${mensaje} `
    })

    if (respuesta) {
    
      const updates = {};
      updates[ruta] = objetivo;
      // console.log(updates);
      update(ref(db), updates).then(()=>{
        this._publicos.swalToast(`Se registro objetivo de ${this.meses[mes]}`,1)
        this.formulario_reset()
      })
      .catch(err=>{
        console.log(err);
        this._publicos.swalToast(`Error al registrar`, 0)
      }) 
    }else{
      this._publicos.swalToast(`No se registro`,0)
    }
  }
  validarCampo(campo: string){
    return this.form_objetivo.get(campo).invalid && this.form_objetivo.get(campo).touched
  }
  formulario_reset(){
    this.form_objetivo.reset();
  }
  

}
