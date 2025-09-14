/**
 * Helper functions for working with smart contracts
 */

import { QueryClient } from '@cosmjs/stargate';

/**
 * Identify the correct query method for job listings in a contract
 * @param queryContract The contract query function to use
 * @param contractAddress The address of the contract to query
 * @returns The working query method name, or null if none found
 */
export const identifyJobListingMethod = async (
  queryContract: (
    address: string,
    query: Record<string, unknown>,
  ) => Promise<any>,
  contractAddress: string,
): Promise<string | null> => {
  // Common method names for listing jobs, in order of likelihood
  const potentialMethods = [
    'list_jobs',
    'all_jobs',
    'published_jobs',
    'get_all_jobs',
    'get_jobs',
    'jobs',
    'ListJobs',
    'AllJobs',
    'PublishedJobs',
    'GetAllJobs',
    'GetJobs',
    'Jobs',
  ];

  for (const method of potentialMethods) {
    try {
      // Create a query object with the method name as the key
      const query = { [method]: {} };
      console.log(`Trying method: ${method}`);

      // Attempt to query the contract
      const result = await queryContract(contractAddress, query);

      // If we get here without an exception, the method works
      console.log(`Found working method: ${method}`);
      return method;
    } catch (err) {
      // Method failed, continue to the next one
      console.log(`Method ${method} failed`);
    }
  }

  // No methods worked
  return null;
};

/**
 * Cache the contract methods for later use to avoid repeated detection
 */
export const contractMethodCache: Record<string, string> = {};
