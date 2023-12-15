import { gql } from "@apollo/client"
import {
  PAGE_INFO, TAX_TYPE, WAREHOUSE_FRAGMENT, WAREHOUSE_SHIPPING_FRAGMENT, 
  // BASIC_PRODUCT_FIELDS,
  // SELECTED_ATTRIBUTE,
  // PRICE,
  // PRODUCT_VARIANT_FIELDS,
  // PRODUCT_PRICING_FIELD
} from "./Fragments"
export const SEARCH_CUSTOMERS = gql`
${PAGE_INFO}
query SearchCustomers($after: String, $first: Int!, $query: String!) {
      search: customers(after: $after, first: $first, filter: {search: $query}) {
        edges {
          node {
            id
        phoneNumber
        firstName
        lastName
        __typename
      }
      __typename
    }
    pageInfo {
          ...PageInfoFragment
      __typename
    }
    __typename
  }
}
`
export const GET_HOME = gql`
query Home {
  salesToday: ordersTotal(period: TODAY) {
    gross {
      amount
      currency
      __typename
    }
    __typename
  }
  ordersToday: orders(created:TODAY , sortBy:{field:NUMBER,direction:DESC}) {
    totalCount
    __typename
  }
  ordersToFulfill: orders(status: READY_TO_FULFILL) {
    totalCount
    __typename
  }
  ordersToCapture: orders(status: READY_TO_CAPTURE,first:10) {
    totalCount
    __typename
  }
  productsOutOfStock: products(stockAvailability: OUT_OF_STOCK) {
    totalCount
    __typename
  }
  productTopToday: reportProductSales(period:TODAY , first: 15) {
    edges {
      node {
        id
        revenue(period: TODAY) {
          gross {
            amount
            currency
            __typename
          }
          __typename
        }
        attributes {
          values {
            id
            name
            __typename
          }
          __typename
        }
        product {
          id
          name
          thumbnail {
            url
            __typename
          }
          __typename
        }
        quantityOrdered
        __typename
      }
      __typename
    }
    __typename
  }
  activities: homepageEvents(last: 10) {
    edges {
      node {
        amount
        orderStatus
        paymentStatus
        composedId
        date
        phoneNumber
        phoneNumberType
        id
        message
        orderNumber
        oversoldItems
        quantity
        type
        user {
          id
          phoneNumber
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`

// CREATE PRODUCT QUERIES
export const SEARCH_CATEGORIES = gql`
${PAGE_INFO}
query SearchCategories($after: String, $first: Int!, $query: String!) {
      search: categories(after: $after, first: $first, filter: {search: $query}) {
        edges {
          node {
            id
        name
        __typename
      }
      __typename
    }
    pageInfo {
          ...PageInfoFragment
      __typename
    }
    __typename
  }
}
`

export const SEARCH_COLLECTIONS = gql`
${PAGE_INFO}

query SearchCollections($after: String, $first: Int!, $query: String!) {
      search: collections(after: $after, first: $first, filter: {search: $query}) {
        edges {
          node {
            id
        name
        
        __typename
      }
      __typename
    }
    pageInfo {
          ...PageInfoFragment
      __typename
    }
    __typename
  }
}
`

export const SEARCH_PRODUCT_TYPES = gql`
${PAGE_INFO}
${TAX_TYPE}
query SearchProductTypes($after: String, $first: Int!, $query: String!) {
      search: productTypes(after: $after, first: $first, filter: {search: $query}) {
        edges {
          node {
            id
        name
        slug
        hasVariants
        productAttributes {
              id
          inputType
          slug
          name
          valueRequired
          values {
                id
            name
            slug
            __typename
          }
          __typename
        }
        taxType {
              ...TaxTypeFragment
          __typename
        }
        __typename
      }
      __typename
    }
    pageInfo {
          ...PageInfoFragment
      __typename
    }
    __typename
  }
}
`
export const SEARCH_WAREHOUSE_LIST = gql`
${PAGE_INFO}
${WAREHOUSE_FRAGMENT}
${WAREHOUSE_SHIPPING_FRAGMENT}
query WarehouseList($first: Int, $after: String, $last: Int, $before: String, $filter: WarehouseFilterInput, $sort: WarehouseSortingInput) {
      warehouses(before: $before, after: $after, first: $first, last: $last, filter: $filter, sortBy: $sort) {
        edges {
          node {
            ...WarehouseWithShippingFragment
        __typename
      }
      __typename
    }
    pageInfo {
          ...PageInfoFragment
      __typename
    }
    __typename
  }
}
`
export const FETCH_TYPE_ATTRIBUTES = gql`
fragment PageInfoFragment on PageInfo {
      endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

fragment TaxTypeFragment on TaxType {
      description
  taxCode
  __typename
}

query SearchProductTypes($after: String, $first: Int!, $query: String!) {
      search: productTypes(after: $after, first: $first, filter: {search: $query}) {
        edges {
          node {
            id
        name
        hasVariants
        productAttributes {
              id
          inputType
          slug
          name
          valueRequired
          values {
                id
            name
            slug
            __typename
          }
          __typename
        }
        taxType {
              ...TaxTypeFragment
          __typename
        }
        __typename
      }
      __typename
    }
    pageInfo {
          ...PageInfoFragment
      __typename
    }
    __typename
  }
}
`

// GET PRODUCTS

export const GET_ALL_PRODUCTS = gql`
fragment BasicProductFields on Product {
  id
  name
  category{
    id
    name
    __typename
  }
  collections{
    id
    name
    __typename
  }
  productType{
    id
    name
    __typename
  }
  thumbnail {
    url
    alt
    __typename
  }
  thumbnail2x: thumbnail(size: 510) {
    url
    __typename
  }
  __typename
}

fragment Price on TaxedMoney {
  gross {
    amount
    currency
    __typename
  }
  net {
    amount
    currency
    __typename
  }
  __typename
}
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
query allProductsData(
  $search: String!
  #$isPublished: Boolean!
  #$attribute_slug: String!
  #$attribute_value: String!
  #$categories: ID!
  #$collections: ID!
  #$productType: ID!
  $first: Int!
  $stockAvailability: StockAvailability!
) {
  products(
    filter: {
       search:$search # user search text
      # attributes:{
      #   slug: $attribute_slug# attribute slug
      #   values:$attribute_value # attribute value
      # }
      # categories: $categories # category id
      # collections:$collections # collection id
      # productType:$productType # product type id
    }
    first: $first
    stockAvailability: $stockAvailability
  ) {
    edges {
      node {
        ...BasicProductFields
        ...ProductPricingField
        category {
          id
          name
          __typename
        }
        isPublished
        isAvailableForPurchase
        attributes {
          attribute {
            id
            name
            slug
          }
          values {
            id
            name
            slug
            inputType
          }
        }
        __typename
      }
      __typename
    }
    totalCount
    __typename
  }
}

`
export const GET_ALL_PRODUCTS_FILTERED = gql`
fragment BasicProductFields on Product {
  id
  name
  category{
    id
    name
    __typename
  }
  collections{
    id
    name
    __typename
  }
  productType{
    id
    name
    __typename
  }
  thumbnail {
    url
    alt
    __typename
  }
  thumbnail2x: thumbnail(size: 510) {
    url
    __typename
  }
  __typename
}

fragment Price on TaxedMoney {
  gross {
    amount
    currency
    __typename
  }
  net {
    amount
    currency
    __typename
  }
  __typename
}
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
query allProductsData(
  #$search: String!
  #$isPublished: Boolean!
  $filter:ProductFilterInput
  #$attribute_slug: String!
  #$attribute_value: [String]
  #$categories: [ID]!
 # $collections: [ID]!
 # $productType: ID!
  #$stockAvailability: StockAvailability!
) {
  products(
    filter: $filter 
    #{
       #search:$search # user search text
      # attributes:[{
    #     slug: $attribute_slug# attribute slug
     #    values:$attribute_value # attribute value
      # }]
      # categories: $categories # category id
      # collections:$collections # collection id
       #productType:$productType # product type id
    #}
    first: 100
    stockAvailability: IN_STOCK
  ) {
    edges {
      node {
        ...BasicProductFields
        ...ProductPricingField
        category {
          id
          name
          __typename
        }
        isPublished
        isAvailableForPurchase
        attributes {
          attribute {
            id
            name
            slug
          }
          values {
            id
            name
            slug
            inputType
          }
        }
        __typename
      }
      __typename
    }
    totalCount
    __typename
  }
}



`
export const GET_ALL_PRODUCTS_PARENT_ID = gql`
fragment BasicProductFields on Product {
  id
  name
  category{
    id
    name
    __typename
  }
  collections{
    id
    name
    __typename
  }
  productType{
    id
    name
    __typename
  }
  thumbnail {
    url
    alt
    __typename
  }
  thumbnail2x: thumbnail(size: 510) {
    url
    __typename
  }
  __typename
}

fragment Price on TaxedMoney {
  gross {
    amount
    currency
    __typename
  }
  net {
    amount
    currency
    __typename
  }
  __typename
}
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
query allProductsData(
  
  $filter:ProductFilterInput
  #$attribute_slug: String!
  #$attribute_value: [String]

) {
  products(
    filter: $filter 
  
    first: 20
    stockAvailability: IN_STOCK
  ) {
    edges {
      node {
        ...BasicProductFields
        ...ProductPricingField
        category {
          id
          name
          __typename
        }
        isPublished
        isAvailableForPurchase
        variants{
          id
          name
          sku
          
        }
        attributes {
          attribute {
            id
            name
            slug
          }
          values {
            id
            name
            slug
            inputType
          }
        }
        __typename
      }
      __typename
    }
    totalCount
    __typename
  }
}



`

export const GET_PRODUCT_BY_ID = gql`
fragment ProductImageFragment on ProductImage {
      id
  alt
  sortOrder
  url
  __typename
}

fragment Money on Money {
      amount
  currency
  __typename
}

fragment ProductVariantAttributesFragment on Product {
  id
  attributes {
    attribute {
      id
      slug
      name
      inputType
      valueRequired
      values {
        id
        name
        slug
        __typename
      }
      __typename
    }
    values {
      id
      inputType
      name
      slug
      __typename
    }
    __typename
  }
  productType {
    id
    variantAttributes {
      id
      name
      inputType
      values {
        id
        name
        slug
        __typename
      }
      __typename
    }
    __typename
  }
  pricing {
    priceRangeUndiscounted {
      start {
        gross {
          ...Money
          __typename
        }
        __typename
      }
      stop {
        gross {
          ...Money
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}


fragment StockFragment on Stock {
      id
  quantity
  quantityAllocated
  warehouse {
        id
    name
    __typename
  }
  __typename
}

fragment WeightFragment on Weight {
      unit
  value
  __typename
}

fragment MetadataItem on MetadataItem {
      key
  value
  __typename
}

fragment MetadataFragment on ObjectWithMetadata {
      metadata {
        ...MetadataItem
    __typename
  }
  privateMetadata {
        ...MetadataItem
    __typename
  }
  __typename
}

fragment TaxTypeFragment on TaxType {
      description
  taxCode
  __typename
}

fragment Product on Product {
      ...ProductVariantAttributesFragment
  ...MetadataFragment
  name
  slug
  childProduct{
    id
    name
    images {
      ...ProductImageFragment
      __typename
    }
    category {
      id
      name
      __typename
    }
  }
  descriptionJson
  seoTitle
  seoDescription
  defaultVariant {
        id
    __typename
  }
  category {
        id
    name
    __typename
  }
  collections {
        id
    name
    __typename
  }
  margin {
        start
    stop
    __typename
  }
  purchaseCost {
        start {
          ...Money
      __typename
    }
    stop {
          ...Money
      __typename
    }
    __typename
  }
  isAvailableForPurchase
  isAvailable
  isPublished
  chargeTaxes
  publicationDate
  pricing {
        priceRangeUndiscounted {
          start {
            gross {
              ...Money
          __typename
        }
        __typename
      }
      stop {
            gross {
              ...Money
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  images {
        ...ProductImageFragment
    __typename
  }
  variants {
        id
    sku
    name
    price {
          ...Money
      __typename
    }
    margin
    stocks {
          ...StockFragment
      __typename
    }
    trackInventory
    __typename
  }
  productType {
        id
    name
    hasVariants
    taxType {
          ...TaxTypeFragment
      __typename
    }
    __typename
  }
  weight {
        ...WeightFragment
    __typename
  }
  taxType {
        ...TaxTypeFragment
    __typename
  }
  availableForPurchase
  visibleInListings
  __typename
}

query ProductDetails($id: ID!) {
      product(id: $id) {
        ...Product
    __typename
  }
  taxTypes {
        ...TaxTypeFragment
    __typename
  }
}
`


export const GET_VARIANT_QUERIES = gql`
fragment Money on Money {
      amount
  currency
  __typename
}

fragment ProductVariantAttributesFragment on Product {
  id
  attributes {
    attribute {
      id
      slug
      name
      inputType
      valueRequired
      values {
        id
        name
        slug
        __typename
      }
      __typename
    }
    values {
      id
      inputType
      name
      slug
      __typename
    }
    __typename
  }
  productType {
    id
    variantAttributes {
      id
      name
      inputType
      values {
        id
        name
        slug
        __typename
      }
      __typename
    }
    __typename
  }
  pricing {
    priceRangeUndiscounted {
      start {
        gross {
          ...Money
          __typename
        }
        __typename
      }
      stop {
        gross {
          ...Money
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}


fragment WarehouseFragment on Warehouse {
      id
  name
  __typename
}

query CreateMultipleVariantsData($id: ID!) {
      product(id: $id) {
        ...ProductVariantAttributesFragment
    __typename
  }
  warehouses(first: 20) {
        edges {
          node {
            ...WarehouseFragment
        __typename
      }
      __typename
    }
    __typename
  }
}
`

export const VARIANT_CREATE_DATA = gql`# Write your query or mutation here
query ProductVariantCreateData($id: ID!) {
      product(id: $id) {
        id
    images {
          id
      sortOrder
      url
      __typename
    }
    name
    
    productType {
          id
      variantAttributes {
            id
        slug
        name
        valueRequired
        values {
              id
          name
          slug
          __typename
        }
        __typename
      }
      __typename
    }
    thumbnail {
          url
      __typename
    }
    variants {
          id
      name
      sku
      stocks{
        quantity
        warehouse{
          id
          name
        }
      }
      price
      {
        currency
        amount
      }
      
      attributes
      {
        values{
          id
          name
          slug
        }
      }
      images {
            id
        url
        __typename
      }
      __typename
    }
    __typename
  }
}
`

export const VARIANT_DETAILS_DATA = gql`# Write your query or mutation here
query ProductVariantDetails($id: ID!) {
      product(id: $id) {
        id
    images {
          id
      sortOrder
      url
      __typename
    }
    name
    
    productType {
          id
      variantAttributes {
            id
        slug
        name
        valueRequired
        values {
              id
          name
          slug
          __typename
        }
        __typename
      }
      __typename
    }
    thumbnail {
          url
      __typename
    }
    variants {
          id
      name
      sku
      stocks{
        quantity
        warehouse{
          id
          name
        }
      }
      price
      {
        currency
        amount
      }
      
      attributes
      {
        values{
          id
          name
          slug
        }
      }
      images {
            id
        url
        __typename
      }
      __typename
    }
    __typename
  }
}
`

export const GET_MCX_RATES = gql`
query MCXRatesDetails{
  mcxRates{
    Name
    symbol
    InstrumentIdentifier
    Bid
    Ask
    High
    Low
    Open
    Close
    LTP
    Difference
    Time
    __typename
  }
}
`
export const GET_MCX_PREMIUMS = gql`
query getMetalRates{
  metalRates{
    id
    name
    gold24kPremium
    silver999kPremium
    platinum999kPremium  
    updatedAt
  }
}
`

export const GET_ORDER_LIST = gql`# Write your query or mutation here

# Write your query or mutation here
# Write your query or mutation here
fragment AddressFragment on Address {
    city
  cityArea
  companyName
  country {
      __typename
    code
    country
  }
  countryArea
  firstName
  id
  lastName
  phone
  postalCode
  streetAddress1
  streetAddress2
  __typename
}

query OrderList($first: Int, $after: String, $last: Int, $before: String, $filter: OrderFilterInput, $sort: OrderSortingInput) {
    orders(before: $before, after: $after, first: $first, last: $last, filter: $filter, sortBy: $sort) {
      edges {
        node {
          __typename
        billingAddress {
            ...AddressFragment
          __typename
        }
        created
        id
        isUploadedPaymentProof
        number
        paymentStatus
        status
          fulfillments{
            id
            fulfillmentOrder
            status
          }
          lines{
            id
            productName
            variantName
            productSku
            quantity
            quantityFulfilled
            variant{
              id
              name
              product{
                id
                attributes{
                values{
                    name
                  }
                  attribute{
                    values
                    {
                      name
                    }
                  }
                  
                }
                category{
                  name
                }
                
              }
            }
            thumbnail{
              url
              alt
            }
            unitPrice
            {currency
              gross
              {currency
              amount}
              net{currency
              amount}
              tax{currency
              amount}
            }
            totalPrice{
              currency
              gross{currency
              amount}
              net{currency
              amount}
              tax{currency
              amount}
            }
            
          }
        total {
            __typename
          gross {
              __typename
            amount
            currency
          }
        }
        phoneNumber
      }
      __typename
    }
    pageInfo {
        hasPreviousPage
      hasNextPage
      startCursor
      endCursor
      __typename
    }
    __typename
  }
}
`
export const GET_PAYMENT_PROOF = gql`
query getPaymentProof($id:ID!){
  orderTransactionHistoryById(id:$id){
    id
    transactionProof
    transactionMode
    customerNote
    createdDatetime
}
}`


export const GET_COLLECTION_LIST = gql`
fragment CollectionFragment on Collection {
    id
  isPublished
  name
  backgroundImage{
    url
    alt
  }
  __typename
}

query CollectionList($first: Int, $after: String, $last: Int, $before: String, $filter: CollectionFilterInput, $sort: CollectionSortingInput) {
    collections(first: $first, after: $after, before: $before, last: $last, filter: $filter, sortBy: $sort) {
      edges {
        node {
          ...CollectionFragment
        products {
            totalCount
            
          __typename
        }
        __typename
      }
      __typename
    }
    pageInfo {
        endCursor
      hasNextPage
      hasPreviousPage
      startCursor
      __typename
    }
    __typename
  }
}
`

export const GET_ALL_BANNERS = gql`
query allBannersDetails{
  bannerDetails{
    id
    user{
      phoneNumber
    }
    image
    published
  }
}
`
export const GET_ALL_CATEGORIES = gql`
fragment CategoryFragment on Category {
    id
  name
  children {
      totalCount
    __typename
  }
  products {
      totalCount
    __typename
  }
  __typename
}

fragment PageInfoFragment on PageInfo {
    endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query RootCategories($first: Int, $after: String, $last: Int, $before: String, $filter: CategoryFilterInput, $sort: CategorySortingInput) {
    categories(level: 0, first: $first, after: $after, last: $last, before: $before, filter: $filter, sortBy: $sort) {
      edges {
        node {
          ...CategoryFragment
        __typename
      }
      __typename
    }
    pageInfo {
        ...PageInfoFragment
      __typename
    }
    __typename
  }
}
`
export const GET_CATEGORY_DETAIL = gql`
fragment Money on Money {
    amount
  currency
  __typename
}

fragment CategoryFragment on Category {
    id
  name
  children {
      totalCount
    __typename
  }
  products {
      totalCount
    __typename
  }
  __typename
}

fragment MetadataItem on MetadataItem {
    key
  value
  __typename
}

fragment MetadataFragment on ObjectWithMetadata {
    metadata {
      ...MetadataItem
    __typename
  }
  privateMetadata {
      ...MetadataItem
    __typename
  }
  __typename
}

fragment CategoryDetailsFragment on Category {
    id
  ...MetadataFragment
  backgroundImage {
      alt
    url
    __typename
  }
  name
  slug
  descriptionJson
  seoDescription
  seoTitle
  parent {
      id
    __typename
  }
  __typename
}

fragment PageInfoFragment on PageInfo {
    endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query CategoryDetails($id: ID!, $first: Int, $after: String, $last: Int, $before: String) {
    category(id: $id) {
      ...CategoryDetailsFragment
    children(first: $first, after: $after, last: $last, before: $before) {
        edges {
          node {
            ...CategoryFragment
          __typename
        }
        __typename
      }
      pageInfo {
          ...PageInfoFragment
        __typename
      }
      __typename
    }
    products(first: $first, after: $after, last: $last, before: $before) {
        pageInfo {
          ...PageInfoFragment
        __typename
      }
      edges {
          cursor
        node {
            id
          name
          isAvailable
          thumbnail {
              url
            __typename
          }
          productType {
              id
            name
            __typename
          }
          pricing {
              priceRangeUndiscounted {
                start {
                  gross {
                    ...Money
                  __typename
                }
                __typename
              }
              stop {
                  gross {
                    ...Money
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`
export const GET_SUBCATEGORY_LIST = gql`
query listOfSubCategoryByCategoryID($subcategoryId: ID!) {
  category(id: $subcategoryId) {
    id
    name
    metadata{
      key
      value
  }
  }
}`
export const GET_CATEGORY_DETAIL_SLUG = gql`
fragment Money on Money {
    amount
  currency
  __typename
}

fragment CategoryFragment on Category {
    id
  name
  children {
      totalCount
    __typename
  }
  products {
      totalCount
    __typename
  }
  __typename
}

fragment MetadataItem on MetadataItem {
    key
  value
  __typename
}

fragment MetadataFragment on ObjectWithMetadata {
    metadata {
      ...MetadataItem
    __typename
  }
  privateMetadata {
      ...MetadataItem
    __typename
  }
  __typename
}

fragment CategoryDetailsFragment on Category {
    id
  ...MetadataFragment
  backgroundImage {
      alt
    url
    __typename
  }
  name
  slug
  descriptionJson
  seoDescription
  seoTitle
  parent {
      id
    __typename
  }
  __typename
}

fragment PageInfoFragment on PageInfo {
    endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query CategoryDetails($slug:String!,$first: Int, $after: String, $last: Int, $before: String) {
  category(slug:$slug) {
    ...CategoryDetailsFragment
    children(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          ...CategoryFragment
          __typename
        }
        __typename
      }
      pageInfo {
        ...PageInfoFragment
        __typename
      }
      __typename
    }
    products(first: $first, after: $after, last: $last, before: $before) {
      pageInfo {
        ...PageInfoFragment
        __typename
      }
      edges {
        cursor
        node {
          id
          name
          isAvailable
          thumbnail {
            url
            __typename
          }
          productType {
            id
            name
            __typename
          }
          pricing {
            priceRangeUndiscounted {
              start {
                gross {
                  ...Money
                  __typename
                }
                __typename
              }
              stop {
                gross {
                  ...Money
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}`
export const GET_ALL_MANUFACTURERS = gql`
query listManufecturers{
  manufecturers{
    id
    name
    address
    gstNumber
    contactPersonName
    phoneNumber
    city
    __typename
  }
}
`

export const GET_SUBCATEGORY_MAKINGCHARGE = gql`
  query getCategoryPrice(
  $category: ID!
  $subcategory: ID!
  $metalType: String!
  $carat: Int!
) {
  categoryPrice(
    categoryId: $category
    subcategoryId: $subcategory
    metalType: $metalType
    carat: $carat
  ) {
    id
    metalType
    category {
      id
      name
    }
    subcategory {
      id
      name
    }
    carat
    hasDiamond
    hasOtherGemstone
    makingChargeMode
    makingCharge
    wastageChargeMode
    wastageCharge
    createdAt
    updatedAt
  }
}
`

export const GET_ALL_MANUFACTURER_LIST = gql`
query listManufecturers{
  manufecturers{
    id
    name
    __typename
  }
}
`
export const GET_MANUFACTURER_BY_ID = gql`
query manufecturerAssignments($manufecturer:ID!) {
  manufecturerAssignments(manufecturer: $manufecturer) {
    id
    manufacturer {
      id
      name
      address
      gstNumber
      contactPersonName
      phoneNumber
      __typename
    }
    metalType
    category {
      id
      slug
      name
    }
    subcategory {
      id
      slug
      name
    }
    carat
    colour
    hasDiamond
    hasOtherGemstone
    makingDays
    wastageChargeMode
    wastageCharge
    makingChargeMode
    makingCharge
    createdAt
    createdBy {
      id
      phoneNumber
    }
    updatedAt
    updatedBy {
      id
      phoneNumber
    }
  }
}
`
export const GET_VARIANT_ID = gql`
query ProductVariantCreateData($id: ID!) {
  product(id: $id) {
    id
    images {
      id
      sortOrder
      url
      __typename
    }
    name
    productType {
      id
      variantAttributes {
        id
        slug
        name
        valueRequired
        values {
          id
          name
          slug
          __typename
        }
        __typename
      }
      __typename
    }
    thumbnail {
      url
      __typename
    }
    variants {
      id
      name
      sku
      images {
        id
        url
        __typename
      }
      __typename
    }
    __typename
 }
}`

export const GET_MANUFACTURERS_ASSIGNMENT_LIST = gql`
query manufecturerAssignmentListBysubcategory($subCategoryId:ID!){
  manufecturerAssignmentsBySubCategory(subCategoryId:$subCategoryId){
    id
    manufacturer{
      id
      name
      address
      gstNumber
      contactPersonName
      phoneNumber
      __typename
    }
    metalType
    category{
      id
      name
      slug
    }
    subcategory{
      id
      name
      slug
    }
    carat
    colour
    hasDiamond
    hasOtherGemstone
    makingDays
    makingChargeMode
    makingCharge
    wastageChargeMode
    wastageCharge
    createdAt
    createdBy{
      id
      phoneNumber
    }
    updatedAt
    updatedBy{
      id
      phoneNumber
    }
  }
}
`

// MANUFACTURER ASSIGN PAGE
export const GET_ALL_ASSIGNMENT_CATEGORIES = gql`
 query listOfCategories{
  categories(first:100,level:0){
    pageInfo{
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges{
      node{
      id
        name
        level
      }
      cursor
      __typename
    }
  }
}
`

export const GET_ASSIGNMENT_SUBCATEGORY = gql`
query listOfSubCategoryByCategoryID($categoryId: ID!) {
  category(id: $categoryId) {
    children(first: 100) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          level
        }
        cursor
        __typename
      }
    }
  }
}
`

export const GET_ASSIGNMENT_CARAT = gql`
query getAtttibuteCarat($search:String!){
  attributes(first:100,filter:{
    search:$search
  }){
    pageInfo{
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges{
      node{
        id
        name
        slug
        values{
          id
          name
          slug         
        }
      }
    }
    totalCount
    __typename
  }
}
`
export const GET_ASSIGMENT_COLOR = gql`
query getAtttibuteColor($search:String!){
  attributes(first:100,filter:{
    search:$search
  }){
    pageInfo{
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges{
      node{
        id
        name
        slug
        values{
          id
          name
          slug         
        }
      }
    }
    totalCount
    __typename
  }
}
`

export const GET_CATEGORY_ATTRIBUTE = gql`
query getAttributes($first:Int!, $search:String!){
  attributes(filter:{
    search:$search
  }, first:$first){
    edges{
      node{
        id
        name
        slug
        values{
          id
          name
          slug
          inputType
        }
      }
      cursor
    }
    totalCount
}
}`

export const GET_DIAMOND_SHAPES = gql`
query getDiamondShapes($filter:AttributeFilterInput!, $first:Int!){
  attributes(filter:$filter, first:$first){
    edges{
      node{
        id
        slug
        name
        values{
          id
          name
          slug
        }
      }
    }
    totalCount
  }
}`
export const GET_DIAMOND_SEIVES = gql`
query getDiamondSieveSize($filter:AttributeFilterInput!, $first:Int!){
  attributes(filter:$filter, first:$first){
    edges{
      node{
        id
        slug
        name
        values{
          id
          name
          slug
        }
      }
    }
    totalCount
  }
}`
export const GET_DIAMOND_GRADES = gql`
query getDiamondGrades($filter:AttributeFilterInput!, $first:Int!){
  attributes(filter:$filter, first:$first){
    edges{
      node{
        id
        slug
        name
        values{
          id
          name
          slug
        }
      }
    }
    totalCount
  }
}`
export const GET_DIAMOND_PRICES = gql`
query getDiamongPricing{
  metalRates{
    diamondRate
    updatedAt
  }
}
`

export const GET_ALL_GEMSTONE_TYPES = gql`
query getOthergemstoneTypes($filter:AttributeFilterInput!, $first:Int!){
  attributes(filter:$filter, first:$first){
    edges{
      node{
        id
        slug
        name
        values{
          id
          name
          slug
        }
      }
    }
    totalCount
  }
}`

export const GET_ALL_GEMSTONE_SHAPES = gql`
query getotherGemstoneShapes($filter:AttributeFilterInput!, $first:Int!){
  attributes(filter:$filter, first:$first){
    edges{
      node{
        id
        slug
        name
        values{
          id
          name
          slug
        }
      }
    }
    totalCount
  }
}`

export const GET_GEMSTONE_PRICING = gql`
query getOthergemstonePricing{
  metalRates{
    otherGemstoneRate
    updatedAt
  }
}`


export const GET_METAL_TYPES = gql`
query getMetalType($search:String!,$first:Int!){
  attributes(filter:{
    search:$search 
  }, first:$first){
    edges{
      node{
        id
        name
        slug
        values{
          id
          name
          slug
          inputType
        }
      }
      cursor
    }
    totalCount
  }
}

`
export const GET_ACTIVE_CATEGORIES = gql`
query Categories($first:Int!,$level:Int!){
  categories(first:$first,level:$level){
    edges{
      node{
        id
        name
        slug
      }
    }
    totalCount
  }
}
`

export const GET_ACTIVE_KARAT = gql`
query getSubCategoryActiveCarats($categoryId:ID!,$metalType:String!){
  subcategoryActiveCarats(categoryId:$categoryId,metalType:$metalType){
    carats
    colour
  }
}
`

export const GET_SUBCATEGORY_PRICING = gql`
 query getSubCategoryByselectedParams($categoryId:ID!,$metalType:String!,$carat:Int!,$colour:String!){
  getSubcategoryByFilter(categoryId:$categoryId,metalType:$metalType,carat:$carat,colour:$colour){
    id
    name
    metadata{
      key
      value
    }
    level
    slug
  }
}
`


export const GET_DRAFT_ORDERS = gql`
fragment AddressFragment on Address {
  city
  cityArea
  companyName
  country {
    __typename
    code
    country
  }
  countryArea
  firstName
  id
  lastName
  phone
  postalCode
  streetAddress1
  streetAddress2
  __typename
}

query OrderDraftList($first: Int, $after: String, $last: Int, $before: String, $filter: OrderDraftFilterInput, $sort: OrderSortingInput) {
  draftOrders(before: $before, after: $after, first: $first, last: $last, filter: $filter, sortBy: $sort) {
    edges {
      node {
        __typename
        billingAddress {
          ...AddressFragment
          __typename
        }
        created
        id
        number
        paymentStatus
        status
        total {
          __typename
          gross {
            __typename
            amount
            currency
          }
        }
        phoneNumber
      }
      __typename
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
      __typename
    }
    __typename
  }
}
`

export const SEARCH_CUSTOMER = gql`
fragment PageInfoFragment on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query SearchCustomers($after: String, $first: Int!, $query: String!) {
  search: customers(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        phoneNumber
        firstName
        lastName
        __typename
      }
      __typename
    }
    pageInfo {
      ...PageInfoFragment
      __typename
    }
    __typename
  }
}
`

export const SEARCH_ORDER_VARIANT = gql`
query SearchOrderVariant($first: Int!, $query: String!, $after: String) {
  search: products(first: $first, after: $after, filter: {search: $query}) {
    edges {
      node {
        id
        name
        thumbnail {
          url
          __typename
        }
        variants {
          id
          name
          sku
          pricing {
            priceUndiscounted {
              net {
                amount
                currency
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
      __typename
    }
    __typename
  }
}
`
export const SEARCH_ORDER_DETAIL = gql`
fragment AddressFragment on Address {
  city
  cityArea
  companyName
  country {
    __typename
    code
    country
  }
  countryArea
  firstName
  id
  lastName
  phone
  postalCode
  streetAddress1
  streetAddress2
  __typename
}
fragment OrderEventFragment on OrderEvent {
  id
  amount
  date
  phoneNumber
  phoneNumberType
  invoiceNumber
  message
  quantity
  type
  user {
    id
    phoneNumber
    __typename
  }
  __typename
}
fragment OrderLineFragment on OrderLine {
  id
  isShippingRequired
  variant {
    id
    product {
      id
      isAvailableForPurchase
      isPublished
      __typename
    }
    quantityAvailable
    __typename
  }
  productName
  productSku
  quantity
  quantityFulfilled
  unitPrice {
    gross {
      amount
      currency
      __typename
    }
    net {
      amount
      currency
      __typename
    }
    __typename
  }
  thumbnail {
    url
    __typename
  }
  __typename
}
fragment FulfillmentFragment on Fulfillment {
  id
  lines {
    id
    quantity
    orderLine {
      ...OrderLineFragment
      __typename
    }
    __typename
  }
  fulfillmentOrder
  status
  trackingNumber
  warehouse {
    id
    name
    __typename
  }
  __typename
}
fragment InvoiceFragment on Invoice {
  id
  number
  createdAt
  url
  status
  __typename
}
fragment MetadataItem on MetadataItem {
  key
  value
  __typename
}
fragment MetadataFragment on ObjectWithMetadata {
  metadata {
    ...MetadataItem
    __typename
  }
  privateMetadata {
    ...MetadataItem
    __typename
  }
  __typename
}
fragment OrderDetailsFragment on Order {
  id
  ...MetadataFragment
  billingAddress {
    ...AddressFragment
    __typename
  }
  canFinalize
  created
  customerNote
  events {
    ...OrderEventFragment
    __typename
  }
  fulfillments {
    ...FulfillmentFragment
    __typename
  }
  lines {
    ...OrderLineFragment
    __typename
  }
  number
  paymentStatus
  shippingAddress {
    ...AddressFragment
    __typename
  }
  shippingMethod {
    id
    __typename
  }
  shippingMethodName
  shippingPrice {
    gross {
      amount
      currency
      __typename
    }
    __typename
  }
  status
  subtotal {
    gross {
      amount
      currency
      __typename
    }
    __typename
  }
  total {
    gross {
      amount
      currency
      __typename
    }
    tax {
      amount
      currency
      __typename
    }
    __typename
  }
  actions
  totalAuthorized {
    amount
    currency
    __typename
  }
  totalCaptured {
    amount
    currency
    __typename
  }
  user {
    id
    phoneNumber
    __typename
  }
  phoneNumber
  availableShippingMethods {
    id
    name
    price {
      amount
      currency
      __typename
    }
    __typename
  }
  discount {
    amount
    currency
    __typename
  }
  invoices {
    ...InvoiceFragment
    __typename
  }
  __typename
}
query orderTransactionHistory{
  orderTransactionHistory{
    id
    customerNote
    transactionMode
    user{
      id
    }
    transactionProof
    order {
        ...OrderDetailsFragment
      __typename
    }
  }
}
`
export const GET_SUBCATEGORY_PRICING_DETAILS = gql`
query getSubCategoryByselectedParams($categoryId:ID!,$metalType:String!,$carat:Int!){
  getSubcategoryByFilter(categoryId:$categoryId,metalType:$metalType,carat:$carat){
    id
    name
    metadata{
      key
      value
    }
    level
    slug
  }
}
`

export const GET_SUBCATEGORY_PRICES = gql`
query getCategoryPrices(
  $category: ID!
  $metalType: String!
  $carat: Int!
) {
  categoryPrices(
    categoryId: $category
    metalType: $metalType
    carat: $carat
  ) {
    id
    metalType
    category {fragment AddressFragment on Address {
  city
  cityArea
  companyName
  country {
    __typename
    code
    country
  }
  countryArea
  firstName
  id
  lastName
  phone
  postalCode
  streetAddress1
  streetAddress2
  __typename
}

      id
      name
    }
    subcategory {
      id
      name
    }
    carat
    hasDiamond
    hasOtherGemstone
    makingChargeMode
    makingCharge
    wastageChargeMode
    wastageCharge
    createdAt
    updatedAt
  }
}
`

export const GET_ALLSUBCATEGORY_PRICES = gql`
query getCategoryPrices(
  $category: ID!
  $metalType: String!
  $carat: Int!
) {
  categoryPrices(
    categoryId: $category
    metalType: $metalType
    carat: $carat
  ) {
    id
    metalType
    category {
      id
      name
    }
    subcategory {
      id
      name
    }
    carat
    hasDiamond
    hasOtherGemstone
    makingChargeMode
    makingCharge
    wastageChargeMode
    wastageCharge
    createdAt
    updatedAt
  }
}`
// export const GET_ORDER_DETAILS = gql`
// {

// }`