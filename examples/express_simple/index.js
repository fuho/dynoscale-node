import app from "./app.js";

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`express_simple running and listening on port ${PORT}`);
});
