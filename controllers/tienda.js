const productos = [];
const Producto = require('../models/producto');
const Carrito = require('../models/carrito');

exports.getProductos = (req, res) => {

    Producto.find()
        .then((productos) => {
            res.render('tienda/lista-productos', {
                prods: productos,
                titulo: "Productos de la tienda", 
                path: "/productos"
            });
        }).catch((err) => {
            console.log(err);
        });
};

exports.getIndex = (req, res) => {

    Producto.find()
        .then((productos) => {
            res.render('tienda/index', {
                prods: productos,
                titulo: "Pagina principal de la Tienda", 
                path: "/"
            });
        }).catch((err) => {
            console.log(err);
        });

}

exports.getProductosPorCategoria = (categoria) => {
    
    return (req, res) => {

        Producto.find()
            .then((productosObtenidos) => {
                const productosFiltrados = productosObtenidos.filter(producto => 
                    producto.categoria.toLowerCase() === categoria.toLowerCase() 
                );
    
                res.render('tienda/lista-productos', {
                    prods: productosFiltrados,
                    titulo: `${categoria}`,
                    path: `/productos/${categoria}`
                })
            }).catch((err) => {
                console.log(err);
            });
    }
}

//ordenar productos de menor a mayor precio
exports.getProductosMenorMayor = (req, res) => {

    Producto.find()
        .then((productosObtenidos) => {
            const productosOrdenados = productosObtenidos.sort((prod1, prod2) => prod1.precio - prod2.precio);        
            res.render('tienda/lista-productos', {
                prods: productosOrdenados,
                titulo: "Productos ordenados", 
                path: "/productos/ordenar/menor-a-mayor"
                
            });
        }).catch((err) => {
            console.log(err);
        });

}
//ordenar productos de mayor a menor precio
exports.getProductosMayorMenor = (req, res) => {

    Producto.find()
        .then((productosObtenidos) => {
            const productosOrdenados = productosObtenidos.sort((prod1, prod2) => prod2.precio - prod1.precio);        
            res.render('tienda/lista-productos', {
                prods: productosOrdenados,
                titulo: "Productos ordenados", 
                path: "/productos/ordenar/mayor-a-menor"
            });
        }).catch((err) => {
            console.log(err);
        });

}
//ordenar productos alfabeticamente
exports.getProductosAlfabeticamente = (req, res) => {
    Producto.find()
    .then((productosObtenidos) => {
        const productosOrdenados = productosObtenidos.sort((prod1, prod2) => prod1.nombre.localeCompare(prod2.nombre)); 

        res.render('tienda/lista-productos', {
            prods: productosOrdenados,
            titulo: "Productos ordenados", 
            path: "/productos/ordenar/alfabeticamente"
        });
    }).catch((err) => {
        console.log(err);
    });

}

// filtrar productos por color
exports.getProductosPorColor = (color) => {
    return (req, res) => {
        Producto.find()
            .then((productosObtenidos) => {
                const productosFiltrados = productosObtenidos.filter(producto => 
                    producto.color.toLowerCase() === color.toLowerCase() 
                );
    
                res.render('tienda/lista-productos', {
                    prods: productosFiltrados,
                    titulo: `${color}`,
                    path: `/productos/${color}`
                })
            }).catch((err) => {
                console.log(err);
            });
    }
}

//ver detalle de un producto
exports.getProducto = (req, res) => {
    const idProducto = req.params.idProducto;
    Producto.findById(idProducto)
        .then((producto) => {
            res.render('tienda/producto-detalle', {
                producto: producto,
                titulo: producto.nombre, 
                path: `/productos/:${idProducto}`
            });
        }).catch((err) => {
            console.log(err);
        });
}

//mostrar productos buscados por palabra
exports.postProductoPalabra = (req, res) => {
    const stringBuscado = req.body.textoIngresado;

    Producto.find()
        .then((productos) => {
            const productosBuscados = productos.filter(prod => prod.nombre.toLowerCase().includes(stringBuscado.toLowerCase()));
            res.render('tienda/lista-productos', {
                prods: productosBuscados,
                titulo: 'Productos buscados', 
                path: '/productos'
            });
        }).catch((err) => {
            console.log(err);
        });
    
}


// exports.getCarrito = (req, res, next) => {

//     Carrito.getCarritoFromFile(carrito => {
//         Producto.fetchAll(productos => {
//             const productosEnCarrito = [];
//             for (let prod of carrito.productos) {
//                 const productoEncontrado = productos.find(p => p.id === prod.id);
//                 if (productoEncontrado) {
//                     productosEnCarrito.push({
//                         ...productoEncontrado,
//                         cantidad: prod.cantidad
//                     });
//                 }
//             }
//                 res.render('tienda/carrito', {
//                 path: '/carrito',
//                 titulo: 'Mi Carrito',
//                 carrito: {
//                     productos: productosEnCarrito,
//                     total: carrito.precioTotal
//                 }
//             });
//         });
//     });
// };

// exports.postCarrito = (req, res) => {
//     const idProducto = req.body.idProducto;
//     const cantidad = parseInt(req.body.cantidad, 10);
//     const nombreProducto = req.body.nombreProducto;

//     Producto.findById(idProducto, producto => {
//         Carrito.agregarProducto(idProducto, producto.precio, cantidad, nombreProducto);
//         res.redirect('/carrito');
//     })
// }

// exports.postEliminarProductoCarrito = (req, res) => {
//     const idProducto = req.body.idProducto;

//     Producto.findById(idProducto, producto => {

//         Carrito.eliminarProducto(idProducto, producto.precio);
//         res.redirect('/carrito');
//     })
    
// }

// exports.postActualizarCantidadCarrito = (req, res) => {
//     const idProducto = req.body.idProducto;
//     const nuevaCantidad = parseInt(req.body.cantidad, 10);

//     Producto.findById(idProducto, producto => {
//         Carrito.actualizarCantidadProducto(idProducto, nuevaCantidad, producto.precio);
//         res.redirect('/carrito');
//     });
// };

