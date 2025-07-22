import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressDashboard = () => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiService.getChildren()
            .then(response => {
                setChildren(response.data);
                if (response.data.length > 0) {
                    setSelectedChild(response.data[0].id);
                }
            })
            .catch(err => console.error("Error cargando perfiles:", err));
    }, []);

    useEffect(() => {
        if (selectedChild) {
            setLoading(true);
            apiService.getProgress(selectedChild)
                .then(response => {
                    setProgressData(response.data);
                })
                .catch(err => console.error("Error cargando progreso:", err))
                .finally(() => setLoading(false));
        }
    }, [selectedChild]);

    // --- INICIO DE LA NUEVA FUNCIÓN ---
    // Esta función maneja la descarga de un ejercicio del historial
    const handleDownloadHistoricActivity = async (activityText) => {
        // Creamos una palabra clave simple a partir del texto para el nombre del archivo
        const keyword = activityText.split(' ').slice(0, 2).join('_');
        try {
            const response = await apiService.downloadActivityPdf(activityText, keyword);
            // La lógica para crear y hacer clic en el enlace de descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `actividad_${keyword}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert('Error al descargar el PDF.');
        }
    };
    // --- FIN DE LA NUEVA FUNCIÓN ---

    const chartData = {
        labels: progressData.map(p => new Date(p.date).toLocaleDateString()).reverse(),
        datasets: [
            {
                label: 'Actividades Realizadas',
                data: progressData.map((_, index) => index + 1).reverse(),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Panel de Progreso y Biblioteca de Recursos</h2>
            
            <div className="mb-6">
                <label htmlFor="child-select" className="block text-gray-700 mb-2">Selecciona un perfil para ver su progreso:</label>
                <select
                    id="child-select"
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="w-full max-w-xs p-2 border rounded"
                >
                    {children.map(child => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                </select>
            </div>

            {loading && <p>Cargando datos...</p>}

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Evolución de Actividades</h3>
                {progressData.length > 0 ? <Line data={chartData} /> : <p>No hay datos suficientes para mostrar el gráfico.</p>}
            </div>

            {/* --- SECCIÓN MODIFICADA --- */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Historial de Actividades (Biblioteca)</h3>
                <ul className="space-y-2">
                    {progressData.length > 0 ? (
                        progressData.map((record, index) => (
                            <li key={index} className="text-gray-800 flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                <span className="flex-grow mr-4">
                                    <strong className="text-gray-600">{new Date(record.date).toLocaleString()}:</strong> {record.activity}
                                </span>
                                <button
                                    onClick={() => handleDownloadHistoricActivity(record.activity)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex-shrink-0"
                                >
                                    Descargar
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>No hay actividades guardadas en el historial de este perfil.</p>
                    )}
                </ul>
            </div>
            {/* --- FIN DE LA SECCIÓN MODIFICADA --- */}
        </div>
    );
};

export default ProgressDashboard;