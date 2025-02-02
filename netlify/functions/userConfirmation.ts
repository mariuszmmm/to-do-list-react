import type { Handler, HandlerEvent } from "@netlify/functions";

let users: { email: string; confirmed: boolean }[] = [
  { email: "test@poczta.pl", confirmed: false },
];
let test: any;

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "POST") {
    if (event.body) {
      const { email, confirmed } = JSON.parse(event.body);
      users.push({ email, confirmed });
    }
    if (event.body) test = JSON.parse(event.body);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Dodano użytkownika" }),
    };
  }

  if (event.httpMethod === "GET") {
    const email = event.queryStringParameters?.email;

    console.log("email", email);
    const user = users.find((user) => user.email === email);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: user ? "Pobrano użytkownika" : "Brak użytkownika",
        user,
        users,
        test,
      }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Metoda nie jest obsługiwana" }),
  };
};

module.exports = { handler };
