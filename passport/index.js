const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/user')

module.exports = () => {

    // serializeUser는 로그인 시 실행
    // req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
    // done 함수의 첫번째 인자는 에러가 발생할 때 사용, 2번째 인자는 저장하고 싶은 데이터
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // deserializeUser는 각 요청마다 실행됨.
    // passport.session 미들웨어가 이 메서드를 호출

    passport.deserializeUser((id, done) => { // id는 serializeUser 메서드의 done의 두번째 인자를 받는다.
        User.findOne({ where: { id } })
        .then(user => done(null, user)) // user 객체는 req.user에 저장된다.
        .catch(err => done(err))
    })

    
    local()
    kakao()

    // 로그인 과정

    // 1. /auth/login 라우터를 통해 로그인 요청
    // 2. 라우터에서 passport.authenticate 메서드 호출
    // 3. 로그인 전략(LocalStrategy) 수행
    // 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login  호출
    // 5. req.login 메서드가 passport.serializeUser 호출
    // 6. req.session에 사용자 아이디만 저장해서 세션 생성
    // 7. express-sission에 설정한 대로 브라우저에 connect.sid 세션 쿠키 전송
    // 8. 로그인 완료

    // 로그인 이후 API 요청
    // 1. 요청이 들어옴
    // 2. 라우터에 요청이 도달하기 전 passport.session 미들웨어가 passport.deserializeUser 메서드 호출
    // 3. connect.sid 세션 쿠키를 읽고 세션 객체를 찾아서 req.session 만듦
    // 4. req.session에 저장된 아이디로 DB 사용자 조회
    // 5. 조회된 사용자 정보를 req.user에 저장
    // 6. 라우터에서 req.user 객체 사용 가능
    
    
}
