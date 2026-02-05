import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createTestUser() {
    const email = 'teste2@fusion.com';
    const password = 'password123';
    const name = 'Usuario Teste 2';
    const phone = '11999999999';
    const cpf = '000.000.000-00';

    console.log(`Creating user: ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                phone,
                cpf,
                password,
                isAdmin: false
            }
        }
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('User created successfully via Auth!');
        
        // Manual insert into profiles to guarantee it appears
        if (data.user) {
            console.log('Inserting into profiles table...');
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email,
                username: name,
                phone: phone,
                cpf: cpf,
                is_admin: false,
                password: password
            });

            if (profileError) {
                console.error('Error inserting into profiles:', profileError.message);
            } else {
                console.log('Profile created successfully!');
            }
        }

        console.log('User ID:', data.user?.id);
    }
}

createTestUser();
