// FOTOS + RESPUESTA CORRECTA
const fotos = [
    { archivo: "img/foto1.jpg", correcta: "Dalmau", seleccion: null },
    { archivo: "img/foto2.jpg", correcta: "David", seleccion: null },
    { archivo: "img/foto3.jpg", correcta: "Dani", seleccion: null },
    { archivo: "img/foto4.jpg", correcta: "Belen", seleccion: null },
];

// OPCIONES DISPONIBLES
const opciones = ["David", "Laia", "Edgar", "Belen", "Arnau", "Dani", "Vero", "Dalmau", "Maju", "Rosa", "Edu", "Karen"];

const container = document.getElementById("game-container");

// Nombres globalmente acertados
let nombresAcertados = new Set();

// Mantiene referencia del selector activo
let selectorActivo = null;

// Mezcla aleatoria estilo Fisher–Yates
function shuffle(array) {
    let m = array.length, i, t;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}



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

    // === CREAR BOCADILLOS ===
    shuffle([...opciones]).forEach(nombre => {
        const chip = document.createElement("div");
        chip.className = "bocadillo";
        chip.textContent = nombre;

        chip.addEventListener("click", () => {
            if (foto.seleccion === nombre) {
                cerrarSelector(selector, img);
                return;
            }

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

    // === ABRIR SELECTOR ===
    img.addEventListener("click", () => {
        // Cerrar anterior
        if (selectorActivo && selectorActivo.selector !== selector) {
            cerrarSelector(selectorActivo.selector, selectorActivo.img);
        }

        const visible = selector.style.display === "flex";
        selector.style.display = visible ? "none" : "flex";
        img.classList.toggle("foto-blur", !visible);

        selectorActivo = visible ? null : { selector, img };

        const seleccionActual = foto.seleccion;

        // === ACTUALIZAR BOCADILLOS (desactivación global + local) ===
        [...selector.children].forEach(chip => {
            if (!chip.classList.contains("bocadillo")) return;

            const nombre = chip.textContent;

            chip.classList.remove("disabled");

            // 1. Desactivar el nombre ya seleccionado en esta foto
            if (nombre === seleccionActual) {
                chip.classList.add("disabled");
                return;
            }

            // 2. Desactivar nombres globalmente acertados
            if (nombresAcertados.has(nombre)) {
                chip.classList.add("disabled");
                return;
            }
        });
    });

    // === X PARA CERRAR ===
    closeBtn.addEventListener("click", () => cerrarSelector(selector, img));

    // === CERRAR AL TOCAR FUERA ===
    selector.addEventListener("click", e => {
        if (e.target === selector) cerrarSelector(selector, img);
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

    // Reset nombres acertados
    nombresAcertados.clear();

    // Cerrar selector activo
    if (selectorActivo) cerrarSelector(selectorActivo.selector, selectorActivo.img);

    // Evaluar fotos
    fotos.forEach((foto, idx) => {
        const overlay = document.getElementById(`overlay-${idx}`);
        overlay.className = "overlay";

        if (foto.seleccion === foto.correcta) {
            overlay.textContent = "✔ Correcto";
            overlay.classList.add("correcto");

            // Añadir nombre bloqueado globalmente
            nombresAcertados.add(foto.correcta);

        } else {
            overlay.textContent = "✘ Incorrecto";
            overlay.classList.add("incorrecto");
        }
    });
});
