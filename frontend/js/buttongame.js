const gameButton = document.getElementById("gameButton");
const sendButton = document.getElementById("sendScoreButton");
const nameOfClicker = document.getElementById("nameOfClicker");
let buttonScoreCounter = 0;

gameButton.addEventListener("click",()=>gameButton.innerHTML = `${++buttonScoreCounter}`);
sendButton.addEventListener("click",()=>{
    const score = gameButton.innerHTML;
    if(!nameOfClicker.value){
        alert("Please Enter a name for the leader board");
        return;
    }
    const sendingScoreOptions = {
        method: "POST",
        body: JSON.stringify({Score: score, Name: nameOfClicker.value})
    };
    fetch("http://localhost:8080/home",sendingScoreOptions).then(alert(`Your score has been sent ${nameOfClicker.value}`));

})