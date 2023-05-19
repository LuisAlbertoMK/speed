import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizarUno'
})
export class CapitalizarUnoPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value){
      const cadena = String(value).toLowerCase()
      let arr =[...cadena]
      arr[0] = arr[0].toUpperCase()
      return arr.join('');
    }else{
      return ''
    }
    
  }

}
