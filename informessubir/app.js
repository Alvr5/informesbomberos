// Credenciales de EmailJS
const EMAILJS_PUBLIC_KEY = 'uMUOyuF0d-pRBb8vg';
const EMAILJS_SERVICE_ID = 'service_5ulz08g';
const EMAILJS_TEMPLATE_ID = 'template_oby6wyq';

// ✉️ PON AQUÍ TU CORREO REAL DE RECEPCIÓN
const CORREO_DEFAULT = 'alec.alvarez.lobato@gmail.com';

const form = document.getElementById('informeForm');
const btnSubmit = document.getElementById('btnSubmit');

// Inicializar EmailJS
if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
} else {
    console.error('El CDN de EmailJS no está cargado correctamente en el HTML.');
}

// Evento principal de envío
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('informeId').value.trim();
    const titulo = document.getElementById('titulo').value.trim();
    const contenido = document.getElementById('contenido').value.trim();

    setLoadingState(true);

    try {
        await enviarAEmail(id, titulo, contenido, CORREO_DEFAULT);
    } catch (err) {
        console.error('Error no capturado:', err);
    } finally {
        setLoadingState(false);
    }
});

// Función de envío por correo
async function enviarAEmail(id, titulo, contenido, correoDestino) {
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

        console.log('✅ Éxito:', response.status, response.text);
        alert('✅ Informe enviado al correo con éxito.');
        form.reset();
    } catch (error) {
        // Formatear el error exacto de EmailJS
        const detalle = error?.text || error?.status || JSON.stringify(error);
        console.error('Detalle completo del error:', error);
        alert(`❌ Error al enviar el correo: ${detalle}`);
    }
}

function setLoadingState(loading) {
    btnSubmit.disabled = loading;
    btnSubmit.textContent = loading ? 'Enviando...' : 'Enviar Informe';
}
