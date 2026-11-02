"use strict";

// ============================================
// CONFIGURACIÓN
// ============================================

// Página de login.
const LOGIN_URL = "login_dashboard.html";

// Página de viajes (Flutter).
const VIAJES_URL = "http://127.0.0.1:8082";

// Página de Despensa Digital Comunitaria.
const DESPENSA_URL = "../../index.html";

// ============================================
// DATOS DE LA SESIÓN
// ============================================

const token = sessionStorage.getItem("access_token");
const nombre = sessionStorage.getItem("nombre_usuario") || "Usuario";

// Proteger el dashboard si no existe sesión.
if (!token) {
    window.location.replace(LOGIN_URL);
}

// ============================================
// MOSTRAR DATOS DEL USUARIO
// ============================================

function mostrarUsuario() {
    const topUsername = document.getElementById("topUsername");
    const greeting = document.getElementById("greeting");
    const accountUsername = document.getElementById("accountUsername");
    const userAvatar = document.getElementById("userAvatar");

    if (topUsername) {
        topUsername.textContent = nombre;
    }

    if (greeting) {
        greeting.textContent = `¡Bienvenido, ${nombre}!`;
    }

    if (accountUsername) {
        accountUsername.textContent = `Usuario conectado: ${nombre}`;
    }

    if (userAvatar) {
        userAvatar.textContent =
            nombre.trim().charAt(0).toUpperCase() || "U";
    }
}

// ============================================
// IR A VIAJES (FLUTTER)
// ============================================

function irAViajes() {
    // Leer los valores guardados durante el login.
    const tokenActual = sessionStorage.getItem("access_token");
    const usuarioActual = sessionStorage.getItem("nombre_usuario");

    if (!tokenActual || !usuarioActual) {
        window.location.replace(LOGIN_URL);
        return;
    }

    // Flutter espera los parámetros "usuario" y "token".
    const url = new URL(VIAJES_URL);

    url.searchParams.set("usuario", usuarioActual);
    url.searchParams.set("token", tokenActual);

    // Redirigir a la aplicación de viajes.
    window.location.href = url.toString();
}

// ============================================
// IR A DESPENSA DIGITAL COMUNITARIA
// ============================================

function irADespensa() {
    const tokenActual = sessionStorage.getItem("access_token");
    const usuarioActual = sessionStorage.getItem("nombre_usuario");

    if (!tokenActual || !usuarioActual) {
        window.location.replace(LOGIN_URL);
        return;
    }

    // Enviar los parámetros "usuario" y "token" por la URL tal como indica la plantilla.
    const url = new URL(DESPENSA_URL, window.location.href);
    url.searchParams.set("usuario", usuarioActual);
    url.searchParams.set("token", tokenActual);

    window.location.href = url.toString();
}

// ============================================
// CERRAR SESIÓN
// ============================================

function cerrarSesion() {
    // Eliminar las claves utilizadas por el login.
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("nombre_usuario");

    // Eliminar también los alias de sesión.
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    // Volver al login.
    window.location.replace(LOGIN_URL);
}

// ============================================
// INICIALIZAR DASHBOARD
// ============================================

mostrarUsuario();

// Botón para cerrar sesión.
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", cerrarSesion);
}

// Botón para ir a viajes.
const viajesButton = document.getElementById("viajes2");

if (viajesButton) {
    viajesButton.addEventListener("click", irAViajes);
}

// Botón para ir a Despensa Digital Comunitaria.
const despensaButton = document.getElementById("despensaBtn");

if (despensaButton) {
    despensaButton.addEventListener("click", irADespensa);
}
