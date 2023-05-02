mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v11", // style URL
  center: foodtruck.geometry.coordinates, // starting position [lng, lat]
  zoom: 13, // starting zoom
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
  .setLngLat(foodtruck.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25})
      .setHTML(`<h3>${foodtruck.location}</h3>`))
  .addTo(map);
