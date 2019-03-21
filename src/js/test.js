console.log('Find me here: /home/saltborn/Documents/code/js/musicplayer/src/html/test.html');

import "../css/test.css";

fetch('http://localhost:8000/music/1', {
    mode: 'cors'
})
    .then(rsp => {
        return rsp.json();
    })
    .then(data => {
        console.log(data);
        // console.log(data);
    })
    .catch(error => console.log(error));
