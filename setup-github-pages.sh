#!/bin/bash

# 🚀 Setup rápido para GitHub Pages - Studio AYNI

echo "╔════════════════════════════════════════╗"
echo "║  🚀 GITHUB PAGES - STUDIO AYNI        ║"
echo "╚════════════════════════════════════════╝"
echo ""

cd ~/tienda-3d || exit 1

# Obtener nombre de usuario de GitHub
read -p "¿Cuál es tu usuario de GitHub? " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Error: Debes ingresar tu usuario de GitHub"
    exit 1
fi

echo ""
echo "📝 Configurando proyecto para: $GITHUB_USER"
echo ""

# PASO 1: Actualizar vite.config.js
echo "1️⃣  Creando vite.config.js..."
cat > vite.config.js << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/studio-ayni-frontend/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
EOF
echo "✅ vite.config.js creado"

# PASO 2: Crear .nojekyll
echo ""
echo "2️⃣  Creando .nojekyll..."
mkdir -p public
touch public/.nojekyll
echo "✅ .nojekyll creado"

# PASO 3: Crear GitHub Actions workflow
echo ""
echo "3️⃣  Creando GitHub Actions workflow..."
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF
echo "✅ GitHub Actions workflow creado"

# PASO 4: Actualizar App.jsx
echo ""
echo "4️⃣  Actualizando App.jsx..."
sed -i "s|const API_URL = 'http://localhost:3001/api'|const API_URL = 'https://studio-ayni-backend.onrender.com/api'|g" src/App.jsx
echo "✅ App.jsx actualizado"

# PASO 5: Actualizar Admin.jsx
echo ""
echo "5️⃣  Actualizando Admin.jsx..."
sed -i "s|const API_URL = 'http://localhost:3001/api'|const API_URL = 'https://studio-ayni-backend.onrender.com/api'|g" src/Admin.jsx
echo "✅ Admin.jsx actualizado"

# PASO 6: Resumen
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✅ CONFIGURACIÓN COMPLETA            ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📦 Archivos creados:"
echo "  - vite.config.js"
echo "  - public/.nojekyll"
echo "  - .github/workflows/deploy.yml"
echo ""
echo "✏️  Archivos actualizados:"
echo "  - src/App.jsx"
echo "  - src/Admin.jsx"
echo ""
echo "🚀 PRÓXIMOS PASOS:"
echo ""
echo "1. Inicializar git:"
echo "   git init"
echo ""
echo "2. Agregar archivos:"
echo "   git add ."
echo ""
echo "3. Hacer commit:"
echo "   git commit -m 'Initial commit - Studio AYNI'"
echo ""
echo "4. Conectar con GitHub:"
echo "   git remote add origin https://github.com/$GITHUB_USER/studio-ayni-frontend.git"
echo ""
echo "5. Subir código:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "6. En GitHub:"
echo "   - Ve a Settings → Pages"
echo "   - Source: GitHub Actions"
echo ""
echo "7. Tu tienda estará en:"
echo "   https://$GITHUB_USER.github.io/studio-ayni-frontend/"
echo ""
echo "═══════════════════════════════════════════"
echo ""
