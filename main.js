let sessionData
let btnLoginElement
let userDisplayElement
let gestorDeCursos

class Curso {
    constructor(id, autor, nombreCurso) {
        this._id = id;
        this._autor = autor;
        this._nombreCurso = nombreCurso;
        this._terminado = false;
    }

    // Getters
    get id() {
        return this._id;
    }

    get autor() {
        return this._autor;
    }

    get nombreCurso() {
        return this._nombreCurso;
    }

    get terminado() {
        return this._terminado;
    }

    // Setters

    set nombreCurso(nuevoNombre) {
        this._nombreCurso = nuevoNombre;
    }

    set nombreCurso(nuevoNombre) {
        this._nombreCurso = nuevoNombre;
    }

    // Método para alternar estado de terminado
    toggleTerminado() {
        this._terminado = !this._terminado;
    }
}

class GestorDeCursos {
    constructor() {
        this.cursos = []
    }
  
    agregarCurso(autor, nombreCurso) {
        const id = this.cursos.length + 1
        const curso = new Curso(id, autor, nombreCurso)
        this.cursos.push(curso)
        this.renderListaCursos()
    }
  
    eliminarCurso(index) {
        this.cursos.slice(index, 1)
        this.renderListaCursos()
    }

    actualizarCurso({id, autor, nombreCurso, terminado}) {
        const curso = this.cursos.find(curso => curso.id === id)
        this.cursos[id] = {
            autor: autor ?? this.cursos[id].autor,
            nombreCurso: nombreCurso ?? this.cursos[id].nombreCurso,
            terminado: terminado ?? this.cursos[id].terminado
        }
    }

    onEstadoChange({id, event}) {
        const curso = this.cursos.find(curso => curso.id === id);
        if (curso) {
            curso.toggleTerminado();
            this.renderListaCursos();
        } else {
            console.error(`Curso con ID ${id} no encontrado`);
        }
        console.log(this.cursos);
    }
  
    renderListaCursos() {
        this.clearContainer('listaCursos')
        const listaCursos = document.getElementById('listaCursos')
        this.cursos.forEach((curso, index) => {
            const card = document.createElement("div");
            card.classList.add('lista-cursos-card')
            card.innerHTML = `
                    <div class="d-flex mb-1">
                        <p class="lista-cursos-card__label me-1">ID:</p>
                        <P class="lista-cursos-card__id">#${index}</P>
                    </div>

                    <div class="d-flex mb-1">
                        <p class="lista-cursos-card__label me-1">Autor:</p>
                        <P class="lista-cursos-card__id">${curso.autor}</P>
                    </div>

                    <div class="w-100 d-flex justify-content-between mb-1">
                        <div>
                            <p class="lista-cursos-card__label">Nombre del curso:</p>
                            <h3 class="fs-2">${curso.nombreCurso}</p>
                        </div>
                    </div>

                    <div class="w-100 mb-3">
                        <p class="lista-cursos-card__label">Estado:</p>
                        <select 
                            name="estado-${index}" 
                            id="estado-${index}" 
                            class="btn btn-secondary bg-strong-blue w-100"
                        >
                            <option value="true">Terminado</option>
                            <option value="false"}>En curso</option>
                        </select>
                    </div>

                    <div class="w-100 d-flex">
                        <button class="btn btn-secondary w-100 me-2 d-flex align-items-center justify-content-center">
                            <i class="fa-solid fa-pencil me-1 fs-1"></i>
                            <span>Editar</span>
                        </button>
                        <button class="btn btn-danger w-100 d-flex align-items-center justify-content-center">
                            <i class="fa-solid fa-x me-1 fs-1"></i>
                            <span>Eliminar</span>
                        </button>
                    </div>
            `;
            
            listaCursos.appendChild(card);

            document.getElementById(`estado-${index}`).addEventListener('change', (e) => {
                this.onEstadoChange({
                    id: index + 1,
                    event: e
                })
            })
            // document.getElementById(`editar-${i}`).addEventListener('click', () => {
            //     console.log('click en editar', i);
            // })
            // document.getElementById(`eliminar-${i}`).addEventListener('click', (i) => {
            //     this.eliminarTarea(i)
            //     console.log(this.tareas);
            //     console.log('click en eliminar', i);
            // })
        });
    }
  
    clearContainer(id) {
        document.getElementById(id).innerHTML = ''
    }



}

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
    gestorDeCursos = new GestorDeCursos()
}

function setBtnLoginValue(htmlElement) {
    if(!sessionData) return
    if(!htmlElement) return
    const { username, email } = sessionData
    if(username && email) htmlElement.innerHTML = 'VER CURSOS';
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

function onAgregarCursoSubmit(event) {
    event.preventDefault();
    // Extrae todos los valores de los inputs del form
    const formValues = Object.values(event.target).reduce((obj,field) => { obj[field.name] = field.value; return obj }, {})

    if(Object.values(formValues).some(el => !el)) return
    event.target.reset()

    console.log(formValues);
    gestorDeCursos.agregarCurso(formValues["owner-name"], formValues["curso-name"])

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