import { gql } from "@apollo/client";

export const ADD_USER = gql`
	mutation AddUser($username: String!, $email: String!, $password: String!) {
		addUser(username: $username, email: $email, password: $password) {
			token
			user {
				_id
				username
				email
				bookCount
				savedBooks {
					bookId
					title
				}
			}
		}
	}
`;

export const LOGIN_USER = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				_id
				username
				email
				bookCount
				savedBooks {
					bookId
					title
				}
			}
		}
	}
`;

export const SAVE_BOOK = gql`
	mutation saveBook($bookData: BookInput!) {
		saveBook(bookData: $bookData) {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				authors
				title
				description
				image
				link
			}
		}
	}
`;

export const REMOVE_BOOK = gql`
	mutation RemoveBook($bookId: String!) {
		removeBook(bookId: $bookId) {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				authors
				title
				description
				image
				link
			}
		}
	}
`;
