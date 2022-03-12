import { ButtonHTMLAttributes } from 'react'
import tw from 'tailwind-styled-components'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'gray'
  $round?: boolean
}

export const Container = tw.button<ButtonProps>`
  py-2 px-4
  ${(p) =>
    p.$color === 'primary'
      ? 'bg-primary-200 dark:bg-primary-800'
      : p.$color === 'secondary'
      ? 'bg-secondary-200 dark:bg-secondary-600'
      : p.$color === 'success'
      ? 'bg-green-200 dark:bg-green-800'
      : p.$color === 'danger'
      ? 'bg-red-200 bg-red-800'
      : p.$color === 'gray'
      ? 'bg-gray-300 dark:bg-gray-700'
      : ''}
  ${(p) => (p.$round ? 'w-10 h-10 rounded-full' : 'rounded-3xl')}
  shadow
  outline-none
  font-extralight
  hover:brightness-90
  active:brightness-75
  select-none
  flex
  items-center
  justify-center
`
