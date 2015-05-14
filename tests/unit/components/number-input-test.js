import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('number-input', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('test test', function(assert) {
  var component = this.subject();
  component.set('value', '123');
  assert.equal(component.get('value'), '123');
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
  test('component test: ' + inputString, function(assert) {
    let component = this.subject();
    component.set('value', inputString);
    setTimeout(function() {
      assert.equal(component.get('value'), expectedResult);
    });
  });
}

test('increment up', function(assert) {
  var component = this.subject();
  component.set('value', '123');
  component.set('increment', 25);
  component.send('increase');
  assert.equal(component.get('value'), '148');
});
test('increment down', function(assert) {
  var component = this.subject();
  component.set('value', '123');
  component.set('increment', 25);
  component.send('decrease');
  assert.equal(component.get('value'), '98');
});

let roundingTests = [
  {inputString: '1.2345678', maxDecimals: 4, expectedResult: '1.2346'},
  {inputString: '-1.2345678', maxDecimals: 4, expectedResult: '-1.2346'},
  {inputString: '1.2345678', maxDecimals: 2, expectedResult: '1.23'},
  {inputString: '-1.2345678', maxDecimals: 2, expectedResult: '-1.23'},
  {inputString: '1.2345678', maxDecimals: 1, expectedResult: '1.2'},
  {inputString: '-1.2345678', maxDecimals: 1, expectedResult: '-1.2'},
  {inputString: '1.9999', maxDecimals: 4, expectedResult: '1.9999'},
  {inputString: '-1.9999', maxDecimals: 4, expectedResult: '-1.9999'},
  {inputString: '1.99999', maxDecimals: 4, expectedResult: '2'},
  {inputString: '-1.99999', maxDecimals: 4, expectedResult: '-2'},
  {inputString: '1.12345678', maxDecimals: 8, expectedResult: '1.12345678'},
  {inputString: '-1.12345678', maxDecimals: 8, expectedResult: '-1.12345678'},
  {inputString: '1.123456781', maxDecimals: 8, expectedResult: '1.12345678'},
  {inputString: '-1.123456781', maxDecimals: 8, expectedResult: '-1.12345678'},
  {inputString: '123.128644434444999', maxDecimals: 4, expectedResult: '123.1286'}
];
for (let i = 0; i < roundingTests.length; i ++) {
  numberInputRoundingTest(roundingTests[i].inputString, roundingTests[i].expectedResult, roundingTests[i].maxDecimals);
}
function numberInputRoundingTest(inputString, expectedResult, maxDecimals){
  test('component test, rounding: ' + inputString, function(assert) {
    let component = this.subject();
    component.set('maxDecimals', maxDecimals);
    component.set('value', inputString);
    setTimeout(function(){
      assert.equal(component.get('value'), expectedResult);
    });
  });
}