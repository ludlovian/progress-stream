import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { Transform, Readable } from 'stream'
import { finished } from 'stream/promises'

import progress from '../src/index.mjs'

test('construction', t => {
  const p = progress()
  assert.ok(p instanceof Transform)
})

test('basic progress reporting', async t => {
  const source = new Readable({ read () {} })
  const calls = []
  const p = progress({
    progressInterval: 100,
    onProgress: data => calls.push(data),
    foo: 'bar'
  })
  source.pipe(p)
  p.resume()
  await delay(50)
  source.push('foo')
  await delay(100)
  source.push('bar')
  await delay(100)

  const pOver = finished(p)
  source.push(null)
  await pOver

  assert.equal(calls, [
    { bytes: 3, done: false, foo: 'bar' },
    { bytes: 6, done: false, foo: 'bar' },
    { bytes: 6, done: true, foo: 'bar' }
  ])
})

test('passes on errors', async () => {
  const source = new Readable({ read () {} })
  const err = new Error('Oops')

  const p = progress()
  source.pipe(p)
  p.resume()

  Promise.resolve().then(() => source.emit('error', err))

  await finished(p).then(
    () => {
      assert.unreachable()
    },
    e => {
      assert.is(e, err)
    }
  )
})

test.run()

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
