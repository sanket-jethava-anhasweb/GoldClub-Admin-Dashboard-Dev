import React, { useEffect } from 'react';

import './App.css';
import RoutesPath from './Routes/Routes';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
  gql
} from "@apollo/client";

import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context"
import { createUploadLink } from 'apollo-upload-client'
const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error ${message}`);
    });
  }
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("vjw-ad-token");

  // return the headers to the context so httpLink can read them
  if (token) {

    return {
      headers: {
        ...headers,
        Authorization: token ? `JWT ${token}` : "",
      },
    };
  }

  else { return { headers: { ...headers } } }
});

const link = from([
  errorLink,
  // new HttpLink({ uri: process.env.REACT_APP_URI }),
  // new HttpLink({
  //   uri: process.env.REACT_APP_BASE_URI
  // }),
  createUploadLink({
    uri: process.env.REACT_APP_BASE_URI
  })
]);


const resolvers = {
  Query: {
    uploads: (parent, args) => { },
  },
  Mutation: {
    singleUpload: (parent, args) => {
      return args.file.then(file => {
        //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
        //file.createReadStream() is a readable node stream that contains the contents of the uploaded file
        //node stream api: https://nodejs.org/api/stream.html
        return file;
      });
    },
  },
};
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
  resolvers,
});

function App() {

  useEffect(() => {
    if (localStorage.getItem("vjw-dashboard-theme")) {

      document.querySelector("html").classList.add(localStorage.getItem("vjw-dashboard-theme"))
    }
  }, []);
  return (

    <ApolloProvider client={client}>

      <RoutesPath />

    </ApolloProvider>
  );
}

export default App;





