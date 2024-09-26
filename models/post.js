const Sequelize = require('sequelize')

class Post extends Sequelize.Model {
    static initiate(sequelize){
        Post.init({
            Content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db){
        db.Post.belongsTo(db.User)
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHastag'})
    }
}

module.exports = Post