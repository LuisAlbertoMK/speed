import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar-home',
  templateUrl: './navbar-home.component.html',
  styleUrls: ['./navbar-home.component.css']
})
export class NavbarHomeComponent implements OnInit {
  sesion:boolean = false
  rutaAct:string = ''
  constructor(private rutaActiva: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.verificar()
    this.miRuta()
  }
  miRuta(){
    this.rutaAct = window.location.pathname
      setTimeout(() => {
          this.miRuta()
      }, 1000)
  }
  verificar(){
    this.sesion = Boolean(localStorage.getItem('sesion'))
    // console.log(this.sesion);
    
    if (!this.sesion) {
      // layout-top-nav
      let body = $(document.body)
      body.removeClass('hold-transition sidebar-mini layout-fixed sidebar-collapse mat-typography layout-navbar-fixed')
      body.addClass('hold-transition layout-top-nav layout-navbar-fixed')
      setTimeout(() => {
          this.verificar()
      }, 1000);
    }else{
      window.location.href = '/inicio'
    }
    
  }
}
