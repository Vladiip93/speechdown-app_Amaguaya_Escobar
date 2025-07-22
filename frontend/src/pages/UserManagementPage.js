// frontend/src/pages/UserManagementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import AddUserForm from '../components/AddUserForm';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await apiService.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-6">Gestión de Usuarios</h1>
            <AddUserForm onUserAdded={fetchUsers} />
            
            <div className="p-6 bg-white rounded-lg shadow-md">
                 <h3 className="text-xl font-bold mb-4">Usuarios Registrados</h3>
                 <ul className="list-disc pl-5">
                    {users.map(user => (
                        <li key={user.id} className="text-gray-800 text-lg mb-1">
                           ID: {user.id} - **{user.username}** {/* Mostramos el rol con un estilo diferente */}
                           <span className="ml-2 text-sm text-white font-semibold p-1 rounded-full bg-indigo-500">
                               {user.role}
                           </span>
                        </li>
                    ))}
                 </ul>
            </div>
        </div>
    );
};

export default UserManagementPage;