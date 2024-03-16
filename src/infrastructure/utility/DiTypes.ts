export const Types = {
  ORDER_SERVICE: Symbol.for("ORDER_SERVICE"),
  ORDER_REPOSITORY: Symbol.for("ORDER_REPOSITORY"),
  ORDER_CONTROLLER: Symbol.for("ORDER_CONTROLLER"),

  PRODUCT_SERVICE: Symbol.for("PRODUCT_SERVICE"),
  PRODUCT_REPOSITORY: Symbol.for("PRODUCT_REPOSITORY"),
  PRODUCT_CONTROLLER: Symbol.for("PRODUCT_CONTROLLER"),

  ORDER_DETAIL_SERVICE: Symbol.for("ORDER_DETAIL_SERVICE"),
  ORDER_DETAIL_REPOSITORY: Symbol.for("ORDER_DETAIL_REPOSITORY"),
  ORDER_DETAIL_CONTROLLER: Symbol.for("ORDER_DETAIL_CONTROLLER"),

  CUSTOMER_SERVICE: Symbol.for("CUSTOMER_SERVICE"),
  CUSTOMER_REPOSITORY: Symbol.for("CUSTOMER_REPOSITORY"),
  CUSTOMER_CONTROLLER: Symbol.for("CUSTOMER_CONTROLLER"),

  ORDER_AGGREGATE_SERVICE: Symbol.for("ORDER_AGGREGATE_SERVICE"),

  EVENT_EMITTER_SERVICE: Symbol.for("EVENT_EMITTER_SERVICE"),
};
