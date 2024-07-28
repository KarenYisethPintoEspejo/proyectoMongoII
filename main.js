import { pelicula } from "./js/modules/pelicula.js";
import { boleto } from "./js/modules/boleto.js";


let objBoleto= new boleto();

const ticketData = {
    "id": 11,
    "id_usuario": 2,
    "id_asiento": 7,
    "id_proyeccion": 4,
    "precio": 15
  }

console.log(await objBoleto.reservarAsiento(ticketData));

objBoleto.destructor()
