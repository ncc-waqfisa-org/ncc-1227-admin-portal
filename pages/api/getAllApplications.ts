import { NextApiRequest, NextApiResponse } from "next";
import { Application } from "../../src/API";
import { getAllApplicationsWithPaginationAPI } from "../../src/CustomAPI";

type Data = {
  applications: Application[];
  error?: any;
};

/**
 * The function `getAllApplications` retrieves all applications using pagination and returns a list of
 * applications.
 * @param {number} batch - The `batch` parameter is the number of applications to retrieve in each API
 * call.
 * @returns a Promise that resolves to an array of Application objects.
 */
async function getAllApplications(batch: number) {
  var nextToken: string | null = null;
  const applicationList: Application[] = [];

  do {
    const result = await getAllApplicationsWithPaginationAPI(batch, nextToken);
    applicationList.push(...result.applications);
    nextToken = result.nextToken;
  } while (nextToken);
  return applicationList;
}

/**
 * This function is an API handler that retrieves all applications for a given batch number.
 * @param {NextApiRequest} req - The `req` parameter is an object that represents the incoming HTTP
 * request. It contains information such as the request method, headers, query parameters, and body.
 * @param res - The `res` parameter is an instance of the `NextApiResponse` class, which represents the
 * HTTP response that will be sent back to the client. It provides methods and properties for setting
 * the response status, headers, and body. In this code snippet, it is used to send a JSON response
 * with
 * @returns a response with a status code of 200 and a JSON object containing the applications.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "POST") {
      let body = JSON.parse(req.body) as { batch: number };

      const applications = await getAllApplications(body.batch);

      return res.status(200).json({ applications });
    } else {
      res
        .status(500)
        .json({ applications: [], error: "request is not a POST request" });
    }
  } catch (error) {
    res.status(500).json({ applications: [], error: error });
  }
}
