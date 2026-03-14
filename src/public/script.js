// shop page functions start
async function loadShopProducts() {
  const response = await fetch("/api/products/all", { method: "GET" });

  const products = await response.json();

  const productContainer = document.getElementById("products-container");
  products.forEach((product) => {
    const productElem = document.createElement("div");
    productElem.className = "product";
    productElem.innerHTML = `
           <div class="product-image">
            <img src=${product.imageUrl} width="100%" height="200" />
            </div>
        <div class="product-info">
          <p class="product-title">${product.title}</p>
          <p class="product-description">Description: ${product.description}</p>
          <p class="product-price">Price: ₹${product.price}</p>
          <p class="product-stock">Stock: ${product.stock}</p>
          </div>
          <span>Select quantity:</span>
      </div>
          `;

    const selectElem = document.createElement("select");
    selectElem.className = "quantity-selector";

    if (product.stock < 5) {
      generateQuantityOptions(product.stock, selectElem);
    } else {
      generateQuantityOptions(5, selectElem);
    }

    const addToCartBtn = document.createElement("button");
    addToCartBtn.className = "add-to-cart-btn";
    addToCartBtn.textContent = "Add to cart";

    addToCartBtn.addEventListener("click", (event) => {
      addToCart(event, product._id);
    });

    productElem.appendChild(selectElem);
    productElem.appendChild(addToCartBtn);

    productContainer.appendChild(productElem);
  });
}

function generateQuantityOptions(limit, selectElem) {
  for (let i = 1; i <= limit; i++) {
    const option = document.createElement("option");

    option.textContent = i;
    option.value = i;
    selectElem.appendChild(option);
  }
}

async function addToCart(e, productId) {
  const quantity = e.target.previousElementSibling.value;

  try {
    const response = await fetch(`/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    if (response.ok) {
      Toastify({
        text: "Product added to the cart",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "green",
        },
        offset: {
          y: 50,
        },
      }).showToast();
    } else {
      Toastify({
        text: "Error during adding product into cart",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "red",
        },
        offset: {
          y: 50,
        },
      }).showToast();
    }
  } catch (error) {
    console.log("Error in addToCart:", error);
  }
}
// shop page functions end

// products page functions start
async function loadProducts() {
  try {
    const response = await fetch("/api/products", { method: "GET" });

    const products = await response.json();

    const productContainer = document.getElementById("products-container");

    if (!products.length) {
      productContainer.innerHTML = `<p>No Products Added</p>`;
    } else {
      products.forEach((product) => {
        const productElem = document.createElement("div");
        productElem.className = "product";
        productElem.innerHTML = `
             <div class="product-image">
              <img src=${product.imageUrl} width="100%" height="200" />
              </div>
          <div class="product-info">
            <p class="product-title">${product.title}</p>
            <p class="product-description">Description: ${product.description}</p>
            <p class="product-price">Price: ₹${product.price}</p>
            <p class="product-stock">Stock: ${product.stock}</p>
          </div>
        </div>
            `;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "product-delete-btn";

        deleteBtn.addEventListener("click", () => {
          deleteProduct(product._id, productElem);
        });

        productElem.appendChild(deleteBtn);

        productContainer.appendChild(productElem);
      });
    }
  } catch (error) {
    console.log("Error in loadProducts:", error);
  }
}

async function deleteProduct(productId, product) {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      product.remove();
      Toastify({
        text: "Product deleted successfully",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "green",
        },
        offset: {
          y: 50,
        },
      }).showToast();
    } else {
      Toastify({
        text: "Error during deleting product!",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "red",
        },
        offset: {
          y: 50,
        },
      }).showToast();
    }
  } catch (error) {
    console.log("Error in deleteProduct:", error);
  }
}
// products page functions end

// cart page functions start
let cartTotal = 0;
async function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items-container");
  try {
    const response = await fetch("/api/cart", { method: "GET" });

    if (!response.ok) {
      cartItemsContainer.innerHTML = `
      <p>Cart is empty</p>`;
      return;
    }

    const cartItems = await response.json();

    if (!cartItems || cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
      <p>Cart is empty</p>`;
      return;
    }

    cartItems.forEach((item) => {
      calculateCartTotal(item);
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
       <div class="cart-item-img">
          <img src=${item.productId.imageUrl} alt="product image" />
        </div>
        <div class="cart-item-details">
          <p class="cart-item-title">${item.productId.title}</p>
          <p class="cart-item-description">Description: ${item.productId.description}</p>
          <p class="cart-item-price">Price: ₹${item.productId.price}</p>
          <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
        </div>
      `;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "cart-delete-btn";
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", () => {
        deleteItemFromCart(item, cartItem);
      });

      cartItem.appendChild(deleteBtn);
      cartItemsContainer.appendChild(cartItem);
    });

    const cartBuyContainer = document.getElementById("cart-buy-container");
    const buyContainer = document.createElement("div");
    buyContainer.id = "buy-container";

    buyContainer.innerHTML = `
      <p id="cart-total">Cart total: ₹${cartTotal}</p>
      <button id="cart-buy-btn" onclick="createOrder()">Buy Now</button>
    `;

    cartBuyContainer.appendChild(buyContainer);
  } catch (error) {
    console.log("Error in loadCartItems:", error);
  }
}

async function deleteItemFromCart(item, cartItem) {
  try {
    const response = await fetch(`/api/cart/${item.productId._id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok) {
      cartItem.remove();
      Toastify({
        text: "Cart item deleted successfully",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "green",
        },
        offset: {
          y: 50,
        },
        onClick: function () {}, // Callback after click
      }).showToast();

      const itemTotal = item.productId.price * item.quantity;

      updateCartTotal(itemTotal);
    } else {
      Toastify({
        text: "Error during deleting cart item!",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "red",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    }
  } catch (error) {
    console.log("Error in deleteItemFromCart:", error);
  }
}

function calculateCartTotal(cartItem) {
  cartTotal += cartItem.productId.price * cartItem.quantity;
}

function updateCartTotal(itemTotal) {
  cartTotal -= itemTotal;

  const cartTotalElem = document.getElementById("cart-total");
  cartTotalElem.textContent = `Cart total: ₹${cartTotal}`;
}

async function createOrder() {
  try {
    const response = await fetch("/api/orders", { method: "POST" });

    if (response.ok) {
      const cartBuyContainer = document.getElementById("cart-buy-container");

      cartBuyContainer.innerHTML = `<p>Cart is empty</p>`;
    }
  } catch (error) {
    console.log("Error in createOrder:", error);
  }
}
// cart page functions end

// orders page functions start
async function fetchOrders() {
  const response = await fetch("/api/orders", { method: "GET" });
  const orders = await response.json();

  const ordersContainer = document.getElementById("orders-container");

  if (!orders || orders.length === 0) {
    ordersContainer.innerHTML = `
    <p>No Orders</p>
    `;
    return;
  }

  orders.forEach((order) => {
    const orderElem = document.createElement("div");
    orderElem.className = "order";

    const orderDate = new Date(order?.createdAt).toDateString();

    const orderDetails = document.createElement("div");
    orderDetails.className = "order-details";
    orderDetails.innerHTML = `
    <div class="order-id"><b>Order id</b>: ${order?._id}</div>
    <div class="order-date"><b>Order Date</b>: ${orderDate}</div>
    <div class="order-total"><b>Order Total</b>: ₹${order?.totalAmount}</div>
    `;

    orderElem.appendChild(orderDetails);

    for (let i = 0; i < order.orderItems.length; i++) {
      showOrderItems(order.orderItems[i], orderElem);
    }

    ordersContainer.appendChild(orderElem);
  });
}

function showOrderItems(orderItem, orderElem) {
  const orderItemElem = document.createElement("div");
  orderItemElem.className = "order-item";
  orderItemElem.innerHTML = `
  <div class="order-item-img">
    <img src=${orderItem?.productId?.imageUrl} alt="order item image" />
  </div>
  <div class="order-item-details">
    <p class="order-item-title"><b>Product Title</b>: ${orderItem?.productId?.title}</p>
    <p class="order-item-description"><b>Description:</b> ${orderItem?.productId?.description}</p>
    <p class="order-item-quantity"><b>Quantity:</b> ${orderItem?.quantity}</p>
    
  </div>
  `;

  orderElem.appendChild(orderItemElem);
}
// orders page functions end

//add product page functions start

async function addProduct(e, role) {
  e.preventDefault();

  const title = e.target?.elements?.title?.value;
  const description = e.target?.elements?.description?.value;
  const price = e.target?.elements?.price?.value;
  const imageUrl = e.target?.elements?.imageUrl?.value;
  const stock = e.target?.elements?.stock?.value;

  let url = "";

  if (role === "admin") {
    url = "/api/admin/products";
  } else {
    url = "/api/products";
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description, price, imageUrl, stock }),
  });

  if (response.ok) {
    Toastify({
      text: "Product added Successfully",
      duration: 3000,
      destination: "",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "green",
      },
      offset: {
        y: 50,
      },
    }).showToast();
  } else {
    Toastify({
      text: "Error during adding product",
      duration: 3000,
      destination: "",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "red",
      },
      offset: {
        y: 50,
      },
    }).showToast();
  }
}

//add product page functions start

// logout
async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "index.html";
  } catch (error) {
    console.log("Error in logout:", error);
  }
}
