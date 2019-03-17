function debug() {
    const div = document.createElement('div')
    document.querySelector('body').appendChild(div)
    div.outerHTML = `
        <div id="waveform-container"> 
            <svg id="waveform">
                <rect class="border" x="0" y="0" width="100%" height="100%"></rect>
                <line class="highAmpThreshold" x1="0" x2="100%" y1="0" y2="0"></line>
            </svg>
        </div>
    `
    return 'Debug active'
}
