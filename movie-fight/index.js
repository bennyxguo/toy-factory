// d9835cc5
const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
      <img src="${imgSrc}}">
      ${movie.Title} (${movie.Year})
    `
  },
  inputValue(movie) {
    return movie.Title
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com', {
      params: {
        apikey: '60b8d6ee',
        s: searchTerm,
      },
    })

    if (response.data.Error) return []

    return response.data.Search
  },
}

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('#tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  },
})

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('#tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
  },
})

let leftMovie, rightMovie
const onMovieSelect = async (movie, el, side) => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: '60b8d6ee',
      i: movie.imdbID,
    },
  })

  el.innerHTML = movieTemplate(response.data)

  if (side === 'left') {
    leftMovie = response.data
  } else {
    rightMovie = response.data
  }

  if (leftMovie && rightMovie) runComparison()
}

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  )

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index]

    const leftSideValue = parseInt(leftStat.dataset.value)
    const rightSideValue = parseInt(rightStat.dataset.value)

    if (rightSideValue > leftSideValue) {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    } else {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    }
  })
}

const movieTemplate = (movieDetail) => {
  const statistic = {
    dollars: parseInt(
      movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
    ),
    metascore: parseInt(movieDetail.Metascore),
    imdbRating: parseFloat(movieDetail.imdbRating),
    imdbVotes: parseInt(movieDetail.imdbVotes.replace(/,/g, '')),
    awards: movieDetail.Awards.split(' ').reduce((sum, award) => {
      const awardNum = parseInt(award)
      if (isNaN(awardNum)) return sum
      return sum + awardNum
    }, 0),
  }
  console.log(statistic)
  return `
    <div class="card">
      <div class="card-content">
        <article class="media">
          <figure class="media-left">
            <p class="image">
              <img src="${movieDetail.Poster}}" />
            </p>
          </figure>
          <div class="media-content">
            <div class="media-content">
              <p class="title is-4">${movieDetail.Title}</p>
              <p class="subtitle is-6">${movieDetail.Genre}</p>
              <p>${movieDetail.Plot}</p>
            </div>
          </div>
        </article>
        <article data-value="${statistic.awards}" class="notification is-primary is-light">
          <p class="title is-3">${movieDetail.Awards}</p>
          <p class="subtitle is-5">Awards</p>
        </article>
        <article data-value="${statistic.dollars}" class="notification is-primary is-light">
          <p class="title is-3">${movieDetail.BoxOffice}</p>
          <p class="subtitle is-5">Box Office</p>
        </article>
        <article data-value="${statistic.metascore}" class="notification is-primary is-light">
          <p class="title is-3">${movieDetail.Metascore}</p>
          <p class="subtitle is-5">Metascore</p>
        </article>
        <article data-value="${statistic.imdbRating}" class="notification is-primary is-light">
          <p class="title is-3">${movieDetail.imdbRating}</p>
          <p class="subtitle is-5">IMDB Rating</p>
        </article>
        <article data-value="${statistic.imdbVotes}" class="notification is-primary is-light">
          <p class="title is-3">${movieDetail.imdbVotes}</p>
          <p class="subtitle is-5">IMDB Votes</p>
        </article>
      </div>
    </div>
  `
}
