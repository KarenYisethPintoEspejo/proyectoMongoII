import { pelicula } from "./js/modules/pelicula.js";
import { boleto } from "./js/modules/boleto.js";


let objBoleto= new boleto();

console.log(await objBoleto.verificarDisponibilidadAsiento(1, 3));

objBoleto.destructor()
