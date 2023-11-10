import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from '../../services/encriptado.service';

import { Location } from '@angular/common';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';


import { recepciones } from './ayuda';

import { VehiculosService } from 'src/app/services/vehiculos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import Swal from 'sweetalert2';
import { AutomaticosService } from 'src/app/services/automaticos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-automaticos',
  templateUrl: './automaticos.component.html',
  styleUrls: ['./automaticos.component.css']
})
export class AutomaticosComponent implements OnInit {
  
  constructor( private _publicos: ServiciosPublicosService, private _vehiculos: VehiculosService,
    private _security:EncriptadoService, public _router: Router, public _location: Location, private _automaticos: AutomaticosService
    ) {   }
  
  _sucursal:string
  _rol:string
  paquetes_arr:any[] = []

   campos = [
    {ruta_observacion: 'clientes', nombre:'claves_clientes'},
    {ruta_observacion: 'vehiculos', nombre:'claves_vehiculos'},
    {ruta_observacion: 'recepciones', nombre:'claves_recepciones'},
    // {ruta_observacion: 'cotizaciones', nombre:'claves_cotizaciones'},
    {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'},
    {ruta_observacion: 'historial_gastos_operacion', nombre:'claves_historial_gastos_operacion'},
    {ruta_observacion: 'historial_gastos_orden', nombre:'claves_historial_gastos_orden'},
    {ruta_observacion: 'historial_pagos_orden', nombre:'claves_historial_pagos_orden'},
    {ruta_observacion: 'sucursales', nombre:'claves_sucursales'},
    {ruta_observacion: 'metas_sucursales', nombre:'claves_metas_sucursales'},
    {ruta_observacion: 'moRefacciones', nombre:'claves_moRefacciones'},
    {ruta_observacion: 'citas', nombre:'claves_citas'},
  ]

  busqueda:any = {ruta_observacion: 'historial_gastos_diarios', nombre:'claves_historial_gastos_diarios'}
  contador_observados: number = 8
  contador_recorridos:number = 0
  informar_cliente_termino: boolean = false

  jsonData: any;

  vehiculos_arr = []
  clientes_arr = []

  ordenes_mes = []
  morefacciones_ordenes = []

  faltantes_vehiculos = {}
  faltantes_cliente = {}

  cuantosClientes: number = 0
  cuantosVehiculos: number = 0

  contador_nuevas_ordenes:number = 0

  save_ordenes = {}
  claves = []

  

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInput') fileInput2: ElementRef;
  ngOnInit(): void {
    this.rol()
  }

  
  
  rol(){
    const { rol, sucursal, usuario } = this._security.usuarioRol()
    this._sucursal = sucursal

    // this.procesarArregloConSweetAlert()

    // this.eliminaid()
    
  }
  // Importa SweetAlert2 si no lo has hecho ya



// Importa SweetAlert2 si no lo has hecho ya

procesarArregloConSweetAlert(){
  let existentes = [], faltantes = []
  let claves_Existentes = [], claves_faltantes = []
  
  let timerInterval
  const time = this.campos.length * 500
  Swal.fire({
    title: 'Espere ...',
    html: 'Revisando información <b></b>',
    timer: time,
    timerProgressBar: true,
    progressStepsDistance: 4,
    allowOutsideClick: false,
    didOpen: async () => {
      Swal.showLoading()
      for(let campo of this.campos){
        const {nombre, ruta_observacion} = campo
        // Simula una operación de procesamiento
        await new Promise(resolve => setTimeout(resolve, 450)); // Espera 1 segundo
        // console.log(campo);

        const b = Swal.getHtmlContainer().querySelector('b')
        b.textContent = ruta_observacion
        this._publicos.existe_variable_localhost(ruta_observacion) ? existentes.push(ruta_observacion) : faltantes.push(ruta_observacion)
        this._publicos.existe_variable_localhost(nombre) ? claves_Existentes.push(nombre) : claves_faltantes.push(nombre)
      }
      
    },
    willClose: () => {
      clearInterval(timerInterval)
      // return {claves:claves_faltantes, ruta_observacion: claves_faltantes}
      this.consulta_data(faltantes, claves_faltantes)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
    }
  })
}

consulta_data(faltantes:any[], claves:any[]){

  const nuevos = [...new Set([...faltantes, ...claves])]

  if (nuevos.length) {
    let timerInterval
    const time = nuevos.length * 1000
    Swal.fire({
      title: 'Consuta espere ...',
      html: 'Obteniendo <b></b>',
      timer: time,
      timerProgressBar: true,
      progressStepsDistance: 4,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading()
        for(let campo of nuevos){
          // Simula una operación de procesamiento
          console.log(campo);

          const b = Swal.getHtmlContainer().querySelector('b')
          b.textContent = campo

          const data = await this._automaticos.consulta_ruta(campo)

          this._security.guarda_informacion({nombre: campo, data})
          
        }
        
      },
      willClose: () => {
        clearInterval(timerInterval)
        // return {claves:claves_faltantes, ruta_observacion: claves_faltantes}
        // this.consulta_data(faltantes, claves_faltantes)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        
      }
    })
  }

}



  obtener_informacion_cache(cual){
    console.log(cual);
    const data_claves = this._publicos.revision_cache(cual)
    this._publicos.saber_pesos(data_claves)
    console.log(data_claves);
    const claves = this._publicos.revision_cache(`claves_${cual}`)
    console.log(claves);

    console.log(this._publicos.saber_pesos(data_claves));
    console.log(this._publicos.saber_pesos(claves));
    
    
  }
  eliminaid(){
    const nuevas ={}
    Object.entries(recepciones).forEach(([key, entrie])=>{
      const newdat = this._publicos.crear_new_object(entrie)
      delete newdat.id
      delete newdat.reporte
      nuevas[key] = newdat
    })
    console.log(nuevas);
    
  }
  handleFileInputLH(event) {

    const file = event.target.files[0];

    if (file) {
      // Verifica que el archivo sea de tipo JSON
      if (file.type === 'application/json') {
        const reader = new FileReader();

        // const crear = ['clientes','vehiculos','cotizaciones','recepciones','']

        reader.onload = (e: any) => {
          try {
            // Parsea el contenido del archivo JSON
            const jsonData = JSON.parse(e.target.result);



            Object.entries(jsonData).forEach(([key, entrie])=>{
              // guarda_informacion_sesion
              
              // console.log(entrie);
              
              
              // console.log(`claves_${key}`);
              
              const cuantos = key.split('_')
              // console.log(cuantos);
              
              if ( cuantos.length >= 3 || cuantos.length === 1 ) {
                // console.log('=====>',key);
                console.log(`====> ${key} <=====`);
                this._security.guarda_informacion({nombre: key, data: entrie})
                this._security.guarda_informacion({nombre: `claves_${key}`, data: Object.keys(entrie)})
              }

              // this._security.guarda_informacion({nombre: `claves_${key}`, data: entrie})
              
              
            })

            const nuevaBD = {}

            // // const {clientes} = this._publicos.crear_new_object(jsonData)

            // const arry = [
            //   'clientes',
            //   // 'vehiculos',
            //   'recepciones',
            //   'cotizaciones',
            //   'historial_gastos_diarios',
            //   'historial_gastos_operacion',
            //   'historial_gastos_orden',
            //   'historial_pagos_orden',
            //   'metas_sucursales',
            //   'citas',
            // ]

            // for(let campo of arry){
              
              
            //   const obtenido = this._publicos.filtrarObjetoPorPropiedad(jsonData[campo], 'sucursal', '-N2glF34lV3Gj0bQyEWK')
            //   nuevaBD[campo] = obtenido
            //   nuevaBD[`claves_${campo}`] = Object.keys(obtenido)

            //   console.log(`campo ==> ${campo} ==> dataCount ${this._publicos.crearArreglo2(obtenido).length}, claves ==> ${Object.keys(obtenido).length}`);
              
              
            // }



            
            

            // let nuevos_vehiculos = {}
            // Object.keys(nuevaBD['clientes']).forEach(cliente=>{

            //   const vehiculos_cliente = this._publicos.filtrarObjetoPorPropiedad(jsonData['vehiculos'],'cliente',cliente)

            //   nuevos_vehiculos = {...nuevos_vehiculos, ...vehiculos_cliente}
              
            // })
            // nuevaBD['vehiculos'] = nuevos_vehiculos
            // nuevaBD['claves_vehiculos'] = Object.keys(nuevos_vehiculos)

            
            console.log(nuevaBD);
            

            console.log(this._publicos.saber_pesos(nuevaBD));
            console.log(this._publicos.saber_pesos(jsonData));

            // console.log(jsonData);
            
          } catch (error) {
            console.error('Error al cargar el archivo JSON:', error);
          }
        };

        reader.readAsText(file);
      } else {
        console.error('Selecciona un archivo JSON válido.');
      }
    }
  }
  handleFileInput(files: FileList) {

    this.faltantes_vehiculos = {}
    this.faltantes_cliente = {}
    
    const file = files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        this.ordenes_mes = XLSX.utils.sheet_to_json(worksheet);
        // console.log(this.ordenes_mes);
      };

      reader.readAsArrayBuffer(file);
    }
  }
  handleFileInput2(files: FileList) {

    this.faltantes_vehiculos = {}
    this.faltantes_cliente = {}
    
    const file = files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        this.morefacciones_ordenes = XLSX.utils.sheet_to_json(worksheet);
        // console.log(this.morefacciones_ordenes);
        
        
      };

      reader.readAsArrayBuffer(file);
    }else{
      
    }
  }
 
  asigancion_clientes_ordenes(){
    this.faltantes_vehiculos = {}
    this.faltantes_cliente = {}
    
    this.cuantosClientes = 0
    this.cuantosVehiculos = 0
    
    this.contador_nuevas_ordenes = 0
    if (this.valida('ordenes_mes') && this.valida('morefacciones_ordenes')) {
      
    
    const clientes = this._publicos.revision_cache('clientes')
    const vehiculos = this._publicos.revision_cache('vehiculos')
    const servicios=[
      {valor:'1',nombre:'servicio'},
      {valor:'2',nombre:'garantia'},
      {valor:'3',nombre:'retorno'},
      {valor:'4',nombre:'venta'},
      {valor:'5',nombre:'preventivo'},
      {valor:'6',nombre:'correctivo'},
      {valor:'7',nombre:'rescate vial'}
    ]
    // console.log(clientes);
    const data_nueva_clientes = 
    Object.keys(clientes).map((cliente, index)=>{
      const newDta = this._publicos.crear_new_object(clientes[cliente])
        const fullname = this.return_fullname(newDta)
        const fullname_only_name = this.return_fullname2(newDta.nombre)
        return {...clientes[cliente], id: cliente, fullname, fullname_only_name}
    })
    console.log(data_nueva_clientes);
    const nuevo_v = this._publicos.crearArreglo2(vehiculos)
    // console.log('vehiculos');
    // console.log(nuevo_v);
    
    let nuevas_ordenes = {}
    
    this.ordenes_mes.forEach((orden, index)=>{
      // if (index <20) {
        const no_os = orden['Orden de Servicio']
        // console.log(no_os);
        // console.log(orden);
        const {Cliente, Placas, Status, Kilometraje, Pagado, Precio, Subtotal, Utilidad,Impuestos, Descontado } = orden
        const newDta = this._publicos.crear_new_object(orden)
        newDta.nombre = Cliente
        const fullname = this.return_fullname2(Cliente)

        const anio = parseInt(orden['Fecha.Año'])
        const mes = orden['Fecha.Mes']
        const dia = parseInt(orden['Fecha.Día'])
        const serv = parseInt(orden['TIPO DE SERVICIO'])
        let numero_mes 
        switch (mes) {
          case 'Ene':
            numero_mes = 0
            break;
          case 'Feb':
            numero_mes = 1
            break;
          case 'Mar':
            numero_mes = 2
            break;
          case 'Abr':
            numero_mes = 3
            break;
          case 'May':
            numero_mes = 4
            break;
          case 'Jun':
            numero_mes = 5
            break;
          case 'Jul':
            numero_mes = 6
            break;
          case 'Ago':
            numero_mes = 7
            break;
          case 'Sep':
            numero_mes = 8
            break;
          case 'Oct':
            numero_mes = 9
            break;
          case 'Nov':
            numero_mes = 10
            break;
          case 'Dic':
            numero_mes = 11
            break;

        }

        
        let data_cliente = data_nueva_clientes.find(cl=>cl.fullname === fullname)
        const data_vehiculo = nuevo_v.find(v=>this.sanitiza_placas(v.placas) === this.sanitiza_placas(Placas))
        const fecha_recibido = new Date(anio, numero_mes, dia,13,1,0).toString()
       
        
        const servicio_ = servicios.find(s=>s.valor === '1')
        const clave_orden = `Clave_orden_${index +1}`
        // console.log(orden);
        
       
        if (!data_cliente) {
          data_cliente = data_nueva_clientes.find(cl=>cl.fullname_only_name === fullname)
        }
        if (!data_cliente && no_os !== undefined && no_os && no_os !=='undefined') {
          // console.log(fullname);
          // console.log('sin data aun cliente');
          // console.log(orden);
          // console.log( nuevas_ordenes[clave_orden]);
          this.faltantes_cliente[no_os] = {newDta, Cliente}
        }
        if (!data_vehiculo) {
          console.log(this.sanitiza_placas(Placas));
          
          this.faltantes_vehiculos[no_os] = {newDta, placas: this.sanitiza_placas(Placas)}
        }
        // console.log(data_cliente);
        if (data_cliente && data_vehiculo) {
          const id_cliente = this._publicos.crear_new_object(data_cliente)
          const id_c = id_cliente.id = id_cliente.id
          const id_vehiculo = this._publicos.crear_new_object(data_vehiculo)
          const id_v = id_cliente.id = id_vehiculo.id
  
          // console.log(no_os);
          
          const elementos_orden = this.morefacciones_ordenes.filter(f=>{
            const orden_n = f['Orden de Servicio']
            return (orden_n === no_os) 
          })
          
          const dsfg = this.extra_informacion_elementos(elementos_orden)
          
          const elementos = this._publicos.crearArreglo(this.agrupar_por_paquete(dsfg))
          const iva = (Impuestos > 0) ? true: false
          const descuento = (Descontado > 0) ? Descontado: 0
          const reporte =  this._publicos.genera_reporte({elementos, margen:25, iva, descuento, formaPago:'1'})
          const reporte_ya_estaba = {
            pagado: Pagado,
            utilidad: Utilidad,
            precio: Precio, 
            subtotal: Subtotal,
            iva: Impuestos,
          }
          if (no_os !== undefined && no_os && no_os !=='undefined') {
            nuevas_ordenes[no_os] = 
            {
              id: no_os,
              elementos: elementos || [],
              reporte,
              sucursal: '-N2glF34lV3Gj0bQyEWK',
              data_cliente, data_vehiculo,no_os, cliente: id_c, vehiculo: id_v , iva,
              descuento,
              formaPago: '1',
              reporte_ya_estaba,
              fecha_recibido, kilometraje: Kilometraje,  
              status: Status.toLowerCase(), servicio: 1, placas: this.sanitiza_placas(Placas) 
            }
          }
        
        }
        

      // }
    })
    console.log(nuevas_ordenes);

    this.contador_nuevas_ordenes= this._publicos.crearArreglo(nuevas_ordenes).length
    // console.log(this.faltantes_cliente);
    this.cuantosClientes = this._publicos.crearArreglo(this.faltantes_cliente).length
    // console.log(this.faltantes_vehiculos);
    this.cuantosVehiculos = this._publicos.crearArreglo(this.faltantes_vehiculos).length


    // let contador = 65521
    let nuevos_registro = {}
    const updates = {}
    let claves_v_new = []
    
    Object.keys(this.faltantes_vehiculos).forEach(clav=>{
      const {newDta,   placas    } = this.faltantes_vehiculos[clav]

      const id_vehiculo = `id_vehiculo_${placas }`
      claves_v_new.push(id_vehiculo)
      console.log(newDta['Orden de Servicio']);
      
      
      const temp = {
        marca: newDta['Marca'],
        modelo: newDta['Modelo'],
        anio: newDta['Año'],
        placas,
        color:'gris'
      }
      temp['engomado'] = this._vehiculos.engomado(placas) 
      if (nuevas_ordenes[clav]) {
        console.log(clav);
        const obj= this._publicos.crear_new_object(nuevas_ordenes[clav])
        if (obj['data_cliente']) {
          // console.log(obj['data_cliente'].id);
          temp['cliente'] = obj['data_cliente'].id
        }
      }else{
        console.log('no hay cliente');
        
      }
      nuevos_registro[id_vehiculo] = temp
      updates[`vehiculos/${id_vehiculo}`] = temp
    })
    console.log(updates);
    // console.log(claves_v_new);

    const updates_ordenes = {}
    const campos = [
      'formaPago',
      'cliente',
      'descuento',
      'elementos',
      'fecha_recibido',
      'iva',
      'id',
      'kilometraje',
      'no_os',
      'servicio',
      'status',
      'sucursal',
      'vehiculo',
      'reporte_ya_estaba'
    ]
    const claves= []
    Object.keys(nuevas_ordenes).forEach(orden=>{
      claves.push(orden)
      if(orden && orden !== 'undefined') {
        updates_ordenes[`recepciones/${orden}`] = this._publicos.crear_new_object(this._publicos.nuevaRecuperacionData(nuevas_ordenes[orden], campos))
      }
    })

    
    this.save_ordenes = updates_ordenes
    this.claves = claves

    }else{
      this._publicos.swalToast('falta alguna informacion',0)
    }
     
  }
  limpiar(){
    this.faltantes_vehiculos = {}
    this.faltantes_cliente = {}
    
    this.cuantosClientes = 0
    this.cuantosVehiculos = 0
    
    this.contador_nuevas_ordenes = 0
    const input = this.fileInput
    input.nativeElement.value = null; // Restablece el valor del input a null
    const input2 = this.fileInput2
    input2.nativeElement.value = null; // Restablece el valor del input a null
  }
  registra_nuevas(){
    // this._publicos.mensaje_pregunta_2()
    // this.save_ordenes
    // this.claves
    Swal.fire({
      title: 'Registrar ordenes',
      html:`<strong class='text-danger'>Se recomienda revisar informacion antes de guardar</strong>`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'registra ordenes',
      denyButtonText: `Cancelar`,
      cancelButtonText:`Cancelar`,
      allowOutsideClick: false,
      cancelButtonColor: '#5a5952'
    }).then(async (result) => {
      // si se confirma previsualizacion genera pdf en nueva ventana del navegador
      if (result.isConfirmed) {
        const claves_encontradas = await this._automaticos.consulta_ruta('claves_recepciones')
        const valorNoDuplicado = await [...new Set([...claves_encontradas, ...this.claves])];
        // const updates = {};
        // updates['claves_clientes'] = valorNoDuplicado
        const aagrupa = {
          claves_recepciones: valorNoDuplicado,
          ...this.save_ordenes
        }
        console.log(aagrupa);
        update(ref(db), aagrupa).then(()=>{
          this._publicos.mensajeSwal('registro correcto',1)
          this.limpiar()
        })
        .catch(err=>{
          console.log(err);
        })
        
      } else if (result.isDenied) {

      }
    })
  }
  valida(cual){
    const data = (cual === 'ordenes_mes') ? this.ordenes_mes : this.morefacciones_ordenes
    return Object.keys(data).length
  }
 
  agrupar_por_paquete(data:any[]){
    let paquetes = {}
    const claves_paquete = data.map(p=>this.sanitiza_clave(p.paquete))
    // console.log(claves_paquete);
    const claves_unicas = [...new Set([...claves_paquete])]
    // console.log(claves_unicas);
    
    claves_unicas.forEach(clave=>{
      paquetes[clave] = {elementos:[], cantidad: 1,aprobado:true, status: true, tipo: 'paquete', costo:0}
    })
    
    data.forEach((el, index)=>{
      // sanitiza_clave
      const {tipo, paquete} = el
      const clave_paquete = this.sanitiza_clave(paquete)
      // console.log(clave_paquete);
      if (paquetes[clave_paquete]) {
        let nuevo_tipo = (tipo === 'Pieza') ? 'refaccion': 'mo'
        paquetes[clave_paquete].nombre = paquete
        const temp = {...el}
        delete temp.paquete
        paquetes[clave_paquete].elementos.push(
          {
            ...temp, aprobado: true, tipo: nuevo_tipo,
            precio: 1
          }
        )
      }
    })
    return paquetes
  }
  extra_informacion_elementos(arreglo:any[]){
    // Descripción, Clave Producto
    const data_nueva = []
    arreglo.forEach((elemento,)=>{
      const {Paquete, Tipo, Cantidad} = elemento
      let clave_producto = elemento['Clave Producto']
      const descr = elemento['Descripción']
      if (Tipo === 'Pieza') clave_producto = `-${this.sanitiza_clave(descr)}`
      data_nueva.push(
        {
          id: clave_producto,
          tipo: Tipo,
          nombre: descr,
          cantidad: Cantidad,
          paquete: Paquete
        }
      )
    })
    return data_nueva
  }
  sanitiza_placas(placas){
    // if (!`${placas}`.length)  return null 
    return `${placas}`
    .toUpperCase()
    .trim() //elimina los espacion exteriores
    .replace(/\s/g, "") // Eliminamos los espacios en blanco
    .replace(/\(/g, "") // Elimina todos los paréntesis abiertos
    .replace(/\)/g, "") // Elimina todos los paréntesis cerrados
    .replace(/-/g, ""); // Elimina todos los guiones
  }
  sanitiza_clave(placas){
    // if (!`${placas}`.length)  return null 
    return `${placas}`
    .toUpperCase()
    .trim() //elimina los espacion exteriores
    .normalize("NFD") // Normalizamos el texto en Unicode
    .replace(/[\u0300-\u036f]/g, "") // Eliminamos los caracteres diacríticos (acentos)
    .replace(/\s/g, "") // Eliminamos los espacios en blanco
    .replace(/\(/g, "") // Elimina todos los paréntesis abiertos
    .replace(/\)/g, "") // Elimina todos los paréntesis cerrados
    .replace(/-/g, "") // Elimina todos los guiones
    .replace(/#/g, ""); // Elimina todos los guiones
  }
  return_fullname(data){
    const {nombre, apellidos} = data
    const nuevos_apellidos = (!apellidos) ? nombre : apellidos
      return `${nombre}${nuevos_apellidos}`
        .toLowerCase() //convierte todo a minusculas
        .trim() //elimina los espacion exteriores
        .normalize("NFD") // Normalizamos el texto en Unicode
        .replace(/[\u0300-\u036f]/g, "") // Eliminamos los caracteres diacríticos (acentos)
        .replace(/\s/g, "") // Eliminamos los espacios en blanco
        .replace(/_/g, "") // Elimina todos los guiones
        .replace(/-/g, ""); // Elimina todos los guiones
  }
  return_fullname2(data){
      return `${data}`
        .toLowerCase() //convierte todo a minusculas
        .trim() //elimina los espacion exteriores
        .normalize("NFD") // Normalizamos el texto en Unicode
        .replace(/[\u0300-\u036f]/g, "") // Eliminamos los caracteres diacríticos (acentos)
        .replace(/\s/g, "") // Eliminamos los espacios en blanco
        .replace(/_/g, "") // Elimina todos los guiones
        .replace(/-/g, ""); // Elimina todos los guiones
  }


}
