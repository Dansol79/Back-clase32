const {faker} = require('@faker-js/faker');
faker.locale = 'es';

const products = [];

for(let i = 0; i < 5; i++) {
    products.push({
        id: i,
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.lorem.paragraph(),
        image: faker.image.imageUrl(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
    });
}

module.exports = {products};