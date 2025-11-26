import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient()

    const { data: bancas, error } = await supabase
        .from('bancas')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(bancas)
}

export async function POST(request: Request) {
    const supabase = createClient()
    const json = await request.json()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { nome, moeda, saldo_inicial, descricao } = json

    const { data, error } = await supabase
        .from('bancas')
        .insert({
            user_id: user.id,
            nome,
            moeda,
            saldo_inicial,
            saldo_atual: saldo_inicial, // Starts with initial balance
            descricao,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create initial movement (deposit)
    await supabase.from('bancas_movimentacoes').insert({
        user_id: user.id,
        banca_id: data.id,
        tipo: 'deposito',
        valor: saldo_inicial,
        data_movimentacao: new Date().toISOString(),
        observacao: 'Saldo inicial',
    })

    return NextResponse.json(data)
}
