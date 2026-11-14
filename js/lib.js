// Bibliotecas de la interfaz: React + htm (cargadas por el "import map" de index.html).
// Las bibliotecas 3D (Three.js, React Three Fiber, Drei) están en lib3d.js y se cargan
// solo cuando hace falta: así la presentación y los textos aparecen enseguida.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';

// "html`...`" = JSX sin compilación (htm)
export const html = htm.bind(React.createElement);

export { React, createRoot };
export const {
  useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect,
  createContext, useContext, Fragment, memo, useSyncExternalStore, Component,
} = React;
