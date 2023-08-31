import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-modelo-compatibles',
  templateUrl: './modelo-compatibles.component.html',
  styleUrls: ['./modelo-compatibles.component.css']
})
export class ModeloCompatiblesComponent implements OnInit {

  constructor(
    private _vehiculos: VehiculosService, private _formBuilder: FormBuilder, private _publicos: ServiciosPublicosService

  ) {
    this.dataElemento = new EventEmitter()
  }

  @Output() dataElemento : EventEmitter<any>
  
  formulario_etiqueta: FormGroup
  
  anios:any=                [...this._vehiculos.anios];
  marcas_vehiculos:any=     this._vehiculos.marcas_vehiculos
  marcas_vehiculos_id = []
  array_modelos = []
  vehiculos_compatibles = []

  filtros_paquetes = this._formBuilder.group({
    marca:'',
    modelo:'',
    nombre:'',
    categoria:''
  });

  array_modelos_filtro = []

  faltante_s:string

  ngOnInit(): void {
    this.construye_formulario_etiqueta()
    const n = this._publicos.crearArreglo2(this._vehiculos.marcas_vehiculos)
    this.marcas_vehiculos_id = n.map(c=>{
      return c.id
    })
  }
  construye_formulario_etiqueta(): void {
    this.formulario_etiqueta = this._formBuilder.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio_inicial: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      anio_final: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
    });
    this.vigilar_formulario_etiqueta()
  }
  vigilar_formulario_etiqueta(){
    this.formulario_etiqueta.get('marca').valueChanges.subscribe((marca: string) => {
      if (marca) {
        this.array_modelos = this.marcas_vehiculos[marca] || [];
      }
    })
    this.formulario_etiqueta.get('anio_final').valueChanges.subscribe((anio_final: number) => {
      if(anio_final){
        const anio_inicial:number = this.formulario_etiqueta.get('anio_inicial').value
        if (anio_final < anio_inicial) {
          this.formulario_etiqueta.get('anio_final').setValue(anio_inicial) 
        }
      }
    })
  }

  colocar_etiqueta(){
    const data_form = this._publicos.getRawValue(this.formulario_etiqueta)
    
    const { faltante_s, ok } =this._publicos.realizavalidaciones_new(data_form,['marca','modelo','anio_inicial','anio_final'])
    this.faltante_s = faltante_s
    if (!ok) return
    this.dataElemento.emit( data_form )
    // this.vehiculos_compatibles.push(data_form)
    this.formulario_etiqueta.reset()
  }
  elimina_etiqueta(index:number){

  }

}
