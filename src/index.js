let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector('#toy-collection');

  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(obj => {
    // console.log(obj)
    obj.forEach(toy => {
      toyCollection.appendChild(createCard(toy))
    })
  })

  toyFormContainer.addEventListener('submit', function(e){
    e.preventDefault()
    let configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      body: JSON.stringify({
        'name': e.target[0].value,
        'image': e.target[1].value,
        'likes': 0
      })
    }
    fetch('http://localhost:3000/toys', configObj)
    .then(resp => resp.json())
    .then(obj => toyCollection.appendChild(createCard(obj)));
  })

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function createCard(toy){
  let div = document.createElement('div');
  div.className = 'card';
  let h2 = document.createElement('h2');
  h2.innerText = toy.name;
  let img = document.createElement('img');
  img.src = toy.image;
  img.className = 'toy-avatar';
  let p = document.createElement('p');
  p.innerText = `${toy.likes} Likes`
  let button = document.createElement('button');
  button.className = 'like-btn';
  button.id = toy.id;
  button.innerText = 'Like'
  button.addEventListener('click', function(e){
    handleLike(e);
  })
  div.appendChild(h2);
  div.appendChild(img);
  div.appendChild(p);
  div.appendChild(button);
  return div;
}

function handleLike(event){
  // console.log(event)
  let likes = parseInt(event.target.previousSibling.innerText[0])
  // console.log(likes)
  let configObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'likes': likes + 1
    })
  }

  fetch(`http://localhost:3000/toys/${event.target.id}`, configObj)
  .then(resp => resp.json())
  .then(obj => {
    event.target.previousSibling.innerText = `${obj.likes} Likes`
  })
}