import User from "./User";
import Agent from "./Agent";
import Employee from "./Employee";
import Question from "./Question";
import Rating from "./Rating";
import Complaint from "./Complaint";

// Define associations
User.hasOne(Agent, { foreignKey: "user_id", as: "agent" });
Agent.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasOne(Employee, { foreignKey: "user_id", as: "employee" });
Employee.belongsTo(User, { foreignKey: "user_id", as: "user" });

Agent.hasMany(Rating, { foreignKey: "agent_id", as: "ratings" });
Rating.belongsTo(Agent, { foreignKey: "agent_id", as: "agent" });

Employee.hasMany(Rating, { foreignKey: "employee_id", as: "ratings" });
Rating.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });

Question.hasMany(Rating, { foreignKey: "question_id", as: "ratings" });
Rating.belongsTo(Question, { foreignKey: "question_id", as: "question" });

Agent.hasMany(Complaint, { foreignKey: "agent_id", as: "complaints" });
Complaint.belongsTo(Agent, { foreignKey: "agent_id", as: "agent" });

Employee.hasMany(Complaint, { foreignKey: "employee_id", as: "complaints" });
Complaint.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });

export { User, Agent, Employee, Question, Rating, Complaint };
