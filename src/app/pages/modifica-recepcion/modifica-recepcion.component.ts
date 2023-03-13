import {AfterViewInit, Component, ViewChild,OnInit} from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {map, startWith} from 'rxjs/operators';


import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


import Swal from 'sweetalert2';


import { getDatabase, onValue, ref, set, get, child, push,update  } from 'firebase/database';
import { Observable } from 'rxjs';
import { EmailsService } from 'src/app/services/emails.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { UsuariosService } from '../../services/usuarios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-modifica-recepcion',
  templateUrl: './modifica-recepcion.component.html',
  styleUrls: ['./modifica-recepcion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ModificaRecepcionComponent implements OnInit {

  miniColumnas:number = 100
  ROL:string = '';SUCURSAL:string=''; 
  
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','nombre','cantidad','costo','precio','total']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos

  dataRecepcion={
    data:{
      sucursal:'',
      cliente:'',
      vehiculo:''
    },
  servicios:[],cliente:[],vehiculo:[],sucursal:[],detalles:[],ckeckList:[],general:[],desgloce:{}}

  cliente:boolean= false; vehiculo:boolean = false; IVA:boolean = true

  camposCliente=['nombre','correo','correo_sec','telefono_fijo','telefono_movil','tipo','empresa']
  camposVehiculo=['placas','marca','modelo','anio','categoria','cilindros','engomado','color','transmision','no_motor','vinChasis','marcaMotor']
  
  showFormElemento:boolean = false; showPaquetes:boolean = false; paquetesListos:boolean = false
  modeloFiltro:boolean = true

  paquetes:any[]=[]; refaccionesMarcas:any[]=[]; refacciones:any[]=[]; MO:any[]=[]

  marcaSelect:string = null
  guardarEnCatalogo:boolean = true;
  formElemento: FormGroup;

  
  camposRecMO:any =['id','precio','nombre','costo','tipo','descripcion','status','cantidad']
  camposRecRefaccion:any =[...this.camposRecMO,'marca','modelo']

  dataSourcePaquetes = new MatTableDataSource(); //paquetes
  paquetesColumns = ['nombre','precio','normal','flotilla']; //paquetes
  columnsToDisplayWithExpandpaquetes= [...this.paquetesColumns, 'opciones', 'expand']; //paquetes

  seleccionarTodo:boolean =true;
  margen:number = 25; elementosPaquete:any[]=[]
  
  myControl = new FormControl(''); //control de elementos para agregar a recepcion
  filteredOptions: Observable<string[]>; //control de elementos para agregar a recepcion


  id_recepcion = null
  camposDesgloce = [
    {nombre:'subtotal',valor:'subtotal'}, {nombre:'IVA',valor:'iva'},{nombre:'total',valor:'total'},
    {nombre:'costo de refacción',valor:'refacciones_1'},{nombre:'precio de venta refacción',valor:'refacciones_2'},
    {nombre:'MO',valor:'mo'},
    // {nombre:'sobrescrito mo',valor:'sobrescrito_mo'},{nombre:'sobrescrito R',valor:'sobrescrito_refaccion'},
    {nombre:'Sobrescrito',valor:'sobrescrito'},
    {nombre: 'U.B',valor:'UB'},
  ]
  listaTecnicos = []
  constructor(private router: Router, private rutaActiva: ActivatedRoute,private fb: FormBuilder,private _email:EmailsService,
    private _sucursales: SucursalesService, private _servicios:ServiciosService, private _publicos:ServiciosPublicosService,
    private _security:EncriptadoService,private _catalogos:CatalogosService,private _usuarios: UsuariosService) { }

  ngOnInit(): void {
    this.listadoTecnicos()
    this.listarPaquetes()
    this.listarRefacciones()
    this.listarMO()
    this.crearFormElemento()
    this.rol()
    this.autocompletar()
  }
  listadoTecnicos(){
    this._usuarios.listatecnicos().then(({contenido,data})=>{
      if(contenido){
        const tecnicos = data
        if (this.SUCURSAL!=='Todas') {
          const filtro = tecnicos.filter(o=>o.sucursal=== this.SUCURSAL)
          this.listaTecnicos = filtro
        }else{
          this.listaTecnicos = tecnicos
        }
      }
      
    })
  }
  listarPaquetes(){
   
    const starCountRef = ref(db, `paquetes`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        // this.paquetesListos = false
        const paquetes:any[] = await this._catalogos.listaPaquetes()
        for (let index = 0; index < paquetes.length; index++) {
          const element = paquetes[index];
          if (element.elementos) {
            const elementos:any[] = element.elementos
            for (let index = 0; index < elementos.length; index++) {
              const ele = elementos[index];
              let ruta = '';
              if (ele.catalogo) {
                (ele.tipo === 'MO') ? ruta= `manos_obra/${ele.IDreferencia}`:ruta=`refacciones/${ele.IDreferencia}`
              const infoelemento = await this._catalogos.infoElemento(ruta)
              const camposElemento = ['nombre','precio','descripcion']
              for (let indcam = 0; indcam < camposElemento.length; indcam++) {
                const campEle = camposElemento[indcam];
                elementos[index][campEle] = infoelemento[campEle]
              }
              }
            };
            const info = await this._publicos.costodePaquete(element.elementos,this.margen);
            const camposPaquete = ['totalMO','UB','refacciones1','refacciones2','flotilla','precio']
            for (let indcampos = 0; indcampos < camposPaquete.length; indcampos++) {
              const element = camposPaquete[indcampos];
              paquetes[index][element] = info[element]
            }
            paquetes[index].elementos = element.elementos
          }
          }
          if (paquetes.length) {
            const filter = paquetes.filter(o=>o.elementos)
            this.paquetes = paquetes
            this.paquetesListos = false
          }else{
            this.paquetesListos = true
          }
      }
    })
  }
  listarRefacciones(){
    const starCountRef = ref(db, `refacciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._catalogos.listaRefacciones().then((refacciones:[])=>{
          this.refacciones = refacciones          
        })     
      }
    })
  }
  listarMO(){
    const starCountRef = ref(db, `manos_obra`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._catalogos.listaMO().then((MO:[])=>{
          this.MO = MO
        })     
      }
    })
  }
  crearFormElemento(){
    this.formElemento = this.fb.group({
      paquete:['',[]],
      id:['',[]],
      nombre:['',[Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
      cantidad:['1',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      precio:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      costo:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(0)]],
      marca:['',[]],
      status:['',[]],
      tipo:['refaccion',[Validators.required]],
      descripcion:['',[]]
    })
  }
  
  rol(){
    this.id_recepcion = this.rutaActiva.snapshot.params['idRecepcion']
    
    
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    if(this.SUCURSAL !== 'Todas'){
      this._sucursales.inforSucursalUnica(this.SUCURSAL).then((ans:any)=>{
        const infoSucursal = {...ans,id:this.SUCURSAL}
        this.dataRecepcion.sucursal = infoSucursal
        this.dataRecepcion.data.sucursal  = this.SUCURSAL
      }) 
    }
    this.obtenerInformacionRecepcion()
    }

    
    
  }
  obtenerInformacionRecepcion(){
    // modificaRecepcion/:rutaAnterior/:idRecepcion
    const ID = this.rutaActiva.snapshot.params['idRecepcion']
    const starCountRef = ref(db, `recepciones/${ID}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._servicios.getRecepcionUnica(ID).then(async ({informacion,data})=>{
          if (informacion) {
            await this._sucursales.inforSucursalUnica(data['sucursal']).then((ans:any)=>{
              const infoSucursal = {...ans,id:data['sucursal']}
              this.dataRecepcion.sucursal = infoSucursal
              this.dataRecepcion.data.sucursal  = this.SUCURSAL
            })
            this.dataRecepcion.cliente = data['infoCliente']        
            this.dataRecepcion.data['cliente'] = data['cliente']
            this.dataRecepcion.data['vehiculo'] = data['vehiculo']
            this.dataRecepcion.vehiculo = data['infoVehiculo']
            this.dataRecepcion['no_os'] = data['no_os'];
            if(data['tecnico']) this.dataRecepcion['tecnico'] = data['tecnico']  
            // this.dataRecepcion.servicios = data['servicios']
            this.dataRecepcion['iva'] = data['iva']
            this.dataRecepcion['margen'] = data['margen']
                       
            const elementos  = data['servicios']
            elementos.map(ele=>{
              // console.log(ele);
              if (ele['costo']>0) {
                ele['flotilla'] =  ele['costo']
                ele['costo'] =  ele['costo']
              }else{
                if (ele['tipo'] === 'paquete') {
                  const desgloce = this._publicos.costodePaquete(ele['elementos'], data['margen'])
                  ele['flotilla'] =  desgloce.totalPaquete
                  ele['precio'] =  desgloce.totalPaquete
                  ele['desgloce'] =  desgloce
                }else{
                  // console.log(ele['precio'] * ele['cantidad']);
                  ele['flotilla'] =  ele['precio'] * ele['cantidad']
                }
              }
            })
            this.dataRecepcion['servicios'] = elementos            
              this.verificaInformacion()             
            // },200)
          }
        })
      }
    })
    
  }
  cambiarTecnico(tecnico:string){
    const updates = {}
    updates[`recepciones/${this.id_recepcion}/tecnico`] = tecnico
    update(ref(db), updates).then(()=>{
      this._publicos.mensajeCorrecto('Tecnico cambio')
    })
  }
  verificaInformacion(){
    this.cliente = false, this.vehiculo = false;
    (this.dataRecepcion.data['cliente'])? this.cliente=true:'';
    (this.dataRecepcion.data['vehiculo'])? this.vehiculo=true:'';
    if (this.cliente && this.vehiculo) {
      this.realizarOperaciones()
    }else{
      this._publicos.mensajeIncorrecto('no hay informacion relacionada')
    }
  }
  cambiarIva(iva:any){
    const updates =  {}
    updates[`recepciones/${this.id_recepcion}/iva`] = iva._checked
    update(ref(db), updates)
  }
  realizarOperaciones(){
    this.dataSource.data = this.dataRecepcion.servicios
    this.newPagination('elementos')
    setTimeout(() => {
      this._publicos.realizarOperaciones(this.dataRecepcion,'servicios').then((ans)=>{
        this.dataRecepcion.desgloce = ans
        // console.log(ans);
        
      })
    }, 200);
      
  }
  accionElemento(padre:any, index:number, status:string, showStatus:string, aprobado:boolean){
    // console.log(`accion-> ${status} showStatus-> ${showStatus} aprobado-> ${aprobado}` );
    // console.log(index);
    // console.log(padre);
    
    // this.dataRecepcion.servicios
    if (padre['id']) {
      const servicios = this.dataRecepcion['servicios'], id = this.rutaActiva.snapshot.params['idRecepcion'], updates = {};
      let correos = [], mostrar= [], desgloce = '';      
      (this.dataRecepcion.sucursal) ? correos.push(this.dataRecepcion.sucursal['correo']) : '';
      (this.dataRecepcion['cliente']['correo']) ? correos.push(this.dataRecepcion['cliente']['correo']) : '';
      (this.dataRecepcion['cliente']['correo_sec']) ? correos.push(this.dataRecepcion['cliente']['correo_sec']) : '';
      const infoEmail = {
        correos, cliente: this.dataRecepcion['cliente'], vehiculo: this.dataRecepcion['vehiculo'],
        subject:`El elemento ${servicios[index].nombre} cambio su estatus a ${showStatus}`,
        resumen: '', os: this.dataRecepcion['no_os'], desgloce: desgloce
      }      

      if(status==='eliminar'){
        Swal.fire({
          title: 'Desea restaurar los elementos a su estado original?',
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          // denyButtonText: `Don't save`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            servicios[index] = null
            const filtro = servicios.filter(option=>option !== null)
            updates[`recepciones/${id}/servicios`] = filtro;
            filtro.forEach((e)=>{
              let aprobado = 'si';
              (e['aprobado'])? '' : aprobado = 'no'
              mostrar.push(`${e['nombre']} (Aprobado: ${aprobado} )`)
            })
            update(ref(db), updates).then(()=>{
              infoEmail.resumen = mostrar.join(', ')
              setTimeout(() => {
                    this._publicos.realizarOperaciones(this.dataRecepcion,'servicios').then((ans)=>{
                      infoEmail.desgloce = `<br> Subtotal ${this._publicos.redondeado(ans['subtotal']) } <br> IVA ${this._publicos.redondeado(ans['iva']) } <br> Total ${this._publicos.redondeado(ans['total']) }`;
                      this._email.cambioInformacionOS(infoEmail).then((ansChange:any)=>{
                        this._publicos.mensajeCorrecto('Se notifico al cliente de los cambios de su O.S')
                      })
                    })
              }, 1000);
            });
          }
        })
      }else{
        updates[`recepciones/${id}/servicios/${index}/status`] = status;
        updates[`recepciones/${id}/servicios/${index}/showStatus`] = showStatus;
        updates[`recepciones/${id}/servicios/${index}/aprobado`] = aprobado;
        update(ref(db), updates).then(()=>{
          const inf = this.dataRecepcion
                this._publicos.realizarOperaciones(this.dataRecepcion,'servicios').then((ans)=>{
                  this.dataRecepcion['servicios'].forEach((e)=>{
                    let aprobado = 'si';
                    (e['aprobado'])? '' : aprobado = 'no'
                    mostrar.push(`${e['nombre']} (Aprobado: ${aprobado} )`)
                  })
                  infoEmail.resumen = mostrar.join(', ')
                  infoEmail.desgloce = `<br> Subtotal ${this._publicos.redondeado(ans['subtotal']) } <br> IVA ${this._publicos.redondeado(ans['iva']) } <br> Total ${this._publicos.redondeado(ans['total']) }`;
                  // console.log(infoEmail);
                  this._email.cambioInformacionOS(infoEmail).then((ansChange:any)=>{
                    this._publicos.mensajeCorrecto('Se notifico al cliente de los cambios de su O.S')
                  })
                })
        });
      }

    }
  }
  colocarInfoTabla(){
    const servicios = this.dataRecepcion.servicios;
    for (let index = 0; index < servicios.length; index++) {
      const element = servicios[index]
      servicios[index].index = index;
      const cantidad = element.cantidad;
      (element.costo>0)? servicios[index].total = cantidad * element.costo : servicios[index].total = cantidad * element.precio
    }
    this.dataSource.data = this.dataRecepcion.servicios
    this.newPagination('elementos')
  }

  newPagination(data:string){
    setTimeout(() => {
    if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }
    }, 500)
  }


  //funciones de paquetes y elementos 
  muestraPaquetes(valor:boolean){
    this.showPaquetes = valor
    this.showFormElemento = false
    this.filtrarPaquetes('modelo')
  }
  filtrarPaquetes(cuales:string){
    let muestraPaquetes = []
    switch (cuales) {
      case 'modelo':
        this.modeloFiltro = false
        muestraPaquetes = this.paquetes.filter(o=>o['modelo']=== this.dataRecepcion.vehiculo['modelo'])
        break;
      case 'todos':
        this.modeloFiltro = true
        muestraPaquetes = this.paquetes
        break;
      default:
        break;
    }
    this.colocaPaquetes(muestraPaquetes)
  }
  colocaPaquetes(arreglo:any[]){
    this.dataSourcePaquetes.data = arreglo
    this.newPagination('paquetes')
  }
  colocarpaquete(data:any){
    (!data.elementos) ?data['elementos'] = [] :''
    const dataNew = {...data, enCatalogo:true, cantidad:1,aprobado:true,tipo:'paquete'}
    this.dataRecepcion.servicios.push(dataNew)
    let correos = [];
          (this.dataRecepcion.sucursal['correo']) ? correos.push(this.dataRecepcion.sucursal['correo']) : '';
          (this.dataRecepcion.cliente['correo']) ? correos.push(this.dataRecepcion.cliente['correo']) : '';
          (this.dataRecepcion.cliente['correo_sec']) ? correos.push(this.dataRecepcion.cliente['correo_sec']) : '';
          // console.log(correos);
          let nuevos = []
          for (let indEle = 0; indEle < this.dataRecepcion.servicios.length; indEle++) {
            const element = this.dataRecepcion.servicios[indEle];
            let aprobado = 'Aprobado', sta='en espera';
            (element['aprobado'])? '': aprobado ='No aprobado';
            (element['terminado'])? sta ='terminado' :''
      
            nuevos.push(`<br> Elemento ${indEle + 1} (${aprobado}): <strong>${element['nombre']} </strong> con un costo de 
            ${this._publicos.redondeado(element['precio'])},
             status: ${sta}`)
          }
          const mostrar = nuevos.join(' ,')
          // let aprobado = 'fue probado', sta='en espera';
          //   (infoIndex['aprobado'])? '': aprobado ='no fue aprobado';
          //   (infoIndex['terminado'])? sta ='terminado' :''
          let obDesgloce = []
          if (this.dataRecepcion.general['iva']) {
            obDesgloce.push(`<br> Subtotal: ${this._publicos.redondeado(this.dataRecepcion.desgloce['subtotal'])}`)
            obDesgloce.push(`<br> IVA: ${this._publicos.redondeado(this.dataRecepcion.desgloce['IVA'])}`)
            obDesgloce.push(`<br> Total: ${this._publicos.redondeado(this.dataRecepcion.desgloce['total'])}`)
          }else{
            obDesgloce.push(`<br> Total: ${this._publicos.redondeado(this.dataRecepcion.desgloce['total'])}`)
          }
          const desglo = obDesgloce.join(', ')
  
          const infoEmail = {
            correos,
            cliente: this.dataRecepcion.cliente,
            vehiculo: this.dataRecepcion.vehiculo,
            // subject:`El elemento con nombre ${infoIndex['nombre']}, costo de ${this._publicos.redondeado(infoIndex['precio'],true)}, ${aprobado}, status: ${sta}`,
            subject: 'Cambio de informacion en recepción',
            resumen: mostrar,
            os:this.dataRecepcion.general['no_os'],
            desgloce: desglo
          }
          // console.log(infoEmail);
          
          this._email.cambioInformacionOS(infoEmail).then((ansChange:any)=>{
            this._publicos.mensajeCorrecto('Se notifico al cliente de los cambios de su O.S')
          })
    this.realizarOperaciones()
    
  }
  muestraFormElemento(valor:boolean){
    this.showFormElemento = valor
    this.showPaquetes = false
    
    this.myControl.setValue(null) // comentado para verificar su utilidad
  }
  restaurarOriginales(){
    // if (JSON.stringify(this.dataRecepcion.elementos) === JSON.stringify(this.dataRecepcion.elementos_originales)) {
    //   this._publicos.mensajeIncorrecto('No hay ningún cambio no es necesaria esta acción')
    // }else{
    //   Swal.fire({
    //   title: 'Desea cargar los elementos originales de la cotización?',
    //   html:`<strong class='text-danger'>ADVERTENCIA: No podrá revertir esta acción</strong>`,
    //   showCancelButton: true,
    //   confirmButtonText: 'CONFIRMAR',
    //   cancelButtonText: `CANCELAR`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     this.dataRecepcion.elementos = []
    //     this.dataRecepcion.elementos = [...this.dataRecepcion.elementos_originales]
    //     this.realizarOperaciones()
    //   }
    // })
    // }
    
  }
  colocarElemento(){
    if (this.formElemento.valid) {
      const infoRecibida = this.formElemento.value
      let camposRecupera = []
      let tipo = '';
      (infoRecibida.tipo)? tipo = infoRecibida.tipo : tipo = 'refaccion';
      (tipo === 'MO') ? camposRecupera = this.camposRecMO : camposRecupera = this.camposRecRefaccion
      const camposForm:any[] = Object.keys(this.formElemento.controls)      
      let saveInfo = {}
      for (let indecamp = 0; indecamp < camposRecupera.length; indecamp++) {
        const recupera = camposRecupera[indecamp];
        for (let indform = 0; indform < camposForm.length; indform++) {
          const formcampo = camposForm[indform];
          if (formcampo === recupera) {
            if (recupera === 'costo') {
              let costo = 0;
              (infoRecibida[recupera]<0 || infoRecibida[recupera] === undefined)? '': costo = infoRecibida[recupera]
              saveInfo[recupera] = costo
              this.formElemento.controls[recupera].setValue(costo)
            }else{
              saveInfo[formcampo] = infoRecibida[formcampo]
              this.formElemento.controls[recupera].setValue(infoRecibida[recupera])
            }
          }
        }
      }
      const newPostKey = push(child(ref(db), 'posts')).key
      if (infoRecibida['id'] && !this.guardarEnCatalogo) {
        //existe en catalogo no agregar
        // console.log(`ans 1 --> ID: ${infoRecibida['id']} - enCatalogo: ${!this.guardarEnCatalogo}`);
        saveInfo['enCatalogo'] = true
      }else if (!infoRecibida['id'] && !this.guardarEnCatalogo) {
        //No existen catalogo y no guaradar
        // console.log(`ans 2 --> ID: ${infoRecibida['id']} - enCatalogo: ${this.guardarEnCatalogo}`);
        saveInfo['id'] = newPostKey
        saveInfo['status'] = false
        saveInfo['enCatalogo'] = false
      }else if (!infoRecibida['id'] && this.guardarEnCatalogo) {
        //BO existe en catalogo y guardar
        // console.log(`ans 3 --> ID: ${infoRecibida['id']} - enCatalogo: ${this.guardarEnCatalogo}`);
        (saveInfo['marca']) ? '': saveInfo['marca'] = '';
        (saveInfo['descripcion']) ? '': saveInfo['descripcion'] = ''
        saveInfo['status'] = true
        saveInfo['id'] = newPostKey
        let ruta='';
        (saveInfo['tipo'] === 'MO')? ruta = `manos_obra/${saveInfo['id']}`: ruta = `refacciones/${saveInfo['id']}`
        const saveInfor1 = {...saveInfo}
        delete saveInfor1['costo']
        let saveInfoFinal = saveInfor1
        
        this._catalogos.saveElemento(ruta,saveInfoFinal).then((ans:any)=>{
            if (ans.resp) {
              saveInfo['enCatalogo'] = true
            }else{
              this._publicos.mensajeIncorrecto(ans.mensaje)
            }
          })
      }
      saveInfo['aprobado'] = true
      this.dataRecepcion.servicios.push(saveInfo)

      const correos = []

            correos.push(this.dataRecepcion.sucursal['correo']);
            correos.push(this.dataRecepcion.cliente['correo']);
            (this.dataRecepcion.cliente['correo_sec']) ? correos.push(this.dataRecepcion.cliente['correo']) : ''
            

            let mostrar = []
            for (let index = 0; index < this.dataRecepcion.servicios.length; index++) {
              const element = this.dataRecepcion.servicios[index];
              mostrar.push(element.nombre)
            }
            const arreglo_info = mostrar.join(', ')
            const infoEmail = {
              correos,
              cliente: this.dataRecepcion.cliente,
              vehiculo: this.dataRecepcion.vehiculo,
              // subject:`El elemento con nombre ${infoIndex['nombre']}, costo de ${this._publicos.redondeado(infoIndex['precio'],true)}, ${aprobado}, status: ${sta}`,
              resumen: arreglo_info,
              subject: `Cambio en informacion de recepción`,
              os:this.dataRecepcion.general['no_os'],
              desgloce: this.dataRecepcion.desgloce
            }
            // console.log(infoEmail);
            this._email.cambioInformacionOS(infoEmail).then((ansChange:any)=>{
              this._publicos.mensajeCorrecto('Se notifico al cliente de los cambios de su O.S')
            })

      this.myControl.setValue(null)
      this.realizarOperaciones()
    }
  }
  async verificaInforElemento(donde:string){
    const value = this.myControl.value
    if (donde === 'subelemento') {
      // this.editarPaquete = true
      // this.elementoAgregar = false
    }else{
      // this.editarPaquete = false
      // this.elementoAgregar = true
    }
    if (!value) { 
      this.infoElemento({nombre:value,'costo':0,precio:0,tipo:'refaccion'})
       }else{
      const proceder = await this._publicos.isObject(value)

      if(proceder){
        this.infoElemento(value)        
      }else{
        this.infoElemento({nombre:value,'costo':0,precio:0,tipo:'refaccion'})
        this.guardarEnCatalogo = true
      }
    }
  }
  infoElemento(info:any){
    const infoRecibida = {...info,cantidad:1}    
    let camposRecupera = [], tipo = '';
    (info.tipo)? tipo = info.tipo : tipo = 'refaccion';
    (info.marca)? this.marcaSelect = info.marca : this.marcaSelect = null;
    (tipo === 'MO') ? camposRecupera = this.camposRecMO : camposRecupera = this.camposRecRefaccion
    const camposForm:any[] = Object.keys(this.formElemento.controls)
    let saveInfo = {}    
    for (let indecamp = 0; indecamp < camposRecupera.length; indecamp++) {
      const recupera = camposRecupera[indecamp];
      for (let indform = 0; indform < camposForm.length; indform++) {
        const formcampo = camposForm[indform];
        if (formcampo === recupera) {
          if (recupera === 'costo') {
            let costo = 0;
            (infoRecibida[recupera]<0 || infoRecibida[recupera] === undefined)? '': costo = infoRecibida[recupera]
            saveInfo[recupera] = costo
            this.formElemento.controls[recupera].setValue(costo)
          }else{
            saveInfo[recupera] = infoRecibida[recupera]
            this.formElemento.controls[recupera].setValue(infoRecibida[recupera])
          }
        }
      }
    }
    this.guardarEnCatalogo = false
  }
  async mensajeMarca(){
    // this.mostrarPaquetes = false
    const { value: nombrePaquete } = await Swal.fire({
      title: 'Ingresa nombre de marca',
      input: 'text',
      // inputLabel: 'paquete',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value:any) => {
        const caracteresMinimos:number = String(value).length
        if (!value || caracteresMinimos<4) {
          return 'Necesitas escribir nombre de paquete con 3 caracteres minimos'
        }else{
          return null
        }
      }
    })
    if (nombrePaquete) {
      const newPostKey = push(child(ref(db), 'posts')).key
      set(ref(db, `marcas_refacciones/${newPostKey}`), {marca:nombrePaquete} )
          .then(() => {
            this.marcaSelect = newPostKey
          })
          .catch((error) => {
            // The write failed...
          });
      // this.colocarpaquete([{nombre:nombrePaquete,id:newPostKey}])
    }
  }
  seleccionarAlls(){
    for (let index = 0; index < this.dataRecepcion.servicios.length; index++) {
      this.dataRecepcion.servicios[index].aprobado = this.seleccionarTodo
    }
    this.realizarOperaciones()
  }
  cambiarMargen(margen:any){
    let marge = parseInt(margen)
    if (marge) {
      if(marge<25 || marge>100){
        marge = 25
        this.margen = 25
        this.dataRecepcion.data['margen'] = marge
        this.realizarOperaciones()
      }else{
        this.dataRecepcion.data['margen'] = marge
        this.realizarOperaciones()
      }
    }
    
  }
  accionesRealiza(index:number,val:any){
    this.dataRecepcion.servicios[index].aprobado = val._checked    
    this.realizarOperaciones()
  }
  eliminaElemento(index:number){
    
    
    Swal.fire({
      title: 'Desea eliminar elemento de recepción?',
      // showDenyButton: true,
      showCancelButton:   true,
      confirmButtonText: 'Eliminar',
      cancelButtonText:  'Cancelar'
      // denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.dataRecepcion.servicios[index] = null
        const nuevos  = this.dataRecepcion.servicios.filter(o=>o !== null)
        this.dataRecepcion.servicios = nuevos
        this.realizarOperaciones()
        this._publicos.mensajeCorrecto('elemento eliminado')
        set(ref(db, `recepciones/${this.id_recepcion}/servicios`), this.dataRecepcion.servicios )
          .then(() => {
            // Data saved successfully!
            
            const correos = []

            correos.push(this.dataRecepcion.sucursal['correo']);
            correos.push(this.dataRecepcion.cliente['correo']);
            (this.dataRecepcion.cliente['correo_sec']) ? correos.push(this.dataRecepcion.cliente['correo']) : ''
            

            let mostrar = []
            for (let index = 0; index < this.dataRecepcion.servicios.length; index++) {
              const element = this.dataRecepcion.servicios[index];
              mostrar.push(element.nombre)
            }
            const arreglo_info = mostrar.join(', ')
            const infoEmail = {
              correos,
              cliente: this.dataRecepcion.cliente,
              vehiculo: this.dataRecepcion.vehiculo,
              // subject:`El elemento con nombre ${infoIndex['nombre']}, costo de ${this._publicos.redondeado(infoIndex['precio'],true)}, ${aprobado}, status: ${sta}`,
              resumen: arreglo_info,
              subject: `Cambio en informacion de recepción`,
              os:this.dataRecepcion.general['no_os'],
              desgloce: this.dataRecepcion.desgloce
            }
            // console.log(infoEmail);
            this._email.cambioInformacionOS(infoEmail).then((ansChange:any)=>{
              this._publicos.mensajeCorrecto('Se notifico al cliente de los cambios de su O.S')
            })

            this.colocarInfoTabla()
          })
          .catch((error) => {
            // The write failed...
          });
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
    
  }
  muestraDetallespaquete(data:any){
    // console.log(data);
    this.elementosPaquete = data.elementos
    // console.log(this.elementosPaquete);
    
  }

  autocompletar(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','elementos')),
    );
    
  }
  private _filter(value: string,donde:string): string[] {
    const filterValue =String( value).toLowerCase();
    let data =[]
    switch (donde) {
      case 'elementos':
        const ambos = this.MO.concat(this.refacciones)
        const filtrados = ambos.filter(option => option['nombre'].toLowerCase().includes(filterValue));
        data = this._publicos.ordernarPorCampo(filtrados,'nombre')
        break;
      default:
        break;
    }
    return data
  }
  applyFilter(event: Event, table:string) {
    const filterValue = (event.target as HTMLInputElement).value;
      if (table==='elementos') {
          this.dataSource.filter = filterValue.trim().toLowerCase();
          if (this.dataSource.paginator){
            this.paginator.firstPage()
          }
      }else if (table==='paquetes'){
        this.dataSourcePaquetes.filter = filterValue.trim().toLowerCase();
        if (this.dataSourcePaquetes.paginator){
          this.dataSourcePaquetes.paginator.firstPage()
        }
      }
  }
  displayFn(elementos: any): string {
    return elementos && elementos.nombre ? elementos.nombre : '';
  }
}
