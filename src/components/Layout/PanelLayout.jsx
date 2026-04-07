function PanelLayout({ left, right, bottom }) {
  return (
    <div className="flex flex-col h-[calc(100vh-53px)]">
      {/* 상단: 좌우 2컬럼 */}
      <div className="flex flex-1 min-h-0">
        {/* 왼쪽 패널: 정규식 입력 + 테스트 문자열 + 매치 정보 */}
        <div className="w-1/2 flex flex-col border-r border-gray-800 min-h-0">
          {left}
        </div>
        {/* 오른쪽 패널: 다이어그램 시각화 + 치트시트 */}
        <div className="w-1/2 flex flex-col min-h-0">{right}</div>
      </div>
      {/* 하단: 히스토리 바 (선택적) */}
      {bottom && <div className="border-t border-gray-800">{bottom}</div>}
    </div>
  );
}

export default PanelLayout;
