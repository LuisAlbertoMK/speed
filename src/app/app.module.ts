import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins


import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_ROUTING } from "./app-routing.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InicioComponent } from './pages/inicio/inicio.component';

import { environment } from '../environments/environment';
import { CatalogosComponent } from './pages/catalogos/catalogos.component';
import { CitasComponent } from './pages/citas/citas.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { HomeComponent } from './pages/home/home.component';
import { SucursalesComponent } from './pages/sucursales/sucursales.component';

import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
//material ui
import { MatSliderModule } from '@angular/material/slider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//idioma

import { CommonModule, registerLocaleData } from "@angular/common";
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { OrdenamientoPipe } from './pipes/ordenamiento.pipe'
import { BreadcrumsComponent } from './components/breadcrums/breadcrums.component';
//drop zone
import { NgxDropzoneModule } from 'ngx-dropzone';

///firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';
///material

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table'
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator'
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu'
import {MatStepperModule} from '@angular/material/stepper'
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import {MatBadgeModule} from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import localeES from '@angular/common/locales/es'
registerLocaleData(localeES)
import * as $ from 'jquery';
//traducir
import {TranslateModule} from '@ngx-translate/core';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { OrdenesCotizacionesComponent } from './pages/ordenes-cotizaciones/ordenes-cotizaciones.component';
import { NavbarComponent } from './components/navbar/navbar.component';


import { CalendarComponent } from './pages/calendar/calendar.component'; // a plugin!

import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin  from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { NewcotizacionComponent } from './pages/newcotizacion/newcotizacion.component';
import { MonedasPipe } from './pipes/monedas.pipe';
import { NumerosLetrasPipe } from './pipes/numeros-letras.pipe';
import { CapitalizarUnoPipe } from './pipes/capitalizar-uno.pipe';
import { ModificarCotizacionComponent } from './pages/modificar-cotizacion/modificar-cotizacion.component';
import { RecordartoriosComponent } from './pages/recordartorios/recordartorios.component';
import { NavbarHomeComponent } from './components/navbar-home/navbar-home.component';
import { AutomaticosComponent } from './pages/automaticos/automaticos.component';
import { RecepcionComponent } from './pages/recepcion/recepcion.component';
import { HistorialVehiculoComponent } from './pages/historial-vehiculo/historial-vehiculo.component';
import { HistorialClienteComponent } from './pages/historial-cliente/historial-cliente.component';
import { CotizacionNewComponent } from './pages/cotizacion-new/cotizacion-new.component';

import { ServiciosConfirmarComponent } from './pages/servicios-confirmar/servicios-confirmar.component';
import { ModificaRecepcionComponent } from './pages/modifica-recepcion/modifica-recepcion.component';
import { AuthPruebaComponent } from './components/auth-prueba/auth-prueba.component';
import { Loginv1Component } from './components/loginv1/loginv1.component';
import { NombreSlicePipe } from './pipes/nombre-slice.pipe';
import { ClienteComponent } from './components/cliente/cliente.component';
import { VehiculoComponent } from './components/vehiculo/vehiculo.component';
import { GastoComponent } from './components/gasto/gasto.component';
import { PagoComponent } from './components/pago/pago.component';
import { MoRefaccionesComponent } from './components/mo-refacciones/mo-refacciones.component';
import { ReporteGastosComponent } from './pages/reporte-gastos/reporte-gastos.component';
import { RealizaDepositoComponent } from './components/realiza-deposito/realiza-deposito.component';

import { DataFacturacionClienteComponent } from './components/data-facturacion-cliente/data-facturacion-cliente.component';
import { PaquetesComponent } from './components/paquetes/paquetes.component';
import { ClientesListComponent } from './components/clientes-list/clientes-list.component';
import { ListaTecnicosComponent } from './components/lista-tecnicos/lista-tecnicos.component';
import { ListaProblemasComponent } from './pages/lista-problemas/lista-problemas.component';
import { UppercasePipe } from './pipes/uppercase.pipe';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';

// import { getDutchPaginatorIntl } from "../app/models/tras";


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  timeGridPlugin,
  bootstrap5Plugin
]);
@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CotizacionComponent,
    CatalogosComponent,
    CitasComponent,
    ClientesComponent,
    ConfiguracionComponent,
    HomeComponent,
    SucursalesComponent,
    ServiciosComponent,
    OrdenamientoPipe,
    SidebarComponent,
    BreadcrumsComponent,
    UsuariosComponent,
    FooterComponent,
    HeaderComponent,
    OrdenesCotizacionesComponent,
    NavbarComponent,
    CalendarComponent,
    NewcotizacionComponent,
    MonedasPipe,
    NumerosLetrasPipe,
    CapitalizarUnoPipe,
    ModificarCotizacionComponent,
    RecordartoriosComponent,
    NavbarHomeComponent,
    AutomaticosComponent,
    RecepcionComponent,
    HistorialVehiculoComponent,
    HistorialClienteComponent,
    CotizacionNewComponent,
    ServiciosConfirmarComponent,
    ModificaRecepcionComponent,
    AuthPruebaComponent,
    Loginv1Component,
    NombreSlicePipe,
    ClienteComponent,
    VehiculoComponent,
    GastoComponent,
    PagoComponent,
    MoRefaccionesComponent,
    ReporteGastosComponent,
    RealizaDepositoComponent,
    DataFacturacionClienteComponent,
    PaquetesComponent,
    ClientesListComponent,
    ListaTecnicosComponent,
    ListaProblemasComponent,
    UppercasePipe,
    RegistroUsuarioComponent
  ],
  imports: [
    FullCalendarModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideDatabase(() => getDatabase()),
    AngularFirestoreModule,
    FormsModule,
    NgxDropzoneModule,
    TranslateModule.forRoot(),
    APP_ROUTING,
    ReactiveFormsModule,  
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatStepperModule,
    MatBottomSheetModule,
    MatCheckboxModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    MatBadgeModule,
    MatGridListModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ],
  exports:[
    TranslateModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
