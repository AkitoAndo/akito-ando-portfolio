import React from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Next.js',
    'Node.js', 'Python', 'Go', 'Docker',
    'PostgreSQL', 'MongoDB', 'AWS', 'Git'
  ]

  return (
    <>
      <Helmet>
        <title>Akito Ando - Portfolio</title>
        <meta name="description" content="Akito Ando - フルスタック開発者のポートフォリオサイト。JavaScript、TypeScript、React、Node.jsなどを使用した開発実績をご紹介。" />
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* メインセクション */}
        <motion.section className="mb-8" variants={itemVariants}>
          <div className="mb-4">
            <div className="prompt">$</div>
            <div className="command">whoami</div>
          </div>
          <div className="output">
            <h1 className="text-xl mb-3">Akito Ando</h1>
            <p className="mb-2">フルスタック開発者 & オープンソースコントリビューター</p>
            <p>JavaScript, TypeScript, React, Node.js, Python, Go で革新的なソリューションを構築</p>
          </div>
        </motion.section>

        {/* スキルセクション */}
        <motion.section className="mb-8" variants={itemVariants}>
          <div className="mb-4">
            <div className="prompt">$</div>
            <div className="command">ls ~/skills/</div>
          </div>
          <div className="output">
            <h2 className="mb-4">技術スタック</h2>
            <div className="grid grid-4 gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  className="bg-gray-800 border border-gray-600 p-2 rounded text-center text-green-400"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, backgroundColor: '#374151' }}
                  transition={{ delay: index * 0.05 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 簡単な紹介セクション */}
        <motion.section className="mb-8" variants={itemVariants}>
          <div className="mb-4">
            <div className="prompt">$</div>
            <div className="command">cat ~/.summary</div>
          </div>
          <div className="output">
            <h2 className="mb-4">概要</h2>
            <p className="mb-3">
              5年以上の開発経験を持つフルスタック開発者です。
              革新的なソリューションの構築と、実用的なアプリケーションの開発に情熱を注いでいます。
            </p>
            <p className="mb-3">
              ユーザー体験を重視し、パフォーマンスと保守性の高いコードを書くことを心がけています。
              最新の技術トレンドを追いかけ、オープンソースプロジェクトへの貢献にも積極的です。
            </p>
          </div>
        </motion.section>

        {/* クイックリンク */}
        <motion.section className="mb-8" variants={itemVariants}>
          <div className="mb-4">
            <div className="prompt">$</div>
            <div className="command">ls ~/quick-links/</div>
          </div>
          <div className="output">
            <h2 className="mb-4">クイックアクセス</h2>
            <div className="grid grid-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/projects"
                  className="block bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors"
                >
                  <h3 className="text-green-400 mb-2">📁 プロジェクト</h3>
                  <p className="text-sm text-gray-300">
                    これまでに手がけた主要プロジェクトと技術的な取り組みをご覧ください
                  </p>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/about"
                  className="block bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors"
                >
                  <h3 className="text-green-400 mb-2">👤 詳しいプロフィール</h3>
                  <p className="text-sm text-gray-300">
                    経歴、専門分野、価値観など詳細な情報をご確認いただけます
                  </p>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* GitHub統計 */}
        <motion.section className="mb-8" variants={itemVariants}>
          <div className="mb-4">
            <div className="prompt">$</div>
            <div className="command">git --version && git log --oneline --since=&quot;1 year ago&quot; | wc -l</div>
          </div>
          <div className="output">
            <h2 className="mb-4">GitHub活動統計</h2>
            <div className="grid grid-3 gap-4">
              <div className="bg-gray-800 border border-gray-600 p-4 rounded text-center">
                <div className="text-2xl text-green-400 mb-2">42+</div>
                <div className="text-sm text-gray-300">リポジトリ</div>
              </div>
              <div className="bg-gray-800 border border-gray-600 p-4 rounded text-center">
                <div className="text-2xl text-green-400 mb-2">1200+</div>
                <div className="text-sm text-gray-300">コントリビューション</div>
              </div>
              <div className="bg-gray-800 border border-gray-600 p-4 rounded text-center">
                <div className="text-2xl text-green-400 mb-2">350+</div>
                <div className="text-sm text-gray-300">スター獲得</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* コンタクトCTA */}
        <motion.section variants={itemVariants}>
          <div className="mb-4">
            <div className="prompt">$</div>
            <div className="command">echo &quot;Let&apos;s work together!&quot;</div>
          </div>
          <div className="output">
            <h2 className="mb-4">お気軽にご連絡ください</h2>
            <p className="mb-4">
              プロジェクトのご相談、技術的な議論、コラボレーションなど、
              どのようなことでもお気軽にお声がけください。
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="inline-block bg-gray-800 border border-green-400 px-6 py-3 rounded hover:bg-gray-700 transition-colors"
              >
                連絡先を見る
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </>
  )
}

export default Home