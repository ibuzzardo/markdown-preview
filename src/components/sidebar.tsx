'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Server, Cpu, FolderOpen, Activity } from 'lucide-react'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Processes', href: '/processes', icon: Cpu },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
]

export function Sidebar(): JSX.Element {
  const pathname = usePathname()

  return (
    <div className="w-56 bg-surface border-r border-border p-4 space-y-1">
      <div className="flex items-center space-x-2 mb-6">
        <Server className="h-6 w-6 text-accent" />
        <span className="text-lg font-semibold text-primary-text">VPS Center</span>
      </div>
      
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-secondary-text hover:bg-surface-alt hover:text-primary-text'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

// Mobile sidebar (for responsive design)
export function MobileSidebar(): JSX.Element {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
      <nav className="flex justify-around py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'text-accent'
                  : 'text-secondary-text'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}