function getParameterByName(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var a=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return a?a[2]?decodeURIComponent(a[2].replace(/\+/g," ")):"":null}function recreateNode(e,t){if(t)e.parentNode.replaceChild(e.cloneNode(!0),e);else{for(var a=e.cloneNode(!1);e.hasChildNodes();)a.appendChild(e.firstChild);e.parentNode.replaceChild(a,e)}}function requestCard(e){document.getElementById("cardImage").style="opacity:0; transition: opacity 0s;",document.getElementById("imageLoading").style="",fetch("https://api.scryfall.com/cards/"+e).then((e=>e.json())).then((e=>loadCard(e)))}function isAlpha(e){return c=e.toLowerCase().charCodeAt(0),c>=97&&c<=122}function loadCard(e){if(e){if(window.mtgCard={},window.mtgCard.id=e.id,window.mtgCard.layout=e.layout,window.mtgCard.mana_cost=e.mana_cost,window.mtgCard.name=e.name,window.mtgCard.colors=e.colors,"transform"==window.mtgCard.layout||"modal_dfc"==window.mtgCard.layout){window.mtgCard.card_faces=[];for(var t=0;t<e.card_faces.length;t++)window.mtgCard.card_faces.push({mana_cost:e.card_faces[t].mana_cost,colors:e.card_faces[t].colors,name:e.card_faces[t].name,image_uris:{normal:e.card_faces[t].image_uris.normal,art_crop:e.card_faces[t].image_uris.art_crop}})}else window.mtgCard.image_uris={normal:e.image_uris.normal,art_crop:e.image_uris.art_crop};window.gameSesh={},window.gameSesh.end=!1,window.gameSesh.wrongGuess="",window.gameSesh.guesses="",window.gameSesh.tlv=window.game[window.game.mode].lives,"free"==window.game.mode&&(window.gameSesh.manastate=window.game.free.manaState),window.gameSesh.hideBlanks=window.game[window.game.mode].hideBlanks,window.gameSesh.card=window.mtgCard}window.lives=window.game[window.game.mode].lives;let a=document.getElementById("keyboard").children;for(t=0;t<a.length;t++)a[t].classList.remove("correct"),a[t].classList.remove("incorrect"),a[t].classList.remove("redText"),a[t].innerText=a[t].getAttribute("data-key");if(document.getElementById("seeCard").style="display:none;",window.mtgCard.cf=-1,"transform"==window.mtgCard.layout||"modal_dfc"==window.mtgCard.layout){getParameterByName("cf")?window.mtgCard.cf=parseInt(getParameterByName("cf")):"daily"==window.game.mode?window.mtgCard.cf=0:window.mtgCard.cf=Math.floor(Math.random()*window.mtgCard.card_faces.length);let e=window.mtgCard.card_faces[window.mtgCard.cf];window.mtgCard.mana_cost=e.mana_cost,window.mtgCard.colors=e.colors,window.mtgCard.image_uris=e.image_uris,window.mtgCard.name=e.name}let n="";if("free"==window.game.mode&&2==window.gameSesh.manastate||"daily"==window.game.mode){if(""==window.mtgCard.mana_cost)n="No mana cost";else{if(window.mtgCard.manaCost=[],"split"==window.mtgCard.layout||"adventure"==window.mtgCard.layout||"flip"==window.mtgCard.layout){let e=window.mtgCard.mana_cost.split(" // ");for(t=0;t<e.length;t++)t>0&&window.mtgCard.manaCost.push("//"),window.mtgCard.manaCost=window.mtgCard.manaCost.concat(e[t].substring(1,e[t].length-1).split("}{"))}else window.mtgCard.manaCost=window.mtgCard.manaCost.concat(window.mtgCard.mana_cost.substring(1,window.mtgCard.mana_cost.length-1).split("}{"));for(t=0;t<window.mtgCard.manaCost.length;t++)""!=window.mtgCard.manaCost[t]&&("//"==window.mtgCard.manaCost[t]?n+=" // ":n+='<img class="manaSymbol" alt="'+window.mtgCard.manaCost[t]+'" src="'+window.mtgSymbols[window.mtgCard.manaCost[t]]+'">')}n+="<br><br>"}else if("free"==window.game.mode&&1==window.gameSesh.manastate){if(n="Color"+(window.mtgCard.colors.length<2?"":"s")+": ",0==window.mtgCard.colors.length)n+='<img class="manaSymbol" src="'+window.mtgSymbols.C+'">';else for(t=0;t<window.mtgCard.colors.length;t++)n+='<img class="manaSymbol" alt="'+window.mtgCard.colors[t]+'" src="'+window.mtgSymbols[window.mtgCard.colors[t]]+'">';n+="<br><br>"}else n="";document.getElementById("cardMana").innerHTML=n;var o=document.getElementById("cardImage"),i=new Image;i.onload=function(){o.src=this.src,document.getElementById("cardImage").style="opacity:1;",document.getElementById("imageLoading").style="display:none;"},i.src=window.mtgCard.image_uris.art_crop;let d=window.mtgCard.name;window.gameSesh.hideBlanks?window.gameSesh.hiddenName=hideName(d,""):window.gameSesh.hiddenName=hideName(d,"_"),document.getElementById("cardName").innerText=window.gameSesh.hiddenName,document.getElementById("card").style="","daily"==window.game.mode&&Cookies.set("daily",JSON.stringify(window.gameSesh),{expires:365})}function loadGuesses(){window.loadingGuesses=!0;let e=window.gameSesh.guesses;window.gameSesh.wrongGuess="",window.gameSesh.guesses="";for(var t=0;t<e.length;t++)submitLetter(e.charAt(t));window.loadingGuesses=!1}function submitLetter(t){if(window.gameSesh.guesses.includes(t))return;window.gameSesh.guesses+=t;let a=!1,n=t.toUpperCase(),o=window.mtgCard.name,i="";for(var d=0;d<o.length;d++)o.charAt(d)==t||o.charAt(d)==n?(a=!0,i+=o.charAt(d)):window.gameSesh.hideBlanks?!window.gameSesh.guesses.includes(o.toLowerCase().charAt(d))&&isAlpha(o.charAt(d))||(i+=o.charAt(d)):i+=window.gameSesh.hiddenName.charAt(d);if(a)window.displayKeyboard[t].classList.add("correct"),window.gameSesh.hiddenName=i,document.getElementById("cardName").innerText=window.gameSesh.hiddenName,window.loadingGuesses||(window.gameSesh.hideBlanks?window.stats[window.game.mode].acc[2]++:window.stats[window.game.mode].acc[0]++,Cookies.set(window.game.mode+"Stats",JSON.stringify(window.stats[window.game.mode]),{expires:365})),window.gameSesh.hiddenName==window.mtgCard.name&&(window.gameSesh.end=!0,document.getElementById("seeCard").style="","free"==window.game.mode?gameWinFree():"daily"==window.game.mode&&gameWinDaily());else if(window.gameSesh.wrongGuess+=t,window.displayKeyboard[t].classList.add("incorrect"),window.loadingGuesses||(window.gameSesh.hideBlanks?window.stats[window.game.mode].acc[3]++:window.stats[window.game.mode].acc[1]++,Cookies.set(window.game.mode+"Stats",JSON.stringify(window.stats[window.game.mode]),{expires:365})),-1!=window.lives){for(e of(window.lives--,window.displayKeyboard[t].classList.add("redText"),document.getElementsByClassName("incorrect")))e.innerText=window.lives;0==window.lives&&(window.gameSesh.end=!0,document.getElementById("seeCard").style="","free"==window.game.mode?gameLostFree():"daily"==window.game.mode&&gameLostDaily())}Cookies.set(window.game.mode,JSON.stringify(window.gameSesh),{expires:365})}function seeCardHandler(){window.gameSesh.hiddenName==window.mtgCard.name?"free"==window.game.mode?gameWinFree():"daily"==window.game.mode&&gameWinDaily():"free"==window.game.mode?gameLostFree():"daily"==window.game.mode&&gameLostDaily()}function gameLostFree(){-1!=window.gameSesh.tlv&&(window.gameSesh.hideBlanks?window.stats.free.wr[1][window.gameSesh.tlv-1][1]++:window.stats.free.wr[0][window.gameSesh.tlv-1][1]++,Cookies.set("freeStats",JSON.stringify(window.stats.free),{expires:365})),$.confirm({title:'<span class="modalTitle">Totally Lost</span>',content:getCardHtml(),theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,useBootstrap:!1,typeAnimated:!0,closeIcon:!0,buttons:{link:{text:"Share",btnClass:"btn-green",action:function(e){return clipboardHandler(e,"Befuddle:\n"+(-1==window.gameSesh.tlv?"Gave Up":"X/"+window.gameSesh.tlv)+(window.gameSesh.hideBlanks?"*":"")+"\nhttps://suitangi.github.io/Befuddle/?cardId="+window.mtgCard.id+(-1!=window.mtgCard.cf?"&cf="+window.mtgCard.cf:"")),!1}},close:{text:"Next Card",btnClass:"btn-blue",keys:["enter"],action:function(){requestCard(window.cardList[Math.floor(Math.random()*window.cardList.length)])}}}})}function gameLostDaily(){if(null!=window.dailyModal)return void window.window.dailyModal.open();let e=(new Date).getDOY();window.stats.daily.doy!=e&&(window.stats.daily.doy=e,window.stats.daily.streak=0,window.gameSesh.hideBlanks?window.stats.daily.WL[3]++:window.stats.daily.WL[1]++,Cookies.set("dailyStats",JSON.stringify(window.stats.daily),{expires:365})),window.dailyModal=$.confirm({title:'<span class="modalTitle">Totally Lost</span>',content:getCardHtml()+'<div id="dailyTimerDisplay"></div>',theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,useBootstrap:!1,typeAnimated:!0,closeIcon:!0,buttons:{close:{text:"Stats",btnClass:"btn-blue",action:function(){statsModal()}},link:{text:"Share",btnClass:"btn-green",action:function(e){return clipboardHandler(e,"Daily Befuddle "+(new Date).toLocaleDateString("en-US")+"\nX"+(window.gameSesh.hideBlanks?"*":"")+"\nhttps://suitangi.github.io/Befuddle/"),!1}}}})}function gameWinDaily(){if(null!=window.dailyModal)return void window.window.dailyModal.open();let e=window.gameSesh.wrongGuess.length,t=(new Date).getDOY();window.stats.daily.doy!=t&&(window.stats.daily.doy=t,window.stats.daily.streak++,window.stats.daily.streak>window.stats.daily.maxStk&&(window.stats.daily.maxStk=window.stats.daily.streak),window.gameSesh.hideBlanks?(window.stats.daily.score[1][e]++,window.stats.daily.WL[2]++):(window.stats.daily.score[0][e]++,window.stats.daily.WL[0]++),Cookies.set("dailyStats",JSON.stringify(window.stats.daily),{expires:365})),window.dailyModal=$.confirm({title:'<span class="modalText">'+getWinTerms(e)+(0!=e?" — "+e+" wrong":"")+"</span>",content:getCardHtml()+'<div id="dailyTimerDisplay"></div>',theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,useBootstrap:!1,typeAnimated:!0,closeIcon:!0,buttons:{close:{text:"Stats",btnClass:"btn-blue",action:function(){statsModal()}},link:{text:"Share",btnClass:"btn-green",action:function(t){return clipboardHandler(t,"Daily Befuddle "+(new Date).toLocaleDateString("en-US")+"\n"+e+"/"+window.game.daily.lives+(window.gameSesh.hideBlanks?"*":"")+"\nhttps://suitangi.github.io/Befuddle/"),!1}}}})}function gameWinFree(){let e=window.gameSesh.wrongGuess.length;window.gameSesh.hideBlanks?(0==e&&window.stats.free.perf[1]++,-1!=window.gameSesh.tlv&&window.stats.free.wr[1][window.gameSesh.tlv-1][0]++,window.stats.free.score[1][e]++):(0==e&&window.stats.free.perf[0]++,-1!=window.gameSesh.tlv&&window.stats.free.wr[0][window.gameSesh.tlv-1][0]++,window.stats.free.score[0][e]++),Cookies.set("freeStats",JSON.stringify(window.stats.free),{expires:365}),$.confirm({title:'<span class="modalText">'+getWinTerms(e)+(0!=e?" — "+e+" wrong":"")+"</span>",content:getCardHtml(),theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,useBootstrap:!1,typeAnimated:!0,closeIcon:!0,buttons:{link:{text:"Share",btnClass:"btn-green",action:function(t){return clipboardHandler(t,"Befuddle: \n"+e+(-1==window.gameSesh.tlv?" wrong guess"+(1==e?"":"es"):"/"+window.gameSesh.tlv)+(window.gameSesh.hideBlanks?"*":"")+" \nhttps://suitangi.github.io/Befuddle/?cardId="+window.mtgCard.id+(-1!=window.mtgCard.cf?"&cf="+window.mtgCard.cf:"")),!1}},close:{text:"Next Card",btnClass:"btn-blue",keys:["enter"],action:function(){window.cardList?requestCard(window.cardList[Math.floor(Math.random()*window.cardList.length)]):loadGame()}}}})}function clipboardHandler(e,t){navigator.clipboard.writeText(t).then((function(){e.addClass("displayButton"),e.setText("Copied"),e.addClass("btn-dark"),e.removeClass("btn-green"),setTimeout((function(t){e.removeClass("btn-dark"),e.addClass("btn-green")}),100,e),setTimeout((function(t){e.setText("Share")}),3e3,e)}),(function(){clipboardError(t)}))}function clipboardError(e){$.dialog({title:'<span class="modalTitle">Error: Clipboard Access Denied</span>',content:'<span class="modalText">You can manually copy the text below:<br><br><div class="copyText">'+e+"</div></span>",type:"red",theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,useBootstrap:!1,typeAnimated:!0,backgroundDismiss:!0})}function getCardHtml(){let e;return e="transform"==window.mtgCard.layout||"modal_dfc"==window.mtgCard.layout?'<div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front"><img src="'+window.mtgCard.card_faces[window.mtgCard.cf].image_uris.normal+'" style="border-radius:5%;"><span class="material-symbols-outlined flip-symbol-front"> chevron_right </span></div> <div class="flip-card-back"><img src="'+window.mtgCard.card_faces[1-window.mtgCard.cf].image_uris.normal+'" style="border-radius:5%;"><span class="material-symbols-outlined flip-symbol-back"> chevron_left </span></div></div></div>':'<img src="'+window.mtgCard.image_uris.normal+'" style="border-radius:5%;">',e}function getWinTerms(e){return 1==window.lives?"Final Fortune":["Compleat Perfection!","Ancestrally Recalled","Thought Twice","Pondered Well","Delved into Secrets","Pieces Pored Over","Faithlessly Looted","Tome Scoured","Dashed Hopes","Thoughts Siezed","Mind Ground","Wildly Guessed","Yawgmoth's Wouldn't","Triskaidekaphobia!","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank","Gone Blank"][e]}function hideName(e,t){let a="";for(var n=0;n<e.length;n++)isAlpha(e.charAt(n))?a+=t:a+=e.charAt(n);return a}function helpModal(){"daily"==window.game.mode?$.dialog({title:'<span class="modalTitle">How to Play</span>',content:'<span class="helpText">Guess the <a href="https://magic.wizards.com/en" target="_blank">Magic: The Gathering</a> Card from the art and mana cost, Hangman style. You have 7 lives, meaning after guessing 7 wrong letters, the game is over.<br><br>After each guess, the keys will show you if the letter was incorrect, as well as the number of lives you have left.<br><br></span><div class="hr"></div><span class="helpText">A new Befuddle will be available each day!',theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,backgroundDismiss:!0,useBootstrap:!1}):"free"==window.game.mode&&$.dialog({title:'<span class="modalTitle">How to Play</span>',content:'<span class="helpText">Guess the <a href="https://magic.wizards.com/en" target="_blank">Magic: The Gathering</a> Card, Hangman style. Each card is randomly picked from a list of 30,000+ cards. You can adjust the number of lives and the mana cost display in the options menu.<br><br>After each guess, the keyboard keys will show you if the letter was incorrect, as well as the number of lives you have left.<br><br></span><div class="hr"></div><span class="helpText">This is Free Play mode, play to your heart\'s content!',theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,backgroundDismiss:!0,useBootstrap:!1})}function settingsModal(){let e="";if("daily"==window.game.mode)e+='<div class="gameSettings"><br><span class="menuText" id="hmdisplay">Hidden mode</span><label class="switch"><input id="hmInput" type="checkbox" '+(window.game.daily.hideBlanks?"checked":"")+'><div><span></span></div></label><span class="smallText">Hidden mode hides the letter blanks.</span><br><br><div class="hr"></div><span class="smallText">Changes won\'t apply until the next game you play.</span><br></div>',$.dialog({title:'<span class="modalTitle">Options</span>',content:e,theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,backgroundDismiss:!0,useBootstrap:!1,onContentReady:function(){this.$content.find("#hmInput").on("input",(function(){window.game.daily.hideBlanks=this.checked,Cookies.set("befuddle",JSON.stringify(window.game),{expires:365})}))}});else if("free"==window.game.mode){let t=["Show Nothing","Show Colors","Show Mana Cost"];e+='<div class="gameSettings"><br><span class="menuText">Lives: <span id="livesdisplay">'+(-1==window.game.free.lives?"Off":window.game.free.lives)+'</span></span><div class="slidecontainer"><input id="livesInput" type="range" min="0" max="25" value="'+window.game.free.lives+'" class="slider"></div><br><span class="menuText" id="manadisplay">'+t[window.game.free.manaState]+'</span><div class="slidecontainer"><input id="manaInput" type="range" min="0" max="2" value="'+window.game.free.manaState+'" class="slider"></div><br><span class="menuText" id="hidedisplay">Hidden Mode</span><label class="switch"><input id="hideInput" type="checkbox" '+(window.game.free.hideBlanks?"checked":"")+'><div><span></span></div></label><span class="smallText">Hidden mode hides the letter blanks.</span><br><br><div class="hr"></div><span class="smallText">Game changes won\'t be adjusted until next card.</span><br></div>',$.dialog({title:'<span class="modalTitle">Options</span>',content:e,theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,backgroundDismiss:!0,useBootstrap:!1,onContentReady:function(){this.$content.find("#livesInput").on("input",(function(){this.value>0?(document.getElementById("livesdisplay").innerText=this.value,window.game.free.lives=parseInt(this.value)):0==this.value&&(document.getElementById("livesdisplay").innerText="Off",window.game.free.lives=-1),Cookies.set("befuddle",JSON.stringify(window.game),{expires:365})})),this.$content.find("#manaInput").on("input",(function(){window.game.free.manaState=parseInt(this.value),document.getElementById("manadisplay").innerText=["Show Nothing","Show Colors","Show Mana Cost"][parseInt(this.value)],Cookies.set("befuddle",JSON.stringify(window.game),{expires:365})})),this.$content.find("#hideInput").on("input",(function(){window.game.free.hideBlanks=this.checked,Cookies.set("befuddle",JSON.stringify(window.game),{expires:365})}))}})}}function statsModal(){let e="";"daily"==window.game.mode?e+='<div id="streakTitle">Streak</div><div><table id="streakTable"><tbody><tr><th>Current</th><th>Max</th></tr><tr><td>'+window.stats.daily.streak+"</td><td>"+window.stats.daily.maxStk+'</td></tr></tbody></table></div><canvas id="wrChart" class="chartCanvas" width="400px" height="300px"></canvas><canvas id="scoreChart" class="chartCanvas" width="400px" height="300px"></canvas><canvas id="accChart" class="chartCanvas" width="400px" height="300px"></canvas>':"free"==window.game.mode&&(e+='<div id="streakTitle">Perfect Games</div><div><table id="streakTable"><tbody><tr><th>Normal Mode</th><th>Hidden Mode</th></tr><tr><td>'+window.stats.free.perf[0]+"</td><td>"+window.stats.free.perf[1]+'</td></tr></tbody></table></div><canvas id="wrChart" class="chartCanvas" width="400px" height="300px"></canvas><canvas id="scoreChart" class="chartCanvas" width="400px" height="300px"></canvas><canvas id="accChart" class="chartCanvas" width="400px" height="300px"></canvas>'),$.dialog({title:'<span class="modalTitle">Statistics</span>',content:e,theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,backgroundDismiss:!0,useBootstrap:!1,onContentReady:function(){"daily"==window.game.mode?dailyChartsSetup():"free"==window.game.mode&&freeChartsSetup()}})}function freeChartsSetup(){let e,t,a=[[],[]],n=[],o=[];for(var i=0;i<25;i++){for(var d=0;d<2;d++)e=window.stats.free.wr[d][i][0],t=window.stats.free.wr[d][i][1],e==t?a[d].push(.5):a[d].push(e/(e+t));n.push(i),o.push(i+1)}lineChart(document.getElementById("wrChart"),{labels:o,datasets:[{label:"Normal",data:a[0],backgroundColor:"#C1D8FF",borderColor:"#C1D8FF"},{label:"Hidden",data:a[1],backgroundColor:"#5379BA",borderColor:"#5379BA"}]},"Win Rate vs Lives"),vertBarChart(document.getElementById("scoreChart").getContext("2d"),{labels:n,datasets:[{label:"Normal",data:window.stats.free.score[0],backgroundColor:"#C1D8FF",borderColor:"rgba(0, 0, 0, 0)",borderWidth:1,stack:"Stack 0"},{label:"Hidden",data:window.stats.free.score[1],backgroundColor:"#5379BA",borderColor:"rgba(0, 0, 0, 0)",borderWidth:1,stack:"Stack 0"}]},"Score Distribution"),mspie(document.getElementById("accChart").getContext("2d"),{labels:["Correct (Normal)","Incorrect (Normal)","Correct (Hidden)","Incorrect (Hidden)"],datasets:[{backgroundColor:["#C1D8FF","#FFC1B7"],data:[window.stats.free.acc[0],window.stats.free.acc[1]],borderColor:"rgba(0, 0, 0, 0)",borderWidth:2},{backgroundColor:["#5379BA","#A35347"],data:[window.stats.free.acc[2],window.stats.free.acc[3]],borderColor:"rgba(0, 0, 0, 0)",borderWidth:2}]},"Letter Accuracy")}function dailyChartsSetup(){mspie(document.getElementById("wrChart").getContext("2d"),{labels:["Win (Normal)","Loss (Normal)","Win (Hidden)","Loss (Hidden)"],datasets:[{backgroundColor:["#C1D8FF","#FFC1B7"],data:[window.stats.daily.WL[0],window.stats.daily.WL[1]],borderColor:"rgba(0, 0, 0, 0)",borderWidth:2},{backgroundColor:["#5379BA","#A35347"],data:[window.stats.daily.WL[2],window.stats.daily.WL[3]],borderColor:"rgba(0, 0, 0, 0)",borderWidth:2}]},"Daily Win/Loss"),vertBarChart(document.getElementById("scoreChart").getContext("2d"),{labels:[0,1,2,3,4,5,6],datasets:[{label:"Normal",data:window.stats.daily.score[0],backgroundColor:"#C1D8FF",borderColor:"rgba(0, 0, 0, 0)",borderWidth:1,stack:"Stack 0"},{label:"Hidden",data:window.stats.daily.score[1],backgroundColor:"#5379BA",borderColor:"rgba(0, 0, 0, 0)",borderWidth:1,stack:"Stack 0"}]},"Score Distribution"),mspie(document.getElementById("accChart").getContext("2d"),{labels:["Correct (Normal)","Incorrect (Normal)","Correct (Hidden)","Incorrect (Hidden)"],datasets:[{backgroundColor:["#C1D8FF","#FFC1B7"],data:[window.stats.daily.acc[0],window.stats.daily.acc[1]],borderColor:"rgba(0, 0, 0, 0)",borderWidth:2},{backgroundColor:["#5379BA","#A35347"],data:[window.stats.daily.acc[2],window.stats.daily.acc[3]],borderColor:"rgba(0, 0, 0, 0)",borderWidth:2}]},"Letter Accuracy")}function menuModal(){let e=$.dialog({title:"",content:'<div class="modalTitle" style="text-align: center;font-size: 30px;">Befuddle</div><br><button id="returnButton" class="menuButton">Select Game Mode</button>'+(window.gameSesh.end?"":'<br><button id="guButton" class="menuButton">Show Answer</button>')+'<br><button id="clearButton" class="menuButton">Clear Data</button><br><br><div class="hr"></div><div class="modalText" id="credits">Credits <span id="creditExpand" class="material-symbols-outlined"> expand_more </span></div><div id="creditText"class="expandiv collapsediv">• Card Data: <a href="https://scryfall.com/" target="_blank">Scryfall</a><br>• Card Images: <a href="https://scryfall.com/" target="_blank">Scryfall</a><br>• Font: <a href="https://company.wizards.com/en" target="_blank">Wizards of the Coast</a><br><br></div><div class="hr"></div><div class="modalText" id="disclaimer">Disclaimer  <span id="disclaimerExpand" class="material-symbols-outlined"> expand_more </span></div><div id="disclaimerText" class="expandiv collapsediv">Portions of Befuddle are unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy. The literal and graphical information presented on this site about Magic: The Gathering, including card images, the mana symbols, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. Befuddle is not produced by, endorsed by, supported by, or affiliated with Wizards of the Coast.<br><br></div><div class="hr"></div><div class="helpText" style="text-align: center;">Developed with <span class="material-symbols-outlined" style="font-size: 11px;font-variation-settings: \'FILL\' 1;color: #64baf7;"> favorite </span> by <a href="https://github.com/suitangi" target="_blank">Suitangi</a></div>',theme:"dark",animation:"left",closeAnimation:"left",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,backgroundDismiss:!0,useBootstrap:!1,onContentReady:function(){document.getElementById("credits").addEventListener("click",(function(){let e=document.getElementById("creditText");e.classList.contains("collapsediv")?(e.classList.remove("collapsediv"),document.getElementById("creditExpand").classList.add("rotato")):(e.classList.add("collapsediv"),document.getElementById("creditExpand").classList.remove("rotato"))})),document.getElementById("disclaimer").addEventListener("click",(function(){let e=document.getElementById("disclaimerText");e.classList.contains("collapsediv")?(e.classList.remove("collapsediv"),document.getElementById("disclaimerExpand").classList.add("rotato")):(e.classList.add("collapsediv"),document.getElementById("disclaimerExpand").classList.remove("rotato"))})),document.getElementById("clearButton").addEventListener("click",(function(){$.confirm({title:'<span class="modalTitle">Clear Data</span>',content:'<span class="helpText">This will clear all cookies, delete all statisticss and all unfinished Befuddles. Are you sure?</span>',theme:"dark red",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(300px, 60%)",draggable:!1,backgroundDismiss:!1,useBootstrap:!1,buttons:{show:{text:"Clear Data",btnClass:"btn-red",action:function(){Cookies.remove("befuddle"),Cookies.remove("daily"),Cookies.remove("free"),Cookies.remove("dailyStats"),Cookies.remove("freeStats")}},cancel:{text:"Cancel",btnClass:"btn-default"}}})})),document.getElementById("returnButton").addEventListener("click",(function(){window.gameSesh.end=!0,e.close(),mainMenuDisplay()})),window.gameSesh.end||document.getElementById("guButton").addEventListener("click",(function(){$.confirm({title:'<span class="modalTitle">Show Answer</span>',content:'<span class="helpText">Are you sure you want to abandon this Befuddle?</span>',theme:"dark red",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(300px, 60%)",draggable:!1,backgroundDismiss:!1,useBootstrap:!1,buttons:{show:{text:"Show Answer",btnClass:"btn-red",action:function(){window.gameSesh.end=!0,document.getElementById("seeCard").style="","daily"==window.game.mode?gameLostDaily():"free"==window.game.mode&&gameLostFree(),e.close()}},cancel:{text:"Cancel",btnClass:"btn-default"}}})}))}})}function continueGameModal(){$.confirm({title:'<span class="modalTitle">Continue?</span>',content:'<span class="modalText">Previous game data found, would you like to continue?</span>',theme:"dark",animation:"top",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,backgroundDismiss:!1,useBootstrap:!1,buttons:{free:{text:"New Game",btnClass:"btn-purple",action:function(){window.gameSesh.end=!0,Cookies.remove("free"),loadGame()}},daily:{text:"Continue",btnClass:"btn-blue",action:function(){loadGame()}}}})}function mainMenuDisplay(){$.confirm({title:'<span id="mainMenuTitle">Welcome to Befuddle</span>',content:'<span class="mainMenuText">Select your game mode:</span>',theme:"supervan",animation:"opacity",closeAnimation:"top",animateFromElement:!1,boxWidth:"min(400px, 80%)",draggable:!1,backgroundDismiss:!1,backgroundDismissAnimation:"none",useBootstrap:!1,buttons:{daily:{text:'<span class="mainMenuText">Daily Befuddle</span>',action:function(){window.game.mode="daily",Cookies.get("daily")&&(window.gameSesh=JSON.parse(Cookies.get("daily")),window.mtgCard=window.gameSesh.card,window.gameSesh.end&&(window.gameSesh.end=!1)),loadGame()}},free:{text:'<span class="mainMenuText">Free Play</span>',action:function(){window.game.mode="free",Cookies.get("free")&&(window.gameSesh=JSON.parse(Cookies.get("free")),window.mtgCard=window.gameSesh.card),window.gameSesh.end?loadGame():continueGameModal()}}}})}function loadGame(){if(null!=window.game.mode){if(!window.gameSesh.end)return console.log("Continued Game Session"),loadCard(),void loadGuesses();if(window.firstTime&&helpModal(),"daily"==window.game.mode){function e(e){document.getElementById("cardImage").style="opacity:0; transition: opacity 0s;",document.getElementById("imageLoading").style="",loadCard(e[(new Date).getDOY()])}null==window.dailyList?fetch("https://raw.githubusercontent.com/suitangi/Befuddle/main/dailyList.json").then((e=>e.json())).then((t=>{window.dailyList=t,e(t)})):e(window.dailyList)}else if("free"==window.game.mode){function t(e){getParameterByName("cardId")?requestCard(getParameterByName("cardId")):requestCard(window.cardList[Math.floor(Math.random()*window.cardList.length)])}null==window.cardList?fetch("https://raw.githubusercontent.com/suitangi/Befuddle/main/cardList.json").then((e=>e.json())).then((e=>{window.cardList=e,t()})):t(window.cardList)}}else mainManuDisplay()}function loadTimer(){let e=new Date,t=new Date;t.setHours(24,0,0,0);let a=(60*e.getMinutes()+e.getSeconds())%300,n=t-e;function o(){if(300==a){if(e=new Date,a=(60*e.getMinutes()+e.getSeconds())%300,e>t)return window.game.mode,null!=window.dailyModal&&window.dailyModal.isOpen()&&(window.dailyModal.close(),window.dailyModal=null,Cookies.remove("daily"),window.game.end=!0,loadGame()),void loadTimer();n=t-e,setTimeout((function(e){n-=e,o()}),1e3-e.getMilliseconds(),1e3-e.getMilliseconds())}else setTimeout((function(){n-=1e3,o()}),1e3);null!=window.dailyModal&&window.dailyModal.isOpen()&&(document.getElementById("dailyTimerDisplay").innerText="Next Daily Befuddle │ "+function(e){function t(e){return("0"+e).slice(-2)}var a=(e=(e-e%1e3)/1e3)%60,n=(e=(e-a)/60)%60;return t((e-n)/60)+":"+t(n)+":"+t(a)}(n)),a++}setTimeout((function(){o()}),1e3-e.getMilliseconds())}function checkNewDay(){return d1=new Date(window.game.timestamp),d2=new Date,d1.getDOY()!=d2.getDOY()}function mspie(e,t,a){return new Chart(e,{type:"pie",data:t,options:{responsive:!0,plugins:{legend:{position:"bottom",labels:{generateLabels:function(e){const t=Chart.overrides.pie.plugins.legend.labels.generateLabels.call(this,e);let a=e.data.datasets.map((function(e){return e.backgroundColor}));return a=a.flat(),t.forEach((t=>{t.datasetIndex=(t.index-t.index%2)/2,t.hidden=!e.isDatasetVisible(t.datasetIndex),t.fillStyle=a[t.index]})),t},color:"white",font:{family:"Roboto Mono"}},onClick:function(e,t,a){a.chart.getDatasetMeta(t.datasetIndex).hidden=a.chart.isDatasetVisible(t.datasetIndex),a.chart.update()}},tooltip:{callbacks:{label:function(e){const t=2*e.datasetIndex+e.dataIndex;return e.chart.data.labels[t]+": "+e.formattedValue}},titleFont:{family:"Roboto Mono"},bodyFont:{family:"Roboto Mono"}},title:{display:!0,color:"white",font:{family:"Beleren Bold",size:20},text:a}}}})}function vertBarChart(e,t,a){return new Chart(e,{type:"bar",data:t,options:{scales:{y:{beginAtZero:!0,ticks:{color:"white",stepSize:1},grid:{borderColor:"white",color:"#6D6D6D"},title:{font:{family:"Beleren Bold"}},stacked:!0},x:{ticks:{color:"white"},grid:{borderColor:"white",display:!1},title:{font:{family:"Beleren Bold"}},stacked:!0}},plugins:{legend:{position:"bottom",labels:{color:"white",font:{family:"Roboto Mono"}}},title:{display:!0,color:"white",font:{family:"Beleren Bold",size:20},text:a},tooltip:{titleFont:{family:"Roboto Mono"},bodyFont:{family:"Roboto Mono"}}}}})}function lineChart(e,t,a){return new Chart(e,{type:"line",data:t,options:{scales:{y:{min:0,max:1,ticks:{color:"white",stepSize:1},grid:{borderColor:"white",color:"#6D6D6D"},title:{font:{family:"Beleren Bold"}}},x:{ticks:{color:"white"},grid:{borderColor:"white",display:!1},title:{font:{family:"Beleren Bold"}}}},plugins:{legend:{position:"bottom",labels:{color:"white",font:{family:"Roboto Mono"}}},title:{display:!0,color:"white",font:{family:"Beleren Bold",size:20},text:a},tooltip:{titleFont:{family:"Roboto Mono"},bodyFont:{family:"Roboto Mono"}}}}})}$(document).ready((function(){console.log("https://scryfall.com/card/unh/30/cheatyface"),window.displayKeyboard={},window.loadingGuesses=!1,window.dailyModal=null,window.game={},window.game.timestamp=(new Date).getTime(),window.game.daily={},window.game.daily.lives=7,window.game.daily.hideBlanks=!1,window.game.free={},window.game.free={},window.game.free.lives=-1,window.game.free.manaState=2,window.game.free.hideBlanks=!1,window.gameSesh={},window.gameSesh.end=!0,window.stats={},window.stats.daily={},window.stats.daily.streak=0,window.stats.daily.maxStk=0,window.stats.daily.score=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],window.stats.daily.WL=[0,0,0,0],window.stats.daily.acc=[0,0,0,0],window.stats.daily.doy=0,window.stats.free={},window.stats.free.perf=[0,0],window.stats.free.acc=[0,0,0,0],window.stats.free.wr=[[],[]],window.stats.free.score=[[],[]];for(var e=0;e<25;e++)window.stats.free.wr[0].push([0,0]),window.stats.free.wr[1].push([0,0]),window.stats.free.score[0].push(0),window.stats.free.score[1].push(0);loadTimer(),null==Cookies.get("befuddle")?(Cookies.set("befuddle",JSON.stringify(window.game),{expires:365}),Cookies.set("freeStats",JSON.stringify(window.stats.free),{expires:365}),Cookies.set("dailyStats",JSON.stringify(window.stats.free),{expires:365}),window.firstTime=!0):(window.firstTime=!1,window.game=JSON.parse(Cookies.get("befuddle")),checkNewDay()&&Cookies.remove("daily"),window.game.timestamp=(new Date).getTime(),Cookies.set("befuddle",JSON.stringify(window.game)),null==Cookies.get("freeStats")?Cookies.set("freeStats",JSON.stringify(window.stats.free),{expires:365}):window.stats.free=JSON.parse(Cookies.get("freeStats")),null==Cookies.get("dailyStats")?Cookies.set("dailyStats",JSON.stringify(window.stats.daily),{expires:365}):window.stats.daily=JSON.parse(Cookies.get("dailyStats"))),document.getElementById("stats-button").addEventListener("click",(function(){statsModal()})),document.getElementById("menu-button").addEventListener("click",(function(){menuModal()})),document.getElementById("settings-button").addEventListener("click",(function(){settingsModal()})),document.getElementById("help-button").addEventListener("click",(function(){helpModal()})),document.getElementById("seeCard").addEventListener("click",(function(){seeCardHandler()}));let t=document.getElementById("keyboard").children;for(e=0;e<t.length;e++)window.displayKeyboard[t[e].innerText.toLowerCase()]=t[e],t[e].setAttribute("data-key",t[e].innerText),t[e].addEventListener("click",(function(){window.gameSesh.end||submitLetter(this.getAttribute("data-key").toLowerCase())}));document.onkeypress=function(e){e=e||window.event,!window.gameSesh.end&&e.keyCode>=97&&e.keyCode<=122&&submitLetter(String.fromCharCode(e.keyCode)),!window.gameSesh.end&&e.keyCode>=65&&e.keyCode<=90&&submitLetter(String.fromCharCode(e.keyCode).toLowerCase())},window.game.mode="",getParameterByName("cardId")?(window.game.mode="free",window.gameSesh.end=!0,loadGame()):mainMenuDisplay()})),Date.prototype.isLeapYear=function(){var e=this.getFullYear();return 0==(3&e)&&(e%100!=0||e%400==0)},Date.prototype.getDOY=function(){var e=this.getMonth(),t=this.getDate(),a=[0,31,59,90,120,151,181,212,243,273,304,334][e]+t;return e>1&&this.isLeapYear()&&a++,a};
