export interface BadgeDto {
  id: number;
  userId: number;
  name: BadgeName;
  level: AchievementLevel;
  isRead: boolean;
}

export enum BadgeName {
  ExplorerStep = 0,
  Globetrotter,
  PhotoPro,
  TourTaster,
  SocialButterfly,
  TravelBuddy,
  CulturalEnthusiast,
  AdventureSeeker,
  NatureLover,
  CityExplorer,
  HistoricalBuff,
  RelaxationGuru,
  WildlifeWanderer,
  BeachLover,
  MountainConqueror,
  PartyManiac
}

export enum AchievementLevel {
  Bronze = 0,
  Silver,
  Gold,
  None
}