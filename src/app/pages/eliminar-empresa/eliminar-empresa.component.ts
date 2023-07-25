import { Component, OnInit } from '@angular/core';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ClientesService } from 'src/app/services/clientes.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CamposSystemService } from 'src/app/services/campos-system.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-eliminar-empresa',
  templateUrl: './eliminar-empresa.component.html',
  styleUrls: ['./eliminar-empresa.component.css']
})
export class EliminarEmpresaComponent implements OnInit {
  
  constructor(private _sucursales: SucursalesService,private _security:EncriptadoService, private _campos: CamposSystemService,
    private _empresas: EmpresasService, private _clientes: ClientesService,private _publicos: ServiciosPublicosService) { }
  ROL:string; SUCURSAL:string

  lista_en_duro_sucursales = [...this._sucursales.lista_en_duro_sucursales]

  miniColumnas:number = this._campos.miniColumnas
  // variables
  empresas_arr = []
  diferencias = []
  empresaElimina = []
  empresaRemplaza = []
  myControl_elimina = new FormControl('');
  filteredOptions_elimina: Observable<string[]>;
  myControl_reemplaza = new FormControl('');
  filteredOptions_reemplaza: Observable<string[]>;
  afecta_clientes = []
  
  sucursal_elimina
  ngOnInit(): void {
    this.rol()
    this.automaticos()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    
    if(this.SUCURSAL !== 'Todas') this.sucursal_elimina = this.SUCURSAL
    if(this.sucursal_elimina !== 'Todas') this.listadoEmpresas(this.sucursal_elimina)
  }
  listadoEmpresas(sucursal){
    this.empresas_arr = []
    this.myControl_elimina.setValue(null)
    this.myControl_reemplaza.setValue(null)
    const starCountRef = ref(db, `empresas/${sucursal}`)
    onValue(starCountRef, async (snapshot) => {
      this.empresas_arr = await this._empresas.consulta_sucursales_new(sucursal)
    })
  }
  automaticos(){
    this.filteredOptions_elimina = this.myControl_elimina.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','eliminar'))
    );
    this.filteredOptions_reemplaza = this.myControl_reemplaza.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','reemplaza'))
    );
  }
  displayFn(user: any): string {
    return user && user.empresa ? user.empresa : '';
  }
  private _filter(valor: string, donde:string): any[] {
    const filterValue = String(valor).toLowerCase();
    if (donde === 'reemplaza') {

      const elimina = this.myControl_elimina.value

      let data = elimina instanceof Object ? this._publicos.obtenerDiferencias(this.empresas_arr, [elimina]) : this.empresas_arr;

      return data.filter(option => option.empresa.toLowerCase().includes(filterValue));
    }else{
      return this.empresas_arr.filter(option => option.empresa.toLowerCase().includes(filterValue));
    }
  }

  async listaClientes_afectados(){
    // const elimina = this.myControl_elimina.value instanceof Object ?  this.myControl_elimina.value : null
    // const reemplza = this.myControl_reemplaza.value instanceof Object ?  this.myControl_reemplaza.value : null
    // if (this.sucursal_elimina !== 'Todas' && this.sucursal_elimina) {
    //   if (elimina && reemplza) {
    //     const clientes = await this._clientes.consulta_clientes_new()
    //     // const filtrados_sucursal = clientes.filter(c=>c.sucursal === this.SUCURSAL)
    //     // const filtrados_tipo = filtrados_sucursal.filter(c=>c.tipo === 'flotilla')
    //     // const filtrados_empresa = filtrados_tipo.filter(c=>c.empresa === elimina.id)
  
    //     const filtrados_empresa = clientes.filter(c =>
    //       c.sucursal === this.sucursal_elimina && c.tipo === 'flotilla' && c.empresa === elimina.id
    //     );
    //     filtrados_empresa.map(c=>{
    //       c.sucursalShow = this.lista_en_duro_sucursales.find(s=>s.id === c.sucursal).sucursal
    //       c.empresaShow = this.empresas_arr.find(s=>s.id === elimina.id).empresa
    //     })
    //     this.afecta_clientes = filtrados_empresa
    //   }else{
    //     this._publicos.mensajeSwal('Elegir ambas empresas',0)
    //     this.afecta_clientes = []
    //   }
    // }else{
    //   this._publicos.mensajeSwal('Elegir sucursal',0)
    //     this.afecta_clientes = []
    // }
    
  }

  ReemplzarInformacion(){
    const elimina = this.myControl_elimina.value instanceof Object ?  this.myControl_elimina.value : null
    const reemplza = this.myControl_reemplaza.value instanceof Object ?  this.myControl_reemplaza.value : null
    const updates = {}
    if (elimina && reemplza) {
      console.log('iniciando proceso de reemplazo clientes afectados');
      // updates[``]
      console.log('Anterior: ',elimina.id, elimina.empresa);
      console.log('nueva: ',reemplza.id, reemplza.empresa);
      
      this.afecta_clientes.forEach(c=>{
        updates[`clientes/${c.id}/empresa`] = reemplza.id
      })
      updates[`empresas/${this.sucursal_elimina}/${elimina.id}`] = null
      console.log(updates);
      this._publicos.mensaje_pregunta(`Elimina ${elimina.empresa} y reemplzar por ${reemplza.empresa}`).then(({respuesta})=>{
        if (respuesta) {
          update(ref(db), updates).then(()=>{
            this.myControl_elimina.setValue(null)
            this.myControl_reemplaza.setValue(null)
            if(this.sucursal_elimina !== 'Todas') this.listadoEmpresas(this.sucursal_elimina)
            this.afecta_clientes = []
            this._publicos.mensajeSwal('Se ha remplazado la informacion y eliminado ',1,false,elimina.empresa)
          })
        }
      })
      
      
    }
  }


}
