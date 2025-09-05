const questions = [
    {
        question: "Qual é a função principal do HTML em uma página web?",
        options: [
            "Estilizar a página",
            "Estruturar o conteúdo",
            "Adicionar interatividade",
            "Processar dados"
        ],
        correct: 1,
        explanation: "HTML (HyperText Markup Language) é responsável por estruturar o conteúdo da página, definindo elementos como cabeçalhos, parágrafos, listas e links."
    },
    {
        question: "Qual propriedade CSS é usada para fazer um elemento flexível?",
        options: [
            "flex-direction",
            "display: block",
            "display: flex",
            "position: fixed"
        ],
        correct: 2,
        explanation: "display: flex torna um elemento um flex container, permitindo usar as propriedades do Flexbox para alinhar e distribuir seus elementos filhos."
    },
    {
        question: "Como se declara uma variável em JavaScript moderno?",
        options: [
            "var x = 10;",
            "const x = 10;",
            "let x = 10;",
            "Todas as anteriores"
        ],
        correct: 3,
        explanation: "Em JavaScript moderno, podemos usar var, let ou const para declarar variáveis. let e const foram introduzidos no ES6, sendo const para valores que não serão reatribuídos."
    },
    {
        question: "O que significa 'responsividade' em design web?",
        options: [
            "Um site que carrega rápido",
            "Um site que se adapta a diferentes tamanhos de tela",
            "Um site com muitas animações",
            "Um site com bom SEO"
        ],
        correct: 1,
        explanation: "Design responsivo significa que o layout do site se adapta automaticamente para proporcionar uma boa experiência em diferentes dispositivos e tamanhos de tela."
    },
    {
        question: "Qual é a melhor prática para acessibilidade em imagens?",
        options: [
            "Usar sempre imagens em PNG",
            "Adicionar atributo alt descritivo",
            "Definir width e height",
            "Usar apenas vetores"
        ],
        correct: 1,
        explanation: "O atributo alt fornece uma descrição textual da imagem, essencial para usuários que utilizam leitores de tela e casos onde a imagem não carrega."
    },
    {
        question: "O que é o DOM em JavaScript?",
        options: [
            "Uma linguagem de programação",
            "Um método de estilização",
            "A representação da estrutura do documento HTML",
            "Um framework JavaScript"
        ],
        correct: 2,
        explanation: "DOM (Document Object Model) é uma interface que representa como os documentos HTML e XML são lidos pelo navegador, permitindo que o JavaScript manipule o conteúdo e estrutura."
    },
    {
        question: "Qual é o propósito do Git em desenvolvimento web?",
        options: [
            "Compilar código",
            "Controlar versões do código",
            "Executar testes automatizados",
            "Otimizar imagens"
        ],
        correct: 1,
        explanation: "Git é um sistema de controle de versão que permite rastrear mudanças no código, colaborar com outros desenvolvedores e manter um histórico do projeto."
    },
    {
        question: "O que é uma API REST?",
        options: [
            "Um tipo de banco de dados",
            "Uma interface para comunicação entre sistemas",
            "Um framework CSS",
            "Um servidor web"
        ],
        correct: 1,
        explanation: "REST (Representational State Transfer) é um estilo de arquitetura que define um conjunto de restrições para a comunicação entre sistemas distribuídos."
    }
];

class Quiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = new Set();
        
        this.quizDiv = document.getElementById('quiz');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        this.resultsDiv = document.getElementById('results');
        this.restartButton = document.getElementById('restartButton');
        
        this.bindEvents();
        this.showQuestion(0);
        this.loadBestScore();
    }
    
    bindEvents() {
        this.prevButton.addEventListener('click', () => this.previousQuestion());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.restartButton.addEventListener('click', () => this.resetQuiz());
    }
    
    showQuestion(index) {
        const question = questions[index];
        
        this.quizDiv.innerHTML = `
            <div class="question">
                <h3>Questão ${index + 1} de ${questions.length}</h3>
                <p>${question.question}</p>
                <div class="options">
                    ${question.options.map((option, i) => `
                        <div class="option" data-index="${i}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
                <div class="explanation" id="explanation${index}">
                    ${question.explanation}
                </div>
            </div>
        `;
        
        this.updateButtons();
        this.addOptionListeners();
        
        if (this.answered.has(index)) {
            this.restoreAnswer(index);
        }
    }
    
    updateButtons() {
        this.prevButton.disabled = this.currentQuestion === 0;
        this.nextButton.textContent = 
            this.currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima';
    }
    
    addOptionListeners() {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', () => this.selectOption(option));
        });
    }
    
    selectOption(optionElement, isReview = false) {
        if (this.answered.has(this.currentQuestion) && !isReview) return;
        
        const options = document.querySelectorAll('.option');
        const selectedIndex = parseInt(optionElement.dataset.index);
        const question = questions[this.currentQuestion];
        
        options.forEach(opt => opt.classList.remove('selected', 'correct', 'wrong'));
        optionElement.classList.add('selected');
        
        if (!isReview) {
            this.answered.add(this.currentQuestion);
            const isCorrect = selectedIndex === question.correct;
            
            optionElement.classList.add(isCorrect ? 'correct' : 'wrong');
            if (isCorrect) this.score++;
            
            document.querySelector(`#explanation${this.currentQuestion}`).style.display = 'block';
            
            if (this.currentQuestion === questions.length - 1) {
                this.showResults();
            }
        }
    }
    
    restoreAnswer(index) {
        const selectedOption = document.querySelector(
            `.option[data-index="${questions[index].correct}"]`
        );
        this.selectOption(selectedOption, true);
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        }
    }
    
    showResults() {
        const scoreDiv = this.resultsDiv.querySelector('.score');
        const bestScoreSpan = document.getElementById('bestScore');
        
        scoreDiv.textContent = `${this.score}/${questions.length}`;
        
        const bestScore = Math.max(
            this.score,
            parseInt(localStorage.getItem('quizBestScore') || 0)
        );
        localStorage.setItem('quizBestScore', bestScore);
        bestScoreSpan.textContent = `${bestScore}/${questions.length}`;
        
        this.resultsDiv.style.display = 'block';
    }
    
    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answered.clear();
        this.resultsDiv.style.display = 'none';
        this.showQuestion(0);
    }
    
    loadBestScore() {
        const bestScore = localStorage.getItem('quizBestScore') || 0;
        document.getElementById('bestScore').textContent = 
            `${bestScore}/${questions.length}`;
    }
}

// Inicializar o quiz quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});
