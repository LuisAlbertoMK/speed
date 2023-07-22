import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenamiento'
})
export class OrdenamientoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
