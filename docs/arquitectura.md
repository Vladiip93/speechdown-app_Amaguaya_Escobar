graph TD
    subgraph "Usuario Final"
        A["Navegador Web"]
    end

    subgraph "Infraestructura Cloud / Servidor"
        C["Servidor Backend <br> (Python/Flask)"];
        D["Base de Datos <br> (PostgreSQL)"];
        F["API de Google Gemini"];
        G["Servicio gTTS"];
    end
    
    subgraph "Cliente"
        B["Aplicación Frontend <br> (React.js)"];
    end

    A -- "Carga la aplicación" --> B;
    B -- "Peticiones API REST (JSON)" --> C;
    C -- "Respuestas (JSON, Audio, PDF)" --> B;
    C -- "Consultas SQL" --> D;
    D -- "Resultados" --> C;
    C -- "Llamada a API (Prompt)" --> F;
    F -- "Respuesta de IA (Texto)" --> C;
    C -- "Lamada a librería (Texto)" --> G