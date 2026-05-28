export interface Product {
	id: string;
	name: string;
	price: number;
	category: string;
	emoji: string;
	emojis?: string[];
	rating: number;
	description: string;
}

export const products: Product[] = [
	{
		id: '1',
		name: 'Wireless Headphones',
		price: 79.99,
		category: 'electronics',
		emoji: '🎧',
		emojis: ['🎧', '🎵', '🔊'],
		rating: 4.5,
		description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.'
	},
	{
		id: '2',
		name: 'Coffee Maker',
		price: 49.99,
		category: 'appliances',
		emoji: '☕',
		emojis: ['☕', '🍵', '🫖'],
		rating: 4.2,
		description: 'Programmable coffee maker with thermal carafe. Makes up to 12 cups with perfect brewing every time.'
	},
	{
		id: '3',
		name: 'Running Shoes',
		price: 89.99,
		category: 'sports',
		emoji: '👟',
		emojis: ['👟', '🏃', '⚡'],
		rating: 4.7,
		description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper for maximum comfort.'
	},
	{
		id: '4',
		name: 'Desk Lamp',
		price: 34.99,
		category: 'home',
		emoji: '💡',
		emojis: ['💡', '🌟', '✨'],
		rating: 4.3,
		description: 'LED desk lamp with adjustable brightness and color temperature. Perfect for work or study.'
	},
	{
		id: '5',
		name: 'Yoga Mat',
		price: 29.99,
		category: 'sports',
		emoji: '🧘',
		emojis: ['🧘', '🏋️', '💪'],
		rating: 4.6,
		description: 'Non-slip yoga mat with extra cushioning. Lightweight and easy to carry to your gym or studio.'
	},
	{
		id: '6',
		name: 'Bluetooth Speaker',
		price: 59.99,
		category: 'electronics',
		emoji: '🔊',
		emojis: ['🔊', '🎶', '📻'],
		rating: 4.4,
		description: 'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 12-hour battery life.'
	},
	{
		id: '7',
		name: 'Office Chair',
		price: 199.99,
		category: 'furniture',
		emoji: '🪑',
		emojis: ['🪑', '💼', '🖥️'],
		rating: 4.5,
		description: 'Ergonomic office chair with lumbar support, adjustable height, and breathable mesh back.'
	},
	{
		id: '8',
		name: 'Plant Pot',
		price: 24.99,
		category: 'home',
		emoji: '🪴',
		emojis: ['🪴', '🌱', '🌿'],
		rating: 4.2,
		description: 'Beautiful ceramic plant pot with drainage hole. Perfect for indoor plants and succulents.'
	},
	{
		id: '9',
		name: 'Smart Watch',
		price: 199.99,
		category: 'electronics',
		emoji: '⌚',
		emojis: ['⌚', '⏰', '📱'],
		rating: 4.6,
		description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and 7-day battery life.'
	},
	{
		id: '10',
		name: 'Water Bottle',
		price: 19.99,
		category: 'sports',
		emoji: '💧',
		emojis: ['💧', '💦', '🚰'],
		rating: 4.4,
		description: 'Insulated water bottle keeps drinks hot or cold for 24 hours. BPA-free and durable.'
	},
	{
		id: '11',
		name: 'Coffee Grinder',
		price: 39.99,
		category: 'appliances',
		emoji: '🌾',
		emojis: ['🌾', '☕', '⚙️'],
		rating: 4.3,
		description: 'Burr coffee grinder with 15 grind settings for perfect consistency every time.'
	},
	{
		id: '12',
		name: 'Mouse Pad',
		price: 14.99,
		category: 'electronics',
		emoji: '🖱️',
		emojis: ['🖱️', '⌨️', '🖥️'],
		rating: 4.1,
		description: 'Large gaming mouse pad with non-slip rubber base and smooth surface for precise movements.'
	}
];
