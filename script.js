// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Atualizar link ativo na navegação ao fazer scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Menu mobile (se necessário no futuro)
const mobileMenuBtn = document.querySelector('.btn-mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Animação de entrada para cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar cards de features e support
document.querySelectorAll('.feature-card, .support-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
observer.observe(card);
});

// Efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * 0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Adicionar efeito de hover nos botões
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        if (!this.classList.contains('btn-primary')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// FAQ Accordion
const faqButtons = document.querySelectorAll('.faq-question');
faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        if (!item) return;
        document.querySelectorAll('.faq-item.open').forEach(i => { if (i !== item) i.classList.remove('open'); });
        item.classList.toggle('open');
    });
});

// FAQ style fallback (in case CSS fails to load on hosting)
(function ensureFAQStyles(){
    const faqEl = document.querySelector('#faq');
    if (!faqEl) return;
    if (document.getElementById('fusion-faq-style')) return;
    const style = document.createElement('style');
    style.id = 'fusion-faq-style';
    style.textContent = `
    .faq-list{display:flex;flex-direction:column;gap:1rem;max-width:1100px;margin:0 auto}
    .faq-item{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;overflow:hidden}
    .faq-question{width:100%;text-align:left;padding:1rem 1.25rem;background:transparent;border:none;color:#fff;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-decoration:none;outline:none}
    .faq-answer{max-height:0;overflow:hidden;transition:max-height .3s ease,padding .3s ease;padding:0 1.25rem;color:rgba(255,255,255,.85)}
    .faq-item.open .faq-answer{max-height:1200px;padding:0 1.25rem 1rem}
    `;
    document.head.appendChild(style);
})();

// Apply plan notices on homepage
(function applyPlanNotices(){
    const plansRoot = document.querySelector('.plans-content');
    if (!plansRoot) return;
    let cfg = null;
    try {
        cfg = JSON.parse(localStorage.getItem('fusion_plan_notices') || '{}');
    } catch { cfg = {}; }
    const basicNotice = cfg.basic || 'none';
    const ultraNotice = cfg.ultra || 'none';
    const setBadge = (card, type) => {
        if (!card) return;
        const existing = card.querySelector('.notice-badge');
        if (existing) existing.remove();
        if (type && type !== 'none') {
            const b = document.createElement('div');
            b.className = `notice-badge ${type === 'out' ? 'out' : 'maintenance'}`;
            b.textContent = type === 'out' ? 'Fora de estoque' : 'Em manutenção';
            card.appendChild(b);
        }
    };
    const setButtonAndMessage = (card, type) => {
        if (!card) return;
        const btn = card.querySelector('.btn-plan');
        const msgEl = card.querySelector('.plan-message') || (function(){ const m = document.createElement('div'); m.className = 'plan-message'; card.appendChild(m); return m; })();
        if (!btn) return;
        if (!type || type === 'none') {
            btn.classList.remove('disabled');
            btn.disabled = false;
            btn.textContent = 'Assinar Agora';
            msgEl.textContent = '';
            msgEl.classList.remove('out','maintenance');
        } else if (type === 'out') {
            btn.classList.add('disabled');
            btn.disabled = true;
            btn.textContent = 'Indisponível';
            msgEl.textContent = 'Plano temporariamente fora de estoque.';
            msgEl.classList.add('out');
            msgEl.classList.remove('maintenance');
        } else if (type === 'maintenance') {
            btn.classList.add('disabled');
            btn.disabled = true;
            btn.textContent = 'Em manutenção';
            msgEl.textContent = 'Plano em manutenção. Volte mais tarde.';
            msgEl.classList.add('maintenance');
            msgEl.classList.remove('out');
        }
    };
    const basicCard = document.querySelector('.plan-card[data-plan="basic"]');
    const ultraCard = document.querySelector('.plan-card[data-plan="ultra"]');
    setBadge(basicCard, basicNotice);
    setBadge(ultraCard, ultraNotice);
    setButtonAndMessage(basicCard, basicNotice);
    setButtonAndMessage(ultraCard, ultraNotice);
})();

// Prevent navigation when plan button is disabled
document.querySelectorAll('.btn-plan').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.classList.contains('disabled') || btn.disabled) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});

(function promo(){
    const overlay = document.getElementById('fusionPromoOverlay');
    const closeBtn = document.getElementById('fusionPromoClose');
    if (!overlay || sessionStorage.getItem('fusion_promo_closed')) return;
    overlay.classList.add('active');
    const close = () => { overlay.classList.remove('active'); sessionStorage.setItem('fusion_promo_closed','1'); };
    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// Configuração de API base para migração e serviços
(function setApiBase(){
    try {
        const meta = document.querySelector('meta[name="fusion-api-base"]');
        const val = meta && meta.content ? String(meta.content).trim() : '';
        const base = val || window.location.origin.replace(/\/$/, '');
        if (!window.FUSION_API_BASE) window.FUSION_API_BASE = base;
    } catch {}
})();

// Render feedbacks from localStorage
(function setupFeedbacks(){
    const list = document.getElementById('feedbacksList');
    const ctrl = document.getElementById('feedbackFilterControl');
    if (!list) return;
    const render = (filter) => {
        let items = [];
        try { items = JSON.parse(localStorage.getItem('fusion_feedbacks') || '[]'); } catch { items = []; }
        if (filter && filter !== 'all') items = items.filter(f => String(f.plan || '').toLowerCase() === filter);
        if (!items.length) {
            list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.7);padding:1rem;">Ainda não há feedbacks.</p>';
            return;
        }
        const star = (n) => '★★★★★'.slice(0, Math.max(0, Math.min(5, n))) + '☆☆☆☆☆'.slice(0, 5 - Math.max(0, Math.min(5, n)));
        list.innerHTML = items.slice(-12).reverse().map(f => `
            <div class="feedback-card">
                <div class="feedback-header">
                    <span class="feedback-user">${f.userName || 'Cliente'}</span>
                    <span class="feedback-stars">${star(Number(f.rating || 0))}</span>
                </div>
                <div class="feedback-plan">Plano: ${String(f.plan || '').toUpperCase()}</div>
                <div class="feedback-text">${f.text || ''}</div>
            </div>
        `).join('');
    };
    let current = 'all';
    render(current);
    if (ctrl) {
        ctrl.querySelectorAll('.segment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                ctrl.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                current = btn.getAttribute('data-filter') || 'all';
                render(current);
            });
        });
    }
})();

// Animação de números nas estatísticas
const animateNumbers = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = stat.textContent;
        const isPercentage = target.includes('%');
        const isMillion = target.includes('M');
        const number = parseFloat(target.replace(/[^0-9.]/g, ''));
        
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                let display = Math.floor(current);
                if (isMillion) display = display + 'M+';
                else if (isPercentage) display = display.toFixed(1) + '%';
                else display = display + '+';
                stat.textContent = display;
            }
        }, 30);
    });
};

// Observar seção de estatísticas
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Adicionar efeito de brilho nos cards ao hover
document.querySelectorAll('.feature-card, .support-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

// Segment Control para Planos
const segmentButtons = document.querySelectorAll('.segment-btn');
const planCards = document.querySelectorAll('.plan-card');

segmentButtons.forEach(button => {
    button.addEventListener('click', () => {
        const planType = button.getAttribute('data-plan');
        
        // Remove active de todos os botões
        segmentButtons.forEach(btn => btn.classList.remove('active'));
        // Adiciona active ao botão clicado
        button.classList.add('active');
        
        // Remove active de todos os cards
        planCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Adiciona active ao card correspondente
        const targetCard = document.querySelector(`.plan-card[data-plan="${planType}"]`);
        if (targetCard) {
            setTimeout(() => {
                targetCard.classList.add('active');
            }, 50);
        }
    });
});

// AI Chat Widget
(function initAIChat() {
    if (document.getElementById('fusion-ai-chat-btn')) return;

    const injectAIStyles = () => {
        if (document.getElementById('fusion-ai-style')) return;
        const style = document.createElement('style');
        style.id = 'fusion-ai-style';
        style.textContent = `
        .ai-chat-button{position:fixed;right:1.25rem;bottom:1.25rem;z-index:10000;display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1rem;background:linear-gradient(135deg,#A855F7 0%,#6366F1 100%);color:#fff;border:none;border-radius:999px;box-shadow:0 12px 30px rgba(99,102,241,.35);cursor:pointer;font-weight:700}
        .ai-chat-panel{position:fixed;right:1.25rem;bottom:4.5rem;width:340px;max-height:60vh;display:none;flex-direction:column;background:#0F1224;border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.5);overflow:hidden;z-index:10000}
        .ai-chat-panel.active{display:flex}
        .ai-chat-header{display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;background:rgba(255,255,255,.06);color:#fff}
        .ai-chat-messages{padding:1rem;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem;min-height:140px}
        .ai-msg{padding:.625rem .75rem;border-radius:10px;line-height:1.5}
        .ai-msg.user{background:rgba(168,85,247,.2);color:#fff;align-self:flex-end}
        .ai-msg.ai{background:rgba(99,102,241,.15);color:#fff;align-self:flex-start}
        .ai-chat-input{display:flex;gap:.5rem;padding:.75rem;border-top:1px solid rgba(255,255,255,.08)}
        .ai-chat-input input{flex:1;padding:.6rem .75rem;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff}
        .ai-chat-input button{padding:.6rem .9rem;border-radius:10px;border:none;background:linear-gradient(135deg,#A855F7 0%,#6366F1 100%);color:#fff;font-weight:700;cursor:pointer}
        .ai-chat-actions{display:flex;gap:.5rem;align-items:center}
        .ai-chat-actions button{background:transparent;border:none;color:rgba(255,255,255,.85);cursor:pointer}
        .ai-key-warning{color:#FBBF24;font-size:.8rem}
        @media (max-width:480px){.ai-chat-panel{right:.75rem;left:.75rem;width:auto}}
        `;
        document.head.appendChild(style);
    };

    injectAIStyles();

    const btn = document.createElement('button');
    btn.id = 'fusion-ai-chat-btn';
    btn.className = 'ai-chat-button';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="14" rx="4" stroke="white" stroke-width="2"/><circle cx="8" cy="11" r="1.5" fill="white"/><circle cx="12" cy="11" r="1.5" fill="white"/><circle cx="16" cy="11" r="1.5" fill="white"/></svg><span>Fale com nossa IA</span>';
    btn.type = 'button';
    // Fallback inline style (caso CSS não carregue)
    btn.style.position = 'fixed';
    btn.style.right = btn.style.right || '20px';
    btn.style.bottom = btn.style.bottom || '20px';

    const panel = document.createElement('div');
    panel.id = 'fusion-ai-chat-panel';
    panel.className = 'ai-chat-panel';
    panel.innerHTML = `
        <div class="ai-chat-header">
            <strong>Fusion IA</strong>
            <div class="ai-chat-actions">
                <button id="fusion-ai-key-btn" title="Configurar chave">⚙️</button>
                <button id="fusion-ai-close-btn" title="Fechar">✖️</button>
            </div>
        </div>
        <div id="fusion-ai-messages" class="ai-chat-messages"></div>
        <div class="ai-chat-input">
            <input id="fusion-ai-input" type="text" placeholder="Digite sua pergunta..." />
            <button id="fusion-ai-send-btn">Enviar</button>
        </div>
        <div id="fusion-ai-key-warning" class="ai-key-warning" style="display:none;padding:.5rem 1rem;">Defina a chave da API para usar a IA.</div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const messagesEl = panel.querySelector('#fusion-ai-messages');
    const inputEl = panel.querySelector('#fusion-ai-input');
    const sendBtn = panel.querySelector('#fusion-ai-send-btn');
    const closeBtn = panel.querySelector('#fusion-ai-close-btn');
    const keyBtn = panel.querySelector('#fusion-ai-key-btn');
    const keyWarn = panel.querySelector('#fusion-ai-key-warning');

    const getKey = () => sessionStorage.getItem('fusion_ai_key') || '';
    const setKey = (k) => sessionStorage.setItem('fusion_ai_key', k);

    const resolveDefaultKey = () => {
        const w = window;
        if (typeof w.FUSION_AI_KEY === 'string' && w.FUSION_AI_KEY.trim()) return w.FUSION_AI_KEY.trim();
        const meta = document.querySelector('meta[name="fusion-ai-key"]');
        if (meta && typeof meta.content === 'string' && meta.content.trim()) return meta.content.trim();
        return '';
    };
    const defaultKey = resolveDefaultKey();
    if (defaultKey) {
        setKey(defaultKey);
        keyWarn.style.display = 'none';
        keyBtn.style.display = 'none';
    }

    const togglePanel = () => {
        panel.classList.toggle('active');
        if (panel.classList.contains('active')) inputEl.focus();
    };

    const addMsg = (text, role) => {
        const div = document.createElement('div');
        div.className = `ai-msg ${role}`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    };

    const callAI = async (prompt) => {
        const apiKey = getKey();
        if (!apiKey) {
            keyWarn.style.display = 'block';
            addMsg('Configure a chave da API para usar a IA.', 'ai');
            return;
        }
        keyWarn.style.display = 'none';
        try {
            const endpoints = [
                'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
                'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent',
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
            ];

            const body = JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }]}],
                generationConfig: { temperature: 0.4 }
            });

            let lastStatus = null;
            for (const ep of endpoints) {
                const res = await fetch(ep, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': apiKey
                    },
                    body
                });
                if (res.ok) {
                    const data = await res.json();
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
                    addMsg(text, 'ai');
                    return;
                } else {
                    lastStatus = res.status + ' ' + res.statusText;
                }
            }
            addMsg('Erro da API: ' + (lastStatus || 'desconhecido'), 'ai');
        } catch (err) {
            addMsg('Falha ao conectar à IA. Verifique sua rede.', 'ai');
        }
    }; 

    btn.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', togglePanel);
    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (panel.classList.contains('active')) {
            if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove('active');
        }
    });
    keyBtn.addEventListener('click', () => {
        const current = getKey();
        const k = prompt('Cole sua chave da API Google AI:', current || '');
        if (k !== null) setKey(k.trim());
        if (!getKey()) keyWarn.style.display = 'block'; else keyWarn.style.display = 'none';
    });
    sendBtn.addEventListener('click', () => {
        const v = inputEl.value.trim();
        if (!v) return;
        addMsg(v, 'user');
        inputEl.value = '';
        callAI(v);
    });
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Start minimized
    keyWarn.style.display = getKey() ? 'none' : 'block';
})();
