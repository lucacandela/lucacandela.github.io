//import * as THREE from 'three';
import './style.css';


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