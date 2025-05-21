import React, { useEffect, useState } from "react";
import {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerCliente,
} from "../api/userService"; 

const ClienteForm = ({ onSubmit, cliente, onCancel }) => {
  const [formData, setFormData] = useState(cliente || {});

  useEffect(() => {
    setFormData(cliente || {});
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-2 gap-4">
        <input name="codigo" placeholder="Código" value={formData.codigo || ""} onChange={handleChange} className="input" />
        <input name="tipoCliente" placeholder="Tipo Cliente" value={formData.tipoCliente || ""} onChange={handleChange} className="input" />
        <input name="nombre" placeholder="Nombre" value={formData.nombre || ""} onChange={handleChange} className="input" />
        <input name="nombreExtranjero" placeholder="Nombre Extranjero" value={formData.nombreExtranjero || ""} onChange={handleChange} className="input" />
        <input name="grupo" placeholder="Grupo" value={formData.grupo || ""} onChange={handleChange} className="input" />
        <input name="moneda" placeholder="Moneda" value={formData.moneda || ""} onChange={handleChange} className="input" />
        <input name="nit" placeholder="NIT" value={formData.nit || ""} onChange={handleChange} className="input" />
        <input name="correoElectronico" placeholder="Correo Electrónico" value={formData.correoElectronico || ""} onChange={handleChange} className="input" />
        {/* Puedes seguir agregando más campos... */}
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
        <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const res = await listarClientes();
    setClientes(res.data);
  };

  const handleCrear = async (data) => {
    await crearCliente(data);
    cargarClientes();
    setModoEdicion(false);
  };

  const handleEditar = async (id) => {
    const res = await obtenerCliente(id);
    setClienteActual(res.data);
    setModoEdicion(true);
  };

  const handleActualizar = async (data) => {
    await actualizarCliente(data);
    cargarClientes();
    setModoEdicion(false);
  };

  const handleEliminar = async (id) => {
    await eliminarCliente(id);
    cargarClientes();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gestión de Clientes</h1>

      {modoEdicion ? (
        <ClienteForm
          cliente={clienteActual}
          onSubmit={clienteActual ? handleActualizar : handleCrear}
          onCancel={() => {
            setModoEdicion(false);
            setClienteActual(null);
          }}
        />
      ) : (
        <>
          <button onClick={() => setModoEdicion(true)} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">Nuevo Cliente</button>

          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="border p-2">Código</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Correo</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cli) => (
                <tr key={cli.id}>
                  <td className="border p-2">{cli.codigo}</td>
                  <td className="border p-2">{cli.nombre}</td>
                  <td className="border p-2">{cli.correoElectronico}</td>
                  <td className="border p-2 space-x-2">
                    <button onClick={() => handleEditar(cli.id)} className="text-blue-600">Editar</button>
                    <button onClick={() => handleEliminar(cli.id)} className="text-red-600">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Clientes;
