'use strict';

var stream = require('stream');

function progress (opts = {}) {
  const { onProgress, progressInterval, ...rest } = opts;
  let interval;
  let bytes = 0;
  let done = false;
  let error;
  const ts = new stream.Transform({
    transform (chunk, encoding, cb) {
      bytes += chunk.length;
      cb(null, chunk);
    },
    flush (cb) {
      if (interval) clearInterval(interval);
      done = true;
      reportProgress();
      cb(error);
    }
  });
  if (progressInterval) {
    interval = setInterval(reportProgress, progressInterval);
  }
  if (typeof onProgress === 'function') {
    ts.on('progress', onProgress);
  }
  ts.on('pipe', src =>
    src.on('error', err => {
      error = error || err;
      ts.emit(err);
    })
  );
  return ts
  function reportProgress () {
    if (!error) ts.emit('progress', { bytes, done, ...rest });
  }
}

module.exports = progress;
