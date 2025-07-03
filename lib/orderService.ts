// lib/orderService.ts
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

// Lazy initializer for WooCommerce API client
function getWooClient() {
  const storeUrl =
    process.env.WC_STORE_URL ||
    process.env.NEXT_PUBLIC_WC_STORE_URL ||
    process.env.NEXT_PUBLIC_WC_API_URL;
  const consumerKey =
    process.env.WC_CONSUMER_KEY;
   // process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const consumerSecret =
    process.env.WC_CONSUMER_SECRET;
  //  process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  // Debug logging
  console.log('🐛 [WooClient] storeUrl:', storeUrl);
  console.log('🐛 [WooClient] consumerKey:', consumerKey);
  console.log('🐛 [WooClient] consumerSecret:', consumerSecret);

  if (!storeUrl || !consumerKey || !consumerSecret) {
    throw new Error(
      `Missing WooCommerce config: storeUrl=${storeUrl}, consumerKey=${consumerKey}, consumerSecret=${consumerSecret}`
    );
  }

  return new WooCommerceRestApi({
    url:           storeUrl,
    consumerKey,
    consumerSecret,
    version:       'wc/v3',
  });
}

// Create a new WooCommerce order
export async function createWooOrder(payload: any) {
  const api = getWooClient();
  const { data } = await api.post('orders', payload);
  return data;
}

// Update an existing WooCommerce order
export async function updateWooOrder(id: number, payload: any) {
  const api = getWooClient();
  const { data } = await api.put(`orders/${id}`, payload);
  return data;
}

// List recent WooCommerce orders
export async function listWooOrders() {
  const api = getWooClient();
  const { data } = await api.get('orders', {
    per_page: 20,
    order:    'desc',
    orderby:  'date',
  });
  return data;
}

// Fetch a single WooCommerce order by ID
export async function getWooOrder(id: number) {
  const api = getWooClient();
  const { data } = await api.get(`orders/${id}`);
  return data;
}
