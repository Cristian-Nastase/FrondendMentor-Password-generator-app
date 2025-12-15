const form = document.getElementById("form");
const textArea = document.getElementById("generated-password");

const copyButton = document.getElementById("copy-to-clipboard");

const lengthText = document.getElementById("current-length");

// Password-text events

// Copy to clipboard
copyButton.addEventListener("click", function()
{
    navigator.clipboard.writeText(textArea.value);
})

// Select all the text when clicked

textArea.addEventListener("click", function(e)
{
    e.currentTarget.select();
})

// Form events

window.addEventListener("load", onChange);

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

    // switch for changing the text and points
}