/**
 * Cosmetic-only "players online" simulation for the home dashboard's live widget.
 * RoyalGames runs on play-money chips with no cash withdrawal (see terminosYCondiciones),
 * so this blends in simulated activity to avoid an empty-feeling lobby while the real
 * player base grows — same spirit as the static per-game `players` counts already
 * shown in GamesCatalog/GameDetail.
 */

const FAKE_NICK_POOL = [
    "CarlosWins", "MariaFortuna", "ElReyDelBingo", "LunaDorada", "DiegoRuleta",
    "SofiaLucky7", "JuanPerezVIP", "GabrielaOro", "MateoChips", "ValeSuerte",
    "AndresBet", "CamilaGold", "PabloJackpot", "IsabelaWin", "SantiagoRoyal",
    "DanielaSlots", "FelipeAce", "ValentinaX", "RicardoKing", "PaolaFlash",
    "EmilianoBig", "RenataStar", "TomasCasino", "MartinaVIP", "LeoDiamante",
    "AbrilFortune", "BrunoTop", "JulietaMagic", "NicolasPro", "CamiRuleta",
    "AndreaChips77", "SebasWins", "FranciscaLuck", "MaxiRoyal", "ConstanzaGold",
    "AgustinBet21", "LauraSpin", "IgnacioAce", "ValeriaJoker", "RodrigoWin",
    "JimenaLucky", "OscarChips", "NataliaFortune", "CristianVIP", "PaulinaTop",
    "AlanBig7", "MicaelaGold", "EstebanRoyal", "GonzaloBet", "RominaSlots",
    "HectorAce", "CarolinaWin99", "FedericoKing", "YaminaStar", "AlejandroBig",
    "SoledadOro", "MauricioBet", "AntoJoker", "ThiagoRoyal", "PriscilaLuck",
];

// Fraction of simulated players shown as actively playing a game vs. just "En el sitio".
const PLAYING_RATIO = 0.55;

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/**
 * @param {number} count how many simulated players to generate
 * @param {Array<{playPath: string}>} activeGames games eligible to show as "Jugando a X"
 * @returns {Array<{id: string, nick: string, currentActivity: string|null}>}
 */
export function generateFakeOnlinePlayers(count, activeGames = []) {
    if (count <= 0) return [];
    const nicks = shuffle(FAKE_NICK_POOL).slice(0, count);
    // Pool has 60 entries; pad with numbered variants if more are ever requested.
    while (nicks.length < count) {
        const base = FAKE_NICK_POOL[nicks.length % FAKE_NICK_POOL.length];
        nicks.push(`${base}${Math.floor(Math.random() * 90) + 10}`);
    }

    return nicks.map((nick, index) => {
        const isPlaying = activeGames.length > 0 && Math.random() < PLAYING_RATIO;
        const game = isPlaying ? activeGames[Math.floor(Math.random() * activeGames.length)] : null;
        return {
            id: `sim-${index}-${nick}`,
            nick,
            currentActivity: game ? game.playPath : null,
        };
    });
}
