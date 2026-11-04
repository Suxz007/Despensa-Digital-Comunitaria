const { useState, useEffect, useMemo } = React;

// ============================================================================
// 1. CONFIGURACIÓN DEL SERVICIO
// ============================================================================
// Conecta directamente al contenedor del backend en el puerto 9099
const AUTH_API_URL = (window.location.hostname && !window.location.hostname.includes('github.io'))
  ? `http://${window.location.hostname}:9099`
  : 'http://100.79.246.82:9099';
const SUBPROYECTO_ID = 'despensa-digital';
const SUBPROYECTO_NOMBRE = 'Despensa Digital Comunitaria';

Object.assign(window, {
  useState,
  useEffect,
  useMemo,
  AUTH_API_URL,
  SUBPROYECTO_ID,
  SUBPROYECTO_NOMBRE
});
