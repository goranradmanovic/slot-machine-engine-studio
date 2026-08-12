export enum Permission {
  // Tier 1: General Access / Runner
  BASIC = 'basic', // View simulator & apply existing configs
  // Tier 2: Config Editor
  MANAGER = 'manager', // CRUD on own/allowed config JSON files
  // Tier 3: Full Admin
  ADMIN = 'admin', // Full access across all apps, users & settings
}