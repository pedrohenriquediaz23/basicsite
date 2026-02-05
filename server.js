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

// Load env vars
dotenv.config();

console.log('--- Server Startup Config ---');
console.log('BASIC Key Present:', !!(process.env.NEBULA_API_KEY_BASIC || process.env.VITE_NEBULA_API_KEY));
console.log('ULTRA Key Present:', !!process.env.NEBULA_API_KEY_ULTRA);
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

// Mount local router on /api
app.use('/api', localRouter);

// --- Proxy Configuration for Nebula API ---
// Proxy for BASIC plan
app.use('/api/basic', createProxyMiddleware({
    target: 'https://nebula-api.guiisousa.com',
    changeOrigin: true,
    pathRewrite: { '^/api/basic': '' },
    onProxyReq: (proxyReq, req, res) => {
        const apiKey = process.env.NEBULA_API_KEY_BASIC || process.env.VITE_NEBULA_API_KEY;
        if (apiKey) {
            proxyReq.setHeader('Authorization', apiKey);
        }
        proxyReq.agent = agent;
    },
    onError: (err, req, res) => {
        console.error('Proxy Error (Basic):', err.message);
        res.status(502).json({ error: 'Bad Gateway', details: err.message });
    }
}));

// Proxy for ULTRA plan
app.use('/api/ultra', createProxyMiddleware({
    target: 'https://nebula-api.guiisousa.com',
    changeOrigin: true,
    pathRewrite: { '^/api/ultra': '' },
    onProxyReq: (proxyReq, req, res) => {
        const apiKey = process.env.NEBULA_API_KEY_ULTRA;
        if (apiKey) {
            proxyReq.setHeader('Authorization', apiKey);
        }
        proxyReq.agent = agent;
    },
    onError: (err, req, res) => {
        console.error('Proxy Error (Ultra):', err.message);
        res.status(502).json({ error: 'Bad Gateway', details: err.message });
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
