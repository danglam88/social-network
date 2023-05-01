export const TextRegex = /^[\x20-\x7E]+$/;
export const TagRegex = /<[^>]*>/g;
export const ImageRegex = /(jpe?g|png|gif|svg)/;
export const MaxSize = 50000000;

/*function ValidationField(validateFieldName, content, minlength, maxlength) {
    if (!title || !content) {
      setErrorMessage("Title and content are required");
      return;
    }
    if (!TextRegex.test(title) || !TextRegex.test(content)) {
      setErrorMessage("Title and content must be regular characters");
      return;
    }
    if (TagRegex.test(title) || TagRegex.test(content)) {
      setErrorMessage("Title and content must not contain HTML tags");
      return;
    }
    if (title.length > 30 || content.length > 3000) {
      setErrorMessage("Title can be maximum 30 characters and content must be less than 3000 characters");
      return;
    }
    var words = content.split(' ');
    for (var i = 0; i < words.length; i++) {
      if (words[i].length > 30) {
        setErrorMessage("Words must be less than 30 characters");
        return;
      }
    }
    if (picture && !ImageRegex.test(picture.type)) {
      setErrorMessage(
        "Uploaded image can only have the formats: jpg, jpeg, png, gif, svg"
      );
      return;
    }
  }

export default ValidationField;*/
