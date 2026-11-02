
"use strict";

// ============================================
// CONFIGURACIÓN
// ============================================

// Dirección base de la API FastAPI.
const API_URL = (window.location.port === "8090" || window.location.port === "80" || !window.location.port) ? "" : "http://127.0.0.1:8000";

// Página principal después del login.
const DASHBOARD_URL = "dashboard.html";

// ============================================
// VALIDAR SESIÓN EXISTENTE
// ============================================

if (sessionStorage.getItem("access_token")) {
    window.location.replace(DASHBOARD_URL);
}

// ============================================
// ELEMENTOS DEL FORMULARIO
// ============================================

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

// ============================================
// MOSTRAR MENSAJES
// ============================================

function mostrarMensaje(texto, tipo = "") {
    loginMessage.textContent = texto;
    loginMessage.className = "message";

    if (tipo) {
        loginMessage.classList.add(tipo);
    }
}

// ============================================
// INICIAR SESIÓN
// ============================================

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre_usuario =
        document.getElementById("username").value.trim();

    const credenciales =
        document.getElementById("password").value;

    if (!nombre_usuario || !credenciales) {
        mostrarMensaje(
            "Escribe tu usuario y contraseña.",
            "error"
        );
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Validando...";
    mostrarMensaje("");

    try {
        const respuesta = await fetch(
            `${API_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre_usuario,
                    credenciales
                })
            }
        );

        const datos = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            const detalle =
                typeof datos.detail === "string"
                    ? datos.detail
                    : "No fue posible iniciar sesión.";

            throw new Error(detalle);
        }

        // Validar que FastAPI haya devuelto el token.
        const token = datos.access_token || datos.token;

        if (!token) {
            throw new Error(
                "La API no devolvió el token de acceso."
            );
        }

        // Obtener el nombre devuelto por el backend.
        const usuario =
            datos.nombre_usuario ||
            datos.usuario ||
            nombre_usuario;

        // ========================================
        // GUARDAR SESIÓN PARA EL DASHBOARD
        // ========================================

        sessionStorage.setItem("access_token", token);
        sessionStorage.setItem("nombre_usuario", usuario);

        // ========================================
        // GUARDAR ALIAS PARA INTEGRACIONES
        // ========================================

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("usuario", usuario);

        // ========================================
        // REDIRIGIR AL DASHBOARD
        // ========================================

        window.location.replace(DASHBOARD_URL);

    } catch (error) {
        console.error("Error durante el login:", error);

        if (error instanceof TypeError) {
            mostrarMensaje(
                "No se pudo conectar con la API. Verifica que FastAPI esté ejecutándose y que CORS esté configurado.",
                "error"
            );
        } else {
            mostrarMensaje(
                error.message ||
                "Ocurrió un error al iniciar sesión.",
                "error"
            );
        }

        loginButton.disabled = false;
        loginButton.textContent = "Entrar al panel";
    }
});
