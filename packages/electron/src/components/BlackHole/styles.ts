import tw from 'tailwind-styled-components'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const Container = tw(motion.div)`
  w-full
  h-full
  flex
  justify-center
  items-center
  relative
  overflow-hidden
`

Container.defaultProps = {
  transition: { duration: 1 },
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export const Stars = tw.div`
  absolute
  w-full
  h-full
`

export const Star = tw.div`
  bg-gray-900
  dark:bg-gray-50
  w-1
  h-1
  rounded-full
  shadow
  absolute
`

export const CenterOuter = tw.div`
  w-24
  h-24
  relative
  transition-all
  duration-[2s]
  hover:scale-150
`

export const CenterPing = tw.div`
  absolute
  inset-4
  animate-ping
  bg-gray-400
  dark:bg-gray-600
  rounded-full
`

export const CenterHole = tw(Link)`
  absolute
  inset-0
  bg-gray-800
  dark:bg-black
  text-gray-200
  rounded-full
  flex
  justify-center
  items-center
`

export const CenterRing = tw.div`
  absolute
  -inset-[1px]
  rounded-full
  border
  border-secondary-300
  dark:border-secondary-400
  dark:border-opacity-50
`

export const Floaters = tw(motion.div)`
  absolute
  inset-0
  pointer-events-none
  flex
  justify-center
  items-center
`

Floaters.defaultProps = {
  transition: {
    ease: 'linear',
    duration: 30,
    repeat: Infinity,
  },
  initial: {
    rotateZ: '0deg',
  },
  animate: {
    rotateZ: '360deg',
  },
}

export const Floater = tw(motion.div)`
  absolute
  text-green-500
`

Floater.defaultProps = {
  transition: {
    duration: 5,
  },
  animate: {
    x: '0',
    y: '0',
    scale: 0.5,
    rotateZ: '0deg',
    opacity: [0, 1, 1, 1, 1, 1, 1, 0],
  },
}
