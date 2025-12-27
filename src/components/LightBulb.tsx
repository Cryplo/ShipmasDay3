'use client';

interface LightBulbProps {
  x: number;
  y: number;
  isOn: boolean;
  color: string;
  index: number;
}

export function LightBulb({ x, y, isOn, color, index }: LightBulbProps) {
  return (
    <div
      className={`light-bulb ${isOn ? 'on' : 'off'}`}
      style={{
        left: x,
        top: y,
        backgroundColor: isOn ? color : '#333',
        boxShadow: isOn
          ? `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`
          : 'none',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
      title={`Light ${index + 1}`}
    />
  );
}
