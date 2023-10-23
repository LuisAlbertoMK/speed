/*

  private router: Router
  this.router.navigate([`/${this.enrutamiento.anterior}`], { 
    queryParams: 
    { cliente: this.enrutamiento.cliente, anterior:'clientes' } 
  });


private rutaActiva: ActivatedRoute
enrutamiento = {vehiculo:'', cliente:'', anterior:''}
    this.rutaActiva.queryParams.subscribe(params => {
      const { vehiculo, cliente, anterior } = params
      if(vehiculo && cliente){
        this.acciones(vehiculo, cliente)
        this.enrutamiento.vehiculo = vehiculo
        this.enrutamiento.cliente = cliente
      }
      this.enrutamiento.anterior = anterior
      // console.log(`${anterior}/clientes/${cliente}`);

      // ...
    });

    const control = this.citaForm.get('dia').disabled;

onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"

   miniColumnas:number = 100
   

[ngStyle]="{'min-width':(miniColumnas)*1+'px'}"

onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
onkeypress="soloNumeros(event)"
onkeypress="validarLetras(event)"

modal-dialog modal-fullscreen modal-fullscreen-sm-down modal-fullscreen-md-down modal-fullscreen-lg-down modal-fullscreen-xl-down modal-fullscreen-xxl-down modal-dialog-scrollable
col-lg-12 col-md-12 col-sm-12 col-12

.col-lg-12.col-md-12.col-sm-12.col-12

const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.dispatchEvent(new Event('click'));
        }

        //promesas multiples
        const promesasConsultas = arreglo_fechas_busca.map(async (f_search) => {
          const gastos_hoy_array: any[] = await this._reporte_gastos.gastos_hoy({ ruta: f_search});
          return gastos_hoy_array;
        });
        const promesas = await Promise.all(promesasConsultas);


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());
          
const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let vehiculos= this._publicos.crearArreglo2(snapshot.val())
      } else {
        console.log("No data available");
      }
    }, {
        onlyOnce: true
      })

      this._publicos.recuperaDatos()
	
      <ng-container *ngIf="faltante_s">
        <div class="row mt-2">
          <div class="col-lg-12 col-md-12 col-sm-12 col-12 alert alert-info text-center">
            Información faltante: <strong class="text-danger"> {{ faltante_s }}</strong>
          </div>
        </div>
      </ng-container>


get(child(dbRef, `users/${userId}`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});


<div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Informacion  O.S {{ servicio_editar.no_os}}</h1>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" id="cerrar-modal">
          <i class="fas fa-times"></i>
        </button>
      </div>
	//generar nueva key y poder utilizarla para almacenar informacion
 	const newPostKey = push(child(ref(db), 'posts')).key


const updates = {};
updates[``] = postData;
update(ref(db), updates).then(()=>{
  console.log('finalizo');
})
.catch(err=>{
  console.log(err);
})

  private _security:EncriptadoService,
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])


{  text: `aqui`,bold: true, alignment: 'center', style:'sucursal'},

let timerInterval
clearInterval(timerInterval)
       

asiganar objecto sin relacion
JSON.parse(JSON.stringify(data));


if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {}

       getUserMedia({
  audio: true,
  video: { facingMode: "user" }
})

getUserMedia({
  audio: true,
  video: {
    facingMode: { exact: "environment" }
  }
})

    this.form_cliente.controls['nombre'].clearValidators()
    
    
    this.form_cliente.controls['nombre'].addValidators([
      Validators.required
    ])

    this.form_cliente.controls['nombre'].updateValueAndValidity()


    console.time('Execution Time');
    console.timeEnd('Execution Time');

<div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="form-group">
                  
                </div>
              </div>


  [ngClass]="{'tipo-mo': row.tipo === mo,'tipo-refaccion': row.tipo === refaccion,'tipo-paquete': row.tipo === paquete}"


  realizaOperaciones(){
    const { elementos, margen, iva, descuento, formaPago} = this.infoCotizacion
    const reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})

    this.infoCotizacion.reporte = reporte
    this.infoCotizacion.elementos = elementos
    this.dataSource.data = elementos
    this.newPagination()
  }

  <ng-container *ngIf="_rol !== 'cliente'; else readonlyContent">
    
  </ng-container>
  <ng-template #readonlyContent>
    
  </ng-template>

        */