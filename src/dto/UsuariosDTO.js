export class UsuariosDTO{
    constructor(usuario){
        this.first_name=usuario.first_name.toUpperCase()
        this.email=usuario.email
        this.rol=usuario.rol?usuario.rol:"user"
    }
}