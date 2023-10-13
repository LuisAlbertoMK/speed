import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

@Component({
  selector: 'app-morefacciones-list',
  templateUrl: './morefacciones-list.component.html',
  styleUrls: ['./morefacciones-list.component.css']
})
export class MorefaccionesListComponent implements OnInit {
  @Output() data_elemento : EventEmitter<any>
  constructor(private _publicos: ServiciosPublicosService) { 
    this.data_elemento = new EventEmitter()
  }
  moRefacciones:any =[]
  objecto_actual:any ={}
  myControl = new FormControl('');
  myControl_cantidad = new FormControl('1');
  filteredOptions: Observable<string[]>;
  cantidad_actual:number = 1
  info_elemento = {}
  info_elemento_temp = {}
  ngOnInit(): void {
    this.primer_comprobacion_resultados()
    this.automaticos()
    this.vigila()
  }
  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('moRefacciones')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }
  primer_comprobacion_resultados(){
    this.asiganacion_resultados()
    this.segundo_llamado()
  }
  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.nueva_revision_cache('moRefacciones')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asiganacion_resultados()
      }
    },1500)
  }
  asiganacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('moRefacciones')
    const filtrados = this._publicos.filtrarObjetoPorPropiedad(objecto_recuperdado, 'status', true)
    // console.log(filtrados);
    this.moRefacciones = this._publicos.crearArreglo2(filtrados)
    
  }
  vigila(){
    this.myControl.valueChanges.subscribe(elemento=>{
      if (elemento instanceof Object) {
        this.info_elemento_temp = this._publicos.crear_new_object(elemento)
        this.acciones_elemento()
      }
    })

    this.myControl_cantidad.valueChanges.subscribe((cantidad: number)=>{
      const nueva_cantidad = (cantidad < 1) ? 1 : cantidad
      this.cantidad_actual = nueva_cantidad
      this.acciones_elemento()
    })
  }
  acciones_elemento(){
    if (this.info_elemento_temp && this.info_elemento_temp['id']) {
      const new_data = this._publicos.crear_new_object(this.info_elemento_temp)
      const {tipo, costo, precio} = new_data
      const nuevo_costo = (parseFloat(costo) > 0) ? parseFloat(costo) : precio
      const nuevo_precio = (tipo === 'refaccion') ? nuevo_costo * 1.25 : nuevo_costo
      new_data.cantidad = this.cantidad_actual
      new_data.new_precio = nuevo_precio * this.cantidad_actual
      this.info_elemento = new_data
    }
  }
  enviar_elemento(){
    if (this.info_elemento && this.info_elemento['id']) {
      this.data_elemento.emit( this.info_elemento )
      this.myControl.setValue('')
      this.info_elemento_temp = {}
      this.info_elemento = {}
    }
  }

  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: string): string[] {
    let data = []
    if (value['nombre']) {
      
    }else{
      const filterValue = value.toLowerCase();
      let resultados = []
      
      resultados = this.moRefacciones.filter(option => option['nombre'].toLowerCase().includes(filterValue));
      if (!resultados.length) {
        resultados = this.moRefacciones.filter(option => option['id_publico'].toLowerCase().includes(filterValue));
      }
      data = this._publicos.ordenarData(resultados,'nombre', true)
      //  = resultados
    }
    return data
  }

  displayFn(user: any): any {
    return user && `${user['id_publico']} ${user['nombre']}` ? `${user['id_publico']} ${user['nombre']}` : '';
  }

}
