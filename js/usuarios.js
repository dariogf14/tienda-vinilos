export function buscarUsuarioPorCredenciales(usuarios, email, password) {
  return usuarios.find((usuario) => {
    return usuario.email === email && usuario.password === password;
  });
}

export function rellenarFormularioPerfil(usuario) {
  document.querySelector("#perfilNombre").value = usuario.nombre;
  document.querySelector("#perfilApellidos").value = usuario.apellidos;
  document.querySelector("#perfilEmail").value = usuario.email;
  document.querySelector("#perfilTelefono").value = usuario.telefono;
  document.querySelector("#perfilCalle").value = usuario.direccion.calle;
  document.querySelector("#perfilCiudad").value = usuario.direccion.ciudad;
  document.querySelector("#perfilCodigoPostal").value =
    usuario.direccion.codigo_postal;
  document.querySelector("#perfilPais").value = usuario.direccion.pais;
}

export function obtenerDatosFormularioPerfil(usuarioOriginal) {
  return {
    ...usuarioOriginal,
    nombre: document.querySelector("#perfilNombre").value.trim(),
    apellidos: document.querySelector("#perfilApellidos").value.trim(),
    email: document.querySelector("#perfilEmail").value.trim(),
    telefono: document.querySelector("#perfilTelefono").value.trim(),
    direccion: {
      calle: document.querySelector("#perfilCalle").value.trim(),
      ciudad: document.querySelector("#perfilCiudad").value.trim(),
      codigo_postal: document.querySelector("#perfilCodigoPostal").value.trim(),
      pais: document.querySelector("#perfilPais").value.trim()
    },
    fecha_actualizacion: new Date().toISOString()
  };
}

export function validarDatosPerfil(datosUsuario) {
  if (
    datosUsuario.nombre === "" ||
    datosUsuario.apellidos === "" ||
    datosUsuario.email === "" ||
    datosUsuario.telefono === "" ||
    datosUsuario.direccion.calle === "" ||
    datosUsuario.direccion.ciudad === "" ||
    datosUsuario.direccion.codigo_postal === "" ||
    datosUsuario.direccion.pais === ""
  ) {
    return "Todos los campos son obligatorios.";
  }

  if (!datosUsuario.email.includes("@")) {
    return "El email no tiene un formato válido.";
  }

  if (datosUsuario.telefono.length < 9) {
    return "El teléfono debe tener al menos 9 caracteres.";
  }

  return "";
}

export function mostrarFormularioLogin() {
  document.querySelector("#tituloModalUsuario").textContent = "Iniciar sesión";
  document.querySelector("#formLogin").classList.remove("hidden");
  document.querySelector("#formPerfil").classList.add("hidden");
  document.querySelector("#mensajeLogin").textContent = "";
}

export function mostrarFormularioPerfil() {
  document.querySelector("#tituloModalUsuario").textContent = "Editar perfil";
  document.querySelector("#formLogin").classList.add("hidden");
  document.querySelector("#formPerfil").classList.remove("hidden");
  document.querySelector("#mensajePerfil").textContent = "";
}