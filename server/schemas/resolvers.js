const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id }).select(
					"-__v -password"
				);
				return userData;
			}
			throw new AuthenticationError("Not logged in");
		},
		searchGoogleBooks: async (parent, { query }) => {
			const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
			const fetch = (await import("node-fetch")).default;
			const response = await fetch(url);
			const data = await response.json();

			return data.items.map((book) => ({
				bookId: book.id,
				authors: book.volumeInfo.authors || ["No author to display"],
				title: book.volumeInfo.title,
				description: book.volumeInfo.description,
				image: book.volumeInfo.imageLinks?.thumbnail || "",
				link: book.volumeInfo.infoLink,
			}));
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
				throw new AuthenticationError("Incorrect credentials");
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError("Incorrect credentials");
			}

			const token = signToken(user);
			return { token, user };
		},
		saveBook: async (parent, { bookData }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { savedBooks: bookData } },
					{ new: true, runValidators: true }
				);

				return updatedUser;
			}
			throw new AuthenticationError("You need to be logged in!");
		},
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId } } },
					{ new: true }
				);

				return updatedUser;
			}
			throw new AuthenticationError("You need to be logged in!");
		},
	},
};

module.exports = resolvers;
