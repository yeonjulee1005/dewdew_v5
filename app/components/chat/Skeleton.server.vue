<template>
  <div class="flex flex-col h-full">
    <!-- 메시지 영역 스켈레톤 -->
    <div class="flex-1 p-4 space-y-4">
      <div class="flex items-start gap-3 animate-pulse">
        <!-- 아바타 -->
        <DdSkeleton class="w-8 h-8 rounded-full" />

        <!-- 메시지 -->
        <div class="flex-1 space-y-2">
          <DdSkeleton class="h-4 w-3/4" />
          <DdSkeleton class="h-4 w-1/2" />
          <DdSkeleton class="h-4 w-2/3" />
        </div>
      </div>
    </div>

    <!-- 입력창 스켈레톤 -->
    <div class="border-t border-neutral-200 dark:border-neutral-800 p-4">
      <div class="flex gap-2">
        <DdSkeleton class="flex-1 h-10 rounded-lg" />
        <DdSkeleton class="w-10 h-10 rounded-lg" />
      </div>
    </div>
  </div>
</template>
