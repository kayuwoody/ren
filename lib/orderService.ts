// 1. lib/orderService.ts import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

// Initialize the WooCommerce REST client
const api = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: 'wc/v3',
});

/**
 * Create a new WooCommerce order
 */
export async function createWooOrder(payload: any) {
  const { data } = await api.post('orders', payload);
  return data;
}

/**
 * Update an existing WooCommerce order by ID
 */
export async function updateWooOrder(id: number | string, payload: any) {
  const endpoint = `orders/${id}`;
  const { data } = await api.put(endpoint, payload);
  return data;
}

/**
 * Find a processing order for a specific clientId
 */
export async function findProcessingOrder(clientId: string) {
  const { data } = await api.get('orders', {
    status: 'processing',
    meta_key: 'clientId',
    meta_value: clientId,
    per_page: 1,
  });
  return Array.isArray(data) ? data[0] || null : null;
}

/**
 * List all WooCommerce orders (up to 100)
 */
export async function listWooOrders() {
  const { data } = await api.get('orders', { per_page: 100 });
  return data;
}

/**
 * Get a single WooCommerce order by ID
 */
export async function getWooOrder(id: number | string) {
  const endpoint = `orders/${id}`;
  const { data } = await api.get(endpoint);
  return data;
}
