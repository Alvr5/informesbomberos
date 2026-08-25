const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
app.use(express.json());
app.use(cors()); // Permite peticiones desde el frontend

// Coloca aquí tus credenciales de Discord
const DISCORD_BOT_TOKEN = 'TU_BOT_TOKEN_AQUI'; 

// Configuración del Bot
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]
});

client.login(DISCORD_BOT_TOKEN);

client.on('ready', () => {
    console.log(`Bot de Discord listo como ${client.user.tag}`);
});

// Endpoint para recibir la petición desde el HTML/JS
app.post('/api/enviar-dm', async (req, res) => {
    const { id, titulo, contenido, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'Falta el ID del usuario' });
    }

    try {
        // Buscar el usuario por su ID de Discord (18 dígitos)
        const user = await client.users.fetch(userId);

        // Crear el mensaje formateado (Embed)
        const embed = {
            title: `📋 Informe #${id}: ${titulo}`,
            description: contenido,
            color: 5814783,
            timestamp: new Date().toISOString(),
            footer: { text: "Sistema de Informes" }
        };

        // Enviar el MD
        await user.send({ embeds: [embed] });

        res.json({ success: true, message: 'Informe enviado por DM con éxito' });
    } catch (error) {
        console.error('Error al enviar DM:', error);
        res.status(500).json({ 
            success: false, 
            message: 'No se pudo enviar el DM. Verifica que el ID sea correcto y que el usuario permita mensajes directos.' 
        });
    }
});

app.listen(3000, () => console.log('Servidor activo en http://localhost:3000'));