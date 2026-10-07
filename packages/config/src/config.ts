export type MapProvider = 'google' | 'leaflet';

export interface BankDetails {
	alias: string;
	number: string;
	name: string;
	bankName: string;
}

export interface ViewConfig {
	pageWidth: string;
	theme: string;
}

export interface AppConfig {
	imagesBaseUrl: string;
	mapProvider: MapProvider;
	googleMapsApiKey: string;
	currency: string;
	bank: BankDetails;
	view: ViewConfig;
}
