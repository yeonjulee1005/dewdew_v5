// 기술 이름을 simple-icons 아이콘으로 매핑하는 컴포저블

export const useSkillIcon = () => {
  const getSkillIcon = (skillName: string): string => {
    const iconMap: Record<string, string> = {
      // JavaScript/TypeScript
      'javascript': 'i-simple-icons-javascript',
      'typescript': 'i-simple-icons-typescript',
      'js': 'i-simple-icons-javascript',
      'ts': 'i-simple-icons-typescript',

      // 프론트엔드 프레임워크
      'vue': 'i-simple-icons-vuedotjs',
      'vue.js': 'i-simple-icons-vuedotjs',
      'vuejs': 'i-simple-icons-vuedotjs',
      'react': 'i-simple-icons-react',
      'nuxt': 'i-simple-icons-nuxtdotjs',
      'nuxt.js': 'i-simple-icons-nuxtdotjs',
      'nuxtjs': 'i-simple-icons-nuxtdotjs',
      'next.js': 'i-simple-icons-nextdotjs',
      'nextjs': 'i-simple-icons-nextdotjs',
      'astro': 'i-simple-icons-astro',
      'svelte': 'i-simple-icons-svelte',
      'element plus': 'i-simple-icons-element',
      'element-plus': 'i-simple-icons-element',
      'elementplus': 'i-simple-icons-element',
      'three.js': 'i-simple-icons-threedotjs',

      // 백엔드
      'node.js': 'i-simple-icons-nodedotjs',
      'nodejs': 'i-simple-icons-nodedotjs',
      'express': 'i-simple-icons-express',
      'nest.js': 'i-simple-icons-nestjs',
      'nestjs': 'i-simple-icons-nestjs',
      'php': 'i-simple-icons-php',
      'python': 'i-simple-icons-python',
      'deno': 'i-simple-icons-deno',

      // 빌드 도구
      'vite': 'i-simple-icons-vite',
      'webpack': 'i-simple-icons-webpack',
      'rollup': 'i-simple-icons-rollup',
      'bun': 'i-simple-icons-bun',
      'yarn': 'i-simple-icons-yarn',
      'npm': 'i-simple-icons-npm',
      'pnpm': 'i-simple-icons-pnpm',

      // 데이터베이스
      'mysql': 'i-simple-icons-mysql',
      'postgresql': 'i-simple-icons-postgresql',
      'mongodb': 'i-simple-icons-mongodb',
      'redis': 'i-simple-icons-redis',
      'supabase': 'i-simple-icons-supabase',

      // 클라우드/인프라
      'aws': 'i-simple-icons-amazonaws',
      'amazon web services': 'i-simple-icons-amazonaws',
      'gcp': 'i-simple-icons-googlecloud',
      'google cloud': 'i-simple-icons-googlecloud',
      'azure': 'i-simple-icons-microsoftazure',
      'docker': 'i-simple-icons-docker',
      'kubernetes': 'i-simple-icons-kubernetes',
      'k8s': 'i-simple-icons-kubernetes',
      'firebase': 'i-simple-icons-firebase',
      'ncp': 'i-simple-icons-naver',

      // 모바일
      'swift': 'i-simple-icons-swift',
      'flutter': 'i-simple-icons-flutter',
      'react native': 'i-simple-icons-react',
      'reactnative': 'i-simple-icons-react',

      // PWA
      'pwa': 'i-simple-icons-pwa',
      'progressive web app': 'i-simple-icons-pwa',

      // 도구/기타
      'git': 'i-simple-icons-git',
      'github': 'i-simple-icons-github',
      'gitlab': 'i-simple-icons-gitlab',
      'vercel': 'i-simple-icons-vercel',
      'netlify': 'i-simple-icons-netlify',
      'tailwindcss': 'i-simple-icons-tailwindcss',
      'tailwind': 'i-simple-icons-tailwindcss',
      'sass': 'i-simple-icons-sass',
      'css': 'i-simple-icons-css3',
      'html': 'i-simple-icons-html5',
      'figma': 'i-simple-icons-figma',
      'stylelint': 'i-simple-icons-stylelint',
      'eslint': 'i-simple-icons-eslint',
      'prettier': 'i-simple-icons-prettier',
      'kotlin': 'i-simple-icons-kotlin',

      // 개발 도구
      'vscode': 'i-simple-icons-visualstudiocode',
      'visual studio code': 'i-simple-icons-visualstudiocode',
      'vim': 'i-simple-icons-vim',
      'cursor': 'i-simple-icons-cursor',
      'claude': 'i-simple-icons-anthropic',
      'markdown': 'i-simple-icons-markdown',

      // 협업/프로젝트 관리
      'slack': 'i-simple-icons-slack',
      'notion': 'i-simple-icons-notion',
      'jira': 'i-simple-icons-jira',
      'postman': 'i-simple-icons-postman',
      'sentry': 'i-simple-icons-sentry',
      'teams': 'i-simple-icons-microsoftteams',
      'microsoft teams': 'i-simple-icons-microsoftteams',

      // 디자인 도구
      'adobe xd': 'i-simple-icons-adobexd',
      'adobexd': 'i-simple-icons-adobexd',
      'xd': 'i-simple-icons-adobexd',
      'squarespace': 'i-simple-icons-squarespace',

      // IDE/에디터
      'android studio': 'i-simple-icons-androidstudio',
      'androidstudio': 'i-simple-icons-androidstudio',
      'xcode': 'i-simple-icons-xcode',
      'jetbrains': 'i-simple-icons-jetbrains',
      'pycharm': 'i-simple-icons-pycharm',

      // 분석 도구
      'hotjar': 'i-simple-icons-hotjar',

      // 문서/스토리북
      'storybook': 'i-simple-icons-storybook',

      // 브라우저/앱
      'arc': 'i-simple-icons-arc',
      'obsidian': 'i-simple-icons-obsidian',
    }

    // 로고가 없는 기술들 (기본 아이콘 사용)
    const noIconList = ['ghostty', 'amplitude']

    // 대소문자 무시하고 매칭
    const normalizedName = skillName.toLowerCase().trim()

    // 로고 없는 기술 체크
    if (noIconList.includes(normalizedName)) {
      return 'i-lucide-code'
    }

    // 정확한 매칭
    if (iconMap[normalizedName]) {
      return iconMap[normalizedName]
    }

    // 부분 매칭 (예: "Vue.js" -> "vue.js" 매칭)
    for (const [key, icon] of Object.entries(iconMap)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return icon
      }
    }

    // 매칭되지 않으면 기본 아이콘
    return 'i-lucide-code'
  }

  return {
    getSkillIcon,
  }
}
