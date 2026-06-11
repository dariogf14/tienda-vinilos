export function rellenarSelectCategorias(categorias) {
  const selectCategorias = document.querySelector("#filtroCategoria");

  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria.id;
    option.textContent = categoria.nombre;

    selectCategorias.appendChild(option);
  });
}

export function rellenarSelectMarcas(marcas) {
  const selectMarcas = document.querySelector("#filtroMarca");

  marcas.forEach((marca) => {
    const option = document.createElement("option");
    option.value = marca.id;
    option.textContent = marca.nombre;

    selectMarcas.appendChild(option);
  });
}

export function filtrarProductos(productos, filtros) {
  const textoBusqueda = filtros.texto.toLowerCase().trim();
  const categoriaSeleccionada = filtros.categoria;
  const marcaSeleccionada = filtros.marca;

  return productos.filter((producto) => {
    const coincideTexto =
      producto.nombre.toLowerCase().includes(textoBusqueda) ||
      producto.descripcion.toLowerCase().includes(textoBusqueda) ||
      producto.marca_nombre.toLowerCase().includes(textoBusqueda) ||
      producto.categoria_nombre.toLowerCase().includes(textoBusqueda) ||
      Object.values(producto.caracteristicas)
        .join(" ")
        .toLowerCase()
        .includes(textoBusqueda);

    const coincideCategoria =
      categoriaSeleccionada === "" ||
      producto.categoria_id === Number(categoriaSeleccionada);

    const coincideMarca =
      marcaSeleccionada === "" ||
      producto.marca_id === Number(marcaSeleccionada);

    return coincideTexto && coincideCategoria && coincideMarca;
  });
}