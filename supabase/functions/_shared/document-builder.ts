// ============================================
// 문서 텍스트 변환 유틸리티
// 데이터베이스 데이터를 임베딩 생성용 텍스트로 변환
// ============================================

import type {
  Profile,
  Experience,
  Skill,
  Project,
  Education,
  Hobby,
  SocialLink,
  ImageArchive,
  Threejs,
} from './types.ts'
import { getSupabaseClient } from './supabase.ts'

/**
 * 프로필 데이터를 텍스트로 변환
 */
export const buildProfileText = (profile: Profile): string => {
  const fieldMap: Record<string, { label: string, value: string | null | undefined }> = {
    full_name: { label: '이름', value: profile.full_name },
    title: { label: '직책', value: profile.title },
    bio: { label: '소개', value: profile.bio },
    detailed_bio: { label: '상세 소개', value: profile.detailed_bio },
    location: { label: '위치', value: profile.location },
  }

  const parts: string[] = Object.entries(fieldMap)
    .filter(([, { value }]) => value)
    .map(([, { label, value }]) => `${label}: ${value}`)

  if (profile.weaknesses && profile.weaknesses.length > 0) {
    parts.push(`개선점: ${profile.weaknesses.join(', ')}`)
  }

  return parts.join('\n')
}

/**
 * 경력 데이터를 텍스트로 변환
 */
export const buildExperienceText = (experiences: Experience[]): string => {
  return experiences.map((exp) => {
    const fieldMap: Record<string, { label: string, value: string | null | undefined }> = {
      company_name: { label: '회사', value: exp.company_name },
      position: { label: '직책', value: exp.position },
      description: { label: '설명', value: exp.description },
      location: { label: '위치', value: exp.location },
    }

    const requiredFields = ['company_name', 'position']

    const parts: string[] = Object.entries(fieldMap)
      .filter(([key, { value }]) => {
        // 필수 필드는 항상 포함
        if (requiredFields.includes(key)) {
          return true
        }
        // 선택 필드는 값이 있을 때만 포함
        return !!value
      })
      .map(([, { label, value }]) => `${label}: ${value}`)

    parts.push(`기간: ${exp.start_date} ~ ${exp.end_date || '현재'}`)
    return parts.join('\n')
  }).join('\n\n')
}

/**
 * 스킬 데이터를 텍스트로 변환
 */
export const buildSkillsText = (skills: Skill[]): string => {
  return skills.map((skill) => {
    const fieldMap: Record<string, { label: string, value: string | number | null | undefined }> = {
      name: { label: '기술', value: skill.name },
      category: { label: '카테고리', value: skill.category },
      proficiency: { label: '숙련도', value: skill.proficiency ? `${skill.proficiency}/5` : null },
    }

    const requiredFields = ['name', 'category']

    const parts: string[] = Object.entries(fieldMap)
      .filter(([key, { value }]) => {
        // 필수 필드는 항상 포함
        if (requiredFields.includes(key)) {
          return true
        }
        // 선택 필드는 값이 있을 때만 포함
        return !!value
      })
      .map(([, { label, value }]) => `${label}: ${value}`)

    return parts.join(', ')
  }).join('\n')
}

/**
 * 프로젝트 데이터를 텍스트로 변환
 */
export const buildProjectsText = (projects: Project[]): string => {
  return projects.map((project) => {
    const fieldMap: Record<string, { label: string, value: string | null | undefined }> = {
      title: { label: '프로젝트', value: project.title },
      description: { label: '설명', value: project.description },
      tech_stack: {
        label: '기술 스택',
        value: project.tech_stack && project.tech_stack.length > 0
          ? project.tech_stack.join(', ')
          : null,
      },
      highlights: {
        label: '하이라이트',
        value: project.highlights && project.highlights.length > 0
          ? project.highlights.join(', ')
          : null,
      },
      start_date: { label: '시작일', value: project.start_date },
      end_date: { label: '종료일', value: project.end_date },
    }

    const requiredFields = ['title']

    const parts: string[] = Object.entries(fieldMap)
      .filter(([key, { value }]) => {
        // 필수 필드는 항상 포함
        if (requiredFields.includes(key)) {
          return true
        }
        // 선택 필드는 값이 있을 때만 포함
        return !!value
      })
      .map(([, { label, value }]) => `${label}: ${value}`)

    return parts.join('\n')
  }).join('\n\n')
}

/**
 * 학력 데이터를 텍스트로 변환
 */
export const buildEducationText = (education: Education[]): string => {
  return education.map((edu) => {
    const fieldMap: Record<string, { label: string, value: string | null | undefined }> = {
      school_name: { label: '학교', value: edu.school_name },
      degree: { label: '학위', value: edu.degree },
      major: { label: '전공', value: edu.major },
      description: { label: '설명', value: edu.description },
      start_date: { label: '입학일', value: edu.start_date },
      end_date: { label: '졸업일', value: edu.end_date },
    }

    const requiredFields = ['school_name']

    const parts: string[] = Object.entries(fieldMap)
      .filter(([key, { value }]) => {
        // 필수 필드는 항상 포함
        if (requiredFields.includes(key)) {
          return true
        }
        // 선택 필드는 값이 있을 때만 포함
        return !!value
      })
      .map(([, { label, value }]) => `${label}: ${value}`)

    return parts.join('\n')
  }).join('\n\n')
}

/**
 * 취미 데이터를 텍스트로 변환
 */
export const buildHobbiesText = (hobbies: Hobby[]): string => {
  return hobbies.map((hobby) => {
    const fieldMap: Record<string, { label: string, value: string | null | undefined }> = {
      title: { label: '취미', value: hobby.title },
      description: { label: '설명', value: hobby.description },
    }

    const requiredFields = ['title']

    const parts: string[] = Object.entries(fieldMap)
      .filter(([key, { value }]) => {
        // 필수 필드는 항상 포함
        if (requiredFields.includes(key)) {
          return true
        }
        // 선택 필드는 값이 있을 때만 포함
        return !!value
      })
      .map(([, { label, value }]) => `${label}: ${value}`)

    return parts.join('\n')
  }).join('\n\n')
}

/**
 * 소셜 링크 데이터를 텍스트로 변환
 */
export const buildSocialLinksText = (socialLinks: SocialLink[]): string => {
  return socialLinks.map((link) => {
    const parts: string[] = []
    parts.push(`플랫폼: ${link.platform}`)
    parts.push(`URL: ${link.url}`)
    return parts.join('\n')
  }).join('\n\n')
}

/**
 * 약점(Weaknesses) 데이터를 텍스트로 변환
 */
export const buildWeaknessesText = (profile: Profile): string => {
  if (!profile.weaknesses || profile.weaknesses.length === 0) {
    return ''
  }

  const fieldMap: Record<string, { label: string, value: string | null | undefined }> = {
    weaknesses: {
      label: '개선점',
      value: profile.weaknesses && profile.weaknesses.length > 0
        ? profile.weaknesses.join(', ')
        : null,
    },
    detailed_bio: { label: '상세 설명', value: profile.detailed_bio },
  }

  const requiredFields = ['weaknesses']

  const parts: string[] = Object.entries(fieldMap)
    .filter(([key, { value }]) => {
      // 필수 필드는 항상 포함
      if (requiredFields.includes(key)) {
        return true
      }
      // 선택 필드는 값이 있을 때만 포함
      return !!value
    })
    .map(([, { label, value }]) => `${label}: ${value}`)

  return parts.join('\n')
}

/**
 * 연락처(Contact) 데이터를 텍스트로 변환
 */
export const buildContactText = (profile: Profile, socialLinks?: SocialLink[]): string => {
  const fieldMap: Record<string, { label: string, value: string | null | undefined }> = {
    email: { label: '이메일', value: profile.email },
    phone: { label: '전화번호', value: profile.phone },
    location: { label: '위치', value: profile.location },
    social_links: {
      label: '소셜 링크',
      value: socialLinks && socialLinks.length > 0
        ? socialLinks.map(link => `${link.platform}: ${link.url}`).join(', ')
        : null,
    },
  }

  const parts: string[] = Object.entries(fieldMap)
    .filter(([, { value }]) => !!value)
    .map(([, { label, value }]) => `${label}: ${value}`)

  return parts.join('\n')
}

/**
 * 이미지 아카이브 데이터를 텍스트로 변환
 */
export const buildImageArchiveText = (images: ImageArchive[]): string => {
  return images.map((image) => {
    const fieldMap: Record<string, { label: string, value: string | number | null | undefined }> = {
      title: { label: '제목', value: image.title },
      description: { label: '설명', value: image.description },
      year: { label: '연도', value: image.year },
      month: { label: '월', value: image.month },
      tags: {
        label: '태그',
        value: image.tags && image.tags.length > 0
          ? image.tags.join(', ')
          : null,
      },
      category: { label: '카테고리', value: image.category },
    }

    const requiredFields = ['title']

    const parts: string[] = Object.entries(fieldMap)
      .filter(([key, { value }]) => {
        // 필수 필드는 항상 포함
        if (requiredFields.includes(key)) {
          return true
        }
        // 선택 필드는 값이 있을 때만 포함
        return !!value
      })
      .map(([, { label, value }]) => `${label}: ${value}`)

    return parts.join('\n')
  }).join('\n\n')
}

/**
 * Three.js 작업물 데이터를 텍스트로 변환
 */
export const buildThreejsText = (threejs: Threejs[]): string => {
  return threejs.map((work) => {
    const fieldMap: Record<string, { label: string, value: string | null | undefined }> = {
      title: { label: '작업물', value: work.title },
      description: { label: '설명', value: work.description },
      url: { label: 'URL', value: work.url },
    }

    const requiredFields = ['title']

    const parts: string[] = Object.entries(fieldMap)
      .filter(([key, { value }]) => {
        // 필수 필드는 항상 포함
        if (requiredFields.includes(key)) {
          return true
        }
        // 선택 필드는 값이 있을 때만 포함
        return !!value
      })
      .map(([, { label, value }]) => `${label}: ${value}`)

    return parts.join('\n')
  }).join('\n\n')
}

/**
 * 모든 데이터를 조합하여 종합 문서 생성
 */
export const buildComprehensiveDocument = async (): Promise<string> => {
  const supabase = getSupabaseClient()
  const parts: string[] = []

  // 프로필
  const { data: profile } = await supabase
    .schema('resume')
    .from('profile')
    .select('*')
    .single()
  if (profile) {
    parts.push('=== 프로필 ===')
    parts.push(buildProfileText(profile))
  }

  // 경력
  const { data: experiences } = await supabase
    .schema('resume')
    .from('experience')
    .select('*')
    .order('order_index', { ascending: false })
  if (experiences && experiences.length > 0) {
    parts.push('\n=== 경력 ===')
    parts.push(buildExperienceText(experiences))
  }

  // 스킬
  const { data: skills } = await supabase
    .schema('resume')
    .from('skills')
    .select('*')
    .order('order_index', { ascending: false })
  if (skills && skills.length > 0) {
    parts.push('\n=== 기술 스택 ===')
    parts.push(buildSkillsText(skills))
  }

  // 프로젝트
  const { data: projects } = await supabase
    .schema('resume')
    .from('projects')
    .select('*')
    .eq('deleted', false)
    .order('order_index', { ascending: false })
  if (projects && projects.length > 0) {
    parts.push('\n=== 프로젝트 ===')
    parts.push(buildProjectsText(projects))
  }

  // 학력
  const { data: education } = await supabase
    .schema('resume')
    .from('education')
    .select('*')
    .order('order_index', { ascending: false })
  if (education && education.length > 0) {
    parts.push('\n=== 학력 ===')
    parts.push(buildEducationText(education))
  }

  // 취미
  const { data: hobbies } = await supabase
    .schema('resume')
    .from('hobbies')
    .select('*')
    .order('order_index')
  if (hobbies && hobbies.length > 0) {
    parts.push('\n=== 취미 ===')
    parts.push(buildHobbiesText(hobbies))
  }

  // 소셜 링크
  const { data: socialLinks } = await supabase
    .schema('resume')
    .from('social_links')
    .select('*')
    .order('order_index', { ascending: false })
  if (socialLinks && socialLinks.length > 0) {
    parts.push('\n=== 소셜 링크 ===')
    parts.push(buildSocialLinksText(socialLinks))
  }

  // 이미지 아카이브
  const { data: images } = await supabase
    .schema('resume')
    .from('image_archive')
    .select('*')
    .eq('deleted', false)
    .order('year', { ascending: false })
    .order('order_index', { ascending: true })
  if (images && images.length > 0) {
    parts.push('\n=== 이미지 아카이브 ===')
    parts.push(buildImageArchiveText(images))
  }

  // Three.js 작업물
  const { data: threejs } = await supabase
    .schema('resume')
    .from('threejs')
    .select('*')
    .eq('deleted', false)
    .order('order_index', { ascending: false })
  if (threejs && threejs.length > 0) {
    parts.push('\n=== Three.js 작업물 ===')
    parts.push(buildThreejsText(threejs))
  }

  return parts.join('\n\n')
}
