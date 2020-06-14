const axios = require('axios')
const cheerio = require('cheerio')
const db = require('../models/index.js')
module.exports = {
  findAllArticles: (req, res) => {
    db.Article.find({})
      .lean()
      .populate('comments')
      .then(articles => {
        res.render('index', { articles })
      }).catch((err) => {
        res.status(500).json(err)
      })
  },
  getCommentedArticles: (req, res) => {
    db.Article.find({ comments: { $exists: true, $not: { $size: 0 } } })
      .lean()
      .populate('comments')
      .then(commentedArticle => {
        res.render('commented-articles', { commentedArticle })
      }).catch(err => res.status(500).json(err))
  },
  scrapeWineNews: (req, res) => {
    axios.get('https://www.winebusiness.com/news/').then(response => {
      // console.log(response.data)
      const $ = cheerio.load(response.data)
      $('div.wb-section-item-title').each((i, element) => {
        const result = {}
        result.title = $(element).find('title').text().trim()
        result.link = 'https://www.winebusiness.com/news/' + $(element).children('a').attr('href')
        db.Article.create(result).then(articleDoc => console.log(articleDoc)).catch(err => console.log(err))
      })
      $('p.wb-break-word').each((i, element) => {
        result.description = $(element).text().trim()
      })
      // after scrape take to the view articles without comments page.
      res.redirect('/')
    })
  }
}