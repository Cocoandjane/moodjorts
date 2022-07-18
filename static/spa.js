let history = [JSON.parse(localStorage.getItem("allImages"))];
let curentHistoryIndex = 0;

function drawAllCards(cardList) {
  //delete all cards
  document.querySelectorAll(".card").forEach((card) => {
    card.remove();
  });
  if(cardList){
  cardList.forEach((imgObj) => {
    makeCard(imgObj.url, imgObj.id, imgObj.size);
  });
}
}
drawAllCards(history[0]);

function undo() {
  if (curentHistoryIndex === 0) {
    return;
  }
  curentHistoryIndex--;
  drawAllCards(history[curentHistoryIndex]);
  localStorage.setItem(
    "allImages",
    JSON.stringify(history[curentHistoryIndex])
  );
}

function redo() {
  if (curentHistoryIndex === history.length - 1) {
    return;
  }
  curentHistoryIndex++;
  drawAllCards(history[curentHistoryIndex]);
  localStorage.setItem(
    "allImages",
    JSON.stringify(history[curentHistoryIndex])
  );
}

document.querySelector(".buttonUndo").addEventListener("click", (event) => {
  event.preventDefault()
  undo()
})

document.querySelector(".buttonRedo").addEventListener("click", (event) => {
  event.preventDefault()
  redo()
})


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

function makeCard(imgUrl, id, size = "size5") {
  //default parameter, if you give it a value it will use that value
  let image = document.createElement("img");
  image.src = imgUrl;

  // TODO: can we add something about class=i or something like that, so that
  //        we have a unique key for localstorage?
  // (we're not sure if we need to, but it might be good.  we should think about it.)

  let main = document.querySelector("main");
  let div = document.createElement("div");

  let btnDiv = document.createElement("div");
  btnDiv.classList.add("divAllButtons", "filterDiv");
  cards = main.appendChild(div);
  cards.id = id;
  cards.append(image, btnDiv);
  cards.tabIndex = "0";

  div.classList.add("card", size);

  //madke absolute button
  absoluteButton = document.createElement("button");
  absoluteButton.innerHTML = "&#10025";
  absoluteButton.classList.add("star", "hideAbsoluteButton");
  absoluteButton.addEventListener("click", (event) => {
    let entry = {
      url: event.target.parentNode.firstChild.src,
      x: 0,
      y: 0,
    };
    // add crurrent image into new local storages as new key value
    localStorage.setItem("absoluteImg", JSON.stringify(entry));

    makeAbsoluteCard(event.target.parentNode.firstChild.src);
    let url = event.target.parentNode.firstChild.src;
    event.target.closest(".card").remove();

    let existingImages = localStorage.getItem("allImages");
    existingImages = existingImages ? JSON.parse(existingImages) : [];

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
      existingImages = existingImages ? JSON.parse(existingImages) : [];
      let currentImage = existingImages.filter((img) => {
        return img.id === id;
      });

      //swap left
      if (event.target.classList.contains("left")) {
        if (index_me === 0) {
        } else {
          //1: make a new history state object
          let currentHistoryState = history[curentHistoryIndex];
          let newHistoryState = JSON.parse(JSON.stringify(currentHistoryState));

          //2: do the necessary change(swap left and right)
          let temp = newHistoryState[index_me - 1];
          newHistoryState[index_me - 1] = newHistoryState[index_me];
          newHistoryState[index_me] = temp;

          //TODO : throw away the future if there is future

          // 3: push history object and update index
          curentHistoryIndex++;
          history.push(newHistoryState);

          //4: update everybody else (dom and localstorage)
          drawAllCards(history[curentHistoryIndex]);
          localStorage.setItem("allImages", JSON.stringify(newHistoryState));
          //

          // divs[index_me].parentNode.insertBefore(
          //   divs[index_me],
          //   divs[index_me - 1]
          // );

          // let ArrangedImages = document.querySelectorAll("img");
          // for (let i = 0; i < existingImages.length; i++) {
          //   existingImages[i].url = ArrangedImages[i].src;
          // }
          // localStorage.setItem("allImages", JSON.stringify(existingImages));
        }
      }
      //swap right
      if (event.target.classList.contains("right")) {
        if (index_me === divs.length - 1) {
        } else {
          //1: make a new history state object
          let curentHistoryState = history[curentHistoryIndex];
          let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState));
          //2: do the necessary change(swap left and right)
          let temp = newHistoryState[index_me + 1];
          newHistoryState[index_me + 1] = newHistoryState[index_me];
          newHistoryState[index_me] = temp;

          // 3: push history object and update index
          curentHistoryIndex++;
          history.push(newHistoryState);

          //4: update everybody else (dom and localstorage)
          drawAllCards(history[curentHistoryIndex]);
          localStorage.setItem("allImages", JSON.stringify(newHistoryState));
          // divs[index_me].parentNode.insertBefore(
          //   divs[index_me + 1],
          //   divs[index_me]
          // );
          // let ArrangedImages = document.querySelectorAll("img");
          // for (let i = 0; i < existingImages.length; i++) {
          //   existingImages[i].url = ArrangedImages[i].src;
          // }
          // localStorage.setItem("allImages", JSON.stringify(existingImages));
        }
      }
      //bigger
      
      let size = event.target.parentNode.parentNode.classList[1];
      console.log(size)
      if (event.target.classList.contains("bigger")) {
        let currentSize = +size.slice(-1);
        if (currentSize === 9) {
        } else {
          //1: make a new history state object
          let curentHistoryState = history[curentHistoryIndex];
          let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState));
          //2: do the necessary change (big or small)

          let sizeLetter = size.substr(0, 4);
          let newSizeNumber = +size.slice(-1) + 1;
          newHistoryState[index_me].size = sizeLetter + newSizeNumber;

          // 3: push history object and update index
          curentHistoryIndex++;
          history.push(newHistoryState);

          //4: update everybody else (dom and localstorage)
          drawAllCards(history[curentHistoryIndex]);
          localStorage.setItem("allImages", JSON.stringify(newHistoryState));
          // let sizeLetter = size.substr(0, 4);
          // let newSizeNumber = +size.slice(-1) + 1;
          // card.classList.remove(size);
          // currentImage[0]["size"] = sizeLetter + newSizeNumber;
          // localStorage.setItem("allImages", JSON.stringify(existingImages));
          // console.log(currentImage[0].size);
          // card.classList.add(currentImage[0].size);
        }
      }

      //smaller
      if (event.target.classList.contains("smaller")) {
        let currentSize = +size.slice(-1);
        if (currentSize === 1) {
        } else {
          let curentHistoryState = history[curentHistoryIndex];
          let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState));
          let sizeLetter = size.substr(0, 4);
          let newSizeNumber = +size.slice(-1) - 1;
          newHistoryState[index_me].size = sizeLetter + newSizeNumber;
          curentHistoryIndex++;
          history.push(newHistoryState);
          drawAllCards(history[curentHistoryIndex]);
          localStorage.setItem("allImages", JSON.stringify(newHistoryState));
        }
      }
      //delete
      if (event.target.classList.contains("delete")) {
        let curentHistoryState = history[curentHistoryIndex];
        let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState));
        console.log(newHistoryState)
        //2: do the necessary change (remove curent card)
        let newArr = newHistoryState.filter((img) => {
          return img.id !== id;
        });

        curentHistoryIndex++;
        history.push(newArr);

        drawAllCards(history[curentHistoryIndex]);
        localStorage.setItem("allImages", JSON.stringify(newArr));

        //   event.target.closest(".card").remove();
        //   let newArr = existingImages.filter((img) => {
        //     return img.id !== id;
        //   });
        //   localStorage.setItem("allImages", JSON.stringify(newArr));
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
    size: "size5"
  };
  // localStorage.setItem("entry", JSON.stringify(entry));
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
    //add to history, history clears after refresh.

    makeCard(inputUrl, id);
  });

  let cancelBtn = document.getElementById("cancelAddPic");
  cancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("newPicUrl").value = "";
    document.querySelector("main form").classList.add("displayNone");
  });
}

document.querySelector("main").addEventListener("keydown", (event) => {
  console.log(event.key);
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

  if (event.key === "ArrowLeft") {
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

  if (event.key === "ArrowRight") {
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

  let card = event.target;
  let size = event.target.classList[1];

  if (event.key === "ArrowUp") {
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

  if (event.key === "ArrowDown") {
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

  if (event.key === "Backspace") {
    //closest will look up
    event.target.remove();
    let newArr = existingImages.filter((img) => {
      return img.id !== +event.target.id;
    });
    localStorage.setItem("allImages", JSON.stringify(newArr));
  }
});

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
  let abCard = event.target.closest("#absolute");
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
  }
});

draggables.addEventListener("dragend", (event) => {
  let card = event.target.closest(".card");
  if (card !== null) {
    card.classList.remove("dragging");
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
