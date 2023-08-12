import request from "supertest"
import app from "../app.js"


import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config()

const { DB_HOST, PORT } = process.env;

let server;

beforeAll(() => {
	mongoose.connect(DB_HOST)
		.then(() => {
			server = app.listen(PORT, () => {
				console.log(`Database connection successful`)
			})
		}
		).catch((error) => {
			console.log(error.message);
			process.exit(1)
		});
});

afterAll(() => {
	server.close();
})

test('should first', async () => {
	const res = await request(app).post("/users/login").send({
		"password": "Uekrjdcmrbq-22",
		"email": "one@mail.com"
	})
	expect(res.body).toHaveProperty("token");
	expect(res.body.user).toHaveProperty("email");
	expect(res.body.user).toHaveProperty("subscription");
	expect(typeof res.body.user.email).toBe("string");
	expect(typeof res.body.user.subscription).toBe("string");
	expect(res.status).toBe(200);
})