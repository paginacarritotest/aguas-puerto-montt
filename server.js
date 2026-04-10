const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// CONFIGURACIÓN DE MERCADO PAGO - MODO PRODUCCIÓN
mercadopago.configure({
    access_token: 'APP_USR-3513321670312550-041015-61260e2a418908f0a2dcbd992e6131bc-106474076'
});

// RUTA PARA CREAR LA PREFERENCIA DE PAGO
app.post('/create_preference', (req, res) => {
    let preference = {
        items: req.body.items.map(item => ({
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'CLP'
        })),
        // URLs a las que el cliente vuelve tras el pago
        back_urls: {
            success: "https://aguas-puerto-montt.onrender.com", 
            failure: "https://aguas-puerto-montt.onrender.com",
            pending: "https://aguas-puerto-montt.onrender.com"
        },
        auto_return: "approved", // Redirección automática si el pago es exitoso
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id,
                init_point: response.body.init_point // Este es el link real de cobro
            });
        })
        .catch(function (error) {
            console.error("Error en Mercado Pago:", error);
            res.status(500).json({ error: "Error al generar el pago real" });
        });
});

// Iniciar el servidor en el puerto que asigne Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Tienda de Aguas Puerto Montt en vivo en puerto ${PORT}`);
});
