import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Form } from '@angular/forms';
import { child, get, set, getDatabase, ref, onValue, onChildAdded, onChildChanged, onChildRemoved, push } from "firebase/database";
import Swal from 'sweetalert2';
import { CamposSystemService } from './campos-system.service';
import { map } from 'rxjs/operators';
import { EncriptadoService } from './encriptado.service';
import { AutomaticosService } from './automaticos.service';


const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({providedIn: 'root'})
export class ServiciosPublicosService {
    
    constructor(
      private http : HttpClient, private _campos:CamposSystemService,
      private _security: EncriptadoService, private _automaticos:AutomaticosService) {}

    sucursales_array = 
    [
      {
        id: '-N2gkVg1RtSLxK3rTMYc',
        "correo": "polancocallenuevdar@gmail.com",
        "direccion": "Av. San Esteban No. 18 Col.Fraccionamiento el Parque C.P. 53390 Naucalpan Edo. de México.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
        "serie": "1TKDG789",
        "status": false,
        "sucursal": "Polanco",
        "telefono": "5524877791"
      },
      {
        id: '-N2gkzuYrS4XDFgYciId',
        "correo": "contacto@speed-service.com.mx",
        "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Ftoreo.jpg?alt=media&token=3598287f-7519-4837-9c79-e0ed1c44c2f0",
        "serie": "5AJJL544",
        "status": true,
        "sucursal": "Toreo",
        "telefono": "5570451111"
      },
      {
        id: '-N2glF34lV3Gj0bQyEWK',
        "correo": "ventas_culhuacan@speed-service.com.mx",
        "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Fculhuacan.jpg?alt=media&token=8dc4dd01-7144-4860-9d26-b66dc9f95976",
        "serie": "8PFRT119",
        "status": true,
        "sucursal": "Culhuacán",
        "telefono": "5556951051"
      },
      {
        id: '-N2glQ18dLQuzwOv3Qe3',
        "correo": "Circuito@speed-service.com.mx",
        "direccion": "Avenida Río Consulado #4102, Col. Nueva Tenochtitlan, CP: 07880, Del. Gustavo A. Madero.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Fmolina.jpg?alt=media&token=6e844e0a-8a59-4463-842c-f3eb5682d50d",
        "serie": "3HDSK564",
        "status": true,
        "sucursal": "Circuito",
        "telefono": "5587894618"
      },
      {
        id: '-N2glf8hot49dUJYj5WP',
        "correo": "coapa@speed-service.com.mx",
        "direccion": "Prol. División del Nte. 1815, San Lorenzo la Cebada, Xochimilco, 16035 Ciudad de México, CDMX",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Fcoapa.jpg?alt=media&token=7ef3f47a-120d-4455-83e3-8cdf12f91c5a",
        "serie": "6JKGH923",
        "status": true,
        "sucursal": "Coapa",
        "telefono": "5587894608"
      },
      {
        id: '-NN8uAwBU_9ZWQTP3FP_',
        "correo": "com.yo9999@gmail.com",
        "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
        "imagen": "./assets/img/default-image.jpg",
        "serie": "5AJJL54434",
        "status": true,
        "sucursal": "lomas",
        "telefono": "5570451111"
      }
    
    ]
    metodospago = [
      {valor:'1', show:'Efectivo', ocupa:'Efectivo'},
      {valor:'2', show:'Cheque', ocupa:'Cheque'},
      {valor:'3', show:'Tarjeta', ocupa:'Tarjeta'},
      {valor:'4', show:'Transferencia', ocupa:'Transferencia'},
      {valor:'5', show:'Credito', ocupa:'credito'},
      // {valor:4, show:'OpenPay', ocupa:'OpenPay'},
      // {valor:5, show:'Clip / Mercado Pago', ocupa:'Clip'},
      {valor:'6', show:'Terminal BBVA', ocupa:'BBVA'},
      {valor:'7', show:'Terminal BANAMEX', ocupa:'BANAMEX'}
    ]

    url: string
    camposReporte = [ 'descuento','iva','meses','mo','refacciones_a','refacciones_v','sobrescrito','sobrescrito_mo','sobrescrito_paquetes','sobrescrito_refaccion','subtotal','total']
    camposReporte_show2 = {
      mo: 0,
      // refacciones_a: 0,
      refacciones_v: 0,
      sobrescrito: 0,
      // sobrescrito_mo: 0,
      // sobrescrito_refaccion: 0,
      // sobrescrito_paquetes: 0,
      meses: 0,
      descuento: 0,
      iva: 0,
      subtotal: 0,
      total: 0,
    }
    formasPAgo = [
      {
          id: '1',
          pago: 'contado',
          interes: 0,
          numero: 0
      }, {
          id: '2',
          pago: '3 meses',
          interes: 4.49,
          numero: 3
      }, {
          id: '3',
          pago: '6 meses',
          interes: 6.99,
          numero: 6
      }, {
          id: '4',
          pago: '9 meses',
          interes: 9.90,
          numero: 9
      }, {
          id: '5',
          pago: '12 meses',
          interes: 11.95,
          numero: 12
      }, {
          id: '6',
          pago: '18 meses',
          interes: 17.70,
          numero: 18
      }, {
          id: '7',
          pago: '24 meses',
          interes: 24,
          numero: 24
      }
    ]


    
    convierteFecha(fecha : string) {
     if (!fecha) return '';
  
      const [dia, mes, anio] = fecha.split('/');
      
      const diaFormateado = dia.padStart(2, '0');
      const mesFormateado = mes.padStart(2, '0');
      
      return `${diaFormateado}/${mesFormateado}/${anio}`;
    }
    restaFechasTaller = function (f1) {
      const dateHoy: Date = new Date()
      var aFecha1 = f1.split('/');
      // var aFecha2 = f2.split('/');
      var fFecha1 = new Date(aFecha1[2], aFecha1[1], aFecha1[0]).getTime();

      var fFecha2 = new Date( dateHoy.getFullYear(), dateHoy.getMonth() + 1, dateHoy.getDate() ).getTime();
      var dif = fFecha2 - fFecha1;
      var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
      // console.log(dias);
      return dias;
    }
    getFechaHora(fechaa? : Date) {
                  
        let fechas = new Date(),fechaNumeros = '', fechaNumerosAyer, fechaManianaNumeros 
        if (fechaa) fechas = new Date(fechaa)
        const date: Date = fechas;
        let ayer = fechas
        let fecha: string, hora: string, fechaM: string 
        const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ];
        const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        fecha = date.getDate() + "/" + (
            date.getMonth() + 1
        ) + "/" + date.getFullYear()
        fechaNumeros = `${date.getDate()}${ (date.getMonth() + 1)}${date.getFullYear()}`

        let fehaHoy = new Date()
        if (fechaa) fehaHoy = new Date(fechaa)
        
        let fechaManiana = new Date()
        fehaHoy.setHours(0, 0, 0, 0)

        fechaManiana.setDate(date.getDate() + 1)
        fechaManiana.setHours(0, 0, 0, 0)
        fechaM = fechaManiana.getDate() + "/" + (
            fechaManiana.getMonth() + 1
        ) + "/" + fechaManiana.getFullYear()

        hora = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        const numeroDia = new Date(date).getDay();
        const numeroManiana = new Date(fechaManiana).getDay();
        const fechaPDF = `${dias[numeroDia]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        const n = new Date(date)
        n.setDate(date.getDate() + 20);
        const vencimiento = n.toLocaleDateString()
        const Mes = months[date.getMonth()]
        ayer.setDate(date.getDate() - 1)
        ayer.setHours(0, 0, 0, 0)
        fechaNumerosAyer = `${ayer.getDate()}${ (ayer.getMonth() + 1)}${ayer.getFullYear()}`
        fechaManianaNumeros = `${fechaManiana.getDate()}${ (
            fechaManiana.getMonth() + 1
        )}${fechaManiana.getFullYear()}`

        const diaReturn = dias[numeroManiana]
        return {
              fecha,hora,fechaPDF,vencimiento,Mes,fechaM,diaReturn,numeroManiana,
              fechaNumeros,ayer,fechaNumerosAyer,fehaHoy,fechaManianaNumeros,fechaManiana
        }
    }
    convierte_fechaString_personalizada(fecha: Date) {
      const f1 = new Date(fecha);
      const hora = new Date(fecha);
      const string_fecha = `${f1.getDate()}/${f1.getMonth() + 1}/${f1.getFullYear()}`;
      const stringHora = `${hora.getHours()}:${hora.getMinutes()}:${hora.getSeconds()}`;
      const stringNumeros = `${f1.getDate()}${f1.getMonth()+ 1}${f1.getFullYear()}`;
      return {string_fecha, stringHora, fechaString: new Date(fecha), stringNumeros, hora};
    }
    construyeFechaString(fecha : string, hora? : string) {
        const splitFecha = fecha.split('/')
        let horaNew = '00:00:00'
        if (hora) horaNew = hora
        const splitHora = horaNew.split(':')
        const fechaNew = new Date(
            Number(splitFecha[2]),
            Number(splitFecha[1]) - 1,
            Number(splitFecha[0]),
            Number(splitHora[0]),
            Number(splitHora[1]),
            Number(splitHora[1]),
            0
        )
     return fechaNew
    }
    convierteALetrasCantidad(num) {
        let unidad,
            decena,
            centenas,
            cientos
        function Unidades(num) {
            switch (num) {
                case 1:
                    return 'UN';
                case 2:
                    return 'DOS';
                case 3:
                    return 'TRES';
                case 4:
                    return 'CUATRO';
                case 5:
                    return 'CINCO';
                case 6:
                    return 'SEIS';
                case 7:
                    return 'SIETE';
                case 8:
                    return 'OCHO';
                case 9:
                    return 'NUEVE';
        }

        return '';
        } //Unidades()
        function Decenas(num) {
            decena = Math.floor(num / 10);
            unidad = num - (decena * 10);
            switch (decena) {
                case 1:
                    switch (unidad) {
                        case 0:
                            return 'DIEZ'
                        case 1:
                            return 'ONCE'
                        case 2:
                            return 'DOCE'
                        case 3:
                            return 'TRECE'
                        case 4:
                            return 'CATORCE'
                        case 5:
                            return 'QUINCE'
                        default:
                            return 'DIECI' + Unidades(unidad);
                    }
                case 2:
                    switch (unidad) {
                        case 0:
                            return 'VEINTE';
                        default:
                            return 'VEINTI ' + Unidades(unidad);
                    }
                case 3:
                    return DecenasY('TREINTA', unidad);
                case 4:
                    return DecenasY('CUARENTA', unidad);
                case 5:
                    return DecenasY('CINCUENTA', unidad);
                case 6:
                    return DecenasY('SESENTA', unidad);
                case 7:
                    return DecenasY('SETENTA', unidad);
                case 8:
                    return DecenasY('OCHENTA', unidad);
                case 9:
                    return DecenasY('NOVENTA', unidad);
                case 0:
                    return Unidades(unidad);
            }
        } //Unidades()
        function DecenasY(strSin, numUnidades) {
            if (numUnidades > 0) 
                return strSin + ' Y ' + Unidades(numUnidades)
            return strSin;
        } //DecenasY()
        function Centenas(num) {
            centenas = Math.floor(num / 100);
            let decenas = num - (centenas * 100);
            switch (centenas) {
                case 1:
                    if (decenas > 0) 
                        return 'CIENTO ' + Decenas(decenas);
                    return 'CIEN';
                case 2:
                    return 'DOSCIENTOS ' + Decenas(decenas);
                case 3:
                    return 'TRESCIENTOS ' + Decenas(decenas);
                case 4:
                    return 'CUATROCIENTOS ' + Decenas(decenas);
                case 5:
                    return 'QUINIENTOS ' + Decenas(decenas);
                case 6:
                    return 'SEISCIENTOS ' + Decenas(decenas);
                case 7:
                    return 'SETECIENTOS ' + Decenas(decenas);
                case 8:
                    return 'OCHOCIENTOS ' + Decenas(decenas);
                case 9:
                    return 'NOVECIENTOS ' + Decenas(decenas);
            }
            return Decenas(decenas);
        } //Centenas()
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
        } //Seccion()
        function Miles(num) {
            let divisor = 1000;
            let cientos = Math.floor(num / divisor)
            let resto = num - (cientos * divisor)
            let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
            let strCentenas = Centenas(resto);
            if (strMiles == '') 
                return strCentenas;
            return strMiles + ' ' + strCentenas;
        } //Miles()
        function Millones(num) {
            let divisor = 1000000;
            let cientos = Math.floor(num / divisor)
            let resto = num - (cientos * divisor)
            let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE')
            let strMiles = Miles(resto);
            if (strMillones == '') 
                return strMiles;
            return strMillones + ' ' + strMiles;
        } //Millones()
        function NumeroALetras(num) {
            let data = {
                numero: num,
                enteros: Math.floor(num),
                centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
                letrasCentavos: '',
                letrasMonedaPlural: 'PESOS M.N', //“PESOS”, 'Dólares', 'Bolívares', 'etcs'
                letrasMonedaSingular: 'PESO M.N', //“PESO”, 'Dólar', 'Bolivar', 'etc'
                letrasMonedaCentavoPlural: 'CENTAVOS',
                letrasMonedaCentavoSingular: 'CENTAVO'
            };
            if (data.centavos > 0) {
                data.letrasCentavos = 'CON ' + (
                    function () {
                        if (data.centavos == 1) 
                            return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                        else 
                            return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
                        }
                    )();
            };
            if (data.enteros == 0) 
                return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
            if (data.enteros == 1) 
                return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
            else 
                return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
            }
        //NumeroALetras()
        return NumeroALetras(num)
    }    
    redondeado(value : number, simbolo? : string) {
      if (!value || isNaN(value)) return `$ 0.00`; 
      const isNegative = value < 0;
      const [integerPart, decimalPart = '00'] = Math.abs(value).toFixed(2).split('.');
      const formattedIntegerPart = integerPart
        .split('')
        .reverse()
        .reduce((result, digit, index) => {
          const isThousands = index % 3 === 0 && index !== 0;
          return `${digit}${isThousands ? ',' : ''}${result}`;
        }, '');
      const symbol = (simbolo) ? simbolo : '$'
      const formattedValue = `${symbol} ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;
      return formattedValue;

    }
    redondeado2(value : number, simbolo : boolean) {
      if (!value || isNaN(value)) return `$ 0.00`; 
      const isNegative = value < 0;
      const [integerPart, decimalPart = '00'] = Math.abs(value).toFixed(2).split('.');
      const formattedIntegerPart = integerPart
        .split('')
        .reverse()
        .reduce((result, digit, index) => {
          const isThousands = index % 3 === 0 && index !== 0;
          return `${digit}${isThousands ? ',' : ''}${result}`;
        }, '');
      const symbol = (simbolo) ? simbolo : '$'
      const formattedValue = `${symbol} ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;
      return formattedValue;                

    }
    costodePaquete(array : any, margen : number) {
        const info = { mo: 0,refacciones1: 0,refacciones2: 0,UB: 0,flotilla: 0,normal: 0,precio: 0}
        let mo = 0, refacciones1 = 0, refacciones2 = 0, suma = 0
        array.forEach(a => {
            if (a['tipo'] === 'mo') {
                if (!a['costo']) a['costo'] = 0;
                
                (a['costo'] > 0)
                    ? mo += (a['cantidad'] * a['costo'])
                    : mo += (a['cantidad'] * a['precio'])
            } else {
                if (a['costo'] > 0) {
                    refacciones1 += a['cantidad'] * a['costo']
                    refacciones2 += a['cantidad'] * a['costo']
                } else {
                    refacciones1 += a['cantidad'] * a['precio']
                    refacciones2 += a['cantidad'] * (a['precio'] * (1 + (margen / 100)))
                }
            }
        })
        info.mo = mo;
        info.refacciones1 = refacciones1;
        info.refacciones2 = refacciones2;
        suma = mo + refacciones2
        // info.UB = ((suma - refacciones1) * 100) / suma
        info.UB =100- ((refacciones1 * 100) / suma)

        //la primera formula que se me entrego
        // desgloce.UB = ((desgloce.subtotal - desgloce.refacciones_1) * 100) / desgloce.subtotal
        // La segunda formula que se me entrego
        // desgloce.UB2 = 100 - ((desgloce.refacciones_2 * 100) / desgloce.total)

        info.flotilla = suma
        info.normal = suma * (1 + (margen / 100))
        return info
    }
    nuevaRecuperacionData(data: any, camposRecuperar: any[]) {
        const necessary: any = {};
        camposRecuperar.forEach((recupera) => {
            if(typeof data[recupera] === 'string'){
                const evalua = String(data[recupera]).trim()
                if (evalua !== undefined && evalua !== null && evalua !== "") {
                    necessary[recupera] = evalua;
                }
            }else{
                if (data[recupera] !== undefined && data[recupera] !== null && data[recupera] !== "") {
                    necessary[recupera] = data[recupera];
                }
            }
        });
        return necessary;
    }
    crearArreglo2(arrayObj: Record<string, any> | null): any[] {
      if (!arrayObj) return []; 
      return Object.entries(arrayObj).map(([key, value]) => ({ ...value, id: key }));
    }
    crear_arreglo_per(arreglo:any):any[]{
      if (!arreglo) return [];
      return Object.entries(arreglo).map(([key, value]) => {
        const  nue = {...arreglo[key], id: key};
        return nue
      });
    }
    crearArreglo(clientesObj : object) {
      const clientes: any[] = clientesObj ? Object.values(clientesObj) : [];
      return clientes;
    }
    ordernarPorCampo(arreglo : any, campo : string) {
      arreglo.sort((a, b) => b[campo].localeCompare(a[campo]));
      return arreglo;
    }
    mensajeCorrecto(mensaje : string, icon_get:number) {
      let icon
      switch (icon_get) {
        case 0: icon = 'error'; break;
        case 1: icon = 'success'; break;
        case 2: icon = 'warning'; break;
        case 3: icon = 'info'; break;
        case 4: icon = 'question'; break;
        default: icon = 'error'; break;
      }
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({icon: icon, title: mensaje})
    }
    async mensaje_pregunta(mensaje, allowOutsideClick?, html?:string) {
        let mensajeAnswer = { respuesta: false }
        await Swal
            .fire({
                title: `¿${mensaje}?`,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                denyButtonText: `Don't save`,
                cancelButtonText: `Cancelar`,
                allowOutsideClick,
                html
            })
            .then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    mensajeAnswer.respuesta = true
                } else if (result.isDenied) {
                    mensajeAnswer.respuesta = false
                }
            })
        return mensajeAnswer
    }   
    async mensaje_pregunta_2(data) {
      const {mensaje, allowOutsideClick, html} = data
      let mensajeAnswer = { respuesta: false }

      let allow = (allowOutsideClick) ? allowOutsideClick : true
      await Swal
          .fire({
              title: `¿${mensaje}?`,
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonText: 'Confirmar',
              denyButtonText: `Don't save`,
              cancelButtonText: `Cancelar`,
              allowOutsideClick: allow,
              backdrop:true,
              html
          })
          .then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                  mensajeAnswer.respuesta = true
              } else if (result.isDenied) {
                  mensajeAnswer.respuesta = false
              }
          })
      return mensajeAnswer
  }  
    SwalTipoSobrescrito(costo : number) {
        Swal.fire({
            title: 'Costo de paquete sobrescrito',
            icon: 'info',
            html: `en <strong>${costo}</strong>`,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
            confirmButtonAriaLabel: 'Thumbs up, great!'
        })
    }
    mensajeSwal(mensaje : string,icon_get:number, outclik?:boolean, html?:string) {
      let icon
      switch (icon_get) {
        case 0: icon = 'error'; break;
        case 1: icon = 'success'; break;
        case 2: icon = 'warning'; break;
        case 3: icon = 'info'; break;
        case 4: icon = 'question'; break;
        default: icon = 'error'; break;
      }
        Swal.fire({
            position: 'center', icon, title: mensaje, showConfirmButton: true,
            allowOutsideClick: false,
            focusConfirm: true,
            html
            // timer: 1500
        })
    }
    generaClave() {
        return push(child(ref(db), 'posts')).key
    }
    realizavalidaciones_new(data, campos:any[]){
      const answer = {faltante_s:null, ok:true}
      let faltantes = []
      campos.forEach((campo)=>{
        if (campo !== 'costo') {
          if(campo === 'elementos' || campo === 'servicios'){
            const elementos:any[] = (data[campo]) ? data[campo] : []
            if(elementos.length <=0 ) faltantes.push(campo)
          } else if(campo === 'fecha'){
            const cadena_contador = String(data[campo]).length
            if (cadena_contador < 10) {
              faltantes.push(campo)
            }
          }else if (campo !== 'fecha') {
            if (!data[campo]) faltantes.push(campo)
          }
        }
      })
      if (faltantes.length) answer.ok = false 
      const cadena = faltantes.join(', ')
      answer.faltante_s = this.reemplaza_strig(cadena)
      return answer
    }
    swalToast(mensaje:string, icon_get:number, position_get?){

      // 'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', or 'bottom-end'
      let icon
      switch (icon_get) {
        case 0: icon = 'error'; break;
        case 1: icon = 'success'; break;
        case 2: icon = 'warning'; break;
        case 3: icon = 'info'; break;
        case 4: icon = 'question'; break;
      
        default:
          icon = 'error'
          break;
      }
      //position  : ['top-end','center']
      const position = (position_get) ? position_get : 'top-start'
        const Toast = Swal.mixin({
            toast: true,
            position,
            showConfirmButton: false,
            timer: 3000,
          })
          
          Toast.fire({ icon, title: mensaje })
    }    
    async swalPrevisualizar(mensaje:string){
        const answer = {accion:''}
        await Swal.fire({
            title: `${mensaje}`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Previsualizar',
            denyButtonText: `Continuar con entrega`,
          }).then((result) => {
            if (result.isConfirmed) {
                answer.accion = 'previsualizar'
            } else if (result.isDenied) {
                answer.accion = 'continuar'
            }
          })
          return answer
    }
    realizarOperaciones_2(data:any){
        
        const  { elementos,  iva, formaPago, descuento, servicios, margen } = data

        const ocupados = (servicios) ?  [...servicios]: [...elementos]
        const margen1_0 = (margen) ?   margen : 25
        
        const margenOcupado = 1 + (margen1_0 / 100)
        
        const reporteGeneral = {
          iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
          subtotal:0, total:0, ub:0, meses:0, descuento:0,sobrescrito:0
        }
        let cstoCOmpra = 0
        ocupados.map((e,index)=>{
        
        if(e.tipo === 'refaccion') {
            (e.costo > 0) ? cstoCOmpra+= e.costo : cstoCOmpra+= e.precio 
        }
          e.index = index
          const pre = e.costo >0 ? e.costo : e.precio;
          const operacion =  e.tipo === "refaccion" ? e.cantidad * pre : e.cantidad * pre;
          if (e.costo > 0) {
            if (e.tipo === 'refaccion') {
              if(e.aprobado) reporteGeneral.sobrescrito_refaccion += (operacion * margenOcupado);
              e.total = operacion * margenOcupado
            } else if (e.tipo ==='mo') {
                if(e.aprobado) reporteGeneral.sobrescrito_mo += operacion;
              e.total = operacion
            }else {
                const  {elementos, reporte} = this.reportePaquete(e.elementos,margenOcupado);
                e.elementos = elementos
                e.reporte = reporte
                e.precio = reporte.total
                e.total = operacion
                // if(e.aprobado) e.costo += operacion;
                if(e.aprobado) {
                    reporteGeneral.sobrescrito_paquetes += operacion
                }
            }
          }else{
            e.costo = 0
            if (e.tipo === 'refaccion') {
              if(e.aprobado) reporteGeneral.refacciones_a += operacion;
              e.total = operacion * margenOcupado
            } else if (e.tipo ==='mo') {
              if(e.aprobado) reporteGeneral.mo += operacion;
              e.total = operacion
            }else {
                const {elementos, reporte,cstCo} = this.reportePaquete(e.elementos,margenOcupado)
                cstoCOmpra+= cstCo
                e.elementos = elementos
                e.reporte = reporte;
                e.precio = reporte.total;
                e.total = reporte.total * e.cantidad
                if(e.aprobado) {
                    reporteGeneral.mo += reporte.mo * e.cantidad;
                    reporteGeneral.refacciones_a += reporte.refacciones * e.cantidad;
                    reporteGeneral.sobrescrito_mo += reporte.sobrescrito_mo * e.cantidad;
                    reporteGeneral.sobrescrito_refaccion += reporte.sobrescrito_refaccion * e.cantidad;
                } 
              // console.log('costo normal',info);
            }
          }

        })
        let refaccionesv = 0
        if(reporteGeneral.refacciones_a > 0){
            reporteGeneral.refacciones_v = (reporteGeneral.refacciones_a * margenOcupado)
            refaccionesv = (reporteGeneral.refacciones_v >= 0) ? reporteGeneral.refacciones_v : 0
        }

        reporteGeneral.sobrescrito = reporteGeneral.sobrescrito_mo + reporteGeneral.sobrescrito_paquetes + reporteGeneral.sobrescrito_refaccion
        
        const suma = reporteGeneral.mo + reporteGeneral.refacciones_v + reporteGeneral.sobrescrito
        reporteGeneral.subtotal = suma;
    
        (iva) ? reporteGeneral.total = suma * 1.16 : reporteGeneral.total = suma;
    
        if (iva) reporteGeneral.iva = suma * .16 ;
        
        const enCaso_meses = this.formasPAgo.find(f=>f.id === String(formaPago))
        // console.log(enCaso_meses);
        if (enCaso_meses.id === '1') {
          reporteGeneral.descuento = Number(descuento)
          if(!reporteGeneral.descuento) reporteGeneral.descuento = 0
          reporteGeneral.total -= reporteGeneral.descuento
        }else{
          reporteGeneral.descuento = 0
          const operacion = reporteGeneral.total * (1 + (enCaso_meses['interes'] / 100))
          reporteGeneral.meses = operacion;
        }
        if (reporteGeneral.total >0 ) {
            reporteGeneral.ub = (reporteGeneral.subtotal - cstoCOmpra) *100/reporteGeneral.subtotal
        } 
        return { reporte: reporteGeneral, ocupados}
    }    
    reportePaquete(elementos:any,margen:number){
        if (!elementos) elementos = [];

        const reporte_interno = {mo: 0,refacciones: 0,refacciones_v: 0,sobrescrito_mo: 0,sobrescrito_refaccion: 0,ub: 0,total: 0};
        let cstCo =0
        elementos.forEach((e_interno, index) => {
          e_interno.index = index;
        if(e_interno.tipo === 'refaccion'){
            (e_interno.costo > 0) ? cstCo += e_interno.costo:  cstCo += e_interno.precio 
        }
          const pre_interno = e_interno.costo > 0 ? e_interno.costo : e_interno.precio;
          const operacion_interno = e_interno.cantidad * pre_interno;
        
          if (e_interno.costo > 0) {
            e_interno.tipo === 'refaccion'
              ? (reporte_interno.sobrescrito_refaccion += operacion_interno * margen)
              : (reporte_interno.sobrescrito_mo += operacion_interno);
        
              e_interno.total = operacion_interno * (e_interno.tipo === 'refaccion' ? margen : 1);
          } else {
            e_interno.costo = 0
            e_interno.tipo === 'refaccion'
              ? (reporte_interno.refacciones += operacion_interno)
              : (reporte_interno.mo += operacion_interno);
        
            e_interno.total = operacion_interno * (e_interno.tipo === 'refaccion' ? margen : 1);
          }
        });
        if(reporte_interno.refacciones >0) reporte_interno.refacciones_v = reporte_interno.refacciones * margen;
        reporte_interno.total =
          reporte_interno.mo +
          reporte_interno.refacciones_v +
          reporte_interno.sobrescrito_mo +
          reporte_interno.sobrescrito_refaccion;
        reporte_interno.ub = 100 - (reporte_interno.refacciones_v * 100) / reporte_interno.total;
        
        return { reporte: { ...reporte_interno }, elementos ,cstCo};
        // return null
        
    }
    realizarOperaciones_real(hitoriales:any){
        const { historial_gastos, historial_pagos } = hitoriales
        const reporte_gastos = {mo:0, refacciones:0,ub:0}
        const reporte_pagos = {total:0}
        const reporte_utilidad = {utilidad:0}
        historial_gastos.forEach(gasto => {
            if(gasto.status){
                (gasto.gasto_tipo ==='mo') ?
                reporte_gastos.mo += gasto['monto'] : 
                reporte_gastos.refacciones += gasto['monto']
            }
        });
        historial_pagos.forEach(pago => {
            if(pago.status) reporte_pagos.total += pago.monto 
        });

        const gastos = reporte_gastos.mo + reporte_gastos.refacciones

        reporte_gastos.ub = 100 - ((reporte_gastos.refacciones * 100) / gastos)

        reporte_utilidad.utilidad = reporte_pagos.total - gastos

        return {...reporte_gastos, gastos: gastos,pagos:reporte_pagos.total,utilidad:reporte_utilidad.utilidad}
    }
    dataCorreo(sucursal, cliente){
        const correos = [sucursal.correo];
        if (cliente.correo) correos.push(cliente.correo); 
        if (cliente.correo_sec) correos.push(cliente.correo_sec);
        return correos;
    }    
    obtenerNombresElementos(elementos) {
        return elementos.map(({nombre}) => String(nombre).toLowerCase()).join(', ');
    }
    mensaje(mensaje: string, icon_get?, time?){
      let icon
        switch (icon_get) {
          case 0: icon = 'error'; break;
          case 1: icon = 'success'; break;
          case 2: icon = 'warning'; break;
          case 3: icon = 'info'; break;
          case 4: icon = 'question'; break;
          default: icon = 'error'; break;
        }
      const timer = (time) ? time : 2000
      Swal.fire({
          position: 'center',
          icon,
          title: mensaje,
          showConfirmButton: false,
          timer
        })
    }
    calcularDias(fechaInicio: string, fechaFin: string): number {
      const date1 = new Date(fechaInicio.split('/').reverse().join('-'));
      const date2 = new Date(fechaFin.split('/').reverse().join('-'));
      const diffTime = date2.getTime() - date1.getTime()
      const diasTranscurridos = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diasTranscurridos;
    }
    calcularDiasEntrega(fechaInicio: Date, fechaFin: Date): number {
      const date1 = new Date(fechaInicio);
      const date2 = new Date(fechaFin);
      const diffTime = date2.getTime() - date1.getTime()
      const diasTranscurridos = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diasTranscurridos;
    }
    construyeDesgloceEmail(desgloce:any){
      let arreglo = []
      const claves = Object.keys(desgloce)
      claves.forEach(c=>{
          if (desgloce[c]>0) {
              arreglo.push(`${c}: ${this.redondeado2(desgloce[c],true)} <br>`)
          }
      })
      return arreglo.join(', ')
    }
    resetearHoras(fecha: Date){
      fecha.setHours(0, 0, 0, 0);
      return fecha;
    }
    resetearHoras_horas(fecha: Date, hora){
      const [horas, minutos, segundos] = hora.split(':');
        fecha.setHours(parseInt(horas, 10));
        fecha.setMinutes(parseInt(minutos, 10));
        fecha.setSeconds(parseInt(segundos, 10));
      return fecha;
    }
    asignarHoraAFecha_new(fecha:string): Date{
      const fechaObj = new Date(fecha);
      return fechaObj;
    }
    asignarHoraAFecha(fecha: string, hora?: string): Date {
      const fechaObj = new Date(fecha);
      if(hora){
        const horaMinutos = hora.split(':');
        const horaAsignada = Number(horaMinutos[0]);
        const minutosAsignados = Number(horaMinutos[1]);
        fechaObj.setHours(horaAsignada, minutosAsignados);
      }else{
        fechaObj
      }
      return fechaObj;
    }
    retorna_fechas_hora(data?) {
      let fechaString = new Date().toString()
      let hora_recibida
      // const {  hora_recibida } = data
      if (data) {
        const {  fechaString: fecha_get, hora_recibida: hora_get  } = data 
        fechaString = fecha_get
        hora_recibida  = hora_get
      }
      const fecha = new Date(fechaString);
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1; // Los meses en JavaScript son base 0, por eso se suma 1
      const anio = fecha.getFullYear();
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes();
      const segundos = fecha.getSeconds();
      if (hora_recibida) {
        const [horaAsignada, minutosAsignados, segundosAsignados] = hora_recibida.split(':').map(Number);
        fecha.setHours(horaAsignada, minutosAsignados, segundosAsignados);
      }
      const formateada = `${dia}/${mes}/${anio}`;
      // const hora_formateada = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      
      const toString = fecha.toString();
      // const completa = `${formateada} ${hora_formateada}`;
      const completa = `${formateada}`;
      const time_actual = new Date();
      const hora_actual = `${time_actual.getHours().toString().padStart(2, '0')}:${time_actual.getMinutes().toString().padStart(2, '0')}:${time_actual.getSeconds().toString().padStart(2, '0')}`;

      const fecha_recibida_hora_actual = `${formateada} ${hora_actual}`;
      
      const fechanew = new Date(toString);
      fechanew.setHours(time_actual.getHours(), time_actual.getMinutes(), time_actual.getSeconds());
      const fecha_hora_actual = time_actual.toString();
      const toString_completa = fechanew.toString();
    
      return { toString, completa, formateada, hora_actual, fecha_recibida_hora_actual, fecha_hora_actual, toString_completa };

    }
    formatearFecha_new(fecha: string, incluirHora: boolean = false): Date {
      const fechaObj = new Date(fecha);
      const dia = fechaObj.getUTCDate();
      const mes = fechaObj.getUTCMonth() + 1; // Los meses en JavaScript son base 0, por eso se suma 1
      const anio = fechaObj.getUTCFullYear();
      const hora = fechaObj.getUTCHours();
      const minutos = fechaObj.getUTCMinutes();
    
      let fechaFormateada = `${dia}/${mes}/${anio}`;
    
      if (incluirHora) {
        fechaFormateada += ` ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      }
      
    
      return new Date(fechaFormateada);
    }
    verificarFechasIgualesHoy(fecha1: Date, fecha2: Date): boolean {
      const hoy = new Date();
      const diaHoy = hoy.getDate();
      const mesHoy = hoy.getMonth();
      const anioHoy = hoy.getFullYear();
    
      const diaFecha1 = fecha1.getDate();
      const mesFecha1 = fecha1.getMonth();
      const anioFecha1 = fecha1.getFullYear();
    
      const diaFecha2 = fecha2.getDate();
      const mesFecha2 = fecha2.getMonth();
      const anioFecha2 = fecha2.getFullYear();
    
      return diaHoy === diaFecha1 && mesHoy === mesFecha1 && anioHoy === anioFecha1 &&
             diaHoy === diaFecha2 && mesHoy === mesFecha2 && anioHoy === anioFecha2;
    }
    obtenerHoraActual(): string {
      const ahora = new Date();
      const hora = ahora.getHours();
      const minutos = ahora.getMinutes();
      const segundos = ahora.getSeconds();
    
      const horaFormateada = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    
      return horaFormateada;
    }
    solo_numeros_fecha_hoy(){
      const fecha = new Date()
      const  dia = fecha.getDate().toString().padStart(2, '0')
      const  mes = (fecha.getMonth()+1).toString().padStart(2, '0')
      const  year = fecha.getFullYear()
      return `${dia}${mes}${year}`
    }
    
    
    
    getHoraActual(fecha){
      const horaActual = new Date(fecha)
      return `${ horaActual.getHours()}:${ horaActual.getMinutes()}:${horaActual.getSeconds()}`
    }
    sumarRestarDiasFecha(fecha, dias) {
      const resultado = new Date(fecha);
      resultado.setDate(resultado.getDate() + dias);
      return resultado;
    }
    sumarRestarMesesFecha(fecha, meses) {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setMonth(nuevaFecha.getMonth() + meses);
      return nuevaFecha;
    }
    sumarRestarAniosFecha(fecha, anios) {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setFullYear(nuevaFecha.getFullYear() + anios);
      return nuevaFecha;
    }
    esDomingo(fecha) {
      const fech_get = new Date(fecha)
      return fech_get.getDay() === 0;
    }
    esSabado(fecha) {
      const fech_get = new Date(fecha)
      return fech_get.getDay() === 6;
    }
    formatearFecha(fecha_get,simbolo:boolean,symbol?) {
      let fecha = new Date(fecha_get)
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const anio = fecha.getFullYear().toString();
      if(!symbol) symbol= '/'
      return (simbolo) ? `${dia}${symbol}${mes}${symbol}${anio}` : `${dia}${mes}${anio}`;
    }
    getFirstAndLastDayOfCurrentMonth(fecha) {
      const date = new Date(fecha);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const lastDay = new Date(year, month, 0).getDate()
      
      const inicio = new Date(year, month -1, 1)
      const final = new Date(year, month -1 , lastDay)
      return { inicio, final };
    }
    obtenerPrimerUltimoDiaAnio(anio) {
      const primerDiaAnio = new Date(anio, 0, 1);
      const ultimoDiaAnio = new Date(anio + 1, 0, 1, -1);
    
      return { primerDia: primerDiaAnio, ultimoDia: ultimoDiaAnio };
    }
    obtenerHorasEntreFechas(fechaInicial, fechaFinal) {
      const milisegundosPorHora = 1000 * 60 * 60;
      const diferenciaEnMilisegundos = fechaFinal - fechaInicial;
      const horas = diferenciaEnMilisegundos / milisegundosPorHora;
      return horas;
    }
    convertirFecha(fechaString) {
      const partes = fechaString.split('/');
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1; // Restar 1 al mes, ya que en el objeto Date los meses van de 0 a 11
      const anio = parseInt(partes[2], 10);
    
      const fecha = new Date(anio, mes, dia);
      return fecha;
    }
    conveirtefecha_2(Date: Date){
      const fecha_completa = `${Date.getDate()}/${Date.getMonth() + 1}/${Date.getFullYear()}`
      const dia = Date.getDate(), mes = Date.getMonth() + 1, anio = Date.getFullYear()
      return {fecha_completa, dia, mes, anio}
    }
    ordenarData(data, campo, ascendente) {
      return data.sort((a, b) => {
        if (campo === 'fecha_recibido') {
          if (new Date(a[campo]) < new Date(b[campo])) {
            return ascendente ? -1 : 1;
          }
          if (new Date(a[campo]) > new Date(b[campo])) {
            return ascendente ? 1 : -1;
          }
          return 0;
        }else{
          if (a[campo] < b[campo]) {
            return ascendente ? -1 : 1;
          }
          if (a[campo] > b[campo]) {
            return ascendente ? 1 : -1;
          }
          return 0;
        }
        
      });
    }
    actualizarArregloExistente(arregloExistente, nuevaInformacion, camposRecupera) {
        if (arregloExistente.length === 0) {
          return nuevaInformacion;
        } else if (arregloExistente.length === nuevaInformacion.length) {
          return arregloExistente.map((elemento, index) => {
            const nuevoElemento = nuevaInformacion[index];
            camposRecupera.forEach(campo => {
              if (nuevoElemento[campo] !== elemento[campo]) {
                elemento[campo] = nuevoElemento[campo];
              }
            });
            return elemento;
          });
        } else if (nuevaInformacion.length > arregloExistente.length) {
          const arregloActualizado = arregloExistente.map((elemento, index) => {
            const nuevoElemento = nuevaInformacion[index];
            camposRecupera.forEach(campo => {
              if (nuevoElemento[campo] !== elemento[campo]) {
                elemento[campo] = nuevoElemento[campo];
              }
            });
            return elemento;
          });
        
          return [...arregloActualizado, ...nuevaInformacion.slice(arregloExistente.length)];
        } else if (nuevaInformacion.length < arregloExistente.length) {
          return nuevaInformacion;
        } else {
          return arregloExistente.slice(0, nuevaInformacion.length);
        }
    }
    reporte_cotizaciones_recepciones(arregloCotizaciones){
      const reporte = {total:0, subtotal:0,iva:0}
      arregloCotizaciones.forEach(c => {
          c.margen = (!c.margen)  ? 25 : c.margen
          c.formaPago = (!c.formaPago)  ? '1' : c.formaPago
          c.reporte = (!c.reporte)  ? this.realizarOperaciones_2(c).reporte : c.reporte
          reporte.subtotal += c.reporte.subtotal
          reporte.iva += c.reporte.iva
          reporte.total += c.reporte.total
      });
      return reporte
    }
    new_obtenerPrimerUltimoDiaMes(start, end){
      const fecha_start = new Date(start)
      const month = fecha_start.getMonth() 
      const year = fecha_start.getFullYear()
      const primerDia = new Date(year, month, 1);

      const fecha_end = new Date(end)
      const month_end = fecha_end.getMonth() 
      const year_end = fecha_end.getFullYear()
      const ultimoDia = new Date(year_end, month_end + 1, 0);
      return {primerDia, ultimoDia}
    }
    obtenerPrimerUltimoDiaMes(mes, anio) {
      const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ];
      const fecha = new Date(anio, mes - 1, 1); // Crear una fecha con el primer día del mes
      const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1); // Obtener el primer día del mes
      const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0); // Obtener el último día del mes
      const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      const dias2 = ["dom","lun","mar","mié","jue","vie","sáb"]
      const DiaPrimero = primerDia.getDay();
      const DiaFinal = ultimoDia.getDay();
      const Mes = months[primerDia.getMonth()]
      return {
        primerDia,
        ultimoDia,
        Mes,
        diaIniciail: dias2[DiaPrimero],
        diaFinal: dias2[DiaFinal],
      };
    }
    obtenerDiferencias(array1, elimina) {
      // const nuevo = 
      return array1.filter(element => element !== elimina);
    }
    obtenerDiferenciaHoras(fechaHora, fechaHora2) {
      const fecha1 = new Date(fechaHora);
      const fecha2 = new Date(fechaHora2);
      
      // Obtener la diferencia en milisegundos
      const diferenciaMs = fecha2.getTime() - fecha1.getTime();
      
      // Calcular la diferencia en horas y minutos
      const horas = Math.floor(diferenciaMs / 3600000);
      const minutos = Math.floor((diferenciaMs % 3600000) / 60000);
      
      // Retornar la diferencia formateada
      const saber = `${horas} horas y ${minutos} minutos`
      return {horas, minutos, saber}
    }
    restarHoras(fecha, horas) {
      // Clonar la fecha para no modificar la original
      const fechaClonada = new Date(fecha);
    
      // Restar las horas
      fechaClonada.setHours(fechaClonada.getHours() - horas);
    
      // Retornar la fecha actualizada
      return fechaClonada;
    }
    validarDecimal(event) {
      const charCode = event.which ? event.which : event.keyCode;
      const inputValue = event.target.value;
    
      // Permitir números del 0 al 9, punto decimal y teclas de control
      if (
        (charCode >= 48 && charCode <= 57) ||  // Números del 0 al 9
        charCode === 46 ||                     // Punto decimal
        charCode === 8 ||                      // Tecla de retroceso (backspace)
        charCode === 9 ||                      // Tecla de tabulación (tab)
        charCode === 13 ||                     // Tecla Enter
        charCode === 37 ||                     // Flecha izquierda
        charCode === 39                        // Flecha derecha
      ) {
        // Verificar si ya hay un punto decimal en el valor
        const decimalIndex = inputValue.indexOf('.');
        if (charCode === 46 && decimalIndex !== -1) {
          event.preventDefault(); // Evitar agregar otro punto decimal
        }
    
        return true; // Permitir el ingreso del carácter
      }
    
      event.preventDefault(); // Bloquear cualquier otro carácter
      return false;
    }
    generarCadenaAleatoria(): string {
      const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%_&*()';
      let cadena = '';
      let tieneMayuscula = false;
      let tieneMinuscula = false;
      let tieneNumero = false;
      let tieneSimbolo = false;
    
      while (cadena.length < 10) {
        const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        cadena += caracterAleatorio;
    
        if (/[A-Z]/.test(caracterAleatorio)) {
          tieneMayuscula = true;
        } else if (/[a-z]/.test(caracterAleatorio)) {
          tieneMinuscula = true;
        } else if (/[0-9]/.test(caracterAleatorio)) {
          tieneNumero = true;
        } else {
          tieneSimbolo = true;
        }
      }
    
      if (!tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneSimbolo) {
        this.generarCadenaAleatoria(); // Vuelve a generar la cadena si no cumple los requisitos
      }
    
      return cadena;
    }
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
    
      const formattedValue = `${symbol}${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;
      return formattedValue;
    }
    obtenerValorMaximoMinimo(arreglo) {
      if (arreglo.length === 0) {
          return {
              maximo: 0,
              no_maximo: '',
              contadorMaximo: 0,
              arreglo_maximo: [],
              minimo: 0,
              no_minimo: '',
              contadorMinimo: 0,
              arreglo_minimo: []
            };
      }
      
      let maximo = arreglo[0].reporte.total;
      let minimo = arreglo[0].reporte.total;
      let no_maximo = (arreglo[0].no_os) ? arreglo[0].no_os : arreglo[0].no_cotizacion;;
      let no_minimo = (arreglo[0].no_os) ? arreglo[0].no_os : arreglo[0].no_cotizacion;;
      let contadorMaximo = 1;
      let contadorMinimo = 1;
      let arreglo_maximo = [no_maximo];
      let arreglo_minimo = [no_minimo];
        for (let i = 1; i < arreglo.length; i++) {
          const compara = arreglo[i].reporte.total;
          const no_os = (arreglo[i].no_os) ? arreglo[i].no_os : arreglo[i].no_cotizacion;
      
          if (compara > maximo) {
            no_maximo = no_os;
            maximo = compara;
            contadorMaximo = 1;
            arreglo_maximo = [no_maximo];
          } else if (compara === maximo) {
            if (!arreglo_maximo.includes(no_os)) {
                arreglo_maximo.push(no_os);
              }
              contadorMaximo++;
            }
        
            if (compara < minimo) {
              no_minimo = no_os;
              minimo = compara;
              contadorMinimo = 1;
              arreglo_minimo = [no_minimo];
            } else if (compara === minimo) {
              if (!arreglo_minimo.includes(no_os)) {
                arreglo_minimo.push(no_os);
              }
              contadorMinimo++;
            }
          }
        
          return {
            maximo,
            no_maximo,
            contadorMaximo,
            arreglo_maximo,
            minimo,
            no_minimo,
            contadorMinimo,
            arreglo_minimo
          };
    }
    obtenerValorMaximoMinimo2(arreglo) {
      if (arreglo.length === 0) {
        // Si el arreglo está vacío, retorna valores predeterminados
        return {
          maximo: 0,
          no_maximo: '',
          contadorMaximo: 0,
          arreglo_maximo: [],
          minimo: 0,
          no_minimo: '',
          contadorMinimo: 0,
          arreglo_minimo: []
        };
      }
    
      // Inicializa variables para el valor máximo y mínimo
      let maximo = arreglo[0].reporte.total;
      let minimo = arreglo[0].reporte.total;
      let no_maximo = (arreglo[0].no_os) ? arreglo[0].no_os : arreglo[0].no_cotizacion;
      let no_minimo = (arreglo[0].no_os) ? arreglo[0].no_os : arreglo[0].no_cotizacion;
      let contadorMaximo = 1;
      let contadorMinimo = 1;
      let arreglo_maximo = [no_maximo];
      let arreglo_minimo = [no_minimo];
    
      // Itera sobre el arreglo para encontrar el valor máximo y mínimo
      for (let i = 1; i < arreglo.length; i++) {
        const compara = arreglo[i].reporte.total;
        const no_os = (arreglo[i].no_os) ? arreglo[i].no_os : arreglo[i].no_cotizacion;
    
        if (compara > maximo) {
          no_maximo = no_os;
          maximo = compara;
          contadorMaximo = 1;
          arreglo_maximo = [no_maximo];
        } else if (compara === maximo) {
          if (!arreglo_maximo.includes(no_os)) {
            arreglo_maximo.push(no_os);
          }
          contadorMaximo++;
        }
    
        if (compara < minimo) {
          no_minimo = no_os;
          minimo = compara;
          contadorMinimo = 1;
          arreglo_minimo = [no_minimo];
        } else if (compara === minimo) {
          if (!arreglo_minimo.includes(no_os)) {
            arreglo_minimo.push(no_os);
          }
          contadorMinimo++;
        }
      }
    
      // Retorna un objeto con los resultados
      return {
        maximo,
        no_maximo,
        contadorMaximo,
        arreglo_maximo,
        minimo,
        no_minimo,
        contadorMinimo,
        arreglo_minimo
      };
    }
    
    recuperaDatos(form){
      const formValue = form.getRawValue();
      return formValue
    }
    getRawValue(form){
      const formValue = form.getRawValue();
      return formValue
    }
    reemplaza_strig(cadena:string){
      const arreglo = this._campos.campos_reeemplza
      let cadenanew = null
      if (cadena.length) {
        cadenanew = cadena
        arreglo.forEach(r=>{
          const regex = new RegExp(`\\b${r['campos']}\\b`, 'g');
          cadenanew = cadenanew.replace(regex,r.reemplaza).trim()
        })
      }
      return cadenanew
    }
    reemplaza_strig_navegacion(cadena:string){
      const arreglo = this._campos.campos_navegacion
      let cadenanew = null
      if (cadena.length) {
        cadenanew = cadena
        arreglo.forEach(r=>{
          const regex = new RegExp(`\\b${r['campos']}\\b`, 'g');
          cadenanew = cadenanew.replace(regex,r.reemplaza).trim()
        })
      }
      return cadenanew
    }
    obtener_ticketPromedioFinal(arreglo:any[]){
      let aqui = { servicios_totales: 0 ,ticketPromedio:0, ticketGeneral:0 };
      let  ticketGeneral = 0
      const reporteSum = {...this.camposReporte_show2};
      arreglo.forEach((coti) => {
        const { reporte } = coti;
        const { total } = reporte
        ticketGeneral += total
          this.camposReporte.forEach((c) => {
            reporteSum[c] += Number(reporte[c]);
          });
          // aqui  = {  servicios_totales: arreglo.length,ticketPromedio:0, reporte: { ...reporteSum }, ticketGeneral };
          aqui  = {  servicios_totales: arreglo.length,ticketPromedio:0, ticketGeneral };
          aqui.ticketPromedio = aqui.ticketGeneral / aqui.servicios_totales 
      });
      return {servicios_totales: aqui.servicios_totales, ticketPromedio: aqui.ticketPromedio, ticketGeneral: aqui.ticketGeneral}
    }
    ticket_promedio(arreglo:any[]){
      let aqui = { servicios_totales: 0 ,ticketPromedio:0, ticketGeneral:0 }, ticketGeneral = 0;
      let nuevo = [...arreglo]
      nuevo.forEach(cotizacion=>{
        const {reporte} = cotizacion
        const {total} = reporte
        aqui.ticketGeneral += total
      })
      aqui.servicios_totales = nuevo.length
      aqui.ticketPromedio = aqui.ticketGeneral / nuevo.length
      return aqui
    }
    obtener_subtotales(arreglo:any[]){
      let aqui = { iva: 0 ,subtotal:0, total:0 };
      arreglo.forEach((coti) => {
        const { reporte } = coti;
        const { total, iva, subtotal } = reporte

          aqui.iva += iva
          aqui.subtotal += subtotal
          aqui.total += total
      });
      
      return aqui
    }

    dias_transcurridos_en_sucursal(fecha){

      const inicial = new Date(fecha)
      const final = new Date()

      const diffTiempo = final.getTime() - inicial.getTime();
      const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
      return diffDias
    }
    sonArreglosDeObjetosIdenticos(arr1: any[], arr2: any[]): boolean {
      if (arr1.length !== arr2.length) {
        return false; // Los arreglos tienen longitudes diferentes, no pueden ser idénticos.
      }
    
      // Ordena ambos arreglos para asegurarse de que los objetos estén en el mismo orden.
      const ordenadosArr1 = arr1.slice().sort();
      const ordenadosArr2 = arr2.slice().sort();
    
      for (let i = 0; i < ordenadosArr1.length; i++) {
        const objeto1 = ordenadosArr1[i];
        const objeto2 = ordenadosArr2[i];
    
        const keys1 = Object.keys(objeto1);
        const keys2 = Object.keys(objeto2);
    
        if (keys1.length !== keys2.length) {
          return false; // Los objetos tienen un número diferente de propiedades, no pueden ser idénticos.
        }
    
        for (const key of keys1) {
          if (objeto1[key] !== objeto2[key]) {
            return false; // Se encontró una propiedad con un valor diferente, los objetos no son idénticos.
          }
        }
      }
    
      return true; // Si llegamos hasta aquí, los arreglos son idénticos.
    }
    sonObjetosIguales(objeto1, objeto2) {
      const keys1 = Object.keys(objeto1);
      const keys2 = Object.keys(objeto2);
    
      if (keys1.length !== keys2.length) {
        return false;
      }
    
      for (const key of keys1) {
        if (objeto1[key] !== objeto2[key]) {
          return false;
        }
      }
    
      return true;
    }

    filtra_informacion(arreglo:any[], campo:string, filtro:string){
      let nueva = [...arreglo]
      return nueva.filter(x=>x[campo] === filtro)
    }

    genera_reporte(data){

      const {margen, iva, elementos, descuento, formaPago } = data
      
      const enCaso_meses = this.formasPAgo.find(f=>f.id === String(formaPago))

      const paquetes = this.filtro_elementos(elementos, true)
      const elementos_ = this.filtro_elementos(elementos, false)

      const otro = this.nuevo_reporte(elementos_)

      const aplicado = paquetes.map(paquete=>{
        const {elementos} = paquete
        const filtro_aprobado_internos = elementos.filter(e=>e.aprobado)
        return this.nuevo_reporte(filtro_aprobado_internos) 
      })

      const sumatoria_paquetes = this.sumatorio_reportes(aplicado)

      const reporte_sum = this.sumatorio_reportes([sumatoria_paquetes, otro])

      const reporte:any = this.sumatoria_reporte(reporte_sum, margen, iva)

        if (enCaso_meses.id === '1') {
          reporte.descuento = Number(descuento)
          if(!reporte.descuento) reporte.descuento = 0
          reporte.total -= reporte.descuento
        }else{
          reporte.descuento = 0
          const operacion = reporte.total * (1 + (enCaso_meses['interes'] / 100))
          reporte.meses = operacion;
        }

        reporte.ub = (reporte.total - reporte.refaccionVenta) * (100 / reporte.total)

        // if (reporte.total >0 ) {
        //     reporte.ub = (reporte.subtotal - cstoCOmpra) *100/reporte.subtotal
        // } 
      
      return reporte

    }
    filtro_elementos(arreglo:any[], paquetes:boolean){
      if (paquetes) {
        return arreglo.filter(g=>g.tipo === 'paquete')
      }else{
        return arreglo.filter(g=>g.tipo !== 'paquete')
      }
    }

    
    sumatorio_reportes(arreglo_sumatorias){
      const reporte = {mo:0,refaccion:0}
      arreglo_sumatorias.forEach(a=>{
          const {mo,refaccion, } = a
          reporte.mo += mo
          reporte.refaccion += refaccion
      })
      return reporte
    }
    nuevo_reporte(elementos){
      const reporte = {mo:0,refaccion:0}
      const nuevos = [...elementos].forEach(elemento =>{
        const { costo, precio, status, tipo} = elemento
          if (costo > 0 ) {
            reporte[tipo] += costo
          }else{
            reporte[tipo] += precio
          }
      })
      return reporte
    }
    purifica_informacion(data){
      const nueva_ = JSON.parse(JSON.stringify(data));
      const {elementos} = nueva_
      const _elementos_purifica = (elementos) ? elementos : []
      const registra = _elementos_purifica.map(element => {
        const {tipo } = element
        const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
        const campos_refaccion = [ ...campos_mo, 'marca']
        const campos_paquete = [ 'aprobado', 'cantidad', 'cilindros', 'costo', 'elementos', 'enCatalogo', 'id', 'marca', 'modelo', 'nombre', 'status', 'tipo' ]
        let nueva 
        switch (tipo) {
          case 'paquete':
            nueva = this.nuevaRecuperacionData(element,campos_paquete)
            const info_su = this.purifica_informacion_interna(nueva.elementos)
            // console.log(info_su);
            nueva.elementos = info_su
            
            break;
          case 'mo':
            nueva = this.nuevaRecuperacionData(element,campos_mo)
            break;
          case 'refaccion':
            nueva = this.nuevaRecuperacionData(element,campos_refaccion)
            break;
        }
  
        //primera recuperacion 
        // console.log(nueva);
        return nueva
      });
      // console.log(registra);
      return registra
    }
    purifica_informacion_interna(elementos:any[]){
      const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
      const campos_refaccion = [ ...campos_mo, 'marca']
  
      const nuevos_elementos = elementos.map(e=>{
        const {tipo} = e
        e.nombre = String(e.nombre).toLowerCase()
        switch (tipo) {
          case 'mo':
          case 'MO':
            e.id = e.IDreferencia
            e.tipo = String(tipo).toLowerCase()
            
            return this.nuevaRecuperacionData(e,campos_mo)
          case 'refaccion':
            return this.nuevaRecuperacionData(e,campos_refaccion)
        }
      })
  
      return nuevos_elementos 
  
    }
    ordenamiento_fechas_x_campo(arreglo:any, campo, orden){
      let nuevos = [...arreglo]
      return nuevos.sort((a, b) => {
        if (a[campo] < b[campo]) {
          return orden ? -1 : 1;
        }
        if (a[campo] > b[campo]) {
          return orden ? 1 : -1;
        }
        return 0;
    });
    }
    ordenamiento_fechas(arreglo:any, campo, orden){
      let nuevos = [...arreglo]
      return nuevos.sort((a, b) => {
          if (new Date(a[campo]) < new Date(b[campo])) {
            return orden ? -1 : 1;
          }
          if (new Date(a[campo]) > new Date(b[campo])) {
            return orden ? 1 : -1;
          }
          return 0;
      });
    }
    filtro_fechas(arreglo:any, campo, start, end){
      let nuevos = [...arreglo]
      return nuevos.filter(r=>new Date(r[campo]) >= new Date(start) && new Date(r[campo]) <= new Date(end))
    }
   
    

    
    cerrar_modal(cual){
      const closeButton = document.querySelector(`[id="${cual}"]`);
      if (closeButton) {
        closeButton.dispatchEvent(new Event('click'));
      }
    }

    //TODO revision de cache
    
    crear_new_object(objecto){
      return JSON.parse(JSON.stringify(objecto));
    }
    revisar_cache_real_time(ruta): Promise<any> {
      return new Promise((resolve, reject) => {
        // const {ruta} = data
        const starCountRef = ref(db, `${ruta}`);
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val())
          } else {
            resolve({});
          }
        }, {
          onlyOnce: true
        })
      });
    }
    async revisar_cache(nombre:string){
      // const claves_extradidas = localStorage.getItem(`${nombre}`)
      // let nueva 
      // console.log(localStorage.getItem(`${nombre}`));
      
      if (localStorage.getItem(`${nombre}`)) {
        // console.log('existe en localHost '+ nombre);
        // const snap = await this._automaticos.consulta_ruta(nombre)
        // await this._security.guarda_informacion({nombre, data: snap})

        // const claves_extradidas = localStorage.getItem(`${nombre}`)

        // const desc = 
        // console.log(desc);
        
        // nueva = this.crear_new_object(desc)// JSON.parse(JSON.stringify(desc));
        // return (nueva) ? nueva: []
        return await this._security.servicioDecrypt_object(localStorage.getItem(`${nombre}`))
      }else{
        // const info_ruta = await this.consulta_ruta(nombre)
        // // console.log(`se creo cache ${nombre} de la APP`);
        // this._security.guarda_informacion({nombre, data: info_ruta})
        // let obtenida_cero = localStorage.getItem(`${nombre}`)
        // const desc = this._security.servicioDecrypt_object(obtenida_cero)
        // nueva = JSON.parse(JSON.stringify(desc));
        // return nueva
        return []
      }
    }
    revisar_cache2(nombre:string){
      const objeto_desencriptado = localStorage.getItem(`${nombre}`)
      if (objeto_desencriptado) {
        const desc = this._security.servicioDecrypt_object(objeto_desencriptado)
        return this.crear_new_object(desc)
      }else{
        return {}
      }
    }
    nueva_revision_cache(nombre:string){
      // const objeto_desencriptado = 
      // if (localStorage.getItem(`${nombre}`)) {
      //   const desc = this._security.servicioDecrypt_object(objeto_desencriptado)
      //   return this.crear_new_object(desc)
      // }else{
      //   return {}
      // }

      return (localStorage.getItem(`${nombre}`)) ? this._security.servicioDecrypt_object(localStorage.getItem(`${nombre}`)) : {}
    }
    consulta_ruta(ruta): Promise<any> {
      return new Promise((resolve, reject) => {
        // const {ruta} = data
        const starCountRef = ref(db, `${ruta}`);
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val())
          } else {
            resolve({});
          }
        }, {
          onlyOnce: true
        })
      });
    }

    data_relacionada_id_cliente(id_cliente:string ){
      const clientes = this.nueva_revision_cache('clientes')
      // const data_cliente = clientes[id_cliente]
      const asiganacion_data_cliente = this.crear_new_object(clientes[id_cliente])
      if (Object.keys(asiganacion_data_cliente).length) asiganacion_data_cliente.id = id_cliente
      
      const data_cliente = asiganacion_data_cliente
      const vehiculos = this.nueva_revision_cache('vehiculos')
      const vehiculos_arr =  this.crearArreglo2( this.filtrarObjetoPorPropiedad(vehiculos,'cliente', id_cliente))

      const cotizaciones = this.nueva_revision_cache('cotizaciones')
      const cotizaciones_antes =  this.crearArreglo2( this.filtrarObjetoPorPropiedad(cotizaciones,'cliente', id_cliente))
      const cotizaciones_arr = this.nueva_asignacion_cotizaciones(cotizaciones_antes)

      const recepciones = this.nueva_revision_cache('recepciones')
      const recepciones_antes =  this.crearArreglo2( this.filtrarObjetoPorPropiedad(recepciones,'cliente', id_cliente))
      const recepciones_arr = this.nueva_asignacion_recepciones(recepciones_antes)
      
      return {cotizaciones_arr, recepciones_arr, vehiculos_arr, data_cliente}
    }
    data_relacionada_id_vehiculo(id_vehiculo:string ){
      

      const vehiculos = this.nueva_revision_cache('vehiculos')
      const clientes = this.nueva_revision_cache('clientes')

      const asiganacion_data_vehiculo = this.crear_new_object(vehiculos[id_vehiculo])
      let data_vehiculo, data_cliente

      if (Object.keys(asiganacion_data_vehiculo).length) {
        asiganacion_data_vehiculo.id = id_vehiculo
        data_vehiculo = asiganacion_data_vehiculo

        const {cliente} = asiganacion_data_vehiculo

        
        const asiganacion_data_cliente = this.crear_new_object(clientes[cliente])
        if (Object.keys(asiganacion_data_cliente).length) asiganacion_data_cliente.id = cliente
        data_cliente = asiganacion_data_cliente

      }


      // let cotizaciones_arr = [],
      // let recepciones_arr = []

      const cotizaciones = this.nueva_revision_cache('cotizaciones')
      const cotizaciones_antes =  this.crearArreglo2( this.filtrarObjetoPorPropiedad(cotizaciones,'vehiculo', id_vehiculo))
      const cotizaciones_arr = this.nueva_asignacion_cotizaciones(cotizaciones_antes)

      const recepciones = this.nueva_revision_cache('recepciones')
      const recepciones_antes =  this.crearArreglo2( this.filtrarObjetoPorPropiedad(recepciones,'vehiculo', id_vehiculo))
      const recepciones_arr = this.nueva_asignacion_recepciones(recepciones_antes)
      
      return {data_vehiculo, data_cliente, cotizaciones_arr, recepciones_arr}
    }
    async buscar_data_realcionada_con_cliente(cliente:string, data_cliente){
      let cotizaciones_arr = [], recepciones_arr = [], vehiculos_arr = []
      const recepciones_object = await this.revisar_cache('recepciones')
      const cotizaciones_object = await this.revisar_cache('cotizaciones')
      const vehiculos = await this.revisar_cache('vehiculos')

      const historial_gastos_orden = this.crearArreglo2(await this.revisar_cache('historial_gastos_orden'))
      const historial_pagos_orden = this.crearArreglo2(await this.revisar_cache('historial_pagos_orden'))
      
      const filtro_cotizaciones = this.filtra_campo(this.crearArreglo2(cotizaciones_object),'cliente', cliente)
      const filtro_recepciones = this.filtra_campo(this.crearArreglo2(recepciones_object),'cliente', cliente)

      cotizaciones_arr = this.nueva_asignacion_cotizaciones( filtro_cotizaciones )
      recepciones_arr = this.asigna_datos_recepcion({
          bruto: filtro_recepciones , clientes: data_cliente, vehiculos,
          historial_gastos_orden, historial_pagos_orden
        })
      vehiculos_arr = this.filtra_campo(this.crearArreglo2(vehiculos),'cliente',cliente)

      return {cotizaciones_arr, recepciones_arr, vehiculos_arr}
    }
    asigna_datos_recepcion(data){
      const {bruto, clientes, vehiculos, historial_gastos_orden, historial_pagos_orden} = data

      const nuevos_ordenamiento =this.ordenamiento_fechas(bruto,'fecha_recibido',false)
      return nuevos_ordenamiento.map(recepcion=>{
        const {id, cliente, vehiculo,elementos, margen, iva, descuento, formaPago, sucursal} = recepcion;
        recepcion.historial_gastos_orden = this.filtra_orden(historial_gastos_orden, id)
        recepcion.historial_pagos_orden = this.filtra_orden(historial_pagos_orden, id)
        recepcion.data_cliente = {...clientes[cliente], id: cliente}
        recepcion.data_vehiculo = {...vehiculos[vehiculo], id: vehiculo}
        recepcion.reporte = this.genera_reporte({elementos, margen, iva, descuento, formaPago})
        recepcion.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
        const solo_gastos_orden = this.obtener_historial_orden([recepcion],'historial_gastos_orden')
        const total_gastos = this.sumatorias_aprobados(solo_gastos_orden)
        // recepcion.reporte_real = sumatoria_reporte(total_gastos_ordenes, margen, iva)

        const nuevo = JSON.parse(JSON.stringify(recepcion.reporte));
        nuevo['refaccion'] = total_gastos
        // console.log(`recepcion: ${id}`);
        // console.log(`reporte:` ,recepcion.reporte);
        
        const reporte_real = this.sumatoria_reporte(nuevo, margen, iva)
        recepcion.reporte_real = reporte_real
        // console.log(`reporte_real: `, reporte_real);
    
        return recepcion
      })
    }
    nueva_asignacion_recepciones(data:any[]){

      const clientes = this.nueva_revision_cache('clientes')
      const vehiculos = this.nueva_revision_cache('vehiculos')
     
      const clientes_tranformacion_data = this.transformaDataCliente(clientes)
      const historial_gastos_orden = this.nueva_revision_cache('historial_gastos_orden')
      // console.log(historial_gastos_orden);
      const historial_pagos_orden = this.nueva_revision_cache('historial_pagos_orden')
      // console.log(historial_pagos_orden);

      return this.ordenamiento_fechas(data,'fecha_recibido',true)
      .map(recepcion=>{

        const { cliente, vehiculo,elementos, margen, iva, descuento, formaPago, id, sucursal} = recepcion;
        
        recepcion.data_cliente = clientes_tranformacion_data[cliente] || {}
        recepcion.data_vehiculo = vehiculos[vehiculo] || {} ;
        recepcion.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal) || {};

        if (recepcion.data_cliente  && recepcion.data_cliente.nombre) {
          const { nombre, apellidos } = recepcion.data_cliente
          recepcion.fullname = `${nombre} ${apellidos}`.toLowerCase()
        }
        if (recepcion.data_vehiculo && recepcion.data_vehiculo.placas) {
          const { placas } = recepcion.data_vehiculo
          recepcion.placas = `${placas}`.toUpperCase()
        }
        
        const objetoFiltrado_historial_gastos_orden = this.filtrarObjetoPorPropiedad(historial_gastos_orden, 'id_os', id);
        // console.log(objetoFiltrado_historial_gastos_orden);
        recepcion.historial_gastos_orden = this.crearArreglo2(objetoFiltrado_historial_gastos_orden)
       
        const objetoFiltrado_historial_pagos_orden = this.filtrarObjetoPorPropiedad(historial_pagos_orden, 'id_os', id);
        // console.log(objetoFiltrado_historial_pagos_orden);
        recepcion.historial_pagos_orden = this.crearArreglo2(objetoFiltrado_historial_pagos_orden)

        recepcion.reporte = this.genera_reporte({elementos, margen, iva, descuento, formaPago})

        const total_gastos = this.sumatorias_aprobados(recepcion.historial_gastos_orden)

        const nuevo = JSON.parse(JSON.stringify(recepcion.reporte));

        nuevo.refaccion = total_gastos

        recepcion.reporte_real = this.sumatoria_reporte(nuevo, margen, iva)

        return recepcion
      })
    }
    nueva_asignacion_cotizaciones(data:any[]){

      const clientes = this.nueva_revision_cache('clientes')
      const vehiculos = this.nueva_revision_cache('vehiculos')
      const clientes_tranformacion_data = this.transformaDataCliente(clientes)

      return this.ordenamiento_fechas(data,'fecha_recibido',true)
      .map(cotizacion=>{

        const { cliente, vehiculo,elementos, margen, iva, descuento, formaPago, id, sucursal} = cotizacion;
        
        const data_cliente = clientes_tranformacion_data[cliente]
        const data_vehiculo = vehiculos[vehiculo]

        cotizacion.data_cliente = data_cliente || {};
        cotizacion.data_vehiculo = data_vehiculo || {};
        cotizacion.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal) || {};
        
        if (data_cliente) {
          const { nombre, apellidos } = data_cliente
          cotizacion.fullname = `${nombre} ${apellidos}`.toLowerCase()
        }
        if (data_vehiculo) {
          const { placas } = data_vehiculo
          cotizacion.placas = `${placas}`.toUpperCase()
        }

        cotizacion.reporte = this.genera_reporte({elementos, margen, iva, descuento, formaPago})
        return cotizacion
      })
    }
   
    asigna_data_diarios(data){
      const {bruto, recepciones} = data
      let nuevas = [...bruto]
      
      const nuevas_ = nuevas.map(diario=>{
        const {tipo, id_os, sucursal, metodo} = diario
        if (tipo === 'orden') diario.no_os = recepciones[id_os].no_os
        diario.metodoShow = this.metodospago.find(m=>m.valor === String(metodo)).show
        diario.sucursalShow = this.sucursales_array.find(s=>s.id === sucursal).sucursal
        return diario
      })

      return nuevas_
    }
    filtra_orden(arreglo, id_orden){
      return [...arreglo].filter(f=>f.id_os === id_orden)
    }
    filtra_campo(arreglo, campo:string, valor:string){
      return [...arreglo].filter(item => item[campo] === valor)
    }
    obtener_historial_orden(arreglo:any[], campo:string){
      let nuevos =[ ...arreglo]
      const arreglado = nuevos.map(recepcion=>{
        const historial_campo = recepcion[campo]
        return historial_campo
      })
      return arreglado.flat()
    }
    sumatorias_aprobados(arreglo:any[]):number{
      let nuevos = [...arreglo]

      let sumatoria_montos_historial = 0
      nuevos.forEach(gs=>{
        const {status, monto} = gs
        if (status) {
          sumatoria_montos_historial+= monto
        }
      })
      return sumatoria_montos_historial
    }
    sumatoria_reporte(data, margen, iva){
      const {mo,refaccion} = data
      const reporte = {mo:0,refaccion:0, refaccionVenta:0, subtotal:0, total:0, iva:0,ub:0}
      reporte.mo = mo 
      reporte.refaccion = refaccion
      reporte.refaccionVenta = refaccion * (1 +(margen/ 100))
      reporte.subtotal = reporte.mo + reporte.refaccionVenta
      reporte.iva = (iva) ? reporte.subtotal * .16 : 0
      reporte.total = reporte.subtotal + reporte.iva
      if (reporte.subtotal) {
        reporte.ub = (reporte.total - reporte.refaccionVenta) * (100 / reporte.total)
      }
      return reporte
    }
    transformaDataVehiculo(data){
      const { clientes, vehiculos} = data
      const nuevos_ordenamiento =this.ordenamiento_fechas_x_campo(vehiculos,'placas',true)
      return nuevos_ordenamiento.map(vehiculo=>{
        const { cliente } = vehiculo
        vehiculo.data_cliente = clientes[cliente]
        return vehiculo
      })
    }
    
    suma_refacciones_os_cerradas(arreglo:any[]):number{
      let refacciones = 0
      arreglo.forEach(recep=>{
        const {reporte} = recep
        const {refaccionVenta} = reporte
        refacciones += refaccionVenta
      })
      return refacciones
    }
    suma_gastos_ordenes_subtotales(data:any[]):number{
      let  total_ventas= 0
        data.forEach(f=>{
          const {total_gastos, reporte} = f
          const {subtotal } = reporte
          total_ventas += subtotal
        })
      return  total_ventas
    }
    suma_gastos_ordenes_subtotales_reales(data:any[]):number{
      let  total_ventas= 0
        data.forEach(f=>{
          const {total_gastos, reporte_real} = f
          const {subtotal,refaccion } = reporte_real
          total_ventas += subtotal
        })
      return  total_ventas
    }
    suma_refacciones_os_cerradas_reales(arreglo:any[]):number{
      let refacciones = 0
      arreglo.forEach(recep=>{
        const {reporte_real} = recep
        const {refaccionVenta, refaccion} = reporte_real
        refacciones += refaccion
      })
      return refacciones
    }
    sumatoria_meses(arreglo:any[]){
      let total = 0
      arreglo.forEach(a=>{
        total += a
      })
      return total 
    }
    sucursales_objetivos(data){
      const {sucursales, metas_sucursales, fecha_start, fecha_end} = data
      let objetivo =0
      sucursales.forEach(sucursal=>{
        const resultados_metas_start = metas_sucursales[sucursal]
        let objetivos = []
        if (resultados_metas_start) {
          const  aniosMeses = this.obtenerAniosMesesPorAnio_1(fecha_start, fecha_end)
          aniosMeses.forEach(arr=>{
            const {anio, meses} = arr
            const anio_metas = resultados_metas_start[anio]
            let nuevos_meses = [...meses]
            nuevos_meses.forEach(mes=>{
              if (anio_metas[mes -1 ]) {
                objetivos.push(anio_metas[mes -1 ])
              }
            })
          })
          const total_objetivos = this.sumatoria_meses(objetivos)
          objetivo += total_objetivos
        }
      })
      return objetivo
    }
    obtenerAniosMesesPorAnio_1(fechaInicio, fechaFin) {
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);
    
      const anioInicio = fechaInicioObj.getFullYear();
      const mesInicio = fechaInicioObj.getMonth();
      const anioFin = fechaFinObj.getFullYear();
      const mesFin = fechaFinObj.getMonth();
    
      const aniosMeses = [];
    
      for (let anio = anioInicio; anio <= anioFin; anio++) {
        const mesesPorAnio = [];
        const mesInicial = (anio === anioInicio) ? mesInicio : 0;
        const mesFinal = (anio === anioFin) ? mesFin : 11;
    
        for (let mes = mesInicial; mes <= mesFinal; mes++) {
          mesesPorAnio.push(mes + 1);
        }
    
        aniosMeses.push({ anio, meses: mesesPorAnio });
      }
    
      return aniosMeses;
    }

    quitarAcentos(texto) {
      // const nuevo_ = this.eliminarEspacios(texto)
      // const nuevo_1 = this.dejarUnEspacio(nuevo_)

      return texto
        .normalize("NFD") // Normalizamos el texto en Unicode
        .replace(/[\u0300-\u036f]/g, "") // Eliminamos los caracteres diacríticos
        .replace(/[^\w\s]/gi, "") // Eliminamos caracteres especiales excepto letras y espacios
        .replace(/\s+/g, " ") // Reemplazamos múltiples espacios en blanco por uno solo
        .replace(/\s+/g, '') // Reemplazamos múltiples espacios en blanco por uno solo
        .trim(); // Quitamos espacios en blanco al principio y al final
    }

    reporte_paquetes(paquete){
      const {elementos, costo} = paquete
      const nuevo_costo = (costo > 0 )? costo : 0
      const reporte = this.sumatoria_reporte_paquete(elementos, 25)
      paquete.reporte = reporte
      paquete.costo = nuevo_costo
      paquete.precio = reporte.total
      return paquete
    }
    sumatoria_reporte_paquete(elementos:any[], margen){
      const reporte = {mo:0,refaccion:0, refaccionVenta:0, subtotal:0, total:0,ub:0}
        elementos.forEach(elemento=>{
          const {tipo, costo, precio} = elemento
          const nuevo_costo_elemento = (costo > 0) ? costo : precio 
          const new_tipo = `${tipo}`.toLowerCase().trim()
          reporte[new_tipo] = nuevo_costo_elemento
        })
        reporte.refaccionVenta = reporte.refaccion *  (1 +(margen/ 100))
        reporte.subtotal = reporte.mo + reporte.refaccionVenta
        reporte.total = reporte.subtotal
        if (reporte.subtotal > 0) {
          reporte.ub = (reporte.total - reporte.refaccionVenta) * (100 / reporte.total)
        }
        return reporte
    }
    extraerParteDeURL() {
      const urlCompleta = window.location.href;
      // Utilizamos el objeto URL para analizar la URL
      const parsedURL = new URL(urlCompleta);
      
      // Extraemos la ruta (path) de la URL
      const path = parsedURL.pathname;
      
      // Dividimos la ruta en partes separadas por '/'
      const partesDeRuta = path.split('/').filter(part => part); // Eliminamos segmentos vacíos
      
      // Devolvemos la última parte de la ruta (que suele ser la más relevante)
      return `${partesDeRuta.pop()}`.toString();
    }

    saber_pesos(data){
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(jsonString);
      const tamanioEnBytes = encodedData.length;
      const tamanioEnKilobytes = tamanioEnBytes / 1024;
      const tamanioEnMegabytes = tamanioEnKilobytes / 1024;
      console.log({tamanioEnBytes, tamanioEnKilobytes, tamanioEnMegabytes});
      
      return {tamanioEnBytes, tamanioEnKilobytes, tamanioEnMegabytes}
    }
    eliminarElementosRepetidos(arregloOriginal, elementosAEliminar) {
      // Filtrar los elementos del segundo arreglo que no están en el primer arreglo
      const resultado = elementosAEliminar.filter((elemento) => !arregloOriginal.includes(elemento));
      return resultado;
    }
  
    sonObjetosIgualesConJSON(objeto1, objeto2) {
      // Convierte los objetos a cadenas JSON
      const jsonString1 = JSON.stringify(objeto1);
      const jsonString2 = JSON.stringify(objeto2);
    
      // Analiza las cadenas JSON nuevamente para obtener objetos
      const parsedObjeto1 = JSON.parse(jsonString1);
      const parsedObjeto2 = JSON.parse(jsonString2);
    
      // Compara los objetos analizados
      return JSON.stringify(parsedObjeto1) === JSON.stringify(parsedObjeto2);
    }
    transformaDataCliente(objeto_recuperado){
      const nueva_data = {};
      const sucursales = this.nueva_revision_cache('sucursales');
      for (const cliente in objeto_recuperado) {
        if (Object.hasOwnProperty.call(objeto_recuperado, cliente)) {
          const nueva_data_cliente = this.crear_new_object(objeto_recuperado[cliente]);
          const { sucursal, nombre, apellidos } = nueva_data_cliente;
    
          nueva_data_cliente.id = cliente;
          nueva_data_cliente.sucursalShow = `${sucursales[sucursal].sucursal}`
          nueva_data_cliente.fullname = `${nombre.toLowerCase()} ${apellidos.toLowerCase()}`;
    
          nueva_data[cliente] = nueva_data_cliente;
        }
      }
    
      return nueva_data;
  
    }
    filtrarObjetoPorPropiedad(objeto, propiedad, valor) {
      const resultado = {};
        for (const clave in objeto) {
          if (valor === 'Todas') {
            resultado[clave] = objeto[clave];
          }else{
            if (objeto.hasOwnProperty(clave) && objeto[clave][propiedad] === valor) {
              resultado[clave] = objeto[clave];
            }
          }
        }
      return resultado;
    }
    filtrarObjetoPorPropiedad_fecha(objeto, start, end) {
      const resultado = {};
        const fecha_start = new Date(start)
        const fecha_end = new Date(end)
        for (const clave in objeto) {
          if (objeto.hasOwnProperty(clave) && objeto[clave].fecha_recibido ){
            const fecha_compara = new Date( objeto[clave].fecha_recibido)
              if (fecha_compara >= fecha_start && fecha_compara <= fecha_end) {
                resultado[clave] = objeto[clave];
              }
          }
        }
      return resultado;
    }
    arregla_data_completa(object){
      const sucursales = this.nueva_revision_cache('sucursales')
      const recepciones = this.nueva_revision_cache('recepciones')
      let nueva_data = this.crear_new_object(object)
      Object.keys(object).forEach(clave=>{
        const {sucursal, tipo, id_os, metodo } = nueva_data[clave]
        nueva_data[clave].sucursalShow = sucursales[sucursal].sucursal
        nueva_data[clave].no_os =  (tipo === 'orden') ? recepciones[id_os].no_os : ''
        nueva_data[clave].metodoShow = this.metodospago.find(met=>met.valor === String(metodo)).show
      })
      return nueva_data
    }
      
 }
