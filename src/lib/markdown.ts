import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'
import type { MarkdownProcessorResult } from '@/types'

// Create a unified processor for markdown to HTML conversion
const processor = unified()
  .use(remarkParse) // Parse markdown
  .use(remarkGfm) // Support GitHub Flavored Markdown
  .use(remarkRehype) // Convert to HTML AST
  .use(rehypeSanitize) // Sanitize HTML for security
  .use(rehypeStringify) // Convert to HTML string

/**
 * Convert markdown string to sanitized HTML
 * @param markdown - The markdown string to convert
 * @returns Promise resolving to HTML string and optional error
 */
export async function markdownToHtml(markdown: string): Promise<MarkdownProcessorResult> {
  try {
    if (!markdown || typeof markdown !== 'string') {
      return {
        html: '<p class="text-muted italic">Start typing markdown to see the preview...</p>',
        error: undefined
      }
    }

    const result = await processor.process(markdown)
    const html = String(result)

    return {
      html,
      error: undefined
    }
  } catch (error) {
    console.error('Markdown processing error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return {
      html: `<div class="text-destructive p-4 border border-destructive rounded-lg"><strong>Markdown Error:</strong> ${errorMessage}</div>`,
      error: errorMessage
    }
  }
}

/**
 * Synchronous version for simple markdown conversion
 * @param markdown - The markdown string to convert
 * @returns HTML string or error message
 */
export function markdownToHtmlSync(markdown: string): string {
  try {
    if (!markdown || typeof markdown !== 'string') {
      return '<p class="text-muted italic">Start typing markdown to see the preview...</p>'
    }

    const result = processor.processSync(markdown)
    return String(result)
  } catch (error) {
    console.error('Markdown processing error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return `<div class="text-destructive p-4 border border-destructive rounded-lg"><strong>Markdown Error:</strong> ${errorMessage}</div>`
  }
}