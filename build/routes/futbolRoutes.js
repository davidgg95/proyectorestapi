"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.futbolRoutes = void 0;
const express_1 = require("express");
const futbol_1 = require("../model/futbol");
const database_1 = require("../database/database");
class FutbolRoutes {
    constructor() {
        this.getFutbols = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield futbol_1.Futbols.find();
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.nuevoFutbolPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            // Observar la diferencia entre req.body (para POST) 
            // y req.params (para GET con los parámetros en la URL
            const { nombre, estadio, longitud, ancho } = req.body;
            console.log(nombre);
            const dSchema = {
                _nombre: nombre,
                _estadio: parseInt(estadio),
                _longitud: parseInt(longitud),
                _ancho: parseInt(ancho)
            };
            console.log(dSchema);
            const oSchema = new futbol_1.Futbols(dSchema);
            yield database_1.db.conectarBD();
            yield oSchema.save()
                .then((doc) => {
                console.log('Salvado Correctamente: ' + doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.send('Error: ' + err);
            });
            // concatenando con cadena muestra sólo el mensaje
            yield database_1.db.desconectarBD();
        });
        this.nuevoFutbolGet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre, estadio, longitud, ancho } = req.params;
            console.log(req.params);
            yield database_1.db.conectarBD();
            const dSchema = {
                _nombre: nombre,
                _estadio: parseInt(estadio),
                _longitud: parseInt(longitud),
                _ancho: parseInt(ancho)
            };
            const oSchema = new futbol_1.Futbols(dSchema);
            yield oSchema.save()
                .then((doc) => {
                console.log('Salvado Correctamente: ' + doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.send('Error: ' + err);
            });
            // concatenando con cadena muestra sólo el mensaje
            yield database_1.db.desconectarBD();
        });
        this.getArea = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let futbol;
            let sup = 0;
            const { nombre } = req.params;
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                yield futbol_1.Futbols.findOne({ _nombre: nombre }, (error, doc) => {
                    if (error)
                        console.log(error);
                    else {
                        if (doc == null) {
                            console.log('No existe');
                            res.json({});
                        }
                        else {
                            console.log('Existe: ' + doc);
                            futbol =
                                new futbol_1.Futbol(doc._nombre, doc._estadio, doc._longitud, doc._ancho);
                            futbol.ancho = doc._ancho;
                            sup = futbol.area();
                            res.json({ "nombre": nombre, "area": sup });
                        }
                    }
                });
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.getAreav2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield futbol_1.Futbols.findOne({ _nombre: nombre });
                if (query == null) {
                    console.log(query);
                    res.json({});
                }
                else {
                    const futbol = new futbol_1.Futbol(query._nombre, query._estadio, query._longitud, query._ancho);
                    futbol.ancho = query._ancho;
                    console.log(futbol);
                    res.json({ "nombre": futbol.nombre, "area": futbol.area() });
                }
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.getDelete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD();
            yield futbol_1.Futbols.findOneAndDelete({ _nombre: nombre }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        console.log(`No encontrado`);
                        res.send(`No encontrado`);
                    }
                    else {
                        console.log('Borrado correcto: ' + doc);
                        res.send('Borrado correcto: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this.getAreas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let arrayT = new Array();
            yield database_1.db.conectarBD();
            let tmpFutbol;
            let dFutbol;
            const query = yield futbol_1.Futbols.find({});
            for (dFutbol of query) {
                tmpFutbol =
                    new futbol_1.Futbol(dFutbol._nombre, dFutbol._longitud, dFutbol._estadio, dFutbol._ancho);
                tmpFutbol.ancho = dFutbol._ancho;
                const doc = {
                    nombre: dFutbol._nombre,
                    area: tmpFutbol.area()
                };
                arrayT.push(doc);
                console.log(`Triángulo ${tmpFutbol.nombre} Área: ${tmpFutbol.area()}`);
            }
            console.log(arrayT);
            res.json(arrayT);
            yield database_1.db.desconectarBD();
        });
        this.actualiza = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const { estadio, longitud, ancho } = req.body;
            yield database_1.db.conectarBD();
            const doc = yield futbol_1.Futbols.findOneAndUpdate({ _nombre: nombre }, {
                _nombre: nombre,
                _estadio: estadio,
                _longitud: longitud,
                _ancho: ancho
            }, {
                new: true,
                runValidators: true // para que se ejecuten las validaciones del Schema
            })
                .then((docu) => {
                console.log('Modificado Correctamente: ' + docu);
                res.json(docu);
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            }); // concatenando con cadena muestra mensaje
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/', this.getFutbols);
        this._router.get('/nuevoG/:nombre&:estadio&:longitud&:ancho', this.nuevoFutbolGet);
        this._router.post('/nuevoP', this.nuevoFutbolPost);
        this._router.get('/area/:nombre', this.getArea);
        this._router.get('/areav2/:nombre', this.getAreav2);
        this._router.get('/borrar/:nombre', this.getDelete);
        this._router.get('/areas', this.getAreas);
        this._router.post('/actualiza/:nombre', this.actualiza);
    }
}
const obj = new FutbolRoutes();
obj.misRutas();
exports.futbolRoutes = obj.router;