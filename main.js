let sessionData
let btnLoginElement
let userDisplayElement

function setUserDisplayElement() {
    userDisplayElement = document.getElementById('usernameDisplay')
    if(!userDisplayElement) return
    const { username } = sessionData
    userDisplayElement.innerHTML = username
}

function onCursosInit() {
    const cursosBody = document.getElementById('cursosBody')
    if(!cursosBody) return;
    if(!sessionData) {
        redirect(`${window.location.origin}`)
    }
    setUserDisplayElement();
}

function setBtnLoginValue(htmlElement) {
    if(!sessionData) return
    if(!htmlElement) return
    const { username, email } = sessionData
    if(username && email) htmlElement.innerHTML = 'VER MIS CURSOS';
}

// Obtiene la información de la sesión activa del localStorage
function setSessionData(sessionValues) {
    if(sessionValues) localStorage.setItem('session', JSON.stringify(sessionValues));
    sessionData = JSON.parse(localStorage.getItem('session'))
}

// open modal by id
function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.classList.add('jw-modal-open');
}

// close currently open modal
function closeModal(event) {
    document.querySelector('.jw-modal.open').classList.remove('open');
    document.body.classList.remove('jw-modal-open');
}

function onLoginSubmit(event) {
    event.preventDefault()
    // Extrae todos los valores de los inputs del form
    const formValues = Object.values(event.target).reduce((obj,field) => { obj[field.name] = field.value; return obj }, {})

    if(Object.values(formValues).some(el => !el)) return

    setSessionData({
        username: formValues["login-username"],
        email: formValues["login-email"]
    })

    event.target.reset()
    setBtnLoginValue(btnLoginElement)

    redirect(`${window.location.origin}/cursos.html`)
    closeModal()
}

function onBtnLoginClick() {
    if(sessionData) {
        redirect(`${window.location.origin}/cursos.html`)
        return
    }

    openModal('loginModal');
}

function redirect(url) {
    window.location.href = url
}

function preventDefault(event) {
    event.preventDefault()
    return false
}

document.addEventListener('DOMContentLoaded', () => {
    btnLoginElement = document.getElementById('btnLogin')

    setSessionData(sessionData);
    setBtnLoginValue(btnLoginElement);
    onCursosInit()

    window.addEventListener('load', function() {
        // close modals on background click
        document.addEventListener('click', event => {
            if (event.target.classList.contains('jw-modal')) {
                closeModal();
            }
        });
    });
});