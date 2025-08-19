import * as React from 'react'

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'multiple man-in-the-middle components still compose',
  test: (() => {
    const A = styled('div', { color: 'red' })

    const Forwarder1 = ({ className }: { className?: string }) => (
      <A className={className} />
    )
    const Forwarder2 = ({ className }: { className?: string }) => (
      <Forwarder1 className={className} />
    )
    const Forwarder3 = ({ className }: { className?: string }) => (
      <Forwarder2 className={className} />
    )

    const B = styled(Forwarder3, { color: 'green' })
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
