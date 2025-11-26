'use client'

import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function Header({ user }: { user: any }) {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/auth/login')
        router.refresh()
    }

    return (
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
            <div className="flex items-center">
                {/* Breadcrumbs or Title could go here */}
                <h2 className="text-lg font-semibold text-gray-800">Painel de Controle</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                    <span className="block font-medium">{user?.user_metadata?.full_name || 'Usuário'}</span>
                    <span className="block text-xs text-gray-500">{user?.email}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Sair"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    )
}
