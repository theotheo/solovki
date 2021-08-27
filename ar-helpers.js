AFRAME.registerComponent('videohandler', {
    init: function() {
        var marker = this.el;
        this.vid = document.querySelector("#vid");

        marker.addEventListener('markerFound', function() {
            this.toggle = true;
            this.vid.play();
        }.bind(this));

        marker.addEventListener('markerLost', function() {
            this.toggle = false;
            this.vid.pause();
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