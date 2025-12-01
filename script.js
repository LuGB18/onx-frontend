// ========================================
// THEME MANAGEMENT
// ========================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = this.getInitialTheme();
        this.init();
    }

    // Obtém o tema inicial baseado em:
    // 1. Preferência salva no localStorage
    // 2. Preferência do sistema (prefers-color-scheme)
    getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            return savedTheme;
        }
        
        // Se não houver preferência salva, retorna null para usar o padrão do sistema
        return null;
    }

    // Inicializa o gerenciador de tema
    init() {
        // Aplica o tema inicial
        this.applyTheme(this.currentTheme);
        
        // Adiciona listener ao botão de toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Monitora mudanças na preferência do sistema
        this.watchSystemTheme();
        
        // Adiciona animação ao carregar a página
        this.addPageLoadAnimation();
    }

    // Aplica o tema ao documento
    applyTheme(theme) {
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        this.currentTheme = theme;
    }

    // Alterna entre os temas
    toggleTheme() {
        let newTheme;
        
        // Se não há tema definido (usando padrão do sistema)
        if (!this.currentTheme) {
            // Detecta o tema atual do sistema e alterna
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            newTheme = systemPrefersDark ? 'light' : 'dark';
        } else {
            // Alterna entre light e dark
            newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        }
        
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Adiciona animação ao trocar tema
        this.animateThemeChange();
    }

    // Monitora mudanças na preferência do sistema
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Só atualiza automaticamente se o usuário não tiver preferência salva
            if (!localStorage.getItem('theme')) {
                this.applyTheme(null);
            }
        });
    }

    // Animação ao trocar de tema
    animateThemeChange() {
        document.body.style.transition = 'none';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 50);
    }

    // Animação ao carregar a página
    addPageLoadAnimation() {
        document.body.style.opacity = '0';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.3s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Adiciona smooth scroll para todos os links âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        // Cria observer para animações ao scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        // Observa elementos que devem animar
        const animatedElements = document.querySelectorAll('.feature-card, .about-text');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ========================================
// BUTTON INTERACTIONS
// ========================================

class ButtonInteractions {
    constructor() {
        this.init();
    }

    init() {
        // Adiciona efeito ripple aos botões
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });

        // Adiciona funcionalidade aos botões de download/ação
        this.setupActionButtons();
    }

    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Remove ripples antigos
        const oldRipple = button.querySelector('.ripple');
        if (oldRipple) {
            oldRipple.remove();
        }

        button.appendChild(ripple);

        // Remove o ripple após a animação
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupActionButtons() {
        const downloadButtons = document.querySelectorAll('.btn-primary');
        const learnMoreButtons = document.querySelectorAll('.btn-secondary');

        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.getAttribute('href')) {
                    e.preventDefault();
                    this.showDownloadMessage();
                }
            });
        });

        learnMoreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.getAttribute('href')) {
                    e.preventDefault();
                    this.scrollToAbout();
                }
            });
        });
    }

    showDownloadMessage() {
        // Simula ação de download
        console.log('Download iniciado...');
        // Aqui você pode adicionar lógica real de download ou redirecionamento
    }

    scrollToAbout() {
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Adiciona sombra ao navbar quando scrollar
            if (currentScroll > 10) {
                this.navbar.style.boxShadow = 'var(--shadow-md)';
            } else {
                this.navbar.style.boxShadow = 'none';
            }

            this.lastScroll = currentScroll;
        });
    }
}

// ========================================
// STATS COUNTER ANIMATION
// ========================================

class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isSize = target.includes('GB');
        
        let number = parseInt(target.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const increment = number / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            const displayValue = Math.floor(current);
            if (isPercentage) {
                element.textContent = `+${displayValue}%`;
            } else if (isSize) {
                element.textContent = `${displayValue}GB+`;
            } else {
                element.textContent = displayValue;
            }
        }, 16);
    }
}

// ========================================
// BUG REPORT MODAL MANAGER
// ========================================

class BugReportManager {
    constructor() {
        this.bugReportBtn = document.getElementById('bugReportBtn');
        this.bugReportModal = document.getElementById('bugReportModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.bugReportForm = document.getElementById('bugReportForm');
        this.init();
    }

    init() {
        this.bugReportBtn.addEventListener('click', () => this.showModal());
        this.closeModalBtn.addEventListener('click', () => this.hideModal());
        window.addEventListener('click', (event) => {
            if (event.target === this.bugReportModal) {
                this.hideModal();
            }
        });
        
        this.bugReportForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    showModal() {
        this.bugReportModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Evita scroll da página principal
    }

    hideModal() {
        this.bugReportModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Função auxiliar para codificar dados em Base64
    encodeBase64(data) {
        // Converte o objeto JavaScript para string JSON e depois para Base64
        return btoa(JSON.stringify(data));
    }

    // Manipulador de submissão do formulário (será completado na próxima fase)
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.bugReportForm);
        const userData = {
            username: formData.get('userName'),
            email: formData.get('userEmail'),
            telefone: formData.get('userPhone'),
            mensagem: formData.get('userMessage')
        };
        
        // Codifica os dados do usuário em Base64
        const encodedUser = {
            username: btoa(userData.username),
            email: btoa(userData.email),
            telefone: btoa(userData.telefone),
            mensagem: btoa(userData.mensagem)
        };
        
        // O payload final deve ser: {"user":{"username":base64,"email":base64,"telefone":base64,"mensagem":base64},"captcha":{"response":token}}
        // O Base64 deve ser aplicado a cada campo individualmente, conforme o JSON de saída.
        
        console.log('Dados do usuário codificados em Base64:', encodedUser);
        
        // Chamada para a função de envio
        this.submitReport(encodedUser);
    }
    
    // Função de envio com reCAPTCHA e POST
    submitReport(encodedUser) {
        const RECAPTCHA_SITE_KEY = '6Ldnwx0sAAAAADTa_Whis-SwnStwiOC3v_O4dcob';
        const API_ENDPOINT = 'https://onx-optimizer.vercel.app/api/suporte';
        const submitButton = this.bugReportForm.querySelector('button[type="submit"]');
        
        // Desabilita o botão para evitar múltiplos envios
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // 1. Executa o reCAPTCHA para obter o token
        grecaptcha.ready(() => {
            grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit_bug_report' })
                .then((token) => {
                    console.log(token)
                    // 2. Monta o payload JSON
                    const payload = {
                        user: encodedUser, // Já está codificado em Base64
                        captcha: {
                            response: token
                        }
                    };
                    
                    // 3. Envia a requisição POST
                    fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Erro na resposta da API.');
                    })
                    .then(data => {
                        console.log('Sucesso:', data);
                        alert('Relatório de bug enviado com sucesso! Agradecemos a sua contribuição.');
                        this.bugReportForm.reset();
                        this.hideModal();
                    })
                    .catch((error) => {
                        console.error('Erro:', error);
                        alert('Houve um erro ao enviar o relatório. Tente novamente mais tarde.');
                    })
                    .finally(() => {
                        // Reabilita o botão
                        submitButton.disabled = false;
                        submitButton.textContent = 'Enviar Relatório';
                    });
                })
                .catch((error) => {
                    console.error('Erro no reCAPTCHA:', error);
                    alert('Não foi possível verificar o reCAPTCHA. Tente novamente.');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar Relatório';
                });
        });
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Aguarda o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os módulos
    new ThemeManager();
    new SmoothScroll();
    new ScrollAnimations();
    new ButtonInteractions();
    new NavbarScroll();
    new StatsCounter();
    new BugReportManager(); // Novo módulo
    
    console.log('ONX-Optimizer website loaded successfully! 🚀');
});

// ========================================
// RIPPLE EFFECT STYLES (injected)
// ========================================

// Adiciona estilos para o efeito ripple
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
