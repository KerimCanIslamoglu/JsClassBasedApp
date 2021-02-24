import data from "./data.js";
import { searchMovieByTitle, makeBgActive } from "./helpers.js";

class MoviesApp {
    constructor(options) {
        const { root, searchInput, searchForm, yearHandler, genreHandler, yearSubmitter, genreSubmitter, filterByYearDiv, filterByGenreDiv } = options;
        this.$tableEl = document.getElementById(root);
        this.$tbodyEl = this.$tableEl.querySelector("tbody");

        this.$searchInput = document.getElementById(searchInput);
        this.$searchForm = document.getElementById(searchForm);
        this.yearHandler = yearHandler;
        this.genreHandler = genreHandler;
        this.$yearSubmitter = document.getElementById(yearSubmitter);
        this.$genreSubmitter = document.getElementById(genreSubmitter);
        this.$filterByYearDiv = document.getElementById(filterByYearDiv);
        this.$filterByGenreDiv = document.getElementById(filterByGenreDiv);
    }

    createMovieEl(movie) {
        const { image, title, genre, year, id } = movie;
        return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`
    }


    createFilterYearEl(uniqueYear) {
        let str = `<div class="form-check"><input class="form-check-input" type="radio" name="year" id="year" value="${uniqueYear.value}"><label class="form-check-label" for="year1">${uniqueYear.value}  (${uniqueYear.count})</label></div>`
        this.$filterByYearDiv.insertAdjacentHTML('beforeend', str);

    }

    createFilterGenreEl(uniqueGenre) {
        let str = `<div class="form-check"><input class="form-check-input genreCheckbox" type="checkbox" value="${uniqueGenre.value}" id="flexCheckDefault"><label class="form-check-label" for="flexCheckDefault">${uniqueGenre.value} (${uniqueGenre.count})</label></div>`
        this.$filterByGenreDiv.insertAdjacentHTML('beforeend', str);

    }

    fillTable() {
        const moviesArr = data.map((movie) => {
            return this.createMovieEl(movie)
        }).join("");
        this.$tbodyEl.innerHTML = moviesArr;
    }
    removeDupes(arr) {
        var result = {};
        var i = arr.length;

        while (i--) {

            if (result.hasOwnProperty(arr[i])) {
                result[arr[i]]++;
                arr.splice(i, 1);

            } else {
                result[arr[i]] = 1;
            }
        }

        return Object.keys(result).map(function (p) { return { value: p, count: result[p] }; });
    }
    fillYearFilter() {
        const yearArray = data.map((movie) => {
            return movie.year;
        });
        const uniqueYears = this.removeDupes(yearArray);
        uniqueYears.forEach((uniqueYear) => {
            this.createFilterYearEl(uniqueYear);
        });
    }

    fillGenreFilter() {
        const genreArray = data.map((movie) => {
            return movie.genre;
        });
        const uniqueGenres = this.removeDupes(genreArray);
        uniqueGenres.forEach((uniqueGenre) => {
            this.createFilterGenreEl(uniqueGenre);
        });
    }

    reset() {
        this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
            item.style.background = "transparent";
        })
    }


    handleSearch() {
        this.$searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.reset();
            const searchValue = this.$searchInput.value;
            const matchedMovies = data.filter((movie) => {
                return searchMovieByTitle(movie, searchValue);
            }).forEach(makeBgActive)
            this.$searchInput.value = "";
        });
    }

    handleYearFilter() {
        this.$yearSubmitter.addEventListener("click", () => {
            this.reset();
            const selectedYear = document.querySelector(`input[name='${this.yearHandler}']:checked`).value
            const matchedMovies = data.filter((movie) => {
                return movie.year === selectedYear;
            }).forEach(makeBgActive)
        });
    }

    handleGenreFilter() {
        this.$genreSubmitter.addEventListener("click", () => {
            this.reset();
            const selectedGenre = document.getElementsByClassName("genreCheckbox")
            let selectedGenreArr = [];
            for (let i = 0; i < selectedGenre.length; i++) {
                if (selectedGenre[i].checked)
                    selectedGenreArr.push(selectedGenre[i].value)
            }
            const matchedMovies = data.filter((movie) => {

                return selectedGenreArr.includes(movie.genre);
            }).forEach(makeBgActive)
        });
    }

    init() {
        this.fillTable();
        this.fillYearFilter();
        this.fillGenreFilter()
        this.handleSearch();
        this.handleYearFilter();
        this.handleGenreFilter();
    }
}

let myMoviesApp = new MoviesApp({
    root: "movies-table",
    searchInput: "searchInput",
    searchForm: "searchForm",
    yearHandler: "year",
    genreHandler: "genre",
    yearSubmitter: "yearSubmitter",
    genreSubmitter: "genreSubmitter",
    filterByYearDiv: "filterByYearDiv",
    filterByGenreDiv: "filterByGenreDiv",
});

myMoviesApp.init();
