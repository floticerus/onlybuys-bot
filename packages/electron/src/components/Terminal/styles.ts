import tw from 'tailwind-styled-components'

export const Container = tw.div`
  p-4
  h-full
  overflow-auto
`

export const TerminalDisplayList = tw.ul`
  text-sm
  max-w-full
  flex
  flex-col
  gap-3
`

export const TerminalDisplayListItem = tw.li`
  overflow-hidden
  text-ellipsis
  break-all
  max-w-full
  flex
  flex-col
  gap-1
  items-start
`

export const TerminalDisplayListItemTimestamp = tw.div`
  whitespace-pre-wrap
  shrink-0
  text-gray-500
  italic
  text-xs
  font-mono
  ml-5
`

export const TerminalDisplayListItemLine = tw.div`
  flex
  gap-2
`

export const TerminalDisplayListItemPre = tw.div`
  font-mono
  overflow-hidden
  text-ellipsis
  whitespace-pre-wrap
  max-w-full
  grow
`

export const NavBar = tw.div`
  bg-gray-200
  bg-opacity-90
  dark:bg-gray-800
  dark:bg-opacity-90
  p-2
  mb-3
  rounded-3xl
  sticky
  top-0
  flex
  items-center
  justify-between
`

export const NavBarLeftArea = tw.div`
  flex
  gap-2
  items-center
`

export const NavBarRightArea = tw.div`

`
