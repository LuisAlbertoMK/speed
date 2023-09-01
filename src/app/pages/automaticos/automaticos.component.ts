import { Component, OnInit } from '@angular/core';

import { AutomaticosService } from '../../services/automaticos.service';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from '../../services/encriptado.service';

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { MO, refacciones } from './ayuda';
pdfMake.vfs = pdfFonts.pdfMake.vfs



import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { log } from 'console';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-automaticos',
  templateUrl: './automaticos.component.html',
  styleUrls: ['./automaticos.component.css']
})
export class AutomaticosComponent implements OnInit {
  
  constructor(private _automaticos: AutomaticosService, private _encript: EncriptadoService, private _publicos: ServiciosPublicosService,
    private _security:EncriptadoService, public _router: Router, public _location: Location,private _pdfRecepcion: PdfRecepcionService,
    private _sucursales: SucursalesService, private _clientes: ClientesService, private _vehiculos: VehiculosService, 
    private formBuilder: FormBuilder, private _servicios: ServiciosService
    ) {   }
  
    sucursales_array = [...this._sucursales.lista_en_duro_sucursales]
    clientes_arr = []
  _sucursal:string

  mensaje_actualizacion:boolean = true


  formulario_etiqueta: FormGroup

  anios = this._vehiculos.anios
  marcas_vehiculos = this._vehiculos.marcas_vehiculos
  marcas_vehiculos_id = []
  array_modelos = []
  faltante_s:string
  vehiculos_compatibles = [
    {
      "marca": "Chevrolet",
      "modelo": "Camaro ZL1",
      "anio_inicial": "1999",
      "anio_final": "1999"
    },
    {
      "marca": "Pontiac",
      "modelo": "Matiz",
      "anio_inicial": "1996",
      "anio_final": "2001"
    },
    {
      "marca": "Aston Martín",
      "modelo": "DBX",
      "anio_inicial": "1996",
      "anio_final": "1996"
    }
  ]

  ngOnInit(): void {
    this.rol()
    const n = this._publicos.crearArreglo2(this._vehiculos.marcas_vehiculos)
    this.marcas_vehiculos_id = n.map(c=>{
      return c.id
    })
  }
    rol(){
        const { rol, sucursal, usuario } = this._security.usuarioRol()
        this._sucursal = sucursal
    }
    realizaOperacionesClientes2(){
      const new_mo:any[] = Object.keys(MO).map((mo)=>{
        MO[mo].tipo = 'mo'
        return MO[mo]
      })
      console.log(new_mo);
      const new_refacciones:any[] = Object.keys(refacciones).map((refaccion)=>{
        refacciones[refaccion].tipo = 'refaccion'
        return refacciones[refaccion]
      })
      console.log(new_refacciones);
      const new_alls:any[] = [...new_mo, ...new_refacciones]

      console.log(new_alls);
    }
      realizaOperacionesClientes() {
        const processItems = (items, tipo) => {
          return Object.keys(items).map((item) => {
            items[item].tipo = tipo;
            return items[item];
          });
        };
      
        const new_mo = processItems(MO, 'mo');
        const new_refacciones = processItems(refacciones, 'refaccion');
      
        const new_alls = [...new_mo, ...new_refacciones];
        console.log(new_alls);

        const objeto = {};
        new_alls.forEach((element) => {
          const {id} = element
          const new_data  = JSON.parse(JSON.stringify(element));
          delete new_data.id
          new_data.compatibles = [
            {
              "marca": "Alfa Romeo",
              "modelo": "Stelvio",
              "anio_inicial": "1992",
              "anio_final": "1994"
            }
          ]
          objeto[id] = new_data
        });
        console.log(objeto);
        

      }
      
      
      
    
    data_compataible(event){
      console.log(event);
    }
}