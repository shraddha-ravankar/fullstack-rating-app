const bcrypt = require('bcryptjs');

const newPassword = 'NewPass@123';  // Replace this with the new password you want

bcrypt.hash(newPassword, 10)
  .then(hash => {
    console.log('New bcrypt hash:', hash);
  })
  .catch(err => {
    console.error('Error generating hash:', err);
  });
