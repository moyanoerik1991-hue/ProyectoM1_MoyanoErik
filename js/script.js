
const select = document.getElementById("cantidad");
const galeria = document.getElementById("galeria");

function generarTarjetas(cantidad) {
  galeria.innerHTML = "";

  for (let i = 0; i < cantidad; i++) {
    const tarjeta = document.createElement("article");

    tarjeta.innerHTML = `
      <div class="foto-info">
        <h3 class="foto-titulo">${i + 1}. Paleta de colores vibrantes</h3>
        <p class="foto-descripcion">
          
        </p>
      </div>
    `;
    
    galeria.appendChild(tarjeta);
  }
}
// Evento cuando cambia el select
select.addEventListener("change", () => {
  generarTarjetas(select.value);
});
// Generar 1 por defecto al cargar
generarTarjetas(1);