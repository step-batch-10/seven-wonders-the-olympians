import {
  auth,
  fetchUserName,
  playerReady,
  registerUser,
  sendRedirect,
} from "../src/handlers/auth_handler.js";
import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert/equals";

describe("fetchUserName", () => {
  it("should return the correct username for a valid user ID", () => {
    const ctx = {
      text: (text) => {
        return text;
      },
      getCookie: () => {
        return "Test User";
      },
    };
    const result = fetchUserName(ctx);

    assertEquals(result, "Test User");
  });
  it("should return 'Guest' for an invalid user ID", () => {
    const ctx = {
      text: (text) => {
        return text;
      },
      getCookie: () => {
        return null;
      },
    };
    const result = fetchUserName(ctx);

    assertEquals(result, "Guest");
  });
});

describe("sendRedirect", () => {
  it("should redirect to the correct URL", () => {
    const url = [];
    const ctx = {
      redirect: (urlPath) => {
        return url.push(urlPath);
      },
    };
    sendRedirect(ctx, "/test");

    assertEquals(...url, "/test");
  });
  it("should redirect to the correct URL with a status code", () => {
    const url = [];
    const ctx = {
      redirect: (_, code) => {
        return url.push(code);
      },
    };
    sendRedirect(ctx, "/test");

    assertEquals(...url, 303);
  });
});

describe("registerUser", () => {
  it("should register a user and set a cookie", async () => {
    const user = [];
    const ctx = {
      waitQueue: [],
      users: {},
      req: {
        json() {
          return { name: "userId" };
        },
      },
      setCookie: (_, temp, name) => {
        user.push(name);
        return { [temp]: name };
      },
      redirect: (url) => {
        return url;
      },
    };
    await registerUser(ctx, "TestUser");
    assertEquals(...user, "userId");
    assertEquals(ctx.users, { userId: { game: null } });
  });
});

describe("auth", () => {
  it("should authenticate a user and set a cookie", async () => {
    const ctx = {
      req: {
        json() {
          return { name: "userId" };
        },
      },
      getCookie: () => {
        return { name: "userId" };
      },
      redirect: (url) => {
        return url;
      },
    };
    const nxt = () => {
      return "next";
    };
    const data = await auth(ctx, nxt);
    assertEquals(data, "next");
  });
  it("should not authenticate a user if no cookie is present", async () => {
    const ctx = {
      req: {
        json() {
          return { name: "userId" };
        },
      },
      getCookie: () => {
        return undefined;
      },
      redirect: (url) => {
        return url;
      },
    };
    const nxt = () => {
      return "next";
    };
    const data = await auth(ctx, nxt);
    assertEquals(data, "/login.html");
  });
});

describe("playerReady", () => {
  it("should set the player as ready and redirect to the game page", async () => {
    const ctx = {
      text: (text) => {
        return text;
      },
      user: "userId",
      users: { userId: { game: null } },
      waitQueue: [],
      req: {
        json() {
          return { name: "userId" };
        },
      },
      getCookie: () => {
        return { name: "userId" };
      },
      redirect: (url) => {
        return url;
      },
    };
    const data = await playerReady(ctx);
    assertEquals(data, "wait");
  });
  it("should not set the player as ready if the game is already started", async () => {
    const ctx = {
      text: (text) => {
        return text;
      },
      user: "userId",
      users: { userId: { game: "gameId" } },
      waitQueue: [],
      req: {
        json() {
          return { name: "userId" };
        },
      },
      getCookie: () => {
        return { name: "userId" };
      },
      redirect: (url) => {
        return url;
      },
    };
    const data = await playerReady(ctx);
    assertEquals(data, "/game/");
  });
  it("should set if there three players are ready", async () => {
    const ctx = {
      text: (text) => {
        return text;
      },
      user: "userId",
      users: {
        userId: { game: null },
        userId2: { game: null },
        userId3: { game: null },
        userId4: { game: null },
      },
      waitQueue: ["userId", "userId2", "userId3", "userId4"],
      req: {
        json() {
          return { name: "userId" };
        },
      },
      getCookie: () => {
        return { name: "userId" };
      },
      redirect: (url) => {
        return url;
      },
    };
    const data = await playerReady(ctx);
    assertEquals(data, "/game/");
  });
});
