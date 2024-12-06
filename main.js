const diceContainers = document.querySelectorAll('.diceContainer');

//Add click Listener
diceContainers.forEach((container, index) => {
  
  //Hide everything but the first dicebox
  if (index > 0 ) {
    container.style.display = 'none';
  }

  //Handle what happens when clicked
  container.addEventListener('click', () => {
    const img = container.querySelector('img');
    if (img) {
      //Change img src to just the frame
      img.src = 'images/DiceFrame.svg';

      //Unhide the next Dicecontainer when clicked
      if (index < diceContainers.length -1){
        diceContainers[index+1].style.display = 'block';
        diceContainers[index+1].parentElement.style.display = 'flex'
      }
    }
  });
});

function appendTextToImgSVG(imgSelector, svgText) {
  // Select the <img> tag
  const imgElement = document.querySelector(imgSelector);

  if (!imgElement) {
      console.error(`Image with selector "${imgSelector}" not found.`);
      return;
  }

  // Fetch the SVG file from the <img>'s src attribute
  fetch(imgElement.src)
      .then(response => response.text())
      .then(svgContent => {
          // Parse the SVG content
          const parser = new DOMParser();
          const svgDocument = parser.parseFromString(svgContent, "image/svg+xml");
          const svgElement = svgDocument.querySelector("svg");

          if (!svgElement) {
              console.error("No SVG found in the image source.");
              return;
          }

          // Create the <text> element
          const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
          textElement.setAttribute("x", "50"); // Adjust position as needed
          textElement.setAttribute("y", "50");
          textElement.setAttribute("text-anchor", "middle");
          textElement.setAttribute("dominant-baseline", "middle");
          textElement.setAttribute("font-size", "16");
          textElement.setAttribute("fill", "black");
          textElement.textContent = svgText;

          // Append the text to the SVG
          svgElement.appendChild(textElement);

          // Replace the <img> tag with the inline SVG
          const svgHTML = new XMLSerializer().serializeToString(svgElement);
          imgElement.outerHTML = svgHTML;
      })
      .catch(error => {
          console.error("Error fetching or parsing SVG:", error);
      });
}

document.addEventListener("DOMContentLoaded", () => {
  // Select all elements with the class 'selectableDieImage'
  const selectableDivs = document.querySelectorAll(".selectableDieImage");

  selectableDivs.forEach(div => {
      // Add a click event listener to each div
      div.addEventListener("click", () => {
          // Get the <img> element inside the div (if applicable)
          const img = div.querySelector("img");

          if (!img) {
              console.error("No <img> element found inside the clicked div.");
              return;
          }

          // Run the appendTextToImgSVG function on the <img>
          appendTextToImgSVG(`#${img.id}`, "Clicked!");
      });
  });
});
