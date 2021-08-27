mapboxgl.accessToken = 'pk.eyJ1IjoiaWlpaSIsImEiOiJjajgydmMwZHMwZnJlMndtaWVyNnc0NWFjIn0.YHOCwPqB6HIgjaE8dJGxsQ'

let lastPos = { latitude: 0, longitude: 0 };
const NEAR = 0.02
let map

function renderMap() {
    if (!mapboxgl.supported()) {
        alert('Your browser does not support Mapbox GL')
    } else {
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lastPos.longitude, lastPos.latitude],
            zoom: 15,
            interactive: true,
            bearing: 0
        })

        // Add geolocate control to the map.
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            })
        );

        console.log(lastPos)
        console.log(map)

        // addRoute()
        // addARPoints()
    }

    var mapState = ''
}

function findActivated() {
    let dists = []
    let places = LOCATIONS.map((place) => {
        let dist = haversineDistance([place.location.lng, place.location.lat], [lastPos.longitude, lastPos.latitude])
        dist = parseFloat(dist.toFixed(4))
        let isFar = dist > NEAR
        dists.push(dist)
        return {...place, dist, isFar, isActivated: false }
    })

    places = places.sort((a, b) => {
        return a.dist - b.dist;
    })

    let nearest = places[0]
    if (!nearest.isFar) {
        console.log('active!')
        places[0] = {...nearest, isActivated: true }
            // places[0]['isActived'] = true
    }
    console.log(places)
    return places
}

let markers = []

function initMarkers() {

    for (const place of LOCATIONS) {
        // create a HTML element for each feature
        const el = document.createElement('div');

        el.classList.add('marker');
        // el.classList.remove('active')
        // if (place.isActivated) {
        //     el.classList.add('active')
        //         // TODO: легко запутаться
        //     renderVideo(place)
        // }

        // make a marker for each feature and add to the map
        // const marker = new mapboxgl.Marker({
        //         color: "#FFFFFF",
        //         draggable: true
        //     }).setLngLat([place.location.lng, place.location.lat])
        //     .addTo(map);

        let marker = new mapboxgl.Marker(el)
            .setLngLat([place.location.lng, place.location.lat])
            .setPopup(
                new mapboxgl.Popup({ offset: 5 }) // add popups
                .setHTML(
                    `<h3>${place.name}</h3><p>${place.description}</p>`
                )
            )
            .addTo(map);

        markers.push({ name: place.name, marker, el })
    }
}

function updateMarkers() {
    // add markers to map
    let places = findActivated()
    markers.forEach(m => {
        let place = places.find((p) => { return p.name === m.name })
        console.log(place)
        let el = m.el
        el.classList.remove('active')
        if (place.isActivated) {
            el.classList.add('active')
                // TODO: легко запутаться
            renderVideo(place)
        }

    })
}


function renderMarkers() {
    // add markers to map
    let places = findActivated()

    let markers
    for (const place of places) {
        // create a HTML element for each feature
        const el = document.createElement('div');

        el.classList.add('marker');
        el.classList.remove('active')
        if (place.isActivated) {
            el.classList.add('active')
                // TODO: легко запутаться
                // renderVideo(place)
        }

        // make a marker for each feature and add to the map
        // const marker = new mapboxgl.Marker({
        //         color: "#FFFFFF",
        //         draggable: true
        //     }).setLngLat([place.location.lng, place.location.lat])
        //     .addTo(map);

        new mapboxgl.Marker(el)
            .setLngLat([place.location.lng, place.location.lat])
            .setPopup(
                new mapboxgl.Popup({ offset: 5 }) // add popups
                .setHTML(
                    `<h3>${place.name}</h3><p>${place.description}</p>`
                )
            )
            .addTo(map);
    }
}

window.onload = () => {
    let state = 0,
        lastTime = 0;
    // places = staticLoadPlaces();
    // renderPlaces(places);

    navigator.geolocation.getCurrentPosition((pos) => {
        // alert(pos.coords.longitude)
        lastPos = { longitude: pos.coords.longitude, latitude: pos.coords.latitude }
        renderHUD({ longitude: pos.coords.longitude, latitude: pos.coords.latitude })
        renderPlaces(LOCATIONS)
        renderMap()
        initMarkers()
        updateMarkers()
        renderAssets()

        id = navigator.geolocation.watchPosition((pos) => {
            // if (pos.coords) {
            // alert('!!!!!' + JSON.stringify(pos.coords.latitude))
            // const curTime = new Date().getTime();
            console.log(pos.coords)
            lastPos = { longitude: pos.coords.longitude, latitude: pos.coords.latitude }
                // renderMarkers()
            updateMarkers()


            // renderPlaces(places)
            renderHUD({ longitude: pos.coords.longitude, latitude: pos.coords.latitude })

        }, (err) => {

        }, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        })

    });




    // window.addEventListener('gps-camera-update-position', async(e) => {
    //     const curTime = new Date().getTime();
    //     console.log(e.detail)
    //     renderHUD(e.detail.position)
    //     if (curTime - lastTime > 5000 &&
    //         jsfreemaplib.haversineDist(
    //             e.detail.position.longitude,
    //             e.detail.position.latitude,
    //             lastPos.longitude,
    //             lastPos.latitude) > 10) {
    //         lastTime = curTime;
    //         lastPos.latitude = e.detail.position.latitude;
    //         lastPos.longitude = e.detail.position.longitude;
    //         hikarElement.setAttribute('lon', e.detail.position.longitude);
    //         hikarElement.setAttribute('lat', e.detail.position.latitude);
    //     }
    // });
}

function haversineDistance(coords1, coords2, isMiles) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lon1 = coords1[0];
    var lat1 = coords1[1];

    var lon2 = coords2[0];
    var lat2 = coords2[1];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    if (isMiles) d /= 1.60934;

    return d;
}

function renderVideo(place) {

    var template = document.getElementById('video-template').innerHTML;
    var render = Handlebars.compile(template);
    var html = render({
        ...place,
    });

    // var el = document.getElementById('camera');
    // console.log(el)
    console.log(html)
        // el.insertAdjacentHTML('beforebegin', html);

    // var source = document.getElementById('text-template').innerHTML;
    //             var template = Handlebars.compile(source);
    //             var context = {
    //                 first_name: fname,
    //                 last_name: lname
    //             };
    //             var html = template(context);

    let el = document.getElementById('marker')
    console.log(el)
    el.innerHTML = html;
}


function renderPlaces(places) {

    var template = document.getElementById('places-template').innerHTML;
    var render = Handlebars.compile(template);
    let dists = []
    places = places.map((place) => {
            let dist = haversineDistance([place.location.lng, place.location.lat], [lastPos.longitude, lastPos.latitude])
            dist = parseFloat(dist.toFixed(4))
            let isFar = dist < NEAR
            dists.push(dist)
            return {...place, dist, isFar }
        })
        // renderDIST(lastPos, dists)


    // alert(JSON.stringify(places))
    var html = render({
        places: places,
    });

    var el = document.getElementById('camera');
    console.log(el)
    console.log(html)
    el.insertAdjacentHTML('beforebegin', html);
}


function renderAssets() {
    var template = document.getElementById('assets-template').innerHTML
    var render = Handlebars.compile(template)
        // alert(JSON.stringify(places))
    var html = render({ places: LOCATIONS })

    var el = document.getElementById('assets')
    el.innerHTML = html
}

function renderHUD(pos) {
    let el = document.querySelector('#hud');
    var template = document.getElementById('hud-template').innerHTML;
    var render = Handlebars.compile(template);
    let l = render({...pos })
    el.innerHTML = l
}

function renderDIST(pos, dists) {
    let el = document.querySelector('#hud');
    var template = document.getElementById('hud-template').innerHTML;
    var render = Handlebars.compile(template);
    let l = render({...pos })
        // alert(l)

    el.innerHTML = l + '<div> dists: ' + dists.join(', ') + '</div>'
}


function toggle() {
    const sceneEl = document.getElementById('scene')
    const mapEl = document.getElementById('map')
    if (this.mapState === 'FULLSCREEN') {
        mapEl.className = 'mapboxgl-map'
        mapState = ''
    } else {
        mapEl.className = 'map-fullscreen mapboxgl-map'
        sceneEl.className = 'hidden'
        mapState = 'FULLSCREEN'
    }
}