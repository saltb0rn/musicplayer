export function musicSelectedRequired(target, name, descriptor) {
    const wrapped = descriptor.value;
    if (typeof wrapped === 'function')
        descriptor.value = function(...args) {
            if (this.audioCtx)
                return wrapped.apply(this, args);
            else
                return console.error('Must call select method first');
        };
}

class MusicPlayer {

    constructor() {
        // this.playlist = null;
        // this.currentMusicId = null;
        this.audio = null;
        this.audioCtx = null;
        this.track = null;
        this.gainNode = null;
    }

    select(src) {
        /* 因为有些音频文件的长度只能在 loadedmetadata 的时候被读取到,为了能够保证正确获取到实践才需要一个渲染器 */
        if (this.audioCtx) this.audioCtx.close();
        var _this = this;
        this.audio = new Audio(src);
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext);
        this.track = this.audioCtx.createMediaElementSource(this.audio);
        this.gainNode = this.audioCtx.createGain();
        this.track.connect(this.gainNode).connect(this.audioCtx.destination);
    }

    @musicSelectedRequired
    play() {
        this.audio.play();
    }

    @musicSelectedRequired
    pause() {
        this.audio.pause();
    }

    @musicSelectedRequired
    setVolume(value) {
        /*
          min: 0, max: 2
        */
        this.gainNode.gain.value = value;
    }

    // @musicSelectedRequired
    // next() {
    //     let index = this.playlist.indexOf(this.currentMusicId),
    //         nextIndex = index + 1;
    //     this.play();
    // }

    // @musicSelectedRequired
    // prev() {
    //     let index = this.playlist.indexOf(this.currentMusicId),
    //         prevIndex = index - 1;
    //     this.play();
    // }

    @musicSelectedRequired
    setProgress(value) {
        /*
          min: 0, max: duration
        */
        this.audio.currentTime = value;
    }
    
    bindingUI(element, event, callback) {
        element.addEventListener(event, callback.bind(this), false);
    }
}

export { MusicPlayer };
