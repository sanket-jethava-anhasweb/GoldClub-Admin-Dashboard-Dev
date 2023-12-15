import { gql } from "@apollo/client"


export const USER_FRAGMENT = gql`
fragment User on User {
      id
  phoneNumber
  firstName
  lastName
  userPermissions {
        code
    name
    __typename
  }
  avatar {
        url
    __typename
  }
  __typename
}
`

export const PAGE_INFO = gql`
fragment PageInfoFragment on PageInfo {
      endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}
`

export const TAX_TYPE = gql`
fragment TaxTypeFragment on TaxType {
      description
  taxCode
  __typename
}
`
export const WAREHOUSE_FRAGMENT = gql`
fragment WarehouseFragment on Warehouse {
      id
  name
  __typename
}
`

export const WAREHOUSE_SHIPPING_FRAGMENT = gql`
${WAREHOUSE_FRAGMENT}
fragment WarehouseWithShippingFragment on Warehouse {
      ...WarehouseFragment
  shippingZones(first: 100) {
        edges {
          node {
            id
        name
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}
`

export const PRODUCT_VARIANT_FIELDS = gql`
fragment ProductVariantFields on ProductVariant {
    id
    sku
    name
    isAvailable
    quantityAvailable(countryCode: $countryCode)
  images {
        id
        url
        alt
        __typename
    }
  pricing {
        onSale
    priceUndiscounted {
          ...Price
            __typename
        }
    price {
          ...Price
            __typename
        }
        __typename
    }
  attributes {
        attribute {
            id
            name
            slug
            __typename
        }
    values {
            id
            name
            value: name
            __typename
        }
        __typename
    }
    __typename
}
`
export const PRODUCT_PRICING_FIELD = gql`
fragment ProductPricingField on Product {
      pricing {
        onSale
    priceRangeUndiscounted {
          start {
            ...Price
                __typename
            }
      stop {
            ...Price
                __typename
            }
            __typename
        }
    priceRange {
          start {
            ...Price
                __typename
            }
      stop {
            ...Price
                __typename
            }
            __typename
        }
        __typename
    }
    __typename
}
`
