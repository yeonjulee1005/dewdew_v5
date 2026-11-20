// 한국어 지명 → 영문 표기 (국어의 로마자 표기법 기반)
// 날씨 위젯 관측 지점명(kmaStations.json, 예: "인천광역시 연수구")을 영어 화면에서 "Yeonsu-gu, Incheon" 으로 표시한다.
// - 시·도: 공식 영문 표기 고정표
// - 시·군·구·읍·면·동: 음절 로마자 변환 + 행정구역 접미사(-si, -gun, -gu …). 접미사 경계에서는 동화를 적용하지 않는다(표기법 규정)
// - 주요 자음동화(비음화·유음화)와 연음을 반영한다. 완벽한 발음 규칙 구현은 아니며, 예외는 OVERRIDES 에 추가한다.

const INITIALS = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h']
const MEDIALS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i']
// 받침 → 대표음 (음절 끝·자음 앞)
const FINALS = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't']
// 받침 → 모음 앞 연음 시 다음 음절 초성으로 넘어가는 소리
const LIAISON = ['', 'g', 'kk', 'ks', 'n', 'nj', 'n', 'd', 'r', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'r', 'm', 'b', 'ps', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', '']

// 받침 대표음 분류
const VELAR = new Set([1, 2, 3, 9, 24]) // ㄱ ㄲ ㄳ ㄺ ㅋ
const DENTAL = new Set([7, 19, 20, 22, 23, 25, 27]) // ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ
const LABIAL = new Set([17, 18, 26, 14]) // ㅂ ㅄ ㅍ ㄿ
const NASAL_INITIAL = new Set([2, 6]) // ㄴ ㅁ
const RIEUL_INITIAL = 5 // ㄹ
const SILENT_INITIAL = 11 // ㅇ

const PROVINCES: Record<string, string> = {
  서울특별시: 'Seoul',
  서울: 'Seoul',
  부산광역시: 'Busan',
  부산: 'Busan',
  대구광역시: 'Daegu',
  대구: 'Daegu',
  인천광역시: 'Incheon',
  인천: 'Incheon',
  광주광역시: 'Gwangju',
  광주: 'Gwangju',
  대전광역시: 'Daejeon',
  대전: 'Daejeon',
  울산광역시: 'Ulsan',
  울산: 'Ulsan',
  세종특별자치시: 'Sejong',
  경기도: 'Gyeonggi-do',
  강원특별자치도: 'Gangwon',
  강원도: 'Gangwon-do',
  충청북도: 'Chungcheongbuk-do',
  충청남도: 'Chungcheongnam-do',
  전북특별자치도: 'Jeonbuk',
  전라북도: 'Jeollabuk-do',
  전라남도: 'Jeollanam-do',
  전남광주통합특별시: 'Jeonnam-Gwangju',
  경상북도: 'Gyeongsangbuk-do',
  경상남도: 'Gyeongsangnam-do',
  제주특별자치도: 'Jeju',
}

// 규칙으로 맞지 않는 관용 표기
const OVERRIDES: Record<string, string> = {
  울릉도독도: 'Ulleungdo-Dokdo',
}

const ADMIN_SUFFIX: Record<string, string> = {
  시: 'si',
  군: 'gun',
  구: 'gu',
  읍: 'eup',
  면: 'myeon',
  동: 'dong',
  도: 'do',
}

const isHangulSyllable = (char: string) => char >= '가' && char <= '힣'

const decompose = (char: string) => {
  const code = char.charCodeAt(0) - 0xAC00
  return { initial: Math.floor(code / 588), medial: Math.floor((code % 588) / 28), final: code % 28 }
}

/** 한글 단어를 로마자로 변환 (한글 외 문자는 그대로) */
export const romanizeWord = (word: string): string => {
  const chars = [...word]
  let result = ''

  chars.forEach((char, index) => {
    if (!isHangulSyllable(char)) {
      result += char
      return
    }

    const current = decompose(char)
    const prevChar = chars[index - 1]
    const prev = prevChar && isHangulSyllable(prevChar) ? decompose(prevChar) : null
    const nextChar = chars[index + 1]
    const next = nextChar && isHangulSyllable(nextChar) ? decompose(nextChar) : null

    // 초성: 앞 음절 받침과의 관계로 결정
    let initial = INITIALS[current.initial] ?? ''
    if (prev && prev.final !== 0) {
      if (current.initial === SILENT_INITIAL) {
        // 연음: 앞 받침이 넘어옴 (받침 쪽에서 출력)
        initial = ''
      }
      else if (current.initial === RIEUL_INITIAL) {
        // ㄹ 초성: 앞 받침이 ㄴ·ㄹ → l(유음화), 그 외 → n(비음화)
        initial = prev.final === 4 || prev.final === 8 ? 'l' : 'n'
      }
      else if (current.initial === 2 && prev.final === 8) {
        // ㄹ 받침 + ㄴ → ll (유음화)
        initial = 'l'
      }
    }
    else if (index === 0 && current.initial === RIEUL_INITIAL) {
      initial = 'r'
    }

    // 받침: 다음 음절 초성과의 관계로 결정
    let final = FINALS[current.final] ?? ''
    if (current.final !== 0 && next) {
      if (next.initial === SILENT_INITIAL) {
        final = current.final === 21 ? 'ng' : (LIAISON[current.final] ?? '')
      }
      else if (NASAL_INITIAL.has(next.initial) || next.initial === RIEUL_INITIAL) {
        if (VELAR.has(current.final)) final = 'ng'
        else if (DENTAL.has(current.final)) final = 'n'
        else if (LABIAL.has(current.final)) final = 'm'
        else if (current.final === 4 && next.initial === RIEUL_INITIAL) final = 'l'
      }
      else if (current.final === 8 && next.initial !== RIEUL_INITIAL) {
        // ㄹ 받침 + 자음: l 유지
        final = 'l'
      }
    }

    result += initial + (MEDIALS[current.medial] ?? '') + final
  })

  return result
}

const capitalize = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text)

/** 행정구역 단위 하나 (예: "연수구" → "Yeonsu-gu", "고양시덕양구" → "Deogyang-gu, Goyang-si") */
const romanizeDistrict = (token: string): string => {
  const cleaned = token.replace(/\(.*?\)/g, '').trim()
  if (!cleaned) return ''
  if (OVERRIDES[cleaned]) return OVERRIDES[cleaned]
  if (PROVINCES[cleaned]) return PROVINCES[cleaned]

  // "고양시덕양구" 처럼 붙어 있는 다단계 행정구역 분리 (작은 단위가 앞에 오도록 역순)
  const segments = cleaned.match(/.+?[시군구읍면동](?=.)|.+$/g) ?? [cleaned]
  return segments
    .map((segment) => {
      const suffix = segment.slice(-1)
      const base = segment.slice(0, -1)
      if (ADMIN_SUFFIX[suffix] && base.length >= 1 && [...segment].length >= 2) {
        return `${capitalize(romanizeWord(base))}-${ADMIN_SUFFIX[suffix]}`
      }
      return capitalize(romanizeWord(segment))
    })
    .reverse()
    .join(', ')
}

/**
 * 관측 지점 지역명 → 영문 ("인천광역시 연수구" → "Yeonsu-gu, Incheon")
 * 영문 관례에 따라 작은 행정구역이 앞에 온다.
 */
export const romanizeLocation = (location: string): string => {
  const tokens = location.trim().split(/\s+/).filter(Boolean)
  return tokens
    .map(romanizeDistrict)
    .filter(Boolean)
    .reverse()
    .join(', ')
}
