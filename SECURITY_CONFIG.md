# 🔒 Security Configuration Guide

## Credenciales Expuestas - SOLUCIONADO

### Problema Inicial:
- PayPal Client IDs fueron hardcodeados en archivos públicos (index.html, buyChips.jsx)
- MercadoPagoWallet.jsx era un archivo innecesario

## Solución Implementada

### Arquitectura Correcta:

**Frontend ↔ Backend ↔ Pasarelas de Pago**

```
Frontend (Public)          Backend (Secret)         Pasarelas
├─ PayPal Client ID ✓      ├─ PayPal Secret ✓      (PayPal API)
└─ API Endpoint            ├─ Mercado Pago Secret✓  (Mercado Pago API)
   ↓                       └─ Stripe Secret, etc.
   POST /mepago/create-order
   POST /paypal/create-order
```

### Qué va en el Frontend:
- ✅ **PayPal Client ID** (credencial pública del SDK)
- ✅ **API URL** del backend

### Qué NUNCA va en el Frontend:
- ❌ Mercado Pago Access Token
- ❌ PayPal App Secret
- ❌ Stripe Secret Key
- ❌ Cualquier credencial secreta

## Flujo Seguro de Pago (Mercado Pago):

1. **Frontend**: `POST /mepago/create-order` con datos del pedido
2. **Backend**: Autentica con su Access Token secreto
3. **Backend**: Crea preferencia y retorna `initPoint`
4. **Frontend**: Redirige a `initPoint` (URL de Mercado Pago)

## Pasos para Configurar

1. **Copiar archivo de ejemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Editar `.env.local` (solo credenciales públicas):**
   ```env
   VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui
   VITE_API_URL=http://localhost:3001
   ```

3. **En el backend (.env del backend):**
   ```env
   PAYPAL_APP_SECRET=xxx
   MERCADO_PAGO_ACCESS_TOKEN=xxx
   STRIPE_SECRET_KEY=xxx
   ```

### ⚠️ IMPORTANTE:
- **NUNCA** commitear `.env.local` al repositorio
- El archivo `.gitignore` ya protege los archivos `.env` y `*.local`
- GitHub debería revocar automaticamente las credenciales una vez que actualices

## Verificar Seguridad:

```bash
# No debería devolver nada (o solo en .env.local/gitignored)
grep -r "ATOxyywT2Acm4QnOO7C8KAy" .
grep -r "Ae36OchhdN8RQxByUJu4LH2G8wKlT0Ps3Id2Eky" .
```

## Para Producción (Vercel, Netlify, etc.):

**Solo expongas variables públicas en variables de entorno del frontend:**
- `VITE_PAYPAL_CLIENT_ID`: Client ID válido para producción
- `VITE_API_URL`: URL del backend en producción

**Las credenciales secretas van en el backend hosting (Heroku, Render, etc.)**

