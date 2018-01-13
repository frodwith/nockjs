var tap = require('tap');
var noun = require('../noun.js');
var n = noun.dwim;
var NounMap = require('../hamt.js').NounMap;
var m = new NounMap();
var BigInteger = require('jsbn').BigInteger;

tap.plan(2001);

function is(a, b, msg) {
  if ( a.equals(b) ) {
    tap.pass(msg);
    return true;
  }
  else {
    tap.fail(msg);
    tap.comment("got:      " + JSON.stringify(b));
    tap.comment("expected: " + JSON.stringify(a));
    return false;
  }
}

function randomAtom() {
  var c, i, bytes = Math.floor(Math.random() * 4) + 1;
  var c = new BigInteger();
  var d = new BigInteger();
  c.fromInt(0);
  for ( i = 0; i < bytes; ++i ) {
    d.fromInt(Math.floor(Math.random() * 0xff));
    c = c.shiftLeft(8);
    c = c.xor(d);
  }
  return new noun.Atom.Atom(c);
}

function randomCell() {
  return new noun.Cell(randomNoun(), randomNoun());
}

function randomNoun() {
  if (Math.random() > 0.5) {
    return randomAtom();
  }
  else {
    return randomCell();
  }
}

m.insert(n(42), n(0));
is(m.get(n(42)), n(0), "42->0");

for ( var i = 0; i < 1000; ++i ) {
  var key = randomNoun();
  var one = randomNoun();
  var two = randomNoun();
  m.insert(key, one);
  var got = m.get(key);
  if ( null == got ) {
    tap.fail(i+"1");
    tap.comment(JSON.stringify(key));
    break;
  }
  else if ( !is(got, one, i+"1") ) {
    break;
  }
  m.insert(key, two);
  got = m.get(key);
  if ( null == got ) {
    tap.fail(i+"2");
    tap.comment(JSON.stringify(key));
    break;
  }
  else if ( !is(got, two, i+"2") ) {
    break;
  }
}

module.exports = {
  foo: randomNoun
}
