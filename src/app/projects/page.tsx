'use client'

import { useState } from 'react'
import { RefreshCw, FolderOpen } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import { usePoll } from '@/hooks/use-poll'
import { useRequireAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api-client'
import type { ProjectInfo } from '@/types'

export default function ProjectsPage(): JSX.Element {
  useRequireAuth()
  
  const [refreshKey, setRefreshKey] = useState(0)
  
  const { data: projects, error, loading, refetch } = usePoll<ProjectInfo[]>(
    () => apiClient.getProjects(),
    {
      interval: 30000, // 30 seconds (less frequent than system metrics)
      onError: (error) => {
        console.error('Failed to fetch projects:', error)
      },
    }
  )

  const handleRefresh = async (): Promise<void> => {
    await refetch()
    setRefreshKey(prev => prev + 1)
  }

  if (loading && !projects) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary-text">Deployed Projects</h1>
          <div className="text-sm text-secondary-text">Loading...</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 bg-surface-alt rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-surface-alt rounded w-3/4"></div>
                  <div className="h-3 bg-surface-alt rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-surface-alt rounded"></div>
                <div className="h-3 bg-surface-alt rounded w-2/3"></div>
                <div className="h-16 bg-surface-alt rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && !projects) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary-text">Deployed Projects</h1>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <div className="text-error mb-4">Unable to fetch projects</div>
          <div className="text-secondary-text mb-4">{error}</div>
          <div className="text-sm text-secondary-text mb-4">
            Make sure the /opt/projects directory exists and is accessible.
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const projectsWithGit = projects?.filter(p => p.git.branch || p.git.lastCommit).length || 0
  const projectsWithPackageJson = projects?.filter(p => p.hasPackageJson).length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Deployed Projects</h1>
          <p className="text-sm text-secondary-text mt-1">
            {projects?.length || 0} projects found in /opt/projects
            {projectsWithGit > 0 && ` • ${projectsWithGit} with git`}
            {projectsWithPackageJson > 0 && ` • ${projectsWithPackageJson} with package.json`}
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={`${project.path}-${refreshKey}-${index}`} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-secondary-text/10 rounded-full">
              <FolderOpen className="h-8 w-8 text-secondary-text" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-primary-text mb-2">No projects deployed yet</h3>
          <p className="text-secondary-text mb-4">
            Deploy your projects to <code className="bg-surface-alt px-2 py-1 rounded text-sm">/opt/projects/</code> to see them here.
          </p>
          <div className="bg-surface-alt rounded-lg p-4 text-left">
            <div className="text-sm text-secondary-text mb-2">Example deployment:</div>
            <div className="font-mono text-sm text-primary-text space-y-1">
              <div># Clone your project</div>
              <div>cd /opt/projects</div>
              <div>git clone https://github.com/user/project.git</div>
              <div></div>
              <div># Install dependencies</div>
              <div>cd project</div>
              <div>npm install</div>
              <div></div>
              <div># Start with PM2</div>
              <div>pm2 start npm --name "project" -- start</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}