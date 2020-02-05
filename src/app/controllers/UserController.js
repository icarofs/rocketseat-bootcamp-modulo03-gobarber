import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExistis = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExistis) {
      return res.status(400).json({ error: 'User already existis.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExistis = await User.findOne({ where: { email } });

      if (userExistis) {
        return res.status(400).json({ error: 'User already existis.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
