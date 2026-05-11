document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos del DOM
    const inputUrl = document.getElementById('youtube-url');
    const shortsIcon = document.getElementById('shorts-icon');
    const btnValidar = document.getElementById('btn-validar');
    
    // Modal
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalCodeSection = document.getElementById('modal-code-section');
    const modalCodeSnippet = document.getElementById('modal-code-snippet');
    const btnModalAction = document.getElementById('btn-modal-action');

    // Paneles y Etapas
    const etapaInput = document.getElementById('etapa-input');
    const etapaVideo = document.getElementById('etapa-video');
    const panelInstrucciones = document.getElementById('panel-instrucciones');
    const panelControles = document.getElementById('panel-controles');
    
    // Video elements
    const ytIframe = document.getElementById('youtube-iframe');
    const videoWrapper = document.getElementById('video-wrapper');

    // Variables de estado
    let validVideoId = '';
    let isModalSuccess = false;

    // 1. Detectar escritura en el input para cambiar color del SVG
    inputUrl.addEventListener('input', (e) => {
        const url = e.target.value;
        if(url.includes('/shorts/')) {
            shortsIcon.classList.add('valid');
        } else {
            shortsIcon.classList.remove('valid');
        }
    });

    // 2. Botón VALIDAR
    btnValidar.addEventListener('click', () => {
        const url = inputUrl.value.trim();

        if (url.includes('/shorts/')) {
            // ES VÁLIDO: Extraer el ID del video
            // Ejemplo URL: https://youtube.com/shorts/XYZ123?feature=share
            const parts = url.split('/shorts/');
            validVideoId = parts[1].split('?')[0]; // Limpiamos parámetros extras

            // Preparar Modal de Éxito
            modalTitle.innerText = "¡Video Validado Exitosamente!";
            modalTitle.style.color = "#0056b3";
            modalDesc.innerText = "Agregaste un video de Youtube Shorts. Recuerda que el procedimiento es ir al botón de compartir, copiar el enlace e incrustarlo.\n\nLa etiqueta HTML para incrustar un reproductor web es <iframe> y se ve de la siguiente manera:";
            
            // Generar sintaxis con colores
            modalCodeSnippet.innerHTML = `
<span class="tag">&lt;iframe&gt;</span>
    <span class="attr">width</span>=<span class="val">"315"</span>
    <span class="attr">height</span>=<span class="val">"560"</span>
    <span class="attr">src</span>=<span class="val">"https://www.youtube.com/embed/${validVideoId}"</span>
<span class="tag">&lt;/iframe&gt;</span>`;
            
            modalCodeSection.style.display = 'block';
            btnModalAction.innerText = "Siguiente";
            btnModalAction.style.backgroundColor = "#0056b3";
            isModalSuccess = true;

        } else {
            // ERROR
            modalTitle.innerText = "Video No Válido";
            modalTitle.style.color = "#ff0033";
            modalDesc.innerText = "El enlace que proporcionaste no parece ser un video de Youtube Shorts. Asegúrate de que la URL contenga la palabra '/shorts/'.";
            modalCodeSection.style.display = 'none';
            btnModalAction.innerText = "Aceptar";
            btnModalAction.style.backgroundColor = "#333";
            isModalSuccess = false;
        }

        modalOverlay.style.display = 'flex';
    });

    // 3. Acción del botón del Modal
    btnModalAction.addEventListener('click', () => {
        modalOverlay.style.display = 'none';

        if (isModalSuccess) {
            // Avanzar a la siguiente etapa
            // Cargar el video en el iframe
            ytIframe.src = `https://www.youtube.com/embed/${validVideoId}`;

            // Cambiar vistas
            etapaInput.style.display = 'none';
            etapaVideo.style.display = 'flex';
            
            // Cambiar menú lateral
            panelInstrucciones.style.display = 'none';
            panelControles.style.display = 'block';
        }
    });

    // 4. Lógica de los botones del Playground
    const controlBtns = document.querySelectorAll('.control-btn');
    const liveCodeText = document.getElementById('live-code-text');
    const liveCode = document.getElementById('live-code');

    controlBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.currentTarget;
            const action = button.getAttribute('data-action');

            // Quitar clase activa a los hermanos y dársela al presionado
            const parent = button.parentElement;
            parent.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active-btn'));
            button.classList.add('active-btn');

            // Aplicar estilos según la acción
            if (action === 'border') {
                const val = button.getAttribute('data-value');
                ytIframe.style.borderRadius = val;
                liveCodeText.innerText = "Se redondearon los bordes:";
                liveCode.innerHTML = `<span class="css-prop">border-radius</span>: <span class="css-val">${val}</span>;`;
            
            } else if (action === 'size') {
                const val = button.getAttribute('data-value');
                ytIframe.style.transform = `scale(${val})`;
                liveCodeText.innerText = "Se modificó el tamaño visual:";
                liveCode.innerHTML = `<span class="css-prop">transform</span>: <span class="css-val">scale(${val})</span>;`;
            
            } else if (action === 'align') {
                const justify = button.getAttribute('data-justify');
                const align = button.getAttribute('data-align');
                videoWrapper.style.justifyContent = justify;
                videoWrapper.style.alignItems = align;
                liveCodeText.innerText = "Se modificó la alineación en la caja principal:";
                liveCode.innerHTML = `
<span class="css-prop">display</span>: <span class="css-val">flex</span>;
<span class="css-prop">justify-content</span>: <span class="css-val">${justify}</span>;
<span class="css-prop">align-items</span>: <span class="css-val">${align}</span>;`;
            }
        });
    });
});