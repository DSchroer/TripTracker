import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocationService } from '../services/location.service';
import { Subscription } from 'rxjs';
import { PostLocation } from '../models/post-location';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: LocationComponent,
    multi: true
  }]
})
export class LocationComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChild("locationBox") locationInput!: ElementRef<HTMLInputElement>;

  private _onChanged = (_: any) => { };
  private _sub: Subscription | undefined;

  location: string = "";

  constructor(private _locationService: LocationService) { }

  ngOnInit() {
    this._sub = this._locationService.locationBox(this.locationInput.nativeElement).subscribe(location => {
      this._setLocation(location);
    });
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  writeValue(obj: PostLocation | undefined): void {
    if (obj) {
      this._displayLocation(obj);
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: (_: any) => void): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }

  useCurrentLocation() {
    this._locationService.myLocation().then(location => {
      this._setLocation(location);
    });
  }

  clearLocation() {
    this._setLocation(null);
  }

  private _setLocation(location: PostLocation | null) {
    this._displayLocation(location);
    this._onChanged(location);
  }

  private _displayLocation(location: PostLocation | null) {
    if (location) {
      this.locationInput.nativeElement.value = location.name;
      this.location = `Lat: ${location.position.latitude} Lng: ${location.position.longitude}`
    } else {
      this.locationInput.nativeElement.value = "";
      this.location = "";
    }
  }
}
