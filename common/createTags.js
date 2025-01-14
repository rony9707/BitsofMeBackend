// List of common stop words to exclude
const stopWords = [
  'the', 'and', 'is', 'in', 'of', 'for', 'with', 'a', 'to', 'on', 
  'this', 'it', 'that', 'you', 'from', 'as', 'by', 'an', 'be', 
  'or', 'at', 'which', 'but', 'we', 'they', 'their', 'our', 
  'your', 'was', 'were', 'are', 'not', 'has', 'had', 'will',
  'where', 'what', 'when', 'who', 'how', 'why', 'there', 
  'here', 'all', 'any', 'can', 'do', 'did', 'does', 'if', 
  'about', 'into', 'just', 'more', 'no', 'now', 'only', 
  'so', 'some', 'than', 'then', 'too', 'very', 'such', 
  'these', 'those', 'because', 'while', 'again', 'before', 
  'after', 'over', 'under', 'between', 'he', 'she', 'me', 
  'my', 'him', 'her', 'its', 'them', 'same', 'few', 'each', 
  'most', 'much', 'many', 'should', 'would', 'could', 'like', 
  'up', 'down', 'out', 'off', 'himself', 'herself', 'ourselves', 
  'yourselves', 'themselves'
];


// Function to clean the string
const cleanString = (str) => {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split into words
    .filter(word => !stopWords.includes(word) && word.length > 2); // Remove stop words and short words
};


// Extract tags
const extractTags = (str, limit = 20) => {
  const words = cleanString(str);
  const uniqueTags = [...new Set(words)]; // Remove duplicates
  return uniqueTags.slice(0, limit); // Limit to the first N tags
};

// Exporting the function for use in other modules
module.exports = extractTags;

// // Example usage
// const tags = extractTags(inputString);
// console.log(tags); // Output: 20 unique tags or fewer if the input has fewer unique words
