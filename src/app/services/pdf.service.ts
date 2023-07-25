import { Injectable } from '@angular/core';

import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";
import { ServiciosPublicosService } from './servicios-publicos.service';



pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  formasPago=[
    {id:'1',pago:'contado',interes:0,numero:0},
    {id:'2',pago:'3 meses',interes:4.49,numero:3},
    {id:'3',pago:'6 meses',interes:6.99,numero:6},
    {id:'4',pago:'9 meses',interes:9.90,numero:9},
    {id:'5',pago:'12 meses',interes:11.95,numero:12},
    {id:'6',pago:'18 meses',interes:17.70,numero:18},
    {id:'7',pago:'24 meses',interes:24.,numero:24}
  ]
  constructor(public _publicos:ServiciosPublicosService) { }
  async pdf(data:any,detalles:boolean){

    const {data_cliente, data_sucursal, data_vehiculo, fecha_recibido, vencimiento} = data
    const empresaShow = (data_cliente.empresaShow ) ? data_cliente.empresaShow : ''
    function table(data, columns, witdhsDef, showHeaders, headers, layoutDef) {
      return {
          table: {
              headerRows: 1,
              widths: witdhsDef,
              body: buildTableBody(data, columns, showHeaders, headers)
          },
          layout: layoutDef
      };
    }
    const nuevasdocumentDefinitionimages = {}
      nuevasdocumentDefinitionimages['logo'] = `${(await bases('../../assets/logoSpeedPro/Logo-Speedpro.png')).url}`
      async function bases(URL:any) {
        const dataaa = {url: '', logo:''}
        await getBase64ImageFromURL(URL).then((val:any)=>{
          dataaa.url = val
        })
        return dataaa
      }
      function getBase64ImageFromURL(url:string) {
        return new Promise((resolve, reject) => {
          var img = new Image();
          img.setAttribute("crossOrigin", "anonymous");
          img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
          };
          img.onerror = error => {
            reject(error);
          };
          img.src = url;
        });
      }

    
    
    function transform(value: number): string {
      // let nuevoValue = ``
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
          nuevoValor = `$ ${simbolo} ${nu_c.join('')}`
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
            return `$ 0.00`
        }
  
    }
    function letras(num: number, ...args: unknown[]): unknown {
      let unidad, decena, centenas, cientos
      if (!num) {
       return `0 PESOS M.N`
      }else{
       
   
       function Unidades(num){
   
           switch(num)
           {
               case 1: return 'UN';
               case 2: return 'DOS';
               case 3: return 'TRES';
               case 4: return 'CUATRO';
               case 5: return 'CINCO';
               case 6: return 'SEIS';
               case 7: return 'SIETE';
               case 8: return 'OCHO';
               case 9: return 'NUEVE';
           }
       
           return '';
         }//Unidades()
         function Decenas(num){
     
           decena = Math.floor(num/10);
           unidad = num - (decena * 10);
       
           switch(decena)
           {
               case 1:
                   switch(unidad)
                   {
                       case 0: return 'DIEZ'
                       case 1: return 'ONCE'
                       case 2: return 'DOCE'
                       case 3: return 'TRECE'
                       case 4: return 'CATORCE'
                       case 5: return 'QUINCE'
                       default: return 'DIECI' + Unidades(unidad);
                   }
               case 2:
                   switch(unidad)
                   {
                       case 0: return 'VEINTE';
                       default: return 'VEINTI ' + Unidades(unidad);
                   }
               case 3: return DecenasY('TREINTA', unidad);
               case 4: return DecenasY('CUARENTA', unidad);
               case 5: return DecenasY('CINCUENTA', unidad);
               case 6: return DecenasY('SESENTA', unidad);
               case 7: return DecenasY('SETENTA', unidad);
               case 8: return DecenasY('OCHENTA', unidad);
               case 9: return DecenasY('NOVENTA', unidad);
               case 0: return Unidades(unidad);
           }
       }//Unidades()
       function DecenasY(strSin, numUnidades) {
         if (numUnidades > 0)
         return strSin + ' Y ' + Unidades(numUnidades)
     
         return strSin;
       }//DecenasY()
       function Centenas(num) {
         centenas = Math.floor(num / 100);
         let decenas = num - (centenas * 100);
     
         switch(centenas)
         {
             case 1:
                 if (decenas > 0)
                     return 'CIENTO ' + Decenas(decenas);
                 return 'CIEN';
             case 2: return 'DOSCIENTOS ' + Decenas(decenas);
             case 3: return 'TRESCIENTOS ' + Decenas(decenas);
             case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
             case 5: return 'QUINIENTOS ' + Decenas(decenas);
             case 6: return 'SEISCIENTOS ' + Decenas(decenas);
             case 7: return 'SETECIENTOS ' + Decenas(decenas);
             case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
             case 9: return 'NOVECIENTOS ' + Decenas(decenas);
         }
     
         return Decenas(decenas);
       }//Centenas()
       function Seccion(num, divisor, strSingular, strPlural) {
         cientos = Math.floor(num / divisor)
         let resto = num - (cientos * divisor)
     
         let letras = '';
     
         if (cientos > 0)
             if (cientos > 1)
                 letras = Centenas(cientos) + ' ' + strPlural;
             else
                 letras = strSingular;
     
         if (resto > 0)
             letras += ' ';
     
         return letras;
       }//Seccion()
       function Miles(num) {
         let divisor = 1000;
         let cientos = Math.floor(num / divisor)
         let resto = num - (cientos * divisor)
     
         let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
         let strCentenas = Centenas(resto);
     
         if(strMiles == '')
             return strCentenas;
     
         return strMiles + ' ' + strCentenas;
       }//Miles()
       function Millones(num) {
         let divisor = 1000000;
         let cientos = Math.floor(num / divisor)
         let resto = num - (cientos * divisor)
     
         let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE')
         let strMiles = Miles(resto);
     
         if(strMillones == '')
             return strMiles;
     
         return strMillones + ' ' + strMiles;
         }//Millones()
         function NumeroALetras(num) {
           var data = {
               numero: num,
               enteros: Math.floor(num),
               centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
               letrasCentavos: '',
               letrasMonedaPlural: 'PESOS M.N',//“PESOS”, 'Dólares', 'Bolívares', 'etcs'
               letrasMonedaSingular: 'PESO M.N', //“PESO”, 'Dólar', 'Bolivar', 'etc'
       
               letrasMonedaCentavoPlural: 'CENTAVOS',
               letrasMonedaCentavoSingular: 'CENTAVO'
           };
       
           if (data.centavos > 0) {
               data.letrasCentavos = 'CON ' + (function (){
                   if (data.centavos == 1)
                       return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                   else
                       return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
                   })();
           };
       
           if(data.enteros == 0)
               return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
           if (data.enteros == 1)
               return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
           else
               return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
         }//NumeroALetras()
         return NumeroALetras(num)
      }
       
    }
    function transformName(value: string, ...args: unknown[]): unknown {
      const cadena = String(value).toLowerCase()
      let arr =[...cadena]
      arr[0] = arr[0].toUpperCase()
      return arr.join('');
    }
    function transformUppercase(value: string, ...args: unknown[]): unknown {
      return value.toUpperCase();
    }
    
    function buildTableBody(data, columns, showHeaders, headers) {
      var body = [];
      if(showHeaders) {
        body.push(headers);
      }
      data.forEach(function (row) {
          var dataRow = [];
          var i = 0;
          // console.log(row);
          if(row['costo'] > 0){
            row['flotilla2'] = transform(row['total'])
            row['costoShow'] = transform(row['costo'])
            row['normal'] = transform(row['total'] * 1.30)
            row['nombre'] = transformName(row['nombre'])
            columns.forEach(function(column) {
              dataRow.push({text: Object(row, column), alignment: headers[i].alignmentChild,style:'content' });
              i++;
              })
          }else{
            row['flotilla2'] = transform(row['total'])
            row['costoShow'] = transform(row['precio'])
            row['normal'] = transform(row['total'] * 1.30)
            row['nombre'] = transformName(row['nombre'])
            columns.forEach(function(column) {
              dataRow.push({text: Object(row, column), alignment: headers[i].alignmentChild,style:'content' });
          i++;
          })
          }
          
          body.push(dataRow);
    
      })
      return body;
    }
    function Object(o, s) {
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in o) {
              o = o[k];
          } else {
              return;
          }
      }
      return o;
    }
    function table2(data, columns, witdhsDef, showHeaders, headers, layoutDef,detalles:boolean) {
      return {
          table: {
              headerRows: 1,
              widths: witdhsDef,
              body: buildTableBody2(data, columns, showHeaders, headers,detalles)
          },
          layout: layoutDef
      };
    }
    function buildTableBody2(data, columns, showHeaders, headers,detalles:boolean) {
          var body = [];
          if(showHeaders) {
          body.push(headers);
          }
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if (element.tipo === 'paquete') {
              let dataRow=[]
              let data2 =[]
              let elementosColumnas = element.elementos
              let i = 0;
              elementosColumnas.forEach((column:any)=> {
                i++       
                         
                if (detalles) {
                  // ( ${column.flotilla} )
                  data2.push(` ${i}.- ${capUno(column.nombre)} ( ${transform(column['total'])} ) `)
                }else{
                  data2.push(` ${i}.- ${capUno(column.nombre)} `)
                }
              })
              dataRow.push({
                  columns: [
                    {width: '30%', text: `Paquete ${capUno(data[index].nombre)} `,style:'content'},
                    {width: '70%',
                        // to treat a paragraph as a bulleted list, set an array of items under the ul key
                        text: data2, style:'content'
                  },
                  ]
              })
              body.push(dataRow);
            }
          }
          return body;
    }
      const colorTextoPDF: string = '#1215F4';
      const documentDefinition = {
        footer: function(currentPage, pageCount) {
          return [
            {
              columns: [
                {
                  width: '80%',
                  text: ` `,
                },
                {
                  width: '20%',
                  text: `página ${currentPage.toString()}  de  ${pageCount}`,
                }
              ]
            }
          ]
        },
        header: function(currentPage, pageCount, pageSize) {

          return [
            {
              columns: [
                {
                  width: '100%',
                  text: ` `,
                }
              ]
            }
          ]
        },
        content: [
          {
            layout: 'noBorders',
            table: {
              headerRows: 0,
              widths: [ '*','40%' ],
              body: [
                [ { text: 'Operadora de Servicios Automotrices integrales del Centro del pais Speed Service GAFEAG SA De CV',
                bold: true, alignment: 'center', style:'operadora' },
                {
                  image: `logo`,
                  height: 70,
                  width: 190,
                  aling: 'center',
                  valing: 'center'
                }
              ],
              ]
            }
          },
          {
            columns: [
              {
                width: '100%',
                text: ` `,
              }
            ],
            columnGap: 10,
          },
          {
            columns: [
              {
                width: '100%',
                text: `${data_sucursal.sucursal},${data_sucursal.direccion}, ${data_sucursal.correo}, Tel. ${data_sucursal.telefono}`,
                style: 'sucursal'
              }
            ],
            columnGap: 10,
          },
          {
            text: '', margin: 5
          },
          {
            columns: [
              {width: '15%', text: 'Fecha', style:'title' },
              {width: '35%', text: `${transforma_hora(fecha_recibido, true)}`,  style:'info' },
              {width: '15%', text: 'Promocion', style:'title' },
              {width: '35%', text: `FLOTILLA`,  style:'info'  },
            ]
          },
          {
            columns: [
              {width: '15%', text: 'Cliente', style:'title' },
              {width: '35%', text: `${transformUppercase(data_cliente.nombre)} ${transformUppercase(data_cliente.apellidos)}`,  style:'info'},
              {width: '15%', text: 'COT#', style:'title' },
              {width: '35%', text: `${transformUppercase(data.no_cotizacion)}`,  style:'info'},
            ]
          },
          {
            columns: [
              {width: '15%', text: 'no. Cliente.', style:'title' },
              {width: '35%', text: `${data_cliente.no_cliente}`,  style:'info'},
              {width: '15%', text: 'Mail', style:'title' },
              {width: '35%', text: `${data_cliente.correo}`,  style:'info'},
            ]
          },
          {
            columns: [
              {width: '15%', text: 'Tel.', style:'title' },
              {width: '35%', text: `${data_cliente.telefono_movil}`, style:'info' },
              {width: '15%', text: 'Tipo', style:'title' },
              {width: '35%', text: `${transformUppercase(data_cliente.tipo)}`,  style:'info'},
            ]
          },
          {
            columns: [
              {width: '15%', text: 'Empresa', style:'title' },
              {width: '35%', text: `${empresaShow}`, style:'info' },
              {width: '15%', text: 'Cilidros', style:'title' },
              {width: '35%', text: `${data_vehiculo.cilindros}`,  style:'info'},
            ]
          },
          {
            columns: [
              {width: '15%', text: 'Marca', style:'title' },
              {width: '35%', text: `${transformUppercase(data_vehiculo.marca)}`,  style:'info'},
              {width: '15%', text: 'Modelo', style:'title' },
              {width: '35%', text: `${data_vehiculo.modelo}`, style:'info' },
            ]
          },
          {
            columns: [
              {width: '15%', text: 'Placas', style:'title' },
              {width: '35%', text: `${transformUppercase(data_vehiculo.placas)}`,  style:'info'},
              {width: '10%', text: 'Color', style:'title' },
              {width: '12.5%', text: `${data_vehiculo.color}`,  style:'info'},
              {width: '12.5%', text: 'Año', style:'title' },
              {width: '12.5%', text: `${data_vehiculo.anio}`, style:'info' },
            ]
          },
          {
            columns: [
              {width: '15%', text: 'KMS', style:'title' },
              {width: '35%', text: ``,  style:'info'},
              {width: '10%', text: 'Motor', style:'title' },
              {width: '12.5%', text: `${data_vehiculo.no_motor}`,  style:'info'},
              {width: '12.5%', text: 'O.S', style:'title' },
              {width: '12.5%', text: ``,  style:'info'},
            ]
          },
          // {
          //   columns: [
          //     {width: '100%', text: ' ',  }
          //   ]
          // },
          {
            layout: 'noBorders',
            table: {
              widths: [ '100%' ],
              body: [

                [ { text: `${''}`, style:'medium', alignment: 'center', alignmentChild: 'center'}  ]
              ]
            }
          },
          {
            columns: [
              {width: '100%', text: ' '},
            ]
          },
          table(
            data['elementos'],
            ['tipo','nombre','cantidad','costoShow','normal','flotilla2'],
            ['10%', '35%','10%', '15%','15%','15%'],
            true,
            [ {text:'Tipo', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
              {text:'Nombre', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
              {text:'Cantidad', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
              {text:'Precio Unitario', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'right'},
              {text:'Precio Normal', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'right'},
              {text:'Precio Flotilla', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'right'}],
            ''),
          {
              columns: [
                {width: '100%', text: ' '},
              ]
          },
          table2(
            data['elementos'],
              ['nombre'],
              ['100%'],
              true,
              [ {text:'Descripción de servicios', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'}],
          '',detalles),
          {
                columns: [
                  {width: '100%', text: ' '},
                ]
          },
          {
                columns: [
                  {width: '100%', text: `Nota: ${data.nota}`,style:'content'},
                ]
          },
          {
                columns: [
                  {width: '100%', text: ' '},
                ]
          },


        ],
        styles: {
          header: { fontSize: 14,bold: true,align: 'center'},
          info: { fontSize: 9,bold: true,align: 'center',color: colorTextoPDF},
          title: { fontSize: 9,bold: true,align: 'center'},
          sucursal: { fontSize: 10,bold: true,align: 'center'},
          operadora: { fontSize: 14,bold: true,align: 'center'},
          medium: { fontSize: 14,bold: true,color:colorTextoPDF },
          content:{fontSize:8,color: 'black'},
          normal:{fontSize:10,color: 'red'},
          importeLetras:{fontSize:10,bold: true},
          detallesPaquetes:{fontSize:9,color: 'black'},
          terminos:{ fontSize:8},
          anotherStyle: { italics: true, align: 'center'},
          vencimiento: { italics: true, align: 'right', color: 'red', fontSize: 8}
        },
        images:{},
        alignment: {alignment:'right'}
      }

    
      
      if(data.formaPago === '1') {
        const contenido =documentDefinition.content
        //preguntar si se incluira iva
        if(data.iva ){
          if (data['reporte'].descuento>0) {
            documentDefinition.content = [...contenido,
              {
                layout: 'noBorders',
                table: {
                  headerRows: 0,
                  // widths: [ '*',100,100 ],
                  widths: [ '*', 100, 100 ],
                  body: [
                    [ { text: '', bold: true, alignment: 'center', style:'terminos' }, '', '' ],
                    [ { text: '', bold: true, alignment: 'center', style:'terminos' },
                      { text: `Forma de pago:`, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `Contado`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: 'Importe con letra', bold: true, alignment: 'center', style:'sucursal' },
                      { text: `subtotal: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].subtotal)}`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: `${letras(data['reporte'].total)}`, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `Descuento: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].descuento)}`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: ``, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `IVA: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].iva)}`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: ``, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `Total contado: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].total)}`, bold: true, alignment: 'right', style:'sucursal'}
                    ]
                  ]
                }
              }
            ]
          }else{
            documentDefinition.content = [...contenido,
              {
                layout: 'noBorders',
                table: {
                  headerRows: 0,
                  // widths: [ '*',100,100 ],
                  widths: [ '*', 100, 100 ],
                  body: [
                    [ { text: '', bold: true, alignment: 'center', style:'terminos' }, '', '' ],
                    [ { text: '', bold: true, alignment: 'center', style:'terminos' },
                      { text: `Forma de pago:`, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `Contado`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: 'Importe con letra', bold: true, alignment: 'center', style:'sucursal' },
                      { text: `subtotal: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].subtotal)}`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: `${letras(data['reporte'].total)}`, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `IVA: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].iva)}`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: ``, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `Total contado: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].total)}`, bold: true, alignment: 'right', style:'sucursal'}
                    ]
                  ]
                }
              }
            ]
          }
        }else{
          if (data['reporte'].descuento>0) {
            documentDefinition.content = [...contenido,
              {
                layout: 'noBorders',
                table: {
                  headerRows: 0,
                  // widths: [ '*',100,100 ],
                  widths: [ '*', 100, 100 ],
                  body: [
                    [ { text: '', bold: true, alignment: 'center', style:'terminos' }, '', '' ],
                    [ { text: '', bold: true, alignment: 'center', style:'terminos' },
                      { text: `Forma de pago:`, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `Contado`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: 'Importe con letra', bold: true, alignment: 'center', style:'sucursal' },
                      { text: ``, bold: true, alignment: 'right', style:'sucursal' },
                      { text: ``, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: `${letras(data['reporte'].total)}`, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `Descuento: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].descuento)}`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: ``, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `subtotal: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].subtotal)}`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: ``, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `Total contado: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].total)}`, bold: true, alignment: 'right', style:'sucursal'}
                    ]
                  ]
                }
              }
            ]
          }else{
            documentDefinition.content = [...contenido,
              {
                layout: 'noBorders',
                table: {
                  headerRows: 0,
                  // widths: [ '*',100,100 ],
                  widths: [ '*', 100, 100 ],
                  body: [
                    [ { text: '', bold: true, alignment: 'center', style:'terminos' }, '', '' ],
                    [ { text: '', bold: true, alignment: 'center', style:'terminos' },
                      { text: `Forma de pago:`, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `Contado`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: 'Importe con letra', bold: true, alignment: 'center', style:'sucursal' },
                      { text: ``, bold: true, alignment: 'right', style:'sucursal' },
                      { text: ``, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: `${letras(data['reporte'].total)}`, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `subtotal: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].subtotal)}`, bold: true, alignment: 'right', style:'sucursal' }
                    ],
                    [
                      { text: ``, bold: true, alignment: 'center', style:'sucursal' },
                      { text: `Total contado: `, bold: true, alignment: 'right', style:'sucursal' },
                      { text: `${transform(data['reporte'].total)}`, bold: true, alignment: 'right', style:'sucursal'}
                    ]
                  ]
                }
              }
            ]
          }
        }
        
        
      }else{
        const dataformaPago = this.formasPago.find(p=>p.id === data.formaPago)
        const contenido =documentDefinition.content
        if(data.iva ){
          documentDefinition.content = [...contenido,
            {
              layout: 'noBorders',
              table: {
                headerRows: 0,
                // widths: [ '*',100,100 ],
                widths: [ '*', 100, 100 ],
                body: [
                  [ { text: '', bold: true, alignment: 'center', style:'terminos' }, '', '' ],
                  [ { text: '', bold: true, alignment: 'center', style:'terminos' },
                    { text: `Forma de pago:`, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${dataformaPago.numero} meses`, bold: true, alignment: 'right', style:'sucursal' }
                  ],
                  [ { text: '', bold: true, alignment: 'center', style:'terminos' },
                    { text: `Subtotal: `, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${transform( data['reporte'].subtotal)}`, bold: true, alignment: 'right', style:'sucursal' }
                  ],
                  [
                    { text: `${letras(data['reporte'].meses)}`, bold: true, alignment: 'center', style:'sucursal' },
                    { text: `Total contado: `, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${transform( data['reporte'].total)}`, bold: true, alignment: 'right', style:'sucursal'}
                  ],
                  [
                    { text: 'Importe con letra', bold: true, alignment: 'center', style:'sucursal' },
                    { text: `Iva: `, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${transform( data['reporte'].iva)}`, bold: true, alignment: 'right', style:'sucursal' }
                  ],
                  [
                    { text: ``, bold: true, alignment: 'center', style:'sucursal' },
                    { text: `Total a ${dataformaPago.numero} meses: `, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${transform( data['reporte'].meses)}`, bold: true, alignment: 'right', style:'sucursal'}
                  ],
                  [
                    { text: `${''}`, bold: true, alignment: 'center', style:'sucursal' },
                    { text:  ``, bold: true, alignment: 'right', style:'sucursal' },
                    { text:``, bold: true, alignment: 'right', style:'sucursal'}
                  ],
  
                ]
              }
            }
  
          ]
        }else{
          documentDefinition.content = [...contenido,
            {
              layout: 'noBorders',
              table: {
                headerRows: 0,
                // widths: [ '*',100,100 ],
                widths: [ '*', 100, 100 ],
                body: [
                  [ { text: '', bold: true, alignment: 'center', style:'terminos' }, '', '' ],
                  [ { text: '', bold: true, alignment: 'center', style:'terminos' },
                    { text: `Forma de pago:`, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${dataformaPago.numero} meses`, bold: true, alignment: 'right', style:'sucursal' }
                  ],
                  [ { text: '', bold: true, alignment: 'center', style:'terminos' },
                    { text: `Subtotal: `, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${transform( data['reporte'].subtotal)}`, bold: true, alignment: 'right', style:'sucursal' }
                  ],
                  
                  [
                    { text: `${letras(data['reporte'].meses)}`, bold: true, alignment: 'center', style:'sucursal' },
                    { text: `Total contado: `, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${transform( data['reporte'].total)}`, bold: true, alignment: 'right', style:'sucursal'}
                  ],
                  [
                    { text: 'Importe con letra', bold: true, alignment: 'center', style:'sucursal' },
                    { text: ``, bold: true, alignment: 'right', style:'sucursal' },
                    { text: ``, bold: true, alignment: 'right', style:'sucursal' }
                  ],
                  [
                    { text: ``, bold: true, alignment: 'center', style:'sucursal' },
                    { text: `Total a ${dataformaPago.numero} meses: `, bold: true, alignment: 'right', style:'sucursal' },
                    { text: `${transform( data['reporte'].meses)}`, bold: true, alignment: 'right', style:'sucursal'}
                  ],
                  [
                    { text: `${''}`, bold: true, alignment: 'center', style:'sucursal' },
                    { text:  ``, bold: true, alignment: 'right', style:'sucursal' },
                    { text:``, bold: true, alignment: 'right', style:'sucursal'}
                  ],
  
                ]
              }
            }
  
          ]
        }
        
      }
      const contenido =documentDefinition.content
      documentDefinition.content = [...contenido,
        {
          layout: 'noBorders', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ 'auto'],
            body: [
              [ { text: `fecha de vencimiento ${transforma_hora(vencimiento, true)}`, style:'vencimiento'}]
            ]
          }
        }
      ]
      documentDefinition.images = nuevasdocumentDefinitionimages
      return documentDefinition
  }
  redondeado(value: number,symbol:boolean){
    let simbolo =''
    if (symbol) {
      simbolo = '$ '
    }else{
      simbolo= ''
    }

    if (value>=0) {
      let cadena = String(value).split('.')
        if (cadena.length>1) {
          cadena[1] = String(cadena[1].slice(0,2))
          if (cadena[1].length===1) {
            cadena[1]= `${cadena[1]}0`
          }
          let contador:number = String(cadena[0]).length
          let str =  String(`${cadena[0]}.${cadena[1]}`)
          let arr = str.split('')
          let muestra:any
          if (contador  ===  4) { arr[0]= arr[0]+',' }
          if (contador  ===  5) { arr[1]= arr[1]+',' }
          if (contador  ===  6) { arr[1]= arr[1]+',' }
          if (contador  ===  7) { arr[0]= arr[0]+',' }
          return muestra = `${simbolo}${arr.join('')}`
        }else{
            return `${simbolo}${cadena[0]}.00`
        }
    }else{
      return `${simbolo}0.00`
    }

  }
  

}
function capUno(value: string, ...args: unknown[]): unknown {
  const cadena = String(value).toLowerCase()
  let arr =[...cadena]
  arr[0] = arr[0].toUpperCase()
  return arr.join('');
}
function transforma_hora(fecha: string, incluirHora: boolean = false, ...args: unknown[]): string {
  const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // Los meses en JavaScript son base 0, por eso se suma 1
    const anio = fechaObj.getFullYear();
    const hora = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();
  
    let fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;
  
    if (incluirHora) {
      fechaFormateada += ` ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    }
  
    return fechaFormateada;
}
