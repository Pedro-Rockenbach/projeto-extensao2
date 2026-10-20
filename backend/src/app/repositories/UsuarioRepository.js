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

  findByEmail(email) {
    const sql = "SELECT * FROM usuarios WHERE email = ? LIMIT 1;";
    return consulta(sql, [email], "Nao foi possivel buscar o usuario");
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
