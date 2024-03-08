const { User, Recipe } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find({})
    },
    recipes: async (parent, { _id }) => {
      const params = _id ? { _id } : {}
      return Recipe.find(params);
    },
  },
  Mutation: {
    createRecipe: async (parent, args) => {
      const recipe = await Recipe.create(args)
      return recipe
    },
    addUser: async (parent, { name, email, password}) => {
      const user = await User.create({ name, email, password })
      return { token, user}
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email })

      if (!user) {
        throw AuthenticationError
      }
      
      const correctPw = await user.isCorrectPassword(password)

      if (!correctPw) {
        throw AuthenticationError
      }

      const token = signToken(user)
      return { token, user}
    }
  }
}

module.exports = resolvers
