import ClapDetector from './ClapDetector.js'

const highAmpThreshold = 0.4
const minHighAmpCount = 20
const minZeroCrossingsCount = 0
const maxZeroCrossingsCount = 999
const maxRange = 400

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

const changeColor = () => {
    document.querySelector('#barrier').style.backgroundColor =
        'rgb(' +
        Math.random() * 255 +
        ',' +
        Math.random() * 255 +
        ',' +
        Math.random() * 255 +
        ')'
}

changeColor()

let secondClapTime = false
let secondClapComplete = false

document.querySelector('#barrier').style.visibility = 'visible'
clapDetector.onClap(() => {
    if (secondClapComplete || !playerReady) return
    console.log('CLAP!')
    changeColor()

    const container = document.querySelector('.container')

    if (!secondClapTime && !secondClapComplete) {
        container.innerHTML = '<p class="clap">👏</p>'
        secondClapTime = true
        setTimeout(() => {
            secondClapTime = false
            if (!secondClapComplete)
                container.innerHTML = ''
        }, 600)
        return
    }
    secondClapComplete = true
    container.innerHTML = '<p class="clap">👏👏</p>'

    if (player) {
        player.mute()
        player.playVideo()
    }
    setTimeout(() => {
        console.log('MEME REVIEW')
        changeColor()
        container.innerHTML = '<p class="title">MEME REVIEW</p>'
        if (player)
            player.unMute()

        document.querySelector('#barrier').style.visibility = 'hidden'
        setTimeout(() => {
            secondClapComplete = false
            container.innerHTML = ''
            document.querySelector('#barrier').style.visibility = 'visible'
            if (player) {
                player.seekTo(2.9, true)
                player.pauseVideo()
            }
        }, 1000)
    }, 500)
    return
    // if (!document.querySelector('iframe')) {
    //     const ifrm = document.createElement('iframe')
    //     ifrm.setAttribute('src', 'https://youtu.be/c_HxPvyG2_Q?autoplay=1')
    //     ifrm.style.width = '100%'
    //     ifrm.style.height = '100%'
    //     document.body.appendChild(ifrm)
    // }

    /*var tag = document.createElement('script');
    tag.id = "iframe-demo";
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var ytplayer;
    function onYouTubeIframeAPIReady() {
        ytplayer = new YT.Player('meme-review', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }*/

    //window.location = "https://www.youtube.com/embed/HUYjNWei4Ok?autoplay=1&loop=1&playlist=HUYjNWei4Ok"
    //window.location = "https://www.youtube.com/embed/HUYjNWei4Ok?autoplay=1&loop=1&list=RD1A_f5wxAIwE&t=8"
    window.location = "https://www.youtube.com/embed/HUYjNWei4Ok?autoplay=1&loop=1&list=PLOs8TpWyCPQFpcR0UkGVdEcItgNmaxvht"
    //window.location = "https://www.youtube.com/watch?v=t4pkol6oKEM"

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
