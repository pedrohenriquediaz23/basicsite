import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        return res.status(400).json({ error: 'Token inválido ou não encontrado.' });
    }
    
    const tokenData = tokens[tokenIndex];
    if (tokenData.used >= tokenData.maxUses) {
        return res.status(400).json({ error: 'Token expirado ou limite de uso atingido.' });
    }
    
    // Calculate expiration date
    let expiresAt = null;
    if (tokenData.duration === '7days') {
        expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    } else if (tokenData.duration === '30days') {
        expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
    }
    
    // Update token usage
    tokenData.used += 1;
    tokens[tokenIndex] = tokenData;
    writeJson(TOKENS_FILE, tokens);
    
    // Update ownership
    const ownerships = readJson(OWNERSHIP_FILE);
    ownerships[tokenData.diskId] = { 
        ownerId: user.id, 
        ownerEmail: user.email,
        expiresAt: expiresAt
    };
    writeJson(OWNERSHIP_FILE, ownerships);
    
    res.json({ success: true, message: 'Token resgatado com sucesso!' });
});

localRouter.get('/tokens', (req, res) => {
    const tokens = readJson(TOKENS_FILE);
    res.json(tokens);
});

localRouter.delete('/tokens/:token', (req, res) => {
    const { token } = req.params;
    const cleanToken = (token || '').trim().toUpperCase();
    let tokens = readJson(TOKENS_FILE);
    
    const initialLength = tokens.length;
    const tokenToDelete = tokens.find(t => t.token === cleanToken);
    
    if (!tokenToDelete) {
        return res.status(404).json({ error: 'Token não encontrado.' });
    }

    // Remove token from list
    tokens = tokens.filter(t => t.token !== cleanToken);
    writeJson(TOKENS_FILE, tokens);
    
    // Also remove ownership if token was associated with a disk
    if (tokenToDelete.diskId) {
        const ownerships = readJson(OWNERSHIP_FILE);
        if (ownerships[tokenToDelete.diskId]) {
            delete ownerships[tokenToDelete.diskId];
            writeJson(OWNERSHIP_FILE, ownerships);
        }
    }
    
    res.json({ success: true, message: 'Token removido e acesso revogado com sucesso.' });
});

localRouter.get('/ownerships', (req, res) => {
    const ownerships = readJson(OWNERSHIP_FILE);
    
    // Filter out expired ownerships
    const now = Date.now();
    const activeOwnerships = {};
    let hasExpired = false;
    
    Object.keys(ownerships).forEach(diskId => {
        const data = ownerships[diskId];
        if (!data.expiresAt || data.expiresAt > now) {
            activeOwnerships[diskId] = data;
        } else {
            hasExpired = true;
        }
    });
    
    // If expired entries were found, update the file
    if (hasExpired) {
        writeJson(OWNERSHIP_FILE, activeOwnerships);
    }
    
    res.json(activeOwnerships);
});

// Mount local router
app.use('/api/local', localRouter);

// --- Chat Router ---
const chatRouter = express.Router();
chatRouter.use(express.json());

// Azure Config
const AZURE_ENDPOINT = "https://genes-mk0a3qgc-eastus2.cognitiveservices.azure.com/";
const AZURE_API_VERSION = "2024-12-01-preview";
const AZURE_DEPLOYMENT = "gpt-5-chat";
const AZURE_API_KEY = "CS2q0moSmGDkKstSsB12hGZ7x3fen2HdR7adz3YFeuwqSwN0SLOXJQQJ99CAACHYHv6XJ3w3AAAAACOGk2Pe";

// Client IA
const client = new OpenAI({
  apiKey: AZURE_API_KEY,
  baseURL: `${AZURE_ENDPOINT}openai/deployments/${AZURE_DEPLOYMENT}`,
  defaultQuery: { "api-version": AZURE_API_VERSION },
  defaultHeaders: {
    "api-key": AZURE_API_KEY
  }
});

// Memory
const memory = {}; // session_id -> messages

// Prompt
const SYSTEM_PROMPT = ` 
Você é a Fusion IA, assistente oficial da Fusion Cloud Games. 
 
REGRAS IMPORTANTES: 
- Nunca mencione OpenAI, GPT, Azure ou qualquer tecnologia externa. 
- Se perguntarem quem te criou, responda apenas: Fusion Cloud Games. 
- Linguagem clara, amigável e profissional. 
- Especialista em cloud gaming, máquinas virtuais e jogos. 
 
INFORMAÇÕES OFICIAIS DA FUSION CLOUD GAMES: 
 
PLANOS POR HORA (COM FILA): 
⚠️ Planos por hora entram em fila e não possuem previsão exata. 
• 1 hora – R$ 4,90 
• 2 horas – R$ 7,50 
• 4 horas – R$ 15,90 
• 6 horas – R$ 23,90 
 
PLANOS COM ENTREGA RÁPIDA: 
• Semanal – R$ 49,90 
• Quinzenal – R$ 62,90 
 
MENSAL SPOT – R$ 99,90 
⚠️ Pode sofrer desligamentos aleatórios devido à disponibilidade Spot. 
 
MENSAL SEM DESLIGAMENTO – R$ 169,90 
✔️ Máquina Non-Preemptible 
✔️ Sem quedas 
✔️ Prioridade total 
 
INFORMAÇÕES IMPORTANTES: 
- Planos semanais, quinzenais e mensais são entregues rapidamente. 
- Planos por hora podem ter espera. 
- Ideal para rodar jogos via Moonlight, Parsec e apps de cloud gaming. 
 
Sempre ajude o usuário a escolher o melhor plano 
de acordo com o tempo de uso e necessidade. 
`;

chatRouter.post('/', async (req, res) => {
  const { message, session_id } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensagem vazia" });
  }

  const sessionId = session_id || uuidv4();

  if (!memory[sessionId]) {
    memory[sessionId] = [];
  }

  memory[sessionId].push({
    role: "user",
    content: message
  });

  // Keep only last 10 messages
  memory[sessionId] = memory[sessionId].slice(-10);

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...memory[sessionId]
      ],
      temperature: 0.6,
      max_tokens: 700
    });

    const reply = response.choices[0].message.content;

    memory[sessionId].push({
      role: "assistant",
      content: reply
    });

    res.json({
      reply,
      session_id: sessionId
    });

  } catch (err) {
    console.error('Chat Error:', err);
    res.json({
      reply: "⚠️ A Fusion IA está temporariamente indisponível.",
      session_id: sessionId
    });
  }
});

// Mount Chat Router
app.use('/api/chat', chatRouter);

// --- Proxy Configuration ---
// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// --- Local Admin Override ---
// Intercept login requests to check for local admin credentials from env vars
app.post('/api/auth/login', express.json(), (req, res, next) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPass && email === adminEmail && password === adminPass) {
        console.log(`[Auth] Admin login via env vars: ${email}`);
        return res.json({
            ok: true,
            user: {
                id: 'admin-local',
                email: email,
                role: 'admin',
                name: 'Administrator'
            },
            vault: null
        });
    }
    next();
});

// Proxy API requests to NebulaGG
// IMPORTANT: No global express.json() before this!
app.use('/api', createProxyMiddleware({
    target: 'https://nebulagg.com/api',
    changeOrigin: true,
    secure: true,
    onProxyReq: (proxyReq, req, res) => {
        // Inject API Key from server environment if available
        const apiKey = process.env.VITE_NEBULA_API_KEY || process.env.NEBULA_API_KEY;
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

// Catch-all for unhandled API requests to prevent returning HTML
app.use('/api', (req, res) => {
    console.warn(`[API 404] Unhandled request: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Endpoint not found or not implemented locally' });
});

// Handle SPA routing - return index.html for all non-API requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
