import React from 'react';
import ActivityGenerator from '../components/ActivityGenerator';

const HomePage = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-6">Plataforma SpeechDown</h1>
            <p className="text-center text-gray-600 mb-8">
                Bienvenido. Utiliza el generador para crear actividades de habla personalizadas.
            </p>
            <ActivityGenerator />
        </div>
    );
};

export default HomePage;