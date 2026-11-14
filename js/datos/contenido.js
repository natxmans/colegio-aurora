// =========================================================
// Textos del sitio · COLEGIO PABLO PICASSO
// Español sencillo (nivel 4º / 4e), fiel al PowerPoint
// =========================================================

export const COLEGIO = {
  nombre: 'Colegio Pablo Picasso',
  proyecto: 'Nuestro colegio ideal',
  lema: 'Estudiar · Convivir · Crecer',
  presentacion: 'Es un internado moderno, limpio y acogedor en España. Los alumnos viven en el colegio de lunes a viernes y vuelven a casa el fin de semana.',
};

export const CIFRAS = [
  { n: '2', t: 'plantas' },
  { n: '9', t: 'asignaturas' },
  { n: '4', t: 'instalaciones deportivas' },
  { n: '2', t: 'alumnos por habitación' },
];

export const MENU = [
  { id: 'inicio', t: 'Inicio' },
  { id: 'explorar', t: 'Explorar en 3D' },
  { id: 'colegio', t: 'Nuestro colegio' },
  { id: 'aulas', t: 'Nuestras aulas' },
  { id: 'internado', t: 'Nuestro internado' },
  { id: 'deportes', t: 'Complejo deportivo' },
  { id: 'asignaturas', t: 'Asignaturas' },
  { id: 'horario', t: 'Horario' },
  { id: 'uniforme', t: 'Uniforme' },
  { id: 'ideal', t: '¿Por qué es ideal?' },
  { id: 'presentacion', t: 'Nuestra presentación' },
];

// Diapositiva 2 · Presentación del colegio
export const PRESENTACION = [
  { t: 'Un lugar ideal', txt: 'El colegio está en España, en un lugar tranquilo y agradable.', icono: 'pin' },
  { t: 'Un colegio moderno y limpio', txt: 'Es un internado con instalaciones de muy buena calidad.', icono: 'estrella' },
  { t: 'Un internado', txt: 'Los alumnos duermen en el colegio durante la semana y vuelven a casa el fin de semana.', icono: 'cama' },
  { t: 'Un buen ambiente', txt: 'Los profesores son simpáticos, las clases son divertidas y no hay deberes en casa.', icono: 'corazon' },
];

// Diapositiva 4 · El edificio
export const EDIFICIO = [
  { t: 'Un edificio moderno de dos plantas', txt: 'Es un edificio práctico y seguro.' },
  { t: 'La planta baja', txt: 'Aquí están las aulas, los laboratorios, la biblioteca y el comedor.' },
  { t: 'El primer piso', txt: 'Aquí están la vida escolar, la permanencia, la sala de estudio y los salones.' },
  { t: 'Mucha luz natural', txt: 'Hay grandes ventanas y patios con jardines.' },
];

// Diapositiva 5 · Las aulas
export const AULAS_TXT = [
  { t: 'Aulas grandes', txt: 'Las aulas son grandes, limpias y cómodas.' },
  { t: 'Ordenadores en clase', txt: 'En las aulas hay ordenadores modernos para trabajar.' },
  { t: 'Clases divertidas', txt: 'Trabajamos mucho en equipo.' },
];

// Diapositiva 9 · Los espacios comunes
export const COMUNES = [
  { id: 'comedor', t: 'El comedor', txt: 'Es grande y la comida es sana y equilibrada.', foto: 'espacios-comunes', icono: 'comida' },
  { id: 'biblioteca', t: 'La biblioteca digital', txt: 'Es un lugar tranquilo con libros en papel y libros digitales.', foto: 'espacios-comunes', icono: 'libro' },
  { id: 'jardin', t: 'Los jardines y los patios', txt: 'Hay árboles, flores, bancos y una fuente.', foto: 'arquitectura', icono: 'arbol' },
  { id: 'salon2', t: 'Los salones', txt: 'Hay sofás para descansar y hablar con los amigos.', foto: 'internado', icono: 'sofa' },
];

// Diapositivas 7 y 10 · El internado
export const INTERNADO = [
  { t: 'En la residencia', txt: 'Todos los dormitorios están en la residencia, un edificio de dos plantas al lado del colegio.' },
  { t: 'Habitaciones para dos alumnos', txt: 'Cada habitación es para dos compañeros.' },
  { t: 'Todo lo necesario', txt: 'Hay dos camas individuales, dos escritorios y dos armarios.' },
];
export const SEMANA = [
  { t: 'De lunes a viernes', txt: 'Los alumnos viven en el colegio.', icono: 'cama' },
  { t: 'El fin de semana, en casa', txt: 'El sábado y el domingo volvemos a casa con la familia.', icono: 'inicio' },
  { t: 'Sin deberes en casa', txt: 'Hacemos todo el trabajo en el colegio.', icono: 'libro' },
];

// Diapositiva 6 · Las 9 asignaturas (orden del PowerPoint)
export const ASIGNATURAS = [
  { id: 'svt', nombre: 'Ciencias de la Vida y de la Tierra', corto: 'Ciencias', color: '#3f8a5a', icono: 'svt', sala: 'svt',
    desc: 'Observamos las plantas, los animales y el cuerpo humano.' },
  { id: 'edfisica', nombre: 'Educación Física', corto: 'Educación Física', color: '#2a7ab0', icono: 'edfisica', sala: 'gimnasio',
    desc: 'Hacemos deporte en el gimnasio, en la piscina y en el campo de fútbol.' },
  { id: 'fisica', nombre: 'Física y Química', corto: 'Física y Química', color: '#1f4e9a', icono: 'fisica', sala: 'fisica',
    desc: 'Hacemos experimentos en el laboratorio.' },
  { id: 'historia', nombre: 'Historia y Geografía', corto: 'Historia y Geografía', color: '#b9863b', icono: 'historia', sala: 'historia',
    desc: 'Estudiamos el pasado y los países del mundo.' },
  { id: 'frances', nombre: 'Francés', corto: 'Francés', color: '#3b5fa8', icono: 'frances', sala: 'frances',
    desc: 'Leemos, escribimos y hablamos en francés.' },
  { id: 'mates', nombre: 'Matemáticas', corto: 'Matemáticas', color: '#14285a', icono: 'mates', sala: 'mates',
    desc: 'Calculamos y resolvemos problemas.' },
  { id: 'tecno', nombre: 'Tecnología', corto: 'Tecnología', color: '#5b5fa8', icono: 'tecno', sala: 'tecno',
    desc: 'Usamos los ordenadores y hacemos proyectos en equipo.' },
  { id: 'ingles', nombre: 'Inglés', corto: 'Inglés', color: '#b84a55', icono: 'ingles', sala: 'ingles',
    desc: 'Hablamos y cantamos en inglés.' },
  { id: 'musica', nombre: 'Música', corto: 'Música', color: '#8a4f8f', icono: 'musica', sala: 'musica',
    desc: 'Tocamos el piano, la guitarra y la batería.' },
];

// Diapositiva 11 · EL HORARIO (horas exactas)
export const HORARIO = [
  { hora: '07:45', frase: 'Los alumnos se despiertan.', letras: 'Son las ocho menos cuarto.', icono: 'despertar', sala: 'hab101', noche: false },
  { hora: '08:00', frase: 'Empiezan las clases.', letras: 'Son las ocho de la mañana.', icono: 'clases', sala: 'mates' },
  { hora: '10:00', frase: 'Recreo de veinte minutos.', letras: 'Son las diez de la mañana.', icono: 'recreo', sala: 'patio', nota: 'El recreo dura 20 minutos.' },
  { hora: '12:20', frase: 'Comemos en el comedor.', letras: 'Son las doce y veinte.', icono: 'comida', sala: 'comedor' },
  { hora: '14:00', frase: 'Las clases vuelven a empezar.', letras: 'Son las dos de la tarde.', icono: 'reanudar', sala: 'fisica' },
  { hora: '17:00', frase: 'Terminan las clases.', letras: 'Son las cinco de la tarde.', icono: 'fin', sala: 'gimnasio' },
  { hora: '21:00', frase: 'Los alumnos se acuestan.', letras: 'Son las nueve de la noche.', icono: 'dormir', sala: 'hab102', noche: true },
];

// La vida en nuestro internado (frases sencillas: verbo IR, diptongos, la hora, los gustos)
export const VIDA = [
  { hora: '07:45', titulo: 'Nos despertamos', icono: 'despertar', sala: 'hab101',
    texto: 'Nos despertamos en la residencia. Nos ponemos el uniforme.' },
  { hora: '08:00', titulo: 'Las clases', icono: 'clases', sala: 'mates',
    texto: 'Las clases empiezan a las ocho. Vamos a las aulas de la planta baja.' },
  { hora: '10:00', titulo: 'El recreo', icono: 'recreo', sala: 'patio',
    texto: 'El recreo dura veinte minutos. Vamos al patio y hablamos con los amigos.' },
  { hora: '12:20', titulo: 'La comida', icono: 'comida', sala: 'comedor',
    texto: 'A las doce y veinte vamos al comedor. La comida es sana.' },
  { hora: '14:00', titulo: 'Por la tarde', icono: 'reanudar', sala: 'fisica',
    texto: 'A las dos, las clases vuelven a empezar.' },
  { hora: '17:00', titulo: 'Tiempo libre', icono: 'fin', sala: 'piscina',
    texto: 'A las cinco terminan las clases. Podemos ir a la piscina o al gimnasio.' },
  { hora: '21:00', titulo: 'A dormir', icono: 'dormir', sala: 'hab102',
    texto: 'A las nueve de la noche nos acostamos. ¡Buenas noches!' },
];

// Diapositiva 8 · El complejo deportivo
export const FRASES_DEPORTE = [
  'Tenemos clases de educación física en el gimnasio.',
  'Después de las clases jugamos al fútbol y al baloncesto.',
  'Hay agua caliente en la piscina: nadamos todo el año.',
  'Nos encanta hacer deporte con los amigos.',
];

// Diapositiva 3 · El uniforme y la ropa de diario
export const UNIFORME_PIEZAS = [
  { pieza: 'Un polo blanco', detalle: 'Tiene el cuello azul marino.', color: '#ffffff' },
  { pieza: 'Una chaqueta azul marino', detalle: 'Lleva el logo del colegio a la izquierda del pecho.', color: '#14285a' },
  { pieza: 'Un pantalón o una falda azul marino', detalle: 'Cada alumno elige. Es cómodo y elegante.', color: '#1b2440' },
  { pieza: 'Unos zapatos marrones', detalle: 'Los llevamos de lunes a viernes.', color: '#5a3a24' },
];

// Diapositiva 12 · ¿Por qué nos gusta nuestro colegio?
export const RAZONES = [
  { exp: 'Nos encanta', frase: 'Nos encanta nuestro colegio porque es moderno y limpio.' },
  { exp: 'Está en', frase: 'Nuestro colegio está en España, en un lugar tranquilo.' },
  { exp: 'Tenemos', frase: 'Tenemos habitaciones cómodas para dos alumnos.' },
  { exp: 'Nos gusta', frase: 'Nos gusta mucho la biblioteca digital.' },
  { exp: 'Nos gustan', frase: 'Nos gustan la piscina y el gimnasio.' },
  { exp: 'Podemos', frase: 'Podemos estudiar y hacer deporte.' },
  { exp: 'Preferimos', frase: 'Preferimos trabajar en el colegio: ¡no hay deberes en casa!' },
  { exp: 'Hay', frase: 'Hay profesores simpáticos y clases divertidas.' },
  { exp: 'Vamos a', frase: 'Vamos a pasar el fin de semana en casa con la familia.' },
  { exp: 'Es ideal porque', frase: 'Es ideal porque estudiamos, vivimos y jugamos juntos.' },
];

// Las 12 diapositivas de la presentación (texto alternativo de cada imagen)
export const DIAPOSITIVAS = [
  'Portada: Colegio Pablo Picasso, nuestro colegio ideal.',
  '1. Presentación del colegio.',
  '2. El uniforme y la ropa de diario.',
  '3. El edificio y sus dos plantas.',
  '4. Las aulas y los ordenadores.',
  '5. Nuestras nueve asignaturas.',
  '6. Los dormitorios.',
  '7. El complejo deportivo.',
  '8. Los espacios comunes.',
  '9. La vida en el internado.',
  '10. El horario.',
  '11. ¿Por qué nos gusta nuestro colegio?',
];
