import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'xp-about-app',
  templateUrl: './about-app.component.html',
  styleUrls: ['./about-app.component.css']
})
export class AboutAppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target); 
        }
      });
    });
  
    const observeElements = () => {
      const images = document.querySelectorAll('.section-image, .section-content');
      images.forEach(image => observer.observe(image));
    };
  
    observeElements();
  
    const tabs = document.querySelectorAll('mat-tab-group');
    tabs.forEach(tabGroup =>
      tabGroup.addEventListener('click', () => {
        setTimeout(() => observeElements(), 100); 
      })
    );
  }
  
}
