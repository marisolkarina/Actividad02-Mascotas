const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    productos: [
        {
            producto: { type: Object, required: true },
            cantidad: { type: Number, required: true }
        }
    ],
    usuario: {
        nombre: {
            type: String,
            required: true
        },
        idUsuario: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Usuario'
        }
    },
    estado: {
        type: String,
        enum: ['pendiente', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente',
        required: true,
    },
    fechaPedido: {
        type: Date,
        default: Date.now,
        required: true
    },
    fechaEntrega: {
        type: Date,
        required: true 
    }
});

module.exports = mongoose.model('Pedido', pedidoSchema);

// const fs = require('fs');
// const path = require('path');

// const raizDir = require('../utils/path');

// const pe= path.join(raizDir, 'data', 'pedidos.json');

// const getPedidosFromFile = (cb) => {
//     fs.readFile(pe, (err, fileContent) => {
//         if(err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     })
// }

// module.exports = class Pedido {
//     constructor(id, idUsuario, productos, precioTotal) {
//         this.id = id;
//         this.idUsuario = idUsuario;
//         this.productos = productos;
//         this.precioTotal = precioTotal;
//     }


//     static fetchAll(cb) {
//         return getPedidosFromFile(cb);
//     }

//     static filterByIdUsuario(id, cb) {
//         getPedidosFromFile(pedidos => {
//             const misPedidos = pedidos.filter(ped => String(ped.idUsuario) === String(id));
//             cb(misPedidos);
//         });
//     }

// }