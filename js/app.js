import {
  cargarDatosTienda,
  cruzarDatosProductos
} from "./datos.js";

import {
  renderizarProductos,
  actualizarMensajeEstado
} from "./productos.js";

const state = {
  productos: [],
  categorias: [],
  marcas: [],
  usuarios: [],
  usuarioAutenticado: null,
  carrito: []
};

document.addEventListener("DOMContentLoaded", iniciarApp);

async function iniciarApp() {
  try {
    actualizarMensajeEstado("Cargando productos...");

    const datos = await cargarDatosTienda();

    state.categorias = datos.categorias;
    state.marcas = datos.marcas;
    state.usuarios = datos.usuarios;

    state.productos = cruzarDatosProductos(
      datos.productos,
      datos.categorias,
      datos.marcas
    );

    renderizarProductos(state.productos, state.usuarioAutenticado);
    actualizarMensajeEstado(`${state.productos.length} vinilos encontrados`);

    console.log("Datos cargados correctamente:", state);
  } catch (error) {
    console.error(error);
    actualizarMensajeEstado("No se pudieron cargar los productos.");
  }
}