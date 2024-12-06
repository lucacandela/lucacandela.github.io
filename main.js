function appendTextToImgSVG(imgSelector, svgText) {

  if (!imgSelector) {
      console.error(`Image with selector "${imgSelector}" not found.`);
      return;
  }

  fetch(imgSelector.src)
      .then(response => response.text())
      .then(svgContent => {
          const parser = new DOMParser();
          const svgDocument = parser.parseFromString(svgContent, "image/svg+xml");
          let svgElement = svgDocument.querySelector("svg");
          
          if (!svgElement) {
              console.error("No SVG found in the image source.");
              svgElement = imgSelector
          }
          // Preserve existing width and height attributes if they exist
          const existingWidth = svgElement.getAttribute("width");
          const existingHeight = svgElement.getAttribute("height");

          // Get viewBox for centering
          const viewBox = svgElement.getAttribute("viewBox") || "0 0 100 100";
          const [minX, minY, width, height] = viewBox.split(" ").map(Number);

          // Create the <text> element
          const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
          textElement.setAttribute("x", minX + width / 2);
          textElement.setAttribute("y", minY + height / 1.75);
          textElement.setAttribute("text-anchor", "middle"); // Horizontally center the text
          textElement.setAttribute("dominant-baseline", "middle"); // Vertically center the text
          textElement.setAttribute("font-size", height * 1/2);
          textElement.setAttribute("fill", "black");
          textElement.textContent = svgText;

          svgElement.appendChild(textElement);

          // If width/height are not set, rely on viewBox scaling
          if (!existingWidth) {
              svgElement.removeAttribute("width");
          }
          if (!existingHeight) {
              svgElement.removeAttribute("height");
          }
          svgElement.id = imgSelector.id
          // Replace the <img> with the modified inline SVG
          const svgHTML = new XMLSerializer().serializeToString(svgElement);
          imgSelector.outerHTML = svgHTML;
          

      })
      .catch(error => {
          console.error("Error fetching or parsing SVG:", error);
      });
}

const imagesArray = [
  { id: "d6-0", src: "images/dice/d6/d6-0.svg" },
  { id: "d6-3", src: "images/dice/d6/d6-3.svg" },
  { id: "d6-6", src: "images/dice/d6/d6-6.svg" }
];

document.addEventListener("DOMContentLoaded", () => {
  // Select all elements with the class 'selectableDieImage'
  const selectableDivs = document.querySelectorAll(".rightArrow");

  selectableDivs.forEach(div => {
      // Add a click event listener to each div
      div.addEventListener("click", () => {
          // Get the <img> element inside the div (if applicable)
          const dieSelector = document.querySelector(".selectableDieImage");

          const imgElement = dieSelector.querySelector("img");

          if (imgElement){
            //Remove the imgElement and add in a new one from the list
            const currentDie = imgElement.id
            dieSelector.removeChild(imgElement)
            // Create the new <img> element
            const newImg = document.createElement("img");

            switch (currentDie) {
              case "d4-0":
                  newImg.src = "images/dice/d20/d20_number.svg";
                  newImg.id = "d20-0";
                  break;
              case "d20-0":
                  newImg.src = "images/dice/d6/d6_number.svg";
                  newImg.id = "d6-0";
                  break;
              case "d6-0":
                newImg.src = "images/dice/d4/d4_number.svg";
                newImg.id = "d4-0";
                  break;
            }
            // Set attributes for the <img> element
            newImg.setAttribute("class", "diceImage");
            newImg.alt = "New Die Image";     // Optional: Set the alt text
            dieSelector.appendChild(newImg);
          }
          if (!imgElement){
            console.error("No src found");
            return;
          }


          // Run the appendTextToImgSVG function on the <img>
          //appendTextToImgSVG(`#${imgElement.id}`, "d6");
      });
  });
});

const diceGrid = document.querySelector(".container");
const maxDice = 15; // Number of dice in the grid
const minDice = 0;
let currentDiceCount = 0;

// Create and append dice to the grid
function createDice(diceType) {
  if (currentDiceCount >= maxDice) {
    console.error("Dice cannot go over maxDice number");
    return;
  }
  const dice = document.createElement("div");
  const diceImg = document.createElement("img");
  const rows = diceGrid.querySelectorAll(".row")
  let randomNumber = 0
  switch (diceType) {
    case '4':
      randomNumber = Math.floor(Math.random() * 4) + 1;
      diceImg.src = "images/dice/d4/d4-0.svg";
      diceImg.id = "d4-0"
      dice.setAttribute("data-type",4)
      break;
    case '6':
      randomNumber = Math.floor(Math.random() * 6) + 1; // Generate a random number between 1 and 6
      diceImg.src = `images/dice/d6/d6-0.svg`; // Use the random number in the file path
      diceImg.id = `d6-0`;
      dice.setAttribute("data-type",6);
      break;
    case '20':
      randomNumber = Math.floor(Math.random() * 20) + 1;
      diceImg.src = "images/dice/d20/d20-0.svg";
      diceImg.id = "d20-0;"
      dice.setAttribute("data-type",20);
      break;
    default: //d6 default
      randomNumber = Math.floor(Math.random() * 6) + 1; // Generate a random number between 1 and 6
      diceImg.src = `images/dice/d6/d6-0.svg`; // Use the random number in the file path
      diceImg.id = `d6-0`;
      dice.setAttribute("data-type",6);
  }
  diceImg.classList.add("fade-in"); // Add fade-in class
  diceImg.classList.add("diceImage")
  dice.appendChild(diceImg)
  switch (diceType) {
    case "4":
      appendTextToImgSVG(dice.querySelector("img"),randomNumber)
      break;
    case "6":
      appendTextToImgSVG(dice.querySelector("img"),randomNumber)
      break;
    case "20":
      appendTextToImgSVG(dice.querySelector("img"),randomNumber)
      break;
  }
  dice.classList.add("diceContainer");
  currentDiceCount += 1
  dice.setAttribute("data-index", currentDiceCount); // Store index in data attribute
  dice.addEventListener("click", function(event) {
    handleDiceClick(event.target);  // Pass the clicked element to the function
  });
  
  // Switch statement based on ranges
  switch (true) {
    case (currentDiceCount >= 1 && currentDiceCount <= 5):
        rows[0].appendChild(dice)
        break;
    case (currentDiceCount >= 6 && currentDiceCount <= 10):
        rows[1].appendChild(dice)
        break;
    case (currentDiceCount >= 11 && currentDiceCount <= 15):
        rows[2].appendChild(dice)
        break;
    default:
        console.log("Value is outside the expected ranges");
  }

  setTimeout(() => diceImg.classList.add("show"), 500);

}

function handleDiceClick (clickedElement) {
  console.log("Element clicked: ", clickedElement)
}

const diceSelector = document.querySelectorAll(".selectableDieImage");
diceSelector.forEach(div =>{
  const regex = /(?<=d)(\d+)(?=-)/;
  div.addEventListener("click", function(event){
    createDice(event.target.id.match(regex)[0])
  })
})


const resetButton = document.querySelector("#resetButton");
resetButton.addEventListener("click", () =>{

  //select all dice
  const existingDice = document.querySelectorAll(".diceContainer");
  existingDice.forEach(dice =>{
    dice.remove()
  });

  currentDiceCount = 0;

});

const rollButton = document.querySelector("#startButton");

rollButton.addEventListener("click", () => {
  const existingDice = document.querySelectorAll(".diceContainer");
  let d4Count = 0
  let d6Count = 0
  let d20Count = 0

  let d4Total = 0
  let d6Total = 0
  let d20Total = 0
  existingDice.forEach(dice =>{
    dice.classList.remove('rotate');
    void dice.offsetWidth; // Force a reflow/repaint
    dice.classList.add('rotate');
    
    
    
    let randomNumber = 0;
    const diceImg = dice.children[0]
    let baseImg = document.createElement("img")
    console.log(dice.getAttribute("data-type"))
    switch (dice.getAttribute("data-type")) {
      case "4":
        if (dice.firstElementChild){
          dice.firstElementChild.remove()
        }

        randomNumber = Math.floor(Math.random() * 4) + 1;  
        baseImg.src = `images/dice/d4/d4-0.svg`; // Use the random number in the file path
        baseImg.id = `d4-${randomNumber}`;
        dice.appendChild(baseImg)
        setTimeout(() => {
          dice.classList.remove("rotate")
          appendTextToImgSVG(dice.querySelector("img"),randomNumber)
          
          d4Count += 1;
          d4Total += randomNumber;
        }, 1000);
        break;
      case "6":
        if (dice.firstElementChild){
          dice.firstElementChild.remove()
        }
        randomNumber = Math.floor(Math.random() * 6) + 1;
        baseImg.src = `images/dice/d6/d6-0.svg`; // Use the random number in the file path
        baseImg.id = `d6-${randomNumber}`;
        dice.appendChild(baseImg)
        setTimeout(() => {
          dice.classList.remove("rotate")
          appendTextToImgSVG(dice.querySelector("img"),randomNumber)

          d6Count += 1;
          d6Total += randomNumber;
        }, 1000);
        break;
      case "20":
        if (dice.firstElementChild){
          dice.firstElementChild.remove()
        }
        
        randomNumber = Math.floor(Math.random() * 20) + 1; 
        baseImg.src = `images/dice/d20/d20-0.svg`; // Use the random number in the file path
        baseImg.id = `d20-${randomNumber}`;
        dice.appendChild(baseImg)
        setTimeout(() => {
        dice.classList.remove("rotate")
        appendTextToImgSVG(dice.querySelector("img"),randomNumber)
        
        d20Count += 1;
        d20Total += randomNumber;
        }, 1000);
        break;
    }
    
    
});
const resultsParagraph = document.querySelector("p")
resultsParagraph.innerHTML = ""
setTimeout(() => {
  
  let finalD4Total = parseInt(d4Total,10);
  let finalD6Total = parseInt(d6Total,10);
  let finalD20Total = parseInt(d20Total,10);
  let total = parseInt(d4Total, 10) + parseInt(d6Total, 10) + parseInt(d20Total, 10)
  resultsParagraph.innerHTML = `${d4Count}d4: ${finalD4Total}<br>${d6Count}d6: ${finalD6Total} <br>${d20Count}d20: ${finalD20Total}<br>Total Roll: ${total}`
}, 1200);
  
})