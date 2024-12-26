// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  
  // Message for delivery option for CA
  const message = "Might take longer than usual due to bad weather conditions.";

  // Get the delivery object
  const operations = [];

  // Iterate over the input
  input.cart.deliveryGroups.forEach((deliveryGroup) => {
    // Iterate over the items in the delivery group
    deliveryGroup.deliveryOptions.forEach((deliveryOption) => {
      if (deliveryOption.title === 'International Shipping') {
        operations.push({
          hide: {
            deliveryOptionHandle: deliveryOption.handle
          }
        });
      }
      else {
        // Add message if province is CA
        if (deliveryGroup.deliveryAddress?.provinceCode && deliveryGroup.deliveryAddress?.provinceCode === 'CA') {
          operations.push({
            rename: {
              deliveryOptionHandle: deliveryOption.handle,
              title: `International Shipping - ${message}`
            }
          });
        }
      }
    });
  });

  if (operations.length === 0) {
    return NO_CHANGES;
  }
  return {
    operations: operations
  };
};