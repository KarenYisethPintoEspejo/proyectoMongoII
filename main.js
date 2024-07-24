import { pelicula } from "./js/modules/pelicula.js";

let objPelicula= new pelicula();


//Esta es una prueba que se realizo para verificar la conexion:
console.log(`Probando Pelicula`, await objPelicula.getALLMovies());

objPelicula.destructor()
