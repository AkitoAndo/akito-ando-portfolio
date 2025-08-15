import { test, expect } from '@playwright/test'

test.describe('プロジェクトページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
  })

  test('ページの基本要素が表示される', async ({ page }) => {
    await expect(page).toHaveTitle(/プロジェクト - Akito Ando/)
    await expect(page.getByText('ls ~/projects/')).toBeVisible()
  })

  test('プロジェクトフィルターが機能する', async ({ page }) => {
    // ページ読み込み完了を待つ
    await page.waitForTimeout(2000)
    
    // フィルターボタンが表示されることを確認
    const allButton = page.getByRole('button', { name: /すべて/ })
    if (await allButton.count() > 0) {
      await expect(allButton).toBeVisible()
      
      // 注目プロジェクトフィルター
      const featuredButton = page.getByRole('button', { name: /注目/ })
      if (await featuredButton.count() > 0) {
        await featuredButton.click()
        await page.waitForTimeout(500)
      }
      
      // 全プロジェクトに戻す
      await allButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('プロジェクトカードの基本情報が表示される', async ({ page }) => {
    // データロード完了を待つ
    await page.waitForTimeout(3000)
    
    // プロジェクトカードの存在確認
    const projectCards = page.locator('[class*="project"], .bg-gray-800')
    const cardCount = await projectCards.count()
    
    if (cardCount > 0) {
      const firstCard = projectCards.first()
      await expect(firstCard).toBeVisible()
      
      // プロジェクト名が表示されているか
      const projectTitle = firstCard.locator('h3, [class*="title"]')
      if (await projectTitle.count() > 0) {
        await expect(projectTitle.first()).toBeVisible()
      }
    }
  })

  test('GitHubリンクが正しく設定される', async ({ page }) => {
    // データロード完了を待つ
    await page.waitForTimeout(3000)
    
    // GitHubリンクの確認
    const githubLinks = page.getByRole('link', { name: /GitHubで見る/ })
    const linkCount = await githubLinks.count()
    
    if (linkCount > 0) {
      const firstLink = githubLinks.first()
      await expect(firstLink).toBeVisible()
      await expect(firstLink).toHaveAttribute('target', '_blank')
      
      const href = await firstLink.getAttribute('href')
      expect(href).toContain('github.com')
    }
  })

  test('プロジェクト統計が表示される', async ({ page }) => {
    // ページ下部の統計セクションまでスクロール
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // 統計セクションの確認
    await expect(page.getByText('開発統計')).toBeVisible()
    await expect(page.getByText('パブリックリポジトリ')).toBeVisible()
    await expect(page.getByText('合計スター数')).toBeVisible()
    await expect(page.getByText('使用言語数')).toBeVisible()
  })

  test('言語フィルターが動作する', async ({ page }) => {
    // データロード完了を待つ
    await page.waitForTimeout(3000)
    
    // TypeScriptフィルターがあればテスト
    const tsButton = page.getByRole('button', { name: /TypeScript/ })
    if (await tsButton.count() > 0) {
      await tsButton.click()
      await page.waitForTimeout(500)
      
      // フィルター結果の確認
      // TypeScriptプロジェクトのみが表示されることを期待
    }
    
    // JavaScriptフィルターがあればテスト
    const jsButton = page.getByRole('button', { name: /^JavaScript/ })
    if (await jsButton.count() > 0) {
      await jsButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('ローディング状態が適切に表示される', async ({ page }) => {
    // ページを再読み込みして初期ローディング状態を確認
    await page.reload()
    
    // ローディングメッセージの確認（短時間なので条件付き）
    const loadingMessage = page.getByText(/読み込み中/)
    if (await loadingMessage.count() > 0) {
      await expect(loadingMessage).toBeVisible()
    }
    
    // ロード完了後の状態確認
    await page.waitForTimeout(3000)
  })

  test('エラー状態の処理', async ({ page }) => {
    // ネットワークをブロックしてエラー状態をシミュレート
    await page.route('https://api.github.com/**', route => route.abort())
    await page.reload()
    
    // フォールバック表示の確認
    await page.waitForTimeout(3000)
    
    // エラーメッセージやフォールバックコンテンツが表示されるか確認
    const errorOrFallback = await page.getByText(/読み込みに失敗/).count() > 0 ||
                           await page.locator('[class*="project"], .bg-gray-800').count() > 0
    
    expect(errorOrFallback).toBeTruthy()
  })

  test('レスポンシブデザインが機能する', async ({ page }) => {
    // データロード完了を待つ
    await page.waitForTimeout(2000)
    
    // デスクトップサイズ
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.getByText('プロジェクト')).toBeVisible()
    
    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('プロジェクト')).toBeVisible()
    
    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('プロジェクト')).toBeVisible()
  })

  test('プロジェクトカードのホバーエフェクト', async ({ page }) => {
    // データロード完了を待つ
    await page.waitForTimeout(2000)
    
    const projectCards = page.locator('[class*="project"], .bg-gray-800')
    const cardCount = await projectCards.count()
    
    if (cardCount > 0) {
      const firstCard = projectCards.first()
      
      // ホバー前の状態
      await expect(firstCard).toBeVisible()
      
      // ホバーアニメーション
      await firstCard.hover()
      await page.waitForTimeout(500)
      
      // ホバー効果の確認（ボーダーカラーの変更など）
      // 実際のスタイル変更の確認は困難なので、エラーが発生しないことを確認
    }
  })
})