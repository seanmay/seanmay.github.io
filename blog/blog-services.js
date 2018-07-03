const loadBlogs = (parseArticle, { manifestUrl, articleBaseUrl }) => {
  // Fetch<manifestUrl> -> Promise<articleUrl[]>
  const loadManifest = defineLoader(loadText, parseManifest);
  // Fetch<articleUrl> -> Promise<parsedArticle>
  const loadArticle = defineLoader(loadText, parseArticle);

  // manifestUrl -> Promise<parsedArticle[]>
  return (
    loadManifest(manifestUrl)
      // when I need to filter by date/time, I can replace this comment with a filter
      .then(urls =>
        Promise.all(urls.map(url => loadArticle(`${articleBaseUrl}/${url}`)))
      )
  );
};

const request = (resolve, defaultOptions) => (url, options) =>
  fetch(url, options || defaultOptions).then(
    res => (res.ok ? Promise.resolve(resolve(res)) : Promise.reject(res))
  );

// Fetch -> Promise<text>
const loadText = request(res => res.text());

// (load<url, options> parse<output>) -> Fetch -> Promise<parsedOutput>
const defineLoader = (load, parse) => (url, options) =>
  load(url, options).then(parse);

// string -> string[]
const parseManifest = text => text.split("\n");