let history = [JSON.parse(localStorage.getItem("allImages"))];
console.log(history)
let curentHistoryIndex = 0;
function drawAllCards(cardList) {
  //delete all cards
  document.querySelectorAll(".card").forEach((card) => {
    card.remove();
  });
  if (cardList) {
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
  event.preventDefault();
  undo();
});

document.querySelector(".buttonRedo").addEventListener("click", (event) => {
  event.preventDefault();
  redo();
});

let addImageButton = document.querySelector(".buttonAddImage");
addImageButton.addEventListener("click", (event) => {
  event.preventDefault();
  let addImageForm = document.querySelector(".newPicture");
  addImageForm.classList.remove("displayNone");
});


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

  //make absolute button
  absoluteButton = document.createElement("button");
  absoluteButton.innerHTML = "&#10025";
  absoluteButton.classList.add("star", "hideAbsoluteButton");
  absoluteButton.addEventListener("click", (event) => {
    event.target.parentNode.classList.toggle("absolute")
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
          history.length = curentHistoryIndex+1
          // 3: push history object and update index
          curentHistoryIndex++;
          history.push(newHistoryState);

          //4: update everybody else (dom and localstorage)
          drawAllCards(history[curentHistoryIndex]);
          localStorage.setItem("allImages", JSON.stringify(newHistoryState));
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
          history.length = curentHistoryIndex+1
          // 3: push history object and update index
          curentHistoryIndex++;
          history.push(newHistoryState);

          //4: update everybody else (dom and localstorage)
          drawAllCards(history[curentHistoryIndex]);
          localStorage.setItem("allImages", JSON.stringify(newHistoryState));
        }
      }
      //bigger
      let size = event.target.parentNode.parentNode.classList[1];
      if (event.target.classList.contains("bigger")) {
        let currentSize = +size.slice(-1);
        if (currentSize === 9) {
        } else {
          //1: make a new history state object
          let curentHistoryState = history[curentHistoryIndex];
          let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState));
          //2: do the necessary change (big or small)
          history.length = curentHistoryIndex+1
          let sizeLetter = size.substr(0, 4);
          let newSizeNumber = +size.slice(-1) + 1;
          newHistoryState[index_me].size = sizeLetter + newSizeNumber;
          // 3: push history object and update index
          curentHistoryIndex++;
          history.push(newHistoryState);
          //4: update everybody else (dom and localstorage)
          drawAllCards(history[curentHistoryIndex]);
          localStorage.setItem("allImages", JSON.stringify(newHistoryState));
        }
      }
      //smaller
      if (event.target.classList.contains("smaller")) {
        let currentSize = +size.slice(-1);
        if (currentSize === 1) {
        } else {
          let curentHistoryState = history[curentHistoryIndex];
          let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState));
          history.length = curentHistoryIndex+1
          let sizeLetter = size.substr(0, 4);
          let newSizeNumber = +size.slice(-1) - 1;
          console.log( newHistoryState[index_me])
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
        //2: do the necessary change (remove curent card)
        let newArr = newHistoryState.filter((img) => {
          return img.id !== id;
        });

        curentHistoryIndex++;
        history.push(newArr);

        drawAllCards(history[curentHistoryIndex]);
        localStorage.setItem("allImages", JSON.stringify(newArr));
      }
    });

    btnDiv.append(buttons);
  }

  document.getElementById("newPicUrl").value = "";
  let urlForm = document.querySelector("main form");
  urlForm.classList.add("displayNone");
}



function addNewImgToHistoryAndLocalstorage(url) {
  //1: make a new history state object
  let curentHistoryState = history[curentHistoryIndex];
  let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState));
  if (newHistoryState === null) newHistoryState = [];
  // throw away future history
  history.length = curentHistoryIndex+1
  //2: do the necessary change (big or small)
  let id = Date.now();
  let entry = {
    id,
    url,
    size: "size5",
  };

  newHistoryState.push(entry);
  // 3: push history object and update index
  curentHistoryIndex++;
  history.push(newHistoryState);
  //4: update everybody else (dom and localstorage)
  drawAllCards(history[curentHistoryIndex]);
  localStorage.setItem("allImages", JSON.stringify(newHistoryState));
  return id;
}

// function addImageToLocalStorage(url) {
//   let existingImages = JSON.parse(localStorage.getItem("allImages"));
//   if (existingImages === null) existingImages = [];
//   let id = Date.now();
//   let entry = {
//     id,
//     url: url,
//     size: "size5",
//   };
//   // localStorage.setItem("entry", JSON.stringify(entry));
//   existingImages.push(entry);
//   localStorage.setItem("allImages", JSON.stringify(existingImages));
//   return id;
// }
document.body.onload = addElement();
function addElement() {
  let addBtn = document.getElementById("addPicture");
  addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    let inputUrl = document.getElementById("newPicUrl").value;
    //call add image to storage first, then call makeCard. otherwise code will break
    addNewImgToHistoryAndLocalstorage(inputUrl);
    //add to history, history clears after refresh.
    // makeCard(inputUrl, id);
  });

  let cancelBtn = document.getElementById("cancelAddPic");
  cancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("newPicUrl").value = "";
    document.querySelector("main form").classList.add("displayNone");
  });
}

document.querySelector("main").addEventListener("keydown", (event) => {
  let divs = document.querySelectorAll("main > div");
  for (var index_me = 0; index_me < divs.length; index_me++) {
    const currentCard = divs[index_me];
    if (event.target === currentCard) {
      break;
    }
  }
  if (event.key === "ArrowLeft") {
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
      history.length = curentHistoryIndex+1
      // 3: push history object and update index
      curentHistoryIndex++;
      history.push(newHistoryState);

      //4: update everybody else (dom and localstorage)
      drawAllCards(history[curentHistoryIndex]);
      localStorage.setItem("allImages", JSON.stringify(newHistoryState));
    }
  }

  if (event.key === "ArrowRight") {
    if (index_me === divs.length - 1) {
    } else {
      let currentHistoryState = history[curentHistoryIndex];
      let newHistoryState = JSON.parse(JSON.stringify(currentHistoryState));
      history.length = curentHistoryIndex+1
      let temp = newHistoryState[index_me + 1];
      newHistoryState[index_me + 1] = newHistoryState[index_me];
      newHistoryState[index_me] = temp;

      curentHistoryIndex++;
      history.push(newHistoryState);

      drawAllCards(history[curentHistoryIndex]);
      localstorage.setItem("allImages", JSON.stringify(newHistoryState));
    }
  }
  let size = event.target.classList[1];
  if (event.key === "ArrowUp") {
    let currentSize = +size.slice(-1);
    if (currentSize === 9) {
    } else {
      let currentHistoryState = history[curentHistoryIndex];
      let newHistoryState = JSON.parse(JSON.stringify(currentHistoryState));
      history.length = curentHistoryIndex+1
      let sizeLetter = size.substr(0, 4);
      let newSizeNumber = +size.slice(-1) + 1;
      newHistoryState[index_me].size = sizeLetter + newSizeNumber;

      curentHistoryIndex++;
      history.push(newHistoryState);
      drawAllCards(history[curentHistoryIndex]);
      localStorage.setItem("allImages", JSON.stringify(newHistoryState));
    }
  }

  if (event.key === "ArrowDown") {
    let currentSize = +size.slice(-1);
    if (currentSize === 1) {
    } else {
      let currentHistoryState = history[curentHistoryIndex];
      let newHistoryState = JSON.parse(JSON.stringify(currentHistoryState));
      history.length = curentHistoryIndex+1
      let sizeLetter = size.substr(0, 4);
      let newSizeNumber = +size.slice(-1) - 1;
      newHistoryState[index_me].size = sizeLetter + newSizeNumber;

      curentHistoryIndex++;
      history.push(newHistoryState);

      drawAllCards(history[curentHistoryIndex]);
      localStorage.setItem("allImages", JSON.stringify(newHistoryState));
    }
  }

  if (event.key === "Backspace") {
    //closest will look up
    let curentHistoryState = history[curentHistoryIndex];
    let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState));
    history.length = curentHistoryIndex+1
    let newArr = newHistoryState.filter((imgObj) => {
      return imgObj.id !== +event.target.id;
    });
    curentHistoryIndex++;
    history.push(newArr);
    drawAllCards(newArr);
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
 
});


//drag
// tutorial: https://www.youtube.com/watch?v=jfYWwQrtzzY

const draggables = document.querySelector("main");
const container = document.querySelector("main");

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
    // let curentHistoryState = history[curentHistoryIndex]
    // let newHistoryState = JSON.parse(JSON.stringify(curentHistoryState))
    
    // let cards = document.querySelectorAll(".card");
    // let ArrangedImages = document.querySelectorAll("img");


    // for (let i = 0; i < ArrangedImages.length; i++) {
    //   newHistoryState[i].url = ArrangedImages[i].src;
    //   newHistoryState[i].size = cards[i].classList[1];
    //   newHistoryState[i].id = cards[i].id;
    // }

    // curentHistoryIndex++
    // history.push(newHistoryState)
    // drawAllCards(history[curentHistoryIndex])
    // localStorage.setItem("allImages", JSON.stringify(newHistoryState))
    let existingImages = localStorage.getItem("allImages");
    existingImages = existingImages ? JSON.parse(existingImages) : [];
    let ArrangedImages = document.querySelectorAll("img");
    let cards = document.querySelectorAll(".card");
    for (let i = 0; i < existingImages.length; i++) {
      existingImages[i].url = ArrangedImages[i].src;
      existingImages[i].size = cards[i].classList[1];
      existingImages[i].id = cards[i].id;
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
