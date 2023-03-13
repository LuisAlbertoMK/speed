import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { child, get, getDatabase, onValue, ref, set } from 'firebase/database';
import { UploadFirmaService } from 'src/app/services/upload-firma.service';
import Swal from 'sweetalert2';

const db = getDatabase()
const dbRef = ref(getDatabase())
@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {
  //array de imagenes partes de autos
  arrayimgAutos:any=[]
  ///asignacion de paramtros
  idRecepcion:string =''
  //verificar sin detalles
  detalles:boolean = false; SinDetalles:boolean = false
  constructor(private rutaActiva: ActivatedRoute, private _uploadfirma: UploadFirmaService, private router : Router) { }

  ngOnInit(): void {
    this.listadeDetalles()
    this.asignacionParametros()
    
  }
  asignacionParametros(){    
    this.idRecepcion = this.rutaActiva.snapshot.params['idRecepcion']
  }
  listadeDetsalles(){
    
    get(child(dbRef, `partesVehiculo`)).then((snapshot) => {
      if (snapshot.exists()) {
        
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  listadeDetalles(){
    const starCountRef = ref(db, `partesVehiculo`)
    onValue(starCountRef, (snapshot) => {
      let arraynew = this.crearArreglo2(snapshot.val())
        arraynew.forEach(parteA => {
          // console.log(parteA)
          let split = parteA.id.split('_')
          // console.log(split.join(' '));
          const temp = {
            ...parteA,
            mostrar: split.join(' ')
          }
          this.arrayimgAutos.push(temp)
        })      
    })
  }
  guardarSinDetalles(){
    let checado:boolean =  $('#SinDetalles').is(':checked')
    this.detalles = checado
  }
  guardarSNDetalles(){
    if (this.idRecepcion!=='') {
      Swal.fire({
        title: 'Esta seguro?',
        html: `Guardar sin rayaduras y detalles`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const temPData = {
            rayaduras: 'Sin ningun detalle o rayadura'
          }
          set(ref(db, `recepcion/${this.idRecepcion}/rayarDetalles`), true )
          set(ref(db, `rayadurasDetalles/${this.idRecepcion}`), temPData )
          this.router.navigateByUrl(`/FirmaConsentimiento/${this.idRecepcion}`)
        }
      })
    }
  }
  guardarRayarDetalles(){
    if (this.idRecepcion!=='') {
      Swal.fire({
        title: 'Esta seguro?',
        html: `Guardar rayaduras y detalles`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          
          for (let index = 0; index < this.arrayimgAutos.length; index++) {
            const element = this.arrayimgAutos[index].id;
            let checado:boolean =  $('#'+element).is(':checked')
            // console.log( this.arrayimgAutos[index].id + ' = ' +checado)
            const tempdata={
              id: element,
              status: checado
            }
            // arregloRayaduras.push(tempdata)
            set(ref(db, `rayadurasDetalles/${this.idRecepcion}/${element}`), checado )
          }
          set(ref(db, `recepcion/${this.idRecepcion}/rayarDetalles`), true )
          .then(() => {
            // Data saved successfully!
            
            Swal.fire('Exito!','Detalles de recepcion guardados correcatamentte','success')
            this.router.navigateByUrl(`/FirmaConsentimiento/${this.idRecepcion}`)
            this.arrayimgAutos.forEach(element => {
              $('#'+element.id).prop('checked',false)
            });
            
          })
          .catch((error) => {
            // The write failed...
          })
        }
      })
    }
  }



  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }
}
