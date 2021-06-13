const { hash } = window.location

const message = atob(hash.replace(/#/g, ''))

if (message) {
  document.querySelector('#message-form').classList.add('hide')
  document.querySelector('#message-show').classList.remove('hide')
  document.querySelector('#message-show h1').innerHTML = message
}

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()

  document.querySelector('#message-form').classList.add('hide')
  document.querySelector('#link-form').classList.remove('hide')

  const input = document.querySelector('#message-input')
  const encrypted = btoa(input.value)

  const linkInput = document.querySelector('#link-input')

  linkInput.value = `${window.location}#${encrypted}`

  linkInput.select()
})
