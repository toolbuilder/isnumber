import tape from 'tape'
import { isNumeric, isFiniteNumeric, isNumber, isFiniteNumber } from '../src/isnumber.js'

/*
Tests and functions to test copied from http://run.plnkr.co/plunks/93FPpacuIcXqqKMecLdk/
Original only tested isFiniteNumeric functionality, so refactored to test other notions
of 'number like' and to use ES modules, tape, and standard.js coding standards, etc.

These are refactored isFiniteNumeric implementations from the above link.
Apparently all these implementations are broken in some way.
They are here in case you want to test any of them.

var functionsToTest = [
  (n) => !isNaN(n) && !isNaN(parseFloat(n)),
  (n) => !isNaN((n)),
  (n) => !isNaN(parseFloat(n)),
  (n) => typeof (n) !== 'boolean' && !isNaN(n),
  (n) => parseFloat(n) === Number(n),
  (n) => parseInt(n) === Number(n),
  (n) => !isNaN(Number(String(n))),
  (n) => !isNaN(+('' + n)),
  (n) => (+n) == n, // eslint-disable-line
  (n) => n && /^-?\d+(\.\d+)?$/.test(n + ''),
  (n) => isFinite(Number(String(n))),
  (n) => isFinite(String(n)),
  (n) => !isNaN(n) && !isNaN(parseFloat(n)) && isFinite(n),
  (n) => parseFloat(n) == n, // eslint-disable-line
  (n) => (n - 0) == n && n.length > 0, // eslint-disable-line
  (n) => typeof n === 'number' && isFinite(n)
]
*/

/**
 * Test that all varieties of numeric literal pass.
 * @param {Function} fn - function under test
 */
const numberLiterals = (fn) => {
  tape(`${fn.name} integer literals`, test => {
    test.true(fn(-16), 'Negative integer number')
    test.true(fn(0), 'Zero integer number')
    test.true(fn(32), 'Positive integer number')
    test.true(fn(0o0144), 'Octal integer literal')
    test.true(fn(0xFFF), 'Hexadecimal integer literal')
    test.end()
  })

  tape(`${fn.name} floating point literals`, test => {
    test.true(fn(-2.6), 'Negative floating point number')
    test.true(fn(3.1415), 'Positive floating point number')
    test.true(fn(8e5), 'Exponential notation')
    test.end()
  })
}

/**
 * Test that strings that look like numbers are handled as expected.
 *
 * @param {Function} fn - function under test
 * @param {Boolean} expected - true if fn considers number-like strings to be numbers
 */
const numberLikeStrings = (fn, expected) => {
  tape(`${fn.name} integer strings`, test => {
    test.equals(fn('-10'), expected, 'Negative integer string')
    test.equals(fn('0'), expected, 'Zero string')
    test.equals(fn('5'), expected, 'Positive integer string')
    test.equals(fn('040'), expected, 'Octal integer literal string')
    test.equals(fn('0xFF'), expected, 'Hexadecimal integer literal string')
    test.equals(fn('05'), expected, 'Zero padded integer string')
    test.end()
  })

  tape(`${fn.name} floating point strings`, test => {
    test.equals(fn('-1.6'), expected, 'Negative floating point string')
    test.equals(fn('4.536'), expected, 'Positive floating point string')
    test.equals(fn('123e-2'), expected, 'Exponential notation string')
    test.equals(fn('04.345'), expected, 'Zero padded positive floating point string')
    test.end()
  })
}

/**
 * Test that non-finite values are handled as expected.
 * @param {Function} fn - function under test
 * @param {Boolean} expected  - true if fn considers non-finite values to be numbers
 */
const nonFinite = (fn, expected) => {
  tape(`${fn.name} non finite values`, test => {
    test.equals(fn(NaN), expected, 'NaN value')
    test.equals(fn(Infinity), expected, 'Positive Infinity primitive')
    test.equals(fn(-Infinity), expected, 'Negative Infinity primative')
    test.equals(fn(Number.POSITIVE_INFINITY), expected, 'Positive Infinity')
    test.equals(fn(Number.NEGATIVE_INFINITY), expected, 'Negative Infinity')
    test.end()
  })
}

/**
 * Test that strings that look like non-finite values are handled as expected.
 * @param {Function} fn - function under test
 * @param {Boolean} expected  - true if fn considers non-finite string values to be numbers
 */
const nonFiniteStrings = (fn, expected) => {
  tape(`${fn.name} non-finite strings`, test => {
    test.equals(fn('NaN'), expected, 'NaN string')
    test.equals(fn('Infinity'), expected, 'Positive Infinity string')
    test.equals(fn('-Infinity'), expected, 'Negative Infinity string')
    test.end()
  })
}

/**
 * Test that non-numeric values are not considered numbers.
 * @param {Function} fn - function under test
 */
const nonNumeric = (fn) => {
  tape(`${fn.name} non-numeric strings`, test => {
    test.equals(fn(''), false, 'Empty string')
    test.equals(fn('        '), false, 'Whitespace characters string')
    test.equals(fn('\t\t'), false, 'Tab characters string')
    test.equals(fn('abcdefghijklm1234567890'), false, 'Alphanumeric character string')
    test.equals(fn('xabcdefx'), false, 'Non-numeric character string')
    test.equals(fn(true), false, 'Boolean true literal')
    test.equals(fn(false), false, 'Boolean false literal')
    test.equals(fn('bcfed5.2'), false, 'Number with preceding non-numeric characters')
    test.equals(fn('7.2acdgs'), false, 'Number with trailling non-numeric characters')
    test.equals(fn(undefined), false, 'Undefined value')
    test.equals(fn(null), false, 'Null value')
    test.equals(fn(new Date(2009, 1, 1)), false, 'Date object')
    test.equals(fn({}), false, 'Empty object')
    test.equals(fn(function () {}), false, 'Instance of a function')
    test.end()
  })
}

/**
 * Test specifications for each function.
 * - first element is the function under test
 * - following elements are [fn, expected] pairs. Where fn is the test function, and
 * expected is the 'expected' parameter to the function
 */
const tests = [
  [isNumber, [nonFinite, true], [nonFiniteStrings, false], [numberLikeStrings, false]],
  [isNumeric, [nonFinite, true], [nonFiniteStrings, true], [numberLikeStrings, true]],
  [isFiniteNumber, [nonFinite, false], [nonFiniteStrings, false], [numberLikeStrings, false]],
  [isFiniteNumeric, [nonFinite, false], [nonFiniteStrings, false], [numberLikeStrings, true]]
]

/**
 * Run the tests specified just above.
 */
tests.forEach(testData => {
  const fn = testData[0] // function under test
  numberLiterals(fn)
  nonNumeric(fn)
  testData.slice(1).forEach(test => {
    const [testFunction, expected] = test
    testFunction(fn, expected)
  })
})
