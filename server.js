const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuración para procesar JSON y permitir conexiones externas
app.use(express.json());
app.use(cors());

// Servir archivos estáticos (tu HTML, CSS y JS del carrito)
// Estos deben estar dentro de una carpeta llamada "public"
app.use(express.static(path.join(__dirname, 'public')));

// CONFIGURACIÓN DE MERCADO PAGO CON TU TOKEN DE PRUEBA
mercadopago.configure({
    access_token: 'TEST-3513321670312550-041015-b30ddfbf99dd047152c2953d5d9e13b5-106474076'
});

// RUTA PARA CREAR EL PAGO
app.post('/create_preference', (req, res) => {
    let preference = {
        items: req.body.items.map(item => ({
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'CLP'
        })),
        back_urls: {
            success: "https://aguas-puerto-montt.onrender.com", 
            failure: "https://aguas-puerto-montt.onrender.com",
            pending: "https://aguas-puerto-montt.onrender.com"
        },
        auto_return: "approved",
    };

    mercadopago.preferences.create(preference)
        .then(response => {
            res.json({ id: response.body.id, init_point: response.body.init_point });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: "Error al crear pago" });
        });
});

// PUERTO DINÁMICO (Vital para Render.com)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});