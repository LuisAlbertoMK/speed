import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercase'
})
export class UppercasePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let valor_new = value
    if(valor_new === undefined || valor_new === null || valor_new === '') return ''
    return valor_new.toUpperCase();
  }

}
