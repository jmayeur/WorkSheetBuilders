var templateMaker;
templateMaker = function () {
    'use strict';

    var getNumber;

    getNumber = function (strNum) {
        var result = null;

        try {
            result = parseInt(strNum);
            if (isNaN(result)) {
                result = null;
            }
        }
        catch (e) {
            console.log(e);
        }

        return result;
    };


    return {

        captureDataAndSubmit: function () {
            var i, topNumRaw, bottomNumRaw, topNum, bottomNum, operator,
                dataSet, sourceForm;

            dataSet = [];

            sourceForm = document.querySelector('#dummyform');

            for (i = 1; i <= 16; i++) {
                topNumRaw = sourceForm.querySelector('#prob_' + i + '_top').value;
                bottomNumRaw = sourceForm.querySelector('#prob_' + i + '_bot').value;
                operator = sourceForm.querySelector('#prob_' + i + '_oper').value;

                topNum = getNumber(topNumRaw);
                bottomNum = getNumber(bottomNumRaw);

                if (null === topNum || null === bottomNum) {
                    alert('Enter valid numbers please!');
                    return false;
                }

                dataSet.push({
                    topNumber: topNum,
                    bottomNumber: bottomNum,
                    operator: operator
                });
            }

            document.querySelector('#problemDataBucket').value = JSON.stringify(dataSet);
            document.querySelector('#dataForm').submit();
        },

        init: function (template, hostElement) {
            var i, clone, fieldset, title, select,
                inputs, top_number_input, bottom_number_input;

            for (i = 1; i <= 16; i++) {
                clone = document.importNode(template.content, true);
                fieldset = clone.querySelector('fieldset');
                title = fieldset.querySelector('legend');
                inputs = fieldset.querySelectorAll('input');
                select = fieldset.querySelector('select');
                top_number_input = inputs[0];
                bottom_number_input = inputs[1];

                title.innerHTML += i.toString();
                select.id = 'prob_' + i + '_oper';
                top_number_input.id = 'prob_' + i + '_top';
                top_number_input.tabIndex = i * 2;
                bottom_number_input.id = 'prob_' + i + '_bot';
                bottom_number_input.tabIndex = i * 2 + 1;

                hostElement.appendChild(clone);
            }
        }
    };

}();


