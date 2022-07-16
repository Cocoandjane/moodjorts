let addImageButton = document.querySelector(".buttonAddImage");
addImageButton.addEventListener("click", (event) => {
  event.preventDefault();
  let addImageForm = document.querySelector(".newPicture");
  addImageForm.classList.remove("displayNone");
});

function makeAbsoluteCard(url) {
  let absoluteDiv = document.createElement("div");
  absoluteDiv.id = "absolute";
  let absoluteImg = document.createElement("img");
  absoluteImg.id = "absoluteImg";
  absoluteImg.src = url;

  absoluteButton = document.createElement("button");
  absoluteButton.innerHTML = "&#10025";
  absoluteButton.classList.add("star", "hideAbsoluteButton");

  absoluteDiv.append(absoluteImg, absoluteButton);
  document.querySelector("main").appendChild(absoluteDiv);
}

let existingAbsolute = JSON.parse(localStorage.getItem("absoluteImg"));
if (existingAbsolute) {
  makeAbsoluteCard(existingAbsolute.url);
}


function makeCard(imgUrl, id) {
  let image = document.createElement("img");
  //add listener as we make the card (non-delegation approach)
  // image.addEventListener("click", (event) => {
  //   let btnDivs = document.querySelectorAll("div.divAllButtons");
  //   event.preventDefault();
  //   btnDivs.forEach((btnDiv) => {
  //     if (btnDiv.parentNode === image.parentNode) {
  //       btnDiv.classList.toggle("filterDiv");
  //     } else {
  //       btnDiv.classList.add("filterDiv");
  //     }
  //   });
  // });

  image.src = imgUrl;

  // TODO: can we add something about class=i or something like that, so that
  //        we have a unique key for localstorage?
  // (we're not sure if we need to, but it might be good.  we should think about it.)

  let main = document.querySelector("main");
  let div = document.createElement("div");

  let btnDiv = document.createElement("div");
  btnDiv.classList.add("divAllButtons", "filterDiv");
  cards = main.appendChild(div);
  cards.id = id,

  cards.append(image, btnDiv);
  cards.tabIndex = "0";
  let data = JSON.parse(localStorage.getItem("allImages"));
  let currentData = data.filter((d) => {
    return d.id === id;
  });
  if (data) {
    div.classList.add("card", currentData[0].size);
  } else {
    div.classList.add("card", "size5");
  }

  //madke absolute button
  absoluteButton = document.createElement("button");
  absoluteButton.innerHTML = "&#10025";
  absoluteButton.classList.add("star", "hideAbsoluteButton");
  absoluteButton.addEventListener("click", (event) => {
    let entry = {
      url: event.target.parentNode.firstChild.src,
      x: 0,
      y: 0
    };
    // add crurrent image into new local storages as new key value
    localStorage.setItem("absoluteImg", JSON.stringify(entry));

    makeAbsoluteCard(event.target.parentNode.firstChild.src);
    let url = event.target.parentNode.firstChild.src;
    // wrong: event.target.parentNode.parentNode.remove(event.target.parentNosde);
    //remove is remove a node itself
    event.target.closest(".card").remove();

    let existingImages = localStorage.getItem("allImages");
    existingImages = existingImages ? JSON.parse(existingImages) : {};

    let newArr = existingImages.filter((img) => {
      return img.url !== url;
    });
    localStorage.setItem("allImages", JSON.stringify(newArr));
  });
  cards.append(absoluteButton);

  //all other buttons
  let navBtns = ["&#60", "&#62", "&#43", "&#8722", "&#120"];
  let btnNames = ["left", "right", "bigger", "smaller", "delete"];
  for (let i = 0; i < navBtns.length; i++) {
    let buttons = document.createElement("button");

    buttons.innerHTML = navBtns[i];
    buttons.classList.add(btnNames[i]);

    buttons.addEventListener("click", (event) => {
      event.preventDefault();
      let divs = document.querySelectorAll("main > div");
      for (var index_me = 0; index_me < divs.length; index_me++) {
        const currentCard = divs[index_me];

        if (event.target.parentNode.parentNode === currentCard) {
          break;
        }
      }

      let existingImages = localStorage.getItem("allImages");
      existingImages = existingImages ? JSON.parse(existingImages) : {};
      let currentImage = existingImages.filter((img) => {
        return img.id === id;
      });

      //swap left
      if (event.target.classList.contains("left")) {
        if (index_me === 0) {
        } else {
          divs[index_me].parentNode.insertBefore(
            divs[index_me],
            divs[index_me - 1]
          );

          let ArrangedImages = document.querySelectorAll("img");
          for (let i = 0; i < existingImages.length; i++) {
            existingImages[i].url = ArrangedImages[i].src;
          }
          localStorage.setItem("allImages", JSON.stringify(existingImages));
        }
      }
      //swap right
      if (event.target.classList.contains("right")) {
        if (index_me === divs.length - 1) {
        } else {
          divs[index_me].parentNode.insertBefore(
            divs[index_me + 1],
            divs[index_me]
          );
          let ArrangedImages = document.querySelectorAll("img");
          for (let i = 0; i < existingImages.length; i++) {
            existingImages[i].url = ArrangedImages[i].src;
          }
          localStorage.setItem("allImages", JSON.stringify(existingImages));
        }
      }
      //bigger
      let card = event.target.parentNode.parentNode;
      let size = event.target.parentNode.parentNode.classList[1];

      if (event.target.classList.contains("bigger")) {
        let currentSize = +size.slice(-1);
        if (currentSize === 9) {
        } else {
          let sizeLetter = size.substr(0, 4);
          let newSizeNumber = +size.slice(-1) + 1;
          card.classList.remove(size);
          //   card.classList.add(sizeLetter + newSizeNumber);
          // Get the existing data
          // var existing = localStorage.getItem(imgUrl);
          // // If no existing data, create an array
          // // Otherwise, convert the localStorage string to an array
          // existing = existing ? JSON.parse(existing) : {};
          // existing["size"] = sizeLetter + newSizeNumber;
          // localStorage.setItem(imgUrl, JSON.stringify(existing));

          // let value = JSON.parse(localStorage.getItem(imgUrl));
          // console.log(value.size);
          // card.classList.add(value.size);

          currentImage[0]["size"] = sizeLetter + newSizeNumber;
          localStorage.setItem("allImages", JSON.stringify(existingImages));
          console.log(currentImage[0].size);
          card.classList.add(currentImage[0].size);
        }
      }

      //smaller
      if (event.target.classList.contains("smaller")) {
        let currentSize = +size.slice(-1);
        if (currentSize === 1) {
        } else {
          let sizeLetter = size.substr(0, 4);
          let newSizeNumber = +size.slice(-1) - 1;
          card.classList.remove(size);
          //card.classList.add(sizeLetter + newSizeNumber);

          currentImage[0]["size"] = sizeLetter + newSizeNumber;
          localStorage.setItem("allImages", JSON.stringify(existingImages));
          console.log(currentImage[0].size);
          card.classList.add(currentImage[0].size);
        }
      }
      //delete
      if (event.target.classList.contains("delete")) {
        event.target.closest(".card").remove();
        let newArr = existingImages.filter((img) => {
          return img.id !== id;
        });
        localStorage.setItem("allImages", JSON.stringify(newArr));
      }
    });

    btnDiv.append(buttons);
  }

  document.getElementById("newPicUrl").value = "";
  let urlForm = document.querySelector("main form");
  urlForm.classList.add("displayNone");
}

document.body.onload = addElement();

function addImageToLocalStorage(url) {
  let existingImages = JSON.parse(localStorage.getItem("allImages"));
  if (existingImages === null) existingImages = [];
  let id = Date.now();
  let entry = {
    id,
    url: url,
    size: "size5",
  };
  localStorage.setItem("entry", JSON.stringify(entry));
  existingImages.push(entry);
  localStorage.setItem("allImages", JSON.stringify(existingImages));
  return id;
}

function addElement() {
  let addBtn = document.getElementById("addPicture");
  addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    let inputUrl = document.getElementById("newPicUrl").value;
    //call add image to storage first, then call makeCard. otherwise code will break
    let id = addImageToLocalStorage(inputUrl);
    makeCard(inputUrl, id);

  });

  let cancelBtn = document.getElementById("cancelAddPic");
  cancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("newPicUrl").value = "";
    document.querySelector("main form").classList.add("displayNone");
  });
}

// makeCard(
//   "https://images.unsplash.com/photo-1648737119359-510d4f551382?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyMXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"
// );
// makeCard(
//   "https://cdn.pixabay.com/photo/2022/02/10/05/44/wuzhen-7004638__340.jpg"
// );
// makeCard(
//   "https://cdn.pixabay.com/photo/2022/03/29/21/04/eggs-7100211__340.jpg"
// );
// makeCard(
//   "https://cdn.pixabay.com/photo/2021/09/05/06/34/spider-web-6598978__340.jpg"
// );

// dream TODO: IF there is nothing in localstorage, then put those 4 images in localstorage, THEN load them.

JSON.parse(localStorage.getItem("allImages")).forEach((imgObj) => {
  makeCard(imgObj.url, imgObj.id);
});
JSON.parse(localStorage.getItem("absolutImg"));

document.querySelector("main").addEventListener("keydown", (event) => {
  console.log(event.key)
  let divs = document.querySelectorAll("main > div");
  for (var index_me = 0; index_me < divs.length; index_me++) {
    const currentCard = divs[index_me];

    if (event.target === currentCard) {
      break;
    }
  }

  let existingImages = localStorage.getItem("allImages");
  existingImages = existingImages ? JSON.parse(existingImages) : {};
  let currentImage = existingImages.filter((img) => {
    return img.id === +event.target.id;
  });

  if(event.key === "ArrowLeft"){
  if (index_me === 0) {
        } else {
          divs[index_me].parentNode.insertBefore(
            divs[index_me],
            divs[index_me - 1]
          );

          let ArrangedImages = document.querySelectorAll("img");
          for (let i = 0; i < existingImages.length; i++) {
            existingImages[i].url = ArrangedImages[i].src;
          }
          localStorage.setItem("allImages", JSON.stringify(existingImages));
        }
  }

  if(event.key === "ArrowRight"){
    if (index_me === divs.length - 1) {
    } else {
      divs[index_me].parentNode.insertBefore(
        divs[index_me + 1],
        divs[index_me]
      );
      let ArrangedImages = document.querySelectorAll("img");
      for (let i = 0; i < existingImages.length; i++) {
        existingImages[i].url = ArrangedImages[i].src;
      }
      localStorage.setItem("allImages", JSON.stringify(existingImages));
    }
  }

  let card = event.target
  let size = event.target.classList[1];

  if(event.key === "ArrowUp"){
    let currentSize = +size.slice(-1);
    if (currentSize === 9) {
    } else {
      let sizeLetter = size.substr(0, 4);
      let newSizeNumber = +size.slice(-1) + 1;
      card.classList.remove(size);
      currentImage[0]["size"] = sizeLetter + newSizeNumber;
      localStorage.setItem("allImages", JSON.stringify(existingImages));
      console.log(currentImage[0].size);
      card.classList.add(currentImage[0].size);
    }
  }

  if(event.key === "ArrowDown") {
    let currentSize = +size.slice(-1);
    if (currentSize === 1) {
    } else {
      let sizeLetter = size.substr(0, 4);
      let newSizeNumber = +size.slice(-1) - 1;
      card.classList.remove(size);
      //card.classList.add(sizeLetter + newSizeNumber);

      currentImage[0]["size"] = sizeLetter + newSizeNumber;
      localStorage.setItem("allImages", JSON.stringify(existingImages));
      console.log(currentImage[0].size);
      card.classList.add(currentImage[0].size);
    }
  }

  if(event.key === "Backspace") {
    //closest will look up
    event.target.remove();
    let newArr = existingImages.filter((img) => {
      return img.id !== +event.target.id;
    });
    localStorage.setItem("allImages", JSON.stringify(newArr));
  }
  
})




document.querySelector("main").addEventListener("click", (event) => {
  // look up the dom
  //        for an ancestor of event.target
  //        that is the right kind of thing (in this case, an image)
  // hint about `.closest`: https://gomakethings.com/climbing-up-the-dom-tree-with-vanilla-javascript/
  let image = event.target.closest("img"); // this is sort of the magic trick to make delegation not suck

  if (image !== null) {
    // console.log(event.target.tagName);
    let btnDivs = document.querySelectorAll("div.divAllButtons");
    btnDivs.forEach((btnDiv) => {
      if (btnDiv.parentNode === image.parentNode) {
        btnDiv.classList.toggle("filterDiv");
      } else {
        btnDiv.classList.add("filterDiv");
      }
    });

    let absoluteButtons = document.querySelectorAll("button.star");
    absoluteButtons.forEach((star) => {
      if (star.parentNode === image.parentNode) {
        star.classList.toggle("hideAbsoluteButton");
      } else {
        star.classList.add("hideAbsoluteButton");
      }
    });
  }

// delete absoluteCard and make it into normal card
  let abCard = event.target.closest("#absolute")
  if (abCard) {
    abCard.addEventListener("click", (event) => {
      if (event.target.closest(".star")) {
        abCard.classList.add("displayNone");
        let id = addImageToLocalStorage(event.target.parentNode.firstChild.src);
        makeCard(event.target.parentNode.firstChild.src, id);
        localStorage.removeItem("absoluteImg");
      }
    });
  }
});

//undo/redo
//svg
//tab, keybinds
// let allCards = document.querySelectorAll(".card")
// for (let i = 0; i < allCards.length; i++) {
//   allCards[i].tabIndex=(i)
// }
// document.addEventListener("keydown", (event) => {
//   event.preventDefault()

//   let tabbables = document.querySelectorAll(".card")
//   for(var i=0; i<tabbables.length; i++) { //loop through each element
//     // if(tabbables[i].tabIndex == (curIndex+1)) { //check the tabindex to see if it's the element we want
//     //    console.log(i)
//      // tabbables[i+1].focus(); //if it's the one we want, focus it and exit the loop
//         // break;
//   //  }
// }
// })

//drag
// tutorial: https://www.youtube.com/watch?v=jfYWwQrtzzY

const draggables = document.querySelector("main");
const container = document.querySelector("main");
// draggables.forEach((draggable) => {
//   draggable.addEventListener("dragstart", () => {
//     draggable.classList.add("dragging")
//   })

//   draggable.addEventListener("dragend", () => {
//     draggable.classList.remove("dragging")
//   })
// });

//above code won't work for new added images, so I needed to use event delegation
draggables.addEventListener("dragstart", (event) => {
  let card = event.target.closest(".card");
  if (card !== null) {
    card.classList.add("dragging");
  } else {
    console.log("start", event)
  }
});

draggables.addEventListener("dragend", (event) => {
  let card = event.target.closest(".card");
  if (card !== null) {
    card.classList.remove("dragging");
  } else {
    console.log("end", event)
  }
});

container.addEventListener("dragover", (event) => {
  // console.log('one', event)
  let card = event.target.closest(".card");
  if (card !== null) {
  event.preventDefault();
  afterElement = getDraggableElement(container, event.clientX, event.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterElement === null) {
    container.appendChild(draggable);
  } else {
    container.insertBefore(draggable, afterElement);
  }

  //save dragged array into localstorage
  let existingImages = localStorage.getItem("allImages");
  existingImages = existingImages ? JSON.parse(existingImages) : {};
  let ArrangedImages = document.querySelectorAll("img");
  for (let i = 0; i < existingImages.length; i++) {
    existingImages[i].url = ArrangedImages[i].src;
  }
  localStorage.setItem("allImages", JSON.stringify(existingImages));
  }

});

function getDraggableElement(container, x, y) {
  //"..." because query selector all dont return an array
  //spread operator to spread out into a new array
  const draggableElements = [
    ...container.querySelectorAll(".card:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      // offset = the distance between mid of the box and the curser
      const offsetX = x - box.left - box.width / 2;
      const offsetY = y - box.top - box.height / 2;
      if (
        offsetX < 0 &&
        offsetX > closest.offset &&
        offsetY < 0 &&
        offsetY > closest.offset
      ) {
        return { offsetX: offsetX, offsetY: offsetY, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
