// Helpers for validations used in controllers
const nameValid = (name) => typeof name === 'string' && name.length >= 20 && name.length <= 60;
const addressValid = (address) => typeof address === 'string' ? address.length <= 400 : true;
const emailValid = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
// Password: 8-16 chars, at least 1 uppercase, 1 special char
const passwordValid = (pwd) => {
  if (typeof pwd !== 'string') return false;
  return /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/.test(pwd);
};

module.exports = { nameValid, addressValid, emailValid, passwordValid };
