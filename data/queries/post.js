const s = require('stripmargin');

module.exports = (owner, project, postPath) => s.stripMargin(
    `{
    |   post(owner: "${owner}", repo: "${project}", key: "${postPath}") {
    |     title,
    |     link,
    |     author,
    |     publishedDate,
    |     contentSnippet,
    |     content
    |   }
    |}`);