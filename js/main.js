if ("geolocation" in navigator) {
  /* la géolocalisation est disponible */
  console.log('OK geolocation')
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords);
  });


} else {
  /* la géolocalisation n'est pas disponible */
  console.log('NOT geolocation')
}
