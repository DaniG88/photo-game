// FOTOS + RESPUESTA CORRECTA
const fotos = [
    { archivo: "img/foto1.png", correcta: "Dani" },
    { archivo: "img/foto2.png", correcta: "Vero" }
];

// OPCIONES DISPONIBLES
const opciones = ["Dani", "Vero", "Juan", "Ana"];

const container = document.getElementById("game-container");

// Crear la interfaz
fotos.forEach((foto, idx) => {
    const div = document.createElement("div");
    div.className = "foto-item";

    div.innerHTML = `
        <img src="${foto.archivo}" alt="foto ${idx + 1}">
        <select id="respuesta-${idx}">
            <option value="">Selecciona...</option>
            ${opciones.map(op => `<option value="${op}">${op}</option>`).join("")}
        </select>
    `;

    container.appendChild(div);
});

// Corrección
document.getElementById("check-btn").addEventListener("click", () => {
    const results = document.getElementById("results");
    results.innerHTML = "";

    fotos.forEach((foto, idx) => {
        const seleccion = document.getElementById(`respuesta-${idx}`).value;
        const correcto = seleccion === foto.correcta;

        const p = document.createElement("p");
        p.textContent = `Foto ${idx + 1}: ${correcto ? "Correcto" : "Incorrecto (era " + foto.correcta + ")"}`;
        p.className = correcto ? "correcto" : "incorrecto";

        results.appendChild(p);
    });
});
