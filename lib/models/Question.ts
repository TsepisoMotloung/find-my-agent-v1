import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface QuestionAttributes {
  id: number;
  question_text: string;
  question_type: 'agent' | 'employee';
  is_active: boolean;
  order_index: number;
  created_at?: Date;
  updated_at?: Date;
}

export class Question extends Model<QuestionAttributes> implements QuestionAttributes {
  public id!: number;
  public question_text!: string;
  public question_type!: 'agent' | 'employee';
  public is_active!: boolean;
  public order_index!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question_type: {
      type: DataTypes.ENUM('agent', 'employee'),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Question',
    tableName: 'questions',
    timestamps: true,
    underscored: true
  }
);

export default Question;