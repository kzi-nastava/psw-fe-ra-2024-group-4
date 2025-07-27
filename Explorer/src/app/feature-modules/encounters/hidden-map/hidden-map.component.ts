import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'xp-hidden-map',
  templateUrl: './hidden-map.component.html',
  styleUrls: ['./hidden-map.component.css']
})
export class HiddenMap implements OnInit {
  longitude: number;
  latitude: number;
  address: string = '';

  private apiUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { latitude: number, longitude: number, address: string }, 
    private http: HttpClient,
    private dialogRef: MatDialogRef<HiddenMap>
  ) {}

  ngOnInit(): void {
    this.latitude = this.data.latitude;
    this.longitude = this.data.longitude;
    this.getAddress();
  }

  onLatitudeChanged(lat: number): void {
    this.latitude = lat;
    console.log('Latitude changed:', this.latitude);
    this.getAddress();
  }

  onLongitudeChanged(lng: number): void {
    this.longitude = lng;
    console.log('Longitude changed:', this.longitude);
    this.getAddress();
  }

  getAddress() {
    // Show the loading spinner
    Swal.fire({
      title: 'Please wait...',
      text: 'Fetching the address...',
      allowOutsideClick: false, // Disable closing modal by clicking outside
      didOpen: () => {
        Swal.showLoading(); // Show the loading spinner
      }
    });

    const url = `${this.apiUrl}?lat=${this.latitude}&lon=${this.longitude}&format=json`;

    this.http.get<any>(url).subscribe(
      response => {
        if (response && response.display_name) {
          this.address = response.display_name;
        } else {
          this.address = 'Address not found';
        }

        Swal.close(); // Close the SweetAlert after getting the address
      },
      error => {
        console.error('Error fetching address:', error);
        this.address = 'Error fetching address';
        Swal.close(); // Close the SweetAlert after the error
      }
    );
  }

  closeDialog() {
    this.dialogRef.close({
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address
    });
  }
}