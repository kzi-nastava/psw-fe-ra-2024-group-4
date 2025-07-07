import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import Lottie from 'lottie-web';
import gsap from 'gsap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-popup',
  template: `
    
  `,
  styles: [`
   
  `],
})
export class CustomPopupComponent {
  steps = ['1', '2', '3'];

  constructor(private router: Router) {}

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

    await new Promise(resolve => setTimeout(resolve, 2000));

    animation.destroy();
    document.body.removeChild(container);
  }

  async showPopup(animationName: string, badgeImage: string, step1Text: string, step2Text: string) {
    await this.playConfettiAnimation();

    const Queue = Swal.mixin({
      progressSteps: this.steps,
      confirmButtonText: 'Next >',
      showClass: { backdrop: 'swal2-noanimation' },
      hideClass: { backdrop: 'swal2-noanimation' },
    });

    // Step 1
    await Queue.fire({
      html: step1Text,
      currentProgressStep: 0,
      didOpen: () => {
        const container = document.createElement('div');
        container.style.width = '250px';
        container.style.height = '250px';
        container.style.margin = '0 auto';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';

        const lottieIcon = Lottie.loadAnimation({
          container: container,
          path: `assets/animations/${animationName}.json`,
          renderer: 'svg',
          autoplay: true,
          loop: false,
        });

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
            <img id="badge" src="assets/pictures/${badgeImage}.png" alt="Badge" style="display: none; width: 200px;" />
            <p id="badge-text" style="display: none;">${step2Text}</p>
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
          path: 'assets/animations/confetti2.json', // Adjust path as needed
        });
    
        confettiAnimation.addEventListener('complete', () => {
          document.body.removeChild(confettiContainer);
        });
    
        // Badge animation
        const badge = document.getElementById('badge') as HTMLImageElement;
        const badgeText = document.getElementById('badge-text');
    
        if (badge) {
          badge.onerror = () => {
            console.error('Failed to load badge image. Check the path:', badge.src);
          };
    
          badge.onload = () => {
            badge.style.display = 'block';
            badge.style.margin = '0 auto';
    
            gsap.fromTo(
              badge,
              { scale: 0, opacity: 0 },
              { scale: 1.2, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.3)' }
            );
            gsap.to(badge, { scale: 1, duration: 0.3, delay: 0.6 });
    
            if (badgeText) {
              badgeText.style.display = 'block';
              gsap.fromTo(
                badgeText,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, delay: 0.8 }
              );
            }
          };
    
          badge.src = `assets/pictures/${badgeImage}.png`;
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
          container.style.width = '250px';
          container.style.height = '250px';
          container.style.margin = '0 auto';

          Lottie.loadAnimation({
            container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/animations/profile.json',
          });
        }

        document.querySelector('.swal2-confirm')?.addEventListener('click', () => {
          this.router.navigate(['/profile']);
        });

        document.querySelector('.swal2-cancel')?.addEventListener('click', () => {
          Swal.close();
        });
      },
    });
  }

  showTestPopup() {
    this.showTravelBuddiesPopup();
  }

  showPartyBronze(){
    this.showPopup(
      'party1',
      'party_bronze',
      "You've danced under the stars! A true beginner in the nightlife scene!",
      "Congratulations! You've earned the 'Bronze Patry Maniac' badge! Keep exploring to earn more!"
    );
  }

  showPartySilver(){
    this.showPopup(
      'party1',
      'party_silver',
      "You’ve lit up the night at multiple parties—an up-and-coming nightlife pro!",
      "Congratulations! You've earned the 'Silver Patry Maniac' badge! Keep exploring to earn more!"
    );
  }

  showPartyGold(){
    this.showPopup(
      'party1',
      'party_gold',
      "You’ve conquered the nightlife! A party legend in the making!",
      "Congratulations! You've earned the 'Gold Patry Maniac' badge! Keep exploring to earn more!"
    );
  }

  showMountainBronze(){
    this.showPopup(
      'mountain1',
      'mountain_bronze',
      "One step closer to the summit—keep climbing!",
      "Congratulations! You've earned the 'Bronze Mountain Conqueror' badge! Keep exploring to earn more!"
    );
  }

  showMountainSilver(){
    this.showPopup(
      'mountain1',
      'mountain_silver',
      "The mountains know your name. Your determination is inspiring!",
      "Congratulations! You've earned the 'Silver Mountain Conqueror' badge! Keep exploring to earn more!"
    );
  }

  showMountainGold(){
    this.showPopup(
      'mountain1',
      'mountain_gold',
      "The mountains know your name. Your determination is inspiring!",
      "Standing tall! You’ve conquered the highest heights and earned your gold."
    );
  }

  showBeachBronze(){
    this.showPopup(
      'beach1',
      'beach_bronze',
      "Your toes in the sand and the sea in your heart—your beach journey begins!",
      "Congratulations! You've earned the 'Bronze Beach Lover' badge! Keep exploring to earn more!"
    );
  }

  showBeachSilver(){
    this.showPopup(
      'beach1',
      'beach_silver',
      "The sound of waves is your anthem. Keep chasing the horizon!",
      "Congratulations! You've earned the 'Silver Beach Lover' badge! Keep exploring to earn more!"
    );
  }

  showBeachGold(){
    this.showPopup(
      'beach1',
      'beach_gold',
      "You’ve mastered the tides and claimed the golden shores!",
      "Congratulations! You've earned the 'Gold Beach Lover' badge! Keep exploring to earn more!"
    );
  }

  showWildlifeBronze(){
    this.showPopup(
      'wildlife1',
      'wildlife_bronze',
      "You’ve spotted your first glimpse of the wild—adventure awaits!",
      "Congratulations! You've earned the 'Bronze Wildlife Wanderer' badge! Keep exploring to earn more!"
    );
  }

  showWildlifeSilver(){
    this.showPopup(
      'wildlife1',
      'wildlife_silver',
      "The wilderness welcomes you! Keep following the call of nature.",
      "Congratulations! You've earned the 'Silver Wildlife Wanderer' badge! Keep exploring to earn more!"
    );
  }

  showWildlifeGold(){
    this.showPopup(
      'wildlife1',
      'wildlife_gold',
      "A guardian of the wild! The animals know you by name.",
      "Congratulations! You've earned the 'Gold Wildlife Wanderer' badge! Keep exploring to earn more!"
    );
  }

  showRelaxationBronze(){
    this.showPopup(
      'relaxation1',
      'relaxation_bronze',
      "You’ve started perfecting the art of doing nothing—and you’re good at it.",
      "Congratulations! You've earned the 'Bronze Relaxation Guru' badge! Keep exploring to earn more!"
    );
  }

  showRelaxationSilver(){
    this.showPopup(
      'relaxation1',
      'relaxation_silver',
      "Relaxation pro! Your zen vibes are reaching new heights.",
      "Congratulations! You've earned the 'Silver Relaxation Guru' badge! Keep exploring to earn more!"
    );
  }

  showRelaxationGold(){
    this.showPopup(
      'relaxation1',
      'relaxation_gold',
      "A true guru of calm. The world envies your peaceful soul.",
      "Congratulations! You've earned the 'Gold Relaxation Guru' badge! Keep exploring to earn more!"
    );
  }


  showHistoricalBronze(){
    this.showPopup(
      'history1',
      'history_bronze',
      "Time travel, unlocked! You’ve stepped into the pages of history.",
      "Congratulations! You've earned the 'Bronze Historical Buff' badge! Keep exploring to earn more!"
    );
  }

  showHistoricalSilver(){
    this.showPopup(
      'history1',
      'history_silver',
      "You’ve walked where legends were made—history remembers you.",
      "Congratulations! You've earned the 'Silver Historical Buff' badge! Keep exploring to earn more!"
    );
  }

  showHistoricalGold(){
    this.showPopup(
      'history1',
      'history_gold',
      "The past has a storyteller, and it’s you. A golden achievement!",
      "Congratulations! You've earned the 'Gold Historical Buff' badge! Keep exploring to earn more!"
    );
  }

  showCityBronze(){
    this.showPopup(
      'city1',
      'city_bronze',
      "You’ve started unraveling the city’s secrets. Keep exploring!",
      "Congratulations! You've earned the 'Bronze City Explorer' badge! Keep exploring to earn more!"
    );
  }

  showCitySilver(){
    this.showPopup(
      'city1',
      'city_silver',
      "City streets and skyline views—you’re a true urban adventurer.",
      "Congratulations! You've earned the 'Silver City Explorer' badge! Keep exploring to earn more!"
    );
  }

  showCityGold(){
    this.showPopup(
      'city1',
      'city_gold',
      "The city is your playground, and you’re its master explorer!",
      "Congratulations! You've earned the 'Gold City Explorer' badge! Keep exploring to earn more!"
    );
  }

  showNatureBronze(){
    this.showPopup(
      'nature1',
      'nature_bronze',
      "The earth thanks you for your gentle footprints on its trails!",
      "Congratulations! You've earned the 'Bronze Nature Lover' badge! Keep exploring to earn more!"
    );
  }

  showNatureSilver(){
    this.showPopup(
      'nature1',
      'nature_silver',
      "ou’ve found peace in the wild—let the forests whisper their secrets to you.",
      "Congratulations! You've earned the 'Silver Nature Lover' badge! Keep exploring to earn more!"
    );
  }

  showNatureGold(){
    this.showPopup(
      'nature1',
      'nature_gold',
      "A guardian of green! Your love for nature shines like gold.",
      "Congratulations! You've earned the 'Gold Nature Lover' badge! Keep exploring to earn more!"
    );
  }

  showAdventureBronze(){
    this.showPopup(
      'adventure1',
      'adventure_bronze',
      "You’ve taken the first step into the wild. The journey has just begun!",
      "Congratulations! You've earned the 'Bronze Adventure Seeker' badge! Keep exploring to earn more!"
    );
  }

  showAdventureSilver(){
    this.showPopup(
      'adventure1',
      'adventure_silver',
      "Fearless and free—your adventures are inspiring!",
      "Congratulations! You've earned the 'Silver Adventure Seeker' badge! Keep exploring to earn more!"
    );
  }

  showAdventureGold(){
    this.showPopup(
      'adventure1',
      'adventure_gold',
      "Trailblazer, thrill-seeker, adventurer—your spirit knows no bound!",
      "Congratulations! You've earned the 'Gold Adventure Seeker' badge! Keep exploring to earn more!"
    );
  }

  showCultureBronze(){
    this.showPopup(
      'culture1',
      'culture_bronze',
      "You’ve dipped your toes into the world’s rich culture. Keep exploring!",
      "Congratulations! You've earned the 'Bronze Culture Enthusiast' badge! Keep exploring to earn more!"
    );
  }

  showCultureSilver(){
    this.showPopup(
      'culture1',
      'culture_silver',
      "Your passport may not have stamps, but your heart is full of stories!",
      "Congratulations! You've earned the 'Silver Culture Enthusiast' badge! Keep exploring to earn more!"
    );
  }

  showCultureGold(){
    this.showPopup(
      'culture1',
      'culture_gold',
      "Cultural connoisseur! You’ve seen the sights, heard the stories, and felt the magic.",
      "Congratulations! You've earned the 'Gold Culture Enthusiast' badge! Keep exploring to earn more!"
    );
  }

  showSocialPopup(){ 
    this.showPopup(
      'travel_buddies1',
      'SOCIAL',
      "Your social spark shines bright! You’ve teamed up with friends for 3 encounters—keep spreading those good vibes!",
      "Congratulations! You've earned the 'Explorer's step' badge! Keep exploring to earn more!"
    );
  }

  showTravelBuddiesPopup(){ 
    this.showPopup(
      'travel_buddies1',
      'buddies',
      "Adventure is better with friends! You’ve joined 5 trips made in clubs—creating memories on the go!",
      "Congratulations! You've earned the 'Travel buddies' badge! Keep exploring to earn more!"
    );
  }
  
  showExplorersStepPopup() {
    this.showPopup(
      'explorer_step1',
      '100km',
      "You've traveled 100 km—like walking from London to Oxford!",
      "Congratulations! You've earned the 'Explorer's step' badge! Keep exploring to earn more!"
    );
  }

  showGlobetrotterPopup(){
    this.showPopup(
      'globetrotter1',
      '1000km',
      "You've traveled 1000 km—like walking from Paris to Barcelona!",
      "Congratulations! You've earned the 'Globetrotter' badge! Keep exploring to earn more!"
    );
  }

  showPhotoProPopup(){ // mogao bi loop na animaciji
    this.showPopup(
      'photo_pro1',
      'photo',
      "Your lens is legendary! Keep capturing those memories.",
      "Congratulations! You've earned the 'Photo Pro' badge! Keep exploring to earn more!"
    );
  }

  showTourTasterPopup(){
    this.showPopup(
      'tour_taster1',
      'taster',
      "A true connoisseur of adventure. Keep tasting the world!",
      "Congratulations! You've earned the 'Tour Taster' badge! Keep exploring to earn more!"
    );
  }


}
