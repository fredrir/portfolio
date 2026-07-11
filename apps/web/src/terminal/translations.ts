export interface TerminalStrings {
  availableCommands: string;
  helpDesc: string;
  fractDesc: string;
  runningFract: string;
  neofetchDesc: string;
  lsDesc: string;
  cdDesc: string;
  pwdDesc: string;
  catDesc: string;
  clearDesc: string;
  whoamiDesc: string;
  dateDesc: string;
  echoDesc: string;
  treeDesc: string;
  aboutDesc: string;
  unameDesc: string;
  uptimeDesc: string;
  openDesc: string;
  closeDesc: string;
  snakeDesc: string;
  game2048Desc: string;
  commandNotFound: string;
  noSuchFileOrDir: string;
  notADirectory: string;
  isADirectory: string;
  missingFileOperand: string;
  cannotAccessDir: string;
  opening: string;
  closing: string;
  usageOpen: string;
  usageClose: string;
  unknownPane: string;
  available: string;
  cannotCloseTerminal: string;
  wmOnly: string;
  wmOnlyOpenClose: string;
  startingSnake: string;
  starting2048: string;
  gameOver: string;
  pressQToQuit: string;
  inputPlaceholder: string;
  wasmPluginFailed: string;
  unknownError: string;
  aboutBuiltWith: string;
  aboutHelp: string;
  aboutRepository: string;
  aboutAuthor: string;
  up: string;
  application: string;
  profileDeveloperOf: string;
  profileContact: string;
  nodeExecutable: string;
  systemStarted: string;
  terminalInitialized: string;
  readyForCommands: string;
  cannotAccess: string;
  emptyDirectory: string;
  emptyFile: string;
  score: string;
  arrowKeysToMove: string;
  qToQuit: string;
  gameOverFinalScore: string;
  pressExit: string;
  youWinScore: string;
  noMovesLeftScore: string;
  neofetch: {
    os: string;
    kernel: string;
    uptime: string;
    shell: string;
    wm: string;
    theme: string;
    packages: string;
    locale: string;
  };
}

const en: TerminalStrings = {
  availableCommands: "Available commands:",
  helpDesc: "Show this help message",
  fractDesc: "ASCII Mandelbrot rendered by a Rust WASM plugin",
  runningFract: "loading wasm plugin…",
  neofetchDesc: "System information display",
  lsDesc: "List directory contents",
  cdDesc: "Change directory",
  pwdDesc: "Print working directory",
  catDesc: "Display file contents",
  clearDesc: "Clear terminal",
  whoamiDesc: "Display current user",
  dateDesc: "Show current date and time",
  echoDesc: "Display text",
  treeDesc: "Show directory tree",
  aboutDesc: "About this terminal",
  unameDesc: "System information",
  uptimeDesc: "System uptime",
  openDesc: "Open a pane",
  closeDesc: "Close a pane",
  snakeDesc: "Play Snake",
  game2048Desc: "Play 2048",
  commandNotFound: "command not found",
  noSuchFileOrDir: "No such file or directory",
  notADirectory: "not a directory",
  isADirectory: "Is a directory",
  missingFileOperand: "missing file operand",
  cannotAccessDir: "Cannot access current directory",
  opening: "Opening",
  closing: "Closing",
  usageOpen: "Usage: open <pane>",
  usageClose: "Usage: close <pane>",
  unknownPane: "Unknown pane",
  available: "Available",
  cannotCloseTerminal: "Cannot close the terminal from itself.",
  wmOnly: "Games are only available in the window manager terminal.",
  wmOnlyOpenClose: "open/close commands are only available in the window manager terminal.",
  startingSnake: "Starting Snake...",
  starting2048: "Starting 2048...",
  gameOver: "Game over! Score",
  pressQToQuit: "Press q or Escape to quit",
  inputPlaceholder: "Type 'help' for commands...",
  wasmPluginFailed: "wasm plugin failed to load",
  unknownError: "Unknown error",
  aboutBuiltWith: "Built with TanStack Start + Rust (Axum) + Tailwind",
  aboutHelp: "Type 'help' for available commands",
  aboutRepository: "Repository",
  aboutAuthor: "Author",
  up: "up",
  application: "Application",
  profileDeveloperOf: "Developer of FredrikOS",
  profileContact: "Contact",
  nodeExecutable: "Node.js executable",
  systemStarted: "System started",
  terminalInitialized: "Terminal initialized",
  readyForCommands: "Ready for commands",
  cannotAccess: "cannot access",
  emptyDirectory: "(empty directory)",
  emptyFile: "(empty file)",
  score: "Score",
  arrowKeysToMove: "Arrow keys to move",
  qToQuit: "q to quit",
  gameOverFinalScore: "Game Over! Final score",
  pressExit: "Press q or Escape to exit.",
  youWinScore: "You win! Score",
  noMovesLeftScore: "No moves left! Score",
  neofetch: {
    os: "OS",
    kernel: "Kernel",
    uptime: "Uptime",
    shell: "Shell",
    wm: "WM",
    theme: "Theme",
    packages: "Packages",
    locale: "Locale",
  },
};

const nb: TerminalStrings = {
  availableCommands: "Tilgjengelige kommandoer:",
  helpDesc: "Vis denne hjelpemeldingen",
  fractDesc: "ASCII-Mandelbrot fra en Rust WASM-plugin",
  runningFract: "laster wasm-plugin…",
  neofetchDesc: "Vis systeminformasjon",
  lsDesc: "List innholdet i mappen",
  cdDesc: "Bytt mappe",
  pwdDesc: "Vis nåværende mappe",
  catDesc: "Vis filinnhold",
  clearDesc: "Tøm terminalen",
  whoamiDesc: "Vis gjeldende bruker",
  dateDesc: "Vis dato og klokkeslett",
  echoDesc: "Vis tekst",
  treeDesc: "Vis mappetreet",
  aboutDesc: "Om denne terminalen",
  unameDesc: "Systeminformasjon",
  uptimeDesc: "Oppetid",
  openDesc: "Åpne et panel",
  closeDesc: "Lukk et panel",
  snakeDesc: "Spill Snake",
  game2048Desc: "Spill 2048",
  commandNotFound: "kommando ikke funnet",
  noSuchFileOrDir: "Ingen slik fil eller mappe",
  notADirectory: "ikke en mappe",
  isADirectory: "Er en mappe",
  missingFileOperand: "mangler filoperand",
  cannotAccessDir: "Kan ikke åpne gjeldende mappe",
  opening: "Åpner",
  closing: "Lukker",
  usageOpen: "Bruk: open <panel>",
  usageClose: "Bruk: close <panel>",
  unknownPane: "Ukjent panel",
  available: "Tilgjengelige",
  cannotCloseTerminal: "Kan ikke lukke terminalen fra seg selv.",
  wmOnly: "Spill er kun tilgjengelige i vindusbehandlerens terminal.",
  wmOnlyOpenClose: "open/close-kommandoer er kun tilgjengelige i vindusbehandlerens terminal.",
  startingSnake: "Starter Snake...",
  starting2048: "Starter 2048...",
  gameOver: "Spillet er over! Poeng",
  pressQToQuit: "Trykk q eller Escape for å avslutte",
  inputPlaceholder: "Skriv 'help' for kommandoer...",
  wasmPluginFailed: "klarte ikke laste wasm-plugin",
  unknownError: "Ukjent feil",
  aboutBuiltWith: "Bygget med TanStack Start + Rust (Axum) + Tailwind",
  aboutHelp: "Skriv 'help' for tilgjengelige kommandoer",
  aboutRepository: "Repo",
  aboutAuthor: "Forfatter",
  up: "oppe",
  application: "Applikasjon",
  profileDeveloperOf: "Utvikler av FredrikOS",
  profileContact: "Kontakt",
  nodeExecutable: "Node.js-kjørbar fil",
  systemStarted: "System startet",
  terminalInitialized: "Terminal initialisert",
  readyForCommands: "Klar for kommandoer",
  cannotAccess: "kan ikke åpne",
  emptyDirectory: "(tom mappe)",
  emptyFile: "(tom fil)",
  score: "Poeng",
  arrowKeysToMove: "Piltaster for å flytte",
  qToQuit: "q for å avslutte",
  gameOverFinalScore: "Spillet er over! Sluttpoeng",
  pressExit: "Trykk q eller Escape for å avslutte.",
  youWinScore: "Du vant! Poeng",
  noMovesLeftScore: "Ingen trekk igjen! Poeng",
  neofetch: {
    os: "OS",
    kernel: "Kjerne",
    uptime: "Oppetid",
    shell: "Skall",
    wm: "VM",
    theme: "Tema",
    packages: "Pakker",
    locale: "Språk",
  },
};

const nn: TerminalStrings = {
  availableCommands: "Tilgjengelege kommandoar:",
  helpDesc: "Vis denne hjelpemeldinga",
  fractDesc: "ASCII-Mandelbrot frå ein Rust WASM-plugin",
  runningFract: "lastar wasm-plugin…",
  neofetchDesc: "Vis systeminformasjon",
  lsDesc: "List innhaldet i mappa",
  cdDesc: "Byt mappe",
  pwdDesc: "Vis noverande mappe",
  catDesc: "Vis filinnhald",
  clearDesc: "Tøm terminalen",
  whoamiDesc: "Vis gjeldande brukar",
  dateDesc: "Vis dato og klokkeslett",
  echoDesc: "Vis tekst",
  treeDesc: "Vis mappetreet",
  aboutDesc: "Om denne terminalen",
  unameDesc: "Systeminformasjon",
  uptimeDesc: "Oppetid",
  openDesc: "Opne eit panel",
  closeDesc: "Lukk eit panel",
  snakeDesc: "Spel Snake",
  game2048Desc: "Spel 2048",
  commandNotFound: "kommando ikkje funnen",
  noSuchFileOrDir: "Inga slik fil eller mappe",
  notADirectory: "ikkje ei mappe",
  isADirectory: "Er ei mappe",
  missingFileOperand: "manglar filoperand",
  cannotAccessDir: "Kan ikkje opne gjeldande mappe",
  opening: "Opnar",
  closing: "Lukkar",
  usageOpen: "Bruk: open <panel>",
  usageClose: "Bruk: close <panel>",
  unknownPane: "Ukjent panel",
  available: "Tilgjengelege",
  cannotCloseTerminal: "Kan ikkje lukke terminalen frå seg sjølv.",
  wmOnly: "Spel er berre tilgjengelege i vindaugshandsamaren sin terminal.",
  wmOnlyOpenClose:
    "open/close-kommandoar er berre tilgjengelege i vindaugshandsamaren sin terminal.",
  startingSnake: "Startar Snake...",
  starting2048: "Startar 2048...",
  gameOver: "Spelet er over! Poeng",
  pressQToQuit: "Trykk q eller Escape for å avslutte",
  inputPlaceholder: "Skriv 'help' for kommandoar...",
  wasmPluginFailed: "klarte ikkje laste wasm-plugin",
  unknownError: "Ukjend feil",
  aboutBuiltWith: "Bygd med TanStack Start + Rust (Axum) + Tailwind",
  aboutHelp: "Skriv 'help' for tilgjengelege kommandoar",
  aboutRepository: "Repo",
  aboutAuthor: "Forfattar",
  up: "oppe",
  application: "Applikasjon",
  profileDeveloperOf: "Utviklar av FredrikOS",
  profileContact: "Kontakt",
  nodeExecutable: "Node.js-køyrbar fil",
  systemStarted: "System starta",
  terminalInitialized: "Terminal initialisert",
  readyForCommands: "Klar for kommandoar",
  cannotAccess: "kan ikkje opne",
  emptyDirectory: "(tom mappe)",
  emptyFile: "(tom fil)",
  score: "Poeng",
  arrowKeysToMove: "Piltastar for å flytte",
  qToQuit: "q for å avslutte",
  gameOverFinalScore: "Spelet er over! Sluttpoeng",
  pressExit: "Trykk q eller Escape for å avslutte.",
  youWinScore: "Du vann! Poeng",
  noMovesLeftScore: "Ingen trekk att! Poeng",
  neofetch: {
    os: "OS",
    kernel: "Kjerne",
    uptime: "Oppetid",
    shell: "Skal",
    wm: "VM",
    theme: "Tema",
    packages: "Pakkar",
    locale: "Språk",
  },
};

const fr: TerminalStrings = {
  availableCommands: "Commandes disponibles :",
  helpDesc: "Afficher ce message d'aide",
  fractDesc: "Mandelbrot ASCII rendu par un plugin WASM Rust",
  runningFract: "chargement du plugin wasm…",
  neofetchDesc: "Afficher les informations système",
  lsDesc: "Lister le contenu du répertoire",
  cdDesc: "Changer de répertoire",
  pwdDesc: "Afficher le répertoire courant",
  catDesc: "Afficher le contenu d'un fichier",
  clearDesc: "Effacer le terminal",
  whoamiDesc: "Afficher l'utilisateur actuel",
  dateDesc: "Afficher la date et l'heure",
  echoDesc: "Afficher du texte",
  treeDesc: "Afficher l'arborescence",
  aboutDesc: "À propos de ce terminal",
  unameDesc: "Informations système",
  uptimeDesc: "Temps de fonctionnement",
  openDesc: "Ouvrir un panneau",
  closeDesc: "Fermer un panneau",
  snakeDesc: "Jouer à Snake",
  game2048Desc: "Jouer à 2048",
  commandNotFound: "commande introuvable",
  noSuchFileOrDir: "Aucun fichier ou répertoire de ce type",
  notADirectory: "n'est pas un répertoire",
  isADirectory: "Est un répertoire",
  missingFileOperand: "opérande de fichier manquant",
  cannotAccessDir: "Impossible d'accéder au répertoire courant",
  opening: "Ouverture de",
  closing: "Fermeture de",
  usageOpen: "Usage : open <panneau>",
  usageClose: "Usage : close <panneau>",
  unknownPane: "Panneau inconnu",
  available: "Disponibles",
  cannotCloseTerminal: "Impossible de fermer le terminal depuis lui-même.",
  wmOnly: "Les jeux ne sont disponibles que dans le terminal du gestionnaire de fenêtres.",
  wmOnlyOpenClose:
    "Les commandes open/close ne sont disponibles que dans le terminal du gestionnaire de fenêtres.",
  startingSnake: "Lancement de Snake...",
  starting2048: "Lancement de 2048...",
  gameOver: "Fin de partie ! Score",
  pressQToQuit: "Appuyez sur q ou Échap pour quitter",
  inputPlaceholder: "Tapez 'help' pour les commandes...",
  wasmPluginFailed: "échec du chargement du plugin wasm",
  unknownError: "Erreur inconnue",
  aboutBuiltWith: "Construit avec TanStack Start + Rust (Axum) + Tailwind",
  aboutHelp: "Tapez 'help' pour les commandes disponibles",
  aboutRepository: "Dépôt",
  aboutAuthor: "Auteur",
  up: "actif depuis",
  application: "Application",
  profileDeveloperOf: "Développeur de FredrikOS",
  profileContact: "Contact",
  nodeExecutable: "Exécutable Node.js",
  systemStarted: "Système démarré",
  terminalInitialized: "Terminal initialisé",
  readyForCommands: "Prêt pour les commandes",
  cannotAccess: "impossible d'accéder à",
  emptyDirectory: "(répertoire vide)",
  emptyFile: "(fichier vide)",
  score: "Score",
  arrowKeysToMove: "Flèches pour déplacer",
  qToQuit: "q pour quitter",
  gameOverFinalScore: "Fin de partie ! Score final",
  pressExit: "Appuyez sur q ou Échap pour quitter.",
  youWinScore: "Vous gagnez ! Score",
  noMovesLeftScore: "Plus de coups ! Score",
  neofetch: {
    os: "OS",
    kernel: "Noyau",
    uptime: "Disponibilité",
    shell: "Shell",
    wm: "WM",
    theme: "Thème",
    packages: "Paquets",
    locale: "Langue",
  },
};

const translations: Record<string, TerminalStrings> = { en, nb, nn, fr };

export function getTerminalStrings(locale?: string): TerminalStrings {
  return translations[locale ?? "en"] ?? en;
}
