
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.VITE_ADMIN_EMAIL;
console.log('Admin Email:', adminEmail); // Debugging
const adminPassword = process.env.VITE_ADMIN_PASSWORD || '12345678@'; // Default password if not in env

if (!supabaseUrl || !supabaseServiceKey || !adminEmail) {
  console.error('Missing environment variables: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or VITE_ADMIN_EMAIL');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createOrUpdateAdmin() {
  console.log(`Tentando criar/atualizar admin: ${adminEmail}`);

  try {
    // 1. Check if user exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;

    const existingUser = users.find(u => u.email === adminEmail);

    if (existingUser) {
      console.log('Usuário já existe. Atualizando senha e metadados...');
      
      const { data, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: adminPassword,
          user_metadata: { isAdmin: true, name: 'Admin User' },
          email_confirm: true
        }
      );

      if (updateError) throw updateError;
      console.log('Usuário atualizado com sucesso!');
      
      // Update profiles table as well
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: existingUser.id,
            email: adminEmail,
            is_admin: true,
            is_verified: true,
            username: 'Admin',
            password: adminPassword // Only storing because requested, usually not recommended
        });
        
      if (profileError) console.error('Erro ao atualizar tabela profiles:', profileError);
      else console.log('Tabela profiles atualizada.');

    } else {
      console.log('Usuário não existe. Criando novo usuário admin...');
      
      const { data, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { isAdmin: true, name: 'Admin User' }
      });

      if (createError) throw createError;
      console.log('Usuário criado com sucesso!');
      
      // Insert into profiles table
      if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user.id,
                email: adminEmail,
                is_admin: true,
                is_verified: true,
                username: 'Admin',
                password: adminPassword
            });
            
          if (profileError) console.error('Erro ao criar entrada em profiles:', profileError);
          else console.log('Tabela profiles atualizada.');
      }
    }

  } catch (error) {
    console.error('Erro ao processar admin:', error);
    if (error.cause) console.error('Causa:', error.cause);
  }
}

createOrUpdateAdmin();
