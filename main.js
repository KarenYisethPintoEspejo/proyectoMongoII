import { pelicula } from "./js/modules/pelicula.js";
import { boleto } from "./js/modules/boleto.js";
import { usuario } from "./js/modules/usuario.js";

let objUsuario = new usuario();

console.log(await objUsuario.actualizarRolUsuario(4, "usuarioEstandar"));

objUsuario.destructor();
