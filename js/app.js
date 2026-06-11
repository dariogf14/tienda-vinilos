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

import {
  agregarProductoAlCarrito,
  incrementarCantidad,
  decrementarCantidad,
  vaciarCarritoUsuario,
  obtenerCarritoUsuario,
  calcularCantidadProductos,
  renderizarCarrito
} from "./carrito.js";

import {
  obtenerTasasCambio
} from "./api.js";

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
  },
  moneda: "EUR",
  tasasCambio: {
    EUR: 1
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

    state.tasasCambio = await obtenerTasasCambio();

    rellenarSelectCategorias(state.categorias);
    rellenarSelectMarcas(state.marcas);

    configurarEventosFiltros();
    configurarEventosProductos();
    configurarEventosUsuario();
    configurarEventosCarrito();
    configurarEventosMoneda();
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
        mostrarModalDetalles(producto, state.moneda, state.tasasCambio);
      }
    }

    if (evento.target.classList.contains("btn-carrito")) {
      const idProducto = Number(evento.target.dataset.id);
      const producto = buscarProductoPorId(idProducto);

      if (!state.usuarioAutenticado) {
        return;
      }

      if (!producto || producto.stock <= 0) {
        return;
      }

      state.carrito = agregarProductoAlCarrito(
        state.carrito,
        producto,
        state.usuarioAutenticado
      );

      actualizarContadorCarrito();

      console.log("Carrito actualizado:", state.carrito);
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
    actualizarContadorCarrito();

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

function configurarEventosCarrito() {
  const btnCarrito = document.querySelector("#btnCarrito");
  const contenidoCarrito = document.querySelector("#contenidoCarrito");
  const btnVaciarCarrito = document.querySelector("#btnVaciarCarrito");

  btnCarrito.addEventListener("click", () => {
    if (!state.usuarioAutenticado) {
      return;
    }

    pintarCarritoUsuario();
    abrirModal("modalCarrito");
  });

  contenidoCarrito.addEventListener("click", (evento) => {
    const accion = evento.target.dataset.action;
    const idProducto = Number(evento.target.dataset.id);

    if (!accion || !idProducto || !state.usuarioAutenticado) {
      return;
    }

    if (accion === "incrementar") {
      state.carrito = incrementarCantidad(
        state.carrito,
        idProducto,
        state.usuarioAutenticado.id
      );
    }

    if (accion === "decrementar") {
      state.carrito = decrementarCantidad(
        state.carrito,
        idProducto,
        state.usuarioAutenticado.id
      );
    }

    pintarCarritoUsuario();
    actualizarContadorCarrito();

    console.log("Carrito actualizado:", state.carrito);
  });

  btnVaciarCarrito.addEventListener("click", () => {
    if (!state.usuarioAutenticado) {
      return;
    }

    state.carrito = vaciarCarritoUsuario(
      state.carrito,
      state.usuarioAutenticado.id
    );

    pintarCarritoUsuario();
    actualizarContadorCarrito();

    console.log("Carrito vaciado:", state.carrito);
  });
}

function configurarEventosMoneda() {
  const selectMoneda = document.querySelector("#moneda");

  selectMoneda.addEventListener("change", () => {
    state.moneda = selectMoneda.value;

    pintarProductosFiltrados();

    if (state.usuarioAutenticado) {
      pintarCarritoUsuario();
    }
  });
}

function pintarProductosFiltrados() {
  const productosFiltrados = filtrarProductos(state.productos, state.filtros);

  renderizarProductos(
    productosFiltrados,
    state.usuarioAutenticado,
    state.moneda,
    state.tasasCambio
  );

  actualizarMensajeEstado(
    `${productosFiltrados.length} vinilo(s) encontrado(s)`
  );
}

function pintarCarritoUsuario() {
  const carritoUsuario = obtenerCarritoUsuario(
    state.carrito,
    state.usuarioAutenticado.id
  );

  renderizarCarrito(carritoUsuario, state.moneda, state.tasasCambio);
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

function actualizarContadorCarrito() {
  const contadorCarrito = document.querySelector("#contadorCarrito");

  if (!state.usuarioAutenticado) {
    contadorCarrito.textContent = "0";
    return;
  }

  const carritoUsuario = obtenerCarritoUsuario(
    state.carrito,
    state.usuarioAutenticado.id
  );

  const cantidadProductos = calcularCantidadProductos(carritoUsuario);
  contadorCarrito.textContent = cantidadProductos;
}

function buscarProductoPorId(idProducto) {
  return state.productos.find((producto) => producto.id === idProducto);
}