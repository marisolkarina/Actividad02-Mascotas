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


// exports.getPedidos = (req, res) => {
//     let pedidos = [];
//     Pedido.fetchAll(pedidosObtenidos => {
//         pedidos = pedidosObtenidos;

//         res.render('admin/pedidos', {
//             pedidos: pedidos,
//             titulo: "Administracion de Pedidos", 
//             path: "/admin/pedidos"
//         });
//     })


// };