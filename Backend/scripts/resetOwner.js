const bcrypt = require('bcrypt');

(async () => {
  const plainPassword = "Owner@1234";   // New password
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log("Save this hash in DB:", hash);
})();
