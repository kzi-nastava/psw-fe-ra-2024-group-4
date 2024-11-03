import { Component, OnInit } from '@angular/core';
import { TourOverview } from '../model/touroverview.model';
import { TourOverviewService } from '../tour-overview.service';
import { Touroverview } from '../model/model/touroverview.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

// Pomocna za dizaj kartice
const pom: TourOverview = {
  id: 1,
  name: 'Sample Tour',
  description: 'A brief description of the tour.',
  difficulty: 2,
  tags: ['adventure', 'nature'],
  firstkeypoint: {
      id: 1,
      name: 'Start Point',
      longitude: 34.56, // Example longitude
      latitude: -12.34,  // Example latitude
      description: 'The beginning of the adventure.',
      image: 'image-url.jpg', // URL of the image
      userId: 1, // Assuming this is the ID of the user who created the key point
      imageBase64: 'base64-image-string', // Base64 string for the image
      tourId: 1, // Reference to the associated tour
  },
  reviews: [
      {
          id: 1,
          idTour: 1, // Tour ID this review is associated with
          idTourist: 1, // Tourist ID who made the review
          rating: 4.5,
          comment: 'It was an amazing experience!',
          dateTour: new Date('2024-01-01T10:00:00Z'), // Example date for the tour
          dateComment: new Date('2024-01-02T10:00:00Z'), // Example date for the comment
          images: ['image1-url.jpg', 'image2-url.jpg'], // List of image URLs related to the review
      },
      // You can add more reviews here
  ],
  rating: 4.5 // Overall rating for the tour
};

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent implements OnInit {
  tours: TourOverview[] = [];
  temp: TourOverview = pom;
  currentPage: 0;
  pageSize: 0;

  constructor(private tourOverviewService: TourOverviewService) {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.tourOverviewService.getAllWithoutReviews().subscribe({
      next: (data: PagedResults<TourOverview>) => {
        console.log('Tours loaded:', data);
        this.tours = data.results; // Assuming your API returns a 'results' property
      },
      error: (err) => {
        console.error('Error loading tours:', err);
      }
    });
  }

  // Optional: Add methods to handle pagination (e.g., next page, previous page)
  nextPage(): void {
    this.currentPage++;
    this.loadTours(); // Reload tours for the new page
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTours(); // Reload tours for the new page
    }
  }
}
