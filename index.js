const app = require("express")();
const expressGraphQL = require('express-graphql').graphqlHTTP
const { buildSchema } = require("graphql");

// O type User define uma estrutura  para o Schema, lembrando que o 
// GraphQL é fortemente tipado, por isso em frente aos campos existe 
// os tipos. No Schema existem 3 types que são especiais: Query, Mutation e Subscription. 
// Neste exemplo trabalharemos apenas com o Query e Mutation que serve para consultar dados e enviar 
// dados respectivamente.

const schema = buildSchema(`
type User {
    id: ID
    name: String
    repo: String
    age: Int
}
type Query {
    user(id: ID!): User
    users: [User]
}
type Mutation {
    createUser(name: String!, repo: String!, age: Int!): User
}
`);

const providers = {
    users: []
};


let id = 0;

const resolvers = {
    user({id}) {
        return providers.users.find(item => item.id === Number(id));
    },
    users() {
        return providers.users;
    },
    createUser({ name, repo, age}){
        const user = {
            id: id++,
            name,
            repo,
            age
        };

        providers.users.push(user);

        return user;
    }
};

app.use(
    "/graphql",
    expressGraphQL({
      schema,
      rootValue: resolvers,
      graphiql: true
    })
  );
  
  app.listen(3000);
