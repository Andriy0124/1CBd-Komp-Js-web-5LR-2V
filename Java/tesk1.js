document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const subBlock1 = document.querySelector('.sub-block:first-child');
    const summarySubtotal = document.querySelector('.summary-container p:nth-child(1) span:nth-child(2)');
    const summaryShipping = document.querySelector('.summary-container p:nth-child(2) span:nth-child(2)');
    const summaryTotal = document.querySelector('.summary-container p:nth-child(3) span:nth-child(2)');
    const checkoutTotal = document.querySelector('.checkout-container span');
    const addedProducts = new Map();
    const imageButtons = document.querySelectorAll('.image-button');
    
    let shippingCost = 20;

    // Функція для оновлення підсумку
    function updateSummary() {
        let subtotal = 0;
        addedProducts.forEach(product => {
            const price = parseFloat(product.element.querySelector('p').textContent.replace('Price: $', ''));
            subtotal += price * product.quantity;
        });

        const total = subtotal + shippingCost;

        summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        summaryShipping.textContent = subtotal === 0 ? '$0.00' : `$${shippingCost.toFixed(2)}`;
        summaryTotal.textContent = subtotal === 0 ? `$0.00` : `$${total.toFixed(2)}`;
        checkoutTotal.textContent = subtotal === 0 ? `$0.00` : `$${total.toFixed(2)}`;
    }

    imageButtons.forEach(button => {
        button.addEventListener('click', function() {
            imageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
        
        button.addEventListener('mouseenter', function() {
            this.style.filter = 'invert(30%)'; // Змінюємо кольоровий фільтр
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.filter = 'none'; // Повертаємо початковий кольоровий фільтр
        });
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productId = product.dataset.id;

            if (addedProducts.has(productId)) {
                const productData = addedProducts.get(productId);
                productData.quantity++;
                productData.quantitySpan.textContent = productData.quantity;
                updateSummary();
                return;
            }

            const productName = product.querySelector('h3').textContent;
            const productPrice = parseFloat(product.querySelector('p').textContent.replace('Price: $', ''));
            const productImageSrc = product.querySelector('img').src;

            const controls = `
                <div class="controls">
                    <button class="decrease">-</button>
                    <span class="quantity">1</span>
                    <button class="increase">+</button>
                    <img src="./Img/bin.png" alt="basket" class="remove-product">
                </div>
            `;

            const productInfo = `
                <img src="${productImageSrc}" alt="${productName}" style="max-width: 50px; margin-top:5px; margin-right:10px;">
                <div class="product-details">
                    <h3 style=" color: black; font-size: 13px;">${productName}</h3>
                    <p style="font-size: 11px;">Price: $${productPrice.toFixed(2)}</p>
                </div>
                ${controls}
            `;

            const newProduct = document.createElement('div');
            newProduct.classList.add('product-info');
            newProduct.innerHTML = productInfo;

            subBlock1.appendChild(newProduct);

            const decreaseButton = newProduct.querySelector('.decrease');
            const increaseButton = newProduct.querySelector('.increase');
            const quantitySpan = newProduct.querySelector('.quantity');
            const removeButton = newProduct.querySelector('.remove-product');

            addedProducts.set(productId, {
                element: newProduct,
                quantity: 1,
                price: productPrice,
                quantitySpan: quantitySpan
            });

            decreaseButton.addEventListener('click', function() {
                const productData = addedProducts.get(productId);
                if (productData.quantity > 1) {
                    productData.quantity--;
                    productData.quantitySpan.textContent = productData.quantity;
                    updateSummary();
                } else {
                    subBlock1.removeChild(productData.element);
                    addedProducts.delete(productId);
                    updateSummary();
                }
            });

            increaseButton.addEventListener('click', function() {
                const productData = addedProducts.get(productId);
                productData.quantity++;
                productData.quantitySpan.textContent = productData.quantity;
                updateSummary();
            });

            removeButton.addEventListener('click', function() {
                const productData = addedProducts.get(productId);
                subBlock1.removeChild(productData.element);
                addedProducts.delete(productId);
                updateSummary();
            });

            updateSummary();
        });
    });
});
