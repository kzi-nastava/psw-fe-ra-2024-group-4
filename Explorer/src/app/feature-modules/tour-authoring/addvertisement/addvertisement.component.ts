import { Component } from '@angular/core';

@Component({
  selector: 'xp-addvertisement',
  templateUrl: './addvertisement.component.html',
  styleUrls: ['./addvertisement.component.css']
})
export class AddvertisementComponent {


  closeAdvertisement() {
    const card = document.querySelector('.advertisement-card') as HTMLElement;
    if (card) {
      card.style.display = 'none';
    }
  }
  

}
