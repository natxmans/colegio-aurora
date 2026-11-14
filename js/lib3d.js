// Bibliotecas 3D: Three.js, React Three Fiber y Drei (se cargan después de la página)
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Html, Environment, Lightformer, Stars } from '@react-three/drei';

export * from './lib.js';
export { THREE, Canvas, useFrame, useThree, CameraControls, Html, Environment, Lightformer, Stars };
