

const loginBtn = document.querySelector("#login button");
const signBtn = document.querySelector("#signup button");


const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];

const setUsers = (users) => localStorage.setItem("users", JSON.stringify(users));

const findUser = (username) => getUsers().filter((u)=>username === u.username);

function checkACookieExists(name) {
    return document.cookie.split(';')
        .some((item) => item.trim().startsWith(`${name}=`));
}


const logUser = () => {

    if (checkACookieExists('user')) {
        document.querySelector("button[data-bs-target='#todo-list']").classList.remove("disabled");
        document.querySelector("button[data-bs-target='#todo-list']").click();
        document.querySelector("button[data-bs-target='#login']").classList.add("disabled");
        document.querySelector("button[data-bs-target='#signup']").classList.add("disabled");
    } else {
        document.querySelector("button[data-bs-target='#login']").classList.remove("disabled");
        document.querySelector("button[data-bs-target='#login']").click();
        document.querySelector("button[data-bs-target='#signup']").classList.remove("disabled");
        document.querySelector("button[data-bs-target='#todo-list']").classList.add("disabled");
    }
}


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};


loginBtn.addEventListener('click', (e) => {
    const loginNav = document.querySelector("#login");

    const username = loginNav.querySelector("#usernameLg");
    const password = loginNav.querySelector("#passwordLg");


    loginBtn.closest('form').classList.add('was-validated');

    let rst = findUser(username.value)
    if (rst.password === cyrb53(password.value)) {
        console.log("password is correct");
        setCookie("user", username.value, 1);
        logUser();
    }
    else
        console.log("password incorrect");


})


signBtn.addEventListener('click', () => {
    const signNav = document.querySelector("#signup");

    const username = signNav.querySelector("#signup-username");
    const password = signNav.querySelector("#signup-password");
    const prenom = signNav.querySelector("#signup-prenom");
    const nom = signNav.querySelector("#signup-nom");
    
    signBtn.closest('form').classList.add('was-validated');
    
    //verifier si le username est indisponible
    if (findUser(username.value).length) {
        username.setCustomValidity("username est deja utilise");
        username.classList.add('is-invalid');
        username.parentElement.querySelector(".invalid-feedback").innerText = "username est deja utilise";
        return false;
    }
    if (!(/^[a-z0-9]{5,30}$/gi.test(username.value))) {
        username.setCustomValidity("username invalide");
        username.classList.add('is-invalid');
        username.parentElement
            .querySelector(".invalid-feedback")
            .innerHTML = "username doit contenir des lettres ou chiffres" +
            "<br>entre [5-30] caracters";
        return false;
    }
    
    const newU = getUsers();

    
    newU.push({
        nom: nom.value,
        prenom: prenom.value,
        username: username.value,
        password: cyrb53(password.value)
    });
    setUsers(newU)


    setCookie("user", username.value, 1);
    logUser(username.value)
})



//initial user authentication check
logUser();
