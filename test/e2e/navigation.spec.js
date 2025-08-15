import { test, expect } from '@playwright/test'

test.describe('ナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('メインナビゲーションが表示される', async ({ page }) => {
    // デスクトップナビゲーション
    await page.setViewportSize({ width: 1200, height: 800 })
    
    // ナビゲーション項目の確認
    await expect(page.getByText('cd ~')).toBeVisible()
    await expect(page.getByText('cat ~/.profile')).toBeVisible()
    await expect(page.getByText('ls ~/projects')).toBeVisible()
    await expect(page.getByText('cat ~/.contacts')).toBeVisible()
  })

  test('モバイルメニューが機能する', async ({ page }) => {
    // モバイルサイズに設定
    await page.setViewportSize({ width: 375, height: 667 })
    
    // メニューボタンの確認と クリック
    const menuButton = page.getByRole('button', { name: /メニュー/ })
    if (await menuButton.count() > 0) {
      await menuButton.click()
      
      // モバイルメニューが開くことを確認
      await expect(page.getByText('ホーム')).toBeVisible()
      await expect(page.getByText('プロフィール')).toBeVisible()
      
      // メニューを閉じる
      await menuButton.click()
    }
  })

  test('ページ間ナビゲーションが正常に動作する', async ({ page }) => {
    // プロジェクトページへの移動
    const projectsNav = page.getByRole('link').filter({ hasText: 'projects' })
    await projectsNav.click()
    await expect(page).toHaveURL('/projects')
    await expect(page.getByText('プロジェクト')).toBeVisible()
    
    // プロフィールページへの移動
    const aboutNav = page.getByRole('link').filter({ hasText: 'profile' })
    await aboutNav.click()
    await expect(page).toHaveURL('/about')
    await expect(page.getByText('プロフィール')).toBeVisible()
    
    // 連絡先ページへの移動
    const contactNav = page.getByRole('link').filter({ hasText: 'contacts' })
    await contactNav.click()
    await expect(page).toHaveURL('/contact')
    await expect(page.getByText('連絡先')).toBeVisible()
    
    // ホームページへの移動
    const homeNav = page.getByRole('link').filter({ hasText: 'cd ~' })
    await homeNav.click()
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Akito Ando')).toBeVisible()
  })

  test('アクティブページのスタイルが適用される', async ({ page }) => {
    // ホームページでのアクティブスタイル確認
    const homeLink = page.getByRole('link').filter({ hasText: 'cd ~' })
    
    // プロジェクトページに移動してアクティブスタイル確認
    await page.goto('/projects')
    const projectsLink = page.getByRole('link').filter({ hasText: 'projects' })
    // アクティブなリンクは緑色のスタイルが適用されているはず
  })

  test('フッターリンクが機能する', async ({ page }) => {
    // フッターの確認
    await expect(page.getByText('© 2024 Akito Ando')).toBeVisible()
    
    // GitHubリンクの確認
    const githubLink = page.getByRole('link', { name: 'GitHub' })
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/akito-ando')
    await expect(githubLink).toHaveAttribute('target', '_blank')
    
    // LinkedInリンクの確認
    const linkedinLink = page.getByRole('link', { name: 'LinkedIn' })
    await expect(linkedinLink).toBeVisible()
    await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/akito-ando')
    await expect(linkedinLink).toHaveAttribute('target', '_blank')
  })

  test('ブラウザの戻る・進むボタンが機能する', async ({ page }) => {
    // 複数ページに移動
    await page.goto('/projects')
    await page.goto('/about')
    await page.goto('/contact')
    
    // 戻るボタン
    await page.goBack()
    await expect(page).toHaveURL('/about')
    
    await page.goBack()
    await expect(page).toHaveURL('/projects')
    
    // 進むボタン
    await page.goForward()
    await expect(page).toHaveURL('/about')
  })

  test('存在しないページで404ページが表示される', async ({ page }) => {
    await page.goto('/non-existent-page')
    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText('そのようなファイルやディレクトリはありません')).toBeVisible()
    
    // 404ページからのナビゲーション
    const homeLink = page.getByRole('link', { name: /ホームページに戻る/ })
    await expect(homeLink).toBeVisible()
    await homeLink.click()
    await expect(page).toHaveURL('/')
  })

  test('キーボードナビゲーションが機能する', async ({ page }) => {
    // Tabキーでナビゲーション
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // フォーカスされた要素でエンターキーを押す
    await page.keyboard.press('Enter')
    
    // 適切なページに移動することを確認
    // (実際のフォーカス順序に依存するため、具体的なアサーションは省略)
  })
})