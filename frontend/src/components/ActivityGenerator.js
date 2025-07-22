import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const ActivityGenerator = () => {
    // Estados para el formulario y la actividad
    const [age, setAge] = useState(6);
    const [keyword, setKeyword] = useState('perro');
    const [activityType, setActivityType] = useState('cuento');
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');

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

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setActivity(null);
        try {
            // Enviamos el nuevo estado 'activityType' a la API
            const response = await apiService.generateActivity(age, keyword, activityType);
            setActivity(response.data);
        } catch (err) {
            setError('Error al generar la actividad. Revisa la conexión con el backend.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProgress = async () => {
        if (!selectedChild || !activity) return;
        try {
            await apiService.saveProgress(selectedChild, activity.generated_text);
            alert('¡Progreso guardado exitosamente!');
        } catch (err) {
            alert('Error al guardar el progreso.');
        }
    };

    const handleDownloadPdf = async () => {
        if (!activity) return;
        try {
            const response = await apiService.downloadActivityPdf(activity.generated_text, keyword);
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Generador de Actividades con IA</h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* --- INICIO DE NUEVOS CAMPOS --- */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Tipo de Actividad</label>
                        <select
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="cuento">Cuento Corto</option>
                            <option value="adivinanza">Adivinanza</option>
                            <option value="fonema_s">Práctica Fonema /s/</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Palabra Clave / Tema</label>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Edad del Niño</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    {/* --- FIN DE NUEVOS CAMPOS --- */}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
                    {loading ? 'Generando...' : 'Crear Juego'}
                </button>
            </form>
            
            {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>} 
             
            
            {/* Sección de Resultados */}
            {activity && (
                <div className="mt-6 p-4 bg-gray-100 rounded">
                    <h3 className="font-bold">Resultado</h3>
                    <p className="my-2">{activity.generated_text}</p>
                    
                    <h4 className="font-semibold mt-4">Retroalimentación Auditiva 🔊</h4>
                    {activity.audio_feedback_url && (
                        <audio 
                            src={`http://localhost:5001${activity.audio_feedback_url}`} 
                            key={activity.audio_feedback_url} 
                            controls 
                            className="w-full mt-2"
                        >
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    )}
                    
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <select
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="" disabled>Selecciona un perfil</option>
                            {children.map(child => (
                                <option key={child.id} value={child.id}>{child.name}</option>
                            ))}
                        </select>
                        <button onClick={handleSaveProgress} disabled={!selectedChild} className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
                            Guardar Progreso
                        </button>
                        <button onClick={handleDownloadPdf} className="bg-red-500 text-white px-4 py-2 rounded">
                            Descargar PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityGenerator;