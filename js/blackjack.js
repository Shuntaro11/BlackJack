
//カードのオモテ面のsrcの配列を定義
var imgSrc = [];
for(var i = 1; i < 14; i++){
  if(i < 10){
    imgSrc.push("../images/d0" + i + ".png");
    imgSrc.push("../images/h0" + i + ".png");
    imgSrc.push("../images/c0" + i + ".png");
    imgSrc.push("../images/s0" + i + ".png");
  }else{
    imgSrc.push("../images/d" + i + ".png");
    imgSrc.push("../images/h" + i + ".png");
    imgSrc.push("../images/c" + i + ".png");
    imgSrc.push("../images/s" + i + ".png");
  }
}

//上で定義した配列をランダムな順番にする
function randomArray(){
  for(var i = imgSrc.length - 1; i > 0; i--){
    var r = Math.floor(Math.random() * (i + 1));
    var tmp = imgSrc[i];
    imgSrc[i] = imgSrc[r];
    imgSrc[r] = tmp;
  }
}

randomArray();

//所持金と掛け金
var money = 1000;
var betPrice = 0;

// 所持金と掛け金を取得するための要素を取得
var leftMoneyDisplay = document.getElementById("leftMoneyDisplay");
var betPriceDisplay = document.getElementById("betPriceDisplay");

//各プレイヤーに配られたカード番号を入れる配列
var playerAllCard = [];
var dealerAllCard = [];

//各プレイヤーのカードの合計値
var playerTotalPoint = 0;
var dealerTotalPoint = 0;

//自分が取得した２枚のカード情報を変数に代入
var playerCard1 = imgSrc[1].substr(-6 , 2);
var playerCard2 = imgSrc[3].substr(-6 , 2);

//ディーラーが取得した２枚のカード情報を変数に代入
var dealerCard1 = imgSrc[0].substr(-6 , 2);
var dealerCard2 = imgSrc[2].substr(-6 , 2);

//初めに各プレイヤーが取得するカードの数字を配列に入れる
playerAllCard.push(playerCard1,playerCard2);
dealerAllCard.push(dealerCard1);

// 持っているカード枚数
var howManyPlayerCards = 2;
var howManyDealerCards = 2;

// 得点を表示するための要素を取得
var playerTotalDisplay = document.getElementById("playerTotalDisplay");
var dealerTotalDisplay = document.getElementById("dealerTotalDisplay");

// ゲームが開始してから何枚目に配られたカードか
var cardNumber = 0;

// ゲーム結果を入れる変数
var result = "";

// 結果を表示するための要素を取得
var resultMessage = document.getElementById("resultMessage");


// お金を賭ける関数(スタート画面でコインのボタンを押すと発火)
function bet(addPrice){

  clickSound("click");

  money -= addPrice;
  betPrice += addPrice;

  leftMoneyDisplay.innerHTML = "You Have : $" + money;
  betPriceDisplay.innerHTML = "Bet : $" + betPrice;
  
}

// ゲームをスタートする関数(startボタンで発火)
function startGame(){

  clickSound("click");

  // カードを置く枠線を非表示
  document.getElementsByClassName("card-border")[0].style.display = "none";
  document.getElementsByClassName("card-border")[1].style.display = "none";

  // 使わないボタンを非表示
  document.getElementById("start-btn").style.display = "none";
  document.getElementById("bet5-btn").style.display = "none";
  document.getElementById("bet25-btn").style.display = "none";
  document.getElementById("bet100-btn").style.display = "none";
  
  // プレイ中に使うボタンを表示
  document.getElementById("stand-btn").style.display = "block";
  document.getElementById("hit-btn").style.display = "block";
  document.getElementById("double-btn").style.display = "block";

  // カードを隠す裏面の画像を表示
  document.getElementById("invisibleCard").style.opacity = 1;

  // 各プレイヤーに２枚ずつカードを配る
  for(var i = 0; i < 2; i++){
    document.getElementById("dealer"+i).src=imgSrc[cardNumber];
    cardNumber ++;
    document.getElementById("player"+i).src=imgSrc[cardNumber];
    cardNumber ++;
  }
  
  // 各プレイヤーの得点を計算 & 表示
  pointCalculation(playerAllCard, "player");
  pointCalculation(dealerAllCard, "dealer");

  // 初めの２枚が21以上ならその場でゲーム終了
  if(playerTotalPoint >= 21){
    judge();
  }
}

// スタンドする関数(standボタンで発火)
function stand(){
  if(result != ""){
    return;
  }
  clickSound("click");
  judge();
}

//追加でカードを一枚取得(hitボタンで発火)
function hit(){
  if(result != ""){
    return;
  }
  clickSound("click");
  cardNumber ++;
  howManyPlayerCards ++;

  // 新しいカードの要素を作りをHTMLに挿入
  newCardDraw("player");
  
  // 自分の得点を計算 & 表示
  playerAllCard.push(imgSrc[cardNumber].substr(-6 , 2));
  pointCalculation(playerAllCard, "player");

  // 21以上ならその場でゲーム終了
  if(playerTotalPoint >= 21){
    judge();
  }
}

//カードを一枚取得し、掛け金を倍にしゲーム終了する(doubleボタンで発火)
function double(){
  
  if(result != ""){
    return;
  }
  money -= betPrice;
  betPrice *= 2;

  leftMoneyDisplay.innerHTML = "You Have : $" + money;
  betPriceDisplay.innerHTML = "Bet : $" + betPrice;

  hit();
  if(playerTotalPoint < 21){
    judge();
  }
}

// ポイントを計算する
function pointCalculation(pointArray, who){

  var totalPoint = 0;//ポイント初期化(初期化しないとエースが計算できない)
  var howManyA = 0;//エースを何枚持っているか入れる変数

  // カードを１枚づつ足していく
  for(var i = 0; i < pointArray.length; i++){
    var number = pointArray[i];
    if(number === "02"){
      totalPoint += 2;
    }else if(number === "03"){
      totalPoint += 3;
    }else if(number === "04"){
      totalPoint += 4;
    }else if(number === "05"){
      totalPoint += 5;
    }else if(number === "06"){
      totalPoint += 6;
    }else if(number === "07"){
      totalPoint += 7;
    }else if(number === "08"){
      totalPoint += 8;
    }else if(number === "09"){
      totalPoint += 9;
    }else if(number === "10" || number === "11" || number === "12" || number === "13"){
      totalPoint += 10;
    }else if(number === "01"){
      howManyA ++;
    }else{
    }
  }
  //エースは枚数によって足し方を場分け
  switch(howManyA) {
    case 1:
      if(totalPoint <= 10){
        totalPoint += 11;
      }else{
        totalPoint += 1;
      }
    break;
    case 2:
      if(totalPoint <= 9){
        totalPoint += 12;
      }else{
        totalPoint += 2;
      }
    break;
    case 3:
      if(totalPoint <= 8){
        totalPoint += 13;
      }else{
        totalPoint += 3;
      }
    break;
    case 4:
      if(totalPoint <= 7){
        totalPoint += 14;
      }else{
        totalPoint += 4;
      }
    break;
    default:
    break;
  }

  if(who == "player"){
    playerTotalPoint = totalPoint;
    playerTotalDisplay.innerHTML = playerTotalPoint;
  }else if(who === "dealer"){
    dealerTotalPoint = totalPoint;
    dealerTotalDisplay.innerHTML = dealerTotalPoint;
  }
}

// 勝敗を判定
function judge(){
  
  // 自分の合計値が21以下ならならディーラーの合計値を計算
  if(playerTotalPoint < 22){

    // ディーラーが２枚目を取得
    dealerAllCard.push(dealerCard2);
    pointCalculation(dealerAllCard, "dealer");

    document.getElementById("invisibleCard").style.opacity = 0;
    document.getElementById("dealer1").style.opacity = 1;
  
    // ディーラーの合計値が17を越えるまでカードを追加
    while (dealerTotalPoint < 17){

      cardNumber ++;
      howManyDealerCards ++;

      // 新しいカードの要素を作りをHTMLに挿入
      newCardDraw("dealer");

      dealerAllCard.push(imgSrc[cardNumber].substr(-6 , 2));
      pointCalculation(dealerAllCard, "dealer");
      console.log("Dealerのカードは"+dealerAllCard);

    }

    dealerTotalDisplay.innerHTML = dealerTotalPoint;

  }

  // 各プレイヤーの合計値を比較し、勝敗を決定
  if( playerTotalPoint > 21){
    result = "lose";
    resultDisplay(result);
  }else if(playerTotalPoint === 21 && howManyPlayerCards === 2){
    if(dealerTotalPoint === 21 && howManydealerCards === 2){
      result = "draw";
      resultDisplay(result);
    }else{
      result = "blackjack";
      resultDisplay(result);
    }
  }else if(dealerTotalPoint === playerTotalPoint){
    result = "draw";
    resultDisplay(result);
  }else if(dealerTotalPoint > 21){
    result = "win";
    resultDisplay(result);
  }else if(dealerTotalPoint > 21){
    result = "win";
    resultDisplay(result);
  }else if(playerTotalPoint > dealerTotalPoint){
    result = "win";
    resultDisplay(result);
  }else{
    result = "lose";
    resultDisplay(result);
  }
  console.log(result);

  // 使わないボタンを非表示
  document.getElementById("stand-btn").style.display = "none";
  document.getElementById("hit-btn").style.display = "none";
  document.getElementById("double-btn").style.display = "none";

  // コンテニューボタンを表示
  document.getElementById("retry-btn").style.display = "block";

  // 所持金がマイナスになったら終了
  if(money <= 0){
    clickSound("gameOver");
    resultMessage.innerHTML = "GAME OVER";
  }
}

// 結果を表示
function resultDisplay(gameResult){

  switch(gameResult) {
    case "blackjack":
      clickSound("blackJack");
      money += (betPrice * 2.5);
      leftMoneyDisplay.innerHTML = "You Have : " + money;
      resultMessage.innerHTML = "Black Jack!!!";
    break;
    case "win":
      clickSound("win");
      money += (betPrice * 2);
      leftMoneyDisplay.innerHTML = "You Have : " + money;
      resultMessage.innerHTML = "You Win!!";
    break;
    case "lose":
      clickSound("lose");
      resultMessage.innerHTML = "You Lose...";
    break;
    case "draw":
      money += betPrice;
      resultMessage.innerHTML = "Draw!";
      leftMoneyDisplay.innerHTML = "You Have : " + money;
    break;
    default:
    break;
  }
}

// ゲームを続ける(continueボタンで発火)
function retry(){

  if(!result){
    return;
  }else if(money <= 0){
    return;
  }

  result = "";
  clickSound("click");

  betPrice = 0;
  betPriceDisplay.innerHTML = "Bet : " + betPrice;

  resultMessage.innerHTML = "";

  randomArray();
  
  playerAllCard = [];
  dealerAllCard = [];

  playerTotalPoint = 0;
  dealerTotalPoint = 0;

  playerTotalDisplay.innerHTML = playerTotalPoint;
  dealerTotalDisplay.innerHTML = dealerTotalPoint;
  
  playerCard1 = imgSrc[1].substr(-6 , 2);
  playerCard2 = imgSrc[3].substr(-6 , 2);

  dealerCard1 = imgSrc[0].substr(-6 , 2);
  dealerCard2 = imgSrc[2].substr(-6 , 2);

  playerAllCard.push(playerCard1,playerCard2);
  dealerAllCard.push(dealerCard1);

  document.getElementsByClassName("card-border")[0].style.display = "block";
  document.getElementsByClassName("card-border")[1].style.display = "block";
  document.getElementById("start-btn").style.display = "block";
  document.getElementById("bet5-btn").style.display = "block";
  document.getElementById("bet25-btn").style.display = "block";
  document.getElementById("bet100-btn").style.display = "block";

  document.getElementById("retry-btn").style.display = "none";

  for(var i = 2; i < howManyPlayerCards; i++){
    document.getElementById("player"+i).remove();
  }
  for(var i = 2; i < howManyDealerCards; i++){
    document.getElementById("dealer"+i).remove();
  }

  howManyPlayerCards = 2;
  howManyDealerCards = 2;

  cardNumber = 0;
  for(var i = 0; i < 2; i++){
    document.getElementById("dealer"+i).src="";
    document.getElementById("player"+i).src="";
  }

  document.getElementById("invisibleCard").style.opacity = 0;

}

function clickSound(sound){
  if(sound === "click"){
    document.getElementById("clickSound").currentTime = 0;
    document.getElementById("clickSound").play();
  }else if(sound === "gameOver"){
    document.getElementById("gameOver").play();
  }else if(sound === "win"){
    document.getElementById("getMoney").play();
  }else if(sound === "blackJack"){
    document.getElementById("blackJackSound").play();
  }else if(sound === "lose"){
    document.getElementById("loseSound").play();
  }
}

function newCardDraw(who){
  var newCard = document.createElement('img');
      newCard.src = imgSrc[cardNumber];
      newCard.alt = '';
      newCard.className = "card-pattern";
  if(who === "player"){
    newCard.id = "player"+(howManyPlayerCards-1);
    document.getElementById('playerBar').appendChild(newCard);
  }else if(who === "dealer"){
    newCard.id = "dealer"+(howManyDealerCards-1);
    document.getElementById('dealerBar').appendChild(newCard);
  }
}

// ページリロード(allresetボタンで発火)
function reload(){
  location.reload();
}

// ・メモ
// 1回目では21を越えることがない
// ディーラーの2枚目のカードを配るタイミング
// 1枚配る度に配列をランダムにした方が悪意のあるユーザーに対応できる