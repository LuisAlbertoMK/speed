import { Injectable } from '@angular/core';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());
@Injectable({
  providedIn: 'root'
})
export class ReporteGastosService {

  constructor() { }

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
