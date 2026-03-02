'use client'

import { FolderOpen, GitBranch, Clock, HardDrive, Package } from 'lucide-react'
import { formatProjectDate } from '@/lib/project-scanner'
import type { ProjectInfo } from '@/types'

interface ProjectCardProps {
  project: ProjectInfo
}

export function ProjectCard({ project }: ProjectCardProps): JSX.Element {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:bg-surface-alt/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <FolderOpen className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-text">
              {project.packageName || project.name}
            </h3>
            <p className="text-sm text-secondary-text">
              {project.path}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-secondary-text">
          <HardDrive className="h-3 w-3" />
          <span>{project.diskUsage}</span>
        </div>
      </div>

      <div className="space-y-3">
        {project.hasPackageJson && (
          <div className="flex items-center space-x-2 text-sm">
            <Package className="h-4 w-4 text-success" />
            <span className="text-secondary-text">Package:</span>
            <span className="text-primary-text font-mono">
              {project.packageName}
              {project.packageVersion && (
                <span className="text-secondary-text ml-1">v{project.packageVersion}</span>
              )}
            </span>
          </div>
        )}

        {project.git.branch && (
          <div className="flex items-center space-x-2 text-sm">
            <GitBranch className="h-4 w-4 text-accent" />
            <span className="text-secondary-text">Branch:</span>
            <span className="text-primary-text font-mono">{project.git.branch}</span>
          </div>
        )}

        {project.git.lastCommit && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-secondary-text">Last commit:</span>
              <span className="text-secondary-text">
                {formatProjectDate(project.git.lastCommit.date)}
              </span>
            </div>
            <div className="bg-surface-alt rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-secondary-text">
                  {project.git.lastCommit.hash}
                </span>
              </div>
              <p className="text-sm text-primary-text">
                {project.git.lastCommit.message}
              </p>
            </div>
          </div>
        )}

        {!project.git.branch && !project.git.lastCommit && (
          <div className="text-sm text-secondary-text italic">
            No git information available
          </div>
        )}
      </div>
    </div>
  )
}