// Se agrega funcion para evitar que el form recargue la pagina al hacer submit
document.getElementById("btn-submit").addEventListener("click", (e) => {
    e.preventDefault()
    return false
})