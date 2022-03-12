import React, {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useRef,
} from 'react'
import { networks } from '../Terminal'
import * as StyledToast from './styles'
import { ToastProvider, ToastProviderProps } from '@radix-ui/react-toast'
import { Button } from '../Button'
import { Link } from 'react-router-dom'
export { ToastProvider }

export interface CustomToastProps {
  title?: string | ReactNode
  description?: string | ReactNode
  actions?: Array<{
    element?: string | ReactNode
    altText?: string
  }>
  open?: boolean
}

export interface IToastsContext {
  addToast: (toast: CustomToastProps) => void
}

export const ToastsContext = createContext<IToastsContext>({
  addToast() {},
})

export interface StyledToastProviderProps extends ToastProviderProps {
  maxVisibleToasts?: number
}

const StyledToastProvider: React.FC<StyledToastProviderProps> = ({
  children,
  maxVisibleToasts = 3,
  swipeDirection = 'right',
  ...rest
}) => {
  const [toastQueue, setToastQueue] = useState<Array<CustomToastProps>>([])
  const toastCache = useRef<Array<CustomToastProps>>([])

  const addToast = (toast: CustomToastProps) => {
    setToastQueue([...toastCache.current, { ...toast, open: true }])
  }

  useEffect(() => {
    toastCache.current = [...toastQueue]
  }, [toastQueue])

  useEffect(() => {
    const events: Array<string> = []
    const listeners: Record<string, (...args: any[]) => void> = {}

    networks.forEach((network) => {
      const spawnEvent = `cli.${network}.spawn`
      const disconnectEvent = `cli.${network}.disconnect`
      const pairCreatedEvent = `cli.${network}.pair-created`
      const pairMintedEvent = `cli.${network}.pair-minted`
      const tokenBuyEvent = `cli.${network}.token-buy`
      const tokenSellEvent = `cli.${network}.token-sell`

      const eventsForNetwork = [
        spawnEvent,
        disconnectEvent,
        pairCreatedEvent,
        pairMintedEvent,
        tokenBuyEvent,
        tokenSellEvent,
      ]
      events.push(...eventsForNetwork)

      listeners[spawnEvent] = () => {
        addToast({
          title: (
            <>
              Started bot on <b>{network}</b> network
            </>
          ),
          description: 'CLI client successfully started.',
        })
      }

      listeners[disconnectEvent] = () => {
        addToast({
          title: (
            <>
              Bot on <b>{network}</b> network has stopped
            </>
          ),
          description: 'CLI client has stopped',
          actions: [
            {
              element: (
                <Button
                  $color="primary"
                  onClick={() => {
                    window.Main.sendMessage(`cli.${network}.connect`)
                  }}
                >
                  Restart
                </Button>
              ),
              altText: `Restart ${network}`,
            },
          ],
        })
      }

      listeners[pairCreatedEvent] = (_, data) => {
        console.log(data)
        addToast({
          title: (
            <>
              Pair created on <b>{network}</b>
            </>
          ),
          description: `${data.token.symbol} / ${data.pairedToken.symbol}`,
          actions: [
            {
              element: (
                <>
                  <Link to={`/terminal/${network}`}>
                    <Button className="w-full" $color="primary">
                      Go to {network}
                    </Button>
                  </Link>
                </>
              ),
              altText: `Go to ${network}`,
            },
          ],
        })
      }

      listeners[pairMintedEvent] = (_, data) => {
        console.log(data)
        addToast({
          title: (
            <>
              {data.token.symbol} / {data.pairedToken.symbol} minted
            </>
          ),
          description: (
            <>
              <div>
                {data.token.symbol}: {data.token.balance}
              </div>
              <div>
                {data.pairedToken.symbol}: {data.pairedToken.balance}
              </div>
            </>
          ),
          actions: [
            {
              element: (
                <>
                  <Link to={`/terminal/${network}`}>
                    <Button className="w-full" $color="primary">
                      Go to {network}
                    </Button>
                  </Link>
                </>
              ),
              altText: `Go to ${network}`,
            },
          ],
        })
      }

      listeners[tokenBuyEvent] = () => {
        addToast({
          title: (
            <>
              Bought token on <b>{network}</b> network
            </>
          ),
        })
      }

      listeners[tokenSellEvent] = () => {
        addToast({
          title: (
            <>
              Sold token on <b>{network}</b> network
            </>
          ),
        })
      }

      eventsForNetwork.forEach((eventName) => {
        window.Main.on(eventName, listeners[eventName])
      })
    })

    return () => {
      events.forEach((eventName) =>
        window.Main.off(eventName, listeners[eventName]),
      )
    }
  }, [])

  return (
    <ToastProvider swipeDirection={swipeDirection} {...rest}>
      <ToastsContext.Provider
        value={{
          addToast,
        }}
      >
        {children}

        {(() => {
          let openCount = 0
          const increaseOpenCount = () => {
            return ++openCount <= maxVisibleToasts
          }

          return toastQueue.map((toast, index) => {
            const onOpenChange = (open?: boolean) => {
              const newToastQueue = [...toastCache.current]
              if (!newToastQueue[index]) return
              newToastQueue[index].open = open
              setToastQueue(newToastQueue)
            }

            return toast.open && increaseOpenCount() ? (
              <StyledToast.Root
                open={toast.open}
                key={index}
                onOpenChange={onOpenChange}
              >
                <StyledToast.StyledContent>
                  {toast.title && (
                    <StyledToast.StyledTitle>
                      {toast.title}
                    </StyledToast.StyledTitle>
                  )}

                  {toast.description && (
                    <StyledToast.StyledDescription asChild>
                      {toast.description}
                    </StyledToast.StyledDescription>
                  )}
                </StyledToast.StyledContent>

                <StyledToast.StyledActions>
                  {toast.actions?.map(({ element, altText }, actionIndex) => (
                    <StyledToast.StyledAction
                      key={actionIndex}
                      asChild
                      altText={altText ?? ''}
                      onClick={() => onOpenChange(false)}
                    >
                      {element}
                    </StyledToast.StyledAction>
                  ))}

                  <StyledToast.StyledClose onClick={() => onOpenChange(false)}>
                    <Button $color="gray">Close</Button>
                  </StyledToast.StyledClose>
                </StyledToast.StyledActions>
              </StyledToast.Root>
            ) : null
          })
        })()}

        <StyledToast.StyledViewport />
      </ToastsContext.Provider>
    </ToastProvider>
  )
}

export default StyledToastProvider
