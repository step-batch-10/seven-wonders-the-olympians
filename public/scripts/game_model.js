export class SevenWonders {
  async fetchGetReq(url) {
    return await fetch(url);
  }

  async toJson(req) {
    return await req.json();
  }

  async requestJsonData(url) {
    const req = await this.fetchGetReq(url);
    return await this.toJson(req);
  }

  updatePlayerView = async () => {
    const res = await fetch("/player/view", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isUptoDate: true }),
    });

    return await this.toJson(res);
  };

  postPlayerAction = async (move) => {
    const res = await fetch("/player/action", {
      body: JSON.stringify(move),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    return await this.toJson(res);
  };

  resetPlayerAction = async () => {
    const response = await fetch("/player/action/reset", { method: "PATCH" });

    return await response.json();
  };
}
