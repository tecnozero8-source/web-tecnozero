import { NextAuthOptions } from "next-auth"
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

// Tabla de precios Tecnozero — precio por registro DT
// Mínimo: 50 registros por carga. Ahorro: 15% → 62% según volumen.
// Baseline manual: ~$756 CLP/registro.
export const PRICING_TIERS = [
  { minDocs: 50,   maxDocs: 150,  priceCLP: 640,  priceUF: 0.0162 },
  { minDocs: 151,  maxDocs: 400,  priceCLP: 570,  priceUF: 0.0144 },
  { minDocs: 401,  maxDocs: 800,  priceCLP: 500,  priceUF: 0.0127 },
  { minDocs: 801,  maxDocs: 2000, priceCLP: 430,  priceUF: 0.0109 },
  { minDocs: 2001, maxDocs: 5000, priceCLP: 360,  priceUF: 0.0091 },
  { minDocs: 5001, maxDocs: null, priceCLP: 290,  priceUF: 0.0073 },
]

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
