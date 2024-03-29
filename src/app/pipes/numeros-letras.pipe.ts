import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numerosLetras'
})
export class NumerosLetrasPipe implements PipeTransform {

//   transform(num: number, ...args: unknown[]): unknown {
//    let unidad, decena, centenas, cientos
//    if (!num) {
//     return `0 PESOS M.N`
//    }else{
    

//     function Unidades(num){

//         switch(num)
//         {
//             case 1: return 'UN';
//             case 2: return 'DOS';
//             case 3: return 'TRES';
//             case 4: return 'CUATRO';
//             case 5: return 'CINCO';
//             case 6: return 'SEIS';
//             case 7: return 'SIETE';
//             case 8: return 'OCHO';
//             case 9: return 'NUEVE';
//         }
    
//         return '';
//       }//Unidades()
//       function Decenas(num){
  
//         decena = Math.floor(num/10);
//         unidad = num - (decena * 10);
    
//         switch(decena)
//         {
//             case 1:
//                 switch(unidad)
//                 {
//                     case 0: return 'DIEZ'
//                     case 1: return 'ONCE'
//                     case 2: return 'DOCE'
//                     case 3: return 'TRECE'
//                     case 4: return 'CATORCE'
//                     case 5: return 'QUINCE'
//                     default: return 'DIECI' + Unidades(unidad);
//                 }
//             case 2:
//                 switch(unidad)
//                 {
//                     case 0: return 'VEINTE';
//                     default: return 'VEINTI ' + Unidades(unidad);
//                 }
//             case 3: return DecenasY('TREINTA', unidad);
//             case 4: return DecenasY('CUARENTA', unidad);
//             case 5: return DecenasY('CINCUENTA', unidad);
//             case 6: return DecenasY('SESENTA', unidad);
//             case 7: return DecenasY('SETENTA', unidad);
//             case 8: return DecenasY('OCHENTA', unidad);
//             case 9: return DecenasY('NOVENTA', unidad);
//             case 0: return Unidades(unidad);
//         }
//     }//Unidades()
//     function DecenasY(strSin, numUnidades) {
//       if (numUnidades > 0)
//       return strSin + ' Y ' + Unidades(numUnidades)
  
//       return strSin;
//     }//DecenasY()
//     function Centenas(num) {
//       centenas = Math.floor(num / 100);
//       let decenas = num - (centenas * 100);
  
//       switch(centenas)
//       {
//           case 1:
//               if (decenas > 0)
//                   return 'CIENTO ' + Decenas(decenas);
//               return 'CIEN';
//           case 2: return 'DOSCIENTOS ' + Decenas(decenas);
//           case 3: return 'TRESCIENTOS ' + Decenas(decenas);
//           case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
//           case 5: return 'QUINIENTOS ' + Decenas(decenas);
//           case 6: return 'SEISCIENTOS ' + Decenas(decenas);
//           case 7: return 'SETECIENTOS ' + Decenas(decenas);
//           case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
//           case 9: return 'NOVECIENTOS ' + Decenas(decenas);
//       }
  
//       return Decenas(decenas);
//     }//Centenas()
//     function Seccion(num, divisor, strSingular, strPlural) {
//       cientos = Math.floor(num / divisor)
//       let resto = num - (cientos * divisor)
  
//       let letras = '';
  
//       if (cientos > 0)
//           if (cientos > 1)
//               letras = Centenas(cientos) + ' ' + strPlural;
//           else
//               letras = strSingular;
  
//       if (resto > 0)
//           letras += ' ';
  
//       return letras;
//     }//Seccion()
//     function Miles(num) {
//       let divisor = 1000;
//       let cientos = Math.floor(num / divisor)
//       let resto = num - (cientos * divisor)
  
//       let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
//       let strCentenas = Centenas(resto);
  
//       if(strMiles == '')
//           return strCentenas;
  
//       return strMiles + ' ' + strCentenas;
//     }//Miles()
//     function Millones(num) {
//       let divisor = 1000000;
//       let cientos = Math.floor(num / divisor)
//       let resto = num - (cientos * divisor)
  
//       let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE')
//       let strMiles = Miles(resto);
  
//       if(strMillones == '')
//           return strMiles;
  
//       return strMillones + ' ' + strMiles;
//       }//Millones()
//       function NumeroALetras(num) {
//         var data = {
//             numero: num,
//             enteros: Math.floor(num),
//             centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
//             letrasCentavos: '',
//             letrasMonedaPlural: 'PESOS M.N',//“PESOS”, 'Dólares', 'Bolívares', 'etcs'
//             letrasMonedaSingular: 'PESO M.N', //“PESO”, 'Dólar', 'Bolivar', 'etc'
    
//             letrasMonedaCentavoPlural: 'CENTAVOS',
//             letrasMonedaCentavoSingular: 'CENTAVO'
//         };
    
//         if (data.centavos > 0) {
//             data.letrasCentavos = 'CON ' + (function (){
//                 if (data.centavos == 1)
//                     return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
//                 else
//                     return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
//                 })();
//         };
    
//         if(data.enteros == 0)
//             return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
//         if (data.enteros == 1)
//             return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
//         else
//             return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
//       }//NumeroALetras()
//       return NumeroALetras(num)
//    }
    
//   }

    convertirNumeroALetras(numero: number) {
        const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
      const decenas = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
      const decenasSuperiores = ['veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
      const centenas = ['cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    
      if (numero < 10) {
        return unidades[numero];
      } else if (numero < 20) {
        return decenas[numero - 10];
      } else if (numero < 100) {
        const decena = Math.floor(numero / 10);
        const unidad = numero % 10;
        return decenasSuperiores[decena - 2] + (unidad !== 0 ? ' y ' + unidades[unidad] : '');
      } else if (numero < 1000) {
        const centena = Math.floor(numero / 100);
        const resto = numero % 100;
        if (resto === 0) {
          return centenas[centena - 1];
        } else {
          return centenas[centena - 1] + ' ' + this.convertirNumeroALetras(resto);
        }
      } else if (numero < 1000000) {
        const miles = Math.floor(numero / 1000);
        const resto = numero % 1000;
        if (resto === 0) {
          return this.convertirNumeroALetras(miles) + ' mil';
        } else {
          return this.convertirNumeroALetras(miles) + ' mil ' + this.convertirNumeroALetras(resto);
        }
      } else {
        return 'Número fuera de rango';
      }
    }
    transform(numero: number): string {

        const parteEntera = Math.floor(numero);
        const centavos = Math.round((numero - parteEntera) * 100);
      
        let resultado = this.convertirNumeroALetras(parteEntera) + ' pesos';
      
        if (centavos > 0) {
          resultado += ' con ' + this.convertirNumeroALetras(centavos) + ' centavos';
        }
      
        return String(resultado).toUpperCase();
      }
}
