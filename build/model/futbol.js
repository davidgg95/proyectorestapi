"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Futbols = exports.Futbol = void 0;
const mongoose_1 = require("mongoose");
class Futbol {
    constructor(_nombre, _longitud, _ancho, _estadio) {
        this._nombre = _nombre;
        this._longitud = _longitud;
        this._ancho = _ancho;
        this._estadio = _estadio;
    }
    get nombre() {
        return this._nombre;
    }
    get estadio() {
        return this._estadio;
    }
    get longitud() {
        return this._longitud;
    }
    get ancho() {
        return this._ancho;
    }
    set ancho(_ancho) {
        if (_ancho <= 0) {
            throw "Altura incorrecta, debe ser > 0";
        }
        this._ancho = _ancho;
    }
    perimetro() {
        let perimetro;
        perimetro = 2 * this._longitud + 2 * this._ancho;
        if (perimetro == 0) {
            throw "Campo de futbol no creado";
        }
        return perimetro;
    }
    area() {
        if (isNaN(this._ancho)) {
            throw "Ancho no asignada";
        }
        return this._longitud * this._ancho;
    }
}
exports.Futbol = Futbol;
// Definimos el Schema
const futbolSchema = new mongoose_1.Schema({
    _nombre: {
        type: String,
        unique: true
    },
    _estadio: String,
    _longitud: {
        type: Number,
        max: 200
    },
    _ancho: {
        type: Number,
        min: 5
    }
});
// La colección de la BD: vehiculos (Plural siempre)
exports.Futbols = mongoose_1.model('futbol', futbolSchema);
