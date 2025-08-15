import { test, expect } from '@playwright/test'

test.describe('ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('基本的な要素が表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/Akito Ando - Portfolio/)
    
    // メインセクションの確認
    await expect(page.getByText('Akito Ando')).toBeVisible()
    await expect(page.getByText('フルスタック開発者')).toBeVisible()
    
    // 技術スタックセクションの確認
    await expect(page.getByText('技術スタック')).toBeVisible()
    await expect(page.getByText('JavaScript')).toBeVisible()
    await expect(page.getByText('TypeScript')).toBeVisible()
    await expect(page.getByText('React')).toBeVisible()
  })

  test('スキルカードが表示される', async ({ page }) => {
    // スキルカードの存在確認
    const skillCards = page.locator('[class*="skill-item"], [class*="grid"] > div')
    await expect(skillCards.first()).toBeVisible()
    
    // 主要スキルが含まれているか確認
    const skills = ['JavaScript', 'TypeScript', 'React', 'Node.js']
    for (const skill of skills) {
      await expect(page.getByText(skill)).toBeVisible()
    }
  })

  test('クイックリンクが機能する', async ({ page }) => {
    // プロジェクトリンクのクリック
    const projectsLink = page.getByRole('link', { name: /プロジェクト/ })
    await expect(projectsLink).toBeVisible()
    await projectsLink.click()
    await expect(page).toHaveURL('/projects')
    await expect(page.getByText('プロジェクト')).toBeVisible()
    
    // ホームに戻る
    await page.goto('/')
    
    // プロフィールリンクのクリック
    const aboutLink = page.getByRole('link', { name: /詳しいプロフィール/ })
    await expect(aboutLink).toBeVisible()
    await aboutLink.click()
    await expect(page).toHaveURL('/about')
  })

  test('GitHub統計が表示される', async ({ page }) => {
    await expect(page.getByText('GitHub活動統計')).toBeVisible()
    await expect(page.getByText('リポジトリ')).toBeVisible()
    await expect(page.getByText('コントリビューション')).toBeVisible()
    await expect(page.getByText('スター獲得')).toBeVisible()
  })

  test('連絡先CTAが表示される', async ({ page }) => {
    await expect(page.getByText("Let's work together!")).toBeVisible()
    await expect(page.getByText('お気軽にご連絡ください')).toBeVisible()
    
    const contactLink = page.getByRole('link', { name: '連絡先を見る' })
    await expect(contactLink).toBeVisible()
    await contactLink.click()
    await expect(page).toHaveURL('/contact')
  })

  test('レスポンシブデザインが機能する', async ({ page }) => {
    // デスクトップサイズで確認
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.getByText('Akito Ando')).toBeVisible()
    
    // タブレットサイズで確認
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('Akito Ando')).toBeVisible()
    
    // モバイルサイズで確認
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('Akito Ando')).toBeVisible()
  })

  test('アニメーションが動作する', async ({ page }) => {
    // ページ読み込み後のアニメーション完了を待つ
    await page.waitForTimeout(1000)
    
    // スキルカードのホバーアニメーション
    const firstSkillCard = page.locator('[class*="skill-item"], [class*="grid"] > div').first()
    await firstSkillCard.hover()
    await page.waitForTimeout(500)
    
    // カーソルアニメーションの確認
    const cursor = page.locator('.cursor')
    if (await cursor.count() > 0) {
      await expect(cursor.first()).toBeVisible()
    }
  })
})