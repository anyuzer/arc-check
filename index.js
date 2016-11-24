"use strict";

var is = require('arc-is');
var ArcArray = require('arc-array');
var ArcObject = require('arc-object');

class ArcCheck{
    constructor(){
        this.reset();
    }

    reset(){
        this.includes = new ArcObject;
        this.excludes = new ArcObject;
        this.iCallbacks = new ArcArray;
        this.xCallbacks = new ArcArray;
    }

    //If the check has any include it will set the includeCheck as a pass
    addInclude(_includeCheck){
        switch(is(_includeCheck)){
            case 'regexp':
                this.includes[_includeCheck.toString()] = _includeCheck;
                break;

            case 'function':
                this.iCallbacks.push(_includeCheck);
                break;

            default: throw new TypeError('Check.addInclude expects valid regexp or function: received '+is(_includeCheck));
        }
        return this;
    }

    //If the check has any exclude it will set the excludeCheck to a fail
    addExclude(_excludeCheck){
        switch(is(_excludeCheck)){
            case 'regexp':
                this.excludes[_excludeCheck.toString()] = _excludeCheck;
                break;

            case 'function':
                this.xCallbacks.push(_excludeCheck);
                break;

            default: throw new TypeError('Check.addExclude expects valid regexp object or function: received '+is(_excludeCheck));
        }
        return this;
    }

    val(_string){
        var includeCheck,excludeCheck,iCallbackCheck,xCallbackCheck;
        includeCheck = true;
        excludeCheck = true;
        iCallbackCheck = true;
        xCallbackCheck = true;

        //If we have inclusion regX we set it to false and check it first
        if(this.includes.count()){
            includeCheck = false;
            if(is(_string) === 'string'){
                this.includes.each(function(_key,_RX){
                    let rxResult = _RX.exec(_string);
                    if(is(rxResult) === 'array' && rxResult[0] !== ''){
                        includeCheck = true;
                        return false;
                    }
                });
            }
        }

        //We will be in 2 states at this point, we will have inclusionCallbacks and we will have not done RegX inclusion checks, or the RegX inclusion checks will have failed. If so, check
        if(this.iCallbacks.length && !this.includes.count() || this.iCallbacks.length && !includeCheck){
            iCallbackCheck = false;
            this.iCallbacks.each(function(_index,_callback){
                if(_callback(_string)){
                    iCallbackCheck = true;
                    includeCheck = true;
                    return false;
                }
            });
        }

        //At this point, either we had no inclusion checks, so by default everything is included and we're just checking exclusion, or we passed our inclusion checks
        if(includeCheck && iCallbackCheck){
            if(this.excludes.count()){
                //Our exclusion check is set to true initially (by default)
                if(is(_string) === 'string'){
                    this.excludes.each(function(_key,_RX){
                        let rxResult = _RX.exec(_string);
                        if(is(rxResult) === 'array' && rxResult[0] !== ''){
                            //If it matches, we want to fail the check (return false)
                            excludeCheck = false;
                            return false;
                        }
                    });
                }
            }

            //Again we have two states, we have exclusionCallbacks and have not done any RegX exclusion checks, or the RegX exclusion checks will have passed and we need to also check against these
            if(this.xCallbacks.length && !this.excludes.count() || this.xCallbacks.length && excludeCheck){
                //Default xCallback check is true
                this.xCallbacks.each(function(_index,_callback){
                    if(_callback(_string)){
                        xCallbackCheck = false;
                        return false;
                    }
                });
            }
        }
        
        return (excludeCheck && includeCheck && iCallbackCheck && xCallbackCheck ? true : false);
    }

    toString(){
        return '[object '+this.constructor.name+']';
    }
}

module.exports = ArcCheck;