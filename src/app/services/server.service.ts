import { Injectable } from '@angular/core';
const stripe = require('stripe')('sk_test_51NOlofEg8nFeK6NCYFm9FST2EY3m3PbUkEXJgIOEdF8WJ44UtQtZtry1wCK1MIQrAQmiQWbp8zTYQSqWazh88al80091NAHBAc');
  // You probably have a database to keep track of preexisting customers.
  // But to keep things simple, we'll use an Object to store Stripe object IDs in this example.
  const CUSTOMERS = [{stripeId: "cus_OB8R9VwjnJYvZ2", email: "mkoromini94@gmail.com"}];
  // Prices on Stripe model the pricing scheme of your business.
  // Create Prices in the Dashboard or with the API before accepting payments
  // and store the IDs in your database.
  const PRICES = {basic: "price_1NOmJiEg8nFeK6NCP2qM9g4V", professional: "price_1NOmJiEg8nFeK6NCP2qM9g4V",
  nuevo: {
    "price": {
      "price": {
        "description": "total translado",
        "date": "1688157234",
        "period": {
          "end": "1688157234",
          "start": "1688157234"
        },
        "id": "nuev_1",
        "object": "invoiceitem",
        "currency": "mxn",
        "account_name": "SpeedPro",
        "account_country": "MX",
        "amount_due": "1090",
        "unit_amount": "1090",
        "customer": "cus_OB8R9VwjnJYvZ2",
        "unit_amount_decimal": "1090",
        "amount": "1090"
      },
      "invoice": "in_1NOoejEg8nFeK6NCOKwB2KXX",
      "customer": "cus_OB8R9VwjnJYvZ2"
    },
    "invoice": "in_1NOpu3Eg8nFeK6NC079Slq4r",
    "customer": "cus_OB8R9VwjnJYvZ2"
  }
};

  
@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor() { }
// This is your real test secret API key.
  
  sendInvoice = async function (email) {
    // Look up a customer in your database
    let customer:any = CUSTOMERS.find(c => c.email === email);
    let customerId;
    if (!customer) {
      // Create a new Customer
      customer = await stripe.customers.create({
        email,
        description: 'Customer to invoice',
      });
      // Store the Customer ID in your database to use for future purchases
      CUSTOMERS.push({stripeId: customer.id, email: email});
      customerId = customer.id;
    } else {
      // Read the Customer ID from your database
      customerId = customer.stripeId;
    }
  
    // Create an Invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: 30,
    });
  
    // Create an Invoice Item with the Price, and Customer you want to charge
    const invoiceItem = await stripe.invoiceItems.create({ 
      customer: customerId,
      price: PRICES.nuevo,
      invoice: invoice.id
    });
    console.log(PRICES.basic);
    
  
    console.log('aqui ');
    console.log(invoice);
    
    // Send the Invoice
    await stripe.invoices.sendInvoice(invoice.id);
  };
}
