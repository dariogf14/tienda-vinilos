export async function cargarJSON(ruta) {
  const respuesta = await fetch(ruta);

  if (!respuesta.ok) {
    throw new Error(`Error al cargar ${ruta}`);
  }

  return await respuesta.json();
}

export async function cargarDatosTienda() {
  const [productos, categorias, marcas, usuarios] = await Promise.all([
    cargarJSON("./datos/productos.json"),
    cargarJSON("./datos/categorias.json"),
    cargarJSON("./datos/marcas.json"),
    cargarJSON("./datos/usuarios.json")
  ]);

  return {
    productos,
    categorias,
    marcas,
    usuarios
  };
}

export function cruzarDatosProductos(productos, categorias, marcas) {
  return productos.map((producto) => {
    const categoriaEncontrada = categorias.find(
      (categoria) => categoria.id === producto.categoria_id
    );

    const marcaEncontrada = marcas.find(
      (marca) => marca.id === producto.marca_id
    );

    return {
      ...producto,
      categoria_nombre: categoriaEncontrada
        ? categoriaEncontrada.nombre
        : "Sin categoría",
      marca_nombre: marcaEncontrada
        ? marcaEncontrada.nombre
        : "Sin artista"
    };
  });
}