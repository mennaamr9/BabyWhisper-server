const fs = require('fs');
const path = require('path');
const Resource = require('../db/Models/resourceModel');
const { sequelize } = require('../Config/db');

async function insertArticles() {
  try {
    await sequelize.authenticate();
    console.log('DB connection established.');

    const filePath = path.join(__dirname, './women-health-articls1.jsonl');
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);

    for (const line of lines) {
      try {
        const article = JSON.parse(line);

        await Resource.create({
          title: article.title || 'Untitled',
          content: article.content || '',
          resource_type: 'article',
          category: 'Women Health'
        });

      } catch (err) {
        console.error('JSON error:', err.message);
      }
    }

    console.log('All articles inserted!');
    await sequelize.close();
  } catch (err) {
    console.error(' DB error:', err.message);
    console.error(err);
  }
}

insertArticles();
