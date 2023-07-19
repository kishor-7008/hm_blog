export const isValid = function (value) {
  if (typeof value == null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

 export const isValidRequest = function (body) {
  if (Object.keys(body).length === 0) return false;
  return true;
};

export const isValidName = function (name) {
  return /^[a-zA-Z ]{2,30}$/.test(name);
};

export const isValidPincode = function (num) {
  return /^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(num);
};

export const isValidPhone = function (phone) {
  return /^((?!(0))[0-9]{10})$/.test(phone);
};

export const isValidEmail = function (Email) {
  return /^(?=.{1,30}$)[a-zA-Z0-9_\.]+\@(([a-z])+\.)+([a-z]{2,4})$/.test(Email);
};

const isValidPwd = function (Password) {
  return /^[0-9]{4}$/.test(Password);
};

 export const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

// export {
//   isValid,
//   isValidRequest,
//   isValidName,
//   isValidPincode,
//   isValidPhone,
//   isValidEmail,
//   isValidPwd,
//   isValidObjectId,
// };
