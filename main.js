import { pelicula } from "./js/modules/pelicula.js";

let objPelicula= new pelicula();

console.log(await objPelicula.getALLMovies());

objPelicula.destructor()
