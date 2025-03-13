
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
}
