import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";




actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Blob = Storage.ExternalBlob;

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

  type InventoryItemCreatePayload = {
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

  type Sale = {
    id : Text;
    customerName : Text;
    itemsSold : [InventoryItem];
    totalAmountUsd : Float;
    saleTimestamp : Time.Time;
    isCreditSale : Bool;
    dueDate : ?Time.Time;
  };

  type UpdateSalePayload = {
    customerName : ?Text;
    itemsSold : ?[InventoryItem];
    totalAmountUsd : ?Float;
    isCreditSale : ?Bool;
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

  // Supplier (Proveedor)
  public type Supplier = {
    id : Text;
    name : Text;
    contactInfo : Text;
    address : Text;
    createdAt : Time.Time;
  };

  public type CreateSupplierPayload = {
    id : Text;
    name : Text;
    contactInfo : Text;
    address : Text;
  };

  // Cashbox Closure (Cierre)
  public type Closure = {
    id : Text;
    openingBalanceUsd : Float;
    closingBalanceUsd : Float;
    totalIncomeUsd : Float;
    totalExpensesUsd : Float;
    cashboxEntries : [CashboxEntry];
    createdAt : Time.Time;
    createdBy : Text;
  };

  public type CreateClosurePayload = {
    id : Text;
    openingBalanceUsd : Float;
    closingBalanceUsd : Float;
    totalIncomeUsd : Float;
    totalExpensesUsd : Float;
    cashboxEntries : [CashboxEntry];
    createdBy : Text;
  };

  public type IntelligenceSearchResult = {
    #inventoryItem : InventoryItem;
    #sale : Sale;
    #customer : Customer;
    #supplier : Supplier;
  };

  let inventoryItems = Map.empty<Text, InventoryItem>();
  let sales = Map.empty<Text, Sale>();
  let exchangeRates = List.empty<ExchangeRate>();
  let customers = Map.empty<Text, Customer>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let searchEvents = List.empty<SearchEvent>();
  let suppliers = Map.empty<Text, Supplier>();
  let closures = Map.empty<Text, Closure>();

  // Store artifact URL as a Text value referencing the frontend-staged artifact
  let artifactUrl = "/artifacts/somosora_project.zip";

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

  func validateInventoryItemCreatePayload(payload : InventoryItemCreatePayload) {
    if (payload.id == "") { Runtime.trap("ID is required") };
    if (payload.description == "") { Runtime.trap("Description is required") };
    if (payload.category == "") { Runtime.trap("Category is required") };
    if (payload.stockCurrent < 0) { Runtime.trap("StockCurrent cannot be negative") };
    if (payload.stockMin < 0) { Runtime.trap("StockMin cannot be negative") };
    if (payload.costUsd < 0) { Runtime.trap("CostUsd cannot be negative") };
    if (payload.sellRetailUsd < 0) {
      Runtime.trap("SellRetailUsd cannot be negative");
    };
    if (payload.sellWholesaleUsd < 0) {
      Runtime.trap("SellWholesaleUsd cannot be negative");
    };
    if (payload.sellSpecialUsd < 0) {
      Runtime.trap("SellSpecialUsd cannot be negative");
    };
    if (payload.profitMarginPercent < 0) {
      Runtime.trap("ProfitMarginPercent cannot be negative");
    };
  };

  public shared ({ caller }) func createInventoryItem(payload : InventoryItemCreatePayload) : async InventoryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create inventory items");
    };

    validateInventoryItemCreatePayload(payload);

    if (inventoryItems.containsKey(payload.id)) {
      Runtime.trap("Item already exists for " # payload.id);
    };

    let item : InventoryItem = {
      id = payload.id;
      photo = payload.photo;
      description = payload.description;
      category = payload.category;
      profitMarginPercent = payload.profitMarginPercent;
      stockCurrent = payload.stockCurrent;
      stockMin = payload.stockMin;
      costUsd = payload.costUsd;
      sellRetailUsd = payload.sellRetailUsd;
      sellWholesaleUsd = payload.sellWholesaleUsd;
      sellSpecialUsd = payload.sellSpecialUsd;
    };

    inventoryItems.add(payload.id, item);
    item;
  };

  public shared ({ caller }) func updateInventoryItem(id : Text, payload : UpdateInventoryItemPayload) : async InventoryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update inventory items");
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

  public shared ({ caller }) func addExchangeRate(bcvVesPerUsd : Float, copPerUsd : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add exchange rates");
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

  public shared ({ caller }) func createCustomer(
    id : Text,
    name : Text,
    contactInfo : Text,
  ) : async Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create customers");
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

  public shared ({ caller }) func modifyCustomer(
    id : Text,
    name : Text,
    contactInfo : Text,
    debtUsd : Float,
  ) : async Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify customers");
    };

    switch (customers.get(id)) {
      case (null) { Runtime.trap("Customer does not exist for " # id) };
      case (_existingCustomer) {
        let modifiedCustomer : Customer = {
          id;
          name;
          contactInfo;
          debtUsd;
        };
        customers.add(id, modifiedCustomer);
        modifiedCustomer;
      };
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manually add cashbox entries");
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
          Runtime.trap("Customer must be created before credit sale: " # customerName);
        };
      };
    };
  };

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

  public shared ({ caller }) func adjustCustomerDebt(id : Text, amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can adjust customer debt");
    };
    updateCustomerDebtInternal(id, amount);
  };

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

  public query ({ caller }) func getCurrentTimestamp() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get timestamp");
    };

    Time.now();
  };

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

  public shared ({ caller }) func createSupplier(payload : CreateSupplierPayload) : async Supplier {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage suppliers");
    };

    if (suppliers.containsKey(payload.id)) {
      Runtime.trap("Supplier already exists for " # payload.id);
    };

    let supplier : Supplier = {
      id = payload.id;
      name = payload.name;
      contactInfo = payload.contactInfo;
      address = payload.address;
      createdAt = Time.now();
    };

    suppliers.add(payload.id, supplier);
    supplier;
  };

  public shared ({ caller }) func modifySupplier(
    id : Text,
    name : Text,
    contactInfo : Text,
    address : Text,
  ) : async Supplier {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify suppliers");
    };

    switch (suppliers.get(id)) {
      case (null) { Runtime.trap("Supplier does not exist for " # id) };
      case (_existingSupplier) {
        let modifiedSupplier : Supplier = {
          id;
          name;
          contactInfo;
          address;
          createdAt = Time.now();
        };
        suppliers.add(id, modifiedSupplier);
        modifiedSupplier;
      };
    };
  };

  public query ({ caller }) func listSuppliers() : async [Supplier] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list suppliers");
    };

    suppliers.values().toArray();
  };

  public shared ({ caller }) func createClosure(payload : CreateClosurePayload) : async Closure {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create closures");
    };

    if (closures.containsKey(payload.id)) {
      Runtime.trap("Closure already exists for " # payload.id);
    };

    let closure : Closure = {
      id = payload.id;
      openingBalanceUsd = payload.openingBalanceUsd;
      closingBalanceUsd = payload.closingBalanceUsd;
      totalIncomeUsd = payload.totalIncomeUsd;
      totalExpensesUsd = payload.totalExpensesUsd;
      cashboxEntries = payload.cashboxEntries;
      createdAt = Time.now();
      createdBy = payload.createdBy;
    };

    closures.add(payload.id, closure);
    closure;
  };

  public query ({ caller }) func listClosures() : async [Closure] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list closures");
    };

    closures.values().toArray();
  };

  // Returns a list of URLs to all artifact zip files.
  public shared ({ caller }) func getBuildArtifactsZipUrls() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access build artifacts");
    };
    [artifactUrl];
  };

  public shared ({ caller }) func modifySale(id : Text, payload : UpdateSalePayload) : async Sale {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify sales");
    };

    switch (sales.get(id)) {
      case (null) { Runtime.trap("Sale does not exist for " # id) };
      case (?existingSale) {
        let updatedSale : Sale = {
          id = existingSale.id;
          customerName = switch (payload.customerName) {
            case (null) { existingSale.customerName };
            case (?name) { name };
          };
          itemsSold = switch (payload.itemsSold) {
            case (null) { existingSale.itemsSold };
            case (?items) { items };
          };
          totalAmountUsd = switch (payload.totalAmountUsd) {
            case (null) { existingSale.totalAmountUsd };
            case (?amount) { amount };
          };
          saleTimestamp = existingSale.saleTimestamp;
          isCreditSale = switch (payload.isCreditSale) {
            case (null) { existingSale.isCreditSale };
            case (?creditSale) { creditSale };
          };
          dueDate = switch (payload.dueDate) {
            case (null) { existingSale.dueDate };
            case (?due) { ?due };
          };
        };

        sales.add(id, updatedSale);
        updatedSale;
      };
    };
  };

  public query ({ caller }) func intelligenceSearch(searchTerm : Text) : async [IntelligenceSearchResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform intelligent searches");
    };

    let inventoryResults = inventoryItems.values().toArray().filter(
      func(item) {
        item.description.contains(#text searchTerm);
      }
    ).map(
      func(item) {
        #inventoryItem(item);
      }
    );

    let saleResults = sales.values().toArray().filter(
      func(sale) {
        sale.customerName.contains(#text searchTerm);
      }
    ).map(
      func(sale) {
        #sale(sale);
      }
    );

    let customerResults = customers.values().toArray().filter(
      func(customer) {
        customer.name.contains(#text searchTerm);
      }
    ).map(
      func(customer) {
        #customer(customer);
      }
    );

    let supplierResults = suppliers.values().toArray().filter(
      func(supplier) {
        supplier.name.contains(#text searchTerm);
      }
    ).map(
      func(supplier) {
        #supplier(supplier);
      }
    );

    intelligenceSearchResultsToArray(inventoryResults, saleResults, customerResults, supplierResults);
  };

  func intelligenceSearchResultsToArray(
    inventory : [IntelligenceSearchResult],
    sales : [IntelligenceSearchResult],
    customers : [IntelligenceSearchResult],
    suppliers : [IntelligenceSearchResult],
  ) : [IntelligenceSearchResult] {
    let inventoryIter = inventory.values();
    let salesIter = sales.values();
    let customersIter = customers.values();
    let suppliersIter = suppliers.values();
    let iterArray = List.empty<IntelligenceSearchResult>();
    iterArray.addAll(inventoryIter);
    iterArray.addAll(salesIter);
    iterArray.addAll(customersIter);
    iterArray.addAll(suppliersIter);
    iterArray.toArray();
  };
};

