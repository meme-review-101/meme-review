import ClapDetector from './ClapDetector.js'

const highAmpThreshold = 0.5
const minHighAmpCount = 20
const minZeroCrossingsCount = 75
const maxZeroCrossingsCount = 999
const maxRange = 300

const clapDetector = new ClapDetector(
    highAmpThreshold,
    minHighAmpCount,
    minZeroCrossingsCount,
    maxZeroCrossingsCount,
    maxRange
)

d3.select('#waveform')
    .select('.highAmpThreshold')
    .attr('y1', 100 - highAmpThreshold * 100)
    .attr('y2', 100 - highAmpThreshold * 100)

document.bgColor =
    'rgb(' +
    Math.random() * 255 +
    ',' +
    Math.random() * 255 +
    ',' +
    Math.random() * 255 +
    ')'
clapDetector.onClap(() => {
    document.bgColor =
        'rgb(' +
        Math.random() * 255 +
        ',' +
        Math.random() * 255 +
        ',' +
        Math.random() * 255 +
        ')'
    if (!document.querySelector('iframe')) {
        const ifrm = document.createElement('iframe')
        ifrm.setAttribute('src', 'https://youtu.be/c_HxPvyG2_Q?autoplay=1')
        ifrm.style.width = '100%'
        ifrm.style.height = '100%'
        document.body.appendChild(ifrm)
    }
})

clapDetector.onData(data => {
    const zeroCrossings = []
    for (let i = 1; i < data.length; i++) {
        if (
            (data[i] > 0 && data[i - 1] < 0) ||
            (data[i] < 0 && data[i - 1] > 0)
        )
            zeroCrossings.push(i)
    }

    const circle = d3
        .select('#waveform')
        .selectAll('circle')
        .data(data)
    circle
        .enter()
        .append('circle')
        .attr('cx', (d, i) => i / 2)
        .attr('cy', d => d * 100 + 100)
        .attr('r', 2)
    circle.exit().remove()
    circle
        .attr('cx', (d, i) => i / 2)
        .attr('cy', d => d * 100 + 100)
        .attr('r', (d, i) => (zeroCrossings.indexOf(i) > -1 ? 3 : 1))
        .attr('fill', (d, i) =>
            zeroCrossings.indexOf(i) > -1 ? '#0F0' : '#FFF'
        )
})
