import axios from 'axios'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  private: boolean
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
}

class GitHubAPIService {
  private baseURL = 'https://api.github.com'
  private username = 'akito-ando'
  
  // キャッシュ管理
  private cache = new Map<string, { data: unknown; timestamp: number }>()
  private cacheTTL = 5 * 60 * 1000 // 5分

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getUserInfo(): Promise<GitHubUser | null> {
    const cacheKey = `user_${this.username}`
    const cached = this.getFromCache<GitHubUser>(cacheKey)
    if (cached) {return cached}

    try {
      const response = await axios.get<GitHubUser>(`${this.baseURL}/users/${this.username}`)
      this.setCache(cacheKey, response.data)
      return response.data
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      return null
    }
  }

  async getRepositories(sort: 'updated' | 'stars' | 'created' = 'updated'): Promise<GitHubRepo[]> {
    const cacheKey = `repos_${this.username}_${sort}`
    const cached = this.getFromCache<GitHubRepo[]>(cacheKey)
    if (cached) {return cached}

    try {
      const response = await axios.get<GitHubRepo[]>(`${this.baseURL}/users/${this.username}/repos`, {
        params: {
          sort,
          direction: 'desc',
          per_page: 50,
          type: 'all'
        }
      })
      
      const filteredRepos = response.data.filter(repo => !repo.private)
      this.setCache(cacheKey, filteredRepos)
      return filteredRepos
    } catch (error) {
      console.error('Failed to fetch repositories:', error)
      return []
    }
  }

  async getPinnedRepositories(): Promise<GitHubRepo[]> {
    // GitHub GraphQL APIを使用してピン留めリポジトリを取得するか、
    // フォールバックとして人気のリポジトリを返す
    const cacheKey = `pinned_${this.username}`
    const cached = this.getFromCache<GitHubRepo[]>(cacheKey)
    if (cached) {return cached}

    try {
      // フォールバック: スター数の多い上位6つのリポジトリを返す
      const repos = await this.getRepositories('stars')
      const pinned = repos.slice(0, 6)
      this.setCache(cacheKey, pinned)
      return pinned
    } catch (error) {
      console.error('Failed to fetch pinned repositories:', error)
      return []
    }
  }

  async getRepository(repoName: string): Promise<GitHubRepo | null> {
    const cacheKey = `repo_${this.username}_${repoName}`
    const cached = this.getFromCache<GitHubRepo>(cacheKey)
    if (cached) {return cached}

    try {
      const response = await axios.get<GitHubRepo>(`${this.baseURL}/repos/${this.username}/${repoName}`)
      this.setCache(cacheKey, response.data)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch repository ${repoName}:`, error)
      return null
    }
  }

  // ローカルのJSONファイルからデータを取得（フォールバック）
  async getFallbackData(): Promise<unknown> {
    try {
      const response = await fetch('/docs/api/github.json')
      if (!response.ok) {
        throw new Error('Failed to fetch fallback data')
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch fallback data:', error)
      return null
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
}

// シングルトンインスタンスをエクスポート
export const githubAPI = new GitHubAPIService()
export default githubAPI