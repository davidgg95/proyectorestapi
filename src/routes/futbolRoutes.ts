import {Request, Response, Router } from 'express'
import { Futbols, Futbol, fFutbol } from '../model/futbol'
import { db } from '../database/database'

class FutbolRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getFutbols = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Futbols.find()
            console.log(query)
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        db.desconectarBD()
    }
  

    private nuevoFutbolPost = async (req: Request, res: Response) => {
        console.log(req.body)
        // Observar la diferencia entre req.body (para POST) 
        // y req.params (para GET con los parámetros en la URL
        const { nombre, estadio, longitud, ancho } = req.body

        console.log(nombre)

        const dSchema = {
            _nombre: nombre,
            _estadio: parseInt(estadio),
            _longitud: parseInt(longitud),
            _ancho: parseInt(ancho)
        }
        console.log(dSchema)
        const oSchema = new Futbols(dSchema)
        await db.conectarBD()
        await oSchema.save()
        .then( (doc) => {
            console.log('Salvado Correctamente: '+ doc)
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log('Error: '+ err)
            res.send('Error: '+ err)
        }) 
        // concatenando con cadena muestra sólo el mensaje
        await db.desconectarBD()
    }     

    private nuevoFutbolGet = async (req: Request, res: Response) => {
        const { nombre, estadio, longitud, ancho } = req.params
        console.log(req.params)

        await db.conectarBD()
        const dSchema = {
            _nombre: nombre,
            _estadio: parseInt(estadio),
            _longitud: parseInt(longitud),
            _ancho: parseInt(ancho)
        }
        const oSchema = new Futbols(dSchema)
        await oSchema.save()
        .then( (doc) => {
            console.log('Salvado Correctamente: '+ doc)
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log('Error: '+ err)
            res.send('Error: '+ err)
        }) 
        // concatenando con cadena muestra sólo el mensaje
        await db.desconectarBD()
    }  
    private getArea = async (req: Request, res: Response) => {
        let futbol: Futbol
        let sup: number = 0
        const {nombre } = req.params
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            await Futbols.findOne({_nombre: nombre},
                (error, doc: any) => {
                    if(error) console.log(error)
                    else{
                        if (doc == null) {
                            console.log('No existe')
                            res.json({})
                        }else {
                            console.log('Existe: '+ doc)
                            futbol = 
                                new Futbol(doc._nombre, doc._estadio, 
                                    doc._longitud, doc._ancho)
                            futbol.ancho = doc._ancho 
                            sup = futbol.area()
                            res.json({"nombre": nombre, "area": sup})
                        }
                    }
                }
            )

        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        db.desconectarBD()
    }


    private getAreav2 = async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query: any = await Futbols.findOne({_nombre: nombre})
            if (query == null){
                console.log(query)
                res.json({})
            }else{
                const futbol = new Futbol(query._nombre, query._estadio, 
                    query._longitud, query._ancho)
                futbol.ancho = query._ancho  
                console.log(futbol)
                res.json({"nombre": futbol.nombre, "area": futbol.area()})
            }

        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })
        db.desconectarBD()
    }

    private getDelete = async (req: Request, res: Response) => {
        const {nombre } = req.params
        await db.conectarBD()
        await Futbols.findOneAndDelete(
            { _nombre: nombre }, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        console.log(`No encontrado`)
                        res.send(`No encontrado`)
                    }else {
                        console.log('Borrado correcto: '+ doc)
                        res.send('Borrado correcto: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }

    private getAreas =  async (req: Request, res: Response) => {
        type tDoc = {
            nombre: String,
            area: Number
        }
        let arrayT: Array<tDoc> = new Array<tDoc>()
        await db.conectarBD()
        let tmpFutbol: Futbol
        let dFutbol: any 
        const query =  await Futbols.find( {} )
        for (dFutbol of query){
            tmpFutbol = 
                new Futbol(dFutbol._nombre, dFutbol._longitud, 
                    dFutbol._estadio, dFutbol._ancho)
            tmpFutbol.ancho = dFutbol._ancho
            const doc = {
                nombre:  dFutbol._nombre,
                area: tmpFutbol.area()
            }
            arrayT.push(doc)

            console.log(`Triángulo ${tmpFutbol.nombre} Área: ${tmpFutbol.area()}`)

        }
        console.log(arrayT)
        res.json(arrayT)
        await db.desconectarBD()   
    }
    private actualiza = async (req: Request, res: Response) => {
        const { nombre }= req.params
        const { estadio, longitud, ancho } = req.body
        await db.conectarBD()
        const doc: any = await Futbols.findOneAndUpdate(
                { _nombre: nombre }, 
                {
                    _nombre: nombre,
                    _estadio: estadio,
                    _longitud: longitud,
                    _ancho: ancho
                },
                {
                    new: true,
                    runValidators: true // para que se ejecuten las validaciones del Schema
                }  
            )
            .then((docu) => {
                    console.log('Modificado Correctamente: '+ docu) 
                    res.json(docu)
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            ) // concatenando con cadena muestra mensaje
        db.desconectarBD()
    }

    misRutas(){
        this._router.get('/', this.getFutbols)
        this._router.get('/nuevoG/:nombre&:estadio&:longitud&:ancho', this.nuevoFutbolGet)
        this._router.post('/nuevoP', this.nuevoFutbolPost)
        this._router.get('/area/:nombre', this.getArea)
        this._router.get('/areav2/:nombre', this.getAreav2)
        this._router.get('/borrar/:nombre', this.getDelete)
        this._router.get('/areas', this.getAreas)
        this._router.post('/actualiza/:nombre', this.actualiza)
    }
}

const obj = new FutbolRoutes()
obj.misRutas()
export const futbolRoutes = obj.router