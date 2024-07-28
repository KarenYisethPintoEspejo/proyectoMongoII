import { pelicula } from "./js/modules/pelicula.js";
import { boleto } from "./js/modules/boleto.js";


let objBoleto= new boleto();

const idBoletoCancelar = 11;

console.log(await objBoleto.cancelarReserva(idBoletoCancelar));

objBoleto.destructor()
