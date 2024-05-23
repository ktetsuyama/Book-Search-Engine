const { User, Book } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
	Query: {
		users: async () => {
			return User.find().populate("thoughts");
		},
		user: async (parent, { username }) => {
			return User.findOne({ username }).populate("thoughts");
		},
		books: async (parent, { username }) => {
			const params = username ? { username } : {};
			return Book.find(params).sort({ bookId: -1 });
		},
		book: async (parent, { bookId }) => {
			return Book.findOne({ _id: thoughtId });
		},
		me: async (parent, args, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id }).populate("books");
			}
			throw AuthenticationError;
		},
	},

	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw AuthenticationError;
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw AuthenticationError;
			}

			const token = signToken(user);

			return { token, user };
		},
		addBook: async (
			parent,
			{ authors, description, bookId, image, link, title },
			context
		) => {
			if (context.user) {
				const thought = await Book.create({
					authors,
					savedBooks: context.user.username,
				});

				await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { books: book._id } }
				);

				return book;
			}
			throw AuthenticationError;
			("You need to be logged in!");
		},
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const book = await Book.findOneAndDelete({
					_id: bookId,
				});

				await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { books: book._id } }
				);

				return book;
			}
			throw AuthenticationError;
		},
	},
};

module.exports = resolvers;
