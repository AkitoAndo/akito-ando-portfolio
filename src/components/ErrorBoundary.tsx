import { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.reload()
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          className="min-h-screen flex items-center justify-center bg-black text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="terminal max-w-2xl mx-auto">
            <div className="mb-4">
              <div className="prompt">$</div>
              <div className="command">systemctl status portfolio-app</div>
            </div>
            
            <div className="output">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="error mb-6">
                  <h1 className="text-2xl mb-4">⚠️ システムエラーが発生しました</h1>
                  <p className="mb-4">
                    申し訳ございません。アプリケーションでエラーが発生しました。
                  </p>
                  
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="bg-gray-900 border border-gray-600 p-4 rounded mb-4">
                      <summary className="cursor-pointer text-sm text-gray-400 mb-2">
                        開発者向け詳細情報
                      </summary>
                      <div className="text-xs text-gray-300 space-y-2">
                        <div>
                          <strong>エラー:</strong> {this.state.error.message}
                        </div>
                        <div>
                          <strong>スタックトレース:</strong>
                          <pre className="mt-1 overflow-x-auto">
                            {this.state.error.stack}
                          </pre>
                        </div>
                        {this.state.errorInfo && (
                          <div>
                            <strong>コンポーネントスタック:</strong>
                            <pre className="mt-1 overflow-x-auto">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="grid grid-2 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={this.handleRetry}
                  className="bg-gray-800 border border-green-400 p-4 rounded hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="prompt mb-1">$</div>
                  <div className="command text-green-400">retry</div>
                  <div className="text-sm text-gray-300 mt-2">再試行する</div>
                </motion.button>

                <motion.button
                  onClick={this.handleReload}
                  className="bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="prompt mb-1">$</div>
                  <div className="command text-green-400">systemctl restart portfolio-app</div>
                  <div className="text-sm text-gray-300 mt-2">ページを再読み込み</div>
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="mb-4">
                  <div className="prompt">$</div>
                  <div className="command">echo &quot;お困りの場合&quot;</div>
                </div>
                
                <div className="bg-gray-800 border border-gray-600 p-4 rounded text-sm">
                  <div className="text-gray-300 space-y-2">
                    <div>📧 メール: <a href="mailto:akito.ando@example.com" className="text-green-400 hover:text-green-300">akito.ando@example.com</a></div>
                    <div>🐙 GitHub: <a href="https://github.com/akito-ando" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">@akito-ando</a></div>
                    <div>🐦 Twitter: <a href="https://twitter.com/akito_ando_dev" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">@akito_ando_dev</a></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mt-6 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="prompt">$</div>
                <motion.span
                  className="cursor ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  █
                </motion.span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary