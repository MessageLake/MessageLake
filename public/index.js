const feedForm = document.querySelector('.feedForm');
const feed = document.querySelector(".feed");

feedForm.addEventListener('submit', (event) => {
  event.preventDefault();
  fetch('http://localhost:3000/feed')
    .then(response => response.json())
    .then(json => {
      json.messages.forEach(message => {
        const feedItem = newFeedItem(message);
        feed.append(feedItem);
      })
      console.log(json);
    })
    .catch(error => console.error(error));
});

function newFeedItem(message) {
  const wrapper = document.createElement('div');
  const author = document.createElement('p');
  const content = document.createElement('p');
  author.innerText = message.author;
  content.innerText = message.content;
  wrapper.appendChild(author);
  wrapper.appendChild(content);
  return wrapper;
}