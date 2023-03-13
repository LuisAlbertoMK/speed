import { Pipe, PipeTransform } from '@angular/core';
import { push } from 'firebase/database';

@Pipe({
  name: 'monedas'
})
export class MonedasPipe implements PipeTransform {

  transform(value: number,simbolo?:string): string {
    // let nuevoValue = ``
    let symbol= '';
    (!simbolo) ? symbol = '$ ': symbol=simbolo
    if (value) {
      const val = value//12345.48
      const negativo = String(val).includes('-')
      const deciameles = String(val).includes('.')
      let  simbolo = '-', SOloNumeros = ``, deciamales=``
      let nuevoValor = ``, contador =0
      let nu_c = []
  
      if (negativo) {
        const soloNum = String(val).split('-')
        const soloNum2 = soloNum[1].split('.')
        SOloNumeros = soloNum2[0]
        contador = String(soloNum2[0]).length
        nu_c = SOloNumeros.split('')
      }else{
        simbolo = ''
        const solonum = String(val).split('.')
        SOloNumeros = solonum[0]
        contador = solonum[0].length
        nu_c = SOloNumeros.split('')
      }
      if (contador === 4) { nu_c[0]=nu_c[0] + ',' }
        if (contador === 5) { nu_c[1]=nu_c[1] + ',' }
        if (contador === 6) { nu_c[2]=nu_c[2] + ',' }
        if (contador === 7) { nu_c[0]=nu_c[0] + ','; nu_c[3]=nu_c[3] + ',' }
        if (contador === 8) { nu_c[1]=nu_c[1] + ','; nu_c[4]=nu_c[4] + ',' }
        if (contador === 9) { nu_c[2]=nu_c[2] + ','; nu_c[5]=nu_c[5] + ',' }
        if (contador === 10) { nu_c[0]=nu_c[0] + ','; nu_c[3]=nu_c[3] + ','; nu_c[6]=nu_c[6] + ',' }
        if (contador === 11) { nu_c[1]=nu_c[1] + ','; nu_c[4]=nu_c[4] + ','; nu_c[7]=nu_c[7] + ',' }
        if (contador === 12) { nu_c[2]=nu_c[2] + ','; nu_c[5]=nu_c[5] + ','; nu_c[8]=nu_c[8] + ',' }
        if (contador === 13) { nu_c[0]=nu_c[0] + ','; nu_c[3]=nu_c[3] + ','; nu_c[6]=nu_c[6] + ',' ; nu_c[9]=nu_c[9] + ',' }
        nuevoValor = `${symbol}${simbolo} ${nu_c.join('')}`
      if (deciameles) {
        const deciamal = String(val).split('.')
        let split_Decimales:string = deciamal[1].slice(0,2)
        if (split_Decimales.length<2) {
          split_Decimales = split_Decimales + '0'
        }
        nuevoValor = `${nuevoValor}.${split_Decimales}`
      }else{
        nuevoValor = `${nuevoValor}.00`
      }
      return nuevoValor
      }else{
          return `${symbol} 0.00`
      }

  }

  
  
}
