/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";

// This example creates a 2-pixel-wide red polyline showing the path of
// the first trans-Pacific flight between Oakland, CA, and Brisbane,
// Australia which was made by Charles Kingsford Smith.

let markers: google.maps.Marker[] = [];
let polyLines: google.maps.Polyline[] = [];


function initMap(): void {
    const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
            zoom: 12,
            center: {lat: 42.356455529300256, lng: -71.1167065923323},
            mapTypeId: "terrain",
            disableDefaultUI: true
        }
    );

    (document.getElementById("add") as HTMLElement).addEventListener(
        "click",
        () => addMarker(map)
    );

    (document.getElementById("draw") as HTMLElement).addEventListener(
        "click",
        () => drawPolyLine(map)
    );

    (document.getElementById("delete-all-markers") as HTMLElement).addEventListener(
        "click",
        () => deleteMarkers()
    );
    (document.getElementById("delete-all-lines") as HTMLElement).addEventListener(
        "click",
        () => deleteLines()
    );
    (document.getElementById("p1") as HTMLElement).addEventListener(
        "change",
        () => updateDistance()
    );
    (document.getElementById("p2") as HTMLElement).addEventListener(
        "change",
        () => updateDistance()
    );

}

function drawPolyLine(map: google.maps.Map) {
    const input = (document.getElementById("coordinates") as HTMLInputElement).value;
    const polylinePath = input.split("\n").filter(s => s !== "").map(geoStr => {
            const geo = geoStr.split(",");
            return {
                lat: Number(geo[0]),
                lng: Number(geo[1])
            }
        }
    );
    const polyLine = new google.maps.Polyline({
        path: polylinePath,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });
    polyLines.push(polyLine);
    map.setCenter(polylinePath[Math.round(polylinePath.length / 2 - 1)]);
    map.setZoom(15);
}

function addMarker(
    map: google.maps.Map,
) {
    const positionInput = (document.getElementById("latlng") as HTMLInputElement).value;
    const markerName = (document.getElementById("marker-name") as HTMLInputElement).value;
    const latlngStr = positionInput.split(",", 2);
    const position = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1]),
    };
    const infowindow = new google.maps.InfoWindow({
        content: markerName
    });

    const marker = new google.maps.Marker({
        position: position,
        map: map
    });
    google.maps.event.addListener(marker, "click", () => {
        infowindow.open(map, marker);
    });
    markers.push(marker);
    map.setCenter(position);
    map.setZoom(15);
}

function deleteMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function deleteLines() {
    polyLines.forEach(line => line.setMap(null));
    polyLines = [];
}

function updateDistance() {
    const pStr1 = (document.getElementById("p1") as HTMLInputElement).value;
    const pStr2 = (document.getElementById("p2") as HTMLInputElement).value;
    const p1 = pStr1.split(",")
    const p2 = pStr2.split(",")
    const geoPoint1 = {
        lat: parseFloat(p1[0]),
        lon: parseFloat(p1[1]),
    };
    const geoPoint2 = {
        lat: parseFloat(p2[0]),
        lon: parseFloat(p2[1]),
    };
    let distance = haversineDistanc(geoPoint1, geoPoint2);
    if (isNaN(distance)) {
        distance = 0
    }
    (document.getElementById("distance") as HTMLInputElement).innerHTML = `${distance.toFixed(2)}m`;
}

function haversineDistanc(p1, p2) {
    const earthRadius = 6371e3;
    const radLat1 = p1.lat * Math.PI / 180;
    const radLat2 = p2.lat * Math.PI / 180;
    const lat = (p2.lat - p1.lat) * Math.PI / 180;
    const lon = (p2.lon - p1.lon) * Math.PI / 180;

    const a = Math.sin(lat / 2) * Math.sin(lat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *
        Math.sin(lon / 2) * Math.sin(lon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
}

export {initMap};
