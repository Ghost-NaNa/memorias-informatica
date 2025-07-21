document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const navItems = document.querySelectorAll('.nav-item');
  const modal = document.getElementById('video-modal');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  const closeButton = document.querySelector('.close-button');

  let allMemories = [];
  let allStudents = [];

  // FUNÇÃO 1: CRIAR CARD DE VÍDEO
  const createVideoCard = (memory) => {
    const card = document.createElement('div');
    card.className = 'card video-card'; // Adicionada classe específica
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

  // FUNÇÃO 2: CRIAR CARD DE ALUNO (NOVA)
  const createStudentCard = (student) => {
    const card = document.createElement('div');
    card.className = 'card student-card'; // Classe específica para alunos
    card.innerHTML = `
      <img class="student-photo" src="${student.photo}" alt="${student.name}">
      <p class="student-name">${student.name}</p>
    `;
    return card;
  };
  
  // RENDERIZADOR 1: VÍDEOS
  const renderVideos = (filter) => {
    galleryGrid.innerHTML = '';
    const filteredMemories = allMemories.filter(memory => memory.category === filter);
    filteredMemories.forEach(memory => {
      const card = createVideoCard(memory);
      galleryGrid.appendChild(card);
    });
  };

  // RENDERIZADOR 2: ALUNOS (NOVO)
  const renderStudents = () => {
    galleryGrid.innerHTML = '';
    allStudents.forEach(student => {
      const card = createStudentCard(student);
      galleryGrid.appendChild(card);
    });
  };

  // Funções do Modal (sem alterações)
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

  // Lógica de Navegação (ATUALIZADA)
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      const category = item.dataset.category;
      
      if (category === 'alunos') {
        renderStudents(); // Chama o renderizador de alunos
      } else {
        renderVideos(category); // Chama o renderizador de vídeos
      }
    });
  });

  // Função de inicialização (ATUALIZADA)
  const init = async () => {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      allStudents = data.students; // Carrega os alunos
      allMemories = data.memories; // Carrega os vídeos
      
      // Inicia mostrando a página de alunos por padrão
      renderStudents();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      galleryGrid.innerHTML = '<p>Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p>';
    }
  };
  
  init();
});