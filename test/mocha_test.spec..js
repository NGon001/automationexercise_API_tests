const axios = require('axios');
const { expect } = require('chai');
const { z } = require('zod');
//const { Account } = require('../Helper/helper_class');

const methods = ["POST", "PUT", "DELETE"]; // HTTP methods to test

describe('API Tests', () => {
    it('Get Products List - Valid Request', async () => {
        const response = await axios.get('https://automationexercise.com/api/productsList');
        const responseBody = response.data;

        expect(response.status).to.equal(200);

        const schema = z.object({
            responseCode: z.literal(200),
            products: z.array(
                z.object({
                    id: z.number().int(),
                    name: z.string(),
                    price: z.string(),
                    brand: z.string(),
                    category: z.object({
                        usertype: z.object({
                            usertype: z.string(),
                        }),
                        category: z.string(),
                    }),
                })
            ),
        });

        expect(() => {
            schema.parse(responseBody);
        }).not.to.throw();
    });

    it('Post, PUT, DELETE Product List - Invalid Request', async () => {
        for (const method of methods) {
            const response = await axios({
                method,
                url: 'https://automationexercise.com/api/productsList',
                data: {
                    id: 1,
                    name: "Product 1",
                    price: "100",
                    brand: "Brand A",
                    category: {
                        usertype: {
                            usertype: "User Type A",
                        },
                        category: "Category A",
                    },
                },
            });
            const responseBody = response.data;

            expect(response.status).to.equal(200);

            const schema = z.object({
                responseCode: z.literal(405),
                message: z.literal("This request method is not supported."),
            });

            expect(() => {
                schema.parse(responseBody);
            }).not.to.throw();
        }
    });

    it('Get All Brands List - Valid Request', async () => {
        const response = await axios.get('https://automationexercise.com/api/brandsList');
        const responseBody = response.data;

        expect(response.status).to.equal(200);

        const schema = z.object({
            responseCode: z.literal(200),
            brands: z.array(
                z.object({
                    id: z.number().int(),
                    brand: z.string(),
                })
            ),
        });

        expect(() => {
            schema.parse(responseBody);
        }).not.to.throw();
    });

    it('Post, PUT, DELETE Brands List - Invalid Request', async () => {
        for (const method of methods) {
            const response = await axios({
                method,
                url: 'https://automationexercise.com/api/brandsList',
                data: {
                    id: 1,
                    brand: "Brand A",
                },
            });
            const responseBody = response.data;

            expect(response.status).to.equal(200);

            const schema = z.object({
                responseCode: z.literal(405),
                message: z.literal("This request method is not supported."),
            });

            expect(() => {
                schema.parse(responseBody);
            }).not.to.throw();
        }
    });
  
    it('POST To Search Product - Invalid Request', async () => {
        const response = await axios.post('https://automationexercise.com/api/searchProduct', {});
        const responseBody = response.data;

        expect(response.status).to.equal(200);

        const schema = z.object({
            responseCode: z.literal(400),
            message: z.literal("Bad request, search_product parameter is missing in POST request."),
        });

        expect(() => {
            schema.parse(responseBody);
        }).not.to.throw();
    });

    it('PUT To Search Product - Invalid Request', async () => {
        const response = await axios.put('https://automationexercise.com/api/searchProduct', {
            search_product: 'tshirt',
        });
        const responseBody = response.data;

        expect(response.status).to.equal(200);

        const schema = z.object({
            responseCode: z.literal(405),
            message: z.literal("This request method is not supported."),
        });

        expect(() => {
            schema.parse(responseBody);
        }).not.to.throw();
    });
});