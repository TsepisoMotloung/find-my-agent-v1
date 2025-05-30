import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface RatingAttributes {
  id: number;
  rater_name: string;
  rater_email: string;
  rater_phone: string;
  policy_number?: string;
  agent_id?: number;
  employee_id?: number;
  question_id: number;
  rating_value: number;
  comments?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Rating extends Model<RatingAttributes> implements RatingAttributes {
  public id!: number;
  public rater_name!: string;
  public rater_email!: string;
  public rater_phone!: string;
  public policy_number?: string;
  public agent_id?: number;
  public employee_id?: number;
  public question_id!: number;
  public rating_value!: number;
  public comments?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    rater_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rater_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    rater_phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    policy_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    agent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'agents',
        key: 'id'
      }
    },
    employee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    question_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id'
      }
    },
    rating_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    timestamps: true,
    underscored: true
  }
);

export default Rating;