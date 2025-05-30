import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface EmployeeAttributes {
  id: number;
  user_id?: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  qr_code: string;
  branch: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Employee extends Model<EmployeeAttributes> implements EmployeeAttributes {
  public id!: number;
  public user_id?: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public department!: string;
  public position!: string;
  public qr_code!: string;
  public branch!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qr_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
    underscored: true
  }
);

export default Employee;