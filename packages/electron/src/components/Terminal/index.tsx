import React, { createRef, useEffect, useState } from 'react'
import {
  Container,
  TerminalDisplayList,
  TerminalDisplayListItem,
  TerminalDisplayListItemTimestamp,
  TerminalDisplayListItemLine,
  TerminalDisplayListItemPre,
  NavBar,
  NavBarRightArea,
  NavBarLeftArea,
} from './styles'
import { isNetworkName, NetworkName } from '../../typings'
import * as StyledDropdownMenu from '../StyledDropdownMenu/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../Button'
import { Link, useParams } from 'react-router-dom'
import AutoLinker from 'autolinker'

const autoLinker = new AutoLinker({
  className: 'text-primary-600 dark:text-primary-400',
})

let DEFAULT_NETWORK: NetworkName = 'metis'

export interface TerminalLine {
  content: string
  timestamp: number
  type?: 'log' | 'warning' | 'error' | 'info'
}

const linesCache: Record<string, Array<TerminalLine>> = {}
export const networks: Array<NetworkName> = [
  'eth',
  'bsc',
  'metis',
  'fuse',
  'fantom',
  'polygon',
  'avalanche',
  'moonriver',
  'moonbeam',
]
networks.sort()

const networkConnectedState: Record<string, boolean> = {}

for (const network of networks) {
  // init cache for networks
  linesCache[network] = []
  networkConnectedState[network] = false

  window.Main.on(`cli.${network}.spawn`, () => {
    networkConnectedState[network] = true
    linesCache[network].push({
      content: 'CLI client started',
      timestamp: Date.now(),
      type: 'info',
    })
  })

  window.Main.on(`cli.${network}.disconnect`, () => {
    networkConnectedState[network] = false
    linesCache[network].push({
      content: 'CLI client stopped',
      timestamp: Date.now(),
      type: 'info',
    })
  })

  // setup listeners for networks
  window.Main.on(`cli.${network}.chunk`, (_, chunk: string) => {
    // console.log(`got data on ${network}`)
    linesCache[network].push(
      {
        content: chunk.trim(),
        timestamp: Date.now(),
        type: 'log',
      },

      // ...chunk
      //   .split('\n')
      //   .filter((v) => v.trim() !== '')
      //   .map((v) => ({ content: v, timestamp: Date.now() } as TerminalLine)),
    )
  })

  window.Main.on(`cli.${network}.error`, (_, chunk: string) => {
    linesCache[network].push(
      {
        content: chunk.trim(),
        timestamp: Date.now(),
        type: 'error',
      },

      // ...chunk
      //   .split('\n')
      //   .filter((v) => v.trim() !== '')
      //   .map((v) => ({ content: v, timestamp: Date.now() } as TerminalLine)),
    )
  })
}

export interface TerminalDisplayProps {
  network?: NetworkName
  onLinesChanged?: (lines: Array<TerminalLine>) => void
}

export interface TerminalDisplayQueryParams {
  network: string
}

export const TerminalDisplay: React.FC<TerminalDisplayProps> = ({
  network,
  onLinesChanged,
}) => {
  // const { network } = useParams()

  const [lines, setLines] = useState<Array<TerminalLine>>([])

  useEffect(() => {
    const _network = network

    setLines([...linesCache[_network]])

    const updateLinesListener = () => {
      if (_network !== network) return

      setTimeout(() => setLines([...linesCache[_network]]), 1)
    }

    window.Main.on(`cli.${_network}.chunk`, updateLinesListener)
    window.Main.on(`cli.${_network}.error`, updateLinesListener)
    window.Main.on(`cli.${_network}.spawn`, updateLinesListener)
    window.Main.on(`cli.${_network}.disconnect`, updateLinesListener)

    return () => {
      window.Main.off(`cli.${_network}.chunk`, updateLinesListener)
      window.Main.off(`cli.${_network}.error`, updateLinesListener)
      window.Main.off(`cli.${_network}.spawn`, updateLinesListener)
      window.Main.off(`cli.${_network}.disconnect`, updateLinesListener)
    }
  }, [network])

  useEffect(() => {
    onLinesChanged && onLinesChanged(lines)
  }, [lines, onLinesChanged])

  return (
    <TerminalDisplayList>
      {lines.map(({ content, timestamp, type }, index) => (
        <TerminalDisplayListItem key={index}>
          <TerminalDisplayListItemTimestamp>
            {/* <FontAwesomeIcon  size="xs" />{' '} */}
            {new Date(timestamp).toLocaleString()}
          </TerminalDisplayListItemTimestamp>
          <TerminalDisplayListItemLine>
            <FontAwesomeIcon
              icon="terminal"
              size="xs"
              className={`mt-1 ${(() => {
                switch (type) {
                  case 'log':
                  default:
                    return 'text-green-500'
                  case 'error':
                    return 'text-red-500'
                  case 'warning':
                    return 'text-yellow-500'
                  case 'info':
                    return 'text-cyan-500'
                }
              })()}`}
            />
            <TerminalDisplayListItemPre
              className={(() => {
                switch (type) {
                  case 'log':
                  default:
                    return ''
                  case 'error':
                    return 'text-red-600 dark:text-red-200'
                  case 'warning':
                    return 'text-yellow-600 dark:text-yellow-200'
                  case 'info':
                    return 'text-cyan-600 dark:text-cyan-200'
                }
              })()}
              dangerouslySetInnerHTML={{ __html: autoLinker.link(content) }}
            >
              {/* {autoLinker.link(content)} */}
            </TerminalDisplayListItemPre>
          </TerminalDisplayListItemLine>
        </TerminalDisplayListItem>
      ))}
    </TerminalDisplayList>
  )
}

export interface TerminalProps {
  // defaultNetwork?: NetworkName
}

export const Terminal: React.FC<TerminalProps> = (
  {
    // defaultNetwork = DEFAULT_NETWORK,
  },
) => {
  const { network } = useParams()
  const scrollRef = createRef<HTMLDivElement>()
  const [currentNetwork, setCurrentNetwork] = useState<NetworkName>(
    (network ?? DEFAULT_NETWORK) as NetworkName,
  )
  const [networkConnected, setNetworkConnected] = useState<boolean>(
    networkConnectedState[currentNetwork] ?? false,
  )

  useEffect(() => {
    isNetworkName(network) && setCurrentNetwork(network)
  }, [network])

  useEffect(() => {
    DEFAULT_NETWORK = currentNetwork
    setNetworkConnected(networkConnectedState[currentNetwork])
  }, [currentNetwork])

  useEffect(() => {
    const _network = currentNetwork

    const updateConnectedStateHandler = () => {
      if (_network !== currentNetwork) return

      setNetworkConnected(networkConnectedState[_network])
    }

    window.Main.on(`cli.${_network}.spawn`, updateConnectedStateHandler)
    window.Main.on(`cli.${_network}.disconnect`, updateConnectedStateHandler)

    return () => {
      window.Main.off(`cli.${_network}.spawn`, updateConnectedStateHandler)
      window.Main.off(`cli.${_network}.disconnect`, updateConnectedStateHandler)
    }
  }, [currentNetwork])

  return (
    <Container ref={scrollRef}>
      <NavBar>
        <NavBarLeftArea>
          <StyledDropdownMenu.Root>
            <StyledDropdownMenu.Trigger className="flex gap-2 items-center">
              <FontAwesomeIcon
                size="xs"
                icon="circle"
                className={
                  networkConnected ? 'text-green-500' : 'text-gray-500'
                }
              />
              <span>Network:</span>
              <span className="font-bold">{currentNetwork}</span>
            </StyledDropdownMenu.Trigger>

            <StyledDropdownMenu.Content>
              {networks.map((network) => (
                <StyledDropdownMenu.RadioGroup
                  key={network}
                  value={network}
                  // onValueChange={(value) =>
                  //   setCurrentNetwork(value as NetworkName)
                  // }
                >
                  <Link to={`/terminal/${network}`}>
                    <StyledDropdownMenu.RadioItem value={network}>
                      <StyledDropdownMenu.ItemIndicator>
                        <FontAwesomeIcon
                          icon="circle"
                          opacity={currentNetwork === network ? 1 : 0.2}
                          className={
                            currentNetwork === network
                              ? 'text-primary-500'
                              : 'text-gray-500'
                          }
                        />
                      </StyledDropdownMenu.ItemIndicator>
                      {network}
                    </StyledDropdownMenu.RadioItem>
                  </Link>
                </StyledDropdownMenu.RadioGroup>
              ))}
            </StyledDropdownMenu.Content>
          </StyledDropdownMenu.Root>

          <Button
            $color="primary"
            className={`flex gap-2 items-center`}
            onClick={
              networkConnected
                ? () => {
                    window.Main.sendMessage(`cli.${currentNetwork}.disconnect`)
                  }
                : () => {
                    window.Main.sendMessage(`cli.${currentNetwork}.connect`)
                  }
            }
          >
            <FontAwesomeIcon
              icon={networkConnected ? 'stop' : 'play'}
              opacity={0.75}
            />
            {networkConnected ? 'Stop' : 'Start'}
          </Button>
        </NavBarLeftArea>

        <NavBarRightArea>
          <Button
            $color="gray"
            $round={true}
            className="flex justify-center items-center"
          >
            <FontAwesomeIcon icon="bars" fixedWidth />
          </Button>
        </NavBarRightArea>
      </NavBar>

      {networks
        .filter((network) => network === currentNetwork)
        .map((network) => (
          <TerminalDisplay
            key={network}
            network={network}
            onLinesChanged={() => {
              if (!scrollRef.current) return

              scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }}
          />
        ))}

      {/* <TerminalDisplay
        network={currentNetwork}
        onLinesChanged={() => {
          if (!scrollRef.current) return

          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }}
      /> */}
    </Container>
  )
}
