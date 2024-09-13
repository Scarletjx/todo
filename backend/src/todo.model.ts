import { DataTypes, Model } from 'sequelize';
import sequelize from './dbConfig';

class Todo extends Model {
  public id!: number;
  public title!: string;
  public description?: string;
  public completed!: boolean;
  public createdAt!: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'todos',
  }
);

export default Todo;