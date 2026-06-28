export type ImagePosition = 'top' | 'center' | 'bottom' | number;

const NAMED_IMAGE_POSITIONS: Record<Exclude<ImagePosition, number>, string> = {
  top: '0%',
  center: '50%',
  bottom: '100%',
};

export function imagePositionToObjectPosition(position: ImagePosition = 'center'): string {
  if (typeof position === 'number') {
    return `center ${position}%`;
  }

  return `center ${NAMED_IMAGE_POSITIONS[position]}`;
}
