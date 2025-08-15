import { useState, useEffect } from 'react'

interface UseMarkdownReturn {
  content: string
  isLoading: boolean
  error: string | null
}

export const useMarkdown = (filePath: string): UseMarkdownReturn => {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadMarkdown = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Vite handles static imports differently
        const response = await fetch(`/docs/content/${filePath}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filePath}: ${response.status}`)
        }
        
        const text = await response.text()
        
        if (isMounted) {
          setContent(text)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          console.error('Failed to load markdown:', err)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMarkdown()

    return () => {
      isMounted = false
    }
  }, [filePath])

  return { content, isLoading, error }
}