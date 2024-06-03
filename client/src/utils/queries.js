import { gql } from "@apollo/client";
export const QUERY_ME = gql`
	query Me {
		me {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				title
				authors
				description
				image
				link
			}
		}
	}
`;

export const SEARCH_GOOGLE_BOOKS = gql`
	query searchGoogleBooks($query: String!) {
		searchGoogleBooks(query: $query) {
			bookId
			authors
			title
			description
			image
			link
		}
	}
`;
