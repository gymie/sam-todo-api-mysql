module.exports = {
    "up": "CREATE TABLE tbltodo(id VARCHAR(25) NOT NULL,title TEXT,status TINYINT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "down": "DROP TABLE tbltodo"
}