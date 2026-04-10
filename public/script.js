// Referencias a elementos del DOM
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const sideCart = document.getElementById('side-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.querySelector('.btn-checkout'); // Referencia al botón de pago

// Estado del Carrito
let cart = [];

// Función para abrir/cerrar el carrito
const toggleCart = () => {
    sideCart.classList.toggle('active');
    overlay.classList.toggle('active');
};

// Eventos para abrir y cerrar
cartBtn.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
overlay.addEventListener('click', toggleCart);

// Evento para agregar productos
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const priceElement = e.target.previousElementSibling;
        const price = parseInt(priceElement.dataset.price);

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        
        updateUI();
        if(!sideCart.classList.contains('active')) toggleCart();
    });
});

// FUNCIÓN PARA PAGAR CON MERCADO PAGO (La pieza que faltaba)
checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Cambiamos el texto del botón para que el usuario sepa que está cargando
    checkoutBtn.innerText = "Cargando pago...";
    checkoutBtn.disabled = true;

    try {
        const response = await fetch('/create_preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cart })
        });

        const data = await response.json();

        // Redirigir al Checkout de Mercado Pago
        window.location.href = data.init_point;
        
    } catch (error) {
        console.error("Error al procesar el pago:", error);
        alert("Hubo un error al conectar con Mercado Pago.");
        checkoutBtn.innerText = "Finalizar Compra";
        checkoutBtn.disabled = false;
    }
});

// Función para renderizar la Interfaz del Carrito
function updateUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">No hay productos aún.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div style="flex:1;">
                    <strong style="color:#333;">${item.name}</strong><br>
                    <small style="color:#777;">${item.quantity} x $${item.price.toLocaleString('es-CL')}</small>
                </div>
                <span style="font-weight:700; color:#0070f3;">$${(item.price * item.quantity).toLocaleString('es-CL')}</span>
            </div>
        `).join('');
    }

    const totalMoney = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = `$${totalMoney.toLocaleString('es-CL')}`;
}
