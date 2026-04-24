exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      countriesDb:      process.env.COUNTRIES_DB,
      citiesDb:         process.env.CITIES_DB,
      cloudinaryCloud:  process.env.CLOUDINARY_CLOUD,
      cloudinaryPreset: process.env.CLOUDINARY_PRESET
    })
  };
};
