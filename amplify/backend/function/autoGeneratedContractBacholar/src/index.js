/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  /**
   * 1. the frontend will send me the scholarship id (bacholar scholarship).
   * 2. Fetch the crosspoinding details of the scholarship to full up the contract with the data.
   * 3. After generating the contract store it's key on the correct feild and make sure to store it in an S3 bucket and return it to the frontend (key) in order to use it to view the generated contract.
   * 4. The contract should be available using similar logic in differnt lambda funcitons.
   */

  //define all the used tables here

  //use the following logic to fill up the document with what it's required.
};
