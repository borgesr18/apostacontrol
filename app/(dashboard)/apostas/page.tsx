'use client'

import { useEffect, useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function ApostasPage() {
    const [apostas, setApostas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchApostas()
    }, [])

    const fetchApostas = async () => {
        const res = await fetch('/api/apostas')
        if (res.ok) {
            const data = await res.json()
            setApostas(data)
        }
        setLoading(false)
    }

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Minhas Apostas</h1>
                <Link
                    href="/apostas/nova"
                    className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Aposta
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aposta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odd</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stake</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {apostas.map((aposta) => (
                                <tr key={aposta.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(aposta.data_evento), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {aposta.time_casa} x {aposta.time_fora}
                                        <div className="text-xs text-gray-500">{aposta.liga}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {aposta.selecao}
                                        <div className="text-xs text-gray-500">{aposta.mercado}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {aposta.odd.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {aposta.stake.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${aposta.status === 'ganha' ? 'bg-green-100 text-green-800' :
                                                aposta.status === 'perdida' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {aposta.status}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium 
                    ${aposta.lucro > 0 ? 'text-green-600' : aposta.lucro < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        {aposta.lucro ? aposta.lucro.toFixed(2) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
