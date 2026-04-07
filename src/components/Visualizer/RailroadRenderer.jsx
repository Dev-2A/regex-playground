import { useState } from "react";
import { NodeType } from "../../utils/regexParser";
import { CONF } from "../../utils/diagramLayout";

const COLORS = {
  rail: "#4b5563", // gray-600
  node: "#1e3a5f", // 어두운 파랑
  nodeBorder: "#3b82f6", // blue-500
  nodeText: "#e5e7eb", // gray-200
  group: "#7c3aed", // violet-600
  groupBg: "#7c3aed15",
  quantLabel: "#f59e0b", // amber-500
  anchor: "#10b981", // emerald-500
  charClass: "#f97316", // orange-500
  dot: "#ec4899", // pink-500
  escape: "#06b6d4", // cyan-500
};

export default function RailroadRenderer({ layout }) {
  if (!layout) return null;

  const padding = 24;
  const svgWidth = layout.width + padding * 2;
  const svgHeight = layout.height + padding * 2;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="block"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth={CONF.ARROW_SIZE}
          markerHeight={CONF.ARROW_SIZE}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={COLORS.rail} />
        </marker>
      </defs>

      {/* 시작 원 */}
      <circle
        cx={padding - 12}
        cy={padding + layout.height / 2}
        r={5}
        fill={COLORS.rail}
      />
      <line
        x1={padding - 7}
        y1={padding + layout.height / 2}
        x2={padding}
        y2={padding + layout.height / 2}
        stroke={COLORS.rail}
        strokeWidth={2}
      />

      <g transform={`translate(${padding}, ${padding})`}>
        <RenderNode node={layout} x={0} y={0} />
      </g>

      {/* 끝 원 (이중) */}
      <line
        x1={padding + layout.width}
        y1={padding + layout.height / 2}
        x2={padding + layout.width + 7}
        y2={padding + layout.height / 2}
        stroke={COLORS.rail}
        strokeWidth={2}
      />
      <circle
        cx={padding + layout.width + 12}
        cy={padding + layout.height / 2}
        r={5}
        fill="none"
        stroke={COLORS.rail}
        strokeWidth={2}
      />
      <circle
        cx={padding + layout.width + 12}
        cy={padding + layout.height / 2}
        r={2}
        fill={COLORS.rail}
      />
    </svg>
  );
}

function RenderNode({ node, x, y }) {
  if (!node) return null;

  const centerY = node.height / 2;

  switch (node.type) {
    case NodeType.LITERAL:
    case NodeType.ESCAPE:
    case NodeType.DOT:
    case NodeType.ANCHOR:
    case NodeType.BACKREFERENCE:
      return <TerminalNode node={node} x={x} y={y} centerY={centerY} />;
    case NodeType.CHAR_CLASS:
      return <CharClassNode node={node} x={x} y={y} centerY={centerY} />;
    case NodeType.SEQUENCE:
      return <SequenceNode node={node} x={x} y={y} />;
    case NodeType.ALTERNATIVE:
      return <AlternativeNode node={node} x={x} y={y} />;
    case NodeType.GROUP:
      return <GroupNode node={node} x={x} y={y} />;
    case NodeType.QUANTIFIER:
      return <QuantifierNode node={node} x={x} y={y} />;
    default:
      return null;
  }
}

// 터미널 노드 (리터럴, 이스케이프, ., 앵커)
function TerminalNode({ node, x, y, centerY }) {
  const [hovered, setHovered] = useState(false);

  let bgColor = COLORS.node;
  let borderColor = COLORS.nodeBorder;
  let rounded = 6;

  if (node.type === NodeType.ANCHOR) {
    bgColor = "#064e3b";
    borderColor = COLORS.anchor;
  } else if (node.type === NodeType.DOT) {
    bgColor = "#4a1d5e";
    borderColor = COLORS.dot;
  } else if (node.type === NodeType.ESCAPE) {
    bgColor = "#0e4a5c";
    borderColor = COLORS.escape;
  } else if (node.type === NodeType.BACKREFERENCE) {
    bgColor = "#4a2c0e";
    borderColor = COLORS.quantLabel;
  }

  const display = node.display || node.value || "?";

  return (
    <g
      transform={`translate(${x}, ${y + centerY - CONF.NODE_HEIGHT / 2})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default" }}
    >
      <rect
        width={node.width}
        height={CONF.NODE_HEIGHT}
        rx={rounded}
        ry={rounded}
        fill={hovered ? borderColor + "40" : bgColor}
        stroke={borderColor}
        strokeWidth={hovered ? 2.5 : 1.5}
        className="transition-all duration-150"
      />
      <text
        x={node.width / 2}
        y={CONF.NODE_HEIGHT / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={hovered ? "#ffffff" : COLORS.nodeText}
        fontSize={13}
        fontFamily="monospace"
        className="transition-all duration-150"
      >
        {display}
      </text>

      {/* 호버 시 설명 표시 */}
      {node.description && <title>{node.description}</title>}

      {/* 호버 시 하단 툴팁 */}
      {hovered && node.description && (
        <g transform={`translate(${node.width / 2}, ${CONF.NODE_HEIGHT + 6})`}>
          <rect
            x={-node.description.length * 3.5 - 8}
            y={0}
            width={node.description.length * 7 + 16}
            height={20}
            rx={4}
            fill="#1f2937"
            stroke={borderColor}
            strokeWidth={1}
          />
          <text
            x={0}
            y={13}
            textAnchor="middle"
            fill="#d1d5db"
            fontSize={11}
            fontFamily="sans-serif"
          >
            {node.description}
          </text>
        </g>
      )}
    </g>
  );
}

// 문자 클래스 노드
function CharClassNode({ node, x, y, centerY }) {
  const [hovered, setHovered] = useState(false);

  const desc = node.negated ? "부정 문자 클래스" : "문자 클래스";

  return (
    <g
      transform={`translate(${x}, ${y + centerY - CONF.NODE_HEIGHT / 2})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default" }}
    >
      <rect
        width={node.width}
        height={CONF.NODE_HEIGHT}
        rx={6}
        ry={6}
        fill={hovered ? COLORS.charClass + "40" : "#4a2400"}
        stroke={COLORS.charClass}
        strokeWidth={hovered ? 2.5 : 1.5}
        className="transition-all duration-150"
      />
      <text
        x={node.width / 2}
        y={CONF.NODE_HEIGHT / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={hovered ? "#ffffff" : COLORS.nodeText}
        fontSize={13}
        fontFamily="monospace"
        className="transition-all duration-150"
      >
        {node.display}
      </text>
      <title>{desc}</title>
    </g>
  );
}

// 시퀀스: 노드를 가로로 연결
function SequenceNode({ node, x, y }) {
  const centerY = node.height / 2;
  let cursor = 0;
  const elements = [];

  node.items.forEach((child, i) => {
    elements.push(<RenderNode key={i} node={child} x={x + cursor} y={y} />);

    // 노드 사이 연결선
    if (i < node.items.length - 1) {
      const fromX = x + cursor + child.width;
      const toX = fromX + CONF.GAP_X;
      elements.push(
        <line
          key={`line-${i}`}
          x1={fromX}
          y1={y + centerY}
          x2={toX}
          y2={y + centerY}
          stroke={COLORS.rail}
          strokeWidth={2}
          markerEnd="url(#arrow)"
        />,
      );
    }

    cursor += child.width + CONF.GAP_X;
  });

  return <g>{elements}</g>;
}

// 교대: 수직 분기
function AlternativeNode({ node, x, y }) {
  const r = CONF.RAIL_RADIUS;
  const innerX = x + r * 2;
  const maxWidth = Math.max(...node.alternatives.map((n) => n.width));
  const elements = [];

  let accY = 0;
  node.alternatives.forEach((alt, i) => {
    const altCenterY = y + accY + alt.height / 2;

    // 왼쪽 분기 선
    if (i === 0) {
      elements.push(
        <line
          key={`lb-${i}`}
          x1={x}
          y1={altCenterY}
          x2={innerX}
          y2={altCenterY}
          stroke={COLORS.rail}
          strokeWidth={2}
        />,
      );
    } else {
      // 위에서 내려오는 곡선
      const topY = y + node.alternatives[0].height / 2;
      elements.push(
        <path
          key={`lb-${i}`}
          d={`M ${x} ${topY} L ${x} ${altCenterY - r} Q ${x} ${altCenterY} ${x + r} ${altCenterY} L ${innerX} ${altCenterY}`}
          fill="none"
          stroke={COLORS.rail}
          strokeWidth={2}
        />,
      );
    }

    // 자식 렌더링
    elements.push(
      <RenderNode key={`alt-${i}`} node={alt} x={innerX} y={y + accY} />,
    );

    // 오른쪽 합류 선
    const rightX = innerX + maxWidth;
    const endX = x + node.width;
    if (i === 0) {
      elements.push(
        <line
          key={`rb-${i}`}
          x1={innerX + alt.width}
          y1={altCenterY}
          x2={endX}
          y2={altCenterY}
          stroke={COLORS.rail}
          strokeWidth={2}
        />,
      );
    } else {
      const topY = y + node.alternatives[0].height / 2;
      elements.push(
        <path
          key={`rb-${i}`}
          d={`M ${innerX + alt.width} ${altCenterY} L ${endX - r} ${altCenterY} Q ${endX} ${altCenterY} ${endX} ${altCenterY - r} L ${endX} ${topY}`}
          fill="none"
          stroke={COLORS.rail}
          strokeWidth={2}
        />,
      );
    }

    accY += alt.height + CONF.GAP_Y;
  });

  return <g>{elements}</g>;
}

// 그룹: 점선 박스 + 라벨
function GroupNode({ node, x, y }) {
  const childX = x + CONF.GAP_X;
  const childY = y + node.labelHeight;
  const child = node.child;

  let label = "";
  if (node.name) {
    label = `<${node.name}>`;
  } else if (node.capturing) {
    label = `Group #${node.groupNumber}`;
  } else if (node.lookahead === "positive") {
    label = "Lookahead (?=)";
  } else if (node.lookahead === "negative") {
    label = "Neg Lookahead (?!)";
  } else {
    label = "Non-capturing";
  }

  const centerY = node.height / 2;

  return (
    <g>
      {/* 그룹 박스 */}
      <rect
        x={x}
        y={y}
        width={node.width}
        height={node.height}
        rx={8}
        ry={8}
        fill={COLORS.groupBg}
        stroke={COLORS.group}
        strokeWidth={1.5}
        strokeDasharray="6 3"
      />

      {/* 그룹 라벨 */}
      <text
        x={x + 8}
        y={y + 13}
        fill={COLORS.group}
        fontSize={11}
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        {label}
      </text>

      {/* 왼쪽 연결선 */}
      <line
        x1={x}
        y1={y + centerY}
        x2={childX}
        y2={y + centerY}
        stroke={COLORS.rail}
        strokeWidth={2}
      />

      {/* 자식 렌더링 */}
      <RenderNode node={child} x={childX} y={childY} />

      {/* 오른쪽 연결선 */}
      <line
        x1={childX + child.width}
        y1={y + centerY}
        x2={x + node.width}
        y2={y + centerY}
        stroke={COLORS.rail}
        strokeWidth={2}
      />
    </g>
  );
}

// 수량자: 루프 / 스킵 분기
function QuantifierNode({ node, x, y }) {
  const r = CONF.RAIL_RADIUS;
  const child = node.child;
  const innerX = x + r * 2;
  const endX = x + node.width;

  const mainY = node.needsSkip ? y + node.skipExtra : y;
  const centerY = mainY + child.height / 2;

  const elements = [];

  // 메인 레일 입구
  elements.push(
    <line
      key="in"
      x1={x}
      y1={centerY}
      x2={innerX}
      y2={centerY}
      stroke={COLORS.rail}
      strokeWidth={2}
    />,
  );

  // 자식 렌더링
  elements.push(<RenderNode key="child" node={child} x={innerX} y={mainY} />);

  // 메인 레일 출구
  elements.push(
    <line
      key="out"
      x1={innerX + child.width}
      y1={centerY}
      x2={endX}
      y2={centerY}
      stroke={COLORS.rail}
      strokeWidth={2}
    />,
  );

  // 스킵(optional) 경로: 위로 우회
  if (node.needsSkip) {
    const skipY = y + r;
    elements.push(
      <path
        key="skip"
        d={`M ${x} ${centerY} L ${x} ${skipY} Q ${x} ${y} ${x + r} ${y} L ${endX - r} ${y} Q ${endX} ${y} ${endX} ${skipY} L ${endX} ${centerY}`}
        fill="none"
        stroke={COLORS.rail}
        strokeWidth={2}
        strokeDasharray="4 3"
      />,
    );
  }

  // 루프 경로: 아래로 되돌아감
  if (node.needsLoop) {
    const loopY = mainY + child.height + CONF.GAP_Y;
    const loopBottomY = loopY + r;
    elements.push(
      <path
        key="loop"
        d={`M ${innerX + child.width} ${centerY} L ${innerX + child.width} ${loopY} Q ${innerX + child.width} ${loopBottomY} ${innerX + child.width - r} ${loopBottomY} L ${innerX + r} ${loopBottomY} Q ${innerX} ${loopBottomY} ${innerX} ${loopY} L ${innerX} ${centerY}`}
        fill="none"
        stroke={COLORS.quantLabel}
        strokeWidth={1.5}
        markerEnd="url(#arrow)"
      />,
    );

    // 수량자 라벨
    const labelX = (innerX + innerX + child.width) / 2;
    elements.push(
      <text
        key="label"
        x={labelX}
        y={loopBottomY + 14}
        textAnchor="middle"
        fill={COLORS.quantLabel}
        fontSize={11}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {node.display}
      </text>,
    );
  } else if (node.display) {
    // 수량자 라벨 (루프 없는 경우, ? 등)
    const labelX = x + node.width / 2;
    elements.push(
      <text
        key="label"
        x={labelX}
        y={y + node.height - 2}
        textAnchor="middle"
        fill={COLORS.quantLabel}
        fontSize={11}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {node.display}
      </text>,
    );
  }

  return <g>{elements}</g>;
}
