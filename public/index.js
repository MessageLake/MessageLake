const state = {
  author: ''
};

const HOSTS = { dev: 'http://127.0.0.1:3000' };

const feedForm = document.querySelector('.feedForm');
const feedWrapper = document.querySelector(".feedWrapper");

feedForm.addEventListener('submit', (event) => {
  event.preventDefault();
  getFeed(event);
});

function getFeed(event) {
  fetch(`${HOSTS.dev}/feed`)
    .then(response => response.json())
    .then(json => {
      const feed = document.createElement('div');
      json.messages.forEach(message => {
        const feedItem = newFeedItem(message);
        feed.append(feedItem);
      });
      if (feedWrapper.childNodes.length > 0) {
        const oldFeed = feedWrapper.childNodes[0];
        feedWrapper.replaceChild(feed, oldFeed);
      } else {
        feedWrapper.appendChild(feed);
      }
      console.log(json);
    })
    .catch(error => console.error(error));
}

function newFeedItem(message) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('feedItem');
  const author = document.createElement('span');
  const content = document.createElement('p');
  author.innerHTML = `<em>${message.author}</em>`;
  content.innerText = message.content;
  wrapper.appendChild(author);
  wrapper.appendChild(content);
  return wrapper;
}

const signInForm = document.querySelector('.signInForm');
signInForm.addEventListener('submit', (event) => {
  event.preventDefault();
  signIn(event);
});

function signIn(event) {
  const body = { author: event.srcElement.elements[0].value };
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };

  console.log(event);

  fetch(`${HOSTS.dev}/signin`, options)
    .then(response => response.json())
    .then((json) => {
      state.author = json.author;
      displayAuthorName();
    })
    .catch(error => console.error(error));
}

function displayAuthorName() {
  const authorHeader = document.querySelector('.authorHeader');
  authorHeader.innerText = `You are: ${state.author}`;
}