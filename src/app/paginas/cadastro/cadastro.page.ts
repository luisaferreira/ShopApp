import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  private usuario: Usuario = {};
  private usuarioSubscription: Subscription;
  private usuarioId: string = null;

  constructor(
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute
  ) { 
    this.usuarioId = this.activatedRoute.snapshot.params['id'];

    if (this.usuarioId) this.loadUsuario();
  }

  loadUsuario() {
    this.usuarioSubscription = this.usuarioService.getUsuario(this.usuarioId).subscribe(data => {
      this.usuario = data;
    })
  }

  ngOnInit() {
  }

  async cadastrar(usuario: Usuario) {
    this.usuario.id = '12345';
 
    try {
      await this.usuarioService.addUsuario(this.usuario)
    } catch (error) {
      console.log(error);
      
    }
  }

}
