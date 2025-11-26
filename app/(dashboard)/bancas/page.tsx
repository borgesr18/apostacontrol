'use client'

import { useEffect, useState } from 'react'
import { Plus, Wallet } from 'lucide-react'
import Link from 'next/link'

interface Banca {
    id: string
    nome: string
    moeda: string
    saldo_atual: number
    saldo_inicial: number
}

export default function BancasPage() {
    const [bancas, setBancas] = useState<Banca[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newBanca, setNewBanca] = useState({ nome: '', moeda: 'BRL', saldo_inicial: '', descricao: '' })

    useEffect(() => {
        fetchBancas()
    }, [])

    const fetchBancas = async () => {
        const res = await fetch('/api/bancas')
        if (res.ok) {
            const data = await res.json()
            setBancas(data)
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/bancas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBanca),
        })

        if (res.ok) {
            setIsModalOpen(false)
            setNewBanca({ nome: '', moeda: 'BRL', saldo_inicial: '', descricao: '' })
            fetchBancas()
        }
    }

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Minhas Bancas</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Banca
                </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bancas.map((banca) => (
                    <Link key={banca.id} href={`/bancas/${banca.id}`} className="block">
                        <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Wallet className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">{banca.nome}</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: banca.moeda }).format(banca.saldo_atual)}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Ver detalhes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">Nova Banca</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        required
                                        value={newBanca.nome}
                                        onChange={(e) => setNewBanca({ ...newBanca, nome: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Moeda</label>
                                    <select
                                        value={newBanca.moeda}
                                        onChange={(e) => setNewBanca({ ...newBanca, moeda: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    >
                                        <option value="BRL">BRL (R$)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Saldo Inicial</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={newBanca.saldo_inicial}
                                        onChange={(e) => setNewBanca({ ...newBanca, saldo_inicial: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                    <textarea
                                        value={newBanca.descricao}
                                        onChange={(e) => setNewBanca({ ...newBanca, descricao: e.target.value })}
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
                                    Criar Banca
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
