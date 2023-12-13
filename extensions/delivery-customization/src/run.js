const NO_CHANGES = {
  operations: [],
};


// const configuration = JSON.parse(
//   input?.deliveryCustomization?.metafield?.value ?? "{}"
// );
// if (!configuration.stateProvinceCode || !configuration.message) {
//   return NO_CHANGES;
// }


// Function to reorder delivery options
function reorderDeliveryOptions(deliveryOptions) {
  // Define the priority for each type of delivery option based on its handle
  const priority = {
    'AddLee': 1, // Higher priority (lower number means it will come first)
    'default': 2 // Default for any handle not matching 'AddLee' or 'standard'
  };

  // Sorting logic to prioritize 'AddLee Delivery' and then 'Standard'
  deliveryOptions.sort((a, b) => {
    // Get the priority for each handle, defaulting to 'default' if not found
    let priorityA = priority[a.handle.includes('AddLee') ? 'AddLee' : 'default'];
    let priorityB = priority[b.handle.includes('AddLee') ? 'AddLee' : 'default'];

    // Compare the priorities
    return priorityA - priorityB;
  });

  return deliveryOptions;
}


// Main function to run the customization logic
export function run(input) {
  // Parse the configuration from the metafield value
  const configuration = JSON.parse(
    input?.deliveryCustomization?.metafield?.value ?? "{}"
  );

  // Check if the configuration is valid
  if (!configuration.stateProvinceCode || !configuration.message) {
    return {
      operations: []
    }; // No changes if configuration is invalid
  }

  // Declare and define the deliveryOptions variable
  let deliveryOptions = input.cart.deliveryGroups
    .filter(group => group.deliveryAddress?.provinceCode &&
      group.deliveryAddress.provinceCode === configuration.stateProvinceCode)
    .flatMap(group => group.deliveryOptions);

  // Call the reorder function to sort delivery options
  deliveryOptions = reorderDeliveryOptions(deliveryOptions);

  // Rename logic
  let toRename = deliveryOptions.map(option => ({
    rename: {
      deliveryOptionHandle: option.handle,
      title: option.title ? `${configuration.message}` : configuration.message
    }
  }));

  return {
    operations: toRename
  };
};
