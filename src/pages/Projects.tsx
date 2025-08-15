import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { githubAPI, type GitHubRepo } from '../services/githubApi'
import LoadingSpinner from '../components/LoadingSpinner'

interface ProjectCardProps {
  repo: GitHubRepo
  index: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ repo, index }) => (
  <motion.div
    className="bg-gray-800 border border-gray-600 rounded p-4 hover:border-green-400 transition-colors"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
  >
    <h3 className="text-green-400 text-lg mb-2 font-bold">
      {repo.name}
    </h3>
    
    <p className="text-gray-300 mb-4 text-sm">
      {repo.description || 'プロジェクトの説明がありません'}
    </p>
    
    <div className="flex flex-wrap gap-2 mb-4">
      {repo.topics?.slice(0, 3).map(topic => (
        <span
          key={topic}
          className="text-xs bg-gray-700 text-green-300 px-2 py-1 rounded"
        >
          {topic}
        </span>
      ))}
    </div>
    
    <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
      <div className="flex gap-4">
        <span className="flex items-center gap-1">
          ⭐ {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          🍴 {repo.forks_count}
        </span>
        {repo.language && (
          <span className="flex items-center gap-1">
            💻 {repo.language}
          </span>
        )}
      </div>
    </div>
    
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">
        📅 {githubAPI.formatDate(repo.updated_at)}
      </span>
      <motion.a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:text-green-300 text-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        GitHubで見る →
      </motion.a>
    </div>
  </motion.div>
)

const Projects: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // まずピン留めリポジトリを取得
        let repositories = await githubAPI.getPinnedRepositories()
        
        if (repositories.length === 0) {
          // フォールバック: 全リポジトリを取得
          repositories = await githubAPI.getRepositories('stars')
        }

        if (repositories.length === 0) {
          // 最終フォールバック: ローカルデータを使用
          const fallbackData = await githubAPI.getFallbackData()
          if (fallbackData?.pinnedRepositories) {
            repositories = fallbackData.pinnedRepositories
          }
        }

        setRepos(repositories)
      } catch (err) {
        setError('プロジェクトの読み込みに失敗しました')
        console.error('Failed to load projects:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const filteredRepos = repos.filter(repo => {
    if (filter === 'all') {return true}
    if (filter === 'featured') {return repo.stargazers_count > 10}
    return repo.language?.toLowerCase() === filter.toLowerCase()
  })

  const languages = Array.from(new Set(repos.map(repo => repo.language).filter(Boolean)))

  return (
    <>
      <Helmet>
        <title>プロジェクト - Akito Ando</title>
        <meta name="description" content="Akito Andoが手がけた主要プロジェクト一覧。JavaScript、TypeScript、React、Node.js、Pythonなどを使用した開発実績。" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <div className="prompt">$</div>
          <div className="command">ls ~/projects/</div>
        </div>

        {/* フィルター */}
        <div className="output mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              すべて ({repos.length})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'featured' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              注目 ({repos.filter(r => r.stargazers_count > 10).length})
            </button>
            {languages.slice(0, 4).map(lang => (
              <button
                key={lang}
                onClick={() => setFilter(lang!)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === lang 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {lang} ({repos.filter(r => r.language === lang).length})
              </button>
            ))}
          </div>
        </div>

        <div className="output">
          {error && (
            <div className="error mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner message="GitHubからプロジェクト情報を読み込み中" className="py-12" />
          ) : filteredRepos.length > 0 ? (
            <>
              <h2 className="text-xl text-green-400 mb-6">
                {filter === 'all' ? '全プロジェクト' : 
                 filter === 'featured' ? '注目プロジェクト' :
                 `${filter} プロジェクト`} ({filteredRepos.length})
              </h2>
              
              <div className="grid grid-2 gap-6">
                {filteredRepos.map((repo, index) => (
                  <ProjectCard
                    key={repo.id}
                    repo={repo}
                    index={index}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-8">
              選択したフィルターに該当するプロジェクトはありません
            </div>
          )}
        </div>

        {/* GitHub統計 */}
        {repos.length > 0 && (
          <motion.div
            className="mt-8 pt-6 border-t border-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="mb-4">
              <div className="prompt">$</div>
              <div className="command">git log --stat --summary</div>
            </div>
            <div className="output">
              <h2 className="text-xl text-green-400 mb-4">開発統計</h2>
              <div className="grid grid-3 gap-4">
                <div className="bg-gray-800 border border-gray-600 p-4 rounded text-center">
                  <div className="text-2xl text-green-400 mb-2">
                    {repos.length}
                  </div>
                  <div className="text-sm text-gray-300">パブリックリポジトリ</div>
                </div>
                <div className="bg-gray-800 border border-gray-600 p-4 rounded text-center">
                  <div className="text-2xl text-green-400 mb-2">
                    {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                  </div>
                  <div className="text-sm text-gray-300">合計スター数</div>
                </div>
                <div className="bg-gray-800 border border-gray-600 p-4 rounded text-center">
                  <div className="text-2xl text-green-400 mb-2">
                    {languages.length}
                  </div>
                  <div className="text-sm text-gray-300">使用言語数</div>
                </div>
              </div>
              
              {/* 言語分布 */}
              <div className="mt-6">
                <h3 className="text-lg text-green-400 mb-3">主要言語</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.slice(0, 8).map(lang => (
                    <span
                      key={lang}
                      className="bg-gray-800 border border-gray-600 px-3 py-1 rounded text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

export default Projects