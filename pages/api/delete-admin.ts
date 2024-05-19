import type { NextApiRequest, NextApiResponse } from "next";

interface RequestData {
  username: string;
  token: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      let requestData: RequestData = req.body as RequestData;
      await fetch(
        "https://ena1m2ja1b.execute-api.us-east-1.amazonaws.com/default/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(requestData.token && {
              Authorization: `Bearer ${requestData.token}`,
            }),
          },
          body: JSON.stringify({ username: requestData.username }),
        }
      )
        .then(async (r) => {
          if (r.ok) {
            const data = await r.json();
            res.status(200).json(data);
          } else {
            const data = await r.json();
            res.status(500).json(data);
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ message: error.message });
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: `${err}` });
    }
  }
}
