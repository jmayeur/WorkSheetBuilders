var templateManager = (function () {
    'use strict';

    var mathBoxBuilder, parseParams, getSearchParameters, getRequestProblemList;

    mathBoxBuilder = function (topNumber, bottomNumber, operator, parentEl) {
        var template, box, topNumberSlot, bottomOperatorSlot,
            bottomNumberSlot, clone;


        template = document.querySelector('#mathProblemTemplate');
        box = template.content.querySelector('.problem');
        topNumberSlot = box.querySelector('.top > .number');
        bottomOperatorSlot = box.querySelector('.bottom > .operator');
        bottomNumberSlot = box.querySelector('.bottom > .number');

        topNumberSlot.innerText = topNumber;
        bottomOperatorSlot.innerHTML = operator;
        bottomNumberSlot.innerText = bottomNumber;


        clone = document.importNode(template.content, true);
        parentEl.appendChild(clone);
    };

    parseParams = function (rawParamString) {

        var params, paramArr, i, l;
        params = {};

        if (rawParamString && rawParamString.length > 0) {
            paramArr = rawParamString.split("&");
            for (i = 0, l = paramArr.length; i < l; i++) {
                var tuple = paramArr[i].split("=");
                params[tuple[0]] = decodeURIComponent(tuple[1]);
            }
        }
        return params;
    };

    getSearchParameters = function () {
        var params;
        params = window.location.search.substr(1);
        return parseParams(params);
    };



    return {

        SYMBOL: {
            DIVIDE: '&divide;',
            TIMES: '&times;',
            MINUS: '&minus;',
            PLUS: '&#43;'
        },

        init: function (problemDataset, hostElement) {
            if(problemDataset && problemDataset.length > 0){
                problemDataset.forEach(function(problemData){
                    mathBoxBuilder(problemData.topNumber, problemData.bottomNumber, problemData.operator, hostElement);
                });
            }
        },

        getRequestProblemList: function () {
            var params = getSearchParameters();
            if (params['problemData']) {
                return JSON.parse(params['problemData']);
            }
            return null;
        },

        getSimpleProblemDataSet: function(topNumber, operator){
            var result, i;

            result = [];
            for(i=1;i<=16;i++){
                result.push({
                    topNumber: topNumber,
                    bottomNumber: i,
                    operator: operator
                });
            }

            return result;
        }
    };
}());

