import React from 'react';

export default function RadarPentagon({
    data = ['높음', '낮음', '판정불가', '높음', '낮음'],
    labels = ['외향성(E)', '개방성(O)', '친화성(A)', '성실성(C)', '신경증(N)'],
    size = 280,
}) {
    const cx = size / 2;
    const cy = size / 2;
    const ringWidths = [46, 98, 149, 200];

    const ringRadii = ringWidths.map(w => w / 2);

    const radius = ringRadii[3];
    const angleStep = (Math.PI * 2) / 5;

    const polygonPoint = (scale, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        return [
            cx + Math.cos(angle) * scale,
            cy + Math.sin(angle) * scale,
        ];
    };

    const buildPolygon = (scale) =>
        Array.from({ length: 5 })
            .map((_, i) => polygonPoint(scale, i).join(','))
            .join(' ');

    // 판정 문자열을 폴리건 단계로 변환
    const levelToScale = (level) => {
        switch (level) {
            case '낮음':
                return radius * 0.25;   // 1번째 폴리건
            case '높음':
                return radius * 0.75;   // 3번째 폴리건
            case '판정불가':
                return 0;               // 중심
            default:
            return 0;
        }
    };

    const valuePolygon = data
    .map((level, i) => polygonPoint(levelToScale(level), i).join(','))
    .join(' ');

    return (
        <svg width={size} height={size}>
            {/* 배경 그리드 */}
            {[
             // 가장 안쪽
  { fill: '#F6F6F6', stroke: 'rgba(0,0,0,0.12)' },
  { fill: '#FFFFFF', stroke: 'rgba(0,0,0,0.12)' },
  { fill: '#F6F6F6', stroke: 'rgba(0,0,0,0.12)' },
  { fill: '#FFFFFF', stroke: 'rgba(0,0,0,0.12)' }, // 가장 바깥쪽
].map((style, i) => {
  // 내부부터 외부로 그리기 위해 radii 배열과 매칭
  const radii = [0.25, 0.5, 0.75, 1]; // 내부 → 외부
  return (
    <polygon
      key={i}
      points={buildPolygon(radius * radii[i])}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={1}
    />
  );
})}

            {/* 축 */}
            {Array.from({ length: 5 }).map((_, i) => {
                const [x, y] = polygonPoint(radius, i);
                return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e5e5" />;
            })}

            {/* 채워진 데이터 영역 */}
            <polygon
                points={valuePolygon}
                fill="rgba(255, 199, 0, 0.45)"
                stroke="#ffb800"
                strokeWidth={2}
            />

            {/* 라벨 */}
            {labels.map((text, i) => {
                const [x, y] = polygonPoint(radius + 18, i);
                return (
                    <text
                        key={i}
                        x={x}
                        y={y}
                        fontSize={12}
                        fontWeight={700}
                        fill="#7a7a7a"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {text}
                    </text>
                );
            })}
        </svg>
    );
}
