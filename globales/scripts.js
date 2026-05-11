document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE COLAPSO (SIDEBAR Y BOTONES) ---
    const sidebar = document.getElementById('sidebar');
    const btnLogo = document.getElementById('btn-logo');
    const btnFlecha = document.getElementById('btn-flecha');

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

    // --- LÓGICA DE LA LECCIÓN (INPUT Y PLAYGROUND) ---
    const inputUrl = document.getElementById('yt-url');
    const ytIcon = document.getElementById('yt-icon');
    const btnValidar = document.getElementById('btn-validar');
    
    const seccionEntrada = document.getElementById('seccion-entrada');
    const seccionControles = document.getElementById('seccion-controles');
    
    const workspaceInicial = document.getElementById('workspace-inicial');
    const videoContainer = document.getElementById('video-container');

    // Variables de estado inicial
    let currentBorde = "0px";
    let currentScale = "1.0";
    let currentAlignX = "center";
    let currentAlignY = "center";

    // Detectar "shorts" en tiempo real para pintar el ícono de rojo
    inputUrl.addEventListener('input', () => {
        if (inputUrl.value.toLowerCase().includes('shorts')) {
            ytIcon.classList.add('valid');
        } else {
            ytIcon.classList.remove('valid');
        }
    });

    // Validar el link
    // Validar el link
    btnValidar.addEventListener('click', () => {
        const url = inputUrl.value;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            
            // Extraer ID básico
            let videoId = "";
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
            if (match && match[1]) {
                videoId = match[1];
            }
            
            // Cargar el iframe (Usamos youtube-nocookie para evitar bloqueos en entorno local)
            videoContainer.innerHTML = `<iframe id="main-video" width="315" height="560" src="https://www.youtube-nocookie.com/embed/${videoId}" allowfullscreen></iframe>`;
            
            // Mostrar modal de éxito
            document.getElementById('modal-success').style.display = 'flex';
            
            // Cambiar la vista de la pantalla
            workspaceInicial.style.display = 'none';
            videoContainer.style.display = 'flex';
            seccionEntrada.style.display = 'none';
            seccionControles.style.display = 'block';

        } else {
            alert("Por favor, ingresa un link válido de YouTube.");
        }
    });

    // --- FUNCIONES DE LOS BOTONES DEL ACORDEÓN ---
    window.setBorde = (val) => {
        currentBorde = val;
        const video = document.getElementById('main-video');
        if(video) video.style.borderRadius = val;
        
        // Actualizar el texto debajo del acordeón
        document.getElementById('code-borde').innerText = val;
    };

    window.setScale = (val) => {
        currentScale = val;
        const video = document.getElementById('main-video');
        if(video) video.style.transform = `scale(${val})`;
        
        // Actualizar el texto debajo del acordeón
        document.getElementById('code-scale').innerText = val;
    };

    window.setAlign = (x, y) => {
        currentAlignX = x;
        currentAlignY = y;
        videoContainer.style.justifyContent = x;
        videoContainer.style.alignItems = y;
        
        // Actualizar el texto debajo del acordeón
        document.getElementById('code-align-x').innerText = x;
        document.getElementById('code-align-y').innerText = y;
    };

    // --- FUNCIONES FINALES (MODALES) ---
    window.cerrarModal = (id) => {
        document.getElementById(id).style.display = 'none';
    };

    document.getElementById('btn-finalizar').addEventListener('click', () => {
        // Armar el código final con las clases de colores (ChatGPT style)
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

});