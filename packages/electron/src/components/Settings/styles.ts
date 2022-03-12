import tw from 'tailwind-styled-components'
import { motion } from 'framer-motion'

export const Container = tw(motion.div)`
  p-8
`

Container.defaultProps = {
  transition: { ease: 'easeOut' },
  initial: {
    y: 10,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
}

export const TopBar = tw.div`
  pb-2
  border-b
  border-gray-200
  dark:border-gray-800
  flex
  justify-between
  items-center
`

export const Header = tw.h1`
  text-4xl
`
