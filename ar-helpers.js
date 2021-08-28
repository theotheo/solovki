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
            assetEl.muted = false
                // assetEl.removeAttribute('muted')
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
            assetEl.setAttribute('muted', 'true')


        }.bind(this));
    },
    remove: function() {
        // var data = this.data;
        var el = this.el;
        console.log(el)
            // Remove event listener.
        if (data.event) {
            el.removeEventListener(data.event, this.eventHandlerFn);
        }
    }
});

AFRAME.registerComponent('clickhandler', {
    init: function() {
        this.el.addEventListener('click', () => {
            alert('Clicked!')
        });
    }
});