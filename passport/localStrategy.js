const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../models/user')

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
        // done 함수는 passport.authenticate 함수의 콜백함수
        // done 함수의 첫번째 인수는 서버쪽에러가 발생했을때, 이용
        // 비밀번호가 일치 하지 않거나 가입되지 않은 회원인 경우(사용자 정의 에러) 3번째 인수 사용
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({where: {email}})
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password)
                if (result) {
                    done(null, exUser)
                } else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'})
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'})
            }
        } catch (error) {
            // 서버 에러시 예외 처리
            console.error(error)
            done(error)
        }
    }))
}