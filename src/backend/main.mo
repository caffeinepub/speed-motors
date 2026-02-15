import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Actor
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  type Blob = Storage.ExternalBlob;

  // Data Types
  type InventoryItem = {
    id : Text;
    photo : ?Blob;
    description : Text;
    category : Text;
    profitMarginPercent : Float;
    stockCurrent : Nat;
    stockMin : Nat;
    costUsd : Float;
    sellRetailUsd : Float;
    sellWholesaleUsd : Float;
    sellSpecialUsd : Float;
  };

  type UpdateInventoryItemPayload = {
    description : ?Text;
    category : ?Text;
    profitMarginPercent : ?Float;
    stockCurrent : ?Nat;
    stockMin : ?Nat;
    costUsd : ?Float;
    sellRetailUsd : ?Float;
    sellWholesaleUsd : ?Float;
    sellSpecialUsd : ?Float;
    photo : ?Blob;
  };

  type Sale = {
    id : Text;
    customerName : Text;
    itemsSold : [InventoryItem];
    totalAmountUsd : Float;
    saleTimestamp : Time.Time;
    isCreditSale : Bool;
    dueDate : ?Time.Time;
  };

  type ExchangeRate = {
    date : Time.Time;
    bcvVesPerUsd : Float;
    copPerUsd : Float;
  };

  type Customer = {
    id : Text;
    name : Text;
    contactInfo : Text;
    debtUsd : Float;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  public type SearchEvent = {
    searchTerm : Text;
    timestamp : Time.Time;
  };

  // Data Stores
  let inventoryItems = Map.empty<Text, InventoryItem>();
  let sales = Map.empty<Text, Sale>();
  let exchangeRates = List.empty<ExchangeRate>();
  let customers = Map.empty<Text, Customer>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let searchEvents = List.empty<SearchEvent>();

  module InventoryItem {
    public func compare(item1 : InventoryItem, item2 : InventoryItem) : Order.Order {
      Text.compare(item1.id, item2.id);
    };
  };

  module Sale {
    public func compare(sale1 : Sale, sale2 : Sale) : Order.Order {
      Text.compare(sale1.id, sale2.id);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Inventory Management - Admin only for modifications
  public shared ({ caller }) func createInventoryItem(
    id : Text,
    photo : ?Blob,
    description : Text,
    category : Text,
    profitMarginPercent : Float,
    stockCurrent : Nat,
    stockMin : Nat,
    costUsd : Float,
    sellRetailUsd : Float,
    sellWholesaleUsd : Float,
    sellSpecialUsd : Float,
  ) : async InventoryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create inventory items");
    };

    if (inventoryItems.containsKey(id)) {
      Runtime.trap("Item already exists for " # id);
    };

    let item : InventoryItem = {
      id;
      photo;
      description;
      category;
      profitMarginPercent;
      stockCurrent;
      stockMin;
      costUsd;
      sellRetailUsd;
      sellWholesaleUsd;
      sellSpecialUsd;
    };

    inventoryItems.add(id, item);
    item;
  };

  public shared ({ caller }) func updateInventoryItem(
    id : Text,
    payload : UpdateInventoryItemPayload,
  ) : async InventoryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update inventory items");
    };

    switch (inventoryItems.get(id)) {
      case (null) { Runtime.trap("Item does not exist for " # id) };
      case (?existingItem) {
        let updatedItem : InventoryItem = {
          id = existingItem.id;
          description = switch (payload.description) {
            case (null) { existingItem.description };
            case (?desc) { desc };
          };
          category = switch (payload.category) {
            case (null) { existingItem.category };
            case (?cat) { cat };
          };
          profitMarginPercent = switch (payload.profitMarginPercent) {
            case (null) { existingItem.profitMarginPercent };
            case (?margin) { margin };
          };
          stockCurrent = switch (payload.stockCurrent) {
            case (null) { existingItem.stockCurrent };
            case (?stock) { stock };
          };
          stockMin = switch (payload.stockMin) {
            case (null) { existingItem.stockMin };
            case (?stockMin) { stockMin };
          };
          costUsd = switch (payload.costUsd) {
            case (null) { existingItem.costUsd };
            case (?costUsd) { costUsd };
          };
          sellRetailUsd = switch (payload.sellRetailUsd) {
            case (null) { existingItem.sellRetailUsd };
            case (?retail) { retail };
          };
          sellWholesaleUsd = switch (payload.sellWholesaleUsd) {
            case (null) { existingItem.sellWholesaleUsd };
            case (?wholesale) { wholesale };
          };
          sellSpecialUsd = switch (payload.sellSpecialUsd) {
            case (null) { existingItem.sellSpecialUsd };
            case (?special) { special };
          };
          photo = switch (payload.photo) {
            case (null) { existingItem.photo };
            case (?photo) { ?photo };
          };
        };

        inventoryItems.add(id, updatedItem);
        updatedItem;
      };
    };
  };

  public query ({ caller }) func getInventoryItem(id : Text) : async InventoryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory items");
    };

    switch (inventoryItems.get(id)) {
      case (null) { Runtime.trap("Item does not exist for " # id) };
      case (?item) { item };
    };
  };

  public query ({ caller }) func listInventory() : async [InventoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list inventory");
    };

    inventoryItems.values().toArray();
  };

  // Exchange Rate Management - Admin only for modifications
  public shared ({ caller }) func addExchangeRate(bcvVesPerUsd : Float, copPerUsd : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exchange rates");
    };

    let rate : ExchangeRate = {
      date = Time.now();
      bcvVesPerUsd;
      copPerUsd;
    };
    exchangeRates.add(rate);
  };

  public query ({ caller }) func getLatestExchangeRate() : async ExchangeRate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view exchange rates");
    };

    switch (exchangeRates.last()) {
      case (null) { Runtime.trap("No exchange rates available") };
      case (?rate) { rate };
    };
  };

  public query ({ caller }) func listExchangeRates() : async [ExchangeRate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list exchange rates");
    };

    exchangeRates.toArray();
  };

  module Customer {
    public func compare(customer1 : Customer, customer2 : Customer) : Order.Order {
      Text.compare(customer1.id, customer2.id);
    };
  };

  // Customer Management - Admin only for modifications
  public shared ({ caller }) func createCustomer(
    id : Text,
    name : Text,
    contactInfo : Text,
  ) : async Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create customers");
    };

    if (customers.containsKey(id)) { Runtime.trap("Customer already exists for " # id) };
    let customer : Customer = {
      id;
      name;
      contactInfo;
      debtUsd = 0.0;
    };
    customers.add(id, customer);
    customer;
  };

  public query ({ caller }) func getCustomer(id : Text) : async Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customers");
    };

    switch (customers.get(id)) {
      case (null) { Runtime.trap("Customer does not exist for " # id) };
      case (?customer) { customer };
    };
  };

  public query ({ caller }) func listCustomers() : async [Customer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list customers");
    };

    customers.values().toArray();
  };

  // Search and Utility Functions - User level access
  public query ({ caller }) func searchProducts(searchQuery : Text) : async [InventoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search products");
    };

    inventoryItems.values().toArray().filter(
      func(item) {
        let hasDescription = item.description.contains(#text searchQuery);
        let hasCategory = item.category.contains(#text searchQuery);

        switch (item.description) {
          case ("") { hasCategory };
          case (_) { hasDescription or hasCategory };
        };
      }
    );
  };

  public shared ({ caller }) func convertPriceToVes(usd : Float) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can convert prices");
    };

    let latestRate = await getLatestExchangeRate();
    usd * latestRate.bcvVesPerUsd;
  };

  public shared ({ caller }) func convertPriceToCop(usd : Float) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can convert prices");
    };

    let latestRate = await getLatestExchangeRate();
    usd * latestRate.copPerUsd;
  };

  public shared ({ caller }) func addProfitMarginToCost(costUsd : Float, profitMarginPercent : Float) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can calculate profit margins");
    };

    let marginAmount = costUsd * (profitMarginPercent / 100.0);
    costUsd + marginAmount;
  };

  // Delinquency Tracking - User level access for viewing
  public query ({ caller }) func listDelinquentSales() : async [Sale] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view delinquent sales");
    };

    let currentTime = Time.now();
    sales.values().filter(
      func(sale) {
        if (sale.isCreditSale) {
          switch (sale.dueDate) {
            case (?dueDate) {
              currentTime > (dueDate + (15 * 24 * 60 * 60 * 1_000_000_000));
            };
            case (null) { true };
          };
        } else { false };
      }
    ).toArray();
  };

  public query ({ caller }) func hasDelinquentSales(delinquentSales : [Sale]) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check delinquent sales");
    };

    delinquentSales.size() > 0;
  };

  public query ({ caller }) func getCustomerDebts() : async [(Text, Float)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customer debts");
    };

    customers.toArray().map(
      func(entry) {
        let (customerId, customer) = entry;
        (customerId, customer.debtUsd);
      }
    );
  };

  public query ({ caller }) func findOverdueDelinquentSales(delinquentSales : [Sale]) : async [Sale] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can find overdue sales");
    };

    let currentTime = Time.now();

    delinquentSales.filter(
      func(sale) {
        switch (sale.dueDate) {
          case (null) { false };
          case (?dueDate) {
            currentTime > (dueDate + (15 * 24 * 60 * 60 * 1_000_000_000));
          };
        };
      }
    );
  };

  // New Functionality for Full Backend
  public type CashboxEntry = {
    id : Text;
    entryType : { #_in; #out };
    amountUsd : Float;
    currency : Text;
    timestamp : Time.Time;
    description : Text;
  };

  let cashboxEntries = Map.empty<Text, CashboxEntry>();

  public shared ({ caller }) func addCashboxEntry(
    id : Text,
    entryType : { #_in; #out },
    amountUsd : Float,
    currency : Text,
    description : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add cashbox entries");
    };

    if (cashboxEntries.containsKey(id)) { Runtime.trap("Cashbox entry already exists for " # id) };

    let cashboxEntry : CashboxEntry = {
      id;
      entryType;
      amountUsd;
      currency;
      timestamp = Time.now();
      description;
    };

    cashboxEntries.add(id, cashboxEntry);
  };

  public query ({ caller }) func listCashboxEntries() : async [CashboxEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cashbox entries");
    };

    cashboxEntries.values().toArray();
  };

  public query ({ caller }) func getCashboxTotals() : async { usd : Float; ves : Float; cop : Float } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cashbox totals");
    };

    let entries = cashboxEntries.values().toArray();

    var usdTotal : Float = 0.0;
    var vesTotal : Float = 0.0;
    var copTotal : Float = 0.0;

    for (entry in entries.values()) {
      switch (entry.currency) {
        case ("usd") { usdTotal += entry.amountUsd };
        case ("ves") { vesTotal += entry.amountUsd };
        case ("cop") { copTotal += entry.amountUsd };
        case (_) {};
      };
    };

    {
      usd = usdTotal;
      ves = vesTotal;
      cop = copTotal;
    };
  };

  public shared ({ caller }) func postSale(
    id : Text,
    customerName : Text,
    itemsSold : [InventoryItem],
    totalAmountUsd : Float,
    isCreditSale : Bool,
  ) : async () {
    // Allow regular users to post sales (not just admins)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post sales");
    };

    if (sales.containsKey(id)) { Runtime.trap("Sale already exists for " # id) };

    let sale : Sale = {
      id;
      customerName;
      itemsSold;
      totalAmountUsd;
      saleTimestamp = Time.now();
      isCreditSale;
      dueDate = if (isCreditSale) { ?Time.now() } else { null };
    };

    sales.add(id, sale);

    for (item in itemsSold.values()) {
      switch (inventoryItems.get(item.id)) {
        case (?existingItem) {
          let updatedStock =
            if (existingItem.stockCurrent > 0) {
              existingItem.stockCurrent - 1;
            } else { 0 };
          let updatedItem = {
            existingItem with
            stockCurrent = updatedStock;
          };
          inventoryItems.add(item.id, updatedItem);
        };
        case (_) {};
      };
    };

    if (not isCreditSale) {
      let cashboxEntry : CashboxEntry = {
        id = id # "-cashbox-in";
        entryType = #_in;
        amountUsd = totalAmountUsd;
        currency = "usd";
        timestamp = Time.now();
        description = "Sale " # id;
      };

      cashboxEntries.add(cashboxEntry.id, cashboxEntry);
    } else {
      // For credit sales, update customer debt
      // Find or create customer record
      let customerOpt = customers.values().toArray().find(func(c : Customer) : Bool { c.name == customerName });
      switch (customerOpt) {
        case (?customer) {
          let updatedCustomer = {
            customer with
            debtUsd = customer.debtUsd + totalAmountUsd;
          };
          customers.add(customer.id, updatedCustomer);
        };
        case (null) {
          // Customer doesn't exist, this should be handled by creating customer first
          // For now, we'll trap to enforce proper workflow
          Runtime.trap("Customer must be created before credit sale: " # customerName);
        };
      };
    };
  };

  // Internal function to update customer debt - admin only
  func updateCustomerDebtInternal(id : Text, amount : Float) {
    switch (customers.get(id)) {
      case (?existingCustomer) {
        let updatedCustomer = {
          existingCustomer with
          debtUsd = existingCustomer.debtUsd + amount;
        };
        customers.add(id, updatedCustomer);
      };
      case (null) { Runtime.trap("Customer does not exist for " # id) };
    };
  };

  // Public function for admin to manually adjust customer debt
  public shared ({ caller }) func adjustCustomerDebt(id : Text, amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can adjust customer debt");
    };
    updateCustomerDebtInternal(id, amount);
  };

  // Returns list of distinct categories from inventory
  public query ({ caller }) func getDistinctCategories() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get categories");
    };

    let categories = inventoryItems.values().toArray().map(func(item) { item.category });
    let uniqueCategories = Set.fromIter(categories.values()).toArray();
    uniqueCategories;
  };

  public query ({ caller }) func filterInventoryByCategory(category : Text) : async [InventoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can filter inventory by category");
    };

    inventoryItems.values().toArray().filter(func(item) { item.category == category });
  };

  // Returns current timestamp in nanoseconds
  public query ({ caller }) func getCurrentTimestamp() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get timestamp");
    };

    Time.now();
  };

  // Record search event
  public type RecordSearchEventPayload = {
    searchTerm : Text;
    timestamp : Time.Time;
  };

  public shared ({ caller }) func recordSearchEvent(_payload : RecordSearchEventPayload) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can record search events");
    };
    ();
  };

  public type TopSearchedProduct = {
    searchTerm : Text;
    searchCount : Nat;
  };

  public query ({ caller }) func getTopSearchedProducts(_count : Nat) : async [TopSearchedProduct] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get top searched products");
    };
    [];
  };

  public type TopSellingProduct = {
    productId : Text;
    salesCount : Nat;
    productDetails : InventoryItem;
  };

  public query ({ caller }) func getTopItemsSold(_count : Nat) : async [TopSellingProduct] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get top items sold");
    };
    [];
  };

  public type NetProfitEntry = {
    period : Text;
    netProfit : Float;
    profitMargin : Float;
  };

  public query ({ caller }) func aggregateNetProfitByInterval(_interval : Text) : async [NetProfitEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can aggregate net profit");
    };
    [];
  };
};
