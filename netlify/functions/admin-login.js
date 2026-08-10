exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { password } = JSON.parse(event.body || "{}");

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Неверный пароль" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Некорректный запрос" }),
    };
  }
};
