var templateManager = (function () {
    'use strict';

    var defaultWordList, parseParams, getSearchParameters,
        getRequestWordList, wordBoxBuilder;

    defaultWordList = [
        { text: 'Happy', fontSize: 36, boxWidth: 64 },
        { text: 'Much', fontSize: 36, boxWidth: 64 },
        { text: 'Quickly', fontSize: 36, boxWidth: 64 },
        { text: 'Tired', fontSize: 36, boxWidth: 64 },
        { text: 'Work', fontSize: 36, boxWidth: 64 },
        { text: 'Show', fontSize: 36, boxWidth: 64 },
        { text: 'Really', fontSize: 36, boxWidth: 64 },
        { text: 'Snow', fontSize: 36, boxWidth: 64 },
        { text: 'Calm', fontSize: 36, boxWidth: 64 },
        { text: 'Bird', fontSize: 36, boxWidth: 64 },
        { text: 'Walk', fontSize: 36, boxWidth: 64 },
        { text: 'Small', fontSize: 36, boxWidth: 64 },
        { text: 'Dry', fontSize: 36, boxWidth: 64 },
        { text: 'Make', fontSize: 36, boxWidth: 64 },
        { text: 'List', fontSize: 36, boxWidth: 64 },
        { text: 'Jump', fontSize: 36, boxWidth: 64 }
    ];

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

    getRequestWordList = function () {
        var params = getSearchParameters();
        if (params['wordData']) {
            return JSON.parse(params['wordData']);
        }
        return null;
    };

    wordBoxBuilder = function (wordData, parentEl) {
        var template, box, paddingDiv, exampleSlot,
            workspaceSlot, clone, tries;

        if (wordData && wordData.text && wordData.text.length > 0) {
            template = document.querySelector('#wordTemplate');
            clone = document.importNode(template.content, true);
            box = clone.querySelector('div');
            box.style.width = wordData.boxWidth + 'px';
            paddingDiv = box.querySelector('.padding');
            exampleSlot = box.querySelector('.example');
            workspaceSlot = box.querySelector('.workspace');
            exampleSlot.innerText =  wordData.text;
            paddingDiv.style.height = (30 + ((36 - wordData.fontSize) * 2)) + 'px';
            exampleSlot.style.fontSize = wordData.fontSize + 'pt';
            workspaceSlot.style.fontSize = wordData.fontSize + 'pt';
            workspaceSlot.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

            parentEl.appendChild(clone);

            tries = 0;
            while (workspaceSlot.offsetWidth < 90) {
                tries++;
                workspaceSlot.innerHTML += '&nbsp;';
                if (tries > 50) {
                    break;
                }
            }
        }
    };

    return {
        init: function (hostElement) {
            var wordList, i, l;

            wordList = getRequestWordList() || defaultWordList;

            for (i = 0, l = wordList.length; i < l; i++) {
                wordBoxBuilder(wordList[i], hostElement);
            }
        }
    };
}());











