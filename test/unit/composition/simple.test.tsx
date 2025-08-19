import * as React from 'react'

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'outer styled overrides inner base',
  test: (() => {
    const A = styled('div', { color: 'red' })
    const B = styled(A, { color: 'green' })
    return <B />
  })(),
  expect: <div className="a" />,
  css: css`
    .a {
      color: green;
    }
  `,
})
