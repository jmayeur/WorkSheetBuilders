(function(){
    'use strict'

    var currentLine, totalLines, hr;

    for(currentLine=0, totalLines=11; currentLine<=totalLines; currentLine++){
        hr = document.createElement('hr');
        hr.className = 'line';
        hr.style.top = (90 + (currentLine * 53)) + 'px';
        document.body.appendChild(hr);

        hr = document.createElement('hr');
        hr.className = 'dash';
        hr.style.top = (102 + (currentLine * 53)) + 'px';
        document.body.appendChild(hr);

        hr = document.createElement('hr');
        hr.className = 'line';
        hr.style.top = (120 + (currentLine * 53)) + 'px';
        document.body.appendChild(hr);

    }


}());