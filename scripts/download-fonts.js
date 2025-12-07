#!/usr/bin/env node

/**
 * 폰트 다운로드 스크립트
 * 필요한 폰트 파일들을 다운로드하여 public/fonts 디렉토리에 저장합니다.
 */

import { createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const fontDir = join(rootDir, 'public', 'fonts')

async function downloadFile(url, dest) {
  try {
    console.log(`다운로드 중: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const fileStream = createWriteStream(dest)
    await pipeline(response.body, fileStream)
    console.log(`✓ 다운로드 완료: ${dest}`)
    return true
  }
  catch (error) {
    console.error(`✗ 다운로드 실패: ${url}`, error.message)
    return false
  }
}

async function main() {
  console.log('폰트 파일 다운로드를 시작합니다...\n')

  // 폰트 디렉토리 생성
  await mkdir(fontDir, { recursive: true })

  const downloads = [
    // SUIT Variable Font (JSDelivr CDN) - 가장 간단함
    {
      url: 'https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT-Variable.woff2',
      dest: join(fontDir, 'SUIT-Variable.woff2'),
      name: 'SUIT Variable',
    },
    // Source Code Pro Variable Fonts
    // GitHub에서 직접 다운로드 (woff2 변환 필요할 수 있음)
    {
      url: 'https://github.com/adobe-fonts/source-code-pro/releases/download/2.042R-u/1.062R-i/1.026R-vf/SourceCodeVariable-Roman.otf',
      dest: join(fontDir, 'SourceCodePro-VariableFont_wght.otf'),
      name: 'Source Code Pro Variable (OTF)',
      note: 'woff2 변환이 필요할 수 있습니다. https://cloudconvert.com/otf-to-woff2 사용',
    },
    {
      url: 'https://github.com/adobe-fonts/source-code-pro/releases/download/2.042R-u/1.062R-i/1.026R-vf/SourceCodeVariable-Italic.otf',
      dest: join(fontDir, 'SourceCodePro-Italic-VariableFont_wght.otf'),
      name: 'Source Code Pro Italic Variable (OTF)',
      note: 'woff2 변환이 필요할 수 있습니다.',
    },
  ]

  for (const item of downloads) {
    const success = await downloadFile(item.url, item.dest)
    if (success && item.note) {
      console.log(`  참고: ${item.note}\n`)
    }
  }

  console.log('\n폰트 다운로드 완료!')
  console.log('\n다음 폰트들은 수동으로 다운로드해야 합니다:')
  console.log('1. Anton: https://fonts.google.com/specimen/Anton')
  console.log('   - "Download family" 버튼 클릭')
  console.log('   - 압축 해제 후 Regular.woff2 파일을 public/fonts/Anton-Regular.woff2로 복사')
  console.log('\n2. BIZ UDPGothic: https://fonts.google.com/specimen/BIZ+UDPGothic')
  console.log('   - "Download family" 버튼 클릭')
  console.log('   - 압축 해제 후 Regular.woff2와 Bold.woff2 파일을 public/fonts/로 복사')
  console.log('\n3. Source Code Pro (woff2 변환 필요 시):')
  console.log('   - 다운로드된 .otf 파일을 https://cloudconvert.com/otf-to-woff2 에서 변환')
  console.log('   - 또는 https://github.com/adobe-fonts/source-code-pro 에서 woff2 버전 확인')
  console.log('\n필요한 파일 목록:')
  console.log('  - public/fonts/SourceCodePro-VariableFont_wght.woff2')
  console.log('  - public/fonts/SourceCodePro-Italic-VariableFont_wght.woff2')
  console.log('  - public/fonts/Anton-Regular.woff2')
  console.log('  - public/fonts/BIZUDPGothic-Regular.woff2')
  console.log('  - public/fonts/BIZUDPGothic-Bold.woff2')
  console.log('  - public/fonts/SUIT-Variable.woff2')
}

main().catch(console.error)
