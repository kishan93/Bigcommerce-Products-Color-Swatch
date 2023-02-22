## Notes

- created JS module in `assets/js/theme/product-option-selector.js`
- modified file `templates/products/card.html` to show `data-product-with-options` on product with options
- fetched all product ids with option in `ProductOptionSelector` module. and using GraphQL api fetched available options
- using JS injected HTML code to show color option swatch on products that has color option

## extra
- added GraphQL client setup
- on base layout added stencil token to use with GraphQL
- created DTO class to convert GraphQL response for Product-Option-Value query
