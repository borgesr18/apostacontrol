'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function NovaApostaPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [bancas, setBancas] = useState<any[]>([])
    const [casas, setCasas] = useState<any[]>([])
    const [estrategias, setEstrategias] = useState<any[]>([])

    const [formData, setFormData] = useState({
        banca_id: '',
        casa_aposta_id: '',
        estrategia_id: '',
        data_evento: new Date().toISOString().split('T')[0],
        esporte: 'Futebol',
        liga: '',
        time_casa: '',
        time_fora: '',
        mercado: '',
        selecao: '',
        odd: '',
        stake: '',
        observacoes: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            const [bRes, cRes, eRes] = await Promise.all([
                fetch('/api/bancas'),
                fetch('/api/casas'),
                fetch('/api/estrategias')
            ])

            if (bRes.ok) setBancas(await bRes.json())
            if (cRes.ok) setCasas(await cRes.json())
            if (eRes.ok) setEstrategias(await eRes.json())
        }
        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/apostas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                casa_aposta_id: formData.casa_aposta_id || null,
                estrategia_id: formData.estrategia_id || null,
            }),
        })

        if (res.ok) {
            router.push('/apostas')
            router.refresh()
        } else {
            alert('Erro ao criar aposta')
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Aposta</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">

                    {/* Banca */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Banca</label>
                        <select
                            required
                            value={formData.banca_id}
                            onChange={(e) => setFormData({ ...formData, banca_id: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        >
                            <option value="">Selecione uma banca</option>
                            {bancas.map(b => (
                                <option key={b.id} value={b.id}>{b.nome} ({b.moeda})</option>
                            ))}
                        </select>
                    </div>

                    {/* Casa e Estratégia */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Casa de Aposta</label>
                        <select
                            value={formData.casa_aposta_id}
                            onChange={(e) => setFormData({ ...formData, casa_aposta_id: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        >
                            <option value="">Opcional</option>
                            {casas.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estratégia</label>
                        <select
                            value={formData.estrategia_id}
                            onChange={(e) => setFormData({ ...formData, estrategia_id: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        >
                            <option value="">Opcional</option>
                            {estrategias.map(e => (
                                <option key={e.id} value={e.id}>{e.nome}</option>
                            ))}
                        </select>
                    </div>

                    {/* Evento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data do Evento</label>
                        <input
                            type="date"
                            required
                            value={formData.data_evento}
                            onChange={(e) => setFormData({ ...formData, data_evento: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Liga / Campeonato</label>
                        <input
                            type="text"
                            value={formData.liga}
                            onChange={(e) => setFormData({ ...formData, liga: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time Casa</label>
                        <input
                            type="text"
                            value={formData.time_casa}
                            onChange={(e) => setFormData({ ...formData, time_casa: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time Fora</label>
                        <input
                            type="text"
                            value={formData.time_fora}
                            onChange={(e) => setFormData({ ...formData, time_fora: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                    {/* Aposta */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Mercado</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Over 2.5 Gols, Match Odds"
                            value={formData.mercado}
                            onChange={(e) => setFormData({ ...formData, mercado: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Seleção (Aposta)</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Flamengo, Over 2.5"
                            value={formData.selecao}
                            onChange={(e) => setFormData({ ...formData, selecao: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Odd</label>
                        <input
                            type="number"
                            step="0.001"
                            required
                            value={formData.odd}
                            onChange={(e) => setFormData({ ...formData, odd: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stake (Valor)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.stake}
                            onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Observações</label>
                        <textarea
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>

                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar Aposta'}
                    </button>
                </div>
            </form>
        </div>
    )
}
