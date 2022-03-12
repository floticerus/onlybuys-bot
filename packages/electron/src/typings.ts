export type NetworkName =
  | 'eth'
  | 'bsc'
  | 'metis'
  | 'fuse'
  | 'fantom'
  | 'polygon'
  | 'avalanche'
  | 'moonriver'
  | 'moonbeam'

export function isNetworkName(
  value: NetworkName | string,
): value is NetworkName {
  switch (value) {
    case 'eth':
    case 'bsc':
    case 'metis':
    case 'fuse':
    case 'fantom':
    case 'polygon':
    case 'avalanche':
    case 'moonriver':
    case 'moonbeam':
      return true
    default:
      return false
  }
}
