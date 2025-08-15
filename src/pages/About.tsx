import React from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useMarkdown } from '../hooks/useMarkdown'
import LoadingSpinner from '../components/LoadingSpinner'

const About: React.FC = () => {
  const { content, isLoading, error } = useMarkdown('profile.md')

  if (error) {
    return (
      <>
        <Helmet>
          <title>プロフィール - Akito Ando</title>
        </Helmet>
        
        <div className="mb-4">
          <div className="prompt">$</div>
          <div className="command">cat ~/.profile</div>
        </div>
        <div className="output">
          <div className="error">
            プロフィール情報の読み込みに失敗しました: {error}
          </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>プロフィール - Akito Ando</title>
        </Helmet>
        
        <div className="mb-4">
          <div className="prompt">$</div>
          <div className="command">cat ~/.profile</div>
        </div>
        <div className="output">
          <LoadingSpinner message="プロフィール情報を読み込み中" className="py-12" />
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>プロフィール - Akito Ando</title>
        <meta name="description" content="Akito Andoの詳しいプロフィール - 経歴、専門分野、価値観、趣味・興味について" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <div className="prompt">$</div>
          <div className="command">cat ~/.profile</div>
        </div>
        
        <div className="output">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl text-green-400 mb-4 border-b border-gray-600 pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl text-green-400 mb-3 mt-6 border-b border-gray-700 pb-1">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg text-green-400 mb-2 mt-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-300 mb-3 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="text-gray-300 ml-4">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-green-400 pl-4 my-4 italic text-green-200 bg-gray-800 py-2 rounded-r">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="text-green-400 font-bold">
                  {children}
                </strong>
              ),
              code: ({ children }) => (
                <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm">
                  {children}
                </code>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  {children}
                </a>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* 追加の統計情報 */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="mb-4">
            <div className="prompt">$</div>
            <div className="command">cat ~/.stats</div>
          </div>
          <div className="output">
            <h2 className="text-xl text-green-400 mb-4">現在の状況</h2>
            <div className="grid grid-2 gap-4">
              <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                <h3 className="text-green-400 mb-2">📍 現在地</h3>
                <p className="text-gray-300">東京, 日本</p>
              </div>
              <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                <h3 className="text-green-400 mb-2">💼 稼働状況</h3>
                <p className="text-gray-300">フリーランス（新規案件受付中）</p>
              </div>
              <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                <h3 className="text-green-400 mb-2">🎯 現在の学習</h3>
                <p className="text-gray-300">Rust, WebAssembly</p>
              </div>
              <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                <h3 className="text-green-400 mb-2">🚀 次のプロジェクト</h3>
                <p className="text-gray-300">AI統合Webアプリケーション</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default About