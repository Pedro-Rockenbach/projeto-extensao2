import "dotenv/config";
import mysql from "mysql2";

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSW,
  database: "sistema_mural",
});

conn.connect((error) => {
  if (error) {
    console.error("Erro ao conectar ao banco:", error.message);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

export const consulta = (sql, valores = [], mensagemReject = "Erro na consulta") => {
  return new Promise((resolve, reject) => {
    conn.query(sql, valores, (error, result) => {
      if (error) {
        console.error(`${mensagemReject}:`, error.message);
        return reject(error);
      }

      return resolve(JSON.parse(JSON.stringify(result)));
    });
  });
};

export default conn;
