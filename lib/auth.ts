import { NextAuthOptions } from "next-auth"
import { esAdmin as estaEnLaListaDeAdmins } from "@/lib/admin"
import CredentialsProvider from "next-auth/providers/credentials"

// ─── Tipos de autorización RLE ────────────────────────────────────────────────
export type AuthStatus = "verified" | "pending" | "rejected"

export interface AuthData {
  status: AuthStatus
  token: string
  timestamp: string
  hash: string
  signedAt?: string
  registeredAt?: string
  verifiedAt?: string
  company?: {
    rutEmpresa: string
    razonSocial: string
    rutApoderado: string
    nombreApoderado: string
    cargoApoderado: string
  }
}

/**
 * Tabla de precios Tecnozero — precio por registro DT.
 *
 * Esta tabla es la única fuente. La página pública, los Términos de Servicio,
 * el checkout y `llms.txt` tienen que decir exactamente estos tramos: hasta el
 * 10 de septiembre de 2026 los Términos publicaban la tabla corrida un tramo
 * (prometían $500 donde el checkout cobraba $570) y el documento que manda
 * legalmente es el contrato, no la página.
 *
 * El precio que se cobra es el CLP: Transbank cobra pesos y el checkout calcula
 * en pesos. La UF es una equivalencia de referencia y se recalcula cuando se
 * mueve, porque una UF fija envejece sola. Ver UF_REFERENCIA.
 *
 * Mínimo: 50 registros por carga. Todos los montos son IVA incluido.
 */
export const PRICING_TIERS = [
  { minDocs: 50,   maxDocs: 150,  priceCLP: 640,  priceUF: 0.0157 },
  { minDocs: 151,  maxDocs: 400,  priceCLP: 570,  priceUF: 0.0139 },
  { minDocs: 401,  maxDocs: 800,  priceCLP: 500,  priceUF: 0.0122 },
  { minDocs: 801,  maxDocs: 2000, priceCLP: 430,  priceUF: 0.0105 },
  { minDocs: 2001, maxDocs: 5000, priceCLP: 360,  priceUF: 0.0088 },
  { minDocs: 5001, maxDocs: null, priceCLP: 290,  priceUF: 0.0071 },
]

/** UF con la que se calculó la columna priceUF. La columna anterior venía de
 *  una UF de ~$39.500 (fines de 2024) y publicaba $662 donde la tabla en pesos
 *  decía $640: dos precios distintos para lo mismo, con 3,5% de diferencia.
 *  Cuando se actualice la UF hay que recalcular priceUF y mover esta fecha. */
export const UF_REFERENCIA = { valor: 40893.78, fecha: "10-09-2026" }

/** Mínimo de registros por carga. El checkout no deja bajar de aquí. */
export const MIN_DOCS_POR_CARGA = 50

/** Tope por carga. El deslizador del checkout llega a 6.000; el servidor
 *  rechaza cualquier cosa por encima antes de crear la transacción. */
export const MAX_DOCS_POR_CARGA = 6000

/** Servicios adicionales. Viven aquí y no en el checkout porque el servidor
 *  tiene que poder recalcular el total sin creerle al navegador. */
export const PRECIOS_ADDON: Record<string, number> = {
  api: 29900,
  soporte: 14900,
  storage: 7900,
}

/** Lo que cuesta el mismo registro digitado a mano, según la referencia que usa
 *  toda la página: 9,45 minutos por registro a $4.800 la hora de un
 *  administrativo. De aquí sale la columna «ahorro vs manual». */
export const BASELINE_MANUAL_CLP = 756

export function getPriceTier(docs: number) {
  return PRICING_TIERS.find(t => t.minDocs <= docs && (t.maxDocs === null || t.maxDocs >= docs))
    ?? PRICING_TIERS[PRICING_TIERS.length - 1]
}

declare module "next-auth" {
  interface User {
    empresa?: string
    plan?: string
    rut?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      empresa: string
      plan: string
      rut: string
      /** Su correo está en ADMIN_EMAILS. Lo decide el servidor en cada lectura
       *  de la sesión, así que quitar a alguien de la lista lo deja fuera sin
       *  que tenga que cerrar sesión. */
      esAdmin: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    empresa: string
    plan: string
    rut: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // Autenticar contra Supabase
          const { authenticateUser } = await import("@/lib/db/users")
          const user = await authenticateUser(credentials.email, credentials.password)
          if (!user) return null
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            empresa: user.empresa,
            plan: user.plan,
            rut: user.rut,
          }
        } catch (err) {
          // Fallback a demo si Supabase no está configurado aún
          console.warn("[auth] Supabase no disponible, usando credenciales demo:", err)
          const demoEmail = process.env.DEMO_USER_EMAIL ?? "demo@tecnozero.cl"
          const demoPass = process.env.DEMO_USER_PASSWORD ?? "Demo2024!"
          if (
            credentials.email.toLowerCase() === demoEmail.toLowerCase() &&
            credentials.password === demoPass
          ) {
            return {
              id: "demo-user",
              email: demoEmail,
              name: process.env.DEMO_USER_NAME ?? "Carlos Contador",
              empresa: process.env.DEMO_USER_EMPRESA ?? "Contabilidad Flores SpA",
              plan: "profesional",
              rut: "12.345.678-9",
            }
          }
          return null
        }
      },
    }),
  ],

  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8 horas

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.empresa = user.empresa ?? ""
        token.plan = user.plan ?? ""
        token.rut = user.rut ?? ""
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.empresa = token.empresa
      session.user.plan = token.plan
      session.user.rut = token.rut
      // No va en el JWT a propósito: si fuera parte del token, revocarle el
      // acceso a alguien obligaría a esperar a que su sesión caduque.
      session.user.esAdmin = estaEnLaListaDeAdmins(session.user.email)
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Seguridad adicional
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
}
