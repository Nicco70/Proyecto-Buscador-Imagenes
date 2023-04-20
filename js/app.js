const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const resultadosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino a la búsqueda');
        return;
    }

    buscarImagenes();
}

// Muestra una alerta de error o correcto
function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.bg-red-100');
    if(!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

// Busca las imagenes en una API
function buscarImagenes() {

    const terminoBusqueda = document.querySelector('#termino').value;

    const key = '22623832-681678399f9d59319a2d4715a';
    const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=${resultadosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function *crearPaginacion(total) {
    for( let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt( Math.ceil( total / resultadosPorPagina ));
}

function mostrarImagenes(imagenes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const { likes, views, previewURL, largeImageURL } = imagen;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
                <div class="bg-white ">
                    <img class="w-full" src=${previewURL} alt={tags} />
                    <div class="p-4">
                        <p class="font-bold card-text">${likes} <span class="font-light"> Me gustas </span></p>
                        <p class="font-bold card-text">${views} <span class="font-light"> Vistas </span></p>
        
                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
            `;
    });

    // Limpiar el paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    // Generamos el nuevo HTML de la paginación
    imprimirPaginador();
}

function imprimirPaginador() {
     // recorrer el iterador
     iterador = crearPaginacion(totalPaginas);
     while( true ) {
         const { value, done } = iterador.next();
         if(done) return;

         // Caso contrario; generar un botón por cada elemento en el generador 
         const botonSiguiente = document.createElement('a');
         botonSiguiente.href = "#";
         botonSiguiente.dataset.pagina = value;
         botonSiguiente.textContent = value;
         botonSiguiente.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mx-auto', 'mb-4', 'font-bold', 'rounded');
        // Cambiar color al boton de la pagina actual
         btnResaltado(botonSiguiente);

         botonSiguiente.onclick = () => {
            paginaActual = value;

            buscarImagenes();
         }
         paginacionDiv.appendChild(botonSiguiente);
     }
 }

 function btnResaltado(botonSiguiente) {
        if(botonSiguiente.textContent == paginaActual){
            botonSiguiente.classList.remove('bg-yellow-400')
            botonSiguiente.classList.add('bg-yellow-700')
            return;
        }
    }


