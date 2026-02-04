// Dashboard - Cliente
let currentUser = null;

// Check authentication
function checkAuth() {
    const loggedIn = sessionStorage.getItem('fusion_logged_in');
    const userEmail = sessionStorage.getItem('fusion_user_email');
    
    if (!loggedIn || !userEmail) {
        window.location.href = 'index.html';
        return false;
    }
    const profileRaw = sessionStorage.getItem('fusion_session_profile');
    currentUser = profileRaw ? JSON.parse(profileRaw) : { email: userEmail, role:'cliente', id: 'user-'+Date.now(), firstName:'Cliente', lastName:'Fusion' };
    
    // Check if user is admin
    if (currentUser.role === 'admin') {
        window.location.href = 'admin.html';
        return false;
    }
    
    // Update UI
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.textContent = `${currentUser.firstName || 'Cliente'} ${currentUser.lastName || 'Fusion'}`;
    
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
        'new-ticket': 'newTicketSection',
        'ticket-detail': 'ticketDetailSection'
    };
    // Restrict access to new ticket if user already has one
    if (sectionId === 'new-ticket') {
        const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
        const hasOne = tickets.some(t => t.userId === currentUser.id);
        if (hasOne) {
            alert('Você já possui um ticket. Apague o atual para criar outro.');
            sectionId = 'tickets';
        }
    }
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
        loadTickets();
    }
}

// Load tickets
function loadTickets() {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const userTickets = tickets.filter(t => t.userId === currentUser.id).reverse();
    
    const ticketsList = document.getElementById('ticketsList');
    
    if (userTickets.length === 0) {
        ticketsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 3rem;">Nenhum ticket encontrado. Crie seu primeiro ticket!</p>';
        return;
    }
    
    ticketsList.innerHTML = userTickets.map(ticket => {
        const statusClass = ticket.status.replace(' ', '-');
        const typeLabels = {
            'comprovante': 'Enviar Comprovante',
            'receber-plano': 'Receber Plano',
            'duvida': 'Dúvida',
            'reembolso': 'Reembolso'
        };
        
        return `
            <div class="ticket-card" onclick="viewTicket('${ticket.id}')">
                <div class="ticket-card-header">
                    <span class="ticket-id">#${ticket.id}</span>
                    <span class="ticket-status ${statusClass}">${ticket.status}</span>
                </div>
                <div class="ticket-type">${typeLabels[ticket.type] || ticket.type}</div>
                <div class="ticket-subject">${ticket.subject}</div>
                <div class="ticket-preview">${ticket.messages[0]?.content || ticket.message || ''}</div>
                <div class="ticket-meta">
                    <span>Criado em ${new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>${ticket.messages.length} mensagem(ns)</span>
                </div>
            </div>
        `;
    }).join('');
}

// View ticket
function viewTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket || ticket.userId !== currentUser.id) {
        alert('Ticket não encontrado!');
        return;
    }
    
    showSection('ticket-detail');
    
    const typeLabels = {
        'receber-plano-basico': 'Receber Plano Básico',
        'receber-plano-ultra': 'Receber Plano Ultra',
        'reembolso': 'Reembolso',
        'duvidas': 'Dúvidas',
        'relatar-problema': 'Relatar um Problema'
    };
    
    const statusLabels = {
        'aberto': 'Aberto',
        'em-andamento': 'Em Andamento',
        'fechado': 'Fechado'
    };
    
    const isLocked = false;
    
    document.getElementById('ticketDetailTitle').textContent = `Ticket #${ticket.id}`;
    
    document.getElementById('ticketDetail').innerHTML = `
        <div class="ticket-detail-header">
            <h2>${ticket.subject}</h2>
            <div style="display:flex; gap:0.75rem; align-items:center;">
                <span class="ticket-status ${ticket.status.replace(' ', '-')}">${statusLabels[ticket.status]}</span>
                <button class="btn-secondary" onclick="closeTicket('${ticket.id}')" ${ticket.status === 'fechado' ? 'disabled' : ''}>Fechar Ticket</button>
                <button class="btn-secondary" onclick="deleteTicket('${ticket.id}')">Apagar Ticket</button>
                ${ticket.plan ? `<button class="btn-secondary" onclick="openClientFeedbackForm('${ticket.id}')">Escrever Feedback</button>` : ''}
            </div>
        </div>
        
        <div class="ticket-detail-info">
            <div class="ticket-info-item">
                <span class="ticket-info-label">Tipo</span>
                <span class="ticket-info-value">${typeLabels[ticket.type] || ticket.type}</span>
            </div>
            <div class="ticket-info-item">
                <span class="ticket-info-label">Status</span>
                <span class="ticket-info-value">${statusLabels[ticket.status]}</span>
            </div>
            <div class="ticket-info-item">
                <span class="ticket-info-label">Criado em</span>
                <span class="ticket-info-value">${new Date(ticket.createdAt).toLocaleString('pt-BR')}</span>
            </div>
        </div>
        
        ${isLocked ? '<div class="ticket-locked">⏳ Aguardando resposta do administrador. Você não pode enviar mais mensagens até que um admin responda.</div>' : ''}
        
        <div class="ticket-messages">
            ${ticket.messages.map(msg => `
                <div class="message ${msg.role}">
                    <div class="message-header">
                        <span>${msg.role === 'admin' ? 'Administrador' : 'Você'}</span>
                        <span class="message-time">${new Date(msg.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="message-content">${msg.content}</div>
                    ${msg.image ? `<img src="${msg.image}" alt="Anexo" class="message-image">` : ''}
                </div>
            `).join('')}
        </div>
        
        ${!isLocked && ticket.status !== 'fechado' ? `
            <form class="ticket-response-form" onsubmit="sendMessage(event, '${ticket.id}')">
                <textarea placeholder="Digite sua mensagem..."></textarea>
                <div style="display:flex; gap:1rem; align-items:center;">
                    <input type="file" accept="image/*" class="ticket-attachment">
                    <button type="submit" class="btn-primary">Enviar</button>
                </div>
            </form>
        ` : ''}
        <div id="feedbackFormContainer"></div>
    `;
}

// Send message
function sendMessage(e, ticketId) {
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
            role: 'user',
            content: content,
            image: imageData || null,
            timestamp: new Date().toISOString()
        });
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

function closeTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.userId !== currentUser.id) return;
    ticket.status = 'fechado';
    ticket.updatedAt = new Date().toISOString();
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    viewTicket(ticketId);
}

function deleteTicket(ticketId) {
    if (!confirm('Tem certeza que deseja apagar este ticket?')) return;
    let tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.userId !== currentUser.id) return;
    tickets = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    alert('Ticket apagado.');
    showSection('tickets');
    loadTickets();
}

function openClientFeedbackForm(ticketId){
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const t = tickets.find(x => x.id === ticketId);
    if (!t || t.userId !== currentUser.id || !t.plan) return;
    const c = document.getElementById('feedbackFormContainer');
    if (!c) return;
    const existing = t.feedback;
    const currentRating = existing?.rating || 0;
    const currentText = existing?.text || '';
    c.innerHTML = `
        <div class="ticket-detail-box" style="margin-top:1rem;">
            <h3>Feedback</h3>
            <div style="display:flex;gap:.5rem;align-items:center;margin:.5rem 0;">
                <span>Estrelas:</span>
                <div id="feedbackStars" style="display:flex;gap:.25rem;">
                    ${[1,2,3,4,5].map(n => `<button type="button" class="btn-secondary" data-star="${n}">${n <= currentRating ? '★' : '☆'}</button>`).join('')}
                </div>
            </div>
            <textarea id="feedbackText" rows="3" style="width:100%;padding:.75rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:var(--text-primary);" placeholder="Escreva seu feedback...">${currentText}</textarea>
            <div style="display:flex;gap:.5rem;margin-top:.5rem;">
                <button class="btn-secondary" onclick="submitClientFeedback('${ticketId}')">Salvar Feedback</button>
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

function submitClientFeedback(ticketId){
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    const t = tickets.find(x => x.id === ticketId);
    if (!t || t.userId !== currentUser.id || !t.plan) return;
    const c = document.getElementById('feedbackFormContainer');
    const text = (document.getElementById('feedbackText')?.value || '').trim();
    const rating = Number(c?.getAttribute('data-rating') || 0);
    const item = { id: `${ticketId}-${Date.now()}`, ticketId, userName: t.userName || `${currentUser.firstName} ${currentUser.lastName}`, plan: t.plan, rating, text, createdAt: new Date().toISOString() };
    let feedbacks = [];
    try { feedbacks = JSON.parse(localStorage.getItem('fusion_feedbacks') || '[]'); } catch {}
    feedbacks.push(item);
    localStorage.setItem('fusion_feedbacks', JSON.stringify(feedbacks));
    t.feedback = { rating, text, savedAt: new Date().toISOString() };
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    c.innerHTML = '<div class="ticket-detail-box" style="margin-top:1rem;">Feedback salvo com sucesso.</div>';
}

// New ticket form
const newTicketForm = document.getElementById('newTicketForm');
if (newTicketForm) {
    const ticketImage = document.getElementById('ticketImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (ticketImage) {
        ticketImage.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.innerHTML = '';
            }
        });
    }
    
    newTicketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Double-check restriction before creating
        const existing = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
        if (existing.some(t => t.userId === currentUser.id)) {
            alert('Você já possui um ticket. Apague o atual para criar outro.');
            showSection('tickets');
            return;
        }
        
        const type = document.getElementById('ticketType').value;
        const subject = document.getElementById('ticketSubject').value;
        const message = document.getElementById('ticketMessage').value;
        const imageFile = document.getElementById('ticketImage').files[0];
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                createTicket(type, subject, message, event.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            createTicket(type, subject, message, null);
        }
    });
}

function createTicket(type, subject, message, imageData) {
    const ticket = {
        id: 'ticket-' + Date.now(),
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        type: type,
        subject: subject,
        status: 'aberto',
        messages: [{
            role: 'user',
            content: message,
            image: imageData,
            timestamp: new Date().toISOString()
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const tickets = JSON.parse(localStorage.getItem('fusion_tickets') || '[]');
    tickets.push(ticket);
    localStorage.setItem('fusion_tickets', JSON.stringify(tickets));
    
    alert('Ticket criado com sucesso! Abrindo chat...');
    newTicketForm.reset();
    document.getElementById('comprovanteFields').style.display = 'none';
    document.getElementById('comprovanteWarning').style.display = 'none';
    document.getElementById('imagePreview').innerHTML = '';
    viewTicket(ticket.id);
}

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
    sessionStorage.removeItem('fusion_session_role');
    sessionStorage.removeItem('fusion_session_profile');
    window.location.href = 'index.html';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        showSection('tickets');
    }
});

