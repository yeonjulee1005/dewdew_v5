import { getSupabaseClient } from './supabase.ts'
import {
  fetchExternalProfiles,
  summarizeGitHubProfile,
} from './url-fetcher.ts'
import type {
  RAGContext,
  AISettingsMap,
  Profile,
  Experience,
  Skill,
  Project,
  Education,
  Hobby,
  SocialLink,
  ImageArchive,
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

// RAG: 질문 기반 데이터 검색
export const fetchRelevantData = async (query: string): Promise<RAGContext> => {
  const supabase = getSupabaseClient()
  const context: RAGContext = {}
  const queryLower = query.toLowerCase()

  // 🆕 종합적인 질문 감지 (여러 데이터 조합)
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
    // 프로필 + 스킬 + 프로젝트 요약 모두 가져오기
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
      .eq('proficiency', 5) // 능숙한 것만
      .limit(10)
    context.skills = skills

    const { data: projects } = await supabase
      .schema('resume')
      .from('projects')
      .select('title, tech_stack, highlights')
      .order('order_index', { ascending: false })
      .limit(5) // 최근 5개만
    context.projects = projects

    return context // 바로 반환
  }

  // 인사말 - 프로필 데이터 가져오기
  if (matchKeywords(queryLower, ['안녕', '하이', 'hi', 'hello', '반가워', '처음', '인사', '인사말', '인사하다', '인사하기', '인사하세요', '인사합니다', '인사합니다'])) {
    const { data } = await supabase
      .schema('resume')
      .from('profile')
      .select('*')
      .single<Profile>()
    context.profile = data
  }

  // 프로필
  if (matchKeywords(queryLower, ['자기소개', '누구', '프로필', '소개', '이름', '너는', 'introduce', 'name', 'who', 'profile', 'introduction'])) {
    const { data } = await supabase
      .schema('resume')
      .from('profile')
      .select('*')
      .single<Profile>()
    context.profile = data
  }

  // 경력
  if (matchKeywords(queryLower, ['경력', '회사', '일', '직장', '커리어', '경험', '이직', 'career', 'company', 'job', 'work', 'experience', 'transition'])) {
    const { data } = await supabase
      .schema('resume')
      .from('experience')
      .select('*')
      .order('order_index', { ascending: false })
      .returns<Experience[]>()
    context.experience = data
  }

  // 스킬
  if (matchKeywords(queryLower, ['스킬', '기여', '기술', '스택', '언어', '프레임워크', '뭘 잘', '역량', '능력', 'skill', 'contribution', 'stack', 'language', 'framework', 'ability', 'skillset'])) {
    const { data } = await supabase
      .schema('resume')
      .from('skills')
      .select('*')
      .order('order_index', { ascending: false })
      .returns<Skill[]>()
    context.skills = data
  }

  // 프로젝트
  if (matchKeywords(queryLower, ['프로젝트', '만든', '개발', '포트폴리오', '작업', '작품', 'project', 'made', 'development', 'portfolio', 'work', 'work', 'product'])) {
    const { data } = await supabase
      .schema('resume')
      .from('projects')
      .select('*')
      .order('order_index', { ascending: false })
      .returns<Project[]>()
    context.projects = data
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
  }

  // 소셜 링크 및 외부 프로필
  const isGitHubQuestion = matchKeywords(queryLower, ['깃헙', 'github', '깃허브', '레포', 'repo', '오픈소스', 'open source', '코드', 'code'])
  const isLinkedInQuestion = matchKeywords(queryLower, ['링크드인', 'linkedin', '링크인', '이력서', '커리어'])
  const isSocialQuestion = matchKeywords(queryLower, ['연락', '소셜', '연결', '이메일', 'contact', 'social', 'link', 'email'])

  if (isGitHubQuestion || isLinkedInQuestion || isSocialQuestion) {
    const { data } = await supabase
      .schema('resume')
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: false })
      .returns<SocialLink[]>()
    context.socialLinks = data

    // GitHub/LinkedIn 상세 질문인 경우 외부 데이터도 가져오기
    if ((isGitHubQuestion || isLinkedInQuestion) && data && data.length > 0) {
      try {
        const externalData = await fetchExternalProfiles(data)

        // GitHub 데이터가 있으면 요약 추가
        if (externalData.github) {
          const summary = summarizeGitHubProfile(externalData.github)
          context.externalProfiles = {
            github: {
              profile: externalData.github.profile,
              repos: externalData.github.repos.slice(0, 5), // 상위 5개만
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
        // 에러가 나도 기본 소셜 링크는 제공
      }
    }
  }

  // 이미지 아카이브
  if (matchKeywords(queryLower, ['사진', '이미지', '갤러리', '아카이브', '앨범', 'image', 'gallery', 'archive', 'album'])) {
    const year = extractYear(queryLower)
    context.imageYear = year

    let queryBuilder = supabase
      .schema('resume')
      .from('image_archive')
      .select('*')

    if (year) {
      queryBuilder = queryBuilder.eq('year', year)
    }

    const { data } = await queryBuilder
      .order('year', { ascending: false })
      .order('order_index', { ascending: false })
      .returns<ImageArchive[]>()

    context.images = data
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
