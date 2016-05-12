"use strict";

var is = require('arc-is');
var ArcArray = require('arc-array');
var ArcObject = require('arc-object');

class Check{
    constructor(){
        this.includes = new ArcObject;
        this.excludes = new ArcObject;
        this.iCallbacks = new ArcArray;
        this.xCallbacks = new ArcArray;
    }

    //If the check has any include it will set the includeCheck as a pass
    addInclude(_includeCheck){
        switch(is(_includeCheck)){
            case 'regExp':
                this.includes[_includeCheck.toString()] = _includeCheck;
                break;

            case 'function':
                this.iCallbacks.push(_includeCheck);
                break;

            default:
                throw new TypeError('Check.addInclude expects valid RegExp or Function');
                break;
        }
        return this;
    }

    //If the check has any exclude it will set the excludeCheck to a fail
    addExclude(_excludeCheck){
        switch(is(_excludeCheck)){
            case 'regExp':
                this.excludes[_excludeCheck.toString()] = _excludeCheck;
                break;

            case 'function':
                this.xCallbacks.push(_excludeCheck);
                break;

            default:
                throw new TypeError('Filter.addInclude expects valid RegExp object');
                break;
        }
        return this;
    }

    val(_string){
        var includeCheck,excludeCheck,iCallbackCheck,xCallbackCheck;
        includeCheck = true;
        excludeCheck = true;
        iCallbackCheck = true;
        xCallbackCheck = true;

        if(this.includes.count()){
            includeCheck = false;
            this.includes.each(function(_key,_RX,_break){
                if(_RX.exec(_string)[0] !== ''){
                    includeCheck = true;
                    _break();
                }
            });
        }

        if(this.excludes.count()){
            excludeCheck = false;
            this.excludes.each(function(_key,_RX,_break){
                if(_RX.exec(_string)[0] !== ''){
                    excludeCheck = true;
                    _break();
                }
            });
        }

        if(this.iCallbacks.length){
            iCallbackCheck = false;
            this.iCallbacks.each(function(_callback,_key,_break){
                if(_callback(_string)){
                    iCallbackCheck = true;
                    _break();
                }
            });
        }

        if(this.xCallbacks.length){
            xCallbackCheck = true;
            this.xCallbacks.each(function(_callback,_key,_break){
                if(_callback(_string)){
                    xCallbackCheck = false;
                    _break();
                }
            });
        }
        return (excludeCheck && includeCheck && iCallbackCheck && xCallbackCheck ? true : false);
    }

    toString(){
        return '[object '+this.constructor.name+']';
    }
}

module.exports = Check;