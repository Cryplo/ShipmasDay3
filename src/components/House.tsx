'use client';

import { LightBulb } from './LightBulb';

interface LightState {
  isOn: boolean;
  color: string;
}

interface HouseProps {
  lights: LightState[];
  celebrationActive: boolean;
  scale?: number;
}

// Generate 40 light positions around the house
// Starts from bottom left, goes up left wall, across roof, down right wall to bottom right
function generateLightPositions(containerWidth: number, containerHeight: number) {
  const positions: { x: number; y: number }[] = [];

  // House dimensions relative to container
  const houseWidth = containerWidth * 0.55;
  const houseHeight = containerHeight * 0.45;
  const roofHeight = containerHeight * 0.2;

  // House center position
  const centerX = containerWidth / 2;
  const baseY = containerHeight * 0.75;
  const roofPeakY = baseY - houseHeight - roofHeight;

  // Left and right edges of house
  const leftX = centerX - houseWidth / 2;
  const rightX = centerX + houseWidth / 2;
  const roofBaseY = baseY - houseHeight;

  // Distribute 40 lights:
  // - 8 lights on left wall (bottom to top)
  // - 12 lights on left roof slope (bottom to peak)
  // - 12 lights on right roof slope (peak to bottom)
  // - 8 lights on right wall (top to bottom)

  // 1. Left wall edge (from ground UP to roof base)
  for (let i = 0; i < 8; i++) {
    const t = (8 - i) / 9; // Reverse: start from bottom
    const x = leftX;
    const y = roofBaseY + (baseY - roofBaseY) * t;
    positions.push({ x: x + 5, y });
  }

  // 2. Left roof slope (from left edge UP to peak)
  for (let i = 0; i < 12; i++) {
    const t = (11 - i) / 11; // Reverse: start from bottom of roof
    const x = centerX + (leftX - centerX) * t;
    const y = roofPeakY + (roofBaseY - roofPeakY) * t;
    positions.push({ x, y: y - 5 });
  }

  // 3. Right roof slope (from peak DOWN to right edge)
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const x = centerX + (rightX - centerX) * t;
    const y = roofPeakY + (roofBaseY - roofPeakY) * t;
    positions.push({ x, y: y - 5 });
  }

  // 4. Right wall edge (from roof base DOWN to ground)
  for (let i = 0; i < 8; i++) {
    const t = (i + 1) / 9;
    const x = rightX;
    const y = roofBaseY + (baseY - roofBaseY) * t;
    positions.push({ x: x - 5, y });
  }

  return positions;
}

export function House({ lights, celebrationActive, scale = 1 }: HouseProps) {
  // Use fixed dimensions for consistent positioning
  const containerWidth = 800;
  const containerHeight = 600;
  const lightPositions = generateLightPositions(containerWidth, containerHeight);

  // House dimensions for SVG
  const houseWidth = containerWidth * 0.55;
  const houseHeight = containerHeight * 0.45;
  const roofHeight = containerHeight * 0.2;
  const centerX = containerWidth / 2;
  const baseY = containerHeight * 0.75;
  const roofPeakY = baseY - houseHeight - roofHeight;
  const leftX = centerX - houseWidth / 2;
  const rightX = centerX + houseWidth / 2;
  const roofBaseY = baseY - houseHeight;

  return (
    <div
      className={`relative ${celebrationActive ? 'celebration-active' : ''}`}
      style={{ 
        width: containerWidth * scale, 
        height: containerHeight * scale,
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
      }}
    >
      {/* House SVG */}
      <svg
        width={containerWidth}
        height={containerHeight}
        className="absolute inset-0"
        style={{ zIndex: 5 }}
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff8dc" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
          <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#5D3A1A" />
          </linearGradient>
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D4B8" />
            <stop offset="100%" stopColor="#D4C4A8" />
          </linearGradient>
          <linearGradient id="doorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B3E26" />
            <stop offset="100%" stopColor="#4A2C1A" />
          </linearGradient>
          <radialGradient id="wreathGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2D5A27" />
            <stop offset="70%" stopColor="#1A4D1A" />
            <stop offset="100%" stopColor="#0F3D0F" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* House shadow */}
        <ellipse
          cx={centerX}
          cy={baseY + 10}
          rx={houseWidth / 2 + 20}
          ry={15}
          fill="rgba(0,0,0,0.2)"
        />

        {/* Main house body */}
        <rect
          x={leftX}
          y={roofBaseY}
          width={houseWidth}
          height={houseHeight}
          fill="url(#wallGradient)"
          stroke="#8B7355"
          strokeWidth="3"
        />

        {/* Stone/brick texture lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`brick-h-${i}`}
            x1={leftX}
            y1={roofBaseY + 25 + i * 50}
            x2={rightX}
            y2={roofBaseY + 25 + i * 50}
            stroke="#C4B4A4"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* Roof base shadow */}
        <polygon
          points={`${centerX},${roofPeakY + 5} ${leftX - 25},${roofBaseY + 5} ${rightX + 25},${roofBaseY + 5}`}
          fill="rgba(0,0,0,0.15)"
        />

        {/* Roof */}
        <polygon
          points={`${centerX},${roofPeakY} ${leftX - 25},${roofBaseY} ${rightX + 25},${roofBaseY}`}
          fill="url(#roofGradient)"
          stroke="#4A3520"
          strokeWidth="3"
        />

        {/* Roof shingles pattern */}
        {[0, 1, 2, 3].map((row) => {
          const rowY = roofPeakY + 15 + row * 25;
          const rowWidth = (row + 1) * 80;
          return (
            <path
              key={`shingle-${row}`}
              d={`M ${centerX - rowWidth / 2} ${rowY} Q ${centerX} ${rowY + 8} ${centerX + rowWidth / 2} ${rowY}`}
              stroke="#5D3A1A"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
          );
        })}

        {/* Chimney */}
        <rect
          x={rightX - 80}
          y={roofPeakY + 20}
          width={45}
          height={70}
          fill="#8B4513"
          stroke="#5D3A1A"
          strokeWidth="2"
        />
        {/* Chimney bricks */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`chimney-brick-${i}`}
            x1={rightX - 80}
            y1={roofPeakY + 35 + i * 15}
            x2={rightX - 35}
            y2={roofPeakY + 35 + i * 15}
            stroke="#6B3E26"
            strokeWidth="1"
          />
        ))}
        {/* Chimney smoke */}
        <g opacity="0.3">
          <ellipse cx={rightX - 57} cy={roofPeakY + 5} rx={8} ry={5} fill="#ccc" />
          <ellipse cx={rightX - 52} cy={roofPeakY - 8} rx={6} ry={4} fill="#ddd" />
          <ellipse cx={rightX - 60} cy={roofPeakY - 18} rx={5} ry={3} fill="#eee" />
        </g>

        {/* Door frame */}
        <rect
          x={centerX - 35}
          y={baseY - 108}
          width={70}
          height={108}
          fill="#5D3A1A"
          rx="4"
        />

        {/* Door */}
        <rect
          x={centerX - 30}
          y={baseY - 103}
          width={60}
          height={103}
          fill="url(#doorGradient)"
          stroke="#3D2010"
          strokeWidth="2"
          rx="3"
        />

        {/* Door panels */}
        <rect
          x={centerX - 22}
          y={baseY - 95}
          width={44}
          height={35}
          fill="none"
          stroke="#5D3A1A"
          strokeWidth="2"
          rx="2"
        />
        <rect
          x={centerX - 22}
          y={baseY - 52}
          width={44}
          height={35}
          fill="none"
          stroke="#5D3A1A"
          strokeWidth="2"
          rx="2"
        />

        {/* Door handle */}
        <circle
          cx={centerX + 18}
          cy={baseY - 50}
          r={5}
          fill="#D4AF37"
          stroke="#B8960C"
          strokeWidth="1"
        />

        {/* Wreath on door */}
        <circle
          cx={centerX}
          cy={baseY - 75}
          r={15}
          fill="url(#wreathGradient)"
          stroke="#1A4D1A"
          strokeWidth="3"
        />
        {/* Wreath bow */}
        <path
          d={`M ${centerX - 8} ${baseY - 60} Q ${centerX} ${baseY - 55} ${centerX + 8} ${baseY - 60}`}
          fill="#C41E3A"
          stroke="#8B0000"
          strokeWidth="1"
        />
        <circle cx={centerX} cy={baseY - 58} r={4} fill="#C41E3A" />
        {/* Wreath berries */}
        {[-10, -5, 0, 5, 10].map((offset, i) => (
          <circle
            key={`berry-${i}`}
            cx={centerX + offset}
            cy={baseY - 75 + Math.sin(i) * 5}
            r={2}
            fill="#C41E3A"
          />
        ))}

        {/* Door step */}
        <rect
          x={centerX - 45}
          y={baseY}
          width={90}
          height={8}
          fill="#8B7355"
          stroke="#6B5344"
          strokeWidth="1"
        />

        {/* Windows - Left */}
        <rect
          x={leftX + 35}
          y={roofBaseY + 35}
          width={70}
          height={60}
          fill="#87CEEB"
          stroke="#5D3A1A"
          strokeWidth="4"
        />
        {/* Window shutters - Left */}
        <rect
          x={leftX + 20}
          y={roofBaseY + 33}
          width={15}
          height={64}
          fill="#1A4D1A"
          stroke="#0F3D0F"
          strokeWidth="1"
        />
        <rect
          x={leftX + 105}
          y={roofBaseY + 33}
          width={15}
          height={64}
          fill="#1A4D1A"
          stroke="#0F3D0F"
          strokeWidth="1"
        />
        {/* Window cross bars */}
        <line
          x1={leftX + 70}
          y1={roofBaseY + 35}
          x2={leftX + 70}
          y2={roofBaseY + 95}
          stroke="#5D3A1A"
          strokeWidth="3"
        />
        <line
          x1={leftX + 35}
          y1={roofBaseY + 65}
          x2={leftX + 105}
          y2={roofBaseY + 65}
          stroke="#5D3A1A"
          strokeWidth="3"
        />
        {/* Window glow */}
        <rect
          x={leftX + 37}
          y={roofBaseY + 37}
          width={66}
          height={56}
          fill="url(#windowGlow)"
          opacity="0.6"
        />

        {/* Windows - Right */}
        <rect
          x={rightX - 105}
          y={roofBaseY + 35}
          width={70}
          height={60}
          fill="#87CEEB"
          stroke="#5D3A1A"
          strokeWidth="4"
        />
        {/* Window shutters - Right */}
        <rect
          x={rightX - 120}
          y={roofBaseY + 33}
          width={15}
          height={64}
          fill="#1A4D1A"
          stroke="#0F3D0F"
          strokeWidth="1"
        />
        <rect
          x={rightX - 35}
          y={roofBaseY + 33}
          width={15}
          height={64}
          fill="#1A4D1A"
          stroke="#0F3D0F"
          strokeWidth="1"
        />
        {/* Window cross bars */}
        <line
          x1={rightX - 70}
          y1={roofBaseY + 35}
          x2={rightX - 70}
          y2={roofBaseY + 95}
          stroke="#5D3A1A"
          strokeWidth="3"
        />
        <line
          x1={rightX - 105}
          y1={roofBaseY + 65}
          x2={rightX - 35}
          y2={roofBaseY + 65}
          stroke="#5D3A1A"
          strokeWidth="3"
        />
        {/* Window glow */}
        <rect
          x={rightX - 103}
          y={roofBaseY + 37}
          width={66}
          height={56}
          fill="url(#windowGlow)"
          opacity="0.6"
        />

        {/* Snow on roof - layered for depth */}
        <path
          d={`M ${leftX - 30} ${roofBaseY + 3} 
              Q ${leftX + 30} ${roofBaseY - 15} ${centerX - 50} ${roofPeakY + 30}
              Q ${centerX} ${roofPeakY - 8} ${centerX + 50} ${roofPeakY + 30}
              Q ${rightX - 30} ${roofBaseY - 15} ${rightX + 30} ${roofBaseY + 3}
              Z`}
          fill="white"
          opacity="0.95"
        />

        {/* Snow on chimney */}
        <ellipse
          cx={rightX - 57}
          cy={roofPeakY + 22}
          rx={28}
          ry={10}
          fill="white"
          opacity="0.95"
        />

        {/* Snow on window sills */}
        <rect x={leftX + 33} y={roofBaseY + 95} width={74} height={6} fill="white" rx="3" opacity="0.9" />
        <rect x={rightX - 107} y={roofBaseY + 95} width={74} height={6} fill="white" rx="3" opacity="0.9" />

        {/* Snow on door step */}
        <ellipse cx={centerX} cy={baseY} rx={50} ry={5} fill="white" opacity="0.8" />

        {/* Evergreen trees on sides - moved closer to middle */}
        <g>
          {/* Left tree - trunk */}
          <rect x={leftX + 45} y={baseY - 20} width={8} height={25} fill="#5D3A1A" />
          {/* Left tree - triangles pointing UP (apex at top, base at bottom) */}
          <polygon points={`${leftX + 49},${baseY - 50} ${leftX + 20},${baseY - 20} ${leftX + 78},${baseY - 20}`} fill="#1A4D1A" />
          <polygon points={`${leftX + 49},${baseY - 75} ${leftX + 25},${baseY - 45} ${leftX + 73},${baseY - 45}`} fill="#1A4D1A" />
          <polygon points={`${leftX + 49},${baseY - 100} ${leftX + 32},${baseY - 70} ${leftX + 66},${baseY - 70}`} fill="#1A4D1A" />
          {/* Snow on left tree - at bottom of each triangle */}
          <path d={`M ${leftX + 20} ${baseY - 20} Q ${leftX + 49} ${baseY - 28} ${leftX + 78} ${baseY - 20}`} fill="white" opacity="0.9" />
          <path d={`M ${leftX + 25} ${baseY - 45} Q ${leftX + 49} ${baseY - 53} ${leftX + 73} ${baseY - 45}`} fill="white" opacity="0.9" />
          <path d={`M ${leftX + 32} ${baseY - 70} Q ${leftX + 49} ${baseY - 78} ${leftX + 66} ${baseY - 70}`} fill="white" opacity="0.9" />
          
          {/* Right tree - trunk */}
          <rect x={rightX - 53} y={baseY - 20} width={8} height={25} fill="#5D3A1A" />
          {/* Right tree - triangles pointing UP (apex at top, base at bottom) */}
          <polygon points={`${rightX - 49},${baseY - 50} ${rightX - 78},${baseY - 20} ${rightX - 20},${baseY - 20}`} fill="#1A4D1A" />
          <polygon points={`${rightX - 49},${baseY - 75} ${rightX - 73},${baseY - 45} ${rightX - 25},${baseY - 45}`} fill="#1A4D1A" />
          <polygon points={`${rightX - 49},${baseY - 100} ${rightX - 66},${baseY - 70} ${rightX - 32},${baseY - 70}`} fill="#1A4D1A" />
          {/* Snow on right tree - at bottom of each triangle */}
          <path d={`M ${rightX - 78} ${baseY - 20} Q ${rightX - 49} ${baseY - 28} ${rightX - 20} ${baseY - 20}`} fill="white" opacity="0.9" />
          <path d={`M ${rightX - 73} ${baseY - 45} Q ${rightX - 49} ${baseY - 53} ${rightX - 25} ${baseY - 45}`} fill="white" opacity="0.9" />
          <path d={`M ${rightX - 66} ${baseY - 70} Q ${rightX - 49} ${baseY - 78} ${rightX - 32} ${baseY - 70}`} fill="white" opacity="0.9" />
        </g>

        {/* Bushes closer to door */}
        <g>
          {/* Left bush */}
          <ellipse cx={centerX - 65} cy={baseY - 12} rx={20} ry={15} fill="#1A4D1A" />
          <ellipse cx={centerX - 65} cy={baseY - 20} rx={15} ry={8} fill="white" opacity="0.8" />
          {/* Right bush */}
          <ellipse cx={centerX + 65} cy={baseY - 12} rx={20} ry={15} fill="#1A4D1A" />
          <ellipse cx={centerX + 65} cy={baseY - 20} rx={15} ry={8} fill="white" opacity="0.8" />
        </g>

        {/* Icicles along entire roof width */}
        {Array.from({ length: 17 }).map((_, i) => {
          const icicleX = leftX - 15 + i * ((houseWidth + 60) / 17);
          // Use deterministic heights based on index
          const icicleHeight = 8 + ((i * 7) % 10);
          return (
            <path
              key={`icicle-${i}`}
              d={`M ${icicleX - 3} ${roofBaseY + 2} L ${icicleX} ${roofBaseY + icicleHeight} L ${icicleX + 3} ${roofBaseY + 2} Z`}
              fill="rgba(200, 230, 255, 0.85)"
            />
          );
        })}
      </svg>

      {/* Light bulbs */}
      {lightPositions.map((pos, index) => (
        <LightBulb
          key={index}
          x={pos.x}
          y={pos.y}
          isOn={lights[index]?.isOn ?? false}
          color={lights[index]?.color ?? '#333'}
          index={index}
        />
      ))}
    </div>
  );
}
