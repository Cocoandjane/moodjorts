
//query selector goes down, closest goes up

/*

* your current approach to localstorage:
  * one image, one key/value in localstorage
  * five images?   five key/values!
* possible alternative:
  * one key, one array value (with many images in that array)
  * eg:

```
  [ 'pinkflower.jpg', 'neatcat.jpg', 'spiderweb.jpg' ]
```
  * if you did this, then every time you move things in the DOM, you would want to move them in teh localstorage too
    * so maybe *move* them...
    * or maybe just...  rebuild localstorage?  as if it wasn't there?

*/


// console.log(localStorage.length)
// for (let i = 0; i < localStorage.length; i++) {
//   let key = localStorage.key(i);
//   let value = localStorage.getItem(key);
//   let allImages = JSON.parse(value);
//   for (let i = 0; i < allImages.length; i++) {
//     // console.log(allImages[i].url)
//     makeCard(allImages[i].url);
//   }
//   // makeCard(key);
//   //https://isotropic.co/how-to-fix-unexpected-token-u-in-json-at-position-0/#:~:text=The%20%22Unexpected%20token%20u%20in,version%20of%20the%20undefined%20primitive.
// }

function makeDomThing() {
  let newDiv = document.createElement("div");
  newDiv.textContent = "a thing";
  document.body.append(newDiv);
}


makeDomThing();
makeDomThing();
makeDomThing();

// at this time, three divs in the body.

document.querySelectorAll("div").forEach(d => d.textContent = "blah blah");
            //   ^---- only happens to the 3 already created

document.querySelectorAll("div").forEach(d => d.addEventListener("click", event => console.log("a click")));
            //   ^---- also only the 3 already created


makeDomThing();
makeDomThing();
makeDomThing();

// at this time, three that say "blah blah", followed by three that say "a thing";



// What if we want the click handler on ALL SIX?  (not just on three)
//    2 options:
//      1) every time we add a div, also add a click handler      (easier concept, but more work for us, more work for computer)
//      2) delegation magic!                                      (harder concept to learn, but sometimes easier work for us to do)



/*
grandparent
  parent
    child     <---- if we put the event handler here...
      baby
    child     <----    (and here)
      baby
    child     <----    (and here)
                          ... then the event handler will not be already in place
      baby
        doll
        doll2
      baby2
        doll3
    newChild  <----    here.
                          (so we need to add another event handler now.  no delegation, just extra handlers.  option 1.)


grandparent     <--- if we put the event handler here....     (option 2, event delegation)
  parent
    child       <--- then this child
      baby
    child 
    newChild    <--- and this child, both will work the same
                    ... BUT our event-handler will be kinda broken, because it was supposed to be on the child!



* "delegation": give the work to someone else.
  * in business this is *usually* delegating down, to a junior person.
  * in web-dev, though, we (always?  I think?) delegate UP, to a DOM element that will have a longer (earlier) life than the child
    * main reason: child might not exist at the time we add the event handler.
    * side reason: what if there are 10000000 children?
        * without delegation, that would be 10000000 handlers.  sad browser.
        * with delegation?   who cares, 1 handler.


How to do event delegation
  1) move the listener to an ancestor with the right lifetime (this is so easy.  the easy part.)
  problem) the listener now works all the time.  too often.  everything is broken.  why does the listener fire so often?
  2) add some filtering so that the listener fires at the right time, not just all the fucking time.
    (we did this by saying `if (event.target.tagName === "IMG")`)
    (in some other project you might do `if (event.target.classList.includes('bleh'))` )
    (or you could write some other kind of `if`, depending on what you need)
  problem) STILL a problem, we need to target our element, but it could be any card/image/whatever!
  3) use `event.target`
  problem) but WHAT IF THEY CLICK ON A DESCENDANT
    * this will break our `if event.target.tagName ===` logic
    * this will also break our targetting logic in (3)
  4) before you do the filtering and targetting, look UP THE TREE for the thing you really want



// TODO: talk about why this is a waste of time
  for (let i = 0; i < imgCards.length; i++) {
    if (imgCards[i] === card) {
      card.classList.add(i);
    }
  }

/*

### Review of today (july 7)

When we started, the .filterdiv button click-handler was working for hardcoded images,
and working for localstorage images, but not working for newly added images.
    (newly added images would work after refresh, because then they are from localstorage)
  
We knew that the *reason* was that the clickhandler was being added too early
    (being added at page load, thus before the new images were added.)

Two solutions:
  1) every time you add an image?   add a new click handler!
  2) event delegation!

Option 1: add more click handlers!
  we already had some code that runs every time you add an image, it's makeCard  
  so if we put our addEventListener into makeCard, then it'll
    run on hardcoded images
    run on localstorage images
    run on new images
    yay!
  to do this we had to fuss a bit with the way the selectors and things were working.
  the key idea here is that each addEventListener is happening late enough to work.

Option 2: event delegation
  if we move the listener to a higher-in-the-DOM node, then maybe we can add it early and that'll be okay?
  the first step is move it higher.  in this case to `main`.  this step is the easy part.
  the problem is, now everything is fucked.
  so we need to manually add in the filtering that we were previously getting for free
  we can just do like
    if (event.target.tagName === "IMG")         (or something else in a different application)
  but the problem with that is, descendants of the IMG will not be clickable, and usually that's bad.
  so instead we do something like
    let image = event.target.closest("img")     (or something else in a different application)
    if (image !== null) {
  and now we have the right amount of flexibility


*/