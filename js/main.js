/*----------------------------------------------
// Old - Coordonnées en brut
//----------------------------------------------*/
// var coords = {
//   longitude : 48.8669183,
//   latitude: 2.359296
// };

/*----------------------------------------------
// Old - Fonction pour récupérer les arbres
//----------------------------------------------*/
// function getTrees(lat, lng) {
//   return new Promise( function(resolve, reject){
//     fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=les-arbres&q=&rows=5000&facet=domanialite&facet=arrondissement&facet=libellefrancais&facet=circonferenceencm&facet=hauteurenm&facet=remarquable&geofilter.distance=48.8669183%2C+2.359296%2C+1000')
//       .then( function( rawData ){
//         // Tester la requête
//         if( rawData.ok === true ){
//           return rawData.json()
//         }
//         else{
//           return reject(rawData)
//         }
//       })
//       .then( function( jsonData ){
//         return resolve( jsonData )
//       })
//       .catch( function( fetchError ){
//         return reject( fetchError )
//       });
//   })
// }

/*--------------------------------------------------------------------
// New - Fonction pour récupérer les arbres : with my position
//--------------------------------------------------------------------*/
function getTrees(lat, lng) {
  return new Promise( function(resolve, reject){
    fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=les-arbres&q=&rows=5000&facet=domanialite&facet=arrondissement&facet=libellefrancais&facet=circonferenceencm&facet=hauteurenm&facet=remarquable&geofilter.distance='+lat+'%2C+'+lng+'%2C+1000')
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

    /*------------------------------------
    // Old - Charger la liste des arbres
    //------------------------------------*/
    // getTrees(coords.latitude, coords.longitude)
    //   .then(function(data){
    //     console.log(data.records);
    //
    //     // Boucle sur la collection de données
    //     data.records.map(function(item) {
    //       var myIcon = L.divIcon({className: "my-div-icon"});
    //       L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], {icon: myIcon}).addTo(myMap)
    //     })
    //   })
    //   .catch(function(error) {
    //     console.error(error);
    //   })

    /*----------------------------------------------------------
    // New - Charger la liste des arbres : with my position
    //----------------------------------------------------------*/
    getTrees(position.coords.latitude, position.coords.longitude)
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

//--------------------------------------------
// Fonction pour vérifier si un point est dans un polygone
//--------------------------------------------
function isMarkerInsidePolygon(marker, poly) {
  var polyPoints = poly.getLatLngs();
  var x = marker.getLatLng().lat, y = marker.getLatLng().lng;

  var inside = false;
  for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
    var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

    var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};

//--------------------------------------------
// Pour avoir des zones avec voronoi diagram (avec la data au format geojson)
//--------------------------------------------

// d3.json('point.geojson', function(geojson){
//   mapDraw(geojson);
// });
//
//
// function mapDraw(geojson){
//
//   var pointdata = geojson.features;
//
//
//
// 	var map = L.map('map');
// 	map.setView([36.3894816, 139.0634281], 14);
// 	map.on("viewreset moveend", update);
//
// 	var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
//
// 	L.tileLayer(
// 		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
// 		{
// 			attribution: 'Map data &copy; ' + mapLink,
// 			maxZoom: 18
// 		}
// 	).addTo(map);
//
//
//
// 	map._initPathRoot();
// 	var svg = d3.select("#map").select("svg");
// 	var g = svg.append("g").attr("class", "leaflet-zoom-hide");
//
//
//
// 	var voronoi = d3.geom.voronoi()
// 		.x(function(d) { return d.x; })
// 		.y(function(d) { return d.y; });
//
//
//
//    update();
//
//
// 	function update() {
//
//
// 		var positions = [];
//
//
// 		pointdata.forEach(function(d) {
// 			var latlng = new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
// 			positions.push({
// 				x :map.latLngToLayerPoint(latlng).x,
// 				y :map.latLngToLayerPoint(latlng).y
// 			});
// 		});
//
//
//
// 		d3.selectAll('.AEDpoint').remove();
//
// 		var circle = g.selectAll("circle")
// 			.data(positions)
// 			.enter()
// 			.append("circle")
// 			.attr("class", "AEDpoint")
// 			.attr({
// 				"cx":function(d, i) { return d.x; },
// 				"cy":function(d, i) { return d.y; },
// 				"r":2,
// 				fill:"red"
// 			});
//
//
// 		var polygons = voronoi(positions);
// 		polygons.forEach(function(v) { v.cell = v; });
//
//
// 		svg.selectAll(".volonoi").remove();
//
// 		svg.selectAll("path")
// 			.data(polygons)
// 			.enter()
// 			.append("svg:path")
// 			.attr("class", "volonoi")
// 			.attr({
// 				"d": function(d) {
// 				if(!d) return null;
// 					return "M" + d.cell.join("L") + "Z";
// 				},
// 				stroke:"black",
// 				fill:"none"
// 			});
//
//     }
//
// }
