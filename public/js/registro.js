document.addEventListener('DOMContentLoaded', () => {
    const inputFirstName = document.getElementById("FirstName");
    const inputLastName = document.getElementById("LastName");
    const inputEmail = document.getElementById("email");
    const inputAge = document.getElementById("edad");
    const inputPassword = document.getElementById("password");
    const inputRol = document.getElementById("rol");
    const btnSubmit = document.getElementById("btnSubmit");
    const divMensajes = document.getElementById("mensajes");

    if (btnSubmit) {
        btnSubmit.addEventListener("click", async (e) => {
            e.preventDefault();
            let first_name = inputFirstName ? inputFirstName.value : '';
            let last_name = inputLastName ? inputLastName.value : '';
            let email = inputEmail ? inputEmail.value : '';
            let age = inputAge ? inputAge.value : '';
            let password = inputPassword ? inputPassword.value : '';
            let rol = inputRol ? inputRol.value : '';

            if (!email || !password || !rol) {
                alert("Complete los datos");
                return;
            }

            let body = { first_name, last_name, email, age, password, rol };

            try {
                let respuesta = await fetch("/api/sessions/registro", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });
                console.log(respuesta);
                console.log(datos);

                let datos;
                const contentType = respuesta.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    datos = await respuesta.json();
                } else {
                    datos = { error: await respuesta.text() };
                }
                

                if (respuesta.status >= 400) {
                    if (divMensajes) {
                        divMensajes.textContent = datos.error || 'Error en la solicitud';
                        setTimeout(() => {
                            divMensajes.textContent = "";
                        }, 3000);
                    }
                } else {
                    window.location.href = `/login?mensaje=Registro exitoso para ${datos.nuevoUsuario.email}`;
                }
            } catch (error) {
                console.error('Error:', error);
                if (divMensajes) {
                    divMensajes.textContent = 'Error en la solicitud';
                    setTimeout(() => {
                        divMensajes.textContent = "";
                    }, 3000);
                }
            }
        });
    } else {
        console.error('Botón de envío no encontrado');
    }
});

// const inputFirstName=document.getElementById("FirstName")
// const inputLastName=document.getElementById("LastName")
// const inputEmail=document.getElementById("email")
// const inputAge=document.getElementById("edad")
// const inputPassword=document.getElementById("password")
// const inputRol=document.getElementById("rol")
// const btnSubmit=document.getElementById("btnSubmit")
// const divMensajes=document.getElementById("mensajes")


// btnSubmit.addEventListener("click", async(e)=>{
//     e.preventDefault()
//     let first_name=inputFirstName.value 
//     let last_name=inputLastName.value 
//     let email=inputEmail.value 
//     let age=inputAge.value 
//     let password=inputPassword.value 
//     let rol=inputRol.value 
//     if(!email || !password || !rol){
//         alert("Complete los datos")
//         return 
//     }    

//     let body={first_name, last_name, email, age, password, rol}  
    
//     let respuesta=await fetch("/api/sessions/registro", {
//         method:"post", 
//         headers:{
//             "Content-Type":"application/json"
//         },
//         body: JSON.stringify(body)
//     })
//     //console.log(datos)
//     let datos=await respuesta.json()
//     //console.log(datos)
//     if (respuesta.status >= 400) {
//         divMensajes.textContent = datos.error;
//         setTimeout(() => {
//             divMensajes.textContent = "";
//         }, 3000);
//     }else{
//         window.location.href=`/login?mensaje=Registro exitoso para ${datos.nuevoUsuario.email}`
//     }
// })
