import test, { APIResponse, expect } from '@playwright/test';
import RequestHolder from './requestHolder';

export class BaseController extends RequestHolder {
  // This class can be extended by other controllers
  // to provide common functionality or properties.

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

  /**
   * Sends a POST request to the specified endpoint with the provided request body.
   *
   * @param endpoint - The API endpoint to send the POST request to
   * @param reqBody - The request body object to be sent with the POST request
   * @param reqOptions - Optional additional request configuration options e.g. headers
   * @returns A promise that resolves to the response from the POST request
   * @example
   * const response = await postReq('/v1/some-endpoint', { key: 'value' });
   * console.log(response.status());
   * console.log(await response.json());
   */
  public async postReq(endpoint: string, reqBody: object, reqOptions?) {
    return this.request.post(endpoint, { data: reqBody, ...reqOptions });
  }

  /**
   * Sends a PUT HTTP request to the specified endpoint with the provided request body.
   *
   * @param endpoint - The API endpoint URL to send the PUT request to
   * @param reqBody - The request body object to be sent with the PUT request
   * @param reqOptions - Optional additional request configuration options e.g. headers
   * @returns A promise that resolves to the HTTP response from the PUT request
   */
  public async putReq(endpoint: string, reqBody: object, reqOptions?) {
    return this.request.put(endpoint, { data: reqBody, ...reqOptions });
  }

  /**
   * Sends a DELETE request to the specified endpoint with request body and optional configuration.
   *
   * @param endpoint - The API endpoint to send the DELETE request to
   * @param reqBody - The request body data to be sent with the DELETE request
   * @param reqOptions - Optional additional request configuration options
   * @returns Promise that resolves to the response from the DELETE request
   */
  public async delReq(endpoint: string, reqBody: object, reqOptions?) {
    return this.request.delete(endpoint, { data: reqBody, ...reqOptions });
  }

  /**
   * Validates that the API response has the expected HTTP status code.
   *
   * @param response - The API response object to validate
   * @param statusCode - The expected HTTP status code (e.g., 200, 404, 500)
   * @returns A promise that resolves when the assertion is complete
   *
   * @example
   * ```typescript
   * await expectResponseStatusCode(response, 200);
   * await expectResponseStatusCode(response, 404);
   * ```
   *
   * @remarks
   * This method uses a soft assertion, meaning the test will continue even if this assertion fails.
   * The assertion is wrapped in a test step for better reporting and debugging.
   */
  async expectResponseStatusCode(response: APIResponse, statusCode: number) {
    await test.step(`Expect: response status code should be: ${statusCode}`, async () => {
      expect.soft(response.status()).toBe(statusCode);
    });
  }

  /**
   * Validates that a response object contains a specified property.
   *
   * This method wraps the property existence check in a test step for better test reporting
   * and uses soft assertions to allow test execution to continue even if the assertion fails.
   *
   * @param response - The response object to validate
   * @param property - The name of the property that should exist in the response
   * @returns A promise that resolves when the assertion is complete
   *
   * @example
   * ```typescript
   * await expectResponseHaveProperty(apiResponse, 'data');
   * await expectResponseHaveProperty(userObject, 'id');
   * ```
   */
  async expectResponseHaveProperty(response: any, property: string) {
    await test.step(`Expect: response should have property: "${property}"`, async () => {
      expect.soft(response).toHaveProperty(property);
    });
  }

  /**
   * Validates that a specific property in an API response has the expected value.
   *
   * For array properties ('articles', 'comments', 'tags'), compares the length of the array
   * to the expected value. For all other properties, performs a direct value comparison.
   *
   * @param response - The API response object to validate
   * @param property - The name of the property to check in the response
   * @param propertyValue - The expected value for the property (or array length for array properties)
   *
   * @example
   * ```typescript
   * // Check if articles array has 5 items
   * await expectResponsePropertyHaveValue(response, 'articles', 5);
   *
   * // Check if status property equals 'success'
   * await expectResponsePropertyHaveValue(response, 'status', 'success');
   * ```
   */
  async expectResponsePropertyHaveValue(
    response: APIResponse,
    property: string,
    propertyValue?: any,
  ) {
    await test.step(`Expect: response property "${property}" should have ${propertyValue}`, async () => {
      if (
        property === 'articles' ||
        property === 'comments' ||
        property === 'tags'
      ) {
        expect.soft(response[property].length).toBe(propertyValue);
      } else {
        expect.soft(response[property]).toBe(propertyValue);
      }
    });
  }

  /**
   * Validates that a response property contains the expected value.
   *
   * @param response - The API response object to validate
   * @param property - The name of the property to check in the response
   * @param propertyValue - The expected value that should be contained in the property (optional)
   * @returns A promise that resolves when the assertion is complete
   *
   * @example
   * ```typescript
   * await expectResponsePropertyHaveValues(response, 'status', 200);
   * await expectResponsePropertyHaveValues(response, 'data', expectedData);
   * ```
   */
  async expectResponsePropertyHaveValues(
    response: APIResponse,
    property: string,
    propertyValue?: any,
  ) {
    await test.step(`Expect: response property "${property}" should have ${propertyValue}`, async () => {
      expect.soft(response[property]).toContain(propertyValue);
    });
  }

  /**
   * Validates that a specified property in the API response has a positive (truthy) value.
   * This method performs a soft assertion within a test step to check if the given property
   * exists and contains a truthy value (greater than 0 for numbers, non-empty for strings, etc.).
   *
   * @param response - The API response object to validate
   * @param property - The name of the property to check for a positive value
   * @returns A promise that resolves when the validation step completes
   *
   * @example
   * ```typescript
   * await expectResponsePropertyHavePositiveValue(apiResponse, 'userId');
   * await expectResponsePropertyHavePositiveValue(apiResponse, 'count');
   * ```
   */
  async expectResponsePropertyHavePositiveValue(
    response: APIResponse,
    property: string,
  ) {
    await test.step(`Expect: response property "${property}" should have value > 0`, async () => {
      expect.soft(response[property]).toBeTruthy();
    });
  }

  /**
   * Validates that a specified property in the API response has a falsy value.
   * This method performs a soft assertion, allowing the test to continue even if the assertion fails.
   *
   * @param response - The API response object to validate
   * @param property - The name of the property to check for a falsy value
   * @returns A promise that resolves when the validation step is complete
   *
   * @example
   * ```typescript
   * await expectResponsePropertyHaveNegativeValue(apiResponse, 'isActive');
   * await expectResponsePropertyHaveNegativeValue(apiResponse, 'errorCount');
   * ```
   */
  async expectResponsePropertyHaveNegativeValue(
    response: APIResponse,
    property: string,
  ) {
    await test.step(`Expect: response property "${property}" should have falsy value`, async () => {
      expect.soft(response[property]).toBeFalsy();
    });
  }
}
