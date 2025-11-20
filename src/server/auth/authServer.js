const authServerConfig = (server) => {
  server.post(
    "/register",
    (schema, request) => {
      const requestData = JSON.parse(request.requestBody);
      const { username, password } = requestData;

      // Check if the username already exists
      const existingUser = schema.users.findBy({ username });
      if (existingUser) {
        return new Response(400, {}, { error: "Username is already registered" });
      }

      // Create a new user
      const user = schema.users.create({
        username,
        password,
      });

      // Generate a fake JWT token
      const token = "fake-token";

      return {
        token,
        user: user.attrs,
      };
    }
    // { timing: 2000 }
  );

  // Login route
  server.post(
    "/",
    (schema, request) => {
      console.log("Login request received");
      const requestData = JSON.parse(request.requestBody);
      const { username, password } = requestData;
      console.log("Login attempt:", { username, password });

      // Find the user by username
      const user = schema.users.findBy({ username });
      console.log("User found:", user);

      if (!user) {
        console.log("User not found");
        return new Response(400, {}, { error: "Invalid credentials" });
      }

      if (user.password !== password) {
        console.log("Password mismatch");
        return new Response(400, {}, { error: "Invalid credentials" });
      }

      // Generate a fake JWT token
      const token = "fake-token";
      console.log("Login successful, returning token");

      return {
        token,
        user: user.attrs,
      };
    }
    // { timing: 2000 }
  );
  server.post("/logout", () => {
    return {};
  });
};

export default authServerConfig;
