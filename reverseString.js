// Program to reverse the string "Web application"

function reverseString(str) {
    return str.split('').reverse().join('');
}

const originalString = "Web application";
const reversedString = reverseString(originalString);

console.log("Original String:", originalString);
console.log("Reversed String:", reversedString);

// Export the function for potential reuse
module.exports = reverseString;
