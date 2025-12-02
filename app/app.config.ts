export default defineAppConfig({
  theme: {
    screens: {
      sm: '340px',
    },
  },
  toaster: {
    position: 'top-right' as const,
    expand: true,
    duration: 2000,
  },
  ui: {
    colors: {
      primary: 'amber',
      secondary: 'indigo',
      success: 'emerald',
      info: 'sky',
      warning: 'orange',
      error: 'rose',
      neutral: 'neutral',
    },
    modal: {
      variants: {
        fullscreen: {
          false: {
            content: 'max-w-lg w-[90vw] h-auto rounded-[calc(var(--ui-radius)*2)] shadow-lg ring',
          },
        },
      },
    },
    textarea: {
      compoundVariants: [
        {
          trailing: true,
          size: 'md',
          class: {
            base: '!pe-11',
          },
        },
      ],
    },
  },
})
