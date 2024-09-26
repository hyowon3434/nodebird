const Sequelize = require('sequelize')

class User extends Sequelize.Model {
    static initiate(sequelize){
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'), // local과 kakao로 값을 제한
                allowNull: false, 
                defaultValue: 'local', // 디폴트 값
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true, // timestamps와 paranoid가 true이므로 createdAt, updatedAt 컬럼도 생성됨
            underscored: true, // sequelize에서는 기본적으로 table과 컬럼명을 camel case로 작성 -> 이를 스네이크 기법으로 변경(created_At)
            modelName: 'User', // 모델명 설정
            tableName: 'users', // 테이블명 기본적으로 소문자 복수형
            paranoid: true, //  deletedAt 컬럼 생성 -> row 조회시 deletedAt이 null인 row만 조회
            charset: 'utf8',
            collate: 'utf8_general_ci',

            // utf8_general_ci, utf8을 입력해야 한글 지원 가능, 이모티콘을 입력하려면 utf8mb4로 수정
        })
    }

    // 시퀄라이즈에서 1:N 관계를 hasMany 메서드로 표현
    // a table -- hasMany --> b table
    // a table <-- belongsTo -- b table (a 테이블에 종속되는 b테이블)
    // 1:1 관계에서는 hasOne


    // associate 함수에 매개변수를 db를 두는 이유
    // Post 객체를 parameter로 둘 수 있지만 
    // 이 경우 서로가 서로를 참조하는 순환참조 문제가 발생할 수 있다.
    static associate(db) {
        db.User.hasMany(db.Post)
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        })
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        })
    }
}

module.exports = User