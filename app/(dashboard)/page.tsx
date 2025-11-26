'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        saldoTotal: 0,
        lucroMes: 0,
        totalApostasMes: 0,
        taxaAcerto: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch Bancas for total balance
            const { data: bancas } = await supabase.from('bancas').select('saldo_atual')
            const saldoTotal = bancas?.reduce((acc, curr) => acc + curr.saldo_atual, 0) || 0

            // Fetch Apostas for other stats (mocking month filter for simplicity)
            const { data: apostas } = await supabase.from('apostas').select('*')

            const apostasResolvidas = apostas?.filter(a => ['ganha', 'perdida', 'meia-ganha', 'meia-perdida'].includes(a.status)) || []
            const apostasGanhas = apostasResolvidas.filter(a => ['ganha', 'meia-ganha'].includes(a.status))

            const lucroTotal = apostasResolvidas.reduce((acc, curr) => acc + (curr.lucro || 0), 0)
            const taxaAcerto = apostasResolvidas.length > 0 ? (apostasGanhas.length / apostasResolvidas.length) * 100 : 0

            setStats({
                saldoTotal,
                lucroMes: lucroTotal, // This is actually total profit for now
                totalApostasMes: apostas?.length || 0,
                taxaAcerto
            })
            setLoading(false)
        }
        fetchStats()
    }, [])

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Saldo Total */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Wallet className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Saldo Total</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            R$ {stats.saldoTotal.toFixed(2)}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lucro */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {stats.lucroMes >= 0 ?
                                    <TrendingUp className="h-6 w-6 text-green-400" /> :
                                    <TrendingDown className="h-6 w-6 text-red-400" />
                                }
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Lucro Total</dt>
                                    <dd>
                                        <div className={`text-lg font-medium ${stats.lucroMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            R$ {stats.lucroMes.toFixed(2)}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Apostas */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Target className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Apostas</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {stats.totalApostasMes}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Taxa de Acerto */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-xl font-bold text-indigo-500">%</div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Taxa de Acerto</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {stats.taxaAcerto.toFixed(1)}%
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Últimas Apostas</h2>
                {/* Reuse Apostas Table or Component here */}
                <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                    <p>Visualize suas apostas recentes na aba "Apostas".</p>
                </div>
            </div>
        </div>
    )
}
