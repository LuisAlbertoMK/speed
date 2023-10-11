import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';



import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { SucursalesService } from 'src/app/services/sucursales.service';
import { MetasSucursalService } from '../../services/metas-sucursal.service';
import { AutomaticosService } from 'src/app/services/automaticos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-registra-objetivo',
  templateUrl: './registra-objetivo.component.html',
  styleUrls: ['./registra-objetivo.component.css']
})
export class RegistraObjetivoComponent implements OnInit {

  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, private _sucursales: SucursalesService, 
     private _automaticos: AutomaticosService, private _security: EncriptadoService) { }

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
    console.log(get_data);
    const metas_sucursales = this._publicos.nueva_revision_cache('metas_sucursales')
    const {sucursal, mes, objetivo} = this._publicos.crear_new_object(get_data)
    

    const fecha = new Date()
    const year:number = fecha.getFullYear()
    // const fecha_registro = new Date(year, mes, 1)
    // console.log(fecha_registro);

    const fecha_registro  = this._publicos.retorna_fechas_hora({fechaString: new Date(year, mes, 1)}).toString
    // console.log(fecha_registro);

    const filtra_metas_sucursales = this._publicos.filtrarObjetoPorPropiedad(metas_sucursales, 'sucursal',sucursal)

    const filtro_fechas_metas_sucursales = this._publicos.filtrarObjetoPorPropiedad_fecha(filtra_metas_sucursales, fecha_registro, fecha_registro)
    console.log(filtro_fechas_metas_sucursales);
    const updates = {}
    const claves = Object.keys(filtro_fechas_metas_sucursales)
    let existe:boolean = false
    let objetivo_actual:number = 0
    let nueva_clave_generada:string 
    if (claves.length ) {
      for (const clave in filtro_fechas_metas_sucursales) {
        const {objetivo: actual} = filtro_fechas_metas_sucursales[clave]
        objetivo_actual = actual
        updates[`metas_sucursales/${clave}/objetivo`] = objetivo
      }
    }else{
      console.log('registra nueva meta GENERA_nueva_clave');
      nueva_clave_generada = this._publicos.generaClave()
      updates[`metas_sucursales/${nueva_clave_generada}`]= {
        sucursal,
        fecha_recibido: fecha_registro,
        objetivo
      }
    }
    if (existe) {
      let mensaje = objetivo_actual > 0 ?  `, Existe un objetivo en el mes ${this.meses[mes]} de ${objetivo_actual} reemplazar ...` : ``
      const {respuesta} = await this._publicos.mensaje_pregunta_2({
        mensaje:`Registrar objetivo de ${this.meses[mes]}`,
        html: `Objetivo del mes $ ${objetivo} ${mensaje} `
      })
      if (respuesta) {
        update(ref(db), updates).then(()=>{
          this._publicos.swalToast(`Se registro objetivo de ${this.meses[mes]}`,1)
          this.formulario_reset()
        })
        .catch(err=>{
          console.log(err);
          this._publicos.swalToast(`Error al registrar`, 0)
        })
      }
    }else{
      let claves_encontradas:any[] = await this._automaticos.consulta_ruta('claves_metas_sucursales')
      // const arreglo_claves_encontradas = this._publicos.crearArreglo2(claves_encontradas)
      if (!claves_encontradas.length)  claves_encontradas = []
      const valorNoDuplicado = await [...new Set([...claves_encontradas, nueva_clave_generada])];
      updates['claves_metas_sucursales'] = valorNoDuplicado
      update(ref(db), updates).then(()=>{
        this._security.guarda_informacion({nombre:'claves_metas_sucursales', data: valorNoDuplicado})
        this._publicos.swalToast(`Se registro objetivo de ${this.meses[mes]}`,1)
        this.formulario_reset()
      })
      .catch(err=>{
        console.log(err);
        this._publicos.swalToast(`Error al registrar`, 0)
      })
    }
    console.log(updates);
    this._publicos.saber_pesos(updates)
  }
  validarCampo(campo: string){
    return this.form_objetivo.get(campo).invalid && this.form_objetivo.get(campo).touched
  }
  formulario_reset(){
    this.form_objetivo.reset();
  }
  

}
