import { Component, Input, OnInit } from '@angular/core';
import { Problem } from '../model/problem.model';
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
   })
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
          console.log(`Problem time: ${problem.time}, Days difference: ${daysDifference}, isLate: ${isLate}`);
          return {
            ...problem,
            isLate: isLate
            
          };
          
            });
            
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeProblem();
      } else if (result.isDismissed) {
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
        updatedProblem.isLate = true
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
