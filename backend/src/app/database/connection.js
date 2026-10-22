import mysql from "mysql2";

// Pool em vez de uma conexão única: se o MySQL derrubar uma conexão,
// a próxima consulta abre outra sozinha e a API continua funcionando.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSW,
  database: process.env.DB_NAME || "sistema_mural",
  // DATE chega como 'aaaa-mm-dd' (e nao como Date), que e o formato do <input type="date">
  dateStrings: true,
});

pool.getConnection((error, conn) => {
  if (error) {
    console.error("Erro ao conectar ao banco:", error.message);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
  conn.release();
});

export const consulta = (sql, valores = [], mensagemReject = "Erro na consulta") => {
  return new Promise((resolve, reject) => {
    pool.query(sql, valores, (error, result) => {
      if (error) {
        console.error(`${mensagemReject}:`, error.message);
        return reject(error);
      }
      return resolve(JSON.parse(JSON.stringify(result)));
    });
  });
};

export default pool;
