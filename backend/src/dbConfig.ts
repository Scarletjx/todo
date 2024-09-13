import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('todo_db', 'scarlet', 'password123', {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;