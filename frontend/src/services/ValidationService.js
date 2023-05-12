export const TextRegex = /^[\x20-\x7E\n\t]+$/;
export const TagRegex = /<[^>]*>/g;
export const ImageRegex = /(jpe?g|png|gif|svg)/;
export const EmailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!#$%&()*+]{8,}$/;
export const NicknameRegex = /^[a-zA-Z0-9]+$/;
export const NameRegex = /^[a-zA-Z ]+$/;
export const MaxSize = 50000000;
export const MaxSizeAvatar = 5000000;

function ValidateField(validateFieldName, content, minlength = 1, maxlength = 3000) {
    if (validateFieldName === "Title" || validateFieldName === "Content") {
      let ckeckEmptyField = content.replace(/\s/g, '');
      if (ckeckEmptyField.length === 0) {
        return validateFieldName+" can not consist of only spaces or newlines";
      }
    }
    if ((validateFieldName === "Email" || validateFieldName === "Password" || validateFieldName === "First name" || validateFieldName === "Last name") && content.length < minlength) {
      return validateFieldName+" must be at least " + minlength + " characters";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content" || validateFieldName === "Email" || validateFieldName === "Password" || validateFieldName === "First name" || validateFieldName === "Last name" || validateFieldName === "Nickname") && content.length > maxlength) {
      return validateFieldName+" can be maximum " + maxlength + " characters";
    }
    if (validateFieldName === "Email" && !EmailRegex.test(content)) {
      return "Email must be valid";
    }
    if (validateFieldName === "Password" && !PasswordRegex.test(content)) {
      return "Password must contain at least one uppercase letter, one lowercase letter and one number";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content"|| validateFieldName === "First name" || validateFieldName === "Last name" || validateFieldName === "Email" || validateFieldName === "Password") && content.length === 0) {
      return validateFieldName+" is required";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content") && !TextRegex.test(content)) {
      return validateFieldName+" must be regular characters";
    }
    if ((validateFieldName === "Title" || validateFieldName === "Content" || validateFieldName === "About me") && TagRegex.test(content)) {
      return validateFieldName+" must not contain HTML tags";
    }
    if (validateFieldName === "Nickname" && !NicknameRegex.test(content) && content.length > 0) {
      return "Nickname must be alphanumeric, with no spaces";
    }
    if ((validateFieldName === "First name" || validateFieldName === "Last name") && !NameRegex.test(content)) {
      return validateFieldName + " must be regular characters";
    }
    if (validateFieldName === "Age") {
      var today = new Date().toISOString().slice(0, 10);
      if (content > today) {
        return "Date of birth must be in the past";
      }
      if (content < "1900-01-01") {
        return "Date of birth must be after 1900";
      }
      if (content === "" || content === "Invalid date" || content === "NaN-NaN-NaN") {
        return "Date of birth is required";
      }
      if (content > new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().slice(0, 10)) {
        return "Date of birth must be at least 5 years ago";
      }
    }
    
    if (validateFieldName !== "Picture" && validateFieldName !== "Email" && validateFieldName !== "Age") {
      var words = content.split(' ');
      for (var i = 0; i < words.length; i++) {
        if (words[i].length > 30) {
          return "Words must be less than 30 characters each";
        }
      }
    }
    if (validateFieldName === "Picture" && content !== "") {
      if (maxlength === 5 && content.size > MaxSizeAvatar) {
        return "Uploaded avatar must be less than 5MB";
      }
      if (maxlength !== 5 && content.size > MaxSize) {
        return "Uploaded image must be less than 50MB";
      }
      console.log(content.type)
      if ( !ImageRegex.test(content.type)) {
        return "Uploaded image can only have the formats: jpg, jpeg, png, gif, svg";
      }
    }
    if (validateFieldName === "About me" && content.length > 0 && !TextRegex.test(content)) {
      return validateFieldName + " must be regular characters";
    }
    return "";
  }

export default ValidateField;
