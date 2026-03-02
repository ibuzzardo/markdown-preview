'use client'

import { useState, useEffect, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { markdownToHtml } from '@/lib/markdown'
import { SAMPLE_MARKDOWN } from './SampleMarkdown'
import type { ClipboardResult } from '@/types'

export function MarkdownEditor(): JSX.Element {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN)
  const [html, setHtml] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Process markdown to HTML
  const processMarkdown = useCallback(async (text: string): Promise<void> => {
    try {
      setIsProcessing(true)
      const result = await markdownToHtml(text)
      setHtml(result.html)
    } catch (error) {
      console.error('Failed to process markdown:', error)
      setHtml('<div class="text-destructive p-4">Failed to process markdown</div>')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  // Debounced markdown processing
  const debouncedProcess = useCallback((text: string): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      processMarkdown(text)
    }, 200)

    setDebounceTimer(timer)
  }, [debounceTimer, processMarkdown])

  // Handle markdown input change
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newValue = e.target.value
    setMarkdown(newValue)
    debouncedProcess(newValue)
  }

  // Copy HTML to clipboard
  const copyToClipboard = async (): Promise<void> => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not supported')
      }

      await navigator.clipboard.writeText(html)
      setCopied(true)
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = html
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
      }
    }
  }

  // Process initial markdown on mount
  useEffect(() => {
    processMarkdown(SAMPLE_MARKDOWN)
  }, [])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  return (
    <>
      {/* Editor Panel */}
      <div className="w-full md:w-1/2 flex flex-col border-r border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-lg font-semibold text-foreground">Markdown Editor</h2>
          <div className="text-sm text-muted">
            {isProcessing ? 'Processing...' : 'Ready'}
          </div>
        </div>
        <textarea
          value={markdown}
          onChange={handleMarkdownChange}
          placeholder="Type your markdown here..."
          className="w-full h-full p-4 bg-background text-foreground border-0 focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Preview Panel */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-lg font-semibold text-foreground">Preview</h2>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors flex items-center space-x-2"
            title="Copy HTML to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy HTML</span>
              </>
            )}
          </button>
        </div>
        <div className="w-full h-full p-4 bg-background text-foreground overflow-auto">
          <div 
            className="prose-dark min-h-full"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </>
  )
}