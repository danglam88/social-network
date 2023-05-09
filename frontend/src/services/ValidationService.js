export const TextRegex = /^[\x20-\x7E\n\t]+$/;
export const TagRegex = /<[^>]*>/g;
export const ImageRegex = /(jpe?g|png|gif|svg)/;
export const MaxSize = 50000000;

function ValidateField(validateFieldName, content, minlength = 1, maxlength = 3000) {
    if (validateFieldName === "Title" || validateFieldName === "Content") {
      let ckeckEmptyField = content.replace(/\s/g, '');
      if (ckeckEmptyField.length === 0) {
        return validateFieldName+" can not consist of only spaces or newlines";
      }
    }
    
    if ((validateFieldName === "Title" || validateFieldName === "Content") && content.length < minlength) {
      return validateFieldName+" is required";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content") && !TextRegex.test(content)) {
      return validateFieldName+" must be regular characters";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content") && TagRegex.test(content)) {
      return validateFieldName+" must not contain HTML tags";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content") && content.length > maxlength) {
      return validateFieldName + " can be maximum " + maxlength + " characters";
    }
    if (validateFieldName !== "Picture") {
      var words = content.split(' ');
      for (var i = 0; i < words.length; i++) {
        if (words[i].length > 30) {
          return "Words must be less than 30 characters each";
        }
      }
    }
    if (validateFieldName === "Picture") {
      if (content.size > MaxSize) {
        return "Uploaded image must be less than 50MB";
      }
      if ( !ImageRegex.test(content.type)) {
      return "Uploaded image can only have the formats: jpg, jpeg, png, gif, svg";
      }
    }
    return "";
  }

export default ValidateField;
