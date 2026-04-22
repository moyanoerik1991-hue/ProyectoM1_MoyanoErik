const select = document.getElementById("cantidad");
const galeria = document.getElementById("galeria");
const botonAccion = document.getElementById("Iniciar");

/* GENERA COLOR ALEATORIO EN FORMATO HSL */
function colorHSLAleatorio() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 100); 
  const l = Math.floor(Math.random() * 100);

  return {
    color: `hsl(${h}, ${s}%, ${l}%)`,
    l
  };
}

/* GENERA LAS TARJETAS CON LOS COLORES */
function generarTarjetas(cantidad) {
  galeria.innerHTML = "";

  for (let i = 0; i < cantidad; i++) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("foto-tarjeta");
    const { color, l } = colorHSLAleatorio();

    tarjeta.innerHTML = `
        <div class="foto-info">
            <h3 class="foto-titulo">${i + 1}. Paleta de colores vibrantes</h3>
            <p class="color-formato">${color}</p>
        </div>
    `;
    /* La tarjeta se pinta con el color generado y el texto se adapta al contraste */
    tarjeta.style.backgroundColor = color;
    tarjeta.style.color = l > 50 ? "black" : "white";
    /* Se agrega la tarjeta a la galería */
    galeria.appendChild(tarjeta);
  }
}
// Evento cuando cambia el select
botonAccion.addEventListener("click", () => {
  const cantidadSeleccionada = parseInt(select.value);
  const tarjetas = document.querySelectorAll(".foto-tarjeta");

  if (tarjetas.length !== cantidadSeleccionada) {
    // Si la cantidad es distinta → regenerar tarjetas
    generarTarjetas(cantidadSeleccionada);
  } else {
    // Si es la misma cantidad → solo cambiar colores
    tarjetas.forEach(tarjeta => {
      const { color, l } = colorHSLAleatorio();

      tarjeta.style.backgroundColor = color;
      tarjeta.style.color = l > 50 ? "black" : "white";

      tarjeta.querySelector(".color-formato").textContent = color;
    });
  }
});
// Generar 1 por defecto al cargar
generarTarjetas(0);