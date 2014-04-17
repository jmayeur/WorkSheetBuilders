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
        };

    var getRawWords, setWordCount,
        wordBoxBuilder, wordCount, wordDefinitions,
        manageWordDefinitions, checkWordLayout;

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

    wordBoxBuilder = function (word, parentEl) {
        var template, box, exampleSlot,
            workspaceSlot, clone, finalWord;

        finalWord = (word || '').trim();
        template = document.querySelector('#miniWordTemplate');
        clone = document.importNode(template.content, true);
        box = clone.querySelector('div');

        exampleSlot = box.querySelector('.miniExample');
        workspaceSlot = box.querySelector('.miniWorkspace');
        exampleSlot.innerText = finalWord;


        workspaceSlot.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        parentEl.appendChild(clone);
        return parentEl.children[parentEl.children.length - 1];
    };

    checkWordLayout = function (word, template) {
        var exampleText, finalFontSize;

        finalFontSize = 18;
        exampleText = template.querySelector('.miniExample');
        workspaceText = template.querySelector('.miniWorkspace');
        fontSize = (exampleText.style.fontSize) ? parseInt(exampleText.style.fontSize.replace('pt', '')) : 18;

        if (exampleText) {
            exampleText.innerText = word;
            if (exampleText.offsetWidth >= 64 && fontSize > 6) {
                var fontSize, workspaceText;


                while (exampleText.offsetWidth >= 64) {
                    fontSize--;
                    finalFontSize = fontSize;
                    exampleText.style.fontSize = fontSize + 'pt';
                    workspaceText.style.fontSize = fontSize + 'pt';
                    if (fontSize < 6) {
                        break;
                    }
                }

                while (workspaceText.offsetWidth < 64) {
                    workspaceText.innerHTML += '&nbsp;';
                }
            }
            else if (fontSize < 18 && exampleText.offsetWidth < 64) {
                while (exampleText.offsetWidth < 64) {

                    fontSize++;
                    finalFontSize = fontSize;
                    exampleText.style.fontSize = fontSize + 'pt';
                    workspaceText.style.fontSize = fontSize + 'pt';
                    console.log(fontSize);
                    if (fontSize > 17) {
                        break;
                    }
                }

                while (workspaceText.offsetWidth > 64) {
                    workspaceText.innerHTML = workspaceText.innerHTML.substr(0, workspaceText.innerHTML.length - 6);
                }
            }
        }

        return finalFontSize;
    };

    manageWordDefinitions = function (rawWords, hostElement) {
        var i, l, word;

        for (i = 0, l = rawWords.length; i < l; i++) {
            word = rawWords[i];

            if (wordDefinitions.length > i) {
                if (wordDefinitions[i].text !== word) {
                    var newFontSize = checkWordLayout(word, wordDefinitions[i].wordTemplate);
                    wordDefinitions[i].text = word;
                    wordDefinitions[i].fontSize = newFontSize;
                }
            }
            else {
                var wordTemplate;

                wordTemplate = wordBoxBuilder(rawWords[i], hostElement);
                var fontSize = checkWordLayout(word, wordTemplate);
                wordDefinitions.push({
                    number: i,
                    wordTemplate: wordTemplate,
                    text: word,
                    fontSize: fontSize
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
        keyUpHandler: function () {
            var rawWords;
            rawWords = getRawWords(document.getElementById('wordlist'));
            manageWordDefinitions(rawWords, document.getElementById('mockup'));
            setWordCount(rawWords.length);
        },

        keyDownHandler: function () {
            var result;

            result = true;
            if (wordCount === 16 && event.keyCode === COMMA_KEY_CODE) {
                event.preventDefault();
            }
            else if (wordCount > 16) {
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
                    fontSize: data.fontSize * 2
                })
            });

            dataField.value = JSON.stringify(wordData);
            formToSend.submit();
        }
    }
}();

