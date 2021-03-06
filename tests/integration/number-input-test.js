import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: NumberInput', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

var testables = [
  {inputString: '123', expectedResult: '123'},
  {inputString: '-123', expectedResult: '-123'},
  {inputString: '123.45', expectedResult: '123.45'},
  {inputString: '-123.45', expectedResult: '-123.45'},
  {inputString: '0.', expectedResult: '0.'},
  {inputString: '0', expectedResult: '0'},
  {inputString: '-', expectedResult: '-'},
  {inputString: '-0', expectedResult: '-0'},
  {inputString: '-0.', expectedResult: '-0.'},
  {inputString: '0.0', expectedResult: '0.0'},
  {inputString: '-0.0', expectedResult: '-0.0'},
  {inputString: '.123', expectedResult:'0.123'},
  {inputString: '-.123', expectedResult: '-0.123'},
  {inputString: '-.', expectedResult: '-0.'},
  {inputString: '.', expectedResult: '0.'},
  {inputString: '123abc', expectedResult: '0'},
  {inputString: '-123abc', expectedResult: '0'},
  {inputString: '123.abc', expectedResult: '0'},
  {inputString: '-123.abc', expectedResult: '0'},
  {inputString: '0.abc', expectedResult: '0'},
  {inputString: '00.123', expectedResult: '0.123'},
  {inputString: '-000.123', expectedResult: '-0.123'},
  {inputString: '00.12ab3', expectedResult: '0'},
  {inputString: '.123.123', expectedResult: '0'},
  {inputString: '.123.', expectedResult:'0'},
  {inputString: '0.123.123', expectedResult: '0'},
  {inputString: '02312', expectedResult: '2312'},
  {inputString: '1.2345678', expectedResult: '1.2346'},
  {inputString: '-1.2345678', expectedResult: '-1.2346'},
  {inputString: '10000', expectedResult: '0'},
  {inputString: '-1000', expectedResult: '0'},
  {inputString: '9999', expectedResult: '9999'},
  {inputString: '-999', expectedResult: '-999'}
  ];
for (let i = 0; i < testables.length; i++) {
  numberInputTest(testables[i].inputString, testables[i].expectedResult);
}
function numberInputTest(inputString, expectedResult) { //JSHint doesn't like functions inside of loops
  test('number-input test: ' + inputString, function(assert) {
    visit('/');
    fillIn('input.number-input__input:first', inputString);
    andThen(function(){
      assert.equal(find('input.number-input__input:first').val(), expectedResult);
    });
  });
}
test('button down', function(assert) {
  visit('/');
  let startNum = find('input.number-input__input:first').val();
  if (!startNum) {
    startNum = 0;
  }
  click('.number-input__button--down');
  andThen(function(){
    assert.equal(find('input.number-input__input:first').val(), (startNum - 1).toString());
  });
});
test('button up', function(assert) {
  visit('/');
  let startNum = find('input.number-input__input:first').val();
  if (!startNum) {
    startNum = 0;
  }
  click('.number-input__button--up');
  andThen(function() {
    assert.equal(find('input.number-input__input:first').val(), (startNum + 1).toString());
  });
});
test('up key', function(assert) {
  visit('/');
  let startNum = find('input.number-input__input:first').val();
  if (!startNum) {
    startNum = 0;
  }
  keyEvent('input.number-input__input:first', 'keydown', 38);
  andThen(function() {
    assert.equal(find('input.number-input__input:first').val(), (startNum + 1).toString());
  });
});
test('down key', function(assert) {
  visit('/');
  let startNum = find('input.number-input__input:first').val();
  if (!startNum) {
    startNum = 0;
  }
  keyEvent('input.number-input__input:first', 'keydown', 40);
  andThen(function() {
    assert.equal(find('input.number-input__input:first').val(), (startNum - 1).toString());
  });
});






