// get serach params from url
const urlSearchParams = new URLSearchParams(window.location.search);
const searchParams = [...urlSearchParams].reduce((params, [key, value]) => {
  params[key] = value;

  return params;
}, {});

const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', () => {
  urlSearchParams.delete('seed');
  window.history.replaceState(
    {},
    '',
    `${location.pathname}?${decodeURIComponent(urlSearchParams)}`
  );
  window.location.reload(false);
});

let {items, seed = Date.now()} = searchParams;
items = items.split(',');

urlSearchParams.set('seed', seed);
window.history.replaceState(
  {},
  '',
  `${location.pathname}?${decodeURIComponent(urlSearchParams)}`
);

const seedRandom = new Math.seedrandom(String(seed));
const container = document.querySelector('.container');

// shuffle items
for (let i = items.length - 1; i > 0; i--) {
  const j = Math.floor(seedRandom() * (i + 1));
  [items[i], items[j]] = [items[j], items[i]];
}

// create rows
items = items.map(item => {
  const colorRandom = new Math.seedrandom(item + String(seed));

  const $item = document.createElement('div');
  $item.style.transform = 'translateX(-100%)';
  $item.className = 'item';

  const $logoContainer = document.createElement('div');
  $logoContainer.className = 'logo-container logo-container--hidden';

  const $logo = document.createElement('img');
  $logo.src = 'twix.png';
  $logo.className = 'logo';

  const $itemText = document.createElement('div');
  $itemText.className = 'item-text';

  const color = tinycolor(
    `rgb(${colorRandom() * 255},${colorRandom() * 255},${colorRandom() * 255})`
  );

  $item.style.backgroundColor = color.getOriginalInput();

  if (color.isDark()) {
    $itemText.style.color = 'white';
  } else {
    $itemText.style.color = 'black';
  }

  const $itemTextValue = document.createElement('span');
  $itemTextValue.className = 'item-text-value';
  $itemTextValue.textContent = item;

  $logoContainer.appendChild($logo);
  $itemText.appendChild($logoContainer);
  $itemText.appendChild($itemTextValue);
  $item.appendChild($itemText);
  container.appendChild($item);

  return {$item, progress: 0, name: item};
});

let finished = false;

// loop
const intervalId = setInterval(() => {
  if (finished) {
    clearInterval(intervalId);
  }

  items = items.map(item => {
    const {$item, progress, name} = item;
    const percentToAdd = seedRandom();
    const newProgress = finished
      ? progress
      : Math.min(progress + percentToAdd, 100);

    $item
      .querySelector('.logo-container')
      .classList.add('logo-container--hidden');
    $item.style.transform = `translate3d(${-100 + newProgress}%, 0, 0)`;
    $item.style.zIndex = 0;

    if (newProgress === 100 && !finished) {
      finished = true;
      $item.classList.add('item--winner');

      const winnerElement = document.createElement('div');
      winnerElement.className = 'winner';
      winnerElement.textContent = `${name} is the winner!`;

      container.appendChild(winnerElement);
    }

    return {
      ...item,
      progress: newProgress
    };
  });

  const leader = items.slice().sort((a, b) => b.progress - a.progress)[0];
  leader.$item
    .querySelector('.logo-container')
    .classList.remove('logo-container--hidden');
  leader.$item.style.zIndex = 1;
}, 300);
