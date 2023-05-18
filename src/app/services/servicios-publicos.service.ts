import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
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

const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({providedIn: 'root'})
export class ServiciosPublicosService {
    formasPAgo = [
        {
            id: 1,
            pago: 'contado',
            interes: 0,
            numero: 0
        }, {
            id: 2,
            pago: '3 meses',
            interes: 4.49,
            numero: 3
        }, {
            id: 3,
            pago: '6 meses',
            interes: 6.99,
            numero: 6
        }, {
            id: 4,
            pago: '9 meses',
            interes: 9.90,
            numero: 9
        }, {
            id: 5,
            pago: '12 meses',
            interes: 11.95,
            numero: 12
        }, {
            id: 6,
            pago: '18 meses',
            interes: 17.70,
            numero: 18
        }, {
            id: 7,
            pago: '24 meses',
            interes: 24.,
            numero: 24
        }
    ]
    constructor(private http : HttpClient) {}
    url: string
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
        // fecha = '11/5/2022'
        // let fechCorrecta = ''
        // if (fecha !== '' && fecha !== undefined) {
        //     const newC = fecha.split('/')
        //     newC[0] = String(Number(parseInt(newC[0])))
        //     newC[1] = String(Number(parseInt(newC[1])))
        //     if (Number(newC[0]) < 10) {
        //         newC[0] = '0' + newC[0]
        //     }
        //     if (Number(newC[1]) < 10) {
        //         newC[1] = '0' + newC[1]
        //     }
        //     fechCorrecta = `${newC[0]}/${newC[1]}/${newC[2]}`
        // }
        // return fechCorrecta
        if (!fecha) return '';
  
      const [dia, mes, anio] = fecha.split('/');
      
      const diaFormateado = dia.padStart(2, '0');
      const mesFormateado = mes.padStart(2, '0');
      
      return `${diaFormateado}/${mesFormateado}/${anio}`;
    
    }
    ordenamiento(arreglo : any[], campo : string, ordena : boolean) {
        const campoSpli = campo.split('_')
            // console.log(campoSpli);
            let esFecha = 0,
                esHora = 0
            for (let indf = 0; indf < campoSpli.length; indf++) {
                const element = campoSpli[indf];
                if (element.toLocaleLowerCase() === 'fecha') {
                    esFecha++
                }
                if (element.toLocaleLowerCase() === 'hora') {
                    esHora++
                }
            }
            let nuevoArreglo = arreglo
            if (campo === 'status') {
                let arreglo = [];
                const statusArray: any = ['recibido', 'autorizado', 'terminado', 'entregado', 'cancelado']
                for (let ind = 0; ind < statusArray.length; ind++) {
                    const sta = statusArray[ind];
                    for (let index = 0; index < nuevoArreglo.length; index++) {
                        const element = nuevoArreglo[index];
                        if (sta === element.status) {
                            arreglo.push(element)
                        }
                    }
                }
                nuevoArreglo = arreglo
            } else if (esFecha > 0) {
                for (let index = 0; index < arreglo.length; index++) {
                    const element = arreglo[index];
                    if (element[campo] === undefined || element[campo] === '') {
                        // console.log(`index ${index}: ${element[campo]}`);
                        element[campo] = '00/00/00'
                    }
                }
                arreglo.sort(function (a, b) {
                    if ((a[campo] !== null && a[campo] !== undefined && a[campo] !== '') && (b[campo] !== null && b[campo] !== undefined && b[campo] !== '')) {
                        const fechaSplit = a[campo].split('/')
                        const fechaSplit2 = b[campo].split('/')
                        const fecha = new Date(Number(fechaSplit[2]),Number(fechaSplit[0]),Number(fechaSplit[1]));
                        const fecha2 = new Date(
                            Number(fechaSplit2[2]),
                            Number(fechaSplit2[0]),
                            Number(fechaSplit2[1])
                        );
                        if (fecha > fecha2) {
                            return 1;
                        }
                        if (fecha < fecha2) {
                            return -1;
                        }
                    }
                    return 0;
                })
                for (let index = 0; index < arreglo.length; index++) {
                    const element = arreglo[index];
                    if (element[campo] === '00/00/00') {
                        element[campo] = ''
                    }
                }
                nuevoArreglo = arreglo
            } else if (esHora > 0) {
                for (let index = 0; index < arreglo.length; index++) {
                    const element = arreglo[index];
                    if (element[campo] === undefined || element[campo] === '') {
                        // console.log(`index ${index}: ${element[campo]}`);
                        element[campo] = '00:00:00'
                    }
                }
                arreglo.sort(function (a, b) {
                    if ((a[campo] !== null && a[campo] !== undefined && a[campo] !== '') && (b[campo] !== null && b[campo] !== undefined && b[campo] !== '')) {
                        const fechaSplit = a[campo].split(':')
                        const fechaSplit2 = b[campo].split(':')
                        const fecha = new Date(0,0,0,Number(fechaSplit[0]),Number(fechaSplit[1]),Number(fechaSplit[2]));
                        const fecha2 = new Date(0,0,0,Number(fechaSplit2[0]),Number(fechaSplit2[1]),Number(fechaSplit2[2]));
                        if (fecha > fecha2) {
                            return 1;
                        }
                        if (fecha < fecha2) {
                            return -1;
                        }
                    }
                    return 0;
                })
                for (let index = 0; index < arreglo.length; index++) {
                    const element = arreglo[index];
                    if (element[campo] === '00:00:00') {
                        element[campo] = ''
                    }
                }
                nuevoArreglo = arreglo
            } else {
                nuevoArreglo.sort(function (a, b) {
                    if (a[campo] > b[campo]) {
                        return 1;
                    }
                    if (a[campo] < b[campo]) {
                        return -1;
                    }
                    return 0;
                })
            }
            if (!ordena) {
                nuevoArreglo = nuevoArreglo.reverse()
            }
            return nuevoArreglo
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
        
            // const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
            // const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
            
            // const date = new Date(inputDate);
            // const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            // const fechaNumeros = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
            // const fechaPDF = `${dias[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
            // const vencimiento = new Date(date.setDate(date.getDate() + 20)).toLocaleDateString();
            // const Mes = months[date.getMonth()];
          
            // const ayer = new Date(date.setDate(date.getDate() - 1));
            // ayer.setHours(0, 0, 0, 0);
            // const fechaNumerosAyer = `${ayer.getDate()}${ayer.getMonth() + 1}${ayer.getFullYear()}`;
          
            // const fechaManiana = new Date(date.setDate(date.getDate() + 2));
            // fechaManiana.setHours(0, 0, 0, 0);
            // const fechaM = `${fechaManiana.getDate()}/${fechaManiana.getMonth() + 1}/${fechaManiana.getFullYear()}`;
            // const fechaManianaNumeros = `${fechaManiana.getDate()}${fechaManiana.getMonth() + 1}${fechaManiana.getFullYear()}`;
            
            // return { 
            //   fecha,fechaPDF,vencimiento,Mes,fechaM,
            //   diaReturn: dias[fechaManiana.getDay()],
            //   fechaNumeros,
            //   ayer,
            //   fechaNumerosAyer,
            //   fehaHoy: inputDate,
            //   fechaManianaNumeros,
            //   fechaManiana
            // };
          
          
            let fechas = new Date();
            let fechaNumeros = '',
                fechaNumerosAyer,
                fechaManianaNumeros
            if (fechaa) 
                fechas = new Date(fechaa)
            const date: Date = fechas;
            let ayer = fechas
                let fecha: string,
                    hora: string,
                    fechaM: string
                const months = [
                    "enero",
                    "febrero",
                    "marzo",
                    "abril",
                    "mayo",
                    "junio",
                    "julio",
                    "agosto",
                    "septiembre",
                    "octubre",
                    "noviembre",
                    "diciembre"
                ];
                const dias = [
                    'Domingo',
                    'Lunes',
                    'Martes',
                    'Miércoles',
                    'Jueves',
                    'Viernes',
                    'Sábado'
                ];
                fecha = date.getDate() + "/" + (
                    date.getMonth() + 1
                ) + "/" + date.getFullYear()
                fechaNumeros = `${date.getDate()}${ (date.getMonth() + 1)}${date.getFullYear()}`

                let fehaHoy = new Date()

                if (fechaa) {
                    fehaHoy = new Date(fechaa)
                }
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
                // console.log(`${dias[numeroDia]}`);
                const diaReturn = dias[numeroManiana]
                return {
                    fecha,
                    hora,
                    fechaPDF,
                    vencimiento,
                    Mes,
                    fechaM,
                    diaReturn,
                    numeroManiana,
                    fechaNumeros,
                    ayer,
                    fechaNumerosAyer,
                    fehaHoy,
                    fechaManianaNumeros,
                    fechaManiana
                }
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
    getMesFecha(
                fecha : Date,
                operacion : string,
                tipo : string,
                numero : number,
                hora? : string,
                ayer?:boolean
            ) {
                if (hora) {} else {
                    fecha.setHours(0, 0, 0, 0)
                }
                let FechaActual = new Date(fecha),
                    FechaActual2 = new Date(fecha)

                let diasMes = 0,
                    fecha1: Date,
                    fecha2: Date

                if (operacion === 'suma') {
                    if (tipo === 'dia') {
                        FechaActual.setDate(fecha.getDate())
                        fecha1 = FechaActual

                        FechaActual2.setDate(fecha.getDate() + numero)
                        fecha2 = FechaActual2
                    } else if (tipo === 'mes') {

                        FechaActual2.setMonth(fecha.getMonth() + numero)

                        diasMes = new Date(FechaActual2.getFullYear(), FechaActual2.getMonth() + 1, 0).getDate()
                        fecha1 = new Date(
                            FechaActual.getFullYear(),
                            FechaActual.getMonth() - numero,
                            1
                        )
                        fecha2 = new Date(
                            FechaActual.getFullYear(),
                            FechaActual.getMonth() - numero,
                            diasMes
                        )

                    } else if (tipo === 'anio') {
                        FechaActual.setFullYear(fecha.getFullYear() + numero)
                        fecha1 = new Date(FechaActual.getFullYear(), 0, 1)
                        fecha2 = new Date(FechaActual.getFullYear(), 11, 31)
                    }
                } else {
                    // console.log('aqui');

                    if (tipo === 'dia') {
                        FechaActual.setDate(fecha.getDate() - numero)
                        FechaActual.setHours(0, 0, 0, 0)
                        fecha1 = FechaActual

                        // FechaActual2.setDate(fecha.getDate())
                        if (ayer) {
                            FechaActual2.setDate(fecha.getDate() - numero)
                        }else{
                            FechaActual2.setDate(fecha.getDate())
                        }

                        FechaActual2.setHours(23, 59, 59, 0)
                        fecha2 = FechaActual2

                    } else if (tipo === 'mes') {

                        FechaActual2.setMonth(fecha.getMonth() - numero)

                        diasMes = new Date(FechaActual2.getFullYear(), FechaActual2.getMonth() + 1, 0).getDate()
                        fecha1 = new Date(
                            FechaActual.getFullYear(),
                            FechaActual.getMonth() - numero,
                            1, 0, 0, 0, 0
                        )
                        fecha2 = new Date(
                            FechaActual.getFullYear(),
                            FechaActual.getMonth() - numero,
                            diasMes, 23, 59, 59, 999
                        )

                    } else if (tipo === 'anio') {

                        FechaActual.setFullYear(fecha.getFullYear() - numero)
                        fecha1 = new Date(FechaActual.getFullYear(), 0, 1, 0, 0, 0, 0)
                        fecha2 = new Date(FechaActual.getFullYear(), 11, 31, 23, 59, 59, 999)
                    }
                }

                // diasMes =new Date(MesActual.getFullYear(), MesActual.getMonth(), 0).getDate()
                // fecha1 = new Date(MesActual.getFullYear(), MesActual.getMonth(), 1) fecha2 =
                // new Date(MesActual.getFullYear(), MesActual.getMonth(), diasMes)

                return {diasMes, fecha1, fecha2}
    }
    // convierte_fechaString_personalizada(fecha : Date) {
    //             const f1 = new Date(fecha);
    //             const hora = new Date(fecha);
    //             let string_fecha = '', stringHora='',stringNumeros='', fechaString= new Date(fecha)
    //             string_fecha = `${f1.getDate()}/${f1.getMonth() + 1}/${f1.getFullYear()}`
    //             stringHora =`${hora.getHours()}:${hora.getMinutes()}:${hora.getSeconds()}`
    //             stringNumeros = `${f1.getDate()}${f1.getMonth()+ 1}${f1.getFullYear()}`
    //             return {string_fecha,stringHora,fechaString,stringNumeros,hora}
    // }
    convierte_fechaString_personalizada(fecha: Date) {
        const f1 = new Date(fecha);
        const hora = new Date(fecha);
        const string_fecha = `${f1.getDate()}/${f1.getMonth() + 1}/${f1.getFullYear()}`;
        const stringHora = `${hora.getHours()}:${hora.getMinutes()}:${hora.getSeconds()}`;
        const stringNumeros = `${f1.getDate()}${f1.getMonth()+ 1}${f1.getFullYear()}`;
        return {string_fecha, stringHora, fechaString: new Date(fecha), stringNumeros, hora};
      }
      
    // obtenerFechaCompleta(fecha : any) {
    //             const fec = fecha.split('/')
    //             const nueva = `${fec[1]}/${fec[0]}/${fec[2]}`
    //             const date: Date = new Date(nueva);
    //             const months = [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ];
    //             const dias = [ 'Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    //             const numeroDia = new Date(date).getDay();
    //             const fechaPDF = `${dias[numeroDia]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    //             return fechaPDF
    // }
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
                if (hora) 
                    horaNew = hora
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
                        var data = {
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
            if (a['tipo'] === 'MO') {
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
    isObject(valor) {
        return valor instanceof Object;
    }
    async recuperaDataArreglo(campos : any[], data : any) {
                                    let Necesaria = {}
                                    const camposRecuperar = campos
                                    const camposInfo = Object.keys(data)
                                    for (let index = 0; index < camposRecuperar.length; index++) {
                                        const recupera = camposRecuperar[index];
                                        for (let indexcliente = 0; indexcliente < camposInfo.length; indexcliente++) {
                                            const cli = camposInfo[indexcliente];
                                            if (recupera === cli) {
                                                Necesaria[recupera] = data[recupera]
                                            }
                                            // (cli === recupera)? Necesaria[recupera] = data[recupera]: ''
                                        }
                                    }
                                    return Necesaria
    }
    recuperaData(campos : any[], data : any) {
                                    let Necesaria = {}
                                    campos.forEach(element => {
                                        Necesaria[element] = data[element]
                                    });
                                    return Necesaria
    }
    nuevaRecuperacionData(data: any, camposRecuperar: any[]) {
        const necessary: any = {};
        camposRecuperar.forEach((recupera) => {
          if (data[recupera] !== undefined && data[recupera] !== null) {
            necessary[recupera] = data[recupera];
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
    async mensaje_pregunta(mensaje) {
        let mensajeAnswer = { respuesta: false }
        await Swal
            .fire({
                title: `${mensaje} ?`,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                denyButtonText: `Don't save`,
                cancelButtonText: `Cancelar`
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
    mensajeElemento(info : any) {
        Swal.fire(
        {title: '<h2 class="fw-bold text-uppercase">Información confidencial</h2>', html: `
      <h2 >${status}</h2>
      <table class="table">
        <tbody>
        <tr>
            <th class="text-start" scope="row">Nombre</th>
            <td class="text-start">${info.nombre}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Cantidad</th>
            <td class="text-start">${info.cantidad}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Costo</th>
            <td class="text-start">${info.costo}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Precio</th>
            <td class="text-start">${info.precio}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Flotilla</th>
            <td class="text-start">${info.flotilla}</td>
          </tr>
          
        </tbody>
      </table>
      `})
    }
    restaFechas = function (f1 : any, f2 : any) {
        var aFecha1 = f1.split('/');
        var aFecha2 = f2.split('/');
        var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
        var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
        var dif = fFecha2 - fFecha1;
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
        return dias;
    }

    obtenerFechaJava(fecha) {
        const fecha_string = this.convierteFecha(fecha)
        const split_string = fecha_string.split('/')
        const fecha_return = new Date(
            Number(split_string[2]),
            Number(split_string[1]) - 1,
            Number(split_string[0])
        )
        return fecha_return
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

    mensajeSwal(mensaje : string) {
        Swal.fire({
            position: 'center', icon: 'success', title: mensaje, showConfirmButton: true,
            // timer: 1500
        })
    }
    mensajeSwalError(mensaje : string) {
        Swal.fire({
            position: 'center', icon: 'error', title: mensaje, showConfirmButton: true,
            // timer: 1500
        })
    }

                                            generaCamposReporte(data : any[], busqueda : string) {
                                                let tiempoEstancia = 0,
                                                    horas_estancia = 0,
                                                    ticket = 0,
                                                    horas_totales = 0
                                                let arreglo = []

                                                if (busqueda.toLowerCase() !== 'cancelado') {
                                                    arreglo = data.filter(o => o['status'] !== 'cancelado')
                                                } else {
                                                    arreglo = data.filter(o => o['status'] === 'cancelado')
                                                }

                                                let reporte = {
                                                    horas_estancia: 0,
                                                    ticket: 0,
                                                    tiempoEstancia: 0,
                                                    horas_totales: 0
                                                }
                                                arreglo.map(d => {
                                                    // console.log(d['id']);
                                                    ticket = ticket + d['desgloce'].total
                                                    if (d['diasSucursal']) {
                                                        tiempoEstancia += d['diasSucursal']
                                                    }
                                                    // para obtener la fecha en formato string y comparar RECIBIDO
                                                    const aqui = d['fecha_recibido'].split('/')
                                                        const aqui_time = d['hora_recibido'].split(':')
                                                            const fec_Recibido = new Date(
                                                                    aqui[2],
                                                                    aqui[1] - 1,
                                                                    aqui[0],
                                                                    aqui_time[0],
                                                                    aqui_time[1],
                                                                    aqui_time[2]
                                                                )

                                                                // para obtener la fecha en formato string y comparar Entregado
                                                                let aqui_entregado,
                                                                    aqui_time_entregado,
                                                                    fec_entregado
                                                                if (d['fecha_entregado']) {
                                                                    aqui_entregado = d['fecha_entregado'].split('/')
                                                                    aqui_time_entregado = d['hora_entregado'].split(':')
                                                                    fec_entregado = new Date(
                                                                        aqui_entregado[2],
                                                                        aqui_entregado[1] - 1,
                                                                        aqui_entregado[0],
                                                                        aqui_time_entregado[0],
                                                                        aqui_time_entregado[1],
                                                                        aqui_time_entregado[2]
                                                                    )
                                                                } else {
                                                                    fec_entregado = new Date()
                                                                }

                                                                if ((fec_Recibido instanceof Date) && (fec_entregado instanceof Date)) {
                                                                    let diferencia = (fec_entregado.getTime() - fec_Recibido.getTime()) / 1000
                                                                    diferencia /= (60 * 60)
                                                                    horas_estancia += Math.abs(Math.round(diferencia))
                                                                    horas_totales += horas_estancia
                                                                }
                                                            })
                                                            if (arreglo.length) {
                                                                reporte.horas_estancia = tiempoEstancia
                                                                reporte.tiempoEstancia = tiempoEstancia / 24
                                                                reporte.horas_totales = tiempoEstancia
                                                                reporte.ticket = ticket / arreglo.length
                                                            }

                                                            return reporte
                                                        }

    generaClave() {
        return push(child(ref(db), 'posts')).key
    }
    realizaValidaciones(campos:any[], data:any){
      const answer = {faltantes: [], faltante_s:'', ok:true}
      campos.forEach((campo)=>{
        if (!data[campo]) answer.faltantes.push(campo)
      })
      if (answer.faltantes.length) answer.ok = false 
      answer.faltante_s = answer.faltantes.join(', ')
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
    realizarOperaciones_2(data:any){
        
        const  { elementos, margen_get, iva, formaPago, descuento, servicios, margen } = data

        const ocupados = (servicios) ?  servicios: elementos
        const margen1_0 = (margen) ?   margen : margen_get
        
        const margenOcupado = 1 + (margen1_0 / 100)
        
        const reporteGeneral = {
          iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
          subtotal:0, total:0, ub:0, meses:0, descuento:0,sobrescrito:0
        }
        let cstoCOmpra = 0
        ocupados.map((e,index)=>{
        
        if(e.tipo === 'refacccion') cstoCOmpra+= e.precio
          e.index = index
          const pre = e.costo >0 ? e.costo : e.precio;
          const operacion =  e.tipo === "refaccion" ? e.cantidad * pre : e.cantidad * pre;
          if (e.costo > 0) {
            if (e.tipo === 'refaccion') {
              if(e.aprobado) reporteGeneral.sobrescrito_refaccion += (operacion * margenOcupado);
              e.total = operacion * margenOcupado
            } else if (e.tipo === "MO" || e.tipo ==='mo') {
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
            } else if (e.tipo === 'MO' || e.tipo ==='mo') {
              if(e.aprobado) reporteGeneral.mo += operacion;
              e.total = operacion
            }else {
                const {elementos, reporte} = this.reportePaquete(e.elementos,margenOcupado)
                e.elementos = elementos
                e.reporte = reporte;
                e.precio = reporte.total;
                e.total = reporte.total
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
        
        const enCaso_meses = this.formasPAgo.find(f=>Number(f['id']) === Number(formaPago))
        // console.log(enCaso_meses);
        if (Number(enCaso_meses['id']) === 1) {
          reporteGeneral.descuento = Number(descuento)
          if(!reporteGeneral.descuento) reporteGeneral.descuento = 0
          reporteGeneral.total -= reporteGeneral.descuento
        }else{
          reporteGeneral.descuento = 0
          const operacion = reporteGeneral.total * (1 + (enCaso_meses['interes'] / 100))
          reporteGeneral.meses = operacion;
        }
        if (reporteGeneral.total >0 ) {
            reporteGeneral.ub = (reporteGeneral.subtotal - cstoCOmpra) *100/reporteGeneral.total
        } 

        ///siempre obtener el costo de c

        return { reporte: reporteGeneral, ocupados}
    }
    
    reportePaquete(elementos:any,margen:number){
        if (!elementos) elementos = [];

        const reporte_interno = {mo: 0,refacciones: 0,refacciones_v: 0,sobrescrito_mo: 0,sobrescrito_refaccion: 0,ub: 0,total: 0};
        
        elementos.forEach((e_interno, index) => {
          e_interno.index = index;
        
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
        
        return { reporte: { ...reporte_interno }, elementos };
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
    // async generaNombreCotizacion(infoSucursal:string,rol:string){
    //     let mes = ''; let sucursal= '', nuevoRol:string ='',secuencia=''; let ceros = '', cuantas:number = 0
    //     let no_cotizacion:string = ''
    //     // const timeReques = await this._publicos.getFechaHora()
      
    //     const date: Date = new Date()
      
    //     const anio = String(date.getFullYear())
    //     let muestra = anio.slice(anio.length-2,anio.length)
      
    //     if((date.getMonth() +1)<10) { mes = `0${(date.getMonth() +1)}` }else{ mes=`${(date.getMonth() +1)}` }
    //     await get(child(dbRef, `cotizacionesRealizadas`)).then((snapshot) => {
    //       if (snapshot.exists()) {
    //         let nuev:any[] = this.crearArreglo2(snapshot.val())
    //         cuantas = nuev.length
    //       }
    //     }).catch((error) => {
    //       // console.error(error);
    //     });
    //     const inicio = String(cuantas).length
    //     const final = 5
    //     for (let index = inicio; index < final ; index++) {
    //       ceros = `${ceros}0`
    //     }
    //     secuencia = `${ceros}${cuantas + 1}`
    //     const nombreSucursal:string = infoSucursal      
    //     sucursal = nombreSucursal.slice(0,2).toUpperCase() 
    //     const rolString:string = rol      
    //     nuevoRol = rolString.slice(0,2).toUpperCase() 
    
    //     no_cotizacion = `${sucursal}${mes}${muestra}${nuevoRol}${secuencia}`
        
    //     return no_cotizacion
    //   }
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
      

    //   obtenerNombresElementos(elementos:any[]){
    //     const answer = {cadena: '', arr:[]}
    //         elementos.forEach(e=>{
    //             answer.arr.push(e['nombre'])
    //         })
    //     return answer.arr.join(', ')
    //   }

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
        
        // Calculamos la diferencia en días entre las dos fechas
        const diffTime = date2.getTime() - date1.getTime()
        const diasTranscurridos = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diasTranscurridos;
      }
      calcularDiasEntrega(fechaInicio: Date, fechaFin: Date): number {

        const date1 = new Date(fechaInicio);
        const date2 = new Date(fechaFin);
        
        // Calculamos la diferencia en días entre las dos fechas
        const diffTime = date2.getTime() - date1.getTime()
        const diasTranscurridos = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diasTranscurridos;
      }
      reseteaHoras(fecha:Date){
        // const startOfDay = fecha => {
            const copy = new Date(fecha);
            copy.setHours(0, 0, 0, 0);
            return copy;
        //   };

        // return startOfDay
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
      formatearFecha(fecha,simbolo:boolean) {
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear().toString();
        return (simbolo) ? `${dia}/${mes}/${anio}` : `${dia}${mes}${anio}`;
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
        return ['id','no_cliente','nombre','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','sucursal','empresa']
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

      
      
      
      
 }
