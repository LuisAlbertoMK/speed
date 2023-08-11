import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from 'src/app/services/clientes.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { EmpresasService } from 'src/app/services/empresas.service';
import { switchMap } from 'rxjs/operators';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-cliente-tarjeta',
  templateUrl: './cliente-tarjeta.component.html',
  styleUrls: ['./cliente-tarjeta.component.css']
})
export class ClienteTarjetaComponent implements OnInit, OnChanges {

  constructor(private _clientes: ClientesService, private fb: FormBuilder, private _publicos:  ServiciosPublicosService,
    private _empresas: EmpresasService) { }
    

  @Input() cliente:any = null
  @Input() editar:boolean  = false

  camposCliente    =  [ ...this._clientes.camposCliente_show ]

  form_cliente: FormGroup;


  data_pendiente
  correos_existentes= []
  correo_invalido: boolean = false

  empresasSucursal= []
  ngOnInit(): void {
    this.correos_ocupados_consulta()
    this.crearFormularioClientes()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['cliente']) {
      const nuevoValor = changes['cliente'].currentValue;
      const valorAnterior = changes['cliente'].previousValue;
      if (!this.form_cliente) {
        // this.data_pendiente = JSON.parse(JSON.stringify(nuevoValor));
      } else{
        this.carga_data_editar(JSON.parse(JSON.stringify(nuevoValor)))
      }
    }
  }

  correos_ocupados_consulta(){
    const starCountRef = ref(db, `correos`)
    onValue(starCountRef, (snapshot) => {
      this.correos_existentes = (snapshot.exists()) ? snapshot.val() : []
    })
  }
  crearFormularioClientes(){
    this.form_cliente = this.fb.group({
      uid:['',[]],
      no_cliente:['',[Validators.required,Validators.minLength(14), Validators.maxLength(14)]],
      nombre:['',[Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      apellidos:['',[Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      correo:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      correo_sec:['',[Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      telefono_fijo:['',[Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^[0-9]+$")]],
      telefono_movil:['',[Validators.required,Validators.minLength(3), Validators.maxLength(10),Validators.pattern("^[0-9]+$")]],
      tipo:['',[Validators.required]],
      sucursal:['',[Validators.required]],
      empresa:['',[]]
    })
    this.vigila()
  }
  vigila(){
    if (this.form_cliente) {
      this.form_cliente.get('correo').valueChanges.subscribe((correo: string)=>{
        const correo_compara = String(correo).toLowerCase()
        const correoExistente = this.correos_existentes.find(c=>String(c) === correo_compara)
        this.correo_invalido = !!correoExistente;
      })
      this.form_cliente.get('sucursal').valueChanges.pipe(
        switchMap(async (sucursal: string) => {
          if (sucursal) {
            this.empresasSucursal = await this._empresas.consulta_empresas(sucursal);
          }
        })
      ).subscribe();
      this.form_cliente.get('tipo').valueChanges.subscribe(async (tipo: string) => {
        const empresaControl = this.form_cliente.get('empresa');
        if (tipo === 'flotilla') {
          empresaControl.enable();
        } else {
          empresaControl.setValue('');
          empresaControl.disable();
        }
      })
      this.form_cliente.get('empresa').valueChanges.subscribe(async (empresa: string) => {

      })
      this.form_cliente.get('no_cliente').disable()
    }
  }
  carga_data_editar(data_cliente){
    this.form_cliente.reset({
      uid: data_cliente['id'] ,
      no_cliente: data_cliente['no_cliente'] ,
      nombre: data_cliente['nombre'] ,
      apellidos: data_cliente['apellidos'] ,
      correo: data_cliente['correo'] || '',
      correo_sec: data_cliente['correo_sec'] || '',
      telefono_fijo: data_cliente['telefono_fijo'] || '',
      telefono_movil: data_cliente['telefono_movil'] || '',
      tipo: data_cliente['tipo'] ,
      sucursal: data_cliente['sucursal'],
      empresa: data_cliente['empresa'] || '',
    })    
  }

  actualiza_cliente(){
    if (this.form_cliente.valid && !this.correo_invalido) {
      const data_form = this._publicos.recuperaDatos(this.form_cliente)
      // console.log(data_form);
      const campos_update = ['nombre','apellidos','telefono_movil','empresa','tipo']
      if (!this.cliente['correo']) {
        campos_update.push('correo')
      }
      const updates = {}
      const {sucursal, id } = this.cliente
      campos_update.forEach(campo=>{
        updates[`clientes/${sucursal}/${id}/${campo}`] = data_form[campo]
      })
      updates[`clientes/${sucursal}/${id}/id`] = id

      update(ref(db), updates).then(()=>{
        this._publicos.swalToast(`Se actualizo la informacion de cliente`,1)
      })
      .catch(err=>{
        console.log(err);
      })
    }else{
      this._publicos.swalToast(`Los datos del formulario no son validos`,0)
    }

    
  }
  validarCampo(campo){
    return this.form_cliente.get(campo).invalid && this.form_cliente.get(campo).touched
  }
}
