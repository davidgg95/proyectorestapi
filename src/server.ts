import express from 'express'
import morgan from 'morgan'
class Server {
    private app: express.Application
    constructor(){
        this.app = express()
        this.config()
    }
    config(){
        this.app.set('port', process.env.PORT || 4000)
        this.app.use(morgan('dev'))  // Para que muestre las url invocadas
    }
    routes(){

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