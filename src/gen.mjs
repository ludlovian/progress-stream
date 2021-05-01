export default function progressStream ({
  onProgress,
  interval = 1000,
  ...rest
} = {}) {
  return async function * transform (source) {
    const int = setInterval(report, interval)
    let bytes = 0
    let done = false
    try {
      for await (const chunk of source) {
        bytes += chunk.length
        yield source
      }
      done = true
      report()
    } finally {
      clearInterval(int)
    }

    function report () {
      onProgress && onProgress({ bytes, done, ...rest })
    }
  }
}
