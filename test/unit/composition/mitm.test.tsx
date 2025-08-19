import * as React from 'react'

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'man-in-the-middle still composes',
  test: (() => {
    const A = styled('div', { color: 'red' })
    const Forwarder = ({ className }: { className?: string }) => (
      <A className={className} />
    )
    const B = styled(Forwarder, { color: 'green' })
    return (
      <>
        <A />
        <B />
      </>
    )
  })(),
  expect: (
    <>
      <div className="a" />
      <div className="b" />
    </>
  ),
  css: css`
    .a {
      color: red;
    }
    .b {
      color: green;
    }
  `,
})
