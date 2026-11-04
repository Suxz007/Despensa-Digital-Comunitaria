const { useState, useEffect, useMemo } = React;

// ============================================================================
// 1. CONFIGURACIÓN DEL SERVICIO
// ============================================================================
// Detección automática: en Docker (puerto 8090) usa ruta relativa; en desarrollo local usa puerto 8000
const AUTH_API_URL = (window.location.port === '8090' || window.location.port === '80' || !window.location.port)
  ? ''
  : 'http://127.0.0.1:8000';
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
