// frontend/src/components/AddUserForm.js
import React, { useState } from 'react';
import apiService from '../services/apiService';

const AddUserForm = ({ onUserAdded }) => {
    const [username, setUsername] = useState('');
    // Nuevo estado para el rol, con valor por defecto
    const [role, setRole] = useState('terapeuta');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!username) {
            setMessage('El nombre de usuario no puede estar vacío.');
            return;
        }

        try {
            // Enviamos el username y el rol
            await apiService.addUser(username, role);
            setMessage(`¡Usuario "${username}" creado con éxito como ${role}!`);
            setUsername('');
            onUserAdded();
        } catch (error) {
            setMessage('Error: El nombre de usuario ya existe o hubo un problema.');
            console.error(error);
        }
    };

    return (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nombre del usuario"
                    className="p-2 border rounded w-full sm:w-auto"
                />
                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="p-2 border rounded w-full sm:w-auto"
                >
                    <option value="terapeuta">Terapeuta</option>
                    <option value="padre">Padre/Madre</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Añadir Usuario
                </button>
            </form>
            {message && <p className="mt-4 text-gray-600">{message}</p>}
        </div>
    );
};

export default AddUserForm;