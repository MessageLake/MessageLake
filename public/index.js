const state = {
  author: ''
};

const HOSTS = { dev: 'http://127.0.0.1:3000' };

/// ### Sign In ### ///

const signInForm = document.querySelector('.signInForm');
signInForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const author = event.srcElement.elements[0].value;
  signIn({ author });
});

function signIn(author) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(author)
  };

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

/// ### Publish Message ### ///

const publishForm = document.querySelector('.publishForm');
publishForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = event.srcElement.elements[0].value;
  const rawTags = event.srcElement.elements[1].value;
  const tags = rawTags.trim().split(/\s/);
  publishMessage({ message, tags });
});

function publishMessage(message) {
  const options = {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  fetch(`${HOSTS.dev}/message`, options)
    .then()
    .catch(error => console.error(error));
}

/// ### View Feed ### ///

const feedForm = document.querySelector('.feedForm');
feedForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const rawTerms = event.srcElement.elements[0].value;
  const terms = rawTerms.trim().split(/\s/);
  getFeed({ terms });
});

function getFeed(terms) {
  const feedWrapper = document.querySelector(".feedWrapper");

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
