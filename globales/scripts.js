document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. LÓGICA DEL MENÚ LATERAL (Aplica para todas las páginas)
    // ==========================================================================
    const sidebar = document.getElementById('sidebar');
    const btnLogo = document.getElementById('btn-logo');
    const btnFlecha = document.getElementById('btn-flecha');

    if (sidebar && btnLogo && btnFlecha) {
        const toggleSidebar = (e) => {
            e.preventDefault(); 
            sidebar.classList.toggle('collapsed');
            
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
    // 2. LÓGICA DE LA CUADRÍCULA (Renderizado ultrarrápido sin Fetch)
    // ==========================================================================
    const gridLecciones = document.getElementById('grid-lecciones');

    if (gridLecciones) {
        
        // ARRAY DE CONFIGURACIÓN: Control total sobre qué botón se enciende
        // Simplemente cambia 'activa: false' a 'activa: true' cuando subas una nueva lección
        const leccionesConfig = [
            { id: 1, desc: "Introducción a la estructura base de HTML y preparación del entorno.", activa: true },
            { id: 2, desc: "Estilos CSS | Padding Margin y Border", activa: true },
            { id: 3, desc: "Próximamente", activa: false },
            { id: 4, desc: "Próximamente", activa: false },
            { id: 5, desc: "Próximamente", activa: false },
            { id: 6, desc: "Próximamente", activa: false },
            { id: 7, desc: "Próximamente", activa: false },
            { id: 8, desc: "Próximamente", activa: false },
            { id: 9, desc: "Próximamente", activa: false },
            { id: 10, desc: "Próximamente", activa: false },
            { id: 11, desc: "Próximamente", activa: false }
        ];

        // Configuración independiente para el examen
        const examenConfig = { desc: "Próximamente", activa: false };

        function renderizarGrid() {
            // 1. Construir las lecciones normales
            leccionesConfig.forEach(leccion => {
                const claseBoton = leccion.activa ? 'btn-primary' : 'btn-inactive';
                const enlace = leccion.activa ? `lecciones/leccion${leccion.id}.html` : '#';

                const cardHTML = `
                    <div class="leccion-card">
                        <a href="${enlace}" class="btn-big ${claseBoton}">
                            Lección ${leccion.id}
                        </a>
                        <p class="leccion-desc">${leccion.desc}</p>
                    </div>
                `;
                gridLecciones.insertAdjacentHTML('beforeend', cardHTML);
            });

            // 2. Construir el botón de Examen
            const claseExamen = examenConfig.activa ? 'btn-danger' : 'btn-inactive';
            const enlaceExamen = examenConfig.activa ? 'examen/index.html' : '#';

            const cardExamenHTML = `
                <div class="leccion-card">
                    <a href="${enlaceExamen}" class="btn-big ${claseExamen}">
                        Examen
                    </a>
                    <p class="leccion-desc">${examenConfig.desc}</p>
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