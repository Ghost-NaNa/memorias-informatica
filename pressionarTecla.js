document.addEventListener('DOMContentLoaded', () => {
  let activeKey = null;      // Guarda qual tecla está ativando o overlay
  let isFading = false;      // Bloqueia ações durante animações de fade

  // Criação do overlay que cobre toda a tela
  const overlay = document.createElement('div');
  overlay.id = 'keyboard-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '9999',
    display: 'none',         // Inicialmente invisível
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)', // Fundo preto translúcido
    textAlign: 'center',
    opacity: '0',            // Começa transparente para o fade-in
    transition: 'opacity 0.5s ease', // Transição suave de opacidade
  });

  // Estilos CSS adicionados dinamicamente, incluindo animações e classe para a imagem com fade
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeScale {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes glowPulse {
      0%, 100% { text-shadow: 0 0 10px var(--glow-color); }
      50% { text-shadow: 0 0 20px var(--glow-color); }
    }
    .animated-fim {
      font-family: 'VT323', monospace;
      font-size: 8rem;
      color: var(--primary-color);
      letter-spacing: 0.8rem;
      animation: fadeScale 0.6s ease-out, glowPulse 2s infinite ease-in-out;
    }
    /* Classe para a imagem com transição de opacidade */
    .fade-image {
      opacity: 0;                 /* Começa transparente */
      transition: opacity 0.5s ease; /* Transição suave */
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  // Escuta eventos de teclado
  document.addEventListener('keydown', (e) => {
    if (isFading) return;  // Ignora se estiver animando fade para evitar bugs

    if (e.key === '1') {
      if (activeKey === '1') {
        fadeOutOverlay();  // Se tecla 1 já ativa, faz fade-out para esconder
      } else {
        showImageOverlay(); // Caso contrário, mostra a imagem com fade-in
        activeKey = '1';
      }
    } else if (e.key === '2') {
      if (activeKey === '2') {
        fadeOutOverlay();  // Se tecla 2 já ativa, faz fade-out para esconder
      } else {
        showTextOverlay("fim"); // Caso contrário, mostra texto com animação
        activeKey = '2';
      }
    }
  });

  // Função para mostrar o overlay com a imagem (fade-in)
  function showImageOverlay() {
    overlay.innerHTML = '';      // Limpa conteúdo anterior
    const img = document.createElement('img');
    img.src = 'assets/photos/pauloFreire.jpg';
    img.className = 'fade-image'; // Aplica classe para controlar opacidade e transição
    overlay.appendChild(img);

    fadeInOverlay();             // Inicia o fade-in do overlay

    // Garante que a imagem faça o fade-in após o display do overlay
    requestAnimationFrame(() => {
      img.style.opacity = '1';   // Sobe a opacidade da imagem para 1
    });
  }

  // Função para mostrar texto com a animação customizada
  function showTextOverlay(text) {
    overlay.innerHTML = '';      // Limpa conteúdo
    const span = document.createElement('span');
    span.className = 'animated-fim'; // Aplica a classe com animações CSS
    span.textContent = text;
    overlay.appendChild(span);
    fadeInOverlay();             // Faz fade-in do overlay (texto fica visível junto)
  }

  // Função para executar o fade-in do overlay
  function fadeInOverlay() {
    isFading = true;             // Bloqueia outras ações durante a animação
    overlay.style.display = 'flex'; // Torna o overlay visível (flex container)
    document.body.style.overflow = 'hidden'; // Desabilita scroll do corpo

    // Solicita próximo frame para garantir aplicação do display antes da transição
    requestAnimationFrame(() => {
      overlay.style.opacity = '1'; // Anima opacidade para aparecer
    });

    // Após fim da transição, libera o bloqueio para outras ações
    overlay.addEventListener('transitionend', onFadeInEnd, { once: true });
  }

  // Callback para liberar o bloqueio após fade-in terminar
  function onFadeInEnd() {
    isFading = false;
  }

  // Função para executar fade-out do overlay (e da imagem se houver)
  function fadeOutOverlay() {
    isFading = true;

    const img = overlay.querySelector('img.fade-image');

    if (img) {
      // Faz fade-out da imagem primeiro
      img.style.opacity = '0';

      // Quando fade-out da imagem termina, inicia fade-out do overlay
      img.addEventListener('transitionend', () => {
        overlay.style.opacity = '0';
      }, { once: true });
    } else {
      // Se não tem imagem, faz fade-out direto do overlay
      overlay.style.opacity = '0';
    }

    // Quando fade-out do overlay termina, esconde e reseta tudo
    overlay.addEventListener('transitionend', () => {
      resetOverlay();
      isFading = false;
    }, { once: true });
  }

  // Reseta overlay: esconde, limpa conteúdo, reativa scroll e zera tecla ativa
  function resetOverlay() {
    overlay.style.display = 'none';
    overlay.innerHTML = '';
    document.body.style.overflow = '';
    activeKey = null;
  }
});
