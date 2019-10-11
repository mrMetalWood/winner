const urlSearchParams = new URLSearchParams(window.location.search);

const searchParams = [...urlSearchParams].reduce((params, [key, value]) => {
  params[key] = value;

  return params;
}, {});

let {items, seed = Date.now()} = searchParams;
items = items.split(',');

urlSearchParams.set('seed', seed);
window.history.replaceState(
  {},
  '',
  `${location.pathname}?${decodeURIComponent(urlSearchParams)}`
);

const myRandom = new Math.seedrandom(String(seed));

const container = document.querySelector('.container');

for (let i = items.length - 1; i > 0; i--) {
  const j = Math.floor(myRandom() * (i + 1));
  [items[i], items[j]] = [items[j], items[i]];
}

items = items.map(item => {
  const $item = document.createElement('div');
  $item.className = 'item';
  $item.textContent = item;
  const myRandom2 = new Math.seedrandom(item + String(seed));

  $item.style.backgroundColor = `rgb(${myRandom2() * 255},${myRandom2() *
    255},${myRandom2() * 255})`;
  container.appendChild($item);

  return {$item, progress: 0, name: item};
});

let finished = false;
let winner = null;

const intervalId = setInterval(() => {
  if (finished) {
    clearInterval(intervalId);
  }

  items = items.map(item => {
    const percentToAdd = myRandom();
    const newProgress = finished
      ? item.progress
      : Math.min(item.progress + percentToAdd, 100);
    item.$item.style.transform = `translateX(${-100 + newProgress}%)`;

    if (newProgress === 100 && !finished) {
      finished = true;
      winner = item.name;
      item.$item.style.backgroundColor = 'transparent';
      item.$item.style.backgroundImage =
        'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)';
      item.$item.style.backgroundSize = '20px 20px';
      item.$item.style.backgroundPosition =
        '0 0, 0 10px, 10px -10px, -10px 0px';

      const winnerElement = document.createElement('div');
      winnerElement.className = 'winner';
      winnerElement.textContent = `${winner} is the winner!`;
      container.appendChild(winnerElement);
    }

    return {
      ...item,
      progress: newProgress
    };
  });
}, 50);
