if ("geolocation" in navigator) {
  /* la géolocalisation est disponible */
  console.log('OK geolocation')
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords);

    // Afficher la carte
    var myMap = L.map('myMap').setView([position.coords.latitude, position.coords.longitude], 20);
    console.log(myMap);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png').addTo(myMap);

    var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(myMap);

    // Un autre Layer
    /* https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png */
  });


} else {
  /* la géolocalisation n'est pas disponible */
  console.log('NOT geolocation')
}
