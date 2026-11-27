import { consulta } from "../database/connection.js";

// Dados do autor vêm da tabela usuarios com os mesmos nomes que o front espera
const SELECT_POSTAGEM = `
  SELECT p.*,
    u.nome AS autor_nome,
    u.curso AS autor_curso,
    u.vinculo AS autor_vinculo,
    u.email AS autor_email
  FROM postagens AS p
  LEFT JOIN usuarios AS u ON u.id = p.usuario_id
`;

class PostagensRepository {
  create(postagem) {
    const sql = "INSERT INTO postagens SET ?;";
    return consulta(sql, postagem, "Não foi possível criar a postagem");
  }

  findAll() {
    const sql = `${SELECT_POSTAGEM} ORDER BY p.criado_em DESC, p.id DESC;`;
    return consulta(sql, [], "Não foi possível buscar as postagens");
  }

  findById(id) {
    const sql = `${SELECT_POSTAGEM} WHERE p.id = ?;`;
    return consulta(sql, [id], "Não foi possível buscar a postagem");
  }

  update(postagem, id) {
    const sql = "UPDATE postagens SET ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?;";
    return consulta(
      sql,
      [postagem, id],
      "Não foi possível atualizar a postagem",
    );
  }

  delete(id) {
    const sql = "DELETE FROM postagens WHERE id = ?;";
    return consulta(sql, [id], "Não foi possível apagar a postagem");
  }
}

export default new PostagensRepository();
