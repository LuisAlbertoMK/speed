import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreSlice'
})
export class NombreSlicePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const nuevo = value.split('_')
    return   nuevo.join(' ')
  }

}
