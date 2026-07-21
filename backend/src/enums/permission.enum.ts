export enum Permission {
    // Games
    GAME_READ = 'game.read',
    GAME_WRITE = 'game.write',
    GAME_DELETE = 'game.delete',
    GAME_PUBLISH = 'game.publish',

    // Config
    CONFIG_READ = 'config.read',
    CONFIG_WRITE = 'config.write',

    // Symbols
    SYMBOL_READ = 'symbol.read',
    SYMBOL_WRITE = 'symbol.write',

    // Reels
    REEL_READ = 'reel.read',
    REEL_WRITE = 'reel.write',

    // Paytable
    PAYTABLE_READ = 'paytable.read',
    PAYTABLE_WRITE = 'paytable.write',

    // Assets
    ASSET_READ = 'asset.read',
    ASSET_WRITE = 'asset.write',
    ASSET_DELETE = 'asset.delete',

    // Settings
    SETTINGS_READ = 'settings.read',
    SETTINGS_WRITE = 'settings.write',

    // Users
    USER_READ = 'user.read',
    USER_WRITE = 'user.write',
    USER_DELETE = 'user.delete',
}