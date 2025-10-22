import is from 'arc-is';
import ArcCheck from "../index.js";

describe('ArcCheck tests', () => {
    let checkIt = new ArcCheck();
    it('Should be the correct types', () => {
        expect(is(checkIt)).toBe('object');
        expect(is(checkIt,true)).toBe('ArcCheck');
    });

    it('Should throw an error if we attempt to add the wrong type of include or exclude', () => {
        expect(() => { checkIt.addInclude('STRING') }).toThrow();
        expect(() => { checkIt.addExclude('STRING') }).toThrow();
    })

    it('Should add a complex set of evaluations, and successfully check against rules', () => {
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

        expect(checkIt.val('.')).toBe(false);
        expect(checkIt.val('..')).toBe(false);
        expect(checkIt.val('.hidden')).toBe(false);
        expect(checkIt.val('file.jpg')).toBe(true);
        expect(checkIt.val('private.key')).toBe(false);
        expect(checkIt.val('_special')).toBe(true);
        expect(checkIt.val('_notSpecial')).toBe(false);
        expect(checkIt.val({})).toBe(false);

        checkIt.reset();
        expect(checkIt.val(false)).toBe(true);
    })
});
