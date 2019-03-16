export function mean(arr) {
    return arr.reduce((mean, elem, i) => (mean * i + elem) / (i + 1), 0)
}

console.assert(mean([2, 7, 3]) === 4)

export function std(arr) {
    const myMean = mean(arr)
    return Math.sqrt(mean(arr.map(e => (e - myMean) * (e - myMean))))
}

console.assert(
    Math.abs(std([10, 2, 38, 23, 38, 23, 21]) - 13.2844) < 0.001,
    std([10, 2, 38, 23, 38, 23, 21])
)
