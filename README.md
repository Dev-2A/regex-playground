# 🔤 Regex Playground

> 정규식 구조 다이어그램 시각화 & 실시간 매칭 테스터

[![Deploy](https://github.com/Dev-2A/regex-playground/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dev-2A/regex-playground/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://dev-2a.github.io/regex-playground/)

정규식을 입력하면 **Railroad Diagram**으로 구조를 시각화하고, 테스트 문자열에서 **매칭 결과를 실시간 하이라이팅**으로 보여주는 브라우저 기반 개발자 도구입니다.

## ✨ 주요 기능

### 🛤️ Railroad Diagram 시각화

- 정규식의 구조를 직관적인 다이어그램으로 시각화
- 리터럴, 문자 클래스, 그룹, 수량자, 교대, 앵커 등 모든 구문 지원
- 호버 시 노드 하이라이트 + 설명 툴팁
- 마우스 드래그(팬) + 휠(줌) 인터랙션

### 🎯 실시간 매칭 테스터

- 정규식 입력과 동시에 테스트 문자열에서 매치 하이라이팅
- 매치별 색상 구분 (최대 6색 순환)
- 매치 인덱스, 캡처 그룹, 네임드 그룹 상세 표시

### 🔄 Replace 모드

- 치환 문자열 입력 시 결과 실시간 미리보기
- `$1`, `$2`, `$&` 등 치환 토큰 원클릭 삽입
- 원본 vs 결과 diff 스타일 비교

### 🚩 플래그 토글

- `g` (global), `i` (insensitive), `m` (multiline), `s` (dotAll)
- 버튼 클릭으로 즉시 전환, 다이어그램과 매칭에 실시간 반영

### 📋 프리셋 예제

- 이메일, 전화번호, URL, 날짜, HEX 색상, IPv4, HTML 태그, 비밀번호, 한글, CSV 등 10종
- 클릭 한 번으로 정규식 + 테스트 문자열 자동 채우기

### 📖 치트시트

- 7개 카테고리: 문자 클래스, 문자 셋, 수량자, 앵커, 그룹 & 참조, 전방탐색, 플래그
- 항목 클릭 시 정규식 입력 필드에 자동 삽입

### 📜 매칭 히스토리

- 정규식 + 플래그 + 테스트 문자열을 로컬 저장
- 이전 작업을 클릭 한 번으로 복원
- localStorage 기반 영구 저장 (최대 30건)

### 🔗 URL 공유

- 현재 상태를 URL 파라미터로 인코딩
- 공유 링크로 정규식 + 플래그 + 테스트 문자열 복원

## 🛠️ 기술 스택

| 분류 | 기술 |
| --- | --- |
| Frontend | React 19, Vite |
| Styling | Tailwind CSS v4 |
| 시각화 | Custom SVG Railroad Diagram Engine |
| 파서 | Custom Regex → AST Parser |
| 저장 | localStorage |
| 배포 | GitHub Pages + GitHub Actions |

## 🚀 시작하기

### 로컬 개발

```bash
git clone https://github.com/Dev-2A/regex-playground.git
cd regex-playground
npm install
npm run dev
```

브라우저에서 `http://localhost:5173/regex-playground/` 로 접속

### 빌드

```bash
npm run build
npm run preview
```

## 📸 스크린샷

| Railroad Diagram | 매칭 하이라이팅 |
|:---:|:---:|
| 정규식 구조를 다이어그램으로 시각화 | 테스트 문자열에서 실시간 매칭 결과 |

| Replace 모드 | 치트시트 |
|:---:|:---:|
| 치환 결과 diff 미리보기 | 카테고리별 정규식 레퍼런스 |

> 스크린샷은 배포 후 추가 예정

## 📁 프로젝트 구조

```text
src/
├── components/
│   ├── Editor/          # 정규식 입력, 테스트 문자열, Replace, 하이라이팅
│   ├── Visualizer/      # Railroad Diagram SVG 렌더링
│   ├── MatchInfo/       # 매치 결과 패널
│   ├── CheatSheet/      # 치트시트 패널
│   ├── History/         # 매칭 히스토리
│   └── Layout/          # 헤더, 레이아웃, 프리셋, 공유
├── hooks/               # useRegex, useHistory, usePanZoom
├── utils/               # regexParser (AST), matchHelper, diagramLayout, shareUrl
├── data/                # cheatsheet, presets
├── App.jsx
└── index.css
```

## 🔮 향후 계획

- [ ] 정규식 디버깅 모드 (매칭 과정 step-by-step 표시)
- [ ] 다크/라이트 테마 전환
- [ ] 정규식 성능 벤치마크
- [ ] 다이어그램 PNG/SVG 내보내기
- [ ] 더 많은 프리셋 예제

## 📄 License

MIT License © 2026 Dev-2A

---

<p align="center">
  Made with 🥤 cola and ❤️
</p>
