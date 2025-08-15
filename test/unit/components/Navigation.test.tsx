import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navigation from '../../../src/components/Navigation'

// テスト用のラッパーコンポーネント
const NavigationWrapper = () => (
  <BrowserRouter>
    <Navigation />
  </BrowserRouter>
)

describe('Navigation', () => {
  it('基本的なナビゲーション項目が表示される', () => {
    render(<NavigationWrapper />)
    
    expect(screen.getByText('cd ~')).toBeInTheDocument()
    expect(screen.getByText('cat ~/.profile')).toBeInTheDocument()
    expect(screen.getByText('ls ~/projects')).toBeInTheDocument()
    expect(screen.getByText('cat ~/.contacts')).toBeInTheDocument()
  })

  it('プロンプト記号が表示される', () => {
    render(<NavigationWrapper />)
    
    const promptElements = screen.getAllByText('$')
    expect(promptElements.length).toBeGreaterThan(0)
  })

  it('whoami コマンドが表示される', () => {
    render(<NavigationWrapper />)
    
    expect(screen.getByText('whoami')).toBeInTheDocument()
  })

  it('ナビゲーションリンクが正しいパスを持つ', () => {
    render(<NavigationWrapper />)
    
    const homeLink = screen.getByRole('link', { name: /cd ~/ })
    const aboutLink = screen.getByRole('link', { name: /cat \.profile/ })
    const projectsLink = screen.getByRole('link', { name: /ls ~\/projects/ })
    const contactLink = screen.getByRole('link', { name: /cat \.contacts/ })
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(aboutLink).toHaveAttribute('href', '/about')
    expect(projectsLink).toHaveAttribute('href', '/projects')
    expect(contactLink).toHaveAttribute('href', '/contact')
  })
})