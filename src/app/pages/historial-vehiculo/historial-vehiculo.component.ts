import { Component, OnInit, ViewChild } from '@angular/core';
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosService } from '../../services/servicios.service';
import { CotizacionService } from '../../services/cotizacion.service';
const db = getDatabase();
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-historial-vehiculo',
  templateUrl: './historial-vehiculo.component.html',
  styleUrls: ['./historial-vehiculo.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistorialVehiculoComponent implements OnInit {
  ROL:string='';SUCURSAL:string =''; idVehiculo:string =''; dataVehiculo:any=[]; sinDataVehiculo:boolean= false; dataCliente:any=[]; dataSucursal:any=[];
  clickedRows = new Set<any>();
  dataSource = new MatTableDataSource();
  
  dataSourceCotizaciones = new MatTableDataSource(); 
  @ViewChild('paginatorCotizacion') paginatorCotizaciones: MatPaginator;@ViewChild('tabCotizacion') sortCotizaciones: MatSort; 
  dataSourceRecepciones = new MatTableDataSource(); 
  @ViewChild('paginatorRecepciones') paginatorRecepciones: MatPaginator;@ViewChild('tabRecepciones') sortRecepciones: MatSort; 
  
  columsCotizaciones:  string[] = ['no_cotizacion','placas','servicio','fecha']
  columsCotizacionesExtended:  string[] = [...this.columsCotizaciones,'expand'];

  columsRecepciones:  string[] = ['no_os','placas','servicio','fecha']
  columsRecepcionesExtended:  string[] = [...this.columsRecepciones,'expand'];
  // columsHistorialCotizacion:  string[] = ['servicio','total','fecha', 'hora']; 
  // columsHistorialCotizacionExtended:  string[] = [...this.columsHistorialCotizacion,'expand'];
  expandedElement: any | null; listaSucursales:any=[]; vehiculo:any=[]; cliente:any=[]; sucursales:any =[]
  miniColumnas:number = 100; ambosDatos:any=[]; complementosShow:any=[]; paqueteData:string ='';
  totalCotizado:number = 0; subtotalCotizado:number = 0; dataPaquete:any=[]

  elementospaquete:any=[];infoPaquete:any=[]; 

  campos_vehiculo = [
    {muestra: 'placas', campo:'placas'},{muestra: 'marca', campo:'marca'},{muestra: 'modelo', campo:'modelo'},
    {muestra: 'color', campo:'color'},{muestra: 'año', campo:'anio'},{muestra: 'transmision', campo:'transmision'},
    {muestra: 'engomado', campo:'engomado'},{muestra: 'No. motor', campo:'no_motor'},{muestra: 'vinChasis', campo:'vinChasis'}
  ]
  campos_cliente = [
    {muestra: 'nombre', campo:'fullname'},{muestra: 'correo', campo:'correo'},{muestra: 'correo adicional', campo:'correo_sec'},
    {muestra: 'tel. movil', campo:'telefono_movil'},{muestra: 'tek. fijo', campo:'telefono_fijo'},{muestra: 'tipo', campo:'tipo'},
    {muestra: 'empresa', campo:'empresa'},{muestra: 'Sucursal', campo:'nameSucursal'}
  ]
  campos_desgloce = [
    {nombre:'IVA',valor:'IVA'}, {nombre:'U.B',valor:'UB'}, {nombre:'Refacciones adquisicion',valor:'refacciones1'},
    {nombre:'Refacciones venta',valor:'refacciones2'},{nombre:'total MO',valor:'totalMO'},{nombre:'Costo sobrescrito',valor:'sobrescrito'},
    {nombre:'subtotal',valor:'subtotal'}, {nombre:'total',valor:'total'}
  ]
  info_Degloce = {IVA:0,UB:0,refacciones1:0,refacciones2:0,sobrescrito:0,subtotal:0,total:0,totalMO:0}
  info_Degloce_recepciones = {IVA:0,UB:0,refacciones1:0,refacciones2:0,sobrescrito:0,subtotal:0,total:0,totalMO:0}

  servicios=[
    {valor:1,nombre:'servicio'},
    {valor:2,nombre:'garantia'},
    {valor:3,nombre:'retorno'},
    {valor:4,nombre:'venta'},
    {valor:5,nombre:'preventivo'},
    {valor:6,nombre:'correctivo'},
    {valor:7,nombre:'rescate vial'}
  ]
  constructor(private rutaActiva: ActivatedRoute,private _security:EncriptadoService,private _servicios: ServiciosService,
              private _cotizaciones: CotizacionService
    ) { }

  ngOnInit(): void {
    this.rol()
  }

  rol(){
    // this.ROL =localStorage.getItem('tipoUsuario')
    // this.SUCURSAL =localStorage.getItem('sucursal')
    
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this.idVehiculo = this.rutaActiva.snapshot.params['idvehiculo']
    if (this.idVehiculo!=='') {
      // this.listadoSucursales()
      this.infoVehiculo()
      this.listado_recepciones()
      this.listado_cotizaciones()
    }
  }
  
  listado_cotizaciones(){
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._cotizaciones.cotizacionesFull().then(async ({contenido,cotizaciones})=>{
          if (contenido) {
            
            const filtro:any[] = cotizaciones.filter(o=>o['vehiculo'] === this.idVehiculo)
            for (let index = 0; index < filtro.length; index++) {
              const elementos = filtro[index].elementos
              for (let inde_sub = 0; inde_sub < elementos.length; inde_sub++) {
                const element = elementos[inde_sub];
                elementos[inde_sub].aprobado = true
              }
              const numero = Number(parseInt(filtro[index].servicio))
              filtro[index].servicio = numero
              // console.log(typeof(filtro[index].servicio));
              
              // console.log(filtro[index].servicio);
              // console.log(filtro[index].servicio, typeof(filtro[index].servicio));
              // const ele = Number(filtro[index].servicio)
              // filtro[index].servicio = ele
              
              // filtro[index].servicios = filtro[index].elementos

              // for (let aqui = 0; aqui < this.servicios.length; aqui++) {
              //   const serv = this.servicios[aqui];
              //   if (serv.valor === ele) {
              //     filtro[index].servicioName = serv.nombre
              //     // console.log(filtro[index].servicio, typeof(filtro[index].servicio));
                  
              //   }
              // }


              await this._cotizaciones.realizarOperaciones(elementos,filtro[index].margen,filtro[index].iva).then((dataOperacion:any)=>{
                // console.log(dataOperacion);
                filtro[index].desgloce = dataOperacion
                for (let index_camp = 0; index_camp < this.campos_desgloce.length; index_camp++) {
                  const camp = this.campos_desgloce[index_camp];
                      this.info_Degloce[camp.valor] = this.info_Degloce[camp.valor] + dataOperacion[camp.valor]
                }
              })
            }
            this.dataSourceCotizaciones.data = filtro
            this.paginacion('cotizaciones')
            // console.log(filtro);
          }
        })
      }
    })
  }
  elementospaqueteShow(data:any){
    // const datanew = data.elementos
    let precioF=0,refacciones=0,mo=0
            // if (ele.tipo === 'paquete') {
              // console.log(ele.nombre);
              const elementos = data.elementos
    for (let indEle = 0; indEle < elementos.length; indEle++) {
      const ele1 = elementos[indEle];
      const cantidadE = ele1.cantidad
      let costo =0
      if(ele1.tipo === 'MO'){
        for (let indcantidad = 1; indcantidad <= cantidadE; indcantidad++) {
          const opera = indcantidad * ele1.precio
          elementos[indEle].flotilla = opera
          elementos[indEle].normal = elementos[indEle].flotilla * 1.30
          costo =  elementos[indEle].flotilla
        }
        precioF=precioF+ costo
        mo = mo + costo
      }else if(ele1.tipo === 'refaccion'){
        for (let indcantidad = 1; indcantidad <= cantidadE; indcantidad++) {
          const opera = indcantidad * ele1.precio
          elementos[indEle].flotilla = opera
          elementos[indEle].normal = elementos[indEle].flotilla * 1.30
          costo =  elementos[indEle].flotilla
        }
        // console.log(costo + '- ' + ele1);
        precioF=precioF+ costo
        refacciones = refacciones + costo
        }                                                                         }
    const totalPaquete = refacciones + mo          
    this.elementospaquete = elementos
    const infoPaquete = {
      nombre: data.nombre,
      flotilla: totalPaquete,
      UB: data.UB,
      refacciones,
      mo
    }
    this.infoPaquete = infoPaquete
  }
  muestra_infoPaquete(){

  }
  listado_recepciones(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._servicios.getRecepcionesnew().then(async ({valido,data})=>{
          if (valido) {
            // console.log(data);
            const filtro = data.filter(o=>o['vehiculo'] === this.idVehiculo)
            
            for (let index = 0; index < filtro.length; index++) {
              const elementos = filtro[index].servicios;
              await this._cotizaciones.realizarOperaciones(elementos,filtro[index].margen,filtro[index].iva).then((dataOperacion:any)=>{
                // console.log(dataOperacion);
                filtro[index].desgloce = dataOperacion
                for (let index_camp = 0; index_camp < this.campos_desgloce.length; index_camp++) {
                  const camp = this.campos_desgloce[index_camp];
                      this.info_Degloce_recepciones[camp.valor] = this.info_Degloce_recepciones[camp.valor] + dataOperacion[camp.valor]
                }
              })
              const numero = Number(parseInt(filtro[index].servicio))
              // console.log(numero);
              
              filtro[index].servicio = numero
              // console.log(filtro[index].servicio, typeof(filtro[index].servicio), filtro[index].id);
            }
            this.dataSourceRecepciones.data = filtro
            this.paginacion('recepciones')
            // console.log(filtro);
          }
        })
      }
    })
  }
  
  infoVehiculo(){
    const starCountRef = ref(db, `vehiculos/${this.idVehiculo}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.vehiculo = snapshot.val()
        this.infoCliente()
      } else {
        // console.log("No data available");
      }
    })
  }
  infoCliente(){
      const starCountRef = ref(db, `clientes/${this.vehiculo.cliente}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          let dataCliente  = {...snapshot.val()}
          // console.log(this.sucursales);
          get(child(dbRef, `sucursales/${dataCliente.sucursal}`)).then((snapSucursal) => {
            if (snapSucursal.exists()) {
              const sucu = snapSucursal.val()
              // dataCliente.dataSucurlsal = sucu
              dataCliente.nameSucursal = sucu.sucursal
            } else {
              // console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
          dataCliente.fullname = `${dataCliente.nombre} ${dataCliente.apellidos}`
          this.cliente = dataCliente
        } else {
          // console.log("No data available");
        }
      })
  }
  //   getInfoRecepciones(){
  //   const starCountRef = ref(db, `recepcion`)
  //    onValue(starCountRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       let muestra =[]
  //       let arreglo= this.crearArreglo2(snapshot.val())        
  //       let enRecepcion = arreglo.filter(filtro=>filtro.vehiculo === this.idVehiculo)
  //       // console.log(enRecepcion);
  //       enRecepcion.forEach(recepcion => {
  //          get(child(dbRef, `recepcionStatus/${recepcion.cliente}/${recepcion.vehiculo}/${recepcion.id}`)).then((snapStatus) => {
  //             if (snapStatus.exists()) {
  //               let arreglo= snapStatus.val()
  //               // let enRecepcion = arreglo.filter(filtro=>filtro.vehiculo === this.idVehiculo)
  //               // console.log(arreglo)
  //               const tempdata ={
  //                 ...arreglo,
  //                 ...recepcion,
  //                 total: 0
  //               }
  //               if (recepcion.cotizacion) {
  //                  get(child(dbRef, `cotizacionesRealizadas/${recepcion.id}`)).then((snapCotizacion) => {
  //                   if (snapCotizacion.exists()) {
  //                     // console.log(snapCotizacion.val());
  //                     let infoCotizacion = snapCotizacion.val()
  //                     let elementosCotizacion = infoCotizacion.elementos
                      
  //                     let total = 0
  //                     elementosCotizacion.forEach(elemento => {
  //                       // console.log(elemento);
                        
  //                       if (elemento.tipo === 'paquete') {
  //                         get(child(dbRef, `paquetesComplementos/${elemento.idReferencia}`)).then((snpPaquetesCompl) => {
  //                           if (snpPaquetesCompl.exists()) {
  //                             // console.log(snpPaquetesCompl.val());
  //                             let comple = this.crearArreglo2(snpPaquetesCompl.val())
  //                             comple.forEach(element => {
  //                               if (element.tipo === 'mano obra') {
  //                                 this.getinfoelemento(`manos_obra/${element.IDreferencia}`).then((valor:number)=>{                                  
  //                                   total = total + (valor * element.cantidad)
  //                                   tempdata.total = total
  //                                 })
  //                               }else{
  //                                 this.getinfoelemento(`refacciones/${element.IDreferencia}`).then((valor:number)=>{
  //                                   total = total + (valor * element.cantidad)
  //                                   tempdata.total = total
  //                                 })
  //                               }
  //                             });                              
  //                           } else {
  //                             console.log("No data available");
  //                           }
  //                         }).catch((error) => {
  //                           console.error(error);
  //                         })

  //                       }else{
  //                         if (elemento.tipo === 'MO') {
  //                           this.getinfoelemento(`manos_obra/${elemento.idReferencia}`).then((valor:number)=>{
  //                             total = total + valor                              
  //                             tempdata.total = total
  //                           })
  //                         }else{
  //                           this.getinfoelemento(`refacciones/${elemento.idReferencia}`).then((valor:number)=>{
  //                             total = total + valor
  //                             tempdata.total = total
  //                           })
  //                         }
  //                       }
  //                     })
  //                   } else {
  //                     console.log("No data available");
  //                   }
  //                 }).catch((error) => {
  //                   console.error(error);
  //                 });
  //               }
  //               muestra.push(tempdata)
  //               this.dataSource = new MatTableDataSource(muestra)
  //               this.paginacion('recepciones')
  //             } else {
  //               console.log("No data available");
  //             }
  //           })
  //       });
        
  //     } else {
  //       console.log("No data available");
  //     }
  //   })
  // }
  paginacion(tabla:string){
    setTimeout(() => {
      if (tabla ==='recepciones') {
       this.dataSourceRecepciones.paginator = this.paginatorRecepciones
       this.dataSourceRecepciones.sort = this.sortRecepciones
      }
      if (tabla ==='cotizaciones') {
        this.dataSourceCotizaciones.paginator = this.paginatorCotizaciones
        this.dataSourceCotizaciones.sort = this.sortCotizaciones
      }
    }, 500);
  }


  applyFilter(event: Event,tabla:string) {    
    const filterValue = (event.target as HTMLInputElement).value;
      if (tabla==='recepciones') {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage()
        }
      }
      if (tabla==='cotizaciones') {
        this.dataSourceCotizaciones.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceCotizaciones.paginator) {
          this.dataSourceCotizaciones.paginator.firstPage()
        }
      }
  } 
  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }

}
