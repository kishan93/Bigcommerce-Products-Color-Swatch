export default (data) => {

    return data.site.products.edges.map(product => {

        product = product.node
        const options = product.productOptions.edges.map(option => {

            option = option.node
            const values = option.values.edges.map(value => {
                value = value.node
                return {
                    id: value.entityId,
                    default: value.isDefault,
                    label: value.label,
                    hexColors: value.hexColors
                }
            })

            return {
                name: option.displayName,
                id: option.entityId,
                type: option.__typename,
                values,
            }
        })

        return {
            id: product.entityId,
            options,
        }
    })
}