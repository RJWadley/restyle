import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'deep chain: last wins',
  test: (() => {
    const A = styled('div', { color: 'red', background: 'yellow' })
    const B = styled(A, { color: 'green' })
    const C = styled(B, { color: 'blue', background: 'orange' })
    return (
      <>
        <A />
        <B />
        <C />
      </>
    )
  })(),
  expect: (
    <>
      <div className="a" />
      <div className="b" />
      <div className="c" />
    </>
  ),
  css: css`
    .a {
      color: red;
      background: yellow;
    }
    .b {
      color: green;
      background: yellow;
    }
    .c {
      color: blue;
      background: orange;
    }
  `,
})
