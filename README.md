# arc-check [![Build Status](https://travis-ci.org/anyuzer/arc-check.svg?branch=master)](https://travis-ci.org/anyuzer/arc-check)
An ES6 class to evaluate values against multiple complex inclusion/exclusion rules.

## Install
```
$ npm install arc-check --save
```

## Features
* Regular expression inclusion matching
* Regular expression exclusion matching
* Callback inclusion matching
* Callback exclusion matching
* Handles any combination of inclusion/exclusion
* Simple API

## Basic Usage
The following creates a new Check object, then evaluates variables against it.
The example collection should evaluate as follows:
* `'a' is true`
* `'b' is true`
* `'copy' is true`
* `'duck9' is false`
* `'Private' is false`
* `99 is false`
* `undefined is false`


```js
//Example
var ArcCheck = require('arc-check');
let check = new ArcCheck();

//Add some logic
check.addInclude(/^[A-Za-z]*$/);
check.addExclude(/^Private$/);

//A sample array
let collection = ['a','b','copy','duck9','Private',99,undefined];

//Evaluate
for(let i=0;i<collection.length;i++){
    check.val(collection[i]);
}
```

## Behavior & Advanced Usage
ArcCheck handles multiple evaluation states in order to either return true or false on a value. To be effectively used, it is important to understand its expected behavior and how evaluations are made.

The concept is simple and can best be described as follows: To evaluate as true a value **MUST** match **ANY** inclusion check **AND MUST NOT** match **ANY** exclusion check.

Inclusions and exclusions are always evaluated by truthiness and can be any number/combination of RegularExpression or callbacks.

By default, all states begin as passed. So in this way, if no inclusions checks are added, all values will be assumed to be wanted, and only fail if an exclusion is matched. Vice versa, if no exclusions are set, a value will only pass if an inclusion is matched. If neither inclusion, nor exclusion is set, all values will pass.

```js
//Example
var ArcCheck = require('arc-check');
let check = new ArcCheck();

//Will be true (nothing has been set, so by default it matches all of the inclusions and has not matched any exclusions)
check.val(false);

//We add an inclusion regular expression to check for .jpg
check.addInclude(/\.jpg$/);

//Will evaluate to true (as it matches the above inclusion)
check.val('pic.jpg');

//But this will evaluate to false as it doesn't match any inclusion.
check.val('config.yml');

//If we wanted to add yml we can easily stack the inclusions by adding another
check.addInclude(/\.yml$/);

//Now this will evaluate to true
check.val('config.yml');

//But so will this
check.val('.travis.yml');

//Perhaps we don't want 'hidden' files, so we add an exclude
check.addExclude(/^\./);

//Now this will evaluate to false
check.val('.travis.yml');

//But there are times when perhaps the filter is set dynamically, say based on a user's config, so we can use a callback
check.addExclude(function(_val){
    //Callbacks are expected to return true/false, and both inclusion and exclusion callbacks are expected to return true on a match, and false on a non match
    return (_val === SOME_USER_CHECK ? true : false);
});

//Finally, if needed the Check can be reset to a default state for reuse.
check.reset();

```

## API

### new ArcCheck()
Create a new `ArcCheck` object. Requires `new`

### .addInclude(inclusion:RegExp or Function)
Add an inclusion check. Valid types are a `RegExp` object or a callback `Function` that returns `true/false`

```js
//Example of addInclude
var check = new ArcCheck();
check.addInclude('/^[a-z]*$/');
```

### .addExclude(exclusion:RegExp or Function)

Add an exclusion check. Valid types are a `RegExp` object or a callback `Function` that returns `true/false`
```js
//Example of addExclude
var check = new ArcCheck();
check.addExclude('/^[a-z]*$/');
```

### .val(value:Mixed)
Evaluate a value based on the inclusion/exclusion logic checks.
```js
//Example of val
var check = new ArcCheck();

//Set logic
check.addInclude('/^[a-zA-Z0-9\.]*$/');
check.addExclude(function(_val){
    return (_val === 'private.key' ? true : false);
});

//Evaluate
check.val('private.key'); //False
check.val('key.private'); //True
```

### .reset()
Set Check back to default state (remove all set logic)

## Testing
```
$ npm test
```