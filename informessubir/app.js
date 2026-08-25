// Configuración de credenciales de EmailJS
const EMAILJS_PUBLIC_KEY = 'uMUOyuF0d-pRBb8vg';
const EMAILJS_SERVICE_ID = 'service_5ulz08g';
const EMAILJS_TEMPLATE_ID = 'template_oby6wyq';

// Elementos del DOM
const canalSelect = document.getElementById('canal');
const destinoInput = document.getElementById('destino');
const destinoLabel = document.getElementById('destinoLabel');
const form = document.getElementById('informeForm');
const btnSubmit = document.getElementById('btnSubmit');

// Inicializar SDK de EmailJS
if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
} else {
    console.error('El SDK de EmailJS no se cargó correctamente desde el CDN.');
}

// Cambiar la vista del campo de destino según el canal seleccionado
canalSelect.addEventListener('change', () => {
    if (canalSelect.value === 'discord') {
        destinoLabel.textContent = 'URL del Webhook de Discord';
        destinoInput.placeholder = 'https://discord.com/api/webhooks/...';
        destinoInput.type = 'url';
    } else {
        destinoLabel.textContent = 'Correo Electrónico Destino';
        destinoInput.placeholder = 'usuario@ejemplo.com';
        destinoInput.type = 'email';
    }
});

// Evento principal de envío del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('informeId').value.trim();
    const titulo = document.getElementById('titulo').value.trim();
    const contenido = document.getElementById('contenido').value.trim();
    const canal = canalSelect.value;
    const destino = destinoInput.value.trim();

    // Deshabilitar botón durante la petición
    setLoadingState(true);

    try {
        if (canal === 'discord') {
            await enviarADiscord(id, titulo, contenido, destino);
        } else {
            await enviarAEmail(id, titulo, contenido, destino);
        }
    } catch (err) {
        console.error('Error no controlado en el envío:', err);
    } finally {
        setLoadingState(false);
    }
});

// Enviar informe a Discord a través de Webhook
async function enviarADiscord(id, titulo, contenido, webhookUrl) {
    const payload = {
        embeds: [{
            title: `📋 Informe #${id}: ${titulo}`,
            description: contenido,
            color: 5814783, // Azul/Púrpura en valor decimal
            timestamp: new Date().toISOString(),
            footer: { text: "Sistema de Informes Automático" }
        }]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('✅ Informe enviado a Discord con éxito.');
            form.reset();
            canalSelect.dispatchEvent(new Event('change'));
        } else {
            const errorText = await response.text();
            console.error('Error Discord HTTP:', response.status, errorText);
            alert(`❌ Error al enviar a Discord (${response.status}). Revisa la URL del Webhook.`);
        }
    } catch (error) {
        console.error('Error de red al conectar con Discord:', error);
        alert('❌ Error de conexión al intentar contactar con Discord.');
    }
}

// Enviar informe por correo utilizando EmailJS
async function enviarAEmail(id, titulo, contenido, correoDestino) {
    // Estas claves deben coincidir EXACTAMENTE con las etiquetas {{informeId}}, {{titulo}}, {{contenido}} y {{destino}} de tu plantilla de EmailJS
    const templateParams = {
        informeId: id,
        titulo: titulo,
        contenido: contenido,
        destino: correoDestino,
        to_email: correoDestino
    };

    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        console.log('Respuesta de EmailJS:', response.status, response.text);
        alert('✅ Informe enviado al correo con éxito.');
        form.reset();
        canalSelect.dispatchEvent(new Event('change'));
    } catch (error) {
        console.error('Error en EmailJS:', error);
        
        let mensajeError = 'Error al enviar el correo.';
        if (error && error.text) {
            mensajeError += ` Detalle: ${error.text}`;
        } else if (typeof error === 'string') {
            mensajeError += ` Detalle: ${error}`;
        }

        alert(`❌ ${mensajeError}`);
    }
}

// Control visual del estado del botón
function setLoadingState(loading) {
    if (loading) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Enviando...';
    } else {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Enviar Informe';
    }
}