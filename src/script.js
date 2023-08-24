// Titulos: http://www.omdbapi.com/?s= &apikey=2f828999
// Detalles: http://www.omdbapi.com/?i= &apikey=2f828999

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm){
    const URL = `http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=2f828999`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    }else{
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A"){
            moviePoster = movies[idx].Poster;
        }else{
            moviePoster="";
        }
        movieListItem.innerHTML = `
        <div class="search-list-item">
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }

    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=2f828999`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster != "N/A") ? details.Poster : ""}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Año: ${details.Year}</li>
                <li class="rated">Puntuación: ${details.Rated}</li>
                <li class="released">Lanzamiento: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genero:</b>${details.Genre}</p>
            <p class="writer"><b>Escritor:</b>${details.Writer}</p>
            <p class="actors"><b>Actores:</b>${details.Actors}</p>
            <p class="plot"><b>Resumen:</b>${details.Plot}</p>
            <p class="Language"><b>Lenguaje:</b>${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b>${details.Awards}</p>
        </div>
    `;
}