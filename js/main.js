var coords = {
  longitude : 48.8669183,
  latitude: 2.359296
};

function getTrees(lat, lng) {
  return new Promise( function(resolve, reject){
    fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=les-arbres&q=&rows=5000&facet=domanialite&facet=arrondissement&facet=libellefrancais&facet=circonferenceencm&facet=hauteurenm&facet=remarquable&geofilter.distance=48.8669183%2C+2.359296%2C+1000')
      .then( function( rawData ){
        // Tester la requête
        if( rawData.ok === true ){
          return rawData.json()
        }
        else{
          return reject(rawData)
        }
      })
      .then( function( jsonData ){
        return resolve( jsonData )
      })
      .catch( function( fetchError ){
        return reject( fetchError )
      });
  })
}

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

    // Charger la liste des arbres
    getTrees(coords.latitude, coords.longitude)
      .then(function(data){
        console.log(data.records);

        // Boucle sur la collection de données
        data.records.map(function(item) {
          var myIcon = L.divIcon({className: "my-div-icon"});
          L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], {icon: myIcon}).addTo(myMap)
        })
      })
      .catch(function(error) {
        console.error(error);
      })

  });


} else {
  /* la géolocalisation n'est pas disponible */
  console.log('NOT geolocation')
}
