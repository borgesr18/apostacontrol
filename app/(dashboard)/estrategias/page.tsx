'use client'

import { useEffect, useState } from 'react'
import { Plus, Target, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface Estrategia {
    id: string
    nome: string
    descricao: string
}

export default function EstrategiasPage() {
    const [estrategias, setEstrategias] = useState<Estrategia[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newEstrategia, setNewEstrategia] = useState({ nome: '', descricao: '' })
    const supabase = createClient()

    useEffect(() => {
        fetchEstrategias()
    }, [])

    const fetchEstrategias = async () => {
        const res = await fetch('/api/estrategias')
        if (res.ok) {
            const data = await res.json()
            setEstrategias(data)
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/estrategias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEstrategia),
        })

        if (res.ok) {
            setIsModalOpen(false)
            setNewEstrategia({ nome: '', descricao: '' })
            fetchEstrategias()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta estratégia?')) return

        const { error } = await supabase.from('estrategias').delete().eq('id', id)
        if (!error) {
            fetchEstrategias()
        } else {
            alert('Erro ao excluir')
        }
    }

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Estratégias</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Estratégia
                </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {estrategias.map((estrategia) => (
                    <div key={estrategia.id} className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Target className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <div className="ml-5">
                                        <h3 className="text-lg font-medium text-gray-900">{estrategia.nome}</h3>
                                        <p className="text-sm text-gray-500">{estrategia.descricao}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(estrategia.id)} className="text-gray-400 hover:text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">Nova Estratégia</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEstrategia.nome}
                                        onChange={(e) => setNewEstrategia({ ...newEstrategia, nome: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                    <textarea
                                        value={newEstrategia.descricao}
                                        onChange={(e) => setNewEstrategia({ ...newEstrategia, descricao: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
