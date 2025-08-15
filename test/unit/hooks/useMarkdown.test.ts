import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMarkdown } from '../../../src/hooks/useMarkdown'

// fetch をモック
global.fetch = vi.fn()

describe('useMarkdown', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('正常にマークダウンファイルを読み込む', async () => {
    const mockContent = '# テストタイトル\n\nテスト内容です。'
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => mockContent,
    } as Response)

    const { result } = renderHook(() => useMarkdown('test.md'))

    // 初期状態
    expect(result.current.isLoading).toBe(true)
    expect(result.current.content).toBe('')
    expect(result.current.error).toBeNull()

    // ロード完了後
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.content).toBe(mockContent)
    expect(result.current.error).toBeNull()
  })

  it('ファイル読み込みエラーを適切に処理する', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('File not found'))

    const { result } = renderHook(() => useMarkdown('nonexistent.md'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.content).toBe('')
    expect(result.current.error).toBe('File not found')
  })

  it('HTTP エラーを適切に処理する', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    const { result } = renderHook(() => useMarkdown('missing.md'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.content).toBe('')
    expect(result.current.error).toContain('Failed to fetch missing.md: 404')
  })

  it('正しいパスでfetchが呼ばれる', () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => 'content',
    } as Response)

    renderHook(() => useMarkdown('profile.md'))

    expect(fetch).toHaveBeenCalledWith('/docs/content/profile.md')
  })

  it('コンポーネントのアンマウント後はステートを更新しない', async () => {
    let resolvePromise: (value: Response) => void
    const promise = new Promise<Response>((resolve) => {
      resolvePromise = resolve
    })

    vi.mocked(fetch).mockReturnValueOnce(promise)

    const { result, unmount } = renderHook(() => useMarkdown('test.md'))

    // コンポーネントをアンマウント
    unmount()

    // プロミスを解決
    resolvePromise!({
      ok: true,
      text: async () => 'content after unmount',
    } as Response)

    // 少し待ってからステートが変更されていないことを確認
    await new Promise(resolve => setTimeout(resolve, 10))
    
    // アンマウント後はステートが更新されない
    expect(result.current.content).toBe('')
  })
})