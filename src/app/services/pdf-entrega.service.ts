import { Injectable } from '@angular/core';


import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs


@Injectable({
  providedIn: 'root'
})
export class PdfEntregaService {

  constructor() { }

  async pdf(data:any){
    const colorTextoPDF: string = '#1215F4';
    const {data_cliente, elementos, data_sucursal,nivel_gasolina, data_vehiculo, fecha_recibido, fecha_entregado, firma_cliente, reporte, tecnicoShow, status, observaciones, showDetalles, margen:new_margen   } = data

    const margen = 1 + (new_margen / 100)

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
    function Combustble(){
      // let {status} = nivel_gasolina
      // let status = 'vacio'
      let fullpath = ''
      switch (nivel_gasolina) {
        case 'vacio':
          // imagen = 'c_vacio.png'
          // fullpath = `${ruta}/${imagen}`
          fullpath = 'combustiblevacio'
          break;
          case '1/4':
            // imagen = 'c_14.png'
            // fullpath = `${ruta}/${imagen}`
            fullpath = 'combustible14'
            break;
          case '1/2':
            // imagen = 'c_12.png'
            // fullpath = `${ruta}/${imagen}`
            fullpath = 'combustible12'
            break;
          case '3/4':
            // imagen = 'c_34.png'
            // fullpath = `${ruta}/${imagen}`
            fullpath = 'combustible34'
            break;
          case 'lleno':
            // imagen = 'c_full.png'
            // fullpath = `${ruta}/${imagen}`
            fullpath = 'combustibleFull'
            break;
        default:
          fullpath = 'combustiblevacio'
          break;
      }
      return fullpath
    }

    const nuevasdocumentDefinitionimages = {}
    nuevasdocumentDefinitionimages['logo'] = `${(await bases('../../assets/logoSpeedPro/Logo-Speedpro.png')).url}`
    nuevasdocumentDefinitionimages['firma_cliente'] = `${firma_cliente}`
    nuevasdocumentDefinitionimages['combustiblevacio'] = `${(await bases('../../assets/combustible/c_vacio.png')).url}`
    nuevasdocumentDefinitionimages['combustible14'] = `${(await bases('../../assets/combustible/c_14.png')).url}`
    nuevasdocumentDefinitionimages['combustible12'] = `${(await bases('../../assets/combustible/c_12.png')).url}`
    nuevasdocumentDefinitionimages['combustible34'] = `${(await bases('../../assets/combustible/c_34.png')).url}`
    nuevasdocumentDefinitionimages['combustibleFull'] = `${(await bases('../../assets/combustible/c_full.png')).url}`

    data_cliente['empresa'] = (data_cliente['empresa']) ? data_cliente['empresa'] : ''
    let observaciones_new = (observaciones) ? observaciones : ''

    function table(elements, columns, witdhsDef, showHeaders, headers, layoutDef?) {
      return {
          table: {
              headerRows: 1,
              widths: witdhsDef,
              body: buildTableBody(elements, columns, showHeaders, headers)
          },
          layout: layoutDef
      };
    }
    function buildTableBody(elements, columns, showHeaders, headers) {
      var body = [];
      if(showHeaders) body.push(headers); 
      let filtrados = elements.filter(f=>f['aprobado'])

      filtrados.forEach(function (row) {
          var dataRow = [];
          var i = 0;
          columns.forEach(function(column) {
            if (column==='total' || column ==='precio') {
              dataRow.push({text: `${monedas(row[column])}`,alignment: headers[i].alignmentChild,style:'content' });
              i++;
            }else{
              dataRow.push({text: `${String(row[column]).toLowerCase()}`,style:'content' });
              i++;
            }
          })
          body.push(dataRow);
      })
      return body;
    }
    function retornbody(iva){

      let FACTURA = 
        [ 
          { text: ``,alignment: 'right', style:'info2' },
          { text: `factura / remision`,alignment: 'right', style:'info2' },
          { text: `${iva ? 'Factura': 'Nota'}`,alignment: 'right', style:'info2' }
        ]
      let SUBTOTAL = 
        [ 
          { text: ``,alignment: 'right', style:'info2' },
          { text: `SUBTOTAL`,alignment: 'right', style:'info2' },
          { text: `${monedas(reporte.subtotal)}`,alignment: 'right', style:'info2' }
        ]
      let IVA = 
        [ 
          { text: ``,alignment: 'right', style:'info2' },
          { text: `I.V.A`,alignment: 'right', style:'info2' },
          { text: `${monedas(reporte.iva)}`,alignment: 'right', style:'info2' }
        ]
      let TOTAL = 
        [ 
          { text: ``,alignment: 'right', style:'info2' },
          { text: `TOTAL`,alignment: 'right', style:'info2' },
          { text: `${monedas(reporte.total)}`,alignment: 'right', style:'info2' }
        ]
      let LETRAS = 
      [
        { text: `${convertirNumeroALetrasConCentavos(reporte.total)}`},
        { text: ``,alignment: 'right', style:'info2' },
        { text: ``,alignment: 'right', style:'info2' },
      ]
      let rb = []

      
      if (iva){
        rb = [
          FACTURA,
          SUBTOTAL,                   
          IVA,                      
          TOTAL,
          LETRAS 
        ]
      }else{
        rb = [
          FACTURA,
          SUBTOTAL,                  
          TOTAL,
          LETRAS    
        ]
      }
      return rb
    }
    function monedas(value: number, symbol = '$'): string {
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
    function convertirNumeroALetras(numero: number): string {
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
          return centenas[centena - 1] + ' ' + convertirNumeroALetras(resto);
        }
      } else if (numero < 1000000) {
        const miles = Math.floor(numero / 1000);
        const resto = numero % 1000;
        if (resto === 0) {
          return convertirNumeroALetras(miles) + ' mil';
        } else {
          return convertirNumeroALetras(miles) + ' mil ' + convertirNumeroALetras(resto);
        }
      } else {
        return 'Número fuera de rango';
      }
    }
    function convertirNumeroALetrasConCentavos(numero: number): string {

      const parteEntera = Math.floor(numero);
      const centavos = Math.round((numero - parteEntera) * 100);
    
      let resultado = convertirNumeroALetras(parteEntera) + ' pesos';
    
      if (centavos > 0) {
        resultado += ' con ' + convertirNumeroALetras(centavos) + ' centavos';
      }
    
      return String(resultado).toUpperCase();
    }
    function formateHora(fecha: string, incluirHora: boolean = true): string {
      if(!fecha) return ''
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
    function table_descrip(elements, columns, witdhsDef, showHeaders, headers, layoutDef?) {
      return {
          table: {
              headerRows: 1,
              widths: witdhsDef,
              body: buildTableBody_descript(elements, columns, showHeaders, headers)
          },
          layout: layoutDef
      };
    }
    function buildTableBody_descript(elements, columns, showHeaders, headers) {
      const body = [];

      if (showHeaders) {
        body.push(headers);
      }

      const paquetes = elements.filter(f => f['aprobado'] && f.tipo === 'paquete');

      // let filtrados = elements.filter(f=>f['aprobado'])
      // const paquetes = filtrados.filter(e => e.tipo === 'paquete');
    
      paquetes.forEach(paquete => {
        const dataRow = buildDataRow(paquete, showDetalles, margen);
        body.push(dataRow);
      });
    
      return body;
    }
    function reemplaza_string_paquete(nombre){
      const nuevo = nombre.replace(/paquete de|paquete/gi, '').trim();
      // const otro = String(nuevo).replace('paquete', '').trim();
      const nuevo_ = nuevo.replace(/\s+/g, ' ').trim(); // Reemplaza dobles espacios por un solo espacio
      return String(nuevo_).trim().toLowerCase();
    }
    function buildDataRow(paquete, showDetalles, margen) {
      const { nombre, elementos: elementos_internos } = paquete;
    
      const nombre_show = elementos_internos.map(e => {
        const { nombre, precio, tipo } = e;
        const new_tipo = tipo === 'refaccion' ? 'Refaccion' : 'MO';
        let nuevo_total =  tipo === 'refaccion' ? precio * margen : precio ;
        return showDetalles ? `${nombre} (${monedas(nuevo_total)}) - ${new_tipo}` : `${nombre} - ${new_tipo}`;
      }).join(', ');
    
      return [
        { width: '30%', text: `${reemplaza_string_paquete(nombre)} `, style: 'content' },
        { width: '30%', text: `${nombre_show}`, style: 'content' },
      ];
    }
    
    let documentDefinition = {
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
      content: [],
      styles: {
        header: { fontSize: 14,bold: true,align: 'center'},
        info: { fontSize: 9,bold: true,align: 'center',color: colorTextoPDF},
        info2: { fontSize: 9,bold: true,align: 'center',color: 'black'},
        info3: { fontSize: 8,bold: false,align: 'center',color: 'black'},
        title: { fontSize: 9,bold: true,align: 'center'},
        sucursal: { fontSize: 10,bold: true,align: 'center'},
        operadora: { fontSize: 14,bold: true,align: 'center'},
        medium: { fontSize: 14,bold: true,color:colorTextoPDF },
        otro: { fontSize: 12,bold: true,color: 'black' },
        otro2: { fontSize: 10,bold: true,color: 'black' },
        content:{fontSize:8,color: 'black'},
        normal:{fontSize:10,color: 'red'},
        normal2:{fontSize:9,color: 'red'},
        importeLetras:{fontSize:10,bold: true},
        detallesPaquetes:{fontSize:9,color: 'black'},
        terminos:{ fontSize:8},
        terminos2:{ fontSize:7},
        anotherStyle: { italics: true, align: 'center'},
        vencimiento: { italics: true, align: 'right', color: 'red', fontSize: 8}
      },
      images:{}
    }
    
    const info = [{
      layout: 'noBorders',
      table: {
        headerRows: 0,
        widths: [ '25%','40%','35%' ],
        body: [
          [ 
            
            {
              image: `logo`,
              height: 50,
              width: 140,
              aling: 'center',
              valing: 'center'
            },
            { 
              text: `${data_sucursal.direccion}`,bold: true, alignment: 'center', style:'otro2'
            },
            { 
              // text: 'fecha: 21/03/2023',bold: true, alignment: 'center', style:'info'
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '40%', '*' ],
        
                body: [
                  [ 
                    {text: 'No. Orden:',bold: true, alignment: 'left', style:'info'},
                    {text: `${data['no_os']}`,bold: true, alignment: 'left', style:'info'},
                  ],
                  [ 
                    {text: 'Fecha recibido:',bold: true, alignment: 'left', style:'info'},
                    {text: `${formateHora(fecha_recibido)}`,bold: true, alignment: 'left', style:'info'}, 
                  ],
                  [ 
                    {text: 'Fecha entrega:',bold: true, alignment: 'left', style:'info'},
                    {text: `${formateHora(fecha_entregado)}`,bold: true, alignment: 'left', style:'info'},
                  ],
                ]
              }
            },
        ],
        ]
      }
    },
    {
      layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '35%','*' ],

        body: [
          [ 
            
            {
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '100%' ],
        
                body: [
                  [ 
                    {
                      image: `${Combustble()}`,
                      height: 40,
                      width: 90,
                      aling: 'center',
                      valing: 'center',
                      alignment: 'center'
                    }
                   ],
                  [ {text: `Nivel de gasolina`,bold: true, alignment: 'center', style:'info2'} ]
                ]
              }
            },
            {
              layout: 'lightHorizontalLines', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '100%' ],
        
                body: [
                  [ {text: `Observaciones`,bold: true, alignment: 'left', style:'info2'} ],
                  [ {text: `${observaciones_new}`,bold: true, alignment: 'left', style:'info2'} ]
                ]
              }
            }
           ],
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      
      layout: 'noBorders',
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '*',  '*' ],

        body: [
          [ { text: `Datos de cliente`,alignment: 'center', style:'normal2' },   { text: `Datos de vehículo`,alignment: 'center', style:'normal2' } ],
          [ 
            {
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ 50, '*'],
        
                body: [
                  [ 
                    { text: `Nombre:`,alignment: 'left', style:'info' },
                    { text: `${data_cliente.nombre} ${data_cliente.apellidos}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                  [ 
                    { text: `Tel:`,alignment: 'left', style:'info' },
                    { text: `${data_cliente.telefono_movil}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                  [ 
                    { text: `Email:`,alignment: 'left', style:'info' },
                    { text: `${data_cliente.correo}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ]
                ]
              }
            },    
            {
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ 50, '*',50,'*'],
        
                body: [
                  [ 
                    { text: `Placas:`,alignment: 'left', style:'info' },
                    { text: `${data_vehiculo.placas.toUpperCase()}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' },
                    { text: `KMs:`,alignment: 'left', style:'info' },
                    { text: `123434234`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                  [ 
                    { text: `Marca:`,alignment: 'left', style:'info' },
                    { text: `${data_vehiculo.marca}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' },
                    { text: `Modelo:`,alignment: 'left', style:'info' },
                    { text: `${data_vehiculo.modelo}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                  [ 
                    { text: `Empresa:`,alignment: 'left', style:'info' },
                    { text: `${data_cliente['empresa']}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' },
                    { text: `Año:`,alignment: 'left', style:'info' },
                    { text: `${data_vehiculo.anio}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                ]
              }
            }
          ],
          // [ { text: `Tel: ${dat['cliente'].telefono_movil}`, style:'info2' },  { text: `Tel: ${dat['vehiculo'].modelo}`, style:'info2' } ],
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      layout: 'noBorders', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '33%','33%','*' ],

        body: [
            [ 
              {text: `Tecnico de la orden`,bold: true, alignment: 'left', style:'info'},
              {text: `${tecnicoShow}`,bold: true, alignment: 'left', style:'info'},
              {text: `Estado actual REPARADO y ${String(status).toUpperCase()} `,bold: true, alignment: 'left', style:'info'},
            ],
        ]
      }
    },
   
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      layout: 'noBorders',
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '100%'],

        body: [
          [ { text: `Servicios solicitados`,alignment: 'left', style:'info2' }],
          [ 
            table(
              data.elementos,
              ['tipo', 'nombre','cantidad','precio','total'],
              ['10%', '40%', '10%','20%','20%'],
              true,
              [ {text:'Tipo', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
                {text:'Nombre', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
                {text:'cantidad', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
                {text:'precio unitario', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'right'},
                {text:'total', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'right'},
              ])              
          ],
          [
            table_descrip(
              elementos, 
              ['','nombre'],
              ['25%','*'],
              true,
              [
                {text:'Paquete', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
                {text:'Descripcion elementos', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'}
              ]
              )
          ],
          [
            // retornbody(data.iva)
            {
              layout: 'noBorders', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '60%','20%','20%'],
        
                body:retornbody(data.iva)
              }
            }
          ]
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      layout: 'noBorders', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '70%', '30%' ],

        body: [
            [ { text: `Cantidad con letra `,alignment: 'center', style:'info2' } , { text: `Nombre y Firma.`,alignment: 'center', style:'info3' } ],
            [ 
              { text: `La prestacion del servicio de repracion y/o mantenimiento del vehiculo otorga con garantia por un plazo de 30 dias en mano de obra de contado apartir del dia de entrega del vehiculo. En partes electricas no hay garantia`,alignment: 'justify', style:'terminos2' },
              {
                image: `firma_cliente`,
                height: 50,
                width: 150,
                aling: 'center',
                valing: 'center'
              } ],
            [ { text: ` `,alignment: 'center', style:'info2' }, { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 } ],
            [ { text: ` `,alignment: 'center', style:'info2' }, { text: `______________________________`,alignment: 'center', style:'info3' } ],
            [ { text: ` `,alignment: 'center', style:'info2' }, { text: `Recibió`,alignment: 'center', style:'info3' } ],
        ]
      }
    },

    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },


    // { text: `E) Cualquier diagnóstico y cotización que no sea autorizada tendra un costo minimo de $ 499.00 pesos'`,alignment: 'justify', style:'terminos' },
    ]

    documentDefinition.images = await Object({...nuevasdocumentDefinitionimages})

    documentDefinition.content = [...info]

    return documentDefinition

  }
}
