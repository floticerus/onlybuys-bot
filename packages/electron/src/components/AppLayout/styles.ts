import tw from 'tailwind-styled-components'

export const Container = tw.div`
  flex
  h-full
  max-w-full
  bg-gray-100
  text-gray-800
  dark:bg-gray-900
  dark:text-gray-300
  font-sans
  font-extralight
`

export const ContentPanel = tw.div`
  bg-gray-100
  dark:bg-gray-900
  grow
  max-w-full
  shadow-inner
`
