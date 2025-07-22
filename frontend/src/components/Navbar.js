// frontend/src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    // Estilo para el enlace activo
    const activeLinkStyle = {
        textDecoration: 'underline',
        color: '#3b82f6' // Un azul más brillante para destacar
    };

    return (
        <nav className="bg-white shadow-md p-4 mb-8">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600">
                    SpeechDown 🗣️
                </div>
                <div className="flex gap-8 text-lg">
                    <NavLink 
                        to="/" 
                        style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        className="text-gray-700 hover:text-blue-500"
                    >
                        Inicio
                    </NavLink>
                    <NavLink 
                        to="/progreso" 
                        style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        className="text-gray-700 hover:text-blue-500"
                    >
                        Progreso
                    </NavLink>
                    <NavLink 
                        to="/gestion-usuarios" 
                        style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        className="text-gray-700 hover:text-blue-500"
                    >
                        Usuarios
                    </NavLink>
                    <NavLink 
                        to="/gestion-perfiles" 
                        style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                        className="text-gray-700 hover:text-blue-500"
                    >
                        Perfiles
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;