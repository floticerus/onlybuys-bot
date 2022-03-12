import tw from 'tailwind-styled-components'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '../Button'

export const Root = tw(DropdownMenu.Root)``

export const Trigger = tw(DropdownMenu.Trigger)`
  py-2 px-4
  bg-gray-300
  dark:bg-gray-700
  rounded-3xl
  shadow
  outline-none
  font-extralight
  hover:brightness-90
  active:brightness-75
  select-none
`

export const Content = tw(DropdownMenu.Content)`
  bg-gray-50
  dark:bg-gray-800
  text-gray-900
  dark:text-gray-300
  rounded
  shadow
`

export const Label = tw(DropdownMenu.Label)``

export const Item = tw(DropdownMenu.Item)``

export const Group = tw(DropdownMenu.Group)``

export const RadioGroup = tw(DropdownMenu.RadioGroup)``

export const RadioItem = tw(DropdownMenu.RadioItem)`
  px-3 py-2
  flex
  gap-3
  items-center
  cursor-pointer
  outline-none
  brightness-50
  hover:brightness-100
`

export const ItemIndicator = tw(DropdownMenu.ItemIndicator)`
  text-xs
`
