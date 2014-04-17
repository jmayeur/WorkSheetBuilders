var templateMaker;
templateMaker = function () {
    'use strict';

    var DEL_KEY_CODES = {
            BACKSPACE: 8,
            DELETE: 46
        },

        COMMA_KEY_CODE = 188,

        NAV_KEY_CODES = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        },

        DIMENSION_SETS = {
            QUARTER: {
                boxWidth: 64,
                wordCount: 16
            },
            THIRD: {
                boxWidth: 85.33,
                wordCount: 12
            },
            HALF: {
                boxWidth: 128,
                wordCount: 8
            },
            FULL: {
                boxWidth: 256,
                wordCount: 4
            }

        };

    var getRawWords, setWordCount,
        wordBoxBuilder, wordCount, wordDefinitions,
        manageWordDefinitions, checkWordLayout, currentDimensionSet;

    currentDimensionSet = DIMENSION_SETS.QUARTER,

    wordDefinitions = [];

    getRawWords = function (inputElement) {
        var wordListText, rawWords, finalWords, i, l;
        wordListText = inputElement.value;
        rawWords = wordListText.split(',');
        finalWords = [];

        for (i = 0, l = rawWords.length; i < l; i++) {
            var tempWord = rawWords[i].trim();
            if (tempWord.length > 0) {
                finalWords.push(tempWord);
            }
        }

        return finalWords;
    };

    setWordCount = function (count) {
        wordCount = count;
        document.getElementById('count').innerText = wordCount.toString();
    };

    wordBoxBuilder = function (word, width, parentEl) {
        var template, box, exampleSlot,
            workspaceSlot, clone, finalWord;

        finalWord = (word || '').trim();
        template = document.querySelector('#miniWordTemplate');
        clone = document.importNode(template.content, true);
        box = clone.querySelector('div');
        box.style.width = width + 'px';

        exampleSlot = box.querySelector('.example');
        workspaceSlot = box.querySelector('.workspace');
        exampleSlot.innerText = finalWord;


        workspaceSlot.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        parentEl.appendChild(clone);
        return parentEl.children[parentEl.children.length - 1];
    };

    checkWordLayout = function (word, width, template) {
        var exampleText, finalFontSize, currentBoxWidth;

        finalFontSize = 18;
        exampleText = template.querySelector('.example');
        workspaceText = template.querySelector('.workspace');
        fontSize = (exampleText.style.fontSize) ? parseInt(exampleText.style.fontSize.replace('pt', '')) : 18;
        currentBoxWidth = parseInt(template.style.width.replace('px',''));

        if (currentBoxWidth !== width){
            template.style.width = width + 'px';
        }

        if (exampleText) {
            exampleText.innerText = word;
            if (exampleText.offsetWidth >= width && fontSize > 6) {
                var fontSize, workspaceText;


                while (exampleText.offsetWidth >= width) {
                    fontSize--;
                    finalFontSize = fontSize;
                    exampleText.style.fontSize = fontSize + 'pt';
                    workspaceText.style.fontSize = fontSize + 'pt';
                    if (fontSize < 6) {
                        break;
                    }
                }


            }
            else if (fontSize < 18 && exampleText.offsetWidth < width) {
                while (exampleText.offsetWidth < width) {

                    fontSize++;
                    finalFontSize = fontSize;
                    exampleText.style.fontSize = fontSize + 'pt';
                    workspaceText.style.fontSize = fontSize + 'pt';
                    if (fontSize > 17) {
                        break;
                    }
                }


            }
        }

        if (workspaceText.offsetWidth < width) {
            while (workspaceText.offsetWidth < width) {
                workspaceText.innerHTML += '&nbsp;';
            }
        } else if (workspaceText.offsetWidth > width) {
            while (workspaceText.offsetWidth > width) {
                workspaceText.innerHTML = workspaceText.innerHTML.substr(0, workspaceText.innerHTML.length - 6);
            }
        }

        return finalFontSize;
    };

    manageWordDefinitions = function (rawWords, dimensionSet, hostElement) {
        var i, l, word;

        for (i = 0, l = rawWords.length; i < l; i++) {
            word = rawWords[i];

            if (wordDefinitions.length > i) {
                if (wordDefinitions[i].text !== word || wordDefinitions.boxWidth !== dimensionSet.boxWidth) {
                    var newFontSize = checkWordLayout(word, dimensionSet.boxWidth, wordDefinitions[i].wordTemplate);
                    wordDefinitions[i].text = word;
                    wordDefinitions[i].fontSize = newFontSize;
                    wordDefinitions[i].boxWidth = dimensionSet.boxWidth;
                }
            }
            else {
                var wordTemplate;

                wordTemplate = wordBoxBuilder(rawWords[i], dimensionSet.boxWidth, hostElement);
                var fontSize = checkWordLayout(word, dimensionSet.boxWidth, wordTemplate);
                wordDefinitions.push({
                    number: i,
                    wordTemplate: wordTemplate,
                    text: word,
                    fontSize: fontSize,
                    boxWidth: dimensionSet.boxWidth
                });

            }
        }
        while (wordDefinitions.length > rawWords.length) {
            var def;
            def = wordDefinitions.pop();

            hostElement.removeChild(def.wordTemplate);
        }

    };

    return {


        setColumns: function(columns){
            var maxWordCountElement

            maxWordCountElement = document.getElementById('maxWordCount');

            switch(columns){
                case 4:
                    currentDimensionSet = DIMENSION_SETS.QUARTER;
                    maxWordCountElement.innerHTML = '16';
                    break;
                case 3:
                    currentDimensionSet = DIMENSION_SETS.THIRD;
                    maxWordCountElement.innerHTML = '12';
                    break;
                case 2:
                    currentDimensionSet = DIMENSION_SETS.HALF;
                    maxWordCountElement.innerHTML = '8';
                    break;
                case 1:
                    currentDimensionSet = DIMENSION_SETS.FULL;
                    maxWordCountElement.innerHTML = '4';
                    break;
            }

            var rawWords;
            rawWords = getRawWords(document.getElementById('wordlist'));
            manageWordDefinitions(rawWords, currentDimensionSet, document.getElementById('mockup'));
            setWordCount(rawWords.length);
        },

        keyUpHandler: function () {
            var rawWords;
            rawWords = getRawWords(document.getElementById('wordlist'));
            manageWordDefinitions(rawWords, currentDimensionSet, document.getElementById('mockup'));
            setWordCount(rawWords.length);
        },

        keyDownHandler: function () {
            var result;

            result = true;
            if (wordCount === currentDimensionSet.wordCount && event.keyCode === COMMA_KEY_CODE) {
                event.preventDefault();
            }
            else if (wordCount > currentDimensionSet.wordCount) {
                //noinspection FallThroughInSwitchStatementJS
                switch (event.keyCode) {
                    case DEL_KEY_CODES.BACKSPACE:
                    case DEL_KEY_CODES.DELETE:
                    case NAV_KEY_CODES.UP:
                    case NAV_KEY_CODES.DOWN:
                    case NAV_KEY_CODES.LEFT:
                    case NAV_KEY_CODES.RIGHT:
                        result = true;
                    default:
                        event.preventDefault();
                        result = false
                }
            }
            return result;
        },

        captureDataAndSubmit: function () {
            var formToSend, dataField, wordData;
            formToSend = document.getElementById('backingForm');
            dataField = document.getElementById('wordDataBucket');
            wordData = [];

            wordDefinitions.forEach(function (data) {
                wordData.push({
                    text: data.text,
                    fontSize: data.fontSize * 2,
                    boxWidth: data.boxWidth * 2
                })
            });

            dataField.value = JSON.stringify(wordData);
            formToSend.submit();
        }
    }
}();

