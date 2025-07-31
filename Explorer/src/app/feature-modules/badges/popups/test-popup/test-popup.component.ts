import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import Lottie from 'lottie-web';
import gsap from 'gsap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amazing-popup',
  template: '<button (click)="showPopup()">Show Amazing Popup</button>',
  styles: [`
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `],
})
export class AmazingPopupComponent {
  steps = ['1', '2', '3'];

  constructor(
      private router: Router
      ) {}


  async playConfettiAnimation() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    document.body.appendChild(container);

    const animation = Lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/confetti.json',
    });

    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    animation.destroy();
    document.body.removeChild(container);
  }

  async showPopup() {
    // Play confetti before the popup
    await this.playConfettiAnimation();

    const Queue = Swal.mixin({
      progressSteps: this.steps,
      confirmButtonText: 'Next >',
      showClass: { backdrop: 'swal2-noanimation' },
      hideClass: { backdrop: 'swal2-noanimation' },
    });

    // Step 1
    await Queue.fire({
      html: "You've traveled 100 km—like walking from London to Oxford!",
      currentProgressStep: 0,
      didOpen: () => {
        // Create container first
        const container = document.createElement('div');
        container.style.width = '250px';
        container.style.height = '250px';
        // Center the container
        container.style.margin = '0 auto';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
    
        const lottieIcon = Lottie.loadAnimation({
          container: container,
          path: 'assets/animations/explorer_step1.json',
          renderer: 'svg',
          autoplay: true,
          loop: false,  // Prevents looping
        });
        
        // Optional: Ensure animation stops at the last frame
        lottieIcon.addEventListener('complete', () => {
          lottieIcon.goToAndStop(lottieIcon.totalFrames - 1, true);
        });
        
        Swal.getHtmlContainer()?.prepend(container);
      },
    });
    

    // Step 2
    await Queue.fire({
      html: `
        <div id="popup-container">
          <div id="badge-container">
            <img id="badge" src="assets/pictures/100km.png" alt="Badge" style="display: none; width: 200px;" />
            <p id="badge-text" style="display: none;">
              Congratulations! You've earned the 'Explorer's step' badge! Keep exploring to earn more!
            </p>
          </div>
        </div>
      `,
      currentProgressStep: 1,
      didOpen: async () => {
        // Confetti animation
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '50%';
        confettiContainer.style.left = '50%';
        confettiContainer.style.width = '250px'; // Slightly larger than badge
        confettiContainer.style.height = '250px'; // Slightly larger than badge
        confettiContainer.style.transform = 'translate(-50%, -50%)';
        confettiContainer.style.zIndex = '2000'; // Higher than SweetAlert
        confettiContainer.style.pointerEvents = 'none';
        document.body.appendChild(confettiContainer);
    
        const confettiAnimation = Lottie.loadAnimation({
          container: confettiContainer,
          renderer: 'svg',
          autoplay: true,
          loop: false,
          path: 'assets/animations/confetti2.json',
        });
    
        confettiAnimation.addEventListener('complete', () => {
          document.body.removeChild(confettiContainer);
        });
    
        // Badge animation
        const badge = document.getElementById('badge') as HTMLImageElement;
        const badgeText = document.getElementById('badge-text');
    
        if (badge) {
          // Add error listener
          badge.onerror = () => {
            console.error('Failed to load badge image. Check the path:', badge.src);
          };
    
          // Add load listener
          badge.onload = () => {
            badge.style.display = 'block';
            badge.style.margin = '0 auto'; // Center horizontally
    
            // Animate the badge
            gsap.fromTo(
              badge,
              { scale: 0, opacity: 0 },
              { scale: 1.2, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.3)' }
            );
            gsap.to(badge, { scale: 1, duration: 0.3, delay: 0.6 });
    
            // Animate badge text
            if (badgeText) {
              badgeText.style.display = 'block';
              gsap.fromTo(
                badgeText,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, delay: 0.8 }
              );
            }
          };
    
          // Explicitly set the src to ensure `onload` triggers
          badge.src = 'assets/pictures/100km.png';
        } else {
          console.error('Badge element not found in the DOM.');
        }
      },
      customClass: {
        popup: 'swal2-popup-custom',
      },
    });
    

    // Step 3
    await Queue.fire({
      html: `
        <div id="profile-animation"></div>
        <p>You can see all your badges on your profile!</p>
      `,
      currentProgressStep: 2,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Go to Profile',
      cancelButtonText: 'Close',
      didOpen: () => {
        const container = document.getElementById('profile-animation');
        if (container) {
          // Add styles to make the animation smaller and centered
          container.style.width = '250px'; // Adjust size as needed
          container.style.height = '250px'; // Keep the aspect ratio
          container.style.margin = '0 auto'; // Center horizontally
          container.style.display = 'block'; // Ensure it's a block-level element
    
          Lottie.loadAnimation({
            container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/animations/profile.json',
          });
        }
    
        // Automatically use SweetAlert buttons
        document.querySelector('.swal2-confirm')?.addEventListener('click', () => {
          this.router.navigate(['/profile']);
        });
    
        document.querySelector('.swal2-cancel')?.addEventListener('click', () => {
          Swal.close();
        });
      },
    });
    
    
    
    
    
    
  }
}
