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

import { HistorialVehiculoComponent } from './pages/historial-vehiculo/historial-vehiculo.component';
import { HistorialClienteComponent } from './pages/historial-cliente/historial-cliente.component';
import { CotizacionNewComponent } from './pages/cotizacion-new/cotizacion-new.component';
import { ServiciosConfirmarComponent } from './pages/servicios-confirmar/servicios-confirmar.component';
import { ModificaRecepcionComponent } from './pages/modifica-recepcion/modifica-recepcion.component';

import { Loginv1Component } from './components/loginv1/loginv1.component';
import { ReporteGastosComponent } from './pages/reporte-gastos/reporte-gastos.component';
import { ListaProblemasComponent } from './pages/lista-problemas/lista-problemas.component';

import { EliminarEmpresaComponent } from './pages/eliminar-empresa/eliminar-empresa.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { GuardClienteGuard } from './guards/guard-cliente.guard';
import { MiperfilComponent } from './pages/miperfil/miperfil.component';
import { GuardCliente2Guard } from './guards/guard-cliente2.guard';
import { CotizacionesClienteComponent } from './pages/cotizaciones-cliente/cotizaciones-cliente.component';
import { ServiciosClienteComponent } from './pages/servicios-cliente/servicios-cliente.component';
import { EstadisticasClienteComponent } from './pages/estadisticas-cliente/estadisticas-cliente.component';
import { ComentariosClienteComponent } from './pages/comentarios-cliente/comentarios-cliente.component';
import { HistorialClienteVehiculoComponent } from './pages/historial-cliente-vehiculo/historial-cliente-vehiculo.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
const APP_ROUTES: Routes = [
  { path: 'inicio', component: InicioComponent,  canActivate:[AuthGuard]},
  { path: 'catalogos', component: CatalogosComponent,  canActivate:[AuthGuard,GuardClienteGuard] },
  { path: 'citas', component: CitasComponent,  canActivate:[AuthGuard,GuardClienteGuard] },
  { path: 'clientes', component: ClientesComponent,  canActivate:[AuthGuard,GuardClienteGuard] },
  { path: 'configuracion', component: ConfiguracionComponent ,  canActivate:[AuthGuard]},
  { path: 'cotizacion', component: CotizacionComponent,  canActivate:[AuthGuard,GuardClienteGuard] },
  { path: 'sucursales', component: SucursalesComponent,  canActivate:[AuthGuard] },
  { path: 'servicios', component: ServiciosComponent,  canActivate:[AuthGuard,GuardClienteGuard] },
  { path: 'usuarios', component: UsuariosComponent,  canActivate:[AuthGuard,GuardClienteGuard] },
  { path: 'recordatorios', component: RecordartoriosComponent ,  canActivate:[AuthGuard,GuardClienteGuard]},
  { path: 'historial-vehiculo', component: HistorialVehiculoComponent ,  canActivate:[AuthGuard,GuardClienteGuard]},
  { path: 'historial-cliente', component: HistorialClienteComponent ,  canActivate:[AuthGuard,GuardClienteGuard]},
  { path: 'cotizacionNueva', component: CotizacionNewComponent ,  canActivate:[AuthGuard,GuardClienteGuard]},
  { path: 'ServiciosConfirmar', component: ServiciosConfirmarComponent,canActivate:[AuthGuard,GuardClienteGuard] },
  { path: 'modificaRecepcion/:rutaAnterior/:idRecepcion', component: ModificaRecepcionComponent,canActivate:[AuthGuard,GuardClienteGuard] },
  { path: 'reporteGastos', component: ReporteGastosComponent, canActivate:[AuthGuard,GuardClienteGuard]},
  { path: 'registraProblemas', component: ListaProblemasComponent,canActivate:[AuthGuard]},
  { path: 'eliminarEmpresa', component: EliminarEmpresaComponent,canActivate:[AuthGuard,GuardClienteGuard]},
  { path: 'facturacion', component: FacturacionComponent,canActivate:[AuthGuard,GuardClienteGuard]},
  { path: 'administracion', component: AdministracionComponent,canActivate:[AuthGuard,GuardClienteGuard]},

  { path: 'automaticos', component: AutomaticosComponent, canActivate:[GuardClienteGuard,AuthGuard]},

  { path: 'Registro', component: RegistroClienteComponent},

  { path: 'loginv1', component: Loginv1Component},

  { path: 'miPerfil', component: MiperfilComponent, canActivate:[GuardCliente2Guard,AuthGuard]},
  { path: 'cotizacionesCliente', component: CotizacionesClienteComponent, canActivate:[GuardCliente2Guard,AuthGuard]},
  { path: 'serviciosCliente', component: ServiciosClienteComponent, canActivate:[GuardCliente2Guard,AuthGuard]},
  { path: 'estadisticasCliente', component: EstadisticasClienteComponent, canActivate:[GuardCliente2Guard,AuthGuard]},
  { path: 'historialCliente-vehiculo', component: HistorialClienteVehiculoComponent, canActivate:[GuardCliente2Guard,AuthGuard]},
  { path: 'comentarios', component: ComentariosClienteComponent, canActivate:[GuardCliente2Guard,AuthGuard]},

  { path: 'home', component: HomeComponent },

  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash:false});
