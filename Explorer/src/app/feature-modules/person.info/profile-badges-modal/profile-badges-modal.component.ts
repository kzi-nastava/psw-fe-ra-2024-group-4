import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

interface BadgeLevel {
  fileName: string;
  level: string;
  tooltip: string;
}

interface BadgeGroup {
  title: string;
  levels: BadgeLevel[];
}

@Component({
  selector: 'app-profile-badges-modal',
  templateUrl: './profile-badges-modal.component.html',
  styleUrls: ['./profile-badges-modal.component.css']
})
export class ProfileBadgesModalComponent {
  public ownedBadges: string[];

  public badgeGroups: BadgeGroup[] = [
    {
  title: "Explorer's Step",
  levels: [
    {
      fileName: '100km.png',
      level: '',
      tooltip: "Travel at least 100 km while participating in tours to earn this badge."
    }
  ]
},
{
  title: 'Globetrotter',
  levels: [
    {
      fileName: '1000km.png',
      level: '',
      tooltip: "Travel at least 1,000 km on tours to unlock this badge."
    }
  ]
},
{
  title: 'Photo Pro',
  levels: [
    {
      fileName: 'photo.png',
      level: '',
      tooltip: "Share 10 or more photos from your tours to earn this achievement."
    }
  ]
},
{
  title: 'Social Butterfly',
  levels: [
    {
      fileName: 'SOCIAL.png',
      level: '',
      tooltip: "Encounter other users during 5 or more tours to unlock this badge."
    }
  ]
},
{
  title: 'Travel Buddy',
  levels: [
    {
      fileName: 'buddies.png',
      level: '',
      tooltip: "Join 5 or more tours that were shared through a club to earn this badge."
    }
  ]
},
{
  title: 'Tour Taster',
  levels: [
    {
      fileName: 'taster.png',
      level: '',
      tooltip: "Go on at least 10 different tours to earn this achievement."
    }
  ]
},
    {
      title: 'Cultural Enthusiast',
      levels: [
        { fileName: 'culture_bronze.png', level: 'Bronze', tooltip: "Complete 2 tours tagged with 'cultural' to earn this badge." },
        { fileName: 'culture_silver.png', level: 'Silver', tooltip: "Complete 5 cultural tours to level up your Cultural Enthusiast badge." },
        { fileName: 'culture_gold.png', level: 'Gold', tooltip: "Complete 7 cultural tours to become a true Cultural Enthusiast." }
      ]
    },
    {
      title: 'Adventure Seeker',
      levels: [
        { fileName: 'adventure_bronze.png', level: 'Bronze', tooltip: "Go on 2 adventure-tagged tours to earn this badge." },
        { fileName: 'adventure_silver.png', level: 'Silver', tooltip: "Go on 5 adventure tours to reach Silver level." },
        { fileName: 'adventure_gold.png', level: 'Gold', tooltip: "Go on 7 adventure tours to master the Adventure Seeker badge." }
      ]
    },
    {
      title: 'Nature Lover',
      levels: [
        { fileName: 'nature_bronze.png', level: 'Bronze', tooltip: "Complete 2 nature-themed tours to earn this badge." },
        { fileName: 'nature_silver.png', level: 'Silver', tooltip: "Join 5 tours tagged with 'nature' to reach Silver level." },
        { fileName: 'nature_gold.png', level: 'Gold', tooltip: "Join 7 nature tours to earn the golden Nature Lover badge." }
      ]
    },
    {
      title: 'City Explorer',
      levels: [
        { fileName: 'city_bronze.png', level: 'Bronze', tooltip: "Complete 2 tours tagged 'city' to earn this badge." },
        { fileName: 'city_silver.png', level: 'Silver', tooltip: "Explore 5 city-themed tours to reach Silver." },
        { fileName: 'city_gold.png', level: 'Gold', tooltip: "Explore 7 city tours to earn Gold City Explorer status." }
      ]
    },
    {
      title: 'Historical Buff',
      levels: [
        { fileName: 'history_bronze.png', level: 'Bronze', tooltip: "Complete 2 history-tagged tours to get this badge." },
        { fileName: 'history_silver.png', level: 'Silver', tooltip: "Complete 5 historical tours to earn Silver." },
        { fileName: 'history_gold.png', level: 'Gold', tooltip: "Go on 7 history-tagged tours to earn the gold badge." }
      ]
    },
    {
      title: 'Relaxation Guru',
      levels: [
        { fileName: 'relaxation_bronze.png', level: 'Bronze', tooltip: "Go on 2 relaxation-themed tours to unlock this badge." },
        { fileName: 'relaxation_silver.png', level: 'Silver', tooltip: "Go on 5 tours focused on relaxation to reach Silver." },
        { fileName: 'relaxation_gold.png', level: 'Gold', tooltip: "Complete 7 relaxing tours to earn the gold Relaxation Guru badge." }
      ]
    },
    {
      title: 'Wildlife Wanderer',
      levels: [
        { fileName: 'wildlife_bronze.png', level: 'Bronze', tooltip: "Complete 2 wildlife-tagged tours to earn this badge." },
        { fileName: 'wildlife_silver.png', level: 'Silver', tooltip: "Go on 5 tours focused on wildlife to reach Silver." },
        { fileName: 'wildlife_gold.png', level: 'Gold', tooltip: "Complete 7 wildlife tours to achieve Gold Wildlife Wanderer." }
      ]
    },
    {
      title: 'Beach Lover',
      levels: [
        { fileName: 'beach_bronze.png', level: 'Bronze', tooltip: "Go on 2 beach-tagged tours to earn this badge." },
        { fileName: 'beach_silver.png', level: 'Silver', tooltip: "Complete 5 beach tours to reach Silver." },
        { fileName: 'beach_gold.png', level: 'Gold', tooltip: "Enjoy 7 beach tours to earn the golden Beach Lover badge." }
      ]
    },
    {
      title: 'Mountain Conqueror',
      levels: [
        { fileName: 'mountain_bronze.png', level: 'Bronze', tooltip: "Climb into 2 mountain-tagged tours to earn this badge." },
        { fileName: 'mountain_silver.png', level: 'Silver', tooltip: "Go on 5 mountain tours to earn Silver status." },
        { fileName: 'mountain_gold.png', level: 'Gold', tooltip: "Complete 7 mountain tours to become a Gold Mountain Conqueror." }
      ]
    },
    {
      title: 'Party Maniac',
      levels: [
        { fileName: 'party_bronze.png', level: 'Bronze', tooltip: "Join 2 party-themed tours to earn this badge." },
        { fileName: 'party_silver.png', level: 'Silver', tooltip: "Celebrate through 5 party tours to reach Silver level." },
        { fileName: 'party_gold.png', level: 'Gold', tooltip: "Complete 7 party-themed tours to achieve gold!" }
      ]
    }

  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: string[]) {
    this.ownedBadges = data;
  }

  hasBadge(fileName: string): boolean {
    return this.ownedBadges.includes(fileName);
  }

  get rareBadges(): BadgeGroup[] {
  return this.badgeGroups.filter(group =>
    group.levels.length === 1 && group.levels[0].level === ''
  );
  }

  get normalBadgeGroups(): BadgeGroup[] {
    return this.badgeGroups.filter(group =>
      !(group.levels.length === 1 && group.levels[0].level === '')
    );
  }

}
