// Copyright (c) 2014 Chris Clark
var convertBase = require('./convertbase.js');

// RFC1924 Base85 (Joke RFC)
var BASE85 = ('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
              + 'abcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~');

function rfc1924test() {
    var base16 = '108000000000000000080800200C417A';
    var base10 = '21932261930451111902915077091070067066';
    var base85 = '4)+k&C#VzJ4br>0wv%Yp';
    var dec = BASE85.slice(0, 10);
    var hex = BASE85.slice(0, 16);
    console.assert(convertBase(base16, hex, dec) === base10);
    console.assert(convertBase(base10, dec, hex) === base16);
    console.assert(convertBase(base16, hex, BASE85) === base85);
    console.assert(convertBase(base10, dec, BASE85) === base85);
    console.assert(convertBase(base85, BASE85, hex) === base16);
    console.assert(convertBase(base85, BASE85, dec) === base10);
}

function unitTest() {
    var base10 = '11101110111011101110';
    console.assert(convertBase(base10, 10, 10).join('') === base10);

    var large = '27253612834651292817068063108051952822914696443427141008555' +
    '14212331668214493225407163283368859326204568949300824165534178395532698' +
    '02974374932198062680651501832461117334589900088804114494821430904063776' +
    '11761078341580375284217607011541826787677233082585754389591236816422975' +
    '207551625801435043443350389601614965';
    var largeBinary = convertBase(large, 10, 2).join('');
    var largeDecimal = convertBase(largeBinary, 2, 10).join('');
    console.assert(largeDecimal === large);

    var zero = convertBase('0000', '0123456789', '0123456789abcdef');
    console.assert(zero === '0');

    var zeroPrefix = convertBase('0001', '0123456789', '0123456789abcdef');
    console.assert(zeroPrefix === '1');
}

rfc1924test();
unitTest();
console.log('All tests passed');
