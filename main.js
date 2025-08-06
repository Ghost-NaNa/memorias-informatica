document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const navItems = document.querySelectorAll('.nav-item');
  const modal = document.getElementById('video-modal');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  const closeButton = document.querySelector('.close-button');

  let allMemories = [];
  let allStudents = [];
  let allTeachers = [];

  // FUNÇÃO 1: CRIAR CARD DE VÍDEO (MODIFICADA)
  const createVideoCard = (memory) => {
    const card = document.createElement('div');
    card.className = 'card video-card';

    // Verifica se o título começa com "SPf" (ignorando maiúsculas/minúsculas)
    const isSpfCard = memory.title.toLowerCase().startsWith('spf');

    if (isSpfCard) {
      // Se for um card de SPf, o clique levará para a nova página
      card.addEventListener('click', () => {
        // Extrai o nome da SPf para usar na URL
        const spfName = memory.title.toLowerCase();
        window.location.href = `spf.html?category=${encodeURIComponent(spfName)}`;
      });
    } else {
      // Para outros vídeos, mantém o comportamento do modal
      card.dataset.videoSrc = memory.video;
      card.addEventListener('click', () => openModal(memory.video));
    }
    
    card.innerHTML = `
      <div class="card-overlay"></div>
      <img src="${memory.thumbnail}" alt="${memory.title}">
      <div class="card-text-content">
        <p class="card-title">${memory.title}</p>
      </div>
    `;
    return card;
  };

  // FUNÇÃO 2: CRIAR CARD DE PESSOA (sem alterações)
  const createPersonCard = (person) => {
    const card = document.createElement('div');
    card.className = 'card student-card'; 
    card.innerHTML = `
      <img class="student-photo" src="${person.photo}" onerror="this.onerror=null; this.src='assets/photos/placeholderPerson.png';" alt="${person.name}">
      <p class="student-name">${person.name}</p>
    `;
    return card;
  };
  
  // RENDERIZADOR 1: LEMBRANÇAS (MODIFICADO para usar a nova função de card)
  const renderMemories = () => {
    galleryGrid.innerHTML = '';
    // Filtra para a categoria "eventos" que não sejam SPFs para a página principal
    const filteredMemories = allMemories.filter(memory => memory.category === 'eventos');
    filteredMemories.forEach(memory => {
      const card = createVideoCard(memory); // Agora usa a função atualizada
      galleryGrid.appendChild(card);
    });
  };

  // RENDERIZADOR 2: ALUNOS (sem alterações)
  const renderStudents = () => {
    galleryGrid.innerHTML = '';
    allStudents.forEach(student => {
      const card = createPersonCard(student);
      galleryGrid.appendChild(card);
    });
  };

  // RENDERIZADOR 3: PROFESSORES (sem alterações)
  const renderTeachers = () => {
    galleryGrid.innerHTML = '';
    allTeachers.forEach(teacher => {
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
      } else if (category === 'professores') {
        renderTeachers();
      } else if (category === 'eventos') { // Modificado para chamar renderMemories
        renderMemories();
      }
    });
  });

  // Função de inicialização (ATUALIZADA)
  const init = async () => {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      allStudents = data.students;
      allTeachers = data.teachers;
      allMemories = data.memories;
      
      // Define a aba 'Alunos' como ativa e renderiza seu conteúdo
      document.querySelector('.nav-item[data-category="alunos"]').classList.add('active');
      renderStudents();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      galleryGrid.innerHTML = '<p>Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p>';
    }
  };
  
  init();
});