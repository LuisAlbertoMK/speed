import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { CatalogosComponent } from './pages/catalogos/catalogos.component';
import { CitasComponent } from './pages/citas/citas.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { SucursalesComponent } from './pages/sucursales/sucursales.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { RecordartoriosComponent } from './pages/recordartorios/recordartorios.component';
import { HomeComponent } from './pages/home/home.component';
import { AutomaticosComponent } from './pages/automaticos/automaticos.component';
import { RecepcionComponent } from './pages/recepcion/recepcion.component';
import { HistorialVehiculoComponent } from './pages/historial-vehiculo/historial-vehiculo.component';
import { HistorialClienteComponent } from './pages/historial-cliente/historial-cliente.component';
import { CotizacionNewComponent } from './pages/cotizacion-new/cotizacion-new.component';
import { ServiciosConfirmarComponent } from './pages/servicios-confirmar/servicios-confirmar.component';
import { ModificaRecepcionComponent } from './pages/modifica-recepcion/modifica-recepcion.component';
import { AuthPruebaComponent } from './components/auth-prueba/auth-prueba.component';
import { Loginv1Component } from './components/loginv1/loginv1.component';
import { ReporteGastosComponent } from './pages/reporte-gastos/reporte-gastos.component';
import { ListaProblemasComponent } from './pages/lista-problemas/lista-problemas.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
const APP_ROUTES: Routes = [
  { path: 'inicio', component: InicioComponent,  canActivate:[AuthGuard]},
  { path: 'catalogos', component: CatalogosComponent,  canActivate:[AuthGuard] },
  { path: 'citas', component: CitasComponent,  canActivate:[AuthGuard] },
  { path: 'clientes', component: ClientesComponent,  canActivate:[AuthGuard] },
  { path: 'configuracion', component: ConfiguracionComponent ,  canActivate:[AuthGuard]},
  { path: 'cotizacion', component: CotizacionComponent,  canActivate:[AuthGuard] },
  { path: 'sucursales', component: SucursalesComponent,  canActivate:[AuthGuard] },
  { path: 'servicios', component: ServiciosComponent,  canActivate:[AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent,  canActivate:[AuthGuard] },
  { path: 'recepcion/:recepcion/:pagina', component: RecepcionComponent ,  canActivate:[AuthGuard]},
  { path: 'recordatorios', component: RecordartoriosComponent ,  canActivate:[AuthGuard]},
  { path: 'historial-vehiculo', component: HistorialVehiculoComponent ,  canActivate:[AuthGuard]},
  { path: 'historial-cliente', component: HistorialClienteComponent ,  canActivate:[AuthGuard]},
  { path: 'cotizacionNueva', component: CotizacionNewComponent ,  canActivate:[AuthGuard]},
  { path: 'home', component: HomeComponent },
  { path: 'ServiciosConfirmar', component: ServiciosConfirmarComponent,canActivate:[AuthGuard] },
  { path: 'modificaRecepcion/:rutaAnterior/:idRecepcion', component: ModificaRecepcionComponent,canActivate:[AuthGuard] },
  { path: 'automaticos', component: AutomaticosComponent },
  { path: 'loginv1', component: Loginv1Component},
  { path: 'reporteGastos', component: ReporteGastosComponent},
  { path: 'pruebaAuth', component: AuthPruebaComponent},
  { path: 'registraProblemas', component: ListaProblemasComponent},
  { path: 'calendario', component: CalendarComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash:false});
