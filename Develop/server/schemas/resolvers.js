const { AuthenticationError } = require('apollo-server-express');
const { login, saveBook } = require('../controllers/user-controller');
const { User } = require('../models');
const { signToken } = require('../utils');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('_V -password');

                return userData;
            }
            throw new AuthenticationError('Not logged in!');
        }
    }
}

Mutation: {
    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if(!user) {
            throw new AuthenticationError('No user found with this email address');
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError('Invalid password');
        }

        const token = signToken(user);

        return { token, user };
    },
    saveBook: async (parent, {bookdata}, context) => {
        
    }
}