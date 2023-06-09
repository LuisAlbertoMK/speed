import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Form } from '@angular/forms';
import {
    child,
    get,
    set,
    getDatabase,
    ref,
    onValue,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    push
} from "firebase/database";
import Swal from 'sweetalert2';
import { CotizacionesService } from './cotizaciones.service';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({providedIn: 'root'})
export class ServiciosPublicosService {
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
            interes: 24.,
            numero: 24
        }
    ]
    constructor(private http : HttpClient) {}
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
    soloNumeros(evt){
        var code = (evt.which) ? evt.which : evt.keyCode;
    
        if(code==8) { // backspace.
          return true;
        } else if(code>=48 && code<=57) { // is a number.
          return true;
        } else{ // other keys.
          return false;
        }
    }
    convierteFecha(fecha : string) {
     if (!fecha) return '';
  
      const [dia, mes, anio] = fecha.split('/');
      
      const diaFormateado = dia.padStart(2, '0');
      const mesFormateado = mes.padStart(2, '0');
      
      return `${diaFormateado}/${mesFormateado}/${anio}`;
    }
    restaFechasTaller = function (f1) {
            const dateHoy: Date = new Date()
            const fecha1 = `${dateHoy.getDate()}/${dateHoy.getMonth() + 1}/${dateHoy.getFullYear()}`
            var aFecha1 = f1.split('/');
            // var aFecha2 = f2.split('/');
            var fFecha1 = new Date(aFecha1[2], aFecha1[1], aFecha1[0]).getTime();
            var fFecha2 = new Date(
                dateHoy.getFullYear(),
                dateHoy.getMonth() + 1,
                dateHoy.getDate()
            ).getTime();
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
        return {fecha,hora,fechaPDF,vencimiento,Mes,fechaM,diaReturn,numeroManiana,fechaNumeros,ayer,fechaNumerosAyer,fehaHoy,fechaManianaNumeros,fechaManiana}
    }
    fechaDiasPlus(fecha : Date, diasSum? : number, tipo? : string) {
                let diasPlus = new Date(fecha)
                if (tipo) {
                    if (tipo = 'resta') {
                        diasPlus.setDate(fecha.getDate() - diasSum)
                        diasPlus.setHours(0, 0, 0, 0)
                    } else {
                        diasPlus.setDate(fecha.getDate() + diasSum)
                        diasPlus.setHours(0, 0, 0, 0)
                    }
                } else {
                    diasPlus.setDate(fecha.getDate() + diasSum)
                    diasPlus.setHours(0, 0, 0, 0)
                }
                return diasPlus
    }
    convierte_fechaString_personalizada(fecha: Date) {
        const f1 = new Date(fecha);
        const hora = new Date(fecha);
        const string_fecha = `${f1.getDate()}/${f1.getMonth() + 1}/${f1.getFullYear()}`;
        const stringHora = `${hora.getHours()}:${hora.getMinutes()}:${hora.getSeconds()}`;
        const stringNumeros = `${f1.getDate()}${f1.getMonth()+ 1}${f1.getFullYear()}`;
        return {string_fecha, stringHora, fechaString: new Date(fecha), stringNumeros, hora};
      }
    obtenerFechaCompleta(fecha: string): string {
        const [day, month, year] = fecha.split('/');
        const date = new Date(+year, +month - 1, +day);
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const dayOfWeek = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const formattedDate = `${dayOfWeek} ${date.getDate()} ${monthName} ${date.getFullYear()}`;
        return formattedDate;
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
    fechaNueva(fecha) {
        const date: Date = new Date(fecha);
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const numeroDia = new Date(date).getDay();
        return `${days[numeroDia]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
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
                    let symbol = '';
                    (!simbolo)
                        ? symbol = '$ '
                        : symbol = simbolo
                    if (value) {
                        const val = value //12345.48
                            const negativo = String(val).includes('-')
                                const deciameles = String(val).includes('.')
                                    let simbolo = '-',
                                        SOloNumeros = ``,
                                        deciamales = ``
                                    let nuevoValor = ``,
                                        contador = 0
                                    let nu_c = []

                                    if (negativo) {
                                        const soloNum = String(val).split('-')
                                        const soloNum2 = soloNum[1].split('.')
                                        SOloNumeros = soloNum2[0]
                                        contador = String(soloNum2[0]).length
                                        nu_c = SOloNumeros.split('')
                                    } else {
                                        simbolo = ''
                                        const solonum = String(val).split('.')
                                        SOloNumeros = solonum[0]
                                        contador = solonum[0].length
                                        nu_c = SOloNumeros.split('')
                                    }
                                    if (contador === 4) {
                                        nu_c[0] = nu_c[0] + ','
                                    }
                                    if (contador === 5) {
                                        nu_c[1] = nu_c[1] + ','
                                    }
                                    if (contador === 6) {
                                        nu_c[2] = nu_c[2] + ','
                                    }
                                    if (contador === 7) {
                                        nu_c[0] = nu_c[0] + ',';
                                        nu_c[3] = nu_c[3] + ','
                                    }
                                    if (contador === 8) {
                                        nu_c[1] = nu_c[1] + ',';
                                        nu_c[4] = nu_c[4] + ','
                                    }
                                    if (contador === 9) {
                                        nu_c[2] = nu_c[2] + ',';
                                        nu_c[5] = nu_c[5] + ','
                                    }
                                    if (contador === 10) {
                                        nu_c[0] = nu_c[0] + ',';
                                        nu_c[3] = nu_c[3] + ',';
                                        nu_c[6] = nu_c[6] + ','
                                    }
                                    if (contador === 11) {
                                        nu_c[1] = nu_c[1] + ',';
                                        nu_c[4] = nu_c[4] + ',';
                                        nu_c[7] = nu_c[7] + ','
                                    }
                                    if (contador === 12) {
                                        nu_c[2] = nu_c[2] + ',';
                                        nu_c[5] = nu_c[5] + ',';
                                        nu_c[8] = nu_c[8] + ','
                                    }
                                    if (contador === 13) {
                                        nu_c[0] = nu_c[0] + ',';
                                        nu_c[3] = nu_c[3] + ',';
                                        nu_c[6] = nu_c[6] + ',';
                                        nu_c[9] = nu_c[9] + ','
                                    }
                                    nuevoValor = `${symbol}${simbolo} ${nu_c.join('')}`
                                    if (deciameles) {
                                        const deciamal = String(val).split('.')
                                        let split_Decimales: string = deciamal[1].slice(0, 2)
                                        if (split_Decimales.length < 2) {
                                            split_Decimales = split_Decimales + '0'
                                        }
                                        nuevoValor = `${nuevoValor}.${split_Decimales}`
                                    } else {
                                        nuevoValor = `${nuevoValor}.00`
                                    }
                                    return nuevoValor
                                } else {
                                    return `${symbol} 0.00`
                                }

    }
    redondeado2(value : number, symbol : boolean) {
                                let simbolo = ''
                                if (symbol) {
                                    simbolo = '$ '
                                } else {
                                    simbolo = ''
                                }

                                if (value >= 0) {
                                    let cadena = String(value).split('.')
                                    if (cadena.length > 1) {
                                        cadena[1] = String(cadena[1].slice(0, 4))
                                        if (cadena[1].length === 1) {
                                            cadena[1] = `${cadena[1]}0`
                                        }
                                        let contador: number = String(cadena[0]).length
                                        let str = String(`${cadena[0]}.${cadena[1]}`)
                                        let arr = str.split('')
                                        let muestra: any
                                        if (contador === 4) {
                                            arr[0] = arr[0] + ','
                                        }
                                        if (contador === 5) {
                                            arr[1] = arr[1] + ','
                                        }
                                        if (contador === 6) {
                                            arr[1] = arr[1] + ','
                                        }
                                        if (contador === 7) {
                                            arr[0] = arr[0] + ','
                                        }
                                        return muestra = `${simbolo}${arr.join('')}`
                                    } else {
                                        return `${simbolo}${cadena[0]}.00`
                                    }
                                } else {
                                    return `${simbolo}0.00`
                                }

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
      
    // crearArreglo2(arrayObj : object) {
    crearArreglo2(arrayObj: Record<string, any> | null): any[] {
            if (!arrayObj) return []; 
            return Object.entries(arrayObj).map(([key, value]) => ({ ...value, id: key }));
    }
    // }
    crearArreglo(clientesObj : object) {
        const clientes: any[] = clientesObj ? Object.values(clientesObj) : [];
        return clientes;
    }
    ordernarPorCampo(arreglo : any, campo : string) {
        arreglo.sort((a, b) => b[campo].localeCompare(a[campo]));
        return arreglo;
    }
    mensajeCorrecto(mensaje : string) {
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
        Toast.fire({icon: 'success', title: mensaje})
    }
    mensajeIncorrecto(mensaje : string) {
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
        Toast.fire({icon: 'error', title: mensaje});
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
    mensaje(mensaje : string, tipo : number) {
        switch (tipo) {
            case 1:
                Swal.fire(`${mensaje}`, '', 'success')
                break;
            case 1:
                Swal.fire(`${mensaje}`, '', 'success')
                break;
            default:
                break;
        }
    }
    mensajeSwal(mensaje : string,allowOutsideClick?, html?:string) {
        Swal.fire({
            position: 'center', icon: 'success', title: mensaje, showConfirmButton: true,
            allowOutsideClick,
            html
            // timer: 1500
        })
    }
    mensajeSwalError(mensaje : string,allowOutsideClick?, html?:string) {
        Swal.fire({
            position: 'center', icon: 'error', title: mensaje, showConfirmButton: true,
            allowOutsideClick,
            html
            // timer: 1500
        })
    }
    generaClave() {
        return push(child(ref(db), 'posts')).key
    }
    realizaValidaciones(campos:any[], data:any){
      const answer = {faltantes: [], faltante_s:null, ok:true}
      campos.forEach((campo)=>{
        if (campo === 'costo') {
            // if (!data[campo] &&) answer.faltantes.push(campo)
        }else{
            if (!data[campo]) answer.faltantes.push(campo)
        }
      })
      if (answer.faltantes.length) answer.ok = false 
      answer.faltante_s = answer.faltantes.join(', ')
      return answer
    }
    realizavalidaciones_new(data:object, campos:any[]){
      const answer = {faltante_s:null, ok:true}
      let faltantes = []

      campos.forEach((campo)=>{
        if (campo !== 'costo') {
          if (!data[campo]) faltantes.push(campo)
        }
      })
      if (faltantes.length) answer.ok = false 
      answer.faltante_s = faltantes.join(', ')
      return answer
    }

    swalToast(mensaje:string){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          })
          
          Toast.fire({
            icon: 'success',
            title: mensaje
          })
    }
    swalToastCenter(mensaje:string){
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000,
            })
            Toast.fire({
            icon: 'success',
            title: mensaje
            })
    }
    swalToastError(mensaje:string){
        const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        })                                             
            Toast.fire({
            icon: 'error',
            title: mensaje
            })
    }
    swalToastError_center(mensaje:string, tipo){
        const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        })                                             
            Toast.fire({
            icon: tipo,
            title: mensaje
            })
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
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                answer.accion = 'previsualizar'
            //   Swal.fire('Saved!', '', 'success')
            } else if (result.isDenied) {
            //   Swal.fire('Changes are not saved', '', 'info')
                answer.accion = 'continuar'
            }
          })
          return answer
    }
    CapitalizarUno(value: string, ...args: unknown[]): unknown {
        if(value){
          const cadena = String(value).toLowerCase()
          let arr =[...cadena]
          arr[0] = arr[0].toUpperCase()
          return arr.join('');
        }else{
          return ''
        }
        
      }
    realizarOperaciones_2(data:any){
        
        const  { elementos,  iva, formaPago, descuento, servicios, margen } = data

        const ocupados = (servicios) ?  servicios: elementos
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
    descargarImagenTemp(dataURL:any){
      if (navigator.userAgent.indexOf('safari')>-1 && navigator.userAgent.indexOf('Chrome')===-1) {
        window.open(dataURL)
        return dataURL
      }else{
        const blob = this.UrltoBlob(dataURL)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
          // a.href = url
          console.log(this.UrltoBlob(dataURL));
          console.log(dataURL);
          
          return blob
        // a.download,' = nombre
        // this.firma = blob
        // document.body.appendChild(a)
        // a.click()
        // window.URL.revokeObjectURL(url)
      }
    }
    UrltoBlob(dataURL:any){    
        const partes = dataURL.split(';base64,')
        const contentType = partes[0].split(':')[1]
        const raw = window.atob(partes[1])
        const rawL = raw.length
        const array = new Uint8Array(rawL)
        for(let i=0; i<rawL;i++){
            array[i]= raw.charCodeAt(i)
        }
        return new Blob([array],{type: contentType})
    }

    dataCorreo(sucursal, cliente){
        const correos = [sucursal.correo];
        if (cliente.correo) {
          correos.push(cliente.correo);
        }
        if (cliente.correo_sec) {
          correos.push(cliente.correo_sec);
        }
        return correos;
    }
      async generaNombreCotizacion(infoSucursal:string,rol:string){
        const date: Date = new Date()
        const year = date.getFullYear().toString().slice(-2)
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const nombreSucursal:string = infoSucursal.slice(0,2).toUpperCase()
        const nuevoRol:string = rol.slice(0,2).toUpperCase()
        const cotizacionesSnapshot = await get(child(dbRef, `cotizacionesRealizadas`))
        const cotizacionesArray = cotizacionesSnapshot.exists() ? this.crearArreglo2(cotizacionesSnapshot.val()) : []
        const secuencia = (cotizacionesArray.length + 1).toString().padStart(5, '0')
        return `${nombreSucursal}${month}${year}${nuevoRol}${secuencia}`
      }
    obtenerNombresElementos(elementos) {
        return elementos.map(({nombre}) => String(nombre).toLowerCase()).join(', ');
      }
      mensajeOK(mensaje: string, time){
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: time
          })
      }
      mensajeNOT(mensaje: string, time){
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: mensaje,
            showConfirmButton: false,
            timer: time
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
      reseteaHoras(fecha:Date){
        const copy = new Date(fecha);
        copy.setHours(0, 0, 0, 0);
        return copy;
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
        return fecha.getDay() === 0;
      }
      formatearFecha(fecha,simbolo:boolean,symbol?) {
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
          if (a[campo] < b[campo]) {
            return ascendente ? -1 : 1;
          }
          if (a[campo] > b[campo]) {
            return ascendente ? 1 : -1;
          }
          return 0;
        });
      }
      camposCliente(){
        return ['id','no_cliente','nombre','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','sucursal','empresa','usuario']
      }
      camposCotizacion(){
        return ['sucursalShow','id','searchName','searchPlacas','reporte','formaPago','cliente','elementos','fecha','hora','iva','margen','nota','no_ctoizacion','servicio','vencimiento','vehiculo','pagoName']
      }
      camposServicios(){
         return [
            {valor:'1',nombre:'servicio'},
            {valor:'2',nombre:'garantia'},
            {valor:'3',nombre:'retorno'},
            {valor:'4',nombre:'venta'},
            {valor:'5',nombre:'preventivo'},
            {valor:'6',nombre:'correctivo'},
            {valor:'7',nombre:'rescate vial'}
          ]
      }
      camposGuardar(){ 
       return [
        'checkList','observaciones','cliente','detalles','diasEntrega','fecha_promesa','formaPago','iva','margen','reporte','servicios','sucursal','vehiculo','pathPDF', 'status', 'diasSucursal','fecha_recibido','hora_recibido','notifico','servicio', 'tecnico','showNameTecnico','no_os','personalizados'
      ]
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
          return [...arregloExistente, ...nuevaInformacion.slice(arregloExistente.length)];
        } else {
          return arregloExistente.slice(0, nuevaInformacion.length);
        }
      }
      // actualizarObjectExistente(obj_existente, obj_nuevo, camposRecupera){
        
      // }
      actualizarObjectExistente(objetoExistente:object, objetoNuevo: object, campos):object {
        const camposDiferentes = {...objetoExistente};
      
        for (const campo of campos) {
          if (objetoExistente[campo] !== objetoNuevo[campo]) {
            camposDiferentes[campo] =  objetoNuevo[campo];
          }
        }
        return camposDiferentes
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

      obtenerDiferencias(array1, array2) {
        return array1.filter(elemento => !array2.includes(elemento))
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
          let no_maximo = arreglo[0].no_os;
          let no_minimo = arreglo[0].no_os;
          let contadorMaximo = 1;
          let contadorMinimo = 1;
          let arreglo_maximo = [no_maximo];
          let arreglo_minimo = [no_minimo];


          for (let i = 1; i < arreglo.length; i++) {
            const compara = arreglo[i].reporte.total;
            const no_os = arreglo[i].no_os;
        
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

      recuperaDatos(form){
        const formValue = form.getRawValue();
        return formValue
      }
      reemplaza_strig(cadena:string, arreglo:any[]){
        let cadenanew = null
        if (cadena.length) {
          cadenanew = cadena
          arreglo.forEach(r=>{
            cadenanew = cadenanew.replace(r['valor'],r.show)
          })
        }
        return cadenanew
      }
      obtener_ticketPromedioFinal(arreglo:any[]){
        let aqui, ticketGeneral = 0

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
        return aqui
      }
      
 }
