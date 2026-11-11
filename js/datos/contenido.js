// =========================================================
// Textos del sitio (todo en español, nivel 4º / 4e)
// =========================================================

export const COLEGIO = {
  nombre: 'Colegio Aurora',
  tipo: 'Colegio-internado del futuro',
  lugar: 'Valencia, España',
  eslogan: 'Aprender hoy, brillar mañana.',
  presentacion: 'Bienvenidos a nuestro colegio ideal. Es un colegio-internado moderno en Valencia, cerca del mar. Aquí estudiamos, vivimos y practicamos deporte juntos.',
};

export const CIFRAS = [
  { n: '15', t: 'espacios en la planta baja' },
  { n: '12', t: 'habitaciones dobles' },
  { n: '7', t: 'instalaciones deportivas' },
  { n: '9', t: 'asignaturas' },
];

export const MENU = [
  { id: 'inicio', t: 'Inicio' },
  { id: 'explorar', t: 'Explorar en 3D' },
  { id: 'colegio', t: 'Nuestro colegio' },
  { id: 'aulas', t: 'Nuestras aulas' },
  { id: 'internado', t: 'Nuestro internado' },
  { id: 'deportes', t: 'Nuestro complejo deportivo' },
  { id: 'asignaturas', t: 'Nuestras asignaturas' },
  { id: 'horario', t: 'Nuestro horario' },
  { id: 'uniforme', t: 'Nuestro uniforme' },
  { id: 'ideal', t: '¿Por qué es ideal?' },
];

export const ZONAS_CAMPUS = [
  { id: 'edificio', t: 'Edificio principal', icono: 'edificio', color: '#3d8bff', txt: 'Tiene dos plantas. En la planta baja están las aulas y en el primer piso está el internado.' },
  { id: 'patio', t: 'Patio central', icono: 'arbol', color: '#34d399', txt: 'Hay una gran fuente, árboles, bancos y una pérgola con paneles solares.' },
  { id: 'jardin', t: 'Jardines', icono: 'hoja', color: '#4ade80', txt: 'Hay un estanque, un huerto y un anfiteatro para las clases al aire libre.' },
  { id: 'gimnasio', t: 'Complejo deportivo', icono: 'balon', color: '#38bdf8', txt: 'Hay un gimnasio, una piscina, un campo de fútbol y muchas pistas.' },
];

// Orden exacto de la lista del proyecto
export const ASIGNATURAS = [
  { id: 'svt', nombre: 'Ciencias de la vida y de la Tierra', fr: 'SVT', color: '#34d399', icono: 'svt', sala: 'svt',
    desc: 'Observamos las plantas, los animales y el cuerpo humano con el microscopio.' },
  { id: 'edfisica', nombre: 'Educación física', fr: 'EPS', color: '#38bdf8', icono: 'edfisica', sala: 'gimnasio',
    desc: 'Practicamos deporte en el gimnasio, en la piscina y en el campo de fútbol.' },
  { id: 'fisica', nombre: 'Física y química', fr: 'Physique-chimie', color: '#22d3ee', icono: 'fisica', sala: 'fisica',
    desc: 'Hacemos experimentos en el laboratorio y aprendemos cómo funciona la materia.' },
  { id: 'historia', nombre: 'Historia y geografía', fr: 'Histoire-géographie', color: '#f2a541', icono: 'historia', sala: 'historia',
    desc: 'Estudiamos el pasado y descubrimos los países, los ríos y las montañas del mundo.' },
  { id: 'frances', nombre: 'Francés', fr: 'Français', color: '#6c7bff', icono: 'frances', sala: 'frances',
    desc: 'Leemos libros, escribimos textos y hablamos en francés con nuestros compañeros.' },
  { id: 'mates', nombre: 'Matemáticas', fr: 'Mathématiques', color: '#3d8bff', icono: 'mates', sala: 'mates',
    desc: 'Calculamos, resolvemos problemas y estudiamos la geometría. ¡Los números están en todas partes!' },
  { id: 'tecno', nombre: 'Tecnología', fr: 'Technologie', color: '#8b5cf6', icono: 'tecno', sala: 'tecno',
    desc: 'Programamos robots, usamos ordenadores y creamos objetos con la impresora 3D.' },
  { id: 'ingles', nombre: 'Inglés', fr: 'Anglais', color: '#ff5d73', icono: 'ingles', sala: 'ingles',
    desc: 'Hablamos, cantamos y vemos vídeos en inglés. Es muy útil para viajar.' },
  { id: 'musica', nombre: 'Música', fr: 'Musique', color: '#e879f9', icono: 'musica', sala: 'musica',
    desc: 'Tocamos el piano, la guitarra y la batería. ¡Nos encanta cantar juntos!' },
];

// HORARIO OFICIAL (exactamente el del proyecto)
export const HORARIO = [
  { hora: '7:45', frase: 'Los alumnos se despiertan.', letras: 'Son las ocho menos cuarto.', icono: 'despertar', sala: 'hab101', noche: false, color: '#f59e0b' },
  { hora: '8:00', frase: 'Empiezan las clases.', letras: 'Son las ocho de la mañana.', icono: 'clases', sala: 'mates', color: '#3d8bff' },
  { hora: '10:00', frase: 'Recreo de veinte minutos.', letras: 'Son las diez de la mañana.', icono: 'recreo', sala: 'patio', color: '#34d399', nota: 'El recreo dura 20 minutos.' },
  { hora: '12:20', frase: 'Comida.', letras: 'Son las doce y veinte.', icono: 'comida', sala: 'comedor', color: '#f97316' },
  { hora: '14:00', frase: 'Reanudación de las clases.', letras: 'Son las dos de la tarde.', icono: 'reanudar', sala: 'fisica', color: '#22d3ee' },
  { hora: '17:00', frase: 'Fin de las clases.', letras: 'Son las cinco de la tarde.', icono: 'fin', sala: 'gimnasio', color: '#8b5cf6' },
  { hora: '21:00', frase: 'Los alumnos se acuestan.', letras: 'Son las nueve de la noche.', icono: 'dormir', sala: 'hab102', noche: true, color: '#6366f1' },
];

// La vida en nuestro internado (frases sencillas: verbo IR, diptongos, la hora, los gustos)
export const VIDA = [
  { hora: '7:45', titulo: 'El despertar', icono: 'despertar', sala: 'hab101',
    texto: 'Nos despertamos en nuestras habitaciones del primer piso. Nos duchamos y nos ponemos el uniforme.' },
  { hora: '8:00', titulo: 'Las clases', icono: 'clases', sala: 'mates',
    texto: 'Las clases empiezan a las ocho. Vamos a las aulas de la planta baja con nuestros compañeros.' },
  { hora: '10:00', titulo: 'El recreo', icono: 'recreo', sala: 'patio',
    texto: 'El recreo dura veinte minutos. Vamos al patio: hablamos, jugamos y descansamos.' },
  { hora: '12:20', titulo: 'La comida', icono: 'comida', sala: 'comedor',
    texto: 'A las doce y veinte, vamos al comedor. Nos encanta la paella y la fruta fresca.' },
  { hora: '14:00', titulo: 'Por la tarde', icono: 'reanudar', sala: 'fisica',
    texto: 'A las dos, las clases vuelven a empezar. Por la tarde tenemos ciencias, música o tecnología.' },
  { hora: '17:00', titulo: 'Tiempo libre', icono: 'fin', sala: 'piscina',
    texto: 'A las cinco termina el colegio. Podemos ir a la piscina, al gimnasio o a la sala de juegos.' },
  { hora: '21:00', titulo: 'A dormir', icono: 'dormir', sala: 'hab102',
    texto: 'A las nueve de la noche, nos acostamos. Los alumnos duermen en habitaciones para dos.' },
];

export const FRASES_DEPORTE = [
  'Tenemos un gran gimnasio.',
  'Podemos jugar al fútbol y al baloncesto.',
  'Hay una piscina moderna.',
  'Nos encanta practicar deporte.',
];

export const UNIFORME_PIEZAS = [
  { pieza: 'Un polo blanco', detalle: 'Es cómodo y elegante. Lo llevamos todos los días.', color: '#ffffff' },
  { pieza: 'Una sudadera azul noche', detalle: 'Tiene detalles de color azul eléctrico y cian.', color: '#16224f' },
  { pieza: 'Un pantalón gris claro o una falda azul noche', detalle: 'Los alumnos pueden elegir.', color: '#c9d1dd' },
  { pieza: 'Unas zapatillas de deporte', detalle: 'Son blancas con la suela de color cian.', color: '#f4f7fb' },
  { pieza: 'El logo del colegio', detalle: 'Una «A» de Aurora con un sol que sale. Brilla en el pecho.', color: '#22d3ee' },
];

export const RAZONES = [
  { exp: 'Nos encanta', frase: 'Nos encanta nuestro colegio porque es moderno y bonito.', color: '#f472b6' },
  { exp: 'Está en', frase: 'Nuestro colegio está en España, en Valencia, cerca del mar.', color: '#fbbf24' },
  { exp: 'Tenemos', frase: 'Tenemos habitaciones cómodas para dos alumnos.', color: '#8b5cf6' },
  { exp: 'Nos gusta', frase: 'Nos gusta mucho la biblioteca porque es tranquila y luminosa.', color: '#3d8bff' },
  { exp: 'Nos gustan', frase: 'Nos gustan la piscina y el gimnasio.', color: '#38bdf8' },
  { exp: 'Podemos', frase: 'Podemos estudiar y practicar deporte.', color: '#34d399' },
  { exp: 'Preferimos', frase: 'Preferimos las clases con pizarras digitales y ordenadores.', color: '#22d3ee' },
  { exp: 'Hay', frase: 'Hay un gran complejo deportivo con una piscina moderna.', color: '#f97316' },
  { exp: 'Nos encanta', frase: 'Nos encanta vivir en nuestro internado.', color: '#e879f9' },
  { exp: 'Vamos a', frase: 'Vamos a aprender mucho y vamos a ser muy felices aquí.', color: '#a78bfa' },
  { exp: 'Es ideal porque', frase: 'Es ideal porque estudiamos, vivimos y jugamos juntos.', color: '#22d3ee' },
  { exp: 'Preferimos', frase: 'Preferimos un colegio ecológico con paneles solares.', color: '#4ade80' },
];

export const ARQUITECTURA = ['Fachadas de cristal', 'Luces LED azules', 'Paneles solares', 'Balcones', 'Jardines', 'Pérgola solar', 'Techo verde'];
