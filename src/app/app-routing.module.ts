import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { CatalogoEditComponent } from './pages/catalogo-edit/catalogo-edit.component';
import { CatalogosComponent } from './pages/catalogos/catalogos.component';
import { CitasComponent } from './pages/citas/citas.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
import { FirmaComponent } from './pages/firma/firma.component';
import { GerenteComponent } from './pages/gerente/gerente.component';
import { InicioComponent } from './pages/inicio/inicio.component';
// import { NewcotizacionComponent } from './pages/newcotizacion/newcotizacion.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { SucursalesComponent } from './pages/sucursales/sucursales.component';
import { TecnicoayudanteComponent } from './pages/tecnicoayudante/tecnicoayudante.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { VehiculosComponent } from './pages/vehiculos/vehiculos.component';
import { FirmaConsentimientoComponent } from './pages/firma-consentimiento/firma-consentimiento.component';
import { DetallesCotizacionComponent } from './pages/detalles-cotizacion/detalles-cotizacion.component';
import { DetallesComponent } from './pages/detalles/detalles.component';
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
import { EntregaOrdenComponent } from './pages/entrega-orden/entrega-orden.component';

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
  { path: 'vehiculos', component: VehiculosComponent,  canActivate:[AuthGuard] },
  { path: 'administracion', component: AdministracionComponent,  canActivate:[AuthGuard] },
  { path: 'servicios', component: ServiciosComponent,  canActivate:[AuthGuard] },
  { path: 'catalogo/:id', component: CatalogoEditComponent,  canActivate:[AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent,  canActivate:[AuthGuard] },
  { path: 'Gerente', component: GerenteComponent,  canActivate:[AuthGuard] },
  { path: 'tecnico-ayudante', component: TecnicoayudanteComponent,  canActivate:[AuthGuard] },
  // { path: 'newCotizacion/:cotizacion/:pagina', component: NewcotizacionComponent ,  canActivate:[AuthGuard]},
  { path: 'recepcion/:recepcion/:pagina', component: RecepcionComponent ,  canActivate:[AuthGuard]},
  { path: 'FirmaEntrega/:idRecepcion', component: FirmaComponent ,  canActivate:[AuthGuard]},
  { path: 'FirmaConsentimiento/:idRecepcion', component: FirmaConsentimientoComponent ,  canActivate:[AuthGuard] },
  { path: 'detallesCotizacion/:idRecepcion/:pagina', component: DetallesCotizacionComponent ,  canActivate:[AuthGuard] },
  { path: 'detalles/:idRecepcion', component: DetallesComponent ,  canActivate:[AuthGuard] },
  { path: 'recordatorios', component: RecordartoriosComponent ,  canActivate:[AuthGuard]},
  { path: 'historial-vehiculo/:idvehiculo', component: HistorialVehiculoComponent ,  canActivate:[AuthGuard]},
  { path: 'historial-cliente/:rutaAnterior/:idCliente', component: HistorialClienteComponent ,  canActivate:[AuthGuard]},
  { path: 'cotizacionNueva/:ID/:tipo', component: CotizacionNewComponent ,  canActivate:[AuthGuard]},
  { path: 'home', component: HomeComponent },
  { path: 'vehiculos/:rutaAnterior/:accion', component: VehiculosComponent,canActivate:[AuthGuard] },
  { path: 'ServiciosConfirmar/:ID/:tipo', component: ServiciosConfirmarComponent,canActivate:[AuthGuard] },
  { path: 'modificaRecepcion/:rutaAnterior/:idRecepcion', component: ModificaRecepcionComponent,canActivate:[AuthGuard] },
  { path: 'automaticos', component: AutomaticosComponent },
  // { path: 'login', component: LoginComponent},
  { path: 'loginv1', component: Loginv1Component},
  { path: 'reporteGastos', component: ReporteGastosComponent},
  { path: 'pruebaAuth', component: AuthPruebaComponent},
  { path: 'entregaRecepcion/:idRecepcion', component: EntregaOrdenComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash:false});
