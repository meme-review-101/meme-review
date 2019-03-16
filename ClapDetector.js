import { std } from './util.js'
export default class ClapDetector {
    constructor(
        highAmpThreshold,
        minHighAmpCount,
        minZeroCrossings,
        maxZeroCrossings,
        maxRange
    ) {
        this.lastClap = new Date().getTime()
        this.highAmpThreshold = highAmpThreshold
        this.minHighAmpCount = minHighAmpCount
        this.minZeroCrossings = minZeroCrossings
        this.maxZeroCrossings = maxZeroCrossings
        this.maxRange = maxRange
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(stream => {
                this.context = new AudioContext()
                this.volume = this.context.createGain()
                this.source = this.context.createMediaStreamSource(stream)
                this.source.connect(this.volume)
                this.processor = this.context.createScriptProcessor(1024, 1, 1)

                this.volume.connect(this.processor)
                this.processor.connect(this.context.destination)

                this.processor.onaudioprocess = e => {
                    const left = e.inputBuffer.getChannelData(0)
                    if (this.dataCallback) this.dataCallback(left)
                    const clapData = this.detectClap(left)
                    if (clapData) {
                        console.log('CLAP!', clapData)
                        if (this.clapCallback) this.clapCallback()
                    }
                }
            })
            .catch(e => console.log(e))
    }

    // From: https://gist.github.com/pachacamac/d7b3d667ecaa0cd39f36
    detectClap(data) {
        const t = new Date().getTime()
        if (t - this.lastClap < 200) return null // TWEAK HERE
        const zeroCrossings = []
        let highAmps = []
        for (let i = 1; i < data.length; i++) {
            if (Math.abs(data[i]) > this.highAmpThreshold) highAmps.push(i) // TWEAK HERE
            if (
                (data[i] > 0 && data[i - 1] < 0) ||
                (data[i] < 0 && data[i - 1] > 0)
            )
                zeroCrossings.push(i)
        }

        if (highAmps.length === 0) return null
        const range = highAmps[highAmps.length - 1] - highAmps[0]

        console.debug({ highAmps, zeroCrossings, range })

        if (
            highAmps.length >= this.minHighAmpCount &&
            zeroCrossings.length >= this.minZeroCrossings &&
            zeroCrossings.length <= this.maxZeroCrossings &&
            range <= this.maxRange
        ) {
            // TWEAK HERE
            //console.log(highAmp+' / '+zeroCrossings);
            this.lastClap = t
            return { highAmps, zeroCrossings, range }
        }
        return null
    }

    onClap(clapCallback) {
        this.clapCallback = clapCallback
    }

    onData(dataCallback) {
        this.dataCallback = dataCallback
    }
}
