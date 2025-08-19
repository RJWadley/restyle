import * as React from 'react'

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'inner sets &:first-child, outer sets base → outer wins',
  test: (() => {
    const A = styled('div', { '&:first-child': { color: 'blue' } })
    const B = styled(A, { color: 'green' })
    return (
      <>
        <B />
        <div />
      </>
    )
  })(),
  expect: (
    <>
      <div className="a" />
      <div />
    </>
  ),
  css: css`
    .a {
      color: green;
    }
  `,
})

createUnitTest({
  name: 'both target &:first-child → outer wins',
  test: (() => {
    const A = styled('div', { '&:first-child': { color: 'blue' } })
    const B = styled(A, { '&:first-child': { color: 'green' } })
    return (
      <>
        <B />
        <div />
      </>
    )
  })(),
  expect: (
    <>
      <div className="a" />
      <div />
    </>
  ),
  css: css`
    .a:first-child {
      color: green;
    }
  `,
})
