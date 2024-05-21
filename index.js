import Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";

const sequelize = new Sequelize("postgres://reviewland:reviewland@localhost:5432/reviewland", { 
  define: { underscored: true }
 });


class User extends Model {}
class Medium extends Model {}

class Review extends Model {}
class Rating extends Model {}

User.init({ name: DataTypes.STRING }, { sequelize })
Medium.init({ name: DataTypes.STRING }, { sequelize })

Review.init({ comment: DataTypes.STRING }, { sequelize })
Rating.init({ value: DataTypes.INTEGER }, { sequelize })

// A User can Review a Medium
User.belongsToMany(Medium, { through: Review, as: "reviewed_medium", foreignKey: "user_id" })
Medium.belongsToMany(User, { through: Review, as: "reviewers", foreignKey: "medium_id" })

// A User can Rate a Medium
User.belongsToMany(Medium, { through: Rating, as: "rated_medium", foreignKey: "user_id"});
Medium.belongsToMany(User, { through: Rating, as: "raters", foreignKey: "medium_id"});

await sequelize.drop();
await sequelize.sync({ force: true });

await User.create({ name: "Toto" }); // 1
await Medium.create({ name: "Chatons mignons"}); // 1
await Medium.create({ name: "Apprendre Sequelize"}); // 2

await Review.create({ comment: "Incroyable les chatons", user_id: 1, medium_id: 1 });
await Review.create({ comment: "Très formateur !", user_id: 1, medium_id: 2 });
// await Review.create({ comment: "Finalement pas si ouf...", user_id: 1, medium_id: 2 });

await Rating.create({ value: 3, user_id: 1, medium_id: 2 });


console.log(JSON.stringify(
  await User.findOne({ include: ["reviewed_medium", "rated_medium"]})
, null, 2))