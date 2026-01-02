// ============================================
// 임베딩 생성 및 저장 유틸리티
// 문서 데이터를 임베딩으로 변환하여 데이터베이스에 저장
// ============================================

import { getSupabaseClient } from './supabase.ts'
import { getEmbedding, vectorToArray } from './embeddings.ts'
import {
  buildProfileText,
  buildExperienceText,
  buildSkillsText,
  buildProjectsText,
  buildEducationText,
  buildHobbiesText,
  buildSocialLinksText,
  buildImageArchiveText,
  buildWeaknessesText,
  buildContactText,
  buildThreejsText,
} from './document-builder.ts'
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

/**
 * 문서 임베딩 저장
 */
const saveDocumentEmbedding = async (
  documentType: string,
  documentId: string,
  content: string,
  embedding: number[],
  metadata?: Record<string, any>,
): Promise<void> => {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .schema('resume')
    .from('document_embeddings')
    .upsert({
      document_type: documentType,
      document_id: documentId,
      content,
      embedding: vectorToArray(embedding),
      metadata: metadata || {},
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'document_type,document_id',
    })

  if (error) {
    console.error(`Failed to save embedding for ${documentType}:${documentId}`, error)
    throw error
  }
}

/**
 * 프로필 임베딩 생성 및 저장
 */
export const createProfileEmbedding = async (profile: Profile): Promise<void> => {
  const content = buildProfileText(profile)
  // EmbeddingGemma는 Hugging Face Inference API에서 지원되지 않으므로 OpenAI 사용
  const embedding = await getEmbedding(content, 'openai')

  await saveDocumentEmbedding(
    'profile',
    profile.id,
    content,
    embedding,
    { full_name: profile.full_name, title: profile.title },
  )
}

/**
 * 경력 임베딩 생성 및 저장
 */
export const createExperienceEmbeddings = async (experiences: Experience[]): Promise<void> => {
  for (const exp of experiences) {
    const content = buildExperienceText([exp])
    const embedding = await getEmbedding(content, 'openai')

    await saveDocumentEmbedding(
      'experience',
      exp.id,
      content,
      embedding,
      { company_name: exp.company_name, position: exp.position },
    )
  }
}

/**
 * 스킬 임베딩 생성 및 저장
 */
export const createSkillsEmbedding = async (skills: Skill[]): Promise<void> => {
  const content = buildSkillsText(skills)
  const embedding = await getEmbedding(content, 'openai')

  await saveDocumentEmbedding(
    'skills',
    'all',
    content,
    embedding,
    { skill_count: skills.length },
  )
}

/**
 * 프로젝트 임베딩 생성 및 저장
 */
export const createProjectEmbeddings = async (projects: Project[]): Promise<void> => {
  for (const project of projects) {
    const content = buildProjectsText([project])
    const embedding = await getEmbedding(content, 'openai')

    await saveDocumentEmbedding(
      'project',
      project.id,
      content,
      embedding,
      { title: project.title, tech_stack: project.tech_stack },
    )
  }
}

/**
 * 학력 임베딩 생성 및 저장
 */
export const createEducationEmbeddings = async (education: Education[]): Promise<void> => {
  for (const edu of education) {
    const content = buildEducationText([edu])
    const embedding = await getEmbedding(content, 'openai')

    await saveDocumentEmbedding(
      'education',
      edu.id,
      content,
      embedding,
      { school_name: edu.school_name, degree: edu.degree },
    )
  }
}

/**
 * 취미 임베딩 생성 및 저장
 */
export const createHobbiesEmbedding = async (hobbies: Hobby[]): Promise<void> => {
  const content = buildHobbiesText(hobbies)
  const embedding = await getEmbedding(content, 'openai')

  await saveDocumentEmbedding(
    'hobbies',
    'all',
    content,
    embedding,
    { hobby_count: hobbies.length },
  )
}

/**
 * 소셜 링크 임베딩 생성 및 저장
 */
export const createSocialLinksEmbedding = async (socialLinks: SocialLink[]): Promise<void> => {
  const content = buildSocialLinksText(socialLinks)
  const embedding = await getEmbedding(content, 'openai')

  await saveDocumentEmbedding(
    'social_links',
    'all',
    content,
    embedding,
    { link_count: socialLinks.length },
  )
}

/**
 * 약점(Weaknesses) 임베딩 생성 및 저장
 */
export const createWeaknessesEmbedding = async (profile: Profile): Promise<void> => {
  if (!profile.weaknesses || profile.weaknesses.length === 0) {
    return
  }

  const content = buildWeaknessesText(profile)
  const embedding = await getEmbedding(content, 'openai')

  await saveDocumentEmbedding(
    'weaknesses',
    profile.id,
    content,
    embedding,
    { weakness_count: profile.weaknesses.length },
  )
}

/**
 * 연락처(Contact) 임베딩 생성 및 저장
 */
export const createContactEmbedding = async (profile: Profile, socialLinks?: SocialLink[]): Promise<void> => {
  const content = buildContactText(profile, socialLinks)
  if (!content || content.trim().length === 0) {
    return
  }

  const embedding = await getEmbedding(content, 'openai')

  await saveDocumentEmbedding(
    'contact',
    profile.id,
    content,
    embedding,
    {
      has_email: !!profile.email,
      has_phone: !!profile.phone,
      social_link_count: socialLinks?.length || 0,
    },
  )
}

/**
 * Three.js 작업물 임베딩 생성 및 저장
 */
export const createThreejsEmbeddings = async (threejs: Threejs[]): Promise<void> => {
  console.log(`[createThreejsEmbeddings] Processing ${threejs.length} threejs works...`)
  for (const work of threejs) {
    try {
      const content = buildThreejsText([work])
      const embedding = await getEmbedding(content, 'openai')

      await saveDocumentEmbedding(
        'threejs',
        work.id,
        content,
        embedding,
        { title: work.title, url: work.url },
      )
    }
    catch (error) {
      console.error(`[createThreejsEmbeddings] ❌ Error creating embedding for ${work.id}:`, error)
      throw error
    }
  }
}

/**
 * 이미지 아카이브 임베딩 생성 및 저장
 */
export const createImageArchiveEmbeddings = async (images: ImageArchive[]): Promise<void> => {
  for (const image of images) {
    const content = buildImageArchiveText([image])
    const embedding = await getEmbedding(content, 'openai')

    await saveDocumentEmbedding(
      'image_archive',
      image.id,
      content,
      embedding,
      { title: image.title, year: image.year, category: image.category },
    )
  }
}

/**
 * 모든 문서의 임베딩 생성 및 저장 (초기화용)
 */
export const initializeAllEmbeddings = async (): Promise<void> => {
  const supabase = getSupabaseClient()

  console.log('Starting embedding initialization...')

  // 프로필
  const { data: profile } = await supabase
    .schema('resume')
    .from('profile')
    .select('*')
    .single()
  if (profile) {
    console.log('Creating profile embedding...')
    await createProfileEmbedding(profile)

    // 약점 임베딩
    if (profile.weaknesses && profile.weaknesses.length > 0) {
      console.log('Creating weaknesses embedding...')
      await createWeaknessesEmbedding(profile)
    }
  }

  // 경력
  const { data: experiences } = await supabase
    .schema('resume')
    .from('experience')
    .select('*')
  if (experiences && experiences.length > 0) {
    console.log(`Creating ${experiences.length} experience embeddings...`)
    await createExperienceEmbeddings(experiences)
  }

  // 스킬
  const { data: skills } = await supabase
    .schema('resume')
    .from('skills')
    .select('*')
  if (skills && skills.length > 0) {
    console.log('Creating skills embedding...')
    await createSkillsEmbedding(skills)
  }

  // 프로젝트
  const { data: projects } = await supabase
    .schema('resume')
    .from('projects')
    .select('*')
    .eq('deleted', false)
  if (projects && projects.length > 0) {
    console.log(`Creating ${projects.length} project embeddings...`)
    await createProjectEmbeddings(projects)
  }

  // 학력
  const { data: education } = await supabase
    .schema('resume')
    .from('education')
    .select('*')
  if (education && education.length > 0) {
    console.log(`Creating ${education.length} education embeddings...`)
    await createEducationEmbeddings(education)
  }

  // 취미
  const { data: hobbies } = await supabase
    .schema('resume')
    .from('hobbies')
    .select('*')
  if (hobbies && hobbies.length > 0) {
    console.log('Creating hobbies embedding...')
    await createHobbiesEmbedding(hobbies)
  }

  // 소셜 링크
  const { data: socialLinks } = await supabase
    .schema('resume')
    .from('social_links')
    .select('*')
    .order('order_index', { ascending: false })
  if (socialLinks && socialLinks.length > 0) {
    console.log('Creating social links embedding...')
    await createSocialLinksEmbedding(socialLinks)
  }

  // 연락처 임베딩 (프로필과 소셜 링크 조합)
  if (profile) {
    console.log('Creating contact embedding...')
    await createContactEmbedding(profile, socialLinks || [])
  }

  // Three.js 작업물
  const { data: threejs } = await supabase
    .schema('resume')
    .from('threejs')
    .select('*')
    .eq('deleted', false)
    .order('order_index', { ascending: false })

  if (threejs && threejs.length > 0) {
    console.log(`Creating ${threejs.length} threejs embeddings...`)
    await createThreejsEmbeddings(threejs)
  }

  // 이미지 아카이브
  const { data: images } = await supabase
    .schema('resume')
    .from('image_archive')
    .select('*')
    .eq('deleted', false)
  if (images && images.length > 0) {
    console.log(`Creating ${images.length} image archive embeddings...`)
    await createImageArchiveEmbeddings(images)
  }

  console.log('Embedding initialization completed!')
}
