import { pelicula } from "./js/modules/pelicula.js";
import { boleto } from "./js/modules/boleto.js";
import { usuario } from "./js/modules/usuario.js";

let objUsuario = new usuario();

const usuarioData = {
    id: 6,
    nombre: 'Karen Pinto',
    email: 'karen.pinto@example.com',
    rol: 'usuarioEstandar' 
};

console.log(await objUsuario.crearUsuario(usuarioData));

objUsuario.destructor();
