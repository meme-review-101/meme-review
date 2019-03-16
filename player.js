var player;
var playerReady = false
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'HUYjNWei4Ok',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        playsinline: 1,
        iv_load_policy: 1,
        fs: 0,
        start: 3,
        end: 4
    });
}
function onPlayerReady(event) {
    player.mute()
    player.seekTo(2.9, true)
    player.playVideo()
}
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(() => {
            player.seekTo(2.9, true)
            player.pauseVideo()
            player.unMute()
            console.log('Player ready')
            playerReady = true
        }, 500);
        done = true;
    }
}