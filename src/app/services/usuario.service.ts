import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuariosCollection: AngularFirestoreCollection<Usuario>;

  constructor(
    private afstore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.usuariosCollection = this.afstore.collection<Usuario>('Usuários');
   }

   getUsuarios() {
    return this.usuariosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        })
      })
    )
   }

   getUsuario(id: string) {
    return this.usuariosCollection.doc<Usuario>(id).valueChanges();
   }

   async addUsuario(usuario: Usuario) {
    if (usuario.senha != usuario.senha) {
      return console.error("As senhas não são iguais")
    }

    try {
      const nvUsuario = await this.afAuth.auth.createUserWithEmailAndPassword(usuario.email, usuario.senha);

      const nvUsuarioObject = Object.assign({}, usuario);
      delete nvUsuarioObject.senha;
      delete nvUsuarioObject.confSenha

      return this.usuariosCollection.add(nvUsuarioObject)
    } catch (error) {
      console.log(error);
      
    }

   }

   updateUsuario(id: string, usuario: Usuario) {
    return this.usuariosCollection.doc<Usuario>(id).update(usuario);
   }

   deleteUsuario(id: string) {
     return this.usuariosCollection.doc(id).delete();
   }
}
