import { Component, Input, OnInit } from '@angular/core';
import { Problem } from '../model/problem.model';
import { Notification } from '../../administration/model/notifications.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit{

  problems: Problem[] = [];
  shouldEdit: boolean=false;
  shoudAdd: boolean=false;
  isLoggedIn: boolean=false;
  showProblemForm: boolean=false;
  user: User;
  problem: Problem | null = null;
  showDeadlineModal: boolean = false;
  selectedProblem: Problem | null = null;
  newDeadline: number = 0;

  constructor(private service: MarketplaceService, private authService: AuthService, private router: Router){  }

  ngOnInit(): void {    
    this.authService.user$.subscribe((user: User) => {
      this.user = user;
      this.checkIfLoggedIn(); 
    });
    this.checkIfLoggedIn();
    this.authService.userLoggedIn.subscribe(()=>{
      this.checkIfLoggedIn();
   })
   this.authService.userLoggedOut.subscribe(()=>{
      this.showProblemForm = false; 
      this.isLoggedIn=false;
   });

  }

  checkIfLoggedIn(): void{
    this.isLoggedIn=this.authService.isLoggedIn();
    if(this.isLoggedIn){
      this.getProblems();
    }
  }


  deleteProblem(id: number):void{
    this.service.deleteProblem(id).subscribe({
      next: ()=>{
        this.getProblems();
      }
    })
  }

  getProblems(): void {
    if (!this.user) {
      console.warn('User is undefined, cannot fetch problems.');
      return;
    }
    console.log(this.user.role);
    /*if(this.user.role=='administrator'){
      this.service.getProblems().subscribe({
        next: (result: PagedResults<Problem>) => {
          this.problems = result.results;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }*/
      if (this.user.role === 'administrator') {
        this.service.getProblems().subscribe({
          next: (result: PagedResults<Problem>) => {
            const now = new Date();
            // Prolazimo kroz probleme i označavamo one koji su aktivni i stariji od 5 dana
            this.problems = result.results.map(problem => {
              const reportedDate = new Date(problem.time);
              const daysDifference = Math.floor((now.getTime() - reportedDate.getTime()) / (1000 * 60 * 60 * 24)); // zaokruženo na ceo dan
 
              const isLate =  daysDifference > 5;
             
              if (!problem.isActive && problem.isLate !== undefined) {
                problem.isLate = problem.isLate;
              } else {
                problem.isLate = isLate;
              }

          console.log(`Problem time: ${problem.time}, Days difference: ${daysDifference}, isLate: ${isLate}`);
          return {
            ...problem,
            isLate: isLate
            
          };
          
            });
            this.checkDeadline();
          },
          error: (err: any) => {
            console.log(err);
          }
        });
      }
    if(this.user.role=='tourist'){
      this.service.getProblemsByTouristId(this.user.id).subscribe({
        next: (result: Problem[]) => {
          console.log(result);
          this.problems = result;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
  parseToNumber(value: any): number {
    const parsedValue = Number(value);
    return isNaN(parsedValue) ? 0 : parsedValue; 
}

  updateDeadline(problem: Problem, newDeadline: number): void {
    const updatedProblem = { ...problem, deadline: newDeadline };
    this.service.updateProblem(updatedProblem).subscribe({
        next: (updatedProblem: Problem) => {
            console.log(`Updated deadline for problem ID ${problem.id}:`, updatedProblem);
            const index = this.problems.findIndex(p => p.id === updatedProblem.id);
            if (index !== -1) {
                this.problems[index] = updatedProblem;
            }
        },
        error: (err: any) => {
            console.error('Error updating problem deadline:', err);
        }
    });
}
openDeadlineModal(problem: Problem): void {
  this.selectedProblem = problem;
  this.newDeadline = problem.deadline || 0;
  this.showDeadlineModal = true;
}

closeDeadlineModal(): void {
  this.showDeadlineModal = false;
  this.selectedProblem = null;
}

confirmUpdateDeadline(): void {
  if (this.selectedProblem) {
    this.updateDeadline(this.selectedProblem, this.newDeadline);

    const problemId = this.selectedProblem.id; 
    const tourId = this.selectedProblem.tourId; 

    this.service.getTourById(tourId, 'admin').subscribe({
      next: (tour) => {
        if (tour && tour.userId !== undefined && problemId !== undefined) {
          const notification: Notification = {
            id: 0, 
            description: "New deadline set for problem",
            creationTime: new Date(),
            isRead: false,
            userId: tour.userId,  
            notificationsType: 0,
            resourceId: problemId 
          };

          console.log("Notification to be created:", notification); 

          this.service.createAdminNotification(notification).subscribe({
            next: (createdNotification) => {
              console.log("Notification created:", createdNotification);
              this.checkDeadline();
            },
            error: (error) => {
              console.error("Error creating notification:", error);
            },
          });
        } else {
          console.error("Tour or userId is null or undefined, or problemId is missing.");
        }
      },
      error: (error) => {
        console.error("Error fetching tour for notification:", error);
      }
    });

    this.closeDeadlineModal();
  }
}

  onAddClick(): void{
    this.shoudAdd=true;
    this.shouldEdit=false;
    this.showProblemForm=true;
  }

  onProblemAdded(): void {
    this.getProblems();
    this.showProblemForm = false; 
  }

  openTicket(p: Problem) {
    //console.log(p);
    this.router.navigate(['/problem-ticket'], { state: { problem: p}});
  }

  checkDeadline(): void {
   
    const currentTime = new Date();
    this.problems.forEach(p => {
      const timeDifference = (currentTime.getTime() - new Date(p.time).getTime()) / (1000 * 3600 * 24);
      if(p.deadline){
         p.isOverDeadline = timeDifference > p.deadline;
      }
      if (/*p.isOverDeadline || */timeDifference > 5) {
        p.isLate = true;
    }
     
    });
  }
  

  showAlert(problem: Problem) {
    this.problem = problem;

    if (!problem.isActive) {
      Swal.fire('Problem is already closed', '', 'warning');
      return;
    }

    Swal.fire({
      title: 'Manage administrator\'s tour. You can either close the problem, or remove the whole tour!',
      icon: 'info',
      showCancelButton: true,
      showCloseButton: true, 
      confirmButtonText: 'Close problem',
      cancelButtonText: 'Remove tour',
      allowOutsideClick: false ,
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeProblem();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Ako je korisnik kliknuo na "Remove tour"
        this.removeTour();
      }
    });
  }

  closeProblem() {
    if (!this.problem || typeof this.problem.id !== 'number') {
      console.error('Problem nije definisan ili ID nije validan.');
      return;
    }

    // Provera ako je problem već zatvoren
    if (!this.problem.isActive) {
      Swal.fire('Problem is already closed', '', 'warning');
      return;
    }

    const newStatus = !this.problem.isActive;
    this.service.closedProblemStatus(this.problem.id, newStatus).subscribe(
      (updatedProblem: Problem) => {
        this.problem = updatedProblem;
        console.log('Updated problem status:', updatedProblem);


        const index = this.problems.findIndex(p => p.id === updatedProblem.id);
      if (index !== -1) {

        const now = new Date();
        const reportedDate = new Date(updatedProblem.time);
        const daysDifference = Math.floor((now.getTime() - reportedDate.getTime()) / (1000 * 60 * 60 * 24)); 
        if(daysDifference>5){
          updatedProblem.isLate = true
        }else{
          updatedProblem.isLate = false
        }
        this.checkDeadline();
        if(updatedProblem.deadline){
          updatedProblem.isOverDeadline = daysDifference > updatedProblem.deadline;
       }
        this.problems[index] = updatedProblem; 
      }
      },
      (error) => {
        console.error('Error updating problem status:', error);
      }
    );
  }

  removeTour() {
    
      if (!this.problem || typeof this.problem.id !== 'number') {
        console.error('Problem nije definisan ili ID nije validan.');
        return;
      }
    
      // Pretpostavljam da imaš ID ture, ako ne, moraš ga dodati u Problem model
      const tourId = this.problem.tourId; // Ovo zavisi od tvoje strukture objekta Problem
      const problemId = this.problem.id;
      this.service.deleteTour(tourId).subscribe({
        next: () => {
          console.log('Tour removed successfully');
          // Poziv metode za brisanje problema ovde
          this.service.deleteProblemWithTour(problemId).subscribe({
            next: () => {
              console.log('Problem deleted successfully');
              this.getProblems(); // Ove linije možete dodati da biste osvežili listu problema
            },
            error: (err) => {
              console.error('Error deleting problem:', err);
            }
          });
        },
        error: (err) => {
          console.error('Error removing tour:', err);
        }
      });
    
  }

}
