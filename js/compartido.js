// Datos compartidos entre la escena 3D y la interfaz (sin bibliotecas 3D)
export const pisos = { y1: 0 };                // desplazamiento animado del primer piso (edificio principal)
export const pisosRes = { y1: 0, v1: true };   // primer piso de la residencia
export const capa = { items: new Map() };      // etiquetas HTML sobre la maqueta: id -> { s, el }
