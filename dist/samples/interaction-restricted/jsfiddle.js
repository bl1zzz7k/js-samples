function initMap() {
  const center = new google.maps.LatLng({ lat: -25.363, lng: 131.044 });
  const zoom = 4;

  new google.maps.Map(document.getElementById("map"), {
    zoom,
    center,
    minZoom: zoom - 3,
    maxZoom: zoom + 3,
    restriction: {
      latLngBounds: {
        north: -10,
        south: -40,
        east: 160,
        west: 100,
      },
    },
  });
}
