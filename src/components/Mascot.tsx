import characters from '../assets/wendava-mascots.png';

interface MascotProps {
  sprite: number;
  name?: string;
  eager?: boolean;
}

export function Mascot({ sprite, name, eager = false }: MascotProps) {
  return (
    <span
      className="mascot-sprite"
      role={name ? 'img' : undefined}
      aria-label={name}
      aria-hidden={!name}
    >
      <img
        src={characters}
        alt=""
        width={2172}
        height={724}
        loading={eager ? 'eager' : 'lazy'}
        draggable={false}
        style={{ left: `${sprite * -100}%` }}
      />
    </span>
  );
}
