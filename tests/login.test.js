import request from "supertest"
import app from "../app.js"

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