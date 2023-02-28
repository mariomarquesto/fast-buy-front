export const agregarProductoAlCarritoLocalByProductoId = (product: any) => {
  const carritoActual =
    (JSON.parse(localStorage.getItem("carrito")) as any[]) ?? [];

  const { id, name, description, price } = product;

  carritoActual.push({ id, name, description, price });

  const carritoActualizadoJson = JSON.stringify(carritoActual);

  localStorage.setItem("carrito", carritoActualizadoJson);
};

export const getCarritoLocal = () => {
  const carritoActual =
    (JSON.parse(localStorage.getItem("carrito")) as any[]) ?? [];

  return carritoActual;
};

export const limpiarCarritoLocal = () => {
  localStorage.removeItem("carrito");
};
