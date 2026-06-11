export function renderizarProductos(
  productos,
  usuarioAutenticado = null,
  moneda = "EUR",
  tasasCambio = { EUR: 1 }
) {
  const contenedorProductos = document.querySelector("#contenedorProductos");

  contenedorProductos.innerHTML = "";

  if (productos.length === 0) {
    contenedorProductos.innerHTML = `
      <p class="empty-message">No se han encontrado vinilos.</p>
    `;
    return;
  }

  productos.forEach((producto) => {
    const tarjeta = crearTarjetaProducto(
      producto,
      usuarioAutenticado,
      moneda,
      tasasCambio
    );

    contenedorProductos.appendChild(tarjeta);
  });
}

function crearTarjetaProducto(producto, usuarioAutenticado, moneda, tasasCambio) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("product-card");

  const botonCarritoDeshabilitado = !usuarioAutenticado || producto.stock <= 0;
  const precioFormateado = formatearPrecioProducto(
    producto.precio,
    moneda,
    tasasCambio
  );

  tarjeta.innerHTML = `
    <img
      class="product-card__image"
      src="./assets/img/productos/${producto.imagen}"
      alt="${producto.nombre}"
      onerror="this.src='./assets/img/productos/placeholder.jpg'"
    >

    <div class="product-card__body">
      <h3>${producto.nombre}</h3>

      <p class="product-card__artist">
        ${producto.marca_nombre}
      </p>

      <p class="product-card__price">
        ${precioFormateado}
      </p>

      <p class="product-card__stock">
        Stock: ${producto.stock}
      </p>

      <div class="product-card__actions">
        <button
          class="btn btn-detalles"
          type="button"
          data-id="${producto.id}"
        >
          Ver detalles
        </button>

        <button
          class="btn btn-carrito"
          type="button"
          data-id="${producto.id}"
          ${botonCarritoDeshabilitado ? "disabled" : ""}
        >
          ${producto.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  `;

  return tarjeta;
}

function formatearPrecioProducto(precioBaseEUR, moneda, tasasCambio) {
  const tasa = tasasCambio[moneda] || 1;
  const precioConvertido = precioBaseEUR * tasa;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: moneda
  }).format(precioConvertido);
}

export function actualizarMensajeEstado(texto) {
  const mensajeEstado = document.querySelector("#mensajeEstado");
  mensajeEstado.textContent = texto;
}