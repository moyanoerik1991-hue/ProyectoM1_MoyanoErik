/* Elementos del DOM */
const select = document.getElementById("cantidad");
const galeria = document.getElementById("galeria");

const btnHSL = document.getElementById("btnHSL");
const btnHEX = document.getElementById("btnHEX");

const toggleTema = document.getElementById("toggleTema");

let mensajeActivo = null;
/* GENERA COLOR ALEATORIO EN FORMATO HSL */
function colorHSLAleatorio() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 100); 
  const l = Math.floor(Math.random() * 100);

  return {
    color: `HSL(${h}, ${s}%, ${l}%)`,
    h,
    s,
    l
  };
}
/* hsltohex nuevo */
function HSLtoHEX(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);

  const f = n =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

  const r = f(0);
  const g = f(8);
  const b = f(4);

  return (
    "#" +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
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
  
  galeria.replaceChildren();

  for (let i = 0; i < cantidad; i++) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");

    let color;
    let colorTexto;
    let hexFinal;

    const info = document.createElement("div");
    info.classList.add("info-color");

    const titulo = document.createElement("h3");
    titulo.textContent = `${i + 1}. ${formato}`;

    /* LÓGICA SEGÚN FORMATO */
    if (formato === "HSL") {
        const { color: colorHSL, h, s, l } = colorHSLAleatorio();
        color = colorHSL;

        const hex = HSLtoHEX(h, s, l);
        hexFinal = hex;

        colorTexto = l > 50 ? "black" : "white";

        const textoHSL = document.createElement("p");
        textoHSL.textContent = colorHSL;

        const textoHEX = document.createElement("p");
        textoHEX.textContent = `HEX ${hex}`;

        info.appendChild(titulo);
        info.appendChild(textoHSL);
        info.appendChild(textoHEX);

    } else {
          color = colorHEXAleatorio();
          hexFinal = color;

          colorTexto = colorTextoParaHEX(color);

          const textoHEX = document.createElement("p");
          textoHEX.textContent = `HEX ${color}`;

          info.appendChild(titulo);
          info.appendChild(textoHEX);
    }

    tarjeta.appendChild(info);

    tarjeta.addEventListener("click", () => {
      navigator.clipboard.writeText(hexFinal)
        .then(() => {

          /* eliminar mensaje anterior si existe */
          if (mensajeActivo) {
          mensajeActivo.remove();
          }

          /* crear nuevo mensaje */
          const mensaje = document.createElement("span");
          mensaje.textContent = "Copiado ✔";
          mensaje.classList.add("mensaje-copy");

          tarjeta.appendChild(mensaje);

          /* guardar referencia */
          mensajeActivo = mensaje;

        })
        .catch(err => {
          console.error("Error al copiar:", err);
        });
      });
    /* Aplicar estilos dinámicos */
    tarjeta.style.setProperty("--color-fondo", color);
    tarjeta.style.setProperty("--color-texto", colorTexto);

    galeria.appendChild(tarjeta);
  }
}

/* =========================
   EVENTOS
========================= */

btnHSL.addEventListener("click", () => {
  const cantidad = parseInt(select.value, 10);
  generarTarjetas(cantidad, "HSL");
});

btnHEX.addEventListener("click", () => {
  const cantidad = parseInt(select.value, 10);
  generarTarjetas(cantidad, "HEX");
});

toggleTema.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    toggleTema.textContent = "☀️";
  } else {
    toggleTema.textContent = "🌙";
  }
});

/* Colores Aleatorios HEX o HSL al cargar la página */
document.addEventListener("DOMContentLoaded", () => {
  const formato = Math.random() > 0.5 ? "HSL" : "HEX";
  generarTarjetas(9, formato);
});