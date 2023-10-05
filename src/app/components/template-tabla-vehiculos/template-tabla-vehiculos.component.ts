import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CamposSystemService } from 'src/app/services/campos-system.service';


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

@Component({
  selector: 'app-template-tabla-vehiculos',
  templateUrl: './template-tabla-vehiculos.component.html',
  styleUrls: ['./template-tabla-vehiculos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TemplateTablaVehiculosComponent implements OnInit, OnChanges {

  @Input() vehiculos_arr:any[] = []
  @Input() show_cliente:boolean = false
  

  constructor(private router: Router, private _campos: CamposSystemService, private _security:EncriptadoService,
    private _publicos:ServiciosPublicosService) { }


  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
  vehiculos = ['placas','marca','modelo','anio','categoria']; //vehiculos
  columnsToDisplayWithExpand = [...this.vehiculos, 'opciones','expand']; //vehiculos
  expandedElement: any | null; //vehiculos
  @ViewChild('vehiculos') sort: MatSort //vehiculos
  @ViewChild('vehiculosPaginator') paginator: MatPaginator //vehiculos
  
  miniColumnas:number = 100
  rol_:string

  ngOnInit(): void {
    const { rol } = this._security.usuarioRol()
    this.rol_ = rol
    // console.log(rol);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehiculos_arr']) {
      const nuevoValor = changes['vehiculos_arr'].currentValue;
      const valorAnterior = changes['vehiculos_arr'].previousValue;
      // console.log({nuevoValor, valorAnterior});
        this.dataSource.data = this.vehiculos_arr
        this.newPagination()
    }
  }
  irPagina(pagina, data){

    const anterior = this._publicos.extraerParteDeURL()
    
    const {id: id_vehiculo} = this._publicos.crear_new_object(data)
    if (id_vehiculo) {
      const queryParams = {
        vehiculo: id_vehiculo,
        anterior
      }
      this.router.navigate([`/${pagina}`], { 
        queryParams
      });
    }
  }

  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
