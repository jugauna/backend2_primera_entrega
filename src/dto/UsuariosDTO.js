export class UsuariosDTO{
    constructor(usuario){
        this.id=usuario.id
        this.first_name=usuario.first_name.toUpperCase()
        this.email=usuario.email
        this.rol=usuario.rol
        this.cart=usuario.cart
    }
}