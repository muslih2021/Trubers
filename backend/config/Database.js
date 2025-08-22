import { Sequelize } from 'sequelize';

const db = new Sequelize('telkom_social_performance', 'root', 'salimsaja.', {
  host: '127.0.0.1',
  port: 3308,
  dialect: 'mysql',
});

export default db;
