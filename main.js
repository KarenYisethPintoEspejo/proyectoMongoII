import { pelicula } from "./js/modules/pelicula.js";
import { boleto } from "./js/modules/boleto.js";


let objBoleto= new boleto();

const ticketData = {
    id: 11,
    id_usuario: 1,
    id_asiento: 3,
    id_proyeccion: 4,
    precio: 12
};

console.log(await objBoleto.comprarBoleto(ticketData));

objBoleto.destructor()
