export function agregarProductoAlCarrito(carrito, producto, usuario) {
  const productoEnCarrito = carrito.find((item) => {
    return item.producto_id === producto.id && item.usuario_id === usuario.id;
  });

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  } else {
    carrito.push({
      producto_id: producto.id,
      usuario_id: usuario.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  return carrito;
}

export function incrementarCantidad(carrito, idProducto, idUsuario) {
  const productoEnCarrito = carrito.find((item) => {
    return item.producto_id === idProducto && item.usuario_id === idUsuario;
  });

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  }

  return carrito;
}

export function decrementarCantidad(carrito, idProducto, idUsuario) {
  const productoEnCarrito = carrito.find((item) => {
    return item.producto_id === idProducto && item.usuario_id === idUsuario;
  });

  if (productoEnCarrito) {
    productoEnCarrito.cantidad -= 1;
  }

  return carrito.filter((item) => item.cantidad > 0);
}

export function vaciarCarritoUsuario(carrito, idUsuario) {
  return carrito.filter((item) => item.usuario_id !== idUsuario);
}

export function obtenerCarritoUsuario(carrito, idUsuario) {
  return carrito.filter((item) => item.usuario_id === idUsuario);
}

export function calcularTotalCarrito(carritoUsuario) {
  return carritoUsuario.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);
}

export function calcularCantidadProductos(carritoUsuario) {
  return carritoUsuario.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);
}

export function renderizarCarrito(
  carritoUsuario,
  moneda = "EUR",
  tasasCambio = { EUR: 1 }
) {
  const contenidoCarrito = document.querySelector("#contenidoCarrito");
  const totalCarrito = document.querySelector("#totalCarrito");

  contenidoCarrito.innerHTML = "";

  if (carritoUsuario.length === 0) {
    contenidoCarrito.innerHTML = `
      <p>El carrito está vacío.</p>
    `;

    totalCarrito.textContent = formatearPrecioCarrito(0, moneda, tasasCambio);
    return;
  }

  carritoUsuario.forEach((item) => {
    const itemHTML = document.createElement("article");
    itemHTML.classList.add("cart-item");

    itemHTML.innerHTML = `
      <div>
        <h3>${item.nombre}</h3>
        <p>Precio unidad: ${formatearPrecioCarrito(item.precio, moneda, tasasCambio)}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <p>Subtotal: ${formatearPrecioCarrito(item.precio * item.cantidad, moneda, tasasCambio)}</p>
      </div>

      <div class="cart-item__actions">
        <button
          type="button"
          data-action="decrementar"
          data-id="${item.producto_id}"
        >
          -
        </button>

        <span>${item.cantidad}</span>

        <button
          type="button"
          data-action="incrementar"
          data-id="${item.producto_id}"
        >
          +
        </button>
      </div>
    `;

    contenidoCarrito.appendChild(itemHTML);
  });

  const total = calcularTotalCarrito(carritoUsuario);
  totalCarrito.textContent = formatearPrecioCarrito(total, moneda, tasasCambio);
}

function formatearPrecioCarrito(precioBaseEUR, moneda, tasasCambio) {
  const tasa = tasasCambio[moneda] || 1;
  const precioConvertido = precioBaseEUR * tasa;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: moneda
  }).format(precioConvertido);
}