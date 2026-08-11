export enum Permission {
  // Tier 1: General Access / Runner
  SIMULATION_RUN = 'simulation.run', // View simulator & apply existing configs
  // Tier 2: Config Editor
  CONFIG_MANAGE = 'config.manage', // CRUD on own/allowed config JSON files
  // Tier 3: Full Admin
  ADMIN_ALL = 'admin.all', // Full access across all apps, users & settings
}