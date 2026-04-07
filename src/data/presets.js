export const presets = [
  {
    id: "email",
    name: "📧 이메일",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    testString:
      "admin@example.com, user.name+tag@domain.co.kr, invalid@, @nope.com",
  },
  {
    id: "phone-kr",
    name: "📱 한국 전화번호",
    pattern: "0\\d{1,2}-\\d{3,4}-\\d{4}",
    flags: "g",
    testString: "010-1234-5678, 02-123-4567, 031-456-7890, 12345",
  },
  {
    id: "url",
    name: "🔗 URL",
    pattern: "https?://[\\w.-]+(?:/[\\w./?&=%#-]*)?",
    flags: "g",
    testString:
      "https://example.com/path?q=1 http://test.co.kr 그냥 텍스트 https://dev-2a.github.io",
  },
  {
    id: "date-iso",
    name: "📅 날짜 (ISO)",
    pattern:
      "(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\\d|3[01])",
    flags: "g",
    testString: "2026-04-07, 2025-12-25, 2026-13-01(invalid), 1999-01-31",
  },
  {
    id: "hex-color",
    name: "🎨 HEX 색상코드",
    pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
    flags: "g",
    testString: "#fff, #3b82f6, #1e3a5f, #GGG(invalid), color: #09c;",
  },
  {
    id: "ipv4",
    name: "🌐 IPv4 주소",
    pattern:
      "\\b(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b",
    flags: "g",
    testString: "192.168.1.1, 10.0.0.255, 999.999.999.999(invalid), 0.0.0.0",
  },
  {
    id: "html-tag",
    name: "🏷️ HTML 태그",
    pattern: "<(\\w+)(\\s[^>]*)?>.*?</\\1>|<\\w+\\s*/>",
    flags: "gs",
    testString:
      '<div class="box">content</div> <br/> <p>paragraph</p> plain text',
  },
  {
    id: "password",
    name: "🔒 비밀번호 강도",
    pattern:
      "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}",
    flags: "",
    testString:
      "Str0ng!Pass (강함), weakpass (약함), NoSpecial1 (특수문자 없음)",
  },
  {
    id: "korean",
    name: "🇰🇷 한글",
    pattern: "[가-힣]+",
    flags: "g",
    testString: "안녕하세요 Hello 세계 World 테스트123",
  },
  {
    id: "csv-parse",
    name: "📊 CSV 필드 파싱",
    pattern: '(?:^|,)("(?:[^"]|"")*"|[^,]*)',
    flags: "g",
    testString: 'name,"age",city,"hello, world","say ""hi"""',
  },
];
