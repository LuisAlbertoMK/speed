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

  
  constructor(private _publicos: ServiciosPublicosService, private fb: FormBuilder) { 
    this.dataElemento = new EventEmitter()
  }

  ngOnInit(): void {
    this.listadoMO()
    this.listadoRefacciones()
    this.automaticos()
    this.crearFormElemento()
    
  }
  crearFormElemento(){
    this.formElemento = this.fb.group({
      // paquete:['',[]],
      id:['',[]],
      nombre:['',[Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
      cantidad:['1',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      precio:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      costo:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(0)]],
      marca:['',[]],
      status:['',[]],
      tipo:['refaccion',[Validators.required]],
      descripcion:['',[]]
    })
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
    
    const nuevaInfo = {}, claves = Object.keys(option)
    claves.forEach((c)=>{
      if (option[c]) {
        nuevaInfo[c] = option[c]
      }else{
        // nuevaInfo[c] = ' '
      }
    })
    // console.log(nuevaInfo);
    this.cargaInfo(nuevaInfo);
    (nuevaInfo['tipo'] === 'refaccion') ? this.marca = true : this.marca = false
    
  }

  //cargar la informacion en formulario
  cargaInfo(nuevaInfo:any){
    this.formElemento.reset({
        id: nuevaInfo['id'],
        nombre: nuevaInfo['nombre'],
        cantidad: 1,
        precio: nuevaInfo['precio'],
        costo: 0,
        marca: nuevaInfo['marca'],
        status: nuevaInfo['status'],
        tipo: nuevaInfo['tipo'],
        descripcion: nuevaInfo['descripcion'],
    })
  }
  //verificar si es un objeto o solo un string
  verificaElemento(){
    // console.log(this.myControl.value);
    const value = this.myControl.value
    if (value['id']) {
      
    }else{
      this.existe = false
      this.limpiarForm()
    }
  }
  //guardar elemento
  colocarElemento(){
    const info = this.formElemento.value
    const nuevaInfo = {}, claves = Object.keys(info)
    //limpiar la informacion evitar informacion nulla
    claves.forEach((c)=>{
      if (info[c]  ) {
        nuevaInfo[c] = info[c]
      }else if(c ==='costo'){
        nuevaInfo[c] = Number(info[c])
      }else{

      }
    })

    // console.log(nuevaInfo);

    const updates = {};
    //realizar pregunta de si desea guardar el elemento
    this._publicos.mensaje_pregunta('Guardar elemento').then(({respuesta})=>{
      if (respuesta) {
        //verificar si es nuevo o si esta en c atalogo
        nuevaInfo['aprobado'] = true
        if (nuevaInfo['id']) {
          // this.dataElemento.emit( {data: nuevaInfo})
          this._publicos.mensajeSwal('Se agrego elemento')
          let PC:number = nuevaInfo['precio']
          if (nuevaInfo['tipo'] === 'refaccion') {
            if (nuevaInfo['costo']> 0) PC =  nuevaInfo['costo']
            nuevaInfo['flotilla'] = Number((nuevaInfo['cantidad'] * PC) * 1.25)
          }else{
            if (nuevaInfo['costo']> 0) PC =  nuevaInfo['costo']
            nuevaInfo['flotilla'] = Number((nuevaInfo['cantidad'] * PC))
          }
          
          this.dataElemento.emit(  nuevaInfo )
          this.limpiarControl()
        }else{
          //agregar nueva clave
          nuevaInfo['id'] = this._publicos.generaClave()
         ///verificar donde se guardara (ya que se manejan dos distintas direcciones para mo / refacciones
          if (nuevaInfo['tipo'] === 'refaccion') {
            let PC:number = nuevaInfo['precio']
            if (nuevaInfo['costo']> 0) PC =  nuevaInfo['costo']
            nuevaInfo['flotilla'] = Number((nuevaInfo['cantidad'] * PC) * 1.25)
            updates[`refacciones/${nuevaInfo['id']}`] = nuevaInfo;
          }else{
            let PC:number = nuevaInfo['precio']
            if (nuevaInfo['costo']> 0) PC =  nuevaInfo['costo']
            nuevaInfo['flotilla'] = Number((nuevaInfo['cantidad'] * PC))
            updates[`manos_obra/${nuevaInfo['id']}`] = nuevaInfo;
          }

          
          // console.log(updates);
          // update(ref(db), updates).then(()=>{
            this._publicos.mensajeSwal('Se agrego elemento')
            this.dataElemento.emit(  nuevaInfo)
            this.limpiarControl()
          // this.dataElemento.emit( {data: nuevaInfo})
          // })
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
