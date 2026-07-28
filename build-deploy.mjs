import fs from 'fs';
import path from 'path';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function run() {
  const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
  const projectDir = path.join(standaloneDir, 'lumio-landing');
  const deployDir = path.join(process.cwd(), 'deploy');

  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  fs.mkdirSync(deployDir);

  console.log('Copying server.js and .next...');
  copyRecursiveSync(path.join(projectDir, 'server.js'), path.join(deployDir, 'server.js'));
  copyRecursiveSync(path.join(projectDir, '.next'), path.join(deployDir, '.next'));

  console.log('Copying node_modules...');
  copyRecursiveSync(path.join(standaloneDir, 'node_modules'), path.join(deployDir, 'node_modules'));

  console.log('Copying public...');
  if (fs.existsSync(path.join(process.cwd(), 'public'))) {
    copyRecursiveSync(path.join(process.cwd(), 'public'), path.join(deployDir, 'public'));
  }

  console.log('Copying static files...');
  copyRecursiveSync(path.join(process.cwd(), '.next', 'static'), path.join(deployDir, '.next', 'static'));

  console.log('Copying .env.local...');
  if (fs.existsSync(path.join(process.cwd(), '.env.local'))) {
    copyRecursiveSync(path.join(process.cwd(), '.env.local'), path.join(deployDir, '.env.local'));
  }

  console.log('Done! Now zip the CONTENTS of the "deploy" folder and upload to cPanel.');
}

run();
