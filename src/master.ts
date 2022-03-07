import 'dotenv/config'
// workaround because cluster module is broken with typescript
import * as _cluster from 'cluster'
const cluster = _cluster as unknown as _cluster.Cluster
import { options } from './cli'

if (cluster.isPrimary) {
  console.log(options.networks)

  const targets = options.networks.split(',').map((v) => v.trim())

  const forkWorker = (target: string) => {
    const worker = cluster.fork({
      ...process.env,
      DEFAULT_NETWORK: target,
    })

    // if the worker exits for any reason, start it again with the same target
    worker.on('exit', () => setTimeout(() => forkWorker(target), 2000))
  }

  targets.forEach(forkWorker)
} else {
  import('./main')
}
