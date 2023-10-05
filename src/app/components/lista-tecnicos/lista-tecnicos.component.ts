import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-lista-tecnicos',
  templateUrl: './lista-tecnicos.component.html',
  styleUrls: ['./lista-tecnicos.component.css']
})
export class ListaTecnicosComponent implements OnInit, OnChanges{
  listatecnicos_arr = []
  tecnico: string = 'tecnico'
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  listaTecnicos_arr = []


  @Output() dataTecnico : EventEmitter<any>
  @Input() sucursal :string

  
  constructor(private _publicos: ServiciosPublicosService) { 
    this.dataTecnico = new EventEmitter()
  }

  ngOnInit(): void {
    this.listaTecnicos()
    this.automaticos()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sucursal']) {
      const nuevoValor = changes['sucursal'].currentValue;
      const valorAnterior = changes['sucursal'].previousValue;
 
    }
  }
  listaTecnicos(){
    const starCountRef = ref(db, `usuarios`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let usuarios = this._publicos.crearArreglo2(snapshot.val());
        this.listatecnicos_arr = usuarios.filter(u => u.rol === this.tecnico)
          .map(({usuario, rol, correo, id, status, sucursal}) => ({usuario, rol, correo, id, status, sucursal}));
      }
    })
  }
  tecnicoSeleccionado(data){
    if (data.id) {
      this.dataTecnico.emit( data )
      this.myControl.setValue('')
    }else{
      this.dataTecnico.emit( false )
    }
  }
  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.realizaFiltro() ;
      }),
    );
  }
  // this.listatecnicos_arr.slice()
  realizaFiltro(){
    // console.log(this.listatecnicos_arr);
    return this.listatecnicos_arr.filter(r=>r.sucursal === this.sucursal)
  }
  displayFn(user: any): any {
    return user && `${user['usuario']}` ? `${user['usuario']}` : '';
  }

  private _filter(value: string): any[] {
    let data = [];
    console.log(value);
    
    // if (!value) {
      const filterValue = value.toLowerCase();

      let resultados = this.listatecnicos_arr.filter(option => option['usuario'].toLowerCase().includes(filterValue));

      if (!resultados.length)  resultados = this.listatecnicos_arr.filter(option => option['correo'].toLowerCase().includes(filterValue)); 
      data = resultados.filter(r=>r.sucursal === this.sucursal)
    // }
    return data
  }

  //puedes refactorizar codigo y como te doy el codigo?
  



}
