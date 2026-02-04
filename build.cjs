const { execSync } = require('child_process');

console.log('Iniciando build via script Node...');

try {
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname, shell: true });
  console.log('Build concluído com sucesso!');
} catch (error) {
  console.error('Erro no build:', error.message);
  process.exit(1);
}
