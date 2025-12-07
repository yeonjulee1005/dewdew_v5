#!/bin/bash

# 폰트 다운로드 스크립트
# 이 스크립트는 필요한 폰트 파일들을 다운로드하여 public/fonts 디렉토리에 저장합니다.

FONT_DIR="public/fonts"
mkdir -p "$FONT_DIR"

echo "폰트 파일 다운로드를 시작합니다..."

# 1. Source Code Pro Variable Font (Google Fonts)
echo "Source Code Pro 다운로드 중..."
curl -L "https://github.com/adobe-fonts/source-code-pro/releases/download/2.042R-u/1.062R-i/1.026R-vf/SourceCodeVariable-Italic.otf" -o "$FONT_DIR/SourceCodePro-Italic-VariableFont_wght.otf" 2>/dev/null || echo "Source Code Pro Italic 다운로드 실패 (수동 다운로드 필요)"
curl -L "https://github.com/adobe-fonts/source-code-pro/releases/download/2.042R-u/1.062R-i/1.026R-vf/SourceCodeVariable-Roman.otf" -o "$FONT_DIR/SourceCodePro-VariableFont_wght.otf" 2>/dev/null || echo "Source Code Pro Roman 다운로드 실패 (수동 다운로드 필요)"

# 2. Anton (Google Fonts)
echo "Anton 다운로드 중..."
curl -L "https://fonts.google.com/download?family=Anton" -o "$FONT_DIR/Anton.zip" 2>/dev/null || echo "Anton 다운로드 실패 (수동 다운로드 필요)"
if [ -f "$FONT_DIR/Anton.zip" ]; then
  unzip -q -o "$FONT_DIR/Anton.zip" -d "$FONT_DIR/anton_temp" 2>/dev/null
  find "$FONT_DIR/anton_temp" -name "*.woff2" -exec mv {} "$FONT_DIR/Anton-Regular.woff2" \; 2>/dev/null
  rm -rf "$FONT_DIR/anton_temp" "$FONT_DIR/Anton.zip" 2>/dev/null
fi

# 3. BIZ UDPGothic (Google Fonts)
echo "BIZ UDPGothic 다운로드 중..."
curl -L "https://fonts.google.com/download?family=BIZ%20UDPGothic" -o "$FONT_DIR/BIZUDPGothic.zip" 2>/dev/null || echo "BIZ UDPGothic 다운로드 실패 (수동 다운로드 필요)"
if [ -f "$FONT_DIR/BIZUDPGothic.zip" ]; then
  unzip -q -o "$FONT_DIR/BIZUDPGothic.zip" -d "$FONT_DIR/biz_temp" 2>/dev/null
  find "$FONT_DIR/biz_temp" -name "*Regular*.woff2" -exec mv {} "$FONT_DIR/BIZUDPGothic-Regular.woff2" \; 2>/dev/null
  find "$FONT_DIR/biz_temp" -name "*Bold*.woff2" -exec mv {} "$FONT_DIR/BIZUDPGothic-Bold.woff2" \; 2>/dev/null
  rm -rf "$FONT_DIR/biz_temp" "$FONT_DIR/BIZUDPGothic.zip" 2>/dev/null
fi

# 4. SUIT Variable Font (JSDelivr CDN)
echo "SUIT Variable 다운로드 중..."
curl -L "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT-Variable.woff2" -o "$FONT_DIR/SUIT-Variable.woff2" 2>/dev/null || echo "SUIT Variable 다운로드 실패 (수동 다운로드 필요)"

echo ""
echo "폰트 다운로드 완료!"
echo ""
echo "다음 파일들이 필요합니다:"
echo "  - $FONT_DIR/SourceCodePro-VariableFont_wght.woff2"
echo "  - $FONT_DIR/SourceCodePro-Italic-VariableFont_wght.woff2"
echo "  - $FONT_DIR/Anton-Regular.woff2"
echo "  - $FONT_DIR/BIZUDPGothic-Regular.woff2"
echo "  - $FONT_DIR/BIZUDPGothic-Bold.woff2"
echo "  - $FONT_DIR/SUIT-Variable.woff2"
echo ""
echo "누락된 파일이 있다면 수동으로 다운로드해주세요:"
echo "  - Source Code Pro: https://github.com/adobe-fonts/source-code-pro"
echo "  - Anton: https://fonts.google.com/specimen/Anton"
echo "  - BIZ UDPGothic: https://fonts.google.com/specimen/BIZ+UDPGothic"
echo "  - SUIT: https://github.com/sun-typeface/SUIT"

