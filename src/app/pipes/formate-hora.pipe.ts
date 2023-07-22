import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formateHora'
})
export class FormateHoraPipe implements PipeTransform {

  transform(fecha: string, incluirHora: boolean = false, ...args: unknown[]): string {
    const fechaObj = new Date(fecha);
      const dia = fechaObj.getUTCDate();
      const mes = fechaObj.getUTCMonth() + 1; // Los meses en JavaScript son base 0, por eso se suma 1
      const anio = fechaObj.getUTCFullYear();
      const hora = fechaObj.getUTCHours();
      const minutos = fechaObj.getUTCMinutes();
    
      let fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;
    
      if (incluirHora) {
        fechaFormateada += ` ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      }
    
      return fechaFormateada;
  }

}
