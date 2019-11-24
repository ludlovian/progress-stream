# progress-stream
Progress monitoring transform stream

## API
`const stream = progressStream(opts)`

Creates a progress monitoring transform stream that emits `progress` events with shape `{ bytes, done, ...rest }`

Options:
- `onProgress` - if set, will be attached to the `progress` event
- `progressInterval` - how often to send updates (in ms)

One final event (with `done=true`) will be sent at the end of the stream
