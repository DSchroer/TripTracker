import { Injectable, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Observable, Subject } from 'rxjs';
import { PostLocation } from '../models/post-location';
import { firestore } from 'firebase';
import { ReadKeyExpr } from '@angular/compiler';

declare var google: any;
const latlnPattern = /^(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)$/;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private _mapsLoader: MapsAPILoader, private _zone: NgZone) { }

  myLocation(): Promise<PostLocation> {
    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          resolve({
            name: "",
            position: new firestore.GeoPoint(position.coords.latitude, position.coords.longitude)
          })
        }, err => {
          return reject(err)
        }, options);
      } else {
        return reject("Geolocation is not supported by this browser.")
      }
    });
  }

  locationBox(element: HTMLInputElement): Observable<PostLocation> {
    const subject = new Subject<PostLocation>();
    element.addEventListener("input", () => {
      const found = latlnPattern.exec(element.value)
      if (found && found[1] && found[2]) {
        const lat = +found[1];
        const lng = +found[2];

        subject.next({
          name: element.value,
          position: new firestore.GeoPoint(lat, lng)
        });
      }
    });

    this._mapsLoader.load().then(() => {
      const searchBox = new google.maps.places.SearchBox(element);
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
          console.log(element.value);
          return;
        }

        if (places[0].geometry) {
          const geom = places[0].geometry;
          const name = places[0].name;

          this._zone.run(() => {
            subject.next({
              name: name,
              position: new firestore.GeoPoint(geom.location.lat(), geom.location.lng())
            });
          });
        }
      });
    });

    return subject.asObservable();
  }

}
