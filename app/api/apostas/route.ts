import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const bancaId = searchParams.get('banca_id')

    let query = supabase
        .from('apostas')
        .select(`
      *,
      bancas (nome, moeda),
      casas_apostas (nome),
      estrategias (nome)
    `)
        .order('data_aposta', { ascending: false })

    if (bancaId) {
        query = query.eq('banca_id', bancaId)
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const supabase = createClient()
    const json = await request.json()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Validate required fields
    if (!json.banca_id || !json.stake || !json.odd || !json.selecao) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('apostas')
        .insert({ ...json, user_id: user.id })
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // TODO: Update banca balance if needed (usually only when settled, but stake might be deducted immediately depending on logic)
    // For now, we just record the bet.

    return NextResponse.json(data)
}
