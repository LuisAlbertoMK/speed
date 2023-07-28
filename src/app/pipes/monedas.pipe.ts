import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'monedas'
})
export class MonedasPipe implements PipeTransform {
  transform(value: number, symbol = '$'): string {
    if (!value || isNaN(value)) {
      return `${symbol} 0.00`;
    }
    
    const isNegative = value < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(value).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');
  
    const formattedValue = `${symbol} ${isNegative ? '-' : ''}${formattedIntegerPart}.${decimalPart}`;
    return formattedValue;
  }
  
  
}
