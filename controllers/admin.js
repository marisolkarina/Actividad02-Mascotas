const Pedido = require('../models/pedido');
const Producto = require('../models/producto');
const Usuario = require('../models/usuario')

//Administracion de Productos

exports.getProductos = (req, res) => {

    Producto
        .find()
        .then((productos) => {
            res.render('admin/productos', {
                prods: productos,
                titulo: "Administracion de Productos", 
                path: "/admin/productos"
            });
        }).catch((err) => {
            console.log(err);
        });

};

exports.getCrearProducto = (req, res) => {
    res.render('admin/crear-editar-producto', { 
        titulo: 'Crear Producto', 
        path: '/admin/crear-producto',
        modoEdicion: false
    })
};

exports.postCrearProducto = (req, res) => {

    const nombre = req.body.nombre;
    const urlImagen = req.body.urlImagen;
    const precio = parseFloat(req.body.precio);
    const descripcion = req.body.descripcion;
    const categoria = req.body.categoria;
    const color = req.body.color;

    const producto = new Producto({ 
        nombre: nombre, 
        urlImagen: urlImagen, 
        descripcion: descripcion, 
        precio: precio, 
        categoria: categoria, 
        color: color,
        idUsuario: req.usuario._id
    });

    producto
        .save()
        .then((result) => {
            console.log(result);
            console.log('Producto creado');
            res.redirect('/admin/productos');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditarProducto = (req, res) => {

    const idProducto = req.params.idProducto;

    Producto.findById(idProducto)
        .then((producto) => {
            if (!producto) {
                return res.redirect('/admin/productos');
            }
            res.render('admin/crear-editar-producto', { 
                titulo: 'Editar Producto', 
                path: '/admin/editar-producto',
                producto: producto,
                modoEdicion: true,
            })
        }).catch((err) => {
            console.log(err);
        });

}

exports.postEditarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    const nombre = req.body.nombre;
    const precio = parseFloat(req.body.precio);
    const urlImagen = req.body.urlImagen;
    const descripcion = req.body.descripcion;
    const categoria = req.body.categoria;
    const color = req.body.color;

    Producto.findById(idProducto)
        .then((producto) => {
            producto.nombre = nombre;
            producto.urlImagen = urlImagen;
            producto.descripcion = descripcion;
            producto.precio = precio;
            producto.categoria = categoria;
            producto.color = color;
            return producto.save();
        })
        .then((result) => {
            console.log('Producto guardado');
            res.redirect('/admin/productos');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postEliminarProducto = (req, res, next) => {

    const idProducto = req.body.idProducto;

    Producto.findByIdAndDelete(idProducto)
        .then((result) => {
            console.log('Producto eliminado');
            res.redirect('/admin/productos');
        }).catch((err) => {
            console.log(err);
        });
    
};


// Administracion de usuarios 
// exports.getUsuarios = (req, res) => {
//     let usuarios = [];
//     Usuario.fetchAll(usuariosObtenidos => {
//         usuarios = usuariosObtenidos;

//         res.render('admin/usuarios', {
//             users: usuarios,
//             titulo: "Administracion de Usuarios", 
//             path: "/admin/usuarios"
//         });
//     })


// };

// exports.getCrearUsuario = (req, res) => {
//     res.render('admin/crear-editar-usuario', { 
//         titulo: 'Crear usuario', 
//         path: '/crear-usuario',
//         modoEdicion: false
//     })
// };

// exports.postCrearUsuario = (req, res) => {
//     const nombre = req.body.nombre;
//     const email = req.body.email;
//     const password = req.body.password;
//     const role = req.body.role;

//     const usuario = new Usuario(null, nombre, email, password, role);

//     usuario.save();

//     res.redirect('/admin/usuarios')
// }

// exports.getEditarUsuario = (req, res) => {

//     const idUsuario = req.params.idUsuario;
//     Usuario.findById(idUsuario, usuario => {
//         console.log(usuario);
//         if (!usuario) {
//             return res.redirect('/admin/usuarios');
//         }
//         res.render('admin/crear-editar-usuario', { 
//             titulo: 'Editar Usuario', 
//             path: '/admin/editar-usuario',
//             usuario: usuario,
//             modoEdicion: true,
//         })
//     })
// }

// exports.postEditarUsuario = (req, res, next) => {
//     const idUsuario = req.body.idUsuario;
//     const nombre = req.body.nombre;
//     const email = req.body.email;
//     const password = req.body.password;
//     const role = req.body.role;
//     const usuarioActualizado = new Usuario(
//       idUsuario,
//       nombre,
//       email,
//       password,
//       role
//     );
//     usuarioActualizado.save();
//     res.redirect('/admin/usuarios');
// };

// exports.postEliminarUsuario = (req, res, next) => {
//     const idUsuario = req.body.idUsuario;
//     Usuario.deleteById(idUsuario);
//     res.redirect('/admin/usuarios');
// }


exports.getPedidos = (req, res) => {

    Pedido
        .find()
        .then((pedidos) => {
            res.render('admin/pedidos', {
                path: '/admin/pedidos',
                titulo: 'Todos los pedidos',
                pedidos: pedidos,
            })
        }).catch((err) => {
            console.log(err);
        });
};

exports.getEditarPedido = (req, res) => {
    const idPedido = req.params.idPedido;
    console.log(idPedido)

    Pedido.findById(idPedido)
        .then((pedido) => {
            if (!pedido) {
                return res.redirect('/admin/pedidos');
            }
            res.render('admin/editar-pedido', { 
                titulo: 'Editar Pedido', 
                path: '/admin/editar-pedido',
                pedido: pedido,
            })
        }).catch((err) => {
            console.log(err);
        });
}

exports.postEditarPedido = (req, res, next) => {
    const idPedido = req.body.idPedido;
    const estado = req.body.estado;
    const fechaEntrega = req.body.fechaEntrega;
    const precioTotal = req.body.precioTotal;

    Pedido.findById(idPedido)
        .then((pedido) => {
            console.log("Precio total del pedido: "+pedido.precioTotal);

            for (let i = 0; i < pedido.productos.length; i++) {
                const nuevaCantidad = parseInt(req.body[`cantidadProducto${i}`], 10);
                const cantidadAnterior = pedido.productos[i].cantidad;

                if (!isNaN(nuevaCantidad)) {
                    // actualizar cantidad de cada producto
                    pedido.productos[i].cantidad = nuevaCantidad;
                }

                const precio = pedido.productos[i].producto.precio;
                pedido.precioTotal = pedido.precioTotal - precio*cantidadAnterior + precio*nuevaCantidad;
            }
            
            pedido.estado = estado;
            pedido.fechaEntrega = fechaEntrega;
            return pedido.save();
        })
        .then((result) => {
            console.log('Pedido guardado');
            res.redirect('/admin/pedidos');
        })
        .catch((err) => {
            console.log(err);
        });
}