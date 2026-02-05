import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import https from 'https';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Load env vars
dotenv.config();

console.log('--- Server Startup Config ---');
console.log('BASIC Key Present:', !!(process.env.NEBULA_API_KEY_BASIC || process.env.VITE_NEBULA_API_KEY));
console.log('ULTRA Key Present:', !!process.env.NEBULA_API_KEY_ULTRA);
console.log('SUPABASE ADMIN Key Present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('-----------------------------');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep-alive agent to reuse connections and avoid exhaustion
const agent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 50,
    timeout: 30000
});

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Logging Middleware (Basic, no body logging for proxy to avoid stream issues)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        console.log(`[API Request] ${req.method} ${req.path}`);
    }
    next();
});

// --- Proxy Configuration from 'pegando' (Working Version) ---

// Keep-alive agent to reuse connections and avoid exhaustion (ensure this matches pegando)
const proxyAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 50,
    timeout: 30000
});

// Proxy for BASIC Plan (Keys starting with QJ)
app.use('/api/basic', (req, res, next) => {
    // console.log(`[Middleware Basic] Processing: ${req.url}`);
    const apiKey = process.env.NEBULA_API_KEY_BASIC || process.env.VITE_NEBULA_API_KEY;
    if (apiKey) {
        req.headers['authorization'] = `Bearer ${apiKey.trim()}`;
    } else {
        console.error('[Middleware Basic] No API Key found!');
    }
    next();
}, createProxyMiddleware({
    target: 'https://nebulagg.com/api',
    changeOrigin: true,
    secure: true,
    agent: proxyAgent,
    proxyTimeout: 30000,
    timeout: 30000,
    pathRewrite: { '^/api/basic': '' },
    onProxyReq: (proxyReq, req, res) => {
        // Fix body forwarding if it was parsed by express.json()
        if (req.body && Object.keys(req.body).length > 0) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onError: (err, req, res) => {
        console.error('[Proxy Basic] Error:', err);
        res.status(500).send('Proxy Error');
    }
}));

// Proxy for ULTRA Plan (Keys starting with kA)
app.use('/api/ultra', (req, res, next) => {
    // console.log(`[Middleware Ultra] Processing: ${req.url}`);
    const apiKey = process.env.NEBULA_API_KEY_ULTRA;
    if (apiKey) {
        req.headers['authorization'] = `Bearer ${apiKey.trim()}`;
    } else {
        console.error('[Middleware Ultra] No API Key found!');
    }
    next();
}, createProxyMiddleware({
    target: 'https://nebulagg.com/api',
    changeOrigin: true,
    secure: true,
    agent: proxyAgent,
    proxyTimeout: 30000,
    timeout: 30000,
    pathRewrite: { '^/api/ultra': '' },
    onProxyReq: (proxyReq, req, res) => {
        // Fix body forwarding if it was parsed by express.json()
        if (req.body && Object.keys(req.body).length > 0) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onError: (err, req, res) => {
        console.error('[Proxy Ultra] Error:', err);
        res.status(500).send('Proxy Error');
    }
}));

// Fallback / Legacy Proxy (uses default NEBULA_API_KEY_BASIC) moved to after localRouter to allow local routes to take precedence


// Helper for data persistence
const DATA_DIR = path.join(__dirname, 'data');
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json');
const OWNERSHIP_FILE = path.join(DATA_DIR, 'ownerships.json');

const readJson = (file) => {
    try {
        if (!fs.existsSync(file)) return file.endsWith('tokens.json') ? [] : {};
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return file.endsWith('tokens.json') ? [] : {};
    }
};

const writeJson = (file, data) => {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error writing file:', e);
    }
};

// --- Local API Router ---
const localRouter = express.Router();
// Enable body parsing ONLY for local routes
localRouter.use(express.json());

localRouter.post('/tokens/generate', (req, res) => {
    const { diskId, maxUses, duration } = req.body;
    const tokens = readJson(TOKENS_FILE);
    
    const token = 'TOK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newToken = {
        token,
        diskId,
        maxUses: maxUses || 1,
        duration: duration || 'permanent', // '7days', '30days' or 'permanent'
        used: 0,
        createdAt: Date.now()
    };
    
    tokens.push(newToken);
    writeJson(TOKENS_FILE, tokens);
    
    res.json({ success: true, token, maxUses, diskId, duration });
});

localRouter.post('/tokens/redeem', (req, res) => {
    const { token, user } = req.body;
    const cleanToken = (token || '').trim().toUpperCase();
    const tokens = readJson(TOKENS_FILE);
    const tokenIndex = tokens.findIndex(t => t.token === cleanToken);
    
    if (tokenIndex === -1) {
        return res.status(404).json({ success: false, message: 'Token inválido' });
    }
    
    const tokenData = tokens[tokenIndex];
    
    if (tokenData.used >= tokenData.maxUses) {
        return res.status(400).json({ success: false, message: 'Token esgotado' });
    }
    
    // Check expiration (optional implementation)
    // ...

    tokenData.used += 1;
    writeJson(TOKENS_FILE, tokens);
    
    // Assign ownership
    const ownerships = readJson(OWNERSHIP_FILE);
    if (!ownerships[user]) ownerships[user] = [];
    if (!ownerships[user].includes(tokenData.diskId)) {
        ownerships[user].push(tokenData.diskId);
        writeJson(OWNERSHIP_FILE, ownerships);
    }
    
    res.json({ success: true, diskId: tokenData.diskId });
});

localRouter.get('/user/disks/:email', (req, res) => {
    const { email } = req.params;
    const ownerships = readJson(OWNERSHIP_FILE);
    res.json({ disks: ownerships[email] || [] });
});

localRouter.get('/local/ownerships', (req, res) => {
    const ownerships = readJson(OWNERSHIP_FILE);
    res.json(ownerships);
});

// --- EMAIL ENDPOINT ---
localRouter.post('/send-verification-code', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email e código são obrigatórios' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "suporte@grupofusioncloud.site",
                pass: "FusionCloud2026@"
            }
        });

        const info = await transporter.sendMail({
            from: '"Fusion Cloud" <suporte@grupofusioncloud.site>',
            to: email,
            subject: "Redefinição de senha - Fusion Cloud", // User text says "Redefinição de senha" but it's for verification. Keeping user's text.
            text: `
Olá!

Seu código de verificação é:

🔐 ${code}

Esse código expira em 10 minutos.
Se você não solicitou isso, ignore este email.

— Fusion Cloud
            `,
            html: `
<div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Olá!</h2>
    <p>Seu código de verificação é:</p>
    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
        ${code}
    </div>
    <p>Esse código expira em 10 minutos.</p>
    <p>Se você não solicitou isso, ignore este email.</p>
    <br>
    <p>— <strong>Fusion Cloud</strong></p>
</div>
            `
        });

        console.log("Message sent: %s", info.messageId);
        res.json({ success: true, message: 'Email enviado com sucesso' });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: 'Erro ao enviar email', error: error.message });
    }
});

// --- PASSWORD RESET ENDPOINTS ---

const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

localRouter.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email é obrigatório' });
    }

    if (!supabaseAdmin) {
        console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
        return res.status(500).json({ success: false, message: 'Erro de configuração no servidor (Service Role Key ausente)' });
    }

    try {
        // Check if user exists in profiles
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (profileError || !profile) {
            // Don't reveal user existence? Or yes? User asked for verification code system.
            // Let's return generic success or specific error.
            // For now, if user not found, we can't send email.
            return res.status(404).json({ success: false, message: 'Email não encontrado' });
        }

        const code = Math.floor(10000 + Math.random() * 90000).toString();

        // Update profile with verification code
        // We reuse 'verification_code' column. 
        // Note: This overwrites any existing registration verification code, which is fine.
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ verification_code: code })
            .eq('id', profile.id);

        if (updateError) {
            throw updateError;
        }

        // Send Email
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            secure: false,
            auth: {
                user: "suporte@grupofusioncloud.site",
                pass: "FusionCloud2026@"
            }
        });

        await transporter.sendMail({
            from: '"Fusion Cloud" <suporte@grupofusioncloud.site>',
            to: email,
            subject: "Recuperação de Senha - Fusion Cloud",
            text: `Seu código de recuperação é: ${code}`,
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Recuperação de Senha</h2>
                <p>Use o código abaixo para redefinir sua senha:</p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
                    ${code}
                </div>
                <p>Esse código expira em 10 minutos.</p>
                <p>— <strong>Fusion Cloud</strong></p>
            </div>
            `
        });

        res.json({ success: true, message: 'Código enviado com sucesso' });

    } catch (error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({ success: false, message: 'Erro ao processar solicitação', error: error.message });
    }
});

localRouter.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ success: false, message: 'Dados incompletos' });
    }

    if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: 'Erro de configuração no servidor' });
    }

    try {
        // Verify code
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id, verification_code')
            .eq('email', email)
            .single();

        if (profileError || !profile) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado' });
        }

        if (profile.verification_code !== code) {
            return res.status(400).json({ success: false, message: 'Código inválido' });
        }

        // Update password in Supabase Auth
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            profile.id,
            { password: newPassword }
        );

        if (authError) {
            throw authError;
        }

        // Clear verification code
        await supabaseAdmin
            .from('profiles')
            .update({ verification_code: null })
            .eq('id', profile.id);

        res.json({ success: true, message: 'Senha alterada com sucesso' });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ success: false, message: 'Erro ao redefinir senha', error: error.message });
    }
});

// Mount local router on /api
app.use('/api', localRouter);

// Fallback / Legacy Proxy (uses default NEBULA_API_KEY_BASIC)
// Must be after localRouter to allow local routes to take precedence
app.use('/api', createProxyMiddleware({
    target: 'https://nebulagg.com/api',
    changeOrigin: true,
    secure: true,
    agent: proxyAgent,
    proxyTimeout: 30000,
    timeout: 30000,
    onProxyReq: (proxyReq, req, res) => {
        // Inject API Key from server environment if available
        const apiKey = process.env.NEBULA_API_KEY_BASIC;
        if (apiKey) {
            proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
        }

        // Fix body forwarding if it was parsed by express.json()
        if (req.body && Object.keys(req.body).length > 0) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).send('Proxy Error');
    }
}));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
