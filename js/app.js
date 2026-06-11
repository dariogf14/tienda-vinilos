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
  abrirModal,
  configurarCierreModales,
  mostrarModalDetalles,
  cerrarModal
} from "./modales.js";

import {
  buscarUsuarioPorCredenciales,
  rellenarFormularioPerfil,
  obtenerDatosFormularioPerfil,
  validarDatosPerfil,
  mostrarFormularioLogin,
  mostrarFormularioPerfil
} from "./usuarios.js";

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
    configurarEventosUsuario();
    configurarCierreModales();

    actualizarInterfazUsuario();
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

function configurarEventosUsuario() {
  const btnUsuario = document.querySelector("#btnUsuario");
  const formLogin = document.querySelector("#formLogin");
  const formPerfil = document.querySelector("#formPerfil");

  btnUsuario.addEventListener("click", () => {
    if (state.usuarioAutenticado) {
      mostrarFormularioPerfil();
      rellenarFormularioPerfil(state.usuarioAutenticado);
    } else {
      mostrarFormularioLogin();
    }

    abrirModal("modalUsuario");
  });

  formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value.trim();
    const mensajeLogin = document.querySelector("#mensajeLogin");

    if (email === "" || password === "") {
      mensajeLogin.textContent = "Debes introducir email y contraseña.";
      return;
    }

    const usuarioEncontrado = buscarUsuarioPorCredenciales(
      state.usuarios,
      email,
      password
    );

    if (!usuarioEncontrado) {
      mensajeLogin.textContent = "Email o contraseña incorrectos.";
      return;
    }

    state.usuarioAutenticado = usuarioEncontrado;

    formLogin.reset();
    cerrarModal("modalUsuario");

    actualizarInterfazUsuario();
    pintarProductosFiltrados();

    console.log("Usuario autenticado:", state.usuarioAutenticado);
  });

  formPerfil.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const mensajePerfil = document.querySelector("#mensajePerfil");
    const datosActualizados = obtenerDatosFormularioPerfil(
      state.usuarioAutenticado
    );

    const errorValidacion = validarDatosPerfil(datosActualizados);

    if (errorValidacion !== "") {
      mensajePerfil.textContent = errorValidacion;
      return;
    }

    state.usuarioAutenticado = datosActualizados;

    actualizarInterfazUsuario();
    cerrarModal("modalUsuario");

    console.log("Datos actualizados del usuario:", datosActualizados);
  });
}

function pintarProductosFiltrados() {
  const productosFiltrados = filtrarProductos(state.productos, state.filtros);

  renderizarProductos(productosFiltrados, state.usuarioAutenticado);

  actualizarMensajeEstado(
    `${productosFiltrados.length} vinilo(s) encontrado(s)`
  );
}

function actualizarInterfazUsuario() {
  const btnUsuario = document.querySelector("#btnUsuario");
  const btnCarrito = document.querySelector("#btnCarrito");

  if (state.usuarioAutenticado) {
    btnUsuario.textContent = `Hola, ${state.usuarioAutenticado.nombre}`;
    btnCarrito.disabled = false;
  } else {
    btnUsuario.textContent = "Usuario";
    btnCarrito.disabled = true;
  }
}

function buscarProductoPorId(idProducto) {
  return state.productos.find((producto) => producto.id === idProducto);
}