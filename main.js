document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const navItems = document.querySelectorAll('.nav-item');
  const modal = document.getElementById('video-modal');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  const closeButton = document.querySelector('.close-button');

  let allMemories = [];
  let allStudents = [];
  let allTeachers = []; // Nova variável para os professores

  // FUNÇÃO 1: CRIAR CARD DE VÍDEO (sem alterações)
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

  // FUNÇÃO 2: CRIAR CARD DE PERFIL (Genérica para Alunos e Professores)
  const createPersonCard = (person) => {
    const card = document.createElement('div');
    // Reutilizamos a classe .student-card que já tem o estilo que queremos
    card.className = 'card student-card'; 
    card.innerHTML = `
  <img class="student-photo" src="${person.photo}" onerror="this.onerror=null; this.src='assets/photos/placeholderPerson.png';" alt="${person.name}">
  <p class="student-name">${person.name}</p>
`;
    return card;
  };
  
  // RENDERIZADOR 1: VÍDEOS (sem alterações)
  const renderVideos = (filter) => {
    galleryGrid.innerHTML = '';
    const filteredMemories = allMemories.filter(memory => memory.category === filter);
    filteredMemories.forEach(memory => {
      const card = createVideoCard(memory);
      galleryGrid.appendChild(card);
    });
  };

  // RENDERIZADOR 2: ALUNOS
  const renderStudents = () => {
    galleryGrid.innerHTML = '';
    allStudents.forEach(student => {
      // Agora chama a função genérica
      const card = createPersonCard(student);
      galleryGrid.appendChild(card);
    });
  };

  // RENDERIZADOR 3: PROFESSORES (NOVO)
  const renderTeachers = () => {
    galleryGrid.innerHTML = '';
    allTeachers.forEach(teacher => {
      // Também chama a função genérica
      const card = createPersonCard(teacher);
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
        renderStudents();
      } else if (category === 'professores') { // Novo "else if"
        renderTeachers();
      } else {
        renderVideos(category);
      }
    });
  });

  // Função de inicialização (ATUALIZADA)
  const init = async () => {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      allStudents = data.students;
      allTeachers = data.teachers; // Carrega os professores
      allMemories = data.memories;
      
      renderStudents(); // Continua iniciando pela página de alunos
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      galleryGrid.innerHTML = '<p>Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p>';
    }
  };
  
  init();
});