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
    prose: {
      a: {
        base: [
          'text-amber-500 border-b border-transparent hover:border-amber-500 font-medium focus-visible:outline-amber-500 focus-visible:has-[>code]:outline-0 [&>code]:border-dashed hover:[&>code]:border-amber-500 hover:[&>code]:text-amber-500 focus-visible:[&>code]:border-amber-500 focus-visible:[&>code]:text-amber-500',
          'transition-colors [&>code]:transition-colors',
        ],
      },
      h1: {
        slots: {
          base: 'text-4xl text-highlighted font-bold mt-4 mb-2 scroll-mt-[calc(45px+var(--ui-header-height))] lg:scroll-mt-(--ui-header-height)',
          link: 'inline-flex items-center gap-2',
        },
      },
      h2: {
        slots: {
          base: [
            'relative text-2xl text-highlighted font-bold mt-16 mb-4 scroll-mt-[calc(48px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-xl/7 [&>a>code]:font-bold',
            '[&>a>code]:transition-colors',
          ],
          leading: [
            'absolute -ms-8 top-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted',
            'transition',
          ],
          leadingIcon: 'size-4 shrink-0',
          link: 'group lg:ps-2 lg:-ms-2',
        },
      },
      h3: {
        slots: {
          base: [
            'relative text-xl text-highlighted font-bold mt-10 mb-2 scroll-mt-[calc(32px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(32px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-lg/6 [&>a>code]:font-bold',
            '[&>a>code]:transition-colors',
          ],
          leading: [
            'absolute -ms-8 top-0.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted',
            'transition',
          ],
          leadingIcon: 'size-4 shrink-0',
          link: 'group lg:ps-2 lg:-ms-2',
        },
      },
      h4: {
        slots: {
          base: 'text-lg text-highlighted font-bold mt-8 mb-2 scroll-mt-[calc(24px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(24px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary',
          link: '',
        },
      },
      p: {
        base: 'my-5 leading-7 text-pretty',
      },
      blockquote: {
        base: 'border-s-4 border-accented ps-4 italic',
      },
      hr: {
        base: 'h-10 mt-12 mb-0 w-full border-none bg-[image:var(--zigzag-footer-pattern)] dark:bg-[image:var(--zigzag-footer-dark-pattern)] bg-repeat-x',
      },
    },
  },
})
