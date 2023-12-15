import { gql } from "@apollo/client"
import { USER_FRAGMENT } from './Fragments'

export const CREATE_TOKEN = gql`
${USER_FRAGMENT}
mutation TokenAuth($phoneNumber: String!, $password: String!) {
      tokenCreate(phoneNumber: $phoneNumber, password: $password) {
        errors: accountErrors {
          field
      message
      __typename
    }
    csrfToken
    token
    user {
          ...User
      __typename
    }
    __typename
  }
}

`


export const CREATE_PRODUCT = gql`
fragment ProductErrorFragment on ProductError {
      code
  field
  __typename
}

fragment ProductErrorWithAttributesFragment on ProductError {
      ...ProductErrorFragment
  attributes
  __typename
}

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

mutation ProductCreate($input: ProductCreateInput!) {
      productCreate(input: $input) {
        errors: productErrors {
          ...ProductErrorWithAttributesFragment
      __typename
    }
    product {
          ...Product
      __typename
    }
    __typename
  }
}

`

export const UPDATE_PRODUCT = gql`
fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

fragment ProductErrorWithAttributesFragment on ProductError {
    ...ProductErrorFragment
  attributes
  __typename
}

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

mutation ProductUpdate($id: ID!, $input: ProductInput!) {
    productUpdate(id: $id, input: $input) {
      errors: productErrors {
        ...ProductErrorWithAttributesFragment
      __typename
    }
    product {
        ...Product
      __typename
    }
    __typename
  }
}
`

export const DELETE_PRODUCT = gql`
fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

mutation ProductDelete($id: ID!) {
    productDelete(id: $id) {
      errors: productErrors {
        ...ProductErrorFragment
      __typename
    }
    product {
        id
      __typename
    }
    __typename
  }
}`


export const SET_PRODUCT_AVAILABILITY = gql`
fragment ProductErrorFragment on ProductError {
      code
  field
  __typename
}

mutation ProductSetAvailabilityForPurchase($isAvailable: Boolean!, $productId: ID!, $startDate: Date) {
      productSetAvailabilityForPurchase(isAvailable: $isAvailable, productId: $productId, startDate: $startDate) {
        product {
          id
      availableForPurchase
      isAvailableForPurchase
      __typename
    }
    errors: productErrors {
          ...ProductErrorFragment
      message
      __typename
    }
    __typename
  }
}
`


export const CREATE_VARIANTS = gql`
fragment BulkProductErrorFragment on BulkProductError {
      field
  code
  index
  __typename
}

mutation ProductVariantBulkCreate($id: ID!, $inputs: [ProductVariantBulkCreateInput]!) {
      productVariantBulkCreate(product: $id, variants: $inputs) {
        errors: bulkProductErrors {
          ...BulkProductErrorFragment
      __typename
    }
    __typename
  }
}
`
export const SAVE_VARIANTS = gql`fragment Money on Money {
  amount
  currency
  __typename
}

fragment ProductImageFragment on ProductImage {
  id
  alt
  sortOrder
  url
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

fragment ProductVariant on ProductVariant {
  id
  ...MetadataFragment
  attributes {
    attribute {
      id
      name
      slug
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
      name
      slug
      __typename
    }
    __typename
  }
  costPrice {
    ...Money
    __typename
  }
  images {
    id
    url
    __typename
  }
  name
  price {
    ...Money
    __typename
  }
  product {
    id
    defaultVariant {
      id
      __typename
    }
    images {
      ...ProductImageFragment
      __typename
    }
    name
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
    defaultVariant {
      id
      __typename
    }
    __typename
  }
  sku
  stocks {
    ...StockFragment
    __typename
  }
  trackInventory
  weight {
    ...WeightFragment
    __typename
  }
  __typename
}

fragment ProductErrorFragment on ProductError {
  code
  field
  __typename
}

fragment ProductErrorWithAttributesFragment on ProductError {
  ...ProductErrorFragment
  attributes
  __typename
}

mutation VariantCreate($input: ProductVariantCreateInput!) {
  productVariantCreate(input: $input) {
    errors: productErrors {
      ...ProductErrorWithAttributesFragment
      __typename
    }
    productVariant {
      ...ProductVariant
      __typename
    }
    __typename
  }
}`

export const UPDATE_VARIANT = gql`mutation productVariantUpdate($id:ID!,$input:ProductVariantInput!){
  productVariantUpdate(id:$id,input:$input)
  {
    productErrors{
      field
      message
      code
      attributes
    }
    productVariant{
      id
      name
      sku
      price
      {
        currency
        amount
      }
      
    }
  }
}`
export const UPDATE_VARIANT_STOCK = gql`
mutation productVariantStocksUpdate($id:ID!,$stocks:[StockInput!]!){
  productVariantStocksUpdate(variantId:$id,stocks:$stocks){
    productVariant{
      id
      name
      sku
    }
    bulkStockErrors{
      field
      message
      code
    }
  }
}`

export const UPLOAD_PRODUCT_IMAGE = gql`
fragment ProductErrorFragment on ProductError {
      code
  field
  __typename
}

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

mutation ProductImageCreate($product: ID!, $image: Upload!, $alt: String) {
      productImageCreate(input: {alt: $alt, image: $image, product: $product}) {
        errors: productErrors {
          ...ProductErrorFragment
      __typename
    }
    product {
          ...Product
      __typename
    }
    __typename
  }
}
`

export const PRODUCT_IMAGE_DELETE = gql`
fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

mutation ProductImageDelete($id: ID!) {
    productImageDelete(id: $id) {
      errors: productErrors {
        ...ProductErrorFragment
      __typename
    }
    product {
        id
      images {
          id
        __typename
      }
      __typename
    }
    __typename
  }
}
`
export const CREATE_COLLECTION = gql`
fragment CollectionFragment on Collection {
    id
  isPublished
  name
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

fragment CollectionDetailsFragment on Collection {
    ...CollectionFragment
  ...MetadataFragment
  backgroundImage {
      alt
    url
    __typename
  }
  slug
  descriptionJson
  publicationDate
  seoDescription
  seoTitle
  isPublished
  __typename
}

fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

mutation CreateCollection($input: CollectionCreateInput!) {
    collectionCreate(input: $input) {
      collection {
        ...CollectionDetailsFragment
      __typename
    }
    errors: productErrors {
        ...ProductErrorFragment
      __typename
    }
    __typename
  }
}
`

export const UPDATE_COLLECTION = gql`
fragment CollectionFragment on Collection {
    id
  isPublished
  name
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

fragment CollectionDetailsFragment on Collection {
    ...CollectionFragment
  ...MetadataFragment
  backgroundImage {
      alt
    url
    __typename
  }
  slug
  descriptionJson
  publicationDate
  seoDescription
  seoTitle
  isPublished
  __typename
}

fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

mutation CollectionUpdate($id: ID!, $input: CollectionInput!) {
    collectionUpdate(id: $id, input: $input) {
      collection {
        ...CollectionDetailsFragment
      __typename
    }
    errors: productErrors {
        ...ProductErrorFragment
      __typename
    }
    __typename
  }
}
`

export const TOGGLE_COLLECTION_PUBLISH = gql`
fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

mutation CollectionBulkPublish($ids: [ID]!, $isPublished: Boolean!) {
    collectionBulkPublish(ids: $ids, isPublished: $isPublished) {
      errors: productErrors {
        ...ProductErrorFragment
      __typename
    }
    __typename
  }
}
`

export const DELETE_COLLECTION = gql`
fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

mutation CollectionBulkDelete($ids: [ID]!) {
    collectionBulkDelete(ids: $ids) {
      errors: productErrors {
        ...ProductErrorFragment
      __typename
    }
    __typename
  }
}

`

export const CREATE_BANNER = gql`
mutation CreateBanner($file: Upload!, $published: Boolean!) {
  CreateBanner(input: { image: $file, published: $published }) {
    banner {
      id
      user {
        id
      }
      image
      published
    }
  }
}
`
export const UPDATE_BANNER = gql`
mutation updateBannerStatus($id:ID!,$published:Boolean!){
  updateBanner(input:{
    id:$id
    published:$published
  }){
    banner{
      id
      user{
        id
        phoneNumber
      }
      image
      published
    }
  }
}
`
export const DELETE_BANNER = gql`
mutation deleteBanner($id:ID!){
  deleteBanner(input:{
    id:$id
  }){
    message
  }
}
`
export const CREATE_CATEGORY = gql`
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

fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

mutation CategoryCreate($parent: ID, $input: CategoryInput!) {
    categoryCreate(parent: $parent, input: $input) {
      category {
        ...CategoryDetailsFragment
      __typename
    }
    errors: productErrors {
        ...ProductErrorFragment
      __typename
    }
    __typename
  }
}
`
export const UPDATE_CATEGORY_IMAGE = gql`
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

fragment ProductErrorFragment on ProductError {
    code
  field
  __typename
}

mutation CategoryUpdate($id: ID!, $input: CategoryInput!) {
    categoryUpdate(id: $id, input: $input) {
      category {
        ...CategoryDetailsFragment
      __typename
    }
    errors: productErrors {
        ...ProductErrorFragment
      __typename
    }
    __typename
  }
}

`

export const CREATE_MANUFACTURER = gql`
mutation createManufecturer($name:String!,$gstNumber:String,$contactPersonName:String!,$phoneNumber:String!, $city:String!){
  createManufecturer(input:{
    name:$name
    gstNumber:$gstNumber
    contactPersonName:$contactPersonName
    phoneNumber:$phoneNumber
		city:$city
  }){
    manufecturer{
      id
      name
      address
      gstNumber
      contactPersonName
      phoneNumber
      city
    }
    error
  }
}
`

export const UPDATE_MANUFACTURER = gql`
mutation updateManufecturer($name:String!,$gstNumber:String!,$contactPersonName:String!,$phoneNumber:String!,$id:ID!){
  updateManufecturer(id:$id,input:{
    name:$name
    gstNumber:$gstNumber
    contactPersonName:$contactPersonName
    phoneNumber:$phoneNumber,
    city:$city
  }){
    manufecturer{
      id
      name
      address
      city
      gstNumber
      contactPersonName
      phoneNumber
      __typename
    }
  }
}
`

export const ASSIGN_MANUFACTURER_SUBCATEGORY = gql`
mutation manufecturerAssignment(
  $manufecturer: ID!
  $metalType: String!
  $category: ID!
  $subcategory: ID!
  $carat: Int!
  $colour: String!
  $hasDiamond: Boolean!
  $hasOtherGemstone: Boolean!
  $makingDays: Int!
  $makingChargeMode: String!
  $makingCharge: Int!
  $wastageChargeMode: String!
  $wastageCharge: Int!
) {
  createManufecturerAssignment(
    input: {
      manufecturer: $manufecturer
      metalType: $metalType
      category: $category
      subcategory: $subcategory
      carat: $carat
      colour: $colour
      hasDiamond: $hasDiamond
      hasOtherGemstone: $hasOtherGemstone
      makingDays: $makingDays
      makingChargeMode: $makingChargeMode
      makingCharge: $makingCharge
      wastageChargeMode: $wastageChargeMode
      wastageCharge: $wastageCharge
    }
  ) {
    manufecturerAssignment {
      id
      manufacturer {
        id
        name
      }
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
      colour
      hasDiamond
      hasOtherGemstone
      makingDays
      makingChargeMode
      makingCharge
      wastageChargeMode
      wastageCharge
      createdAt
      createdBy {
        id
      }
      updatedAt
      updatedBy {
        id
      }
    }
    error
  }
}
`

export const UPDATE_SUBCATEGORY = gql`
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

fragment MetadataErrorFragment on MetadataError {
      code
  field
  __typename
}

mutation UpdateMetadata($id: ID!, $input: [MetadataInput!]!, $keysToDelete: [String!]!) {
      updateMetadata(id: $id, input: $input) {
        errors: metadataErrors {
          ...MetadataErrorFragment
      __typename
    }
    __typename
  }
  deleteMetadata(id: $id, keys: $keysToDelete) {
        errors: metadataErrors {
          ...MetadataErrorFragment
      __typename
    }
    item {
          ...MetadataFragment
      ... on Node {
            id
        __typename
      }
      __typename
    }
    __typename
  }
}
`
export const CREATE_DIAMOND_PRICE = gql`
mutation setDiamondPrice($diamondRate:JSONString!){
  setMetalRates(input:{
    diamondRate:$diamondRate
  }){
    metalRates{
      diamondRate
    }
  }
}`
export const CREATE_GEMSTONE_PRICE = gql`
mutation setOtherGemsotnPrice($otherGemstoneRate:JSONString!){
  setMetalRates(input:{
    otherGemstoneRate:$otherGemstoneRate
  }){
    metalRates{
      otherGemstoneRate
    }
  }
}`

export const CREATE_EMPTY_ORDER = gql`
fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation OrderDraftCreate {
  draftOrderCreate(input: {}) {
    errors: orderErrors {
      ...OrderErrorFragment
      __typename
    }
    order {
      id
      __typename
    }
    __typename
  }
}
`

export const UPDATE_ORDER_USER = gql`
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

fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation OrderDraftUpdate($id: ID!, $input: DraftOrderInput!) {
  draftOrderUpdate(id: $id, input: $input) {
    errors: orderErrors {
      ...OrderErrorFragment
      __typename
    }
    order {
      ...OrderDetailsFragment
      __typename
    }
    __typename
  }
}
`
export const ORDER_LINE_ADD = gql`
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

fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation OrderLinesAdd($id: ID!, $input: [OrderLineCreateInput]!) {
  draftOrderLinesCreate(id: $id, input: $input) {
    errors: orderErrors {
      ...OrderErrorFragment
      __typename
    }
    order {
      ...OrderDetailsFragment
      __typename
    }
    __typename
  }
}
`

export const ORDER_LINE_UPDATE = gql`
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

fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation OrderLineUpdate($id: ID!, $input: OrderLineInput!) {
  draftOrderLineUpdate(id: $id, input: $input) {
    errors: orderErrors {
      ...OrderErrorFragment
      __typename
    }
    order {
      ...OrderDetailsFragment
      __typename
    }
    __typename
  }
}
`
export const ORDER_LINE_DELETE = gql`
mutation draftOrderLineDelete($id: ID!){
  draftOrderLineDelete(id: $id){
    orderLine{
      id
      productName
    }
    orderErrors{
      field
      message
      code
    }
  }
}`
export const FINALISE_ORDER = gql`fragment AddressFragment on Address {
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

fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation OrderDraftFinalize($id: ID!) {
  draftOrderComplete(id: $id) {
    errors: orderErrors {
      ...OrderErrorFragment
      __typename
    }
    order {
      ...OrderDetailsFragment
      __typename
    }
    __typename
  }
}
`

export const SET_METAL_RATES = gql`
mutation setMetalRates(
  $gold24kPremium: Float!
) {
  setMetalRates(
    input: {
      gold24kPremium: $gold24kPremium
    }
  ) {
    metalRates {
      id
      name
      updatedAt
      gold24kPremium
}
}
}`

export const FULFILL_ORDER = gql`
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

fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation FulfillOrder($orderId: ID!, $input: OrderFulfillInput!) {
  orderFulfill(order: $orderId, input: $input) {
    errors: orderErrors {
      ...OrderErrorFragment
      warehouse
      orderLine
      __typename
    }
    order {
      ...OrderDetailsFragment
      __typename
    }
    __typename
  }
}
`
export const MARK_ORDER_PAID = gql`
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

fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation OrderMarkAsPaid($id: ID!) {
  orderMarkAsPaid(id: $id) {
    errors: orderErrors {
      ...OrderErrorFragment
      __typename
    }
    order {
      ...OrderDetailsFragment
      __typename
    }
    __typename
  }
}
`




export const CANCEL_FULFILLED_ORDER = gql`
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

fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation OrderFulfillmentCancel($id: ID!, $input: FulfillmentCancelInput!) {
  orderFulfillmentCancel(id: $id, input: $input) {
    errors: orderErrors {
      ...OrderErrorFragment
      __typename
    }
    order {
      ...OrderDetailsFragment
      __typename
    }
    __typename
  }
}

`

export const TRANSACTION_UPDATE = gql`
mutation OrderTransactionCreate($orderId:ID!,$transactionProof:Upload!,$transactionMode:String!,$notes:String){
  createOrderTransaction(input:{
    orderId:$orderId
    transactionProof:$transactionProof
    transactionMode:$transactionMode
    notes:$notes
  }){
    orderTransactionHistory{
      id
    }
    error
  }
}
`

export const CANCE_REGULAR_ORDER = gql`fragment AddressFragment on Address {
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

fragment OrderErrorFragment on OrderError {
  code
  field
  __typename
}

mutation OrderCancel($id: ID!) {
  orderCancel(id: $id) {
    errors: orderErrors {
      ...OrderErrorFragment
      __typename
    }
    order {
      ...OrderDetailsFragment
      __typename
    }
    __typename
  }
}
`

export const CREATE_SUBCATEGORY_PRICING = gql`
mutation createCategoryPricing(
  $metalType: String!
  $category: ID!
  $subcategory: ID!
  $carat: Int!
  $hasDiamond: Boolean!
  $hasOtherGemstone: Boolean!
  $makingChargeMode: String!
  $makingCharge: Int!
  $wastageChargeMode: String!
  $wastageCharge: Int!
){
  categoryPricingCreate(input:{
      metalType: $metalType
      category: $category
      subcategory: $subcategory
      carat: $carat
      hasDiamond: $hasDiamond
      hasOtherGemstone: $hasOtherGemstone
      makingChargeMode: $makingChargeMode
      makingCharge: $makingCharge
      wastageChargeMode: $wastageChargeMode
      wastageCharge: $wastageCharge
  }){
    categoryPricing{
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
      createdBy {
        id
      }
      updatedAt
      updatedBy {
        id
      }
    }
    error
  }
}
`

export const UPDATE_SUBCATEGORY_PRICING = gql`
mutation updateCatgoryPricing($categoryPricingId:ID!,$makingCharge:Int!,$wastageCharge:Int!){
  categoryPricingUpdate(input:{
    categoryPricingId:$categoryPricingId,
    makingCharge:$makingCharge,
    wastageCharge:$wastageCharge
  }){
    categoryPricing{
      id
      metalType
      category{
        id
        name
      }
      subcategory{
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
      __typename
    }
    error
  }
}
`

