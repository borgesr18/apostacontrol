'use client'

import { useEffect, useState } from 'react'
import { Plus, BookOpen, Trash2, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface Casa {
    id: string
    nome: string
    site: string
    observacoes: string
}

export default function CasasPage() {
    const [casas, setCasas] = useState<Casa[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newCasa, setNewCasa] = useState({ nome: '', site: '', observacoes: '' })
    const supabase = createClient()

    useEffect(() => {
        fetchCasas()
    }, [])

    const fetchCasas = async () => {
        const res = await fetch('/api/casas')
        if (res.ok) {
            const data = await res.json()
            setCasas(data)
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/casas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCasa),
        })

        if (res.ok) {
            setIsModalOpen(false)
            setNewCasa({ nome: '', site: '', observacoes: '' })
            fetchCasas()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta casa?')) return

        const { error } = await supabase.from('casas_apostas').delete().eq('id', id)
        if (!error) {
            fetchCasas()
        } else {
            alert('Erro ao excluir')
        }
    }

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Casas de Apostas</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Casa
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {casas.map((casa) => (
                        <li key={casa.id}>
                            <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <BookOpen className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-medium text-indigo-600 truncate">{casa.nome}</div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            {casa.site && <a href={casa.site} target="_blank" rel="noopener noreferrer" className="hover:underline">{casa.site}</a>}
                                        </div>
                                        {casa.observacoes && <div className="text-sm text-gray-500 mt-1">{casa.observacoes}</div>}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleDelete(casa.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {casas.length === 0 && (
                        <li className="px-4 py-8 text-center text-gray-500">
                            Nenhuma casa de aposta cadastrada.
                        </li>
                    )}
                </ul>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">Nova Casa de Aposta</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCasa.nome}
                                        onChange={(e) => setNewCasa({ ...newCasa, nome: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Site (URL)</label>
                                    <input
                                        type="url"
                                        value={newCasa.site}
                                        onChange={(e) => setNewCasa({ ...newCasa, site: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Observações</label>
                                    <textarea
                                        value={newCasa.observacoes}
                                        onChange={(e) => setNewCasa({ ...newCasa, observacoes: e.target.value })}
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
