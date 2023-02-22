import graphqlClient from '../graphql/graphql-client';
import productOptionsQuery from '../graphql/queries/productOptionsQuery';
import productOptionsTransform from '../graphql/transformers/product-options-transform';

let productOptionSelector = null

export default function () {
    if (!productOptionSelector) {
        productOptionSelector = new ProductOptionSelector
    }

    console.log("product option selecter loaded");

    productOptionSelector.loadProducts()
}

class ProductOptionSelector {

    products = {}
    productIds = []

    constructor() {
    }

    async loadProducts() {
        this.products = []
        this.productIds = []
        document.querySelectorAll(`[data-product-with-options]`).forEach((item, index) => {
            const productId = parseInt(item.dataset.productId)
            this.productIds[index] = productId
            this.products[productId] = new OptionProduct(item)
        })

        const productsData = await this.getProductInfo()
        productsData.forEach(product => {
            this.products[product.id].loadData(product)
            this.products[product.id].render()
        })

    }

    async getProductInfo() {

        // Set up GraphQL query
        const query = productOptionsQuery()

        // Fetch data from the GraphQL Storefront API
        const data = await graphqlClient(query, { productIds: this.productIds })
        return productOptionsTransform(data)
    }
}

class OptionProduct {
    el
    id
    cardBody
    optionSelector
    data

    constructor(el) {
        this.el = el
        this.id = el.dataset.productId

        this.bindEvents()
        this.initOptionSelector()
    }

    handleMouseOver(event) {
        this.optionSelector.style.display = 'block'
    }

    handleMouseOut(event) {
        this.optionSelector.style.display = 'none'
    }

    bindEvents() {
        /*
        this.el.removeEventListener('mouseover', event => this.handleMouseOver(event))
        this.el.addEventListener('mouseover', event => this.handleMouseOver(event))
        this.el.removeEventListener('mouseout', event => this.handleMouseOut(event))
        this.el.addEventListener('mouseout', event => this.handleMouseOut(event))
        //*/
    }

    initOptionSelector() {
        this.cardBody = this.el.querySelector('.card-body')

        this.optionSelector = document.createElement('div')
        this.optionSelector.style.display = 'none'
        this.cardBody.appendChild(this.optionSelector)
    }

    loadData(product) {
        this.data = product
    }

    render() {
        this.optionSelector.innerHTML = this.getOptionSelecterHtml()
        this.optionSelector.style.display = 'block'
    }

    getOptionSelecterHtml() {
        return `
            ${this.getColorSelectorHtml()}
        `
    }

    getColorSelectorHtml() {
        console.log('building color options');
        console.log(this.data.options);
        let colorOption = this.data.options.filter(option => option.name == 'Color')
        console.log(`found color options for product#${this.data.id}: ${colorOption.length}`);
        if (colorOption.length < 1) {
            return ''
        }
        colorOption = colorOption[0]
        return `
        <div class='product-color-options'>
            ${colorOption.values.map(value => {
            return `
                    <div>
                        <input
                            class="form-radio"
                            type="radio"
                            name="attribute[${colorOption.id}]" value="${value.id}"
                            id="attribute_swatch_${colorOption.id}_${value.id}"
                            required=""
                            aria-label="${value.label}"
                            data-state="false"
                        >
                        <label
                        class="form-option form-option-swatch"
                        for="attribute_swatch_${colorOption.id}_${value.id}"
                        data-product-attribute-value="${value.id}"
                        >
                            <span
                            class="form-option-variant form-option-variant--color"
                            title="${value.label}"
                            style="background-color: ${value.hexColors[0]}"
                            ></span>
                        </label>
                    </div>
                `
        })
                .join('\n')}
        </ul>
        `
    }
}