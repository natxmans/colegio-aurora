// Bibliotecas: React, Three.js, React Three Fiber y Drei (cargadas por el "import map" de index.html)
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Html, Environment, Lightformer, Stars } from '@react-three/drei';

// "html`...`" = JSX sin compilación (htm)
export const html = htm.bind(React.createElement);

export { React, createRoot, THREE, Canvas, useFrame, useThree, CameraControls, Html, Environment, Lightformer, Stars };
export const {
  useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect,
  createContext, useContext, Fragment, memo, useSyncExternalStore, Component,
} = React;
