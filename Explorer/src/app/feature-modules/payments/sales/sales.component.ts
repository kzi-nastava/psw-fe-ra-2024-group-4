import { Component, OnInit } from '@angular/core';
import { SalesService } from '../sales.service';
import { Sale } from '../model/sales.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourService } from '../../tour-authoring/tour.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  sales: Sale[] = [];
  user: User | null = null;
  userId: number;
  displayedColumns: string[] = ['startDate', 'endDate', 'discount', 'tours', 'actions'];
  selectedSale: Sale | null = null;

  constructor(private salesService: SalesService, private authService: AuthService, private tourService: TourService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (user !== null && user.role === 'author') {
        this.userId = user.id;
        this.loadSales();
      }
    });
  }

  loadSales() {
    if (this.userId) {
      this.salesService.getSales(this.userId).subscribe({
        next: (response) => {
          this.sales = response.map(sale => ({
            ...sale,
            startDate: new Date(sale.startDate),
            endDate: new Date(sale.endDate),
          }));

          this.tourService.getToursForAuthor(this.userId).subscribe({
            next: (tours) => {
              this.sales.forEach(sale => {
                if (sale.tourIds) {
                  sale.tourDetails = tours.filter(tour => sale.tourIds!.includes(tour.id!));
                } else {
                  sale.tourDetails = [];
                }
              });
             
            },
            error: (err) => {
              console.error('Error fetching tours:', err);
              Swal.fire('Error', 'Failed to load tours.', 'error');
            },
          });
        },
        error: (err) => {
          console.error('Error loading sales:', err);
          Swal.fire('Error', 'Failed to load sales.', 'error');
        },
      });
    }
  }

  updateSale(sale: Sale) {
    this.selectedSale = { ...sale };
  }

  cancelUpdate() {
    this.selectedSale = null;
  }

  submitUpdate(form: any) {
    if (form.valid && this.selectedSale) {
      this.salesService.updateSale(this.selectedSale).subscribe({
        next: (response) => {
          Swal.fire('Success', 'Sale updated successfully!', 'success');
          this.loadSales();
          this.selectedSale = null;
        },
        error: (err) => {
          console.error('Error updating sale:', err);
          Swal.fire('Error', 'Failed to update sale.', 'error');
        },
      });
    }
  }

  deleteSale(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this sale?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.salesService.deleteSale(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Sale has been deleted.', 'success');
            this.loadSales();
          },
          error: (err) => {
            console.error('Error deleting sale:', err);
            Swal.fire('Error', 'Failed to delete sale.', 'error');
          },
        });
      }
    });
  }
}
