import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'branching: sibling compositions from same base remain independent',
  test: (() => {
    const A = styled('div', { color: 'red' })
    const B = styled(A, { color: 'green' })
    const C = styled(A, { color: 'blue' })
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
    }
    .b {
      color: green;
    }
    .c {
      color: blue;
    }
  `,
})
