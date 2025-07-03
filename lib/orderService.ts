// 1. lib/orderService.ts import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const api = new WooCommerceRestApi({ url: process.env.WC_STORE_URL, consumerKey: process.env.WC_CONSUMER_KEY, consumerSecret: process.env.WC_CONSUMER_SECRET, version: 'wc/v3', });
export async function createWooOrder(payload: any) { const { data } = await api.post('orders', payload); return data; }
export async function updateWooOrder(id: number, payload: any) { const { data } = await api.put(orders/${id}, payload); return data; }
export async function findProcessingOrder(clientId: string) { const { data } = await api.get('orders', { status: 'processing', meta_key: 'clientId', meta_value: clientId, per_page: 1, }); return data[0] || null; }
export async function listWooOrders() { const { data } = await api.get('orders', { per_page: 100 }); return data; }
export async function getWooOrder(id: number) { const { data } = await api.get(orders/${id}); return data; }
