import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - ページが見つかりません | Akito Ando</title>
        <meta name="description" content="お探しのページは見つかりませんでした。" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-4">
          <div className="prompt">$</div>
          <div className="command">ls /requested/page</div>
        </div>
        
        <div className="output">
          <motion.div
            className="mb-8"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl text-green-400 mb-4 font-mono">404</h1>
            <div className="error text-lg mb-4">
              ls: /requested/page: そのようなファイルやディレクトリはありません
            </div>
          </motion.div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-300 mb-6">
              お探しのページは見つかりませんでした。<br />
              URLを確認していただくか、以下のリンクからナビゲーションしてください。
            </p>
          </motion.div>

          <motion.div
            className="grid grid-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                className="block bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors"
              >
                <div className="prompt mb-1">$</div>
                <div className="command text-green-400">cd ~</div>
                <div className="text-sm text-gray-300 mt-2">ホームページに戻る</div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/projects"
                className="block bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors"
              >
                <div className="prompt mb-1">$</div>
                <div className="command text-green-400">ls ~/projects</div>
                <div className="text-sm text-gray-300 mt-2">プロジェクト一覧を見る</div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/about"
                className="block bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors"
              >
                <div className="prompt mb-1">$</div>
                <div className="command text-green-400">cat ~/.profile</div>
                <div className="text-sm text-gray-300 mt-2">プロフィールを見る</div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="block bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors"
              >
                <div className="prompt mb-1">$</div>
                <div className="command text-green-400">cat ~/.contacts</div>
                <div className="text-sm text-gray-300 mt-2">連絡先を見る</div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="mb-4">
              <div className="prompt">$</div>
              <div className="command">history | grep &quot;useful_commands&quot;</div>
            </div>
            <div className="text-left bg-gray-800 border border-gray-600 p-4 rounded">
              <div className="text-sm text-gray-400 space-y-1">
                <div><span className="text-green-400">git status</span> - 現在の状況を確認</div>
                <div><span className="text-green-400">pwd</span> - 現在地を表示</div>
                <div><span className="text-green-400">ls -la</span> - 利用可能なページを一覧</div>
                <div><span className="text-green-400">cd ..</span> - 一つ上のディレクトリに移動</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
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
      </motion.div>
    </>
  )
}

export default NotFound