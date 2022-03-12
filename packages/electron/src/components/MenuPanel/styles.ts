import styled from 'styled-components'
import tw from 'tailwind-styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Container = tw.div`
  bg-gray-200
  dark:bg-gray-800
  w-14
  h-full
  flex
  flex-col
  shrink-0
  justify-between
  shadow
`

export const ButtonArea = tw.div`
  w-full
`

export interface MenuPanelButtonProps {
  $active?: boolean
}

export const StyledMenuPanelButton = styled.button``

export const MenuPanelButton = tw(StyledMenuPanelButton)<MenuPanelButtonProps>`
  w-full
  h-14
  ${(p) =>
    p.$active
      ? 'bg-primary-300 dark:bg-primary-800 text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-100'
      : 'bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-400 hover:brightness-125'}
`

export const StyledMenuPanelButtonIcon = styled(FontAwesomeIcon)`
  ${StyledMenuPanelButton}:hover & {
    transform: rotateZ(-5deg) scale(1.2);
  }
`

export const MenuPanelButtonIcon = tw(StyledMenuPanelButtonIcon)`
  transition-transform
`
