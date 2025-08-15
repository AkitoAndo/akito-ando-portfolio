import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // 実際のフォーム送信処理（例：Netlify Forms、FormSubmit等）
      // ここでは仮の実装
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <>
      <Helmet>
        <title>コンタクト - Akito Ando</title>
        <meta name="description" content="Akito Andoへのお問い合わせ。プロジェクトのご相談、技術的な議論、コラボレーションなどお気軽にご連絡ください。" />
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <div className="prompt">$</div>
          <div className="command">cat ~/.contacts</div>
        </motion.div>

        <div className="output">
          {/* 基本連絡先 */}
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-xl text-green-400 mb-4">連絡先</h2>
            
            <div className="grid grid-2 gap-4 mb-6">
              <motion.a
                href="mailto:akito.ando@example.com"
                className="bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-green-400 mb-2">📧 メール</h3>
                <p className="text-sm text-gray-300">akito.ando@example.com</p>
              </motion.a>

              <motion.a
                href="https://github.com/akito-ando"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-green-400 mb-2">🐙 GitHub</h3>
                <p className="text-sm text-gray-300">@akito-ando</p>
              </motion.a>

              <motion.a
                href="https://linkedin.com/in/akito-ando"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-green-400 mb-2">💼 LinkedIn</h3>
                <p className="text-sm text-gray-300">linkedin.com/in/akito-ando</p>
              </motion.a>

              <motion.a
                href="https://twitter.com/akito_ando_dev"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 border border-gray-600 p-4 rounded hover:border-green-400 transition-colors block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-green-400 mb-2">🐦 Twitter</h3>
                <p className="text-sm text-gray-300">@akito_ando_dev</p>
              </motion.a>
            </div>
          </motion.section>

          {/* コンタクトフォーム */}
          <motion.section variants={itemVariants}>
            <div className="mb-4">
              <div className="prompt">$</div>
              <div className="command">nano /tmp/message.txt</div>
            </div>

            <div className="bg-gray-800 border border-gray-600 p-6 rounded">
              <h2 className="text-xl text-green-400 mb-4">メッセージを送信</h2>
              
              {submitStatus === 'success' && (
                <motion.div
                  className="success mb-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  メッセージが正常に送信されました。お返事をお待ちください！
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  className="error mb-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  送信中にエラーが発生しました。再度お試しいただくか、直接メールでご連絡ください。
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-green-400 mb-2">
                      お名前 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                      placeholder="山田太郎"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-green-400 mb-2">
                      メールアドレス *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm text-green-400 mb-2">
                    件名 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  >
                    <option value="">件名を選択してください</option>
                    <option value="project">プロジェクトのご相談</option>
                    <option value="collaboration">コラボレーション</option>
                    <option value="technical">技術的な質問</option>
                    <option value="job">求人・採用について</option>
                    <option value="speaking">講演・イベント依頼</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-green-400 mb-2">
                    メッセージ *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full resize-vertical"
                    placeholder="ご用件をお聞かせください..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed border border-green-400 text-green-400 py-3 rounded transition-colors"
                  whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
                  whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loading">送信中</span>
                    </span>
                  ) : (
                    '送信する'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.section>

          {/* 追加情報 */}
          <motion.section variants={itemVariants} className="mt-8">
            <div className="mb-4">
              <div className="prompt">$</div>
              <div className="command">cat ~/.availability</div>
            </div>
            
            <div className="bg-gray-800 border border-gray-600 p-4 rounded">
              <h3 className="text-green-400 mb-3">対応について</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 通常24時間以内にお返事いたします</li>
                <li>• 技術的な質問やプロジェクトの相談は大歓迎です</li>
                <li>• 現在フリーランスとして新規案件を受け付けております</li>
                <li>• オープンソースプロジェクトへの貢献も積極的に行っています</li>
              </ul>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </>
  )
}

export default Contact