import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import {
  Container,
  CenterOuter,
  CenterPing,
  CenterRing,
  CenterHole,
  Floaters,
  Floater,
  Stars,
  Star,
} from './styles'

const NUM_STARS = 20
const NUM_FLOATERS = 20

const FLOATER_ICONS = [
  'money-bill-1-wave',
  'money-bill-wave',
  ['brands', 'bitcoin'],
]

export interface FloaterTransformState {
  x: string
  y: string
  duration: number
  rotateZ: string
  icon: IconProp
  scale: number
  delay: number
}

const generateFloaterTransforms = (): Array<FloaterTransformState> => {
  return new Array(NUM_FLOATERS).fill(null).map(
    () =>
      ({
        x: `${-320 + Math.random() * 640}px`,
        y: `${-320 + Math.random() * 640}px`,
        duration: 10 + Math.random() * 15,
        rotateZ: `${-360 + Math.random() * 720}deg`,
        icon: FLOATER_ICONS[Math.floor(Math.random() * FLOATER_ICONS.length)],
        scale: 1 + Math.random() * 2,
        delay: Math.random() * 25,
      } as FloaterTransformState),
  )
}

export interface StarTransform {
  x: number
  y: number
  opacity: number
  scale: number
}

function generateStarTransforms(): Array<StarTransform> {
  return new Array(NUM_STARS).fill(null).map(
    () =>
      ({
        x: Math.random(),
        y: Math.random(),
        opacity: 0.25 + Math.random() * 0.75,
        scale: 0.25 + Math.random() * 0.75,
      } as StarTransform),
  )
}

export const BlackHole: React.FC = () => {
  const [floaterTransforms] = useState<Array<FloaterTransformState>>(
    generateFloaterTransforms(),
  )

  const starTransforms = useRef<Array<StarTransform>>(generateStarTransforms())

  return (
    <Container>
      <Stars>
        {starTransforms.current.map(({ x, y, opacity, scale }, index) => (
          <Star
            key={index}
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        ))}
      </Stars>

      <CenterOuter>
        <CenterPing />
        <CenterRing />
        <Floaters>
          {floaterTransforms.map(
            ({ x, y, duration, rotateZ, icon, scale, delay }, index) => (
              <Floater
                key={index}
                transition={{ duration, delay, repeat: Infinity }}
                initial={{ opacity: 0, x, y, scale, rotateZ }}
                // onTransitionEnd={() => {
                //   setFloaterTransforms(generateFloaterTransforms())
                // }}
              >
                <FontAwesomeIcon icon={icon} />
              </Floater>
            ),
          )}
        </Floaters>
        <CenterHole to="/terminal">
          <FontAwesomeIcon icon="robot" size="2x" />
        </CenterHole>
      </CenterOuter>
    </Container>
  )
}
