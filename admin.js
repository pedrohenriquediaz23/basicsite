// Admin Dashboard
let currentAdmin = null;
let currentTicketsPlan = null;

// Check authentication
function checkAuth() {
    const loggedIn = sessionStorage.getItem('fusion_logged_in');
    const userEmail = sessionStorage.getItem('fusion_user_email');
    
    if (!loggedIn || !userEmail) {
        window.location.href = 'index.html';
        return false;
    }
    
    const userData = localStorage.getItem(`fusion_user_${userEmail}`);
    let role = sessionStorage.getItem('fusion_session_role');
    if (!role && userData) {
        try { role = JSON.parse(userData).role; } catch {}
    }
    if (role !== 'admin') {
        window.location.href = 'dashboard.html';
        return false;
    }
    currentAdmin = userData ? JSON.parse(userData) : { firstName: 'Admin', lastName: 'Fusion', role: 'admin', email: userEmail };
    const nameEl = document.getElementById('adminName');
    if (nameEl) nameEl.textContent = `${currentAdmin.firstName || 'Admin'} ${currentAdmin.lastName || 'Fusion'}`;
    
    return true;
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const idMap = {
        'tickets': 'ticketsSection',
        'tickets-ultra': 'ticketsUltraSection',
        'tickets-basic': 'ticketsBasicSection',
        'settings': 'settingsSection',
        'stats': 'statsSection',
        'ticket-detail': 'ticketDetailSection',
        'feedbacks-admin': 'feedbacksAdminSection'
    };
    const sectionEl = document.getElementById(idMap[sectionId] || (sectionId + 'Section'));
    if (sectionEl) {
        sectionEl.classList.add('active');
        sectionEl.style.display = 'block';
    }
    
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    if (sectionId === 'tickets') {
        currentTicketsPlan = null;
        loadTickets('all', currentTicketsPlan);
    } else if (sectionId === 'tickets-ultra') {
        currentTicketsPlan = 'ultra';
        loadTickets('all', currentTicketsPlan);
    } else if (sectionId === 'tickets-basic') {
        currentTicketsPlan = 'basic';
        loadTickets('all', currentTicketsPlan);
    } else if (sectionId === 'settings') {
        renderSettings();
    } else if (sectionId === 'stats') {
        loadStats();
    } else if (sectionId === 'feedbacks-admin') {
        loadFeedbacks('all');
    }
}

// Load tickets
function loadTickets(filter = 'all', plan = null) {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    let filteredTickets = tickets;
    
    if (filter !== 'all') {
        filteredTickets = tickets.filter(t => t.status === filter);
    }
    
    if (plan) {
        filteredTickets = filteredTickets.filter(t => t.plan === plan);
    }
    filteredTickets = filteredTickets.reverse();
    
    const ticketsList = plan === 'ultra'
        ? document.getElementById('ticketsUltraList')
        : plan === 'basic'
            ? document.getElementById('ticketsBasicList')
            : document.getElementById('ticketsList');
    
    if (filteredTickets.length === 0) {
        ticketsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 3rem;">Nenhum ticket encontrado.</p>';
        return;
    }
    
    const cardHtml = (ticket) => {
        const statusClass = ticket.status.replace(' ', '-');
        const typeLabels = {
            'comprovante': 'Enviar Comprovante',
            'receber-plano': 'Receber Plano',
            'duvida': 'Dúvida',
            'reembolso': 'Reembolso'
        };
        
        const unreadCount = ticket.messages.filter(m => m.role === 'user' && !m.read).length;
        
        return `
            <div class="ticket-card" onclick="viewTicket('${ticket.id}')">
                <div class="ticket-card-header">
                    <span class="ticket-id">#${ticket.id} - ${ticket.userName}</span>
                    <span class="ticket-status ${statusClass}">${ticket.status}</span>
                </div>
                <div class="ticket-type">${typeLabels[ticket.type] || ticket.type}</div>
                <div class="ticket-subject">${ticket.subject}</div>
                <div class="ticket-preview">${ticket.messages[0]?.content || ticket.message || ''}</div>
                <div class="ticket-meta">
                    <span>Criado em ${new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>${ticket.messages.length} mensagem(ns) ${unreadCount > 0 ? `• ${unreadCount} nova(s)` : ''} ${ticket.plan ? `• Plano: ${ticket.plan.toUpperCase()}` : ''}</span>
                </div>
            </div>
        `;
    };

    ticketsList.innerHTML = filteredTickets.map(cardHtml).join('');
}

// View ticket
function viewTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
        alert('Ticket não encontrado!');
        return;
    }
    
    // Mark messages as read
    ticket.messages.forEach(msg => {
        if (msg.role === 'user') {
            msg.read = true;
        }
    });
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    
    showSection('ticket-detail');
    
    const typeLabels = {
        'comprovante': 'Enviar Comprovante',
        'receber-plano': 'Receber Plano',
        'duvida': 'Dúvida',
        'reembolso': 'Reembolso'
    };
    
    const statusLabels = {
        'aberto': 'Aberto',
        'em-andamento': 'Em Andamento',
        'fechado': 'Fechado'
    };
    
    document.getElementById('ticketDetailTitle').textContent = `Ticket #${ticket.id} - ${ticket.userName}`;
    
    document.getElementById('ticketDetail').innerHTML = `
        <div class="ticket-detail-header">
            <h2>${ticket.subject}</h2>
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                <span class="ticket-status ${ticket.status.replace(' ', '-')}">${statusLabels[ticket.status]}</span>
                <select id="statusSelect" onchange="updateTicketStatus('${ticket.id}', this.value)" style="padding: 0.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--text-primary);">
                    <option value="aberto" ${ticket.status === 'aberto' ? 'selected' : ''}>Aberto</option>
                    <option value="em-andamento" ${ticket.status === 'em-andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="fechado" ${ticket.status === 'fechado' ? 'selected' : ''}>Fechado</option>
                </select>
                <button class="btn-secondary" onclick="updateTicketStatus('${ticket.id}','em-andamento')">Ticket em Andamento</button>
                <button class="btn-secondary" onclick="closeTicket('${ticket.id}')" ${ticket.status === 'fechado' ? 'disabled' : ''}>Fechar Ticket</button>
                <button class="btn-secondary" onclick="deleteTicket('${ticket.id}')">Apagar Ticket</button>
                <div style="display:flex;gap:.5rem;align-items:center;">
                    <span style="color:var(--text-secondary);">Plano:</span>
                    <button class="btn-secondary" ${ticket.plan === 'basic' ? 'disabled' : ''} onclick="setTicketPlan('${ticket.id}','basic')">Basic</button>
                    <button class="btn-secondary" ${ticket.plan === 'ultra' ? 'disabled' : ''} onclick="setTicketPlan('${ticket.id}','ultra')">Ultra</button>
                    <span style="color:var(--text-secondary);">Atual: ${ticket.plan ? ticket.plan.toUpperCase() : 'N/D'}</span>
                </div>
                ${ticket.plan ? `<button class="btn-secondary" onclick="openFeedbackForm('${ticket.id}')">Escrever Feedback</button>` : ''}
            </div>
        </div>
        
        <div class="ticket-detail-info">
            <div class="ticket-info-item">
                <span class="ticket-info-label">Cliente</span>
                <span class="ticket-info-value">${ticket.userName} (${ticket.userEmail})</span>
            </div>
            <div class="ticket-info-item">
                <span class="ticket-info-label">Tipo</span>
                <span class="ticket-info-value">${typeLabels[ticket.type] || ticket.type}</span>
            </div>
            <div class="ticket-info-item">
                <span class="ticket-info-label">Status</span>
                <span class="ticket-info-value">${statusLabels[ticket.status]}</span>
            </div>
            ${['receber-plano','comprovante'].includes(ticket.type) ? `
            <div class="ticket-info-item">
                <span class="ticket-info-label">Pagamento</span>
                <span class="ticket-info-value">${ticket.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}</span>
                <button class="btn-secondary" style="margin-left:.5rem" onclick="setPaymentStatus('${ticket.id}','${ticket.paymentStatus === 'pago' ? 'pendente' : 'pago'}')">${ticket.paymentStatus === 'pago' ? 'Marcar como Pendente' : 'Marcar como Pago'}</button>
            </div>
            ` : ''}
            <div class="ticket-info-item">
                <span class="ticket-info-label">Criado em</span>
                <span class="ticket-info-value">${new Date(ticket.createdAt).toLocaleString('pt-BR')}</span>
            </div>
        </div>
        
        <div class="ticket-messages">
            ${ticket.messages.map(msg => `
                <div class="message ${msg.role}">
                    <div class="message-header">
                        <span>${msg.role === 'admin' ? 'Você (Admin)' : ticket.userName}</span>
                        <span class="message-time">${new Date(msg.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="message-content">${msg.content}</div>
                    ${msg.image ? `<img src="${msg.image}" alt="Anexo" class="message-image">` : ''}
                </div>
            `).join('')}
        </div>
        
        ${ticket.status !== 'fechado' ? `
            <form class="ticket-response-form" onsubmit="sendAdminMessage(event, '${ticket.id}')">
                <textarea placeholder="Digite sua resposta..."></textarea>
                <div style="display:flex; gap:1rem; align-items:center;">
                    <input type="file" accept="image/*" class="ticket-attachment">
                    <button type="submit" class="btn-primary">Enviar</button>
                </div>
            </form>
        ` : '<div class="ticket-locked">Este ticket está fechado.</div>'}
        <div id="feedbackFormContainer"></div>
    `;
}

function setTicketPlan(ticketId, plan) {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    ticket.plan = plan;
    ticket.updatedAt = new Date().toISOString();
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    viewTicket(ticketId);
}

function setPaymentStatus(ticketId, status) {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    ticket.paymentStatus = status;
    ticket.updatedAt = new Date().toISOString();
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    viewTicket(ticketId);
}

// Send admin message
function sendAdminMessage(e, ticketId) {
    e.preventDefault();
    
    const textarea = e.target.querySelector('textarea');
    const content = textarea.value.trim();
    const fileInput = e.target.querySelector('.ticket-attachment');
    const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
    
    if (!content && !file) return;
    
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    const pushAndRefresh = (imageData) => {
        ticket.messages.push({
            role: 'admin',
            content: content,
            image: imageData || null,
            timestamp: new Date().toISOString(),
            adminName: `${currentAdmin.firstName} ${currentAdmin.lastName}`
        });
        if (ticket.type === 'comprovante' && ticket.status === 'aberto') {
            ticket.status = 'em-andamento';
        }
        ticket.updatedAt = new Date().toISOString();
        localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
        textarea.value = '';
        if (fileInput) fileInput.value = '';
        viewTicket(ticketId);
    };
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            pushAndRefresh(event.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        pushAndRefresh(null);
    }
}

// Update ticket status
function updateTicketStatus(ticketId, newStatus) {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    ticket.status = newStatus;
    ticket.updatedAt = new Date().toISOString();
    
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    
    viewTicket(ticketId);
}

function closeTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    ticket.status = 'fechado';
    ticket.updatedAt = new Date().toISOString();
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    viewTicket(ticketId);
}

// Feedbacks
function openFeedbackForm(ticketId){
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const t = tickets.find(x => x.id === ticketId);
    if (!t || !t.plan) return;
    const c = document.getElementById('feedbackFormContainer');
    if (!c) return;
    const existing = t.feedback;
    const currentRating = existing?.rating || 0;
    const currentText = existing?.text || '';
    c.innerHTML = `
        <div class="ticket-detail-box" style="margin-top:1rem;">
            <h3>Feedback do Cliente</h3>
            <div style="display:flex;gap:.5rem;align-items:center;margin:.5rem 0;">
                <span>Estrelas:</span>
                <div id="feedbackStars" style="display:flex;gap:.25rem;">
                    ${[1,2,3,4,5].map(n => `<button type="button" class="btn-secondary" data-star="${n}">${n <= currentRating ? '★' : '☆'}</button>`).join('')}
                </div>
            </div>
            <textarea id="feedbackText" rows="3" style="width:100%;padding:.75rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:var(--text-primary);" placeholder="Escreva o feedback...">${currentText}</textarea>
            <div style="display:flex;gap:.5rem;margin-top:.5rem;">
                <button class="btn-secondary" onclick="submitFeedback('${ticketId}')">Salvar Feedback</button>
            </div>
        </div>
    `;
    const stars = c.querySelectorAll('#feedbackStars [data-star]');
    stars.forEach(btn => btn.addEventListener('click', () => {
        const val = Number(btn.getAttribute('data-star'));
        stars.forEach(b => { const n = Number(b.getAttribute('data-star')); b.textContent = n <= val ? '★' : '☆'; });
        c.setAttribute('data-rating', String(val));
    }));
}

function submitFeedback(ticketId){
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const t = tickets.find(x => x.id === ticketId);
    if (!t || !t.plan) return;
    const c = document.getElementById('feedbackFormContainer');
    const text = (document.getElementById('feedbackText')?.value || '').trim();
    const rating = Number(c?.getAttribute('data-rating') || 0);
    const item = { id: `${ticketId}-${Date.now()}`, ticketId, userName: t.userName || 'Cliente', plan: t.plan, rating, text, createdAt: new Date().toISOString() };
    let feedbacks = [];
    try { feedbacks = JSON.parse(localStorage.getItem('fusion_feedbacks') || '[]'); } catch {}
    feedbacks.push(item);
    localStorage.setItem('fusion_feedbacks', JSON.stringify(feedbacks));
    t.feedback = { rating, text, savedAt: new Date().toISOString() };
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    c.innerHTML = '<div class="ticket-detail-box" style="margin-top:1rem;">Feedback salvo com sucesso.</div>';
}

function deleteTicket(ticketId) {
    if (!confirm('Tem certeza que deseja apagar este ticket?')) return;
    let tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    tickets = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    showSection('tickets');
    loadTickets();
}

// Load stats
function loadStats() {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    
    const total = tickets.length;
    const aberto = tickets.filter(t => t.status === 'aberto').length;
    const emAndamento = tickets.filter(t => t.status === 'em-andamento').length;
    const fechado = tickets.filter(t => t.status === 'fechado').length;
    
    document.getElementById('totalTickets').textContent = total;
    document.getElementById('openTickets').textContent = aberto;
    document.getElementById('inProgressTickets').textContent = emAndamento;
    document.getElementById('closedTickets').textContent = fechado;
}

// Feedbacks Admin
function loadFeedbacks(filter = 'all'){
    let items = [];
    try { items = JSON.parse(localStorage.getItem('fusion_feedbacks') || '[]'); } catch { items = []; }
    if (filter && filter !== 'all') items = items.filter(f => String(f.plan || '').toLowerCase() === filter);
    items = items.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const list = document.getElementById('feedbacksAdminList');
    if (!list) return;
    if (!items.length){
        list.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 3rem;">Nenhum feedback encontrado.</p>';
        return;
    }
    const star = (n) => '★★★★★'.slice(0, Math.max(0, Math.min(5, n))) + '☆☆☆☆☆'.slice(0, 5 - Math.max(0, Math.min(5, n)));
    list.innerHTML = items.map(f => `
        <div class="ticket-card">
            <div class="ticket-card-header">
                <span class="ticket-id">${f.userName || 'Cliente'} • ${String(f.plan||'').toUpperCase()}</span>
                <span class="ticket-status">${star(Number(f.rating||0))}</span>
            </div>
            <div class="ticket-subject">${new Date(f.createdAt).toLocaleString('pt-BR')}</div>
            <div class="ticket-preview">${f.text || ''}</div>
            <div class="ticket-meta">
                <button class="btn-secondary" onclick="deleteFeedback('${f.id}')">Apagar</button>
            </div>
        </div>
    `).join('');
    const ctrl = document.getElementById('feedbacksFilterControl');
    if (ctrl && !ctrl.__bound){
        ctrl.__bound = true;
        ctrl.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                ctrl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const f = btn.getAttribute('data-filter') || 'all';
                loadFeedbacks(f);
            });
        });
    }
}

function deleteFeedback(id){
    let items = [];
    try { items = JSON.parse(localStorage.getItem('fusion_feedbacks') || '[]'); } catch { items = []; }
    items = items.filter(f => f.id !== id);
    localStorage.setItem('fusion_feedbacks', JSON.stringify(items));
    const activeBtn = document.querySelector('#feedbacksFilterControl .filter-btn.active');
    const filter = activeBtn ? activeBtn.getAttribute('data-filter') || 'all' : 'all';
    loadFeedbacks(filter);
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        loadTickets(filter, currentTicketsPlan);
    });
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        showSection(section);
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('fusion_logged_in');
    sessionStorage.removeItem('fusion_user_email');
    window.location.href = 'index.html';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        showSection('tickets');
    }
});

// Settings
function getPlanNotices() {
    try {
        const raw = localStorage.getItem('fusion_plan_notices');
        const cfg = raw ? JSON.parse(raw) : {};
        return { basic: cfg.basic || 'none', ultra: cfg.ultra || 'none' };
    } catch {
        return { basic: 'none', ultra: 'none' };
    }
}

function savePlanNotices(cfg) {
    localStorage.setItem('fusion_plan_notices', JSON.stringify(cfg));
}

function renderSettings() {
    const cfg = getPlanNotices();
    const bind = (id, cb) => { const el = document.getElementById(id); if (el) el.onclick = cb; };
    bind('cfgBasicNone', () => { savePlanNotices({ basic: 'none', ultra: cfg.ultra }); });
    bind('cfgBasicMaint', () => { savePlanNotices({ basic: 'maintenance', ultra: cfg.ultra }); });
    bind('cfgBasicOut', () => { savePlanNotices({ basic: 'out', ultra: cfg.ultra }); });
    bind('cfgUltraNone', () => { savePlanNotices({ basic: cfg.basic, ultra: 'none' }); });
    bind('cfgUltraMaint', () => { savePlanNotices({ basic: cfg.basic, ultra: 'maintenance' }); });
    bind('cfgUltraOut', () => { savePlanNotices({ basic: cfg.basic, ultra: 'out' }); });
    bind('cfgBothNone', () => { savePlanNotices({ basic: 'none', ultra: 'none' }); });
    bind('cfgBothMaint', () => { savePlanNotices({ basic: 'maintenance', ultra: 'maintenance' }); });
    bind('cfgBothOut', () => { savePlanNotices({ basic: 'out', ultra: 'out' }); });
    const statusEl = document.getElementById('adminCodeStatus');
    const inputEl = document.getElementById('adminCodeInput');
    const saveBtn = document.getElementById('adminCodeSaveBtn');
    if (statusEl){ statusEl.textContent = localStorage.getItem('fusion_admin_code') ? 'Código configurado' : 'Código não definido'; }
    const deriveKey = async (password, salt, iterations) => {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({name:'PBKDF2', hash:'SHA-256', salt: Uint8Array.from(atob(salt), c=>c.charCodeAt(0)), iterations}, keyMaterial, 256);
        const bytes = new Uint8Array(bits);
        let binary = '';
        bytes.forEach(b=>binary += String.fromCharCode(b));
        return btoa(binary);
    };
    const genSalt = () => { const arr = new Uint8Array(16); crypto.getRandomValues(arr); let binary=''; arr.forEach(b=>binary+=String.fromCharCode(b)); return btoa(binary); };
    if (saveBtn && inputEl){
        saveBtn.onclick = async () => {
            const v = (inputEl.value || '').trim();
            if (!v){ alert('Informe um código.'); return; }
            const salt = genSalt();
            const iterations = 100000;
            const hash = await deriveKey(v, salt, iterations);
            localStorage.setItem('fusion_admin_code', JSON.stringify({hash, salt, iterations, updatedAt: new Date().toISOString()}));
            inputEl.value = '';
            if (statusEl) statusEl.textContent = 'Código configurado';
            alert('Código salvo.');
        };
    }

    const migBtn = document.getElementById('migrateUsersBtn');
    const migStatus = document.getElementById('migrateUsersStatus');
    if (migBtn){
        migBtn.onclick = async () => {
            try {
                if (migStatus) migStatus.textContent = 'Preparando usuários...';
                const usersList = JSON.parse(localStorage.getItem('fusion_users') || '[]');
                const pack = [];
                for (const key of usersList){
                    const baseRaw = localStorage.getItem(`fusion_user_${key}`);
                    if (!baseRaw) continue;
                    const base = JSON.parse(baseRaw);
                    const vaultRaw = localStorage.getItem(`fusion_vault_${key}`);
                    const vault = vaultRaw ? JSON.parse(vaultRaw) : null;
                    pack.push({
                        id: base.id,
                        email_hash: base.emailHash || key,
                        password_hash: base.passwordHash,
                        password_salt: base.passwordSalt,
                        password_iterations: base.passwordIterations,
                        role: base.role || 'cliente',
                        created_at: base.createdAt,
                        vault
                    });
                }
                if (!pack.length){ alert('Nenhum usuário encontrado para migrar.'); return; }
                if (migStatus) migStatus.textContent = `Enviando ${pack.length} usuário(s)...`;
                const bases = [];
                const add = (u) => { if (u && !bases.includes(u)) bases.push(u); };
                const baseEnv = (typeof window !== 'undefined' && window.FUSION_API_BASE) ? String(window.FUSION_API_BASE).replace(/\/$/,'') : '';
                add(baseEnv ? `${baseEnv}/api/users/migrate` : '/api/users/migrate');
                add('http://localhost:8080/api/users/migrate');
                let ok = false, data = null, lastErr = null;
                for (const url of bases){
                    try {
                        const resp = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ users: pack }) });
                        data = await resp.json();
                        if (resp.ok && data && data.ok){ ok = true; break; }
                    } catch(e){ lastErr = e; }
                }
                if (ok){ if (migStatus) migStatus.textContent = `Migrados: ${data.inserted}`; alert('Migração concluída com sucesso.'); }
                else { if (migStatus) migStatus.textContent = 'Erro na migração'; alert('Falha ao migrar. Verifique servidor.'); console.error('migração erro', lastErr || data); }
            } catch(e){ if (migStatus) migStatus.textContent = 'Erro na migração'; alert('Erro ao migrar: '+e); }
        };
    }
    const testBtn = document.getElementById('testApiBtn');
    const testStatus = document.getElementById('testApiStatus');
    if (testBtn){
        testBtn.onclick = async () => {
            try {
                testStatus && (testStatus.textContent = 'Testando...');
                const baseEnv = (typeof window !== 'undefined' && window.FUSION_API_BASE) ? String(window.FUSION_API_BASE).replace(/\/$/,'') : '';
                const urls = [];
                const add = (u) => { if (u && !urls.includes(u)) urls.push(u); };
                add(baseEnv ? `${baseEnv}/api/health` : '/api/health');
                add('http://localhost:8080/api/health');
                let ok = false, last = null;
                for (const u of urls){
                    try { const r = await fetch(u); if (r.ok){ const j = await r.json(); if (j && j.ok){ ok = true; break; } } last = r.status + ' ' + r.statusText; } catch(e){ last = String(e); }
                }
                if (ok){ testStatus && (testStatus.textContent = 'API OK'); alert('API disponível.'); }
                else { testStatus && (testStatus.textContent = 'API indisponível'); alert('API indisponível. Verifique deploy e logs.'); }
            } catch(e){ testStatus && (testStatus.textContent = 'Erro'); alert('Falha ao testar API: '+e); }
        };
    }
}
