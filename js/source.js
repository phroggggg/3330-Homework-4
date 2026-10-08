// *********************************************************************
// Homework 4 Public APIs
// *********************************************************************

function formatYearFromStr(dateString) {
  return dateString.split('-')[0];
}

function formatPercentage(value) {
  return `${(value * 100).toFixed(2)}%`;
}

localStorage.setItem("game_id", "");
localStorage.setItem("api_key", "");

async function getJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed (${response.status}): ${url}`);
    }
    return response.json();
}

async function load(){
    
    // add as many more as needed
    const GAME_NAME = "Subnautica";
    const BASE_URL = "https://api.gamebrain.co/v1";
    let gameID = localStorage.getItem("game_id");
    let apiKey = localStorage.getItem("api_key");
    
    // **************** Write you code below **************** 

    if (!gameID) {
        const search = await getJSON(
            `${BASE_URL}/games?query=${encodeURIComponent(GAME_NAME)}&api-key=${apiKey}`
        );
        gameID = search.results[0].id;
        localStorage.setItem("game_id", gameID);
    }
 
    // Fetch all three endpoints at the same time
    const [game, newsData, similarData] = await Promise.all([
        getJSON(`${BASE_URL}/games/${gameID}?api-key=${apiKey}`),
        getJSON(`${BASE_URL}/games/${gameID}/news?limit=3&api-key=${apiKey}`),
        getJSON(`${BASE_URL}/games/${gameID}/similar?limit=4&api-key=${apiKey}`)
    ]);
 
    // ---- Hero section ----
    document.querySelector("#game-name").textContent = game.name;
    document.querySelector(".game-image img").src = game.image;
    document.querySelector(".game-image img").alt = `${game.name} artwork`;
    document.querySelector(".game-genre").textContent = game.genre;
    document.querySelector(".game-meta").textContent =
        `${game.developer} • ${formatYearFromStr(game.release_date)}`;

    // ---- Game News ----
    const newsCards = document.querySelectorAll(".news-card");
    const news = (newsData.news || []).slice(0, 3);
    newsCards.forEach((card, i) => {
        const item = news[i];
        if (!item) {
            card.style.display = "none";
            return;
        }
        card.style.display = "";
        card.querySelector("img").src = item.image;
        card.querySelector("img").alt = item.title;
        card.querySelector("h3").textContent = item.title;
        card.querySelector(".news-published").textContent = `Published ${item.published}`;
    });




}
load();


   