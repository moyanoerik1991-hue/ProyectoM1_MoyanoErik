/* Elementos del DOM */
const select = document.getElementById("cantidad");
const galeria = document.getElementById("galeria");

const btnHSL = document.getElementById("btnHSL");
const btnHEX = document.getElementById("btnHEX");

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
/* GENERA COLOR ALEATORIO EN FORMATO HEX */
function colorHEXAleatorio() {
  const letras = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letras[Math.floor(Math.random() * 16)];
  }

  return color;
}

function colorTextoParaHEX(hex) { 
    const r = parseInt(hex.substring(1, 3), 16); 
    const g = parseInt(hex.substring(3, 5), 16); 
    const b = parseInt(hex.substring(5, 7), 16); 

    /* Fórmula de luminancia relativa para determinar el contraste */
    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b); 

  return luminancia > 128 ? "black" : "white"; 
}

/* GENERA LAS TARJETAS CON LOS COLORES */
function generarTarjetas(cantidad, formato) {
  if (!cantidad || cantidad <= 0) {
      alert("Seleccioná una cantidad válida");
    return;
}

  /* Menos invasivo que el innerHTML, mantiene los eventos y es más eficiente */
  galeria.replaceChildren();

  for (let i = 0; i < cantidad; i++) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");
    
    let color;
    let colorTexto;

  if (formato === "HSL") {
    const { color: colorHSL, l } = colorHSLAleatorio();
    color = colorHSL;
    colorTexto = l > 50 ? "black" : "white";
  } else {
    color = colorHEXAleatorio();
    colorTexto = colorTextoParaHEX(color);
  }

  /* se elimina el innerHTML para evitar inyección de scripts */
  const titulo = document.createElement("h3");
  titulo.textContent = `${i + 1}. Color en Formato ${formato}:`;

  const texto = document.createElement("p");
  texto.textContent = color;

  const contenedor = document.createElement("div");
  contenedor.appendChild(titulo);
  contenedor.appendChild(texto);

  tarjeta.appendChild(contenedor);

    /* La tarjeta se pinta con el color generado y el texto se adapta al contraste */
    tarjeta.style.setProperty("--color-fondo", color);
    tarjeta.style.setProperty("--color-texto", colorTexto);
    /* Se agrega la tarjeta a la galería */
    galeria.appendChild(tarjeta);
  }
}
// Eventos cuando cambia el select
btnHSL.addEventListener("click", () => {
  const cantidad = parseInt(select.value, 10);
  generarTarjetas(cantidad, "HSL");
});

btnHEX.addEventListener("click", () => {
  const cantidad = parseInt(select.value, 10);
  generarTarjetas(cantidad, "HEX");
});
