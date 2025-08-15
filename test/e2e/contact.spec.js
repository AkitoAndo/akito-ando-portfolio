import { test, expect } from '@playwright/test'

test.describe('コンタクトページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('ページの基本要素が表示される', async ({ page }) => {
    await expect(page).toHaveTitle(/コンタクト - Akito Ando/)
    await expect(page.getByText('cat ~/.contacts')).toBeVisible()
    await expect(page.getByText('連絡先')).toBeVisible()
  })

  test('連絡先情報が正しく表示される', async ({ page }) => {
    // メール情報
    await expect(page.getByText('📧 メール')).toBeVisible()
    await expect(page.getByText('akito.ando@example.com')).toBeVisible()
    
    // GitHub情報
    await expect(page.getByText('🐙 GitHub')).toBeVisible()
    await expect(page.getByText('@akito-ando')).toBeVisible()
    
    // LinkedIn情報
    await expect(page.getByText('💼 LinkedIn')).toBeVisible()
    await expect(page.getByText('linkedin.com/in/akito-ando')).toBeVisible()
    
    // Twitter情報
    await expect(page.getByText('🐦 Twitter')).toBeVisible()
    await expect(page.getByText('@akito_ando_dev')).toBeVisible()
  })

  test('連絡先リンクが正しく設定される', async ({ page }) => {
    // メールリンク
    const emailLink = page.getByRole('link').filter({ hasText: 'akito.ando@example.com' })
    await expect(emailLink).toHaveAttribute('href', 'mailto:akito.ando@example.com')
    
    // GitHubリンク
    const githubLink = page.getByRole('link').filter({ hasText: '@akito-ando' })
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/akito-ando')
    await expect(githubLink).toHaveAttribute('target', '_blank')
    
    // LinkedInリンク
    const linkedinLink = page.getByRole('link').filter({ hasText: 'linkedin.com/in/akito-ando' })
    await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/akito-ando')
    await expect(linkedinLink).toHaveAttribute('target', '_blank')
  })

  test('コンタクトフォームが表示される', async ({ page }) => {
    await expect(page.getByText('メッセージを送信')).toBeVisible()
    
    // フォーム要素の確認
    await expect(page.getByLabel('お名前 *')).toBeVisible()
    await expect(page.getByLabel('メールアドレス *')).toBeVisible()
    await expect(page.getByLabel('件名 *')).toBeVisible()
    await expect(page.getByLabel('メッセージ *')).toBeVisible()
    await expect(page.getByRole('button', { name: '送信する' })).toBeVisible()
  })

  test('コンタクトフォームの入力と送信', async ({ page }) => {
    // フォームに入力
    await page.fill('[name="name"]', 'テスト太郎')
    await page.fill('[name="email"]', 'test@example.com')
    await page.selectOption('[name="subject"]', 'project')
    await page.fill('[name="message"]', 'これはテストメッセージです。')
    
    // 送信ボタンをクリック
    await page.click('button[type="submit"]')
    
    // ローディング状態の確認
    await expect(page.getByText('送信中')).toBeVisible()
    
    // 成功メッセージの確認（仮の実装のため2秒待機）
    await page.waitForTimeout(3000)
    await expect(page.getByText('メッセージが正常に送信されました')).toBeVisible()
    
    // フォームがリセットされることの確認
    await expect(page.locator('[name="name"]')).toHaveValue('')
    await expect(page.locator('[name="email"]')).toHaveValue('')
    await expect(page.locator('[name="message"]')).toHaveValue('')
  })

  test('フォームバリデーションが機能する', async ({ page }) => {
    // 必須フィールドを空のまま送信
    await page.click('button[type="submit"]')
    
    // HTML5バリデーションメッセージの確認
    const nameInput = page.locator('[name="name"]')
    const isNameInvalid = await nameInput.evaluate(el => !el.checkValidity())
    expect(isNameInvalid).toBeTruthy()
    
    // 不正なメールアドレス
    await page.fill('[name="name"]', 'テスト太郎')
    await page.fill('[name="email"]', 'invalid-email')
    await page.selectOption('[name="subject"]', 'project')
    await page.fill('[name="message"]', 'テストメッセージ')
    
    await page.click('button[type="submit"]')
    
    const emailInput = page.locator('[name="email"]')
    const isEmailInvalid = await emailInput.evaluate(el => !el.checkValidity())
    expect(isEmailInvalid).toBeTruthy()
  })

  test('件名選択肢が適切に設定される', async ({ page }) => {
    const subjectSelect = page.locator('[name="subject"]')
    
    // 選択肢の確認
    await expect(subjectSelect.locator('option[value="project"]')).toHaveText('プロジェクトのご相談')
    await expect(subjectSelect.locator('option[value="collaboration"]')).toHaveText('コラボレーション')
    await expect(subjectSelect.locator('option[value="technical"]')).toHaveText('技術的な質問')
    await expect(subjectSelect.locator('option[value="job"]')).toHaveText('求人・採用について')
    await expect(subjectSelect.locator('option[value="speaking"]')).toHaveText('講演・イベント依頼')
    await expect(subjectSelect.locator('option[value="other"]')).toHaveText('その他')
  })

  test('対応についての情報が表示される', async ({ page }) => {
    // ページ下部までスクロール
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    await expect(page.getByText('対応について')).toBeVisible()
    await expect(page.getByText('通常24時間以内にお返事いたします')).toBeVisible()
    await expect(page.getByText('技術的な質問やプロジェクトの相談は大歓迎です')).toBeVisible()
    await expect(page.getByText('現在フリーランスとして新規案件を受け付けております')).toBeVisible()
  })

  test('フォームのアクセシビリティ', async ({ page }) => {
    // ラベルと入力フィールドの関連付け確認
    const nameInput = page.getByLabel('お名前 *')
    await expect(nameInput).toBeVisible()
    
    const emailInput = page.getByLabel('メールアドレス *')
    await expect(emailInput).toBeVisible()
    
    const subjectSelect = page.getByLabel('件名 *')
    await expect(subjectSelect).toBeVisible()
    
    const messageTextarea = page.getByLabel('メッセージ *')
    await expect(messageTextarea).toBeVisible()
    
    // キーボードナビゲーションの確認
    await nameInput.focus()
    await page.keyboard.press('Tab')
    await expect(emailInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(subjectSelect).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(messageTextarea).toBeFocused()
  })

  test('レスポンシブデザインが機能する', async ({ page }) => {
    // デスクトップサイズ
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.getByText('連絡先')).toBeVisible()
    
    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('連絡先')).toBeVisible()
    
    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('連絡先')).toBeVisible()
    
    // モバイルサイズでフォームが適切に表示される
    await expect(page.getByLabel('お名前 *')).toBeVisible()
    await expect(page.getByLabel('メールアドレス *')).toBeVisible()
  })

  test('外部リンクのホバーエフェクト', async ({ page }) => {
    // GitHubリンクのホバー
    const githubCard = page.locator('a').filter({ hasText: '🐙 GitHub' })
    await githubCard.hover()
    await page.waitForTimeout(500)
    
    // LinkedInリンクのホバー
    const linkedinCard = page.locator('a').filter({ hasText: '💼 LinkedIn' })
    await linkedinCard.hover()
    await page.waitForTimeout(500)
    
    // エラーが発生しないことを確認
    await expect(page.getByText('連絡先')).toBeVisible()
  })
})