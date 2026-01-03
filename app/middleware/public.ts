// 전역 미들웨어: 공개 경로를 명시적으로 허용
// Supabase 인증 미들웨어보다 먼저 실행되어 리디렉션을 방지
export default defineNuxtRouteMiddleware((to) => {
  // /blog로 시작하는 모든 경로 허용 (예: /blog, /blog/20260102 등)
  if (to.path.startsWith('/blog')) {
    return
  }

  // /ai로 시작하는 모든 경로 허용
  if (to.path.startsWith('/ai')) {
    return
  }

  // /threejs로 시작하는 모든 경로 허용
  if (to.path.startsWith('/threejs')) {
    return
  }

  // 루트 경로 허용
  if (to.path === '/') {
    return
  }

  // 다른 경로는 기본 동작 유지 (Supabase 미들웨어가 처리)
})
