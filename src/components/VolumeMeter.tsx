'use client';

interface VolumeMeterProps {
  volume: number;
  isActive: boolean;
}

function volumeToColor(volume: number): string {
  // Map volume to hue: 0 (quiet) = green (120), 1 (loud) = red (0)
  const hue = 120 - (volume * 120);
  return `hsl(${hue}, 70%, 45%)`;
}

export function VolumeMeter({ volume, isActive }: VolumeMeterProps) {
  const color = volumeToColor(volume);

  return (
    <div className="w-full font-christmas">
      <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
        <span>Volume Level</span>
        <span>{Math.round(volume * 100)}%</span>
      </div>
      <div className="volume-meter">
        <div
          className="volume-fill"
          style={{
            width: isActive ? `${volume * 100}%` : '0%',
            backgroundColor: color,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1 opacity-70">
        <span>Quiet</span>
        <span>Loud</span>
      </div>
    </div>
  );
}
