const inputFirstName=document.getElementById("FirstName")
const inputLastName=document.getElementById("LastName")
const inputEmail=document.getElementById("email")
const inputAge=document.getElementById("edad")
const inputPassword=document.getElementById("password")
const inputRol=document.getElementById("rol")
const btnSubmit=document.getElementById("btnSubmit")
const divMensajes=document.getElementById("mensajes")



btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()
    let first_name=inputFirstName.value 
    let last_name=inputLastName.value 
    let email=inputEmail.value 
    let edad=inputAge.value 
    let password=inputPassword.value 
    let rol=inputRol.value 
    if(!first_name || !email || !password || !rol){
        alert("Complete los datos")
        return 
    }    

    const body={first_name, last_name, email, edad, password, rol} 
    
    let respuesta=await fetch("/api/sessions/registro", {
        method:"post", 
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    })
    console.log(datos)
    let datos=await respuesta.json()
    console.log(datos)
    if(respuesta.status>=400){
        divMensajes.textContent=datos.error
        setTimeout(() => {
            divMensajes.textContent=""
        }, 3000);
    }else{
        window.location.href=`/login?mensaje=Registro exitoso para ${datos.nuevoUsuario.email}`
    }
})
