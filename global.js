console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'CV(Resume)/', title: 'CV(Resume)' },
    { url: 'https://github.com/mazou-a', title: 'GitHub' }
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
      }

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host !== location.host) {
        a.target = '_blank';
    }

    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
        }
  }

document.body.insertAdjacentHTML(
'afterbegin',
`
    <label class="color-scheme">
        Theme:
        <select id="theme-selector">
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>`
);

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    
    localStorage.setItem('colorScheme', colorScheme);
}

const select = document.querySelector('select');

select.addEventListener('input', function (event) {
    localStorage.colorScheme = event.target.value

    setColorScheme(localStorage.colorScheme);

    console.log('color scheme changed to', event.target.value);
  });

if (localStorage.colorScheme) {
    setColorScheme(localStorage.colorScheme);
    select.value = localStorage.colorScheme;
} else {
    setColorScheme('light dark');
    select.value = 'light dark';
}
