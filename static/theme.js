if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark')
}

const button = document.createElement('a')
button.href = '#'
button.classList.add('theme-switch')
button.addEventListener('click', evt => {
    evt.preventDefault()
    const dark = document.body.classList.toggle('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
})
button.innerHTML = '🌙️ Changer de thème ☀️'
document.body.appendChild(button)
