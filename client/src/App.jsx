import "./App.css";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet } from "react-router-dom";
import Auth from "./utils/auth";
import Navbar from "./components/Navbar";

// Main GraphQL API endpoint
const httpLink = createHttpLink({
	uri: "/graphql",
});

// Middleware to attach JWT to every request as `authorization` header
const authLink = setContext((_, { headers }) => {
	const token = Auth.getToken();
	// Return headers to context
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	// Setup `authLink` middleware prior to making GraphQL requests
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

function App() {
	return (
		<ApolloProvider client={client}>
			<Navbar />
			<Outlet />
		</ApolloProvider>
	);
}

export default App;
