const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')

exports.join = async (req, res, next) => {
    const { email, nick, password } = req.body
    try {
        const exUser = await User.findOne({where: {email}})
        if (exUser) {
            return res.redirect('/join?error=exist')
        }
         // 첫번째 인수는 비밀번호와 두번째는 반복횟수(횟수가 늘수록 비번을 알아내기 어렵지만 암호화도 오래걸림 31까지 가능 12 이상 추천)
        const hash = await bcrypt.hash(password, 12)
        await User.create({
            email,
            nick,
            password: hash,
        })
        return res.redirect('/')
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError)
            return next(authError)
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`)
        }

        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError)
                return next(loginError)
            }
            return res.redirect('/')
        })
    })(req, res, next) // middleware 내의 middleware는 req, res, next를 붙인다.
}

exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/')
    })
}