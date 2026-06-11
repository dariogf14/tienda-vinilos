export function abrirModal(idModal) {
  const modal = document.querySelector(`#${idModal}`);

  if (modal) {
    modal.classList.remove("hidden");
  }
}

export function cerrarModal(idModal) {
  const modal = document.querySelector(`#${idModal}`);

  if (modal) {
    modal.classList.add("hidden");
  }
}

export function configurarCierreModales() {
  const botonesCerrar = document.querySelectorAll("[data-close]");

  botonesCerrar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const idModal = boton.dataset.close;
      cerrarModal(idModal);
    });
  });

  const modales = document.querySelectorAll(".modal");

  modales.forEach((modal) => {
    modal.addEventListener("click", (evento) => {
      if (evento.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });
}

export function mostrarModalDetalles(producto) {
  const contenidoModal = document.querySelector("#contenidoModalDetalles");

  const caracteristicasHTML = Object.entries(producto.caracteristicas)
    .map(([clave, valor]) => `<li><strong>${clave}:</strong> ${valor}</li>`)
    .join("");

  contenidoModal.innerHTML = `
    <div class="modal-product">
      <img
        src="./assets/img/productos/${producto.imagen}"
        alt="${producto.nombre}"
        onerror="this.src='./assets/img/productos/placeholder.jpg'"
      >

      <div>
        <h2>${producto.nombre}</h2>

        <p><strong>Artista:</strong> ${producto.marca_nombre}</p>
        <p><strong>Género:</strong> ${producto.categoria_nombre}</p>
        <p><strong>Precio:</strong> ${producto.precio.toFixed(2)} €</p>
        <p><strong>Stock:</strong> ${producto.stock}</p>

        <p>
          <strong>Descripción:</strong><br>
          ${producto.descripcion}
        </p>

        <h3>Características</h3>
        <ul>
          ${caracteristicasHTML}
        </ul>
      </div>
    </div>
  `;

  abrirModal("modalDetalles");
}