<script setup lang="ts">
// RAG AI 채팅 시스템 아키텍처 — 인터랙티브 SVG (라이트/다크 테마 대응)
// 흐름: 클라이언트 → Nuxt Server → Edge Function(RAG) → Vercel AI Gateway → Provider, 하단 Supabase DB
//       + 답변 카드 다국어 경로: Dynamic Card → /api/resume/*?lang → translate-resume → translation_cache
// 좌표는 viewBox(1200×900) 기준. 화살표 교차 지점은 hop(반원)으로 처리했다.
// 단계(STAGES) 선택 또는 블록 클릭 → 해당 단계의 노드·간선만 강조하고 설명 패널에 i18n stages[n] 표시.
type Tone = 'base' | 'ai' | 'i18n'
type EdgeKind = Tone | 'sse'

interface StageGraph {
  nodes: string[]
  edges: string[]
}

const { t, tm, rt } = useI18n()
const d = (key: string) => t(`aiComponents.concept.diagram.${key}`)
const uid = useId()

// i18n aiComponents.concept.stages 와 순서가 같아야 한다
const STAGES: StageGraph[] = [
  { nodes: ['visitor', 'chatui', 'usechat', 'apichat', 'chat_history'], edges: ['e1a', 'e1b', 'e2', 'e3'] },
  { nodes: ['apichat', 'history', 'settings', 'settings_db'], edges: ['e4'] },
  { nodes: ['rag', 'resume', 'embeddings', 'gateway'], edges: ['e5', 'e6', 'e7'] },
  { nodes: ['language'], edges: [] },
  { nodes: ['mapper', 'models'], edges: [] },
  { nodes: ['provider', 'gateway', 'providers'], edges: ['e11', 'e12'] },
  { nodes: ['provider', 'apichat', 'usechat', 'chatui'], edges: ['e13a', 'e13b'] },
  { nodes: ['usechat', 'card', 'apiresume', 'translate', 'resume', 'cache', 'gateway'], edges: ['e14', 'e15', 'e16', 'e17', 'e18', 'e19'] },
]

const stages = computed(() => {
  const messages = tm('aiComponents.concept.stages') as unknown as Array<{ title: string, range: string, description: string[] }>
  return messages.map((stage, index) => ({
    title: rt(stage.title),
    range: rt(stage.range),
    description: stage.description.map(item => rt(item)),
    graph: STAGES[index] ?? { nodes: [], edges: [] },
  }))
})

const overview = computed(() => (tm('aiComponents.concept.overview') as unknown as string[]).map(item => rt(item)))

// ───────── 선택 상태 ─────────
const activeIndex = ref<number | null>(null)
const activeStage = computed(() => (activeIndex.value === null ? null : stages.value[activeIndex.value] ?? null))

const isNodeActive = (id: string) => !activeStage.value || activeStage.value.graph.nodes.includes(id)
const nodeClass = (id: string) => ['transition-opacity duration-300', isNodeActive(id) ? '' : 'opacity-25']

const edgeClass = (id: string) => {
  if (!activeStage.value) return ''
  return activeStage.value.graph.edges.includes(id) ? 'arch-flow' : 'opacity-15'
}

const { pause, resume, isActive: isPlaying } = useIntervalFn(() => {
  const total = stages.value.length
  activeIndex.value = activeIndex.value === null ? 0 : (activeIndex.value + 1) % total
}, 5000, { immediate: false })

const selectStage = (index: number | null) => {
  pause()
  activeIndex.value = index
}

const step = (delta: number) => {
  const total = stages.value.length
  const current = activeIndex.value ?? (delta > 0 ? -1 : 0)
  selectStage((current + delta + total) % total)
}

const togglePlay = () => {
  if (isPlaying.value) {
    pause()
    return
  }
  if (activeIndex.value === null) activeIndex.value = 0
  resume()
}

// 블록 클릭 → 그 블록이 처음 등장하는 단계 (이미 그 단계면 전체 보기로 토글)
const focusNode = (id: string) => {
  const index = STAGES.findIndex(stage => stage.nodes.includes(id))
  if (index === -1) return
  selectStage(activeIndex.value === index ? null : index)
}

// ───────── 스타일 토큰 ─────────
const boxTone: Record<Tone, string> = {
  base: 'fill-white dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-600',
  ai: 'fill-amber-50 dark:fill-amber-950/40 stroke-amber-500',
  i18n: 'fill-sky-50 dark:fill-sky-950/40 stroke-sky-500',
}
const badgeTone: Record<Tone, string> = {
  base: 'fill-amber-500',
  ai: 'fill-amber-500',
  i18n: 'fill-sky-500',
}
const edgeStroke: Record<EdgeKind, string> = {
  base: 'stroke-neutral-400 dark:stroke-neutral-500',
  sse: 'stroke-neutral-400 dark:stroke-neutral-500',
  ai: 'stroke-amber-500',
  i18n: 'stroke-sky-500',
}
const markerId = (kind: EdgeKind) => `${uid}-arrow-${kind === 'sse' ? 'base' : kind}`

// ───────── 노드 ─────────
// 가운데 정렬 박스 (클라이언트 · 서버)
const boxes = computed(() => [
  { id: 'visitor', x: 40, y: 80, w: 160, h: 56, title: d('visitor'), sub: d('visitorSub'), tone: 'base' as Tone },
  { id: 'chatui', x: 40, y: 176, w: 160, h: 64, title: 'Chat UI', sub: d('chatUiSub'), tone: 'base' as Tone },
  { id: 'usechat', x: 40, y: 276, w: 160, h: 64, title: 'useChat', sub: d('useChatSub'), tone: 'base' as Tone },
  { id: 'card', x: 40, y: 440, w: 160, h: 72, title: 'Dynamic Card', sub: d('cardSub'), tone: 'i18n' as Tone },
  { id: 'apichat', x: 272, y: 276, w: 160, h: 64, title: 'POST /api/chat', sub: d('apiChatSub'), tone: 'base' as Tone },
  { id: 'apiresume', x: 272, y: 440, w: 160, h: 72, title: 'GET /api/resume/*', sub: d('apiResumeSub'), tone: 'i18n' as Tone },
])

// 번호 배지 + 왼쪽 정렬 박스 (Edge Function 단계)
const steps = computed(() => [
  { id: 'history', n: '5', y: 80, h: 50, title: 'history-optimizer', sub: d('optimizerSub'), tone: 'base' as Tone },
  { id: 'settings', n: '6', y: 142, h: 50, title: 'ai_settings', sub: d('settingsSub'), tone: 'base' as Tone },
  { id: 'language', n: '8', y: 312, h: 50, title: 'language', sub: d('languageSub'), tone: 'i18n' as Tone },
  { id: 'mapper', n: '9', y: 374, h: 50, title: 'component-mapper', sub: d('mapperSub'), tone: 'base' as Tone },
  { id: 'models', n: '10', y: 436, h: 50, title: 'ai-models', sub: d('modelsSub'), tone: 'base' as Tone },
  { id: 'provider', n: '11', y: 498, h: 50, title: 'ai-provider', sub: d('providerSub'), tone: 'ai' as Tone },
  { id: 'translate', n: '', y: 644, h: 56, title: 'translate-resume', sub: d('translateSub'), tone: 'i18n' as Tone },
])

const providers = computed(() => [
  { y: 360, name: 'Anthropic', lines: [`Claude Haiku 5.5 · ${d('defaultModel')}`, 'Claude Sonnet 5.5'] },
  { y: 428, name: 'OpenAI', lines: ['GPT-5.6 Luna', 'text-embedding-3-small · 768d'] },
  { y: 496, name: 'Google', lines: ['Gemini 3.5 Flash-Lite'] },
  { y: 564, name: 'xAI', lines: ['Grok Build 0.1'] },
])

const tables = computed(() => [
  { id: 'chat_history', x: 272, title: 'chat_history', sub: d('chatHistorySub'), tone: 'base' as Tone },
  { id: 'resume', x: 432, title: 'resume.*', sub: d('resumeSub'), tone: 'base' as Tone },
  { id: 'cache', x: 592, title: 'translation_cache', sub: d('cacheSub'), tone: 'i18n' as Tone },
  { id: 'settings_db', x: 752, title: 'ai_settings', sub: d('settingsDbSub'), tone: 'base' as Tone },
  { id: 'embeddings', x: 912, title: 'document_embeddings', sub: d('embeddingsSub'), tone: 'base' as Tone },
])

// ───────── 간선 ─────────
const edges: Array<{ id: string, d: string, kind: EdgeKind }> = [
  { id: 'e1a', d: 'M120,136 V176', kind: 'base' },
  { id: 'e1b', d: 'M120,240 V276', kind: 'base' },
  { id: 'e2', d: 'M200,296 H272', kind: 'base' },
  // ③ chat_history INSERT (⑮ 교차 hop)
  { id: 'e3', d: 'M272,332 H260 V472 a4,4 0 0 1 0,8 V780 H342 V792', kind: 'base' },
  { id: 'e4', d: 'M300,276 V105 H504', kind: 'base' },
  // ⑦ 키워드 → resume.* / 벡터 → document_embeddings / 쿼리 임베딩 → Gateway
  { id: 'e5', d: 'M520,263 H470 V780 H502 V792', kind: 'base' },
  { id: 'e6', d: 'M840,276 H862 V780 H982 V792', kind: 'base' },
  { id: 'e7', d: 'M840,250 H870 V185 H920', kind: 'ai' },
  // ⑪ 스트리밍 요청 → Gateway (벡터 레인 hop) / ⑫ 라우팅 → Provider
  { id: 'e11', d: 'M856,523 H858 a4,4 0 0 1 8,0 H884 V214 H920', kind: 'ai' },
  { id: 'e12', d: 'M1150,300 V356', kind: 'ai' },
  // ⑬ SSE 응답
  { id: 'e13a', d: 'M480,200 H410 V276', kind: 'sse' },
  { id: 'e13b', d: 'M272,324 H204', kind: 'sse' },
  // ⑭~⑲ 답변 카드 다국어
  { id: 'e14', d: 'M120,340 V440', kind: 'i18n' },
  { id: 'e15', d: 'M200,476 H272', kind: 'i18n' },
  { id: 'e16', d: 'M352,512 V672 H466 a4,4 0 0 1 8,0 H504', kind: 'i18n' },
  { id: 'e17', d: 'M540,700 V792', kind: 'i18n' },
  { id: 'e18', d: 'M662,700 V792', kind: 'i18n' },
  { id: 'e19', d: 'M856,690 H858 a4,4 0 0 1 8,0 H896 V228 H920', kind: 'ai' },
]

// 번호 배지 (간선 위) — stage 는 STAGES 인덱스
const badges = computed(() => [
  { n: '1', cx: 140, cy: 156, text: d('a1'), stage: 0, tone: 'base' as Tone },
  { n: '2', cx: 214, cy: 280, text: d('a2'), stage: 0, tone: 'base' as Tone },
  { n: '3', cx: 260, cy: 620, text: d('a3'), stage: 0, tone: 'base' as Tone },
  { n: '4', cx: 320, cy: 80, text: d('a4'), stage: 1, tone: 'base' as Tone },
  { n: '12', cx: 1004, cy: 315, text: d('a12'), stage: 5, tone: 'ai' as Tone },
  { n: '13', cx: 410, cy: 238, text: d('a13'), stage: 6, tone: 'base' as Tone, anchor: 'end' },
  { n: '14', cx: 120, cy: 390, text: d('a14'), stage: 7, tone: 'i18n' as Tone },
  { n: '15', cx: 236, cy: 476, text: '', stage: 7, tone: 'i18n' as Tone },
  { n: '16', cx: 352, cy: 600, text: d('a16'), stage: 7, tone: 'i18n' as Tone },
  { n: '17', cx: 540, cy: 740, text: d('a17'), stage: 7, tone: 'i18n' as Tone },
  { n: '18', cx: 662, cy: 740, text: d('a18'), stage: 7, tone: 'i18n' as Tone },
  { n: '19', cx: 896, cy: 690, text: d('a19'), stage: 7, tone: 'ai' as Tone },
])

// 번호 없는 간선 라벨
const edgeLabels = computed(() => [
  { x: 464, y: 742, text: d('a5'), stage: 2, anchor: 'end', class: 'fill-neutral-600 dark:fill-neutral-300' },
  { x: 872, y: 772, text: d('a20'), stage: 2, anchor: 'start', class: 'fill-neutral-600 dark:fill-neutral-300' },
  { x: 1098, y: 190, text: d('a7'), stage: 2, anchor: 'start', class: 'fill-amber-700 dark:fill-amber-300 font-semibold' },
  { x: 1098, y: 226, text: d('a8'), stage: 5, anchor: 'start', class: 'fill-amber-700 dark:fill-amber-300 font-semibold' },
])

const labelClass = (stage: number) => ['transition-opacity duration-300', activeIndex.value === null || activeIndex.value === stage ? '' : 'opacity-25']

const onNodeKeydown = (event: KeyboardEvent, id: string) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    focusNode(id)
  }
}
</script>

<template>
  <figure class="w-full flex flex-col gap-y-3">
    <div class="w-full overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <svg
        viewBox="0 0 1200 900"
        class="block w-full min-w-[880px] h-auto font-sans select-none"
        role="group"
        :aria-label="t('aiComponents.concept.title')"
      >
        <defs>
          <marker
            v-for="kind in (['base', 'ai', 'i18n'] as const)"
            :id="markerId(kind)"
            :key="kind"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M0,0 L10,5 L0,10 z"
              :class="{
                'fill-neutral-400 dark:fill-neutral-500': kind === 'base',
                'fill-amber-500': kind === 'ai',
                'fill-sky-500': kind === 'i18n',
              }"
            />
          </marker>
        </defs>

        <!-- ───────── 영역(Zone) ───────── -->
        <g
          class="fill-neutral-50 dark:fill-neutral-900/60 stroke-neutral-300 dark:stroke-neutral-700"
          stroke-dasharray="5 4"
        >
          <rect
            x="16"
            y="40"
            width="208"
            height="500"
            rx="10"
          />
          <rect
            x="248"
            y="40"
            width="208"
            height="500"
            rx="10"
          />
          <rect
            x="480"
            y="40"
            width="400"
            height="548"
            rx="10"
          />
          <rect
            x="904"
            y="330"
            width="280"
            height="320"
            rx="10"
          />
          <rect
            x="248"
            y="750"
            width="936"
            height="140"
            rx="10"
          />
        </g>
        <rect
          x="480"
          y="612"
          width="400"
          height="108"
          rx="10"
          stroke-dasharray="5 4"
          class="fill-sky-50/60 dark:fill-sky-950/20 stroke-sky-400 dark:stroke-sky-700"
        />
        <rect
          x="904"
          y="40"
          width="280"
          height="260"
          rx="10"
          stroke-width="1.5"
          class="fill-amber-50 dark:fill-amber-950/40 stroke-amber-500 transition-opacity duration-300"
          :class="nodeClass('gateway')"
        />

        <g class="fill-neutral-500 dark:fill-neutral-400 text-[12px] font-semibold">
          <text
            x="30"
            y="62"
          >{{ d('zoneClient') }}</text>
          <text
            x="262"
            y="62"
          >{{ d('zoneServer') }}</text>
          <text
            x="494"
            y="62"
          >{{ d('zoneEdge') }}</text>
          <text
            x="494"
            y="634"
            class="fill-sky-700 dark:fill-sky-300"
          >{{ d('zoneTranslate') }}</text>
          <text
            x="918"
            y="352"
          >{{ d('zoneProviders') }}</text>
          <text
            x="1170"
            y="882"
            text-anchor="end"
          >{{ d('zoneDb') }}</text>
        </g>

        <!-- ───────── 간선 (노드 아래에 깔리도록 먼저 렌더) ───────── -->
        <path
          v-for="edge in edges"
          :key="edge.id"
          :d="edge.d"
          fill="none"
          stroke-width="1.5"
          :stroke-dasharray="edge.kind === 'sse' ? '6 4' : undefined"
          :marker-end="`url(#${markerId(edge.kind)})`"
          class="transition-opacity duration-300"
          :class="[edgeStroke[edge.kind], edgeClass(edge.id)]"
        />

        <!-- ───────── 클라이언트 · 서버 박스 ───────── -->
        <g
          v-for="box in boxes"
          :key="box.id"
          role="button"
          tabindex="0"
          class="cursor-pointer outline-none"
          :class="nodeClass(box.id)"
          :aria-label="`${box.title} — ${box.sub}`"
          @click="focusNode(box.id)"
          @keydown="onNodeKeydown($event, box.id)"
        >
          <rect
            :x="box.x"
            :y="box.y"
            :width="box.w"
            :height="box.h"
            rx="8"
            :class="boxTone[box.tone]"
          />
          <text
            :x="box.x + box.w / 2"
            :y="box.y + box.h / 2 - 4"
            text-anchor="middle"
            class="fill-neutral-800 dark:fill-neutral-100 text-[14px] font-bold"
          >{{ box.title }}</text>
          <text
            :x="box.x + box.w / 2"
            :y="box.y + box.h / 2 + 14"
            text-anchor="middle"
            class="fill-neutral-500 dark:fill-neutral-400 text-[12px]"
          >{{ box.sub }}</text>
        </g>

        <!-- ───────── Edge Function 단계 ───────── -->
        <g
          v-for="item in steps"
          :key="item.id"
          role="button"
          tabindex="0"
          class="cursor-pointer outline-none"
          :class="nodeClass(item.id)"
          :aria-label="`${item.n ? `${item.n}. ` : ''}${item.title} — ${item.sub}`"
          @click="focusNode(item.id)"
          @keydown="onNodeKeydown($event, item.id)"
        >
          <rect
            x="504"
            :y="item.y"
            width="352"
            :height="item.h"
            rx="8"
            :class="boxTone[item.tone]"
          />
          <template v-if="item.n">
            <circle
              cx="526"
              :cy="item.y + item.h / 2"
              r="12"
              :class="badgeTone[item.tone]"
            />
            <text
              x="526"
              :y="item.y + item.h / 2 + 5"
              text-anchor="middle"
              class="fill-white text-[14px] font-bold"
            >{{ item.n }}</text>
          </template>
          <text
            :x="item.n ? 546 : 524"
            :y="item.y + item.h / 2 - 4"
            class="fill-neutral-800 dark:fill-neutral-100 text-[14.5px] font-bold"
          >{{ item.title }}</text>
          <text
            :x="item.n ? 546 : 524"
            :y="item.y + item.h / 2 + 14"
            class="fill-neutral-500 dark:fill-neutral-400 text-[12.5px]"
          >{{ item.sub }}</text>
        </g>

        <!-- ⑦ RAG 검색 (키워드 → 벡터) -->
        <g
          role="button"
          tabindex="0"
          class="cursor-pointer outline-none"
          :class="nodeClass('rag')"
          :aria-label="`7. ${d('ragTitle')}`"
          @click="focusNode('rag')"
          @keydown="onNodeKeydown($event, 'rag')"
        >
          <rect
            x="504"
            y="204"
            width="352"
            height="96"
            rx="8"
            :class="boxTone.base"
          />
          <circle
            cx="526"
            cy="221"
            r="12"
            class="fill-amber-500"
          />
          <text
            x="526"
            y="226"
            text-anchor="middle"
            class="fill-white text-[14px] font-bold"
          >7</text>
          <text
            x="546"
            y="226"
            class="fill-neutral-800 dark:fill-neutral-100 text-[14.5px] font-bold"
          >{{ d('ragTitle') }}</text>
          <g class="fill-neutral-50 dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-600">
            <rect
              x="520"
              y="238"
              width="156"
              height="50"
              rx="6"
            />
            <rect
              x="684"
              y="238"
              width="156"
              height="50"
              rx="6"
            />
          </g>
          <g class="fill-neutral-800 dark:fill-neutral-100 text-[13px] font-semibold">
            <text
              x="598"
              y="258"
              text-anchor="middle"
            >{{ d('keyword') }}</text>
            <text
              x="762"
              y="258"
              text-anchor="middle"
            >{{ d('vector') }}</text>
          </g>
          <g class="fill-neutral-500 dark:fill-neutral-400 text-[12px]">
            <text
              x="598"
              y="276"
              text-anchor="middle"
            >{{ d('keywordSub') }}</text>
            <text
              x="762"
              y="276"
              text-anchor="middle"
            >{{ d('vectorSub') }}</text>
          </g>
          <text
            x="680"
            y="267"
            text-anchor="middle"
            class="fill-neutral-400 dark:fill-neutral-500 text-[12px]"
          >→</text>
        </g>

        <!-- ───────── Vercel AI Gateway ───────── -->
        <g
          role="button"
          tabindex="0"
          class="cursor-pointer outline-none"
          :class="nodeClass('gateway')"
          aria-label="Vercel AI Gateway"
          @click="focusNode('gateway')"
          @keydown="onNodeKeydown($event, 'gateway')"
        >
          <rect
            x="904"
            y="40"
            width="280"
            height="260"
            rx="10"
            fill="transparent"
          />
          <text
            x="920"
            y="70"
            class="fill-neutral-900 dark:fill-neutral-50 text-[16px] font-bold"
          >Vercel AI Gateway</text>
          <text
            x="920"
            y="90"
            class="fill-neutral-500 dark:fill-neutral-400 text-[12.5px]"
          >{{ d('gwSub') }}</text>
          <g class="fill-neutral-700 dark:fill-neutral-200 text-[12px]">
            <text
              x="920"
              y="118"
            >• {{ d('gwFeat1') }}</text>
            <text
              x="920"
              y="136"
            >• {{ d('gwFeat2') }}</text>
            <text
              x="920"
              y="154"
            >• {{ d('gwFeat3') }}</text>
          </g>
          <g class="fill-white dark:fill-neutral-800 stroke-amber-400 dark:stroke-amber-600">
            <rect
              x="920"
              y="172"
              width="170"
              height="26"
              rx="6"
            />
            <rect
              x="920"
              y="208"
              width="170"
              height="26"
              rx="6"
            />
          </g>
          <g class="fill-neutral-800 dark:fill-neutral-100 text-[12px] font-mono">
            <text
              x="932"
              y="190"
            >/v1/embeddings</text>
            <text
              x="932"
              y="226"
            >/v1/chat/completions</text>
          </g>
          <text
            x="920"
            y="262"
            class="fill-neutral-500 dark:fill-neutral-400 text-[12.5px]"
          >{{ d('gwModelId') }}</text>
          <text
            x="920"
            y="280"
            class="fill-neutral-500 dark:fill-neutral-400 text-[12.5px] font-mono"
          >anthropic/claude-haiku-5.5</text>
        </g>

        <!-- ───────── Providers ───────── -->
        <g
          role="button"
          tabindex="0"
          class="cursor-pointer outline-none"
          :class="nodeClass('providers')"
          :aria-label="d('zoneProviders')"
          @click="focusNode('providers')"
          @keydown="onNodeKeydown($event, 'providers')"
        >
          <g
            v-for="provider in providers"
            :key="provider.name"
          >
            <rect
              x="928"
              :y="provider.y"
              width="232"
              height="58"
              rx="8"
              :class="boxTone.base"
            />
            <text
              x="944"
              :y="provider.y + 22"
              class="fill-neutral-800 dark:fill-neutral-100 text-[14.5px] font-bold"
            >{{ provider.name }}</text>
            <text
              v-for="(line, index) in provider.lines"
              :key="line"
              x="944"
              :y="provider.y + 39 + index * 14"
              class="fill-neutral-500 dark:fill-neutral-400 text-[12px]"
            >{{ line }}</text>
          </g>
        </g>

        <!-- ───────── Supabase DB ───────── -->
        <g
          v-for="table in tables"
          :key="table.id"
          role="button"
          tabindex="0"
          class="cursor-pointer outline-none"
          :class="nodeClass(table.id)"
          :aria-label="`${table.title} — ${table.sub}`"
          @click="focusNode(table.id)"
          @keydown="onNodeKeydown($event, table.id)"
        >
          <rect
            :x="table.x"
            y="800"
            width="140"
            height="70"
            rx="10"
            :class="boxTone[table.tone]"
          />
          <ellipse
            :cx="table.x + 70"
            cy="800"
            rx="70"
            ry="8"
            :class="table.tone === 'i18n'
              ? 'fill-sky-100 dark:fill-sky-900 stroke-sky-500'
              : 'fill-neutral-100 dark:fill-neutral-700 stroke-neutral-300 dark:stroke-neutral-600'"
          />
          <text
            :x="table.x + 70"
            y="834"
            text-anchor="middle"
            class="fill-neutral-800 dark:fill-neutral-100 text-[12px] font-bold"
          >{{ table.title }}</text>
          <text
            :x="table.x + 70"
            y="853"
            text-anchor="middle"
            class="fill-neutral-500 dark:fill-neutral-400 text-[11.5px]"
          >{{ table.sub }}</text>
        </g>

        <!-- ───────── 간선 라벨 ───────── -->
        <g
          v-for="badge in badges"
          :key="badge.n"
          :class="labelClass(badge.stage)"
        >
          <circle
            :cx="badge.cx"
            :cy="badge.cy"
            r="12"
            :class="badgeTone[badge.tone]"
          />
          <text
            :x="badge.cx"
            :y="badge.cy + 5"
            text-anchor="middle"
            class="fill-white text-[13px] font-bold"
          >{{ badge.n }}</text>
          <text
            v-if="badge.text"
            :x="badge.anchor === 'end' ? badge.cx - 17 : badge.cx + 17"
            :y="badge.cy + 5"
            :text-anchor="badge.anchor === 'end' ? 'end' : 'start'"
            class="fill-neutral-700 dark:fill-neutral-200 text-[12.5px] font-semibold"
          >{{ badge.text }}</text>
        </g>
        <text
          v-for="label in edgeLabels"
          :key="label.text"
          :x="label.x"
          :y="label.y"
          :text-anchor="label.anchor"
          class="text-[12px]"
          :class="[label.class, labelClass(label.stage)]"
        >{{ label.text }}</text>
      </svg>
    </div>
    <figcaption class="text-base text-neutral-500 dark:text-neutral-400 break-keep">
      {{ d('caption') }}
      <span class="block mt-0.5 sm:hidden">{{ d('scrollHint') }}</span>
    </figcaption>

    <!-- ───────── 단계 선택 ───────── -->
    <div
      class="flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      :aria-label="d('hint')"
    >
      <DdButton
        :label="d('overviewTitle')"
        icon="i-lucide-layout-grid"
        size="md"
        color="neutral"
        :variant="activeIndex === null ? 'solid' : 'outline'"
        class="shrink-0"
        role="tab"
        :aria-selected="activeIndex === null"
        @click="selectStage(null)"
      />
      <DdButton
        v-for="(stage, index) in stages"
        :key="stage.range"
        :label="stage.title"
        size="md"
        :color="index === 7 || index === 3 ? 'info' : 'warning'"
        :variant="activeIndex === index ? 'solid' : 'outline'"
        class="shrink-0"
        role="tab"
        :aria-selected="activeIndex === index"
        @click="selectStage(index)"
      >
        <template #leading>
          <span class="font-mono text-sm opacity-80">{{ stage.range }}</span>
        </template>
      </DdButton>
    </div>

    <!-- ───────── 설명 패널 ───────── -->
    <DdCard
      :ui="{ header: 'p-3 sm:px-4', body: 'p-3 sm:p-4' }"
      aria-live="polite"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-x-2 min-w-0">
            <DdBadge
              :label="activeStage ? `${d('stepLabel')} ${activeStage.range}` : d('overviewTitle')"
              :color="activeIndex === 7 || activeIndex === 3 ? 'info' : activeStage ? 'warning' : 'neutral'"
              variant="subtle"
              class="shrink-0"
            />
            <h4 class="text-base font-bold break-keep truncate">
              {{ activeStage ? activeStage.title : t('aiComponents.concept.title') }}
            </h4>
          </div>
          <div class="flex items-center gap-x-1">
            <DdButton
              icon="i-lucide-chevron-left"
              size="sm"
              color="neutral"
              variant="ghost"
              :aria-label="d('prev')"
              @click="step(-1)"
            />
            <DdButton
              :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
              size="sm"
              color="neutral"
              variant="ghost"
              :aria-label="isPlaying ? d('pause') : d('play')"
              @click="togglePlay"
            />
            <DdButton
              icon="i-lucide-chevron-right"
              size="sm"
              color="neutral"
              variant="ghost"
              :aria-label="d('next')"
              @click="step(1)"
            />
            <DdButton
              icon="i-lucide-rotate-ccw"
              size="sm"
              color="neutral"
              variant="ghost"
              :disabled="activeIndex === null"
              :aria-label="d('reset')"
              @click="selectStage(null)"
            />
          </div>
        </div>
      </template>
      <div class="space-y-1.5">
        <p
          v-for="item in (activeStage ? activeStage.description : overview)"
          :key="item"
          class="text-base text-neutral-600 dark:text-neutral-300 break-keep leading-relaxed"
        >
          {{ item }}
        </p>
        <p
          v-if="!activeStage"
          class="text-sm text-neutral-500 dark:text-neutral-400 break-keep"
        >
          {{ d('hint') }}
        </p>
      </div>
    </DdCard>
  </figure>
</template>

<style scoped>
/* 선택된 단계의 간선: 흐름 방향으로 흐르는 점선 */
.arch-flow {
  stroke-width: 2.25;
  stroke-dasharray: 8 6;
  animation: arch-dash 0.8s linear infinite;
}
@keyframes arch-dash {
  to {
    stroke-dashoffset: -14;
  }
}
@media (prefers-reduced-motion: reduce) {
  .arch-flow {
    animation: none;
  }
}
</style>
