// data.js - Base de datos de recursos, trucos y preguntas de aula

const DATABASE_RECURSOS = [
  {
    id: "rec-01",
    titulo: "Cuaderno de Fracciones Visuales",
    descripcion: "Fichas listas para imprimir con situaciones cotidianas (repartos, recetas y retos visuales) para 4º y 5º de Primaria.",
    rama: "matematicas",
    ramaTexto: "Matemáticas & Lógica",
    formato: "pdf",
    formatoTexto: "PDF Imprimible",
    nivel: "Primaria (4º - 5º)",
    peso: "2.4 MB",
    tipoAccion: "descarga",
    enlace: "https://drive.google.com/uc?export=download&id=TU_ID_DE_DRIVE",
    badgeColor: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900",
    isNew: true,
    tags: ["fracciones", "matematicas", "primaria", "fichas", "pdf"]
  },
  {
    id: "rec-02",
    titulo: "Cuaderno Docente y Evaluador Trimestral",
    descripcion: "Plantilla en Google Sheets con cálculo automático de medias, ponderación por competencias y control de asistencia diario.",
    rama: "competencia-digital",
    ramaTexto: "Competencia Digital",
    formato: "drive",
    formatoTexto: "Plantilla Google Sheets",
    nivel: "Docentes",
    peso: "Auto-Copia",
    tipoAccion: "copia-drive",
    enlace: "https://docs.google.com/spreadsheets/d/TU_ID_DE_DRIVE/copy",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
    isNew: true,
    tags: ["notas", "evaluacion", "excel", "sheets", "drive", "trimestre"]
  },
  {
    id: "rec-03",
    titulo: "Escape Room: El Misterio de las Fracciones",
    descripcion: "Misión gamificada interactiva donde el alumnado debe desbloquear 5 candados lógicos trabajando en equipo en el aula.",
    rama: "gamificacion-retos",
    ramaTexto: "Gamificación & Retos",
    formato: "interactivo",
    formatoTexto: "100% Interactivo",
    nivel: "Primaria (4º - 6º)",
    peso: "Web / PDI",
    tipoAccion: "jugar",
    enlace: "https://view.genially.com/",
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-900",
    isNew: false,
    tags: ["escape room", "genially", "juego", "gamificacion", "matematicas"]
  },
  {
    id: "rec-04",
    titulo: "Tarjetas de Roles para Aprendizaje Cooperativo",
    descripcion: "Kit imprimible de tarjetas de mesa (Coordinador, Portavoz, Secretario y Controlador de Tiempo/Ruido) listas para plastificar.",
    rama: "organizacion",
    ramaTexto: "Organización de Aula",
    formato: "pdf",
    formatoTexto: "PDF Imprimible",
    nivel: "Todos los niveles",
    peso: "1.5 MB",
    tipoAccion: "descarga",
    enlace: "https://drive.google.com/uc?export=download&id=TU_ID_DE_DRIVE",
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900",
    isNew: false,
    tags: ["cooperativo", "roles", "equipos", "aula", "pdf"]
  },
  {
    id: "rec-05",
    titulo: "Estructura de Carpetas: Google Drive sin Caos",
    descripcion: "Guía paso a paso con nomenclatura, código de colores y atajos para organizar todo tu curso escolar en la nube.",
    rama: "competencia-digital",
    ramaTexto: "Competencia Digital",
    formato: "pdf",
    formatoTexto: "Guía PDF",
    nivel: "Docentes & Alumnos",
    peso: "1.8 MB",
    tipoAccion: "descarga",
    enlace: "https://drive.google.com/uc?export=download&id=TU_ID_DE_DRIVE",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900",
    isNew: true,
    tags: ["drive", "orden", "carpetas", "tutorial", "productividad"]
  },
  {
    id: "rec-06",
    titulo: "Reto Semanal de Cálculo Mental y Estimación",
    descripcion: "Presentación interactiva para proyectar 5 minutos al inicio de la clase de matemáticas y entrenar agilidad numérica.",
    rama: "matematicas",
    ramaTexto: "Matemáticas & Lógica",
    formato: "drive",
    formatoTexto: "Google Slides",
    nivel: "Primaria",
    peso: "Auto-Copia",
    tipoAccion: "copia-drive",
    enlace: "https://docs.google.com/presentation/d/TU_ID_DE_DRIVE/copy",
    badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900",
    isNew: false,
    tags: ["calculo", "matematicas", "presentacion", "slides"]
  }
];

// Trucos rápidos de TikTok (Academia Exprés)
const DATABASE_HACKS = [
  {
    titulo: "Forzar copia en Drive",
    explicacion: "Cambia el final de cualquier enlace compartido de '/edit' a '/copy' para que nadie modifique tu original.",
    comando: "/copy",
    videoUrl: "https://tiktok.com"
  },
  {
    titulo: "Encontrar archivos gigantes",
    explicacion: "Escribe este comando en el buscador de Google Drive para listar los archivos que más espacio ocupan.",
    comando: "size:>25M",
    videoUrl: "https://tiktok.com"
  },
  {
    titulo: "Descarga directa en PDF",
    explicacion: "Reemplaza '/edit' por este código en tus Google Docs para enviar un link que descargue el PDF directo.",
    comando: "/export?format=pdf",
    videoUrl: "https://tiktok.com"
  },
  {
    titulo: "Nuevo Documento al instante",
    explicacion: "Escribe esto en la barra de direcciones del navegador para abrir un Google Doc en blanco en 1 segundo.",
    comando: "doc.new",
    videoUrl: "https://tiktok.com"
  }
];

// Banco de preguntas para la herramienta 6 (PDI)
const PROMPT_QUESTIONS = {
  inicio: [
    "¿Qué es lo más curioso que aprendiste ayer fuera del colegio?",
    "Si pudieras inventar una asignatura nueva para este curso, ¿de qué trataría?",
    "Explica en una sola frase qué recuerdas del tema que vimos en la última sesión.",
    "¿Qué superpoder elegirías hoy para resolver los retos de la clase?"
  ],
  logica: [
    "Si repartimos 3 pizzas entre 4 amigos a partes iguales, ¿qué fracción come cada uno?",
    "Tengo más de 3 lados y menos de 5. Todos mis lados miden lo mismo. ¿Qué figura soy?",
    "Calcula mentalmente: El doble de 35 más la mitad de 50.",
    "Un tren eléctrico viaja de norte a sur. ¿Hacia qué dirección va el humo?"
  ],
  cierre: [
    "¿Qué ha sido lo más difícil del reto de hoy y cómo lo has superado?",
    "Si tuvieras que explicarle lo aprendido hoy a un compañero que faltó, ¿qué le dirías?",
    "¿Qué nota del 1 al 5 le pones hoy al trabajo en equipo de tu mesa y por qué?",
    "Dime una duda que todavía tengas antes de terminar la clase."
  ]
};
