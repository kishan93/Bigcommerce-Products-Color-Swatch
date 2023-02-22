export default () => `query ExtendedProductsById($productIds: [Int!]) {
  site {
    products(entityIds: $productIds) {
      edges {
        node {
          entityId
          productOptions {
            edges {
              node {
                entityId
                displayName
                isRequired
                __typename
                ... on CheckboxOption {
                  checkedByDefault
                }
                ... on MultipleChoiceOption {
                  values {
                    edges {
                      node {
                        entityId
                        label
                        isDefault
                        ... on SwatchOptionValue {
                          hexColors
                          imageUrl(width: 200)
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`