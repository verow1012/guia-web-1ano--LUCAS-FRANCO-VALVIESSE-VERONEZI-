const technologies = [
    {
        name: "React",
        category: "frontend",
        description: "Biblioteca JavaScript para construção de interfaces de usuário",
        level: "intermediário",
        pros: [
            "Grande ecossistema e comunidade",
            "Virtual DOM para melhor performance",
            "Componentização flexível"
        ],
        cons: [
            "Curva de aprendizado para conceitos avançados",
            "Necessidade de ferramentas adicionais para projetos grandes"
        ],
        avoid: "Projetos pequenos e simples que não necessitam de estado complexo",
        url: "https://reactjs.org",
        whenToChoose: [
            "Aplicações de grande escala com estados complexos",
            "Equipes grandes com necessidade de código consistente",
            "Projetos que precisam de uma base sólida e testada"
        ]
    },
    {
        name: "Vue.js",
        category: "frontend",
        description: "Framework progressivo para construção de interfaces de usuário",
        level: "básico",
        pros: [
            "Curva de aprendizado suave",
            "Excelente documentação",
            "Flexibilidade de integração"
        ],
        cons: [
            "Ecossistema menor que React",
            "Menos oportunidades no mercado"
        ],
        avoid: "Projetos que necessitam de soluções muito específicas do React",
        url: "https://vuejs.org",
        whenToChoose: [
            "Projetos menores ou médios",
            "Equipes iniciando com frameworks modernos",
            "Aplicações que precisam crescer gradualmente"
        ]
    },
    {
        name: "Node.js",
        category: "backend",
        description: "Ambiente de execução JavaScript server-side",
        level: "intermediário",
        pros: [
            "Mesma linguagem no frontend e backend",
            "Excelente para I/O assíncrono",
            "Grande número de pacotes npm"
        ],
        cons: [
            "Não ideal para computação intensiva",
            "Callback hell em código mal estruturado"
        ],
        avoid: "Aplicações com processamento pesado de CPU",
        url: "https://nodejs.org",
        whenToChoose: [
            "APIs em tempo real com WebSockets",
            "Microsserviços leves",
            "Aplicações com muitas operações I/O"
        ]
    },
    {
        name: "MongoDB",
        category: "database",
        description: "Banco de dados NoSQL orientado a documentos",
        level: "básico",
        pros: [
            "Esquema flexível",
            "Escalabilidade horizontal",
            "Ótimo para dados JSON"
        ],
        cons: [
            "Sem transações ACID completas",
            "Uso maior de memória"
        ],
        avoid: "Sistemas que requerem relacionamentos complexos entre dados",
        url: "https://www.mongodb.com",
        whenToChoose: [
            "Dados sem estrutura rígida",
            "Aplicações que precisam escalar horizontalmente",
            "Protótipos que requerem mudanças frequentes no esquema"
        ]
    },
    {
        name: "Docker",
        category: "devops",
        description: "Plataforma de containerização de aplicações",
        level: "intermediário",
        pros: [
            "Ambientes consistentes",
            "Fácil deploy e escalabilidade",
            "Isolamento de aplicações"
        ],
        cons: [
            "Overhead de recursos",
            "Complexidade inicial"
        ],
        avoid: "Aplicações muito pequenas ou que rodam em hardware limitado",
        url: "https://www.docker.com",
        whenToChoose: [
            "Aplicações com múltiplas dependências",
            "Necessidade de ambientes consistentes",
            "Microsserviços"
        ]
    }
];

class TechManager {
    constructor() {
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.favorites = new Set(JSON.parse(localStorage.getItem('techFavorites') || '[]'));
        
        this.initializeElements();
        this.bindEvents();
        this.loadLastFilter();
        this.renderTechnologies();
    }
    
    initializeElements() {
        this.filterButtons = document.querySelectorAll('.filter-button');
        this.searchInput = document.querySelector('.search-input');
        this.techGrid = document.getElementById('techGrid');
        this.modal = document.getElementById('techModal');
        this.modalClose = document.querySelector('.modal-close');
    }
    
    bindEvents() {
        // Filtros
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.filterByCategory(button.dataset.category));
        });
        
        // Busca
        this.searchInput.addEventListener('input', () => {
            this.searchTerm = this.searchInput.value.toLowerCase();
            this.renderTechnologies();
        });
        
        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== this.searchInput) {
                e.preventDefault();
                this.searchInput.focus();
            }
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        // Modal
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }
    
    loadLastFilter() {
        const lastFilter = localStorage.getItem('lastTechFilter') || 'all';
        this.filterByCategory(lastFilter);
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        localStorage.setItem('lastTechFilter', category);
        
        this.filterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.category === category);
        });
        
        this.renderTechnologies();
    }
    
    renderTechnologies() {
        const filteredTechs = technologies.filter(tech => {
            const matchesCategory = this.currentCategory === 'all' || tech.category === this.currentCategory;
            const matchesSearch = tech.name.toLowerCase().includes(this.searchTerm) ||
                                tech.description.toLowerCase().includes(this.searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        this.techGrid.innerHTML = filteredTechs.map(tech => this.createTechCard(tech)).join('');
        
        // Adicionar event listeners aos novos cards
        this.techGrid.querySelectorAll('.tech-card').forEach(card => {
            card.addEventListener('click', () => this.showModal(technologies.find(t => t.name === card.dataset.name)));
        });
        
        this.techGrid.querySelectorAll('.favorite-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(button.closest('.tech-card').dataset.name);
            });
        });
    }
    
    createTechCard(tech) {
        const isFavorite = this.favorites.has(tech.name);
        return `
            <article class="tech-card" data-name="${tech.name}">
                <div class="tech-header">
                    <h3 class="tech-title">${tech.name}</h3>
                    <span class="tech-badge">${tech.level}</span>
                </div>
                <div class="tech-content">
                    <p class="tech-description">${tech.description}</p>
                    <div class="tech-lists">
                        <ul class="tech-list pros">
                            ${tech.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                        <ul class="tech-list cons">
                            ${tech.cons.map(con => `<li>${con}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="tech-footer">
                    <a href="${tech.url}" class="tech-link" target="_blank" rel="noopener noreferrer">
                        Documentação
                    </a>
                    <button class="favorite-button ${isFavorite ? 'active' : ''}" aria-label="Favoritar ${tech.name}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </article>
        `;
    }
    
    showModal(tech) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.querySelector('.modal-body');
        
        modalTitle.textContent = `Quando escolher ${tech.name}?`;
        modalBody.innerHTML = `
            <ul>
                ${tech.whenToChoose.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
            <p><strong>Quando evitar:</strong> ${tech.avoid}</p>
        `;
        
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
    }
    
    toggleFavorite(techName) {
        if (this.favorites.has(techName)) {
            this.favorites.delete(techName);
        } else {
            this.favorites.add(techName);
        }
        
        localStorage.setItem('techFavorites', JSON.stringify([...this.favorites]));
        this.renderTechnologies();
    }
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new TechManager();
});
