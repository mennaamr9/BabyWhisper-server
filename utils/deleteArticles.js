const { sequelize } = require('../Config/db');
const Resource = require('../db/Models/resourceModel');

async function deleteArticles() {
  try {
    await sequelize.authenticate();
    console.log('DB connection established.');

    const deleted = await Resource.destroy({
      where: { category: 'Child Health' }
    });

    console.log(`${deleted} articles with category "Child Health" deleted.`);
    await sequelize.close();
  } catch (err) {
    console.error('Error deleting articles:', err.message);
  }
}

deleteArticles();
