// Copyright (c) 2014 Chris Clark
var convertEncoding = require('./bigint.js').convertEncoding;

// RFC1924 Base85 (Joke RFC)
var BASE85 = ('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
              + 'abcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~');

function rfc1924test() {
    var base16 = '108000000000000000080800200C417A';
    var base10 = '21932261930451111902915077091070067066';
    var base85 = '4)+k&C#VzJ4br>0wv%Yp';
    var dec = BASE85.slice(0, 10);
    var hex = BASE85.slice(0, 16);
    console.assert(convertEncoding(base16, hex, dec) === base10);
    console.assert(convertEncoding(base10, dec, hex) === base16);
    console.assert(convertEncoding(base16, hex, BASE85) === base85);
    console.assert(convertEncoding(base10, dec, BASE85) === base85);
    console.assert(convertEncoding(base85, BASE85, hex) === base16);
    console.assert(convertEncoding(base85, BASE85, dec) === base10);
    console.log('All tests passed');
}

rfc1924test();
