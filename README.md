# wineScraper
[image](/images/scraped.png)

View live page here: [Wine News Scraper](https://winescraper.herokuapp.com/)

Web app that lets users view and leave comments on the latest wine news. Using Mongoose and Cheerio to scrape news from another site.
Saves the articles and Comments to a MongoDB Database, Using mongoose to link the comments to the article they are attached to.

a user can:

* scrape new articles from [Wine Business](https://www.winebusiness.com/news/)

* Comment on the articles.

* Delete comments from the article

* View all articles with a comment

---

The commented articles page checks if the comments array on the article model has anything stored and only displays if there is an article that has at least one comment on it,

Otherwise it displays a message stating no articles to display.

Comments are linked to the articles through an array of comments which stores all of the commentIDS of the comments for that specific article in the article model. 
