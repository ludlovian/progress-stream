import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { pipeline } from 'stream/promises'

import progress from '../src/gen.mjs'

test('basic progress reporting', async t => {
  async function * source () {
    await delay(50)
    yield 'foo'
    await delay(100)
    yield 'bar'
    await delay(100)
  }

  async function * sink (source) {
    // eslint-disable-next-line no-unused-vars
    for await (const chunk of source) {
      // do nothing
    }
  }

  const calls = []
  const p = progress({
    interval: 100,
    onProgress: data => calls.push(data),
    foo: 'bar'
  })

  await pipeline(source, p, sink)

  assert.equal(calls, [
    { bytes: 3, done: false, foo: 'bar' },
    { bytes: 6, done: false, foo: 'bar' },
    { bytes: 6, done: true, foo: 'bar' }
  ])
})

test('errors', async () => {
  const err = new Error('oops')
  async function * source () {
    await delay(150)
    throw err
  }

  let caught = false
  async function * sink (source) {
    try {
      // eslint-disable-next-line no-unused-vars
      for await (const chunk of source) {
        // do nothing
      }
    } catch (e) {
      caught = true
      assert.is(e, err)
      throw e
    }
  }

  const p = progress({ interval: 100 })
  const pDone = pipeline(source, p, sink)
  await pDone.then(assert.unreachable, e => assert.is(e, err))
  assert.ok(caught)
})

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test.run()
