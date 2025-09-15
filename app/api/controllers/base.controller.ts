import RequestHolder from './requestHolder';

export class BaseController extends RequestHolder {
  // This class can be extended by other controllers
  // to provide common functionality or properties.

  /**
   * Sends a POST request to the specified endpoint with the provided request body.
   *
   * @param endpoint - The API endpoint to send the POST request to
   * @param reqBody - The request body object to be sent with the POST request
   * @returns A promise that resolves to the response from the POST request
   * @example
   * const response = await postReq('/v1/some-endpoint', { key: 'value' });
   * console.log(response.status());
   * console.log(await response.json());
   */
  public async postReq(endpoint: string, reqBody: object) {
    return this.request.post(endpoint, { data: reqBody });
  }

  /**
   * Performs a GET HTTP request to the specified endpoint.
   *
   * @param endpoint - The URL endpoint to send the GET request to
   * @param reqOptions - Optional request configuration options e.g. headers, params
   * @returns A promise that resolves to the response from the GET request
   * @example
   * const response = await getReq('/v1/shows/5irr31yTD3iz662argvKgm', {
   *   headers: {
   *     Authorization: `Bearer ${token}`,
   *   },
   * });
   * console.log(response.status());
   * console.log(await response.json());
   */
  public async getReq(endpoint: string, reqOptions?: object) {
    return this.request.get(endpoint, reqOptions);
  }
}
