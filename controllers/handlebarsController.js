const axios = require('axios')
const cheerio = require('cheerio')
const db = require('../models')
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
      const wineArticles = []
      const $ = cheerio.load(response.data)
      $('tr').each((i, element) => {
        const result = {}
        result.title = $(element).find('.wb-section-item-title').find('a').text().trim()
        result.link = 'https://www.winebusiness.com' + $(element).find('.wb-section-item-title').children('a').attr('href')
        result.description = $(element).find('.wb-break-word').text().trim()
        wineArticles.push(result)
      })
      
      db.Article.create(wineArticles).then(articleDoc => {
        console.log(articleDoc)
             // after scrape take to the view articles without comments page.
        res.redirect('/')
      }).catch(err => console.log(err)) 
    })
  }
}