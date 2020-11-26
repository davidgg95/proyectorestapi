import {Request, Response, Router } from 'express'

class PruebaRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    // Definimos las funciones asociadas a las rutas
    private getPrueba = (req: Request, res: Response) => { 
        res.send('Estoy en la /p de la app (con o sin prefijo). Utilizando una función') 
    }

    // Atención para que se pueda enviar un post con body hay que poner en server:
    // this.app.use(express.json()) // para que nuestro servidor entienda
    // los formatos json desde clientes

    private postPrueba = (req: Request, res: Response) => { 
        console.log(req.body)
        const {nombre, estadio, longitud, ancho} = req.body
        res.send('Estoy en post '+nombre)
    }
    // Aplicamos a la variable de tipo Router métodos get con rutas y las funciones que realizan
    // https://expressjs.com/es/4x/api.html#router.METHOD
    // Para más tarde usarlas en el servidor
    misRutas(){
        this._router.get('/',
            (req: Request, res: Response) => 
                    res.send('Buenos días queridos alumnos')
        )
        this._router.get('/parametro/:valor1&:valor2',
        (req: Request, res: Response) => {
            const { valor1, valor2 } = req.params
            console.log(req.params)
            res.send(`Me has enviado: ${valor1} y ${valor2}`)
        }
                
    )
        this._router.get('/p', this.getPrueba)
        this._router.post('/p2', this.postPrueba)
    }
}

// Creamos el objeto 
const obj = new PruebaRoutes()
// ejecutamos la asociación rutas > funciones
obj.misRutas()
// Exportamos el parámetro de tipo Router con las rutas asignadas
// Para su uso en el servidor
export const pruebaRoutes = obj.router