import { promises as fs } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { simpleGit } from 'simple-git'
import type { ProjectInfo } from '@/types'

const execAsync = promisify(exec)

const PROJECTS_DIR = '/opt/projects'

export async function scanProjects(): Promise<ProjectInfo[]> {
  try {
    // Check if projects directory exists
    try {
      await fs.access(PROJECTS_DIR)
    } catch {
      console.log(`Projects directory ${PROJECTS_DIR} does not exist`)
      return []
    }

    const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true })
    const directories = entries.filter(entry => entry.isDirectory())

    const projects: ProjectInfo[] = []

    for (const dir of directories) {
      try {
        const projectPath = path.join(PROJECTS_DIR, dir.name)
        const project = await scanProject(projectPath, dir.name)
        projects.push(project)
      } catch (error) {
        console.error(`Error scanning project ${dir.name}:`, error)
        // Continue with other projects even if one fails
        projects.push({
          name: dir.name,
          path: path.join(PROJECTS_DIR, dir.name),
          hasPackageJson: false,
          git: {},
          diskUsage: 'Unknown',
        })
      }
    }

    return projects
  } catch (error) {
    console.error('Error scanning projects directory:', error)
    throw new Error('Failed to scan projects directory')
  }
}

async function scanProject(projectPath: string, dirName: string): Promise<ProjectInfo> {
  const project: ProjectInfo = {
    name: dirName,
    path: projectPath,
    hasPackageJson: false,
    git: {},
    diskUsage: 'Unknown',
  }

  // Check for package.json
  try {
    const packageJsonPath = path.join(projectPath, 'package.json')
    await fs.access(packageJsonPath)
    project.hasPackageJson = true

    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonContent)
    project.packageName = packageJson.name
    project.packageVersion = packageJson.version
  } catch {
    // package.json doesn't exist or is invalid
  }

  // Get git information
  try {
    const git = simpleGit(projectPath)
    const isRepo = await git.checkIsRepo()

    if (isRepo) {
      try {
        const branch = await git.revparse(['--abbrev-ref', 'HEAD'])
        project.git.branch = branch.trim()
      } catch {
        // Branch info not available
      }

      try {
        const log = await git.log({ maxCount: 1 })
        if (log.latest) {
          project.git.lastCommit = {
            message: log.latest.message,
            date: log.latest.date,
            hash: log.latest.hash.substring(0, 7),
          }
        }
      } catch {
        // Commit info not available
      }
    }
  } catch {
    // Git not available or not a repo
  }

  // Get disk usage
  try {
    const { stdout } = await execAsync(`du -sh "${projectPath}" 2>/dev/null || echo "Unknown"`)
    project.diskUsage = stdout.split('\t')[0].trim() || 'Unknown'
  } catch {
    project.diskUsage = 'Unknown'
  }

  return project
}

export function formatProjectDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  } catch {
    return 'Unknown'
  }
}