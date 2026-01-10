import { getSupabaseClient } from './supabase.ts'
import {
  fetchExternalProfiles,
  summarizeGitHubProfile,
} from './url-fetcher.ts'
import { getEmbedding } from './embeddings.ts'
import type {
  RAGContext,
  AISettingsMap,
  Profile,
  Experience,
  Skill,
  Project,
  Education,
  Hobby,
  Certification,
  SocialLink,
  ImageArchive,
  Threejs,
  AISetting,
} from './types.ts'

// 키워드 매칭 헬퍼
const matchKeywords = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase()
  return keywords.some(keyword => lowerText.includes(keyword))
}

// 년도 추출 헬퍼
const extractYear = (text: string): number | null => {
  const match = text.match(/(\d{4})년?/)
  return match ? parseInt(match[1]) : null
}

// 컨텍스트에 데이터가 있는지 확인
const hasRelevantData = (context: RAGContext): boolean => {
  return !!(
    context.profile
    || (context.experience && context.experience.length > 0)
    || (context.skills && context.skills.length > 0)
    || (context.projects && context.projects.length > 0)
    || (context.education && context.education.length > 0)
    || (context.hobbies && context.hobbies.length > 0)
    || (context.socialLinks && context.socialLinks.length > 0)
    || (context.images && context.images.length > 0)
    || (context.threejs && context.threejs.length > 0)
  )
}

// 벡터 검색 결과를 컨텍스트로 변환
const enrichContextFromVectorMatches = async (
  context: RAGContext,
  matches: Array<{
    document_type: string
    document_id: string
    similarity: number
    metadata: any
  }>,
  supabase: ReturnType<typeof getSupabaseClient>,
): Promise<void> => {
  // 유사도가 높은 순으로 정렬
  const sortedMatches = matches.sort((a, b) => b.similarity - a.similarity)

  // 이미 데이터가 있는지 확인하는 매핑
  const hasDataMap: Record<string, () => boolean> = {
    profile: () => !!context.profile,
    experience: () => !!(context.experience && context.experience.length > 0),
    skills: () => !!(context.skills && context.skills.length > 0),
    project: () => !!(context.projects && context.projects.length > 0),
    education: () => !!(context.education && context.education.length > 0),
    hobbies: () => !!(context.hobbies && context.hobbies.length > 0),
    certifications: () => !!(context.certifications && context.certifications.length > 0),
    social_links: () => !!(context.socialLinks && context.socialLinks.length > 0),
    image_archive: () => !!(context.images && context.images.length > 0),
    threejs: () => !!(context.threejs && context.threejs.length > 0),
    weaknesses: () => !!(context.profile?.weaknesses && context.profile.weaknesses.length > 0),
    contact: () => !!(context.profile && context.socialLinks && context.socialLinks.length > 0),
  }

  // 필터링: 유사도 체크 및 이미 데이터가 있는지 확인
  const validMatches = sortedMatches.filter((match) => {
    // 유사도가 낮으면 스킵 (0.7 미만)
    if (match.similarity < 0.7) {
      return false
    }
    // 이미 키워드 매칭으로 데이터가 있으면 스킵
    const hasData = hasDataMap[match.document_type]
    if (hasData && hasData()) {
      return false
    }
    return true
  })

  // 각 매치를 병렬로 처리
  const handlers: Record<string, (match: typeof validMatches[0]) => Promise<void>> = {
    profile: async (match) => {
      if (!context.profile) {
        const { data } = await supabase
          .schema('resume')
          .from('profile')
          .select('*')
          .eq('id', match.document_id)
          .single<Profile>()
        if (data) {
          context.profile = data
        }
      }
    },
    experience: async (match) => {
      if (!context.experience) {
        const { data } = await supabase
          .schema('resume')
          .from('experience')
          .select('*')
          .eq('id', match.document_id)
          .returns<Experience[]>()
        if (data && data.length > 0) {
          context.experience = data
        }
      }
    },
    skills: async () => {
      if (!context.skills) {
        const { data } = await supabase
          .schema('resume')
          .from('skills')
          .select('*')
          .order('order_index', { ascending: false })
          .returns<Skill[]>()
        if (data) {
          context.skills = data
        }
      }
    },
    project: async (match) => {
      if (!context.projects) {
        const { data } = await supabase
          .schema('resume')
          .from('projects')
          .select('*')
          .eq('id', match.document_id)
          .eq('deleted', false)
          .returns<Project[]>()
        if (data && data.length > 0) {
          context.projects = data
        }
      }
    },
    education: async (match) => {
      if (!context.education) {
        const { data } = await supabase
          .schema('resume')
          .from('education')
          .select('*')
          .eq('id', match.document_id)
          .returns<Education[]>()
        if (data && data.length > 0) {
          context.education = data
        }
      }
    },
    hobbies: async () => {
      if (!context.hobbies) {
        const { data } = await supabase
          .schema('resume')
          .from('hobbies')
          .select('*')
          .order('order_index')
          .returns<Hobby[]>()
        if (data) {
          context.hobbies = data
        }
      }
    },
    social_links: async () => {
      if (!context.socialLinks) {
        const { data } = await supabase
          .schema('resume')
          .from('social_links')
          .select('*')
          .order('order_index', { ascending: false })
          .returns<SocialLink[]>()
        if (data) {
          context.socialLinks = data
        }
      }
    },
    image_archive: async (match) => {
      if (!context.images) {
        const { data } = await supabase
          .schema('resume')
          .from('image_archive')
          .select('*')
          .eq('id', match.document_id)
          .eq('deleted', false)
          .returns<ImageArchive[]>()
        if (data && data.length > 0) {
          context.images = data
        }
      }
    },
    weaknesses: async (match) => {
      if (!context.profile?.weaknesses || context.profile.weaknesses.length === 0) {
        const { data } = await supabase
          .schema('resume')
          .from('profile')
          .select('*')
          .eq('id', match.document_id)
          .single<Profile>()
        if (data && data.weaknesses && data.weaknesses.length > 0) {
          context.profile = data
        }
      }
    },
    contact: async (match) => {
      if (!context.profile) {
        const { data } = await supabase
          .schema('resume')
          .from('profile')
          .select('*')
          .eq('id', match.document_id)
          .single<Profile>()
        if (data) {
          context.profile = data
        }
      }
      if (!context.socialLinks) {
        const { data } = await supabase
          .schema('resume')
          .from('social_links')
          .select('*')
          .order('order_index', { ascending: false })
          .returns<SocialLink[]>()
        if (data) {
          context.socialLinks = data
        }
      }
    },
    certifications: async () => {
      if (!context.certifications) {
        const { data } = await supabase
          .schema('resume')
          .from('certifications')
          .select('*')
          .eq('deleted', false)
          .order('order_index', { ascending: true })
          .returns<Certification[]>()
        if (data) {
          context.certifications = data
        }
      }
    },
    threejs: async () => {
      if (!context.threejs) {
        const { data } = await supabase
          .schema('resume')
          .from('threejs')
          .select('*')
          .eq('deleted', false)
          .order('order_index', { ascending: false })
          .returns<Threejs[]>()
        if (data) {
          context.threejs = data
        }
      }
    },
  }

  await Promise.all(validMatches.map(async (match) => {
    try {
      const handler = handlers[match.document_type]
      if (handler) {
        await handler(match)
      }
    }
    catch (error) {
      console.error(`Error enriching context for ${match.document_type}:`, error)
    }
  }))
}

// 키워드 매칭 시도 (기존 로직)
const tryKeywordMatching = async (
  queryLower: string,
  context: RAGContext,
  supabase: ReturnType<typeof getSupabaseClient>,
): Promise<boolean> => {
  let matched = false

  // 종합적인 질문 감지
  const isComprehensiveQuestion = matchKeywords(queryLower, [
    '어떤 개발자',
    '어떤 사람',
    '종합적',
    '전체적',
    '리더',
    '어떤 리더',
    '한마디로',
    '요약',
    '정리',
    '특징',
    '강점',
    '장점',
  ])

  if (isComprehensiveQuestion) {
    const { data: profile } = await supabase
      .schema('resume')
      .from('profile')
      .select('*')
      .single()
    context.profile = profile

    const { data: skills } = await supabase
      .schema('resume')
      .from('skills')
      .select('*')
      .eq('proficiency', 5)
      .limit(10)
    context.skills = skills

    const { data: projects } = await supabase
      .schema('resume')
      .from('projects')
      .select('title, tech_stack, highlights')
      .order('order_index', { ascending: false })
      .limit(5)
    context.projects = projects

    matched = true
    return true
  }

  // 인사말
  if (matchKeywords(queryLower, ['안녕', '하이', 'hi', 'hello', '반가워', '처음', '인사', '인사말', '인사하다', '인사하기', '인사하세요', '인사합니다', '인사합니다'])) {
    const { data } = await supabase
      .schema('resume')
      .from('profile')
      .select('*')
      .single<Profile>()
    context.profile = data
    matched = true
  }

  // 프로필
  if (matchKeywords(queryLower, ['자기소개', '누구', '프로필', '소개', '이름', '너는', 'introduce', 'name', 'who', 'profile', 'introduction', '철학', '가치관', '성격', '장점', '강점', 'philosophy', 'value', 'personality', 'strength'])) {
    const { data } = await supabase
      .schema('resume')
      .from('profile')
      .select('*')
      .single<Profile>()
    context.profile = data
    matched = true
  }

  // 단점/부족한 점
  if (matchKeywords(queryLower, ['단점', '부족', '아쉬운', '개선', '약점', '한계', '어려움', 'weakness', 'weaknesses', 'improvement', 'limitation', 'challenge', 'difficulty', '부족한 점', '아쉬운 점', '개선점', '개선할 점'])) {
    const { data } = await supabase
      .schema('resume')
      .from('profile')
      .select('*')
      .single<Profile>()
    context.profile = data
    matched = true
  }

  // 경력
  if (matchKeywords(queryLower, ['경력', '회사', '일', '직장', '커리어', '경험', '이직', 'career', 'company', 'job', 'work', 'experience', 'transition', '최근 경력', '경력이', '경력은', '어떻게 되', '어떻게 되요', '어떻게 되나'])) {
    const { data } = await supabase
      .schema('resume')
      .from('experience')
      .select('*')
      .order('order_index', { ascending: false })
      .returns<Experience[]>()
    context.experience = data
    matched = true
  }

  // 스킬
  if (matchKeywords(queryLower, ['스킬', '기여', '기술', '스택', '언어', '프레임워크', '뭘 잘', '역량', '능력', 'skill', 'contribution', 'stack', 'language', 'framework', 'ability', 'skillset', '기술적', '기술적인', '어떤 기술', '기술 고민', '기술 관심', '기술 역량', '기술 능력', '기술 스택', '사용 기술', '사용하는 기술', '어떤 스택', '어떤 도구', '어떤 프레임워크', '고민', '관심'])) {
    const { data } = await supabase
      .schema('resume')
      .from('skills')
      .select('*')
      .order('order_index', { ascending: false })
      .returns<Skill[]>()
    context.skills = data
    matched = true
  }

  // 프로젝트
  if (matchKeywords(queryLower, ['프로젝트', '만든', '개발', '포트폴리오', '작업', '작품', '진행', '했던', '최근', 'project', 'made', 'development', 'portfolio', 'work', 'product', 'recent', 'tell'])) {
    const { data } = await supabase
      .schema('resume')
      .from('projects')
      .select('*')
      .eq('deleted', false)
      .order('order_index', { ascending: false })
      .returns<Project[]>()
    context.projects = data
    matched = true
  }

  // 학력
  if (matchKeywords(queryLower, ['학력', '학교', '졸업', '전공', '대학', '교육', 'education', 'school', 'graduate', 'major', 'university', 'education'])) {
    const { data } = await supabase
      .schema('resume')
      .from('education')
      .select('*')
      .order('order_index', { ascending: false })
      .returns<Education[]>()
    context.education = data
    matched = true
  }

  // 취미
  if (matchKeywords(queryLower, ['취미', '관심사', '좋아하', '여가', '취향', 'hobby', 'interest', 'like', 'leisure', 'hobby', 'interest'])) {
    const { data } = await supabase
      .schema('resume')
      .from('hobbies')
      .select('*')
      .order('order_index')
      .returns<Hobby[]>()
    context.hobbies = data
    matched = true
  }

  // 인증서 자격증
  if (matchKeywords(queryLower, ['인증서', '자격증', '인증', '증명서', '자격', 'certificate', 'certification', 'certifications'])) {
    const { data } = await supabase
      .schema('resume')
      .from('certifications')
      .select('*')
      .eq('deleted', false)
      .order('order_index', { ascending: true })
      .returns<Certification[]>()
    context.certifications = data
    matched = true
  }

  // 소셜 링크 및 외부 프로필
  const isGitHubQuestion = matchKeywords(queryLower, ['깃헙', 'github', '깃허브', '레포', 'repo', '오픈소스', 'open source', '코드', 'code'])
  const isLinkedInQuestion = matchKeywords(queryLower, ['링크드인', 'linkedin', '링크인', '이력서', '커리어'])
  const isSocialQuestion = matchKeywords(queryLower, ['소셜', '연결', 'social', 'link', 'sns'])
  const isContactQuestion = matchKeywords(queryLower, ['연락', '컨택', '문의', '이메일', 'contact', 'inquiry', 'email', '메일'])

  if (isGitHubQuestion || isLinkedInQuestion || isSocialQuestion || isContactQuestion) {
    const { data } = await supabase
      .schema('resume')
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: false })
      .returns<SocialLink[]>()
    context.socialLinks = data

    if ((isGitHubQuestion || isLinkedInQuestion) && data && data.length > 0) {
      try {
        const externalData = await fetchExternalProfiles(data)

        if (externalData.github) {
          const summary = summarizeGitHubProfile(externalData.github)
          context.externalProfiles = {
            github: {
              profile: externalData.github.profile,
              repos: externalData.github.repos.slice(0, 5),
              summary,
            },
            linkedin: externalData.linkedin,
          }
        }
        else if (externalData.linkedin) {
          context.externalProfiles = {
            linkedin: externalData.linkedin,
          }
        }
      }
      catch (error) {
        console.error('External profile fetch error:', error)
      }
    }
    matched = true
  }

  // 이미지 아카이브
  if (matchKeywords(queryLower, ['사진', '이미지', '갤러리', '아카이브', '앨범', 'image', 'gallery', 'archive', 'album'])) {
    const year = extractYear(queryLower)
    context.imageYear = year

    let queryBuilder = supabase
      .schema('resume')
      .from('image_archive')
      .select('*')
      .eq('deleted', false)

    if (year) {
      queryBuilder = queryBuilder.eq('year', year)
    }

    const { data } = await queryBuilder
      .order('year', { ascending: false })
      .order('order_index', { ascending: true })
      .returns<ImageArchive[]>()

    context.images = data
    matched = true
  }

  // Three.js 작업물
  if (matchKeywords(queryLower, ['three.js', 'threejs', 'webgl', '웹gl', 'WEBGL', '웹지엘', '3d', '작업물', '작업', 'three.js 작업물', 'threejs 작업물', '3d 작업물', '웹gl 작업물', 'three.js 작품', 'threejs 작품'])) {
    const { data } = await supabase
      .schema('resume')
      .from('threejs')
      .select('*')
      .eq('deleted', false)
      .order('order_index', { ascending: false })
      .returns<Threejs[]>()
    context.threejs = data
    matched = true
  }

  return matched
}

// RAG: 질문 기반 데이터 검색 (하이브리드: 키워드 매칭 + 벡터 검색)
export const fetchRelevantData = async (query: string): Promise<RAGContext> => {
  const supabase = getSupabaseClient()
  const context: RAGContext = {}
  const queryLower = query.toLowerCase()

  // 1. 먼저 키워드 매칭 시도
  const keywordMatched = await tryKeywordMatching(queryLower, context, supabase)

  // 2. 키워드 매칭 성공하고 데이터가 충분하면 바로 반환
  if (keywordMatched && hasRelevantData(context)) {
    return context
  }

  // 3. 키워드 매칭 실패 또는 데이터 부족 → 벡터 검색 시도
  try {
    const queryEmbedding = await getEmbedding(query, 'openai')

    const { data: matches, error } = await supabase
      .schema('resume')
      .rpc('match_documents', {
        query_embedding: `[${queryEmbedding.join(',')}]`,
        match_threshold: 0.7,
        match_count: 5,
      })

    if (error) {
      console.error('Vector search error:', error)
    }
    else if (matches && matches.length > 0) {
      // 벡터 검색 결과로 컨텍스트 보강
      await enrichContextFromVectorMatches(context, matches, supabase)
    }
  }
  catch (error) {
    console.error('Vector search failed, using keyword matching results only:', error)
    // 벡터 검색 실패해도 키워드 매칭 결과는 반환
  }

  return context
}

// AI 설정 가져오기
export const getAISettings = async (): Promise<AISettingsMap> => {
  const supabase = getSupabaseClient()

  const { data } = await supabase
    .schema('resume')
    .from('ai_settings')
    .select('setting_key, setting_value')
    .returns<AISetting[]>()

  const settings: AISettingsMap = {}

  data?.forEach((item) => {
    settings[item.setting_key as keyof AISettingsMap] = item.setting_value
  })

  return settings
}
