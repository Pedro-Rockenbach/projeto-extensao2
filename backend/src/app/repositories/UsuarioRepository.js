import { consulta } from "../database/connection.js";

class UsuariosRepository {
  create(usuario) {
    const sql = "INSERT INTO usuarios SET ?;";
    return consulta(sql, usuario, "Nao foi possivel criar");
  }

  findAll() {
    const sql = "SELECT * FROM usuarios;";
    return consulta(sql, "Nao foi possivel criar");
  }

  findById(id) {
    const sql = "SELECT * FROM usuarios WHERE id=?;";
    return consulta(sql, id, "Nao foi possivel criar");
  }

  update(usuario, id) {
    const sql = "UPDATE usuarios SET ? WHERE id=?";
    return consulta(sql, [usuario, id], "Nao foi possivel atualizar");
  }

  delete(id) {
    const sql = "DELETE FROM usuarios WHERE id=?;";
    return consulta(sql, id, "Nao foi possivel apagar");
  }
}

export default new UsuariosRepository();
