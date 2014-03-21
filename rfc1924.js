// RFC1924 Base85 (Joke RFC)
var BASE85 = ('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
              + 'abcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~');

function encodeBigNum(n) {
    return n.array().map(function(i) { return BASE85.charAt(i); }).join('');
}

function decodeBigNum(str, radix) {
    var array = str.split('').map(function(c) { return BASE85.indexOf(c); });
    return (new BigNum(radix)).load(array);
}

function encodedRebase(encoded, fromRadix, toRadix) {
    return encodeBigNum(decodeBigNum(encoded, fromRadix).rebase(toRadix));
}

function rfc1924test() {
    var base16 = '108000000000000000080800200C417A';
    var base10 = '21932261930451111902915077091070067066';
    var base85 = '4)+k&C#VzJ4br>0wv%Yp';
    console.assert(encodedRebase(base16, 16, 10) === base10);
    console.assert(encodedRebase(base10, 10, 16) === base16);
    console.assert(encodedRebase(base16, 16, 85) === base85);
    console.assert(encodedRebase(base10, 10, 85) === base85);
    console.assert(encodedRebase(base85, 85, 16) === base16);
    console.assert(encodedRebase(base85, 85, 10) === base10);
    return 'All tests passed';
}
