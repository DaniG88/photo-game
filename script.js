// FOTOS + RESPUESTA CORRECTA
const fotos = [
    { archivo: "img/foto1.jpg", correcta: "Dalmau", seleccion: null },
    { archivo: "img/foto2.jpg", correcta: "David", seleccion: null },
    { archivo: "img/foto3.jpg", correcta: "Dani", seleccion: null },
    { archivo: "img/foto4.jpg", correcta: "Belen", seleccion: null },
];

// OPCIONES DISPONIBLES
const opciones = ["David", "Laia", "Edgar", "Belen", "Arnau","Dani", "Vero", "Dalmau", "Maju"];

const container = document.getElementById("game-container");

// Mantiene referencia del selector activo
let selectorActivo = null;


// === GENERAR TODAS LAS FOTOS ===
fotos.forEach((foto, idx) => {

    const div = document.createElement("div");
    div.className = "foto-item";

    div.innerHTML = `
        <div class="selector-bocadillos" id="selector-${idx}">
            <div class="selector-close" id="close-${idx}">✕</div>
        </div>

        <img class="foto-img" src="${foto.archivo}" id="img-${idx}">
        <div class="nombre-elegido" id="nombre-${idx}"></div>
        <div class="overlay" id="overlay-${idx}"></div>
    `;

    container.appendChild(div);

    const selector = document.getElementById(`selector-${idx}`);
    const img = document.getElementById(`img-${idx}`);
    const nombreDiv = document.getElementById(`nombre-${idx}`);
    const closeBtn = document.getElementById(`close-${idx}`);

    // === CREAR BOCADILLOS DE OPCIONES ===
    opciones.forEach(nombre => {
        const chip = document.createElement("div");
        chip.className = "bocadillo";
        chip.textContent = nombre;

        chip.addEventListener("click", () => {

            // Misma opción → solo cerrar
            if (foto.seleccion === nombre) {
                cerrarSelector(selector, img);
                return;
            }

            // Nueva selección
            foto.seleccion = nombre;

            nombreDiv.textContent = nombre;
            nombreDiv.classList.add("show");

            const overlay = document.getElementById(`overlay-${idx}`);
            overlay.className = "overlay";
            overlay.textContent = "";

            cerrarSelector(selector, img);
        });

        selector.appendChild(chip);
    });

    // === ABRIR SELECTOR AL CLICAR LA FOTO ===
    img.addEventListener("click", () => {

        // Si otro selector estaba abierto → cerrarlo
        if (selectorActivo && selectorActivo !== selector) {
            cerrarSelector(selectorActivo.selector, selectorActivo.img);
        }

        const visible = selector.style.display === "flex";
        selector.style.display = visible ? "none" : "flex";
        img.classList.toggle("foto-blur", !visible);

        // Guardar nuevo activo
        selectorActivo = visible ? null : { selector, img };

        // Desactivar bocadillo seleccionado
        const seleccionActual = foto.seleccion;
        [...selector.children].forEach(elem => {
            if (!elem.classList.contains("bocadillo")) return;

            if (elem.textContent === seleccionActual) {
                elem.classList.add("disabled");
            } else {
                elem.classList.remove("disabled");
            }
        });
    });

    // === X PARA CERRAR ===
    closeBtn.addEventListener("click", () => {
        cerrarSelector(selector, img);
    });

    // === CERRAR SI SE TOCA FUERA DEL SELECTOR ===
    selector.addEventListener("click", (e) => {
        if (e.target === selector) {
            cerrarSelector(selector, img);
        }
    });
});


// === FUNCIÓN PARA CERRAR SELECTOR ===
function cerrarSelector(selector, img) {
    selector.style.display = "none";
    img.classList.remove("foto-blur");
    selectorActivo = null;
}


// === CHECK ===
document.getElementById("check-btn").addEventListener("click", () => {

    // Cerrar cualquier selector abierto
    if (selectorActivo) {
        cerrarSelector(selectorActivo.selector, selectorActivo.img);
    }

    // Evaluar respuestas
    fotos.forEach((foto, idx) => {
        const overlay = document.getElementById(`overlay-${idx}`);
        overlay.className = "overlay";

        if (foto.seleccion === foto.correcta) {
            overlay.textContent = "✔ Correcto";
            overlay.classList.add("correcto");
        } else {
            overlay.textContent = "✘ Incorrecto";
            overlay.classList.add("incorrecto");
        }
    });
});
