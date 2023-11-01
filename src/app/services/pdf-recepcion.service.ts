import { Injectable } from '@angular/core';
import { ServiciosPublicosService } from './servicios-publicos.service';


import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs
@Injectable({
  providedIn: 'root'
})
export class PdfRecepcionService {

  constructor(public _publicos:ServiciosPublicosService) { }
  async obtenerImege(data:any){
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
    // console.log(data);
    
    const nuevasdocumentDefinitionimages = {}
    nuevasdocumentDefinitionimages['logo'] = `${(await bases('../../assets/logoSpeedPro/Logo-Speedpro.png')).url}`
    nuevasdocumentDefinitionimages['combustiblevacio'] = `${(await bases('../../assets/combustible/c_vacio.png')).url}`
    nuevasdocumentDefinitionimages['combustible14'] = `${(await bases('../../assets/combustible/c_14.png')).url}`
    nuevasdocumentDefinitionimages['combustible12'] = `${(await bases('../../assets/combustible/c_12.png')).url}`
    nuevasdocumentDefinitionimages['combustible34'] = `${(await bases('../../assets/combustible/c_34.png')).url}`
    nuevasdocumentDefinitionimages['combustibleFull'] = `${(await bases('../../assets/combustible/c_full.png')).url}`
    nuevasdocumentDefinitionimages['capo'] = `${(await bases('../../assets/imagenes_detalles/capo.jpg')).url}`
    nuevasdocumentDefinitionimages['espejo_derecho'] = `${(await bases('../../assets/imagenes_detalles/espejo_derecho.jpg')).url}`
    nuevasdocumentDefinitionimages['espejo_izquierdo'] = `${(await bases('../../assets/imagenes_detalles/espejo_izquierdo.jpg')).url}`
    nuevasdocumentDefinitionimages['faros_frontales'] = `${(await bases('../../assets/imagenes_detalles/faros_frontales.jpg')).url}`
    nuevasdocumentDefinitionimages['faros_posteriores'] = `${(await bases('../../assets/imagenes_detalles/faros_posteriores.jpg')).url}`
    nuevasdocumentDefinitionimages['frontal'] = `${(await bases('../../assets/imagenes_detalles/frontal.jpg')).url}`
    nuevasdocumentDefinitionimages['lateralDerecho'] = `${(await bases('../../assets/imagenes_detalles/lateralderecho.jpg')).url}`
    nuevasdocumentDefinitionimages['parabrisas'] = `${(await bases('../../assets/imagenes_detalles/parabrisas.jpg')).url}`
    nuevasdocumentDefinitionimages['parabrisas_posterior'] = `${(await bases('../../assets/imagenes_detalles/parabrisas_posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['paragolpes_frontal'] = `${(await bases('../../assets/imagenes_detalles/paragolpes_frontal.jpg')).url}`
    nuevasdocumentDefinitionimages['paragolpes_posterior'] = `${(await bases('../../assets/imagenes_detalles/paragolpes_posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['posterior'] = `${(await bases('../../assets/imagenes_detalles/posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_lateral_izquierda_1'] = `${(await bases('../../assets/imagenes_detalles/tirador_lateral_izquierda_1.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_lateral_izquierda_2'] = `${(await bases('../../assets/imagenes_detalles/tirador_lateral_izquierda_2.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_lateral_derecha_1'] = `${(await bases('../../assets/imagenes_detalles/tirador_lateral_derecha_1.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_lateral_derecha_2'] = `${(await bases('../../assets/imagenes_detalles/tirador_lateral_derecha_2.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_lateral_izquierda_1'] = `${(await bases('../../assets/imagenes_detalles/puerta_lateral_izquierda_1.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_lateral_izquierda_2'] = `${(await bases('../../assets/imagenes_detalles/puerta_lateral_izquierda_2.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_lateral_derecha_1'] = `${(await bases('../../assets/imagenes_detalles/puerta_lateral_derecha_1.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_lateral_derecha_2'] = `${(await bases('../../assets/imagenes_detalles/puerta_lateral_derecha_2.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_posterior'] = `${(await bases('../../assets/imagenes_detalles/puerta_posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_posterior'] = `${(await bases('../../assets/imagenes_detalles/tirador_posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['techo'] = `${(await bases('../../assets/imagenes_detalles/techo.jpg')).url}`
    nuevasdocumentDefinitionimages['firma_cliente'] = `${data['firma_cliente']}`


    let pers2 = []
    const personalizados:any[] = data.personalizados
    
    
    await personalizados.forEach(p=>{
      nuevasdocumentDefinitionimages[p.nombre] = `${p.data64}`
      const temp = {id: p.nombre, checado: true}
      pers2.push(temp)
    })
    // console.log(nuevasdocumentDefinitionimages);
    

    let person_ =[]

    person_.forEach((p)=>{
      // const nombre = p['nombre'].split('.')
      nuevasdocumentDefinitionimages[p.nombre] = `${p['url']}`
    })
    // console.log('error');
    
    const checados = data['detalles'].filter(d=>d.status)
    data['conjuntos'] = checados.concat(person_).concat(pers2)
    return this.pdf(data,nuevasdocumentDefinitionimages)
  }
  async pdf(data:any, bibliotecaVirtual:any){
    const colorTextoPDF: string = '#1215F4';
    // const dat = data
    const {data_cliente, data_sucursal, data_vehiculo, checkList, fecha_recibido} = data
    
    

    data_cliente['empresa'] = (data_cliente['empresa']) ? data_cliente['empresa'] : ''

    function Combustble(){
      let {status} = data['checkList'].find(c=>c['valor'] === 'nivel_gasolina')
      let fullpath = ''
      switch (status) {
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

    function construirCheck (){
      let body = [], aqui = []
      checkList.forEach((e, index)=>{
        const color = (e.status.toLowerCase() === 'si' ) ? '#aadaa9' : '#f590b2'
        const item = {
          text: `${e.show}: ${e.status.toUpperCase()}`,
          alignment: 'left',
          style: 'info3',
          fillColor: color
        };
        if ((index + 1) % 4 === 0 && (index + 1) !== 0) {
          aqui.push(Object(item));
          body.push(aqui)
          aqui =[]
        }else{
          aqui.push(Object(item));
        }
      }) 
      return body
    }
    function transform(value: string, ...args: unknown[]): unknown {
      const cadena = String(value).toLowerCase()
      let arr =[...cadena]
      arr[0] = arr[0].toUpperCase()
      return arr.join('');
    }

    function redondeado2(value: number,simbolo?:string): string {
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

    function table(elements, columns, witdhsDef, showHeaders, headers, layoutDef) {
      return {
          table: {
              headerRows: 1,
              widths: witdhsDef,
              body: buildTableBody(elements, columns, showHeaders, headers)
          },
          layout: layoutDef
      };
    }
    let totalRecepcion = 0
    const mulIVA = (data.iva) ? 1.16 : 1

    function buildTableBody(elements, columns, showHeaders, headers) {
      var body = [];
      if(showHeaders) body.push(headers); 
      let filtrados = elements.filter(f=>f['aprobado'])
      // console.log(filtrados);
      // console.log(elements);
      
      filtrados.forEach(function (row) {
        totalRecepcion+= row['total']
          var dataRow = [];
          var i = 0;
          // console.log(row['nombre']);
          columns.forEach(function(column) {
            if (column==='total') {
              // console.log(redondeado2(row[column]));
              dataRow.push({text: `${redondeado2(row[column])}`,alignment: headers[i].alignmentChild,style:'content' });
              i++;
            }else{
              dataRow.push({text: `${transform(row[column])}`,style:'content' });
              i++;
            }
          })
          // console.log(row);
          // columns.forEach(function(column) {
          //   dataRow.push({text: `${column['nombre']}`,style:'content' });
          // })
          // dataRow.push({text: `${row['nombre']}`,style:'content' });
          body.push(dataRow);
      })
      return body;
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
    const muliva = (data.iva) ? .16 : 0
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
        widths: [ '25%','50%','25%' ],
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
              text: `${data_sucursal.direccion}`,bold: true, alignment: 'center', style:'otro'
            },
            { 
              // text: 'fecha: 21/03/2023',bold: true, alignment: 'center', style:'info'
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ 50, '*' ],
        
                body: [
                  [ 
                    {text: 'Fecha:',bold: true, alignment: 'left', style:'info'},
                    {text: `${transforma_hora(fecha_recibido, true)}`,bold: true, alignment: 'left', style:'info'},
                  ],
                  [ 
                    {text: 'No. Orden:',bold: true, alignment: 'left', style:'info'},
                    {text: `${data['no_os']}`,bold: true, alignment: 'left', style:'info'},
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
                  [ {text: `${data['observaciones']}`,bold: true, alignment: 'left', style:'info2'} ]
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
      layout: 'noBorders',
      // layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '25%','25%','25%','25%'],

        body: 
          // [{ text: `${da[0][1].text}`,fillColor: '#8AD3AD', color:'#1C5121',alignment: 'left', style:'info' },da[0][1],da[0][2],da[0][3]],
          construirCheck()
        
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      layout: 'noBorders',
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '60%', '*'],

        body: [
          [ { text: `Servicios solicitados`,alignment: 'left', style:'info2' }, { text: `Autorización`,alignment: 'center', style:'info2' }],
          [ 
            table(
              data.elementos,
              ['tipo', 'nombre','total'],
              ['15%', '65%', '20%'],
              true,
              [ {text:'Tipo', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
                {text:'Nombre', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
                {text:' ', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'right'}
              ],
              '')
            , 
            {
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '*' ],
        
                body: [
                  [  { text: `Estoy de acuerdo con las condiciones de venta y Autorizo por la presente hacer el trabajo de reparación con el material necesario y concedo a la empresa permiso para la operación la unidad para efectos de inspección y prueba.`,alignment: 'justify', style:'info3' },  ],
                  [ { text: ` `,alignment: 'center', style:'info3' }],
                  [ { text: `Nombre y Firma.`,alignment: 'center', style:'info3' }],
                  [ { text: ` `,alignment: 'center', style:'info3' }],
                  [ {
                    image: `firma_cliente`,
                    height: 50,
                    width: 150,
                    aling: 'center',
                    valing: 'center'
                  },],
                  [ { text: ` `,alignment: 'center', style:'info3' }],
                  [ { text: `Recibió`,alignment: 'center', style:'info3' }],
                  [ { text: ` `,alignment: 'center', style:'info3' }],
                  [ { text: `____________________________`,alignment: 'center', style:'info3' }],
                  [ { text: `Los precios aquí cotizados son en M.N más I.V.A`,alignment: 'center', style:'info3' }],
                ]
              }
            }                
          ],
          [
            {
              layout: 'noBorders', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '100%'],
        
                body:retornbody(data.iva)
              }
            }, 
            ///espacio necesario para la columna dos 
            ''
          ]
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },

    { columns: [ { width: '100%', text: { text: `Cantidad con letra`,alignment: 'center', style:'info2' }, } ], columnGap: 10 },

    { columns: [ { width: '100%', text: { text: `${this.letrasNumeros(totalRecepcion * mulIVA)}`,alignment: 'center', style:'info2' }, } ], columnGap: 10 },

    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },

    { text: `Si su ticket o factura no coinciden con este presupuesto ó el presupuesto no coincide con nuestra lista de precios favor de reportarlo al siguiente correo: quejas@speed-service.com.mx y recibira un descuento.`,alignment: 'justify', style:'terminos2' },
    
    {text: `${' '}`,alignment: 'justify', style:'terminos2' },

    { text: `${'Condiciones de venta'.toUpperCase()}`,alignment: 'justify', style:'terminos2' },
    { text: `A) Despues de 15 días de terminado el trabajo la empresa cobrara una pensión por resguardo de $150.00 pesos por dia mas I.V.A`,alignment: 'justify', style:'terminos2' },
    { text: `B) Es necesario liquidar el 100% del servicio para pdoer entregar la unidad`,alignment: 'justify', style:'terminos2' },
    { text: `C) en caso de requerir un servicio adicional el cliente será notificado antes de realizar dicho servicio`,alignment: 'justify', style:'terminos2' },
    { text: `D) la empresa no se hace responsable por artículos de valor no reportados al momento de recibir el vehículo`,alignment: 'justify', style:'terminos2' },
    // { text: `E) Cualquier diagnóstico y cotización que no sea autorizada tendra un costo minimo de $ 499.00 pesos'`,alignment: 'justify', style:'terminos' },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    { text: '', pageBreak: 'after' },
    ]
    let limites_ = []

    function retornbody(iva){

      let rb = []
      if (iva){
        rb = [
          [ { text: `Subtotal: ${redondeado2(totalRecepcion )}`,alignment: 'right', style:'info2' } ],                      
          [ { text: `I.V.A: ${redondeado2(totalRecepcion * muliva)}`,alignment: 'right', style:'info2' } ],                      
          [ { text: `Total presupuesto: ${redondeado2(totalRecepcion * mulIVA)}`,alignment: 'right', style:'info2' } ], 
        ]
      }else{
        rb = [
          [ { text: `Subtotal: ${redondeado2(totalRecepcion )}`,alignment: 'right', style:'info2' } ],                    
          [ { text: `Total presupuesto: ${redondeado2(totalRecepcion * mulIVA)}`,alignment: 'right', style:'info2' } ],    
        ]
      }
      return rb
    }

    let donde = data['conjuntos']

    documentDefinition.images = await Object({...bibliotecaVirtual})
    let i_ =0
    if (donde.length) {
     
      info.push({ columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },)
      
      info.push({ text: `${'Detalles en vehiculos'}`,alignment: 'center', style:'otro' })

      donde.forEach((c, index)=>{
        // console.log(c['id']);
        if (i_ >= 4 ) {
          limites_.push(index - 1)
          i_=0
        }
        // console.log(i_, `\n`);
        i_++
    })
    if (donde.length<4) {
      limites_.push(donde.length -1)
    }
    if (donde.length>4) {
      limites_.push(donde.length -1)
    }

    
    let todasLasImagenes =[]
    
    limites_.sort(function(a, b) {
      return a - b;
    });

    limites_.forEach((a,index) => {
      let muestra = []
      if (index ===0) {
        for (let index_ = 0; index_ <= a; index_++) {
          // console.log(checados[index_]);
          let cual =''
          if (donde[index_].id) {
            cual = `${donde[index_].id.toLowerCase()}`
          }else{
            const nombre:string = donde[index_].valor
            cual = `${nombre.toLowerCase()}`
          }
          // console.log(cual);
          muestra.push(Object(
            {
              image: `${cual}`,
              height: 70,
              width: 120,
              aling: 'center',
              valing: 'center',
              alignment: 'center'
            }
          ))
        }
      }else{        
        for (let index_ = limites_[index -1 ]+1; index_ <=a; index_++) {
          // console.log(checados[index_]);
          let cual =''
          if (donde[index_].id) {
            cual = `${donde[index_].id.toLowerCase()}`
          }else{
            const nombre:string = donde[index_].valor
            cual = `${nombre.toLowerCase()}`
          }
          // console.log(cual);
          muestra.push(Object(
            {
              image: `${cual}`,
              height: 70,
              width: 120,
              aling: 'center',
              valing: 'center',
              alignment: 'center'
            }
          ))
        }
        
      }
      todasLasImagenes.push(muestra)
      // console.log(muestra);
      
    });    
   
    todasLasImagenes.sort(function(a, b){return b.length - a.length})
    
    // console.log(todasLasImagenes);
    todasLasImagenes.map(c=>{
      if (c.length<4) {
        for (let index = c.length; index < 4; index++) {
          c.push(Object({text: `  `,bold: true, alignment: 'center', style:'info2'}))
        }
      }
    })
    info.push(Object(
      {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: [ '25%', '25%', '25%', '25%' ],
          body: todasLasImagenes
        }
      }
    ))
    }

    documentDefinition.content = [...info]
    

    return documentDefinition

  }
  letrasNumeros(num: number, ...args: unknown[]): unknown {
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

   async crearPdfRemision(data:any, ){
    // console.log(data);

    const {data_cliente, data_sucursal, data_vehiculo, checkList, fecha_recibido} = data
    data_cliente['empresa'] = (data_cliente['empresa']) ? data_cliente['empresa'] : ''
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

   const nuevasdocumentDefinitionimages = {}
   nuevasdocumentDefinitionimages['logo'] = `${(await this.getBase64ImageFromURL('../../assets/logoSpeedPro/Logo-Speedpro.png'))}`
   nuevasdocumentDefinitionimages['firma_cliente'] = `${data['firma_cliente']}`
  //  console.log(nuevasdocumentDefinitionimages);
  if (!data['infoCliente'].empresa) {
    data['infoCliente'].empresa = data['infoCliente'].tipo
  }
  let dataFacturacion = {rfc: ' -----------  '  ,razon: ' -----------  ' }
  if (data['facturaRemision'] === 'factura') {
    dataFacturacion.rfc = data['dataFacturacion'].rfc
    dataFacturacion.razon = data['dataFacturacion'].razon
  }
  // console.log(dataFacturacion);
  
   const info = [
    {
      // layout: 'noBorders', // optional
      layout: 'noBorders', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '25%', '50%', '25%' ],

        body: [
          [ 
            {
              image: `logo`,
              height: 50,
              width: 90,
              aling: 'center',
              valing: 'center',
              alignment:'center'
            },
            // {  text: `${data['infoSucursal'].sucursal}`,bold: true, alignment: 'center', style:'sucursal'}
            {
              layout: 'noBorders', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '100%' ],
        
                body: [
                  [ {  text: `${data_sucursal.sucursal}`,bold: true, alignment: 'justify', style:'info'}, ],
                  [ {  text: `Operadora de Servicios Automotrices integrales del centro del pais Speed Service GAFEAG Sa de CV`
                            ,bold: true, alignment: 'justify', style:'info'}, ],
                  [ {  text: `${data_sucursal.direccion}`,bold: true, alignment: 'justify', style:'info'}, ],
                  [ {  text: `${data_sucursal.telefono}`,bold: true, alignment: 'justify', style:'info'}, ],
                  [ {  text: `${data_sucursal.correo}`,bold: true, alignment: 'justify', style:'info'}, ],
                ]
              }
            }
            , 
            {
              layout: 'noBorders', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '*' ],
        
                body: [
                  [ {  text: `Orden de servicio`,bold: true, alignment: 'center', style:'sucursal',fillColor: '#FF6969', color:'white'} ],
                  [ {  text: `${data['no_os']}`,bold: true, alignment: 'center', style:'sucursal'} ],
                  [ { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 }, ],
                  [ {  text: `Costo total de servicio`,bold: true, alignment: 'center', style:'sucursal' ,fillColor: '#FF6969', color:'white'} ],
                  [ {  text: `${redondeado2(obtenerTotal(data['servicios'], data['facturaRemision'],data['margen']).total)}`,bold: true, alignment: 'center', style:'sucursal' } ],
                ]
              }
            }
          ]
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      // layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '20%', '20%', '20%', '20%','20%' ],

        body: [
          [ 
            {  text: `FECHA DE RECEPCIÓN`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `FECHA DE COTIZACIÓN`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `FECHA DE REPARACIÓN`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `FECHA DE APROBACIÓN`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `FECHA ENTREGA`,bold: true, alignment: 'left', style:'terminos2'}
          ],
          [ 
            {  text: `${data['fecha_recibido']}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `---`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `---`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `---`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['fecha_entregado']}`,bold: true, alignment: 'center', style:'sucursal'}
          ],
        ]
      }
    },
    {
      // layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '50%','50%' ],

        body: [
          [ 
            {  text: `NOMBRE DE CLIENTE`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `CORREO ELECTRÓNICO`,bold: true, alignment: 'left', style:'terminos2'}
          ],
          [ 
            {  text: `${data_cliente.nombre} ${data_cliente.apellidos}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data_cliente.correo}`,bold: true, alignment: 'center', style:'sucursal'}
          ],
        ]
      }
    },
    {
      // layout: 'headerLineOnly', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '50%','25%','25%' ],

        body: [
          [ 
            {  text: `EMPRESA`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `CÓDIGO POSTAL`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `TELÉFONO`,bold: true, alignment: 'left', style:'terminos2'}
          ],
          [ 
            {  text: `${data_cliente.empresa}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: ` --- `,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['infoCliente'].telefono_movil}`,bold: true, alignment: 'center', style:'sucursal'},
          ],
        ]
      }
    },
    {
      // layout: 'headerLineOnly', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '75%','25%' ],

        body: [
          [ 
            {  text: `FACTURAR A`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `R.F.C`,bold: true, alignment: 'left', style:'terminos2'},
          ],
          [ 
            {  text: `${transformMayus(dataFacturacion.razon)}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${transformMayus(dataFacturacion.rfc)}`,bold: true, alignment: 'center', style:'sucursal'},
          ],
        ]
      }
    },
    {
      // layout: 'headerLineOnly', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '20%', '20%', '20%', '20%','20%' ],

        body: [
          [ 
            {  text: `PLACAS`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `MARCA`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `MODELO`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `AÑO`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `CATEGORÍA`,bold: true, alignment: 'left', style:'terminos2'},
          ],
          [ 
            {  text: `${transformMayus(data['infoVehiculo'].placas)}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['infoVehiculo'].marca}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['infoVehiculo'].modelo}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['infoVehiculo'].anio}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['infoVehiculo'].categoria}`,bold: true, alignment: 'center', style:'sucursal'},
          ]
        ]
      }
    },
    {
      // layout: 'headerLineOnly', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '15%', '20%', '15%', '15%','20%','15%' ],

        body: [
          [ 
            {  text: `TIPO`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `VIN / SERIE`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `COLOR`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `NUM. MOTOR`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `KILÓMETROS | MILLAS`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `COMBUSTIBLE`,bold: true, alignment: 'left', style:'terminos2'},
          ],
          [ 
            {  text: `-----`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `------------`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['infoVehiculo'].color}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['infoVehiculo'].no_motor}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['kilometraje']}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: ``,bold: true, alignment: 'center', style:'sucursal'},
          ],
        ]
      }
    },
    {
      // layout: 'headerLineOnly', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '20%', '20%', '20%', '20%','20%' ],

        body: [
          [
            {  text: `TÉCNICO RESPONSABLE`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `FECHA DE RECEPCIÓN`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `HORA DE SALIDA`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `FECHA ENTREGA`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `ESTADO ACTUAL`,bold: true, alignment: 'left', style:'terminos2'},
          ],
          [
            {  text: `${data['infoTecnico'].usuario}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['fecha_recibido']}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['hora_entregado']}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `${data['fecha_entregado']}`,bold: true, alignment: 'center', style:'sucursal'},
            {  text: `Entregado`,bold: true, alignment: 'center', style:'sucursal'},
          ],
        ]
      }
    },
    {
      // layout: 'headerLineOnly', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '100%' ],

        body: [
          [
            {  text: `OBSERVACIONES / NOTAS`,bold: true, alignment: 'left', style:'terminos2'},
          ],
          [
            {  text: `${data['observaciones']}`,bold: true, alignment: 'justify', style:'sucursal'},
          ]
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    this.table(
      data['servicios'],
        ['index','nombre','cantidad','precio','total'],
        ['10%','50%','10%','20%','10%'],
        true,
        [ 
          {text:' ',style:'content',alignment: 'center', fillColor: '#FF6969', color:'white', alignmentChild: 'left'},
          {text:'DESCRIPCIÓN', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
          {text:'CANTIDAD', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
          {text:'P UNITARIO', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
          {text:'TOTAL', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
        ],
    ''),
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
      ]
      let infsd = []
      if (data['facturaRemision'] === 'factura') {
        infsd = [...info,
          {
            table: {
              headerRows: 1,
              widths: [ '70%', '20%', '10%'],
        
              body: [
                [ 
                  {  text: `IMPORTE CON LETRA`,bold: true, alignment: 'left', style:'terminos2'},
                  {  text: `Factura / Remision`,bold: true, alignment: 'center', style:'terminos2'},
                  {  text: `${data['facturaRemision']}`,bold: true, alignment: 'center', style:'terminos2'},
                ],
                [ 
                  {  text: `${letras(obtenerTotal(data['servicios'],data['facturaRemision'],data['margen']).total)}`,bold: true, alignment: 'center', style:'content'},
                  {  text: `SUBTOTAL`,bold: true, alignment: 'right', style:'content'},
                  {  text: `${redondeado2(obtenerTotal(data['servicios'],data['facturaRemision'],data['margen']).subtotal)}`,bold: true, alignment: 'right', style:'content'},
                ],
                [ 
                  {  text: ``,bold: true, alignment: 'center', style:'content'},
                  {  text: `IVA`,bold: true, alignment: 'right', style:'content'},
                  {  text: `${redondeado2(obtenerTotal(data['servicios'],data['facturaRemision'],data['margen']).iva)}`,bold: true, alignment: 'right', style:'content'},
                ],
                [ 
                  {  text: ``,bold: true, alignment: 'center', style:'content'},
                  {  text: `TOTAL`,bold: true, alignment: 'right', style:'content'},
                  {  text: `${redondeado2(obtenerTotal(data['servicios'],data['facturaRemision'],data['margen']).total)}`,bold: true, alignment: 'right', style:'content'},
                ],
              ]
            }
          }
        ]
      }else{
        infsd = [...info,
          {
            table: {
              headerRows: 1,
              widths: [ '70%', '20%', '10%'],
        
              body: [
                [ 
                  {  text: `IMPORTE CON LETRA`,bold: true, alignment: 'left', style:'terminos2'},
                  {  text: `Factura / Remision`,bold: true, alignment: 'center', style:'terminos2'},
                  {  text: `${data['facturaRemision']}`,bold: true, alignment: 'center', style:'terminos2'},
                ],
                [ 
                  {  text: `${letras(obtenerTotal(data['servicios'],data['facturaRemision'], data['margen']).total)}`,bold: true, alignment: 'center', style:'content'},
                  {  text: `SUBTOTAL`,bold: true, alignment: 'right', style:'content'},
                  {  text: `${redondeado2(obtenerTotal(data['servicios'],data['facturaRemision'], data['margen']).subtotal)}`,bold: true, alignment: 'right', style:'content'},
                ],
                [ 
                  {  text: ``,bold: true, alignment: 'center', style:'content'},
                  {  text: `TOTAL`,bold: true, alignment: 'right', style:'content'},
                  {  text: `${redondeado2(obtenerTotal(data['servicios'],data['facturaRemision'], data['margen']).total)}`,bold: true, alignment: 'right', style:'content'},
                ],
              ]
            }
          }
        ]
      }
   
    const info2 = [
      ...infsd,
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      layout: 'noBorders', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [  '70%', '30%' ],

        body: [
          [ 
            {  text: `OBSERVACIONES FORMA DE PAGO`,bold: true, alignment: 'left', style:'terminos2'},
            {  text: `Forma de pago ${data['formaPago']}`,bold: true, alignment: 'left', style:'terminos2'},
          ],
          [ 
            {  text: `La prestación del servicio de reparación y/o mantenimiento del vehículo se otorga con garantía por un plazo de 30 días en mano de obra contando a partir del servicio de la entrega del vehículo En partes eléctricas no hay garantía`,bold: true, alignment: 'justify', style:'terminos2'},
            // {  text: `FIRMA DE CONFORMIDAD`,bold: true, alignment: 'center', style:'terminos2'},
            {
              layout: 'noBorders', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '100%' ],
        
                body: [
                  [ {  text: `FIRMA DE CONFORMIDAD`,bold: true, alignment: 'center', style:'terminos2'} ],
                  [ {
                    image: `firma_cliente`,
                    height: 50,
                    width: 90,
                    aling: 'center',
                    valing: 'center',
                    alignment:'center'
                  } ],
                  [ {  text: `__________________________`,bold: true, alignment: 'center', style:'terminos2'} ],
                ]
              }
            }
          ],
        ]
      }
    },
   ]


   documentDefinition.content = info2
   documentDefinition.images = nuevasdocumentDefinitionimages
   return documentDefinition
   }

   getBase64ImageFromURL(url:string) {
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
  
  table(elements, columns, witdhsDef, showHeaders, headers, layoutDef) {
    return {
        table: {
            headerRows: 1,
            widths: witdhsDef,
            body: this.buildTableBody(elements, columns, showHeaders, headers)
        },
        layout: layoutDef
    };
  }
  buildTableBody(elements, columns, showHeaders, headers) {
    var body = [];
    if(showHeaders) body.push(headers); 
    let filtrados = elements.filter(f=>f['aprobado'])
    // console.log(filtrados);
    // console.log(elements);
    filtrados.map((e,index)=>{
      e['index'] = index + 1
      if (e['costo'] > 0) {
        e['precio'] = e['costo']
        e['total'] = e['costo'] *  e['cantidad']
      }else{
        // e['precio'] = e['precio']
        e['total'] = e['precio'] *  e['cantidad']
      }
    })
    
    filtrados.forEach(function  (row) {
        var dataRow = [];
        columns.forEach(function (column) {
          if (column==='precio' || column === 'total') {
            dataRow.push({text: `${ redondeado2( row[column])}`,alignment: 'right',style:'content' });
          }else if(column === 'cantidad' || column === 'index'){
            dataRow.push({text: `${row[column]}`,alignment: 'center',style:'content' });
          }else{
            dataRow.push({text: `${transform(row[column])}`,style:'content' });
          }
        })
        body.push(dataRow);
    })
    return body;
  }
}
function redondeado2(value: number,simbolo?:string): string {
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
function transform(value: string, ...args: unknown[]): unknown {
  const cadena = String(value).toLowerCase()
  let arr =[...cadena]
  arr[0] = arr[0].toUpperCase()
  return arr.join('');
}
function transformMayus(value: string, ...args: unknown[]): unknown {
  const cadena = String(value).toUpperCase()  
  return cadena;
}
function obtenerTotal(servicios,facturaRemision,marg){
  let filtrados = servicios.filter(f=>f['aprobado'])
  const reporte = {mo:0, refacciones_1:0,refacciones_ad:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0,total:0,iva:0}

  const margen = (1 + (marg/100))
  const norm_ = 1.30
  filtrados.map((e, index)=>{      
    e['index'] = index
    if (e['tipo'] ==='refaccion') {
      let pre = e['precio']
      let operacion = (e['cantidad']* pre) * margen
      if (e['costo']>0) {
        pre = e['costo']
        operacion = (e['cantidad']* pre) * margen
        reporte.sobrescrito_refaccion += operacion
      }else{
        reporte.refacciones_1 += operacion
      }
      e['flotilla'] = operacion
      e['normal'] = operacion * norm_
      reporte.refacciones_ad += e['precio']
    }else  if (e['tipo'] ==='mo') {
      let pre = e['precio']
      let operacion = (e['cantidad']* pre)
      if (e['costo']>0) {
        pre = e['costo']
        operacion = (e['cantidad']* pre)
        reporte.sobrescrito_mo += operacion
      }else{
        reporte.mo += operacion
      }
      e['flotilla'] = operacion
      e['normal'] = operacion * norm_
    }else if (e['tipo'] ==='paquete') {
      let element_internos = []
      if (e['elementos']) element_internos = e['elementos']
      const reporte_interno = {mo:0, refacciones_1:0, sobrescrito_mo:0,sobrescrito_refaccion:0}
  
      if (e['costo']>0) {
        const operacion = e['cantidad'] * e['costo']
        e['flotilla'] = operacion
        e['normal'] = operacion * norm_
        reporte.sobrescrito_paquetes += operacion
      }else{
        element_internos.map(e_interno=>{
          if (e_interno['tipo'] ==='refaccion') {
            let pre = e_interno['precio']
            let operacion = (e_interno['cantidad']* pre) * margen
            if (e_interno['costo']>0) {
              pre = e_interno['costo']
              operacion = (e_interno['cantidad']* pre) * margen
              reporte.sobrescrito_refaccion += operacion
              reporte_interno.sobrescrito_refaccion += operacion
            }else{
              reporte.refacciones_1 += operacion
              reporte_interno.refacciones_1 += operacion
            }
            e_interno['flotilla'] = operacion
            e_interno['normal'] = operacion * norm_
            reporte.refacciones_ad += e_interno['precio']
          }else  if (e_interno['tipo'] ==='mo') {
            let pre = e_interno['precio']
            let operacion = (e_interno['cantidad']* pre)
            if (e_interno['costo']>0) {
              pre = e_interno['costo']
              operacion = (e_interno['cantidad']* pre)
              reporte.sobrescrito_mo += operacion
              reporte_interno.sobrescrito_mo += operacion
            }else{
              reporte.mo += operacion
              reporte_interno.mo += operacion
            }
            e_interno['flotilla'] = operacion
            e_interno['normal'] = operacion * norm_
          }
        })
        e['reporte_interno'] = reporte_interno
        e['flotilla'] = (reporte_interno.mo+ reporte_interno.sobrescrito_mo + reporte_interno.sobrescrito_refaccion + reporte_interno.refacciones_1)
        e['normal'] = e['flotilla'] * norm_
      }
    }
  })
  let subtotal = reporte.refacciones_1 + reporte.mo + reporte.sobrescrito_paquetes + reporte.sobrescrito_mo + reporte.sobrescrito_refaccion
  let iva = 0
  let total = subtotal
  if(facturaRemision === 'factura'){
    iva = subtotal * .16
    total = subtotal + iva
  }
  
  return {total, subtotal, iva}
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
