import { Component, OnInit,Input, OnChanges, SimpleChanges,ChangeDetectionStrategy, Output, EventEmitter,} from '@angular/core';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
const db = getDatabase()
const dbRef = ref(getDatabase());


@Component({
  selector: 'app-mo-refacciones',
  templateUrl: './mo-refacciones.component.html',
  styleUrls: ['./mo-refacciones.component.css']
})
export class MoRefaccionesComponent implements OnInit  {
  // lista_arr_mo = []
  lista_arr_refacciones = []; lista_arr_mo =[]
  
  // @Input() 
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  formElemento: FormGroup;
  existe: boolean = false; marca: boolean = false
  miniColumnas:number = 100

  @Output() dataElemento : EventEmitter<any>

  @Input() registro: boolean
  
  calculo: number =  0
  calculoMargen: number = 0

  por=25
  cantidad=1
  totalMuestra:number
  constructor(private _publicos: ServiciosPublicosService, private fb: FormBuilder) { 
    this.dataElemento = new EventEmitter()
  }

  ngOnInit(): void {
    this.listadoMO()
    this.listadoRefacciones()
    this.automaticos()
    this.crearFormElemento()
    
  }

  verifica_info(cual:string, cantidad){
    if (cual === 'porcentaje') {
      const porcentaje = Number(cantidad);
      const margen = porcentaje / 100;
      this.calculo = this.cantidad / (1 + margen);
      this.calculoMargen = this.calculo * margen;
    } else {
      this.cantidad = Number(cantidad);
      const margen = this.por / 100;
      this.calculo = this.cantidad / (1 + margen);
      this.calculoMargen = this.calculo * margen;
    }
    
  }
  crearFormElemento(){
    this.formElemento = this.fb.group({
      // paquete:['',[]],
      id:['',[]],
      nombre:['',[Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
      cantidad:[1,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      precio:[0,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      costo:[0,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(0)]],
      marca:['',[]],
      status:['',[]],
      tipo:['refaccion',[Validators.required]],
      descripcion:['',[]]
    })
    

    this.formElemento.get('id').valueChanges.subscribe((id: string) => {
      if (id) {
        this.formElemento.get('nombre').disable();
        this.formElemento.get('tipo').disable();
        this.formElemento.get('precio').disable();
      }else{
        this.formElemento.get('nombre').enable();
        this.formElemento.get('tipo').enable();
        this.formElemento.get('precio').enable();
      }
      
    })
    this.formElemento.valueChanges.subscribe(() => {
      this.calcularTotal();
    });

    
  }
  calcularTotal(){
    const cantidad = this.formElemento.get('cantidad').value;
    const precio = this.formElemento.get('precio').value;
    const costo = this.formElemento.get('costo').value;
    const tipo = this.formElemento.get('tipo').value;
    const ocupado =  (costo>0) ? costo : precio
    if (ocupado > 0 && cantidad >=1) {
      const margen = (tipo === 'refaccion') ? 1 + (this.por / 100) : 1
      this.totalMuestra = (cantidad * ocupado) * margen
    }
    
  }
  listadoMO(){
    const starCountRef = ref(db, `manos_obra`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const arreglo = this._publicos.crearArreglo2(snapshot.val())
        arreglo.forEach(e=>{
          e['tipo'] = 'mo'
        })
        this.lista_arr_mo = arreglo
      }
    })
  }
  listadoRefacciones(){
    const starCountRef = ref(db, `refacciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const arreglo = this._publicos.crearArreglo2(snapshot.val())
        arreglo.forEach(e=>{
          e['tipo'] = 'refaccion'
        })
        this.lista_arr_refacciones = arreglo
      }
    })
  }
  //para que se inicie el autocompleado
  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  //filtrado segun lo escrito
  private _filter(value: string): string[] {
    // console.log(value);
    let data = []
    if (value['nombre']) {
      
    }else{
      const filterValue = value.toLowerCase();
      const nuevos = this.lista_arr_mo.concat(this.lista_arr_refacciones)
      const ordenado = this._publicos.ordernarPorCampo(nuevos,'nombre')
      data = ordenado.filter(option => option['nombre'].toLowerCase().includes(filterValue));
    }
    
    return data
  }
  //paa la informacion mostrada
  displayFn(info: any): any {
    return info && `${info['nombre']}` ? `${info['nombre']}` : '';
  }
  //para obtener la informacion del elemento
  elementoSelecccionado(option){
    // console.log(option);
    this.existe = true
    const claves = Object.keys(option)
    const recuperada = this._publicos.nuevaRecuperacionData(option, claves)
    if (option.id) {
      this.formElemento.reset({
        id: recuperada.id,
        nombre: recuperada.nombre,
        cantidad: 1,
        precio: recuperada.precio,
        costo: 0,
        marca: recuperada.marca,
        status: recuperada.status,
        tipo: recuperada.tipo,
        descripcion: recuperada.descripcion,
      })
      
    }else{
    }
    
    // this.cargaInfo(recuperada);
    // console.log(recuperada);
    
    // (recuperada['tipo'] === 'refaccion') ? this.marca = true : this.marca = false
    
  }

  //cargar la informacion en formulario

  //verificar si es un objeto o solo un string
  verificaElemento(){
    const value = this.myControl.value
    if (!value['id']){
      this.existe = false
      this.limpiarForm()
    }
  }
  //guardar elemento
  colocarElemento(){
    const info = this.formElemento.value
    const claves = Object.keys(info)
    const nuevaInfo = this._publicos.nuevaRecuperacionData(info, claves)
    if(!nuevaInfo['costo']) nuevaInfo['costo'] =  0
    

    // console.log(nuevaInfo);

    const updates = {};
    //realizar pregunta de si desea guardar el elemento
    const costoMuestra = (nuevaInfo['costo']>0) ?  nuevaInfo['costo'] : this.formElemento.get('precio').value
    const costoMuestraCostos = (nuevaInfo['costo']>0) ?  'precio sobrescrito' : 'precio'
    this._publicos.mensaje_pregunta(`Guardar elemento con ${costoMuestraCostos} ${costoMuestra }`).then(({respuesta})=>{
      if (respuesta) {
        //verificar si es nuevo o si esta en c atalogo
        nuevaInfo['aprobado'] = true
        nuevaInfo['status'] = true
        nuevaInfo['nombre'] = this._publicos.CapitalizarUno(nuevaInfo['nombre'] )
        if (nuevaInfo['id']) {
          const controls_arr = ['nombre','precio','tipo']
          controls_arr.forEach(c=>{
            const control = this.formElemento.get(c);
            if (control.disabled) {
              nuevaInfo[c] = this.formElemento.get(c).value
            }
          })
          this.dataElemento.emit( nuevaInfo )
          // this._publicos.mensajeSwal('Se agrego elemento')
          this._publicos.swalToastCenter('Se agrego elemento')
          this.limpiarControl()
        }else{
          //agregar nueva clave
          nuevaInfo['id'] = this._publicos.generaClave()
         //verificar donde se guardara (ya que se manejan dos distintas direcciones para mo / refacciones
          const path = nuevaInfo['tipo'] === 'refaccion' ? 'refacciones' : 'manos_obra';
          updates[`${path}/${nuevaInfo['id']}`] = nuevaInfo;
          // console.log(updates);
          update(ref(db), updates).then(()=>{
            // this._publicos.mensajeSwal('Se agrego elemento')
            this._publicos.swalToastCenter('Se agrego elemento')
            this.dataElemento.emit( nuevaInfo )
            this.limpiarControl()
          })
        }
      }
    })
  }

  limpiarForm(){
    this.formElemento.reset({
      id: '',
      nombre: '',
      cantidad: 1,
      precio: 0,
      costo: 0,
      marca: '',
      status: true,
      tipo: 'refaccion',
      descripcion: '',
    })
  }
  limpiarControl(){
    this.myControl.setValue('')
  }
    
}
