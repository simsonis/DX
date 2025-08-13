const axios = require('axios');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

async function fetchArticles() {
  const url = 'https://www.law.go.kr/법령/개인정보보호법';
  const response = await axios.get(encodeURI(url), {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  });

  const $ = cheerio.load(response.data);
  const articles = [];
  $('.law-view .lawarticle').each((_, el) => {
    const articleNo = $(el).find('.law-num').text().trim();
    const articleTitle = $(el).find('.law-title').text().trim();
    const articleBody = $(el).find('.law-cont').text().trim();
    articles.push({ articleNo, articleTitle, articleBody });
  });

  return articles;
}

function saveArticles(articles) {
  const dbPath = path.join(__dirname, '../../data/law.db');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, article_no TEXT, article_title TEXT, article_body TEXT)'
    );
    const stmt = db.prepare('INSERT INTO articles (article_no, article_title, article_body) VALUES (?, ?, ?)');
    articles.forEach((article) => {
      stmt.run(article.articleNo, article.articleTitle, article.articleBody);
    });
    stmt.finalize();
  });

  db.close();
}

async function main() {
  try {
    const articles = await fetchArticles();
    saveArticles(articles);
    console.log(`Inserted ${articles.length} articles`);
  } catch (err) {
    console.error('Failed to crawl law data:', err.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fetchArticles, saveArticles };
