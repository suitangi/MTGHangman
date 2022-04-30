//Helper: Get Query
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//helper (mostly to clear listeners)
function recreateNode(el, withChildren) {
  if (withChildren) {
    el.parentNode.replaceChild(el.cloneNode(true), el);
  }
  else {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
  }
}

//function to request random card data from scryfall api
function requestCard(id) {

  document.getElementById("cardImage").style = "opacity:0; transition: opacity 0s;";
  document.getElementById("imageLoading").style = "";
  fetch('https://api.scryfall.com/cards/' + id)
    .then(response => response.json())
    .then(data => loadCard(data));
}

//helper to see if char is an English letter
function isAlpha(char) {
  c = char.toLowerCase().charCodeAt(0);
  return c >= 97 && c <= 122;
}


//function to load the card data into memory
function loadCard(data) {

  //setup mtg card object
  window.mtgCard = {};
  window.mtgCard.end = false;
  window.mtgCard.id = data.id;
  window.mtgCard.wrongGuess = '';
  window.mtgCard.lives = window.game[window.game.mode].lives;
  window.mtgCard.guesses = new Set();
  window.mtgCard.cardData = data;

  //reset display keyboard
  let li = document.getElementById('keyboard').children;
  for (var i = 0; i < li.length; i++) {
    li[i].classList.remove('correct');
    li[i].classList.remove('incorrect');
    li[i].classList.remove('redText');
    li[i].innerText = li[i].getAttribute('data-key');
  }

  document.getElementById('seeCard').style = 'display:none;';

  // select card face if MDFC or transform
  if (data['layout'] == 'transform' || data['layout'] == 'modal_dfc') {
    if (getParameterByName('cardFace'))
      window.mtgCard.cardFac = getParameterByName('cardFace');
    else
      window.mtgCard.cardFace = Math.floor(Math.random() * data['card_faces'].length);
    let cf = data['card_faces'][window.mtgCard.cardFace];
    data['mana_cost'] = cf['mana_cost'];
    data['colors'] = cf['colors'];
    data['image_uris'] = cf['image_uris'];
    data['name'] = cf['name'];
  }

  let html = '';

  //get mana costs
  if ((window.game.mode == 'free' && window.game.free.manaState == 2) ||
    (window.game.mode == 'daily' && !window.game.daily.hardMode)) {
    if (data['mana_cost'] == '') {
      html = 'No mana cost';
    } else {
      window.mtgCard.manaCost = [];
      if (data['layout'] == 'split' || data['layout'] == 'adventure' || data['layout'] == 'flip') {
        let tmp = data['mana_cost'].split(' // '); //for the double faced/ 2 in 1 cards
        for (var i = 0; i < tmp.length; i++) {
          if (i > 0)
            window.mtgCard.manaCost.push('//');
          window.mtgCard.manaCost = window.mtgCard.manaCost.concat(tmp[i].substring(1, tmp[i].length - 1).split('}{'));
        }
      } else {
        window.mtgCard.manaCost = window.mtgCard.manaCost.concat(data['mana_cost'].substring(1, data['mana_cost'].length - 1).split('}{'));
      }

      for (var i = 0; i < window.mtgCard.manaCost.length; i++) {
        if (window.mtgCard.manaCost[i] == '')
          continue;
        else if (window.mtgCard.manaCost[i] == '//')
          html += ' // ';
        else {
          html += '<img class="manaSymbol" src="' + window.mtgSymbols[window.mtgCard.manaCost[i]] + '">';
        }
      }
    }
    html += '<br><br>';
  } else if ((window.game.mode == 'free' && window.game.free.manaState == 1)) {
    html = 'Color' + (data['colors'].length<2?'':'s') + ': '
    if (data['colors'].length == 0) {
      html += '<img class="manaSymbol" src="' + window.mtgSymbols["C"] + '">';
    } else {
      for (var i = 0; i < data['colors'].length; i++) {
        html += '<img class="manaSymbol" src="' + window.mtgSymbols[data['colors'][i]] + '">';
      }
    }
    html += '<br><br>';
  } else {
    html = ''
  }

  document.getElementById('cardMana').innerHTML = html;

  var img = document.getElementById("cardImage");
  var newImg = new Image;
  newImg.onload = function() {
    img.src = this.src;
    document.getElementById("cardImage").style = "opacity:1;";
    document.getElementById("imageLoading").style = "display:none;";
  }
  newImg.src = data['image_uris']['art_crop'];

  let str = data['name'];
  window.mtgCard.hiddenName = hideName(str);
  document.getElementById("cardName").innerText = window.mtgCard.hiddenName;
  document.getElementById('card').style = "";
}

//letter submtted by player
function submitLetter(char) {

  //if letter already guessed, return
  if (window.mtgCard.guesses.has(char))
    return;
  window.mtgCard.guesses.add(char);

  let found = false;

  //search in real card name and replace with correct letter
  let uChar = char.toUpperCase();
  let s = window.mtgCard.cardData.name;
  let r = '';
  for (var i = 0; i < s.length; i++) {
    if (s.charAt(i) == char || s.charAt(i) == uChar) {
      found = true;
      r += s.charAt(i);
    } else {
      r += window.mtgCard.hiddenName.charAt(i);
    }
  }


  if (!found) { //letter is not in card name
    window.mtgCard.wrongGuess += char;
    //document.getElementById("wrongGuess").innerText = window.mtgCard.wrongGuess;
    window.displayKeyboard[char].classList.add('incorrect');

    if (window.mtgCard.lives != -1) {
      window.mtgCard.lives--;
      window.displayKeyboard[char].classList.add('redText');

      //set lives text on keyboard
      for (e of document.getElementsByClassName('incorrect')) {
        e.innerText = window.mtgCard.lives;
      }

      if (window.mtgCard.lives == 0) { //game lost
        window.mtgCard.end = true;
        document.getElementById('seeCard').style = '';
        if (window.game.mode == 'free') {
          gameLostFree();
        } else if (window.game.mode == 'daily') {
          gameLostDaily();
        }
      }
    }
  } else { //letter is in cardname
    window.displayKeyboard[char].classList.add('correct');
    window.mtgCard.hiddenName = r;
    document.getElementById("cardName").innerText = window.mtgCard.hiddenName;


    //player win!
    if (window.mtgCard.hiddenName == window.mtgCard.cardData.name) {
      window.mtgCard.end = true;
      document.getElementById('seeCard').style = '';

      if (window.game.mode == 'free') {
        gameWinFree();
      } else if (window.game.mode == 'daily') {
        gameWinDaily();
      }
    }
  }
}

//handler for see card button
function seeCardHandler() {
  if (window.mtgCard.hiddenName == window.mtgCard.cardData.name) {
    if (window.game.mode == 'free') {
      gameWinFree();
    } else if (window.game.mode == 'daily') {
      gameWinDaily();
    }
  } else { //lost
    if (window.game.mode == 'free') {
      gameLostFree();
    } else if (window.game.mode == 'daily') {
      gameLostDaily();
    }
  }
}

//handler for game lost scenario in free mode
function gameLostFree() {
  $.confirm({
    title: "<span style=\"font-family: 'Beleren Bold';font-size:25px;\">Totally Lost</span>",
    content: getCardHtml(),
    theme: 'dark',
    animation: 'top',
    closeAnimation: 'top',
    animateFromElement: false,
    boxWidth: 'min(400px, 80%)',
    draggable: false,
    useBootstrap: false,
    typeAnimated: true,
    closeIcon: true,
    buttons: {
      link: {
        text: "Share",
        btnClass: 'btn-green',
        action: function(linkButton) {
          var str = 'Befuddle: X\nhttps://suitangi.github.io/Befuddle/?cardId=' + window.mtgCard.id;
          clipboardHandler(linkButton, str);
          return false;
        }
      },
      close: {
        text: "Next Card",
        btnClass: 'btn-blue',
        keys: ['enter'],
        action: function() {
          requestCard(window.cardList[Math.floor(Math.random() * window.cardList.length)]);
        }
      }
    }
  });
}

//handler for game lost scenario in free mode
function gameLostDaily() {
  $.confirm({
    title: "<span style=\"font-family: 'Beleren Bold';font-size:25px;\">Totally Lost</span>",
    content: getCardHtml(),
    theme: 'dark',
    animation: 'top',
    closeAnimation: 'top',
    animateFromElement: false,
    boxWidth: 'min(400px, 80%)',
    draggable: false,
    useBootstrap: false,
    typeAnimated: true,
    closeIcon: true,
    buttons: {
      close: {
        text: "Stats",
        btnClass: 'btn-blue',
        action: function() {
          statsModal();
        }
      },
      link: {
        text: "Share",
        btnClass: 'btn-green',
        action: function(linkButton) {
          let d = new Date();
          let str = 'Daily Befuddle ' + d.toLocaleDateString("en-US") + '\nX\nhttps://suitangi.github.io/Befuddle/';
          clipboardHandler(linkButton, str);
          return false;
        }
      }
    }
  });
}


//handler for winning the game in daily mode
function gameWinDaily() {

  let wr = window.mtgCard.wrongGuess.length;

  $.confirm({
    title: "<span style=\"font-family: 'Beleren Bold';\">" + getWinTerms(wr) +
      (wr != 0 ? (" — " + wr + " wrong") : '') + "</span>",
    content: getCardHtml(),
    theme: 'dark',
    animation: 'top',
    closeAnimation: 'top',
    animateFromElement: false,
    boxWidth: 'min(400px, 80%)',
    draggable: false,
    useBootstrap: false,
    typeAnimated: true,
    closeIcon: true,
    buttons: {
      close: {
        text: "Stats",
        btnClass: 'btn-blue',
        action: function() {
          statsModal();
        }
      },
      link: {
        text: "Share",
        btnClass: 'btn-green',
        action: function(linkButton) {
          let d = new Date();
          let str = 'Daily Befuddle ' + d.toLocaleDateString("en-US") + '\n' + wr + '/' + window.game.daily.lives + '\nhttps://suitangi.github.io/Befuddle/';
          clipboardHandler(linkButton, str);
          return false;
        }
      }
    }
  });
}


//handler for winning the game in free mode
function gameWinFree() {

  let wr = window.mtgCard.wrongGuess.length;

  $.confirm({
    title: "<span style=\"font-family: 'Beleren Bold';\">" + getWinTerms(wr) +
      (wr != 0 ? (" — " + wr + " wrong") : '') + "</span>",
    content: getCardHtml(),
    theme: 'dark',
    animation: 'top',
    closeAnimation: 'top',
    animateFromElement: false,
    boxWidth: 'min(400px, 80%)',
    draggable: false,
    useBootstrap: false,
    typeAnimated: true,
    closeIcon: true,
    buttons: {
      link: {
        text: "Share",
        btnClass: 'btn-green',
        action: function(linkButton) {
          var str = 'Befuddle: ' + wr + ' wrong guess' + (wr == 1 ? '' : 'es') + '. \nhttps://suitangi.github.io/Befuddle/?cardId=' + window.mtgCard.id;
          clipboardHandler(linkButton, str);
          return false;
        }
      },
      close: {
        text: "Next Card",
        btnClass: 'btn-blue',
        keys: ['enter'],
        action: function() {
          requestCard(window.cardList[Math.floor(Math.random() * window.cardList.length)]);
        }
      }
    }
  });
}

//handler for the clipboard buttons
function clipboardHandler(linkButton, str) {
  navigator.clipboard.writeText(str).then(function() {
    linkButton.addClass('displayButton');
    linkButton.setText('Copied!');
    linkButton.addClass('btn-dark');
    linkButton.removeClass('btn-green');
    setTimeout(function(lb) {
      linkButton.removeClass('btn-dark');
      linkButton.addClass('btn-green');
    }, 100, linkButton);
    setTimeout(function(lb) {
      linkButton.setText('Share');
    }, 3000, linkButton);
  }, function() {
    clipboardError(str);
  });
}


//function to display clipboard error
function clipboardError(str) {
  $.dialog({
    title: '<span style=\"font-family: \'Beleren Bold\';font-size:25px;\">Error: Clipboard Access Denied</span>',
    content: '<span style=\"font-family: \'Beleren Bold\';\">You can manually copy the text below:<br><br><div class=\"copyText\">' + str + '</div></span>',
    type: 'red',
    theme: 'dark',
    animation: 'top',
    closeAnimation: 'top',
    animateFromElement: false,
    boxWidth: 'min(400px, 80%)',
    draggable: false,
    useBootstrap: false,
    typeAnimated: true,
    backgroundDismiss: true
  });
}


//helper to get card html display for modals
function getCardHtml() {
  let html;
  if (window.mtgCard.cardData['layout'] == 'transform' || window.mtgCard.cardData['layout'] == 'modal_dfc') {
    html = '<div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front">' +
      '<img src=\"' + window.mtgCard.cardData['card_faces'][window.mtgCard.cardFace]['image_uris']['normal'] + '\" style=\"border-radius:5%;\"><span class="material-symbols-outlined flip-symbol-front"> chevron_right </span></div> <div class="flip-card-back">' +
      '<img src=\"' + window.mtgCard.cardData['card_faces'][1 - window.mtgCard.cardFace]['image_uris']['normal'] + '\" style=\"border-radius:5%;\"><span class="material-symbols-outlined flip-symbol-back"> chevron_left </span></div></div></div>';
  } else {
    html = "<img src=\"" + window.mtgCard.cardData.image_uris.normal + "\" style=\"border-radius:5%;\">";
  }
  return html;
}


//function to get the terms for wrong guesses
function getWinTerms(ind) {
  let terms = ['Compleat Perfection!', 'Ancestrally Recalled', 'Thought Twice', 'Pondered Well', 'Delved into Secrets', 'Pieces Pored Over', 'Faithlessly Looted', 'Tome Scoured', 'Dashed Hopes', 'Thoughts Siezed',
    'Mind Ground', 'Wildly Guessed', 'Yawgmoth\'s Wouldn\'t', 'Triskaidekaphobia!', 'Gone Blank', 'Gone Blank', 'Gone Blank', 'Gone Blank', 'Gone Blank', 'Gone Blank', 'Gone Blank',
    'Gone Blank', 'Gone Blank', 'Gone Blank', 'Gone Blank', 'Gone Blank', 'Gone Blank'
  ];
  if (window.mtgCard.lives == 1)
    return 'Final Fortune';
  return terms[ind];
}

//function to hide the name of the card
function hideName(str) {
  let r = '';
  for (var i = 0; i < str.length; i++) {
    if (isAlpha(str.charAt(i)))
      r += '_';
    else
      r += str.charAt(i);
  }
  return r;
}

//function to handle the help button
function helpModal() {
  if (window.game.mode == 'daily') {
    $.dialog({
      title: '<span style=\"font-family: \'Beleren Bold\';font-size:25px;\">How to Play</span>',
      content: '<span style=\"font-family: \'Beleren Bold\';\">This is the help page for the daily game</span>',
      theme: 'dark',
      animation: 'top',
      closeAnimation: 'top',
      animateFromElement: false,
      boxWidth: 'min(400px, 80%)',
      draggable: false,
      backgroundDismiss: true,
      useBootstrap: false
    });
  } else if (window.game.mode == 'free') {
    $.dialog({
      title: '<span style=\"font-family: \'Beleren Bold\';font-size:25px;\">How to Play</span>',
      content: '<span style=\"font-family: \'Beleren Bold\';\">This is the help page for the free play game</span>',
      theme: 'dark',
      animation: 'top',
      closeAnimation: 'top',
      animateFromElement: false,
      boxWidth: 'min(400px, 80%)',
      draggable: false,
      backgroundDismiss: true,
      useBootstrap: false
    });
  }
}

//function to handle the settings button
function settingsModal() {

  let gameSettingsHtml = '';


  if (window.game.mode == 'daily') {
    $.dialog({
      title: '<span style=\"font-family: \'Beleren Bold\';font-size:25px;\">Options</span>',
      content: gameSettingsHtml,
      theme: 'dark',
      animation: 'top',
      closeAnimation: 'top',
      animateFromElement: false,
      boxWidth: 'min(400px, 80%)',
      draggable: false,
      backgroundDismiss: true,
      useBootstrap: false,
      onContentReady: function() {

      }
    });
  } else if (window.game.mode == 'free') {

    let manastates = ['Show Nothing', 'Show Only Colors', 'Show Mana Cost'];

    gameSettingsHtml += '<div class="gameSettings">' +
      '<span class="menuText">Lives: <span id="livesdisplay">' + (window.game.free.lives == -1 ? 'Off' : window.game.free.lives) + '</span></span>' +
      '<div class="slidecontainer"><input id="livesInput" type="range" min="0" max="25" value="' + window.game.free.lives + '" class="slider">' +
      '<br><br><span class="menuText" id="manadisplay">' + manastates[window.game.free.manaState] + '</span>' +
      '<div class="slidecontainer"><input id="manaInput" type="range" min="0" max="2" value="' + window.game.free.manaState + '" class="slider">' +
      '<br><br><span class="smallText">Game changes won\'t be adjusted until next round.</span><br>' +
      '</div></div>';
    $.dialog({
      title: '<span style=\"font-family: \'Beleren Bold\';font-size:25px;\">Options</span>',
      content: gameSettingsHtml,
      theme: 'dark',
      animation: 'top',
      closeAnimation: 'top',
      animateFromElement: false,
      boxWidth: 'min(400px, 80%)',
      draggable: false,
      backgroundDismiss: true,
      useBootstrap: false,
      onContentReady: function() {
        let lv = this.$content.find('#livesInput');
        lv.on('input', function() {
          if (this.value > 0) {
            document.getElementById('livesdisplay').innerText = this.value;
            window.game.free.lives = this.value;
          } else if (this.value == 0) {
            document.getElementById('livesdisplay').innerText = 'Off';
            window.game.free.lives = -1;
          }
        });

        let mi = this.$content.find('#manaInput');
        mi.on('input', function() {
          let manastates = ['Show Nothing', 'Show Only Colors', 'Show Mana Cost'];
          window.game.free.manaState = this.value;
          document.getElementById('manadisplay').innerText = manastates[this.value];
        });
      }
    });
  }
}

//function to handle status button
function statsModal() {
  $.dialog({
    title: '<span style=\"font-family: \'Beleren Bold\';font-size:25px;\">Statistics</span>',
    content: '<span style=\"font-family: \'Beleren Bold\';\">Statistics Page\nStatistics Page\nStatistics Page\nStatistics Page\nStatistics Page\nStatistics Page\nStatistics Page\nStatistics Page\n</span>',
    theme: 'dark',
    animation: 'top',
    closeAnimation: 'top',
    animateFromElement: false,
    boxWidth: 'min(400px, 80%)',
    draggable: false,
    backgroundDismiss: true,
    useBootstrap: false
  });
}


//function to display initial main menu
function mainMenuDisplay() {
  $.confirm({
    title: '<span style=\"font-family: \'Beleren Bold\';font-size:30px;line-height: 30px;\">Welcome to Befuddle</span>',
    content: '<span style=\"font-family: \'Beleren Bold\';user-select:none;\">Select your game mode:</span>',
    theme: 'supervan',
    animation: 'opacity',
    closeAnimation: 'top',
    animateFromElement: false,
    boxWidth: 'min(400px, 80%)',
    draggable: false,
    backgroundDismiss: false,
    backgroundDismissAnimation: 'none',
    useBootstrap: false,
    buttons: {
      daily: {
        text: '<span style=\"font-family: \'Beleren Bold\';user-select:none;\">Daily Befuddle</span>',
        action: function() {
          window.game.mode = 'daily';
          loadGame();
        }
      },
      free: {
        text: '<span style=\"font-family: \'Beleren Bold\';user-select:none;\">Free Play</span>',
        action: function() {
          window.game.mode = 'free';
          loadGame();
        }
      }
    }
  });
}

//functinon to load the game
function loadGame() {

  if (window.game.mode == undefined) {
    mainManuDisplay();
    return;
  }

  //setup the keyboard
  let li = document.getElementById('keyboard').children;
  for (var i = 0; i < li.length; i++) {
    window.displayKeyboard[li[i].innerText.toLowerCase()] = li[i];
    li[i].setAttribute('data-key', li[i].innerText);
    li[i].addEventListener('click', function() {
      submitLetter(this.getAttribute('data-key').toLowerCase());
    });
  }

  //setup keyboard typing
  document.onkeypress = function(e) {
    e = e || window.event;
    if (!window.mtgCard.end && e.keyCode >= 97 && e.keyCode <= 122) {
      submitLetter(String.fromCharCode(e.keyCode));
    }
    if (!window.mtgCard.end && e.keyCode >= 65 && e.keyCode <= 90) {
      submitLetter(String.fromCharCode(e.keyCode).toLowerCase());
    }
  };


  //Fetch different things based on different mode
  if (window.game.mode == 'daily') {
    //fetch card list then request
    fetch('https://raw.githubusercontent.com/suitangi/Befuddle/main/dailyList.json')
      .then(response => response.json())
      .then(data => {
        document.getElementById("cardImage").style = "opacity:0; transition: opacity 0s;";
        document.getElementById("imageLoading").style = "";
        let d = new Date();
        loadCard(data[d.getDOY()]);
      });
  } else if (window.game.mode == 'free') {
    //fetch card list then request
    fetch('https://raw.githubusercontent.com/suitangi/Befuddle/main/cardList.json')
      .then(response => response.json())
      .then(data => {
        window.cardList = data;
        if (getParameterByName('cardId'))
          requestCard(getParameterByName('cardId'));
        else
          requestCard(window.cardList[Math.floor(Math.random() * window.cardList.length)]);
      });
  }
}

//start script
$(document).ready(function() {

  console.log('https://scryfall.com/card/unh/30/cheatyface')

  window.displayKeyboard = {};
  window.game = {};

  window.game.daily = {};
  window.game.daily.lives = 7;
  window.game.daily.hardMode = false;

  window.game.free = {};
  window.game.free = {};
  window.game.free.lives = -1;
  window.game.free.manaState = 2;

  //specific link to card
  if (getParameterByName('cardId')) {
    window.game.mode = 'free';
    loadGame();
  } else {
    mainMenuDisplay();
  }

  //setup onclick for top nav buttons
  document.getElementById('stats-button').addEventListener('click', function() {
    statsModal();
  });
  document.getElementById('settings-button').addEventListener('click', function() {
    settingsModal();
  });
  document.getElementById('help-button').addEventListener('click', function() {
    helpModal();
  });

  document.getElementById('seeCard').addEventListener('click', function() {
    seeCardHandler();
  });

});

//Stackoverflow it
//Get leap year
Date.prototype.isLeapYear = function() {
  var year = this.getFullYear();
  if ((year & 3) != 0) return false;
  return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.getDOY = function() {
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = this.getMonth();
  var dn = this.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if (mn > 1 && this.isLeapYear()) dayOfYear++;
  return dayOfYear;
};
