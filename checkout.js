// Plan configurations
const plans = {
    basic: {
        title: 'MÁQUINAS DO PLANO BASIC:',
        features: [
            'FILA DE MÁQUINAS LOCALIZADAS EM SÃO PAULO - BR',
            'SALVA OS ARQUIVOS',
            'Intel Core i7-14700K (20 Núcleos)',
            'Memória RAM: 16 GB',
            'Armazenamento: 1 TB SSD + 256 GB SSD Extra',
            'Placas de Vídeo: NVIDIA GT 1030 / GTX 1650 SUPER',
            '1GB/s DOWNLOAD & UPLOAD',
            'RESOLUÇÃO: 1080p'
        ],
        options: [
            { duration: '1 Hora', price: 'R$ 4,90', period: 'por hora' },
            { duration: '2 Horas', price: 'R$ 7,50', period: 'por 2 horas' },
            { duration: '4 Horas', price: 'R$ 15,90', period: 'por 4 horas' },
            { duration: '6 Horas', price: 'R$ 23,90', period: 'por 6 horas' },
            { duration: 'Semanal (7 dias)', price: 'R$ 49,90', period: 'every semana' },
            { duration: 'Quinzenal (15 dias)', price: 'R$ 62,90', period: 'every 15 dias' },
            { duration: 'Mensal (30 dias)', price: 'R$ 99,90', period: 'every mês' }
        ]
    },
    ultra: {
        title: 'MÁQUINAS DO PLANO ULTRA:',
        features: [
            'FILA DE MÁQUINAS LOCALIZADAS EM SÃO PAULO - BR',
            'SALVA OS ARQUIVOS',
            'Processador: Intel Core i5 / Ryzen 3 3200g',
            'RAM: 12/16 GB',
            'Armazenamento: 1TB SSD + 256 GB SSD (extra)',
            'Placa de Vídeo: NVIDIA GTX 1050 Ti / RX 550 / RX 580',
            '1GB/s DOWNLOAD & UPLOAD',
            'RESOLUÇÃO: ATÉ 4K'
        ],
        options: [
            { duration: '1 hora', price: 'R$ 5,90', period: 'por hora' },
            { duration: '3 horas', price: 'R$ 24,90', period: 'por 3 horas' },
            { duration: '5 horas', price: 'R$ 45,90', period: 'por 5 horas' },
            { duration: '7 dias', price: 'R$ 67,90', period: 'every semana' },
            { duration: 'Mensal (30 dias)', price: 'R$ 125,00', period: 'every mês' }
        ]
    }
};

// Get plan type from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const planType = urlParams.get('plano') || 'basic';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Enforce plan availability based on admin settings
    let notices = { basic: 'none', ultra: 'none' };
    try { notices = JSON.parse(localStorage.getItem('fusion_plan_notices') || '{}'); } catch {}
    const notice = notices[planType] || 'none';

    const plan = plans[planType] || plans.basic;
    
    // Update title
    document.getElementById('planTitle').textContent = plan.title;
    
    // Update features
    const featuresList = document.getElementById('planFeatures');
    featuresList.innerHTML = plan.features.map(feature => 
        `<li>${feature}</li>`
    ).join('');
    
    // If blocked, show message and stop
    const submitBtn = document.querySelector('.btn-submit');
    const planOptions = document.getElementById('planOptions');
    const formContent = document.querySelector('.form-content');
    if (notice !== 'none') {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = notice === 'out' ? 'Indisponível' : 'Em manutenção';
        }
        if (planOptions) planOptions.innerHTML = '';
        if (formContent) {
            const msg = document.createElement('div');
            msg.className = `plan-message ${notice === 'out' ? 'out' : 'maintenance'}`;
            msg.textContent = notice === 'out' ? 'Este plano está temporariamente fora de estoque.' : 'Este plano está em manutenção. Tente novamente mais tarde.';
            formContent.insertBefore(msg, document.querySelector('.form-title').nextSibling);
        }
        return;
    }

    // Update plan options
    planOptions.innerHTML = plan.options.map((option, index) => {
        const isSelected = index === 0 ? 'selected' : '';
        const planName = planType.toUpperCase();
        return `
            <div class="plan-option-card ${isSelected}" data-price="${option.price}" data-duration="${option.duration}">
                <div class="plan-option-radio"></div>
                <div class="plan-option-icon ${planType}">${planName}</div>
                <div class="plan-option-details">
                    <div class="plan-option-name">FUSION ${planName} - ${option.duration.toUpperCase()} x 1</div>
                    <div class="plan-option-price">${option.price}</div>
                    <div class="plan-option-period">${option.period}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers to plan options
    document.querySelectorAll('.plan-option-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.plan-option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
    
    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let selectedPlan = document.querySelector('.plan-option-card.selected');
        if (!selectedPlan) {
            const first = document.querySelector('.plan-option-card');
            if (first) {
                first.classList.add('selected');
                selectedPlan = first;
            }
        }
        if (!selectedPlan) {
            alert('Por favor, selecione uma opção de plano.');
            return;
        }
        const price = selectedPlan.getAttribute('data-price');
        const duration = selectedPlan.getAttribute('data-duration');
        const params = new URLSearchParams({ plano: planType, price, duration });
        window.location.href = `payment.html?${params.toString()}`;
    });
    
    // Dados pessoais removidos do checkout
});
