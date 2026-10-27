import { consulta } from "../database/connection.js";

// Campos que podem aparecer publicamente (sem o e-mail)
const CAMPOS_PUBLICOS = "id, nome, curso, vinculo";

class UsuariosRepository {
  create(usuario) {
    const sql = "INSERT INTO usuarios SET ?;";
    return consulta(sql, usuario, "Nao foi possivel criar o usuario");
  }

  findAll() {
    const sql = `SELECT ${CAMPOS_PUBLICOS} FROM usuarios;`;
    return consulta(sql, [], "Nao foi possivel buscar os usuarios");
  }

  findById(id) {
    const sql = `SELECT ${CAMPOS_PUBLICOS} FROM usuarios WHERE id = ?;`;
    return consulta(sql, [id], "Nao foi possivel buscar o usuario");
  }

  findByEmail(email) {
    const sql = "SELECT * FROM usuarios WHERE email = ? LIMIT 1;";
    return consulta(sql, [email], "Nao foi possivel buscar o usuario");
  }

  update(usuario, id) {
    const sql = "UPDATE usuarios SET ? WHERE id = ?;";
    return consulta(sql, [usuario, id], "Nao foi possivel atualizar o usuario");
  }
}

export default new UsuariosRepository();
