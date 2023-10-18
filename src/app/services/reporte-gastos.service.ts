import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReporteGastosService {

  constructor() { }

  fecha_numeros_sin_Espacions(fecha_){
    let fecha = (fecha_)? fecha_ : new Date()
    const  dia = fecha.getDate().toString().padStart(2, '0')
    const  mes = (fecha.getMonth()+1).toString().padStart(2, '0')
    const  year = fecha.getFullYear()
    return `${dia}${mes}${year}`
  }
  

  reporte_gastos_sucursal_unica(data:any[]){
    let nueva = [...data]
    const tipos = ['deposito', 'operacion', 'sobrante', 'gasto', 'orden'];
    const reporte_general = { deposito: 0, operacion: 0, sobrante: 0, orden: 0, restante:0 };
    
    nueva.forEach(({ tipo, monto, status }) => {
      if (status && tipos.includes(tipo)) reporte_general[tipo] += monto;
    });

    const { deposito, operacion, sobrante, orden } = reporte_general;

    const gastos:number = operacion + orden
    const suma_positivos:number = deposito + sobrante

    reporte_general.restante = suma_positivos - gastos;

    return reporte_general;
    
  }
  

}
