// Módulo para gerenciamento do tema
const themeManager = {
    init() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.setInitialTheme();
        this.bindEvents();
    },

    setInitialTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    },

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    },

    updateThemeIcon(theme) {
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
};

// Módulo para gerenciamento do menu mobile
const mobileMenuManager = {
    init() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.bindEvents();
    },

    bindEvents() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        // Fecha o menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        this.navLinks.classList.toggle('active');
        const isExpanded = this.navLinks.classList.contains('active');
        this.menuToggle.setAttribute('aria-expanded', isExpanded);
    },

    closeMenu() {
        this.navLinks.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
    mobileMenuManager.init();
});
