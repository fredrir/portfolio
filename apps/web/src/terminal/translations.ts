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
  wmOnlyOpenClose: "open/close-kommandoar er berre tilgjengelege i vindaugshandsamaren sin terminal.",
  startingSnake: "Startar Snake...",
  starting2048: "Startar 2048...",
  gameOver: "Spelet er over! Poeng",
  pressQToQuit: "Trykk q eller Escape for å avslutte",
  inputPlaceholder: "Skriv 'help' for kommandoar...",
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
  wmOnlyOpenClose: "Les commandes open/close ne sont disponibles que dans le terminal du gestionnaire de fenêtres.",
  startingSnake: "Lancement de Snake...",
  starting2048: "Lancement de 2048...",
  gameOver: "Fin de partie ! Score",
  pressQToQuit: "Appuyez sur q ou Échap pour quitter",
  inputPlaceholder: "Tapez 'help' pour les commandes...",
};

const translations: Record<string, TerminalStrings> = { en, nb, nn, fr };

export function getTerminalStrings(locale?: string): TerminalStrings {
  return translations[locale ?? "en"] ?? en;
}
