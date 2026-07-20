import { UtilityBill, Appliance } from "./types";

export const DEFAULT_BILL_DATA: UtilityBill[] = [
  { id: "bill_1", month: "Jan", electricityKwh: 340, electricityCost: 85, gasTherm: 42, gasCost: 55 },
  { id: "bill_2", month: "Feb", electricityKwh: 310, electricityCost: 78, gasTherm: 38, gasCost: 50 },
  { id: "bill_3", month: "Mar", electricityKwh: 290, electricityCost: 72, gasTherm: 25, gasCost: 35 },
  { id: "bill_4", month: "Apr", electricityKwh: 320, electricityCost: 80, gasTherm: 15, gasCost: 20 },
  { id: "bill_5", month: "May", electricityKwh: 450, electricityCost: 112, gasTherm: 8, gasCost: 12 },
  { id: "bill_6", month: "Jun", electricityKwh: 590, electricityCost: 148, gasTherm: 5, gasCost: 8 },
  { id: "bill_7", month: "Jul", electricityKwh: 680, electricityCost: 170, gasTherm: 4, gasCost: 6 }
];

export const DEFAULT_APPLIANCES: Appliance[] = [
  { id: "app_1", name: "Refrigerator & Freezer (Energy Star)", powerWatts: 150, hoursPerDay: 24, count: 1 },
  { id: "app_2", name: "Central Air Conditioner (1.5 Ton)", powerWatts: 2200, hoursPerDay: 5, count: 1 },
  { id: "app_3", name: "Smart TV (55 inch LED)", powerWatts: 110, hoursPerDay: 4, count: 2 },
  { id: "app_4", name: "Incandescent Lighting (Living & Bed)", powerWatts: 300, hoursPerDay: 6, count: 1 },
  { id: "app_5", name: "Laptop & Workstations", powerWatts: 90, hoursPerDay: 8, count: 2 },
  { id: "app_6", name: "Microwave Oven", powerWatts: 1200, hoursPerDay: 0.5, count: 1 }
];

export const SAMPLE_NAMES = [
  "John Doe", "Jane Smith", "Alice Johnson", "Robert Williams"
];

export const SAMPLE_ADDRESSES = [
  "Apartment 4B, 742 Evergreen Terrace, Springfield",
  "Suite 102, 221B Baker Street, London",
  "Penthouse A, 120 E Delaware Place, Chicago",
  "Flat 3, 42 Wallaby Way, Sydney"
];

export const SAMPLE_ACCOUNTS = [
  "ELEC-9824-1029-A",
  "GAS-4491-8812-G",
  "UTIL-7731-5092-X",
  "PWR-2194-6721-P"
];
