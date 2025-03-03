function getAllUsers(dependencies, req, res) {
  if (req.query.error) {
    throw new Error('unknown error');
  }
  const { userService } = dependencies;
  const users = userService.getAllUsers();

  return res.json(users);
}

module.exports = { getAllUsers };
