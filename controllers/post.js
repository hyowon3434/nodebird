const { Post, Hashtag } = require('../models')

exports.afterUploadImage = (req, res) => {
    console.log(req.file)
    res.json({ url: `/img/${req.file.filename}` })
}

exports.uploadPost = async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        })
        const hashTags = req.body.content.match(/#[^\s#]*/g)
        if (hashTags) {
            const result = await Promise.all(
                hashTags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() }
                    })
                }),
            )
            await post.addHashtags(result.map(r => r[0]))
        }
        res.redirect('/')
    } catch (error) {
        console.error(error)
        next(error)
    }
}