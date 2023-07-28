import { Injectable } from '@angular/core';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from './servicios-publicos.service';
import { SucursalesService } from './sucursales.service';
import { CamposSystemService } from './campos-system.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Injectable({
  providedIn: 'root'
})
export class ReporteGastosService {

  constructor(private _publicos: ServiciosPublicosService, private _sucursales: SucursalesService, private _campos: CamposSystemService) { }

  sucursal_array = [...this._sucursales.lista_en_duro_sucursales]
  formas_pago_arra = [...this._campos.MetodosPago]

  
  gastos_hoy(data:any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const { ruta} = data
      const starCountRef = ref(db, ruta);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          let clientes = []
            const nuevos  = this._publicos.crearArreglo2(snapshot.val())
            clientes = nuevos.map(g=>{
              g.sucursalShow = this.sucursal_array.find(s=>s.id === g.sucursal).sucursal
              g.metodoShow = this.formas_pago_arra.find(m=>String(m.metodo) === String(g.metodo)).show
              return g
            })
          resolve(clientes);
        } else {
          resolve([]);
        }
      }, {
        onlyOnce: true
      });
    });
  }
  gastos_hoy_sobrante_anterior(data:any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const { ruta} = data
      const starCountRef = ref(db, ruta);
      onValue(starCountRef, (snapshot) => {
        console.log('aqui');
        
        if (snapshot.exists()) {
          resolve(true);
        } else {
          resolve(false)
        }
      }, {
        onlyOnce: true
      });
      
    });
  }
  historial_gastos_operacion(data:any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const {sucursal, ruta} = data
      const starCountRef = ref(db, ruta);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          // console.log(sucursal);
          let clientes = []
          if (sucursal !== 'Todas') {
            const nuevos  = this._publicos.crearArreglo2(snapshot.val())
            clientes = nuevos.map(g=>{
              g.sucursalShow = this.sucursal_array.find(s=>s.id === g.sucursal).sucursal
              g.metodoShow = this.formas_pago_arra.find(m=>String(m.metodo) === String(g.metodo)).show
              return g
            })
          }
          resolve(clientes);
        } else {
          resolve([]);
        }
      }, {
        onlyOnce: true
      });
    });
  }
  historial_gastos_orden(data:any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const {sucursal, ruta} = data
      const starCountRef = ref(db, ruta);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          // console.log(sucursal);
          let clientes = []
          if (sucursal !== 'Todas') {
            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childData = childSnapshot.val();
              Object.entries(childData).forEach(([key, entrie])=>{
                const entri_ = Object(entrie)
                entri_.sucursalShow = this.sucursal_array.find(s=>s.id === entri_.sucursal).sucursal
                entri_.metodoShow = this.formas_pago_arra.find(m=>String(m.metodo) === String(entri_.metodo)).show
                const nueva:any= {...entri_, id: key}
                clientes.push(nueva)
              })
            });
          }
          resolve(clientes);
        } else {
          resolve([]);
        }
      }, {
        onlyOnce: true
      });
    });
  }

  fecha_numeros_sin_Espacions(fecha_){
    let fecha = (fecha_)? fecha_ : new Date()
    const  dia = fecha.getDate().toString().padStart(2, '0')
    const  mes = (fecha.getMonth()+1).toString().padStart(2, '0')
    const  year = fecha.getFullYear()
    return `${dia}${mes}${year}`
  }
  reporte_gastos_general(data:any[]){
    const tipos = ['deposito','operacion', 'sobrante', 'gasto','orden']
    const arreglos = { deposito: [], operacion: [], sobrante:[], gasto: [], orden:[]}
    const reporte_general =  {deposito: 0, operacion: 0, sobrante:0, gasto: 0, orden:0}
    let sobrante = 0
    data.forEach(arr=>{
      tipos.forEach(tipo=>{
        if (tipo === arr.tipo && tipo !=='sobrante' ) {
          arreglos[tipo].push(arr)
          reporte_general[tipo] += arr.monto
        }else if (tipo === arr.tipo && tipo ==='sobrante') {
          sobrante += arr.monto
        }
      })
    })
    function convertirAPositivo(numero: number): number {
      return Math.abs(numero);
    }

    // console.log(arreglos);
    const convierte= ['gasto','orden','operacion']
    const convertidos = {gasto:0,orden:0, operacion:0 }
    
    convierte.forEach(c=>{
       convertidos[c] = convertirAPositivo(reporte_general[c])
    })
    let suma_convertidos = convertidos.gasto + convertidos.operacion + convertidos.orden
    if (sobrante >= 0) {
      reporte_general.deposito += sobrante
      reporte_general.sobrante = reporte_general.deposito -  (suma_convertidos)
    }else{
      
      const con = convertirAPositivo(sobrante)
      const resultado_depositos = reporte_general.deposito - con
      reporte_general.deposito = resultado_depositos
      reporte_general.sobrante = (resultado_depositos) -  (suma_convertidos)
    }
    return {
      deposito: reporte_general.deposito,
      operacion: reporte_general.operacion,
      sobrante: reporte_general.sobrante,
      gasto: reporte_general.gasto,
      orden: reporte_general.orden,
    }
  }

  reporte_gastos_sucursal_unica(data:any[]){
    const tipos = ['deposito','operacion', 'sobrante', 'gasto','orden']
    const arreglos = { deposito: [], operacion: [], sobrante:[], orden:[]}
    const reporte_general =  {deposito: 0, operacion: 0, sobrante:0, orden:0}
    let sobrante = 0
    data.forEach(arr=>{
      if (arr.status) {
        tipos.forEach(tipo=>{
          if (tipo === arr.tipo && tipo !=='sobrante' ) {
            arreglos[tipo].push(arr)
            reporte_general[tipo] += arr.monto
          }else if (tipo === arr.tipo && tipo ==='sobrante') {
            sobrante += arr.monto
          }
        })
      }
    })
    function convertirAPositivo(numero: number): number {
      return Math.abs(numero);
    }
    const convierte= ['gasto','orden','operacion']
    const convertidos = {gasto:0,orden:0, operacion:0 }
    convierte.forEach(c=>{
      convertidos[c] = convertirAPositivo(reporte_general[c])
   })
   let suma_convertidos = convertidos.gasto + convertidos.operacion + convertidos.orden
   if (sobrante >= 0) {
     reporte_general.deposito += sobrante
     reporte_general.sobrante = reporte_general.deposito -  (suma_convertidos)
   }else{
     
     const con = convertirAPositivo(sobrante)
     const resultado_depositos = reporte_general.deposito - con
     reporte_general.deposito = resultado_depositos
     reporte_general.sobrante = (resultado_depositos) -  (suma_convertidos)
   }
   return reporte_general
  }
  totales_arreglo_(data){
    const {arreglo, facturaRemision} = data
    const data_ = {total:0, subtotal:0, iva:0}
    let  _total =0
    const nuevo_arreglo = (arreglo) ? arreglo : []
    nuevo_arreglo.forEach(element => {
      const {status, monto} = element
      if (status) _total += monto 
    });
    if(facturaRemision === 'factura'){
      data_.total = _total
      data_.iva = _total / 1.16
      data_.subtotal = _total - (_total / 1.16)
    }else if(facturaRemision === 'nota'){
      data_.total = _total
      data_.iva = 0
      data_.subtotal = _total
    }
    
    return data_
  }
  reporte_gastos_sucursal(data:any[], sucursal:string){

    const tipos = ['deposito','operacion', 'sobrante', 'gasto','orden']
    const arreglos = { deposito: [], operacion: [], sobrante:[], gasto: [], orden:[]}
    const reporte_general =  {deposito: 0, operacion: 0, sobrante:0, gasto: 0, orden:0}
    let sobrante = 0
    const filtro_sucursal = data.filter(reporte=>reporte.sucursal === sucursal)
    filtro_sucursal.forEach(arr=>{
      tipos.forEach(tipo=>{
        if (tipo === arr.tipo && tipo !=='sobrante' ) {
          arreglos[tipo].push(arr)
          reporte_general[tipo] += arr.monto
        }else if (tipo === arr.tipo && tipo ==='sobrante') {
          sobrante += arr.monto
        }
      })
    })
    
    function convertirAPositivo(numero: number): number {
      return Math.abs(numero);
    }

    // console.log(arreglos);
    const convierte= ['gasto','orden','operacion']
    const convertidos = {gasto:0,orden:0, operacion:0 }
    
    convierte.forEach(c=>{
       convertidos[c] = convertirAPositivo(reporte_general[c])
    })
    let suma_convertidos = convertidos.gasto + convertidos.operacion + convertidos.orden
    if (sobrante >= 0) {
      reporte_general.deposito += sobrante
      reporte_general.sobrante = reporte_general.deposito -  (suma_convertidos)
    }else{
      
      const con = convertirAPositivo(sobrante)
      const resultado_depositos = reporte_general.deposito - con
      reporte_general.deposito = resultado_depositos
      reporte_general.sobrante = (resultado_depositos) -  (suma_convertidos)
    }
    return {
      deposito: reporte_general.deposito,
      operacion: reporte_general.operacion,
      sobrante: reporte_general.sobrante,
      gasto: reporte_general.gasto,
      orden: reporte_general.orden,
    }
  }
  nombresServicios(data:any[]){
    let nombres = []
      data.forEach(n=> { nombres.push(String(n.nombre).toLowerCase()) })
    return nombres.join(', ')
  }

  consultaSobrante(ruta): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, ruta);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const monto = snapshot.val();
          resolve(monto);
        } else {
          resolve([]);
        }
      });
    });
  }
}
