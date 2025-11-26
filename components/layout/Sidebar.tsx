'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, TrendingUp, BookOpen, Target, BarChart3, User } from 'lucide-react'
import clsx from 'clsx'

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Bancas', href: '/bancas', icon: Wallet },
    { name: 'Apostas', href: '/apostas', icon: TrendingUp },
    { name: 'Casas', href: '/casas', icon: BookOpen },
    { name: 'Estratégias', href: '/estrategias', icon: Target },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col bg-gray-900">
            <div className="flex h-16 items-center justify-center bg-gray-800">
                <h1 className="text-xl font-bold text-white">ApostaControl</h1>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
                <nav className="flex-1 space-y-1 px-2 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    isActive
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300',
                                        'mr-3 h-6 w-6 flex-shrink-0'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t border-gray-800 p-4">
                <Link
                    href="/perfil"
                    className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    <User className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300" />
                    Perfil
                </Link>
            </div>
        </div>
    )
}
