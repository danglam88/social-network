

function ValidationField(validateFieldName, content, minlength, maxlength) {
    const textRegex = /^[\x20-\x7E]+$/;
    const tagRegex = /<[^>]*>/g;
    const imageRegex = /(jpe?g|png|gif|svg)/;
    if (!title || !content) {
      setErrorMessage("Title and content are required");
      return;
    }
    if (!textRegex.test(title) || !textRegex.test(content)) {
      setErrorMessage("Title and content must be regular characters");
      return;
    }
    if (tagRegex.test(title) || tagRegex.test(content)) {
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
    if (picture && !imageRegex.test(picture.type)) {
      setErrorMessage(
        "Uploaded image can only have the formats: jpg, jpeg, png, gif, svg"
      );
      return;
    }
  }