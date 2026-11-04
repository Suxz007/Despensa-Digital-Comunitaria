// ============================================================================
// DATOS DE PRODUCTOS (IGUALES AL DISEÑO ORIGINAL)
// ============================================================================
const FEATURED_PRODUCTS = [
  {
    id: 101,
    name: 'Aguacates Orgánicos',
    category: 'Alimentos',
    price: '$ 12.000 / kg',
    unit: '/ kg',
    available: true,
    presentation: 'Malla por 1 kg',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    description: 'Aguacates frescos cultivados sin agroquímicos por familias productoras de la región amazónica del Caquetá.'
  },
  {
    id: 102,
    name: 'Bolso Tejido Coreguaje',
    category: 'Artesanías',
    price: '$ 45.000',
    unit: '/ Unidad',
    available: true,
    presentation: 'Tejido artesanal en fibra natural',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    description: 'Bolso elaborado a mano con fibras naturales de cumare por artesanos indígenas de la comunidad Coreguaje.'
  },
  {
    id: 103,
    name: 'Café Amazónico Especial',
    category: 'Alimentos',
    price: '$ 18.000',
    unit: '/ 500 g',
    available: true,
    presentation: 'Bolsa con válvula desgasificadora 500g',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    description: 'Café de origen amazónico cultivado bajo sombra en sistemas agroforestales sostenibles del piedemonte caqueteño.'
  },
  {
    id: 104,
    name: 'Miel de Abejas Silvestre',
    category: 'Agricultura',
    price: '$ 25.000',
    unit: '/ 500 ml',
    available: true,
    presentation: 'Frasco de Vidrio 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    description: 'Miel 100% natural, recolectada de manera artesanal por estudiantes del programa de Ingeniería Agroecológica en bosques nativos del Caquetá. No contiene aditivos ni conservantes artificiales. Envase de vidrio esterilizado.'
  }
];

const INITIAL_CATALOG_PRODUCTS = [
  {
    id: 1,
    name: 'Bananos de Seda Frescos',
    category: 'Alimentos',
    price: '$ 5.000 / Mano',
    unit: '/ Mano',
    available: true,
    presentation: 'Mano fresca (~1.5 kg)',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    description: 'Bananos de seda dulces cosechados en parcelas comunitarias de productores locales.'
  },
  {
    id: 2,
    name: 'Piña Golden Amazónica',
    category: 'Alimentos',
    price: '$ 7.000 / Un',
    unit: '/ Unidad',
    available: true,
    presentation: 'Unidad seleccionada',
    imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
    description: 'Piña jugosa y dulce cultivada en suelos amazónicos con manejo agroecológico.'
  },
  {
    id: 3,
    name: 'Pulpa de Açaí Congelada',
    category: 'Alimentos',
    price: '$ 15.000 / 500g',
    unit: '/ 500 g',
    available: true,
    presentation: 'Empaque 500g',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    description: 'Pulpa pura de açaí amazónico cosechado de manera sostenible en el Caquetá.'
  },
  {
    id: 4,
    name: 'Tomates Chonto Orgánicos',
    category: 'Alimentos',
    price: '$ 4.500 / kg',
    unit: '/ kg',
    available: true,
    presentation: 'Bolsa por 1 kg',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    description: 'Tomates frescos de huerta comunitaria universitaria, libres de pesticidas.'
  },
  {
    id: 5,
    name: 'Limón Pajarito Uniamazonia',
    category: 'Alimentos',
    price: '$ 3.000 / kg',
    unit: '/ kg',
    available: true,
    presentation: 'Malla por 1 kg',
    imageUrl: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80',
    description: 'Limón pajarito de alto jugo producido en granjas experimentales y parcelas campesinas.'
  },
  {
    id: 6,
    name: 'Huevos Semicriollos',
    category: 'Alimentos',
    price: '$ 16.000 / Panal',
    unit: '/ Panal x30',
    available: true,
    presentation: 'Panal de 30 unidades',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Huevos semicriollos de gallinas criadas en pastoreo libre en granjas locales.'
  },
  {
    id: 7,
    name: 'Queso Caqueteño Artesanal',
    category: 'Alimentos',
    price: '$ 14.000 / lb',
    unit: '/ Libra',
    available: true,
    presentation: 'Bloque de 500g empacado al vacío',
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
    description: 'Queso fresco con denominación de origen caqueteño elaborado por familias ganaderas sostenibles.'
  },
  {
    id: 8,
    name: 'Panela Pulverizada Orgánica',
    category: 'Agricultura',
    price: '$ 6.500 / kg',
    unit: '/ kg',
    available: true,
    presentation: 'Bolsa ecológica por 1 kg',
    imageUrl: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=800&q=80',
    description: 'Panela 100% natural libre de químicos, producida en trapiches comunitarios del piedemonte amazónico.'
  },
  ...FEATURED_PRODUCTS
];

const CATEGORIES = ['Alimentos', 'Agricultura', 'Artesanías'];

Object.assign(window, { FEATURED_PRODUCTS, INITIAL_CATALOG_PRODUCTS, CATEGORIES });
