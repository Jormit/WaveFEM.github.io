module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("content/style.css");
  eleventyConfig.addPassthroughCopy("content/scripts.js");
  eleventyConfig.addPassthroughCopy("content/CNAME");
  eleventyConfig.addPassthroughCopy("content/assets");

  return {
    templateFormats: ["njk"],
    dir: {
      input: "content",
      output: "_site",
      includes: "../_includes",
    },
  };
};
