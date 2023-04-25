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
        let fechCorrecta = ''
        if (fecha !== '' && fecha !== undefined) {
            const newC = fecha.split('/')
            newC[0] = String(Number(parseInt(newC[0])))
            newC[1] = String(Number(parseInt(newC[1])))
            if (Number(newC[0]) < 10) {
                newC[0] = '0' + newC[0]
            }
            if (Number(newC[1]) < 10) {
                newC[1] = '0' + newC[1]
            }
            fechCorrecta = `${newC[0]}/${newC[1]}/${newC[2]}`
        }
        return fechCorrecta
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
    convierte_fechaString_personalizada(fecha : Date) {
                const f1 = new Date(fecha);
                const hora = new Date(fecha);
                let string_fecha = '', stringHora='',stringNumeros='', fechaString= new Date(fecha)
                string_fecha = `${f1.getDate()}/${f1.getMonth() + 1}/${f1.getFullYear()}`
                stringHora =`${hora.getHours()}:${hora.getMinutes()}:${hora.getSeconds()}`
                stringNumeros = `${f1.getDate()}${f1.getMonth()+ 1}${f1.getFullYear()}`
                return {string_fecha,stringHora,fechaString,stringNumeros,hora}
    }
    obtenerFechaCompleta(fecha : any) {
                // let fecha = '21/12/2022' console.log(fecha);
                const fec = fecha.split('/')
                const nueva = `${fec[1]}/${fec[0]}/${fec[2]}`
                // console.log(nueva);
                const date: Date = new Date(nueva);
                // console.log(date);

                const months = [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
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
                const numeroDia = new Date(date).getDay();
                const fechaPDF = `${dias[numeroDia]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
                return fechaPDF
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
                const months = [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
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
                const numeroDia = new Date(date).getDay();
                return `${dias[numeroDia]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    }
    getRecepciones() {

                let data: any = []
                let arreglo: any = [];
                let arregloReturn: any = []
                const starCountRef = ref(db, `recepciones`)
                onValue(starCountRef, (snapshot) => {
                    if (snapshot.exists()) {
                        arreglo = this.crearArreglo2(snapshot.val())
                        for (let index = 0; index < arreglo.length; index++) {

                            // console.log(arreglo[index]);

                            if (arreglo[index].status !== 'entregado') {
                                // console.log(arreglo[index].fecha_estimada);
                                // console.log(this.restaFechasTaller(arreglo[index].fecha_recibido));
                                const dias = this.restaFechasTaller(arreglo[index].fecha_recibido)
                                set(ref(db, `recepciones/${arreglo[index].id}/diasSucursal`), dias)
                                    .then(
                                        () => {
                                            // Data saved successfully!
                                        }
                                    )
                                    .catch((error) => {
                                        // The write failed...
                                    });
                            }

                            get(child(dbRef, `clientes/${arreglo[index].cliente}`))
                                .then((snapCliente) => {
                                    if (snapCliente.exists()) {
                                        // console.log(snapCliente.val());
                                        const cliente = snapCliente.val()
                                        arreglo[index].dataCliente = cliente
                                        arreglo[index].nombre = String(`${cliente.nombre} ${cliente.apellidos}`).toUpperCase()
                                    } else {
                                        console.log("No data available");
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                            get(child(dbRef, `vehiculos/${arreglo[index].vehiculo}`))
                                .then(
                                    (snapVehiculo) => {
                                        if (snapVehiculo.exists()) {
                                            // console.log(snapshot.val());
                                            const vehiculo = snapVehiculo.val()
                                            arreglo[index].dataVehiculo = vehiculo
                                            arreglo[index].placas = String(vehiculo.placas).toUpperCase()
                                        } else {
                                            console.log("No data available");
                                        }
                                    }
                                )
                                .catch((error) => {
                                    console.error(error);
                                });
                        }

                        for (let ing = 0; ing < arreglo.length; ing++) {
                            const element = arreglo[ing].servicios

                                let refacciones = 0,
                                    mo = 0,
                                    total = 0
                                for (let ingd = 0; ingd < element.length; ingd++) {
                                    const ele = element[ingd];
                                    if (ele.aprobado) {
                                        const cantidadP = ele.cantidad
                                        // console.log(cantidadP);
                                        let precioF = 0
                                        if (ele.tipo === 'paquete') {
                                            // console.log(ele.nombre);
                                            const elementos = ele.elementos
                                            for (let indEle = 0; indEle < elementos.length; indEle++) {
                                                const ele1 = elementos[indEle];

                                                const cantidadE = ele1.cantidad
                                                let costo = 0
                                                if (ele1.tipo === 'MO') {

                                                    // precioF=precioF+ opera mo = mo + opera
                                                    for (let indcantidad = 1; indcantidad <= cantidadE; indcantidad++) {
                                                        const opera = indcantidad * ele1
                                                            .precio
                                                            elementos[indEle]
                                                            .flotilla = opera
                                                        elementos[indEle].normal = elementos[indEle].flotilla * 1.30
                                                        costo = elementos[indEle].flotilla
                                                    }
                                                    precioF = precioF + costo
                                                    mo = mo + costo
                                                } else if (ele1.tipo === 'refaccion') {
                                                    for (let indcantidad = 1; indcantidad <= cantidadE; indcantidad++) {
                                                        const opera = indcantidad * ele1
                                                            .precio
                                                            elementos[indEle]
                                                            .flotilla = opera
                                                        elementos[indEle].normal = elementos[indEle].flotilla * 1.30
                                                        costo = elementos[indEle].flotilla
                                                    }
                                                    elementos[indEle].total = costo
                                                    precioF = precioF + costo
                                                    refacciones = refacciones + costo
                                                }
                                            }
                                            element[ingd].total = precioF
                                        } else if (ele.tipo === 'MO') {
                                            let costo = 0
                                            for (let indcantidad = 1; indcantidad <= cantidadP; indcantidad++) {
                                                const opera = indcantidad * ele
                                                    .precio
                                                    element[ingd]
                                                    .total = opera
                                                costo = element[ingd].total
                                            }
                                            mo = mo + costo
                                        } else if (ele.tipo === 'refaccion') {
                                            // console.log(ele[ingd] + `${ingd}`);
                                            let costo = 0
                                            for (let indcantidad = 1; indcantidad <= cantidadP; indcantidad++) {
                                                const opera = indcantidad * ele
                                                    .precio
                                                    element[ingd]
                                                    .total = opera
                                                costo = element[ingd].total
                                            }
                                            refacciones = refacciones + costo
                                        }
                                    }
                                    // console.log('FIN');

                                    arreglo[ing].costoMO = mo
                                    arreglo[ing].costorefacciones = refacciones
                                    if (arreglo[ing].iva) {
                                        arreglo[ing].costoFlotilla = mo + (refacciones) * 1.25
                                        arreglo[ing].costoFlotillaCuantoIVA = (mo + (refacciones) * 1.25) * .16
                                        arreglo[ing].costoFlotillaIVA = (mo + (refacciones) * 1.25) * 1.16
                                    } else {
                                        arreglo[ing].costoFlotilla = mo + (refacciones) * 1.25
                                    }
                                }
                                for (let ind = 0; ind < arreglo.length; ind++) {
                                    const element = arreglo[ind];
                                    arreglo[ind].fecha_recibido = this.convierteFecha(element.fecha_recibido)
                                    if (arreglo[ind].fecha_entregado) {
                                        arreglo[ind].fecha_entregado = this.convierteFecha(element.fecha_entregado)
                                    }
                                }
                                arregloReturn = arreglo
                            }
                            // console.log(arreglo); let ruta:string = starCountRef.toString()
                            // console.log(this.http.get(`${ruta}.json`)); data =
                            // this.http.get(`${ruta}.json`) .pipe(   map(this.crearArreglo2) )

                        }
                    })

                    return arreglo
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
    nuevaRecuperacionData(data : any, camposRecuperar : any[]) {
                                    let Necesaria = {}
                                    camposRecuperar.forEach(recupera => {
                                        Necesaria[recupera] = data[recupera]
                                    })
                                    return Necesaria
    }
    crearArreglo2(arrayObj : object) {
                                    const arrayGet: any[] = [];
                                    if (arrayObj === null) {
                                        return [];
                                    }
                                    Object
                                        .keys(arrayObj)
                                        .forEach((key) => {
                                            const arraypush: any = arrayObj[key];
                                            arraypush.id = key;
                                            arrayGet.push(arraypush);
                                        });
                                    return arrayGet;
    }
    crearArreglo(clientesObj : object) {
                                    const clientes: any[] = []
                                    if (clientesObj === null) {
                                        return []
                                    }
                                    Object
                                        .keys(clientesObj)
                                        .forEach(key => {
                                            const cliente: any = clientesObj[key]
                                            clientes.push(cliente)
                                        })
                                    return clientes
    }
    ordernarPorCampo(arreglo : any, campo : string) {
                                    arreglo.sort(function (a, b) {
                                        if (a[campo] > b[campo]) {
                                            return 1;
                                        }
                                        if (a[campo] < b[campo]) {
                                            return -1;
                                        }
                                        return 0;
                                    })
                                    return arreglo
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
        let mensajeAnswer = {
            respuesta: false
        }
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
    async ObtenerTotalesPaquete(cant : number, array : any[], margen : number) {
                                    let data = {
                                            totalMO: 0,
                                            refacciones1: 0,
                                            refacciones2: 0,
                                            precio: 0,
                                            flotilla: 0
                                        }
                                        const elementosGet = array
                                            let totalMO = 0,
                                                refacciones1 = 0,
                                                refacciones2 = 0;
                                            for (let indexcant = 1; indexcant <= cant; indexcant++) {
                                                for (let index = 0; index < elementosGet.length; index++) {
                                                    const element = elementosGet[index];
                                                    const cantidad = element.cantidad
                                                    if (element.tipo === 'MO') {
                                                        let newPrecio = 0,
                                                            total = 0;
                                                        (element.costo > 0)
                                                            ? newPrecio = element.costo
                                                            : newPrecio = element.precio
                                                        for (let cantidadS = 1; cantidadS <= cantidad; cantidadS++) {
                                                            total = cantidadS * newPrecio
                                                        }
                                                        totalMO = totalMO + total
                                                    } else if (element.tipo === 'refaccion') {
                                                        let newPrecio = 0,
                                                            total = 0,
                                                            total2 = 0;
                                                        (element.costo > 0)
                                                            ? newPrecio = element.costo
                                                            : newPrecio = element.precio
                                                        for (let cantidadS = 1; cantidadS <= cantidad; cantidadS++) {
                                                            total = cantidadS * newPrecio
                                                            total2 = (cantidadS * newPrecio) * ((margen / 100) + 1)
                                                        }
                                                        refacciones1 = refacciones1 + total
                                                        // refacciones2 = refacciones2 + total2
                                                    }
                                                }
                                            }
                                            data.totalMO = totalMO
                                            data.refacciones1 = refacciones1
                                            data.refacciones2 = refacciones1 * (1 + (25 / 100))

                                            data.precio = refacciones1
                                            data.flotilla = (refacciones1 * (1 + (25 / 100))) + totalMO
                                            return data
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
                                        realizarOperacion(data : any, deQuien : string) {
                                            const desgloce = {
                                                    UB: 0,
                                                    UB2: 0,
                                                    mo: 0,
                                                    refacciones_1: 0,
                                                    refacciones_2: 0,
                                                    subtotal: 0,
                                                    iva: 0,
                                                    sobrescrito: 0,
                                                    sobrescrito_mo: 0,
                                                    sobrescrito_refaccion: 0,
                                                    sobrescrito_paquete: 0,
                                                    total: 0
                                                }
                                                let mo = 0,
                                                    refacciones_1 = 0,
                                                    sobrescrito_mo = 0,
                                                    sobrescrito_refaccion = 0,
                                                    sobrescrito_paquete = 0
                                                let elementos = [];

                                                if (data[deQuien]) 
                                                    elementos = data[deQuien]
                                                elementos.forEach(ele => {
                                                    if (ele['aprobado']) {
                                                        if (ele['costo'] > 0) {
                                                            if (ele['tipo'] === 'MO') {
                                                                sobrescrito_mo += ele['costo'] * ele['cantidad']
                                                            } else if (ele['tipo'] === 'refaccion') {
                                                                sobrescrito_refaccion += ele['costo'] * ele['cantidad']
                                                            } else if (ele['tipo'] === 'paquete') {
                                                                sobrescrito_paquete += ele['costo'] * ele['cantidad']
                                                            }
                                                        } else {
                                                            if (ele.tipo === 'MO') {
                                                                (ele['costo'] > 0)
                                                                    ? sobrescrito_mo += ele['cantidad'] * ele['costo']
                                                                    : mo += ele['cantidad'] * ele['precio']
                                                            } else if (ele.tipo === 'refaccion') {
                                                                (ele['costo'] > 0)
                                                                    ? sobrescrito_refaccion += ele['cantidad'] * ele['costo']
                                                                    : refacciones_1 += ele['cantidad'] * ele['precio']
                                                            } else if (ele.tipo === 'paquete') {
                                                                let elementos = [];
                                                                if (ele['elementos']) 
                                                                    elementos = ele['elementos']
                                                                elementos.forEach(subele => {
                                                                    if (subele.tipo === 'MO') {
                                                                        (subele['costo'] > 0)
                                                                            ? sobrescrito_mo += subele['cantidad'] * subele['costo']
                                                                            : mo += subele['cantidad'] * subele['precio']
                                                                    } else if (subele.tipo === 'refaccion') {
                                                                        (subele['costo'] > 0)
                                                                            ? sobrescrito_refaccion += subele['cantidad'] * subele['costo']
                                                                            : refacciones_1 += subele['cantidad'] * subele['precio']
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                                desgloce.sobrescrito_paquete = sobrescrito_paquete
                                                desgloce.sobrescrito_refaccion = sobrescrito_refaccion
                                                desgloce.sobrescrito_mo = sobrescrito_mo
                                                let suma = sobrescrito_paquete + sobrescrito_refaccion +
                                                        sobrescrito_mo

                                                desgloce.sobrescrito = suma
                                                desgloce.mo = mo
                                                desgloce.refacciones_1 = refacciones_1
                                                desgloce.refacciones_2 = refacciones_1 * (1 + (data['margen'] / 100))
                                                let suma2 = mo + desgloce.refacciones_2
                                                let descuento = 0
                                                if (data['descuento']) 
                                                    descuento = data['descuento']
                                                desgloce.subtotal = (suma + suma2) - descuento
                                                // desgloce.total = desgloce.subtotal
                                                if (data['iva']) 
                                                    desgloce.iva = desgloce.subtotal * .16
                                                desgloce.total = desgloce.subtotal + desgloce.iva


                                                //la primera formula que se me entrego
                                                desgloce.UB = ((desgloce.subtotal - desgloce.refacciones_1) * 100) / desgloce.subtotal
                                                // La segunda formula que se me entrego
                                                desgloce.UB2 = 100 - ((desgloce.refacciones_2 * 100) / desgloce.total)



                                                this
                                                    .formasPAgo
                                                    .map(f => {
                                                        if (f.id != data['formaPago']) 
                                                            return
                                                        const operacion = desgloce.total * (1 + (f['interes'] / 100))
                                                        desgloce['meses'] = operacion;
                                                    })
                                                return desgloce
                                            }
                                            async realizarOperaciones(data : any, deQuien : string) {
                                                const desgloce = {
                                                    UB: 0,
                                                    mo: 0,
                                                    refacciones_1: 0,
                                                    refacciones_2: 0,
                                                    subtotal: 0,
                                                    iva: 0,
                                                    sobrescrito: 0,
                                                    sobrescrito_mo: 0,
                                                    sobrescrito_refaccion: 0,
                                                    sobrescrito_paquete: 0,
                                                    total: 0
                                                }
                                                let elementos = [];
                                                (!data[deQuien])
                                                    ? elementos = []
                                                    : elementos = data[deQuien]
                                                // console.log(data['id']);
                                                let mo = 0,
                                                    refacciones_1 = 0,
                                                    sobrescrito_mo = 0,
                                                    sobrescrito_refaccion = 0
                                                await elementos.forEach((ele, index) => {
                                                    if (ele['aprobado']) {
                                                        ele['index'] = index
                                                        if (ele['costo'] > 0) {
                                                            ele['flotilla'] = ele['cantidad'] * ele['costo']
                                                        } else {
                                                            ele['flotilla'] = ele['cantidad'] * ele['precio']
                                                        }
                                                        if (ele['tipo'] === 'MO') {
                                                            if (ele['costo'] > 0) {
                                                                sobrescrito_mo = sobrescrito_mo + (ele['costo'] * ele['cantidad'])
                                                            } else {
                                                                if (ele['precio'] > 0) 
                                                                    mo = mo + (ele['precio'] * ele['cantidad'])
                                                            }
                                                        } else if (ele['tipo'] === 'refaccion') {
                                                            if (ele['costo'] > 0) {
                                                                sobrescrito_refaccion = sobrescrito_refaccion + (
                                                                    ele['costo'] * ele['cantidad']
                                                                )
                                                            } else {
                                                                refacciones_1 = refacciones_1 + (ele['precio'] * ele['cantidad'])
                                                            }
                                                        } else if (ele['tipo'] === 'paquete') {
                                                            // if(!ele['elementos']) ele['elementos'] = []
                                                            if (ele['costo'] > 0) {
                                                                ele['flotilla'] = ele['costo']
                                                                desgloce.sobrescrito_paquete += ele['costo']
                                                            } else {
                                                                let subelementos = [];
                                                                (!ele['elementos'])
                                                                    ? subelementos = []
                                                                    : subelementos = ele['elementos']
                                                                subelementos.forEach(e => {
                                                                    if (e['tipo'] === 'MO') {
                                                                        if (e['costo'] > 0) {
                                                                            sobrescrito_mo = sobrescrito_mo + (e['costo'] * e['cantidad'])
                                                                        } else {
                                                                            if (e['precio'] > 0) 
                                                                                mo = mo + (e['precio'] * e['cantidad'])
                                                                        }
                                                                    } else if (e['tipo'] === 'refaccion') {
                                                                        if (e['costo'] > 0) {
                                                                            sobrescrito_refaccion = sobrescrito_refaccion + (e['costo'] * e['cantidad'])
                                                                        } else {
                                                                            refacciones_1 = refacciones_1 + (e['precio'] * e['cantidad'])
                                                                        }
                                                                    }
                                                                })

                                                            }
                                                        }
                                                    }
                                                })

                                                desgloce.mo = mo
                                                desgloce.sobrescrito_mo = sobrescrito_mo
                                                // desgloce.sobrescrito_paquete = sobrescrito_paquete
                                                desgloce.sobrescrito_refaccion = sobrescrito_refaccion
                                                desgloce.refacciones_1 = refacciones_1
                                                desgloce.refacciones_2 = refacciones_1 * (1 + (data['margen'] / 100))
                                                let descuento = 0
                                                if (data['descuento']) 
                                                    descuento = data['descuento']
                                                desgloce.subtotal = (
                                                    desgloce.mo + desgloce.refacciones_2 + desgloce.sobrescrito_mo + desgloce.sobrescrito_refaccion
                                                ) - descuento
                                                desgloce.total = desgloce.subtotal
                                                if (data['iva']) {
                                                    desgloce.iva = desgloce.subtotal * .16
                                                    desgloce.total = desgloce.subtotal + desgloce.iva
                                                }
                                                desgloce.UB = 100 - ((desgloce.refacciones_1 * 100) / desgloce.total)

                                                // 100 - () console.log(desgloce); console.log(this.formaPago);
                                                desgloce.sobrescrito = desgloce.sobrescrito_mo + desgloce.sobrescrito_paquete +
                                                        desgloce
                                                    .sobrescrito_refaccion
                                                    this
                                                    .formasPAgo
                                                    .map(f => {
                                                        if (f.id != data['formaPago']) 
                                                            return
                                                        const operacion = desgloce.total * (1 + (f['interes'] / 100))
                                                        desgloce['meses'] = operacion;
                                                        // console.log(f); (f['numero']>0) ? this.meses = f['numero'] : this.meses = 0
                                                    })

                                                return desgloce
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
                                                                // timerProgressBar: true,
                                                                // didOpen: (toast) => {
                                                                //   toast.addEventListener('mouseenter', Swal.stopTimer)
                                                                //   toast.addEventListener('mouseleave', Swal.resumeTimer)
                                                                // }
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
        
        const  { elementos, margen_get, iva, formaPago, descuento } = data
        
        const margen = 1 + (margen_get / 100)
        
        const reporte = {
          iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
          subtotal:0, total:0, ub:0, meses:0, descuento:0,sobrescrito:0
        }
        elementos.map((e,index)=>{
          e['index'] = index
          const pre = e.costo >0 ? e.costo : e.precio;
          const operacion =  e.tipo === "refaccion" ? e.cantidad * pre : e.cantidad * pre;
          if (e.costo > 0) {
            if (e.tipo === 'refaccion') {
              reporte.sobrescrito_refaccion += operacion;
              e['total'] = operacion * margen
            } else if (e.tipo === "MO" || e.tipo ==='mo') {
              reporte.sobrescrito_mo += operacion;
            }else {
              reporte.sobrescrito_paquetes += operacion;
              const info = this.reportePaquete(e.elementos,margen)
              e['reporte_interno'] = info
              e['precio'] = info.total
              e['total'] = info.total
            }
          }else{
            if (e.tipo === 'refaccion') {
              reporte.refacciones_a += operacion;
              e['total'] = operacion * margen
            } else if (e.tipo === 'MO' || e.tipo ==='mo') {
              reporte.mo += operacion;
            }else {
                
                const info = this.reportePaquete(e.elementos,margen)
                e['reporte_interno'] = info;
                e['precio'] = info.total;
                e['total'] = info.total
                reporte.mo += info.mo;
                reporte.refacciones_a += info.refacciones;
                reporte.sobrescrito_mo += info.sobrescrito_mo;
                reporte.sobrescrito_refaccion += info.sobrescrito_refaccion;
              // console.log('costo normal',info);
            }
          }
        })
        
        reporte.refacciones_v = (reporte.refacciones_a * margen)
    
        const suma = reporte.mo + reporte.refacciones_v + reporte.sobrescrito_mo + reporte.sobrescrito_paquetes + reporte.sobrescrito_refaccion
        reporte.sobrescrito = reporte.sobrescrito_mo + reporte.sobrescrito_paquetes + reporte.sobrescrito_refaccion
        reporte.subtotal = suma;
    
        (iva) ? reporte.total = suma * 1.16 : reporte.total = suma;
    
        if (iva) reporte.iva = suma * .16 ;
        
        reporte.ub = (reporte.total - reporte.refacciones_v)*100/reporte.total
    
        const enCaso_meses = this.formasPAgo.find(f=>Number(f['id']) === Number(formaPago))
        // console.log(enCaso_meses);
        if (Number(enCaso_meses['id']) === 1) {
          reporte.descuento = descuento
          reporte.total -= reporte.descuento
        }else{
          reporte.descuento = 0
          const operacion = reporte.total * (1 + (enCaso_meses['interes'] / 100))
          reporte.meses = operacion;
        }
        return {elementos, reporte}
    }
    
    reportePaquete(elementos:any,margen:number){
        const margen_get = 1 + (margen/100)
        if(!elementos) elementos = []
        const reporte_interno = { mo: 0, refacciones: 0, refacciones_v:0, sobrescrito_mo: 0, sobrescrito_refaccion: 0 ,ub:0};
        elementos.forEach((e_interno, index) => {
            e_interno['index'] = index
          const pre_interno = e_interno.costo > 0 ? e_interno.costo : e_interno.precio;
          const operacion_interno = e_interno.tipo === 'refaccion' ? e_interno.cantidad * pre_interno : e_interno.cantidad * pre_interno;
          if (e_interno.costo > 0) {
            (e_interno.tipo === 'refaccion') ? reporte_interno.sobrescrito_refaccion += operacion_interno : reporte_interno.sobrescrito_mo += operacion_interno;
            (e_interno.tipo === 'refaccion') ? e_interno['total'] = operacion_interno * margen_get : e_interno['total'] = operacion_interno
        }else{
            (e_interno.tipo === 'refaccion') ? reporte_interno.refacciones += operacion_interno : reporte_interno.mo += operacion_interno;
            (e_interno.tipo === 'refaccion') ? e_interno['total'] = operacion_interno * margen_get : e_interno['total'] = operacion_interno
            }
        })
        reporte_interno.refacciones_v = reporte_interno.refacciones * margen_get
        const suma = reporte_interno.mo + (reporte_interno.refacciones_v) + reporte_interno.sobrescrito_mo + reporte_interno.sobrescrito_refaccion
        // reporte_interno.ub = (suma - reporte_interno.refacciones)*100 / suma
        reporte_interno.ub = 100 - ((reporte_interno.refacciones_v * 100) / suma )

        return  {...reporte_interno, total: suma, margen_get}
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
        const answer = {correos:[]}
        answer.correos.push(sucursal.correo)
        if (cliente.correo) answer.correos.push(cliente.correo) 
        if (cliente.correo_sec) answer.correos.push(cliente.correo_sec) 

        return answer.correos
    }

 }
