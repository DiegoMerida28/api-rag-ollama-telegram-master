import React, { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser, updateUser } from './services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      console.log('Respuesta del backend:', res.data);
      
      // Extrae los datos sin importar si vienen directo, en .data, .usuarios o .users
      let list = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (res.data && Array.isArray(res.data.usuarios)) {
        list = res.data.usuarios;
      } else if (res.data && Array.isArray(res.data.users)) {
        list = res.data.users;
      }

      setUsers(list);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al obtener la lista de usuarios');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await updateUser(editingId, form);
        setSuccess('Usuario actualizado con éxito');
        setEditingId(null);
      } else {
        await createUser(form);
        setSuccess('Usuario creado con éxito');
      }
      setForm({ nombre: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || err.response?.data?.error || 'Error al guardar el usuario';
      setError(msg);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ nombre: user.nombre || '', email: user.email || '', password: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await deleteUser(id);
      setSuccess('Usuario eliminado');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar usuario');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nombre: '', email: '', password: '' });
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#1e1e1e', minHeight: '100vh' }}>
      <h1>Gestión de Usuarios</h1>
      
      {error && <div style={{ color: '#ff6b6b', backgroundColor: '#3d0000', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
      {success && <div style={{ color: '#51cf66', backgroundColor: '#0b3d00', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
          required
        />
        <input
          type="password"
          placeholder={editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
          required={!editingId}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', backgroundColor: editingId ? '#f59f00' : '#228be6', color: '#fff', border: 'none' }}>
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#868e96', color: '#fff', border: 'none' }}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Lista de Usuarios ({users.length})</h2>
      {users.length === 0 ? (
        <p style={{ color: '#aaa' }}>No hay usuarios registrados aún.</p>
      ) : (
        <table style={{ width: '100%', maxWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id || u.email} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '10px' }}>{u.id}</td>
                <td style={{ padding: '10px' }}>{u.nombre}</td>
                <td style={{ padding: '10px' }}>{u.email}</td>
                <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(u)} style={{ padding: '4px 8px', backgroundColor: '#f59f00', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(u.id)} style={{ padding: '4px 8px', backgroundColor: '#e03131', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
