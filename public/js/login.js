const inputEmail=document.getElementById("email")
const inputPassword=document.getElementById("password")
const btnSubmit=document.getElementById("btnSubmit")
const divMensajes=document.getElementById("mensajes")

const params=new URLSearchParams(window.location.search)
let mensaje=params.get("mensaje")
if(mensaje){
    divMensajes.textContent=mensaje
    setTimeout(() => {
        divMensajes.textContent=""
    }, 3000);
}

btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    let email = inputEmail.value;
    let password = inputPassword.value;
    if (!email || !password) {
        alert("Complete los datos");
        return;
    }
    const body = { email, password };
    let respuesta = await fetch("/api/sessions/login", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (respuesta.status >= 400) {
        let { error } = await respuesta.json();
        alert(error);
        return;
    } else {
        let datos = await respuesta.json();
        console.log(datos);
        alert(datos.payload);
        localStorage.setItem('userId', datos.usuarioLogueado.id);
        localStorage.setItem('token', datos.token);
        window.location.href = datos.redirectUrl;
    }
})