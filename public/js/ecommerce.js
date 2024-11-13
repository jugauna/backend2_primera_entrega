function showButtonCart() {
    const cartId = localStorage.getItem('cartId');
    console.log('Cart ID en showButtonCart:', cartId);
    if (cartId) {
        document.querySelector('#button-cart').setAttribute("href", `/cart/${cartId}`);
        document.querySelector('.view-cart').style.display = "block";
    }  
}

async function addToCart(pid) {
    let cartId = localStorage.getItem('cartId');
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en localStorage
    console.log('cartID ', cartId);
    console.log('ProductId:', pid); 
    if (!cartId) {
        const createCartResponse = await fetch('/api/carts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Enviar el token en los encabezados
            }
        });

        const createCart = await createCartResponse.json();
        if (createCart.status === 'error') {
            return alert(createCart.message);
        }

        console.log('Carrito:', createCart);

        cartId = createCart._id; // Asegúrate de que el ID del carrito esté en createCart._id
        localStorage.setItem('cartId', cartId);
    }

    if (!pid) {
        console.error('Product ID is missing');
        return;
    }

    const addProductResponse = await fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Enviar el token en los encabezados
        }
    });

    if (!addProductResponse.ok) {
        const errorText = await addProductResponse.text();
        throw new Error(errorText);
    }

    const addProduct = await addProductResponse.json();
    if (addProduct.status === 'error') {
        return alert(addProduct.message);
    }

    showButtonCart();
    alert('Producto añadido satisfactoriamente!');
}

window.addToCart = addToCart;
window.showButtonCart = showButtonCart;

document.addEventListener('DOMContentLoaded', showButtonCart);