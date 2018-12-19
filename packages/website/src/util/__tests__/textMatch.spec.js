import test from 'tape'
import { textMatch } from '../textMatch'

test('textMatch', t => {
  ;[
    ['hello', 'hello', true],
    ['banana', 'hello', false],
    ['hel', 'hello', true],
    ['23 hel', 'hello 23', true],
    ['23 hel', 'hello 235', false],
    ['22a  HeLlo   ', 'helLO 22A', true],
  ].forEach(([pattern, text, expected]) =>
    t.assert(
      textMatch(pattern, text) == expected,
      `"${pattern}" should ${expected ? '' : 'not '}match "${text}"`
    )
  )

  t.end()
})
