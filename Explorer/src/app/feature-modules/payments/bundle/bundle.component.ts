import { Component, inject, OnInit } from '@angular/core';
import { BundleFormComponent } from '../bundle-form/bundle-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsService } from '../payments.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Bundle } from '../../tour-authoring/model/budle.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourService } from '../../tour-authoring/tour.service';

@Component({
  selector: 'xp-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.css']
})
export class BundleComponent implements OnInit {
  readonly dialog = inject(MatDialog)
  bundles: Bundle[] = [];
  user: User|null=null;
  
  constructor(private service: PaymentsService, private authService: AuthService, private tourService: TourService){}
  
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log('Korisnik:', user);
  
      if (this.user != null && this.user.id != undefined) {
        console.log("sranje")
        this.service.getBundlesByAuthorId(this.user.id).subscribe(
          (result: PagedResults<Bundle>) => {
            this.bundles = result.results;
            console.log(this.bundles);
  
            for (let i = 0; i < this.bundles.length; i++) {
              const bundle = this.bundles[i];  
              let published = 0;
  
              for (let j = 0; j < bundle.tourIds.length; j++) {
                const id = bundle.tourIds[j];
  
                if (id != undefined) {
                  this.tourService.getByIdTour(id).subscribe({
                    next: (tour) => {
                      console.log(tour);
  
                      if (tour.status == 1) {
                        published += 1;
                        console.log("published+1");
                      }
  
                      if (published == 2) {
                        bundle.canBePublished = true;
                      }
                    },
                    error: (err) => {
                      console.error("error");
                    },
                  });
                } else {
                  console.warn("error");
                }
              }
            }
          },
          (error) => {
            console.error("error");
          }
        );
      }
    });
  }
  
  
  onAddClick(): void{
    const dialogRef = this.dialog.open(BundleFormComponent, {
      data : {
        height: 'auto',
        width: '100%',        
        maxWidth: '500px'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        this.ngOnInit();
      } else {
        console.log('Dialog closed without any result.');
      }
    });
  }

  onPublish(bundle: Bundle){

    if (bundle.id === undefined) {
      return;
    }
    
    const updatedBundle = { ...bundle, status: 1 };

    this.service.putBundle(bundle.id, updatedBundle).subscribe(
      (response: Bundle) => {
        console.log('Ažurirani bundle:', response);
        this.ngOnInit();
      },
      (error) => {
        console.error('error', error);
      }
    );
  }

  onArchive(bundle: Bundle){
    if (bundle.id === undefined) {
      console.error('error');
      return;
    }
    
    const updatedBundle = { ...bundle, status: 2 };

    this.service.putBundle(bundle.id, updatedBundle).subscribe(
      (response: Bundle) => {
        this.ngOnInit();
      },
      (error) => {
        console.error('error', error);
      }
    );
  }

  onDelete(bundle: Bundle){
    if (bundle.id === undefined) {
      console.error('error');
      return;
    }
    this.service.deleteBundle(bundle.id).subscribe({
      next: (_) =>{
        console.log('uspesno obrisano');
        this.ngOnInit();
      },
      error:(err:any)=>{
        console.log(err)
      }
    })
    
  }
  


}
