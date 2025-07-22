import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Configura axios para manejar la descarga de archivos
const apiClient = axios.create({
    baseURL: API_URL,
});

// --- Servicios de Actividades ---
const generateActivity = (age, keyword, activityType) => {
    return apiClient.post('/activities/generate', { age, keyword, activity_type: activityType });
};

const downloadActivityPdf = (text, keyword) => {
    return apiClient.post('/activities/download', { text, keyword }, {
        responseType: 'blob', // Importante para manejar la respuesta como un archivo
    });
};

// --- Servicios de Perfiles y Progreso ---
const getChildren = () => {
    return apiClient.get('/children');
};

const addChild = (name, age, userId) => {
    return apiClient.post('/children', { name, age, user_id: userId });
};

const saveProgress = (childId, activityText) => {
    return apiClient.post(`/children/${childId}/progress`, { activity_text: activityText });
};

const getProgress = (childId) => {
    return apiClient.get(`/children/${childId}/progress`);
};

const getUsers = () => {
    return apiClient.get('/users');
};

const addUser = (username, role) => {
    return apiClient.post('/users', { username, role });
};

// Exportar
export default {
    generateActivity,
    downloadActivityPdf,
    getChildren,
    addChild,
    saveProgress,
    getUsers,
    addUser,
    getProgress,
};