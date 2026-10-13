import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';


function App() {
  
  const [tFormularioClientes, setTformularioClientes] = useState(false);

  const [cliente, setCliente] = useState({
    id:'',
    nombre:'',
    telefono:''
  });

  const [jalarCliente, setJalarCliente] = useState([]);

  const [editar, setEditar] = useState(false);

  const [listaClientes, setListaClientes] = useState([]);

  function activarFormulario(){
    setTformularioClientes(true);
  };

  function cancelarFormulario(){
    setTformularioClientes(false);
    limpiarCliente();
    setEditar(false);
  };

  function limpiarCliente(){
    const nuevo = {
      nombre: '',
      telefono: ''
    }
    setCliente(prev => ({...prev, ...nuevo}))
  };

  function agregarCliente(){
    const existe = listaClientes.some(p => p.nombre.trim().toLowerCase() === cliente.nombre.trim().toLowerCase() && p.telefono.trim() === cliente.telefono.trim());

    if(existe){
      alert("Este cliente ya esta registrado");
    }
    else{
      axios.post("http://localhost:3001/agregarCliente",{
      nombre: cliente.nombre,
      telefono: cliente.telefono
    }).then(()=>{
      alert("Cliente agregado con exito!");
      limpiarCliente();
      clientes();
    }).catch(err=>{
      console.log("Error al tratar de agregar el registro", err);
    })
    }
  };

  function actualizarCliente(){
    const confirmar = window.confirm("Esta seguro que desea modificar este registro?");
    if(confirmar){
      axios.put("http://localhost:3001/actualizarCliente",{
      id: cliente.id,
      nombre: cliente.nombre,
      telefono: cliente.telefono
    }).then(()=>{
      alert("Registro modificado con éxito!");
      limpiarCliente();
      clientes();
      setEditar(false);
    })
    }
  };

  function llenarCampos(val){
    setEditar(true);
    const llenar = {
      id: val.id,
      nombre: val.nombre,
      telefono: val.telefono
    }
    setCliente(prev => ({...prev, ...llenar}))
  };

  function eliminarCliente(val){
    const confirmar = window.confirm("Esta seguro que desea eliminar este registro?");
    if(confirmar){
      axios.delete(`http://localhost:3001/eliminarCliente/${val.id}`).then(()=>{
      alert("El registro ha sido eliminado");
      clientes();
      }).then(err=>{
        console.log("No se pudo eliminar el producto", err);
      })
    }
  };

  function clientes(){
    axios.get("http://localhost:3001/clientes").then((response)=>{
      setListaClientes(response.data);
    })
  };

  /*-----------------------------------------------------------------------------Producto-----------------------------------------------------------------------------------*/

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    existencia: ""
  });

  const [listaProductos, setListaProductos] = useState([]);

  function activarFormularioProductos(){
    setTformularioProductos(true);
  };

  function cancelarFormularioProductos(){
    limpiarProducto();
    setTformularioProductos(false);
  };

  const [tFormularioProductos, setTformularioProductos] = useState(false);

  function limpiarProducto(){
    setEditar(false);
    const nuevo = {
      nombre: "",
      descripcion: "",
      precio: "",
      existencia: ""
    }
    setProducto(prev=>({...prev, ...nuevo}))
  };

  function llenarCamposProducto(val){
    setEditar(true);
    const nuevo = {
      id: val.id,
      nombre: val.nombre,
      descripcion: val.descripcion,
      precio: val.precio,
      existencia: val.existencia
    }
    setProducto(prev=>({...prev, ...nuevo}))
  };

  function productos(){
    axios.get("http://localhost:3001/productos").then((response)=>{
      setListaProductos(response.data);
    })
  };

  function agregarProducto(){
    const existe = listaProductos.some((p)=>
      p.nombre.trim().toLowerCase() === producto.nombre.trim().toLowerCase() && p.descripcion.trim().toLowerCase() === producto.descripcion.trim().toLowerCase()
    )
    if(existe){
      alert("Este producto ya existe en el inventario");
      return;
    }
    else{
      axios.post("http://localhost:3001/agregarProducto",{
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        existencia: producto.existencia
        }).then(()=>{
          alert("El registro se agregó con éxito");
          productos();
          limpiarProducto();
        }).catch(err =>{
          console.log("No se pudo actualizar el producto", err);
        })
    }
    
  };

  function actualizarProducto(){
    const confirmar = window.confirm("Esta seguro que desea modificar este producto");
    if(confirmar){
      axios.put("http://localhost:3001/actualizarProducto",{
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        existencia: producto.existencia
      }).then(()=>{
        alert("Producto modificado con éxito");
        productos();
        limpiarProducto();
      }).catch(err =>{
        console.log("No se pudo actualizar el producto", err);
      })
    }
    console.log(producto);
  };

  function eliminarProducto(val){
    const confirmar = window.confirm("Esta seguro que desea eliminar este producto?");
    if(confirmar){
      axios.delete(`http://localhost:3001/eliminarProducto/${val.id}`).then(()=>{
        alert("Producto eliminado con éxito");
        listaProductos();
      }).catch(err=>{
        console.log("No se pudo eliminar el producto", err);
      })
    }
  };

  /*------------------------------------------------------------------------facturacion--------------------------------------------------------------------------------------*/

  const [descripcion, setDescripcion] = useState("");

  const [elemento, setElemento] = useState([]);

  const [mercancias, setMercancias] = useState([]);

  const [buscar, setBuscar] = useState(false);

  const [facturacion, setFacturacion] = useState(false);

  const [listaFacturasCliente, setListaFacturasCliente] = useState([]);

  const [listadoFacturasCliente, setListadoFacturasCliente] = useState(false);

  const [listaDetalleFactura, setListaDetalleFactura] = useState([]);

  const [listadoDetalleFactura, setListadoDetalleFactura] = useState(false);

  const totalGeneral = mercancias.reduce(
    (acum, item) => acum + (item.precio * item.cantidad || 0), 0
  );

  function limpiarFacturacion(){
    setDescripcion("");
  };

  function cancelarElementos(){
    setElemento([]);
  };

  function agregarMercancia(val){
    /*setMercancias(prev =>
      prev.some(p => p.id === val.id)
      ?(alert("Ya se agrego ese elemento"), prev)
      :
      [...prev, val]
    );
    console.log(elemento);*/
    setMercancias(prev => {
      if(prev.some(p => p.id === val.id)){
        alert("Este producto ya se agrego");
        setDescripcion("");
        return prev
      }
      if(val.existencia <= 0){
        alert("No hay de este producto en existencia");
        setDescripcion("");
        return prev;
      }
      return [...prev, val]
    })
  };

  function quitarMercancia(val){
    const id = val.id
    const nuevo = mercancias.filter(e => e.id !== id);
    setMercancias(nuevo);
  };

  function facturar(){
    const hay = mercancias.every(item => {
      const producto = listaProductos.find(p => p.id === item.id);
      return producto.existencia >= item.cantidad;
    });

    if(hay){
      axios.post("http://localhost:3001/crearFactura", {
      id_cliente: jalarCliente[0].id,
      total: totalGeneral,
      listaProductos: mercancias
      }).then(()=>{
      alert("factura creada con éxito");
      setFacturacion(false);
      })
    }
    else{
      alert("La cantidad de uno de los productos excede la cantidad de existencia");
    }
  };

  function abrirFactura(val){
    setFacturacion(true);
    setJalarCliente(prev => ([...prev, val]));
  };

  useEffect(()=>{
    if(buscar){
      if(descripcion !== ""){
        fetch(`http://localhost:3001/buscarProducto/${descripcion}`)
        .then(res => res.json())
        .then(data => setElemento(data));
        setBuscar(false);
      }
    }
  },[descripcion, buscar]);

  function facturasCliente(val){
    setListadoFacturasCliente(true);
    axios.get(`http://localhost:3001/facturaCliente/${val.id}`)
    .then((result)=>{
      setListaFacturasCliente(result.data);
    })
  };

  function detalleFactura(val){
    setListadoDetalleFactura(true);
    axios.get(`http://localhost:3001/facturaDetalle/${val.id}`)
    .then((result)=>{
      setListaDetalleFactura(result.data);
    })
  };

  function limpiarTablas(){
    setListadoFacturasCliente(false);
    setListadoDetalleFactura(false);
  };

  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

  useEffect(()=>{
    clientes();
    productos();
  },[]);

  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

  return (
    <div className="App">
      <div className='encabezado'>
        <button onClick={()=>{activarFormulario(); cancelarFormularioProductos(); limpiarFacturacion(); setFacturacion(false); cancelarElementos()}}>Mantenimiento de clientes</button>
        <button onClick={()=>{activarFormularioProductos(); cancelarFormulario(); limpiarFacturacion(); setFacturacion(false); cancelarElementos()}}>Inventario</button>
        <button onClick={()=>{setFacturacion(true); cancelarFormulario(); cancelarFormularioProductos()}}>Facturacion</button>
      </div>
      
    {/*--------------------------------------------------------------------clientes--------------------------------------------------------------------------------------------*/}
      <br/>

        <div>
          {
            tFormularioClientes?
            <div className='App'>
              <div className='formularioClientes'>
                {
                  editar?
                  <h2>Editar cliente</h2>
                  :
                  <h2>Agregar cliente</h2>
                }
                <div className='campo'>
                  <label>Nombre:</label>
                  <input value={cliente.nombre} onChange={(event)=>{setCliente({...cliente, nombre: event.target.value})}}/>
                </div>
                <div className='campo'>
                  <label>Telefono:</label>
                  <input value={cliente.telefono} onChange={(event)=>{setCliente({...cliente, telefono: event.target.value})}}/>
                </div>
                {
                  editar?
                  <button onClick={()=>{actualizarCliente()}} className='btn-modificar'>Aceptar</button>
                  :
                  <button className='btnAceptar' onClick={()=>{agregarCliente()}}>Aceptar</button>
                }
                <button onClick={()=>{cancelarFormulario()}}>Cancelar</button>
              </div>

              <br></br>

              <table>
                <tbody>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Telefono</th>
                    <th>Acción</th>
                    <th></th>
                  </tr>
                  {
                    listaClientes.map((val)=>(
                      <tr key={val.id} className='datos'>
                        <td>{val.id}</td>
                        <td>{val.nombre}</td>
                        <td>{val.telefono}</td>
                        <td>
                          <div className='botones'>
                            <button onClick={()=>{llenarCampos(val)}} className='btn-modificar'>Modificar</button>
                            <button onClick={()=>{eliminarCliente(val)}} className='btn-eliminar'>Eliminar</button>
                          </div>
                        </td>
                        <td>
                          <button onClick={()=>{abrirFactura(val); cancelarFormulario(); cancelarFormularioProductos()}}>Crear factura</button>
                          <button onClick={()=>{facturasCliente(val)}} className='btnFacturasCliente'>Facturas del cliente</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              {
                listadoFacturasCliente?
                <table>
                  <tbody>
                    <tr>
                    <th>Id</th>
                    <th>Id del cliente</th>
                    <th>Cliente</th>
                    <th>Telefono</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                  {
                    listaFacturasCliente.map((val)=>(
                      <tr key={val.id} onClick={()=>{detalleFactura(val)}} className='listaFacturasCliente'>
                        <td>{val.id}</td>
                        <td>{val.id_cliente}</td>
                        <td>{val.nombre}</td>
                        <td>{val.telefono}</td>
                        <td>{val.total}</td>
                        <td>{val.fecha}</td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
                :
                <div></div>
              }
              <br></br>
              {
                listadoDetalleFactura?
                  <table>
                    <tbody>
                      <tr>
                        <th>Marca</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                      {
                        listaDetalleFactura.map((val)=>(
                          <tr key={val.id}>
                            <td>{val.marca}</td>
                            <td>{val.descripcion}</td>
                            <td>{val.precio}</td>
                            <td>{val.cantidad}</td>
                            <td>{val.subtotal}</td>
                          </tr>
                        ))
                      }
                      <tr>
                        <td colSpan={5}>
                          <button onClick={()=>{limpiarTablas()}} className='btnLimpiar'>Limpiar</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                : 
                <div></div>
              }
            </div>
            :
            <div></div>
          }
        </div>
{/*--------------------------------------------------------------------------productos----------------------------------------------------------------------------------------------*/}
        <div>
          {
            tFormularioProductos?
              <div className='App'>
                <div className='formularioProductos'>
                  {
                    editar?
                      <h2>Editar</h2>
                      :
                      <h2>Agregar producto</h2>
                  }
                  <div className='campo'>
                    <label>Nombre:</label>
                    <input type='text' value={producto.nombre} onChange={(event)=>{setProducto({...producto, nombre:event.target.value})}}/>
                  </div>
                  <div className='campo'>
                    <label>Descripcion:</label>
                    <input type='text' value={producto.descripcion} onChange={(event)=>{setProducto({...producto, descripcion:event.target.value})}}/>
                  </div>
                  <div className='campo'>
                    <label>Precio:</label>
                    <input type='decimal' value={producto.precio} onChange={(event)=>{setProducto({...producto, precio:event.target.value})}}/>
                  </div>
                  <div className='campo'>
                    <label>Existencia:</label>
                    <input type='number' value={producto.existencia} onChange={(event)=>{setProducto({...producto, existencia:event.target.value})}}/>
                  </div>
                  {
                    editar?
                      <button onClick={()=>{actualizarProducto()}}>Actualizar</button>
                      :
                      <button className='btnAceptar' onClick={()=>{agregarProducto()}}>Aceptar</button>
                  }
                  <button onClick={()=>{cancelarFormularioProductos()}}>Cancelar</button>
                </div>

                <br></br>

                <table>
                  <tbody>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Descripcion</th>
                      <th>Precio</th>
                      <th>Existencia</th>
                      <th>Accion</th>
                    </tr>
                    {
                      listaProductos.map((val)=>(
                        <tr key={val.id}>
                          <td>{val.id}</td>
                          <td>{val.nombre}</td>
                          <td>{val.descripcion}</td>
                          <td>{val.precio}</td>
                          <td>{val.existencia}</td>
                          <td>
                            <button className='btnActualizarProducto' onClick={()=>{llenarCamposProducto(val)}}>Actualizar</button>
                            <button className='btnEliminarProducto' onClick={()=>{eliminarProducto(val)}}>Eliminar</button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              :
              <div></div>
          }
        </div>
{/*---------------------------------------------------------------------------facturacion-------------------------------------------------------------------------------------*/}
        <div>
          {
            facturacion?
              <div className='facturacion'>
                <h2>Sistema de facturacion</h2>
                <input type='text' value={descripcion} onChange={(event)=>{setDescripcion(event.target.value)}}/>
                <button type='text' onClick={()=>{setBuscar(true)}}>Buscar producto</button>
                <button onClick={()=>{limpiarFacturacion(); setFacturacion(false)}}>Cancelar</button>
                <br></br>
                <table>
                  <tbody>
                    <tr>
                      <th>Id</th>
                      <th>Marca</th>
                      <th>Descripcion</th>
                      <th>Precio</th>
                      <th>Existencia</th>
                      <th>Accion</th>
                    </tr>
                    {
                      elemento.map((val)=>(
                        <tr key={val.id}>
                          <td>{val.id}</td>
                          <td>{val.nombre}</td>
                          <td>{val.descripcion}</td>
                          <td>{val.precio}</td>
                          <td>{val.existencia}</td>
                          <td>
                            <button onClick={()=>{agregarMercancia(val)}}>Agregar</button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>

                <br></br>
                <h2>Detalle de factura</h2>
                
                  {jalarCliente.length > 0 && (
                    <h3>Cliente: {jalarCliente[0].nombre}</h3>
                  )}
                
                <table>
                    <tbody>
                      <tr>
                        <th>Id</th>
                        <th>Marca</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>SubTotal</th>
                        <th></th>
                      </tr>
                      {
                        mercancias.map((val)=>(
                          <tr key={val.id}>
                            <td>{val.id}</td>
                            <td>{val.nombre}</td>
                            <td>{val.descripcion}</td>
                            <td>{val.precio}</td>
                            <td>
                              <input type='number' value={val.cantidad || ""} onChange={(e) => {
                                const listaNueva = mercancias.map(p => p.id === val.id
                                  ?{...p, cantidad: Number(e.target.value)}
                                  : p
                                );
                                setMercancias(listaNueva);
                              }}/>
                            </td>
                            <td>{val.cantidad ? val.cantidad * val.precio : ""}</td>
                            <td>
                              <button onClick={()=>{quitarMercancia(val)}}>Quitar</button>
                            </td>
                          </tr>
                        ))  
                      }
                      <tr>
                        <td colSpan={5} className='tituloTotal'>Total</td>
                        <td colSpan={2} className='celdaTotal'>{totalGeneral}</td>
                      </tr>
                    </tbody>
                </table>
                <button onClick={()=>{facturar()}}>Facturar</button>
              </div>
              :
              <div></div>
          }
        </div>

        

    </div>
  );
}

export default App;
