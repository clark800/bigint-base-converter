bigint-base-converter
=====================

Node package for converting integers between bases. Integers do not have to fit in a javascript native number.

To install:

    npm install bigint-base-converter

To import:

    var convertBase = require('bigint-base-converter');

To use:

    convertBase(value, fromBase, toBase)

`fromBase` and `toBase` may be integers or alphabet strings. If integer, the output/intput will (be/expected to be) an array of numbers in that base. If string, the output/input will (be/expected to be) encoded using the characters in the string as the digits (with the base as the length of the string parameter).
