import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

// verify that styled composition is deterministic regardless of render order

createUnitTest({
  name: 'order independence: render A then B',
  test: (() => {
    const A = styled('div', { color: 'red' })
    const B = styled(A, { color: 'green' })
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

createUnitTest({
  name: 'order independence: render B then A',
  test: (() => {
    const A = styled('div', { color: 'red' })
    const B = styled(A, { color: 'green' })
    return (
      <>
        <B />
        <A />
      </>
    )
  })(),
  expect: (
    <>
      <div className="b" />
      <div className="a" />
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
