import { test, expect, APIRequestContext } from '@playwright/test';
import { z } from 'zod';

export class Account {
    readonly request: APIRequestContext;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly title: string;
    readonly birthdate: string;
    readonly birthMonth: string;
    readonly birthYear: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly company: string;
    readonly address1: string;
    readonly address2: string;
    readonly country: string;
    readonly zipcode: string;
    readonly state: string;
    readonly city: string;
    readonly phone: string;

    constructor(request: APIRequestContext,name, email, password, title, birthdate, birthMonth, birthYear, firstName, lastName, company, address1, address2, country, zipcode, state, city, phone) {
        this.request = request;
        this.name = name;
        this.email = email;
        this.password = password;
        this.title = title;
        this.birthdate = birthdate;
        this.birthMonth = birthMonth;
        this.birthYear = birthYear;
        this.firstName = firstName;
        this.lastName = lastName;
        this.company = company;
        this.address1 = address1;
        this.address2 = address2;
        this.country = country;
        this.zipcode = zipcode;
        this.state = state;
        this.city = city;
        this.phone = phone;
    }

  async CreateAccount() {
    const response = await this.request.post("/api/createAccount",{
            multipart:{
                "name": this.name,
                "email": this.email,
                "password": this.password,
                "title": this.title,
                "birth_date": this.birthdate,
                "birth_month": this.birthMonth,
                "birth_year": this.birthYear,
                "firstname": this.firstName,
                "lastname": this.lastName,
                "company": this.company,
                "address1": this.address1,
                "address2": this.address2,
                "country": this.country,
                "state": this.state,
                "city": this.city,
                "zipcode": this.zipcode,
                "mobile_number": this.phone
            }
        })
        const responseBody = await response.json();
        expect(response.status()).toBe(200);

        const schemaCreate = z.object({
                responseCode: z.literal(201),
                message: z.literal("User created!"),
            });

        const schemaExists = z.object({
            responseCode: z.literal(400),
            message: z.literal('Email already exists!'),
        });

        if(responseBody.responseCode === 201) {
            expect(() => {
                schemaCreate.parse(responseBody);
            }).not.toThrow();
        }
        else if(responseBody.responseCode === 400) {
            expect(() => {
                schemaExists.parse(responseBody);
            }).not.toThrow();
        }
  }
  
  async getUserDetails() {
    const response = await this.request.get("/api/getUserDetailByEmail?email="+this.email);
    const responseBody = await response.json();
    expect(response.status()).toBe(200);

    const schema = z.object({
        responseCode: z.literal(200),
        user: z.object({
            id: z.number().int(),
            name: z.string(),
            email: z.string(),
            title: z.string(),
            birth_date: z.string().optional(),
            birth_month: z.string().optional(),
            birth_year: z.string().optional(),
            first_name: z.string(),
            last_name: z.string(),
            company: z.string(),
            address1: z.string(),
            address2: z.string(),
            country: z.string(),
            state: z.string(),
            city: z.string(),
            zipcode: z.string(),
        }),
    });

    expect(() => {
        schema.parse(responseBody);
    }).not.toThrow();

    expect(responseBody.user.name).toBe(this.name);
    expect(responseBody.user.email).toBe(this.email);
    expect(responseBody.user.title).toBe(this.title);
    expect(responseBody.user.birth_month).toBe(this.birthMonth);
    expect(responseBody.user.birth_year).toBe(this.birthYear);
    expect(responseBody.user.first_name).toBe(this.firstName);
    expect(responseBody.user.last_name).toBe(this.lastName);
    expect(responseBody.user.company).toBe(this.company);
    expect(responseBody.user.address1).toBe(this.address1);
    expect(responseBody.user.address2).toBe(this.address2);
    expect(responseBody.user.country).toBe(this.country);
    expect(responseBody.user.state).toBe(this.state);
    expect(responseBody.user.city).toBe(this.city);
    expect(responseBody.user.zipcode).toBe(this.zipcode);

    return responseBody;
  }

  async deleteUser() {
    const response = await this.request.delete("/api/deleteAccount",{
        multipart: {
            "email": this.email,
            "password": this.password
        }
    })
    const responseBody = await response.json();
    expect(response.status()).toBe(200);

    const schema = z.object({
        responseCode: z.literal(200),
        message: z.literal("Account deleted!"),
    });

    expect(() => {
        schema.parse(responseBody);
    }).not.toThrow();
  }
}