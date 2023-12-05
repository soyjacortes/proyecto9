let eventos = [];// variable para guardar eventos 
let arr = []; //permite enviarlos al local storage

const nombreEvento = document.querySelector("#nombreEvento");//se almacenan variables del usuario
const fechaEvento = document.querySelector("#fechaEvento");
const botnAgregar = document.querySelector("#agregar");
const listaEventos = document.querySelector("#listaEventos");

const json = cargar();//trae los datos del local

try {
    arr = JSON.parse(json);//busca eventos 
} catch (error) {
    arr= []
}
eventos = arr? [...arr] : [];//acumular y agregar eventos

mostrarEventos();

document.querySelector("form").addEventListener("submit", e => {//atrapa todo elemento enviado
    e.preventDefault();//deja los campos por defecto en vacio
    agregarEvento();
})

function agregarEvento() { //en caso de enviar algo vacio se le retorna vacio
    if(nombreEvento.value === "" || fechaEvento.value === "") {
        return;
    }
    if(diferenciaFecha(fechaEvento.value) < 0) {//esta funcion dice cuanto dias faltan
        return;
    }

    const nuevoEvento = {
        id: (Math.random() * 100).toString(36).slice(3),//el id pasa a string de 36 bits y solo toma 3
        nombre: nombreEvento.value, //Se almacena el dato en un formato .json
        fecha: fechaEvento.value, //Se almacena el dato en un formato .json
    
    };

    eventos.unshift(nuevoEvento);//carga los eventos

    guardar(JSON.stringify(eventos));//guardar los eventos

    nombreEvento.value = ""

    mostrarEventos();
}

function diferenciaFecha(destino){
    let fechaDestino = new Date(destino);//fecha enviada del formulario
    let fechaActual = new Date();// fecha del dia de hoy
    let diferencia = fechaDestino.getTime() - fechaActual.getTime();
    let dias = Math.ceil(diferencia / (1000 * 3600 * 24)); // segundo minutos horas
    return dias;
}

function mostrarEventos(){
    const eventosHTML = eventos.map((eventos) => {//mapea los eventos para mostrar en el html
        return `
        <div class="evento">
            <div class="dias">
                <span class="diasFaltantes">${diferenciaFecha(eventos.fecha)}</span>
                <span class="texto">días para</span>
            </div>

            <div class="nombreEvento">${eventos.nombre}</div>
            <div class="fechaEvento">${eventos.fecha}</div>
            <div class="acciones">
                <button data-id="${eventos.id}" class="eliminar">Eliminar</button>
            </div>

        </div>`;//se construye el html
    }); 
    listaEventos.innerHTML = eventosHTML.join("");//inserte los eventosHTML en listaEventos
    document.querySelectorAll('.eliminar').forEach(button => {
        button.addEventListener("click", e => {
            const id = button.getAttribute('data-id');
            eventos = eventos.filter(evento => evento.id !== id);

            guardar(JSON.stringify(eventos));//actualice sihay un evento eliminado

            mostrarEventos();   
        });
    });
}

function guardar(datos){
    localStorage.setItem("lista", datos);//los guarda en el localStorage
}

function cargar(){
    return localStorage.getItem("lista");//trae los elemntos del local
}