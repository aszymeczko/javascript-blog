'use strict';

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.authors.list',
};


function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  // console.log('Link was clicked!');
  // console.log(event);

  /* remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */

  // console.log('clickedElement:', clickedElement);

  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.post');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  // console.log('articleSelector: ', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  // console.log('targetArticle: ', targetArticle);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */

  const titleList = document.querySelector(opts.titleListSelector);

  titleList.innerHTML = '';

  /* find all the articles and save them to variable: articles */

  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  let html = '';

  for (let article of articles) {

    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */

    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* create HTML of the link */

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    // console.log('link HTML: ', linkHTML);

    /* insert link into html variable */

    html = html + linkHTML;

    // console.log(html);
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  // console.log(links);

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {

  const params = { max: 0, min: 999999 };

  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');

    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }

    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = (count - params.min) / (params.max - params.min);
  const classNumber = Math.floor(normalizedCount * (opts.cloudClassCount - 1) + 1);
  return opts.cloudClassPrefix + classNumber;
}

function generateTags() {

  /* create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);

  /* for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const articleTagsList = article.querySelector(opts.articleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    // console.log('articleTags: ', articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    // console.log('articleTagsArray: ', articleTagsArray);

    /* for each tag */
    for (let tag of articleTagsArray) {

      // console.log('tag: ', tag);

      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

      // console.log('link HTML: ', linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML;

      // console.log(html);

      /* check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {

        /* add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }

    /* insert HTML of all the links into the tags wrapper */
    articleTagsList.innerHTML = html;
  }

  /* find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);
  console.log('allTags', allTags);
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams: ', tagsParams);

  /* create variable for all links HTML code */
  let allTagsHTML = '';

  /* for each tag in allTags: */
  for (let tag in allTags) {

    /* generate code of a link and add it to allTagsHTML */

    const tagLinkClass = calculateTagClass(allTags[tag], tagsParams);
    console.log('taglinkClass: ', tagLinkClass);

    const tagLinkHTML = `<li><a href="#tag-${tag}" class="${tagLinkClass}">${tag}</a></li>`;
    allTagsHTML += tagLinkHTML;
  }

  /* add html from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}

generateTags();


function tagClickHandler(event) {

  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  // console.log('Link was clicked!');
  // console.log(event);

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  // console.log('href: ', href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');
  // console.log('Tag: ', tag);

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  // console.log('activeTagLinks: ', activeTagLinks);

  /* for each active tag link */

  for (let activeTagLink of activeTagLinks) {

    /* remove class active */

    activeTagLink.classList.remove('active');
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const targetTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  // console.log('targetTagLinks: ', targetTagLinks);

  /* for each found tag link */
  for (let targetTagLink of targetTagLinks) {

    /* add class active */

    // console.log('targetTagLink:', targetTagLink);

    targetTagLink.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {

  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');
  /* for each link */
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();


function generateAuthors() {

  /* create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* find all articles */

  const articles = document.querySelectorAll(opts.articleSelector);

  /* for every article: */
  for (let article of articles) {

    /* find authors wrapper */

    const articleAuthorList = article.querySelector(opts.articleAuthorSelector);

    /* make html variable with empty string */

    let html = '';

    /* get authors from data-author attribute */

    const articleAuthors = article.getAttribute('data-author');

    // console.log('articleAuthors: ', articleAuthors);

    /* generate HTML of the link */

    const linkHTML = '<a href="#author-' + articleAuthors + '">' + articleAuthors + '</a>';

    // console.log('link HTML: ', linkHTML);

    /* add generated code to html variable */

    html = html + linkHTML;

    // console.log(html);

    /* check if this link is NOT already in allAuthors */
    if (!allAuthors.hasOwnProperty(articleAuthors)) {

      /* add author to allAuthors object */
      allAuthors[articleAuthors] = 1;
    } else {
      allAuthors[articleAuthors]++;
    }

    /* insert HTML of all the links into the tags wrapper */

    articleAuthorList.innerHTML = html;
  }

  /* find list of authors in right column */
  const authorList = document.querySelector(opts.authorsListSelector);
  console.log('allAuthors', allAuthors);
  const authorsParams = calculateTagsParams(allAuthors);
  console.log('authorsParams: ', authorsParams);

  /* create variable for all links HTML code */
  let allAuthorsHTML = '';

  /* for each author in allAuthors: */
  for (let author in allAuthors) {

    /* generate code of a link and add it to allAuthorsHTML */

    const authorLinkHTML = `<li><a href="#author-${author}">${author} (${allAuthors[author]})</a></li>`;
    allAuthorsHTML += authorLinkHTML;
  }

  /* add html from allTagsHTML to tagList */
  authorList.innerHTML = allAuthorsHTML;
}

generateAuthors();


function addClickListenersToAuthors() {
  /* find all links to authors */
  const links = document.querySelectorAll('a[href^="#author-"]');

  /* for each link */
  for (let link of links) {
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();


function authorClickHandler(event) {

  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  // console.log('Link was clicked!');
  // console.log(event);

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  // console.log('href: ', href);

  /* make a new constant "author" and extract author from the "href" constant */

  const author = href.replace('#author-', '');
  // console.log('Author: ', author);

  /* find all authors links with class active */

  const activeAuthorsLinks = document.querySelectorAll('a.active[href^="#author"]');

  // console.log('activeAuthorsLinks: ', activeAuthorsLinks);

  /* for each active author link */

  for (let activeAuthorLink of activeAuthorsLinks) {

    /* remove class active */

    activeAuthorLink.classList.remove('active');
  }

  /* find all author links with "href" attribute equal to the "href" constant */

  const targetAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');

  // console.log('targetAuthorLinks: ', targetAuthorLinks);

  /* for each found author link */
  for (let targetAuthorLink of targetAuthorLinks) {

    /* add class active */

    // console.log('targetAuthorLink:', targetAuthorLink);

    targetAuthorLink.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}