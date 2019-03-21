/*
  The script to mark the music the user likes
*/

export { storageAvailable, MusicManager };

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
                e.code === 22 ||
                e.code === 1014 ||
                e.name === 'QuotaExceededError' ||
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
    }
}

var MusicManager = (function() {

    let favMusic = new Array();

    return {

        addMusic: function(music) {

            if(storageAvailable('localStorage') &&
               typeof music.id == 'number' &&
               music.id % 1 === 0) {
                if(!this.isSaved(music)) {
                    favMusic.push(music);
                    localStorage.setItem('favMusic', JSON.stringify({
                        'favMusic': favMusic
                    }));
                }
            }
            return this.getFavMusic();
        },

        removeMusic: function(music) {
            if(storageAvailable('localStorage') &&
               typeof music.id == 'number' &&
               music.id % 1 === 0) {
                if (this.isSaved(music)) {
                    favMusic = favMusic.filter(obj => music.id != obj.id);
                    localStorage.setItem('favMusic', JSON.stringify({
                        'favMusic': favMusic
                    }));
                }
            }
            return this.getFavMusic();
        },

        clear: function() {
            favMusic = new Array();
            localStorage.clear();
            return this.getFavMusic();
        },

        getFavMusic: function() {
            let res = localStorage.getItem('favMusic');
            if(res) {
                res = JSON.parse(res);
                return res.favMusic;
            }
            return res || [];
        },

        addOrRemove: function(music, callForAdding = function(){}, callForRemoving = function(){}) {
            let res;
            if (this.isSaved(music)) {
                res = this.removeMusic(music);
                callForRemoving();
            } else {
                res = this.addMusic(music);
                callForAdding();
            }
            return res;
        },

        isSaved: function(music) {
            var res = this.getFavMusic();
            return res.some(obj => music.id == obj.id);
        }
    };
})();
