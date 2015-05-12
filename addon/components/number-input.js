import Ember from 'ember';

export default Ember.Component.extend({
  id: '',
  classNames: ['number-input'],
  classNameBindings: ['hasPrefix', 'hasSuffix'],
  hasPrefix: Ember.computed('prefix', function() {
    if (this.get('prefix') === '') {
      return false;
    } else {
      return true;
    }
  }),
  hasSuffix: Ember.computed('suffix', function() {
    if (this.get('suffix') === '') {
      return false;
    } else {
      return true;
    }
  }),
  value: '0',
  previousValue: '0',
  prefix: '', // for $ % etc
  suffix: '',
  increment: 1,
  maxDecimals: 4,
  max: null,
  min: null,
  cursorPos: '0',
  whitelistKeys: [
    8, 9, // delete, tab
    37,38,39,40, // arrow keys
    48,49,50,51,52,53,54,55,56,57,58, // numbers 0-9
    189,190 // dash, dot
    ],
  ctrlPressed: false,
  cmdPressed: false,
  altPressed: false,
  shiftPressed: false,

  filterInput: Ember.observer('value', function() {
    let obj = this;
    let value = obj.get('value').toString();
    let previousValue = obj.get('previousValue');
    if (!validInput(value)) {
      obj.sendAction('error');
      Ember.run.later(function() {
        obj.set('value', previousValue); //rejected
      });
    } else {
      obj.set('previousValue', value);
      obj.send('formatLeadingZeros');
      obj.send('round');
    }
  }),

  actions: {
    increase: function() {
      this.incrementProperty('value', this.get('increment'));
    },
    decrease: function() {
      this.decrementProperty('value', this.get('increment'));
    },
    setCursor: function(e, pos) {
      Ember.run.later(function(){
        e.target.setSelectionRange(pos, pos);
      });
    },
    formatLeadingZeros: function() { // formats for leading zeros etc.
      let value = this.get('value').toString();
      let negative = false;
      if (value.match(/^-/)) {
        negative = true;
        value = value.substr(1);
      }
      if (value.match(/^\./)) { // add leading zero when appropriate
        value = '0' + value; 
      } else {
        while ( value.match(/^0/) && (!value.match(/^0\./)) && (!value.match(/^0$/)) ) {
          value = value.replace(/^0/, '');
        }
      }
      if (negative) {
        value = '-' + value;
      }
      this.set('value', value);
    },
    round: function() {
      let value = this.get('value').toString();
      let maxDecimals = ( this.get('maxDecimals') );
      let roundingFactor = Math.pow(10, maxDecimals);
      if (value.indexOf('.') !== -1 && (value.split('.')[1].length > maxDecimals)) {
        value = Math.round( (parseFloat(value)*roundingFactor) )/ roundingFactor;
        this.set('value', value.toString());
      }
    }
  },

  keyDown(e) {
    let obj = this;
    let value = obj.get('value').toString();
    let whitelist = this.get('whitelistKeys');
    let maxDecimals = this.get('maxDecimals');
    let cursorPos = null;

    let k = e.keyCode;
    switch(k) {
      case 91: /* cmd/super */
        obj.set('cmdPressed', true);
        break;
      case 18: /* alt/option */
        obj.set('altPressed', true);
        break;
      case 17: /* ctrl */
        obj.set('ctrlPressed', true);
        break;
      case 16: /* shift */
        obj.set('shiftPressed', true);
        break;
    }
    if (!(obj.get('ctrlPressed') || obj.get('cmdPressed') || obj.get('altPressed') || obj.get('shiftPressed')) && // a modifier is not pressed
    (whitelist.indexOf(k) === -1) // if it's not in the whitelist
    ) {
        e.preventDefault();
    } else if ( (value.indexOf('.') !== -1) && (value.split('.')[1].length >= maxDecimals) && ( (value.length - e.target.selectionStart) <= maxDecimals) && ([48,49,50,51,52,53,54,55,56,57,58].indexOf(k) !== -1) ) {
      e.preventDefault(); // prevent typing too many decimals
    } else if ( ([49,50,51,52,53,54,55,56,57,58].indexOf(k) !== -1) && (value.match(/^-0\./) ) && e.target.selectionStart === 2 ) {
      cursorPos = 2; // handle the special case  pressing a number at cursor position 2 on -0.
    } else if ( ([49,50,51,52,53,54,55,56,57,58].indexOf(k) !== -1) && (value.match(/^0\./) ) && e.target.selectionStart === 1 ) {
      cursorPos = 1; // handle the special case pressing a number at position 1 on 0.
    } else { // handle each case individually
    switch(k) {
      case 8: // delete key
        if ( (e.target.selectionStart === 2 && value.match(/^0\../)) || ( (e.target.selectionStart === 3) && ( value.match(/^-0\../) ) ) ) {
          obj.send('setCursor', e, e.target.selectionStart - 2);
        } else if (e.target.selectionStart === 1 && value.match(/^-\./)) {
          cursorPos = 2;
        } else if (e.target.selectionStart === 1 && value.match(/^-/)) {
          cursorPos = 0;
        } else if (e.target.selectionStart === 1 && value.match(/^[1-9]\./)) {
          cursorPos = 1;
        } else if (e.target.selectionStart === 2 && value.match(/^-[1-9]\./)) {
          cursorPos = 2;
        }
        break;
      case 38: // up key
        obj.send('increase');
        obj.send('setCursor', e, e.target.selectionStart);
        obj.$('.number-input__input').focus();
        break;
      case 40: // down key
        obj.send('decrease');
        obj.send('setCursor', e, e.target.selectionStart);
        obj.$('.number-input__input').focus();
        break;
      case 48: // check for leading 0
        if ( (e.target.selectionStart === e.target.selectionEnd) && (
          (e.target.selectionStart === 0 && value !== '') ||
          (e.target.selectionStart === 1 && value.match(/^-/)) ||
          (e.target.selectionStart === 1 && value.match(/^0/)) ||
          (e.target.selectionStart === 2 && value.match(/^-0/)) )
          ) { e.preventDefault(); }
        break;
      case 189: // dash
        if ( (e.target.selectionStart !== 0) || value.match(/^-/) )
          { e.preventDefault(); }
        else if ( value.match(/^\./) ) { cursorPos = 2; } // if the value doesn't have it's leading zero for some reason
        break;
      case 190: // decimal
        if ( (value.indexOf('.') !== -1) || (maxDecimals === 0) ) { // if there is already a decimal or if no decimals are allowed
          e.preventDefault();
        } else { // add leading zero  and move the cursor to the appropriate position if applicable.
          if ( (e.target.selectionStart === 0) || ( (e.target.selectionStart === 1) && ( value.match(/^-/) ) ) ) {
            obj.send('formatLeadingZeros');
            obj.send('setCursor', e, e.target.selectionStart + 2);
          }
        }
        break;
      }
    }
    obj.send('formatLeadingZeros');
    obj.send('round');
    if (cursorPos !== null) { 
      obj.send('setCursor', e, cursorPos);
    }
  },
  keyUp(e) {
    let k = e.keyCode;
    switch(k) {
      case 91: /* cmd/super */
        this.set('cmdPressed', false);
        break;
      case 18: /* alt/option */
        this.set('altPressed', false);
        break;
      case 17: /* ctrl */
        this.set('ctrlPressed', false);
        break;
      case 16: /* shift */
        this.set('shiftPressed', false);
        break;
    }
  }
});
function validInput(value) {
  if ( (!value.match(/^-?(0\.)?[0-9]*\.?\d*$/)) || (value.match(/.*\..*\..*/) /*|| value.match(/^-?00/)*/ )) {
    return false;
  } else {
    return true;
  }
}
