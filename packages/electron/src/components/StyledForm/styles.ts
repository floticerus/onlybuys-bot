import tw from 'tailwind-styled-components'
import * as _Label from '@radix-ui/react-label'

export const Container = tw.div`
  
`

export const Form = tw.form``

export const Row = tw.div`
  w-full
  flex
  flex-col
  md:flex-row
  items-center
  my-4
  gap-1
`

export const Label = tw(_Label.Root)`
  select-none
  w-full
  md:w-64
  shrink-0
`

export const Input = tw.input`
  px-4 py-2
  bg-gray-200
  dark:bg-gray-800
  rounded-3xl
  outline-none
  grow
  w-full
  border
  border-transparent
  focus:border-primary-500
`
