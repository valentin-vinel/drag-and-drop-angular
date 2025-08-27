import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./app/routes/router.js";

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
	origin: [
		`http://localhost:4200`,
	],
	methods: ["GET", "POST", "PATCH", "DELETE"],
	credentials: true // autorisation des credentials reçu par le front
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
	res.send("drag and drop api");
});

app.use(router);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});