document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const spf = document.getElementById('spf');
  const modal = document.getElementById('video-modal');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  const closeButton = document.querySelector('.close-button');

  // Pega o parâmetro 'category' da URL
  const urlParams = new URLSearchParams(window.location.search);
  const spfCategory = decodeURIComponent(urlParams.get('category'));

  // Função para criar card de vídeo (aqui ele sempre abre o modal)
  const createVideoCard = (memory) => {
    const card = document.createElement('div');
    card.className = 'card video-card';
    card.dataset.videoSrc = memory.video;
    card.innerHTML = `
      <div class="card-overlay"></div>
      <img src="${memory.thumbnail}" alt="${memory.title}">
      <div class="card-text-content">
        <p class="card-title">${memory.title}</p>
      </div>
    `;
    card.addEventListener('click', () => openModal(memory.video));
    return card;
  };

  // Funções do Modal (iguais às do main.js)
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
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => (event.target === modal) && closeModal());

  // Função para carregar e renderizar os vídeos da SPf
  const loadSpfVideos = async () => {
    if (!spfCategory) {
      galleryGrid.innerHTML = '<p>Categoria de SPf não especificada.</p>';
      return;
    }

    try {
      const response = await fetch('data.json');
      const data = await response.json();

      // Atualiza o título da página com o nome da SPf
      spf.innerHTML = `${spfCategory.toUpperCase()}`;

      // Filtra as memórias para encontrar os vídeos que pertencem a esta SPf
      const spfVideos = data.memories.filter(memory => memory.spf_group === spfCategory.toLowerCase());
      
      galleryGrid.innerHTML = '';
      if (spfVideos.length > 0) {
        spfVideos.forEach(memory => {
          const card = createVideoCard(memory);
          galleryGrid.appendChild(card);
        });
      } else {
        galleryGrid.innerHTML = '<p>Nenhum vídeo encontrado para esta SPf.</p>';
      }

    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      galleryGrid.innerHTML = '<p>Não foi possível carregar o conteúdo.</p>';
    }
  };

  loadSpfVideos();
});