const API_MONEDAS = "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,GBP";

export async function obtenerTasasCambio() {
  try {
    const respuesta = await fetch(API_MONEDAS);

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las tasas de cambio.");
    }

    const datos = await respuesta.json();

    return {
      EUR: 1,
      USD: datos.rates.USD,
      GBP: datos.rates.GBP
    };
  } catch (error) {
    console.error(error);

    return {
      EUR: 1,
      USD: 1.08,
      GBP: 0.86
    };
  }
}

export function formatearPrecio(precioBaseEUR, moneda, tasasCambio) {
  const tasa = tasasCambio[moneda] || 1;
  const precioConvertido = precioBaseEUR * tasa;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: moneda
  }).format(precioConvertido);
}