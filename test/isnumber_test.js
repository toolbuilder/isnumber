import { test } from 'zora'
import { isNumeric, isFiniteNumeric, isNumber, isFiniteNumber } from '../src/isnumber.js'

/*
Tests and functions to test copied from http://run.plnkr.co/plunks/93FPpacuIcXqqKMecLdk/
Original only tested isFiniteNumeric functionality, so refactored to test other notions
of 'number like' and to use ES modules, zora, and eslint coding standards, etc.

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
 * All the is* functions that we're testing have this signature.
 * Don't use a union of them so that we test the d.ts mapping
 * @typedef {(n: any) => boolean} NumberCheck
 */

/**
 * A grouping of test cases where NumberCheck should return the expected value
 * @typedef {(fn: NumberCheck, expected: boolean) => void} TestFunction
 */

/**
 * Test that all varieties of numeric literal pass.
 * @param {NumberCheck} fn - function under test
 */
const numberLiterals = (fn) => {
  test(`${fn.name} integer literals`, assert => {
    assert.ok(fn(-16), 'Negative integer number')
    assert.ok(fn(0), 'Zero integer number')
    assert.ok(fn(32), 'Positive integer number')
    assert.ok(fn(0o0144), 'Octal integer literal')
    assert.ok(fn(0xFFF), 'Hexadecimal integer literal')
  })

  test(`${fn.name} floating point literals`, assert => {
    assert.ok(fn(-2.6), 'Negative floating point number')
    assert.ok(fn(3.1415), 'Positive floating point number')
    assert.ok(fn(8e5), 'Exponential notation')
  })
}

/**
 * Test that strings that look like numbers are handled as expected.
 *
 * @type {TestFunction}
 * @param {NumberCheck} fn - function under test
 * @param {boolean} expected - true if fn considers number-like strings to be numbers
 * @returns {void}
 */
const numberLikeStrings = (fn, expected) => {
  test(`${fn.name} integer strings`, assert => {
    assert.equals(fn('-10'), expected, 'Negative integer string')
    assert.equals(fn('0'), expected, 'Zero string')
    assert.equals(fn('5'), expected, 'Positive integer string')
    assert.equals(fn('040'), expected, 'Octal integer literal string')
    assert.equals(fn('0xFF'), expected, 'Hexadecimal integer literal string')
    assert.equals(fn('05'), expected, 'Zero padded integer string')
  })

  test(`${fn.name} floating point strings`, assert => {
    assert.equals(fn('-1.6'), expected, 'Negative floating point string')
    assert.equals(fn('4.536'), expected, 'Positive floating point string')
    assert.equals(fn('123e-2'), expected, 'Exponential notation string')
    assert.equals(fn('04.345'), expected, 'Zero padded positive floating point string')
  })
}

/**
 * Test that non-finite values are handled as expected.
 * @type {TestFunction}
 * @param {NumberCheck} fn - function under test
 * @param {boolean} expected  - true if fn considers non-finite values to be numbers
 */
const nonFinite = (fn, expected) => {
  test(`${fn.name} non finite values`, assert => {
    assert.equals(fn(NaN), expected, 'NaN value')
    assert.equals(fn(Infinity), expected, 'Positive Infinity primitive')
    assert.equals(fn(-Infinity), expected, 'Negative Infinity primative')
    assert.equals(fn(Number.POSITIVE_INFINITY), expected, 'Positive Infinity')
    assert.equals(fn(Number.NEGATIVE_INFINITY), expected, 'Negative Infinity')
  })
}

/**
 * Test that strings that look like non-finite values are handled as expected.
 * @type {TestFunction}
 * @param {NumberCheck} fn - function under test
 * @param {boolean} expected  - true if fn considers non-finite string values to be numbers
 */
const nonFiniteStrings = (fn, expected) => {
  test(`${fn.name} non-finite strings`, assert => {
    assert.equals(fn('NaN'), expected, 'NaN string')
    assert.equals(fn('Infinity'), expected, 'Positive Infinity string')
    assert.equals(fn('-Infinity'), expected, 'Negative Infinity string')
  })
}

/**
 * Test that non-numeric values are not considered numbers.
 * @param {NumberCheck} fn - function under test
 */
const nonNumeric = (fn) => {
  test(`${fn.name} non-numeric strings`, assert => {
    assert.equals(fn(''), false, 'Empty string')
    assert.equals(fn('        '), false, 'Whitespace characters string')
    assert.equals(fn('\t\t'), false, 'Tab characters string')
    assert.equals(fn('abcdefghijklm1234567890'), false, 'Alphanumeric character string')
    assert.equals(fn('xabcdefx'), false, 'Non-numeric character string')
    assert.equals(fn(true), false, 'Boolean true literal')
    assert.equals(fn(false), false, 'Boolean false literal')
    assert.equals(fn('bcfed5.2'), false, 'Number with preceding non-numeric characters')
    assert.equals(fn('7.2acdgs'), false, 'Number with trailling non-numeric characters')
    assert.equals(fn(undefined), false, 'Undefined value')
    assert.equals(fn(null), false, 'Null value')
    assert.equals(fn(new Date(2009, 1, 1)), false, 'Date object')
    assert.equals(fn({}), false, 'Empty object')
    assert.equals(fn(function () {}), false, 'Instance of a function')
  })
}

/**
 * @typedef {[TestFunction, boolean]} TestCase
 */
/**
 * @typedef {[NumberCheck, TestCase[]]} NumberCheckTest
 */
/**
 * Test specifications for each function.
 * @type {NumberCheckTest[]}
 */
const tests = [
  [isNumber, [[nonFinite, true], [nonFiniteStrings, false], [numberLikeStrings, false]]],
  [isNumeric, [[nonFinite, true], [nonFiniteStrings, true], [numberLikeStrings, true]]],
  [isFiniteNumber, [[nonFinite, false], [nonFiniteStrings, false], [numberLikeStrings, false]]],
  [isFiniteNumeric, [[nonFinite, false], [nonFiniteStrings, false], [numberLikeStrings, true]]]
]

/**
 * Run the tests specified just above.
 */
tests.forEach(testData => {
  const [fn, testCases] = testData // function under test
  numberLiterals(fn)
  nonNumeric(fn)
  testCases.forEach(test => {
    const [testFunction, expected] = test
    testFunction(fn, expected)
  })
})
