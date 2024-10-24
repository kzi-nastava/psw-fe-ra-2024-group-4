import { Component, OnInit } from '@angular/core';
import { TourPreferenceService } from '../tour-preference.service';
import { TourPreference, TransportMode } from '../../../shared/model/tour-preference.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tour-preferences',
  templateUrl: '../tour-preferences/tour-preferences.component.html',
  styleUrls: ['./tour-preferences.component.css']
})
export class TourPreferencesComponent implements OnInit {
  preferences: TourPreference[] = [];

  constructor(private tourPreferenceService: TourPreferenceService) {}

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.tourPreferenceService.getPreferences().subscribe({
      next: (data) => {
        this.preferences = data;
      },
      error: (err) => {
        console.error('Error loading preferences:', err);
      }
    });
  }
}

