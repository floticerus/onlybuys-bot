import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { motion } from 'framer-motion'

export const Root = tw(ToastPrimitive.Root)`
  bg-gray-200
  dark:bg-gray-800
  rounded-lg
  p-4
  shadow
  border-l-[8px]
  border-secondary-500
  border-opacity-50
  flex
  justify-between
  items-center
  gap-4
`

export const StyledViewport = tw(ToastPrimitive.Viewport)`
  fixed
  bottom-0
  right-0
  flex
  flex-col
  justify-end
  p-8
  gap-4
  w-[540px]
  max-w-full
  m-0
  list-none
  z-100
`

export const StyledContent = tw.div`
  flex
  flex-col
  gap-2
`

export const StyledTitleCSS = styled(ToastPrimitive.Title)`
  grid-area: 'title';
`

export const StyledTitle = tw(StyledTitleCSS)`
  font-bold
`

StyledTitle.defaultProps = {
  $as: motion.div,
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

export const StyledDescriptionCSS = styled(ToastPrimitive.Description)`
  grid-area: 'description';
`

export const StyledDescription = tw(StyledDescriptionCSS)`
  text-sm
`

StyledDescription.defaultProps = {
  $as: motion.div,
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

export const StyledActions = tw.div`
  flex
  flex-col
  gap-2
  items-stretch
  w-1/3
  shrink-0
`

export const StyledActionCSS = styled(ToastPrimitive.Action)`
  grid-area: 'action';
`

export const StyledAction = tw(StyledActionCSS)`
  w-full
  shrink-0
  flex
  flex-col
  gap-2
  items-stretch
`

StyledAction.defaultProps = {
  $as: motion.div,
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

export const StyledCloseCSS = styled(ToastPrimitive.Action)`
  grid-area: 'action';
`

export const StyledClose = tw(StyledCloseCSS)`
  w-full
  shrink-0
  flex
  flex-col
  gap-2
  items-stretch
`

StyledClose.defaultProps = {
  $as: motion.div,
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}
