# progress-stream

**NOTE** You should be using the **/gen** import now.

Progress monitoring transform stream

## API
```
import progressStream from 'progress-stream/gen'

const progress = progressStream(opts)
```

Options:
- `onProgress` - callback to call to report on progress
- `interval` - how often to do this

The callback receives an object with:
- `bytes` - how many bytes
- `done` - is it done
and any other items included in the constructor object.

One final call (with `done=true`) will be made at the end of the stream
