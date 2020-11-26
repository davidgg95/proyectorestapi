import express from 'express'
import morgan from 'morgan'

import { pruebaRoutes } from './routes/pruebaRoutes'
import { futbolRoutes } from './routes/futbolRoutes'
import { identificacionRoutes } from './routes/identificacionRoutes'
import { db } from './database/database'

class Server {
    private app: express.Application
    constructor(){
        this.app = express()
        this.config()
        this.routes()
    }
    private async config(){

        this.app.set('port', process.env.PORT || 3000)

        this.app.use(express.json()) // para que nuestro servidor entienda
        // los formatos json desde clientes
        this.app.use(morgan('dev'))  // Para que muestre las url invocadas
    }

    private routes(){
        this.app.use('/futbol', futbolRoutes)
        this.app.use('/prefijo', pruebaRoutes)
        this.app.use('/id', identificacionRoutes)
    }
    start(){
        this.app.listen(this.app.get('port'), 
        () => {
            console.log(`Server on port: ${this.app.get('port')}`)
        })
    }
}

const server = new Server()
server.start()