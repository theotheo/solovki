AFRAME.registerComponent('videohandler', {
    init: function() {
        var marker = this.el;
        // this.vid = document.querySelector("#vid");
        // console.log(this.vid)

        marker.addEventListener('markerFound', function() {
            console.log('markerFound')

            this.toggle = true;

            let vidEl = document.querySelector("#vid")
            console.log(vidEl)
            let id = vidEl.dataset.video
                // console.log(vid)
                // el.play()
            let assetEl = document.querySelector(`${id}`)
            console.log(assetEl)
            assetEl.play();
        }.bind(this));

        marker.addEventListener('markerLost', function() {
            this.toggle = false;
            console.log('markerLost')

            let vidEl = document.querySelector("#vid")
            console.log(vidEl)
            let id = vidEl.dataset.video
                // console.log(vid)
                // el.play()
            let assetEl = document.querySelector(`${id}`)
            console.log(assetEl)
            assetEl.pause();
        }.bind(this));
    },
});

AFRAME.registerComponent('clickhandler', {
    init: function() {
        this.el.addEventListener('click', () => {
            alert('Clicked!')
        });
    }
});