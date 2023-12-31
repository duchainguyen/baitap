export const requestRefresh = async (client) => {
  //Sử dụng client
  try {
    const { refresh_token: refreshToken } = JSON.parse(
      localStorage.getItem("login_token")
    );
    // console.log("abc", refreshToken);
    if (!refreshToken) {
      throw new Error("Refresh token not empty");
    }

    const { response, data } = await client.post("/auth/refresh-token", {
      refreshToken,
    });

    // if (!response.ok) {
    //   //Không lấy được token mới
    //   throw new Error("Refresh token Unauthorize");
    // }

    saveToken(data); //Lưu token vào Storage

    return data;
  } catch (e) {}

  return false;
};

const saveToken = (token) => {
  localStorage.setItem("login_token", JSON.stringify(token));
};
