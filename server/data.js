const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'sistema_de_ventas_2'
});

/*-----------------------------------------------------------------------------Cliente----------------------------------------------------------------------------------------*/

app.get("/clientes", (req, res)=>{
  db.query("select * from clientes",
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
  )
});

app.post("/agregarCliente", (req, res)=>{
  const nombre = req.body.nombre;
  const telefono = req.body.telefono;

  db.query("insert into clientes(nombre, telefono) values(?,?)", [nombre, telefono],
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
  )
});

app.put("/actualizarCliente", (req, res)=>{
  const id = req.body.id;
  const nombre = req.body.nombre;
  const telefono = req.body.telefono;

  db.query("update clientes set nombre=?, telefono=? where id=?", [nombre, telefono, id]),
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
});

app.delete("/eliminarCliente/:id", (req, res)=>{
  const id = req.params.id;

  db.query("delete from clientes where id=?", [id],
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
  )
});

/*---------------------------------------------------------------------Producto----------------------------------------------------------------------------------------------*/

app.post("/agregarProducto", (req, res)=>{
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  const existencia = req.body.existencia;

  db.query("insert into productos(nombre, descripcion, precio, existencia) values(?, ?, ?, ?)", [nombre, descripcion, precio, existencia],
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
  )
});

app.get("/productos", (req, res)=>{
  db.query("select * from productos",
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
  )
});

app.put("/actualizarProducto", (req, res)=>{
  const id = req.body.id;
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  const existencia = req.body.existencia;

  db.query("update productos set nombre=?, descripcion=?, precio=?, existencia=? where id=?", [nombre, descripcion, precio, existencia, id],
  (err, result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  }
)
});

app.delete("/eliminarProducto/:id", (req, res)=>{
  const id = req.params.id;

  db.query("delete from productos where id=?", [id],
  (err, result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  }
)
});

/*---------------------------------------------------------------------------Facturacion---------------------------------------------------------------------------------------*/

app.get("/buscarProducto/:descripcion", (req, res)=>{
  const descripcion = req.params.descripcion;
  if(descripcion === ""){
    return res.json([]);
  }
  else{
    db.query(`select * from productos where descripcion like "%${descripcion}%" or nombre like "%${descripcion}%"`,
      (err, result)=>{
        if(err){
          console.log(err);
        }
        else{
          res.send(result);
        }
      }
    )
  }
});

app.get("/buscarCliente/:id", (req, res)=>{
  const id = req.params.id;
  db.query("select * from clientes where id=?", [id],
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
  )
});

app.post("/crearFactura", (req, res)=>{
  const {id_cliente, total, listaProductos} = req.body;
  db.query("insert into facturas(id_cliente, total) values(?,?)", [id_cliente, total],
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        const idFactura = result.insertId;
        
        const promesas = listaProductos.map(producto => {
          db.query("insert into detalleFactura(id_producto, id_factura, precio, cantidad, subtotal) values(?,?,?,?,?)",
             [producto.id, idFactura, producto.precio, producto.cantidad, producto.precio * producto.cantidad],
              (err)=>{
                if(err){
                  console.log(err);
                }
                else{
                  db.query("update productos set existencia = existencia - ? where id = ?", [producto.cantidad, producto.id],
                    (err)=>{
                      console.log(err);
                    }
                  )
                }
              })
        });
        Promise.all(promesas);
      }
      
    }
  )
  res.send();
});

/*app.get("/facturaCliente/:id_cliente", (req, res)=>{
  const id_cliente = req.params.id_cliente;
  db.query("select * from facturas where id_cliente = ?", [id_cliente],
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
  )
});*/

app.get("/facturaCliente/:id_cliente", (req, res)=>{
  const id_cliente = req.params.id_cliente;
  db.query("SELECT facturas.id, id_cliente, c.nombre, c.telefono, total, fecha FROM facturas JOIN clientes c ON facturas.id_cliente = c.id WHERE id_cliente = ?", [id_cliente],
    (err, result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
      }
    }
  )
});

app.get("/facturaDetalle/:id_factura", (req, res)=>{
 const id_factura = req.params.id_factura;
 db.query("SELECT c.nombre, c.telefono, p.nombre as marca, p.descripcion, d.precio, d.cantidad ,d.subtotal, total FROM facturas JOIN detallefactura d ON facturas.id = d.id_factura JOIN clientes c ON facturas.id_cliente = c.id JOIN productos p ON d.id_producto = p.id WHERE facturas.id = ?", [id_factura],
  (err, result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  }
 )
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.listen(3001, ()=>{
  console.log("conectado");
});