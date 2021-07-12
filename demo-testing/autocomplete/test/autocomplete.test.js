const waitFor = (selector) => {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        resolve()
      }
    }, 30)

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      reject()
    }, 2000)
  })
}

// Hook that execute before each test.
// Use to setup the testing environment.
beforeEach(() => {
  const root = document.querySelector('#target')
  root.innerHTML = ''
  createAutoComplete({
    root,
    fetchData() {
      return [
        { Title: 'Avengers' },
        { Title: 'Not Avengers' },
        { Title: 'Some other movie' }
      ]
    },
    renderOption(movie) {
      return movie.Title
    }
  })
})

it('Dropdown starts closed', () => {
  const dropdown = document.querySelector('.dropdown')
  expect(dropdown.className).not.to.include('is-active')
})

it('After searching, dropdown opens up', async () => {
  const input = document.querySelector('#target input')
  input.value = 'avengers'
  input.dispatchEvent(new Event('input'))

  await waitFor('.dropdown-item')

  const dropdown = document.querySelector('.dropdown')
  expect(dropdown.className).to.include('is-active')
})

it('After searching, displays some results', async () => {
  const input = document.querySelector('#target input')
  input.value = 'avengers'
  input.dispatchEvent(new Event('input'))

  await waitFor('.dropdown-item')

  const items = document.querySelectorAll('.dropdown-item')

  expect(items.length).to.equal(3)
})
