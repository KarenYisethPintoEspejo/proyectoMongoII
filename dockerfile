# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente al contenedor
COPY . .

# Expone el puerto en el que corre la aplicación (el puerto que usas en tu app, ej. 3000)
EXPOSE 5000

# Inicia la aplicación
CMD ["npm", "run", "dev"]