document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. LÓGICA DEL MENÚ LATERAL (Aplica para todas las páginas)
    // ==========================================================================
    const sidebar = document.getElementById('sidebar');
    const btnLogo = document.getElementById('btn-logo');
    const btnFlecha = document.getElementById('btn-flecha');

    // Solo se ejecuta si los botones existen en el HTML
    if (sidebar && btnLogo && btnFlecha) {
        const toggleSidebar = (e) => {
            e.preventDefault(); 
            sidebar.classList.toggle('collapsed');
            
            // Alternar ícono de salida
            const iconoFlecha = btnFlecha.querySelector('i');
            if(sidebar.classList.contains('collapsed')) {
                iconoFlecha.classList.replace('fa-right-to-bracket', 'fa-door-open'); 
            } else {
                iconoFlecha.classList.replace('fa-door-open', 'fa-right-to-bracket'); 
            }
        };

        btnLogo.addEventListener('click', toggleSidebar);
        btnFlecha.addEventListener('click', toggleSidebar);
    }

    // ==========================================================================
    // 2. LÓGICA DE LA CUADRÍCULA DE LECCIONES (Solo para la página principal)
    // ==========================================================================
    const gridLecciones = document.getElementById('grid-lecciones');

    // Solo se ejecuta si existe el contenedor de la cuadrícula
    if (gridLecciones) {
        const totalLecciones = 11;
        
        // ARRAY DE TEXTOS DINÁMICOS
        const descripcionesLecciones = [
            "Introducción a la estructura base de HTML y preparación del entorno.",
            "Estilos CSS | Padding Margin y Border",
            "Próximamente",
            "Próximamente",
            "Próximamente",
            "Próximamente",
            "Próximamente",
            "Próximamente",
            "Próximamente",
            "Próximamente",
            "Próximamente"
        ];

        async function verificarArchivo(url) {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                return response.ok; 
            } catch (error) {
                console.error(`Error verificando ${url}:`, error);
                return false;
            }
        }

        async function renderizarGrid() {
            // Generar Lecciones 1 al 11
            for (let i = 1; i <= totalLecciones; i++) {
                const url = `lecciones/leccion${i}.html`;
                const existe = await verificarArchivo(url);
                
                const claseBoton = existe ? 'btn-primary' : 'btn-inactive';
                const enlace = existe ? url : '#';
                
                // Obtenemos el texto de la lista (recordando que los arrays empiezan en 0)
                const textoDinamico = descripcionesLecciones[i - 1];

                const cardHTML = `
                    <div class="leccion-card">
                        <a href="${enlace}" class="btn-big ${claseBoton}">
                            Lección ${i}
                        </a>
                        <p class="leccion-desc">${textoDinamico}</p>
                    </div>
                `;
                gridLecciones.insertAdjacentHTML('beforeend', cardHTML);
            }

            // Generar Examen
            const urlExamen = 'examen/index.html'; 
            const examenExiste = await verificarArchivo(urlExamen);
            
            const claseExamen = examenExiste ? 'btn-danger' : 'btn-inactive';
            const enlaceExamen = examenExiste ? urlExamen : '#';

            const cardExamenHTML = `
                <div class="leccion-card">
                    <a href="${enlaceExamen}" class="btn-big ${claseExamen}">
                        Examen
                    </a>
                    <p class="leccion-desc">Próximamente</p>
                </div>
            `;
            gridLecciones.insertAdjacentHTML('beforeend', cardExamenHTML);
        }

        renderizarGrid();
    }

    // ==========================================================================
    // 3. LÓGICA DE LA LECCIÓN (Solo para páginas que tengan el video y controles)
    // ==========================================================================
    const inputUrl = document.getElementById('yt-url');
    
    // Condición de seguridad: Solo se ejecuta si estamos en una página con el input de YouTube
    if (inputUrl) {
        const ytIcon = document.getElementById('yt-icon');
        const btnValidar = document.getElementById('btn-validar');
        const seccionEntrada = document.getElementById('seccion-entrada');
        const seccionControles = document.getElementById('seccion-controles');
        const workspaceInicial = document.getElementById('workspace-inicial');
        const videoContainer = document.getElementById('video-container');

        let currentBorde = "0px";
        let currentScale = "1.0";
        let currentAlignX = "center";
        let currentAlignY = "center";

        inputUrl.addEventListener('input', () => {
            if (inputUrl.value.toLowerCase().includes('shorts')) {
                ytIcon.classList.add('valid');
            } else {
                ytIcon.classList.remove('valid');
            }
        });

        btnValidar.addEventListener('click', () => {
            const url = inputUrl.value;
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                let videoId = "";
                const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
                if (match && match[1]) {
                    videoId = match[1];
                }
                videoContainer.innerHTML = `<iframe id="main-video" width="315" height="560" src="https://www.youtube-nocookie.com/embed/${videoId}" allowfullscreen></iframe>`;
                document.getElementById('modal-success').style.display = 'flex';
                workspaceInicial.style.display = 'none';
                videoContainer.style.display = 'flex';
                seccionEntrada.style.display = 'none';
                seccionControles.style.display = 'block';
            } else {
                alert("Por favor, ingresa un link válido de YouTube.");
            }
        });

        window.setBorde = (val) => {
            currentBorde = val;
            const video = document.getElementById('main-video');
            if(video) video.style.borderRadius = val;
            document.getElementById('code-borde').innerText = val;
        };

        window.setScale = (val) => {
            currentScale = val;
            const video = document.getElementById('main-video');
            if(video) video.style.transform = `scale(${val})`;
            document.getElementById('code-scale').innerText = val;
        };

        window.setAlign = (x, y) => {
            currentAlignX = x;
            currentAlignY = y;
            videoContainer.style.justifyContent = x;
            videoContainer.style.alignItems = y;
            document.getElementById('code-align-x').innerText = x;
            document.getElementById('code-align-y').innerText = y;
        };

        window.cerrarModal = (id) => {
            document.getElementById(id).style.display = 'none';
        };

        // Verificamos el botón de finalizar por si acaso
        const btnFinalizar = document.getElementById('btn-finalizar');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', () => {
                const codigoFinal = `
<span class="css-prop">.video-wrapper</span> {
    <span class="css-prop">display</span>: <span class="css-val">flex</span>;
    <span class="css-prop">justify-content</span>: <span class="css-val">${currentAlignX}</span>;
    <span class="css-prop">align-items</span>: <span class="css-val">${currentAlignY}</span>;
}

<span class="css-prop">iframe</span> {
    <span class="css-prop">border-radius</span>: <span class="css-val">${currentBorde}</span>;
    <span class="css-prop">transform</span>: scale(<span class="css-val">${currentScale}</span>);
}`;
                document.getElementById('codigo-final-texto').innerHTML = codigoFinal;
                document.getElementById('modal-final').style.display = 'flex';
            });
        }
    }
});