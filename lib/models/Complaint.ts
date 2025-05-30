import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface ComplaintAttributes {
  id: number;
  complainant_name: string;
  complainant_email: string;
  complainant_phone: string;
  policy_number?: string;
  agent_id?: number;
  employee_id?: number;
  complaint_type: 'service' | 'billing' | 'claim' | 'policy' | 'other';
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  resolution?: string;
  resolved_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class Complaint extends Model<ComplaintAttributes> implements ComplaintAttributes {
  public id!: number;
  public complainant_name!: string;
  public complainant_email!: string;
  public complainant_phone!: string;
  public policy_number?: string;
  public agent_id?: number;
  public employee_id?: number;
  public complaint_type!: 'service' | 'billing' | 'claim' | 'policy' | 'other';
  public subject!: string;
  public description!: string;
  public status!: 'pending' | 'in_progress' | 'resolved' | 'closed';
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public resolution?: string;
  public resolved_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Complaint.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    complainant_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complainant_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    complainant_phone: {
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
    complaint_type: {
      type: DataTypes.ENUM('service', 'billing', 'claim', 'policy', 'other'),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'closed'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Complaint',
    tableName: 'complaints',
    timestamps: true,
    underscored: true
  }
);

export default Complaint;