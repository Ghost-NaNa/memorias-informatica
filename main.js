document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const galleryGrid = document.getElementById('gallery-grid');
  const navItems = document.querySelectorAll('.nav-item');
  const modal = document.getElementById('video-modal');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  const closeButton = document.querySelector('.close-button');

  let allMemories = []; // Array para guardar todos os dados do JSON

  // Função para criar o HTML de um único card
  const createCard = (memory) => {
    const card = document.createElement('div');
    card.className = 'card';
    // Guardamos o caminho do vídeo no próprio elemento
    card.dataset.videoSrc = memory.video; 

    card.innerHTML = `
      <div class="card-overlay"></div>
      <img src="${memory.thumbnail}" alt="${memory.title}">
      <p class="card-title">${memory.title}</p>
    `;

    // Adiciona o evento de clique para abrir o modal
    card.addEventListener('click', () => openModal(memory.video));
    
    return card;
  };

  // Função para renderizar a galeria com base em um filtro de categoria
  const renderGallery = (filter) => {
    galleryGrid.innerHTML = ''; // Limpa a galeria atual

    // Filtra as memórias. Se o filtro for 'todos', mostra todas.
    const filteredMemories = filter === 'todos' 
      ? allMemories 
      : allMemories.filter(memory => memory.category === filter);

    filteredMemories.forEach(memory => {
      const card = createCard(memory);
      galleryGrid.appendChild(card);
    });
  };

  // Funções do Modal
  const openModal = (videoSrc) => {
    modalVideoPlayer.src = videoSrc;
    modal.style.display = 'flex';
    modalVideoPlayer.play();
  };

  const closeModal = () => {
    modal.style.display = 'none';
    modalVideoPlayer.pause();
    modalVideoPlayer.src = '';
  };

  // Eventos de clique para fechar o modal
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Eventos de clique para a navegação/filtragem
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault(); // Impede o link de navegar

      // Remove a classe 'active' de todos os itens
      navItems.forEach(nav => nav.classList.remove('active'));
      // Adiciona a classe 'active' ao item clicado
      item.classList.add('active');

      const category = item.dataset.category;
      renderGallery(category);
    });
  });

  // Função principal para iniciar a aplicação
  const init = async () => {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      allMemories = data.memories;
      // Renderiza a galeria inicial com a categoria 'turma'
      renderGallery('turma'); 
    } catch (error) {
      console.error('Erro ao carregar os dados das memórias:', error);
      galleryGrid.innerHTML = '<p>Não foi possível carregar as memórias. Tente novamente mais tarde.</p>';
    }
  };

  // Inicia tudo!
  init();
});