//the API always returns 200 OK and puts error codes inside the body, that's not RESTful.

import { test, expect } from '@playwright/test';
import { z } from 'zod';
import { Account } from '../Helper/helper_class';
const methods = ["POST", "PUT", "DELETE"]; // HTTP methods to test

test('Get Products List - Valid Request', async ({ request }) => {
    const response = await request.get('/api/productsList');
    const responseBody = await response.json();
   // console.log(JSON.stringify(responseBody, null, 2));
    expect(response.status()).toBe(200);
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
    }).not.toThrow();
});

test("Post, PUT, DELETE Product List - Invalid Request", async ({ request }) => {
    for(const method of methods) {
        const response = await request.fetch("/api/productsList", {
            method,
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
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        const schema = z.object({
            responseCode: z.literal(405),
            message: z.literal("This request method is not supported."),
        });

        expect(() => {
            schema.parse(responseBody);
        }).not.toThrow();
    };  
});

test("Get All Brands List - Valid Request", async ({ request }) => {
    const response = await request.get("/api/brandsList");
    const responseBody = await response.json();
    expect(response.status()).toBe(200);

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
    }).not.toThrow();
});

test("Post, PUT, DELETE Brands List - Invalid Request", async ({ request }) => {
for (const method of methods) {
        const response = await request.fetch("/api/brandsList", {
            method,
            data: {
                id: 1,
                brand: "Brand A",
            },
        });

        const responseBody = await response.json();
        expect(response.status()).toBe(200);

        const schema = z.object({
            responseCode: z.literal(405),
            message: z.literal("This request method is not supported."),
        });

        expect(() => {
            schema.parse(responseBody);
        }).not.toThrow();
    }
});

test("POST To Search Product - Valid Request", async ({ request }) => {
    const response = await request.post("/api/searchProduct", {
       multipart: {
            'search_product': 'tshirt'
        },
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);

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
    }).not.toThrow();
});

test("POST To Search Product - Invalid Request", async ({ request }) => {
    const response = await request.post("/api/searchProduct", {
       multipart: {
        },
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);

    const schema = z.object({
        responseCode: z.literal(400),
        message: z.literal("Bad request, search_product parameter is missing in POST request."),
    });

    expect(() => {
        schema.parse(responseBody);
    }).not.toThrow();
});

test("PUT To Search Product - Invalid Request", async ({ request }) => {
    const response = await request.put("/api/searchProduct", {
       multipart: {
            'search_product': 'tshirt'
        },
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);

    const schema = z.object({
        responseCode: z.literal(405),
        message: z.literal("This request method is not supported."),
    });

    expect(() => {
        schema.parse(responseBody);
    }).not.toThrow();
});

test("Creating account and deleting it - Valid Request", async ({ request }) => {
    const account = new Account(request,"Admin","123admin123@gmail.com","123admin","Mr","","","","Admin","Admin","AdminCompany","Admin 123","2Admin 123","UK","1234","AB","Taxes","+1234");
    await account.CreateAccount();

    await account.getUserDetails();

    await account.deleteUser();
});