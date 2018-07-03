const initialize = root => {
  const converter = new showdown.Converter();
  const wrapInBlogPostElement = wrapInnerHTML(
    makeElement("article", { class: "blog-post" })
  );

  // md -> htmlText -> <article><...blog ...></article>
  const convertBlog = compose(
    highlightCodeBlocks,
    wrapInBlogPostElement,
    md => converter.makeHtml(md)
  );

  loadBlogs(convertBlog, {
    manifestUrl: "./article.manifest.txt",
    articleBaseUrl: "./articles"
  })
    .then(appendToFragmentInReverse())
    .then(frag => appendChild(root, frag))
    .catch(err => alert(err.message));
};

const highlightCodeBlocks = (root) => {
  root.querySelectorAll("pre code").forEach(el => hljs.highlightBlock(el));
  return root;
};

// I am cheating here, because they should be in reverse-chronological order
// there are better solutions than this particular assumption
const appendToFragmentInReverse = (
  frag = document.createDocumentFragment()
) => children => children.reduceRight(appendChildAndHR, frag);

// this is pretty gross, in terms of styling via HR
// but we can devote some time to prettifying, once the app is running
const appendChildAndHR = (el, child) => {
  return appendChild(el, child) && appendChild(el, makeElement("hr"));
};

const makeElement = (type, attributes = {}, children = []) => {
  const el = document.createElement(type);
  Object.keys(attributes)
    .map(key => [key, attributes[key]])
    .forEach(([key, value]) => el.setAttribute(key, value));

  return children.reduce(appendChild, el);
};

const appendChild = (el, child) => {
  el.appendChild(child);
  return el;
};

const wrapInnerHTML = node => innerHTML => {
  const el = node.cloneNode(false);
  el.innerHTML = innerHTML;
  return el;
};

const compose = (...fs) => fs.reduce((g, f) => x => g(f(x)), x => x);
const map = transform => array => array.map(transform);
