export const TextRegex = /^[\x20-\x7E\n\tåäöÅÄÖ€]+$/;
export const TagRegex = /<[^>]+>/;
export const ImageRegex = /(jpe?g|png|gif|svg)/;
export const EmailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!#$%&()*+åäöÅÄÖ]{8,}$/;
export const NicknameRegex = /^[a-zA-Z0-9åäöÅÄÖ]+$/;
export const NameRegex = /^[a-zA-Z åäöÅÄÖ]+$/;
export const MaxSize = 50000000;
export const MaxSizeAvatar = 5000000;

function ValidateField(validateFieldName, textValue, minlength = 1, maxlength = 3000) {
    if (validateFieldName === "Title" || validateFieldName === "Content" || validateFieldName === "About me") {
      let checkEmptyField = textValue.replace(/\s/g, '');
      if (checkEmptyField.length === 0) {
        return validateFieldName+" cannot be empty or consist of only spaces or newlines";
      }
    }
    if ((validateFieldName === "Email" || validateFieldName === "Password" || validateFieldName === "First name" || validateFieldName === "Last name") && textValue.length < minlength) {
      return validateFieldName+" must be at least " + minlength + " characters";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content" || validateFieldName === "Email" || validateFieldName === "Password" || validateFieldName === "First name" || validateFieldName === "Last name" || validateFieldName === "Nickname") && textValue.length > maxlength) {
      return validateFieldName+" can be maximum " + maxlength + " characters";
    }
    if (validateFieldName === "Email" && !EmailRegex.test(textValue)) {
      return "Email must be valid";
    }
    if (validateFieldName === "Password" && !PasswordRegex.test(textValue)) {
      return "Password must contain at least one uppercase letter, one lowercase letter and one number";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content"|| validateFieldName === "First name" || validateFieldName === "Last name" || validateFieldName === "Email" || validateFieldName === "Password") && textValue.length === 0) {
      return validateFieldName+" is required";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content") && !TextRegex.test(textValue)) {
      return validateFieldName+" must be regular characters";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content" || validateFieldName === "About me") && TagRegex.test(textValue)) {
      return validateFieldName+" cannot contain HTML tags";
    }
    if (validateFieldName === "Nickname" && !NicknameRegex.test(textValue) && textValue.length > 0) {
      return "Nickname must be alphanumeric, with no spaces";
    }
    if ((validateFieldName === "First name" || validateFieldName === "Last name") && !NameRegex.test(textValue)) {
      return validateFieldName + " must be regular characters";
    }
    if (validateFieldName === "Age") {
      var today = new Date().toISOString().slice(0, 10);
      if (textValue > today) {
        return "Date of birth must be in the past";
      }
      if (textValue < "1900-01-01") {
        return "Date of birth must be after 1900";
      }
      if (textValue === "" || textValue === "Invalid date" || textValue === "NaN-NaN-NaN") {
        return "Date of birth is required";
      }
      if (textValue > new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().slice(0, 10)) {
        return "Date of birth must be at least 5 years ago";
      }
    }
    
    if (validateFieldName !== "Picture" && validateFieldName !== "Email" && validateFieldName !== "Age") {
      const maxWordLength = validateFieldName === "Title" ? 14 : 30;
      var words = textValue.split(' ');
      for (var i = 0; i < words.length; i++) {
        if (words[i].length > maxWordLength) {
          return `Words must be less than ${maxWordLength} characters each`;
        }
      }
    }
    if (validateFieldName === "Picture" && textValue !== "") {
      if (maxlength === 5 && textValue.size > MaxSizeAvatar) {
        return "Uploaded avatar must be less than 5MB";
      }
      if (maxlength !== 5 && textValue.size > MaxSize) {
        return "Uploaded image must be less than 50MB";
      }
      console.log(textValue.type)
      if ( !ImageRegex.test(textValue.type)) {
        return "Uploaded image can only have the formats: jpg, jpeg, png, gif, svg";
      }
    }
    if (validateFieldName === "About me" && textValue.length > 0 && !TextRegex.test(textValue)) {
      return validateFieldName + " must be regular characters";
    }
    return "";
  }

export default ValidateField;
