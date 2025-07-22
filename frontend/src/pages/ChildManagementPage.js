import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

const ChildManagementPage = () => {
    // Estados para la lista de niños y usuarios
    const [children, setChildren] = useState([]);
    const [users, setUsers] = useState([]);

    // Estados para el formulario
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');

    // Función para cargar los datos
    const fetchData = useCallback(async () => {
        try {
            const usersRes = await apiService.getUsers();
            const childrenRes = await apiService.getChildren();
            setUsers(usersRes.data);
            setChildren(childrenRes.data);
            if (usersRes.data.length > 0) {
                setSelectedUser(usersRes.data[0].id);
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!name || !age || !selectedUser) {
            setMessage('Todos los campos son obligatorios.');
            return;
        }
        try {
            await apiService.addChild(name, parseInt(age), parseInt(selectedUser));
            setMessage(`¡Perfil para "${name}" creado con éxito!`);
            setName('');
            setAge('');
            fetchData(); // Refrescar la lista de niños
        } catch (error) {
            setMessage('Error al crear el perfil.');
            console.error(error);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-6">Gestión de Perfiles de Niños</h1>
            
            {/* Formulario para crear perfil */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Crear Nuevo Perfil</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del niño" className="p-2 border rounded" />
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Edad" className="p-2 border rounded" />
                    <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="p-2 border rounded">
                        <option value="" disabled>Asociar a usuario...</option>
                        {users.map(user => <option key={user.id} value={user.id}>{user.username} ({user.role})</option>)}
                    </select>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Añadir Perfil</button>
                </form>
                {message && <p className="mt-4 text-gray-600">{message}</p>}
            </div>

            {/* Lista de perfiles existentes */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Perfiles Registrados</h3>
                <ul className="list-disc pl-5">
                    {children.map(child => (
                        <li key={child.id} className="text-gray-800 text-lg">
                           {child.name}, {child.age} años (Asociado a Usuario ID: {child.user_id})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChildManagementPage;