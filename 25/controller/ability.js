exports.ability = (req, res) => {
  res.status(200).send(req.rules);
};
