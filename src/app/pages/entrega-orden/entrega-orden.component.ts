import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfRecepcionService } from 'src/app/services/pdf-recepcion.service';
import SignaturePad from 'signature_pad';
import { ActivatedRoute } from '@angular/router';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());


@Component({
  selector: 'app-entrega-orden',
  templateUrl: './entrega-orden.component.html',
  styleUrls: ['./entrega-orden.component.css']
})
export class EntregaOrdenComponent implements OnInit,AfterViewInit {

  miniColumnas:number = 100

  dataRecepcion = {}
  metodospago = [
    {metodo:1, show:'Efectivo'},
    {metodo:2, show:'Cheque'},
    {metodo:3, show:'Tarjeta'},
    {metodo:4, show:'OpenPay'},
    {metodo:5, show:'Clip / mercadoPago'},
    {metodo:6, show:'Terminal BBVA'},
    {metodo:7, show:'Terminal BANAMEX'}
  ]
  FormComplementos: FormGroup

  idRecepcion:string 
  cliente:string
  DataFacturacion:any
  existe_data_facturacion: boolean = true
  @ViewChild('firmaDigital',{static:true}) signatureElement:any; SignaturePad:any;
  

  camposCliente=[
    {valor:'nombre',show:'Nombre'},
    {valor:'apellidos',show:'Apellidos'},
    {valor:'correo',show:'Correo'},
    {valor:'correo_sec',show:'Correo 2'},
    {valor:'no_cliente',show:'# Cliente'},
    {valor:'telefono_movil',show:'Tel. movil'},
    {valor:'telefono_fijo',show:'Tel. Fijo'},
    {valor:'tipo',show:'Tipo'}
  ]
  camposVehiculo=[
    {valor:'placas',show:'placas'},
    {valor:'marca',show:'marca'},
    {valor:'modelo',show:'modelo'},
    {valor:'anio',show:'anio'},
    {valor:'categoria',show:'categoria'},
    {valor:'cilindros',show:'cilindros'},
    {valor:'color',show:'color'},
    {valor:'engomado',show:'engomado'},
    {valor:'marcaMotor',show:'marcaMotor'},
    {valor:'no_motor',show:'no_motor'},
    {valor:'transmision',show:'transmision'},
    {valor:'vinChasis',show:'vinChasis'},
  ]
  camposTecnico=[
    {valor:'usuario',show:'Nombre'},
    {valor:'correo',show:'correo'},
  ]
  camposDesgloce = [
    {show:'MO',valor:'mo'},
    {show:'costo de refacción',valor:'refacciones_a'},
    {show:'precio de venta refacción',valor:'refacciones_v'},
    {show:'Sobrescrito',valor:'sobrescrito'},
    {show:'subtotal',valor:'subtotal'},
    {show:'IVA',valor:'iva'},
    {show:'total',valor:'total'},
    {show: 'U.B estimada',valor:'ub',symbolo:'%'},
  ]
  // const reporte = {mo:0, refacciones_1:0,refacciones_ad:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0,total:0}
  reporte = {
    iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
    subtotal:0, total:0, ub:0, meses:0, descuento:0,sobrescrito:0
  }

  faltantes:string

  
  constructor(private _pdf: PdfRecepcionService, private fb: FormBuilder, private rutaActiva: ActivatedRoute, private _publicos: ServiciosPublicosService) { }

  ngOnInit(): void {  
    // console.log(this.data);
    this.consultaInformacion()
    this.crearFormComplemento()
    
  }
  ngAfterViewInit() {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  consultaInformacion(){
    // console.log(this.rutaActiva.snapshot.params['idRecepcion']);
    this.idRecepcion = this.rutaActiva.snapshot.params['idRecepcion']
    if (this.idRecepcion) {
      //llamar la informacion de la recepcion
      const starCountRef = ref(db, `recepciones/${this.idRecepcion}`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            // en caso de que exista asigna a la variable para su uso
            const dataRecepcion = snapshot.val()
            ///asignar los valores para vericar su cambio con respecto a la recepcion
            const integra = {...dataRecepcion}
            //traer la informacion de la sucursal y tecnico
            //los llamados son direfentes debido a que toma cierto tiempo traer la informacion
              integra['infoSucursal'] = this.infoSucursal(dataRecepcion['sucursal']).dataSucursal
              this.infoTecnico(dataRecepcion['tecnico']).then(({okTecnico,dataTecnico})=>{
                integra['infoTecnico'] = dataTecnico
              })
            //vigilar la informacion del cliente debido a que esta informacion puede cambiar 
            //ya que se necesita la informacion de los vehiculos / datos de facturacion de cliente / y su informacion personal
            const startCliente = ref(db, `clientes/${dataRecepcion['cliente']}`)
            onValue(startCliente, (snapshotc) => {
              //mandar traer la informacion del cliente y posterior a ellos usar y verificar si exuste dicha informacion
              //verificar que se pueden eliminar ciertos llamados de informacion
              const dataCliente = snapshotc.val()
              
                this.cliente = dataRecepcion['cliente']
                integra['infoCliente'] = dataCliente
                integra['dataFacturacion'] = dataCliente['dataFacturacion']
                ///traer los datos de facturacion y puede ser que sean mas de uno por eso se convierte en arreglo
                //por default utilizamos el primero que encontramos
                if (dataCliente['dataFacturacion']) {
                  const facturacion = this._publicos.crearArreglo2(dataCliente['dataFacturacion'])
                  if (facturacion.length) {
                    integra['dataFacturacion'] =  facturacion[0]
                  }else{
                    integra['dataFacturacion'] =  null
                  }
                }
                //los vehiculos se convierte en areglo y buscamos el vehiculo correcto para mostrar esa informacion en el pdf
                if (dataCliente['vehiculos']) {
                  const vehiculos = this._publicos.crearArreglo2(dataCliente['vehiculos'])
                  integra['infoVehiculo'] =  vehiculos.find(v=>v['id'] === dataRecepcion['vehiculo'])
                }
                
               //asignamos la informacion y realizamos la validacion si cuenta con datos de facturacion (se requiera o no)
               // ya que en el pdf se revisa si es factura o remision 
               const aprobados = integra['servicios'].filter(a=>a['aprobado'])
               integra['servicios'] = aprobados
               this.dataRecepcion = integra
               this.validaTipo2()
               this.realizaOperaciones()
              })
          }
        })
    }
  }
  infoCliente(idCliente:string){
    const answer = {okCliente:true, dataCliente:{}}
    const starCountRef = ref(db, `clientes/${idCliente}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        snapshot.val()
        answer.dataCliente= snapshot.val()
      } else {
        answer.okCliente = false
      }
    })
    return answer
  }
  async infoTecnico(idTecnico:string){
    const answer = { okTecnico:true, dataTecnico:{} }

    await get(child(dbRef, `usuarios/${idTecnico}`)).then((snapshot) => {
      if (snapshot.exists()) {
        answer.dataTecnico = snapshot.val()
      } else {
       answer.okTecnico = false
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  infoSucursal(idSucursal:string){
    const answer = {okSucursal:true, dataSucursal:{}}
    const starCountRef = ref(db, `sucursales/${idSucursal}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        answer.dataSucursal = snapshot.val()
      } else {
        answer.okSucursal = false
      }
    },
    {
      onlyOnce: true
    })
    return answer
  }
  crearFormComplemento(){
    this.FormComplementos = this.fb.group({
      formaPago:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      kilometraje:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      facturaRemision:['remision', Validators.required],
      observaciones:['', []],
    })
  }
  validaCampo(campo: string){
    return this.FormComplementos.get(campo).invalid && this.FormComplementos.get(campo).touched
  }
  //validacion para verificar si existen datos de facturacion en caso de que sea requerida
  validaTipo2(){
    const valoresForm = this.FormComplementos.value
    this.existe_data_facturacion = true
    if (valoresForm.facturaRemision === 'factura') {
        if (!this.dataRecepcion['dataFacturacion']) {
          this.existe_data_facturacion = false
        }else{
          this.existe_data_facturacion = true
        }
    }else{
        this.existe_data_facturacion = true
    }
  }
  //validacion de remision o factura (si es factura verifica si existen datos para la factura)
  validarTipo(){
    const valoresForm = this.FormComplementos.value
    this.existe_data_facturacion = true
    ///primero conprobar la informacion del cliente para despues poder mostrar si existe informacion de 
    // facturacion y si no existe poder registrar esa informacion (datos de facturacion)
    if (valoresForm.facturaRemision === 'factura') {
      // if (this.dataRecepcion['cliente']) {
        if (!this.dataRecepcion['dataFacturacion']) {
          this.existe_data_facturacion = false
        }else{
          this.existe_data_facturacion = true
          this.generaPdfRemision()
        }
      // }
    }else{
        this.existe_data_facturacion = true
        this.generaPdfRemision()
    }
    

  }

  obtenerFirma(accion:string){
    if (accion ==='clean') {
      this.SignaturePad.clear()
    }else if (accion ==='limpiara') {
      // this.SignaturePad.clear()
    }
  }
  validacionesFormComplementos(){
    const answer = {ok: true, faltantes:[]}
    const campos = ['kilometraje','formaPago','facturaRemision']
    const valoresForm = this.FormComplementos.value
    campos.forEach(campo=>{
      if(!valoresForm[campo]){
        (campo ==='formaPago') ?  answer.faltantes.push('forma de pago') : answer.faltantes.push(campo)
      }
    })
    if(this.SignaturePad.isEmpty())answer.faltantes.push('firma cliente')
    if(answer.faltantes.length) answer.ok = false
    return answer
  }
  //verificamos si el formulario extra es valido para pdoer continuar con la generacion de pdf
  generaPdfRemision(){
    const {ok, faltantes} = this.validacionesFormComplementos()

    if (ok) {
      this.faltantes = null
      const valoresForm = this.FormComplementos.value
      this._publicos.swalPrevisualizar('se recomienda previsualizar antes de continuar')
        .then(({accion})=>{
          // console.log(accion);
          ///obtenemos la forma de pago de la recepcion
          const {metodo, show} = this.metodospago.find(f=>f['metodo']  === Number(valoresForm.formaPago))
          let observaciones = '  '
          //agregamos la  informacion para pdf
          if (valoresForm['observaciones']) observaciones = valoresForm['observaciones']
          let agrega = {
            kilometraje: valoresForm.kilometraje,
            facturaRemision: valoresForm.facturaRemision,
            formaPago: show,
            observaciones: observaciones,
            firma: this.SignaturePad.toDataURL()
          }
          const ifoPdf = {...agrega, ...this.dataRecepcion}
          console.log(ifoPdf);
          this._pdf.crearPdfRemision(ifoPdf)
          // en caso de ser correcto realizar 
          .then((pdf_ans)=>{
            const pdfDocGenerator = pdfMake.createPdf(pdf_ans);
            if (accion === 'previsualizar') {
              pdfDocGenerator.open();
            }else if(accion === 'continuar'){
              pdfDocGenerator.download(`${ifoPdf['no_os']}.pdf`);
            }
          })
          // en caso de de exista algun error al generar pddf
          .catch(err=>{
            this._publicos.mensajeSwalError('No se pudo geerar el pdf, intente de nuevo o verifique informacion')
          })
          
        })
    }else{
      this._publicos.swalToastError('falta informacion')
      this.faltantes = faltantes.join(', ')
    }

    // if (this.SignaturePad.isEmpty() || this.FormComplementos.invalid ) {
    //   this._publicos.swalToastError('LLenar toda la informacion')
    // }else{
    //   const valoresForm = this.FormComplementos.value
    //   if (this.FormComplementos.valid) {
    //     //mandamos adevertencia (mensaje)
        
        
        
        
  
        
    //     //hacemos la construccion del pdf
        
    //   }else{
    //     this._publicos.swalToastError('llenar datos necesarios')
    //   }
    // }
    
    
  }
  realizaOperaciones(){
    // setTimeout(()=>{

    
    // let filtro1 = []
    // if (this.dataRecepcion['servicios']) filtro1 = this.dataRecepcion['servicios']
    const aprobados = this.dataRecepcion['servicios'].filter(o=>o['aprobado'])
    
    const valoresForm = this.FormComplementos.value
    if(!this.dataRecepcion['descuento']) this.dataRecepcion['descuento'] = 0
    // if(!this.dataRecepcion['servicios']) this.dataRecepcion['servicios'] = []
    const factura= (valoresForm.facturaRemision === 'factura') ? true : false
    const envia_temp = {
      elementos: aprobados,
      margen_get: this.dataRecepcion['margen'],
      iva: factura,
      formaPago: this.dataRecepcion['formaPago'],
      descuento: this.dataRecepcion['descuento'],
    }
    const reporte = this._publicos.realizarOperaciones_2(envia_temp).reporte
    this.reporte= reporte
    // },100)
  }

  mirespuesta(answ:any){
    if (answ['ok']) {
      this.consultaInformacion()
    }
  }


}
