// Referencias a elementos del DOM
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const sideCart = document.getElementById('side-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

// Estado del Carrito
let cart = [];

// Función para abrir/cerrar el carrito (Toggles la clase 'active')
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
        // El precio se extrae del elemento HTML previo (.price)
        const priceElement = e.target.previousElementSibling;
        const price = parseInt(priceElement.dataset.price);

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        
        // Actualizar UI y abrir el carrito automáticamente para confirmación visual
        updateUI();
        if(!sideCart.classList.contains('active')) toggleCart();
    });
});

// Función para renderizar la Interfaz del Carrito
function updateUI() {
    // 1. Contador del Icono
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // 2. Renderizar items en el body
    if (cart.length === 0) {
        // Volver a poner el texto que se ve en la imagen original si está vacío
        cartItemsContainer.innerHTML = '<p class="empty-msg">No hay productos aún.</p>';
    } else {
        // Renderizado interactivo de cada item
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

    // 3. Actualizar Total con formato de moneda chilena
    const totalMoney = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = `$${totalMoney.toLocaleString('es-CL')}`;
}