let probelmas_11042023 = 
[
    {problema:'Que se puedan agregar flotillas solo desde super usuario', status:'OK'},
    {problema:'Revisar filtro en cotizaciones (búsqueda)', status:'OK'},
    {problema:'Revisar ordenamiento en servicios', status:'OK'},
    {problema:'Colores en check listo de servicios confirmar colores rojo y verde ', status:'OK'},
    {problema:'Mostrar más información en cotizaciones como en servicios', status:'OK'},
    {problema:'Cambiar iconos de layerplus en servicios por una flecha down', status:'OK'},
    {problema:'Recuperar el cambio en expectativa y realidad en servicios', status:'OK'},
    
    {problema:'En kilometraje meter solo números aceptados', status:'PENDIENTE EN PLATAFORMA'},
    
    {problema:'previsualizar pdf en remision / factura', status:'PENDIENTE'},
    {problema:'Revisar las ub en servicios', status:'PENDIENTE'},
    {problema:'Mostrar las imágenes de detalles locales en servicios ', status:'PENDIENTE'},
    {problema:'Regresar exactamente a cómo estabas en la página anterior en servicios', status:'PENDIENTE'}
]
let probelmas_18042023=
[
    {problema:'en pdf de cotizacio no muestra los nombres de los elementos', status:'PENDIENTE'},
    {problema:'revisar la informacion de las sumas en entrega de recepcion', status:'PENDIENTE'},
]   

let problemas_24042023 = 
[
    {problema:'los clientes no s muestran en la tabla clientes', status:'PENDIENTE'},
    {problema:'Imagen personalizado no aparece', status:'OK'},
    {problema:'orden no carga o no se genera pdf', status:'OK'},
    {problema:'que se vena reflejado todos los reporte de gastos', status:'OK'},
    {problema:'tache para cerrar ventana de gastos', status:'OK'},
    {problema:'ser mas claro que es un gasto eliminado', status:'OK'},
    {problema:'indicar si es gasto o deposito', status:'OK'},
    {problema:'numero de orden en reporte de gasto', status:'OK'},
    {problema:'referencia en gasto de operacion', status:'OK'},
    {problema:'quitar referencia en pago', status:'OK'},

]
let problemas_02052023 = 
[
    {problema:'REVISAR PORQUE NO APARECEN LOS GASTOS DE O.S ', status:'OK'},
    {problema:'monto total de ventas, aparaezacan los totales de ordenes', status:'PENDIENTE'},
    {problema:'gastos totales de operacion', status:'PENDIENTE'},
    {problema:'monto total de iva', status:'PENDIENTE'},
    {problema:'(desgloce subtotal, iva, total)', status:'PENDIENTE'},
    {problema:'CUANTO QUEDa LIBRE DEdespues de refacciones sobre el subtotal de ventas', status:'PENDIENTE'},
    {problema:'cuanto queda libre despues de monto de operaciones y refacciones sobre el subtotal de ventas solo entregadas', status:'PENDIENTE'},
]

let problemas_03052023 = 
[
    {problema:'Determinar el rango de fechas por el cual se buscara', status:'PENDIENTE'},   
]

// git add .
// git commit -m "problemas_04052023-4"
// git push -u origin main

// monto total de iva : de que se obtiene esta parte?
// cuanto queda libre despues de refacciones sobre el total de ventas : aqui se requiere sobre los pagos y gastos o los servicios realizados en cada o.S?



//  primero filtrar las ordenes con status entregado
//  segundo filtrar las ordenes y filtrar gastos de operacion dentro de las fechas
//  tercero obtener el historial de pagos y gastos
//  cuarto realizar las operaciones para obtener el iva,total_g_operacione, subtotal, total, libre

//solo falta filtrar gastos de operacion por sucursalng