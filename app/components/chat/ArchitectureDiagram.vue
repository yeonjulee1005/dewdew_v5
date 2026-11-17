<script setup lang="ts">
// RAG AI 채팅 시스템 아키텍처 (인라인 SVG — 라이트/다크 테마 대응)
// 흐름: 클라이언트 → Nuxt Server → Edge Function(RAG) → Vercel AI Gateway → Provider, 하단 Supabase DB
// 좌표는 viewBox(1200×750) 기준. 화살표가 교차하지 않도록 레인을 분리해 두었다.
const { t } = useI18n()
const d = (key: string) => t(`aiComponents.concept.diagram.${key}`)

// Edge Function 내부 단계 (RAG 블록 제외)
const edgeSteps = computed(() => [
  { n: '⑤', y: 80, title: 'history-optimizer', sub: d('optimizerSub') },
  { n: '⑥', y: 142, title: 'ai_settings', sub: d('settingsSub') },
  { n: '⑧', y: 312, title: 'component-mapper', sub: d('mapperSub') },
  { n: '⑨', y: 374, title: 'ai-models', sub: d('modelsSub') },
  { n: '⑩', y: 436, title: 'ai-provider', sub: d('providerSub'), accent: true },
])

const providers = computed(() => [
  { y: 360, name: 'Anthropic', lines: [`Claude Haiku 5.5 · ${d('defaultModel')}`, 'Claude Sonnet 5.5'] },
  { y: 428, name: 'OpenAI', lines: ['GPT-5.6 Luna', 'text-embedding-3-small · 768d'] },
  { y: 496, name: 'Google', lines: ['Gemini 3.5 Flash-Lite'] },
  { y: 564, name: 'xAI', lines: ['Grok Build 0.1'] },
])

const tables = computed(() => [
  { x: 272, title: 'chat_history', sub: d('chatHistorySub') },
  { x: 424, title: 'resume.*', sub: d('resumeSub') },
  { x: 576, title: 'document_embeddings', sub: d('embeddingsSub') },
  { x: 728, title: 'ai_settings', sub: d('settingsDbSub') },
])
</script>

<template>
  <figure class="w-full">
    <div class="w-full overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <svg
        viewBox="0 0 1200 750"
        class="block w-full min-w-[880px] h-auto text-neutral-400 dark:text-neutral-500 font-sans"
        role="img"
        :aria-label="t('aiComponents.concept.title')"
      >
        <defs>
          <marker
            id="arch-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M0,0 L10,5 L0,10 z"
              fill="currentColor"
            />
          </marker>
          <marker
            id="arch-arrow-accent"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M0,0 L10,5 L0,10 z"
              class="fill-amber-500"
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
            height="330"
            rx="10"
          />
          <rect
            x="248"
            y="40"
            width="208"
            height="330"
            rx="10"
          />
          <rect
            x="480"
            y="40"
            width="400"
            height="510"
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
            y="580"
            width="632"
            height="150"
            rx="10"
          />
        </g>
        <rect
          x="904"
          y="40"
          width="280"
          height="260"
          rx="10"
          class="fill-amber-50 dark:fill-amber-950/40 stroke-amber-500"
          stroke-width="1.5"
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
            x="918"
            y="352"
          >{{ d('zoneProviders') }}</text>
          <text
            x="262"
            y="602"
          >{{ d('zoneDb') }}</text>
        </g>

        <!-- ───────── 클라이언트 ───────── -->
        <g class="fill-white dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-600">
          <rect
            x="40"
            y="80"
            width="160"
            height="56"
            rx="8"
          />
          <rect
            x="40"
            y="176"
            width="160"
            height="64"
            rx="8"
          />
          <rect
            x="40"
            y="276"
            width="160"
            height="64"
            rx="8"
          />
          <rect
            x="272"
            y="276"
            width="160"
            height="64"
            rx="8"
          />
        </g>
        <g class="fill-neutral-800 dark:fill-neutral-100 text-[14px] font-bold">
          <text
            x="120"
            y="104"
            text-anchor="middle"
          >{{ d('visitor') }}</text>
          <text
            x="120"
            y="202"
            text-anchor="middle"
          >Chat UI</text>
          <text
            x="120"
            y="302"
            text-anchor="middle"
          >useChat</text>
          <text
            x="352"
            y="302"
            text-anchor="middle"
          >POST /api/chat</text>
        </g>
        <g class="fill-neutral-500 dark:fill-neutral-400 text-[12.5px]">
          <text
            x="120"
            y="123"
            text-anchor="middle"
          >{{ d('visitorSub') }}</text>
          <text
            x="120"
            y="222"
            text-anchor="middle"
          >{{ d('chatUiSub') }}</text>
          <text
            x="120"
            y="322"
            text-anchor="middle"
          >{{ d('useChatSub') }}</text>
          <text
            x="352"
            y="322"
            text-anchor="middle"
          >{{ d('apiChatSub') }}</text>
        </g>

        <!-- ───────── Edge Function 단계 ───────── -->
        <g
          v-for="step in edgeSteps"
          :key="step.title"
        >
          <rect
            x="504"
            :y="step.y"
            width="352"
            height="50"
            rx="8"
            :class="step.accent
              ? 'fill-amber-50 dark:fill-amber-950/40 stroke-amber-500'
              : 'fill-white dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-600'"
          />
          <text
            x="520"
            :y="step.y + 30"
            class="fill-amber-600 dark:fill-amber-400 text-[16px] font-bold"
          >{{ step.n }}</text>
          <text
            x="546"
            :y="step.y + 21"
            class="fill-neutral-800 dark:fill-neutral-100 text-[14.5px] font-bold"
          >{{ step.title }}</text>
          <text
            x="546"
            :y="step.y + 39"
            class="fill-neutral-500 dark:fill-neutral-400 text-[12.5px]"
          >{{ step.sub }}</text>
        </g>

        <!-- ⑦ RAG 검색 (키워드 → 벡터) -->
        <rect
          x="504"
          y="204"
          width="352"
          height="96"
          rx="8"
          class="fill-white dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-600"
        />
        <text
          x="520"
          y="228"
          class="fill-amber-600 dark:fill-amber-400 text-[16px] font-bold"
        >⑦</text>
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

        <!-- ───────── Vercel AI Gateway ───────── -->
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

        <!-- ───────── Providers ───────── -->
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
            class="fill-white dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-600"
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

        <!-- ───────── Supabase DB ───────── -->
        <g
          v-for="table in tables"
          :key="table.title"
        >
          <rect
            :x="table.x"
            y="630"
            width="140"
            height="80"
            rx="10"
            class="fill-white dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-600"
          />
          <ellipse
            :cx="table.x + 70"
            cy="630"
            rx="70"
            ry="8"
            class="fill-neutral-100 dark:fill-neutral-700 stroke-neutral-300 dark:stroke-neutral-600"
          />
          <text
            :x="table.x + 70"
            y="664"
            text-anchor="middle"
            class="fill-neutral-800 dark:fill-neutral-100 text-[12px] font-bold"
          >{{ table.title }}</text>
          <text
            :x="table.x + 70"
            y="684"
            text-anchor="middle"
            class="fill-neutral-500 dark:fill-neutral-400 text-[12px]"
          >{{ table.sub }}</text>
        </g>

        <!-- ───────── 요청 흐름 화살표 ───────── -->
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          marker-end="url(#arch-arrow)"
        >
          <!-- ① 질문 -->
          <path d="M120,136 V176" />
          <path d="M120,240 V276" />
          <!-- ② POST /api/chat -->
          <path d="M200,296 H272" />
          <!-- ③ chat_history INSERT -->
          <path d="M342,340 V622" />
          <!-- ④ Edge Function 호출 -->
          <path d="M380,276 V96 H504" />
          <!-- ⑦ 키워드 조회 → resume -->
          <path d="M520,252 H490 V622" />
          <!-- ⑦ 벡터 검색 → document_embeddings -->
          <path d="M840,276 H872 V572 H646 V622" />
        </g>
        <g
          fill="none"
          stroke-width="1.5"
          class="stroke-amber-500"
          marker-end="url(#arch-arrow-accent)"
        >
          <!-- ⑦ 쿼리 임베딩 → Gateway -->
          <path d="M840,262 H884 V185 H920" />
          <!-- ⑩ 스트리밍 요청 → Gateway -->
          <path d="M856,461 H866 a6,6 0 0 1 12,0 H896 V221 H920" />
          <!-- ⑪ 라우팅 · 폴백 → Provider -->
          <path d="M1044,300 V356" />
        </g>
        <!-- ⑫ SSE 응답 (역방향, 점선) -->
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-dasharray="6 4"
          marker-end="url(#arch-arrow)"
        >
          <path d="M480,200 H410 V276" />
          <path d="M272,324 H204" />
        </g>

        <!-- ───────── 화살표 라벨 ───────── -->
        <g class="fill-neutral-600 dark:fill-neutral-300 text-[12px]">
          <text
            x="128"
            y="160"
          >① {{ d('a1') }}</text>
          <text
            x="206"
            y="290"
          >② {{ d('a2') }}</text>
          <text
            x="348"
            y="460"
          >③ {{ d('a3') }}</text>
          <text
            x="388"
            y="88"
          >④ {{ d('a4') }}</text>
          <text
            x="496"
            y="540"
          >{{ d('a5') }}</text>
          <text
            x="652"
            y="566"
          >{{ d('a6') }}</text>
          <text
            x="1052"
            y="320"
          >⑪ {{ d('a9') }}</text>
        </g>
        <g class="fill-amber-700 dark:fill-amber-300 text-[12px] font-semibold">
          <text
            x="1098"
            y="190"
          >{{ d('a7') }}</text>
          <text
            x="1098"
            y="226"
          >{{ d('a8') }}</text>
        </g>
        <g class="fill-neutral-600 dark:fill-neutral-300 text-[12px] font-semibold">
          <text
            x="416"
            y="194"
          >⑫ SSE</text>
          <text
            x="206"
            y="342"
          >{{ d('a10') }}</text>
        </g>
      </svg>
    </div>
    <figcaption class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 break-keep">
      {{ d('caption') }}
    </figcaption>
  </figure>
</template>
