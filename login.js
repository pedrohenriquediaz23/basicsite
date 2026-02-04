// Login Modal Control
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');

// Open login modal
function openLoginModal() {
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close login modal
function closeLogin() {
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close button
if (closeLoginModal) {
    closeLoginModal.addEventListener('click', closeLogin);
}

// Close on background click
if (loginModal) {
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeLogin();
        }
    });
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
        closeLogin();
    }
});

// Profile button (index.html)
const profileBtn = document.querySelector('.btn-profile');
if (profileBtn) {
    profileBtn.addEventListener('click', openLoginModal);
}

// Checkout login link
const checkoutLoginLink = document.getElementById('checkoutLoginLink');
if (checkoutLoginLink) {
    checkoutLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
    });
}

// Login form submission
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
async function decryptVault(vault, password){
    const keyBytesB64 = await deriveKey(password, vault.salt, vault.iterations);
    const keyBytes = Uint8Array.from(atob(keyBytesB64), c=>c.charCodeAt(0));
    const iv = Uint8Array.from(atob(vault.iv), c=>c.charCodeAt(0));
    const key = await crypto.subtle.importKey('raw', keyBytes, {name:'AES-GCM'}, false, ['decrypt']);
    const cipher = Uint8Array.from(atob(vault.cipher), c=>c.charCodeAt(0));
    const plainBuf = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, cipher);
    return JSON.parse(new TextDecoder().decode(plainBuf));
}
function getAttempt(email){
    try { return JSON.parse(localStorage.getItem(`fusion_login_attempt_${email}`) || '{}'); } catch { return {}; }
}
function setAttempt(email, obj){
    localStorage.setItem(`fusion_login_attempt_${email}`, JSON.stringify(obj));
}
async function validatePassword(user, password){
    if (user.passwordHash && user.passwordSalt && user.passwordIterations){
        const h = await deriveKey(password, user.passwordSalt, user.passwordIterations);
        return h === user.passwordHash;
    }
    if (user.password){
        const salt = genSalt();
        const iterations = 100000;
        const passwordHash = await deriveKey(password, salt, iterations);
        delete user.password;
        user.passwordHash = passwordHash;
        user.passwordSalt = salt;
        user.passwordIterations = iterations;
        localStorage.setItem(`fusion_user_${user.email}`, JSON.stringify(user));
        return password.length > 0;
    }
    return false;
}
function hasAdminCode(){
    try { return !!localStorage.getItem('fusion_admin_code'); } catch { return false; }
}
async function verifyAdminCode(input){
    try {
        const cfg = JSON.parse(localStorage.getItem('fusion_admin_code') || '{}');
        if (!cfg.hash || !cfg.salt || !cfg.iterations) return false;
        const h = await deriveKey(input, cfg.salt, cfg.iterations);
        return h === cfg.hash;
    } catch { return false; }
}
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailRaw = document.getElementById('loginEmail').value;
        const email = (emailRaw || '').trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        if (!email || !password){ alert('Por favor, preencha todos os campos.'); return; }
        const att = getAttempt(email);
        const now = Date.now();
        if (att.lockedUntil && now < att.lockedUntil){ alert('Muitas tentativas. Tente novamente mais tarde.'); return; }
        const adminEmail = 'admin@fusion.com';
        if (email === adminEmail) {
            const codeOk = await verifyAdminCode(password);
            if (!codeOk){ alert('Código de segurança inválido.'); setAttempt(email, {count: (att.count||0)+1, lockedUntil: ((att.count||0)+1)>=5 ? now+10*60*1000 : 0}); return; }
            setAttempt(email, {count:0, lockedUntil:0});
            sessionStorage.setItem('fusion_logged_in', 'true');
            sessionStorage.setItem('fusion_user_email', email);
            sessionStorage.setItem('fusion_session_role', 'admin');
            alert('Login realizado com sucesso!');
            closeLogin();
            window.location.href = 'admin.html';
            return;
        }
        const emailHash = await hashEmail(email);
        let logged = false;
        try {
            const API = (window.FUSION_API_BASE || window.location.origin.replace(/\/$/, ''));
            const r = await fetch(`${API}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email_hash: emailHash, password }) });
            const j = await r.json();
            if (j && j.ok){
                let profile = { email, role: j.user?.role || 'cliente', id: j.user?.id };
                if (j.vault){ try { const info = await decryptVault(j.vault, password); profile = { ...profile, ...info }; } catch {} }
                sessionStorage.setItem('fusion_logged_in', 'true');
                sessionStorage.setItem('fusion_user_email', email);
                sessionStorage.setItem('fusion_session_role', j.user?.role || 'cliente');
                sessionStorage.setItem('fusion_session_profile', JSON.stringify(profile));
                alert('Login realizado com sucesso!');
                closeLogin();
                window.location.href = (j.user?.role === 'admin') ? 'admin.html' : 'dashboard.html';
                logged = true;
            } else {
                const localUser = localStorage.getItem(`fusion_user_${emailHash}`) || localStorage.getItem(`fusion_user_${email}`);
                const localVault = localStorage.getItem(`fusion_vault_${emailHash}`);
                if (localUser && localVault){
                    try {
                        const u = JSON.parse(localUser);
                        const v = JSON.parse(localVault);
                        const payload = { base: { id: u.id, email_hash: u.emailHash || u.email_hash, password_hash: u.passwordHash || u.password_hash, password_salt: u.passwordSalt || u.password_salt, password_iterations: u.passwordIterations || u.password_iterations, role: u.role || 'cliente', created_at: u.createdAt || u.created_at }, vault: v };
                        await fetch(`${API}/api/users/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
                        const r2 = await fetch(`${API}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email_hash: emailHash, password }) });
                        const j2 = await r2.json();
                        if (j2 && j2.ok){
                            let profile = { email, role: j2.user?.role || 'cliente', id: j2.user?.id };
                            if (j2.vault){ try { const info = await decryptVault(j2.vault, password); profile = { ...profile, ...info }; } catch {} }
                            sessionStorage.setItem('fusion_logged_in', 'true');
                            sessionStorage.setItem('fusion_user_email', email);
                            sessionStorage.setItem('fusion_session_role', j2.user?.role || 'cliente');
                            sessionStorage.setItem('fusion_session_profile', JSON.stringify(profile));
                            alert('Login realizado com sucesso!');
                            closeLogin();
                            window.location.href = (j2.user?.role === 'admin') ? 'admin.html' : 'dashboard.html';
                            logged = true;
                        }
                    } catch {}
                }
            }
        } catch {}
        if (logged) return;
        const userData = localStorage.getItem(`fusion_user_${emailHash}`) || localStorage.getItem(`fusion_user_${email}`);
        if (!userData){ alert('Email não encontrado.'); setAttempt(email, {count: (att.count||0)+1, lockedUntil: ((att.count||0)+1)>=5 ? now+10*60*1000 : 0}); return; }
        const user = JSON.parse(userData);
        const ok = await validatePassword(user, password);
        if (!ok){ alert('Senha incorreta.'); setAttempt(email, {count: (att.count||0)+1, lockedUntil: ((att.count||0)+1)>=5 ? now+10*60*1000 : 0}); return; }
        setAttempt(email, {count:0, lockedUntil:0});
        let profile = { email, role: user.role || 'cliente', id: user.id };
        const vaultRaw = localStorage.getItem(`fusion_vault_${emailHash}`);
        if (vaultRaw){
            try { const v = JSON.parse(vaultRaw); const info = await decryptVault(v, password); profile = { ...profile, ...info }; } catch {}
        }
        sessionStorage.setItem('fusion_logged_in', 'true');
        sessionStorage.setItem('fusion_user_email', email);
        sessionStorage.setItem('fusion_session_role', user.role || 'cliente');
        sessionStorage.setItem('fusion_session_profile', JSON.stringify(profile));
        alert('Login realizado com sucesso!');
        closeLogin();
        if (user.role === 'admin') { window.location.href = 'admin.html'; } else { window.location.href = 'dashboard.html'; }
    });
}

// Google login removido

// Check if user is logged in on page load
function checkLoginState() {
    const isLoggedIn = sessionStorage.getItem('fusion_logged_in') === 'true';
    if (isLoggedIn) {
        updateLoginState();
    }
}

// Update UI based on login state
function updateLoginState() {
    const isLoggedIn = sessionStorage.getItem('fusion_logged_in') === 'true';
    const userEmail = sessionStorage.getItem('fusion_user_email');
    
    if (isLoggedIn && profileBtn) {
        // Change profile button to show logged in state
        const masked = (userEmail||'').replace(/(.{1}).*(@.*)/, '$1***$2');
        profileBtn.setAttribute('title', masked || 'Usuário logado');
        profileBtn.style.background = 'rgba(168, 85, 247, 0.2)';
        profileBtn.style.borderColor = 'rgba(168, 85, 247, 0.5)';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
});

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.openLoginModal = openLoginModal;
    window.closeLogin = closeLogin;
}
