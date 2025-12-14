const form = document.getElementById("form");
const textArea = document.getElementById("generated-password");

form.addEventListener("submit", (e) =>
{
    e.preventDefault();

    generatePassword(e);
});

form.addEventListener("change", generatePassword);

function generatePassword(e)
{
    // get the form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);


    textArea.value = password;
}