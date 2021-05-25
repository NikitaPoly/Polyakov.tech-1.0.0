const typeOfQuestionSelectorInput = document.getElementById("typeOfContactDiv");
const mainDiv = document.getElementsByTagName("main")[0];

const inputs = typeOfQuestionSelectorInput.getElementsByTagName("input");

const formTemplates = document.getElementsByTagName("template")[0].content;//get all the forms as one html element

const checkWhatInput = ()=>{//this is the function that will pick what to display
    for(let i = 0; i < 6;i++){//loop thru each input and check witch one is checked
        if(inputs[i].checked == true){//when you fins the one that is checked
            const currentFormClone = formTemplates.querySelector(`form#${inputs[i].value}Form`).cloneNode(true);//get the corresponsing form from the form list
            mainDiv.innerHTML = "";//clear the main div
            mainDiv.append(currentFormClone);//add the form to the main div
        }
    }
}

typeOfQuestionSelectorInput.addEventListener("change",checkWhatInput)//event handler for changes in the inputs