// URL Fetcher - GitHub, LinkedIn 등 외부 URL 정보 가져오기

export interface GitHubProfile {
  login: string
  name: string | null
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  updated_at: string
}

export interface ExternalProfileData {
  github?: {
    profile: GitHubProfile | null
    repos: GitHubRepo[]
    pinnedRepos?: GitHubRepo[]
  }
  linkedin?: {
    available: boolean
    message: string
  }
}

// GitHub 사용자명 추출
const extractGitHubUsername = (url: string): string | null => {
  const match = url.match(/github\.com\/([^/?]+)/)
  return match ? match[1] : null
}

// GitHub 프로필 정보 가져오기
export const fetchGitHubProfile = async (username: string): Promise<GitHubProfile | null> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-RAG-Bot',
      },
    })

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`)
      return null
    }

    return await response.json()
  }
  catch (error) {
    console.error('GitHub profile fetch error:', error)
    return null
  }
}

// GitHub 레포지토리 목록 가져오기
export const fetchGitHubRepos = async (
  username: string,
  limit: number = 10,
): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-RAG-Bot',
        },
      },
    )

    if (!response.ok) {
      console.error(`GitHub Repos API error: ${response.status}`)
      return []
    }

    const repos = await response.json()
    return repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      topics: repo.topics || [],
      updated_at: repo.updated_at,
    }))
  }
  catch (error) {
    console.error('GitHub repos fetch error:', error)
    return []
  }
}

// GitHub Pinned 레포지토리 가져오기 (GraphQL API)
export const fetchGitHubPinnedRepos = async (username: string): Promise<GitHubRepo[]> => {
  const token = Deno.env.get('GITHUB_TOKEN')

  // 토큰이 없으면 일반 레포 목록 반환
  if (!token) {
    return []
  }

  try {
    const query = `
      query {
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                primaryLanguage { name }
                stargazerCount
                forkCount
                repositoryTopics(first: 5) {
                  nodes { topic { name } }
                }
                updatedAt
              }
            }
          }
        }
      }
    `

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      console.error(`GitHub GraphQL API error: ${response.status}`)
      return []
    }

    const data = await response.json()
    const pinnedItems = data.data?.user?.pinnedItems?.nodes || []

    return pinnedItems.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.url,
      language: repo.primaryLanguage?.name || null,
      stargazers_count: repo.stargazerCount,
      forks_count: repo.forkCount,
      topics: repo.repositoryTopics?.nodes?.map((t: any) => t.topic.name) || [],
      updated_at: repo.updatedAt,
    }))
  }
  catch (error) {
    console.error('GitHub pinned repos fetch error:', error)
    return []
  }
}

// 외부 프로필 데이터 통합 가져오기
export const fetchExternalProfiles = async (
  socialLinks: Array<{ platform: string, url: string }> | null,
): Promise<ExternalProfileData> => {
  const result: ExternalProfileData = {}

  if (!socialLinks || socialLinks.length === 0) {
    return result
  }

  // GitHub 링크 찾기
  const githubLink = socialLinks.find(
    link => link.platform.toLowerCase() === 'github'
      || link.url.includes('github.com'),
  )

  console.log('[GitHub] Found link:', githubLink)

  if (githubLink) {
    const username = extractGitHubUsername(githubLink.url)
    console.log('[GitHub] Extracted username:', username, 'from URL:', githubLink.url)

    if (username) {
      // 병렬로 프로필과 레포 가져오기
      const [profile, repos, pinnedRepos] = await Promise.all([
        fetchGitHubProfile(username),
        fetchGitHubRepos(username, 10),
        fetchGitHubPinnedRepos(username),
      ])

      result.github = {
        profile,
        repos,
        pinnedRepos: pinnedRepos.length > 0 ? pinnedRepos : undefined,
      }
    }
  }

  // LinkedIn 링크 찾기
  const linkedinLink = socialLinks.find(
    link => link.platform.toLowerCase() === 'linkedin'
      || link.url.includes('linkedin.com'),
  )

  if (linkedinLink) {
    // LinkedIn은 공개 API가 없어서 URL만 제공
    result.linkedin = {
      available: true,
      message: `LinkedIn 프로필은 직접 방문해주세요: ${linkedinLink.url}`,
    }
  }

  return result
}

// GitHub 정보를 자연어로 요약
export const summarizeGitHubProfile = (data: ExternalProfileData['github']): string => {
  if (!data || !data.profile) {
    return ''
  }

  const { profile, repos, pinnedRepos } = data
  const lines: string[] = []

  // 프로필 정보
  lines.push(`GitHub 프로필: ${profile.name || profile.login}`)
  if (profile.bio) lines.push(`소개: ${profile.bio}`)
  if (profile.company) lines.push(`소속: ${profile.company}`)
  if (profile.location) lines.push(`위치: ${profile.location}`)
  lines.push(`공개 레포지토리: ${profile.public_repos}개`)
  lines.push(`팔로워: ${profile.followers}명`)

  // Pinned 레포 (우선) 또는 최근 레포
  const displayRepos = pinnedRepos && pinnedRepos.length > 0 ? pinnedRepos : repos.slice(0, 5)
  if (displayRepos.length > 0) {
    lines.push('\n주요 프로젝트:')
    displayRepos.forEach((repo) => {
      const stars = repo.stargazers_count > 0 ? ` ⭐${repo.stargazers_count}` : ''
      const lang = repo.language ? ` [${repo.language}]` : ''
      lines.push(`- ${repo.name}${lang}${stars}: ${repo.description || '설명 없음'}`)
    })
  }

  return lines.join('\n')
}
