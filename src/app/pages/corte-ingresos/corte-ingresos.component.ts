import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { MetasSucursalService } from '../../services/metas-sucursal.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ClientesService } from 'src/app/services/clientes.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());


@Component({
  selector: 'app-corte-ingresos',
  templateUrl: './corte-ingresos.component.html',
  styleUrls: ['./corte-ingresos.component.css']
})
export class CorteIngresosComponent implements OnInit {

  constructor(private _sucursales: SucursalesService, private _formBuilder: FormBuilder,
    private _publicos: ServiciosPublicosService, private _metas: MetasSucursalService,
    private _security:EncriptadoService, private _reporte_gastos: ReporteGastosService,
    private _vehiculos: VehiculosService, private _servicios: ServiciosService,
    private _clientes: ClientesService,) { }
  
  _rol:string
  _sucursal: string

  sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]

  fechas_corte = new FormGroup({
    inicial: new FormControl(new Date()),
    final: new FormControl(new Date()),
  });

  fecha_formateadas = {inicial:new Date(), final:new Date() }
  hora_start = '00:00:01';
  hora_end = '23:59:59';

  metas_mes = []

  array_recepciones = []
  recepciones_arr = []


  my_control = new FormGroup({
    sucursal: new FormControl('')
  })
  sucursal_select:string
  ngOnInit(): void {
    this.rol()
    this.primer_llamado()
    this.vigila()
  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal 
    // this.filtro_sucursal =  this._sucursal 
  }
  primer_llamado(){
    const {inicial, final} = this.fechas_corte.value

    const S = new Date(inicial)
    const F = new Date(final)
    this.resultados_objetivos({S, F})
    this.consulta_servicios()
    this.consulta_gastos_operacion()
    
  }

  vigila(){
 
    this.fechas_corte.valueChanges.subscribe(({inicial:start_, final: end_})=>{
      if (start_ && start_['_d'] && end_ && end_['_d'] ) {
        if (end_['_d'] >= start_['_d']) {
          this.resetea_horas_admin()
        }
      }        
    })

    this.my_control.get('sucursal').valueChanges.subscribe((sucursal:string)=>{
      if(sucursal){
        this.sucursal_select = sucursal
        this.consulta_gastos_operacion()
      }
    })
  }
  async resetea_horas_admin(){
    const {inicial, final} = this.fechas_corte.value
    const simula_fecha =  new Date('03-23-2023')
    const S = new Date(inicial)
    const F = new Date(final)
    this.fecha_formateadas.inicial = this._publicos.resetearHoras_horas(S,this.hora_start) 
    this.fecha_formateadas.final = this._publicos.resetearHoras_horas(F,this.hora_end) 

    this.resultados_objetivos({S, F})
    this.consulta_servicios()
    
  }

  async consulta_servicios(){
    console.log(this.fecha_formateadas);
    const arreglo_sucursal = (this._sucursal === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this._sucursal]
    const arreglo_rutas = this.crea_ordenes_sucursal({arreglo_sucursal})
    const arreglo_fechas_busca = this.obtenerArregloFechas_gastos_diarios({ruta: 'historial_gastos_orden', arreglo_sucursal})

    const promesasConsultas_gastos_orden = arreglo_fechas_busca.map(async (f_search) => {
      const gastos_hoy_array: any[] = await this._reporte_gastos.gastos_hoy({ ruta: f_search});
      const promesasVehiculos = gastos_hoy_array
        .filter(g => g.tipo === 'orden')
        .map(async (g) => {
          const { sucursal, cliente, vehiculo } = g;
          g.data_vehiculo = await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
        });
      await Promise.all(promesasVehiculos);
              return gastos_hoy_array;
      });
    const promesas_gastos_orden = await Promise.all(promesasConsultas_gastos_orden);

    const muestra_gastos_ordenes = promesas_gastos_orden.flat()
    
    const promesasConsultas = arreglo_rutas.map(async (f_search) => {

      const respuesta = await  this._servicios.consulta_recepcion_sucursal({ruta: f_search})
        
      const gastos_hoy_array = await this.regresa_servicios_por_cada_ruta({respuesta}) 
        const promesasVehiculos = gastos_hoy_array
          
          .map(async (g) => {
            const { sucursal, cliente, vehiculo , id, fecha_recibido} = g;
            // console.log(id);
            
            // g.data_vehiculo = await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
            const data_cliente:any =  await this._clientes.consulta_cliente_new({sucursal, cliente})
            g.data_cliente = data_cliente
            g.clienteShow = data_cliente.fullname
            const data_vehiculo:any =  await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
            
            const historial_pagos:any =  await this._servicios.historial_pagos({ sucursal, cliente, id });

            
            const historial_gastos = muestra_gastos_ordenes.filter(g=>g.numero_os === id)
            g.historial_pagos = historial_pagos
            g.historial_gastos = historial_gastos
            g.data_vehiculo = data_vehiculo
            g.placas = data_vehiculo.placas
            const data_sucursal =  this.sucursales_array.find(s=>s.id === sucursal)

            g.data_sucursal =  data_sucursal
            g.sucursalShow = data_sucursal.sucursal

            return g
          });
        await Promise.all(promesasVehiculos);
        return gastos_hoy_array;
    });
    
    const promesas = await Promise.all(promesasConsultas);
    // console.log(promesas);
    const finales = promesas.flat()
    console.log(finales);

    const ordenada = this._publicos.ordernarPorCampo(finales,'fecha_recibido')
    
    this.array_recepciones = ordenada
    this.filtra_informacion()
    
  }
  filtra_informacion(){
    const {inicial, final}= this.fecha_formateadas

    // let resultados_1 = (this.filtro_tipo === 'Todos') ? this.array_recepciones : this.array_recepciones.filter(c=>c.status === this.filtro_tipo)

    // const resultados =  (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)
    const resultados = this.array_recepciones.filter(s=>s.status === 'entregado')

    const filtro = resultados.filter(r=>new Date(r.fecha_recibido) >= inicial && new Date(r.fecha_recibido) <= final )
    // console.log(filtro);
    const campos = [
      'cliente','clienteShow','data_cliente','data_sucursal','data_vehiculo',
      'showNameTecnico','diasSucursal','fecha_promesa','fecha_recibido','formaPago','id',
      'iva','margen','no_os','placas','reporte','servicio','elementos','status','subtotal',
      'sucursal','sucursalShow','vehiculo','historial_pagos','historial_gastos','status','fecha_entregado',
      'pdf_entrega'
    ]
    this.recepciones_arr = (!this.recepciones_arr.length) ?  filtro :  this._publicos.actualizarArregloExistente(this.recepciones_arr, filtro,campos);
    
    console.log(this.recepciones_arr);
    
    //  = filtro

    // this.dataSource.data = this.recepciones_arr
    // this.newPagination()
  }

  consulta_gastos_operacion(){

    // `historial_gastos_operacion/${sucursal}/${solo_numeros_fecha_hoy}/${clave_}`
    const {inicial, final} = this.fechas_corte.value
    const solo_numeros_fecha_hoy = this._reporte_gastos.fecha_numeros_sin_Espacions(new Date(inicial))
    const starCountRef = ref(db, `historial_gastos_operacion/${this.sucursal_select}/${solo_numeros_fecha_hoy}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        
      } else {
        console.log("No data available");
      }
    }, {
        onlyOnce: true
      })
  }




  async resultados_objetivos(data){
    const {S, F} = data
    const rutas = this.rutas_consulta({S, F})
    // console.log(rutas);
    
    const promesasClientes = rutas.map(async (data) => {
      const {anio, mes, ruta} = data
      const registro = await this._metas.consulta_registro_meta_mes({ruta})
      let objetivo_mes = registro > 0 ? registro : 0

      const meses =  ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ];

      return {mes: meses[mes],anio, objetivo: objetivo_mes}
    });
    
    const promesasResueltasClientes = await Promise.all(promesasClientes);
    console.log(promesasResueltasClientes);

    this.metas_mes = promesasResueltasClientes
  }
  rutas_consulta(data){
    const {S, F} = data
    const  aniosMeses = this.obtenerAniosMesesPorAnio_1(S, F)
    let rutas = []
    aniosMeses.forEach(regis=>{
      const {anio, meses} = regis
      const mesess = [...meses]
      mesess.forEach(m=>{
        const ruta = `metas_sucursales/${this.sucursal_select}/${anio}/${m - 1}`
        rutas.push({mes: m - 1, anio, ruta})
      })
    })
    return rutas
  }
  obtenerAniosMesesPorAnio_1(fechaInicio, fechaFin) {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
  
    const anioInicio = fechaInicioObj.getFullYear();
    const mesInicio = fechaInicioObj.getMonth();
    const anioFin = fechaFinObj.getFullYear();
    const mesFin = fechaFinObj.getMonth();
  
    const aniosMeses = [];
  
    for (let anio = anioInicio; anio <= anioFin; anio++) {
      const mesesPorAnio = [];
      const mesInicial = (anio === anioInicio) ? mesInicio : 0;
      const mesFinal = (anio === anioFin) ? mesFin : 11;
  
      for (let mes = mesInicial; mes <= mesFinal; mes++) {
        mesesPorAnio.push(mes + 1);
      }
  
      aniosMeses.push({ anio, meses: mesesPorAnio });
    }
  
    return aniosMeses;
  }
  crea_ordenes_sucursal(data){
    const {arreglo_sucursal, } = data
    let Rutas_retorna = []
    arreglo_sucursal.forEach(sucursal=>{
      Rutas_retorna.push(`recepciones/${sucursal}`)
    })
    return Rutas_retorna
  }
  obtenerArregloFechas_gastos_diarios(data){
    const {ruta, arreglo_sucursal} = data
    const fecha_start = new Date('08-02-2023')
    const fecha_end = this.fecha_formateadas.final
    const diffTiempo = fecha_end.getTime() - fecha_start.getTime();
    const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
    let arreglo = []
    for (let i = 0; i <= diffDias; i++) {       
      const fecha_retorna = new Date(fecha_start.getTime() + i * 24 * 60 * 60 * 1000);
      if (!this._publicos.esDomingo(fecha_retorna)) {
        const Fecha_formateada = this._reporte_gastos.fecha_numeros_sin_Espacions(fecha_retorna)
        arreglo.push(Fecha_formateada)
      }
    }

    let Rutas = []
    arreglo_sucursal.forEach(s=>{
      arreglo.forEach(Fecha_formateada_=>{
        Rutas.push(`${ruta}/${s}/${Fecha_formateada_}`)
      })
    })
    return Rutas
  }
  regresa_servicios_por_cada_ruta(data){
    const { respuesta } = data;
    let  obtenidos = [];
    
      Object.values(respuesta).forEach((entrie) => {
        const nuevas_entries = this._publicos.crearArreglo2(entrie);
        obtenidos.push(...nuevas_entries);
      });
    
    return obtenidos;
  }

  

}
