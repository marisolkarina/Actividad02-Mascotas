const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    carrito: {
        items: [
            {
                idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
                cantidad: { type: Number, required: true }
            }
        ],
        precioTotal: {
            type: Number, 
            required: true
        }
    }
})


usuarioSchema.methods.agregarAlCarrito = function(producto, cantidadInput) {
    if (!this.carrito) {
        this.carrito = {items: [], precioTotal: 0};
    }
    const indiceEnCarrito = this.carrito.items.findIndex(cp => {
        return cp.idProducto.toString() === producto._id.toString();
    });
    let nuevaCantidad = cantidadInput;
    const itemsActualizados = [...this.carrito.items];
  
    if (indiceEnCarrito >= 0) {
        nuevaCantidad = this.carrito.items[indiceEnCarrito].cantidad + cantidadInput;
        itemsActualizados[indiceEnCarrito].cantidad = nuevaCantidad;
    } else {
        itemsActualizados.push({
            idProducto: producto._id,
            cantidad: nuevaCantidad
        });
    }

    const total = this.carrito.precioTotal + +producto.precio*Number(cantidadInput);
    const carritoActualizado = {
        items: itemsActualizados,
        precioTotal: total
    };
  
    this.carrito = carritoActualizado;
    return this.save();
  };

  
usuarioSchema.methods.deleteItemDelCarrito = function(idProducto, producto) {

    const productoEliminar = this.carrito.items.find(cp => cp.idProducto.toString() === idProducto.toString());
    const cantidadProducto = productoEliminar.cantidad;

    this.carrito.precioTotal = this.carrito.precioTotal - producto.precio*cantidadProducto;

    const itemsActualizados = this.carrito.items.filter(item => {
        return item.idProducto.toString() !== idProducto.toString();
    });
    this.carrito.items = itemsActualizados;
    return this.save();
};

usuarioSchema.methods.actualizarCantidadProducto = function (idProducto, nuevaCantidad, producto) {
    if (!this.carrito) {
        this.carrito = {items: [], precioTotal: 0};
    }
    const productoEditar = this.carrito.items.find(cp => cp.idProducto.toString() === idProducto.toString());
    if (!productoEditar) {
        return;
    }
    // Actualizar la cantidad
    const cantidadAnterior = productoEditar.cantidad;
    productoEditar.cantidad = nuevaCantidad;
    
    // Actualizar el precio total
    const precio = producto.precio;
    this.carrito.precioTotal = this.carrito.precioTotal - (precio * cantidadAnterior) + (precio * nuevaCantidad);
    
    return this.save();
     
}

module.exports = mongoose.model('Usuario', usuarioSchema);


// const fs = require('fs');
// const path = require('path');

// const raizDir = require('../utils/path');

// const u = path.join(raizDir, 'data', 'usuarios.json');

// const getUsuariosFromFile = (cb) => {
//     fs.readFile(u, (err, fileContent) => {
//         if(err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     })
// }

// module.exports = class Usuario {
//     constructor(id, nombre, email, password, role) {
//         this.id = id;
//         this.nombre = nombre;
//         this.email = email;
//         this.password = password;
//         this.role = role;
//     }

//     save() {

//         getUsuariosFromFile(usuarios => {
//             if (this.id) {
//                 const indiceUsuarioExistente = usuarios.findIndex(
//                     user => user.id === this.id
//                 );
//                 const usuarioActualizado = [...usuarios];
//                 usuarioActualizado[indiceUsuarioExistente] = this;
//                 fs.writeFile(u, JSON.stringify(usuarioActualizado), err => {
//                     console.log(err);
//                 });
//             } else {
//                 this.id = Math.random().toString();
//                 usuarios.push(this);
//                 fs.writeFile(u, JSON.stringify(usuarios), err => {
//                     console.log(err);
//                 });
//             }
//         });

//     }

//     static fetchAll(cb) {
//         return getUsuariosFromFile(cb);
//     }

//     static findById(id, cb) {
//         getUsuariosFromFile(usuarios => {
//             const usuario = usuarios.find(user => user.id === id);
//             cb(usuario);
//         });
//     }

//     // verificar que el usuario exista al hacer login
//     static findUsuario(email, password, cb) {
//         getUsuariosFromFile(usuarios => {
//             const usuario = usuarios.find(user => user.email === email && user.password === password);
//             cb(usuario);
//         })
//     }

//     static deleteById(id) {
//         getUsuariosFromFile(usuarios => {
//             const usuariosActualizados = usuarios.filter(user => user.id !== id);
//             fs.writeFile(u, JSON.stringify(usuariosActualizados), err => {
//                 console.log(err);
//             });
//         });
//     }
// }