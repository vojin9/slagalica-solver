let allWords = [];
let possibleWords = [];
let guessHistory = [];
let currentGuess = [];
const chars = ['a', 'b', 'c', 'd', 'e', 'f'];

for (let i = 0; i < chars.length; i++) {
  for (let j = 0; j < chars.length; j++) {
    for (let k = 0; k < chars.length; k++) {
      for (let l = 0; l < chars.length; l++) {
        allWords.push(chars[i] + chars[j] + chars[k] + chars[l]);
      }
    }
  }
}
possibleWords = [...allWords];

function submitGuess() {
  
  if(currentGuess.length !== 4){
	alert("Enter 4 characters");
	return;
  }
  
  let reds = parseInt(document.getElementById("redc").value);
  let yellows = parseInt(document.getElementById("yelc").value);
  if (reds + yellows > 4) {
    alert(`More than 4`);
    return;
  }
  
  let guess = currentGuess.join('');
  // Update possibleWords
  applyColorCounts(guess, { g: reds, y: yellows });
  
  // Add guess to history
  guessHistory.push({ guess, reds, yellows });
  updateGuessHistory();
  
  updateOutput();
  // Clear input fields for convenience
  currentGuess = [];
  updateCurrentGuessDisplay();
  
}

function updateOutput(){
	if(document.getElementById('blabla') !== null) 
	  document.getElementById('setup').removeChild(document.getElementById('blabla'));
  // Update output with next best guess
  if(possibleWords.length > 1) {
	  document.getElementById('output').textContent = `Try this: (${possibleWords.length} left)`;
	  document.getElementById('setup').appendChild(stringToImageRow(getBestGuess(),'blabla'));
  }
  else {
	  document.getElementById('output').textContent = `Answer is`;
	  document.getElementById('setup').appendChild(stringToImageRow(possibleWords[0],'blabla'));
}
}

function nextGuess() {
	updateOutput();

}

function applyColorCounts(guess, colorCounts) {
  possibleWords = possibleWords.filter(word => {
    const feedback = getFeedback(word, guess);
    const counts = countFeedbackColors(feedback);
    return counts.g === colorCounts.g && counts.y === colorCounts.y;
  });
}

function countFeedbackColors(str) {
  return {
    g: (str.match(/g/g) || []).length,
    y: (str.match(/y/g) || []).length,
  };
}
function resetSolver() {
  possibleWords = [...allWords];
  guessHistory = [];
  updateGuessHistory();
  currentGuess=[];
  updateCurrentGuessDisplay();
  document.getElementById('output').innerHTML='';
  if(document.getElementById('blabla') !== null) 
	  document.getElementById('setup').removeChild(document.getElementById('blabla'));
}


function getFeedback(answer, guess) {
  const feedback = Array(4).fill('b');
  const used = Array(4).fill(false);

  // Green pass
  for (let i = 0; i < 4; i++) {
    if (guess[i] === answer[i]) {
      feedback[i] = 'g';
      used[i] = true;
    }
  }

  // Yellow pass
  for (let i = 0; i < 4; i++) {
    if (feedback[i] === 'b') {
      for (let j = 0; j < 4; j++) {
        if (!used[j] && guess[i] === answer[j] && guess[j] !== answer[j]) {
          feedback[i] = 'y';
          used[j] = true;
          break;
        }
      }
    }
  }

  return feedback.join('');
}

function getEntropyForGuess(guess) {
  const countMap = new Map();

  for (const word of possibleWords) {
    const pattern = getFeedback(word, guess);
    const counts = countFeedbackColors(pattern);
    const key = `g${counts.g}y${counts.y}`;
    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  let entropy = 0;
  const total = possibleWords.length;
  for (const count of countMap.values()) {
    const p = count / total;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

function getBestGuess() {
  let bestWord = '';
  let bestEntropy = -1;
  
  for (const guess of allWords) {
    const entropy = getEntropyForGuess(guess);
    if (entropy > bestEntropy) {
      bestEntropy = entropy;
      bestWord = guess;
    }
  }

  return bestWord || "No words left!";
}

function updateGuessHistory() {
  const listDiv = document.getElementById('guessList');
  listDiv.innerHTML = ''; // Clear current list
  guessHistory.forEach(({ guess, reds, yellows }) => {
    const entry = document.createElement('div');
    entry.className = 'guess-entry';

    const wordSpan = document.createElement('span');
    wordSpan.className = 'guess-word';
    const images = stringToImageRow(guess);
    wordSpan.appendChild(images);
	

    const colorSpan = document.createElement('span');
    colorSpan.className = 'guess-colors';
    colorSpan.textContent = `		 `;
	for(let i = 0; i < reds; i++) colorSpan.textContent += `🔴`;
	for(let i = 0; i < yellows; i++) colorSpan.textContent += `🟡`;
	for(let i = 0; i < 4 - reds - yellows; i++) colorSpan.textContent += `⚪`;
	colorSpan.style = "font-size:30px; padding-left:70px;align-content:center;";
	

    entry.appendChild(wordSpan);
    entry.appendChild(colorSpan);
    
    listDiv.appendChild(entry);
  });
}

function stringToImageRow(str, id) {
  const container = document.createElement('div');
  container.id=id;
  container.style.display = 'flex';
  container.style.gap = '8px';
  
  for (let ch of str) {
    const img = document.createElement('img');
    img.src = `images/${ch}.png`;
    img.alt = ch;
    img.width = 60; // adjust size as needed
    img.height = 60;
    container.appendChild(img);
  }
  
  return container;
}

function addSymbol(letter) {
  if (currentGuess.length >= 4) return;

  currentGuess.push(letter);
  updateCurrentGuessDisplay();
  if (currentGuess.length === 4) {
    container = document.getElementById("current-guess");
	
	const b = document.createElement("input");
	b.type="number";
	b.id="redc";
	b.style="width: 7ch";
	b.value=0;
	b.max=4;
	b.min=0;
	const l = document.createElement('label');
	l.htmlFor= b.id;
	l.textContent="🔴";
	container.appendChild(b);
	container.appendChild(l);
	const c = document.createElement("input");
	c.type="number";
	c.id="yelc";
	c.style="width:7ch";
	c.value=0;
	c.max=4;
	c.min=0;
	const l1 = document.createElement('label');
	l1.htmlFor= c.id;
	l1.textContent="🟡";
	container.appendChild(c);
	container.appendChild(l1);
	} 
	else {
    
  }
}

function updateCurrentGuessDisplay() {
  const container = document.getElementById('current-guess');
  container.innerHTML = '';
  container.appendChild(stringToImageRow(currentGuess.join('')));
}

function submitGuessFromButtons() {
  if (currentGuess.length !== 4) {
    alert("You need to pick 4 symbols first!");
    return;
  }

  document.getElementById('guess').value = currentGuess.join('');
  submitGuess(); // use your existing guess logic
  currentGuess = [];
  updateCurrentGuessDisplay();
}

