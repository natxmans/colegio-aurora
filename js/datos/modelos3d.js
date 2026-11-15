// =========================================================
// LOS MODELOS 3D DE LOS EDIFICIOS (para el PowerPoint y el visor 3D)
// Cada modelo es un trozo de la MISMA maqueta del sitio, exportado con
// herramientas/exportar-modelos.js → modelos/<id>.glb
//   zona: caja del campus que se exporta (metros; las piezas del suelo se recortan en el borde)
//   y: altura del CENTRO de las piezas que se guardan (así se quitan el techo o el piso de arriba en los cortes)
//   estado: cómo se pone la maqueta antes de exportar (vista, techos)
//   giro: vista inicial en el visor [azimut, altura] en grados (azimut 0 = desde el sur (+z), 90 = desde el este (+x))
//   frente: azimut desde el que se ve la fachada principal (botón «Frente»)
//   campus: enlace al mismo edificio en el campus 3D vivo del sitio (index.html + esto + #campus)
//   textura: tamaño máximo de las texturas (más pequeño = archivo más ligero)
//   pxm: píxeles por metro (cada textura según el tamaño real del objeto: archivo ligero y campo de fútbol nítido)
// =========================================================
export const MODELOS = [
  {
    id: 'campus', nombre: 'El campus entero', corto: 'El campus', campus: '?vista=completa',
    desc: 'Todo el colegio: el edificio principal, la residencia, el gimnasio, la piscina, los campos de deporte, el patio y los jardines.',
    zona: { x0: -66, x1: 72, z0: -68, z1: 47.5 }, y: [-3, 15], estado: { vista: 'completa', techo: true }, giro: [20, 38], textura: 1024, pxm: 14, frente: 0,
  },
  {
    id: 'principal', interior: 'principal-interior', nombre: 'El edificio principal', corto: 'Edificio principal', campus: '?sala=edificio',
    desc: 'Un edificio moderno de dos plantas. Abajo: las aulas, los laboratorios, la biblioteca y el comedor. Arriba: la vida escolar, la permanencia y los salones.',
    zona: { x0: -33.6, x1: 33.6, z0: -13.2, z1: 18.4 }, y: [-1, 11], textura: 512, estado: { vista: 'completa', techo: true }, giro: [25, 30], frente: 0,
  },
  {
    id: 'aula', nombre: 'Un aula con ordenadores', corto: 'Un aula', campus: '?sala=tecno&dentro=1',
    desc: 'El aula de Tecnología, sin el techo: mesas, ordenadores, una gran pantalla y mucha luz natural.',
    zona: { x0: 15.85, x1: 24.15, z0: -11.4, z1: -1.85 }, y: [-1, 3.7], estado: { vista: 'baja', techo: false }, giro: [200, 52], frente: 0, corte: true,
  },
  {
    id: 'laboratorios', nombre: 'Los laboratorios', corto: 'Laboratorios', campus: '?sala=svt&dentro=1',
    desc: 'Los laboratorios de Ciencias y de Física y Química, sin el techo: microscopios, mesas de trabajo y material de experimentos.',
    zona: { x0: -0.15, x1: 16.15, z0: -11.4, z1: -1.85 }, y: [-1, 3.7], estado: { vista: 'baja', techo: false }, giro: [200, 52], frente: 0, corte: true,
  },
  {
    id: 'residencia', interior: 'residencia-interior', nombre: 'La residencia', corto: 'Residencia', campus: '?vista=residencia',
    desc: 'El edificio de los dormitorios, al lado del colegio: habitaciones dobles en dos plantas y salones para descansar.',
    zona: { x0: -61.4, x1: -42.6, z0: -21.4, z1: 21.4 }, y: [-1, 10], textura: 512, estado: { vista: 'completa', techo: true }, giro: [70, 32], frente: 90,
  },
  {
    id: 'habitacion', nombre: 'Una habitación doble', corto: 'Habitación doble', campus: '?sala=hab101&dentro=1',
    desc: 'Una habitación de la residencia, sin el techo: dos camas, dos escritorios, dos armarios y un espacio para cada alumno.',
    zona: { x0: -60.4, x1: -53.35, z0: -20.4, z1: -15.85 }, y: [3.55, 7.0], estado: { vista: 'completa', techo: false, resVista: 'res1' }, giro: [75, 55], frente: 90, corte: true,
  },
  {
    id: 'gimnasio', interior: 'gimnasio-interior', nombre: 'El gimnasio', corto: 'Gimnasio', campus: '?sala=gimnasio',
    desc: 'Un gimnasio cubierto y moderno para hacer deporte y gimnasia todo el año.',
    zona: { x0: 34, x1: 66, z0: -13.6, z1: 13.6 }, y: [-1, 14], estado: { vista: 'completa', techo: true }, giro: [30, 28], frente: 0,
  },
  {
    id: 'piscina', interior: 'piscina-interior', nombre: 'La piscina olímpica', corto: 'Piscina', campus: '?sala=piscina',
    desc: 'Una piscina olímpica cubierta y climatizada: podemos nadar todo el año.',
    zona: { x0: 9, x1: 71, z0: 14.2, z1: 46.8 }, y: [-3, 13], estado: { vista: 'completa', techo: true }, giro: [20, 30], frente: 0,
  },
  {
    id: 'pistas', nombre: 'Los campos de fútbol y de baloncesto', corto: 'Fútbol y baloncesto', campus: '?sala=futbol',
    desc: 'Un campo de fútbol con gradas y una cancha de baloncesto al aire libre.',
    zona: { x0: -36.5, x1: 66.5, z0: -68.5, z1: -14 }, y: [-1, 14], estado: { vista: 'completa', techo: true }, giro: [15, 40], frente: 0,
  },
  {
    id: 'comedor', nombre: 'El comedor', corto: 'Comedor', campus: '?sala=comedor&dentro=1',
    desc: 'El comedor, sin el techo: es grande y la comida es sana y equilibrada.',
    zona: { x0: 3.85, x1: 32.4, z0: 1.85, z1: 11.4 }, y: [-1, 3.7], estado: { vista: 'baja', techo: false }, giro: [20, 50], frente: 180, corte: true,
  },
  {
    id: 'biblioteca', nombre: 'La biblioteca', corto: 'Biblioteca', campus: '?sala=biblioteca&dentro=1',
    desc: 'La biblioteca digital, sin el techo: un lugar tranquilo con libros en papel y libros digitales.',
    zona: { x0: -32.4, x1: -3.85, z0: 1.85, z1: 11.4 }, y: [-1, 3.7], estado: { vista: 'baja', techo: false }, giro: [20, 50], frente: 180, corte: true,
  },
];

// VISTAS INTERIORES de los edificios grandes (el mismo edificio sin el techo): en el visor, botón «Interior».
// La vista exterior (con el techo cerrado) sigue siendo la principal.
export const INTERIORES = [
  {
    id: 'principal-interior', exterior: 'principal', nombre: 'El edificio principal por dentro', corto: 'Edificio principal (interior)', campus: '?vista=baja',
    desc: 'La planta baja sin el techo: las aulas, los laboratorios, la biblioteca, el comedor y el pasillo.',
    zona: { x0: -33.6, x1: 33.6, z0: -13.2, z1: 18.4 }, y: [-1, 3.7], textura: 512, estado: { vista: 'baja', techo: false }, giro: [20, 58], frente: 0, corte: true,
  },
  {
    id: 'residencia-interior', exterior: 'residencia', nombre: 'La residencia por dentro', corto: 'Residencia (interior)', campus: '?vista=residencia',
    desc: 'El primer piso sin el techo: el pasillo, las habitaciones dobles y el rincón de estar.',
    zona: { x0: -61.4, x1: -42.6, z0: -21.4, z1: 21.4 }, y: [-1, 7.0], textura: 512, estado: { vista: 'completa', techo: false, resVista: 'res1' }, giro: [70, 60], frente: 90, corte: true,
  },
  {
    id: 'gimnasio-interior', exterior: 'gimnasio', nombre: 'El gimnasio por dentro', corto: 'Gimnasio (interior)', campus: '?sala=gimnasio&dentro=1',
    desc: 'Sin la bóveda: la pista, las canastas, las gradas y el material de gimnasia.',
    zona: { x0: 34, x1: 66, z0: -13.6, z1: 13.6 }, y: [-1, 9.5], estado: { vista: 'completa', techo: false }, giro: [30, 50], frente: 0, corte: true,
  },
  {
    id: 'piscina-interior', exterior: 'piscina', nombre: 'La piscina por dentro', corto: 'Piscina (interior)', campus: '?sala=piscina&dentro=1',
    desc: 'Sin la bóveda: la piscina olímpica de ocho calles, las gradas y la silla del socorrista.',
    zona: { x0: 9, x1: 71, z0: 14.2, z1: 46.8 }, y: [-3, 6.9], estado: { vista: 'completa', techo: false }, giro: [20, 50], frente: 0, corte: true,
  },
];
export const TODOS = [...MODELOS, ...INTERIORES];
export const modelo = (id) => TODOS.find(m => m.id === id) || null;
