import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type Blob = Storage.ExternalBlob;

  type InventoryItem = {
    id : Text;
    photo : ?Blob;
    description : Text;
    category : Text;
    stockCurrent : Nat;
    stockMin : Nat;
    costUsd : Float;
    sellRetailUsd : Float;
    sellWholesaleUsd : Float;
    sellSpecialUsd : Float;
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

  let inventoryItems = Map.empty<Text, InventoryItem>();
  let exchangeRates = List.empty<ExchangeRate>();
  let customers = Map.empty<Text, Customer>();

  module InventoryItem {
    public func compare(item1 : InventoryItem, item2 : InventoryItem) : Order.Order {
      Text.compare(item1.id, item2.id);
    };
  };

  public shared ({ caller }) func createInventoryItem(
    id : Text,
    photo : ?Blob,
    description : Text,
    category : Text,
    stockCurrent : Nat,
    stockMin : Nat,
    costUsd : Float,
    sellRetailUsd : Float,
    sellWholesaleUsd : Float,
    sellSpecialUsd : Float,
  ) : async InventoryItem {
    if (inventoryItems.containsKey(id)) {
      Runtime.trap("Item already exists for " # id);
    };

    let item : InventoryItem = {
      id;
      photo;
      description;
      category;
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

  public query ({ caller }) func getInventoryItem(id : Text) : async InventoryItem {
    switch (inventoryItems.get(id)) {
      case (null) { Runtime.trap("Item does not exist for " # id) };
      case (?item) { item };
    };
  };

  public query ({ caller }) func listInventory() : async [InventoryItem] {
    inventoryItems.values().toArray().sort();
  };

  public shared ({ caller }) func addExchangeRate(bcvVesPerUsd : Float, copPerUsd : Float) : async () {
    let rate : ExchangeRate = {
      date = Time.now();
      bcvVesPerUsd;
      copPerUsd;
    };
    exchangeRates.add(rate);
  };

  public query ({ caller }) func getLatestExchangeRate() : async ExchangeRate {
    switch (exchangeRates.last()) {
      case (null) { Runtime.trap("No exchange rates available") };
      case (?rate) { rate };
    };
  };

  public query ({ caller }) func listExchangeRates() : async [ExchangeRate] {
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
    switch (customers.get(id)) {
      case (null) { Runtime.trap("Customer does not exist for " # id) };
      case (?customer) { customer };
    };
  };

  public query ({ caller }) func listCustomers() : async [Customer] {
    customers.values().toArray().sort();
  };

  public query ({ caller }) func searchProducts(searchQuery : Text) : async [InventoryItem] {
    inventoryItems.values().toArray().filter(
      func(item) { item.description.contains(#text searchQuery) or item.category.contains(#text searchQuery) }
    );
  };

  public shared ({ caller }) func convertPriceToVes(usd : Float) : async Float {
    let latestRate = await getLatestExchangeRate();
    usd * latestRate.bcvVesPerUsd;
  };

  public shared ({ caller }) func convertPriceToCop(usd : Float) : async Float {
    let latestRate = await getLatestExchangeRate();
    usd * latestRate.copPerUsd;
  };
};
