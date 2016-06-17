var tap = require('tap');
var Check = require('../');
var is = require('arc-is');

tap.test('Check',function(_test){
    let checkIt = new Check();

    //Our typeChecking
    _test.equal(is(checkIt),'object');
    _test.equal(is(checkIt,true),'ArcCheck');

    //We only accept regExp or function
    _test.throws(function(){
        checkIt.addInclude('STRING');
    },TypeError);

    //We only accept regExp or function
    _test.throws(function(){
        checkIt.addExclude('STRING');
    },TypeError);

    //Example of creating a dynamic check against faux directory contents
    checkIt.addInclude(/\.[a-zA-Z0-9]*$/); //Include loose file format, basically '.*'
    checkIt.addInclude(function(_check){   //Also include a special match if it's '_special'
        return (_check === '_special' ? true :false);
    });
    checkIt.addExclude(/^\./); //Remove anything starting with '.'
    checkIt.addExclude(/^\.\./); //Remove anything starting with '..'

    //Remove anything matching private.key
    checkIt.addExclude(function(_check){
        return (_check === 'private.key' ? true : false);
    });

    //check '.' should not pass
    _test.equal(checkIt.val('.'),false);

    //check '..' should not pass
    _test.equal(checkIt.val('..'),false);

    //check '.hidden' should not pass
    _test.equal(checkIt.val('.hidden'),false);

    //check 'file.jpg' should pass
    _test.equal(checkIt.val('file.jpg'),true);

    //check 'private.key' should not pass
    _test.equal(checkIt.val('private.key'),false);

    //check '_special' should pass
    _test.equal(checkIt.val('_special'),true);

    //check '_notSpecial' should not pass
    _test.equal(checkIt.val('_notSpecial'),false);

    //Non string, will fail the regExs immediately, and then fail to be approved by the callbacks
    _test.equal(checkIt.val({}),false);

    //Reset it
    checkIt.reset();
    _test.equal(checkIt.val(false),true); //When nothing is set, all values evaluate as true

    _test.end();
});