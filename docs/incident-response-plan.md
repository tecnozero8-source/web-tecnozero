# Plan de Respuesta a Incidentes de Seguridad
**Tecnozero SpA** · Versión 1.0 · Mayo 2026  
Responsable: Equipo Tecnozero · contacto@tecnozero.cl

---

## 1. Clasificación de Severidad

| Nivel | Descripción | Ejemplos | Tiempo de respuesta |
|---|---|---|---|
| **P1 — Crítico** | Datos de clientes expuestos, sistema caído en producción | Breach de Supabase, credenciales filtradas, sitio inaccesible | < 1 hora |
| **P2 — Alto** | Funcionalidad core degradada, acceso no autorizado detectado | Falla en autenticación, pago rechazado masivamente | < 4 horas |
| **P3 — Medio** | Anomalía sin impacto confirmado en clientes | Alerta de vulnerabilidad en dependencia, tráfico anómalo | < 24 horas |
| **P4 — Bajo** | Mejora de seguridad o hallazgo menor | Configuración subóptima, certificado próximo a vencer | < 7 días |

---

## 2. Contactos de Respuesta

| Rol | Responsable | Contacto |
|---|---|---|
| Incident Commander | Fundador / CEO Tecnozero | contacto@tecnozero.cl |
| Technical Lead | Equipo técnico | contacto@tecnozero.cl |
| Comunicaciones (clientes) | CEO | contacto@tecnozero.cl |

**Proveedores clave en caso de incidente:**
- **Vercel** (hosting): vercel.com/support
- **Supabase** (base de datos): supabase.com/support
- **Transbank** (pagos): soporte Transbank — si el incidente afecta pagos, notificar de inmediato
- **Cloudflare** (DNS/CDN): dash.cloudflare.com → Support

---

## 3. Proceso de Respuesta

### Fase 1 — Detección y Triage (primeros 30 min en P1)

1. **Confirmar el incidente**: ¿Es real o falso positivo?
2. **Clasificar severidad** (tabla anterior)
3. **Abrir canal de incidente**: crear hilo en email/WhatsApp con fecha y hora
4. **No borrar evidencia**: no reiniciar servidores ni borrar logs hasta documentar

### Fase 2 — Contención

**Acciones inmediatas según tipo de incidente:**

| Tipo | Acción inmediata |
|---|---|
| Credenciales comprometidas | Rotar NEXTAUTH_SECRET en Vercel → Redeploy inmediato |
| Brecha en Supabase | Revocar `SERVICE_ROLE_KEY` en Supabase → generar nueva → actualizar Vercel |
| Acceso no autorizado a cuenta | Revocar sesiones en NextAuth → cambiar contraseña → notificar usuario |
| Ataque DDoS | Activar modo "Under Attack" en Cloudflare dashboard |
| Vulnerabilidad en código | Deshabilitar endpoint afectado temporalmente via middleware → parchar → redesplegar |
| Datos de pago | Notificar a Transbank y a los clientes afectados dentro de 24h |

### Fase 3 — Erradicación

1. Identificar causa raíz
2. Parchar código o configuración
3. Rotar todos los secretos y API keys potencialmente expuestos
4. Verificar que no quedan puertas traseras (revisar git log, accesos recientes)

### Fase 4 — Recuperación

1. Restaurar operación normal (redeploy limpio desde commit verificado)
2. Monitorear durante 24h post-recuperación
3. Confirmar con cliente afectado que el servicio está normalizado

### Fase 5 — Post-Mortem (dentro de 72h para P1/P2)

Documentar en `docs/postmortems/YYYY-MM-DD-descripcion.md`:
- Línea de tiempo del incidente
- Causa raíz
- Impacto (usuarios afectados, tiempo de caída, datos expuestos)
- Acciones tomadas
- Cambios implementados para prevenir recurrencia

---

## 4. Obligaciones Legales (Ley 19.628 Chile)

Si el incidente involucra datos personales de titulares:

- **Notificar a titulares afectados**: dentro de **72 horas** de confirmado el breach
- **Canal de notificación**: email a los afectados desde contacto@tecnozero.cl
- **Contenido mínimo de la notificación**: qué datos fueron expuestos, cuándo ocurrió, qué medidas se tomaron, cómo ejercer derechos ARCO
- **Conservar registro**: guardar evidencia del incidente y de las notificaciones por 5 años

---

## 5. Rotación de Secretos — Referencia Rápida

| Secreto | Ubicación | Cómo rotar |
|---|---|---|
| `NEXTAUTH_SECRET` | Vercel Env Vars | Generar nuevo con `openssl rand -base64 64` → actualizar en Vercel → Redeploy |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel Env Vars | Supabase Dashboard → Settings → API → Rotate |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel Env Vars | Supabase Dashboard → Settings → API → Rotate |
| `ANTHROPIC_API_KEY` | Vercel Env Vars | console.anthropic.com → API Keys → Create new → eliminar comprometida |
| `RESEND_API_KEY` | Vercel Env Vars | resend.com → API Keys → Create new |
| `TBK_API_KEY` | Vercel Env Vars | Contactar Transbank para rotación |
| PAT GitHub (`ghp_...`) | Uso puntual | github.com → Settings → Developer Settings → Revoke → Create new |

---

## 6. Checklist de Incidente P1

```
[ ] Incidente confirmado y clasificado P1
[ ] Canal de incidente abierto (hora de inicio registrada)
[ ] Evidencia preservada (screenshots, logs)
[ ] Contención aplicada (secretos rotados / endpoint deshabilitado)
[ ] Causa raíz identificada
[ ] Parche implementado y deploiado
[ ] Clientes afectados notificados (si aplica Ley 19.628)
[ ] Servicio restaurado y verificado
[ ] Post-mortem programado (< 72h)
[ ] Controles adicionales implementados
```

---

*Revisar y actualizar este plan cada 6 meses o después de cada incidente P1/P2.*
