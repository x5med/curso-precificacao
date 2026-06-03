"use server"

import { createClient } from "@supabase/supabase-js"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Tabela usada para gravar os leads do formulario de inscricao.
const TABLE = "inscricoes"

function getClient() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Supabase nao configurado: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.")
  }

  // Service role roda apenas no servidor (Server Action) e ignora RLS.
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function registrarInscricao(payload) {
  const name = (payload?.name || "").toString().trim()
  const phone = (payload?.phone || "").toString().trim()
  const email = (payload?.email || "").toString().trim().toLowerCase()

  if (!name || !phone || !email) {
    return { ok: false, error: "Preencha nome, WhatsApp e e-mail." }
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Informe um e-mail valido." }
  }

  try {
    const supabase = getClient()
    const { error } = await supabase.from(TABLE).insert({
      name,
      phone,
      email,
      source: "landing-trilha-x5med",
    })

    if (error) {
      console.error("Falha ao gravar inscricao no Supabase:", error)
      return { ok: false, error: "Nao foi possivel registrar agora. Tente novamente." }
    }

    return { ok: true }
  } catch (err) {
    console.error("Erro inesperado na inscricao:", err)
    return { ok: false, error: "Nao foi possivel registrar agora. Tente novamente." }
  }
}
