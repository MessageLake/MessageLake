const feedForm = document.querySelector('.feedForm');
const feedWrapper = document.querySelector(".feedWrapper");

feedForm.addEventListener('submit', (event) => {
  event.preventDefault();
  fetch('http://localhost:3000/feed')
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
});

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
