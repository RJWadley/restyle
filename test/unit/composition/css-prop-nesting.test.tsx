import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'css prop overrides nested @media all rule',
  test: (() => {
    const A = styled('div', {
      color: 'red',
      '@media all': { color: 'blue' },
    })
    const B = styled(A, { color: 'green' })
    return <B css={{ color: 'pink' }} />
  })(),
  expect: <div className="pink" />,
  css: css`
    .pink {
      color: pink;
    }
  `,
})

createUnitTest({
  name: 'css prop overrides nested &:first-child from inner',
  fails: true,
  test: (() => {
    const A = styled('div', {
      '&:first-child': { color: 'blue' },
    })
    const B = styled(A, { color: 'green' })
    return (
      <>
        <B css={{ color: 'pink' }} />
        <div />
      </>
    )
  })(),
  expect: (
    <>
      <div className="pink" />
      <div />
    </>
  ),
  css: css`
    .pink {
      color: pink;
    }
  `,
})
