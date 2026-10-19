import { consulta } from "../database/connection.js";

class PostagensRepository {
  create(postagem) {
    const sql = "INSERT INTO postagens SET ?;";
    return consulta(sql, postagem, "Não foi possível criar a postagem");
  }

  findAll() {
    const sql = `
      SELECT p.*, u.email, u.nome AS usuario_nome
      FROM postagens p
      LEFT JOIN usuarios u ON u.id = p.usuario_id
      ORDER BY p.criado_em DESC, p.id DESC;
    `;
    return consulta(sql, [], "Não foi possível buscar as postagens");
  }

  findById(id) {
    const sql = `
    SELECT p.*, u.email, u.nome AS usuario_nome
    FROM postagens AS p
    LEFT JOIN usuarios AS u ON u.id = p.usuario_id
    WHERE p.id = ?;
  `;
    return consulta(sql, [id], "Não foi possível buscar a postagem");
  }

  update(postagem, id) {
    const sql = "UPDATE postagens SET ? WHERE id = ?;";
    return consulta(
      sql,
      [postagem, id],
      "Não foi possível atualizar a postagem",
    );
  }

  delete(id) {
    const sql = "DELETE FROM postagens WHERE id = ?;";
    return consulta(sql, id, "Não foi possível apagar a postagem");
  }
}

export default new PostagensRepository();
