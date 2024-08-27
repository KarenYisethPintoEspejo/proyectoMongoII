Esquemas de Validación:

asiento

```javascript
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'id',
      'fila',
      'numero',
      'id_sala',
      'tipo'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'El Id es un valor obligatorio y es de tipo objectId'
      },
      id: {
        bsonType: 'int',
        description: 'El id es un valor obligatorio y es de tipo entero'
      },
      fila: {
        bsonType: 'string',
        description: 'La fila es un valor obligatorio y es de tipo cadena'
      },
      numero: {
        bsonType: 'int',
        description: 'El número del asiento es un valor obligatorio y es de tipo entero'
      },
      id_sala: {
        bsonType: 'int',
        description: 'El id_sala es un valor obligatorio y es de tipo entero. Debe referirse a un id en la colección \'sala\'.'
      },
      tipo: {
        bsonType: 'string',
        description: 'El tipo de asiento es un valor obligatorio y debe ser una cadena de texto'
      }
    }
  }
}
```



boleto

```javascript
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'id',
      'id_usuario',
      'id_asiento',
      'id_proyeccion',
      'precio'
    ],
    properties: {
      id: {
        bsonType: 'int',
        description: 'El ID es un valor obligatorio y es de tipo entero'
      },
      id_usuario: {
        bsonType: 'int',
        description: 'El ID del usuario es un valor obligatorio y es de tipo entero'
      },
      id_asiento: {
        bsonType: 'int',
        description: 'El ID del asiento es un valor obligatorio y es de tipo entero'
      },
      id_proyeccion: {
        bsonType: 'int',
        description: 'El ID de la proyección es un valor obligatorio y es de tipo entero'
      },
      precio: {
        bsonType: 'int',
        description: 'El precio es un valor obligatorio y es de tipo entero'
      }
    }
  }
}
```



pago

```javascript
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'id',
      'boleto',
      'monto',
      'metodo_pago',
      'fecha',
      'hora',
      'estado',
      'tipo_transaccion'
    ],
    properties: {
      id: {
        bsonType: 'int',
        description: 'El ID es un valor obligatorio y es de tipo entero'
      },
      boleto: {
        bsonType: 'int',
        description: 'El ID del boleto asociado al pago, es de tipo entero'
      },
      monto: {
        bsonType: 'int',
        description: 'El monto total del pago, es de tipo entero'
      },
      metodo_pago: {
        bsonType: 'string',
        description: 'El método de pago utilizado, es de tipo cadena'
      },
      fecha: {
        bsonType: 'date',
        description: 'La fecha en la que se realizó el pago, es de tipo fecha'
      },
      hora: {
        bsonType: 'string',
        description: 'La hora en la que se realizó el pago, es de tipo cadena'
      },
      estado: {
        bsonType: 'string',
        'enum': [
          'Pendiente',
          'Fallido',
          'Completado'
        ],
        description: 'El estado del pago, puede ser pendiente, fallido o completado'
      },
      tipo_transaccion: {
        bsonType: 'string',
        'enum': [
          'Compra',
          'Reserva'
        ],
        description: 'El tipo de transacción, puede ser Compra o Reserva'
      }
    }
  }
}
```



película

```javascript
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'id',
      'nombre',
      'sinopsis',
      'generos',
      'actores',
      'duracion',
      'clasificacion',
      'estado',
      'fecha_estreno',
      'fecha_retiro'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'El Id es un valor obligatorio y es de tipo objectId'
      },
      id: {
        bsonType: 'int',
        description: 'El id es un valor obligatorio y es de tipo entero'
      },
      nombre: {
        bsonType: 'string',
        description: 'El nombre es un valor obligatorio y es de tipo cadena'
      },
      sinopsis: {
        bsonType: 'string',
        description: 'La sinopsis es un valor obligatorio y es de tipo cadena'
      },
      generos: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        description: 'Los generos son obligatorios y es un arreglo de cadenas'
      },
      actores: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        description: 'Los actores son obligatorios y es un arreglo de cadenas'
      },
      duracion: {
        bsonType: 'int',
        description: 'La duracion es un valor obligatorio y es de tipo entero (en minutos)'
      },
      clasificacion: {
        bsonType: 'string',
        'enum': [
          'Apta para todo público',
          'Público general',
          'Mayores de 13 años',
          'Mayores de 17 años',
          'Sólo para adultos'
        ],
        description: 'La clasificacion es un valor obligatorio y debe ser una de las siguientes: \'Apta para todo público\', \'Público general\', \'Mayores de 13 años\', \'Mayores de 17 años\', \'Sólo para adultos\''
      },
      estado: {
        bsonType: 'string',
        'enum': [
          'Disponible',
          'No disponible'
        ],
        description: 'El estado es un valor obligatorio y debe ser uno de los siguientes: \'disponible\', \'no disponible\''
      },
      fecha_estreno: {
        bsonType: 'date',
        description: 'La fecha de estreno es un valor obligatorio y es de tipo fecha'
      },
      fecha_retiro: {
        bsonType: 'date',
        description: 'La fecha de retiro es un valor obligatorio y es de tipo fecha'
      }
    }
  }
}
```



proyección

```javascript
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'id',
      'id_pelicula',
      'id_sala',
      'fecha',
      'hora'
    ],
    properties: {
      id: {
        bsonType: 'int',
        description: 'El ID es un valor obligatorio y es de tipo entero'
      },
      id_pelicula: {
        bsonType: 'int',
        description: 'El ID de la película es un valor obligatorio y es de tipo entero'
      },
      id_sala: {
        bsonType: 'int',
        description: 'El ID de la sala es un valor obligatorio y es de tipo entero'
      },
      fecha: {
        bsonType: 'date',
        description: 'La fecha de la proyección es un valor obligatorio y es de tipo fecha'
      },
      hora: {
        bsonType: 'string',
        description: 'La hora de la proyección es un valor obligatorio y es de tipo cadena'
      }
    }
  }
}
```



sala

```javascript
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'id',
      'numero',
      'capacidad',
      'tipo'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'El Id es un valor obligatorio y es de tipo objectId'
      },
      id: {
        bsonType: 'int',
        description: 'El id es un valor obligatorio y es de tipo entero'
      },
      numero: {
        bsonType: 'int',
        description: 'El número de sala es un valor obligatorio y es de tipo entero'
      },
      capacidad: {
        bsonType: 'int',
        description: 'La capacidad de la sala es un valor obligatorio y es de tipo entero (número de asientos)'
      },
      tipo: {
        bsonType: 'string',
        description: 'El tipo de sala es un valor obligatorio y debe ser una cadena de texto'
      }
    }
  }
}
```



tarjeta

```javascript
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'id',
      'numero',
      'id_usuario',
      'estado',
      '%descuento'
    ],
    properties: {
      id: {
        bsonType: 'int',
        description: 'El id es un valor obligatorio y es de tipo entero'
      },
      numero: {
        bsonType: 'string',
        description: 'El número de la tarjeta es un valor obligatorio y es de tipo cadena'
      },
      id_usuario: {
        bsonType: 'int',
        description: 'El id_usuario es un valor obligatorio y es de tipo entero. Debe coincidir con un id existente en la colección de usuarios'
      },
      estado: {
        bsonType: 'string',
        description: 'El estado es un valor obligatorio y puede ser una cadena de texto'
      },
      '%descuento': {
        bsonType: 'int',
        description: 'El %descuento es un valor obligatorio y es de tipo entero que representa el porcentaje de descuento'
      }
    }
  }
}
```



usuario

```javascript
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'id',
      'nombre',
      'email',
      'rol'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'El Id es un valor obligatorio y es de tipo objectId'
      },
      id: {
        bsonType: 'int',
        description: 'El id es un valor obligatorio y es de tipo entero'
      },
      nombre: {
        bsonType: 'string',
        description: 'El nombre es un valor obligatorio y es de tipo cadena'
      },
      email: {
        bsonType: 'string',
        pattern: '^.+@.+\\..+$',
        description: 'El email es un valor obligatorio, es de tipo cadena y debe tener un formato de correo electrónico válido'
      },
      rol: {
        bsonType: 'string',
        'enum': [
          'dbOwner',
          'usuarioEstandar',
          'usuarioVIP'
        ],
        description: 'El rol es un valor obligatorio y debe ser uno de los siguientes: \'Administrador\', \'Usuario Estandar\', \'Usuario VIP\''
      }
    }
  }
}
```



