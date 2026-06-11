import {
  cargarDatosTienda,
  cruzarDatosProductos
} from "./datos.js";

import {
  renderizarProductos,
  actualizarMensajeEstado
} from "./productos.js";

import {
  rellenarSelectCategorias,
  rellenarSelectMarcas,
  filtrarProductos
} from "./filtros.js";

import {
  configurarCierreModales,
  mostrarModalDetalles
} from "./modales.js";

const state = {
  productos: [],
  categorias: [],
  marcas: [],
  usuarios: [],
  usuarioAutenticado: null,
  carrito: [],
  filtros: {
    texto: "",
    categoria: "",
    marca: ""
  }
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

    rellenarSelectCategorias(state.categorias);
    rellenarSelectMarcas(state.marcas);

    configurarEventosFiltros();
    configurarEventosProductos();
    configurarCierreModales();

    pintarProductosFiltrados();

    console.log("Datos cargados correctamente:", state);
  } catch (error) {
    console.error(error);
    actualizarMensajeEstado("No se pudieron cargar los productos.");
  }
}

function configurarEventosFiltros() {
  const buscador = document.querySelector("#buscador");
  const filtroCategoria = document.querySelector("#filtroCategoria");
  const filtroMarca = document.querySelector("#filtroMarca");

  buscador.addEventListener("input", () => {
    state.filtros.texto = buscador.value;
    pintarProductosFiltrados();
  });

  filtroCategoria.addEventListener("change", () => {
    state.filtros.categoria = filtroCategoria.value;
    pintarProductosFiltrados();
  });

  filtroMarca.addEventListener("change", () => {
    state.filtros.marca = filtroMarca.value;
    pintarProductosFiltrados();
  });
}

function configurarEventosProductos() {
  const contenedorProductos = document.querySelector("#contenedorProductos");

  contenedorProductos.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("btn-detalles")) {
      const idProducto = Number(evento.target.dataset.id);
      const producto = buscarProductoPorId(idProducto);

      if (producto) {
        mostrarModalDetalles(producto);
      }
    }
  });
}

function pintarProductosFiltrados() {
  const productosFiltrados = filtrarProductos(state.productos, state.filtros);

  renderizarProductos(productosFiltrados, state.usuarioAutenticado);

  actualizarMensajeEstado(
    `${productosFiltrados.length} vinilo(s) encontrado(s)`
  );
}

function buscarProductoPorId(idProducto) {
  return state.productos.find((producto) => producto.id === idProducto);
}