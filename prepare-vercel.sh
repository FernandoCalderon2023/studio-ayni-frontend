#!/bin/bash

# 🚀 Script de Preparación Automática - VERCEL DEPLOYMENT

echo "╔════════════════════════════════════════╗"
echo "║  🚀 PREPARACIÓN PARA VERCEL           ║"
echo "╚════════════════════════════════════════╝"
echo ""

# ============================================
# PARTE 1: FRONTEND
# ============================================

echo "📦 PASO 1: PREPARANDO FRONTEND..."
echo "===================================="
cd ~/tienda-3d || exit 1

# 1.1 - Actualizar main.jsx
echo "1️⃣  Actualizando main.jsx..."
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Admin from './Admin.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
EOF
echo "✅ main.jsx actualizado"

# 1.2 - Actualizar vite.config.js
echo ""
echo "2️⃣  Actualizando vite.config.js..."
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
EOF
echo "✅ vite.config.js actualizado"

# 1.3 - Crear vercel.json
echo ""
echo "3️⃣  Creando vercel.json..."
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF
echo "✅ vercel.json creado"

# 1.4 - Actualizar App.jsx
echo ""
echo "4️⃣  Actualizando App.jsx..."
sed -i "s|const API_URL = 'https://studio-ayni-backend.onrender.com/api'|const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'|g" src/App.jsx
echo "✅ App.jsx actualizado"

# 1.5 - Actualizar Admin.jsx
echo ""
echo "5️⃣  Actualizando Admin.jsx..."
sed -i "s|const API_URL = 'https://studio-ayni-backend.onrender.com/api'|const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'|g" src/Admin.jsx
echo "✅ Admin.jsx actualizado"

# 1.6 - Push frontend
echo ""
echo "6️⃣  Subiendo frontend a GitHub..."
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push
echo "✅ Frontend subido a GitHub"

# ============================================
# PARTE 2: BACKEND
# ============================================

echo ""
echo "📦 PASO 2: PREPARANDO BACKEND..."
echo "===================================="
cd ~/studio-ayni-backend || exit 1

# 2.1 - Crear vercel.json para backend
echo "1️⃣  Creando vercel.json..."
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/uploads/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
EOF
echo "✅ vercel.json creado"

# 2.2 - Actualizar server.js
echo ""
echo "⚠️  IMPORTANTE: Debes actualizar server.js manualmente"
echo ""
echo "Al final del archivo (línea ~240), REEMPLAZA:"
echo ""
echo "  app.listen(PORT, () => {..."
echo ""
echo "CON:"
echo ""
echo "  // Para Vercel serverless"
echo "  if (process.env.VERCEL) {"
echo "    module.exports = app;"
echo "  } else {"
echo "    app.listen(PORT, () => {"
echo "      console.log(...);"
echo "    });"
echo "  }"
echo ""
echo "⚠️  Edita manualmente: nano ~/studio-ayni-backend/server.js"
read -p "Presiona Enter cuando hayas actualizado server.js..."

# ============================================
# PARTE 3: BACKEND
# ============================================

echo ""
echo "🌐 PASO 2: PREPARANDO BACKEND..."
echo "===================================="
cd ~/studio-ayni-backend || exit 1

# 2.1 - Crear vercel.json para backend
echo "1️⃣  Creando vercel.json..."
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/uploads/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
EOF
echo "✅ vercel.json creado"

# 2.2 - Push backend
echo ""
echo "7️⃣  Subiendo backend a GitHub..."
git add .
git commit -m "Prepare backend for Vercel deployment"
git push
echo "✅ Backend subido a GitHub"

# ============================================
# RESUMEN
# ============================================

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✅ PREPARACIÓN COMPLETA              ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📦 Archivos actualizados:"
echo "  FRONTEND:"
echo "    - src/main.jsx (BrowserRouter)"
echo "    - vite.config.js (base: '/')"
echo "    - vercel.json"
echo "    - src/App.jsx (VITE_API_URL)"
echo "    - src/Admin.jsx (VITE_API_URL)"
echo ""
echo "  BACKEND:"
echo "    - Necesitas actualizar manualmente server.js"
echo "    - Crear vercel.json"
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✅ FRONTEND LISTO PARA VERCEL        ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🌐 PRÓXIMOS PASOS:"
echo ""
echo "1️⃣  BACKEND:"
echo "   cd ~/studio-ayni-backend"
echo "   Crear vercel.json (ver guía)"
echo "   Actualizar server.js (ver guía)"
echo "   git push"
echo ""
echo "2️⃣  VERCEL:"
echo "   - Ve a vercel.com"
echo "   - Import studio-ayni-backend"
echo "   - Agregar variables de entorno"
echo "   - Import studio-ayni-frontend"
echo "   - Agregar VITE_API_URL"
echo "   - Deploy!"
echo ""
echo "═══════════════════════════════════════════"
echo "Lee la guía completa: VERCEL-COMPLETE-GUIDE.md"
echo ""