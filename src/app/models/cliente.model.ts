export interface Cliente {
    id?:string
    status: string,
    nombre: string
    apellidos: string
    correo: string
    correo_sec?: string
    password?: string
    no_cliente?:string
    telefono_fijo?: number
    telefono_movil: number
    tipo: number
    sucursal: number
    envio_correo?:boolean
  }