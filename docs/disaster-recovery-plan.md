# Plan de Recuperación ante Desastres (DR Plan)
**Tecnozero SpA** · Versión 1.0 · Mayo 2026  
RUT: 77.043.128-K · contacto@tecnozero.cl

---

## 1. Objetivos

| Métrica | Objetivo | Descripción |
|---|---|---|
| **RTO** (Recovery Time Objective) | < 4 horas | Tiempo máximo que el sistema puede estar inactivo |
| **RPO** (Recovery Point Objective) | < 24 horas | Pérdida máxima de datos aceptable |
| **MTTR** (Mean Time To Recover) | < 3 horas | Tiempo promedio de restauración |

---

## 2. Arquitectura de Backup — 3 Capas

### Capa 1 — Base de Datos (Supabase PITR)
- **Qué cubre**: Todos los datos en PostgreSQL (usuarios, empresas, pagos, contactos)
- **Frecuencia**: Backups diarios automáticos
- **Retención**: 7 días (plan Free) · 30 días (plan Pro)
- **RPO real**: ≤ 24 horas
- **Cómo restaurar**: Supabase Dashboard → Settings → Backups → Restore

### Capa 2 — Código y Configuración (Vercel + GitHub)
- **Qué cubre**: Todo el código de la aplicación Next.js
- **Frecuencia**: En cada deploy (automático)
- **Retención**: Historial completo en GitHub; últimos deployments en Vercel
- **RPO real**: ≤ tiempo desde el último commit
- **Cómo restaurar**: `vercel rollback [deployment-url]` o GitHub → revert commit

### Capa 3 — Backup Manual del Cliente
- **Qué cubre**: Datos individuales exportados por el cliente desde el dashboard
- **Frecuencia**: A demanda (recomendado: mensual)
- **Formato**: JSON descargable desde `/dashboard/backup`
- **API endpoint**: `GET /api/backup/export` (requiere autenticación)

---

## 3. Escenarios y Procedimientos de Recuperación

### Escenario A — Corrupción o pérdida de datos en Supabase

**Pasos:**
1. Confirmar el incidente — verificar en Supabase Dashboard → Table Editor
2. Abrir canal de incidente (ver `incident-response-plan.md`)
3. Supabase Dashboard → Settings → Backups
4. Seleccionar punto de restauración (timestamp anterior al incidente)
5. Ejecutar restauración → Supabase crea nueva instancia temporal
6. Verificar integridad de datos restaurados
7. Si todo correcto, apuntar la aplicación a la nueva instancia (actualizar `NEXT_PUBLIC_SUPABASE_URL` en Vercel)
8. Notificar a usuarios afectados según Ley 19.628 (ver `incident-response-plan.md`)

**Tiempo estimado**: 1–3 horas

---

### Escenario B — Bug crítico en producción (aplicación rota)

**Pasos:**
1. Identificar el deployment problemático en Vercel Dashboard → Deployments
2. Vercel Dashboard → Deployments → seleccionar deployment anterior estable → "..." → **Promote to Production**
3. O via CLI: `vercel rollback` (requiere Vercel CLI instalado)
4. Verificar que la app responde correctamente
5. Crear issue en GitHub con la descripción del bug

**Tiempo estimado**: 2–10 minutos

---

### Escenario C — Credenciales comprometidas

Ver `incident-response-plan.md` → Sección 3 Fase 2 — Contención → "Tabla de acciones inmediatas"

Resumen rápido:
1. Rotar `NEXTAUTH_SECRET` en Vercel → Redeploy (invalida TODAS las sesiones activas)
2. Rotar `SUPABASE_SERVICE_ROLE_KEY` en Supabase Dashboard
3. Rotar `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `TBK_API_KEY` según aplique
4. Revisar logs de acceso en Supabase → Auth → Logs

**Tiempo estimado**: 30–60 minutos

---

### Escenario D — Caída total de Vercel (hosting)

**Pasos:**
1. Verificar estado en https://vercel-status.com
2. Si es outage global de Vercel → esperar (SLA Vercel 99.99% uptime)
3. Si es solo el proyecto → revisar logs en Vercel → Runtime Logs
4. Como contingencia extrema: deploy en Netlify o Railway desde el mismo repo GitHub

**Tiempo estimado**: Depende del outage (típicamente < 1 hora para Vercel)

---

### Escenario E — Pérdida de acceso a GitHub

1. Verificar cuenta en github.com/login
2. Usar 2FA recovery codes (guardar en lugar seguro físico)
3. Si perdiste acceso total → GitHub Support: support.github.com

---

## 4. Verificación Mensual

Cada mes (último viernes hábil) verificar:

```
[ ] Supabase Dashboard → Settings → Backups → confirmar último backup exitoso
[ ] Vercel → revisar al menos 1 deployment histórico funciona
[ ] GitHub → verificar que el repo tiene el último commit de producción
[ ] Descargar backup manual desde /dashboard/backup y guardar copia local
[ ] Verificar que todas las variables de entorno en Vercel están configuradas
[ ] Probar login en la aplicación con credenciales reales
```

---

## 5. Contactos de Recuperación

| Proveedor | Recurso | URL |
|---|---|---|
| Supabase | Backup & Restore | dashboard.supabase.com → Settings → Backups |
| Vercel | Deployments & Rollback | vercel.com/tecnozero8-source/web-tecnozero/deployments |
| GitHub | Repositorio | github.com/tecnozero8-source/web-tecnozero |
| Transbank | Soporte pagos | transbank.cl/soporte |
| Cloudflare | DNS failover | dash.cloudflare.com |

---

## 6. Limitaciones Conocidas

| Limitación | Impacto | Mitigación |
|---|---|---|
| Rate limiting in-memory (por Edge worker) | Se pierde al reiniciar instancias | Aceptable; migrar a Redis si el volumen aumenta |
| Backup manual no automatizado vía cron | Depende de acción del usuario | Recomendación mensual en dashboard; futuro: cron automático |
| PITR Supabase Free = solo 7 días | RPO máximo 7 días para recuperación puntual | Actualizar a Supabase Pro si se requiere mayor retención |
| Sesiones NextAuth JWT (stateless) | No se pueden invalidar sin rotar NEXTAUTH_SECRET | Aceptable para el nivel de riesgo actual |

---

## 7. Mejoras Futuras (Backlog)

- [ ] **Backup automático programado**: cron semanal que genera un backup JSON y lo guarda en Supabase Storage
- [ ] **Notificación de backup**: email al cliente cuando se genera el backup automático
- [ ] **Upgrade Supabase Pro**: aumentar retención PITR de 7 a 30 días
- [ ] **Multi-region**: activar réplica de lectura en Supabase para disponibilidad geográfica
- [ ] **Health check endpoint**: `/api/health` que verifica DB + servicios críticos

---

*Revisar este plan cada 6 meses o después de un incidente P1/P2.  
Coordinado con `docs/incident-response-plan.md`.*
