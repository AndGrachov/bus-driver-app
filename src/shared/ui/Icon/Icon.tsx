/**
 * The app's few line icons, drawn on a 24 pt grid with one stroke weight so
 * they match the type. Decorative by default: the control around an icon
 * carries the accessibility label.
 */
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export const IconName = {
  steeringWheel: 'steeringWheel',
  eye: 'eye',
  eyeOff: 'eyeOff',
  chevronRight: 'chevronRight',
} as const;
export type IconNameValue = (typeof IconName)[keyof typeof IconName];

const VIEWBOX = '0 0 24 24';
const STROKE_WIDTH = 2;
export const ICON_SIZE = 24;

const EYE_OUTLINE = 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z';

function Glyph({ name }: { name: IconNameValue }) {
  switch (name) {
    case IconName.steeringWheel:
      return (
        <>
          <Circle cx={12} cy={12} r={9} />
          <Circle cx={12} cy={12} r={2.5} />
          <Path d="M3 12h6.5M14.5 12H21M12 14.5V21" />
        </>
      );
    case IconName.eye:
      return (
        <>
          <Path d={EYE_OUTLINE} />
          <Circle cx={12} cy={12} r={3} />
        </>
      );
    case IconName.eyeOff:
      return (
        <>
          <Path d={EYE_OUTLINE} />
          <Circle cx={12} cy={12} r={3} />
          <Path d="M4 4l16 16" />
        </>
      );
    case IconName.chevronRight:
      return <Path d="M9 6l6 6-6 6" />;
  }
}

type Props = { name: IconNameValue; color: string; size?: number };

export function Icon({ name, color, size = ICON_SIZE }: Props) {
  // Hidden on the wrapper: `aria-hidden` works on iOS, Android and web alike,
  // while SVG-level accessibility props leak to the DOM on web.
  return (
    <View aria-hidden>
      <Svg
        width={size}
        height={size}
        viewBox={VIEWBOX}
        fill="none"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Glyph name={name} />
      </Svg>
    </View>
  );
}
