const stateList = document.getElementById('state-list');
const grid = document.getElementById('restaurant-grid');
const detail = document.getElementById('restaurant-detail');
const stateTitle = document.getElementById('state-title');
const resultCount = document.getElementById('result-count');
const search = document.getElementById('restaurant-search');
const cityFilter = document.getElementById('city-filter');
const empty = document.getElementById('empty-state');

function createStateButtons() {
  stateList.replaceChildren();

  const restaurantStates = [
    ...new Set(
      restaurants
        .map(restaurant => restaurant.state)
        .filter(Boolean)
    )
  ].sort();

  const allStates = [
    'All places',
    ...restaurantStates
  ];

  allStates.forEach(state => {
    const isSelected = state === selectedState;

    const button = createElement(
      'button',
      isSelected
        ? 'state-btn active'
        : 'state-btn'
    );

    button.type = 'button';

    button.setAttribute(
      'aria-pressed',
      String(isSelected)
    );

    const label =
      state === 'All places'
        ? '♡ All places'
        : '📍 ' + state;

    button.append(
      createElement('span', '', label)
    );

    button.append(
      createElement(
        'span',
        '',
        isSelected ? '›' : ''
      )
    );

    button.addEventListener('click', () => {
      selectedState = state;
      selectedId = null;

      detail.hidden = true;
      search.value = '';

      createStateButtons();
      createCityOptions();
      displayRestaurants();
    });

    stateList.append(button);
  });
}

let restaurants = [];
let selectedState = 'Ohio';
let selectedId = null;


function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}


function cleanUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);

    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return url.href;
    }

    return null;
  } catch {
    return null;
  }
}


function createStateButtons() {
  stateList.replaceChildren();

  const restaurantStates = restaurants
    .map(restaurant => restaurant.state)
    .filter(Boolean);

  const allStates = [
    'All places',
    ...new Set([
      ...states,
      ...restaurantStates
    ])
  ];

  allStates.forEach(state => {
    const isSelected = state === selectedState;

    const button = createElement(
      'button',
      isSelected ? 'state-btn active' : 'state-btn'
    );

    button.type = 'button';

    button.setAttribute(
      'aria-pressed',
      String(isSelected)
    );

    const label =
      state === 'All places'
        ? '♡ All places'
        : '📍 ' + state;

    button.append(
      createElement('span', '', label)
    );

    button.append(
      createElement(
        'span',
        '',
        isSelected ? '›' : ''
      )
    );

    button.addEventListener('click', () => {
      selectedState = state;
      selectedId = null;

      detail.hidden = true;
      search.value = '';

      createStateButtons();
      createCityOptions();
      displayRestaurants();
    });

    stateList.append(button);
  });
}


function getRestaurantsByState() {
  return restaurants.filter(restaurant => {
    if (selectedState === 'All places') {
      return true;
    }

    return restaurant.state === selectedState;
  });
}


function createCityOptions() {
  const matchingRestaurants = getRestaurantsByState();

  const cities = [
    ...new Set(
      matchingRestaurants
        .map(restaurant => restaurant.city)
        .filter(Boolean)
    )
  ].sort();

  cityFilter.replaceChildren(
    new Option('All cities', '')
  );

  cities.forEach(city => {
    cityFilter.add(
      new Option(city, city)
    );
  });
}


function displayRestaurants() {
  const searchText = search.value
    .trim()
    .toLowerCase();

  const selectedCity = cityFilter.value;

  const matchingRestaurants = getRestaurantsByState();

  const filteredRestaurants = matchingRestaurants.filter(restaurant => {
    const matchesCity =
      !selectedCity ||
      restaurant.city === selectedCity;

    const searchableText = [
      restaurant.name,
      restaurant.city,
      restaurant.state,
      restaurant.caption
    ];

    const matchesSearch =
      !searchText ||
      searchableText.some(value =>
        String(value || '')
          .toLowerCase()
          .includes(searchText)
      );

    return matchesCity && matchesSearch;
  });

  if (selectedState === 'All places') {
    stateTitle.textContent = 'All Places';
  } else {
    stateTitle.textContent = selectedState;
  }

  resultCount.textContent =
    filteredRestaurants.length +
    ' ' +
    (filteredRestaurants.length === 1
      ? 'place'
      : 'places');

  grid.replaceChildren();

  empty.hidden =
    filteredRestaurants.length !== 0;

  filteredRestaurants.forEach(restaurant => {
    createRestaurantCard(restaurant);
  });
}


function createRestaurantCard(restaurant) {
  const isSelected =
    restaurant.id === selectedId;

  const button = createElement(
    'button',
    isSelected
      ? 'restaurant-card selected'
      : 'restaurant-card'
  );

  button.type = 'button';

  button.setAttribute(
    'aria-label',
    'View details for ' + restaurant.name
  );


  if (restaurant.image) {
    const image = createElement('img');

    image.src = restaurant.image;
    image.alt = 'Photo from ' + restaurant.name;
    image.loading = 'lazy';

    image.onerror = () => {
      image.replaceWith(
        createElement(
          'div',
          'card-placeholder',
          '♡'
        )
      );
    };

    button.append(image);
  } else {
    button.append(
      createElement(
        'div',
        'card-placeholder',
        '♡'
      )
    );
  }


  button.append(
    createElement(
      'span',
      'card-shade'
    )
  );


  const restaurantInfo = createElement(
    'span',
    'card-copy'
  );

  restaurantInfo.append(
    createElement(
      'strong',
      '',
      restaurant.name
    )
  );

  const location = [
    restaurant.city,
    restaurant.state
  ]
    .filter(Boolean)
    .join(', ');

  restaurantInfo.append(
    createElement(
      'small',
      '',
      location
    )
  );

  button.append(restaurantInfo);


  button.addEventListener('click', () => {
    if (selectedId === restaurant.id) {
      selectedId = null;
    } else {
      selectedId = restaurant.id;
    }

    showRestaurantDetails();
    displayRestaurants();

    if (selectedId) {
      detail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  });

  grid.append(button);
}


function addDetailLine(
  parent,
  label,
  value,
  link
) {
  if (!value) {
    return;
  }

  const paragraph = createElement('p');

  paragraph.append(
    createElement(
      'strong',
      '',
      label + ' '
    )
  );


  if (link) {
    const anchor = createElement(
      'a',
      '',
      value
    );

    anchor.href = link;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';

    paragraph.append(anchor);
  } else {
    paragraph.append(
      document.createTextNode(value)
    );
  }

  parent.append(paragraph);
}


function showRestaurantDetails() {
  detail.replaceChildren();

  const restaurant = restaurants.find(
    restaurant =>
      restaurant.id === selectedId
  );


  if (!restaurant) {
    detail.hidden = true;
    return;
  }


  detail.hidden = false;


  const topSection = createElement(
    'div',
    'detail-top'
  );

  topSection.append(
    createElement(
      'h4',
      '',
      restaurant.name
    )
  );


  const closeButton = createElement(
    'button',
    'close-detail',
    '×'
  );

  closeButton.type = 'button';

  closeButton.setAttribute(
    'aria-label',
    'Close restaurant details'
  );

  closeButton.addEventListener('click', () => {
    selectedId = null;
    detail.hidden = true;
    displayRestaurants();
  });

  topSection.append(closeButton);

  detail.append(topSection);


  const body = createElement(
    'div',
    'detail-body'
  );


  if (restaurant.image) {
    const image = createElement(
      'img',
      'detail-image'
    );

    image.src = restaurant.image;

    image.alt =
      restaurant.name +
      ' restaurant post';

    body.append(image);
  } else {
    body.append(
      createElement(
        'div',
        'detail-image card-placeholder',
        '♡'
      )
    );
  }


  const text = createElement(
    'div',
    'detail-text'
  );


  let mapsLink = null;

  if (restaurant.address) {
    mapsLink =
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(
        restaurant.address
      );
  }


  const location =
    restaurant.address ||
    [
      restaurant.city,
      restaurant.state
    ]
      .filter(Boolean)
      .join(', ') ||
    'Address not added yet';


  addDetailLine(
    text,
    '📍 Address:',
    location,
    mapsLink
  );


  addDetailLine(
    text,
    '🍴 What we ordered:',
    restaurant.ordered ||
      'Not added yet'
  );


  addDetailLine(
    text,
    '💬 From Instagram:',
    restaurant.caption ||
      'Open the Instagram post to read the caption.'
  );


  const instagramPost = cleanUrl(
    restaurant.instagramUrl
  );


  if (instagramPost) {
    addDetailLine(
      text,
      '📸 Original post:',
      'View on Instagram ↗',
      instagramPost
    );
  }


  body.append(text);

  detail.append(body);
}


async function loadRestaurants() {
  try {
    const response = await fetch(
      'data/restaurants.json',
      {
        cache: 'no-store'
      }
    );


    if (!response.ok) {
      throw new Error(
        'Could not load restaurant data'
      );
    }


    const data = await response.json();


    if (Array.isArray(data)) {
      restaurants = data.filter(
        restaurant =>
          restaurant &&
          restaurant.name &&
          restaurant.id
      );
    } else {
      restaurants = [];
    }


  } catch (error) {
    console.warn(error);

    restaurants = [];
  }


  createStateButtons();
  createCityOptions();
  displayRestaurants();
}


search.addEventListener(
  'input',
  displayRestaurants
);


cityFilter.addEventListener(
  'change',
  displayRestaurants
);


loadRestaurants();
