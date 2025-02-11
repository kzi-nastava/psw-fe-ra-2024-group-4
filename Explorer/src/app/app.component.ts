import { Component, OnInit } from '@angular/core';
import { AuthService } from './infrastructure/auth/auth.service';
import 'leaflet-routing-machine'
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Explorer';
  showFixedCircle: boolean = true;
  isChatOpen: boolean = false; 
  chatMessage: string = 'Hi! How can I help you?'; 

  constructor(
    private authService: AuthService,private router: Router, private route: ActivatedRoute
  ) {
    // Listen to route changes to update the message
    this.route.url.subscribe(() => {
      
    });
  }


  ngOnInit(): void {
    this.checkIfUserExists();
    this.router.events.subscribe(() => {
      this.showFixedCircle = this.authService.isLoggedIn() && this.router.url !== '/';
    });

    // Podesite showFixedCircle na osnovu login statusa
    this.authService.getUser().subscribe(user => {
      this.showFixedCircle = this.authService.isLoggedIn() && this.router.url !== '/';
    });
  }

  private checkIfUserExists(): void {
    this.authService.checkIfUserExists();
  }

  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

    

  
  

  


}
