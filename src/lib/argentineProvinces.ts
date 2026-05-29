const ARGENTINE_PROVINCES_NAMES = [
	"Buenos Aires",
	"Capital Federal",
	"Catamarca",
	"Chaco",
	"Chubut",
	"Cordoba",
	"Corrientes",
	"Entre Rios",
	"Formosa",
	"Jujuy",
	"La Pampa",
	"La Rioja",
	"Mendoza",
	"Misiones",
	"Neuquen",
	"Rio Negro",
	"Salta",
	"San Juan",
	"San Luis",
	"Santa Cruz",
	"Santa Fe",
	"Santiago del Estero",
	"Tierra del Fuego",
	"Tucuman"
]

export const ARGENTINE_PROVINCES = ARGENTINE_PROVINCES_NAMES.map(name => ({
	value: name, label: name,
}))