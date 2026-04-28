/* Elementos del DOM */
const select = document.getElementById("cantidad");
const galeria = document.getElementById("galeria");

const btnHSL = document.getElementById("btnHSL");
const btnHEX = document.getElementById("btnHEX");

const btnVer = document.getElementById("verGuardados");
const btnLimpiar = document.getElementById("limpiarStorage");

const toggleTema = document.getElementById("toggleTema");

let mensajeActivo = null;

let vistaActual = {
  cantidad: 9,
  formato: "HSL",
  colores: []
};

let modoGuardadosActivo = false;

/* =========================
   FUNCIONES
========================= */

function colorHSLAleatorio() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 100);
  const l = Math.floor(Math.random() * 100);
  return { color: `HSL(${h}, ${s}%, ${l}%)`, h, s, l };
}

function HSLtoHEX(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

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
  const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminancia > 128 ? "black" : "white";
}

/* LOCALSTORAGE */
function obtenerGuardados() {
  return JSON.parse(localStorage.getItem("colores")) || [];
}

function guardarColor(hex) {
  const guardados = obtenerGuardados();
  if (!guardados.includes(hex)) {
    guardados.push(hex);
    localStorage.setItem("colores", JSON.stringify(guardados));
  }
}

function eliminarColor(hex) {
  let guardados = obtenerGuardados();
  guardados = guardados.filter(c => c !== hex);
  localStorage.setItem("colores", JSON.stringify(guardados));
}

/* CREA UNA TARJETA */
function crearTarjeta(hexFinal, index, formato = "HEX", hslData = null) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");

  const colorTexto = colorTextoParaHEX(hexFinal);
  tarjeta.style.setProperty("--color-fondo", hexFinal);
  tarjeta.style.setProperty("--color-texto", colorTexto);

  const info = document.createElement("div");
  info.classList.add("info-color");

  const titulo = document.createElement("h3");
  titulo.textContent = `${index + 1}. ${formato}`;
  info.appendChild(titulo);

  if (hslData) {
    const textoHSL = document.createElement("p");
    textoHSL.textContent = hslData;
    info.appendChild(textoHSL);
  }

  const textoHEX = document.createElement("p");
  textoHEX.textContent = `HEX ${hexFinal}`;
  info.appendChild(textoHEX);

  tarjeta.appendChild(info);

  /* CANDADO */
  const lock = document.createElement("span");
  lock.classList.add("lock");

  let bloqueado = obtenerGuardados().includes(hexFinal);
  lock.textContent = bloqueado ? "🔒" : "🔓";
  lock.title = bloqueado ? "Color guardado" : "Guardar color";
  if (bloqueado) lock.classList.add("activo");

  lock.addEventListener("click", (e) => {
    e.stopPropagation();
    bloqueado = !bloqueado;
    if (bloqueado) {
      guardarColor(hexFinal);
      lock.textContent = "🔒";
      lock.title = "Color guardado";
      lock.classList.add("activo");
    } else {
      eliminarColor(hexFinal);
      lock.textContent = "🔓";
      lock.title = "Guardar color";
      lock.classList.remove("activo");
    }
  });

  tarjeta.appendChild(lock);

  /* COPIAR AL PORTAPAPELES */
  tarjeta.addEventListener("click", () => {
    navigator.clipboard.writeText(hexFinal).then(() => {
      if (mensajeActivo) mensajeActivo.remove();
      const mensaje = document.createElement("span");
      mensaje.textContent = `Copiado ✔`;
      mensaje.classList.add("mensaje-copy");
      tarjeta.appendChild(mensaje);
      mensajeActivo = mensaje;
    });
  });

  return tarjeta;
}

/* GENERA TARJETAS NUEVAS */
function generarTarjetas(cantidad, formato) {
  galeria.replaceChildren();

  vistaActual = { cantidad, formato, colores: [] };

  for (let i = 0; i < cantidad; i++) {
    let hexFinal;
    let hslTexto = null;

    if (formato === "HSL") {
      const { color, h, s, l } = colorHSLAleatorio();
      hexFinal = HSLtoHEX(h, s, l);
      hslTexto = color;
    } else {
      hexFinal = colorHEXAleatorio();
    }

    vistaActual.colores.push(hexFinal);
    galeria.appendChild(crearTarjeta(hexFinal, i, formato, hslTexto));
  }
}

/* RENDERIZA DESDE UN ARRAY DE COLORES (para guardados y volver) */
function renderDesdeColores(colores) {
  galeria.replaceChildren();
  colores.forEach((hex, i) => {
    galeria.appendChild(crearTarjeta(hex, i, "HEX"));
  });
}

/* =========================
   EVENTOS
========================= */

/* HSL */
btnHSL.addEventListener("click", () => {
  const cantidad = parseInt(select.value, 10);
  generarTarjetas(cantidad, "HSL");

  btnHSL.classList.add("activo");
  btnHEX.classList.remove("activo");
});

/* HEX */
btnHEX.addEventListener("click", () => {
  const cantidad = parseInt(select.value, 10);
  generarTarjetas(cantidad, "HEX");

  btnHEX.classList.add("activo");
  btnHSL.classList.remove("activo");
});

toggleTema.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleTema.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

/* Ver guardados / Volver */
btnVer.addEventListener("click", () => {
  if (!modoGuardadosActivo) {
    renderDesdeColores(obtenerGuardados());
    btnVer.textContent = "Volver";
    modoGuardadosActivo = true;

    /* verde en ver y limpiar */
    btnVer.classList.add("guardados-activo");
    btnLimpiar.classList.add("guardados-activo");

    /* deshabilitar controles */
    btnHSL.disabled = true;
    btnHEX.disabled = true;
    select.disabled = true;

  } else {
    renderDesdeColores(vistaActual.colores);
    btnVer.textContent = "Colores Guardados";
    modoGuardadosActivo = false;

    /* quitar verde */
    btnVer.classList.remove("guardados-activo");
    btnLimpiar.classList.remove("guardados-activo");

    /* rehabilitar controles */
    btnHSL.disabled = false;
    btnHEX.disabled = false;
    select.disabled = false;
  }
});

btnLimpiar.addEventListener("click", () => {
    localStorage.removeItem("colores");
        if (modoGuardadosActivo) {
            renderDesdeColores([]);
        }
    });

/* Colores Aleatorios HEX o HSL al cargar la página */
document.addEventListener("DOMContentLoaded", () => {
  const formato = Math.random() > 0.5 ? "HSL" : "HEX";
  generarTarjetas(9, formato);
});