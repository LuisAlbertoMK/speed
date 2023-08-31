import { Component, OnInit,Input, OnChanges, SimpleChanges,ChangeDetectionStrategy, Output, EventEmitter,} from '@angular/core';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  marca: boolean = false
  miniColumnas:number = 100

  @Output() dataElemento : EventEmitter<any>

  @Input() registro: boolean
  
  calculo: number =  0
  calculoMargen: number = 0

  por=25
  cantidad=1
  totalMuestra:number = 0
  faltantes_string: string = null
  encontrado: boolean = false

  registro_flag:boolean = false

  faltante_s:string

  elementos_actuales_compatibles = []
  elementos_actuales_compatibles_ = []
  constructor(private _publicos: ServiciosPublicosService, private fb: FormBuilder) { 
    this.dataElemento = new EventEmitter()
  }

  ngOnInit(): void {
    this.listadoMO()
    this.listadoRefacciones()
    this.automaticos()
    this.crearFormElemento()
    this.comprobar()
  }
  comprobar(){
    
    
    
    this.myControl.valueChanges.subscribe(cambio=>{
      // console.log(cambio.);
      const unidos = [...this.lista_arr_mo,...this.lista_arr_refacciones]
      // console.log(unidos);
      this.faltantes_string = null
      const valor = this.myControl.value
      if (typeof valor === 'string') {
        // console.log('compara el strign recibido');
        //primero saber si el nombre ya esta registrado
        const encontrado = unidos.find(option => option.nombre.trim().toLowerCase() === valor.trim().toLowerCase());
        this.encontrado = (encontrado) ? true: false
        
        if (encontrado) {
          encontrado.descripcion = (encontrado.descripcion !== null && encontrado.descripcion !== '' ) ? encontrado.descripcion : 'ninguna'
          const asignaValores = ['cantidad','descripcion','id','marca','nombre','precio','costo','tipo']

          asignaValores.forEach(val => {
            this.formElemento.get(val).setValue(encontrado[val]);
            this.formElemento.controls[val].setValue(encontrado[val]);
          });
          
          // this.formElemento.get('status').setValue(true);
        } else {
          this.limpiarForm()
          this.formElemento.controls['id'].setValue(null);
          this.formElemento.get('nombre').setValue(valor.toLowerCase());
          this.formElemento.get('tipo').enable();
        }
      }
    })
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
      tipo:['mo',[Validators.required]],
      descripcion:['',[]],
      compatibles:[[],[]]
    })
    

    this.formElemento.get('id').valueChanges.subscribe((id: string) => {
      if (id) {
        this.registro_flag= true
        // this.formElemento.get('nombre').disable();
        this.formElemento.get('tipo').disable();
        this.formElemento.get('precio').disable();
        this.formElemento.get('descripcion').disable();
      }else{
        this.registro_flag= false
        // this.formElemento.get('nombre').enable();
        this.formElemento.get('tipo').enable();
        this.formElemento.get('precio').enable();
        this.formElemento.get('descripcion').enable();
      }
      
    })
    this.formElemento.valueChanges.subscribe(() => {
      this.calcularTotal();
    });

    this.formElemento.get('tipo').valueChanges.subscribe((tipo: string) => {
      // console.log(tipo);
      if (tipo ==='refaccion') {
        this.marca = true;
        this.formElemento.get('marca').enable();
      } else {
        this.marca = false
        this.formElemento.get('marca').disable();
      }
    })
    
  }


  data_compataible(data_form){
    const {marca} = data_form
    if (marca) {
      const valores_compatibles = [...this.formElemento.get('compatibles').value];
      valores_compatibles.push(data_form)
      this.formElemento.get('compatibles').setValue(valores_compatibles)
    } 
  }
  elimina_etiqueta(index:number){
    let valores_compatibles = [...this.formElemento.get('compatibles').value];
    if (valores_compatibles.length ) {
      const nuevos = [...valores_compatibles]
      nuevos.splice(index,1)
      this.formElemento.get('compatibles').setValue(nuevos) 
    }
  }
  calcularTotal(){
    const cantidad = this.formElemento.get('cantidad').value;
    const precio = this.formElemento.get('precio').value;
    const costo = this.formElemento.get('costo').value;
    const tipo = this.formElemento.get('tipo').value;
    const ocupado =  (costo>0) ? costo : precio
    let operacion = 0
    if (ocupado > 0 && cantidad >=1) {
      const margen = (tipo === 'refaccion') ? 1 + (this.por / 100) : 1
      operacion = (cantidad * ocupado) * margen
      // this.totalMuestra = (cantidad * ocupado) * margen
    }
    this.totalMuestra = operacion
    
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
    const claves = Object.keys(option)
    const recuperada = this._publicos.nuevaRecuperacionData(option, claves)
    let descri = (recuperada.descripcion === undefined || recuperada.descripcion === null || recuperada.descripcion === "") ?  'ninguna' : recuperada.descripcion
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
        descripcion: descri,
        compatibles: recuperada.compatibles || []
      })
      this.elementos_actuales_compatibles = [
        {
          "marca": "Alfa Romeo",
          "modelo": "Stelvio",
          "anio_inicial": "1992",
          "anio_final": "1994"
        }
      ]
    }
  }

  
  colocarElemento(){
    
    const data_form = this._publicos.getRawValue(this.formElemento)
    // console.log(data_form);
    const {compatibles} = data_form

    const actuales:any[] = this.formElemento.get('compatibles').value

    this.elementos_actuales_compatibles_ = actuales
    // Ejemplo de uso:
    const obj1 = JSON.parse(JSON.stringify(this.elementos_actuales_compatibles));
    const obj2 = JSON.parse(JSON.stringify(this.elementos_actuales_compatibles_));
    
    
    
    
    
    if (this._publicos.sonArreglosDeObjetosIdenticos(this.elementos_actuales_compatibles, this.elementos_actuales_compatibles_)) {
      console.log('Los arreglos de objetos son idénticos.');
    } else {
      console.log('Los arreglos de objetos no son idénticos.');
    }
    
  
    

    return
    // console.log(compatibles);
    if (!compatibles.length) {
      this._publicos.mensajeSwal('Sin vehículos compatibles',0,true,`Debes colocar al menos un vehículo compatible`)
      return
    }

    
    const claves = ['tipo','nombre','cantidad','precio','costo','descripcion']
    const claves2 = ['id',...claves]
    const valores = {}
    claves2.forEach(c=>{
      valores[c] = this.formElemento.get(c).value
    })
    const nuevaInfo = this._publicos.nuevaRecuperacionData(valores, claves2)
    if(!nuevaInfo['costo']) nuevaInfo['costo'] =  0
    const {ok,faltante_s} = this._publicos.realizavalidaciones_new(nuevaInfo,claves)
    this.faltante_s = faltante_s
    // this.faltantes_string = faltante_s
    if (ok) {
      nuevaInfo['aprobado'] = true
      nuevaInfo['status'] = true
      const tipoShow = (nuevaInfo.tipo === 'refaccion') ? 'Refacción' : 'Mano de obra'
      this._publicos.mensaje_pregunta(`Guardar elemento con costo total de $ ${this.totalMuestra}`,true,`de tipo ${tipoShow}`).then(({respuesta})=>{
          if (respuesta) {
            if(!nuevaInfo.id){
              //registrar en caso de que no tenga id
              nuevaInfo['id'] = this._publicos.generaClave()
              const path = nuevaInfo['tipo'] === 'refaccion' ? 'refacciones' : 'manos_obra';
              const updates = {[`${path}/${nuevaInfo['id']}`]: nuevaInfo}
              console.log(updates);
              // update(ref(db), updates).then(()=>{
              //   this._publicos.swalToast('Se agrego elemento',1, 'top-start')
              //   this.dataElemento.emit( nuevaInfo )
              //   this.limpiarControl()
              // })
              // .catch(err=>{
              //   this._publicos.swalToast('error al registrar elemento',0, 'top-start')
              // })
            } else{
              //en caso de que tenga id solo agregar
              this.dataElemento.emit( nuevaInfo )
              this._publicos.swalToast('Se agrego elemento',1, 'top-start')
              this.limpiarControl()
            }
          }
      })
    }
  }

  limpiarForm(){
    this.formElemento.reset({
      id: null,
      nombre: null,
      cantidad: 1,
      precio: 0,
      costo: 0,
      marca: '',
      status: true,
      tipo: 'refaccion',
      descripcion: null,
    })
    
    this.formElemento.controls['tipo'].enable();
    this.formElemento.get('precio').enable();
    this.formElemento.get('descripcion').enable();
  }
  limpiarControl(){
    this.myControl.setValue('')
    this.limpiarForm()
  }

  decimales(event){
    this._publicos.validarDecimal(event)
  }
    
}
