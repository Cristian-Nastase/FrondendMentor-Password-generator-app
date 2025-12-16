const form = document.getElementById("form");
const textArea = document.getElementById("password-text");

const copyButton = document.getElementById("password-copy");

const currentLegth = document.getElementById("slider");
const lengthText = document.getElementById("form-length");

const barText = document.getElementById("bar-text");
const meterBars = document.getElementsByClassName("bar-meter");

// Password-text events

// Copy to clipboard
copyButton.addEventListener("click", function()
{
    navigator.clipboard
    .writeText(textArea.value)
    .then(() => {
       if(textArea.value != "") copyButton.setAttribute("data-copy-state", "appear");
    });
    
})

copyButton.addEventListener("animationend", function()
{
    let copyState = copyButton.dataset["copyState"];
    if(copyState === "appear")
        {
            setTimeout(function()
            {
                copyButton.setAttribute("data-copy-state", "disappear");
            }, 2000);
        }
    else
        {
            copyButton.setAttribute("data-copy-state", " ");
        }
})

// Select all the text when clicked

textArea.addEventListener("click", function(e)
{
    e.currentTarget.select();
})

// Form events

window.addEventListener("load", function()
{
    textArea.value = "";
    lengthText.textContent = currentLegth.value;
});

form.addEventListener("submit", (e) =>
{
    e.preventDefault();

    onChange(e);
});

form.addEventListener("change", onChange);

function onChange(e)
{
    // Get data from the form
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    let generate = generatePassword(data);
    
    let password = generate[0];
    let secureCriterias = generate[1];

    changeUI(data, password, secureCriterias);
}

function generatePassword(data)
{
    const allCharacters = 
    {
        lowercase : 'abcdefghijklmnopqrstuvwxyz'.split(''),
        uppercase : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        numbers : '01234567890'.split(''),
        symbols : `!@#$%^&*()-+[]{}_=\"';:,.><?/|\``.split(''),
    };

    let password = '';
    let passwordLength = '';

    let usableCharacters = {};

    let secureCriterias = 
    {
        differentTypes: 0,
        typesUsed: [],
    };

    for (key in data)
        {
            switch(key)
            {
                case 'length':
                    passwordLength = parseInt(data.length);
                    break;
                case 'lowercase':
                    usableCharacters.lowercase = allCharacters.lowercase;
                    break;
                case 'uppercase':
                    usableCharacters.uppercase = allCharacters.uppercase;
                    break;
                case 'numbers':
                    usableCharacters.numbers = allCharacters.numbers;
                    break;
                case 'symbols':
                    usableCharacters.symbols = allCharacters.symbols;
                    break;
                default:
                    break;
            }
        }

    if(Object.keys(usableCharacters).length == 0)
            for(key in allCharacters) 
                usableCharacters[key] = allCharacters[key];

    //generate password

    let keys = Object.keys(usableCharacters);

    for(let i = 0; i < passwordLength; i++)
        {
            let typeOfCharacter = keys[Math.floor(Math.random() * keys.length)];
            let typeLength = usableCharacters[typeOfCharacter].length;
            
            let randomCharacter = usableCharacters[typeOfCharacter][(Math.floor(Math.random() * typeLength))];
            
            password += randomCharacter;

            //Check how secure it is
            if(!secureCriterias.typesUsed.includes(typeOfCharacter))
                {
                    secureCriterias.typesUsed.push(typeOfCharacter);
                    secureCriterias.differentTypes++;
                }
        }

    secureCriterias.length = passwordLength;

    return [password, secureCriterias];
}

function changeUI(data, password, secureCriterias)
{
    lengthText.textContent = data.length;
    textArea.value = password;

    // calculate the secure meter

    let allStates = 
    {
        strong: {content: "Strong", color: "var(--green)", length: 4, },
        medium: {content: "Medium", color: "var(--yellow)", length: 3, },
        weak: {content: "Weak", color: "var(--orange)", length: 2,},
        tooWeak: {content: "Too weak!", color: "var(--red)", length: 1,},
    };

    let currentState;

    if(secureCriterias.length < 8)
        {
            currentState = allStates.tooWeak;
        }
    else
    {
        switch(secureCriterias.differentTypes)
            {
                case 1:
                    currentState = allStates.tooWeak;
                    break
                case 2:
                    currentState = allStates.weak;
                    break
                case 3:
                    currentState = allStates.medium;
                    break
                case 4:
                    currentState = allStates.strong;
                    break
                default:
                    currentState = allStates.tooWeak;
            }
    }

    // switch for changing the text and points

    barText.textContent = currentState.content;

    let i = 0;

    for(i = 0; i < currentState.length; i++)
        {
            meterBars[i].style.fill = currentState.color;
        }
    for(i; i < 4; i++)
        {
            meterBars[i].style.fill = "none";
        }
}