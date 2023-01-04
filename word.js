const letters=document.querySelectorAll(".square-box");
console.log(letters)
const loadingDiv=document.querySelector('.loading');
const ANSWER_LENGTH=5;
const ROUNDS=5;
let done=false;
let isLoading=false;
async function init()
{
    let currentGuess='';
    let currentRow=0;

    const res=await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj=await res.json();
    const word=resObj.word.toUpperCase();
    const wordParts=word.split("");
    const map=makeMap(wordParts);
    console.log(word);
    setLoading(false);


    function addLetter(letter)
    {
        if(currentGuess.length<ANSWER_LENGTH)
        {
            currentGuess=currentGuess+letter;
        }
        else{
            currentGuess=currentGuess.substring(0,currentGuess.length-1)+letter;
        }
        letters[ANSWER_LENGTH*currentRow + currentGuess.length-1].innerText=letter;
    }
    async function commit(letter)
    {
        if(currentGuess.length!=ANSWER_LENGTH)
        {
            //do nothing
            return;
        }
        isLoading=true;
        setLoading(true);
        const res=await fetch("https://words.dev-apis.com/validate-word",{
            method:"POST",
            body:JSON.stringify({word: currentGuess})
        })
        const resObj=await res.json();
        const validWord=resObj.validWord;
        isLoading=false;
        setLoading(false);
        if(!validWord)
        {
            markInvalidWord();
            return;
        }
     
        const guessParts=currentGuess.split("");
        for(let i=0;i<ANSWER_LENGTH;i++)
        {
            if(guessParts[i]===wordParts[i])
            {
                letters[currentRow*ANSWER_LENGTH+i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }
        for(let i=0;i<ANSWER_LENGTH;i++)
        {
            if(guessParts[i]===wordParts[i])
            {
                //do nothing
            }
            else if(wordParts.includes(guessParts[i]) && map[guessParts[i]]>0)
            {
                letters[currentRow*ANSWER_LENGTH+i].classList.add("close");
                map[guessParts[i]]--;
            }
            else{
                letters[currentRow*ANSWER_LENGTH+i].classList.add("wrong");
            }
        }
        if(currentGuess===word)
        {
           alert('You win!');
           done=true
           document.querySelector('.title').classList.add("winner");
           return;
   
        }
        if(currentRow===ROUNDS)
        {
            alert(`You lose the word was ${word}`);
            done=true;
            
        }

        currentRow++;
        currentGuess='';
    }
    async function backspace(letter)
    {
        currentGuess=currentGuess.substring(0,currentGuess.length-1);
        letters[ANSWER_LENGTH*currentRow + currentGuess.length].innerText="";
    }
    function markInvalidWord()
    {
       // alert("Not a Valid Word");
       for(let i=0;i<ANSWER_LENGTH;i++)
       {
            
        letters[currentRow*ANSWER_LENGTH+i].classList.remove("invalid");
       
        setTimeout(function()
       {
        letters[currentRow*ANSWER_LENGTH+i].classList.add("invalid");
       },10);
    }

    }
    document.addEventListener("keydown",function handleKeyPress(event)
    {
        if(done==true)
        {
            //do nothing
            return;
        }
        const action=event.key;
        console.log(action); 
        if(action==='Enter')
        {
            commit();
        }
        else if(action==='Backspace')
        {
            backspace();
        }
        else if(isLetter(action))
        {
            addLetter(action.toUpperCase())
        }
        else
        {
            //do nothing
        }

})
}
function isLetter(letter)
{
    return /^[a-zA-Z]$/.test(letter);
}
function setLoading(isLoading)
{
    loadingDiv.classList.toggle('show',isLoading);
}
function makeMap(array)
{
    const obj={}
    for(let i=0;i<array.length;i++)
    {
        const letter=array[i];
        if(obj[letter])
        {
            obj[letter]++;
        }
        else{
            obj[letter]=1;
        }
    }
    return obj;
}
init();
