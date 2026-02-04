const SIGNUP_FORM = document.getElementById('signupForm');
async function deriveKey(password, salt, iterations){
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({name:'PBKDF2', hash:'SHA-256', salt: Uint8Array.from(atob(salt), c=>c.charCodeAt(0)), iterations}, keyMaterial, 256);
    const bytes = new Uint8Array(bits);
    let binary = '';
    bytes.forEach(b=>binary += String.fromCharCode(b));
    return btoa(binary);
}
function genSalt(){
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    let binary = '';
    arr.forEach(b=>binary += String.fromCharCode(b));
    return btoa(binary);
}
async function hashEmail(email){
    const enc = new TextEncoder();
    const data = enc.encode((email||'').trim().toLowerCase());
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)));
}
async function encryptVault(obj, password){
    const salt = genSalt();
    const iterations = 100000;
    const keyBytesB64 = await deriveKey(password, salt, iterations);
    const keyBytes = Uint8Array.from(atob(keyBytesB64), c=>c.charCodeAt(0));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.importKey('raw', keyBytes, {name:'AES-GCM'}, false, ['encrypt']);
    const data = new TextEncoder().encode(JSON.stringify(obj));
    const cipherBuf = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, data);
    const cipherB64 = btoa(String.fromCharCode(...new Uint8Array(cipherBuf)));
    const ivB64 = btoa(String.fromCharCode(...iv));
    return { cipher: cipherB64, iv: ivB64, salt, iterations };
}

// Initialize admin user if not exists
async function initializeAdmin() {
    const adminExists = localStorage.getItem('fusion_admin_initialized');
    if (!adminExists) {
        localStorage.setItem('fusion_admin_initialized', 'true');
    }
}

async function initializeDemoClient() {
    const demoExists = localStorage.getItem('fusion_demo_initialized');
    if (!demoExists) {
        const email = 'cliente@fusion.com';
        const salt = genSalt();
        const iterations = 100000;
        const passwordHash = await deriveKey('cliente123', salt, iterations);
        const emailHash = await hashEmail(email);
        const base = { id:'user-demo', emailHash, passwordHash, passwordSalt: salt, passwordIterations: iterations, role:'cliente', createdAt: new Date().toISOString() };
        const vault = await encryptVault({ firstName:'Cliente', lastName:'Fusion', phone:'(11) 98888-8888' }, 'cliente123');
        localStorage.setItem(`fusion_user_${emailHash}`, JSON.stringify(base));
        localStorage.setItem(`fusion_vault_${emailHash}`, JSON.stringify(vault));
        let users = JSON.parse(localStorage.getItem('fusion_users') || '[]');
        if (!users.includes(emailHash)) {
            users.push(emailHash);
            localStorage.setItem('fusion_users', JSON.stringify(users));
        }
        localStorage.setItem('fusion_demo_initialized', 'true');
    }
}

// Signup form
if (SIGNUP_FORM) {
    SIGNUP_FORM.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('signupFirstName').value.trim();
        const lastName = document.getElementById('signupLastName').value.trim();
        const emailRaw = document.getElementById('signupEmail').value.trim();
        const email = emailRaw.toLowerCase();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const phoneRaw = document.getElementById('signupPhone').value;
        const phone = phoneRaw.trim();
        const acceptTerms = document.getElementById('acceptTerms') ? document.getElementById('acceptTerms').checked : true;
        
        // Validation
        if (!firstName || !lastName) {
            alert('Preencha nome e sobrenome.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Email inválido.');
            return;
        }
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        if (password.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres!');
            return;
        }
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10) {
            alert('Telefone inválido. Informe DDD + número.');
            return;
        }
        if (!acceptTerms) {
            alert('Você precisa aceitar os termos para continuar.');
            return;
        }
        
        const existingLegacy = localStorage.getItem(`fusion_user_${email}`);
        const emailHash = await hashEmail(email);
        const existingNew = localStorage.getItem(`fusion_user_${emailHash}`);
        if (existingLegacy || existingNew) {
            alert('Este email já está cadastrado!');
            return;
        }
        
        const salt = genSalt();
        const iterations = 100000;
        const passwordHash = await deriveKey(password, salt, iterations);
        const id = 'user-' + Date.now();
        const base = { id, emailHash, passwordHash, passwordSalt: salt, passwordIterations: iterations, role:'cliente', createdAt: new Date().toISOString() };
        const vault = await encryptVault({ firstName, lastName, phone }, password);
        localStorage.setItem(`fusion_user_${emailHash}`, JSON.stringify(base));
        localStorage.setItem(`fusion_vault_${emailHash}`, JSON.stringify(vault));
        let users = [];
        try { users = JSON.parse(localStorage.getItem('fusion_users') || '[]'); } catch {}
        if (!users.includes(emailHash)) users.push(emailHash);
        localStorage.setItem('fusion_users', JSON.stringify(users));
        try {
            const API = (window.FUSION_API_BASE || window.location.origin.replace(/\/$/, ''));
            const payload = { base: { id: base.id, email_hash: base.emailHash, password_hash: base.passwordHash, password_salt: base.passwordSalt, password_iterations: base.passwordIterations, role: base.role, created_at: base.createdAt }, vault };
            await fetch(`${API}/api/users/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } catch {}
        alert('Conta criada com sucesso! Redirecionando para login...');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    });
    
    // Phone mask
    const phoneInput = document.getElementById('signupPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }
        });
    }
}

// Initialize admin on load
document.addEventListener('DOMContentLoaded', () => { initializeAdmin(); initializeDemoClient(); });

// Cleanup: remove admin record from localStorage for segurança
(function cleanupAdminLS(){
    try {
        const email = 'admin@fusion.com';
        const key = `fusion_user_${email}`;
        if (localStorage.getItem(key)) localStorage.removeItem(key);
        let users = [];
        try { users = JSON.parse(localStorage.getItem('fusion_users') || '[]'); } catch {}
        const idx = users.indexOf(email);
        if (idx >= 0){ users.splice(idx,1); localStorage.setItem('fusion_users', JSON.stringify(users)); }
    } catch {}
})();

// Migração: converter registros legados que armazenam PII diretamente
(async function migrateLegacy(){
    try {
        let users = [];
        try { users = JSON.parse(localStorage.getItem('fusion_users') || '[]'); } catch {}
        const legacyEmails = users.filter(x => typeof x === 'string' && x.includes('@'));
        for (const email of legacyEmails) {
            const raw = localStorage.getItem(`fusion_user_${email}`);
            if (!raw) continue;
            const u = JSON.parse(raw);
            const emailHash = await hashEmail(email);
            const id = u.id || ('user-'+Date.now());
            const base = { id, emailHash, passwordHash: u.passwordHash || '', passwordSalt: u.passwordSalt || '', passwordIterations: u.passwordIterations || 100000, role: u.role || 'cliente', createdAt: u.createdAt || new Date().toISOString() };
            const pwd = u.password ? u.password : 'cliente123';
            const vault = await encryptVault({ firstName: u.firstName || 'Cliente', lastName: u.lastName || 'Fusion', phone: u.phone || '' }, pwd);
            localStorage.setItem(`fusion_user_${emailHash}`, JSON.stringify(base));
            localStorage.setItem(`fusion_vault_${emailHash}`, JSON.stringify(vault));
            localStorage.removeItem(`fusion_user_${email}`);
        }
        const newUsers = users.map(x => (typeof x === 'string' && x.includes('@')) ? null : x).filter(Boolean);
        // Append converted hashes
        for (const email of legacyEmails){ newUsers.push(await hashEmail(email)); }
        localStorage.setItem('fusion_users', JSON.stringify(newUsers));
    } catch {}
})();

